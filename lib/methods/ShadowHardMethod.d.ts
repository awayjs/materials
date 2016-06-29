import { LightBase } from "@awayjs/display/lib/display/LightBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { ShadowMethodBase } from "../methods/ShadowMethodBase";
/**
 * ShadowHardMethod provides the cheapest shadow map method by using a single tap without any filtering.
 */
export declare class ShadowHardMethod extends ShadowMethodBase {
    /**
     * Creates a new ShadowHardMethod object.
     */
    constructor(castingLight: LightBase);
    /**
     * @inheritDoc
     */
    _pGetPlanarFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    _pGetPointFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    _iGetCascadeFragmentCode(shader: ShaderBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iActivateForCascade(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
}
