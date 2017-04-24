import {TextureBase} from "@awayjs/graphics";

import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * EffectAlphaMaskMethod allows the use of an additional texture to specify the alpha value of the material. When used
 * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
 * etc).
 */
export class EffectAlphaMaskMethod extends ShadingMethodBase
{
	private _texture:TextureBase;
	private _useSecondaryUV:boolean;

	public static assetType:string = "[asset EffectAlphaMaskMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectAlphaMaskMethod.assetType;
	}

	/**
	 * The texture to use as the alpha mask.
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
	 * Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently, for
	 * instance to tile the main texture and normal map while providing untiled alpha, for example to define the
	 * transparency over a tiled water surface.
	 */
	public get useSecondaryUV():boolean
	{
		return this._useSecondaryUV;
	}

	public set useSecondaryUV(value:boolean)
	{
		if (this._useSecondaryUV == value)
			return;

		this._useSecondaryUV = value;

		this.invalidateShaderProgram();
	}

	/**
	 * Creates a new EffectAlphaMaskMethod object.
	 *
	 * @param texture The texture to use as the alpha mask.
	 * @param useSecondaryUV Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently.
	 */
	constructor(texture:TextureBase, useSecondaryUV:boolean = false)
	{
		super();

		this._texture = texture;
		this._useSecondaryUV = useSecondaryUV;

		if (this._texture)
			this.iAddTexture(this._texture);
	}
}