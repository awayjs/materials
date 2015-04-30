import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import ShaderObjectBase					= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import EffectMethodBase					= require("awayjs-methodmaterials/lib/methods/EffectMethodBase");

/**
 * EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
 */
class EffectEnvMapMethod extends EffectMethodBase
{
	private _envMap:TextureBase;
	private _alpha:number;
	private _mask:TextureBase;

	/**
	 * Creates an EffectEnvMapMethod object.
	 * @param envMap The environment map containing the reflected scene.
	 * @param alpha The reflectivity of the surface.
	 */
	constructor(envMap:TextureBase, alpha:number = 1)
	{
		super();
		this._envMap = envMap;
		this._alpha = alpha;

	}

	/**
	 * An optional texture to modulate the reflectivity of the surface.
	 */
	public get mask():TextureBase
	{
		return this._mask;
	}

	public set mask(value:TextureBase)
	{
		if (value == this._mask)
			return;

		this._mask = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		methodVO.needsNormals = true;
		methodVO.needsView = true;

		methodVO.textureObject = shaderObject.getTextureObject(this._envMap);

		if (this._mask != null) {
			methodVO.secondaryTextureObject = shaderObject.getTextureObject(this._mask);
			shaderObject.uvDependencies++;
		}
	}

	/**
	 * The cubic environment map containing the reflected scene.
	 */
	public get envMap():TextureBase
	{
		return this._envMap;
	}

	public set envMap(value:TextureBase)
	{
		if (this._envMap == value)
			return;

		this._envMap = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public dispose()
	{
	}

	/**
	 * The reflectivity of the surface.
	 */
	public get alpha():number
	{
		return this._alpha;
	}

	public set alpha(value:number)
	{
		this._alpha = value;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex] = this._alpha;

		methodVO.textureObject.activate(shaderObject);

		if (this._mask)
			methodVO.secondaryTextureObject.activate(shaderObject);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var dataRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var code:string = "";

		methodVO.fragmentConstantsIndex = dataRegister.index*4;

		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp2, 1);

		methodVO.textureObject._iInitRegisters(shaderObject, registerCache);

		// r = I - 2(I.N)*N
		code += "dp3 " + temp + ".w, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
			"add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" +
			"mul " + temp + ".xyz, " + sharedRegisters.normalFragment + ".xyz, " + temp + ".w\n" +
			"sub " + temp + ".xyz, " + temp + ".xyz, " + sharedRegisters.viewDirFragment + ".xyz\n" +
			methodVO.textureObject._iGetFragmentCode(shaderObject, temp, registerCache, temp) +
			"sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" + // -.5
			"kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
			"sub " + temp + ", " + temp + ", " + targetReg + "\n";

		if (this._mask) {
			methodVO.secondaryTextureObject._iInitRegisters(shaderObject, registerCache);

			code += methodVO.secondaryTextureObject._iGetFragmentCode(shaderObject, temp2, registerCache, sharedRegisters.uvVarying) +
				"mul " + temp + ", " + temp2 + ", " + temp + "\n";
		}

		code += "mul " + temp + ", " + temp + ", " + dataRegister + ".x\n" +
				"add " + targetReg + ", " + targetReg + ", " + temp + "\n";

		registerCache.removeFragmentTempUsage(temp);
		registerCache.removeFragmentTempUsage(temp2);

		return code;
	}
}

export = EffectEnvMapMethod;