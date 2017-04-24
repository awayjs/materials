import {SpecularBasicMethod} from "./SpecularBasicMethod";
import {SpecularCompositeMethod} from "./SpecularCompositeMethod";

/**
 * SpecularFresnelMethod provides a specular shading method that causes stronger highlights on grazing view angles.
 */
export class SpecularFresnelMethod extends SpecularCompositeMethod
{
	private _basedOnSurface:boolean;
	private _fresnelPower:number;
	private _normalReflectance:number;

	public static assetType:string = "[asset SpecularFresnelMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return SpecularFresnelMethod.assetType;
	}

	/**
	 * Creates a new SpecularFresnelMethod object.
	 * @param basedOnSurface Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
	 * @param baseMethod The specular method to which the fresnel equation. Defaults to SpecularBasicMethod.
	 */
	constructor(basedOnSurface:boolean = true, fresnelPower:number = 5, normalReflectance:number = 0.028, baseMethod:SpecularBasicMethod | SpecularCompositeMethod = null)
	{
		super(baseMethod);

		this._basedOnSurface = basedOnSurface;
		this._fresnelPower = fresnelPower;
		this._normalReflectance = normalReflectance;
	}

	/**
	 * Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
	 */
	public get basedOnSurface():boolean
	{
		return this._basedOnSurface;
	}

	public set basedOnSurface(value:boolean)
	{
		if (this._basedOnSurface == value)
			return;

		this._basedOnSurface = value;

		this.invalidateShaderProgram();
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
		if (this._fresnelPower == value)
			return;
		
		this._fresnelPower = value;

		this.invalidate();
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
}