import {Vector3D, Matrix3D, AbstractMethodError, ProjectionBase, AssetEvent} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {RenderStateBase, ShaderBase, TextureStateBase, ChunkVO} from "@awayjs/renderer";

import {LightBase} from "../lights/LightBase";
import {PointLight} from "../lights/PointLight";
import {DirectionalShadowMapper} from "./DirectionalShadowMapper";
import {LightingShader} from "../shaders/LightingShader";
import {ShadowMethodBase} from "../methods/ShadowMethodBase";

import {GL_ShadowMapperBase} from "./GL_ShadowMapperBase";

/**
 * ShadowChunkBase provides an abstract method for simple (non-wrapping) shadow map methods.
 */
export class GL_DirectionalShadowMapper extends GL_ShadowMapperBase
{
    private _vertexScalingIndex:number;

	protected _depthProjectionMatrix:Matrix3D;

	/**
	 * @inheritDoc
	 */
	public _initVO(chunkVO:ChunkVO):void
	{
		super._initVO(chunkVO);

		chunkVO.needsView = true;
		chunkVO.needsGlobalVertexPos = true;
	}

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
		super._initConstants();

		var vertexData:Float32Array = this._shader.vertexConstantData;
		var index:number = this._vertexScalingIndex;

		vertexData[index] = .5;
		vertexData[index + 1] = .5;
		vertexData[index + 2] = 0.0;
		vertexData[index + 3] = 1.0;

		this._depthProjectionMatrix = new Matrix3D(new Float32Array(this._shader.vertexConstantData.buffer, (index + 4)*4, 16));
	}

	/**
	 * @inheritDoc
	 */
	public _getVertexCode(regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
        var code:string = "";
        var temp:ShaderRegisterElement = regCache.getFreeVertexVectorTemp();
        var dataReg:ShaderRegisterElement = regCache.getFreeVertexConstant();
        this._vertexScalingIndex = dataReg.index*4;

        var depthMapProj:ShaderRegisterElement = regCache.getFreeVertexConstant();
        regCache.getFreeVertexConstant();
        regCache.getFreeVertexConstant();
        regCache.getFreeVertexConstant();

        this._depthMapCoordReg = regCache.getFreeVarying();

        code += "m44 " + temp + ", " + sharedRegisters.globalPositionVertex + ", " + depthMapProj + "\n" +
            "div " + temp + ", " + temp + ", " + temp + ".w\n" +
            "mul " + temp + ".xy, " + temp + ".xy, " + dataReg + ".xy\n" +
            "add " + this._depthMapCoordReg + ", " + temp + ", " + dataReg + ".xxwz\n";

        return code;
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		super._activate();

		var vertexData:Float32Array = this._shader.vertexConstantData;
		var index:number = this._vertexScalingIndex;

        vertexData[this._vertexScalingIndex + 3] = -1/((<DirectionalShadowMapper> this._mapper).depth*(<DirectionalShadowMapper> this._mapper).epsilon);

        this._depthProjectionMatrix.copyFrom((<DirectionalShadowMapper> this._mapper).depthProjection, true);
    }
}