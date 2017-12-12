import {AssetEvent} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, GL_ImageBase, ImageSampler} from "@awayjs/stage";

import {TextureStateBase, ShaderBase, RenderStateBase} from "@awayjs/renderer";

/**
 *
 * @class away.pool.GL_SingleImageTexture
 */
export class GL_ImageTexture extends TextureStateBase
{
	protected _textureIndex:number;
    protected _imageIndex:number;
    protected _samplerIndex:number;

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
        var wrap:string = "wrap";
        var format:string = "";
        var filter:string = "linear,miplinear";

		this._imageIndex = this._shader.materialState.getImageIndex(this._texture, 0);

		var textureReg:ShaderRegisterElement = this.getTextureReg(this._imageIndex, regCache, sharedReg);
		this._textureIndex = textureReg.index;

		return "tex " + targetReg + ", " + inputReg + ", " + textureReg + " <" + this._shader.materialState.images[this._imageIndex].getType() + "," + filter + "," + format + wrap + ">\n";
	}

	public activate():void
	{
		var sampler:ImageSampler = <ImageSampler> this._shader.materialState.samplers[this._imageIndex];
        var image:GL_ImageBase = <GL_ImageBase> this._shader.materialState.images[this._imageIndex];

		image.activate(this._textureIndex, sampler);
	}


	public _setRenderState(renderState:RenderStateBase):void
	{
		var sampler:ImageSampler = renderState.samplers[this._imageIndex];
        var image:GL_ImageBase = <GL_ImageBase> renderState.images[this._imageIndex];

		if (image && sampler)
			image.activate(this._textureIndex, sampler);
	}
}