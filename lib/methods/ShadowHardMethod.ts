import LightBase						= require("awayjs-display/lib/base/LightBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import ShadowMethodBase					= require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");

/**
 * ShadowHardMethod provides the cheapest shadow map method by using a single tap without any filtering.
 */
class ShadowHardMethod extends ShadowMethodBase
{
	/**
	 * Creates a new ShadowHardMethod object.
	 */
	constructor(castingLight:LightBase)
	{
		super(castingLight);
	}

	/**
	 * @inheritDoc
	 */
	public _pGetPlanarFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		regCache.getFreeFragmentConstant();

		var depthCol:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

		methodVO.fragmentConstantsIndex = decReg.index*4;

		code += methodVO.textureVO._iGetFragmentCode(shader, depthCol, regCache, sharedRegisters, this._pDepthMapCoordReg) +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + targetReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n"; // 0 if in shadow

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _pGetPointFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var epsReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var posReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var depthSampleCol:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(depthSampleCol, 1);
		var lightDir:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(lightDir, 1);

		methodVO.fragmentConstantsIndex = decReg.index*4;

		code += "sub " + lightDir + ", " + sharedRegisters.globalPositionVarying + ", " + posReg + "\n" +
			"dp3 " + lightDir + ".w, " + lightDir + ".xyz, " + lightDir + ".xyz\n" +
			"mul " + lightDir + ".w, " + lightDir + ".w, " + posReg + ".w\n" +
			"nrm " + lightDir + ".xyz, " + lightDir + ".xyz\n" +

			methodVO.textureVO._iGetFragmentCode(shader, depthSampleCol, regCache, sharedRegisters, lightDir) +
			"dp4 " + depthSampleCol + ".z, " + depthSampleCol + ", " + decReg + "\n" +
			"add " + targetReg + ".w, " + lightDir + ".w, " + epsReg + ".x\n" +    // offset by epsilon

			"slt " + targetReg + ".w, " + targetReg + ".w, " + depthSampleCol + ".z\n"; // 0 if in shadow

		regCache.removeFragmentTempUsage(lightDir);
		regCache.removeFragmentTempUsage(depthSampleCol);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetCascadeFragmentCode(shader:ShaderBase, methodVO:MethodVO, decodeRegister:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		return methodVO.textureVO._iGetFragmentCode(shader, temp, registerCache, sharedRegisters, depthProjection) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + targetRegister + ".w, " + depthProjection + ".z, " + temp + ".z\n"; // 0 if in shadow
	}

	/**
	 * @inheritDoc
	 */
	public iActivateForCascade(shader:ShaderBase, methodVO:MethodVO, stage:Stage)
	{
	}
}

export = ShadowHardMethod;