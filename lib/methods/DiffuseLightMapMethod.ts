import {TextureBase} from "../textures/TextureBase";

import {DiffuseBasicMethod} from "./DiffuseBasicMethod";
import {DiffuseCompositeMethod} from "./DiffuseCompositeMethod";

/**
 * DiffuseLightMapMethod provides a diffuse shading method that uses a light map to modulate the calculated diffuse
 * lighting. It is different from EffectLightMapMethod in that the latter modulates the entire calculated pixel color, rather
 * than only the diffuse lighting value.
 */
export class DiffuseLightMapMethod extends DiffuseCompositeMethod
{
	/**
	 * Indicates the light map should be multiplied with the calculated shading result.
	 * This can be used to add pre-calculated shadows or occlusion.
	 */
	public static MULTIPLY:string = "multiply";

	/**
	 * Indicates the light map should be added into the calculated shading result.
	 * This can be used to add pre-calculated lighting or global illumination.
	 */
	public static ADD:string = "add";

	private _lightMap:TextureBase;
	private _blendMode:string;
	private _useSecondaryUV:boolean;

	public static assetType:string = "[asset DiffuseLightMapMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return DiffuseLightMapMethod.assetType;
	}

	/**
	 * The blend mode with which the light map should be applied to the lighting result.
	 *
	 * @see DiffuseLightMapMethod.ADD
	 * @see DiffuseLightMapMethod.MULTIPLY
	 */
	public get blendMode():string
	{
		return this._blendMode;
	}

	public set blendMode(value:string)
	{
		if (value != DiffuseLightMapMethod.ADD && value != DiffuseLightMapMethod.MULTIPLY)
			throw new Error("Unknown blendmode!");

		if (this._blendMode == value)
			return;

		this._blendMode = value;

		this.invalidateShaderProgram();
	}

	/**
	 * The texture containing the light map data.
	 */
	public get lightMap():TextureBase
	{
		return this._lightMap;
	}

	public set lightMap(value:TextureBase)
	{
		if (this._lightMap == value)
			return;

		if (this._lightMap)
			this.iRemoveTexture(this._lightMap);

		this._lightMap = value;

		if (this._lightMap)
			this.iAddTexture(this._lightMap);

		this.invalidateShaderProgram();
	}

	/**
	 * Indicates whether the secondary UV set should be used to map the light map.
	 */
	public get useSecondaryUV():boolean
	{
		return this._useSecondaryUV;
	}

	public set useSecondaryUV(value:boolean)
	{
		if (this._useSecondaryUV == value)
			return;

		this._useSecondaryUV = value;

		this.invalidateShaderProgram();
	}

	/**
	 * Creates a new DiffuseLightMapMethod method.
	 *
	 * @param lightMap The texture containing the light map.
	 * @param blendMode The blend mode with which the light map should be applied to the lighting result.
	 * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
	 * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
	 */
	constructor(lightMap:TextureBase, blendMode:string = "multiply", useSecondaryUV:boolean = false, baseMethod:DiffuseBasicMethod | DiffuseCompositeMethod = null)
	{
		super(baseMethod);

		this._lightMap = lightMap;
		this.blendMode = blendMode;
		this._useSecondaryUV = useSecondaryUV;

		if (this._lightMap)
			this.iAddTexture(this._lightMap);
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {ShaderBase, _Render_RenderableBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";
import {ImageTexture2D} from "../textures/ImageTexture2D";

import {_Shader_LightingCompositeMethod} from "./CompositeMethodBase";

/**
 * _Shader_DiffuseLightMapMethod provides a diffuse shading method that uses a light map to modulate the calculated diffuse
 * lighting. It is different from EffectLightMapMethod in that the latter modulates the entire calculated pixel color, rather
 * than only the diffuse lighting value.
 */
export class _Shader_DiffuseLightMapMethod extends _Shader_LightingCompositeMethod
{
    private _lightMap:_Shader_TextureBase;

    private _method:DiffuseLightMapMethod;
    private _shader:LightingShader;

    /**
     * Creates a new _Shader_DiffuseLightMapMethod method.
     */
    constructor(method:DiffuseLightMapMethod, shader:LightingShader)
    {
        super(method, shader);

        this._method = method;
        this._shader = shader;
    }


    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        this._lightMap = <_Shader_TextureBase> this._shader.getAbstraction(this._method.lightMap || new ImageTexture2D());

        this._lightMap._initVO(chunkVO);

        if (this._method.useSecondaryUV)
            this._shader.secondaryUVDependencies++;
        else
            this._shader.uvDependencies++;
    }

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        this._lightMap._initConstants();
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string;
        var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

        code = this._lightMap._getFragmentCode(temp, registerCache, sharedRegisters, this._method.useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);

        switch (this._method.blendMode) {
            case DiffuseLightMapMethod.MULTIPLY:
                code += "mul " + this._totalLightColorReg + ", " + this._totalLightColorReg + ", " + temp + "\n";
                break;
            case DiffuseLightMapMethod.ADD:
                code += "add " + this._totalLightColorReg + ", " + this._totalLightColorReg + ", " + temp + "\n";
                break;
        }

        code += super._getFragmentCode(targetReg, registerCache, sharedRegisters);

        return code;
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        super._activate();

        this._lightMap.activate();
    }

    /**
     * @inheritDoc
     */
    public _setRenderState(renderState:_Render_RenderableBase, view:View):void
    {
        super._setRenderState(renderState, view);

        this._lightMap._setRenderState(renderState);
    }
}

ShaderBase.registerAbstraction(_Shader_DiffuseLightMapMethod, DiffuseLightMapMethod);