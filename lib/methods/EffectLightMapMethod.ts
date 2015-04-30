import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import ShaderObjectBase					= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");

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
	public iInitVO(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		methodVO.textureObject = shaderObject.getTextureObject(this._lightMap);

		if (this._useSecondaryUV)
			shaderObject.secondaryUVDependencies++;
		else
			shaderObject.uvDependencies++;
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
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string;
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		code = methodVO.secondaryTextureObject._iGetFragmentCode(shaderObject, temp, registerCache, this._useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);

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
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shaderObject, methodVO, stage);

		methodVO.textureObject.activate(shaderObject);
	}
}

export = EffectLightMapMethod;