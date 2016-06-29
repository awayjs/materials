import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { ISurface } from "@awayjs/display/lib/base/ISurface";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { PassBase } from "@awayjs/renderer/lib/surfaces/passes/PassBase";
import { IElementsClassGL } from "@awayjs/renderer/lib/elements/IElementsClassGL";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { GL_SurfaceBase } from "@awayjs/renderer/lib/surfaces/GL_SurfaceBase";
/**
 * The SingleObjectDepthPass provides a material pass that renders a single object to a depth map from the point
 * of view from a light.
 */
export declare class SingleObjectDepthPass extends PassBase {
    private _textures;
    private _projections;
    private _textureSize;
    private _polyOffset;
    private _enc;
    private _projectionTexturesInvalid;
    /**
     * The size of the depth map texture to render to.
     */
    textureSize: number;
    /**
     * The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
     */
    polyOffset: number;
    /**
     * Creates a new SingleObjectDepthPass object.
     */
    constructor(render: GL_SurfaceBase, renderOwner: ISurface, elementsClass: IElementsClassGL, stage: Stage);
    /**
     * @inheritDoc
     */
    dispose(): void;
    /**
     * Updates the projection textures used to contain the depth renders.
     */
    private updateProjectionTextures();
    /**
     * @inheritDoc
     */
    _iGetVertexCode(): string;
    /**
     * @inheritDoc
     */
    _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * Gets the depth maps rendered for this object from all lights.
     * @param renderableGL The renderableGL for which to retrieve the depth maps.
     * @param stage3DProxy The Stage3DProxy object currently used for rendering.
     * @return A list of depth map textures for all supported lights.
     */
    _iGetDepthMap(renderableGL: GL_RenderableBase): TextureBase;
    /**
     * Retrieves the depth map projection maps for all lights.
     * @param renderableGL The renderableGL for which to retrieve the projection maps.
     * @return A list of projection maps for all supported lights.
     */
    _iGetProjection(renderableGL: GL_RenderableBase): Matrix3D;
    /**
     * @inheritDoc
     */
    _iRender(renderableGL: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
    /**
     * @inheritDoc
     */
    _iActivate(camera: Camera): void;
}
