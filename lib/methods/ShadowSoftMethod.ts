import {PoissonLookup} from "@awayjs/core";

import {DirectionalLight} from "../lights/DirectionalLight";

import {ShadowMethodBase} from "./ShadowMethodBase";

/**
 * ShadowSoftMethod provides a soft shadowing technique by randomly distributing sample points.
 */
export class ShadowSoftMethod extends ShadowMethodBase
{
	private _range:number;
	private _numSamples:number;
	private _offsets:Array<number>;

	public static assetType:string = "[asset ShadowSoftMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return ShadowSoftMethod.assetType;
	}

	public get offsets():Array<number>
	{
		return this._offsets;
	}

	/**
	 * The amount of samples to take for dithering. Minimum 1, maximum 32. The actual maximum may depend on the
	 * complexity of the shader.
	 */
	public get numSamples():number
	{
		return this._numSamples;
	}

	public set numSamples(value:number)
	{
		this._numSamples = value;
		
		if (this._numSamples < 1)
			this._numSamples = 1;
		else if (this._numSamples > 32)
			this._numSamples = 32;

		this._offsets = PoissonLookup.getDistribution(this._numSamples);
		
		this.invalidateShaderProgram();
	}

	/**
	 * The range in the shadow map in which to distribute the samples.
	 */
	public get range():number
	{
		return this._range;
	}

	public set range(value:number)
	{
		this._range = value;
	}

	/**
	 * Creates a new DiffuseBasicMethod object.
	 *
	 * @param castingLight The light casting the shadows
	 * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 32.
	 */
	constructor(castingLight:DirectionalLight, numSamples:number = 5, range:number = 1)
	{
		super(castingLight);

		this.numSamples = numSamples;
		this.range = range;
	}
}