import {DiffuseBasicMethod} from "./DiffuseBasicMethod";
import {DiffuseCompositeMethod} from "./DiffuseCompositeMethod";

/**
 * DiffuseCelMethod provides a shading method to add diffuse cel (cartoon) shading.
 */
export class DiffuseCelMethod extends DiffuseCompositeMethod
{
	private _levels:number;
	private _smoothness:number;

	public static assetType:string = "[asset DiffuseCelMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return DiffuseCelMethod.assetType;
	}

	/**
	 * Creates a new DiffuseCelMethod object.
	 * @param levels The amount of shadow gradations.
	 * @param baseMethod An optional diffuse method on which the cartoon shading is based. If omitted, DiffuseBasicMethod is used.
	 */
	constructor(levels:number = 3, smoothness:number = 0.1, baseMethod:DiffuseBasicMethod | DiffuseCompositeMethod = null)
	{
		super(baseMethod);

		this._levels = levels;
		this._smoothness = smoothness;
	}

	/**
	 * The amount of shadow gradations.
	 */
	public get levels():number
	{
		return this._levels;
	}

	public set levels(value:number)
	{
		this._levels = value;
	}

	/**
	 * The smoothness of the edge between 2 shading levels.
	 */
	public get smoothness():number
	{
		return this._smoothness;
	}

	public set smoothness(value:number)
	{
		this._smoothness = value;
	}
}