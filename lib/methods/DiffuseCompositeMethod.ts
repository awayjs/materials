import {TextureBase} from "../textures/TextureBase";

import {DiffuseBasicMethod} from "./DiffuseBasicMethod";
import {CompositeMethodBase} from "./CompositeMethodBase";

/**
 * DiffuseCompositeMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
 * calculated diffuse reflection strength.
 */
export class DiffuseCompositeMethod extends CompositeMethodBase
{
	/**
	 * Creates a new <code>DiffuseCompositeMethod</code> object.
	 *
	 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
	 * @param baseMethod The base diffuse method on which this method's shading is based.
	 */
	constructor(baseMethod:DiffuseBasicMethod | DiffuseCompositeMethod = null)
	{
		super(baseMethod);
	}

	public createBaseMethod():DiffuseBasicMethod | DiffuseCompositeMethod
	{
		return new DiffuseBasicMethod();
	}

	/**
	 * @inheritDoc
	 */
	public get texture():TextureBase
	{
		return (<DiffuseBasicMethod> this._baseMethod).texture;
	}

	public set texture(value:TextureBase)
	{
		(<DiffuseBasicMethod> this._baseMethod).texture = value;
	}

	/**
	 * @inheritDoc
	 */
	public get color():number
	{
		return (<DiffuseBasicMethod> this._baseMethod).color;
	}

	public set color(value:number)
	{
		(<DiffuseBasicMethod> this._baseMethod).color = value;
	}

	/**
	 * @inheritDoc
	 */
	public get multiply():boolean
	{
		return (<DiffuseBasicMethod> this._baseMethod).multiply;
	}

	public set multiply(value:boolean)
	{
		(<DiffuseBasicMethod> this._baseMethod).multiply = value;
	}
}