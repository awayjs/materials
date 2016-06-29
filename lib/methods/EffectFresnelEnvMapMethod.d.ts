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
 * EffectFresnelEnvMapMethod provides a method to add fresnel-based reflectivity to an object using cube maps, which gets
 * stronger as the viewing angle becomes more grazing.
 */
export declare class EffectFresnelEnvMapMethod extends EffectMethodBase {
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
    iInitVO(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
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
    iActivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    iSetRenderState(shader: ShaderBase, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * @inheritDoc
     */
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
}
