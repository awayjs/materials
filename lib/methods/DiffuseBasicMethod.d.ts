import { Camera } from "@awayjs/display/lib/display/Camera";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { ShadingMethodBase } from "../methods/ShadingMethodBase";
import { LightingMethodBase } from "../methods/LightingMethodBase";
/**
 * DiffuseBasicMethod provides the default shading method for Lambert (dot3) diffuse lighting.
 */
export declare class DiffuseBasicMethod extends LightingMethodBase {
    private _multiply;
    _pTotalLightColorReg: ShaderRegisterElement;
    _texture: TextureBase;
    private _ambientColor;
    private _ambientColorR;
    private _ambientColorG;
    private _ambientColorB;
    private _color;
    private _colorR;
    private _colorG;
    private _colorB;
    _pIsFirstLight: boolean;
    /**
     * Creates a new DiffuseBasicMethod object.
     */
    constructor();
    iIsUsed(shader: LightingShader): boolean;
    /**
     * Set internally if diffuse color component multiplies or replaces the ambient color
     */
    multiply: boolean;
    iInitVO(shader: LightingShader, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iInitConstants(shader: LightingShader, methodVO: MethodVO): void;
    /**
     * The color of the diffuse reflection when not using a texture.
     */
    color: number;
    /**
     * The texture to use to define the diffuse reflection color per texel.
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
     * Generate the code that applies the calculated shadow to the diffuse light
     * @param methodVO The MethodVO object for which the compilation is currently happening.
     * @param regCache The register cache the compiler is currently using for the register management.
     */
    pApplyShadow(shader: LightingShader, methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iActivate(shader: LightingShader, methodVO: MethodVO, stage: Stage): void;
    /**
     * Updates the diffuse color data used by the render state.
     */
    private updateColor();
    /**
     * Updates the ambient color data used by the render state.
     */
    private updateAmbientColor();
    /**
     * @inheritDoc
     */
    iSetRenderState(shader: LightingShader, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
}
