import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { ShaderBase } from "@awayjs/renderer/lib/shaders/ShaderBase";
import { ShaderRegisterCache } from "@awayjs/renderer/lib/shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "@awayjs/renderer/lib/shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "@awayjs/renderer/lib/shaders/ShaderRegisterElement";
import { MethodVO } from "../data/MethodVO";
import { NormalBasicMethod } from "../methods/NormalBasicMethod";
import { ShadingMethodBase } from "../methods/ShadingMethodBase";
/**
 * NormalHeightMapMethod provides a normal map method that uses a height map to calculate the normals.
 */
export declare class NormalHeightMapMethod extends NormalBasicMethod {
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
    iInitConstants(shader: ShaderBase, methodVO: MethodVO): void;
    /**
     * @inheritDoc
     */
    readonly tangentSpace: boolean;
    /**
     * @inheritDoc
     */
    copyFrom(method: ShadingMethodBase): void;
    /**
     * @inheritDoc
     */
    iGetFragmentCode(shader: ShaderBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
}
