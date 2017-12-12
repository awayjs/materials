import {ImageCube} from "@awayjs/stage";

import {PointLight} from "../lights/PointLight";
import {ShadowMapperBase} from "../mappers/ShadowMapperBase";

import {ImageTextureCube} from "./ImageTextureCube";

export class ShadowTextureCube extends ImageTextureCube
{
	public static assetType:string = "[texture ShadowTextureCube]";

	private _mapper:ShadowMapperBase
	/**
	 *
	 * @returns {string}
	 */
	public get assetType():string
	{
		return ShadowTextureCube.assetType;
	}

	public get mapper():ShadowMapperBase
	{
		return this._mapper;
	}

	constructor(mapper:ShadowMapperBase, image:ImageCube = null)
	{
		super(image);

        this._mapper = mapper;
	}
}

import {ShaderBase} from "@awayjs/renderer";

import {GL_ShadowTextureCube} from "./GL_ShadowTextureCube";

ShaderBase.registerAbstraction(GL_ShadowTextureCube, ShadowTextureCube);