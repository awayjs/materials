import { Camera } from "@awayjs/display/lib/display/Camera";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { ShadingMethodBase } from "../methods/ShadingMethodBase";
/**
 * AmbientBasicMethod provides the default shading method for uniform ambient lighting.
 */
export declare class AmbientBasicMethod extends ShadingMethodBase {
    private _color;
    private _alpha;
    _texture: TextureBase;
    private _colorR;
    private _colorG;
    private _colorB;
    private _strength;
    /**
     * Creates a new AmbientBasicMethod object.
     */
    constructor();
    /**
     * @inheritDoc
     */
    iInitVO(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * The strength of the ambient reflection of the surface.
     */
    strength: number;
    /**
     * The alpha component of the surface.
     */
    alpha: number;
    /**
     * The texture to use to define the diffuse reflection color per texel.
     */
    texture: TextureBase;
    /**
     * @inheritDoc
     */
    copyFrom(method: ShadingMethodBase): void;
    /**
     * @inheritDoc
     */
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iActivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    iSetRenderState(shader: ShaderBase, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * Updates the ambient color data used by the render state.
     */
    private updateColor();
}
