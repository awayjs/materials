import AssetEvent						= require("awayjs-core/lib/events/AssetEvent");
import Camera							= require("awayjs-display/lib/entities/Camera");
import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import RenderableBase					= require("awayjs-renderergl/lib/renderables/RenderableBase");
import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import ShadingMethodBase				= require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");

/**
 * AmbientBasicMethod provides the default shading method for uniform ambient lighting.
 */
class CurveBasicMethod extends ShadingMethodBase
{
	private _color:number = 0xffffff;
	private _alpha:number = 1;

	public _texture:TextureBase;
	private _colorR:number = 1;
	private _colorG:number = 1;
	private _colorB:number = 1;

	private _ambient:number = 1;

	/**
	 * Creates a new AmbientBasicMethod object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO)
	{
		if (this._texture) {
			methodVO.textureVO = shader.getAbstraction(this._texture);
			shader.uvDependencies++;
		} else if (methodVO.textureVO) {
			methodVO.textureVO.onClear(new AssetEvent(AssetEvent.CLEAR, this._texture));
			methodVO.textureVO = null;
		}
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO)
	{
		if (!methodVO.textureVO) {
			this._color = methodVO.pass._renderOwner.style.color;
			this.updateColor();
		}
	}

	/**
	 * The strength of the ambient reflection of the surface.
	 */
	public get ambient():number
	{
		return this._ambient;
	}

	public set ambient(value:number)
	{
		if (this._ambient == value)
			return;

		this._ambient = value;

		this.updateColor();
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

		this.updateColor();
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

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase)
	{
		var m:any = method;
		var b:CurveBasicMethod = <CurveBasicMethod> m;
	}

	/**
	 * @inheritDoc
	 */
    /*
    public iGeVertexCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string {
        var code:string = "";
        code = "mov " + sharedRegisters.uvVarying + " " + registerCache.uv +  " \n";
    }*/
    public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var ambientInputRegister:ShaderRegisterElement;

		if (methodVO.textureVO) {
			code += methodVO.textureVO._iGetFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying);

			if (shader.alphaThreshold > 0) {
				var cutOffReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
				methodVO.fragmentConstantsIndex = cutOffReg.index*4;

				code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" +
					"kil " + targetReg + ".w\n" +
					"add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
			}

		} else {
			ambientInputRegister = registerCache.getFreeFragmentConstant();
			methodVO.fragmentConstantsIndex = ambientInputRegister.index*4;

			code += "mov " + targetReg + ", " + ambientInputRegister + "\n";
		}
        code = "mov " + targetReg + ", " + sharedRegisters.uvVarying + "\n";
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage)
	{
		if (methodVO.textureVO) {
			methodVO.textureVO.activate(methodVO.pass._render);

			if (shader.alphaThreshold > 0)
				shader.fragmentConstantData[methodVO.fragmentConstantsIndex] = shader.alphaThreshold;
		} else {
			var index:number = methodVO.fragmentConstantsIndex;
			var data:Float32Array = shader.fragmentConstantData;
			data[index] = this._colorR;
			data[index + 1] = this._colorG;
			data[index + 2] = this._colorB;
			data[index + 3] = this._alpha;
		}
	}

	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
	{
		if (methodVO.textureVO)
			methodVO.textureVO._setRenderState(renderable);
	}

	/**
	 * Updates the ambient color data used by the render state.
	 */
	private updateColor()
	{
		this._colorR = ((this._color >> 16) & 0xff)/0xff*this._ambient;
		this._colorG = ((this._color >> 8) & 0xff)/0xff*this._ambient;
		this._colorB = (this._color & 0xff)/0xff*this._ambient;
	}
}
export = CurveBasicMethod;