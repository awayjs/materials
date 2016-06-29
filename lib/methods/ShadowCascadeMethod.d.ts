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
import { ShadowMethodBase } from "../methods/ShadowMethodBase";
/**
 * ShadowCascadeMethod is a shadow map method to apply cascade shadow mapping on materials.
 * Must be used with a DirectionalLight with a CascadeShadowMapper assigned to its shadowMapper property.
 *
 * @see away.lights.CascadeShadowMapper
 */
export declare class ShadowCascadeMethod extends ShadowMapMethodBase {
    private _baseMethod;
    private _cascadeShadowMapper;
    private _depthMapCoordVaryings;
    private _cascadeProjections;
    /**
     * Creates a new ShadowCascadeMethod object.
     *
     * @param shadowMethodBase The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
     */
    constructor(shadowMethodBase: ShadowMethodBase);
    /**
     * The shadow map sampling method used to sample individual cascades. These are typically those used in conjunction
     * with a DirectionalShadowMapper.
     *
     * @see ShadowHardMethod
     * @see ShadowSoftMethod
     */
    baseMethod: ShadowMethodBase;
    /**
     * @inheritDoc
     */
    iInitVO(shader: LightingShader, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iCleanCompilationData(): void;
    /**
     * @inheritDoc
     */
    iGetVertexCode(shader: ShaderBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * Creates the registers for the cascades' projection coordinates.
     */
    private initProjectionsRegs(registerCache);
    /**
     * @inheritDoc
     */
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iActivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    iSetRenderState(shader: ShaderBase, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * Called when the shadow mappers cascade configuration changes.
     */
    private onCascadeChange(event);
    /**
     * Called when the base method's shader code is invalidated.
     */
    private onShaderInvalidated(event);
}
