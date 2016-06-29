import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { ShadowMethodBase } from "../methods/ShadowMethodBase";
/**
 * ShadowNearMethod provides a shadow map method that restricts the shadowed area near the camera to optimize
 * shadow map usage. This method needs to be used in conjunction with a NearDirectionalShadowMapper.
 *
 * @see away.lights.NearDirectionalShadowMapper
 */
export declare class ShadowNearMethod extends ShadowMethodBase {
    private _baseMethod;
    private _fadeRatio;
    private _nearShadowMapper;
    private _onShaderInvalidatedDelegate;
    /**
     * Creates a new ShadowNearMethod object.
     * @param baseMethod The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
     * @param fadeRatio The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
     */
    constructor(baseMethod: ShadowMethodBase, fadeRatio?: number);
    /**
     * The base shadow map method on which this method's shading is based.
     */
    baseMethod: ShadowMethodBase;
    /**
     * @inheritDoc
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iInitVO(shader: LightingShader, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    dispose(): void;
    /**
     * @inheritDoc
     */
    alpha: number;
    /**
     * @inheritDoc
     */
    epsilon: number;
    /**
     * The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
     */
    fadeRatio: number;
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
    iDeactivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    iSetRenderState(shader: ShaderBase, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * @inheritDoc
     */
    iGetVertexCode(shader: ShaderBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iReset(): void;
    /**
     * @inheritDoc
     */
    iCleanCompilationData(): void;
    /**
     * Called when the base method's shader code is invalidated.
     */
    private onShaderInvalidated(event);
}
