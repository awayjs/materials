import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import ShaderLightingObject				= require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import DiffuseBasicMethod				= require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
import DiffuseCompositeMethod			= require("awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod");

/**
 * DiffuseLightMapMethod provides a diffuse shading method that uses a light map to modulate the calculated diffuse
 * lighting. It is different from EffectLightMapMethod in that the latter modulates the entire calculated pixel color, rather
 * than only the diffuse lighting value.
 */
class DiffuseLightMapMethod extends DiffuseCompositeMethod
{
	/**
	 * Indicates the light map should be multiplied with the calculated shading result.
	 * This can be used to add pre-calculated shadows or occlusion.
	 */
	public static MULTIPLY:string = "multiply";

	/**
	 * Indicates the light map should be added into the calculated shading result.
	 * This can be used to add pre-calculated lighting or global illumination.
	 */
	public static ADD:string = "add";

	private _lightMap:TextureBase;
	private _blendMode:string;
	private _useSecondaryUV:boolean;

	/**
	 * Creates a new DiffuseLightMapMethod method.
	 *
	 * @param lightMap The texture containing the light map.
	 * @param blendMode The blend mode with which the light map should be applied to the lighting result.
	 * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
	 * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
	 */
	constructor(lightMap:TextureBase, blendMode:string = "multiply", useSecondaryUV:boolean = false, baseMethod:DiffuseBasicMethod = null)
	{
		super(null, baseMethod);

		this._useSecondaryUV = useSecondaryUV;
		this._lightMap = lightMap;
		this.blendMode = blendMode;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderLightingObject, methodVO:MethodVO)
	{
		methodVO.secondaryTextureObject = shaderObject.getTextureObject(this._lightMap);

		if (this._useSecondaryUV)
			shaderObject.secondaryUVDependencies++;
		else
			shaderObject.uvDependencies++;
	}

	/**
	 * The blend mode with which the light map should be applied to the lighting result.
	 *
	 * @see DiffuseLightMapMethod.ADD
	 * @see DiffuseLightMapMethod.MULTIPLY
	 */
	public get blendMode():string
	{
		return this._blendMode;
	}

	public set blendMode(value:string)
	{
		if (value != DiffuseLightMapMethod.ADD && value != DiffuseLightMapMethod.MULTIPLY)
			throw new Error("Unknown blendmode!");

		if (this._blendMode == value)
			return;

		this._blendMode = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * The texture containing the light map data.
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
	public iGetFragmentPostLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string;
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		methodVO.secondaryTextureObject._iInitRegisters(shaderObject, registerCache);

		code = methodVO.secondaryTextureObject._iGetFragmentCode(shaderObject, temp, registerCache, this._useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);

		switch (this._blendMode) {
			case DiffuseLightMapMethod.MULTIPLY:
				code += "mul " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
				break;
			case DiffuseLightMapMethod.ADD:
				code += "add " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
				break;
		}

		code += super.iGetFragmentPostLightingCode(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shaderObject, methodVO, stage);

		methodVO.secondaryTextureObject.activate(shaderObject);
	}
}

export = DiffuseLightMapMethod;