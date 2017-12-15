import {PoissonLookup} from "@awayjs/core";

import {DirectionalLight} from "../lights/DirectionalLight";

import {ShadowMethodBase, _Shader_ShadowMethodBase} from "./ShadowMethodBase";

/**
 * ShadowSoftMethod provides a soft shadowing technique by randomly distributing sample points.
 */
export class ShadowSoftMethod extends ShadowMethodBase
{
	private _range:number;
	private _numSamples:number;
	private _offsets:Array<number>;

	public static assetType:string = "[asset ShadowSoftMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return ShadowSoftMethod.assetType;
	}

	public get offsets():Array<number>
	{
		return this._offsets;
	}

	/**
	 * The amount of samples to take for dithering. Minimum 1, maximum 32. The actual maximum may depend on the
	 * complexity of the shader.
	 */
	public get numSamples():number
	{
		return this._numSamples;
	}

	public set numSamples(value:number)
	{
		this._numSamples = value;
		
		if (this._numSamples < 1)
			this._numSamples = 1;
		else if (this._numSamples > 32)
			this._numSamples = 32;

		this._offsets = PoissonLookup.getDistribution(this._numSamples);
		
		this.invalidateShaderProgram();
	}

	/**
	 * The range in the shadow map in which to distribute the samples.
	 */
	public get range():number
	{
		return this._range;
	}

	public set range(value:number)
	{
		this._range = value;
	}

	/**
	 * Creates a new DiffuseBasicMethod object.
	 *
	 * @param castingLight The light casting the shadows
	 * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 32.
	 */
	constructor(castingLight:DirectionalLight, numSamples:number = 5, range:number = 1)
	{
		super(castingLight);

		this.numSamples = numSamples;
		this.range = range;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";
import {_Shader_ShadowMapperBase} from "../mappers/ShadowMapperBase";

/**
 * _Shader_ShadowSoftMethod provides a soft shadowing technique by randomly distributing sample points.
 */
export class _Shader_ShadowSoftMethod extends _Shader_ShadowMethodBase
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
                code += "add " + uvReg + ", " + (<_Shader_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ", " + dataReg + ".zwyy\n" +
                    this._baseTexture._getFragmentCode(targetReg, registerCache, sharedRegisters, uvReg);
            } else {
                code += "add " + uvReg + ".xy, " + (<_Shader_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".xy, " + offsets[i] + "\n" +
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

ShaderBase.registerAbstraction(_Shader_ShadowSoftMethod, ShadowSoftMethod);