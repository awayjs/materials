declare module "awayjs-methodmaterials/lib/MethodMaterial" {
	import Image2D = require("awayjs-core/lib/data/Image2D");
	import MaterialBase = require("awayjs-display/lib/materials/MaterialBase");
	import IRenderObject = require("awayjs-display/lib/pool/IRenderObject");
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import AmbientBasicMethod = require("awayjs-methodmaterials/lib/methods/AmbientBasicMethod");
	import DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
	import EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
	import NormalBasicMethod = require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
	import ShadowMapMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMapMethodBase");
	import SpecularBasicMethod = require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
	import MethodRenderablePool = require("awayjs-methodmaterials/lib/pool/MethodRenderablePool");
	/**
	 * MethodMaterial forms an abstract base class for the default shaded materials provided by Stage,
	 * using material methods to define their appearance.
	 */
	class MethodMaterial extends MaterialBase {
	    private _effectMethods;
	    private _mode;
	    private _ambientMethod;
	    private _shadowMethod;
	    private _diffuseMethod;
	    private _normalMethod;
	    private _specularMethod;
	    private _depthCompareMode;
	    /**
	     * Creates a new MethodMaterial object.
	     *
	     * @param texture The texture used for the material's albedo color.
	     * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
	     * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to false.
	     * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to false.
	     */
	    constructor(texture?: Image2D, smooth?: boolean, repeat?: boolean, mipmap?: boolean);
	    constructor(texture?: TextureBase, smooth?: boolean, repeat?: boolean, mipmap?: boolean);
	    constructor(color?: number, alpha?: number);
	    mode: string;
	    /**
	     * The depth compare mode used to render the renderables using this material.
	     *
	     * @see away.stagegl.ContextGLCompareMode
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
	    numEffectMethods: number;
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
	    /**
	     * The normal map to modulate the direction of the surface for each texel. The default normal method expects
	     * tangent-space normal maps, but others could expect object-space maps.
	     */
	    normalMap: TextureBase;
	    /**
	     * A specular map that defines the strength of specular reflections for each texel in the red channel,
	     * and the gloss factor in the green channel. You can use Specular2DTexture if you want to easily set
	     * specular and gloss maps from grayscale images, but correctly authored images are preferred.
	     */
	    specularMap: TextureBase;
	    /**
	     * The glossiness of the material (sharpness of the specular highlight).
	     */
	    gloss: number;
	    /**
	     * The strength of the ambient reflection.
	     */
	    ambient: number;
	    /**
	     * The overall strength of the specular reflection.
	     */
	    specular: number;
	    /**
	     * The colour of the ambient reflection.
	     */
	    ambientColor: number;
	    /**
	     * The colour of the diffuse reflection.
	     */
	    diffuseColor: number;
	    /**
	     * The colour of the specular reflection.
	     */
	    specularColor: number;
	    /**
	     *
	     * @param renderer
	     *
	     * @internal
	     */
	    getRenderObject(renderablePool: MethodRenderablePool): IRenderObject;
	}
	export = MethodMaterial;
	
}

declare module "awayjs-methodmaterials/lib/MethodMaterialMode" {
	class MethodMaterialMode {
	    /**
	     *
	     */
	    static SINGLE_PASS: string;
	    /**
	     *
	     */
	    static MULTI_PASS: string;
	}
	export = MethodMaterialMode;
	
}

declare module "awayjs-methodmaterials/lib/compilation/RenderMethodMaterialObject" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderObjectPool = require("awayjs-renderergl/lib/compilation/RenderObjectPool");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	import MethodMaterial = require("awayjs-methodmaterials/lib/MethodMaterial");
	/**
	 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
	 * using material methods to define their appearance.
	 */
	class RenderMethodMaterialObject extends RenderObjectBase {
	    /**
	     *
	     */
	    static id: string;
	    private _material;
	    private _screenPass;
	    private _casterLightPass;
	    private _nonCasterLightPasses;
	    /**
	     * The maximum total number of lights provided by the light picker.
	     */
	    private numLights;
	    /**
	     * The amount of lights that don't cast shadows.
	     */
	    private numNonCasters;
	    /**
	     * Creates a new CompiledPass object.
	     *
	     * @param material The material to which this pass belongs.
	     */
	    constructor(pool: RenderObjectPool, material: MethodMaterial, renderableClass: IRenderableClass, stage: Stage);
	    /**
	     * @inheritDoc
	     */
	    _pUpdateRenderObject(): void;
	    /**
	     * Initializes all the passes and their dependent passes.
	     */
	    private initPasses();
	    /**
	     * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
	     */
	    private setBlendAndCompareModes();
	    private initCasterLightPass();
	    private removeCasterLightPass();
	    private initNonCasterLightPasses();
	    private removeNonCasterLightPasses();
	    private removeEffectPass();
	    private initEffectPass();
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	}
	export = RenderMethodMaterialObject;
	
}

declare module "awayjs-methodmaterials/lib/data/MethodVO" {
	import TextureObjectBase = require("awayjs-renderergl/lib/pool/TextureObjectBase");
	import ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
	/**
	 * MethodVO contains data for a given shader object for the use within a single material.
	 * This allows shader methods to be shared across materials while their non-public state differs.
	 */
	class MethodVO {
	    useMethod: boolean;
	    method: ShadingMethodBase;
	    textureObject: TextureObjectBase;
	    secondaryTextureObject: TextureObjectBase;
	    vertexConstantsIndex: number;
	    secondaryVertexConstantsIndex: number;
	    fragmentConstantsIndex: number;
	    secondaryFragmentConstantsIndex: number;
	    needsProjection: boolean;
	    needsView: boolean;
	    needsNormals: boolean;
	    needsTangents: boolean;
	    needsGlobalVertexPos: boolean;
	    needsGlobalFragmentPos: boolean;
	    /**
	     * Creates a new MethodVO object.
	     */
	    constructor(method: ShadingMethodBase);
	    /**
	     * Resets the values of the value object to their "unused" state.
	     */
	    reset(): void;
	}
	export = MethodVO;
	
}

