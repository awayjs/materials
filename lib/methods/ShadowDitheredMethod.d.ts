import { Camera } from "@awayjs/display/lib/display/Camera";
import { DirectionalLight } from "@awayjs/display/lib/display/DirectionalLight";
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
 * ShadowDitheredMethod provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
 */
export declare class ShadowDitheredMethod extends ShadowMethodBase {
    private static _grainTexture;
    private static _grainUsages;
    private static _grainBitmapImage2D;
    private _depthMapSize;
    private _range;
    private _numSamples;
    /**
     * Creates a new ShadowDitheredMethod object.
     * @param castingLight The light casting the shadows
     * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 24.
     */
    constructor(castingLight: DirectionalLight, numSamples?: number, range?: number);
    /**
     * The amount of samples to take for dithering. Minimum 1, maximum 24. The actual maximum may depend on the
     * complexity of the shader.
     */
    numSamples: number;
    /**
     * @inheritDoc
     */
    iInitVO(shader: LightingShader, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * The range in the shadow map in which to distribute the samples.
     */
    range: number;
    /**
     * Creates a texture containing the dithering noise texture.
     */
    private initGrainTexture();
    /**
     * @inheritDoc
     */
    dispose(): void;
    /**
     * @inheritDoc
     */
    iActivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    iSetRenderState(shader: ShaderBase, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * @inheritDoc
     */
    _pGetPlanarFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * Get the actual shader code for shadow mapping
     * @param regCache The register cache managing the registers.
     * @param depthMapRegister The texture register containing the depth map.
     * @param decReg The register containing the depth map decoding data.
     * @param targetReg The target register to add the shadow coverage.
     */
    private getSampleCode(shader, methodVO, customDataReg, decReg, targetReg, regCache, sharedRegisters);
    /**
     * Adds the code for another tap to the shader code.
     * @param uvReg The uv register for the tap.
     * @param depthMapRegister The texture register containing the depth map.
     * @param decReg The register containing the depth map decoding data.
     * @param targetReg The target register to add the tap comparison result.
     * @param regCache The register cache managing the registers.
     * @return
     */
    private addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
    /**
     * @inheritDoc
     */
    iActivateForCascade(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    _iGetCascadeFragmentCode(shader: ShaderBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
}
