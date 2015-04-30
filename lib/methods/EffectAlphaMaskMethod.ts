import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import ShaderLightingObject				= require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
import ShaderObjectBase					= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");

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
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		methodVO.textureObject = shaderObject.getTextureObject(this._texture);

		if (this._useSecondaryUV)
			shaderObject.secondaryUVDependencies++;
		else
			shaderObject.uvDependencies++;
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

		this._texture = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		return methodVO.textureObject._iGetFragmentCode(shaderObject, temp, registerCache, this._useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying) +
			"mul " + targetReg + ", " + targetReg + ", " + temp + ".x\n";
	}


	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shaderObject, methodVO, stage);

		methodVO.textureObject.activate(shaderObject);
	}
}

export = EffectAlphaMaskMethod;