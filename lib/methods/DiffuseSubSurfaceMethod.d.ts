import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { DiffuseBasicMethod } from "../methods/DiffuseBasicMethod";
import { DiffuseCompositeMethod } from "../methods/DiffuseCompositeMethod";
/**
 * DiffuseSubSurfaceMethod provides a depth map-based diffuse shading method that mimics the scattering of
 * light inside translucent surfaces. It allows light to shine through an object and to soften the diffuse shading.
 * It can be used for candle wax, ice, skin, ...
 */
export declare class DiffuseSubSurfaceMethod extends DiffuseCompositeMethod {
    private _depthPass;
    private _lightProjVarying;
    private _propReg;
    private _scattering;
    private _translucency;
    private _lightColorReg;
    private _scatterColor;
    private _colorReg;
    private _decReg;
    private _scatterR;
    private _scatterG;
    private _scatterB;
    private _targetReg;
    /**
     * Creates a new <code>DiffuseSubSurfaceMethod</code> object.
     *
     * @param depthMapSize The size of the depth map used.
     * @param depthMapOffset The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
     * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
     */
    constructor(depthMapSize?: number, depthMapOffset?: number, baseMethod?: DiffuseBasicMethod);
    /**
     * @inheritDoc
     */
    iInitConstants(shader: LightingShader, methodVO: MethodVO): void;
    iCleanCompilationData(): void;
    /**
     * The amount by which the light scatters. It can be used to set the translucent surface's thickness. Use low
     * values for skin.
     */
    scattering: number;
    /**
     * The translucency of the object.
     */
    translucency: number;
    /**
     * The colour of the "insides" of the object, ie: the colour the light becomes after leaving the object.
     */
    scatterColor: number;
    /**
     * @inheritDoc
     */
    iGetVertexCode(shader: ShaderBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iGetFragmentPreLightingCode(shader: LightingShader, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iGetFragmentCodePerLight(shader: LightingShader, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iGetFragmentPostLightingCode(shader: LightingShader, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iActivate(shader: LightingShader, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    iSetRenderState(shader: ShaderBase, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * Generates the code for this method
     */
    private scatterLight(shader, methodVO, targetReg, registerCache, sharedRegisters);
}
