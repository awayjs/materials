import {TextureBase, } from "../textures/TextureBase";
import {TextureProjector} from "../lights/TextureProjector";
import {TextureProjectorEvent} from "../events/TextureProjectorEvent";

import {MethodBase, _Shader_MethodBase} from "./MethodBase";

/**
 * ProjectiveTextureMethod is a material method used to project a texture unto the surface of an object.
 * This can be used for various effects apart from acting like a normal projector, such as projecting fake shadows
 * unto a surface, the impact of light coming through a stained glass window, ...
 */
export class EffectProjectiveTextureMethod extends MethodBase
{
	public static OVERLAY:string = "overlay";
	public static MULTIPLY:string = "multiply";
	public static ADD:string = "add";
	public static MIX:string = "mix";
	
	private _projector:TextureProjector;
	private _mode:string;
	private _exposure:number;
	private _texture:TextureBase;
	private _onTextureChangedDelegate:(event:TextureProjectorEvent) => void;

	public static assetType:string = "[asset EffectProjectiveTextureMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectProjectiveTextureMethod.assetType;
	}
	
	/**
	 * 
	 */
	public get exposure():number
	{
		return this._exposure;
	}
	
	public set exposure(value:number)
	{
		if (this._exposure == value)
			return;
		
		this._exposure = value;
		
		this.invalidate();
	}

	/**
	 * The blend mode with which the texture is blended unto the object.
	 * ProjectiveTextureMethod.MULTIPLY can be used to project shadows. To prevent clamping, the texture's alpha should be white!
	 * ProjectiveTextureMethod.ADD can be used to project light, such as a slide projector or light coming through stained glass. To prevent clamping, the texture's alpha should be black!
	 * ProjectiveTextureMethod.MIX provides normal alpha blending. To prevent clamping, the texture's alpha should be transparent!
	 */
	public get mode():string
	{
		return this._mode;
	}
	
	public set mode(value:string)
	{
		if (this._mode == value)
			return;
		
		this._mode = value;
		
		this.invalidateShaderProgram();
	}
	
	/**
	 * The TextureProjector object that defines the projection properties as well as the texture.
	 *
	 * @see away3d.entities.TextureProjector
	 */
	public get projector():TextureProjector
	{
		return this._projector;
	}
	
	public set projector(value:TextureProjector)
	{
		if (this._projector == value)
			return;

		if (this._projector)
			this._projector.removeEventListener(TextureProjectorEvent.TEXTURE_CHANGE, this._onTextureChangedDelegate);

		this._projector = value;

		if (this._projector)
			this._projector.addEventListener(TextureProjectorEvent.TEXTURE_CHANGE, this._onTextureChangedDelegate);

		this.updateTexture();
	}
	
	/**
	 * Creates a new ProjectiveTextureMethod object.
	 *
	 * @param projector The TextureProjector object that defines the projection properties as well as the texture.
	 * @param mode The blend mode with which the texture is blended unto the surface.
	 *
	 * @see away3d.entities.TextureProjector
	 */
	constructor(projector:TextureProjector, mode:string = "multiply", exposure:number = 1)
	{
		super();

		this._onTextureChangedDelegate = (event:TextureProjectorEvent) => this._onTextureChanged(event);

		this._projector = projector;
		this._exposure = exposure;
		this._mode = mode;

		this._projector.addEventListener(TextureProjectorEvent.TEXTURE_CHANGE, this._onTextureChangedDelegate);
	}

	private _onTextureChanged(event:TextureProjectorEvent):void
	{
		this.updateTexture();
	}

	private updateTexture():void
	{
		if (this._texture)
			this.iRemoveTexture(this._texture);

		this._texture = (this._projector)? this._projector.texture : null;

		if (this._texture)
			this.iAddTexture(this._texture);

		this.invalidateShaderProgram();
	}
}

