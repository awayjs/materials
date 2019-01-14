import {AssetEvent} from "@awayjs/core";

import {TextureBase} from "../textures/TextureBase";

import {MethodBase, _Shader_MethodBase} from "./MethodBase";

/**
 * AmbientBasicMethod provides the default shading method for uniform ambient lighting.
 */
export class AmbientBasicMethod extends MethodBase
{
	private _alpha:number = 1;

	public _texture:TextureBase;

	private _strength:number = 1;


	public static assetType:string = "[asset AmbientBasicMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return AmbientBasicMethod.assetType;
	}

	/**
	 * Creates a new AmbientBasicMethod object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * The strength of the ambient reflection of the surface.
	 */
	public get strength():number
	{
		return this._strength;
	}

	public set strength(value:number)
	{
		if (this._strength == value)
			return;

		this._strength = value;

		this.invalidate();
	}

	/**
	 * The alpha component of the surface.
	 */
	public get alpha():number
	{
		return this._alpha;
	}

	public set alpha(value:number)
	{
		if (this._alpha == value)
			return;

		this._alpha = value;

		this.invalidate();
	}

	/**
	 * The texture to use to define the diffuse reflection color per texel.
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
	 * @inheritDoc
	 */
	public copyFrom(method:MethodBase):void
	{
		var m:any = method;
		var b:AmbientBasicMethod = <AmbientBasicMethod> m;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {_Render_RenderableBase, ShaderBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

import {TextureCube} from "../textures/TextureCube";

/**
 * _Shader_AmbientBasicMethod provides the default shading method for uniform ambient lighting.
 */
export class _Shader_AmbientBasicMethod extends _Shader_MethodBase
{
    protected _method:AmbientBasicMethod;
    protected _shader:ShaderBase;

    protected _texture:_Shader_TextureBase;

    private _colorIndex:number;

    /**
     * Creates a new _Shader_AmbientBasicMethod object.
     */
    constructor(method:AmbientBasicMethod, shader:ShaderBase)
    {
        super(method, shader);

        this._method = method;
        this._shader = shader;
    }

    /**
     *
     */
    public onClear(event:AssetEvent):void
    {
        super.onClear(event);

        this._method = null;
        this._shader = null;

        if (this._texture) {
            this._texture.onClear(new AssetEvent(AssetEvent.CLEAR, this._method.texture));
            this._texture = null;
        }
    }

    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        if (this._method.texture) {
            this._texture = <_Shader_TextureBase> this._shader.getAbstraction(this._method.texture);

            this._texture._initVO(chunkVO);

            if (this._method.texture instanceof TextureCube)
                chunkVO.needsNormals = true;
            else
                this._shader.uvDependencies++;

        } else if (this._texture) {
            this._texture = null;
        }
    }

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        if (this._texture)
            this._texture._initConstants();
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";

        if (this._texture) {
            code += this._texture._getFragmentCode(targetReg, registerCache, sharedRegisters, (this._method.texture instanceof TextureCube)? sharedRegisters.normalFragment : sharedRegisters.uvVarying);

            if (this._shader.alphaThreshold > 0) {
                var cutOffReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
                this._colorIndex = cutOffReg.index*4;

                code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" +
                    "kil " + targetReg + ".w\n" +
                    "add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
            }

        } else {
            var ambientInputRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
            this._colorIndex = ambientInputRegister.index*4;

            code += "mov " + targetReg + ", " + ambientInputRegister + "\n";
        }

        return code;
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        if (this._texture) {
            this._texture.activate();

            if (this._invalid && this._shader.alphaThreshold > 0)
                this._shader.fragmentConstantData[this._colorIndex] = this._shader.alphaThreshold;

        } else if (this._invalid) {
            var index:number = this._colorIndex;
            var data:Float32Array = this._shader.fragmentConstantData;
            var color:number = this._shader.numLights? 0xFFFFFF : this._shader.renderMaterial.style.color;

            data[index] = ((color >> 16) & 0xff)/0xff*this._method.strength;
            data[index + 1] = ((color >> 8) & 0xff)/0xff*this._method.strength;
            data[index + 2] = (color & 0xff)/0xff*this._method.strength;
            data[index + 3] = this._method.alpha;
        }
    }

    public _setRenderState(renderState:_Render_RenderableBase, view:View):void
    {
        if (this._texture)
            this._texture._setRenderState(renderState);
    }
}

ShaderBase.registerAbstraction(_Shader_AmbientBasicMethod, AmbientBasicMethod);