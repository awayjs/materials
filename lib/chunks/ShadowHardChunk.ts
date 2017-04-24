import {LightBase} from "@awayjs/scene";

import {Stage, ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {LightingShader} from "@awayjs/renderer";

import {ShadowHardMethod} from "../methods/ShadowHardMethod";

import {ShadowChunkBase} from "./ShadowChunkBase";

/**
 * ShadowHardChunk provides the cheapest shadow map method by using a single tap without any filtering.
 */
export class ShadowHardChunk extends ShadowChunkBase
{
	/**
	 * Creates a new ShadowHardChunk.
	 */
	constructor(method:ShadowHardMethod, shader:LightingShader)
	{
		super(method, shader);
	}

	/**
	 * @inheritDoc
	 */
	protected _getPlanarFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		regCache.getFreeFragmentConstant();

		var depthCol:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

		this._fragmentConstantsIndex = decReg.index*4;

		code += this._depthMap._iGetFragmentCode(depthCol, regCache, sharedRegisters, this._depthMapCoordReg) +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + targetReg + ".w, " + this._depthMapCoordReg + ".z, " + depthCol + ".z\n"; // 0 if in shadow

		return code;
	}

	/**
	 * @inheritDoc
	 */
	protected _getPointFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var epsReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var posReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var depthSampleCol:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(depthSampleCol, 1);
		var lightDir:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(lightDir, 1);

		this._fragmentConstantsIndex = decReg.index*4;

		code += "sub " + lightDir + ", " + sharedRegisters.globalPositionVarying + ", " + posReg + "\n" +
			"dp3 " + lightDir + ".w, " + lightDir + ".xyz, " + lightDir + ".xyz\n" +
			"mul " + lightDir + ".w, " + lightDir + ".w, " + posReg + ".w\n" +
			"nrm " + lightDir + ".xyz, " + lightDir + ".xyz\n" +

			this._depthMap._iGetFragmentCode(depthSampleCol, regCache, sharedRegisters, lightDir) +
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
	public _getCascadeFragmentCode(decodeRegister:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		return this._depthMap._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + targetRegister + ".w, " + depthProjection + ".z, " + temp + ".z\n"; // 0 if in shadow
	}

	/**
	 * @inheritDoc
	 */
	public _activateForCascade():void
	{
	}
}