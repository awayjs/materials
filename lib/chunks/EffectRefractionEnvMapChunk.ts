import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ChunkVO} from "@awayjs/renderer";

import {EffectRefractionEnvMapMethod} from "../methods/EffectRefractionEnvMapMethod";

import {EffectEnvMapChunk} from "./EffectEnvMapChunk";

/**
 * EffectRefractionEnvMapMethod provides a method to add refracted transparency based on cube maps.
 */
export class EffectRefractionEnvMapChunk extends EffectEnvMapChunk
{
	private _useDispersion:boolean;

	/**
	 * @inheritDoc
	 */
	public _initVO(chunkVO:ChunkVO):void
	{
		super._initVO(chunkVO);

		this._useDispersion = !((<EffectRefractionEnvMapMethod> this._method).dispersionR == (<EffectRefractionEnvMapMethod> this._method).dispersionB && (<EffectRefractionEnvMapMethod> this._method).dispersionR == (<EffectRefractionEnvMapMethod> this._method).dispersionG);
	}
	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		// todo: data2.x could use common reg, so only 1 reg is used
		var data:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var data2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var code:string = "";
		var refractionDir:ShaderRegisterElement;
		var refractionColor:ShaderRegisterElement;
		var temp:ShaderRegisterElement;

		this._fragmentIndex = data.index*4;

		refractionDir = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(refractionDir, 1);
		refractionColor = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(refractionColor, 1);
		temp = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);

		var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;
		var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;

		code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";

		code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
			"mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
			"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
			"mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" +
			"mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" +
			"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
			"sqt " + temp + ".y, " + temp + ".w\n" +

			"mul " + temp + ".x, " + data + ".x, " + temp + ".x\n" +
			"add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
			"mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +

			"mul " + refractionDir + ", " + data + ".x, " + viewDirReg + "\n" +
			"sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
			"nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" +
		this._envMap._getFragmentCode(refractionColor, registerCache, sharedRegisters, refractionDir) +
			"sub " + refractionColor + ".w, " + refractionColor + ".w, fc0.x	\n" +
			"kil " + refractionColor + ".w\n";

		if (this._useDispersion) {
			// GREEN
			code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
				"mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
				"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
				"mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" +
				"mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" +
				"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
				"sqt " + temp + ".y, " + temp + ".w\n" +

				"mul " + temp + ".x, " + data + ".y, " + temp + ".x\n" +
				"add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
				"mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +

				"mul " + refractionDir + ", " + data + ".y, " + viewDirReg + "\n" +
				"sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
				"nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" +
			this._envMap._getFragmentCode(temp, registerCache, sharedRegisters, refractionDir) +
				"mov " + refractionColor + ".y, " + temp + ".y\n";

			// BLUE
			code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
				"mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
				"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
				"mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" +
				"mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" +
				"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
				"sqt " + temp + ".y, " + temp + ".w\n" +

				"mul " + temp + ".x, " + data + ".z, " + temp + ".x\n" +
				"add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
				"mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +

				"mul " + refractionDir + ", " + data + ".z, " + viewDirReg + "\n" +
				"sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
				"nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" +
			this._envMap._getFragmentCode(temp, registerCache, sharedRegisters, refractionDir) +
				"mov " + refractionColor + ".z, " + temp + ".z\n";
		}

		code += "sub " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + targetReg + ".xyz\n" +
			"mul " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + data + ".w\n" +
			"add " + targetReg + ".xyz, " + targetReg + ".xyz, " + refractionColor + ".xyz\n";

		registerCache.removeFragmentTempUsage(temp);
		registerCache.removeFragmentTempUsage(refractionDir);
		registerCache.removeFragmentTempUsage(refractionColor);

		// restore
		code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";

		return code;
	}

	protected _updateProperties()
	{
		var index:number = this._fragmentIndex;
		var data:Float32Array = this._shader.fragmentConstantData;
		var refractionIndex:number = (<EffectRefractionEnvMapMethod> this._method).refractionIndex;
		
		data[index] = (<EffectRefractionEnvMapMethod> this._method).dispersionR + refractionIndex;

		if (this._useDispersion) {
			data[index + 1] = (<EffectRefractionEnvMapMethod> this._method).dispersionG + refractionIndex;
			data[index + 2] = (<EffectRefractionEnvMapMethod> this._method).dispersionB + refractionIndex;
		}
		data[index + 3] = this._method.alpha;
	}
}