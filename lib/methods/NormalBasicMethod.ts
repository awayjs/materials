import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

import MethodVO						= require("awayjs-methodmaterials/lib/data/MethodVO");
import ShadingMethodBase			= require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");

/**
 * NormalBasicMethod is the default method for standard tangent-space normal mapping.
 */
class NormalBasicMethod extends ShadingMethodBase
{
	private _normalMap:TextureBase;

	/**
	 * Creates a new NormalBasicMethod object.
	 */
	constructor(normalMap:TextureBase = null)
	{
		super();

		this._normalMap = normalMap;
	}

	public iIsUsed(shader:ShaderBase):boolean
	{
		if (this._normalMap && shader.normalDependencies)
			return true;

		return false;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO)
	{
		if (this._normalMap) {
			methodVO.textureVO = shader.getTextureVO(this._normalMap);
			shader.uvDependencies++;
		}
	}

	/**
	 * Indicates whether or not this method outputs normals in tangent space. Override for object-space normals.
	 */
	public iOutputsTangentNormals():boolean
	{
		return true;
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase)
	{
		var s:any = method;
		var bnm:NormalBasicMethod = <NormalBasicMethod> method;

		if (bnm.normalMap != null)
			this.normalMap = bnm.normalMap;
	}

	/**
	 * The texture containing the normals per pixel.
	 */
	public get normalMap():TextureBase
	{
		return this._normalMap;
	}

	public set normalMap(value:TextureBase)
	{
		if (this._normalMap == value)
			return;

		this._normalMap = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public dispose()
	{
		if (this._normalMap)
			this._normalMap = null;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage)
	{
		if (this._normalMap)
			methodVO.textureVO.activate(shader);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._normalMap) {
			methodVO.textureVO._iInitRegisters(shader, registerCache);

			code += methodVO.textureVO._iGetFragmentCode(shader, targetReg, registerCache, sharedRegisters.uvVarying);
		}

		code += "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx\n" +
			"nrm " + targetReg + ".xyz, " + targetReg + "\n";

		return code;
	}
}

export = NormalBasicMethod;