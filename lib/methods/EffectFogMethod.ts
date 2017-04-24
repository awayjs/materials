import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * EffectFogMethod provides a method to add distance-based fog to a material.
 */
export class EffectFogMethod extends ShadingMethodBase
{
	private _minDistance:number;
	private _maxDistance:number;
	private _fogColor:number;

	public static assetType:string = "[asset EffectFogMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectFogMethod.assetType;
	}

	/**
	 * The distance from which the fog starts appearing.
	 */
	public get minDistance():number
	{
		return this._minDistance;
	}

	public set minDistance(value:number)
	{
		this._minDistance = value;

		this.invalidate();
	}

	/**
	 * The distance at which the fog is densest.
	 */
	public get maxDistance():number
	{
		return this._maxDistance;
	}

	public set maxDistance(value:number)
	{
		this._maxDistance = value;

		this.invalidate();
	}

	/**
	 * The colour of the fog.
	 */
	public get fogColor():number
	{
		return this._fogColor;
	}

	public set fogColor(value:number)
	{
		this._fogColor = value;

		this.invalidate();
	}

	/**
	 * Creates a new EffectFogMethod object.
	 * @param minDistance The distance from which the fog starts appearing.
	 * @param maxDistance The distance at which the fog is densest.
	 * @param fogColor The colour of the fog.
	 */
	constructor(minDistance:number = 0, maxDistance:number = 1000, fogColor:number = 0x808080)
	{
		super();
		this._minDistance = minDistance;
		this._maxDistance = maxDistance;
		this._fogColor = fogColor;
	}
}