import {LightBase} from "../lights/LightBase";
import {ShadowMapperBase} from "../mappers/ShadowMapperBase";

import {CompositeMethodBase, _Shader_CompositeMethodBase} from "./CompositeMethodBase";

/**
 * ShadowMethodBase provides an abstract base method for shadow map methods.
 */
export class ShadowMethodBase extends CompositeMethodBase
{
	protected _castingLight:LightBase;

	/**
	 * The light casting the shadows.
	 */
	public get castingLight():LightBase
	{
		return this._castingLight;
	}

	/**
	 * Creates a new ShadowMethodBase object.
	 * @param castingLight The light used to cast shadows.
	 */
	constructor(castingLight:LightBase)
	{
		super(castingLight.shadowMapper);

		this._castingLight = castingLight;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {_Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";
import {_Shader_ShadowMapperBase} from "../mappers/ShadowMapperBase";

/**
 * ShadowHardChunk provides the cheapest shadow map method by using a single tap without any filtering.
 */
export class _Shader_ShadowMethodBase extends _Shader_CompositeMethodBase
{
    protected _method:ShadowMethodBase;
    protected _shader:LightingShader;
    protected _baseTexture:_Shader_TextureBase

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

        this._baseTexture = (<_Shader_ShadowMapperBase> this._baseChunk).texture;
    }
}