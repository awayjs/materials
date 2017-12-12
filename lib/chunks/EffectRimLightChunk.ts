import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase, ChunkVO} from "@awayjs/renderer";

import {EffectRimLightMethod} from "../methods/EffectRimLightMethod";

import {ShaderChunkBase} from "./ShaderChunkBase";

/**
 * EffectRimLightChunk provides a method to add rim lighting to a material. This adds a glow-like effect to edges of objects.
 */
export class EffectRimLightChunk extends ShaderChunkBase
{
	private _method:EffectRimLightMethod;
	private _shader:ShaderBase;

	private _rimColorIndex:number;

	/**
	 * Creates a new EffectEnvMapChunk.
	 */
	constructor(method:EffectRimLightMethod, shader:ShaderBase)
	{
		super(method, shader);

		this._method = method;
		this._shader = shader;
	}

	/**
	 * @inheritDoc
	 */
	public _initVO(chunkVO:ChunkVO):void
	{
		chunkVO.needsNormals = true;
		chunkVO.needsView = true;
	}


	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		if (this._invalid) {
			var index:number = this._rimColorIndex;
			var data:Float32Array = this._shader.fragmentConstantData;
			var color:number = this._method.color;

			data[index] = ((color >> 16) & 0xff)/0xff;
			data[index + 1] = ((color >> 8) & 0xff)/0xff;
			data[index + 2] = (color & 0xff)/0xff;
			data[index + 3] = 1;

			data[index + 4] = this._method.strength;
			data[index + 5] = this._method.power;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var dataRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataRegister2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		var code:string = "";

		this._rimColorIndex = dataRegister.index*4;

		code += "dp3 " + temp + ".x, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
			"sat " + temp + ".x, " + temp + ".x\n" +
			"sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" +
			"pow " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".y\n" +
			"mul " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".x\n" +
			"sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" +
			"mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".x\n" +
			"sub " + temp + ".w, " + dataRegister + ".w, " + temp + ".x\n";

		if (this._method.blendMode == EffectRimLightMethod.ADD) {
			code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" +
				"add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
		} else if (this._method.blendMode == EffectRimLightMethod.MULTIPLY) {
			code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" +
				"mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
		} else {
			code += "sub " + temp + ".xyz, " + dataRegister + ".xyz, " + targetReg + ".xyz\n" +
				"mul " + temp + ".xyz, " + temp + ".xyz, " + temp + ".w\n" +
				"add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
		}

		return code;
	}
}