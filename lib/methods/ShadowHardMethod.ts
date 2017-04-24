import {ShadowMethodBase} from "./ShadowMethodBase";

/**
 * ShadowHardMethod provides the cheapest shadow map method by using a single tap without any filtering.
 */
export class ShadowHardMethod extends ShadowMethodBase
{
	public static assetType:string = "[asset ShadowHardMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return ShadowHardMethod.assetType;
	}
}