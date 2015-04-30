import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");

import MethodVO						= require("awayjs-methodmaterials/lib/data/MethodVO");
import ShadingMethodBase			= require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");

/**
 * AmbientBasicMethod provides the default shading method for uniform ambient lighting.
 */
class AmbientBasicMethod extends ShadingMethodBase
{
	private _color:number = 0xffffff;
	private _alpha:number = 1;

	private _colorR:number = 1;
	private _colorG:number = 1;
	private _colorB:number = 1;

	private _ambient:number = 1;

	/**
	 * Creates a new AmbientBasicMethod object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		if (shaderObject.texture)
			shaderObject.uvDependencies++;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		if (!shaderObject.texture) {
			this._color = shaderObject.color;
			this.updateColor();
		}
	}

	/**
	 * The strength of the ambient reflection of the surface.
	 */
	public get ambient():number
	{
		return this._ambient;
	}

	public set ambient(value:number)
	{
		if (this._ambient == value)
			return;

		this._ambient = value;

		this.updateColor();
	}

	/**
	 * The alpha component of the surface.
	 */
	public get alpha():number
	{
		return this._alpha;
	}

	public set alpha(value:number)
	{
		if (this._alpha == value)
			return;

		this._alpha = value;

		this.updateColor();
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase)
	{
		var m:any = method;
		var b:AmbientBasicMethod = <AmbientBasicMethod> m;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (shaderObject.texture) {
			shaderObject.texture._iInitRegisters(shaderObject, registerCache);

			code += shaderObject.texture._iGetFragmentCode(shaderObject, targetReg, registerCache, sharedRegisters.uvVarying);

			if (shaderObject.alphaThreshold > 0) {
				var cutOffReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
				methodVO.fragmentConstantsIndex = cutOffReg.index*4;

				code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" +
					"kil " + targetReg + ".w\n" +
					"add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
			}

		} else {
			var ambientInputRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
			methodVO.fragmentConstantsIndex = ambientInputRegister.index*4;

			code += "mov " + targetReg + ", " + ambientInputRegister + "\n";
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		if (shaderObject.texture) {
			shaderObject.texture.activate(shaderObject);

			if (shaderObject.alphaThreshold > 0)
				shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex] = shaderObject.alphaThreshold;
		} else {
			var index:number = methodVO.fragmentConstantsIndex;
			var data:Array<number> = shaderObject.fragmentConstantData;
			data[index] = this._colorR;
			data[index + 1] = this._colorG;
			data[index + 2] = this._colorB;
			data[index + 3] = this._alpha;
		}
	}

	/**
	 * Updates the ambient color data used by the render state.
	 */
	private updateColor()
	{
		this._colorR = ((this._color >> 16) & 0xff)/0xff*this._ambient;
		this._colorG = ((this._color >> 8) & 0xff)/0xff*this._ambient;
		this._colorB = (this._color & 0xff)/0xff*this._ambient;
	}
}

export = AmbientBasicMethod;