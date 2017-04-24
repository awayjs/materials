import {DiffuseBasicMethod} from "./DiffuseBasicMethod";

/**
 * DiffuseWrapMethod is an alternative to DiffuseBasicMethod in which the light is allowed to be "wrapped around" the normally dark area, to some extent.
 * It can be used as a crude approximation to Oren-Nayar or simple subsurface scattering.
 */
export class DiffuseWrapMethod extends DiffuseBasicMethod
{
	private _wrapFactor:number;

	public static assetType:string = "[asset DiffuseWrapMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return DiffuseWrapMethod.assetType;
	}

	/**
	 * A factor to indicate the amount by which the light is allowed to wrap.
	 */
	public get wrapFactor():number
	{
		return this._wrapFactor;
	}

	public set wrapFactor(value:number)
	{
		this._wrapFactor = value;
		this._wrapFactor = 1/(value + 1);

		this.invalidate();
	}

	/**
	 * Creates a new DiffuseWrapMethod object.
	 * @param wrapFactor A factor to indicate the amount by which the light is allowed to wrap
	 */
	constructor(wrapFactor:number = .5)
	{
		super();

		this.wrapFactor = wrapFactor;
	}
}