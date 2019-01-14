import {IEventDispatcher} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {_Render_RenderableBase, ChunkVO} from "@awayjs/renderer";

/**
 * 
 */
export interface _IShader_Method extends IEventDispatcher
{
	chunkVO:ChunkVO;

	_isUsed():boolean;

	_usesTangentSpace():boolean;

	/**
	 * Initializes the properties for a MethodVO, including register and texture indices.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 *
	 * @internal
	 */
	_initVO(chunkVO:ChunkVO):void;

	/**
	 * Initializes unchanging shader constants using the data from a MethodVO.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 *
	 * @internal
	 */
	_initConstants():void;

	/**
	 * Resets the compilation state of the method.
	 *
	 * @internal
	 */
	_reset(chunkVO:ChunkVO):void;

	/**
	 * Resets the method's state for compilation.
	 *
	 * @internal
	 */
	_cleanCompilationData():void;

	/**
	 * Get the vertex shader code for this method.
	 * @param vo The MethodVO object linking this method with the pass currently being compiled.
	 * @param regCache The register cache used during the compilation.
	 *
	 * @internal
	 */
	_getVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	/**
	 * @inheritDoc
	 */
	_getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	/**
	 * Sets the render state for this method.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param stage The Stage object currently used for rendering.
	 *
	 * @internal
	 */
	_activate():void;

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
	_setRenderState(renderRenderable:_Render_RenderableBase, view:View):void;

	/**
	 * Clears the render state for this method.
	 * @param vo The MethodVO object linking this method with the pass currently being compiled.
	 * @param stage The Stage object currently used for rendering.
	 *
	 * @internal
	 */
	_deactivate():void;
}