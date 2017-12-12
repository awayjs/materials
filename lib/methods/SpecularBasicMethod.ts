import {AssetEvent} from "@awayjs/core";

import {TextureBase} from "../textures/TextureBase";

import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * SpecularBasicMethod provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
 * version of Phong specularity).
 */
export class SpecularBasicMethod extends ShadingMethodBase
{
	private _texture:TextureBase;

	private _gloss:number = 50;
	private _strength:number = 1;
	private _color:number = 0xffffff;

	public static assetType:string = "[asset SpecularBasicMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return SpecularBasicMethod.assetType;
	}

	/**
	 * The glossiness of the material (sharpness of the specular highlight).
	 */
	public get gloss():number
	{
		return this._gloss;
	}

	public set gloss(value:number)
	{
		if (this._gloss == value)
			return;

		this._gloss = value;

		this.invalidate();
	}

	/**
	 * The overall strength of the specular highlights.
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
	 * The colour of the specular reflection of the surface.
	 */
	public get color():number
	{
		return this._color;
	}

	public set color(value:number)
	{
		if (this._color == value)
			return;

		this._color = value;
		
		// specular is now either enabled or disabled
		if (this._color == 0 || value == 0)
			this.invalidateShaderProgram();
		else
			this.invalidate();
	}

	/**
	 * A texture that defines the strength of specular reflections for each texel in the red channel,
	 * and the gloss factor (sharpness) in the green channel. You can use Specular2DTexture if you want to easily set
	 * specular and gloss maps from grayscale images, but correctly authored images are preferred.
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
	 * Creates a new SpecularBasicMethod object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		this._texture = null;
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase):void
	{

		var m:any = method;
		var bsm:SpecularBasicMethod = <SpecularBasicMethod> method;

		var spec:SpecularBasicMethod = bsm;//SpecularBasicMethod(method);
		this.texture = spec.texture;
		this.strength = spec.strength;
		this.color = spec.color;
		this.gloss = spec.gloss;
	}
}