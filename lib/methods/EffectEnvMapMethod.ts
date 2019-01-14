import {TextureBase} from "../textures/TextureBase";

import {MethodBase, _Shader_MethodBase} from "./MethodBase";

/**
 * EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
 */
export class EffectEnvMapMethod extends MethodBase
{
	private _envMap:TextureBase;
	private _mask:TextureBase;
	private _alpha:number;

	public static assetType:string = "[asset EffectEnvMapMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectEnvMapMethod.assetType;
	}

	/**
	 * The cubic environment map containing the reflected scene.
	 */
	public get envMap():TextureBase
	{
		return this._envMap;
	}

	public set envMap(value:TextureBase)
	{
		if (this._envMap == value)
			return;

		if (this._envMap)
			this.iRemoveTexture(this._envMap);

		this._envMap = value;

		if (this._envMap)
			this.iAddTexture(this._envMap);

		this.invalidateShaderProgram();
	}

	/**
	 * An optional texture to modulate the reflectivity of the surface.
	 */
	public get mask():TextureBase
	{
		return this._mask;
	}

	public set mask(value:TextureBase)
	{
		if (value == this._mask)
			return;

		if (this._mask)
			this.iRemoveTexture(this._mask);

		this._mask = value;

		if (this._mask)
			this.iAddTexture(this._mask);

		this.invalidateShaderProgram();
	}

	/**
	 * The reflectivity of the surface.
	 */
	public get alpha():number
	{
		return this._alpha;
	}

	public set alpha(value:number)
	{
		this._alpha = value;

		this.invalidate();
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
	}

	/**
	 * Creates an EffectEnvMapMethod object.
	 * @param envMap The environment map containing the reflected scene.
	 * @param alpha The reflectivity of the surface.
	 */
	constructor(envMap:TextureBase, alpha:number = 1)
	{
		super();

		this._envMap = envMap;
		this._alpha = alpha;

		this.iAddTexture(this._envMap);
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {ShaderBase, _Render_RenderableBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

/**
 * _Shader_EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
 */
export class _Shader_EffectEnvMapMethod extends _Shader_MethodBase
{
    protected _method:EffectEnvMapMethod;
    protected _shader:ShaderBase;

    protected _envMap:_Shader_TextureBase;
    protected _maskMap:_Shader_TextureBase;
    protected _fragmentIndex:number;

    /**
     * Creates a new _Shader_EffectEnvMapMethod.
     */
    constructor(method:EffectEnvMapMethod, shader:ShaderBase)
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
        chunkVO.needsNormals = true;
        chunkVO.needsView = true;

        this._envMap = <_Shader_TextureBase> this._shader.getAbstraction(this._method.envMap);

        this._envMap._initVO(chunkVO);

        if (this._method.mask) {
            this._maskMap = <_Shader_TextureBase> this._shader.getAbstraction(this._method.mask);
            this._shader.uvDependencies++;
        } else if (this._maskMap) {
            this._maskMap = null;
        }
    }

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        this._envMap._initConstants();
    }

    /**
     * @inheritDoc
     */
    public dispose():void
    {
        this._envMap = null;
        this._maskMap = null;
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        this._envMap.activate();

        if (this._maskMap)
            this._maskMap.activate();

        if (this._invalid)
            this._updateProperties();
    }

    public _setRenderState(renderState:_Render_RenderableBase, view:View):void
    {
        this._envMap._setRenderState(renderState);

        if (this._maskMap)
            this._maskMap._setRenderState(renderState);
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var alphaRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
        var code:string = "";

        this._fragmentIndex = alphaRegister.index*4;

        var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp2, 1);

        // r = I - 2(I.N)*N
        code += "dp3 " + temp + ".w, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
            "add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" +
            "mul " + temp + ".xyz, " + sharedRegisters.normalFragment + ".xyz, " + temp + ".w\n" +
            "sub " + temp + ".xyz, " + temp + ".xyz, " + sharedRegisters.viewDirFragment + ".xyz\n" +
            this._envMap._getFragmentCode(temp, registerCache, sharedRegisters, temp) +
            "sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" + // -.5
            "kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
            "sub " + temp + ", " + temp + ", " + targetReg + "\n";

        if (this._maskMap) {
            code += this._maskMap._getFragmentCode(temp2, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
                "mul " + temp + ", " + temp2 + ", " + temp + "\n";
        }

        code += "mul " + temp + ", " + temp + ", " + alphaRegister + ".x\n" +
            "add " + targetReg + ", " + targetReg + ", " + temp + "\n";

        registerCache.removeFragmentTempUsage(temp);
        registerCache.removeFragmentTempUsage(temp2);

        return code;
    }

    protected _updateProperties()
    {
        this._shader.fragmentConstantData[this._fragmentIndex] = this._method.alpha;
    }
}

ShaderBase.registerAbstraction(_Shader_EffectEnvMapMethod, EffectEnvMapMethod);