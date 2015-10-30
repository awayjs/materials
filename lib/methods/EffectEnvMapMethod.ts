import Camera							= require("awayjs-display/lib/entities/Camera");
import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import RenderableBase					= require("awayjs-renderergl/lib/renderables/RenderableBase");
import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

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
	public iInitVO(shader:ShaderBase, methodVO:MethodVO)
	{
		methodVO.needsNormals = true;
		methodVO.needsView = true;

		methodVO.textureVO = shader.getTextureVO(this._envMap);

		if (this._mask != null) {
			methodVO.secondaryTextureVO = shader.getTextureVO(this._mask);
			shader.uvDependencies++;
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
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage)
	{
		shader.fragmentConstantData[methodVO.fragmentConstantsIndex] = this._alpha;

		methodVO.textureVO.activate(shader);

		if (this._mask)
			methodVO.secondaryTextureVO.activate(shader);
	}

	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
	{
		methodVO.textureVO._setRenderState(renderable, shader);

		if (this._mask)
			methodVO.secondaryTextureVO._setRenderState(renderable, shader);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var dataRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var code:string = "";

		methodVO.fragmentConstantsIndex = dataRegister.index*4;

		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp2, 1);

		// r = I - 2(I.N)*N
		code += "dp3 " + temp + ".w, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
			"add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" +
			"mul " + temp + ".xyz, " + sharedRegisters.normalFragment + ".xyz, " + temp + ".w\n" +
			"sub " + temp + ".xyz, " + temp + ".xyz, " + sharedRegisters.viewDirFragment + ".xyz\n" +
			methodVO.textureVO._iGetFragmentCode(shader, temp, registerCache, sharedRegisters, temp) +
			"sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" + // -.5
			"kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
			"sub " + temp + ", " + temp + ", " + targetReg + "\n";

		if (this._mask) {
			code += methodVO.secondaryTextureVO._iGetFragmentCode(shader, temp2, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
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