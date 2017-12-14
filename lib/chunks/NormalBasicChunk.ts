import {ProjectionBase} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {_Render_RenderableBase, ShaderBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

import {NormalBasicMethod} from "../methods/NormalBasicMethod";

import {ShaderChunkBase} from "./ShaderChunkBase";

/**
 * NormalBasicChunk is the default method for standard tangent-space normal mapping.
 */
export class NormalBasicChunk extends ShaderChunkBase
{
	protected _method:NormalBasicMethod;
	protected _shader:ShaderBase;

	protected _texture:_Shader_TextureBase;

	/**
	 * Creates a new EffectEnvMapChunk.
	 */
	constructor(method:NormalBasicMethod, shader:ShaderBase)
	{
		super(method, shader);

		this._method = method;
		this._shader = shader;
	}

	public _isUsed():boolean
	{
		if (this._texture && this._shader.normalDependencies)
			return true;

		return false;
	}

	/**
	 * @inheritDoc
	 */
	public _initVO(chunkVO:ChunkVO):void
	{
		if (this._method.texture) {
			this._texture = <_Shader_TextureBase> this._shader.getAbstraction(this._method.texture);

            this._texture._initVO(chunkVO);

			this._shader.uvDependencies++;
		}
	}

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        if (this._method.texture)
        	this._texture._initConstants();
    }

	/**
	 * Indicates whether or not this method outputs normals in tangent space. Override for object-space normals.
	 */
	public _outputsTangentNormals():boolean
	{
		return true;
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		if (this._texture)
			this._texture.activate();
	}

	public _setRenderState(renderState:_Render_RenderableBase, projection:ProjectionBase):void
	{
		if (this._texture)
			this._texture._setRenderState(renderState);
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._texture)
			code += this._texture._getFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying);


		code += "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx\n" +
			"nrm " + targetReg + ".xyz, " + targetReg + "\n";

		return code;
	}
}