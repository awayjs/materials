import {ProjectionBase} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {_Render_RenderableBase, ShaderBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";
import {ImageTexture2D} from "../textures/ImageTexture2D";

import {EffectAlphaMaskMethod} from "../methods/EffectAlphaMaskMethod";

import {ShaderChunkBase} from "./ShaderChunkBase";

/**
 * EffectAlphaMaskChunk allows the use of an additional texture to specify the alpha value of the material. When used
 * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
 * etc).
 */
export class EffectAlphaMaskChunk extends ShaderChunkBase
{
	private _method:EffectAlphaMaskMethod;
	private _shader:ShaderBase;

	private _alphaMask:_Shader_TextureBase;

	/**
	 * Creates a new EffectAlphaMaskChunk object.
	 */
	constructor(method:EffectAlphaMaskMethod, shader:ShaderBase)
	{
		super(method, shader);

		this._method = method;
		this._shader = shader;
	}

	/**
	 * @inheritDoc
	 */
	public _initVO(chunkVO:ChunkVO):void
	{
		this._alphaMask = <_Shader_TextureBase> this._shader.getAbstraction(this._method.texture || new ImageTexture2D());

        this._alphaMask._initVO(chunkVO);

		if (this._method.useSecondaryUV)
			this._shader.secondaryUVDependencies++;
		else
			this._shader.uvDependencies++;
	}

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        this._alphaMask._initConstants();
    }

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		return this._alphaMask._getFragmentCode(temp, registerCache, sharedRegisters, this._method.useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying) +
			"mul " + targetReg + ", " + targetReg + ", " + temp + ".x\n";
	}


	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		super._activate();

		this._alphaMask.activate();
	}

	public _setRenderState(renderState:_Render_RenderableBase, projection:ProjectionBase):void
	{
		this._alphaMask._setRenderState(renderState);
	}
}