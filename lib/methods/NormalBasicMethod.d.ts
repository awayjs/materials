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
 * NormalBasicMethod is the default method for standard tangent-space normal mapping.
 */
export declare class NormalBasicMethod extends ShadingMethodBase {
    private _texture;
    /**
     * Creates a new NormalBasicMethod object.
     */
    constructor(texture?: TextureBase);
    iIsUsed(shader: ShaderBase): boolean;
    /**
     * @inheritDoc
     */
    iInitVO(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * Indicates whether or not this method outputs normals in tangent space. Override for object-space normals.
     */
    iOutputsTangentNormals(): boolean;
    /**
     * @inheritDoc
     */
    copyFrom(method: ShadingMethodBase): void;
    /**
     * A texture to modulate the direction of the surface for each texel (normal map). The default normal method expects
     * tangent-space normal maps, but others could expect object-space maps.
     */
    texture: TextureBase;
    /**
     * @inheritDoc
     */
    dispose(): void;
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
