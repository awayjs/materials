import {AbstractMethodError} from "@awayjs/core";

import {TextureBase, IMaterial} from "@awayjs/graphics";

import {ShadingMethodEvent} from "@awayjs/renderer";

import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * CompositeMethodBase provides a base class for diffuse methods that wrap a diffuse method to alter the
 * calculated diffuse reflection strength.
 */
export class CompositeMethodBase extends ShadingMethodBase
{
	protected _onShaderInvalidatedDelegate:(event:ShadingMethodEvent) => void;
	
	protected _baseMethod:ShadingMethodBase;


	/**
	 * The base diffuse method on which this method's shading is based.
	 */
	public get baseMethod():ShadingMethodBase
	{
		return this._baseMethod;
	}

	public set baseMethod(value:ShadingMethodBase)
	{
		if (this._baseMethod == value)
			return;

		this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		this._baseMethod = value;
		this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

		this.invalidateShaderProgram();
	}

	/**
	 * Creates a new <code>CompositeMethodBase</code> object.
	 *
	 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
	 * @param baseMethod The base diffuse method on which this method's shading is based.
	 */
	constructor(baseMethod:ShadingMethodBase = null)
	{
		super();

		this._onShaderInvalidatedDelegate = (event:ShadingMethodEvent) => this.onShaderInvalidated(event);

		this._baseMethod = baseMethod || this.createBaseMethod();
		this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
	}

	protected createBaseMethod():ShadingMethodBase
	{
		throw new AbstractMethodError();
	}

	public iAddOwner(owner:IMaterial):void
	{
		super.iAddOwner(owner);

		this._baseMethod.iAddOwner(owner);
	}

	public iRemoveOwner(owner:IMaterial):void
	{
		super.iRemoveOwner(owner);

		this._baseMethod.iRemoveOwner(owner);
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
	}

	/**
	 * Called when the base method's shader code is invalidated.
	 */
	private onShaderInvalidated(event:ShadingMethodEvent):void
	{
		this.invalidateShaderProgram();
	}
}