import {Vector3D, AssetBase} from "@awayjs/core";

import {IRenderEntity} from "@awayjs/renderer";

import {LightBase} from "../lights/LightBase";
import {DirectionalLight} from "../lights/DirectionalLight";
import {LightProbe} from "../lights/LightProbe";
import {PointLight} from "../lights/PointLight";

/**
 * LightPickerBase provides an abstract base clase for light picker classes. These classes are responsible for
 * feeding materials with relevant lights. Usually, StaticLightPicker can be used, but LightPickerBase can be
 * extended to provide more application-specific dynamic selection of lights.
 *
 * @see StaticLightPicker
 */
export class LightPickerBase extends AssetBase
{
	public static assetType:string = "[asset LightPicker]";

	protected _numPointLights:number = 0;
	protected _numDirectionalLights:number = 0;
	protected _numCastingPointLights:number = 0;
	protected _numCastingDirectionalLights:number = 0;
	protected _numLightProbes:number = 0;

	protected _allPickedLights:Array<LightBase>;
	protected _pointLights:Array<PointLight>;
	protected _castingPointLights:Array<PointLight>;
	protected _directionalLights:Array<DirectionalLight>;
	protected _castingDirectionalLights:Array<DirectionalLight>;
	protected _lightProbes:Array<LightProbe>;
	protected _lightProbeWeights:Array<number>;

	/**
	 * Creates a new LightPickerBase object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * Disposes resources used by the light picker.
	 */
	public dispose():void
	{
	}

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return LightPickerBase.assetType;
	}

	/**
	 * The maximum amount of directional lights that will be provided.
	 */
	public get numDirectionalLights():number
	{
		return this._numDirectionalLights;
	}

	/**
	 * The maximum amount of point lights that will be provided.
	 */
	public get numPointLights():number
	{
		return this._numPointLights;
	}

	/**
	 * The maximum amount of directional lights that cast shadows.
	 */
	public get numCastingDirectionalLights():number
	{
		return this._numCastingDirectionalLights;
	}

	/**
	 * The amount of point lights that cast shadows.
	 */
	public get numCastingPointLights():number
	{
		return this._numCastingPointLights;
	}

	/**
	 * The maximum amount of light probes that will be provided.
	 */
	public get numLightProbes():number
	{
		return this._numLightProbes;
	}

	/**
	 * The collected point lights to be used for shading.
	 */
	public get pointLights():Array<PointLight>
	{
		return this._pointLights;
	}

	/**
	 * The collected directional lights to be used for shading.
	 */
	public get directionalLights():Array<DirectionalLight>
	{
		return this._directionalLights;
	}

	/**
	 * The collected point lights that cast shadows to be used for shading.
	 */
	public get castingPointLights():Array<PointLight>
	{
		return this._castingPointLights;
	}

	/**
	 * The collected directional lights that cast shadows to be used for shading.
	 */
	public get castingDirectionalLights():Array<DirectionalLight>
	{
		return this._castingDirectionalLights;
	}

	/**
	 * The collected light probes to be used for shading.
	 */
	public get lightProbes():Array<LightProbe>
	{
		return this._lightProbes;
	}

	/**
	 * The weights for each light probe, defining their influence on the object.
	 */
	public get lightProbeWeights():Array<number>
	{
		return this._lightProbeWeights;
	}

	/**
	 * A collection of all the collected lights.
	 */
	public get allPickedLights():Array<LightBase>
	{
		return this._allPickedLights;
	}

	/**
	 * Updates set of lights for a given renderable and EntityCollector. Always call super.collectLights() after custom overridden code.
	 */
	public collectLights(entity:IRenderEntity):void
	{
		this.updateProbeWeights(entity);
	}

	/**
	 * Updates the weights for the light probes, based on the renderable's position relative to them.
	 * @param renderable The renderble for which to calculate the light probes' influence.
	 */
	private updateProbeWeights(entity:IRenderEntity):void
	{
		// todo: this will cause the same calculations to occur per TriangleGraphic. See if this can be improved.
		var objectPos:Vector3D = entity.scenePosition;
		var lightPos:Vector3D;

		var rx:number = objectPos.x, ry:number = objectPos.y, rz:number = objectPos.z;
		var dx:number, dy:number, dz:number;
		var w:number, total:number = 0;
		var i:number;

		// calculates weights for probes
		for (i = 0; i < this._numLightProbes; ++i) {

			lightPos = this._lightProbes[i].transform.concatenatedMatrix3D.position;
			dx = rx - lightPos.x;
			dy = ry - lightPos.y;
			dz = rz - lightPos.z;
			// weight is inversely proportional to square of distance
			w = dx*dx + dy*dy + dz*dz;

			// just... huge if at the same spot
			w = w > .00001? 1/w : 50000000;
			this._lightProbeWeights[i] = w;
			total += w;
		}

		// normalize
		total = 1/total;

		for (i = 0; i < this._numLightProbes; ++i)
			this._lightProbeWeights[i] *= total;
	}
}