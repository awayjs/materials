import {ProjectionBase} from "@awayjs/core";

import {DefaultMaterialManager} from "@awayjs/graphics";

import {GL_RenderableBase, ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, GL_TextureBase} from "@awayjs/stage";


import {LightingShader} from "@awayjs/renderer";

import {ChunkVO} from "../data/ChunkVO";
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

	private _alphaMask:GL_TextureBase;

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
		this._alphaMask = <GL_TextureBase> this._shader.getAbstraction(this._method.texture || DefaultMaterialManager.getDefaultTexture());

		if (this._method.useSecondaryUV)
			this._shader.secondaryUVDependencies++;
		else
			this._shader.uvDependencies++;
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

	public _setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase):void
	{
		this._alphaMask._setRenderState(renderable);
	}
}