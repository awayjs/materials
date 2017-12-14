import {ProjectionBase} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {_Render_RenderableBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

import {DirectionalLight} from "../lights/DirectionalLight";
import {LightingShader} from "../shaders/LightingShader";

import {ShadowDitheredMethod} from "../methods/ShadowDitheredMethod";
import {GL_ShadowMapperBase} from "../mappers/GL_ShadowMapperBase";

import {ShadowChunkBase} from "./ShadowChunkBase";

/**
 * ShadowDitheredChunk provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
 */
export class ShadowDitheredChunk extends ShadowChunkBase
{
	private _grainMap:_Shader_TextureBase;
    private _fragmentConstantsIndex:number;

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
		data[index + 1] = (this._shader.renderMaterial.renderGroup.renderer.width - 1)/63;
		data[index + 2] = (this._shader.renderMaterial.renderGroup.renderer.height - 1)/63;
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
                code += "add " + uvReg + ".xy, " + uvReg + ".zw, " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".xy\n" +
                    this._baseTexture._getFragmentCode(targetReg, regCache, sharedRegisters, uvReg);
            } else {
                code += this._addSample(uvReg, targetReg, regCache, sharedRegisters);
            }

            if (index > 4)
                code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" +
                    this._addSample(uvReg, targetReg, regCache, sharedRegisters);

            if (index > 1)
                code += "sub " + uvReg + ".xy, " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".xy, " + uvReg + ".zw\n" +
                    this._addSample(uvReg, targetReg, regCache, sharedRegisters);

            if (index > 5)
                code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" +
                    this._addSample(uvReg, targetReg, regCache, sharedRegisters);

            if (index > 2) {
                code += "neg " + uvReg + ".w, " + uvReg + ".w\n" + // will be rotated 90 degrees when being accessed as wz
                    "add " + uvReg + ".xy, " + uvReg + ".wz, " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".xy\n" +
                    this._addSample(uvReg, targetReg, regCache, sharedRegisters);
            }

            if (index > 6)
                code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" +
                    this._addSample(uvReg, targetReg, regCache, sharedRegisters);

            if (index > 3)
                code += "sub " + uvReg + ".xy, " + (<GL_ShadowMapperBase> this._baseChunk).depthMapCoordReg + ".xy, " + uvReg + ".wz\n" +
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
	public _setRenderState(renderState:_Render_RenderableBase, projection:ProjectionBase):void
	{
		super._setRenderState(renderState, projection);

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