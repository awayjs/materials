import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {GL_DepthTexture} from "./GL_DepthTexture";

/**
 *
 * @class away.pool.GL_DepthTexture
 */
export class GL_ShadowTexture2D extends GL_DepthTexture
{
    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData, inputReg:ShaderRegisterElement):string
    {
        return super._getFragmentCode(targetReg, regCache, sharedRegisters, inputReg) +
            "slt " + targetReg + ".w, " + inputReg + ".z, " + targetReg + ".w\n";// 0 if in shadow, 1 if out of shadow
    }
}