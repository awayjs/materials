import { ColorTransform } from "@awayjs/core/lib/geom/ColorTransform";
import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { MaterialBase } from "@awayjs/display/lib/materials/MaterialBase";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { LightPickerBase } from "@awayjs/display/lib/materials/lightpickers/LightPickerBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { PassBase } from "@awayjs/renderer/lib/surfaces/passes/PassBase";
import { ILightingPass } from "@awayjs/renderer/lib/surfaces/passes/ILightingPass";
import { IElementsClassGL } from "@awayjs/renderer/lib/elements/IElementsClassGL";
import { MethodVO } from "../../data/MethodVO";
import { AmbientBasicMethod } from "../../methods/AmbientBasicMethod";
import { DiffuseBasicMethod } from "../../methods/DiffuseBasicMethod";
import { EffectColorTransformMethod } from "../../methods/EffectColorTransformMethod";
import { EffectMethodBase } from "../../methods/EffectMethodBase";
import { NormalBasicMethod } from "../../methods/NormalBasicMethod";
import { ShadowMapMethodBase } from "../../methods/ShadowMapMethodBase";
import { SpecularBasicMethod } from "../../methods/SpecularBasicMethod";
import { GL_MethodMaterialSurface } from "../../surfaces/GL_MethodMaterialSurface";
/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
export declare class MethodPass extends PassBase implements ILightingPass {
    private _maxLights;
    private _mode;
    private _material;
    private _lightPicker;
    private _includeCasters;
    _iColorTransformMethodVO: MethodVO;
    _iNormalMethodVO: MethodVO;
    _iAmbientMethodVO: MethodVO;
    _iShadowMethodVO: MethodVO;
    _iDiffuseMethodVO: MethodVO;
    _iSpecularMethodVO: MethodVO;
    _iMethodVOs: Array<MethodVO>;
    _numEffectDependencies: number;
    private _onLightsChangeDelegate;
    private _onMethodInvalidatedDelegate;
    numDirectionalLights: number;
    numPointLights: number;
    numLightProbes: number;
    pointLightsOffset: number;
    directionalLightsOffset: number;
    lightProbesOffset: number;
    /**
     *
     */
    mode: number;
    /**
     * Indicates whether or not shadow casting lights need to be included.
     */
    includeCasters: boolean;
    /**
     *
     * @returns {LightPickerBase}
     */
    lightPicker: LightPickerBase;
    /**
     * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
     * compatibility for constrained mode.
     */
    readonly enableLightFallOff: boolean;
    /**
     * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
     * and/or light probes for diffuse reflections.
     *
     * @see away3d.materials.LightSources
     */
    readonly diffuseLightSources: number;
    /**
     * Define which light source types to use for specular reflections. This allows choosing between regular lights
     * and/or light probes for specular reflections.
     *
     * @see away3d.materials.LightSources
     */
    readonly specularLightSources: number;
    /**
     * Creates a new CompiledPass object.
     *
     * @param material The material to which this pass belongs.
     */
    constructor(mode: number, render: GL_MethodMaterialSurface, renderOwner: MaterialBase, elementsClass: IElementsClassGL, stage: Stage);
    private _updateShader();
    /**
     * Initializes the unchanging constant data for this material.
     */
    _iInitConstantData(shader: ShaderBase): void;
    /**
     * The ColorTransform object to transform the colour of the material with. Defaults to null.
     */
    colorTransform: ColorTransform;
    /**
     * The EffectColorTransformMethod object to transform the colour of the material with. Defaults to null.
     */
    colorTransformMethod: EffectColorTransformMethod;
    private _removeDependency(methodVO, effectsDependency?);
    private _addDependency(methodVO, effectsDependency?, index?);
    /**
     * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
     * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
     * methods added prior.
     */
    addEffectMethod(method: EffectMethodBase): void;
    /**
     * The number of "effect" methods added to the material.
     */
    readonly numEffectMethods: number;
    /**
     * Queries whether a given effects method was added to the material.
     *
     * @param method The method to be queried.
     * @return true if the method was added to the material, false otherwise.
     */
    hasEffectMethod(method: EffectMethodBase): boolean;
    /**
     * Returns the method added at the given index.
     * @param index The index of the method to retrieve.
     * @return The method at the given index.
     */
    getEffectMethodAt(index: number): EffectMethodBase;
    /**
     * Adds an effect method at the specified index amongst the methods already added to the material. Effect
     * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
     * etc. The method will be applied to the result of the methods with a lower index.
     */
    addEffectMethodAt(method: EffectMethodBase, index: number): void;
    /**
     * Removes an effect method from the material.
     * @param method The method to be removed.
     */
    removeEffectMethod(method: EffectMethodBase): void;
    /**
     * remove an effect method at the specified index from the material.
     */
    removeEffectMethodAt(index: number): void;
    private getDependencyForMethod(method);
    /**
     * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
     */
    normalMethod: NormalBasicMethod;
    /**
     * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
     */
    ambientMethod: AmbientBasicMethod;
    /**
     * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
     */
    shadowMethod: ShadowMapMethodBase;
    /**
     * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
     */
    diffuseMethod: DiffuseBasicMethod;
    /**
     * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
     */
    specularMethod: SpecularBasicMethod;
    /**
     * @inheritDoc
     */
    dispose(): void;
    /**
     * Called when any method's shader code is invalidated.
     */
    private onMethodInvalidated(event);
    /**
     * @inheritDoc
     */
    _iActivate(camera: Camera): void;
    /**
     *
     *
     * @param renderable
     * @param stage
     * @param camera
     */
    _setRenderState(renderable: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
    /**
     * @inheritDoc
     */
    _iDeactivate(): void;
    _iIncludeDependencies(shader: LightingShader): void;
    /**
     * Counts the dependencies for a given method.
     * @param method The method to count the dependencies for.
     * @param methodVO The method's data for this material.
     */
    private setupAndCountDependencies(shader, methodVO);
    _iGetPreLightingVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetPreLightingFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetPerLightDiffuseFragmentCode(shader: LightingShader, lightDirReg: ShaderRegisterElement, diffuseColorReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetPerLightSpecularFragmentCode(shader: LightingShader, lightDirReg: ShaderRegisterElement, specularColorReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetPerProbeDiffuseFragmentCode(shader: LightingShader, texReg: ShaderRegisterElement, weightReg: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetPerProbeSpecularFragmentCode(shader: LightingShader, texReg: ShaderRegisterElement, weightReg: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetPostLightingVertexCode(shader: LightingShader, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetPostLightingFragmentCode(shader: LightingShader, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetNormalVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    _iGetNormalFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    _iGetVertexCode(shader: ShaderBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    _iGetFragmentCode(shader: ShaderBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
    /**
     * Indicates whether the shader uses any shadows.
     */
    _iUsesShadows(shader: ShaderBase): boolean;
    /**
     * Indicates whether the shader uses any specular component.
     */
    _iUsesSpecular(shader: ShaderBase): boolean;
    /**
     * Indicates whether the shader uses any specular component.
     */
    _iUsesDiffuse(shader: ShaderBase): boolean;
    private onLightsChange(event);
    private _updateLights();
    /**
     * Calculates the amount of directional lights this material will support.
     * @param numDirectionalLights The maximum amount of directional lights to support.
     * @return The amount of directional lights this material will support, bounded by the amount necessary.
     */
    private calculateNumDirectionalLights(numDirectionalLights);
    /**
     * Calculates the amount of point lights this material will support.
     * @param numDirectionalLights The maximum amount of point lights to support.
     * @return The amount of point lights this material will support, bounded by the amount necessary.
     */
    private calculateNumPointLights(numPointLights);
    /**
     * Calculates the amount of light probes this material will support.
     * @param numDirectionalLights The maximum amount of light probes to support.
     * @return The amount of light probes this material will support, bounded by the amount necessary.
     */
    private calculateNumProbes(numLightProbes);
}
