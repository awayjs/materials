import { GL_TextureBase } from "@awayjs/renderer/lib/textures/GL_TextureBase";
import { MethodPass } from "../surfaces/passes/MethodPass";
import { ShadingMethodBase } from "../methods/ShadingMethodBase";
/**
 * MethodVO contains data for a given shader object for the use within a single material.
 * This allows shader methods to be shared across materials while their non-public state differs.
 */
export declare class MethodVO {
    useMethod: boolean;
    method: ShadingMethodBase;
    pass: MethodPass;
    textureGL: GL_TextureBase;
    secondaryTextureGL: GL_TextureBase;
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
    constructor(method: ShadingMethodBase, pass: MethodPass);
    /**
     * Resets the values of the value object to their "unused" state.
     */
    reset(): void;
}