import {ErrorBase, Matrix3D} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {ShaderBase, _Render_RenderableBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

/**
 * ProjectiveTextureMethod is a material method used to project a texture unto the surface of an object.
 * This can be used for various effects apart from acting like a normal projector, such as projecting fake shadows
 * unto a surface, the impact of light coming through a stained glass window, ...
 */
export class _Shader_EffectProjectiveTextureMethod extends _Shader_MethodBase
{
    private _method:EffectProjectiveTextureMethod;
    private _shader:ShaderBase;

    private _texture:_Shader_TextureBase;
    private _uvVarying:ShaderRegisterElement;
    private _projectionIndex:number;
    private _exposureIndex:number;
    private _projectionMatrix:Matrix3D;

    /**
     * Creates a new EffectEnvMapChunk.
     */
    constructor(method:EffectProjectiveTextureMethod, shader:ShaderBase)
    {
        super(method, shader);

        this._method = method;
        this._shader = shader;
    }

    public _initVO(chunkVO:ChunkVO):void
    {
        this._texture = <_Shader_TextureBase> this._shader.getAbstraction(this._method.projector.texture);

        this._texture._initVO(chunkVO);
    }

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        this._texture._initConstants();

        var index:number = this._exposureIndex;
        var data:Float32Array = this._shader.fragmentConstantData;
        data[index] = this._method.exposure;
        data[index + 1] = 0.5;
        data[index + 2] = 4;
        data[index + 3] = -1;

        this._projectionMatrix = new Matrix3D(new Float32Array(this._shader.vertexConstantData.buffer, this._projectionIndex*4, 16));
    }

    /**
     * @inheritDoc
     */
    public _cleanCompilationData():void
    {
        super._cleanCompilationData();

        this._uvVarying = null;
        this._projectionMatrix = null;
    }

    /**
     * @inheritDoc
     */
    public _getVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";
        var projReg:ShaderRegisterElement = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();

        this._projectionIndex = projReg.index*4;

        this._uvVarying = registerCache.getFreeVarying();

        code += "m44 " + this._uvVarying + ", " + sharedRegisters.animatedPosition + ", " + projReg + "\n";

        return code;
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";
        var col:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(col, 1);
        var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
        //var toTexReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
        //methodVO.fragmentConstantsIndex = toTexReg.index*4;

        var exposure:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
        this._exposureIndex = exposure.index*4;

        // code += "mul " + col + ".xy, " + this._uvVarying + ".xy, " + toTexReg + ".xy	\n" +
        // 	"add " + col + ".xy, " + col + ".xy, " + toTexReg + ".xx	\n";
        code += this._texture._getFragmentCode(col, registerCache, sharedRegisters, this._uvVarying);

        code += "mul " + col + ", " + col + ", " + exposure + ".xxx\n" +
            "add " + col + ", " + col + ", " + exposure + ".xxx\n";
        if (this._method.mode == EffectProjectiveTextureMethod.MULTIPLY)
            code += "mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + col + ".xyz			\n";
        else if (this._method.mode == EffectProjectiveTextureMethod.ADD)
            code += "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + col + ".xyz			\n";
        else if (this._method.mode == EffectProjectiveTextureMethod.MIX) {
            code += "sub " + col + ".xyz, " + col + ".xyz, " + targetReg + ".xyz				\n" +
                "mul " + col + ".xyz, " + col + ".xyz, " + col + ".w						\n" +
                "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + col + ".xyz			\n";
        } else if (this._method.mode == EffectProjectiveTextureMethod.OVERLAY) {
            code += "sge " + temp + ", " + targetReg + ", " + exposure + ".yyy\n"; // temp = (base >= 0.5)? 1 : 0
            code += "sub " + targetReg + ", " + targetReg + ", " + temp + "\n"; // base = temp? (base - 1 : base)
            code += "sub " + col + ", " + col + ", " + temp + "\n"; // blend = temp? (blend - 1 : blend)
            code += "mul " + col + ", " + col + ", " + targetReg + "\n"; // blend = blend * base
            code += "sub " + targetReg + ", " + exposure + ".yyy, " + temp + "\n"; // base = temp? -0.5 : 0.5
            code += "mul " + targetReg + ", " + exposure + ".zzz, " + targetReg + "\n"; // base = temp? -2 : 2
            code += "mul " + col + ", " + col + ", " + targetReg + "\n"; // blend = blend * ( -2 : 2)
            code += "add " + targetReg + ", " + col + ", " + temp + "\n"; //blend = temp? (blend + 1 : blend)
        } else
            throw new ErrorBase("Unknown mode \"" + this._method.mode + "\"");

        registerCache.removeFragmentTempUsage(col);

        return code;
    }

    /**
     * @inheritDoc
     */
    public _setRenderState(renderState:_Render_RenderableBase, view:View):void
    {
        var matrix3D:Matrix3D = Matrix3D.CALCULATION_MATRIX;
        matrix3D.copyFrom(this._method.projector.projection.viewMatrix3D);
        matrix3D.prepend(renderState.renderSceneTransform);
        this._projectionMatrix.copyFrom(matrix3D, true);

        this._texture._setRenderState(renderState);
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        this._texture.activate();

        if (this._invalid)
            this._shader.fragmentConstantData[this._exposureIndex] = this._method.exposure;
    }
}

ShaderBase.registerAbstraction(_Shader_EffectProjectiveTextureMethod, EffectProjectiveTextureMethod);