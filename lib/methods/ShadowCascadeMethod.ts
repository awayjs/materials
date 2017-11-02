import {AssetEvent} from "@awayjs/core";

import {DirectionalLight, CascadeShadowMapper} from "@awayjs/graphics";

import {ShadowCompositeMethod} from "./ShadowCompositeMethod";
import {ShadowMethodBase} from "./ShadowMethodBase";
import {ShadowHardMethod} from "./ShadowHardMethod";

/**
 * ShadowCascadeMethod is a shadow map method to apply cascade shadow mapping on materials.
 * Must be used with a DirectionalLight with a CascadeShadowMapper assigned to its shadowMapper property.
 *
 * @see away.lights.CascadeShadowMapper
 */
export class ShadowCascadeMethod extends ShadowCompositeMethod
{
	public static assetType:string = "[asset ShadowCascadeMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return ShadowCascadeMethod.assetType;
	}

	public get cascadeShadowMapper():CascadeShadowMapper
	{
		return <CascadeShadowMapper> (<ShadowMethodBase> this._baseMethod).castingLight.shadowMapper;
	}

	/**
	 * Creates a new ShadowCascadeMethod object.
	 *
	 * @param shadowMethodBase The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
	 */
	constructor(baseMethod:ShadowMethodBase)
	{
		super(baseMethod);

		if (!(baseMethod.castingLight.shadowMapper instanceof CascadeShadowMapper))
			throw new Error("ShadowCascadeMethod requires a light that has a CascadeShadowMapper instance assigned to shadowMapper.");
	}
}