import {BitmapImage2D} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {ImageTexture2D} from "../textures/ImageTexture2D";
import {DirectionalLight} from "../lights/DirectionalLight";

import {ShadowMethodBase, _Shader_ShadowMethodBase} from "./ShadowMethodBase";

/**
 * ShadowDitheredMethod provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
 */
export class ShadowDitheredMethod extends ShadowMethodBase
{
	public static _grainTexture:ImageTexture2D;
	private static _grainUsages:number;
	private static _grainBitmapImage2D:BitmapImage2D;
	private _depthMapSize:number;
	private _range:number;
	private _numSamples:number;

	public static assetType:string = "[asset ShadowDitheredMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return ShadowDitheredMethod.assetType;
	}

	/**
	 * The amount of samples to take for dithering. Minimum 1, maximum 24. The actual maximum may depend on the
	 * complexity of the shader.
	 */
	public get numSamples():number
	{
		return this._numSamples;
	}

	public set numSamples(value:number)
	{
		if (value < 1)
			value = 1;
		else if (value > 24)
			value = 24;

		if (this._numSamples == value)
			return;

		this._numSamples = value;

		this.invalidateShaderProgram();
	}

	/**
	 * The range in the shadow map in which to distribute the samples.
	 */
	public get range():number
	{
		return this._range*2;
	}

	public set range(value:number)
	{
		this._range = value/2;
	}

	/**
	 * Creates a new ShadowDitheredMethod object.
	 * @param castingLight The light casting the shadows
	 * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 24.
	 */
	constructor(castingLight:DirectionalLight, numSamples:number = 4, range:number = 1)
	{
		super(castingLight);

		this._depthMapSize = this._castingLight.shadowMapper.size;

		this.numSamples = numSamples;
		this.range = range;

		++ShadowDitheredMethod._grainUsages;

		if (!ShadowDitheredMethod._grainTexture)
			this.initGrainTexture();
	}
	
	/**
	 * Creates a texture containing the dithering noise texture.
	 */
	private initGrainTexture():void
	{
		ShadowDitheredMethod._grainBitmapImage2D = new BitmapImage2D(64, 64, false);
		var vec:Array<number> /*uint*/ = new Array<number>();
		var len:number /*uint*/ = 4096;
		var step:number = 1/(this._depthMapSize*this._range);
		var r:number, g:number;

		for (var i:number /*uint*/ = 0; i < len; ++i) {
			r = 2*(Math.random() - .5);
			g = 2*(Math.random() - .5);
			if (r < 0)
				r -= step; else
				r += step;
			if (g < 0)
				g -= step; else
				g += step;
			if (r > 1)
				r = 1; else if (r < -1)
				r = -1;
			if (g > 1)
				g = 1; else if (g < -1)
				g = -1;
			vec[i] = (Math.floor((r*.5 + .5)*0xff) << 16) | (Math.floor((g*.5 + .5)*0xff) << 8);
		}

		ShadowDitheredMethod._grainBitmapImage2D.setArray(ShadowDitheredMethod._grainBitmapImage2D.rect, vec);
		ShadowDitheredMethod._grainTexture = new ImageTexture2D(ShadowDitheredMethod._grainBitmapImage2D);
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		if (--ShadowDitheredMethod._grainUsages == 0) {
			ShadowDitheredMethod._grainTexture.dispose();
			ShadowDitheredMethod._grainBitmapImage2D.dispose();
			ShadowDitheredMethod._grainTexture = null;
		}
	}
}

import {ProjectionBase} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase, _Render_RenderableBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";
import {_Shader_ShadowMapperBase} from "../mappers/ShadowMapperBase";


/**
 * _Shader_ShadowDitheredMethod provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
 */
export class _Shader_ShadowDitheredMethod extends _Shader_ShadowMethodBase
{
    private _grainMap:_Shader_TextureBase;
    private _fragmentConstantsIndex:number;

    /**
     * Creates a new _Shader_ShadowDitheredMethod.
     */
    constructor(method:ShadowDitheredMethod, shader:LightingShader)
    {
        super(method, shader);
    }

    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        super._initVO(chunkVO);

        chunkVO.needsProjection = true;

