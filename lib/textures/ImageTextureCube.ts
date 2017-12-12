import {ErrorBase} from "@awayjs/core";

import {ImageSampler, ImageUtils, ImageCube} from "@awayjs/stage";

import {TextureCube} from "./TextureCube";

export class ImageTextureCube extends TextureCube
{
	public static assetType:string = "[texture ImageTextureCube]";

	/**
	 *
	 * @returns {string}
	 */
	public get assetType():string
	{
		return ImageTextureCube.assetType;
	}

	/**
	 *
	 * @returns {ImageCube}
	 */
	public get sampler():ImageSampler
	{
		return <ImageSampler> this._samplers[0];
	}

	public set sampler(value:ImageSampler)
	{
		if (this._samplers[0] == value)
			return;

		this.setSamplerAt(value, 0);
	}

	/**
	 *
	 * @returns {ImageCube}
	 */
	public get image():ImageCube
	{
		return <ImageCube> this._images[0];
	}

	public set image(value:ImageCube)
	{
		if (this._images[0] == value)
			return;

		this.setImageAt(value, 0);
	}

	constructor(image:ImageCube = null)
	{
		super();

		this.setNumImages(1);

		this.image = image;
	}
}

import {ShaderBase} from "@awayjs/renderer";

import {GL_ImageTexture} from "./GL_ImageTexture";

ShaderBase.registerAbstraction(GL_ImageTexture, ImageTextureCube);