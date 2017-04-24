import {AssetEvent} from "@awayjs/core";

import {DirectionalLight, LightBase} from "@awayjs/scene";

import {CompositeMethodBase} from "./CompositeMethodBase";
import {ShadowMethodBase} from "./ShadowMethodBase";
import {ShadowHardMethod} from "./ShadowHardMethod";

/**
 * ShadowCompositeMethod is a shadow map method to apply cascade shadow mapping on materials.
 * Must be used with a DirectionalLight with a CascadeShadowMapper assigned to its shadowMapper property.
 *
 * @see away.lights.CascadeShadowMapper
 */
export class ShadowCompositeMethod extends CompositeMethodBase
{

	/**
	 * The light casting the shadows.
	 */
	public get castingLight():LightBase
	{
		return (<ShadowMethodBase> this._baseMethod).castingLight;
	}

	/**
	 * 
	 */
	public get alpha():number
	{
		return (<ShadowMethodBase> this._baseMethod).alpha;
	}

	public set alpha(value:number)
	{
		(<ShadowMethodBase> this._baseMethod).alpha = value;
	}
	
	/**
	 * 
	 */
	public get epsilon():number
	{
		return (<ShadowMethodBase> this._baseMethod).epsilon;
	}

	public set epsilon(value:number)
	{
		(<ShadowMethodBase> this._baseMethod).epsilon = value;
	}

	/**
	 * Creates a new ShadowCompositeMethod object.
	 *
	 * @param shadowMethodBase The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
	 */
	constructor(baseMethod:ShadowMethodBase)
	{
		super(baseMethod);

		if (!(baseMethod.castingLight instanceof DirectionalLight))
			throw new Error("ShadowCompositeMethod is only compatible with DirectionalLight");

		baseMethod.castingLight.shadowMapper.addEventListener(AssetEvent.INVALIDATE, (event:AssetEvent) => this.onShadowMapperInvalidate(event));
	}

	protected createBaseMethod():ShadowMethodBase
	{
		return new ShadowHardMethod(new DirectionalLight());
	}

	/**
	 * Called when the shadow mappers cascade configuration changes.
	 */
	private onShadowMapperInvalidate(event:AssetEvent):void
	{
		this.invalidateShaderProgram();
	}
}