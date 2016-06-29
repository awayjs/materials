import { Camera } from "@awayjs/display/lib/display/Camera";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { EffectMethodBase } from "../methods/EffectMethodBase";
/**
 * EffectRefractionEnvMapMethod provides a method to add refracted transparency based on cube maps.
 */
export declare class EffectRefractionEnvMapMethod extends EffectMethodBase {
    private _envMap;
    private _dispersionR;
    private _dispersionG;
    private _dispersionB;
    private _useDispersion;
    private _refractionIndex;
    private _alpha;
    /**
     * Creates a new EffectRefractionEnvMapMethod object. Example values for dispersion are: dispersionR: -0.03, dispersionG: -0.01, dispersionB: = .0015
     *
     * @param envMap The environment map containing the refracted scene.
     * @param refractionIndex The refractive index of the material.
     * @param dispersionR The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
     * @param dispersionG The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
     * @param dispersionB The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
     */
    constructor(envMap: TextureBase, refractionIndex?: number, dispersionR?: number, dispersionG?: number, dispersionB?: number);
    /**
     * @inheritDoc
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iInitVO(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * The cube environment map to use for the refraction.
     */
    envMap: TextureBase;
    /**
     * The refractive index of the material.
     */
    refractionIndex: number;
    /**
     * The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
     */
    dispersionR: number;
    /**
     * The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
     */
    dispersionG: number;
    /**
     * The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
     */
    dispersionB: number;
    /**
     * The amount of transparency of the object. Warning: the alpha applies to the refracted color, not the actual
     * material. A value of 1 will make it appear fully transparent.
     */
    alpha: number;
    /**
     * @inheritDoc
     */
    iActivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    iSetRenderState(shader: ShaderBase, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * @inheritDoc
     */
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
}
