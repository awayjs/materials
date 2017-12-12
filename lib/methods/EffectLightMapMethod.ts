import {TextureBase} from "../textures/TextureBase";

import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * EffectLightMapMethod provides a method that allows applying a light map texture to the calculated pixel colour.
 * It is different from DiffuseLightMapMethod in that the latter only modulates the diffuse shading value rather
 * than the whole pixel colour.
 */
export class EffectLightMapMethod extends ShadingMethodBase
{
	/**
	 * Indicates the light map should be multiplied with the calculated shading result.
	 */
	public static MULTIPLY:string = "multiply";

	/**
	 * Indicates the light map should be added into the calculated shading result.
	 */
	public static ADD:string = "add";

	private _lightMap:TextureBase;
	private _blendMode:string;
	private _useSecondaryUV:boolean;

	public static assetType:string = "[asset EffectLightMapMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectLightMapMethod.assetType;
	}

	/**
	 * The blend mode with which the light map should be applied to the lighting result.
	 *
	 * @see EffectLightMapMethod.ADD
	 * @see EffectLightMapMethod.MULTIPLY
	 */
	public get blendMode():string
	{
		return this._blendMode;
	}

	public set blendMode(value:string)
	{
		if (this._blendMode == value)
			return;

		if (value != EffectLightMapMethod.ADD && value != EffectLightMapMethod.MULTIPLY)
			throw new Error("Unknown blendmode!");

		this._blendMode = value;

		this.invalidateShaderProgram();
	}

	/**
	 * The lightMap containing the light map.
	 */
	public get lightMap():TextureBase
	{
		return this._lightMap;
	}

	public set lightMap(value:TextureBase)
	{
		if (this._lightMap == value)
			return;

		if (this._lightMap)
			this.iRemoveTexture(this._lightMap);

		this._lightMap = value;

		if (this._lightMap)
			this.iAddTexture(this._lightMap);

		this.invalidateShaderProgram();
	}

	/**
	 * Indicates whether the secondary UV set should be used to map the light map.
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
	 * Creates a new EffectLightMapMethod object.
	 *
	 * @param lightMap The texture containing the light map.
	 * @param blendMode The blend mode with which the light map should be applied to the lighting result.
	 * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
	 */
	constructor(lightMap:TextureBase, blendMode:string = "multiply", useSecondaryUV:boolean = false)
	{
		super();

		if (blendMode != EffectLightMapMethod.ADD && blendMode != EffectLightMapMethod.MULTIPLY)
			throw new Error("Unknown blendmode!");

		this._lightMap = lightMap;
		this._blendMode = blendMode;
		this._useSecondaryUV = useSecondaryUV;

		if (this._lightMap)
			this.iAddTexture(this._lightMap);
	}
}