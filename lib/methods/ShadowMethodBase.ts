import {LightBase} from "../lights/LightBase";
import {ShadowMapperBase} from "../mappers/ShadowMapperBase";

import {CompositeMethodBase} from "./CompositeMethodBase";

/**
 * ShadowMethodBase provides an abstract base method for shadow map methods.
 */
export class ShadowMethodBase extends CompositeMethodBase
{
	protected _castingLight:LightBase;

	/**
	 * The light casting the shadows.
	 */
	public get castingLight():LightBase
	{
		return this._castingLight;
	}

	/**
	 * Creates a new ShadowMethodBase object.
	 * @param castingLight The light used to cast shadows.
	 */
	constructor(castingLight:LightBase)
	{
		super(castingLight.shadowMapper);

		this._castingLight = castingLight;
	}
}