import {ErrorBase} from "@awayjs/core";

import {ImageSampler, Image2D, ImageUtils, ImageCube} from "@awayjs/stage";

import {MappingMode} from "@awayjs/renderer";

import {Texture2D} from "./Texture2D";

export class ImageTexture2D extends Texture2D
{
	public static assetType:string = "[texture ImageTexture2D]";

	/**
	 *
	 * @returns {string}
	 */
	public get assetType():string
	{
		return ImageTexture2D.assetType;
	}

	/**
	 *
	 * @returns {ImageBase}
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
	 * @returns {ImageBase}
	 */
	public get image():Image2D
	{
		return <Image2D> this._images[0];
	}

	public set image(value:Image2D)
	{
		if (this._images[0] == value)
			return;

		if (!ImageUtils.isImage2DValid(value))
			throw new ErrorBase("Invalid imageData: Width and height must be power of 2 and cannot exceed 2048");

		this.setImageAt(value, 0);
	}

	constructor(image:Image2D = null, mappingMode:MappingMode = null)
	{
		super(mappingMode);

		this.setNumImages(1);

		this.image = image;
	}
}

import {ShaderBase} from "@awayjs/renderer";

import {GL_ImageTexture2D} from "./GL_ImageTexture2D";

ShaderBase.registerAbstraction(GL_ImageTexture2D, ImageTexture2D);