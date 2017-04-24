import {AssetEvent} from "@awayjs/core";

import {ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {MethodVO} from "../data/MethodVO";

import {AmbientBasicMethod} from "./AmbientBasicMethod";

/**
 * AmbientEnvMapMethod provides a diffuse shading method that uses a diffuse irradiance environment map to
 * approximate global lighting rather than lights.
 */
export class AmbientEnvMapMethod extends AmbientBasicMethod
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
	public iInitVO(shader:ShaderBase, methodVO:MethodVO):void
	{
		methodVO.needsNormals = true;

		if (this._texture) {
			methodVO.textureGL = shader.getAbstraction(this._texture);
			shader.uvDependencies++;
		} else if (methodVO.textureGL) {
			methodVO.textureGL.onClear(new AssetEvent(AssetEvent.CLEAR, this._texture));
			methodVO.textureGL = null;
		}
	}
	
	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (this._texture)? methodVO.textureGL._iGetFragmentCode(targetReg, regCache, sharedRegisters, sharedRegisters.normalFragment) : "";
	}
}