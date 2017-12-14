import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

import {AmbientDepthMethod} from "../methods/AmbientDepthMethod";

import {AmbientBasicChunk} from "./AmbientBasicChunk";

/**
 * AmbientDepthChunk provides a debug method to visualise depth maps
 */
export class AmbientDepthChunk extends AmbientBasicChunk
{
	private _decRegIndex:number;
	private _shadowTexture:_Shader_TextureBase

	/**
	 * Creates a new AmbientBasicChunk object.
	 */
	constructor(method:AmbientDepthMethod, shader:ShaderBase)
	{
		super(method, shader);

		this._shadowTexture = <_Shader_TextureBase> shader.getAbstraction(method.castingLight.shadowMapper.textureMap);
	}

    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        this._shadowTexture._initVO(chunkVO);
    }

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
        this._shadowTexture._initConstants();

		var data:Float32Array = this._shader.fragmentConstantData;
		var index:number = this._decRegIndex;
		data[index] = 1.0;
		data[index + 1] = 1/255.0;
		data[index + 2] = 1/65025.0;
		data[index + 3] = 1/16581375.0;
	}

	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var decReg:ShaderRegisterElement;

		var decReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		this._decRegIndex = decReg.index*4;

		code += this._shadowTexture._getFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
			"dp4 " + targetReg + ".x, " + targetReg + ", " + decReg + "\n" +
			"mov " + targetReg + ".yz, " + targetReg + ".xx			\n" +
			"mov " + targetReg + ".w, " + decReg + ".x\n" +
			"sub " + targetReg + ".xyz, " + decReg + ".xxx, " + targetReg + ".xyz\n";

		return code;
	}
}