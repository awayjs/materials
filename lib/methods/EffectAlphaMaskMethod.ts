import Camera							= require("awayjs-display/lib/entities/Camera");
import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import RenderableBase					= require("awayjs-renderergl/lib/renderables/RenderableBase");
import LightingShader					= require("awayjs-renderergl/lib/shaders/LightingShader");
import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import EffectMethodBase					= require("awayjs-methodmaterials/lib/methods/EffectMethodBase");

/**
 * EffectAlphaMaskMethod allows the use of an additional texture to specify the alpha value of the material. When used
 * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
 * etc).
 */
class EffectAlphaMaskMethod extends EffectMethodBase
{
	private _texture:TextureBase;
	private _useSecondaryUV:boolean;

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

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO)
	{
		methodVO.textureVO = shader.getAbstraction(this._texture);

		if (this._useSecondaryUV)
			shader.secondaryUVDependencies++;
		else
			shader.uvDependencies++;
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

		this.iInvalidateShaderProgram();
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

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		return methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, this._useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying) +
			"mul " + targetReg + ", " + targetReg + ", " + temp + ".x\n";
	}


	/**
	 * @inheritDoc
	 */
	public iActivate(shader:LightingShader, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shader, methodVO, stage);

		methodVO.textureVO.activate();
	}


	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
	{
		methodVO.textureVO._setRenderState(renderable);
	}
}

export = EffectAlphaMaskMethod;