import {ErrorBase} from "@awayjs/core";

import {ImageSampler, Image2D, ImageUtils, ImageCube} from "@awayjs/stage";

import {MappingMode} from "@awayjs/renderer";

import {Texture2D} from "./Texture2D";

export class ImageTexture2D extends Texture2D
{
	public static assetType:string = "[texture ImageTexture2D]";

	/**
	 *
	 * @returns {string}
	 */
	public get assetType():string
	{
		return ImageTexture2D.assetType;
	}

	/**
	 *
	 * @returns {ImageBase}
	 */
	public get sampler():ImageSampler
	{
		return <ImageSampler> this._samplers[0];
	}

	public set sampler(value:ImageSampler)
	{
		if (this._samplers[0] == value)
			return;

		this.setSamplerAt(value, 0);
	}

	/**
	 *
	 * @returns {ImageBase}
	 */
	public get image():Image2D
	{
		return <Image2D> this._images[0];
	}

	public set image(value:Image2D)
	{
		if (this._images[0] == value)
			return;

		if (!ImageUtils.isImage2DValid(value))
			throw new ErrorBase("Invalid imageData: Width and height must be power of 2 and cannot exceed 2048");

		this.setImageAt(value, 0);
	}

	constructor(image:Image2D = null, mappingMode:MappingMode = null)
	{
		super(mappingMode);

		this.setNumImages(1);

		this.image = image;
	}
}

import {AssetEvent} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase, _Render_RenderableBase} from "@awayjs/renderer";

import {_Shader_ImageTexture} from "./ImageTextureCube";

/**
 *
 * @class away.pool.GL_SingleImageTexture
 */
export class _Shader_ImageTexture2D extends _Shader_ImageTexture
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

        var temp:ShaderRegisterElement;

        //modify depending on mapping mode
        if ((<Texture2D> this._texture).mappingMode == MappingMode.RADIAL) {
            temp = regCache.getFreeFragmentVectorTemp();
            code += "mul " + temp + ".xy, " + inputReg + ", " + inputReg + "\n";
            code += "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n";
            code += "sub " + temp + ".y, " + temp + ".y, " + temp + ".y\n";
            code += "sqt " + temp + ".x, " + temp + ".x, " + temp + ".x\n";
            inputReg = temp;
        }

        //handles texture atlasing
        if (this._shader.useImageRect) {
            var samplerReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
            this._samplerIndex = samplerReg.index*4;
            temp = regCache.getFreeFragmentVectorTemp();

            code += "mul " + temp + ", " + inputReg + ", " + samplerReg + ".xy\n";
            code += "add " + temp + ", " + temp + ", " + samplerReg + ".zw\n";
            inputReg = temp;
        }

        code += super._getFragmentCode(targetReg, regCache, sharedReg, inputReg);

        return code;
    }

    public activate():void
    {
        super.activate();

        var sampler:ImageSampler = <ImageSampler> this._shader.renderMaterial.samplers[this._imageIndex];

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


    public _setRenderState(renderState:_Render_RenderableBase):void
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

ShaderBase.registerAbstraction(_Shader_ImageTexture2D, ImageTexture2D);