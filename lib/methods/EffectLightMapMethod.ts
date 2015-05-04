import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import EffectMethodBase					= require("awayjs-methodmaterials/lib/methods/EffectMethodBase");

/**
 * EffectLightMapMethod provides a method that allows applying a light map texture to the calculated pixel colour.
 * It is different from DiffuseLightMapMethod in that the latter only modulates the diffuse shading value rather
 * than the whole pixel colour.
 */
class EffectLightMapMethod extends EffectMethodBase
{
	/**
	 * Indicates the light map should be multiplied with the calculated shading result.
	 */
	public static MULTIPLY:string = "multiply";

	/**
	 * Indicates the light map should be added into the calculated shading result.
	 */
	public static ADD:string = "add";

	private _lightMap:TextureBase;

	private _blendMode:string;
	private _useSecondaryUV:boolean;

	/**
	 * Creates a new EffectLightMapMethod object.
	 *
	 * @param lightMap The texture containing the light map.
	 * @param blendMode The blend mode with which the light map should be applied to the lighting result.
	 * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
	 */
	constructor(lightMap:TextureBase, blendMode:string = "multiply", useSecondaryUV:boolean = false)
	{
		super();

		if (blendMode != EffectLightMapMethod.ADD && blendMode != EffectLightMapMethod.MULTIPLY)
			throw new Error("Unknown blendmode!");

		this._lightMap = lightMap;
		this._blendMode = blendMode;
		this._useSecondaryUV = useSecondaryUV;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO)
	{
		methodVO.textureVO = shader.getTextureVO(this._lightMap);

		if (this._useSecondaryUV)
			shader.secondaryUVDependencies++;
		else
			shader.uvDependencies++;
	}

	/**
	 * The blend mode with which the light map should be applied to the lighting result.
	 *
	 * @see EffectLightMapMethod.ADD
	 * @see EffectLightMapMethod.MULTIPLY
	 */
	public get blendMode():string
	{
		return this._blendMode;
	}

	public set blendMode(value:string)
	{
		if (this._blendMode == value)
			return;

		if (value != EffectLightMapMethod.ADD && value != EffectLightMapMethod.MULTIPLY)
			throw new Error("Unknown blendmode!");

		this._blendMode = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * The lightMap containing the light map.
	 */
	public get lightMap():TextureBase
	{
		return this._lightMap;
	}

	public set lightMap(value:TextureBase)
	{
		if (this._lightMap == value)
			return;

		this._lightMap = value;

		this.iInvalidateShaderProgram();
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

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string;
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		code = methodVO.secondaryTextureVO._iGetFragmentCode(shader, temp, registerCache, this._useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);

		switch (this._blendMode) {
			case EffectLightMapMethod.MULTIPLY:
				code += "mul " + targetReg + ", " + targetReg + ", " + temp + "\n";
				break;
			case EffectLightMapMethod.ADD:
				code += "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
				break;
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shader, methodVO, stage);

		methodVO.textureVO.activate(shader);
	}
}

export = EffectLightMapMethod;