        this._grainMap = <_Shader_TextureBase> this._shader.getAbstraction(ShadowDitheredMethod._grainTexture);
    }

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        super._initConstants();

        var data:Float32Array = this._shader.fragmentConstantData;
        var index:number = this._fragmentConstantsIndex;
        data[index] = 1/(<ShadowDitheredMethod> this._method).numSamples;
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        super._activate();

        var data:Float32Array = this._shader.fragmentConstantData;
        var index:number = this._fragmentConstantsIndex;
        data[index + 1] = (this._shader.renderMaterial.renderGroup.renderer.view.width - 1)/63;
        data[index + 2] = (this._shader.renderMaterial.renderGroup.renderer.view.height - 1)/63;
        data[index + 3] = 2*(<ShadowDitheredMethod> this._method).range/this._method.castingLight.shadowMapper.size;

        this._grainMap.activate();
    }


    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

        this._fragmentConstantsIndex = dataReg.index*4;

        var code:string = "";
        var numSamples:number = (<ShadowDitheredMethod> this._method).numSamples;
        var uvReg:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(uvReg, 1);
        var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(temp, 1);

        var projectionReg:ShaderRegisterElement = sharedRegisters.projectionFragment;

        code += "div " + uvReg + ", " + projectionReg + ", " + projectionReg + ".w\n" +
            "mul " + uvReg + ".xy, " + uvReg + ".xy, " + dataReg + ".yz\n";

        var index:number = numSamples;
        while (index > 0) {
            if (index == numSamples) {
                code += this._grainMap._getFragmentCode(uvReg, regCache, sharedRegisters, uvReg);
            } else {
                code += "mov " + temp + ", " + uvReg + ".zwxy \n" +
                    this._grainMap._getFragmentCode(uvReg, regCache, sharedRegisters, temp);
            }

            // keep grain in uvReg.zw
            code += "sub " + uvReg + ".zw, " + uvReg + ".xy, fc0.xx\n" + // uv-.5
                "mul " + uvReg + ".zw, " + uvReg + ".zw, " + dataReg + ".w\n"; // (tex unpack scale and tex scale in one)

            if (index == numSamples) {
                // first sample
                code += "add " + uvReg + ".xy, " + uvReg + ".zw, " + (<_Shader_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".xy\n" +
                    this._baseTexture._getFragmentCode(targetReg, regCache, sharedRegisters, uvReg);
            } else {
                code += this._addSample(uvReg, targetReg, regCache, sharedRegisters);
            }

            if (index > 4)
                code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" +
                    this._addSample(uvReg, targetReg, regCache, sharedRegisters);

            if (index > 1)
                code += "sub " + uvReg + ".xy, " + (<_Shader_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".xy, " + uvReg + ".zw\n" +
                    this._addSample(uvReg, targetReg, regCache, sharedRegisters);

            if (index > 5)
                code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" +
                    this._addSample(uvReg, targetReg, regCache, sharedRegisters);

            if (index > 2) {
                code += "neg " + uvReg + ".w, " + uvReg + ".w\n" + // will be rotated 90 degrees when being accessed as wz
                    "add " + uvReg + ".xy, " + uvReg + ".wz, " + (<_Shader_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".xy\n" +
                    this._addSample(uvReg, targetReg, regCache, sharedRegisters);
            }

            if (index > 6)
                code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" +
                    this._addSample(uvReg, targetReg, regCache, sharedRegisters);

            if (index > 3)
                code += "sub " + uvReg + ".xy, " + (<_Shader_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".xy, " + uvReg + ".wz\n" +
                    this._addSample(uvReg, targetReg, regCache, sharedRegisters);

            if (index > 7)
                code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" +
                    this._addSample(uvReg, targetReg, regCache, sharedRegisters);

            index -= 8;
        }

        regCache.removeFragmentTempUsage(temp);
        regCache.removeFragmentTempUsage(uvReg);

        code += "mul " + targetReg + ".w, " + targetReg + ".w, " + dataReg + ".x\n" + // average
            super._getFragmentCode(targetReg, regCache, sharedRegisters);
        return code;
    }

    /**
     * @inheritDoc
     */
    public _setRenderState(renderState:_Render_RenderableBase, view:View):void
    {
        super._setRenderState(renderState, view);

        this._grainMap._setRenderState(renderState);
    }

    /**
     * Adds the code for another tap to the shader code.
     * @param uvReg The uv register for the tap.
     * @param depthMapRegister The texture register containing the depth map.
     * @param decReg The register containing the depth map decoding data.
     * @param targetReg The target register to add the tap comparison result.
     * @param regCache The register cache managing the registers.
     * @return
     */
    private _addSample(uvReg:ShaderRegisterElement, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(temp, 1);

        var code:string = this._baseTexture._getFragmentCode(temp, regCache, sharedRegisters, uvReg) +
            "add " + targetReg + ".w, " + targetReg + ".w, " + temp + ".w\n";

        regCache.removeFragmentTempUsage(temp);

        return code;
    }
}

ShaderBase.registerAbstraction(_Shader_ShadowDitheredMethod, ShadowDitheredMethod);