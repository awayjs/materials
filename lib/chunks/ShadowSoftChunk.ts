import {PoissonLookup} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {DirectionalLight} from "../lights/DirectionalLight";
import {LightingShader} from "../shaders/LightingShader";
import {ShadowSoftMethod} from "../methods/ShadowSoftMethod";
import {GL_ShadowMapperBase} from "../mappers/GL_ShadowMapperBase";

import {ShadowChunkBase} from "./ShadowChunkBase";

/**
 * ShadowSoftChunk provides a soft shadowing technique by randomly distributing sample points.
 */
export class ShadowSoftChunk extends ShadowChunkBase
{
	private _fragmentConstantsIndex:number;

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

		this._shader.fragmentConstantData[this._fragmentConstantsIndex] = 1/(<ShadowSoftMethod> this._method).numSamples;
		this._shader.fragmentConstantData[this._fragmentConstantsIndex + 1] = 0;
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		super._activate();

		var texRange:number = .5*(<ShadowSoftMethod> this._method).range/this._method.castingLight.shadowMapper.size;
		var data:Float32Array = this._shader.fragmentConstantData;
		var index:number = this._fragmentConstantsIndex + 2;
		var len:number = (<ShadowSoftMethod> this._method).numSamples << 1;

		for (var i:number = 0; i < len; ++i)
			data[index + i] = (<ShadowSoftMethod> this._method).offsets[i]*texRange;
	}



    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

        this._fragmentConstantsIndex = dataReg.index*4;

        var code:string = "";
        var uvReg:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(uvReg, 1);

        var offsets:Array<string> = new Array<string>(dataReg + ".zw");
        var numRegs:number = (<ShadowSoftMethod> this._method).numSamples >> 1;

        for (var i:number = 0; i < numRegs; ++i) {
            var reg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
            offsets.push(reg + ".xy");
            offsets.push(reg + ".zw");
        }

        var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

        for (i = 0; i < (<ShadowSoftMethod> this._method).numSamples; ++i) {
            if (i == 0) {
                code += "add " + uvReg + ", " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ", " + dataReg + ".zwyy\n" +
					this._baseTexture._getFragmentCode(targetReg, registerCache, sharedRegisters, uvReg);
            } else {
                code += "add " + uvReg + ".xy, " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".xy, " + offsets[i] + "\n" +
					this._baseTexture._getFragmentCode(temp, registerCache, sharedRegisters, uvReg) +
                    "add " + targetReg + ".w, " + targetReg + ".w, " + temp + ".w\n";
            }
        }

        registerCache.removeFragmentTempUsage(uvReg);

        code += "mul " + targetReg + ".w, " + targetReg + ".w, " + dataReg + ".x\n" + // average
 			super._getFragmentCode(targetReg, registerCache, sharedRegisters);

        return code;
    }
}