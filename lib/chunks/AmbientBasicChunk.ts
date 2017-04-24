import {AssetEvent} from "@awayjs/core";

import {MappingMode} from "@awayjs/graphics";

import {ProjectionBase} from "@awayjs/core";

import {GL_RenderableBase, ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, GL_TextureBase} from "@awayjs/stage";

import {ChunkVO} from "../data/ChunkVO";
import {AmbientBasicMethod} from "../methods/AmbientBasicMethod";

import {ShaderChunkBase} from "./ShaderChunkBase";

/**
 * AmbientBasicChunk provides the default shading method for uniform ambient lighting.
 */
export class AmbientBasicChunk extends ShaderChunkBase
{
	protected _method:AmbientBasicMethod;
	protected _shader:ShaderBase;

	protected _texture:GL_TextureBase;

	private _colorIndex:number;

	/**
	 * Creates a new AmbientBasicChunk object.
	 */
	constructor(method:AmbientBasicMethod, shader:ShaderBase)
	{
		super(method, shader);

		this._method = method;
		this._shader = shader;
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._method = null;
		this._shader = null;

		if (this._texture) {
			this._texture.onClear(new AssetEvent(AssetEvent.CLEAR, this._method.texture));
			this._texture = null;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _initVO(chunkVO:ChunkVO):void
	{
		if (this._method.texture) {
			this._texture = <GL_TextureBase> this._shader.getAbstraction(this._method.texture);

			if (this._method.texture.mappingMode == MappingMode.CUBE)
				chunkVO.needsNormals = true;
			else
				this._shader.uvDependencies++;
			
		} else if (this._texture) {
			this._texture = null;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._texture) {
			code += this._texture._iGetFragmentCode(targetReg, registerCache, sharedRegisters, (this._method.texture.mappingMode == MappingMode.CUBE)? sharedRegisters.normalFragment : sharedRegisters.uvVarying);

			if (this._shader.alphaThreshold > 0) {
				var cutOffReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
				this._colorIndex = cutOffReg.index*4;

				code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" +
					"kil " + targetReg + ".w\n" +
					"add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
			}

		} else {
			var ambientInputRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
			this._colorIndex = ambientInputRegister.index*4;

			code += "mov " + targetReg + ", " + ambientInputRegister + "\n";
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		if (this._texture) {
			this._texture.activate();

			if (this._invalid && this._shader.alphaThreshold > 0)
				this._shader.fragmentConstantData[this._colorIndex] = this._shader.alphaThreshold;

		} else if (this._invalid) {
			var index:number = this._colorIndex;
			var data:Float32Array = this._shader.fragmentConstantData;
			var color:number = this._shader.numLights? 0xFFFFFF : this._shader.pass.style.color;

			data[index] = ((color >> 16) & 0xff)/0xff*this._method.strength;
			data[index + 1] = ((color >> 8) & 0xff)/0xff*this._method.strength;
			data[index + 2] = (color & 0xff)/0xff*this._method.strength;
			data[index + 3] = this._method.alpha;
		}
	}

	public _setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase):void
	{
		if (this._texture)
			this._texture._setRenderState(renderable);
	}
}