import {ColorTransform} from "@awayjs/core";

import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * EffectColorTransformMethod provides a shading method that changes the colour of a material analogous to a
 * ColorTransform object.
 */
export class EffectColorTransformMethod extends ShadingMethodBase
{
	private _colorTransform:ColorTransform;

	public static assetType:string = "[asset EffectColorTransformMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectColorTransformMethod.assetType;
	}

	/**
	 * The ColorTransform object to transform the colour of the material with.
	 */
	public get colorTransform():ColorTransform
	{
		return this._colorTransform;
	}

	public set colorTransform(value:ColorTransform)
	{
		this._colorTransform = value;

		this.invalidate();
	}

	/**
	 * Creates a new EffectColorTransformMethod.
	 */
	constructor(colorTransform:ColorTransform = null)
	{
		super();

		this._colorTransform = colorTransform;
	}
}