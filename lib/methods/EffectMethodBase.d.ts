import { IAsset } from "@awayjs/core/lib/library/IAsset";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { ShadingMethodBase } from "../methods/ShadingMethodBase";
/**
 * EffectMethodBase forms an abstract base class for shader methods that are not dependent on light sources,
 * and are in essence post-process effects on the materials.
 */
export declare class EffectMethodBase extends ShadingMethodBase implements IAsset {
    static assetType: string;
    constructor();
    /**
     * @inheritDoc
     */
    readonly assetType: string;
    /**
     * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
     * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
     * @param regCache The register cache used during the compilation.
     * @param targetReg The register that will be containing the method's output.
     * @private
     */
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
}
