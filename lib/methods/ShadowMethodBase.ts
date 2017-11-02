import {LightBase, ShadowMapperBase} from "@awayjs/graphics";

import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * ShadowMethodBase provides an abstract base method for shadow map methods.
 */
export class ShadowMethodBase extends ShadingMethodBase
{
	protected _castingLight:LightBase;

	protected _epsilon:number = .02;
	protected _alpha:number = 1;

	/**
	 * The "transparency" of the shadows. This allows making shadows less strong.
	 */
	public get alpha():number
	{
		return this._alpha;
	}

	public set alpha(value:number)
	{
		this._alpha = value;
	}

	/**
	 * The light casting the shadows.
	 */
	public get castingLight():LightBase
	{
		return this._castingLight;
	}

	/**
	 * A small value to counter floating point precision errors when comparing values in the shadow map with the
	 * calculated depth value. Increase this if shadow banding occurs, decrease it if the shadow seems to be too detached.
	 */
	public get epsilon():number
	{
		return this._epsilon;
	}

	public set epsilon(value:number)
	{
		this._epsilon = value;
	}

	/**
	 * Creates a new ShadowMethodBase object.
	 * @param castingLight The light used to cast shadows.
	 */
	constructor(castingLight:LightBase)
	{
		super();
		castingLight.shadowsEnabled = true;

		this._castingLight = castingLight;

		this.iAddTexture(castingLight.shadowMapper.textureMap);
	}
}