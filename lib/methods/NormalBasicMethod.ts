import {TextureBase} from "../textures/TextureBase";

import {MethodBase, _Shader_MethodBase} from "./MethodBase";

/**
 * NormalBasicMethod is the default method for standard tangent-space normal mapping.
 */
export class NormalBasicMethod extends MethodBase
{
	private _texture:TextureBase;

	public static assetType:string = "[asset NormalBasicMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return NormalBasicMethod.assetType;
	}

	/**
	 * A texture to modulate the direction of the surface for each texel (normal map). The default normal method expects
	 * tangent-space normal maps, but others could expect object-space maps.
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
	 * Creates a new NormalBasicMethod object.
	 */
	constructor(texture:TextureBase = null)
	{
		super();

		this._texture = texture;

		if (this._texture)
			this.iAddTexture(this._texture);
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:MethodBase):void
	{
		var s:any = method;
		var bnm:NormalBasicMethod = <NormalBasicMethod> method;

		if (bnm.texture != null)
			this.texture = bnm.texture;
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		if (this._texture)
			this._texture = null;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {ShaderBase, _Render_RenderableBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

/**
 * _Shader_NormalBasicMethod is the default method for standard tangent-space normal mapping.
 */
export class _Shader_NormalBasicMethod extends _Shader_MethodBase
{
    protected _method:NormalBasicMethod;
    protected _shader:ShaderBase;

    protected _texture:_Shader_TextureBase;

    /**
     * Creates a new EffectEnvMapChunk.
     */
    constructor(method:NormalBasicMethod, shader:ShaderBase)
    {
        super(method, shader);

        this._method = method;
        this._shader = shader;
    }

    public _isUsed():boolean
    {
        if (this._texture && this._shader.normalDependencies)
            return true;

        return false;
    }

    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        if (this._method.texture) {
            this._texture = <_Shader_TextureBase> this._shader.getAbstraction(this._method.texture);

            this._texture._initVO(chunkVO);

            this._shader.uvDependencies++;
        }
    }

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        if (this._method.texture)
            this._texture._initConstants();
    }

    /**
     * Indicates whether or not this method outputs normals in tangent space. Override for object-space normals.
     */
    public _outputsTangentNormals():boolean
    {
        return true;
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        if (this._texture)
            this._texture.activate();
    }

    public _setRenderState(renderState:_Render_RenderableBase, view:View):void
    {
        if (this._texture)
            this._texture._setRenderState(renderState);
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";

        if (this._texture)
            code += this._texture._getFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying);


        code += "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx\n" +
            "nrm " + targetReg + ".xyz, " + targetReg + "\n";

        return code;
    }
}

ShaderBase.registerAbstraction(_Shader_NormalBasicMethod, NormalBasicMethod);