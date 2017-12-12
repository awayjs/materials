import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {LightBase} from "../lights/LightBase";
import {LightingShader} from "../shaders/LightingShader";
import {ShadowHardMethod} from "../methods/ShadowHardMethod";
import {GL_ShadowMapperBase} from "../mappers/GL_ShadowMapperBase";

import {ShadowChunkBase} from "./ShadowChunkBase";

/**
 * ShadowHardChunk provides the cheapest shadow map method by using a single tap without any filtering.
 */
export class ShadowHardChunk extends ShadowChunkBase
{
	/**
	 * Creates a new ShadowHardChunk.
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
        var code:string = this._baseTexture._getFragmentCode(targetReg, registerCache, sharedRegisters, (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg);

		code += super._getFragmentCode(targetReg, registerCache, sharedRegisters);

        return code;
    }


}