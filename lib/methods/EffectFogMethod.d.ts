import { Stage } from "@awayjs/stage/lib/base/Stage";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { EffectMethodBase } from "../methods/EffectMethodBase";
/**
 * EffectFogMethod provides a method to add distance-based fog to a material.
 */
export declare class EffectFogMethod extends EffectMethodBase {
    private _minDistance;
    private _maxDistance;
    private _fogColor;
    private _fogR;
    private _fogG;
    private _fogB;
    /**
     * Creates a new EffectFogMethod object.
     * @param minDistance The distance from which the fog starts appearing.
     * @param maxDistance The distance at which the fog is densest.
     * @param fogColor The colour of the fog.
     */
    constructor(minDistance: number, maxDistance: number, fogColor?: number);
    /**
     * @inheritDoc
     */
    iInitVO(shader: LightingShader, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * The distance from which the fog starts appearing.
     */
    minDistance: number;
    /**
     * The distance at which the fog is densest.
     */
    maxDistance: number;
    /**
     * The colour of the fog.
     */
    fogColor: number;
    /**
     * @inheritDoc
     */
    iActivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
}
