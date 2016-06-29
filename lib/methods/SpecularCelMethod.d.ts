import { Stage } from "@awayjs/stage/lib/base/Stage";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { MethodVO } from "../data/MethodVO";
import { SpecularBasicMethod } from "../methods/SpecularBasicMethod";
import { SpecularCompositeMethod } from "../methods/SpecularCompositeMethod";
/**
 * SpecularCelMethod provides a shading method to add specular cel (cartoon) shading.
 */
export declare class SpecularCelMethod extends SpecularCompositeMethod {
    private _dataReg;
    private _smoothness;
    private _specularCutOff;
    /**
     * Creates a new SpecularCelMethod object.
     * @param specularCutOff The threshold at which the specular highlight should be shown.
     * @param baseMethod An optional specular method on which the cartoon shading is based. If ommitted, SpecularBasicMethod is used.
     */
    constructor(specularCutOff?: number, baseMethod?: SpecularBasicMethod);
    /**
     * The smoothness of the highlight edge.
     */
    smoothness: number;
    /**
     * The threshold at which the specular highlight should be shown.
     */
    specularCutOff: number;
    /**
     * @inheritDoc
     */
    iActivate(shader: LightingShader, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    iCleanCompilationData(): void;
    /**
     * Snaps the specular shading strength of the wrapped method to zero or one, depending on whether or not it exceeds the specularCutOff
     * @param vo The MethodVO used to compile the current shader.
     * @param t The register containing the specular strength in the "w" component, and either the half-vector or the reflection vector in "xyz".
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared register data for this shader.
     * @return The AGAL fragment code for the method.
     */
    private clampSpecular(shader, methodVO, targetReg, registerCache, sharedRegisters);
    /**
     * @inheritDoc
     */
    iGetFragmentPreLightingCode(shader: LightingShader, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
}
