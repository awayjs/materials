import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { DiffuseBasicMethod } from "../methods/DiffuseBasicMethod";
/**
 * DiffuseDepthMethod provides a debug method to visualise depth maps
 */
export declare class DiffuseDepthMethod extends DiffuseBasicMethod {
    /**
     * Creates a new DiffuseBasicMethod object.
     */
    constructor();
    /**
     * @inheritDoc
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iGetFragmentPostLightingCode(shader: LightingShader, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
}
