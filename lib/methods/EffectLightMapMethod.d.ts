import { Camera } from "@awayjs/display/lib/display/Camera";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { EffectMethodBase } from "../methods/EffectMethodBase";
/**
 * EffectLightMapMethod provides a method that allows applying a light map texture to the calculated pixel colour.
 * It is different from DiffuseLightMapMethod in that the latter only modulates the diffuse shading value rather
 * than the whole pixel colour.
 */
export declare class EffectLightMapMethod extends EffectMethodBase {
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
    iInitVO(shader: ShaderBase, methodVO: MethodVO): void;
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
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iActivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    iSetRenderState(shader: ShaderBase, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
}
