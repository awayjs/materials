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
 * EffectFresnelEnvMapMethod provides a method to add fresnel-based reflectivity to an object using cube maps, which gets
 * stronger as the viewing angle becomes more grazing.
 */
class EffectFresnelEnvMapMethod extends EffectMethodBase
{
	private _envMap:TextureBase;
	private _fresnelPower:number = 5;
	private _normalReflectance:number = 0;
	private _alpha:number;
	private _mask:TextureBase;

	/**
	 * Creates a new <code>EffectFresnelEnvMapMethod</code> object.
	 *
	 * @param envMap The environment map containing the reflected scene.
	 * @param alpha The reflectivity of the material.
	 */
	constructor(envMap:TextureBase, alpha:number = 1)
	{
		super();

		this._envMap = envMap;
		this._alpha = alpha;
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
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO)
	{
		shader.fragmentConstantData[methodVO.fragmentConstantsIndex + 3] = 1;
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
		if (this._mask == value)
			return;
		
		this._mask = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
	 */
	public get fresnelPower():number
	{
		return this._fresnelPower;
	}

	public set fresnelPower(value:number)
	{
		this._fresnelPower = value;
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
		this._envMap = value;
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
	 * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
	 */
	public get normalReflectance():number
	{
		return this._normalReflectance;
	}

	public set normalReflectance(value:number)
	{
		this._normalReflectance = value;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage)
	{
		var data:Float32Array = shader.fragmentConstantData;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		data[index] = this._alpha;
		data[index + 1] = this._normalReflectance;
		data[index + 2] = this._fresnelPower;

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
		var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;
		var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;

		methodVO.fragmentConstantsIndex = dataRegister.index*4;

		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp2, 1);

		// r = V - 2(V.N)*N
		code += "dp3 " + temp + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
				"add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" +
				"mul " + temp + ".xyz, " + normalReg + ".xyz, " + temp + ".w\n" +
				"sub " + temp + ".xyz, " + temp + ".xyz, " + viewDirReg + ".xyz\n" +
			methodVO.textureVO._iGetFragmentCode(shader, temp, registerCache, sharedRegisters, temp) +
				"sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" +               	// -.5
				"kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
				"sub " + temp + ", " + temp + ", " + targetReg + "\n";

		// calculate fresnel term
		code += "dp3 " + viewDirReg + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +  // dot(V, H)
				"sub " + viewDirReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" +       // base = 1-dot(V, H)
				"pow " + viewDirReg + ".w, " + viewDirReg + ".w, " + dataRegister + ".z\n" +       // exp = pow(base, 5)
				"sub " + normalReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" +        // 1 - exp
				"mul " + normalReg + ".w, " + dataRegister + ".y, " + normalReg + ".w\n" +         // f0*(1 - exp)
				"add " + viewDirReg + ".w, " + viewDirReg + ".w, " + normalReg + ".w\n" +          // exp + f0*(1 - exp)

				// total alpha
				"mul " + viewDirReg + ".w, " + dataRegister + ".x, " + viewDirReg + ".w\n";

		if (this._mask) {
			code += methodVO.secondaryTextureVO._iGetFragmentCode(shader, temp2, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
				"mul " + viewDirReg + ".w, " + temp2 + ".x, " + viewDirReg + ".w\n";
		}

		// blend
		code += "mul " + temp + ", " + temp + ", " + viewDirReg + ".w\n" +
				"add " + targetReg + ", " + targetReg + ", " + temp + "\n";

		registerCache.removeFragmentTempUsage(temp);
		registerCache.removeFragmentTempUsage(temp2);

		return code;
	}
}

export = EffectFresnelEnvMapMethod;