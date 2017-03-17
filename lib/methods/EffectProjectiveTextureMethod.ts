import {ErrorBase, Matrix3D, ProjectionBase} from "@awayjs/core";

import {TextureBase} from "@awayjs/graphics";

import {TextureProjector, TextureProjectorEvent} from "@awayjs/scene";

import {Stage} from "@awayjs/stage";

import {GL_RenderableBase, ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/renderer";

import {MethodVO} from "../data/MethodVO";

import {EffectMethodBase} from "./EffectMethodBase";

/**
 * ProjectiveTextureMethod is a material method used to project a texture unto the surface of an object.
 * This can be used for various effects apart from acting like a normal projector, such as projecting fake shadows
 * unto a surface, the impact of light coming through a stained glass window, ...
 */
export class EffectProjectiveTextureMethod extends EffectMethodBase
{
	public static OVERLAY:string = "overlay";
	public static MULTIPLY:string = "multiply";
	public static ADD:string = "add";
	public static MIX:string = "mix";
	
	private _projector:TextureProjector;
	private _uvVarying:ShaderRegisterElement;
	private _mode:string;
	private _exposure:number;
	private _texture:TextureBase;
	private _onTextureChangedDelegate:(event:TextureProjectorEvent) => void;

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

		this.projector = projector;
		this._exposure = exposure;
		this._mode = mode;
	}

	public iInitVO(shader:ShaderBase, methodVO:MethodVO):void
	{
		if (this._projector.texture)
			methodVO.textureGL = shader.getAbstraction(this._projector.texture);
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO):void
	{
		var index:number = methodVO.fragmentConstantsIndex;
		var data:Float32Array = shader.fragmentConstantData;
		data[index] = this._exposure;
		data[index + 1] = 0.5;
		data[index + 2] = 4;
		data[index + 3] = -1;

		methodVO.vertexMatrices[0] = new Matrix3D(new Float32Array(shader.vertexConstantData.buffer, methodVO.vertexConstantsIndex*4, 16));
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData():void
	{
		super.iCleanCompilationData();
		
		this._uvVarying = null;
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
		
		this.iInvalidateShaderProgram();
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
		this.iInvalidateShaderProgram();
	}
	
	/**
	 * @inheritDoc
	 */
	public iGetVertexCode(shader:ShaderBase, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var projReg:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		methodVO.vertexConstantsIndex = projReg.index*4;

		this._uvVarying = registerCache.getFreeVarying();

		code += "m44 " + this._uvVarying + ", " + sharedRegisters.animatedPosition + ", " + projReg + "\n";

		return code;
	}
	
	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var col:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(col, 1);
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		//var toTexReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		//methodVO.fragmentConstantsIndex = toTexReg.index*4;

		var exposure:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		methodVO.fragmentConstantsIndex = exposure.index*4;

		// code += "mul " + col + ".xy, " + this._uvVarying + ".xy, " + toTexReg + ".xy	\n" +
		// 	"add " + col + ".xy, " + col + ".xy, " + toTexReg + ".xx	\n";
		code += methodVO.textureGL._iGetFragmentCode(col, registerCache, sharedRegisters, this._uvVarying);

		code += "mul " + col + ", " + col + ", " + exposure + ".xxx\n" +
			"add " + col + ", " + col + ", " + exposure + ".xxx\n";
		if (this._mode == EffectProjectiveTextureMethod.MULTIPLY)
			code += "mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + col + ".xyz			\n";
		else if (this._mode == EffectProjectiveTextureMethod.ADD)
			code += "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + col + ".xyz			\n";
		else if (this._mode == EffectProjectiveTextureMethod.MIX) {
			code += "sub " + col + ".xyz, " + col + ".xyz, " + targetReg + ".xyz				\n" +
				"mul " + col + ".xyz, " + col + ".xyz, " + col + ".w						\n" +
				"add " + targetReg + ".xyz, " + targetReg + ".xyz, " + col + ".xyz			\n";
		} else if (this._mode == EffectProjectiveTextureMethod.OVERLAY) {
			code += "sge " + temp + ", " + targetReg + ", " + exposure + ".yyy\n"; // temp = (base >= 0.5)? 1 : 0
			code += "sub " + targetReg + ", " + targetReg + ", " + temp + "\n"; // base = temp? (base - 1 : base)
			code += "sub " + col + ", " + col + ", " + temp + "\n"; // blend = temp? (blend - 1 : blend)
			code += "mul " + col + ", " + col + ", " + targetReg + "\n"; // blend = blend * base
			code += "sub " + targetReg + ", " + exposure + ".yyy, " + temp + "\n"; // base = temp? -0.5 : 0.5
			code += "mul " + targetReg + ", " + exposure + ".zzz, " + targetReg + "\n"; // base = temp? -2 : 2
			code += "mul " + col + ", " + col + ", " + targetReg + "\n"; // blend = blend * ( -2 : 2)
			code += "add " + targetReg + ", " + col + ", " + temp + "\n"; //blend = temp? (blend + 1 : blend)
		} else
			throw new ErrorBase("Unknown mode \"" + this._mode + "\"");

		registerCache.removeFragmentTempUsage(col);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, projection:ProjectionBase):void
	{
		var matrix3D:Matrix3D = Matrix3D.CALCULATION_MATRIX;
		matrix3D.copyFrom(this._projector.projection.viewMatrix3D);
		matrix3D.prepend(renderable.renderSceneTransform);
		methodVO.vertexMatrices[0].copyFrom(matrix3D, true);

		methodVO.textureGL._setRenderState(renderable);
	}
	
	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage):void
	{
		methodVO.textureGL.activate(methodVO.pass._render);
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
	}
}