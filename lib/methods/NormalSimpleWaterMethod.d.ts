import { Camera } from "@awayjs/display/lib/display/Camera";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { GL_RenderableBase } from "@awayjs/renderer/lib/renderables/GL_RenderableBase";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { NormalBasicMethod } from "../methods/NormalBasicMethod";
/**
 * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
 */
export declare class NormalSimpleWaterMethod extends NormalBasicMethod {
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
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    iInitVO(shader: ShaderBase, methodVO: MethodVO): void;
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
    iActivate(shader: ShaderBase, methodVO: MethodVO, stage: Stage): void;
    /**
     * @inheritDoc
     */
    iSetRenderState(shader: ShaderBase, methodVO: MethodVO, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * @inheritDoc
     */
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
}
