import {LightBase} from "../lights/LightBase";
import {ShadowMapperBase} from "../mappers/ShadowMapperBase";

import {AmbientBasicMethod} from "./AmbientBasicMethod";

/**
 * AmbientDepthMethod provides a debug method to visualise depth maps
 */
export class AmbientDepthMethod extends AmbientBasicMethod
{
	public _castingLight:LightBase;
	public _shadowMapper:ShadowMapperBase;

	public static assetType:string = "[asset AmbientDepthMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return AmbientDepthMethod.assetType;
	}

	/**
	 * Creates a new AmbientDepthMethod object.
	 */
	constructor(castingLight:LightBase)
	{
		super();
		this._castingLight = castingLight;
		castingLight.shadowsEnabled = true;
		this._shadowMapper = castingLight.shadowMapper;

		this.iAddTexture(castingLight.shadowMapper.textureMap);
	}

	/**
	 * The light casting the shadows.
	 */
	public get castingLight():LightBase
	{
		return this._castingLight;
	}

}