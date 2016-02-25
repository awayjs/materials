import Camera							= require("awayjs-display/lib/display/Camera");
import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import GL_RenderableBase				= require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
import LightingShader					= require("awayjs-renderergl/lib/shaders/LightingShader");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

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

		if (this._gradient)
			this.iAddTexture(this._gradient);
	}

	public iInitVO(shader:LightingShader, methodVO:MethodVO)
	{
		super.iInitVO(shader, methodVO);

		methodVO.secondaryTextureGL = shader.getAbstraction(this._gradient);
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

		if (this._gradient)
			this.iRemoveTexture(this._gradient);

		this._gradient = value;

		if (this._gradient)
			this.iAddTexture(this._gradient);

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
	public iGetFragmentPreLightingCode(shader:LightingShader, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = super.iGetFragmentPreLightingCode(shader, methodVO, registerCache, sharedRegisters);
		this._pIsFirstLight = true;

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
			code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);

		code += methodVO.secondaryTextureGL._iGetFragmentCode(t, registerCache, sharedRegisters, t) +
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
	public pApplyShadow(shader:LightingShader, methodVO:MethodVO, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var t:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

		return "mov " + t + ", " + sharedRegisters.shadowTarget + ".wwww\n" +
			methodVO.secondaryTextureGL._iGetFragmentCode(t, regCache, sharedRegisters, sharedRegisters.uvVarying) +
			"mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:LightingShader, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shader, methodVO, stage);

		methodVO.secondaryTextureGL.activate(methodVO.pass._render);
	}


	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shader:LightingShader, methodVO:MethodVO, renderable:GL_RenderableBase, stage:Stage, camera:Camera)
	{
		super.iSetRenderState(shader, methodVO, renderable, stage, camera);

		if (shader.numLights > 0)
			methodVO.secondaryTextureGL._setRenderState(renderable);
	}
}

export = DiffuseGradientMethod;