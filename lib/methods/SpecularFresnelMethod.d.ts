import { Stage } from "@awayjs/stage/lib/base/Stage";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { MethodVO } from "../data/MethodVO";
import { SpecularBasicMethod } from "../methods/SpecularBasicMethod";
import { SpecularCompositeMethod } from "../methods/SpecularCompositeMethod";
/**
 * SpecularFresnelMethod provides a specular shading method that causes stronger highlights on grazing view angles.
 */
export declare class SpecularFresnelMethod extends SpecularCompositeMethod {
    private _dataReg;
    private _incidentLight;
    private _fresnelPower;
    private _normalReflectance;
    /**
     * Creates a new SpecularFresnelMethod object.
     * @param basedOnSurface Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
     * @param baseMethod The specular method to which the fresnel equation. Defaults to SpecularBasicMethod.
     */
    constructor(basedOnSurface?: boolean, baseMethod?: SpecularBasicMethod);
    /**
     * @inheritDoc
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
     */
    basedOnSurface: boolean;
    /**
     * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
     */
    fresnelPower: number;
    /**
     * @inheritDoc
     */
    iCleanCompilationData(): void;
    /**
     * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
     */
    normalReflectance: number;
    /**
     * @inheritDoc
     */
    iActivate(shader: LightingShader, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    iGetFragmentPreLightingCode(shader: LightingShader, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * Applies the fresnel effect to the specular strength.
     *
     * @param vo The MethodVO object containing the method data for the currently compiled material pass.
     * @param target The register containing the specular strength in the "w" component, and the half-vector/reflection vector in "xyz".
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared registers created by the compiler.
     * @return The AGAL fragment code for the method.
     */
    private modulateSpecular(shader, methodVO, targetReg, registerCache, sharedRegisters);
}
