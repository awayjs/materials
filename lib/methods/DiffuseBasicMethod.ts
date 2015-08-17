import Camera						= require("awayjs-display/lib/entities/Camera");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import LightingShader				= require("awayjs-renderergl/lib/shaders/LightingShader");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");

import MethodVO						= require("awayjs-methodmaterials/lib/data/MethodVO");
import ShadingMethodBase			= require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
import LightingMethodBase			= require("awayjs-methodmaterials/lib/methods/LightingMethodBase");

/**
 * DiffuseBasicMethod provides the default shading method for Lambert (dot3) diffuse lighting.
 */
class DiffuseBasicMethod extends LightingMethodBase
{
	private _multiply:boolean = true;

	public _pTotalLightColorReg:ShaderRegisterElement;

	public _texture:TextureBase;
	private _diffuseColor:number = 0xffffff;
	private _ambientColor:number = 0xffffff;
	private _diffuseR:number = 1;
	private _diffuseG:number = 1;
	private _diffuseB:number = 1;
	private _ambientR:number = 1;
	private _ambientG:number = 1;
	private _ambientB:number = 1;

	public _pIsFirstLight:boolean;

	/**
	 * Creates a new DiffuseBasicMethod object.
	 */
	constructor()
	{
		super();
	}

	public iIsUsed(shader:LightingShader):boolean
	{
		if (!shader.numLights)
			return false;

		return true;
	}

	/**
	 * Set internally if diffuse color component multiplies or replaces the ambient color
	 */
	public get multiply():boolean
	{
		return this._multiply;
	}

	public set multiply(value:boolean)
	{
		if (this._multiply == value)
			return;

		this._multiply = value;

		this.iInvalidateShaderProgram();
	}

	public iInitVO(shader:LightingShader, methodVO:MethodVO)
	{
		if (this._texture) {
			methodVO.textureVO = shader.getTextureVO(this._texture);
			shader.uvDependencies++;
		} else if (methodVO.textureVO) {
			methodVO.textureVO.dispose();
			methodVO.textureVO = null;
		}

		if (shader.numLights > 0) {
			shader.usesCommonData = true;
			methodVO.needsNormals = true;
		}
	}

	/**
	 * The color of the diffuse reflection when not using a texture.
	 */
	public get diffuseColor():number
	{
		return this._diffuseColor;
	}

	public set diffuseColor(value:number)
	{
		if (this._diffuseColor == value)
			return;

		this._diffuseColor = value;

		this.updateDiffuse();
	}

	/**
	 * The color of the ambient reflection
	 */
	public get ambientColor():number
	{
		return this._ambientColor;
	}

	public set ambientColor(value:number)
	{
		if (this._ambientColor == value)
			return;

		this._ambientColor = value;

		this.updateAmbient();
	}


