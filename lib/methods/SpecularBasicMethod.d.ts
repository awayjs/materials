import { Camera } from "@awayjs/display/lib/display/Camera";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { LightingMethodBase } from "../methods/LightingMethodBase";
import { ShadingMethodBase } from "../methods/ShadingMethodBase";
/**
 * SpecularBasicMethod provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
 * version of Phong specularity).
 */
export declare class SpecularBasicMethod extends LightingMethodBase {
    _pTotalLightColorReg: ShaderRegisterElement;
    _pSpecularTexData: ShaderRegisterElement;
    _pSpecularDataRegister: ShaderRegisterElement;
    private _texture;
    private _gloss;
    private _strength;
    private _color;
    _iSpecularR: number;
    _iSpecularG: number;
    _iSpecularB: number;
    _pIsFirstLight: boolean;
    /**
     * Creates a new SpecularBasicMethod object.
     */
    constructor();
    iIsUsed(shader: LightingShader): boolean;
    /**
     * @inheritDoc
     */
    iInitVO(shader: LightingShader, methodVO: MethodVO): void;
    /**
     * The glossiness of the material (sharpness of the specular highlight).
     */
    gloss: number;
    /**
     * The overall strength of the specular highlights.
     */
    strength: number;
    /**
     * The colour of the specular reflection of the surface.
     */
    color: number;
    /**
     * A texture that defines the strength of specular reflections for each texel in the red channel,
     * and the gloss factor (sharpness) in the green channel. You can use Specular2DTexture if you want to easily set
     * specular and gloss maps from grayscale images, but correctly authored images are preferred.
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
    iGetFragmentPreLightingCode(shader: LightingShader, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iGetFragmentCodePerLight(shader: LightingShader, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iGetFragmentCodePerProbe(shader: LightingShader, methodVO: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iGetFragmentPostLightingCode(shader: LightingShader, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iActivate(shader: LightingShader, methodVO: MethodVO, stage: Stage): void;
    iSetRenderState(shader: LightingShader, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * Updates the specular color data used by the render state.
     */
    private updateSpecular();
}
