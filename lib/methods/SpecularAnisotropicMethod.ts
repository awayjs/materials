import {SpecularBasicMethod} from "./SpecularBasicMethod";

/**
 * SpecularAnisotropicMethod provides a specular method resulting in anisotropic highlights. These are typical for
 * surfaces with microfacet details such as tiny grooves. In particular, this uses the Heidrich-Seidel distrubution.
 * The tangent vectors are used as the surface groove directions.
 */
export class SpecularAnisotropicMethod extends SpecularBasicMethod
{
	public static assetType:string = "[asset SpecularAnisotropicMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return SpecularAnisotropicMethod.assetType;
	}

	/**
	 * Creates a new SpecularAnisotropicMethod object.
	 */
	constructor()
	{
		super();
	}
}