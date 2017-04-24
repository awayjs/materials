import {Matrix3D} from "@awayjs/core";

import {GL_TextureBase} from "@awayjs/stage";

import {MethodPass} from "../surfaces/passes/MethodPass";
import {ShadingMethodBase} from "../methods/ShadingMethodBase";

/**
 * MethodVO contains data for a given shader object for the use within a single material.
 * This allows shader methods to be shared across materials while their non-public state differs.
 */
export class ChunkVO
{
	public useChunk:boolean;
	
	// internal stuff for the material to know before assembling code
	public needsProjection:boolean;
	public needsView:boolean;
	public needsNormals:boolean;
	public needsTangents:boolean;
	public needsGlobalVertexPos:boolean;
	public needsGlobalFragmentPos:boolean;
}
