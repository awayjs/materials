import {TextureBase} from "../textures/TextureBase";

import {EffectEnvMapMethod} from "./EffectEnvMapMethod";

/**
 * EffectFresnelEnvMapMethod provides a method to add fresnel-based reflectivity to an object using cube maps, which gets
 * stronger as the viewing angle becomes more grazing.
 */
export class EffectFresnelEnvMapMethod extends EffectEnvMapMethod
{
	private _fresnelPower:number;
	private _normalReflectance:number;

	public static assetType:string = "[asset EffectFresnelEnvMapMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectFresnelEnvMapMethod.assetType;
	}

	/**
	 * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
	 */
	public get fresnelPower():number
	{
		return this._fresnelPower;
	}

	public set fresnelPower(value:number)
	{
		this._fresnelPower = value;
	}

	/**
	 * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
	 */
	public get normalReflectance():number
	{
		return this._normalReflectance;
	}

	public set normalReflectance(value:number)
	{
		if (this._normalReflectance == value)
			return;
		
		this._normalReflectance = value;

		this.invalidate();
	}

	/**
	 * Creates a new <code>EffectFresnelEnvMapMethod</code> object.
	 *
	 * @param envMap The environment map containing the reflected scene.
	 * @param alpha The reflectivity of the material.
	 */
	constructor(envMap:TextureBase, alpha:number = 1, fresnelPower:number = 5, normalReflectance:number = 0)
	{
		super(envMap, alpha);

		this._fresnelPower = fresnelPower;
		this._normalReflectance = normalReflectance;
	}
}