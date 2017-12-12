import {TextureBase} from "../textures/TextureBase";

import {CompositeMethodBase} from "./CompositeMethodBase";
import {SpecularBasicMethod} from "./SpecularBasicMethod";

/**
 * SpecularCompositeMethod provides a base class for specular methods that wrap a specular method to alter the
 * calculated specular reflection strength.
 */
export class SpecularCompositeMethod extends CompositeMethodBase
{
	/**
	 * Creates a new <code>SpecularCompositeMethod</code> object.
	 *
	 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
	 * @param baseMethod The base specular method on which this method's shading is based.
	 */
	constructor(baseMethod:SpecularBasicMethod | SpecularCompositeMethod = null)
	{
		super(baseMethod);
	}

	public createBaseMethod():SpecularBasicMethod
	{
		return new SpecularBasicMethod();
	}

	/**
	 * @inheritDoc
	 */
	public get gloss():number
	{
		return (<SpecularBasicMethod> this._baseMethod).gloss;
	}

	public set gloss(value:number)
	{
		(<SpecularBasicMethod> this._baseMethod).gloss = value;
	}

	/**
	 * @inheritDoc
	 */
	public get strength():number
	{
		return (<SpecularBasicMethod> this._baseMethod).strength;
	}

	public set strength(value:number)
	{
		(<SpecularBasicMethod> this._baseMethod).strength = value;
	}

	/**
	 * @inheritDoc
	 */
	public get color():number
	{
		return (<SpecularBasicMethod> this._baseMethod).color;
	}

	/**
	 * @inheritDoc
	 */
	public set color(value:number)
	{
		(<SpecularBasicMethod> this._baseMethod).color = value;
	}

	/**
	 * @inheritDoc
	 */
	public get texture():TextureBase
	{
		return (<SpecularBasicMethod> this._baseMethod).texture;
	}

	public set texture(value:TextureBase)
	{
		(<SpecularBasicMethod> this._baseMethod).texture = value;
	}
}