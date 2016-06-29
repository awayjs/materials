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
 * EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
 */
export declare class EffectEnvMapMethod extends EffectMethodBase {
    private _envMap;
    private _alpha;
    private _mask;
    /**
     * Creates an EffectEnvMapMethod object.
     * @param envMap The environment map containing the reflected scene.
     * @param alpha The reflectivity of the surface.
     */
    constructor(envMap: TextureBase, alpha?: number);
    /**
     * An optional texture to modulate the reflectivity of the surface.
     */
    mask: TextureBase;
    /**
     * @inheritDoc
     */
    iInitVO(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * The cubic environment map containing the reflected scene.
     */
    envMap: TextureBase;
    /**
     * @inheritDoc
     */
    dispose(): void;
    /**
     * The reflectivity of the surface.
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
