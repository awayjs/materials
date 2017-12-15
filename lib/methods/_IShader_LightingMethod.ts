import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {_IShader_Method} from "./_IShader_Method";

/**
 * LightingChunkBase provides an abstract base method for shading methods that uses lights.
 * Used for diffuse and specular shaders only.
 */
export interface _IShader_LightingMethod extends _IShader_Method
{
	_totalLightColorReg:ShaderRegisterElement;
	
	/**
	 * A function that is exposed to wrappers in case the strength needs to be controlled
	 */
	_modulateFunction:(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => string;

	/**
	 * Get the fragment shader code that will be needed before any per-light code is added.
	 * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
	 * @param regCache The register cache used during the compilation.
	 * @private
	 */
	_getFragmentPreLightingCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	/**
	 * Get the fragment shader code that will generate the code relevant to a single light.
	 *
	 * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
	 * @param lightDirReg The register containing the light direction vector.
	 * @param lightColReg The register containing the light colour.
	 * @param regCache The register cache used during the compilation.
	 */
	_getFragmentCodePerLight(lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	/**
	 * Get the fragment shader code that will generate the code relevant to a single light probe object.
	 *
	 * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
	 * @param cubeMapReg The register containing the cube map for the current probe
	 * @param weightRegister A string representation of the register + component containing the current weight
	 * @param regCache The register cache providing any necessary registers to the shader
	 */
	_getFragmentCodePerProbe(cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;
}