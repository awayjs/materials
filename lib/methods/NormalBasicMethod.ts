import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");

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

	public iIsUsed(shaderObject:ShaderObjectBase):boolean
	{
		if (this._normalMap && shaderObject.normalDependencies)
			return true;

		return false;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		if (this._normalMap) {
			methodVO.textureObject = shaderObject.getTextureObject(this._normalMap);
			shaderObject.uvDependencies++;
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
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		if (this._normalMap)
			methodVO.textureObject.activate(shaderObject);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._normalMap) {
			methodVO.textureObject._iInitRegisters(shaderObject, registerCache);

			code += methodVO.textureObject._iGetFragmentCode(shaderObject, targetReg, registerCache, sharedRegisters.uvVarying);
		}

		code += "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx\n" +
			"nrm " + targetReg + ".xyz, " + targetReg + "\n";

		return code;
	}
}

export = NormalBasicMethod;