declare module "awayjs-methodmaterials/lib/methods/AmbientBasicMethod" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
	/**
	 * AmbientBasicMethod provides the default shading method for uniform ambient lighting.
	 */
	class AmbientBasicMethod extends ShadingMethodBase {
	    private _color;
	    private _alpha;
	    private _colorR;
	    private _colorG;
	    private _colorB;
	    private _ambient;
	    /**
	     * Creates a new AmbientBasicMethod object.
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The strength of the ambient reflection of the surface.
	     */
	    ambient: number;
	    /**
	     * The alpha component of the surface.
	     */
	    alpha: number;
	    /**
	     * @inheritDoc
	     */
	    copyFrom(method: ShadingMethodBase): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * Updates the ambient color data used by the render state.
	     */
	    private updateColor();
	}
	export = AmbientBasicMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/AmbientEnvMapMethod" {
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import AmbientBasicMethod = require("awayjs-methodmaterials/lib/methods/AmbientBasicMethod");
	/**
	 * AmbientEnvMapMethod provides a diffuse shading method that uses a diffuse irradiance environment map to
	 * approximate global lighting rather than lights.
	 */
	class AmbientEnvMapMethod extends AmbientBasicMethod {
	    /**
	     * Creates a new <code>AmbientEnvMapMethod</code> object.
	     *
	     * @param envMap The cube environment map to use for the ambient lighting.
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = AmbientEnvMapMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/CurveBasicMethod" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
	/**
	 * AmbientBasicMethod provides the default shading method for uniform ambient lighting.
	 */
	class CurveBasicMethod extends ShadingMethodBase {
	    private _color;
	    private _alpha;
	    private _colorR;
	    private _colorG;
	    private _colorB;
	    private _ambient;
	    /**
	     * Creates a new AmbientBasicMethod object.
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The strength of the ambient reflection of the surface.
	     */
	    ambient: number;
	    /**
	     * The alpha component of the surface.
	     */
	    alpha: number;
	    /**
	     * @inheritDoc
	     */
	    copyFrom(method: ShadingMethodBase): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * Updates the ambient color data used by the render state.
	     */
	    private updateColor();
	}
	export = CurveBasicMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/DiffuseBasicMethod" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
	import LightingMethodBase = require("awayjs-methodmaterials/lib/methods/LightingMethodBase");
	/**
	 * DiffuseBasicMethod provides the default shading method for Lambert (dot3) diffuse lighting.
	 */
	class DiffuseBasicMethod extends LightingMethodBase {
	    private _multiply;
	    _pTotalLightColorReg: ShaderRegisterElement;
	    _texture: TextureBase;
	    private _diffuseColor;
	    private _ambientColor;
	    private _diffuseR;
	    private _diffuseG;
	    private _diffuseB;
	    private _ambientR;
	    private _ambientG;
	    private _ambientB;
	    _pIsFirstLight: boolean;
	    /**
	     * Creates a new DiffuseBasicMethod object.
	     */
	    constructor();
	    iIsUsed(shaderObject: ShaderLightingObject): boolean;
	    /**
	     * Set internally if diffuse color component multiplies or replaces the ambient color
	     */
	    multiply: boolean;
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * The color of the diffuse reflection when not using a texture.
	     */
	    diffuseColor: number;
	    /**
	     * The color of the ambient reflection
	     */
	    ambientColor: number;
	    /**
	     * The bitmapData to use to define the diffuse reflection color per texel.
	     */
	    texture: TextureBase;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    copyFrom(method: ShadingMethodBase): void;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerProbe(shaderObject: ShaderLightingObject, methodVO: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Generate the code that applies the calculated shadow to the diffuse light
	     * @param methodVO The MethodVO object for which the compilation is currently happening.
	     * @param regCache The register cache the compiler is currently using for the register management.
	     */
	    pApplyShadow(shaderObject: ShaderLightingObject, methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * Updates the diffuse color data used by the render state.
	     */
	    private updateDiffuse();
	    /**
	     * Updates the ambient color data used by the render state.
	     */
	    private updateAmbient();
	    /**
	     * @inheritDoc
	     */
	    iSetRenderState(shaderObject: ShaderLightingObject, methodVO: MethodVO, renderable: RenderableBase, stage: Stage, camera: Camera): void;
	}
	export = DiffuseBasicMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/DiffuseCelMethod" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
	import DiffuseCompositeMethod = require("awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod");
	/**
	 * DiffuseCelMethod provides a shading method to add diffuse cel (cartoon) shading.
	 */
	class DiffuseCelMethod extends DiffuseCompositeMethod {
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
	    iInitConstants(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
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
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * Snaps the diffuse shading of the wrapped method to one of the levels.
	     * @param vo The MethodVO used to compile the current shader.
	     * @param t The register containing the diffuse strength in the "w" component.
	     * @param regCache The register cache used for the shader compilation.
	     * @param sharedRegisters The shared register data for this shader.
	     * @return The AGAL fragment code for the method.
	     */
	    private clampDiffuse(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
	}
	export = DiffuseCelMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
	/**
	 * DiffuseCompositeMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
	 * calculated diffuse reflection strength.
	 */
	class DiffuseCompositeMethod extends DiffuseBasicMethod {
	    pBaseMethod: DiffuseBasicMethod;
	    private _onShaderInvalidatedDelegate;
	    /**
	     * Creates a new <code>DiffuseCompositeMethod</code> object.
	     *
	     * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
	     * @param baseMethod The base diffuse method on which this method's shading is based.
	     */
	    constructor(modulateMethod: (shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData) => string, baseMethod?: DiffuseBasicMethod);
	    /**
	     * The base diffuse method on which this method's shading is based.
	     */
	    baseMethod: DiffuseBasicMethod;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    /**
	     * @inheritDoc
	     */
	    texture: TextureBase;
	    /**
	     * @inheritDoc
	     */
	    /**
	     * @inheritDoc
	     */
	    diffuseColor: number;
	    /**
	     * @inheritDoc
	     */
	    /**
	     * @inheritDoc
	     */
	    ambientColor: number;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerProbe(shaderObject: ShaderLightingObject, methodVO: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iSetRenderState(shaderObject: ShaderLightingObject, methodVO: MethodVO, renderable: RenderableBase, stage: Stage, camera: Camera): void;
	    /**
	     * @inheritDoc
	     */
	    iDeactivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
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
	export = DiffuseCompositeMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/DiffuseDepthMethod" {
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
	/**
	 * DiffuseDepthMethod provides a debug method to visualise depth maps
	 */
	class DiffuseDepthMethod extends DiffuseBasicMethod {
	    /**
	     * Creates a new DiffuseBasicMethod object.
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = DiffuseDepthMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/DiffuseGradientMethod" {
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
	/**
	 * DiffuseGradientMethod is an alternative to DiffuseBasicMethod in which the shading can be modulated with a gradient
	 * to introduce color-tinted shading as opposed to the single-channel diffuse strength. This can be used as a crude
	 * approximation to subsurface scattering (for instance, the mid-range shading for skin can be tinted red to similate
	 * scattered light within the skin attributing to the final colour)
	 */
	class DiffuseGradientMethod extends DiffuseBasicMethod {
	    private _gradient;
	    /**
	     * Creates a new DiffuseGradientMethod object.
	     * @param gradient A texture that contains the light colour based on the angle. This can be used to change
	     * the light colour due to subsurface scattering when the surface faces away from the light.
	     */
	    constructor(gradient: TextureBase);
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * A texture that contains the light colour based on the angle. This can be used to change the light colour
	     * due to subsurface scattering when the surface faces away from the light.
	     */
	    gradient: TextureBase;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    pApplyShadow(shaderObject: ShaderLightingObject, methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	}
	export = DiffuseGradientMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/DiffuseLightMapMethod" {
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
	import DiffuseCompositeMethod = require("awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod");
	/**
	 * DiffuseLightMapMethod provides a diffuse shading method that uses a light map to modulate the calculated diffuse
	 * lighting. It is different from EffectLightMapMethod in that the latter modulates the entire calculated pixel color, rather
	 * than only the diffuse lighting value.
	 */
	class DiffuseLightMapMethod extends DiffuseCompositeMethod {
	    /**
	     * Indicates the light map should be multiplied with the calculated shading result.
	     * This can be used to add pre-calculated shadows or occlusion.
	     */
	    static MULTIPLY: string;
	    /**
	     * Indicates the light map should be added into the calculated shading result.
	     * This can be used to add pre-calculated lighting or global illumination.
	     */
	    static ADD: string;
	    private _lightMap;
	    private _blendMode;
	    private _useSecondaryUV;
	    /**
	     * Creates a new DiffuseLightMapMethod method.
	     *
	     * @param lightMap The texture containing the light map.
	     * @param blendMode The blend mode with which the light map should be applied to the lighting result.
	     * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
	     * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
	     */
	    constructor(lightMap: TextureBase, blendMode?: string, useSecondaryUV?: boolean, baseMethod?: DiffuseBasicMethod);
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * The blend mode with which the light map should be applied to the lighting result.
	     *
	     * @see DiffuseLightMapMethod.ADD
	     * @see DiffuseLightMapMethod.MULTIPLY
	     */
	    blendMode: string;
	    /**
	     * The texture containing the light map data.
	     */
	    lightMap: TextureBase;
	    /**
	     * Indicates whether the secondary UV set should be used to map the light map.
	     */
	    useSecondaryUV: boolean;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	}
	export = DiffuseLightMapMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/DiffuseSubSurfaceMethod" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
	import DiffuseCompositeMethod = require("awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod");
	/**
	 * DiffuseSubSurfaceMethod provides a depth map-based diffuse shading method that mimics the scattering of
	 * light inside translucent surfaces. It allows light to shine through an object and to soften the diffuse shading.
	 * It can be used for candle wax, ice, skin, ...
	 */
	class DiffuseSubSurfaceMethod extends DiffuseCompositeMethod {
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
	    iInitConstants(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
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
	    iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iSetRenderState(shaderObject: ShaderObjectBase, methodVO: MethodVO, renderable: RenderableBase, stage: Stage, camera: Camera): void;
	    /**
	     * Generates the code for this method
	     */
	    private scatterLight(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
	}
	export = DiffuseSubSurfaceMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/DiffuseWrapMethod" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
	/**
	 * DiffuseWrapMethod is an alternative to DiffuseBasicMethod in which the light is allowed to be "wrapped around" the normally dark area, to some extent.
	 * It can be used as a crude approximation to Oren-Nayar or simple subsurface scattering.
	 */
	class DiffuseWrapMethod extends DiffuseBasicMethod {
	    private _wrapDataRegister;
	    private _wrapFactor;
	    /**
	     * Creates a new DiffuseWrapMethod object.
	     * @param wrapFactor A factor to indicate the amount by which the light is allowed to wrap
	     */
	    constructor(wrapFactor?: number);
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * A factor to indicate the amount by which the light is allowed to wrap.
	     */
	    wrapFactor: number;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	}
	export = DiffuseWrapMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/EffectAlphaMaskMethod" {
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
	/**
	 * EffectAlphaMaskMethod allows the use of an additional texture to specify the alpha value of the material. When used
	 * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
	 * etc).
	 */
	class EffectAlphaMaskMethod extends EffectMethodBase {
	    private _texture;
	    private _useSecondaryUV;
	    /**
	     * Creates a new EffectAlphaMaskMethod object.
	     *
	     * @param texture The texture to use as the alpha mask.
	     * @param useSecondaryUV Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently.
	     */
	    constructor(texture: TextureBase, useSecondaryUV?: boolean);
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently, for
	     * instance to tile the main texture and normal map while providing untiled alpha, for example to define the
	     * transparency over a tiled water surface.
	     */
	    useSecondaryUV: boolean;
	    /**
	     * The texture to use as the alpha mask.
	     */
	    texture: TextureBase;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	}
	export = EffectAlphaMaskMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/EffectColorMatrixMethod" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
	/**
	 * EffectColorMatrixMethod provides a shading method that changes the colour of a material analogous to a ColorMatrixFilter.
	 */
	class EffectColorMatrixMethod extends EffectMethodBase {
	    private _matrix;
	    /**
	     * Creates a new EffectColorTransformMethod.
	     *
	     * @param matrix An array of 20 items for 4 x 5 color transform.
	     */
	    constructor(matrix: Array<number>);
	    /**
	     * The 4 x 5 matrix to transform the color of the material.
	     */
	    colorMatrix: Array<number>;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	}
	export = EffectColorMatrixMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/EffectColorTransformMethod" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
	/**
	 * EffectColorTransformMethod provides a shading method that changes the colour of a material analogous to a
	 * ColorTransform object.
	 */
	class EffectColorTransformMethod extends EffectMethodBase {
	    private _colorTransform;
	    /**
	     * Creates a new EffectColorTransformMethod.
	     */
	    constructor();
	    /**
	     * The ColorTransform object to transform the colour of the material with.
	     */
	    colorTransform: ColorTransform;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	}
	export = EffectColorTransformMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/EffectEnvMapMethod" {
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
	/**
	 * EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
	 */
	class EffectEnvMapMethod extends EffectMethodBase {
	    private _envMap;
	    private _alpha;
	    private _mask;
	    /**
	     * Creates an EffectEnvMapMethod object.
	     * @param envMap The environment map containing the reflected scene.
	     * @param alpha The reflectivity of the surface.
	     */
	    constructor(envMap: TextureBase, alpha?: number);
	    /**
	     * An optional texture to modulate the reflectivity of the surface.
	     */
	    mask: TextureBase;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The cubic environment map containing the reflected scene.
	     */
	    envMap: TextureBase;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * The reflectivity of the surface.
	     */
	    alpha: number;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = EffectEnvMapMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/EffectFogMethod" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
	/**
	 * EffectFogMethod provides a method to add distance-based fog to a material.
	 */
	class EffectFogMethod extends EffectMethodBase {
	    private _minDistance;
	    private _maxDistance;
	    private _fogColor;
	    private _fogR;
	    private _fogG;
	    private _fogB;
	    /**
	     * Creates a new EffectFogMethod object.
	     * @param minDistance The distance from which the fog starts appearing.
	     * @param maxDistance The distance at which the fog is densest.
	     * @param fogColor The colour of the fog.
	     */
	    constructor(minDistance: number, maxDistance: number, fogColor?: number);
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The distance from which the fog starts appearing.
	     */
	    minDistance: number;
	    /**
	     * The distance at which the fog is densest.
	     */
	    maxDistance: number;
	    /**
	     * The colour of the fog.
	     */
	    fogColor: number;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = EffectFogMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/EffectFresnelEnvMapMethod" {
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
	/**
	 * EffectFresnelEnvMapMethod provides a method to add fresnel-based reflectivity to an object using cube maps, which gets
	 * stronger as the viewing angle becomes more grazing.
	 */
	class EffectFresnelEnvMapMethod extends EffectMethodBase {
	    private _envMap;
	    private _fresnelPower;
	    private _normalReflectance;
	    private _alpha;
	    private _mask;
	    /**
	     * Creates a new <code>EffectFresnelEnvMapMethod</code> object.
	     *
	     * @param envMap The environment map containing the reflected scene.
	     * @param alpha The reflectivity of the material.
	     */
	    constructor(envMap: TextureBase, alpha?: number);
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * An optional texture to modulate the reflectivity of the surface.
	     */
	    mask: TextureBase;
	    /**
	     * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
	     */
	    fresnelPower: number;
	    /**
	     * The cubic environment map containing the reflected scene.
	     */
	    envMap: TextureBase;
	    /**
	     * The reflectivity of the surface.
	     */
	    alpha: number;
	    /**
	     * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
	     */
	    normalReflectance: number;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = EffectFresnelEnvMapMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/EffectLightMapMethod" {
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
	/**
	 * EffectLightMapMethod provides a method that allows applying a light map texture to the calculated pixel colour.
	 * It is different from DiffuseLightMapMethod in that the latter only modulates the diffuse shading value rather
	 * than the whole pixel colour.
	 */
	class EffectLightMapMethod extends EffectMethodBase {
	    /**
	     * Indicates the light map should be multiplied with the calculated shading result.
	     */
	    static MULTIPLY: string;
	    /**
	     * Indicates the light map should be added into the calculated shading result.
	     */
	    static ADD: string;
	    private _lightMap;
	    private _blendMode;
	    private _useSecondaryUV;
	    /**
	     * Creates a new EffectLightMapMethod object.
	     *
	     * @param lightMap The texture containing the light map.
	     * @param blendMode The blend mode with which the light map should be applied to the lighting result.
	     * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
	     */
	    constructor(lightMap: TextureBase, blendMode?: string, useSecondaryUV?: boolean);
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The blend mode with which the light map should be applied to the lighting result.
	     *
	     * @see EffectLightMapMethod.ADD
	     * @see EffectLightMapMethod.MULTIPLY
	     */
	    blendMode: string;
	    /**
	     * The lightMap containing the light map.
	     */
	    lightMap: TextureBase;
	    /**
	     * Indicates whether the secondary UV set should be used to map the light map.
	     */
	    useSecondaryUV: boolean;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	}
	export = EffectLightMapMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/EffectMethodBase" {
	import IAsset = require("awayjs-core/lib/library/IAsset");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
	/**
	 * EffectMethodBase forms an abstract base class for shader methods that are not dependent on light sources,
	 * and are in essence post-process effects on the materials.
	 */
	class EffectMethodBase extends ShadingMethodBase implements IAsset {
	    static assetType: string;
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    assetType: string;
	    /**
	     * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
	     * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
	     * @param regCache The register cache used during the compilation.
	     * @param targetReg The register that will be containing the method's output.
	     * @private
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = EffectMethodBase;
	
}

declare module "awayjs-methodmaterials/lib/methods/EffectRefractionEnvMapMethod" {
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
	/**
	 * EffectRefractionEnvMapMethod provides a method to add refracted transparency based on cube maps.
	 */
	class EffectRefractionEnvMapMethod extends EffectMethodBase {
	    private _envMap;
	    private _dispersionR;
	    private _dispersionG;
	    private _dispersionB;
	    private _useDispersion;
	    private _refractionIndex;
	    private _alpha;
	    /**
	     * Creates a new EffectRefractionEnvMapMethod object. Example values for dispersion are: dispersionR: -0.03, dispersionG: -0.01, dispersionB: = .0015
	     *
	     * @param envMap The environment map containing the refracted scene.
	     * @param refractionIndex The refractive index of the material.
	     * @param dispersionR The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
	     * @param dispersionG The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
	     * @param dispersionB The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
	     */
	    constructor(envMap: TextureBase, refractionIndex?: number, dispersionR?: number, dispersionG?: number, dispersionB?: number);
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The cube environment map to use for the refraction.
	     */
	    envMap: TextureBase;
	    /**
	     * The refractive index of the material.
	     */
	    refractionIndex: number;
	    /**
	     * The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
	     */
	    dispersionR: number;
	    /**
	     * The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
	     */
	    dispersionG: number;
	    /**
	     * The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
	     */
	    dispersionB: number;
	    /**
	     * The amount of transparency of the object. Warning: the alpha applies to the refracted color, not the actual
	     * material. A value of 1 will make it appear fully transparent.
	     */
	    alpha: number;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = EffectRefractionEnvMapMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/EffectRimLightMethod" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
	/**
	 * EffectRimLightMethod provides a method to add rim lighting to a material. This adds a glow-like effect to edges of objects.
	 */
	class EffectRimLightMethod extends EffectMethodBase {
	    static ADD: string;
	    static MULTIPLY: string;
	    static MIX: string;
	    private _color;
	    private _blendMode;
	    private _colorR;
	    private _colorG;
	    private _colorB;
	    private _strength;
	    private _power;
	    /**
	     * Creates a new <code>EffectRimLightMethod</code> object.
	     *
	     * @param color The colour of the rim light.
	     * @param strength The strength of the rim light.
	     * @param power The power of the rim light. Higher values will result in a higher edge fall-off.
	     * @param blend The blend mode with which to add the light to the object.
	     */
	    constructor(color?: number, strength?: number, power?: number, blend?: string);
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The blend mode with which to add the light to the object.
	     *
	     * EffectRimLightMethod.MULTIPLY multiplies the rim light with the material's colour.
	     * EffectRimLightMethod.ADD adds the rim light with the material's colour.
	     * EffectRimLightMethod.MIX provides normal alpha blending.
	     */
	    blendMode: string;
	    /**
	     * The color of the rim light.
	     */
	    color: number;
	    /**
	     * The strength of the rim light.
	     */
	    strength: number;
	    /**
	     * The power of the rim light. Higher values will result in a higher edge fall-off.
	     */
	    power: number;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = EffectRimLightMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/LightingMethodBase" {
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
	/**
	 * LightingMethodBase provides an abstract base method for shading methods that uses lights.
	 * Used for diffuse and specular shaders only.
	 */
	class LightingMethodBase extends ShadingMethodBase {
	    /**
	     * A method that is exposed to wrappers in case the strength needs to be controlled
	     */
	    _iModulateMethod: (shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData) => string;
	    /**
	     * Creates a new LightingMethodBase.
	     */
	    constructor();
	    /**
	     * Get the fragment shader code that will be needed before any per-light code is added.
	     * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
	     * @param regCache The register cache used during the compilation.
	     * @private
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Get the fragment shader code that will generate the code relevant to a single light.
	     *
	     * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
	     * @param lightDirReg The register containing the light direction vector.
	     * @param lightColReg The register containing the light colour.
	     * @param regCache The register cache used during the compilation.
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Get the fragment shader code that will generate the code relevant to a single light probe object.
	     *
	     * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
	     * @param cubeMapReg The register containing the cube map for the current probe
	     * @param weightRegister A string representation of the register + component containing the current weight
	     * @param regCache The register cache providing any necessary registers to the shader
	     */
	    iGetFragmentCodePerProbe(shaderObject: ShaderLightingObject, methodVO: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
	     *
	     * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
	     * @param regCache The register cache used during the compilation.
	     * @param targetReg The register containing the final shading output.
	     * @private
	     */
	    iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = LightingMethodBase;
	
}

declare module "awayjs-methodmaterials/lib/methods/NormalBasicMethod" {
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
	/**
	 * NormalBasicMethod is the default method for standard tangent-space normal mapping.
	 */
	class NormalBasicMethod extends ShadingMethodBase {
	    private _normalMap;
	    /**
	     * Creates a new NormalBasicMethod object.
	     */
	    constructor(normalMap?: TextureBase);
	    iIsUsed(shaderObject: ShaderObjectBase): boolean;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * Indicates whether or not this method outputs normals in tangent space. Override for object-space normals.
	     */
	    iOutputsTangentNormals(): boolean;
	    /**
	     * @inheritDoc
	     */
	    copyFrom(method: ShadingMethodBase): void;
	    /**
	     * The texture containing the normals per pixel.
	     */
	    normalMap: TextureBase;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = NormalBasicMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/NormalHeightMapMethod" {
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import NormalBasicMethod = require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
	import ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
	/**
	 * NormalHeightMapMethod provides a normal map method that uses a height map to calculate the normals.
	 */
	class NormalHeightMapMethod extends NormalBasicMethod {
	    private _worldXYRatio;
	    private _worldXZRatio;
	    /**
	     * Creates a new NormalHeightMapMethod method.
	     *
	     * @param heightMap The texture containing the height data. 0 means low, 1 means high.
	     * @param worldWidth The width of the 'world'. This is used to map uv coordinates' u component to scene dimensions.
	     * @param worldHeight The height of the 'world'. This is used to map the height map values to scene dimensions.
	     * @param worldDepth The depth of the 'world'. This is used to map uv coordinates' v component to scene dimensions.
	     */
	    constructor(heightMap: TextureBase, worldWidth: number, worldHeight: number, worldDepth: number);
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    tangentSpace: boolean;
	    /**
	     * @inheritDoc
	     */
	    copyFrom(method: ShadingMethodBase): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = NormalHeightMapMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/NormalSimpleWaterMethod" {
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import NormalBasicMethod = require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
	/**
	 * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
	 */
	class NormalSimpleWaterMethod extends NormalBasicMethod {
	    private _secondaryNormalMap;
	    private _water1OffsetX;
	    private _water1OffsetY;
	    private _water2OffsetX;
	    private _water2OffsetY;
	    /**
	     * Creates a new NormalSimpleWaterMethod object.
	     * @param waveMap1 A normal map containing one layer of a wave structure.
	     * @param waveMap2 A normal map containing a second layer of a wave structure.
	     */
	    constructor(normalMap?: TextureBase, secondaryNormalMap?: TextureBase);
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The translation of the first wave layer along the X-axis.
	     */
	    water1OffsetX: number;
	    /**
	     * The translation of the first wave layer along the Y-axis.
	     */
	    water1OffsetY: number;
	    /**
	     * The translation of the second wave layer along the X-axis.
	     */
	    water2OffsetX: number;
	    /**
	     * The translation of the second wave layer along the Y-axis.
	     */
	    water2OffsetY: number;
	    /**
	     * A second normal map that will be combined with the first to create a wave-like animation pattern.
	     */
	    secondaryNormalMap: TextureBase;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = NormalSimpleWaterMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/ShadingMethodBase" {
	import AssetBase = require("awayjs-core/lib/library/AssetBase");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	/**
	 * ShadingMethodBase provides an abstract base method for shading methods, used by compiled passes to compile
	 * the final shading program.
	 */
	class ShadingMethodBase extends AssetBase {
	    static assetType: string;
	    /**
	     * @inheritDoc
	     */
	    assetType: string;
	    /**
	     * Create a new ShadingMethodBase object.
	     */
	    constructor();
	    iIsUsed(shaderObject: ShaderObjectBase): boolean;
	    /**
	     * Initializes the properties for a MethodVO, including register and texture indices.
	     *
	     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	     *
	     * @internal
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * Initializes unchanging shader constants using the data from a MethodVO.
	     *
	     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	     *
	     * @internal
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * Indicates whether or not this method expects normals in tangent space. Override for object-space normals.
	     */
	    iUsesTangentSpace(): boolean;
	    /**
	     * Cleans up any resources used by the current object.
	     */
	    dispose(): void;
	    /**
	     * Resets the compilation state of the method.
	     *
	     * @internal
	     */
	    iReset(): void;
	    /**
	     * Resets the method's state for compilation.
	     *
	     * @internal
	     */
	    iCleanCompilationData(): void;
	    /**
	     * Get the vertex shader code for this method.
	     * @param vo The MethodVO object linking this method with the pass currently being compiled.
	     * @param regCache The register cache used during the compilation.
	     *
	     * @internal
	     */
	    iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Sets the render state for this method.
	     *
	     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	     * @param stage The Stage object currently used for rendering.
	     *
	     * @internal
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * Sets the render state for a single renderable.
	     *
	     * @param vo The MethodVO object linking this method with the pass currently being compiled.
	     * @param renderable The renderable currently being rendered.
	     * @param stage The Stage object currently used for rendering.
	     * @param camera The camera from which the scene is currently rendered.
	     *
	     * @internal
	     */
	    iSetRenderState(shaderObject: ShaderObjectBase, methodVO: MethodVO, renderable: RenderableBase, stage: Stage, camera: Camera): void;
	    /**
	     * Clears the render state for this method.
	     * @param vo The MethodVO object linking this method with the pass currently being compiled.
	     * @param stage The Stage object currently used for rendering.
	     *
	     * @internal
	     */
	    iDeactivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * Marks the shader program as invalid, so it will be recompiled before the next render.
	     *
	     * @internal
	     */
	    iInvalidateShaderProgram(): void;
	    /**
	     * Copies the state from a ShadingMethodBase object into the current object.
	     */
	    copyFrom(method: ShadingMethodBase): void;
	}
	export = ShadingMethodBase;
	
}

declare module "awayjs-methodmaterials/lib/methods/ShadowCascadeMethod" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import ShadowMapMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMapMethodBase");
	import ShadowMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");
	/**
	 * ShadowCascadeMethod is a shadow map method to apply cascade shadow mapping on materials.
	 * Must be used with a DirectionalLight with a CascadeShadowMapper assigned to its shadowMapper property.
	 *
	 * @see away.lights.CascadeShadowMapper
	 */
	class ShadowCascadeMethod extends ShadowMapMethodBase {
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
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * @inheritDoc
	     */
	    iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Creates the registers for the cascades' projection coordinates.
	     */
	    private initProjectionsRegs(registerCache);
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iSetRenderState(shaderObject: ShaderObjectBase, methodVO: MethodVO, renderable: RenderableBase, stage: Stage, camera: Camera): void;
	    /**
	     * Called when the shadow mappers cascade configuration changes.
	     */
	    private onCascadeChange(event);
	    /**
	     * Called when the base method's shader code is invalidated.
	     */
	    private onShaderInvalidated(event);
	}
	export = ShadowCascadeMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/ShadowDitheredMethod" {
	import DirectionalLight = require("awayjs-display/lib/entities/DirectionalLight");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import ShadowMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");
	/**
	 * ShadowDitheredMethod provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
	 */
	class ShadowDitheredMethod extends ShadowMethodBase {
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
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
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
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    _pGetPlanarFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Get the actual shader code for shadow mapping
	     * @param regCache The register cache managing the registers.
	     * @param depthMapRegister The texture register containing the depth map.
	     * @param decReg The register containing the depth map decoding data.
	     * @param targetReg The target register to add the shadow coverage.
	     */
	    private getSampleCode(shaderObject, methodVO, customDataReg, decReg, targetReg, regCache, sharedRegisters);
	    /**
	     * Adds the code for another tap to the shader code.
	     * @param uvReg The uv register for the tap.
	     * @param depthMapRegister The texture register containing the depth map.
	     * @param decReg The register containing the depth map decoding data.
	     * @param targetReg The target register to add the tap comparison result.
	     * @param regCache The register cache managing the registers.
	     * @return
	     */
	    private addSample(shaderObject, methodVO, uvReg, decReg, targetReg, regCache);
	    /**
	     * @inheritDoc
	     */
	    iActivateForCascade(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    _iGetCascadeFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = ShadowDitheredMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/ShadowFilteredMethod" {
	import DirectionalLight = require("awayjs-display/lib/entities/DirectionalLight");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import ShadowMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");
	/**
	 * ShadowFilteredMethod provides a softened shadowing technique by bilinearly interpolating shadow comparison
	 * results of neighbouring pixels.
	 */
	class ShadowFilteredMethod extends ShadowMethodBase {
	    /**
	     * Creates a new DiffuseBasicMethod object.
	     *
	     * @param castingLight The light casting the shadow
	     */
	    constructor(castingLight: DirectionalLight);
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    _pGetPlanarFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivateForCascade(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    _iGetCascadeFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = ShadowFilteredMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/ShadowHardMethod" {
	import LightBase = require("awayjs-display/lib/base/LightBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import ShadowMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");
	/**
	 * ShadowHardMethod provides the cheapest shadow map method by using a single tap without any filtering.
	 */
	class ShadowHardMethod extends ShadowMethodBase {
	    /**
	     * Creates a new ShadowHardMethod object.
	     */
	    constructor(castingLight: LightBase);
	    /**
	     * @inheritDoc
	     */
	    _pGetPlanarFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _pGetPointFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _iGetCascadeFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivateForCascade(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	}
	export = ShadowHardMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/ShadowMapMethodBase" {
	import IAsset = require("awayjs-core/lib/library/IAsset");
	import LightBase = require("awayjs-display/lib/base/LightBase");
	import ShadowMapperBase = require("awayjs-display/lib/materials/shadowmappers/ShadowMapperBase");
	import ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
	/**
	 * ShadowMapMethodBase provides an abstract base method for shadow map methods.
	 */
	class ShadowMapMethodBase extends ShadingMethodBase implements IAsset {
	    static assetType: string;
	    _pCastingLight: LightBase;
	    _pShadowMapper: ShadowMapperBase;
	    _pEpsilon: number;
	    _pAlpha: number;
	    /**
	     * Creates a new ShadowMapMethodBase object.
	     * @param castingLight The light used to cast shadows.
	     */
	    constructor(castingLight: LightBase);
	    /**
	     * @inheritDoc
	     */
	    assetType: string;
	    /**
	     * The "transparency" of the shadows. This allows making shadows less strong.
	     */
	    alpha: number;
	    /**
	     * The light casting the shadows.
	     */
	    castingLight: LightBase;
	    /**
	     * A small value to counter floating point precision errors when comparing values in the shadow map with the
	     * calculated depth value. Increase this if shadow banding occurs, decrease it if the shadow seems to be too detached.
	     */
	    epsilon: number;
	}
	export = ShadowMapMethodBase;
	
}

declare module "awayjs-methodmaterials/lib/methods/ShadowMethodBase" {
	import LightBase = require("awayjs-display/lib/base/LightBase");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import ShadowMapMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMapMethodBase");
	/**
	 * ShadowMethodBase provides an abstract method for simple (non-wrapping) shadow map methods.
	 */
	class ShadowMethodBase extends ShadowMapMethodBase {
	    _pDepthMapCoordReg: ShaderRegisterElement;
	    _pUsePoint: boolean;
	    /**
	     * Creates a new ShadowMethodBase object.
	     * @param castingLight The light used to cast shadows.
	     */
	    constructor(castingLight: LightBase);
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * Wrappers that override the vertex shader need to set this explicitly
	     */
	    _iDepthMapCoordReg: ShaderRegisterElement;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * @inheritDoc
	     */
	    iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Gets the vertex code for shadow mapping with a point light.
	     *
	     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	     * @param regCache The register cache used during the compilation.
	     */
	    _pGetPointVertexCode(methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Gets the vertex code for shadow mapping with a planar shadow map (fe: directional lights).
	     *
	     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	     * @param regCache The register cache used during the compilation.
	     */
	    pGetPlanarVertexCode(methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Gets the fragment code for shadow mapping with a planar shadow map.
	     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	     * @param regCache The register cache used during the compilation.
	     * @param targetReg The register to contain the shadow coverage
	     * @return
	     */
	    _pGetPlanarFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Gets the fragment code for shadow mapping with a point light.
	     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	     * @param regCache The register cache used during the compilation.
	     * @param targetReg The register to contain the shadow coverage
	     * @return
	     */
	    _pGetPointFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iSetRenderState(shaderObject: ShaderObjectBase, methodVO: MethodVO, renderable: RenderableBase, stage: Stage, camera: Camera): void;
	    /**
	     * Gets the fragment code for combining this method with a cascaded shadow map method.
	     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	     * @param regCache The register cache used during the compilation.
	     * @param decodeRegister The register containing the data to decode the shadow map depth value.
	     * @param depthTexture The texture containing the shadow map.
	     * @param depthProjection The projection of the fragment relative to the light.
	     * @param targetRegister The register to contain the shadow coverage
	     * @return
	     */
	    _iGetCascadeFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * Sets the method state for cascade shadow mapping.
	     */
	    iActivateForCascade(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	}
	export = ShadowMethodBase;
	
}

declare module "awayjs-methodmaterials/lib/methods/ShadowNearMethod" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import ShadowMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");
	/**
	 * ShadowNearMethod provides a shadow map method that restricts the shadowed area near the camera to optimize
	 * shadow map usage. This method needs to be used in conjunction with a NearDirectionalShadowMapper.
	 *
	 * @see away.lights.NearDirectionalShadowMapper
	 */
	class ShadowNearMethod extends ShadowMethodBase {
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
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
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
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iDeactivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iSetRenderState(shaderObject: ShaderObjectBase, methodVO: MethodVO, renderable: RenderableBase, stage: Stage, camera: Camera): void;
	    /**
	     * @inheritDoc
	     */
	    iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
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
	export = ShadowNearMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/ShadowSoftMethod" {
	import DirectionalLight = require("awayjs-display/lib/entities/DirectionalLight");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import ShadowMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");
	/**
	 * ShadowSoftMethod provides a soft shadowing technique by randomly distributing sample points.
	 */
	class ShadowSoftMethod extends ShadowMethodBase {
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
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    _pGetPlanarFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Adds the code for another tap to the shader code.
	     * @param uv The uv register for the tap.
	     * @param texture The texture register containing the depth map.
	     * @param decode The register containing the depth map decoding data.
	     * @param target The target register to add the tap comparison result.
	     * @param regCache The register cache managing the registers.
	     * @return
	     */
	    private addSample(shaderObject, methodVO, decodeRegister, targetRegister, registerCache, uvReg);
	    /**
	     * @inheritDoc
	     */
	    iActivateForCascade(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    _iGetCascadeFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Get the actual shader code for shadow mapping
	     * @param regCache The register cache managing the registers.
	     * @param depthTexture The texture register containing the depth map.
	     * @param decodeRegister The register containing the depth map decoding data.
	     * @param targetReg The target register to add the shadow coverage.
	     * @param dataReg The register containing additional data.
	     */
	    private getSampleCode(shaderObject, methodVO, decodeRegister, targetRegister, registerCache, dataReg);
	}
	export = ShadowSoftMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/SpecularAnisotropicMethod" {
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import SpecularBasicMethod = require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
	/**
	 * SpecularAnisotropicMethod provides a specular method resulting in anisotropic highlights. These are typical for
	 * surfaces with microfacet details such as tiny grooves. In particular, this uses the Heidrich-Seidel distrubution.
	 * The tangent vectors are used as the surface groove directions.
	 */
	class SpecularAnisotropicMethod extends SpecularBasicMethod {
	    /**
	     * Creates a new SpecularAnisotropicMethod object.
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = SpecularAnisotropicMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/SpecularBasicMethod" {
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import LightingMethodBase = require("awayjs-methodmaterials/lib/methods/LightingMethodBase");
	import ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
	/**
	 * SpecularBasicMethod provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
	 * version of Phong specularity).
	 */
	class SpecularBasicMethod extends LightingMethodBase {
	    _pTotalLightColorReg: ShaderRegisterElement;
	    _pSpecularTexData: ShaderRegisterElement;
	    _pSpecularDataRegister: ShaderRegisterElement;
	    private _texture;
	    private _gloss;
	    private _specular;
	    private _specularColor;
	    _iSpecularR: number;
	    _iSpecularG: number;
	    _iSpecularB: number;
	    _pIsFirstLight: boolean;
	    /**
	     * Creates a new SpecularBasicMethod object.
	     */
	    constructor();
	    iIsUsed(shaderObject: ShaderLightingObject): boolean;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * The sharpness of the specular highlight.
	     */
	    gloss: number;
	    /**
	     * The overall strength of the specular highlights.
	     */
	    specular: number;
	    /**
	     * The colour of the specular reflection of the surface.
	     */
	    specularColor: number;
	    /**
	     * The bitmapData that encodes the specular highlight strength per texel in the red channel, and the sharpness
	     * in the green channel. You can use SpecularTextureBase if you want to easily set specular and gloss maps
	     * from grayscale images, but prepared images are preferred.
	     */
	    texture: TextureBase;
	    /**
	     * @inheritDoc
	     */
	    copyFrom(method: ShadingMethodBase): void;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerProbe(shaderObject: ShaderLightingObject, methodVO: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * Updates the specular color data used by the render state.
	     */
	    private updateSpecular();
	}
	export = SpecularBasicMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/SpecularCelMethod" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import SpecularBasicMethod = require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
	import SpecularCompositeMethod = require("awayjs-methodmaterials/lib/methods/SpecularCompositeMethod");
	/**
	 * SpecularCelMethod provides a shading method to add specular cel (cartoon) shading.
	 */
	class SpecularCelMethod extends SpecularCompositeMethod {
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
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
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
	    private clampSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = SpecularCelMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/SpecularCompositeMethod" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import SpecularBasicMethod = require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
	/**
	 * SpecularCompositeMethod provides a base class for specular methods that wrap a specular method to alter the
	 * calculated specular reflection strength.
	 */
	class SpecularCompositeMethod extends SpecularBasicMethod {
	    private _baseMethod;
	    private _onShaderInvalidatedDelegate;
	    /**
	     * Creates a new <code>SpecularCompositeMethod</code> object.
	     *
	     * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature modSpecular(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the specular strength and t.xyz will contain the half-vector or the reflection vector.
	     * @param baseMethod The base specular method on which this method's shading is based.
	     */
	    constructor(modulateMethod: (shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData) => string, baseMethod?: SpecularBasicMethod);
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The base specular method on which this method's shading is based.
	     */
	    baseMethod: SpecularBasicMethod;
	    /**
	     * @inheritDoc
	     */
	    gloss: number;
	    /**
	     * @inheritDoc
	     */
	    specular: number;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    texture: TextureBase;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iSetRenderState(shaderObject: ShaderLightingObject, methodVO: MethodVO, renderable: RenderableBase, stage: Stage, camera: Camera): void;
	    /**
	     * @inheritDoc
	     */
	    iDeactivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     * @return
	     */
	    iGetFragmentCodePerProbe(shaderObject: ShaderLightingObject, methodVO: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
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
	export = SpecularCompositeMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/SpecularFresnelMethod" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import SpecularBasicMethod = require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
	import SpecularCompositeMethod = require("awayjs-methodmaterials/lib/methods/SpecularCompositeMethod");
	/**
	 * SpecularFresnelMethod provides a specular shading method that causes stronger highlights on grazing view angles.
	 */
	class SpecularFresnelMethod extends SpecularCompositeMethod {
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
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
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
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Applies the fresnel effect to the specular strength.
	     *
	     * @param vo The MethodVO object containing the method data for the currently compiled material pass.
	     * @param target The register containing the specular strength in the "w" component, and the half-vector/reflection vector in "xyz".
	     * @param regCache The register cache used for the shader compilation.
	     * @param sharedRegisters The shared registers created by the compiler.
	     * @return The AGAL fragment code for the method.
	     */
	    private modulateSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
	}
	export = SpecularFresnelMethod;
	
}

declare module "awayjs-methodmaterials/lib/methods/SpecularPhongMethod" {
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import SpecularBasicMethod = require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
	/**
	 * SpecularPhongMethod provides a specular method that provides Phong highlights.
	 */
	class SpecularPhongMethod extends SpecularBasicMethod {
	    /**
	     * Creates a new SpecularPhongMethod object.
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = SpecularPhongMethod;
	
}

declare module "awayjs-methodmaterials/lib/passes/MethodPass" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import MaterialBase = require("awayjs-display/lib/materials/MaterialBase");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import LightPickerBase = require("awayjs-display/lib/materials/lightpickers/LightPickerBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	import IRenderLightingPass = require("awayjs-renderergl/lib/passes/IRenderLightingPass");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	import MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
	import RenderMethodMaterialObject = require("awayjs-methodmaterials/lib/compilation/RenderMethodMaterialObject");
	import AmbientBasicMethod = require("awayjs-methodmaterials/lib/methods/AmbientBasicMethod");
	import DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
	import EffectColorTransformMethod = require("awayjs-methodmaterials/lib/methods/EffectColorTransformMethod");
	import EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
	import NormalBasicMethod = require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
	import ShadowMapMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMapMethodBase");
	import SpecularBasicMethod = require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
	/**
	 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
	 * using material methods to define their appearance.
	 */
	class MethodPass extends RenderPassBase implements IRenderLightingPass {
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
	    enableLightFallOff: boolean;
	    /**
	     * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
	     * and/or light probes for diffuse reflections.
	     *
	     * @see away3d.materials.LightSources
	     */
	    diffuseLightSources: number;
	    /**
	     * Define which light source types to use for specular reflections. This allows choosing between regular lights
	     * and/or light probes for specular reflections.
	     *
	     * @see away3d.materials.LightSources
	     */
	    specularLightSources: number;
	    /**
	     * Creates a new CompiledPass object.
	     *
	     * @param material The material to which this pass belongs.
	     */
	    constructor(mode: number, renderObject: RenderMethodMaterialObject, renderObjectOwner: MaterialBase, renderableClass: IRenderableClass, stage: Stage);
	    private _updateShader();
	    /**
	     * Initializes the unchanging constant data for this material.
	     */
	    _iInitConstantData(shaderObject: ShaderObjectBase): void;
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
	    numEffectMethods: number;
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
	    _iRender(renderable: RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * @inheritDoc
	     */
	    _iDeactivate(): void;
	    _iIncludeDependencies(shaderObject: ShaderLightingObject): void;
	    /**
	     * Counts the dependencies for a given method.
	     * @param method The method to count the dependencies for.
	     * @param methodVO The method's data for this material.
	     */
	    private setupAndCountDependencies(shaderObject, methodVO);
	    _iGetPreLightingVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPreLightingFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPerLightDiffuseFragmentCode(shaderObject: ShaderLightingObject, lightDirReg: ShaderRegisterElement, diffuseColorReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPerLightSpecularFragmentCode(shaderObject: ShaderLightingObject, lightDirReg: ShaderRegisterElement, specularColorReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPerProbeDiffuseFragmentCode(shaderObject: ShaderLightingObject, texReg: ShaderRegisterElement, weightReg: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPerProbeSpecularFragmentCode(shaderObject: ShaderLightingObject, texReg: ShaderRegisterElement, weightReg: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPostLightingVertexCode(shaderObject: ShaderLightingObject, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPostLightingFragmentCode(shaderObject: ShaderLightingObject, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Indicates whether or not normals are allowed in tangent space. This is only the case if no object-space
	     * dependencies exist.
	     */
	    _pUsesTangentSpace(shaderObject: ShaderLightingObject): boolean;
	    /**
	     * Indicates whether or not normals are output in tangent space.
	     */
	    _pOutputsTangentNormals(shaderObject: ShaderObjectBase): boolean;
	    /**
	     * Indicates whether or not normals are output by the pass.
	     */
	    _pOutputsNormals(shaderObject: ShaderObjectBase): boolean;
	    _iGetNormalVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetNormalFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _iGetVertexCode(shaderObject: ShaderObjectBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _iGetFragmentCode(shaderObject: ShaderObjectBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
	    /**
	     * Indicates whether the shader uses any shadows.
	     */
	    _iUsesShadows(shaderObject: ShaderObjectBase): boolean;
	    /**
	     * Indicates whether the shader uses any specular component.
	     */
	    _iUsesSpecular(shaderObject: ShaderObjectBase): boolean;
	    /**
	     * Indicates whether the shader uses any specular component.
	     */
	    _iUsesDiffuse(shaderObject: ShaderObjectBase): boolean;
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
	export = MethodPass;
	
}

declare module "awayjs-methodmaterials/lib/passes/MethodPassMode" {
	class PassMode {
	    /**
	     *
	     */
	    static EFFECTS: number;
	    /**
	     *
	     */
	    static LIGHTING: number;
	    /**
	     *
	     */
	    static SUPER_SHADER: number;
	}
	export = PassMode;
	
}

declare module "awayjs-methodmaterials/lib/passes/SingleObjectDepthPass" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	/**
	 * The SingleObjectDepthPass provides a material pass that renders a single object to a depth map from the point
	 * of view from a light.
	 */
	class SingleObjectDepthPass extends RenderPassBase {
	    private _textures;
	    private _projections;
	    private _textureSize;
	    private _polyOffset;
	    private _enc;
	    private _projectionTexturesInvalid;
	    /**
	     * The size of the depth map texture to render to.
	     */
	    textureSize: number;
	    /**
	     * The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
	     */
	    polyOffset: number;
	    /**
	     * Creates a new SingleObjectDepthPass object.
	     */
	    constructor(renderObject: RenderObjectBase, renderObjectOwner: IRenderObjectOwner, renderableClass: IRenderableClass, stage: Stage);
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * Updates the projection textures used to contain the depth renders.
	     */
	    private updateProjectionTextures();
	    /**
	     * @inheritDoc
	     */
	    _iGetVertexCode(): string;
	    /**
	     * @inheritDoc
	     */
	    _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Gets the depth maps rendered for this object from all lights.
	     * @param renderable The renderable for which to retrieve the depth maps.
	     * @param stage3DProxy The Stage3DProxy object currently used for rendering.
	     * @return A list of depth map textures for all supported lights.
	     */
	    _iGetDepthMap(renderable: RenderableBase): TextureBase;
	    /**
	     * Retrieves the depth map projection maps for all lights.
	     * @param renderable The renderable for which to retrieve the projection maps.
	     * @return A list of projection maps for all supported lights.
	     */
	    _iGetProjection(renderable: RenderableBase): Matrix3D;
	    /**
	     * @inheritDoc
	     */
	    _iRender(renderable: RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(camera: Camera): void;
	}
	export = SingleObjectDepthPass;
	
}

declare module "awayjs-methodmaterials/lib/pool/MethodRenderablePool" {
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderablePoolBase = require("awayjs-renderergl/lib/pool/RenderablePoolBase");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	/**
	 * @class away.pool.MethodRenderablePool
	 */
	class MethodRenderablePool extends RenderablePoolBase {
	    private _methodMaterialRenderObjectPool;
	    /**
	     * //TODO
	     *
	     * @param renderableClass
	     */
	    constructor(renderableClass: IRenderableClass, stage: Stage);
	    /**
	     *
	     * @param material
	     * @param renderable
	     */
	    getMethodRenderObject(renderObjectOwner: IRenderObjectOwner): RenderObjectBase;
	    /**
	     * //TODO
	     *
	     * @param renderableClass
	     * @returns MethodRenderablePool
	     */
	    static getPool(renderableClass: IRenderableClass, stage: Stage): MethodRenderablePool;
	}
	export = MethodRenderablePool;
	
}

declare module "awayjs-methodmaterials/lib/pool/MethodRendererPool" {
	import RendererBase = require("awayjs-renderergl/lib/RendererBase");
	import RendererPoolBase = require("awayjs-renderergl/lib/pool/RendererPoolBase");
	/**
	 * MethodRendererPool forms an abstract base class for classes that are used in the rendering pipeline to render the
	 * contents of a partition
	 *
	 * @class away.render.MethodRendererPool
	 */
	class MethodRendererPool extends RendererPoolBase {
	    /**
	     * Creates a new MethodRendererPool object.
	     */
	    constructor(renderer: RendererBase);
	    _pUpdatePool(): void;
	}
	export = MethodRendererPool;
	
}

