import {ProjectionBase, AbstractionBase} from "@awayjs/core";

import {Stage, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {RenderStateBase, ShaderBase, ChunkVO} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";
import {ShadingMethodEvent} from "../events/ShadingMethodEvent";
import {TextureBase} from "../textures/TextureBase";
import {CompositeMethodBase} from "../methods/CompositeMethodBase";

import {ShaderChunkBase} from "./ShaderChunkBase";
import {IShaderChunk} from "./IShaderChunk";

/**
 * CompositeChunkBase provides a base class for diffuse methods that wrap a diffuse method to alter the
 * calculated diffuse reflection strength.
 */
export class CompositeChunkBase extends AbstractionBase implements IShaderChunk
{
	protected _baseChunk:IShaderChunk;

	public chunkVO:ChunkVO = new ChunkVO();

	/**
	 * Creates a new <code>CompositeChunkBase</code> object.
	 *
	 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
	 * @param baseMethod The base diffuse method on which this method's shading is based.
	 */
	constructor(method:CompositeMethodBase, shader:LightingShader)
	{
		super(method, shader);

		this._baseChunk = <ShaderChunkBase> shader.getAbstraction(method.baseMethod);
	}

	public _isUsed():boolean
	{
		return true;
	}

	public _usesTangentSpace():boolean
	{
		return this._baseChunk._usesTangentSpace();
	}

	/**
	 * @inheritDoc
	 */
	public _initVO(chunkVO:ChunkVO):void
	{
		this._baseChunk._initVO(chunkVO);
	}

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
		this._baseChunk._initConstants();
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		this._baseChunk._activate();
	}

	/**
	 * @inheritDoc
	 */
	public _setRenderState(renderState:RenderStateBase, projection:ProjectionBase):void
	{
		this._baseChunk._setRenderState(renderState, projection);
	}

	/**
	 * @inheritDoc
	 */
	public _deactivate():void
	{
		this._baseChunk._deactivate();

		this._invalid = false;
	}

	/**
	 * @inheritDoc
	 */
	public _getVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._baseChunk._getVertexCode(registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._baseChunk._getFragmentCode(targetReg, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public _reset(chunkVO:ChunkVO):void
	{
		this._baseChunk._reset(chunkVO);
		
		this._invalid = true;

		this._cleanCompilationData();
	}

	/**
	 * @inheritDoc
	 */
	public _cleanCompilationData():void
	{
		this._baseChunk._cleanCompilationData();
	}
}