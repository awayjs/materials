import {PoissonLookup} from "@awayjs/core";

import {DirectionalLight} from "@awayjs/graphics";

import {Stage, ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {LightingShader} from "@awayjs/renderer";

import {ShadowSoftMethod} from "../methods/ShadowSoftMethod";

import {ShadowChunkBase} from "./ShadowChunkBase";

/**
 * ShadowSoftChunk provides a soft shadowing technique by randomly distributing sample points.
 */
export class ShadowSoftChunk extends ShadowChunkBase
{
	private _secondaryFragmentConstantsIndex:number;

	/**
	 * Creates a new ShadowHardChunk.
	 */
	constructor(method:ShadowSoftMethod, shader:LightingShader)
	{
		super(method, shader);
	}

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
		super._initConstants();

		this._shader.fragmentConstantData[this._fragmentConstantsIndex + 8] = 1/(<ShadowSoftMethod> this._method).numSamples;
		this._shader.fragmentConstantData[this._fragmentConstantsIndex + 9] = 0;
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		super._activate();

		var texRange:number = .5*(<ShadowSoftMethod> this._method).range/this._method.castingLight.shadowMapper.size;
		var data:Float32Array = this._shader.fragmentConstantData;
		var index:number = this._fragmentConstantsIndex + 10;
		var len:number = (<ShadowSoftMethod> this._method).numSamples << 1;

		for (var i:number = 0; i < len; ++i)
			data[index + i] = (<ShadowSoftMethod> this._method).offsets[i]*texRange;
	}

	/**
	 * @inheritDoc
	 */
	protected _getPlanarFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		// todo: move some things to super
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		regCache.getFreeFragmentConstant();
		var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

		this._fragmentConstantsIndex = decReg.index*4;

		return this.getSampleCode(decReg, targetReg, regCache, sharedRegisters, dataReg);
	}

	/**
	 * Adds the code for another tap to the shader code.
	 * @param uv The uv register for the tap.
	 * @param texture The texture register containing the depth map.
	 * @param decode The register containing the depth map decoding data.
	 * @param target The target register to add the tap comparison result.
	 * @param regCache The register cache managing the registers.
	 * @return
	 */
	private addSample(decodeRegister:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData, uvReg:ShaderRegisterElement):string
	{
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		return this._depthMap._getFragmentCode(temp, registerCache, sharedRegisters, uvReg) +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + uvReg + ".w, " + this._depthMapCoordReg + ".z, " + temp + ".z\n" + // 0 if in shadow
			"add " + targetRegister + ".w, " + targetRegister + ".w, " + uvReg + ".w\n";
	}

	/**
	 * @inheritDoc
	 */
	public _activateForCascade():void
	{
		super._activate();

		var texRange:number = (<ShadowSoftMethod> this._method).range/this._method.castingLight.shadowMapper.size;
		var data:Float32Array = this._shader.fragmentConstantData;
		var index:number /*uint*/ = this._secondaryFragmentConstantsIndex;
		var len:number /*uint*/ = (<ShadowSoftMethod> this._method).numSamples << 1;
		data[index] = 1/(<ShadowSoftMethod> this._method).numSamples;
		data[index + 1] = 0;
		index += 2;

		for (var i:number = 0; i < len; ++i)
			data[index + i] = (<ShadowSoftMethod> this._method).offsets[i]*texRange;

		if (len%4 == 0) {
			data[index + len] = 0;
			data[index + len + 1] = 0;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _getCascadeFragmentCode(decodeRegister:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._depthMapCoordReg = depthProjection;

		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		this._secondaryFragmentConstantsIndex = dataReg.index*4;

		return this.getSampleCode(decodeRegister, targetRegister, registerCache, sharedRegisters, dataReg);
	}

	/**
	 * Get the actual shader code for shadow mapping
	 * @param regCache The register cache managing the registers.
	 * @param depthTexture The texture register containing the depth map.
	 * @param decodeRegister The register containing the depth map decoding data.
	 * @param targetReg The target register to add the shadow coverage.
	 * @param dataReg The register containing additional data.
	 */
	private getSampleCode(decodeRegister:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData, dataReg:ShaderRegisterElement):string
	{
		var code:string;
		var uvReg:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(uvReg, 1);

		var offsets:Array<string> = new Array<string>(dataReg + ".zw");
		var numRegs:number = (<ShadowSoftMethod> this._method).numSamples >> 1;

		for (var i:number = 0; i < numRegs; ++i) {
			var reg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
			offsets.push(reg + ".xy");
			offsets.push(reg + ".zw");
		}

		for (i = 0; i < (<ShadowSoftMethod> this._method).numSamples; ++i) {
			if (i == 0) {
				var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

				code = "add " + uvReg + ", " + this._depthMapCoordReg + ", " + dataReg + ".zwyy\n" +
					this._depthMap._getFragmentCode(temp, registerCache, sharedRegisters, uvReg) +
					"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
					"slt " + targetRegister + ".w, " + this._depthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow;
			} else {
				code += "add " + uvReg + ".xy, " + this._depthMapCoordReg + ".xy, " + offsets[i] + "\n" +
					this.addSample(decodeRegister, targetRegister, registerCache, sharedRegisters, uvReg);
			}
		}

		registerCache.removeFragmentTempUsage(uvReg);

		code += "mul " + targetRegister + ".w, " + targetRegister + ".w, " + dataReg + ".x\n"; // average

		return code;
	}
}