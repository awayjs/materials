import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {LightingShader} from "@awayjs/renderer";

import {ShadowFilteredMethod} from "../methods/ShadowFilteredMethod";

import {ShadowChunkBase} from "./ShadowChunkBase";

/**
 * ShadowFilteredChunk provides a softened shadowing technique by bilinearly interpolating shadow comparison
 * results of neighbouring pixels.
 */
export class ShadowFilteredChunk extends ShadowChunkBase
{
	private _cascadeFragmentConstantsIndex:number;

	/**
	 * Creates a new ShadowFilteredChunk.
	 */
	constructor(method:ShadowFilteredMethod, shader:LightingShader)
	{
		super(method, shader);
	}

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
		super._initConstants();

		var fragmentData:Float32Array = this._shader.fragmentConstantData;
		var index:number = this._fragmentConstantsIndex;
		fragmentData[index + 8] = .5;
		var size:number = this._method.castingLight.shadowMapper.depthMapSize;
		fragmentData[index + 9] = size;
		fragmentData[index + 10] = 1/size;
	}

	/**
	 * @inheritDoc
	 */
	public _getPlanarFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		regCache.getFreeFragmentConstant();
		var customDataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

		this._fragmentConstantsIndex = decReg.index*4;

		var depthCol:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(depthCol, 1);
		var uvReg:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(uvReg, 1);

		code += "mov " + uvReg + ", " + this._depthMapCoordReg + "\n" +

			this._depthMap._iGetFragmentCode(depthCol, regCache, sharedRegisters, this._depthMapCoordReg) +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + uvReg + ".z, " + this._depthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			"add " + uvReg + ".x, " + this._depthMapCoordReg + ".x, " + customDataReg + ".z\n" + 	// (1, 0)
			this._depthMap._iGetFragmentCode(depthCol, regCache, sharedRegisters, uvReg) +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + uvReg + ".w, " + this._depthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			"mul " + depthCol + ".x, " + this._depthMapCoordReg + ".x, " + customDataReg + ".y\n" +
			"frc " + depthCol + ".x, " + depthCol + ".x\n" +
			"sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" +
			"mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" +
			"add " + targetReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" +

			"mov " + uvReg + ".x, " + this._depthMapCoordReg + ".x\n" +
			"add " + uvReg + ".y, " + this._depthMapCoordReg + ".y, " + customDataReg + ".z\n" +	// (0, 1)
			this._depthMap._iGetFragmentCode(depthCol, regCache, sharedRegisters, uvReg) +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + uvReg + ".z, " + this._depthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			"add " + uvReg + ".x, " + this._depthMapCoordReg + ".x, " + customDataReg + ".z\n" +	// (1, 1)
			this._depthMap._iGetFragmentCode(depthCol, regCache, sharedRegisters, uvReg) +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + uvReg + ".w, " + this._depthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			// recalculate fraction, since we ran out of registers :(
			"mul " + depthCol + ".x, " + this._depthMapCoordReg + ".x, " + customDataReg + ".y\n" +
			"frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" +
			"mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" +
			"add " + uvReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" +

			"mul " + depthCol + ".x, " + this._depthMapCoordReg + ".y, " + customDataReg + ".y\n" +
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
	public _activateForCascade():void
	{
		var size:number = this._method.castingLight.shadowMapper.depthMapSize;
		var index:number = this._cascadeFragmentConstantsIndex;
		var data:Float32Array = this._shader.fragmentConstantData;
		data[index] = size;
		data[index + 1] = 1/size;
	}

	/**
	 * @inheritDoc
	 */
	public _getCascadeFragmentCode(decodeRegister:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string;
		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		this._cascadeFragmentConstantsIndex = dataReg.index*4;

		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);
		var predicate:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(predicate, 1);

		code = this._depthMap._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + predicate + ".x, " + depthProjection + ".z, " + temp + ".z\n" +

			"add " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" +
			this._depthMap._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + predicate + ".z, " + depthProjection + ".z, " + temp + ".z\n" +

			"add " + depthProjection + ".y, " + depthProjection + ".y, " + dataReg + ".y\n" +
			this._depthMap._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + predicate + ".w, " + depthProjection + ".z, " + temp + ".z\n" +

			"sub " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" +
			this._depthMap._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
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