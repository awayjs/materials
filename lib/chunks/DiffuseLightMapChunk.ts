import {ProjectionBase} from "@awayjs/core";

import {DefaultMaterialManager} from "@awayjs/graphics";

import {GL_RenderableBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, GL_TextureBase} from "@awayjs/stage";

import {LightingShader} from "@awayjs/renderer";

import {ChunkVO} from "../data/ChunkVO";
import {DiffuseLightMapMethod} from "../methods/DiffuseLightMapMethod";

import {LightingCompositeChunk} from "./LightingCompositeChunk";

/**
 * DiffuseLightMapChunk provides a diffuse shading method that uses a light map to modulate the calculated diffuse
 * lighting. It is different from EffectLightMapMethod in that the latter modulates the entire calculated pixel color, rather
 * than only the diffuse lighting value.
 */
export class DiffuseLightMapChunk extends LightingCompositeChunk
{
	private _lightMap:GL_TextureBase;

	private _method:DiffuseLightMapMethod;
	private _shader:LightingShader;

	/**
	 * Creates a new DiffuseLightMapChunk method.
	 */
	constructor(method:DiffuseLightMapMethod, shader:LightingShader)
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
		this._lightMap = <GL_TextureBase> this._shader.getAbstraction(this._method.lightMap || DefaultMaterialManager.getDefaultTexture());

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
			case DiffuseLightMapMethod.MULTIPLY:
				code += "mul " + this._totalLightColorReg + ", " + this._totalLightColorReg + ", " + temp + "\n";
				break;
			case DiffuseLightMapMethod.ADD:
				code += "add " + this._totalLightColorReg + ", " + this._totalLightColorReg + ", " + temp + "\n";
				break;
		}

		code += super._getFragmentCode(targetReg, registerCache, sharedRegisters);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		super._activate();

		this._lightMap.activate();
	}

	/**
	 * @inheritDoc
	 */
	public _setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase):void
	{
		super._setRenderState(renderable, projection);

		this._lightMap._setRenderState(renderable);
	}
}