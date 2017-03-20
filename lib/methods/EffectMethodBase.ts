import {IAsset, AbstractMethodError} from "@awayjs/core";

import {ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {MethodVO} from "../data/MethodVO";

import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * EffectMethodBase forms an abstract base class for shader methods that are not dependent on light sources,
 * and are in essence post-process effects on the materials.
 */
export class EffectMethodBase extends ShadingMethodBase implements IAsset
{
	public static assetType:string = "[asset EffectMethod]";

	constructor()
	{
		super();
	}

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectMethodBase.assetType;
	}

	/**
	 * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
	 * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
	 * @param regCache The register cache used during the compilation.
	 * @param targetReg The register that will be containing the method's output.
	 * @private
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
	}
}