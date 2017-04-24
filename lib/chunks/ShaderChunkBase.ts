import {Matrix3D, AssetEvent, AssetBase, AbstractionBase, ProjectionBase} from "@awayjs/core";

import {IMaterial, TextureBase} from "@awayjs/graphics";

import {Stage, GL_RenderableBase, ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShadingMethodEvent} from "@awayjs/renderer";

import {ChunkVO} from "../data/ChunkVO";
import {ShadingMethodBase} from "../methods/ShadingMethodBase";

import {IShaderChunk} from "./IShaderChunk";

/**
 * ShaderChunkBase provides an abstract base method for shading methods, used by compiled passes to compile
 * the final shading program.
 */
export class ShaderChunkBase extends AbstractionBase implements IShaderChunk
{
	public chunkVO:ChunkVO = new ChunkVO();

	protected _stage:Stage;

	/**
	 * Create a new ShaderChunkBase object.
	 */
	constructor(method:ShadingMethodBase, shader:ShaderBase)
	{
		super(method, shader);

		this._stage = shader._stage;
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._stage = null;
	}

	public _isUsed():boolean
	{
		return true;
	}

	public _usesTangentSpace():boolean
	{
		return true;
	}
	
	/**
	 * Initializes the properties for a MethodVO, including register and texture indices.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 *
	 * @internal
	 */
	public _initVO(chunkVO:ChunkVO):void
	{

	}

	/**
	 * Initializes unchanging shader constants using the data from a MethodVO.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 *
	 * @internal
	 */
	public _initConstants():void
	{

	}

	/**
	 * Resets the compilation state of the method.
	 *
	 * @internal
	 */
	public _reset(chunkVO:ChunkVO):void
	{
		this._invalid = true;

		chunkVO.useChunk = false;

		chunkVO.needsProjection = false;
		chunkVO.needsView = false;
		chunkVO.needsNormals = false;
		chunkVO.needsTangents = false;
		chunkVO.needsGlobalVertexPos = false;
		chunkVO.needsGlobalFragmentPos = false;

		this._cleanCompilationData();
	}

	/**
	 * Resets the method's state for compilation.
	 *
	 * @internal
	 */
	public _cleanCompilationData():void
	{
		
	}

	/**
	 * Get the vertex shader code for this method.
	 * @param vo The MethodVO object linking this method with the pass currently being compiled.
	 * @param regCache The register cache used during the compilation.
	 *
	 * @internal
	 */
	public _getVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	/**
	 * Sets the render state for this method.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param stage The Stage object currently used for rendering.
	 *
	 * @internal
	 */
	public _activate():void
	{

	}

	/**
	 * Sets the render state for a single renderable.
	 *
	 * @param vo The MethodVO object linking this method with the pass currently being compiled.
	 * @param renderable The renderable currently being rendered.
	 * @param stage The Stage object currently used for rendering.
	 * @param camera The camera from which the scene is currently rendered.
	 *
	 * @internal
	 */
	public _setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase):void
	{

	}

	/**
	 * Clears the render state for this method.
	 * @param vo The MethodVO object linking this method with the pass currently being compiled.
	 * @param stage The Stage object currently used for rendering.
	 *
	 * @internal
	 */
	public _deactivate():void
	{
		this._invalid = false;
	}
}