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

import {ShaderBase} from "@awayjs/renderer";

import {GL_DepthTexture} from "./GL_DepthTexture";

ShaderBase.registerAbstraction(GL_DepthTexture, DepthTextureCube);