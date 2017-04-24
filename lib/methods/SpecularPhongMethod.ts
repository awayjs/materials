import {SpecularBasicMethod} from "./SpecularBasicMethod";

/**
 * SpecularPhongMethod provides a specular method that provides Phong highlights.
 */
export class SpecularPhongMethod extends SpecularBasicMethod
{
	public static assetType:string = "[asset SpecularPhongMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return SpecularPhongMethod.assetType;
	}

	/**
	 * Creates a new SpecularPhongMethod object.
	 */
	constructor()
	{
		super();
	}
}