import {SpecularBasicMethod} from "./SpecularBasicMethod";
import {SpecularCompositeMethod} from "./SpecularCompositeMethod";

/**
 * SpecularCelMethod provides a shading method to add specular cel (cartoon) shading.
 */
export class SpecularCelMethod extends SpecularCompositeMethod
{
	private _smoothness:number;
	private _specularCutOff:number;

	public static assetType:string = "[asset SpecularCelMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return SpecularCelMethod.assetType;
	}

	/**
	 * The smoothness of the highlight edge.
	 */
	public get smoothness():number
	{
		return this._smoothness;
	}

	public set smoothness(value:number)
	{
		if (this._smoothness == value)
			return;

		this._smoothness = value;

		this.invalidate();
	}

	/**
	 * The threshold at which the specular highlight should be shown.
	 */
	public get specularCutOff():number
	{
		return this._specularCutOff;
	}

	public set specularCutOff(value:number)
	{
		if (this._specularCutOff == value)
			return;

		this._specularCutOff = value;

		this.invalidate();
	}

	/**
	 * Creates a new SpecularCelMethod object.
	 * @param specularCutOff The threshold at which the specular highlight should be shown.
	 * @param smoothness The smoothness of the highlight edge.
	 * @param baseMethod An optional specular method on which the cartoon shading is based. If ommitted, SpecularBasicMethod is used.
	 */
	constructor(specularCutOff:number = 0.5, smoothness:number = 0.1, baseMethod:SpecularBasicMethod | SpecularCompositeMethod = null)
	{
		super(baseMethod);

		this._specularCutOff = specularCutOff;
		this._smoothness = smoothness;
	}
}