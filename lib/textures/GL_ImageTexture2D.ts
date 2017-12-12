import {AssetEvent} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, ImageSampler} from "@awayjs/stage";

import {ShaderBase, RenderStateBase, MappingMode} from "@awayjs/renderer";

import {GL_ImageTexture} from "./GL_ImageTexture";
import {Texture2D} from "./Texture2D";
/**
 *
 * @class away.pool.GL_SingleImageTexture
 */
export class GL_ImageTexture2D extends GL_ImageTexture
{
	/**
	 *
	 * @param shader
	 * @param regCache
	 * @param targetReg The register in which to store the sampled colour.
	 * @param uvReg The uv coordinate vector with which to sample the texture map.
	 * @returns {string}
	 * @private
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData, inputReg:ShaderRegisterElement):string
	{
		var code:string = "";

		var temp:ShaderRegisterElement = inputReg;

		//modify depending on mapping mode
		if ((<Texture2D> this._texture).mappingMode == MappingMode.RADIAL) {
			temp = regCache.getFreeFragmentVectorTemp();
			code += "mul " + temp + ".xy, " + inputReg + ", " + inputReg + "\n";
			code += "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n";
			code += "sub " + temp + ".y, " + temp + ".y, " + temp + ".y\n";
			code += "sqt " + temp + ".x, " + temp + ".x, " + temp + ".x\n";
		}

		//handles texture atlasing
		if (this._shader.useImageRect) {
			var samplerReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			this._samplerIndex = samplerReg.index*4;
			temp = regCache.getFreeFragmentVectorTemp();

			code += "mul " + temp + ", " + inputReg + ", " + samplerReg + ".xy\n";
			code += "add " + temp + ", " + temp + ", " + samplerReg + ".zw\n";
		}

		this._imageIndex = this._shader.materialState.getImageIndex(this._texture, 0);

		var textureReg:ShaderRegisterElement = this.getTextureReg(this._imageIndex, regCache, sharedReg);
		this._textureIndex = textureReg.index;

		code += super._getFragmentCode(targetReg, regCache, sharedReg, temp);

		return code;
	}

	public activate():void
	{
		super.activate();
		
		var sampler:ImageSampler = <ImageSampler> this._shader.materialState.samplers[this._imageIndex];

		if (this._shader.useImageRect) {
			var index:number = this._samplerIndex;
			var data:Float32Array = this._shader.fragmentConstantData;
			if (!sampler.imageRect) {
				data[index] = 1;
				data[index + 1] = 1;
				data[index + 2] = 0;
				data[index + 3] = 0;
			} else {
				data[index] = sampler.imageRect.width;
				data[index + 1] = sampler.imageRect.height;
				data[index + 2] = sampler.imageRect.x;
				data[index + 3] = sampler.imageRect.y;

			}
		}
	}


	public _setRenderState(renderState:RenderStateBase):void
	{
		super._setRenderState(renderState);
		
		var sampler:ImageSampler = renderState.samplers[this._imageIndex];

		if (this._shader.useImageRect && sampler) {
			var index:number = this._samplerIndex;
			var data:Float32Array = this._shader.fragmentConstantData;
			if (!sampler.imageRect) {
				data[index] = 1;
				data[index + 1] = 1;
				data[index + 2] = 0;
				data[index + 3] = 0;
			} else {
				data[index] = sampler.imageRect.width;
				data[index + 1] = sampler.imageRect.height;
				data[index + 2] = sampler.imageRect.x;
				data[index + 3] = sampler.imageRect.y;

			}
		}
	}
}