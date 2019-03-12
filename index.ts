
console.log("AwayJS - Materials - 0.5.0");

export {LightEvent} from "./lib/events/LightEvent";
export {TextureProjectorEvent} from "./lib/events/TextureProjectorEvent";
export {MethodEvent} from "./lib/events/MethodEvent";

export {DirectionalLight} from "./lib/lights/DirectionalLight";
export {LightBase} from "./lib/lights/LightBase";
export {LightProbe} from "./lib/lights/LightProbe";
export {PointLight} from "./lib/lights/PointLight";
export {TextureProjector} from "./lib/lights/TextureProjector";

export {_IShader_LightingMethod} from "./lib/methods/_IShader_LightingMethod";
export {_IShader_Method} from "./lib/methods/_IShader_Method";
export {AmbientBasicMethod, _Shader_AmbientBasicMethod} from "./lib/methods/AmbientBasicMethod";
export {AmbientDepthMethod, _Shader_AmbientDepthMethod} from "./lib/methods/AmbientDepthMethod";
export {CompositeMethodBase, _Shader_LightingCompositeMethod, _Shader_CompositeMethodBase} from "./lib/methods/CompositeMethodBase";
export {DiffuseBasicMethod, _Shader_DiffuseBasicMethod} from "./lib/methods/DiffuseBasicMethod";
export {DiffuseCelMethod, _Shader_DiffuseCelMethod} from "./lib/methods/DiffuseCelMethod";
export {DiffuseCompositeMethod} from "./lib/methods/DiffuseCompositeMethod";
export {DiffuseGradientMethod, _Shader_DiffuseGradientMethod} from "./lib/methods/DiffuseGradientMethod";
export {DiffuseLightMapMethod, _Shader_DiffuseLightMapMethod} from "./lib/methods/DiffuseLightMapMethod";
export {DiffuseWrapMethod, _Shader_DiffuseWrapMethod} from "./lib/methods/DiffuseWrapMethod";
export {EffectAlphaMaskMethod, _Shader_EffectAlphaMaskMethod} from "./lib/methods/EffectAlphaMaskMethod";
export {EffectColorMatrixMethod, _Shader_EffectColorMatrixMethod} from "./lib/methods/EffectColorMatrixMethod";
export {EffectColorTransformMethod, _Shader_EffectColorTransformMethod} from "./lib/methods/EffectColorTransformMethod";
export {EffectEnvMapMethod, _Shader_EffectEnvMapMethod} from "./lib/methods/EffectEnvMapMethod";
export {EffectFogMethod, _Shader_EffectFogMethod} from "./lib/methods/EffectFogMethod";
export {EffectFresnelEnvMapMethod, _Shader_EffectFresnelEnvMapMethod} from "./lib/methods/EffectFresnelEnvMapMethod";
export {EffectLightMapMethod, _Shader_EffectLightMapMethod} from "./lib/methods/EffectLightMapMethod";
export {EffectProjectiveTextureMethod, _Shader_EffectProjectiveTextureMethod} from "./lib/methods/EffectProjectiveTextureMethod";
export {EffectRefractionEnvMapMethod, _Shader_EffectRefractionEnvMapMethod} from "./lib/methods/EffectRefractionEnvMapMethod";
export {EffectRimLightMethod, _Shader_EffectRimLightMethod} from "./lib/methods/EffectRimLightMethod";
export {NormalBasicMethod, _Shader_NormalBasicMethod} from "./lib/methods/NormalBasicMethod";
export {NormalHeightMapMethod, _Shader_NormalHeightMapMethod} from "./lib/methods/NormalHeightMapMethod";
export {NormalSimpleWaterMethod, _Shader_NormalSimpleWaterMethod} from "./lib/methods/NormalSimpleWaterMethod";
export {MethodBase, _Shader_MethodBase} from "./lib/methods/MethodBase";
export {ShadowDitheredMethod, _Shader_ShadowDitheredMethod} from "./lib/methods/ShadowDitheredMethod";
export {ShadowFilteredMethod, _Shader_ShadowFilteredMethod} from "./lib/methods/ShadowFilteredMethod";
export {ShadowHardMethod, _Shader_ShadowHardMethod} from "./lib/methods/ShadowHardMethod";
export {ShadowMethodBase, _Shader_ShadowMethodBase} from "./lib/methods/ShadowMethodBase";
export {ShadowSoftMethod, _Shader_ShadowSoftMethod} from "./lib/methods/ShadowSoftMethod";
export {SpecularAnisotropicMethod, _Shader_SpecularAnisotropicMethod} from "./lib/methods/SpecularAnisotropicMethod";
export {SpecularBasicMethod, _Shader_SpecularBasicMethod} from "./lib/methods/SpecularBasicMethod";
export {SpecularCelMethod, _Shader_SpecularCelMethod} from "./lib/methods/SpecularCelMethod";
export {SpecularCompositeMethod} from "./lib/methods/SpecularCompositeMethod";
export {SpecularFresnelMethod, _Shader_SpecularFresnelMethod} from "./lib/methods/SpecularFresnelMethod";
export {SpecularPhongMethod, _Shader_SpecularPhongMethod} from "./lib/methods/SpecularPhongMethod";

