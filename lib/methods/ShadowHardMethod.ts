import {ShadowMethodBase, _Shader_ShadowMethodBase} from "./ShadowMethodBase";

/**
 * ShadowHardMethod provides the cheapest shadow map method by using a single tap without any filtering.
 */
export class ShadowHardMethod extends ShadowMethodBase
{
	public static assetType:string = "[asset ShadowHardMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return ShadowHardMethod.assetType;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase} from "@awayjs/renderer";

import {LightBase} from "../lights/LightBase";
import {LightingShader} from "../shaders/LightingShader";
import {_Shader_ShadowMapperBase} from "../mappers/ShadowMapperBase";

/**
 * _Shader_ShadowHardMethod provides the cheapest shadow map method by using a single tap without any filtering.
 */
export class _Shader_ShadowHardMethod extends _Shader_ShadowMethodBase
{
    /**
     * Creates a new _Shader_ShadowHardMethod.
     */
    constructor(method:ShadowHardMethod, shader:LightingShader)
    {
        super(method, shader);
    }


    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = this._baseTexture._getFragmentCode(targetReg, registerCache, sharedRegisters, (<_Shader_ShadowMapperBase> this._baseChunk).depthMapCoordReg);

        code += super._getFragmentCode(targetReg, registerCache, sharedRegisters);

        return code;
    }
}

ShaderBase.registerAbstraction(_Shader_ShadowHardMethod, ShadowHardMethod);