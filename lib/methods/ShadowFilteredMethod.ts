import DirectionalLight					= require("awayjs-display/lib/entities/DirectionalLight");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import LightingShader					= require("awayjs-renderergl/lib/shaders/LightingShader");
import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import ShadowMethodBase					= require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");

/**
 * ShadowFilteredMethod provides a softened shadowing technique by bilinearly interpolating shadow comparison
 * results of neighbouring pixels.
 */
class ShadowFilteredMethod extends ShadowMethodBase
{
	/**
	 * Creates a new DiffuseBasicMethod object.
	 *
	 * @param castingLight The light casting the shadow
	 */
	constructor(castingLight:DirectionalLight)
	{
		super(castingLight);
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:LightingShader, methodVO:MethodVO)
	{
		super.iInitConstants(shader, methodVO);

		var fragmentData:Float32Array = shader.fragmentConstantData;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		fragmentData[index + 8] = .5;
		var size:number /*int*/ = this.castingLight.shadowMapper.depthMapSize;
		fragmentData[index + 9] = size;
		fragmentData[index + 10] = 1/size;
	}

	/**
	 * @inheritDoc
	 */
	public _pGetPlanarFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		regCache.getFreeFragmentConstant();
		var customDataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

		methodVO.fragmentConstantsIndex = decReg.index*4;

		var depthCol:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(depthCol, 1);
		var uvReg:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(uvReg, 1);

		code += "mov " + uvReg + ", " + this._pDepthMapCoordReg + "\n" +

			methodVO.textureVO._iGetFragmentCode(depthCol, regCache, sharedRegisters, this._pDepthMapCoordReg) +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			"add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" + 	// (1, 0)
			methodVO.textureVO._iGetFragmentCode(depthCol, regCache, sharedRegisters, uvReg) +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			"mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" +
			"frc " + depthCol + ".x, " + depthCol + ".x\n" +
			"sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" +
			"mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" +
			"add " + targetReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" +

			"mov " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x\n" +
			"add " + uvReg + ".y, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".z\n" +	// (0, 1)
			methodVO.textureVO._iGetFragmentCode(depthCol, regCache, sharedRegisters, uvReg) +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			"add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" +	// (1, 1)
			methodVO.textureVO._iGetFragmentCode(depthCol, regCache, sharedRegisters, uvReg) +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			// recalculate fraction, since we ran out of registers :(
			"mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" +
			"frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" +
			"mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" +
			"add " + uvReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" +

			"mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".y\n" +
			"frc " + depthCol + ".x, " + depthCol + ".x\n" +
			"sub " + uvReg + ".w, " + uvReg + ".w, " + targetReg + ".w\n" +
			"mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" +
			"add " + targetReg + ".w, " + targetReg + ".w, " + uvReg + ".w\n";

		regCache.removeFragmentTempUsage(depthCol);
		regCache.removeFragmentTempUsage(uvReg);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivateForCascade(shader:ShaderBase, methodVO:MethodVO, stage:Stage)
	{
		var size:number /*int*/ = this.castingLight.shadowMapper.depthMapSize;
		var index:number /*int*/ = methodVO.secondaryFragmentConstantsIndex;
		var data:Float32Array = shader.fragmentConstantData;
		data[index] = size;
		data[index + 1] = 1/size;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetCascadeFragmentCode(shader:ShaderBase, methodVO:MethodVO, decodeRegister:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string;
		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		methodVO.secondaryFragmentConstantsIndex = dataReg.index*4;

		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);
		var predicate:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(predicate, 1);

		code = methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + predicate + ".x, " + depthProjection + ".z, " + temp + ".z\n" +

			"add " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" +
			methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + predicate + ".z, " + depthProjection + ".z, " + temp + ".z\n" +

			"add " + depthProjection + ".y, " + depthProjection + ".y, " + dataReg + ".y\n" +
			methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + predicate + ".w, " + depthProjection + ".z, " + temp + ".z\n" +

			"sub " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" +
			methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + predicate + ".y, " + depthProjection + ".z, " + temp + ".z\n" +

			"mul " + temp + ".xy, " + depthProjection + ".xy, " + dataReg + ".x\n" +
			"frc " + temp + ".xy, " + temp + ".xy\n" +

			// some strange register juggling to prevent agal bugging out
			"sub " + depthProjection + ", " + predicate + ".xyzw, " + predicate + ".zwxy\n" +
			"mul " + depthProjection + ", " + depthProjection + ", " + temp + ".x\n" +

			"add " + predicate + ".xy, " + predicate + ".xy, " + depthProjection + ".zw\n" +

			"sub " + predicate + ".y, " + predicate + ".y, " + predicate + ".x\n" +
			"mul " + predicate + ".y, " + predicate + ".y, " + temp + ".y\n" +
			"add " + targetRegister + ".w, " + predicate + ".x, " + predicate + ".y\n";

		registerCache.removeFragmentTempUsage(temp);
		registerCache.removeFragmentTempUsage(predicate);
		return code;
	}
}

export = ShadowFilteredMethod;