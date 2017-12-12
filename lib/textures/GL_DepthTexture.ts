import {AssetEvent} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, GL_ImageBase, ImageSampler} from "@awayjs/stage";

import {TextureStateBase, ShaderBase, RenderStateBase, ChunkVO} from "@awayjs/renderer";

import {GL_ImageTexture} from "./GL_ImageTexture";

/**
 *
 * @class away.pool.GL_ImageTexture2D
 */
export class GL_DepthTexture extends GL_ImageTexture
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