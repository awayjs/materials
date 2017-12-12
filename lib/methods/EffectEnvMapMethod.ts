import {TextureBase} from "../textures/TextureBase";

import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
 */
export class EffectEnvMapMethod extends ShadingMethodBase
{
	private _envMap:TextureBase;
	private _mask:TextureBase;
	private _alpha:number;

	public static assetType:string = "[asset EffectEnvMapMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectEnvMapMethod.assetType;
	}

	/**
	 * The cubic environment map containing the reflected scene.
	 */
	public get envMap():TextureBase
	{
		return this._envMap;
	}

	public set envMap(value:TextureBase)
	{
		if (this._envMap == value)
			return;

		if (this._envMap)
			this.iRemoveTexture(this._envMap);

		this._envMap = value;

		if (this._envMap)
			this.iAddTexture(this._envMap);

		this.invalidateShaderProgram();
	}

	/**
	 * An optional texture to modulate the reflectivity of the surface.
	 */
	public get mask():TextureBase
	{
		return this._mask;
	}

	public set mask(value:TextureBase)
	{
		if (value == this._mask)
			return;

		if (this._mask)
			this.iRemoveTexture(this._mask);

		this._mask = value;

		if (this._mask)
			this.iAddTexture(this._mask);

		this.invalidateShaderProgram();
	}

	/**
	 * The reflectivity of the surface.
	 */
	public get alpha():number
	{
		return this._alpha;
	}

	public set alpha(value:number)
	{
		this._alpha = value;

		this.invalidate();
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
	}

	/**
	 * Creates an EffectEnvMapMethod object.
	 * @param envMap The environment map containing the reflected scene.
	 * @param alpha The reflectivity of the surface.
	 */
	constructor(envMap:TextureBase, alpha:number = 1)
	{
		super();

		this._envMap = envMap;
		this._alpha = alpha;

		this.iAddTexture(this._envMap);
	}
}