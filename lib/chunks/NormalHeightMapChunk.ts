import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, Image2D} from "@awayjs/stage";

import {ShaderBase} from "@awayjs/renderer";

import {NormalHeightMapMethod} from "../methods/NormalHeightMapMethod";
import {ImageTexture2D} from "../textures/ImageTexture2D";

import {NormalBasicChunk} from "./NormalBasicChunk";

/**
 * NormalHeightMapChunk provides a normal map method that uses a height map to calculate the normals.
 */
export class NormalHeightMapChunk extends NormalBasicChunk
{
	private _fragmentConstantsIndex:number;
	
	/**
	 * Creates a new NormalHeightMapChunk.
	 */
	constructor(method:NormalHeightMapMethod, shader:ShaderBase)
	{
		super(method, shader);
	}

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
		super._initConstants();

		var index:number = this._fragmentConstantsIndex;
		var data:Float32Array = this._shader.fragmentConstantData;
		var image:Image2D = <Image2D> (<ImageTexture2D> this._method.texture).image;

		data[index] = 1/image.width;
		data[index + 1] = 1/image.height;
		data[index + 2] = 0;
		data[index + 3] = 1;
		data[index + 4] = (<NormalHeightMapMethod> this._method).worldXYRatio;
		data[index + 5] = (<NormalHeightMapMethod> this._method).worldXZRatio;
	}

	/**
	 * @inheritDoc
	 */
	public get tangentSpace():boolean
	{
		return false;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);

		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataReg2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

		this._fragmentConstantsIndex = dataReg.index*4;

		code+= this._texture._getFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying) +

			"add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".xzzz\n" +

		this._texture._getFragmentCode(temp, registerCache, sharedRegisters, temp) +

			"sub " + targetReg + ".x, " + targetReg + ".x, " + temp + ".x\n" +
			"add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".zyzz\n" +

		this._texture._getFragmentCode(temp, registerCache, sharedRegisters, temp) +

			"sub " + targetReg + ".z, " + targetReg + ".z, " + temp + ".x\n" +
			"mov " + targetReg + ".y, " + dataReg + ".w\n" +
			"mul " + targetReg + ".xz, " + targetReg + ".xz, " + dataReg2 + ".xy\n" +
			"nrm " + targetReg + ".xyz, " + targetReg + ".xyz\n";

		registerCache.removeFragmentTempUsage(temp);

		return code;
	}
}