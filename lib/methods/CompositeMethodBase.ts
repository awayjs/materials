import {AbstractMethodError} from "@awayjs/core";

import {MethodEvent} from "../events/MethodEvent";

import {MaterialBase} from "../MaterialBase";

import {MethodBase, _Shader_MethodBase} from "./MethodBase";

/**
 * CompositeMethodBase provides a base class for diffuse methods that wrap a diffuse method to alter the
 * calculated diffuse reflection strength.
 */
export class CompositeMethodBase extends MethodBase
{
	protected _onShaderInvalidatedDelegate:(event:MethodEvent) => void;
	
	protected _baseMethod:MethodBase;


	/**
	 * The base diffuse method on which this method's shading is based.
	 */
	public get baseMethod():MethodBase
	{
		return this._baseMethod;
	}

	public set baseMethod(value:MethodBase)
	{
		if (this._baseMethod == value)
			return;

		this._baseMethod.removeEventListener(MethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		this._baseMethod = value;
		this._baseMethod.addEventListener(MethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

		this.invalidateShaderProgram();
	}

	/**
	 * Creates a new <code>CompositeMethodBase</code> object.
	 *
	 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
	 * @param baseMethod The base diffuse method on which this method's shading is based.
	 */
	constructor(baseMethod:MethodBase = null)
	{
		super();

		this._onShaderInvalidatedDelegate = (event:MethodEvent) => this.onShaderInvalidated(event);

		this._baseMethod = baseMethod || this.createBaseMethod();
		this._baseMethod.addEventListener(MethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
	}

	protected createBaseMethod():MethodBase
	{
		throw new AbstractMethodError();
	}

	public iAddOwner(owner:MaterialBase):void
	{
		super.iAddOwner(owner);

		this._baseMethod.iAddOwner(owner);
	}

	public iRemoveOwner(owner:MaterialBase):void
	{
		super.iRemoveOwner(owner);

		this._baseMethod.iRemoveOwner(owner);
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		this._baseMethod.removeEventListener(MethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
	}

	/**
	 * Called when the base method's shader code is invalidated.
	 */
	private onShaderInvalidated(event:MethodEvent):void
	{
		this.invalidateShaderProgram();
	}
}

import {AbstractionBase} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {_Render_RenderableBase, ChunkVO} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";

import {_IShader_LightingMethod} from "./_IShader_LightingMethod";
import {_IShader_Method} from "./_IShader_Method";

/**
 * _Shader_CompositeMethodBase provides a base class for diffuse methods that wrap a diffuse method to alter the
 * calculated diffuse reflection strength.
 */
export class _Shader_CompositeMethodBase extends AbstractionBase implements _IShader_Method
{
    protected _baseChunk:_IShader_Method;

    public chunkVO:ChunkVO = new ChunkVO();

    /**
     * Creates a new <code>_Shader_CompositeMethodBase</code> object.
     *
     * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
     * @param baseMethod The base diffuse method on which this method's shading is based.
     */
    constructor(method:CompositeMethodBase, shader:LightingShader)
    {
        super(method, shader);

        this._baseChunk = <_Shader_MethodBase> shader.getAbstraction(method.baseMethod);
    }

    public _isUsed():boolean
    {
        return true;
    }

    public _usesTangentSpace():boolean
    {
        return this._baseChunk._usesTangentSpace();
    }

    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        this._baseChunk._initVO(chunkVO);
    }

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        this._baseChunk._initConstants();
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        this._baseChunk._activate();
    }

    /**
     * @inheritDoc
     */
    public _setRenderState(renderState:_Render_RenderableBase, view:View):void
    {
        this._baseChunk._setRenderState(renderState, view);
    }

    /**
     * @inheritDoc
     */
    public _deactivate():void
    {
        this._baseChunk._deactivate();

        this._invalid = false;
    }

    /**
     * @inheritDoc
     */
    public _getVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        return this._baseChunk._getVertexCode(registerCache, sharedRegisters);
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        return this._baseChunk._getFragmentCode(targetReg, registerCache, sharedRegisters);
    }

    /**
     * @inheritDoc
     */
    public _reset(chunkVO:ChunkVO):void
    {
        this._baseChunk._reset(chunkVO);

        this._invalid = true;

        this._cleanCompilationData();
    }

    /**
     * @inheritDoc
     */
    public _cleanCompilationData():void
    {
        this._baseChunk._cleanCompilationData();
    }
}

/**
 * LightingCompositeBase provides a base class for diffuse methods that wrap a diffuse method to alter the
 * calculated diffuse reflection strength.
 */
export class _Shader_LightingCompositeMethod extends _Shader_CompositeMethodBase implements _IShader_LightingMethod
{
    public _totalLightColorReg:ShaderRegisterElement;

    public _modulateFunction:(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => string;

    /**
     * @inheritDoc
     */
    public _getFragmentPreLightingCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        return (<_IShader_LightingMethod> this._baseChunk)._getFragmentPreLightingCode(registerCache, sharedRegisters);
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCodePerLight(lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = (<_IShader_LightingMethod> this._baseChunk)._getFragmentCodePerLight(lightDirReg, lightColReg, registerCache, sharedRegisters);

        this._totalLightColorReg = (<_IShader_LightingMethod> this._baseChunk)._totalLightColorReg;

        return code;
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCodePerProbe(cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = (<_IShader_LightingMethod> this._baseChunk)._getFragmentCodePerProbe(cubeMapReg, weightRegister, registerCache, sharedRegisters);

        this._totalLightColorReg = (<_IShader_LightingMethod> this._baseChunk)._totalLightColorReg;

        return code;
    }
}