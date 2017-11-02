import {NearDirectionalShadowMapper} from "@awayjs/graphics";

import {ShadowCompositeMethod} from "./ShadowCompositeMethod";
import {ShadowMethodBase} from "./ShadowMethodBase";

// TODO: shadow mappers references in materials should be an interface so that this class should NOT extend ShadowMapMethodBase just for some delegation work
/**
 * ShadowNearMethod provides a shadow map method that restricts the shadowed area near the camera to optimize
 * shadow map usage. This method needs to be used in conjunction with a NearDirectionalShadowMapper.
 *
 * @see away.lights.NearDirectionalShadowMapper
 */
export class ShadowNearMethod extends ShadowCompositeMethod
{
	private _fadeRatio:number;

	public static assetType:string = "[asset ShadowNearMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return ShadowNearMethod.assetType;
	}

	/**
	 * The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
	 */
	public get fadeRatio():number
	{
		return this._fadeRatio;
	}

	public set fadeRatio(value:number)
	{
		this._fadeRatio = value;
	}

	/**
	 * Creates a new ShadowNearMethod object.
	 * @param baseMethod The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
	 * @param fadeRatio The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
	 */
	constructor(baseMethod:ShadowMethodBase = null, fadeRatio:number = .1)
	{
		super(baseMethod);

		this._fadeRatio = fadeRatio;

		if (!(baseMethod.castingLight.shadowMapper instanceof NearDirectionalShadowMapper))
			throw new Error("ShadowNearMethod requires a light that has a NearDirectionalShadowMapper instance assigned to shadowMapper.");
	}
}