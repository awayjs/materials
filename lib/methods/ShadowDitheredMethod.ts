import {BitmapImage2D, Single2DTexture, DirectionalLight} from "@awayjs/graphics";

import {ShadowMethodBase} from "./ShadowMethodBase";

/**
 * ShadowDitheredMethod provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
 */
export class ShadowDitheredMethod extends ShadowMethodBase
{
	public static _grainTexture:Single2DTexture;
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
		ShadowDitheredMethod._grainTexture = new Single2DTexture(ShadowDitheredMethod._grainBitmapImage2D);
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