import {ShadowMethodBase} from "./ShadowMethodBase";

/**
 * ShadowFilteredMethod provides a softened shadowing technique by bilinearly interpolating shadow comparison
 * results of neighbouring pixels.
 */
export class ShadowFilteredMethod extends ShadowMethodBase
{
	public static assetType:string = "[asset ShadowFilteredMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return ShadowFilteredMethod.assetType;
	}
}