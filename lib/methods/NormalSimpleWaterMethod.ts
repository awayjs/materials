import {TextureBase} from "@awayjs/graphics";

import {NormalBasicMethod} from "./NormalBasicMethod";

/**
 * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
 */
export class NormalSimpleWaterMethod extends NormalBasicMethod
{
	private _secondaryNormalMap:TextureBase;
	private _water1OffsetX:number = 0;
	private _water1OffsetY:number = 0;
	private _water2OffsetX:number = 0;
	private _water2OffsetY:number = 0;

	public static assetType:string = "[asset NormalSimpleWaterMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return NormalSimpleWaterMethod.assetType;
	}

	/**
	 * The translation of the first wave layer along the X-axis.
	 */
	public get water1OffsetX():number
	{
		return this._water1OffsetX;
	}

	public set water1OffsetX(value:number)
	{
		this._water1OffsetX = value;

		this.invalidate();
	}

	/**
	 * The translation of the first wave layer along the Y-axis.
	 */
	public get water1OffsetY():number
	{
		return this._water1OffsetY;
	}

	public set water1OffsetY(value:number)
	{
		this._water1OffsetY = value;

		this.invalidate();
	}

	/**
	 * The translation of the second wave layer along the X-axis.
	 */
	public get water2OffsetX():number
	{
		return this._water2OffsetX;
	}

	public set water2OffsetX(value:number)
	{
		this._water2OffsetX = value;

		this.invalidate();
	}

	/**
	 * The translation of the second wave layer along the Y-axis.
	 */
	public get water2OffsetY():number
	{
		return this._water2OffsetY;
	}

	public set water2OffsetY(value:number)
	{
		this._water2OffsetY = value;

		this.invalidate();
	}

	/**
	 * A second normal map that will be combined with the first to create a wave-like animation pattern.
	 */
	public get secondaryNormalMap():TextureBase
	{
		return this._secondaryNormalMap;
	}

	public set secondaryNormalMap(value:TextureBase)
	{
		if (this._secondaryNormalMap == value)
			return;

		if (this._secondaryNormalMap)
			this.iRemoveTexture(this._secondaryNormalMap);

		this._secondaryNormalMap = value;

		if (this._secondaryNormalMap)
			this.iAddTexture(this._secondaryNormalMap);

		this.invalidateShaderProgram();
	}

	/**
	 * Creates a new NormalSimpleWaterMethod object.
	 * @param waveMap1 A normal map containing one layer of a wave structure.
	 * @param waveMap2 A normal map containing a second layer of a wave structure.
	 */
	constructor(normalMap:TextureBase = null, secondaryNormalMap:TextureBase = null)
	{
		super(normalMap);

		this._secondaryNormalMap = secondaryNormalMap;

		if (this._secondaryNormalMap)
			this.iAddTexture(this._secondaryNormalMap);
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		super.dispose();

		this._secondaryNormalMap = null;
	}
}