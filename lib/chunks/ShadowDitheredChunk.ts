import {ProjectionBase} from "@awayjs/core";

import {BitmapImage2D, Single2DTexture, DirectionalLight} from "@awayjs/graphics";

import {GL_TextureBase, GL_RenderableBase, ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {LightingShader} from "@awayjs/renderer";

import {ChunkVO} from "../data/ChunkVO";
import {ShadowDitheredMethod} from "../methods/ShadowDitheredMethod";

import {ShadowChunkBase} from "./ShadowChunkBase";

/**
 * ShadowDitheredChunk provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
 */
export class ShadowDitheredChunk extends ShadowChunkBase
{
	private _grainMap:GL_TextureBase;
	private _cascadeFragmentConstantsIndex:number;

	/**
	 * Creates a new ShadowDitheredChunk.
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

		this._grainMap = <GL_TextureBase> this._shader.getAbstraction(ShadowDitheredMethod._grainTexture);
	}

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
		super._initConstants();

		var data:Float32Array = this._shader.fragmentConstantData;
		var index:number = this._fragmentConstantsIndex;
		data[index + 8] = 1/(<ShadowDitheredMethod> this._method).numSamples;
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		super._activate();

		var data:Float32Array = this._shader.fragmentConstantData;
		var index:number = this._fragmentConstantsIndex;
		data[index + 9] = (this._stage.width - 1)/63;
		data[index + 10] = (this._stage.height - 1)/63;
		data[index + 11] = 2*(<ShadowDitheredMethod> this._method).range/this._method.castingLight.shadowMapper.size;

		this._grainMap.activate();
	}


	/**
	 * @inheritDoc
	 */
	public _setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase):void
	{
		super._setRenderState(renderable, projection);

		this._grainMap._setRenderState(renderable);
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
	private _addSample(uvReg:ShaderRegisterElement, decReg:ShaderRegisterElement, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

		return this._depthMap._getFragmentCode(temp, regCache, sharedRegisters, uvReg) +
			"dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" +
			"slt " + temp + ".z, " + this._depthMapCoordReg + ".z, " + temp + ".z\n" + // 0 if in shadow
			"add " + targetReg + ".w, " + targetReg + ".w, " + temp + ".z\n";
	}

	/**
	 * @inheritDoc
	 */
	public _activateForCascade():void
	{
		var data:Float32Array = this._shader.fragmentConstantData;
		var index:number /*uint*/ = this._cascadeFragmentConstantsIndex;
		data[index] = 1/(<ShadowDitheredMethod> this._method).numSamples;
		data[index + 1] = (this._stage.width - 1)/63;
		data[index + 2] = (this._stage.height - 1)/63;
		data[index + 3] = 2*(<ShadowDitheredMethod> this._method).range/this._method.castingLight.shadowMapper.size;

		this._grainMap.activate();
	}

	/**
	 * @inheritDoc
	 */
	public _getCascadeFragmentCode(decodeRegister:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._depthMapCoordReg = depthProjection;

		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		this._cascadeFragmentConstantsIndex = dataReg.index*4;

		return this.getSampleCode(dataReg, decodeRegister, targetRegister, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	protected _getPlanarFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var customDataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

		this._fragmentConstantsIndex = decReg.index*4;

		return this.getSampleCode(customDataReg, decReg, targetReg, regCache, sharedRegisters);
	}

	/**
	 * Get the actual shader code for shadow mapping
	 * @param regCache The register cache managing the registers.
	 * @param depthMapRegister The texture register containing the depth map.
	 * @param decReg The register containing the depth map decoding data.
	 * @param targetReg The target register to add the shadow coverage.
	 */
	private getSampleCode(customDataReg:ShaderRegisterElement, decReg:ShaderRegisterElement, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var numSamples:number = (<ShadowDitheredMethod> this._method).numSamples;
		var uvReg:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(uvReg, 1);
		var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(temp, 1);

		var projectionReg:ShaderRegisterElement = sharedRegisters.projectionFragment;

		code += "div " + uvReg + ", " + projectionReg + ", " + projectionReg + ".w\n" +
			"mul " + uvReg + ".xy, " + uvReg + ".xy, " + customDataReg + ".yz\n";

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
				"mul " + uvReg + ".zw, " + uvReg + ".zw, " + customDataReg + ".w\n"; // (tex unpack scale and tex scale in one)

			if (index == numSamples) {
				// first sample
				code += "add " + uvReg + ".xy, " + uvReg + ".zw, " + this._depthMapCoordReg + ".xy\n" +
					this._depthMap._getFragmentCode(temp, regCache, sharedRegisters, uvReg) +
					"dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" +
					"slt " + targetReg + ".w, " + this._depthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow
			} else {
				code += this._addSample(uvReg, decReg, targetReg, regCache, sharedRegisters);
			}

			if (index > 4)
				code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this._addSample(uvReg, decReg, targetReg, regCache, sharedRegisters);

			if (index > 1)
				code += "sub " + uvReg + ".xy, " + this._depthMapCoordReg + ".xy, " + uvReg + ".zw\n" + this._addSample(uvReg, decReg, targetReg, regCache, sharedRegisters);

			if (index > 5)
				code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this._addSample(uvReg, decReg, targetReg, regCache, sharedRegisters);

			if (index > 2) {
				code += "neg " + uvReg + ".w, " + uvReg + ".w\n"; // will be rotated 90 degrees when being accessed as wz
				code += "add " + uvReg + ".xy, " + uvReg + ".wz, " + this._depthMapCoordReg + ".xy\n" + this._addSample(uvReg, decReg, targetReg, regCache, sharedRegisters);
			}

			if (index > 6)
				code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this._addSample(uvReg, decReg, targetReg, regCache, sharedRegisters);

			if (index > 3)
				code += "sub " + uvReg + ".xy, " + this._depthMapCoordReg + ".xy, " + uvReg + ".wz\n" + this._addSample(uvReg, decReg, targetReg, regCache, sharedRegisters);

			if (index > 7)
				code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this._addSample(uvReg, decReg, targetReg, regCache, sharedRegisters);

			index -= 8;
		}

		regCache.removeFragmentTempUsage(temp);
		regCache.removeFragmentTempUsage(uvReg);
		code += "mul " + targetReg + ".w, " + targetReg + ".w, " + customDataReg + ".x\n"; // average
		return code;
	}
}