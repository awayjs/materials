import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * EffectColorMatrixMethod provides a shading method that changes the colour of a material analogous to a ColorMatrixFilter.
 */
export class EffectColorMatrixMethod extends ShadingMethodBase
{
	private _matrix:Array<number>;


	public static assetType:string = "[asset EffectColorMatrixMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectColorMatrixMethod.assetType;
	}

	/**
	 * The 4 x 5 matrix to transform the color of the material.
	 */
	public get matrix():Array<number>
	{
		return this._matrix;
	}

	public set matrix(value:Array<number>)
	{
		if (value.length != 20)
			throw new Error("Matrix length must be 20!");

		this._matrix = value;

		this.invalidate();
	}

	/**
	 * Creates a new EffectColorTransformMethod.
	 *
	 * @param matrix An array of 20 items for 4 x 5 color transform.
	 */
	constructor(matrix:Array<number>)
	{
		super();

		if (matrix.length != 20)
			throw new Error("Matrix length must be 20!");

		this._matrix = matrix;
	}
}