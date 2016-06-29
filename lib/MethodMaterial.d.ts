import { Image2D } from "@awayjs/core/lib/image/Image2D";
import { MaterialBase } from "@awayjs/display/lib/materials/MaterialBase";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { AmbientBasicMethod } from "./methods/AmbientBasicMethod";
import { DiffuseBasicMethod } from "./methods/DiffuseBasicMethod";
import { EffectMethodBase } from "./methods/EffectMethodBase";
import { NormalBasicMethod } from "./methods/NormalBasicMethod";
import { ShadowMapMethodBase } from "./methods/ShadowMapMethodBase";
import { SpecularBasicMethod } from "./methods/SpecularBasicMethod";
/**
 * MethodMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export declare class MethodMaterial extends MaterialBase {
    static assetType: string;
    private _effectMethods;
    private _mode;
    private _ambientMethod;
    private _shadowMethod;
    private _diffuseMethod;
    private _normalMethod;
    private _specularMethod;
    private _depthCompareMode;
    /**
     *
     */
    readonly assetType: string;
    /**
     * Creates a new MethodMaterial object.
     *
     * @param texture The texture used for the material's albedo color.
     * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
     * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to false.
     * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to false.
     */
    constructor(image?: Image2D, alpha?: number);
    constructor(color?: number, alpha?: number);
    mode: string;
    /**
     * The depth compare mode used to render the renderables using this material.
     *
     * @see away.stage.ContextGLCompareMode
     */
    depthCompareMode: string;
    /**
     * The texture object to use for the ambient colour.
     */
    diffuseTexture: TextureBase;
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
     * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
     */
    normalMethod: NormalBasicMethod;
    readonly numEffectMethods: number;
    /**
     * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
     * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
     * methods added prior.
     */
    addEffectMethod(method: EffectMethodBase): void;
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
}
