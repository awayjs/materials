import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import EffectMethodBase					= require("awayjs-methodmaterials/lib/methods/EffectMethodBase");

/**
 * EffectRefractionEnvMapMethod provides a method to add refracted transparency based on cube maps.
 */
class EffectRefractionEnvMapMethod extends EffectMethodBase
{
	private _envMap:TextureBase;

	private _dispersionR:number = 0;
	private _dispersionG:number = 0;
	private _dispersionB:number = 0;
	private _useDispersion:boolean;
	private _refractionIndex:number;
	private _alpha:number = 1;

	/**
	 * Creates a new EffectRefractionEnvMapMethod object. Example values for dispersion are: dispersionR: -0.03, dispersionG: -0.01, dispersionB: = .0015
	 *
	 * @param envMap The environment map containing the refracted scene.
	 * @param refractionIndex The refractive index of the material.
	 * @param dispersionR The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
	 * @param dispersionG The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
	 * @param dispersionB The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
	 */
	constructor(envMap:TextureBase, refractionIndex:number = .1, dispersionR:number = 0, dispersionG:number = 0, dispersionB:number = 0)
	{
		super();
		this._envMap = envMap;
		this._dispersionR = dispersionR;
		this._dispersionG = dispersionG;
		this._dispersionB = dispersionB;
		this._useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
		this._refractionIndex = refractionIndex;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO)
	{
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		var data:Array<number> = shader.fragmentConstantData;
		data[index + 4] = 1;
		data[index + 5] = 0;
		data[index + 7] = 1;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO)
	{
		methodVO.needsNormals = true;
		methodVO.needsView = true;

		methodVO.textureVO = shader.getTextureVO(this._envMap);
	}

	/**
	 * The cube environment map to use for the refraction.
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
	 * The refractive index of the material.
	 */
	public get refractionIndex():number
	{
		return this._refractionIndex;
	}

	public set refractionIndex(value:number)
	{
		this._refractionIndex = value;
	}

	/**
	 * The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
	 */
	public get dispersionR():number
	{
		return this._dispersionR;
	}

	public set dispersionR(value:number)
	{
		this._dispersionR = value;

		var useDispersion:boolean = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
		if (this._useDispersion != useDispersion) {
			this.iInvalidateShaderProgram();
			this._useDispersion = useDispersion;
		}
	}

	/**
	 * The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
	 */
	public get dispersionG():number
	{
		return this._dispersionG;
	}

	public set dispersionG(value:number)
	{
		this._dispersionG = value;

		var useDispersion:boolean = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
		if (this._useDispersion != useDispersion) {
			this.iInvalidateShaderProgram();
			this._useDispersion = useDispersion;
		}
	}

	/**
	 * The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
	 */
	public get dispersionB():number
	{
		return this._dispersionB;
	}

	public set dispersionB(value:number)
	{
		this._dispersionB = value;

		var useDispersion:boolean = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
		if (this._useDispersion != useDispersion) {
			this.iInvalidateShaderProgram();
			this._useDispersion = useDispersion;
		}
	}

	/**
	 * The amount of transparency of the object. Warning: the alpha applies to the refracted color, not the actual
	 * material. A value of 1 will make it appear fully transparent.
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
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		var data:Array<number> = shader.fragmentConstantData;

		data[index] = this._dispersionR + this._refractionIndex;

		if (this._useDispersion) {
			data[index + 1] = this._dispersionG + this._refractionIndex;
			data[index + 2] = this._dispersionB + this._refractionIndex;
		}
		data[index + 3] = this._alpha;

		methodVO.textureVO.activate(shader);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		// todo: data2.x could use common reg, so only 1 reg is used
		var data:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var data2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var code:string = "";
		var refractionDir:ShaderRegisterElement;
		var refractionColor:ShaderRegisterElement;
		var temp:ShaderRegisterElement;

		methodVO.fragmentConstantsIndex = data.index*4;

		refractionDir = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(refractionDir, 1);
		refractionColor = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(refractionColor, 1);
		temp = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);

		var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;
		var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;

		methodVO.textureVO._iInitRegisters(shader, registerCache);

		code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";

		code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
			"mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
			"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
			"mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" +
			"mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" +
			"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
			"sqt " + temp + ".y, " + temp + ".w\n" +

			"mul " + temp + ".x, " + data + ".x, " + temp + ".x\n" +
			"add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
			"mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +

			"mul " + refractionDir + ", " + data + ".x, " + viewDirReg + "\n" +
			"sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
			"nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" +
		methodVO.textureVO._iGetFragmentCode(shader, refractionColor, registerCache, refractionDir) +
			"sub " + refractionColor + ".w, " + refractionColor + ".w, fc0.x	\n" +
			"kil " + refractionColor + ".w\n";

		if (this._useDispersion) {
			// GREEN
			code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
				"mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
				"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
				"mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" +
				"mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" +
				"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
				"sqt " + temp + ".y, " + temp + ".w\n" +

				"mul " + temp + ".x, " + data + ".y, " + temp + ".x\n" +
				"add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
				"mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +

				"mul " + refractionDir + ", " + data + ".y, " + viewDirReg + "\n" +
				"sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
				"nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" +
			methodVO.textureVO._iGetFragmentCode(shader, temp, registerCache, refractionDir) +
				"mov " + refractionColor + ".y, " + temp + ".y\n";

			// BLUE
			code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
				"mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
				"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
				"mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" +
				"mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" +
				"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
				"sqt " + temp + ".y, " + temp + ".w\n" +

				"mul " + temp + ".x, " + data + ".z, " + temp + ".x\n" +
				"add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
				"mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +

				"mul " + refractionDir + ", " + data + ".z, " + viewDirReg + "\n" +
				"sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
				"nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" +
			methodVO.textureVO._iGetFragmentCode(shader, temp, registerCache, refractionDir) +
				"mov " + refractionColor + ".z, " + temp + ".z\n";
		}

		code += "sub " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + targetReg + ".xyz\n" +
			"mul " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + data + ".w\n" +
			"add " + targetReg + ".xyz, " + targetReg + ".xyz, " + refractionColor + ".xyz\n";

		registerCache.removeFragmentTempUsage(temp);
		registerCache.removeFragmentTempUsage(refractionDir);
		registerCache.removeFragmentTempUsage(refractionColor);

		// restore
		code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";

		return code;
	}
}

export = EffectRefractionEnvMapMethod;