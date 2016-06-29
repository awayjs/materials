import { Camera } from "@awayjs/display/lib/display/Camera";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { EffectMethodBase } from "../methods/EffectMethodBase";
/**
 * EffectAlphaMaskMethod allows the use of an additional texture to specify the alpha value of the material. When used
 * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
 * etc).
 */
export declare class EffectAlphaMaskMethod extends EffectMethodBase {
    private _texture;
    private _useSecondaryUV;
    /**
     * Creates a new EffectAlphaMaskMethod object.
     *
     * @param texture The texture to use as the alpha mask.
     * @param useSecondaryUV Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently.
     */
    constructor(texture: TextureBase, useSecondaryUV?: boolean);
    /**
     * @inheritDoc
     */
    iInitVO(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently, for
     * instance to tile the main texture and normal map while providing untiled alpha, for example to define the
     * transparency over a tiled water surface.
     */
    useSecondaryUV: boolean;
    /**
     * The texture to use as the alpha mask.
     */
    texture: TextureBase;
    /**
     * @inheritDoc
     */
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iActivate(shader: LightingShader, methodVO: MethodVO, stage: Stage): void;
    iSetRenderState(shader: ShaderBase, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
}
