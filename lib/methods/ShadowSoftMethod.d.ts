import { DirectionalLight } from "@awayjs/display/lib/display/DirectionalLight";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { ShadowMethodBase } from "../methods/ShadowMethodBase";
/**
 * ShadowSoftMethod provides a soft shadowing technique by randomly distributing sample points.
 */
export declare class ShadowSoftMethod extends ShadowMethodBase {
    private _range;
    private _numSamples;
    private _offsets;
    /**
     * Creates a new DiffuseBasicMethod object.
     *
     * @param castingLight The light casting the shadows
     * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 32.
     */
    constructor(castingLight: DirectionalLight, numSamples?: number, range?: number);
    /**
     * The amount of samples to take for dithering. Minimum 1, maximum 32. The actual maximum may depend on the
     * complexity of the shader.
     */
    numSamples: number;
    /**
     * The range in the shadow map in which to distribute the samples.
     */
    range: number;
    /**
     * @inheritDoc
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iActivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    _pGetPlanarFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * Adds the code for another tap to the shader code.
     * @param uv The uv register for the tap.
     * @param texture The texture register containing the depth map.
     * @param decode The register containing the depth map decoding data.
     * @param target The target register to add the tap comparison result.
     * @param regCache The register cache managing the registers.
     * @return
     */
    private addSample(shader, methodVO, decodeRegister, targetRegister, registerCache, sharedRegisters, uvReg);
    /**
     * @inheritDoc
     */
    iActivateForCascade(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    _iGetCascadeFragmentCode(shader: ShaderBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * Get the actual shader code for shadow mapping
     * @param regCache The register cache managing the registers.
     * @param depthTexture The texture register containing the depth map.
     * @param decodeRegister The register containing the depth map decoding data.
     * @param targetReg The target register to add the shadow coverage.
     * @param dataReg The register containing additional data.
     */
    private getSampleCode(shader, methodVO, decodeRegister, targetRegister, registerCache, sharedRegisters, dataReg);
}
