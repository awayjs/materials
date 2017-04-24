import {TextureBase} from "@awayjs/graphics";

import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * DiffuseBasicMethod provides the default shading method for Lambert (dot3) diffuse lighting.
 */
export class DiffuseBasicMethod extends ShadingMethodBase
{
	private _multiply:boolean = true;

	public _texture:TextureBase;
	private _ambientColor:number;
	private _ambientColorR:number = 1;
	private _ambientColorG:number = 1;
	private _ambientColorB:number = 1;
	private _color:number = 0xffffff;
	private _colorR:number = 1;
	private _colorG:number = 1;
	private _colorB:number = 1;

	public _pIsFirstLight:boolean;

	public static assetType:string = "[asset DiffuseBasicMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return DiffuseBasicMethod.assetType;
	}

	/**
	 * Set internally if diffuse color component multiplies or replaces the ambient color
	 */
	public get multiply():boolean
	{
		return this._multiply;
	}

	public set multiply(value:boolean)
	{
		if (this._multiply == value)
			return;

		this._multiply = value;

		this.invalidateShaderProgram();
	}

	/**
	 * The color of the diffuse reflection when not using a texture.
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
	 * Creates a new DiffuseBasicMethod object.
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
		var diff:DiffuseBasicMethod = <DiffuseBasicMethod> method;

		this.texture = diff.texture;
		this.multiply = diff.multiply;
		this.color = diff.color;
	}
}