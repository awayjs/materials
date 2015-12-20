import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import AmbientBasicMethod				= require("awayjs-methodmaterials/lib/methods/AmbientBasicMethod");

/**
 * AmbientEnvMapMethod provides a diffuse shading method that uses a diffuse irradiance environment map to
 * approximate global lighting rather than lights.
 */
class AmbientEnvMapMethod extends AmbientBasicMethod
{
	/**
	 * Creates a new <code>AmbientEnvMapMethod</code> object.
	 *
	 * @param envMap The cube environment map to use for the ambient lighting.
	 */
	constructor()
	{
		super();
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO)
	{
		methodVO.needsNormals = true;
	}
	
	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return shader.textureVO._iGetFragmentCode(targetReg, regCache, sharedRegisters, sharedRegisters.normalFragment);
	}
}

export = AmbientEnvMapMethod;