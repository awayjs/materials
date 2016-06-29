import { Camera } from "@awayjs/display/lib/display/Camera";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { ISurface } from "@awayjs/display/lib/base/ISurface";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { SpecularBasicMethod } from "../methods/SpecularBasicMethod";
/**
 * SpecularCompositeMethod provides a base class for specular methods that wrap a specular method to alter the
 * calculated specular reflection strength.
 */
export declare class SpecularCompositeMethod extends SpecularBasicMethod {
    private _baseMethod;
    private _onShaderInvalidatedDelegate;
    /**
     * Creates a new <code>SpecularCompositeMethod</code> object.
     *
     * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature modSpecular(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the specular strength and t.xyz will contain the half-vector or the reflection vector.
     * @param baseMethod The base specular method on which this method's shading is based.
     */
    constructor(modulateMethod: (shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData) => string, baseMethod?: SpecularBasicMethod);
    /**
     * @inheritDoc
     */
    iInitVO(shader: LightingShader, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    iAddOwner(owner: ISurface): void;
    iRemoveOwner(owner: ISurface): void;
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
    strength: number;
    /**
     * @inheritDoc
     */
    /**
     * @inheritDoc
     */
    color: number;
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
    iActivate(shader: LightingShader, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    iSetRenderState(shader: LightingShader, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * @inheritDoc
     */
    iDeactivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    iGetVertexCode(shader: ShaderBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
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
     * @return
     */
    iGetFragmentCodePerProbe(shader: LightingShader, methodVO: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    iGetFragmentPostLightingCode(shader: LightingShader, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
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
