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

import {GL_ShadowTexture2D} from "./GL_ShadowTexture2D";

ShaderBase.registerAbstraction(GL_ShadowTexture2D, ShadowTexture2D);