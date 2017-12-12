import {AssetEvent} from "@awayjs/core";

import {ProjectionBase} from "@awayjs/core";

import {Stage} from "@awayjs/stage";

import {TextureBase} from "../textures/TextureBase";

import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * AmbientBasicMethod provides the default shading method for uniform ambient lighting.
 */
export class AmbientBasicMethod extends ShadingMethodBase
{
	private _alpha:number = 1;

	public _texture:TextureBase;

	private _strength:number = 1;


	public static assetType:string = "[asset AmbientBasicMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return AmbientBasicMethod.assetType;
	}

	/**
	 * Creates a new AmbientBasicMethod object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * The strength of the ambient reflection of the surface.
	 */
	public get strength():number
	{
		return this._strength;
	}

	public set strength(value:number)
	{
		if (this._strength == value)
			return;

		this._strength = value;

		this.invalidate();
	}

	/**
	 * The alpha component of the surface.
	 */
	public get alpha():number
	{
		return this._alpha;
	}

	public set alpha(value:number)
	{
		if (this._alpha == value)
			return;

		this._alpha = value;

		this.invalidate();
	}

	/**
	 * The texture to use to define the diffuse reflection color per texel.
	 */
	public get texture():TextureBase
	{
		return this._texture;
	}

	public set texture(value:TextureBase)
	{
		if (this._texture == value)
			return;

		if (this._texture)
			this.iRemoveTexture(this._texture);

		this._texture = value;

		if (this._texture)
			this.iAddTexture(this._texture);

		this.invalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase):void
	{
		var m:any = method;
		var b:AmbientBasicMethod = <AmbientBasicMethod> m;
	}
}