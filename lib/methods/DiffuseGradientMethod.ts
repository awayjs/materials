import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import ShaderLightingObject				= require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import DiffuseBasicMethod				= require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");

/**
 * DiffuseGradientMethod is an alternative to DiffuseBasicMethod in which the shading can be modulated with a gradient
 * to introduce color-tinted shading as opposed to the single-channel diffuse strength. This can be used as a crude
 * approximation to subsurface scattering (for instance, the mid-range shading for skin can be tinted red to similate
 * scattered light within the skin attributing to the final colour)
 */
class DiffuseGradientMethod extends DiffuseBasicMethod
{
	private _gradient:TextureBase;

	/**
	 * Creates a new DiffuseGradientMethod object.
	 * @param gradient A texture that contains the light colour based on the angle. This can be used to change
	 * the light colour due to subsurface scattering when the surface faces away from the light.
	 */
	constructor(gradient:TextureBase)
	{
		super();

		this._gradient = gradient;
	}

	public iInitVO(shaderObject:ShaderLightingObject, methodVO:MethodVO)
	{
		super.iInitVO(shaderObject, methodVO);

		methodVO.secondaryTextureObject = shaderObject.getTextureObject(this._gradient);
	}

	/**
	 * A texture that contains the light colour based on the angle. This can be used to change the light colour
	 * due to subsurface scattering when the surface faces away from the light.
	 */
	public get gradient():TextureBase
	{
		return this._gradient;
	}

	public set gradient(value:TextureBase)
	{
		if (this._gradient == value)
			return;

		this._gradient = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData()
	{
		super.iCleanCompilationData();
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = super.iGetFragmentPreLightingCode(shaderObject, methodVO, registerCache, sharedRegisters);
		this._pIsFirstLight = true;

		if (shaderObject.numLights > 0)
			methodVO.secondaryTextureObject._iInitRegisters(shaderObject, registerCache);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerLight(shaderObject:ShaderLightingObject, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var t:ShaderRegisterElement;

		// write in temporary if not first light, so we can add to total diffuse colour
		if (this._pIsFirstLight)
			t = this._pTotalLightColorReg;
		else {
			t = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(t, 1);
		}

		code += "dp3 " + t + ".w, " + lightDirReg + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
			"mul " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".x\n" +
			"add " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".x\n" +
			"mul " + t + ".xyz, " + t + ".w, " + lightDirReg + ".w\n";

		if (this._iModulateMethod != null)
			code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);

		code += methodVO.secondaryTextureObject._iGetFragmentCode(shaderObject, t, registerCache, t) +
			//					"mul " + t + ".xyz, " + t + ".xyz, " + t + ".w\n" +
			"mul " + t + ".xyz, " + t + ".xyz, " + lightColReg + ".xyz\n";

		if (!this._pIsFirstLight) {
			code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
			registerCache.removeFragmentTempUsage(t);
		}

		this._pIsFirstLight = false;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public pApplyShadow(shaderObject:ShaderLightingObject, methodVO:MethodVO, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var t:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

		return "mov " + t + ", " + sharedRegisters.shadowTarget + ".wwww\n" +
			methodVO.secondaryTextureObject._iGetFragmentCode(shaderObject, t, regCache, sharedRegisters.uvVarying) +
			"mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
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

export = DiffuseGradientMethod;