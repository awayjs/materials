import {TextureBase} from "@awayjs/graphics";

import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * NormalBasicMethod is the default method for standard tangent-space normal mapping.
 */
export class NormalBasicMethod extends ShadingMethodBase
{
	private _texture:TextureBase;

	public static assetType:string = "[asset NormalBasicMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return NormalBasicMethod.assetType;
	}

	/**
	 * A texture to modulate the direction of the surface for each texel (normal map). The default normal method expects
	 * tangent-space normal maps, but others could expect object-space maps.
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
	 * Creates a new NormalBasicMethod object.
	 */
	constructor(texture:TextureBase = null)
	{
		super();

		this._texture = texture;

		if (this._texture)
			this.iAddTexture(this._texture);
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase):void
	{
		var s:any = method;
		var bnm:NormalBasicMethod = <NormalBasicMethod> method;

		if (bnm.texture != null)
			this.texture = bnm.texture;
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		if (this._texture)
			this._texture = null;
	}
}