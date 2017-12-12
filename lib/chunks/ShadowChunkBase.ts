import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {TextureStateBase, ChunkVO} from "@awayjs/renderer";

import {LightBase} from "../lights/LightBase";
import {LightingShader} from "../shaders/LightingShader";
import {ShadowMethodBase} from "../methods/ShadowMethodBase";
import {GL_ShadowMapperBase} from "../mappers/GL_ShadowMapperBase";

import {CompositeChunkBase} from "./CompositeChunkBase";

/**
 * ShadowHardChunk provides the cheapest shadow map method by using a single tap without any filtering.
 */
export class ShadowChunkBase extends CompositeChunkBase
{
    protected _method:ShadowMethodBase;
    protected _shader:LightingShader;
	protected _baseTexture:TextureStateBase

	/**
	 * Creates a new ShadowHardChunk.
	 */
	constructor(method:ShadowMethodBase, shader:LightingShader)
	{
		super(method, shader);

		this._method = method;
		this._shader = shader;
	}

	public _initVO(chunkVO:ChunkVO):void
	{
		super._initVO(chunkVO);

        this._baseTexture = (<GL_ShadowMapperBase> this._baseChunk).texture;
	}
}