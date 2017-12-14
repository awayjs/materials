import {Image2D} from "@awayjs/stage";

import {ImageTexture2D} from "./ImageTexture2D";

export class DepthTexture2D extends ImageTexture2D
{
	public static assetType:string = "[texture DepthTexture2D]";

	/**
	 *
	 * @returns {string}
	 */
	public get assetType():string
	{
		return DepthTexture2D.assetType;
	}

	constructor(image:Image2D = null)
	{
		super(image);
	}
}

import {ShaderBase} from "@awayjs/renderer";

import {_Shader_DepthTexture} from "./DepthTextureCube";

ShaderBase.registerAbstraction(_Shader_DepthTexture, DepthTexture2D);