import DirectionalLight					= require("awayjs-display/lib/entities/DirectionalLight");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import ShaderLightingObject				= require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
import ShaderObjectBase					= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");

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
	public iInitConstants(shaderObject:ShaderLightingObject, methodVO:MethodVO)
	{
		super.iInitConstants(shaderObject, methodVO);

		var fragmentData:Array<number> = shaderObject.fragmentConstantData;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		fragmentData[index + 8] = .5;
		var size:number /*int*/ = this.castingLight.shadowMapper.depthMapSize;
		fragmentData[index + 9] = size;
		fragmentData[index + 10] = 1/size;
	}

	/**
	 * @inheritDoc
	 */
	public _pGetPlanarFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
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

		methodVO.textureObject._iInitRegisters(shaderObject, regCache);

		code += "mov " + uvReg + ", " + this._pDepthMapCoordReg + "\n" +

			methodVO.textureObject._iGetFragmentCode(shaderObject, depthCol, regCache, this._pDepthMapCoordReg) +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			"add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" + 	// (1, 0)
			methodVO.textureObject._iGetFragmentCode(shaderObject, depthCol, regCache, uvReg) +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			"mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" +
			"frc " + depthCol + ".x, " + depthCol + ".x\n" +
			"sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" +
			"mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" +
			"add " + targetReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" +

			"mov " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x\n" +
			"add " + uvReg + ".y, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".z\n" +	// (0, 1)
			methodVO.textureObject._iGetFragmentCode(shaderObject, depthCol, regCache, uvReg) +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			"add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" +	// (1, 1)
			methodVO.textureObject._iGetFragmentCode(shaderObject, depthCol, regCache, uvReg) +
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
	public iActivateForCascade(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		var size:number /*int*/ = this.castingLight.shadowMapper.depthMapSize;
		var index:number /*int*/ = methodVO.secondaryFragmentConstantsIndex;
		var data:Array<number> = shaderObject.fragmentConstantData;
		data[index] = size;
		data[index + 1] = 1/size;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetCascadeFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, decodeRegister:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string;
		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		methodVO.secondaryFragmentConstantsIndex = dataReg.index*4;

		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);
		var predicate:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(predicate, 1);

		methodVO.textureObject._iInitRegisters(shaderObject, registerCache);

		code = methodVO.textureObject._iGetFragmentCode(shaderObject, temp, registerCache, depthProjection) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + predicate + ".x, " + depthProjection + ".z, " + temp + ".z\n" +

			"add " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" +
			methodVO.textureObject._iGetFragmentCode(shaderObject, temp, registerCache, depthProjection) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + predicate + ".z, " + depthProjection + ".z, " + temp + ".z\n" +

			"add " + depthProjection + ".y, " + depthProjection + ".y, " + dataReg + ".y\n" +
			methodVO.textureObject._iGetFragmentCode(shaderObject, temp, registerCache, depthProjection) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + predicate + ".w, " + depthProjection + ".z, " + temp + ".z\n" +

			"sub " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" +
			methodVO.textureObject._iGetFragmentCode(shaderObject, temp, registerCache, depthProjection) +
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