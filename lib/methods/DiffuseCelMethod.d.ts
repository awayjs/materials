import { Stage } from "@awayjs/stage/lib/base/Stage";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { MethodVO } from "../data/MethodVO";
import { DiffuseBasicMethod } from "../methods/DiffuseBasicMethod";
import { DiffuseCompositeMethod } from "../methods/DiffuseCompositeMethod";
/**
 * DiffuseCelMethod provides a shading method to add diffuse cel (cartoon) shading.
 */
export declare class DiffuseCelMethod extends DiffuseCompositeMethod {
    private _levels;
    private _dataReg;
    private _smoothness;
    /**
     * Creates a new DiffuseCelMethod object.
     * @param levels The amount of shadow gradations.
     * @param baseMethod An optional diffuse method on which the cartoon shading is based. If omitted, DiffuseBasicMethod is used.
     */
    constructor(levels?: number, baseMethod?: DiffuseBasicMethod);
    /**
     * @inheritDoc
     */
    iInitConstants(shader: LightingShader, methodVO: MethodVO): void;
    /**
     * The amount of shadow gradations.
     */
    levels: number;
    /**
     * The smoothness of the edge between 2 shading levels.
     */
    smoothness: number;
    /**
     * @inheritDoc
     */
    iCleanCompilationData(): void;
    /**
     * @inheritDoc
     */
    iGetFragmentPreLightingCode(shader: LightingShader, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iActivate(shader: LightingShader, methodVO: MethodVO, stage: Stage): void;
    /**
     * Snaps the diffuse shading of the wrapped method to one of the levels.
     * @param vo The MethodVO used to compile the current shader.
     * @param t The register containing the diffuse strength in the "w" component.
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared register data for this shader.
     * @return The AGAL fragment code for the method.
     */
    private clampDiffuse(shader, methodVO, targetReg, registerCache, sharedRegisters);
}