	/**
	 * The bitmapData to use to define the diffuse reflection color per texel.
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
	public dispose()
	{
		this._texture = null;
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase)
	{
		var diff:DiffuseBasicMethod = <DiffuseBasicMethod> method;

		this.texture = diff.texture;
		this.multiply = diff.multiply;
		this.diffuseColor = diff.diffuseColor;
		this.ambientColor = diff.ambientColor;
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData()
	{
		super.iCleanCompilationData();

		this._pTotalLightColorReg = null;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shader:LightingShader, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		this._pIsFirstLight = true;

		registerCache.addFragmentTempUsages(this._pTotalLightColorReg = registerCache.getFreeFragmentVectorTemp(), 1);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerLight(shader:LightingShader, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var t:ShaderRegisterElement;

		// write in temporary if not first light, so we can add to total diffuse colour
		if (this._pIsFirstLight) {
			t = this._pTotalLightColorReg;
		} else {
			t = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(t, 1);
		}

		code += "dp3 " + t + ".x, " + lightDirReg + ", " + sharedRegisters.normalFragment + "\n" +
				"max " + t + ".w, " + t + ".x, " + sharedRegisters.commons + ".y\n";

		if (shader.usesLightFallOff)
			code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";

		if (this._iModulateMethod != null)
			code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);

		code += "mul " + t + ", " + t + ".w, " + lightColReg + "\n";

		if (!this._pIsFirstLight) {
			code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
			registerCache.removeFragmentTempUsage(t);
		}

		this._pIsFirstLight = false;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerProbe(shader:LightingShader, methodVO:MethodVO, cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var t:ShaderRegisterElement;

		// write in temporary if not first light, so we can add to total diffuse colour
		if (this._pIsFirstLight) {
			t = this._pTotalLightColorReg;
		} else {
			t = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(t, 1);
		}

		code += "tex " + t + ", " + sharedRegisters.normalFragment + ", " + cubeMapReg + " <cube,linear,miplinear>\n" +
				"mul " + t + ".xyz, " + t + ".xyz, " + weightRegister + "\n";

		if (this._iModulateMethod != null)
			code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);

		if (!this._pIsFirstLight) {
			code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
			registerCache.removeFragmentTempUsage(t);
		}

		this._pIsFirstLight = false;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPostLightingCode(shader:LightingShader, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		var albedo:ShaderRegisterElement;
		var cutOffReg:ShaderRegisterElement;

		// incorporate input from ambient
		if (sharedRegisters.shadowTarget)
			code += this.pApplyShadow(shader, methodVO, registerCache, sharedRegisters);

		registerCache.addFragmentTempUsages(albedo = registerCache.getFreeFragmentVectorTemp(), 1);

		var ambientColorRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		methodVO.fragmentConstantsIndex = ambientColorRegister.index*4;

		if (this._texture) {
			methodVO.textureVO._iInitRegisters(shader, registerCache);

			code += methodVO.textureVO._iGetFragmentCode(shader, albedo, registerCache, sharedRegisters.uvVarying);
		} else {
			var diffuseInputRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

			code += "mov " + albedo + ", " + diffuseInputRegister + "\n";
		}

		code += "sat " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + "\n" +
			"mul " + albedo + ".xyz, " + albedo + ", " + this._pTotalLightColorReg + "\n";

		if (this._multiply) {
			code += "add " + albedo + ".xyz, " + albedo + ", " + ambientColorRegister + "\n" +
				"mul " + targetReg + ".xyz, " + targetReg + ", " + albedo + "\n";
		} else {
			code += "mul " + targetReg + ".xyz, " + targetReg + ", " + ambientColorRegister + "\n" +
				"mul " + this._pTotalLightColorReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" +
				"sub " + targetReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" +
				"add " + targetReg + ".xyz, " + targetReg + ", " + albedo + "\n";
		}

		registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
		registerCache.removeFragmentTempUsage(albedo);

		return code;
	}

	/**
	 * Generate the code that applies the calculated shadow to the diffuse light
	 * @param methodVO The MethodVO object for which the compilation is currently happening.
	 * @param regCache The register cache the compiler is currently using for the register management.
	 */
	public pApplyShadow(shader:LightingShader, methodVO:MethodVO, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:LightingShader, methodVO:MethodVO, stage:Stage)
	{
		if (this._texture) {
			methodVO.textureVO.activate(shader);
		} else {
			var index:number = methodVO.fragmentConstantsIndex;
			var data:Float32Array = shader.fragmentConstantData;
			data[index + 4] = this._diffuseR;
			data[index + 5] = this._diffuseG;
			data[index + 6] = this._diffuseB;
			data[index + 7] = 1;
		}
	}

	/**
	 * Updates the diffuse color data used by the render state.
	 */
	private updateDiffuse()
	{
		this._diffuseR = ((this._diffuseColor >> 16) & 0xff)/0xff;
		this._diffuseG = ((this._diffuseColor >> 8) & 0xff)/0xff;
		this._diffuseB = (this._diffuseColor & 0xff)/0xff;
	}

	/**
	 * Updates the ambient color data used by the render state.
	 */
	private updateAmbient()
	{
		this._ambientR = ((this._ambientColor >> 16) & 0xff)/0xff;
		this._ambientG = ((this._ambientColor >> 8) & 0xff)/0xff;
		this._ambientB = (this._ambientColor & 0xff)/0xff;
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shader:LightingShader, methodVO:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
	{
		//TODO move this to Activate (ambientR/G/B currently calc'd in render state)
		if (shader.numLights > 0) {
			var index:number = methodVO.fragmentConstantsIndex;
			var data:Float32Array = shader.fragmentConstantData;
			data[index] = shader.ambientR*this._ambientR;
			data[index + 1] = shader.ambientG*this._ambientG;
			data[index + 2] = shader.ambientB*this._ambientB;
			data[index + 3] = 1;
		}
	}
}

export = DiffuseBasicMethod;