import {TextureBase} from "../textures/TextureBase";

import {MethodBase, _Shader_MethodBase} from "./MethodBase";

/**
 * EffectAlphaMaskMethod allows the use of an additional texture to specify the alpha value of the material. When used
 * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
 * etc).
 */
export class EffectAlphaMaskMethod extends MethodBase
{
	private _texture:TextureBase;
	private _useSecondaryUV:boolean;

	public static assetType:string = "[asset EffectAlphaMaskMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectAlphaMaskMethod.assetType;
	}

	/**
	 * The texture to use as the alpha mask.
	 */
	public get texture():TextureBase
	{
		return this._texture;
	}

	public set texture(value:TextureBase)
	{
		if (this._texture == value)
			return;

		if (this._texture)
			this.iRemoveTexture(this._texture);

		this._texture = value;

		if (this._texture)
			this.iAddTexture(this._texture);

		this.invalidateShaderProgram();
	}

	/**
	 * Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently, for
	 * instance to tile the main texture and normal map while providing untiled alpha, for example to define the
	 * transparency over a tiled water surface.
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
	 * Creates a new EffectAlphaMaskMethod object.
	 *
	 * @param texture The texture to use as the alpha mask.
	 * @param useSecondaryUV Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently.
	 */
	constructor(texture:TextureBase, useSecondaryUV:boolean = false)
	{
		super();

		this._texture = texture;
		this._useSecondaryUV = useSecondaryUV;

		if (this._texture)
			this.iAddTexture(this._texture);
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {ShaderBase, _Render_RenderableBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

import {ImageTexture2D} from "../textures/ImageTexture2D";

/**
 * _Shader_EffectAlphaMaskMethod allows the use of an additional texture to specify the alpha value of the material. When used
 * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
 * etc).
 */
export class _Shader_EffectAlphaMaskMethod extends _Shader_MethodBase
{
    private _method:EffectAlphaMaskMethod;
    private _shader:ShaderBase;

    private _alphaMask:_Shader_TextureBase;

    /**
     * Creates a new _Shader_EffectAlphaMaskMethod object.
     */
    constructor(method:EffectAlphaMaskMethod, shader:ShaderBase)
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
        this._alphaMask = <_Shader_TextureBase> this._shader.getAbstraction(this._method.texture || new ImageTexture2D());

        this._alphaMask._initVO(chunkVO);

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
        this._alphaMask._initConstants();
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

        return this._alphaMask._getFragmentCode(temp, registerCache, sharedRegisters, this._method.useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying) +
            "mul " + targetReg + ", " + targetReg + ", " + temp + ".x\n";
    }


    /**
     * @inheritDoc
     */
    public _activate():void
    {
        super._activate();

        this._alphaMask.activate();
    }

    public _setRenderState(renderState:_Render_RenderableBase, view:View):void
    {
        this._alphaMask._setRenderState(renderState);
    }
}

ShaderBase.registerAbstraction(_Shader_EffectAlphaMaskMethod, EffectAlphaMaskMethod);