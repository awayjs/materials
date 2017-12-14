import {ImageCube} from "@awayjs/stage";

import {ImageTextureCube} from "./ImageTextureCube";

export class DepthTextureCube extends ImageTextureCube
{
	public static assetType:string = "[texture DepthTextureCube]";

	/**
	 *
	 * @returns {string}
	 */
	public get assetType():string
	{
		return DepthTextureCube.assetType;
	}

	constructor(image:ImageCube = null)
	{
		super(image);
	}
}

import {AssetEvent} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, ImageSampler} from "@awayjs/stage";

import {_Shader_TextureBase, ShaderBase, _Render_RenderableBase, ChunkVO} from "@awayjs/renderer";

import {_Shader_ImageTexture} from "./ImageTextureCube";

/**
 *
 * @class away.pool._Shader_ImageTexture2D
 */
export class _Shader_DepthTexture extends _Shader_ImageTexture
{
    private _decodeReg:ShaderRegisterElement;

    private _decodeIndex:number;

    public _initVO(chunkVO:ChunkVO):void
    {
        this._decodeReg = null;
        this._decodeIndex = -1;
    }

    /**
     *
     *
     * @internal
     */
    public _initConstants():void
    {
        var fragmentData:Float32Array = this._shader.fragmentConstantData;
        var index:number = this._decodeIndex
        fragmentData[index] = 1.0;
        fragmentData[index + 1] = 1/255.0;
        fragmentData[index + 2] = 1/65025.0;
        fragmentData[index + 3] = 1/16581375.0;
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData, inputReg:ShaderRegisterElement):string
    {
        if (this._decodeIndex == -1)
            this._decodeIndex = (this._decodeReg = regCache.getFreeFragmentConstant()).index*4;

        var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

        return super._getFragmentCode(temp, regCache, sharedReg, inputReg) +
            "dp4 " + targetReg + ".w, " + temp + ", " + this._decodeReg + "\n";
    }
}

ShaderBase.registerAbstraction(_Shader_DepthTexture, DepthTextureCube);