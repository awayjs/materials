import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {LightingShader} from "../shaders/LightingShader";
import {ShadowFilteredMethod} from "../methods/ShadowFilteredMethod";
import {GL_ShadowMapperBase} from "../mappers/GL_ShadowMapperBase";

import {ShadowChunkBase} from "./ShadowChunkBase";

/**
 * ShadowFilteredChunk provides a softened shadowing technique by bilinearly interpolating shadow comparison
 * results of neighbouring pixels.
 */
export class ShadowFilteredChunk extends ShadowChunkBase
{
    private _fragmentConstantsIndex:number;

	/**
	 * Creates a new ShadowFilteredChunk.
	 */
	constructor(method:ShadowFilteredMethod, shader:LightingShader)
	{
		super(method, shader);
	}

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
		super._initConstants();

		var fragmentData:Float32Array = this._shader.fragmentConstantData;
		var index:number = this._fragmentConstantsIndex;
		fragmentData[index] = .5;
		var size:number = this._method.castingLight.shadowMapper.size;
		fragmentData[index + 1] = size;
		fragmentData[index + 2] = 1/size;
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
        var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);

		code += "mov " + uvReg + ", " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + "\n" +

            this._baseTexture._getFragmentCode(temp, registerCache, sharedRegisters, uvReg) +
            "mov " + uvReg + ".w, " + temp + ".w\n" +

			"add " + uvReg + ".x, " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".x, " + dataReg + ".z\n" + 	// (1, 0)
            this._baseTexture._getFragmentCode(temp, registerCache, sharedRegisters, uvReg) +

			"mul " + temp + ".x, " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".x, " + dataReg + ".y\n" +
			"frc " + temp + ".x, " + temp + ".x\n" +
			"sub " + temp + ".w, " + temp + ".w, " + uvReg + ".w\n" +
			"mul " + temp + ".w, " + temp + ".w, " + temp + ".x\n" +
			"add " + targetReg + ".w, " + uvReg + ".w, " + temp + ".w\n" +

			"mov " + uvReg + ".x, " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".x\n" +
			"add " + uvReg + ".y, " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".y, " + dataReg + ".z\n" +	// (0, 1)
            this._baseTexture._getFragmentCode(temp, registerCache, sharedRegisters, uvReg) +
            "mov " + uvReg + ".w, " + temp + ".w\n" +

			"add " + uvReg + ".x, " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".x, " + dataReg + ".z\n" +	// (1, 1)
            this._baseTexture._getFragmentCode(temp, registerCache, sharedRegisters, uvReg) +

			// recalculate fraction, since we ran out of registers :(
			"mul " + temp + ".x, " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".x, " + dataReg + ".y\n" +
			"frc " + temp + ".x, " + temp + ".x\n" +
			"sub " + temp + ".w, " + temp + ".w, " + uvReg + ".w\n" +
			"mul " + temp + ".w, " + temp + ".w, " + temp + ".x\n" +
			"add " + uvReg + ".w, " + uvReg + ".w, " + temp + ".w\n" +

			"mul " + temp + ".x, " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".y, " + dataReg + ".y\n" +
			"frc " + temp + ".x, " + temp + ".x\n" +
			"sub " + uvReg + ".w, " + uvReg + ".w, " + targetReg + ".w\n" +
			"mul " + uvReg + ".w, " + uvReg + ".w, " + temp + ".x\n" +
			"add " + targetReg + ".w, " + targetReg + ".w, " + uvReg + ".w\n";

        registerCache.removeFragmentTempUsage(temp);
        registerCache.removeFragmentTempUsage(uvReg);

        super._getFragmentCode(targetReg, registerCache, sharedRegisters);

		return code;
	}
}