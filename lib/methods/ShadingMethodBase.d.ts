import { AssetBase } from "@awayjs/core/lib/library/AssetBase";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { ISurface } from "@awayjs/display/lib/base/ISurface";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
/**
 * ShadingMethodBase provides an abstract base method for shading methods, used by compiled passes to compile
 * the final shading program.
 */
export declare class ShadingMethodBase extends AssetBase {
    _textures: Array<TextureBase>;
    _owners: Array<ISurface>;
    _counts: Array<number>;
    static assetType: string;
    /**
     * @inheritDoc
     */
    readonly assetType: string;
    /**
     * Create a new ShadingMethodBase object.
     */
    constructor();
    iIsUsed(shader: ShaderBase): boolean;
    /**
     * Initializes the properties for a MethodVO, including register and texture indices.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    iInitVO(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * Initializes unchanging shader constants using the data from a MethodVO.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * Indicates whether or not this method expects normals in tangent space. Override for object-space normals.
     */
    iUsesTangentSpace(): boolean;
    /**
     * Cleans up any resources used by the current object.
     */
    dispose(): void;
    iAddOwner(owner: ISurface): void;
    iRemoveOwner(owner: ISurface): void;
    /**
     *
     */
    iAddTexture(texture: TextureBase): void;
    /**
     *
     */
    iRemoveTexture(texture: TextureBase): void;
    /**
     * Resets the compilation state of the method.
     *
     * @internal
     */
    iReset(): void;
    /**
     * Resets the method's state for compilation.
     *
     * @internal
     */
    iCleanCompilationData(): void;
    /**
     * Get the vertex shader code for this method.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     *
     * @internal
     */
    iGetVertexCode(shader: ShaderBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * Sets the render state for this method.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param stage The Stage object currently used for rendering.
     *
     * @internal
     */
    iActivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * Sets the render state for a single renderable.
     *
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param renderable The renderable currently being rendered.
     * @param stage The Stage object currently used for rendering.
     * @param camera The camera from which the scene is currently rendered.
     *
     * @internal
     */
    iSetRenderState(shader: ShaderBase, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * Clears the render state for this method.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param stage The Stage object currently used for rendering.
     *
     * @internal
     */
    iDeactivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     *
     * @internal
     */
    iInvalidateShaderProgram(): void;
    /**
     * Copies the state from a ShadingMethodBase object into the current object.
     */
    copyFrom(method: ShadingMethodBase): void;
}
