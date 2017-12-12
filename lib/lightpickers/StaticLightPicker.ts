import {AssetEvent} from "@awayjs/core";

import {LightBase} from "../lights/LightBase";
import {DirectionalLight} from "../lights/DirectionalLight";
import {LightProbe} from "../lights/LightProbe";
import {PointLight} from "../lights/PointLight";
import {LightEvent} from "../events/LightEvent";

import {LightPickerBase} from "./LightPickerBase";

/**
 * StaticLightPicker is a light picker that provides a static set of lights. The lights can be reassigned, but
 * if the configuration changes (number of directional lights, point lights, etc), a material recompilation may
 * occur.
 */
export class StaticLightPicker extends LightPickerBase
{
	private _lights:Array<any>;
	private _onCastShadowChangeDelegate:(event:LightEvent) => void;

	/**
	 * Creates a new StaticLightPicker object.
	 * @param lights The lights to be used for shading.
	 */
	constructor(lights)
	{
		super();

		this._onCastShadowChangeDelegate = (event:LightEvent) => this.onCastShadowChange(event);

		this.lights = lights;
	}

	/**
	 * The lights used for shading.
	 */
	public get lights():Array<any>
	{
		return this._lights;
	}

	public set lights(value:Array<any>)
	{
		var numPointLights:number = 0;
		var numDirectionalLights:number = 0;
		var numCastingPointLights:number = 0;
		var numCastingDirectionalLights:number = 0;
		var numLightProbes:number = 0;
		var light:LightBase;

		if (this._lights)
			this.clearListeners();

		this._lights = value;
		this._allPickedLights = value;
		this._pointLights = new Array<PointLight>();
		this._castingPointLights = new Array<PointLight>();
		this._directionalLights = new Array<DirectionalLight>();
		this._castingDirectionalLights = new Array<DirectionalLight>();
		this._lightProbes = new Array<LightProbe>();

		var len:number = value.length;

		for (var i:number = 0; i < len; ++i) {
			light = value[i];
			light.addEventListener(LightEvent.CASTS_SHADOW_CHANGE, this._onCastShadowChangeDelegate);

			if (light instanceof PointLight) {
				if (light.shadowsEnabled)
					this._castingPointLights[numCastingPointLights++] = <PointLight> light;
				else
					this._pointLights[numPointLights++] = <PointLight> light;

			} else if (light instanceof DirectionalLight) {
				if (light.shadowsEnabled)
					this._castingDirectionalLights[numCastingDirectionalLights++] = <DirectionalLight> light;
				else
					this._directionalLights[numDirectionalLights++] = <DirectionalLight> light;

			} else if (light instanceof LightProbe) {
				this._lightProbes[numLightProbes++] = <LightProbe> light;
			}
		}

		if (this._numDirectionalLights == numDirectionalLights && this._numPointLights == numPointLights && this._numLightProbes == numLightProbes && this._numCastingPointLights == numCastingPointLights && this._numCastingDirectionalLights == numCastingDirectionalLights)
			return;

		this._numDirectionalLights = numDirectionalLights;
		this._numCastingDirectionalLights = numCastingDirectionalLights;
		this._numPointLights = numPointLights;
		this._numCastingPointLights = numCastingPointLights;
		this._numLightProbes = numLightProbes;

		// MUST HAVE MULTIPLE OF 4 ELEMENTS!
		this._lightProbeWeights = new Array<number>(Math.ceil(numLightProbes/4)*4);

		// notify material lights have changed
		this.dispatchEvent(new AssetEvent(AssetEvent.INVALIDATE, this));

	}

	/**
	 * Remove configuration change listeners on the lights.
	 */
	private clearListeners():void
	{
		var len:number = this._lights.length;
		for (var i:number = 0; i < len; ++i)
			this._lights[i].removeEventListener(LightEvent.CASTS_SHADOW_CHANGE, this._onCastShadowChangeDelegate);
	}

	/**
	 * Notifies the material of a configuration change.
	 */
	private onCastShadowChange(event:LightEvent):void
	{
		// TODO: Assign to special caster collections, just append it to the lights in SinglePass
		// But keep seperated in multipass

		var light:LightBase = <LightBase> event.target;

		if (light instanceof PointLight)
			this.updatePointCasting(<PointLight> light);
		else if (light instanceof DirectionalLight)
			this.updateDirectionalCasting(<DirectionalLight> light);

		this.dispatchEvent(new AssetEvent(AssetEvent.INVALIDATE, this));
	}

	/**
	 * Called when a directional light's shadow casting configuration changes.
	 */
	private updateDirectionalCasting(light:DirectionalLight):void
	{
		var dl:DirectionalLight = <DirectionalLight> light;

		if (light.shadowsEnabled) {
			--this._numDirectionalLights;
			++this._numCastingDirectionalLights;


			this._directionalLights.splice(this._directionalLights.indexOf(dl), 1);
			this._castingDirectionalLights.push(light);

		} else {
			++this._numDirectionalLights;
			--this._numCastingDirectionalLights;

			this._castingDirectionalLights.splice(this._castingDirectionalLights.indexOf(dl), 1);
			this._directionalLights.push(light);
		}
	}

	/**
	 * Called when a point light's shadow casting configuration changes.
	 */
	private updatePointCasting(light:PointLight):void
	{
		var pl:PointLight = <PointLight> light;

		if (light.shadowsEnabled) {
			--this._numPointLights;
			++this._numCastingPointLights;
			this._pointLights.splice(this._pointLights.indexOf(pl), 1);
			this._castingPointLights.push(light);
		} else {
			++this._numPointLights;
			--this._numCastingPointLights;

			this._castingPointLights.splice(this._castingPointLights.indexOf(pl), 1);
			this._pointLights.push(light);
		}
	}
}