import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { EffectMethodBase } from "../methods/EffectMethodBase";
/**
 * EffectRimLightMethod provides a method to add rim lighting to a material. This adds a glow-like effect to edges of objects.
 */
export declare class EffectRimLightMethod extends EffectMethodBase {
    static ADD: string;
    static MULTIPLY: string;
    static MIX: string;
    private _color;
    private _blendMode;
    private _colorR;
    private _colorG;
    private _colorB;
    private _strength;
    private _power;
    /**
     * Creates a new <code>EffectRimLightMethod</code> object.
     *
     * @param color The colour of the rim light.
     * @param strength The strength of the rim light.
     * @param power The power of the rim light. Higher values will result in a higher edge fall-off.
     * @param blend The blend mode with which to add the light to the object.
     */
    constructor(color?: number, strength?: number, power?: number, blend?: string);
    /**
     * @inheritDoc
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iInitVO(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * The blend mode with which to add the light to the object.
     *
     * EffectRimLightMethod.MULTIPLY multiplies the rim light with the material's colour.
     * EffectRimLightMethod.ADD adds the rim light with the material's colour.
     * EffectRimLightMethod.MIX provides normal alpha blending.
     */
    blendMode: string;
    /**
     * The color of the rim light.
     */
    color: number;
    /**
     * The strength of the rim light.
     */
    strength: number;
    /**
     * The power of the rim light. Higher values will result in a higher edge fall-off.
     */
    power: number;
    /**
     * @inheritDoc
     */
    iActivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
}
