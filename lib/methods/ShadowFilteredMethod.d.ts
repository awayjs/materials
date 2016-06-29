import { DirectionalLight } from "@awayjs/display/lib/display/DirectionalLight";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { ShadowMethodBase } from "../methods/ShadowMethodBase";
/**
 * ShadowFilteredMethod provides a softened shadowing technique by bilinearly interpolating shadow comparison
 * results of neighbouring pixels.
 */
export declare class ShadowFilteredMethod extends ShadowMethodBase {
    /**
     * Creates a new DiffuseBasicMethod object.
     *
     * @param castingLight The light casting the shadow
     */
    constructor(castingLight: DirectionalLight);
    /**
     * @inheritDoc
     */
    iInitConstants(shader: LightingShader, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    _pGetPlanarFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iActivateForCascade(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    _iGetCascadeFragmentCode(shader: ShaderBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
}
