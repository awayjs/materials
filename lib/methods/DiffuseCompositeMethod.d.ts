import { Camera } from "@awayjs/display/lib/display/Camera";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { ISurface } from "@awayjs/display/lib/base/ISurface";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { LightingShader } from "@awayjs/renderer/lib/shaders/LightingShader";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { MethodVO } from "../data/MethodVO";
import { DiffuseBasicMethod } from "../methods/DiffuseBasicMethod";
/**
 * DiffuseCompositeMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
 * calculated diffuse reflection strength.
 */
export declare class DiffuseCompositeMethod extends DiffuseBasicMethod {
    pBaseMethod: DiffuseBasicMethod;
    private _onShaderInvalidatedDelegate;
    /**
     * Creates a new <code>DiffuseCompositeMethod</code> object.
     *
     * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
     * @param baseMethod The base diffuse method on which this method's shading is based.
     */
    constructor(modulateMethod: (shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData) => string, baseMethod?: DiffuseBasicMethod);
    /**
     * The base diffuse method on which this method's shading is based.
     */
    baseMethod: DiffuseBasicMethod;
    /**
     * @inheritDoc
     */
    iInitVO(shader: LightingShader, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iInitConstants(shader: LightingShader, methodVO: MethodVO): void;
    iAddOwner(owner: ISurface): void;
    iRemoveOwner(owner: ISurface): void;
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
    color: number;
    /**
     * @inheritDoc
     */
    /**
     * @inheritDoc
     */
    multiply: boolean;
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
    iActivate(shader: LightingShader, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    iSetRenderState(shader: LightingShader, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * @inheritDoc
     */
    iDeactivate(shader: LightingShader, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    iGetVertexCode(shader: ShaderBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
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
