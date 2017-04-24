import {TextureBase} from "@awayjs/graphics";

import {DiffuseBasicMethod} from "./DiffuseBasicMethod";

/**
 * DiffuseGradientMethod is an alternative to DiffuseBasicMethod in which the shading can be modulated with a gradient
 * to introduce color-tinted shading as opposed to the single-channel diffuse strength. This can be used as a crude
 * approximation to subsurface scattering (for instance, the mid-range shading for skin can be tinted red to similate
 * scattered light within the skin attributing to the final colour)
 */
export class DiffuseGradientMethod extends DiffuseBasicMethod
{
	private _gradient:TextureBase;

	public static assetType:string = "[asset DiffuseGradientMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return DiffuseGradientMethod.assetType;
	}

	/**
	 * A texture that contains the light colour based on the angle. This can be used to change the light colour
	 * due to subsurface scattering when the surface faces away from the light.
	 */
	public get gradient():TextureBase
	{
		return this._gradient;
	}

	public set gradient(value:TextureBase)
	{
		if (this._gradient == value)
			return;

		if (this._gradient)
			this.iRemoveTexture(this._gradient);

		this._gradient = value;

		if (this._gradient)
			this.iAddTexture(this._gradient);

		this.invalidateShaderProgram();
	}

	/**
	 * Creates a new DiffuseGradientMethod object.
	 * @param gradient A texture that contains the light colour based on the angle. This can be used to change
	 * the light colour due to subsurface scattering when the surface faces away from the light.
	 */
	constructor(gradient:TextureBase)
	{
		super();

		this._gradient = gradient;

		this.iAddTexture(this._gradient);
	}
}