export {ILightingPass} from "./lib/passes/ILightingPass";
export {MethodPass} from "./lib/passes/MethodPass";
export {MethodPassMode} from "./lib/passes/MethodPassMode";
export {BasicMaterialPass} from "./lib/passes/BasicMaterialPass";
export {PassBase} from "./lib/passes/PassBase";

export {LightPickerBase} from "./lib/lightpickers/LightPickerBase";
export {LightSources} from "./lib/lightpickers/LightSources";
export {StaticLightPicker} from "./lib/lightpickers/StaticLightPicker";

export {CascadeShadowMapper, _Shader_CascadeShadowMapper} from "./lib/mappers/CascadeShadowMapper";
export {PointShadowMapper, _Shader_PointShadowMapper} from "./lib/mappers/PointShadowMapper";
export {DirectionalShadowMapper, _Shader_DirectionalShadowMapper} from "./lib/mappers/DirectionalShadowMapper";
export {NearDirectionalShadowMapper, _Shader_NearDirectionalShadowMapper} from "./lib/mappers/NearDirectionalShadowMapper";
export {ShadowMapperBase, _Shader_ShadowMapperBase} from "./lib/mappers/ShadowMapperBase";

export {LightingShader} from "./lib/shaders/LightingShader";

export {DepthTexture2D} from "./lib/textures/DepthTexture2D";
export {DepthTextureCube, _Shader_DepthTexture} from "./lib/textures/DepthTextureCube";
export {ImageTexture2D, _Shader_ImageTexture2D} from "./lib/textures/ImageTexture2D";
export {ImageTextureCube, _Shader_ImageTexture} from "./lib/textures/ImageTextureCube";
export {ShadowTexture2D, _Shader_ShadowTexture2D} from "./lib/textures/ShadowTexture2D";
export {ShadowTextureCube, _Shader_ShadowTextureCube} from "./lib/textures/ShadowTextureCube";
export {Texture2D} from "./lib/textures/Texture2D";
export {TextureBase} from "./lib/textures/TextureBase";
export {TextureCube} from "./lib/textures/TextureCube";
export {VideoTexture} from "./lib/textures/VideoTexture";

export {BasicMaterial, _Render_BasicMaterial} from "./lib/BasicMaterial";
export {MaterialBase, _Render_MaterialPassBase,_Render_DepthMaterial, _Render_DistanceMaterial} from "./lib/MaterialBase";
export {MethodMaterial, _Render_MethodMaterial} from "./lib/MethodMaterial";
export {MethodMaterialMode} from "./lib/MethodMaterialMode";