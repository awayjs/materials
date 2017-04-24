import {ProjectionBase} from "@awayjs/core";

import {GL_TextureBase, GL_RenderableBase, ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ChunkVO} from "../data/ChunkVO";
import {EffectLightMapMethod} from "../methods/EffectLightMapMethod";

import {ShaderChunkBase} from "./ShaderChunkBase";

/**
 * EffectLightMapChunk provides a method that allows applying a light map texture to the calculated pixel colour.
 * It is different from DiffuseLightMapMethod in that the latter only modulates the diffuse shading value rather
 * than the whole pixel colour.
 */
export class EffectLightMapChunk extends ShaderChunkBase
{
	private _method:EffectLightMapMethod;
	private _shader:ShaderBase;

	private _lightMap:GL_TextureBase;

	/**
	 * Creates a new EffectEnvMapChunk.
	 */
	constructor(method:EffectLightMapMethod, shader:ShaderBase)
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
		this._lightMap = <GL_TextureBase> this._shader.getAbstraction(this._method.lightMap);

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
		var code:string;
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		code = this._lightMap._getFragmentCode(temp, registerCache, sharedRegisters, this._method.useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);

		switch (this._method.blendMode) {
			case EffectLightMapMethod.MULTIPLY:
				code += "mul " + targetReg + ", " + targetReg + ", " + temp + "\n";
				break;
			case EffectLightMapMethod.ADD:
				code += "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
				break;
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		this._lightMap.activate();
	}


	public _setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase):void
	{
		this._lightMap._setRenderState(renderable);
	}
}