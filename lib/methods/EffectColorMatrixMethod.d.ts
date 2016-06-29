import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { EffectMethodBase } from "../methods/EffectMethodBase";
/**
 * EffectColorMatrixMethod provides a shading method that changes the colour of a material analogous to a ColorMatrixFilter.
 */
export declare class EffectColorMatrixMethod extends EffectMethodBase {
    private _matrix;
    /**
     * Creates a new EffectColorTransformMethod.
     *
     * @param matrix An array of 20 items for 4 x 5 color transform.
     */
    constructor(matrix: Array<number>);
    /**
     * The 4 x 5 matrix to transform the color of the material.
     */
    colorMatrix: Array<number>;
    /**
     * @inheritDoc
     */
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iActivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
}
