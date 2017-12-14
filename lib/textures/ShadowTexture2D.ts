import {Image2D} from "@awayjs/stage";

import {ImageTexture2D} from "./ImageTexture2D";

export class ShadowTexture2D extends ImageTexture2D
{
	public static assetType:string = "[texture ShadowTexture2D]";

	/**
	 *
	 * @returns {string}
	 */
	public get assetType():string
	{
		return ShadowTexture2D.assetType;
	}

	constructor(image:Image2D = null)
	{
		super(image);
	}
}

import {ShaderBase} from "@awayjs/renderer";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {_Shader_DepthTexture} from "./DepthTextureCube";

/**
 *
 * @class away.pool._Shader_DepthTexture
 */
export class _Shader_ShadowTexture2D extends _Shader_DepthTexture
{
    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData, inputReg:ShaderRegisterElement):string
    {
        return super._getFragmentCode(targetReg, regCache, sharedRegisters, inputReg) +
            "slt " + targetReg + ".w, " + inputReg + ".z, " + targetReg + ".w\n";// 0 if in shadow, 1 if out of shadow
    }
}

ShaderBase.registerAbstraction(_Shader_ShadowTexture2D, ShadowTexture2D);