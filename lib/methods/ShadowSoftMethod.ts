import PoissonLookup					= require("awayjs-core/lib/geom/PoissonLookup");

import DirectionalLight					= require("awayjs-display/lib/entities/DirectionalLight");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import ShaderObjectBase					= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import ShadowMethodBase					= require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");

/**
 * ShadowSoftMethod provides a soft shadowing technique by randomly distributing sample points.
 */
class ShadowSoftMethod extends ShadowMethodBase
{
	private _range:number = 1;
	private _numSamples:number /*int*/;
	private _offsets:Array<number>;

	/**
	 * Creates a new DiffuseBasicMethod object.
	 *
	 * @param castingLight The light casting the shadows
	 * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 32.
	 */
	constructor(castingLight:DirectionalLight, numSamples:number /*int*/ = 5, range:number = 1)
	{
		super(castingLight);

		this.numSamples = numSamples;
		this.range = range;
	}

	/**
	 * The amount of samples to take for dithering. Minimum 1, maximum 32. The actual maximum may depend on the
	 * complexity of the shader.
	 */
	public get numSamples():number /*int*/
	{
		return this._numSamples;
	}

	public set numSamples(value:number /*int*/)
	{
		this._numSamples = value;
		
		if (this._numSamples < 1)
			this._numSamples = 1;
		else if (this._numSamples > 32)
			this._numSamples = 32;

		this._offsets = PoissonLookup.getDistribution(this._numSamples);
		
		this.iInvalidateShaderProgram();
	}

	/**
	 * The range in the shadow map in which to distribute the samples.
	 */
	public get range():number
	{
		return this._range;
	}

	public set range(value:number)
	{
		this._range = value;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		super.iInitConstants(shaderObject, methodVO);

		shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 8] = 1/this._numSamples;
		shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 9] = 0;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shaderObject, methodVO, stage);

		var texRange:number = .5*this._range/this._pCastingLight.shadowMapper.depthMapSize;
		var data:Array<number> = shaderObject.fragmentConstantData;
		var index:number /*uint*/ = methodVO.fragmentConstantsIndex + 10;
		var len:number /*uint*/ = this._numSamples << 1;

		for (var i:number /*int*/ = 0; i < len; ++i)
			data[index + i] = this._offsets[i]*texRange;
	}

	/**
	 * @inheritDoc
	 */
	public _pGetPlanarFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		// todo: move some things to super
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		regCache.getFreeFragmentConstant();
		var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

		methodVO.fragmentConstantsIndex = decReg.index*4;

		methodVO.textureObject._iInitRegisters(shaderObject, regCache);

		return this.getSampleCode(shaderObject, methodVO, decReg, targetReg, regCache, dataReg);
	}

	/**
	 * Adds the code for another tap to the shader code.
	 * @param uv The uv register for the tap.
	 * @param texture The texture register containing the depth map.
	 * @param decode The register containing the depth map decoding data.
	 * @param target The target register to add the tap comparison result.
	 * @param regCache The register cache managing the registers.
	 * @return
	 */
	private addSample(shaderObject:ShaderObjectBase, methodVO:MethodVO, decodeRegister:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, uvReg:ShaderRegisterElement):string
	{
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		return methodVO.textureObject._iGetFragmentCode(shaderObject, temp, registerCache, uvReg) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" + // 0 if in shadow
			"add " + targetRegister + ".w, " + targetRegister + ".w, " + uvReg + ".w\n";
	}

	/**
	 * @inheritDoc
	 */
	public iActivateForCascade(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shaderObject, methodVO, stage);

		var texRange:number = this._range/this._pCastingLight.shadowMapper.depthMapSize;
		var data:Array<number> = shaderObject.fragmentConstantData;
		var index:number /*uint*/ = methodVO.secondaryFragmentConstantsIndex;
		var len:number /*uint*/ = this._numSamples << 1;
		data[index] = 1/this._numSamples;
		data[index + 1] = 0;
		index += 2;

		for (var i:number /*int*/ = 0; i < len; ++i)
			data[index + i] = this._offsets[i]*texRange;

		if (len%4 == 0) {
			data[index + len] = 0;
			data[index + len + 1] = 0;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _iGetCascadeFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, decodeRegister:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._pDepthMapCoordReg = depthProjection;

		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		methodVO.secondaryFragmentConstantsIndex = dataReg.index*4;

		return this.getSampleCode(shaderObject, methodVO, decodeRegister, targetRegister, registerCache, dataReg);
	}

	/**
	 * Get the actual shader code for shadow mapping
	 * @param regCache The register cache managing the registers.
	 * @param depthTexture The texture register containing the depth map.
	 * @param decodeRegister The register containing the depth map decoding data.
	 * @param targetReg The target register to add the shadow coverage.
	 * @param dataReg The register containing additional data.
	 */
	private getSampleCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, decodeRegister:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, dataReg:ShaderRegisterElement):string
	{
		var code:string;
		var uvReg:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(uvReg, 1);

		var offsets:Array<string> = new Array<string>(dataReg + ".zw");
		var numRegs:number /*int*/ = this._numSamples >> 1;

		for (var i:number /*int*/ = 0; i < numRegs; ++i) {
			var reg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
			offsets.push(reg + ".xy");
			offsets.push(reg + ".zw");
		}

		for (i = 0; i < this._numSamples; ++i) {
			if (i == 0) {
				var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

				code = "add " + uvReg + ", " + this._pDepthMapCoordReg + ", " + dataReg + ".zwyy\n" +
					methodVO.textureObject._iGetFragmentCode(shaderObject, temp, registerCache, uvReg) +
					"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
					"slt " + targetRegister + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow;
			} else {
				code += "add " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + offsets[i] + "\n" +
					this.addSample(shaderObject, methodVO, decodeRegister, targetRegister, registerCache, uvReg);
			}
		}

		registerCache.removeFragmentTempUsage(uvReg);

		code += "mul " + targetRegister + ".w, " + targetRegister + ".w, " + dataReg + ".x\n"; // average

		return code;
	}
}

export = ShadowSoftMethod;