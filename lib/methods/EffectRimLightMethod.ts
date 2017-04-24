import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * EffectRimLightMethod provides a method to add rim lighting to a material. This adds a glow-like effect to edges of objects.
 */
export class EffectRimLightMethod extends ShadingMethodBase
{
	public static ADD:string = "add";
	public static MULTIPLY:string = "multiply";
	public static MIX:string = "mix";

	private _color:number;
	private _strength:number;
	private _power:number;
	private _blendMode:string;

	public static assetType:string = "[asset EffectRimLightMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectRimLightMethod.assetType;
	}

	/**
	 * The color of the rim light.
	 */
	public get color():number /*uint*/
	{
		return this._color;
	}

	public set color(value:number /*uint*/)
	{
		if (this._power == value)
			return;

		this._color = value;
		
		this.invalidate();
	}

	/**
	 * The strength of the rim light.
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
	 * The power of the rim light. Higher values will result in a higher edge fall-off.
	 */
	public get power():number
	{
		return this._power;
	}

	public set power(value:number)
	{
		if (this._power == value)
			return;

		this._power = value;

		this.invalidate();
	}

	/**
	 * The blend mode with which to add the light to the object.
	 *
	 * EffectRimLightMethod.MULTIPLY multiplies the rim light with the material's colour.
	 * EffectRimLightMethod.ADD adds the rim light with the material's colour.
	 * EffectRimLightMethod.MIX provides normal alpha blending.
	 */
	public get blendMode():string
	{
		return this._blendMode;
	}

	public set blendMode(value:string)
	{
		if (this._blendMode == value)
			return;

		this._blendMode = value;

		this.invalidateShaderProgram();
	}

	/**
	 * Creates a new <code>EffectRimLightMethod</code> object.
	 *
	 * @param color The colour of the rim light.
	 * @param strength The strength of the rim light.
	 * @param power The power of the rim light. Higher values will result in a higher edge fall-off.
	 * @param blend The blend mode with which to add the light to the object.
	 */
	constructor(color:number = 0xffffff, strength:number = .4, power:number = 2, blend:string = "mix")
	{
		super();

		this._blendMode = blend;
		this._strength = strength;
		this._power = power;

		this._color = color;
	}
}