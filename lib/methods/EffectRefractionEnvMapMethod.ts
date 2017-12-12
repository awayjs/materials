import {TextureBase} from "../textures/TextureBase";

import {EffectEnvMapMethod} from "./EffectEnvMapMethod";

/**
 * EffectRefractionEnvMapMethod provides a method to add refracted transparency based on cube maps.
 */
export class EffectRefractionEnvMapMethod extends EffectEnvMapMethod
{
	private _dispersionR:number = 0;
	private _dispersionG:number = 0;
	private _dispersionB:number = 0;
	private _refractionIndex:number;

	public static assetType:string = "[asset EffectRefractionEnvMapMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectRefractionEnvMapMethod.assetType;
	}

	/**
	 * The refractive index of the material.
	 */
	public get refractionIndex():number
	{
		return this._refractionIndex;
	}

	public set refractionIndex(value:number)
	{
		this._refractionIndex = value;

		this.invalidate();
	}

	/**
	 * The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
	 */
	public get dispersionR():number
	{
		return this._dispersionR;
	}

	public set dispersionR(value:number)
	{
		if (this._dispersionR == value)
			return;

		this._dispersionR = value;

		this.invalidateShaderProgram();
	}

	/**
	 * The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
	 */
	public get dispersionG():number
	{
		return this._dispersionG;
	}

	public set dispersionG(value:number)
	{
		if (this._dispersionG == value)
			return;

		this._dispersionG = value;

		this.invalidateShaderProgram();
	}

	/**
	 * The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
	 */
	public get dispersionB():number
	{
		return this._dispersionB;
	}

	public set dispersionB(value:number)
	{
		if (this._dispersionB == value)
			return;

		this._dispersionB = value;

		this.invalidateShaderProgram();
	}

	/**
	 * Creates a new EffectRefractionEnvMapMethod object. Example values for dispersion are: dispersionR: -0.03, dispersionG: -0.01, dispersionB: = .0015
	 *
	 * @param envMap The environment map containing the refracted scene.
	 * @param refractionIndex The refractive index of the material.
	 * @param dispersionR The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
	 * @param dispersionG The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
	 * @param dispersionB The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
	 */
	constructor(envMap:TextureBase, alpha:number = 1, refractionIndex:number = .1, dispersionR:number = 0, dispersionG:number = 0, dispersionB:number = 0)
	{
		super(envMap, alpha);

		this._refractionIndex = refractionIndex;

		this._dispersionR = dispersionR;
		this._dispersionG = dispersionG;
		this._dispersionB = dispersionB;
	}
}