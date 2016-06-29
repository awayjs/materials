import { LightBase } from "@awayjs/display/lib/display/LightBase";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { ShadowMapMethodBase } from "../methods/ShadowMapMethodBase";
/**
 * ShadowMethodBase provides an abstract method for simple (non-wrapping) shadow map methods.
 */
export declare class ShadowMethodBase extends ShadowMapMethodBase {
    _pDepthMapCoordReg: ShaderRegisterElement;
    _pUsePoint: boolean;
    /**
     * Creates a new ShadowMethodBase object.
     * @param castingLight The light used to cast shadows.
     */
    constructor(castingLight: LightBase);
    /**
     * @inheritDoc
     */
    iInitVO(shader: LightingShader, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * Wrappers that override the vertex shader need to set this explicitly
     */
    _iDepthMapCoordReg: ShaderRegisterElement;
    /**
     * @inheritDoc
     */
    iCleanCompilationData(): void;
    /**
     * @inheritDoc
     */
    iGetVertexCode(shader: ShaderBase, methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * Gets the vertex code for shadow mapping with a point light.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     */
    _pGetPointVertexCode(methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * Gets the vertex code for shadow mapping with a planar shadow map (fe: directional lights).
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     */
    pGetPlanarVertexCode(methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * Gets the fragment code for shadow mapping with a planar shadow map.
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     * @param targetReg The register to contain the shadow coverage
     * @return
     */
    _pGetPlanarFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * Gets the fragment code for shadow mapping with a point light.
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     * @param targetReg The register to contain the shadow coverage
     * @return
     */
    _pGetPointFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iSetRenderState(shader: ShaderBase, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * Gets the fragment code for combining this method with a cascaded shadow map method.
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     * @param decodeRegister The register containing the data to decode the shadow map depth value.
     * @param depthTexture The texture containing the shadow map.
     * @param depthProjection The projection of the fragment relative to the light.
     * @param targetRegister The register to contain the shadow coverage
     * @return
     */
    _iGetCascadeFragmentCode(shader: ShaderBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iActivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * Sets the method state for cascade shadow mapping.
     */
    iActivateForCascade(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
}
