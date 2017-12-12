import {AssetEvent, Matrix3D, ProjectionBase} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {RenderStateBase, ChunkVO} from "@awayjs/renderer";

import {DirectionalLight} from "../lights/DirectionalLight";
import {ShadingMethodEvent} from "../events/ShadingMethodEvent";
import {LightingShader} from "../shaders/LightingShader";

import {CascadeShadowMapper} from "./CascadeShadowMapper";
import {GL_DirectionalShadowMapper} from "./GL_DirectionalShadowMapper";
import {ShadowChunkBase} from "../chunks/ShadowChunkBase";

/**
 * GL_CascadeShadowMapper is a shadow map method to apply cascade shadow mapping on materials.
 * Must be used with a DirectionalLight with a CascadeShadowMapper assigned to its shadowMapper property.
 *
 * @see away.lights.CascadeShadowMapper
 */
export class GL_CascadeShadowMapper extends GL_DirectionalShadowMapper
{
	private _cascadeProjections:Array<ShaderRegisterElement>;
	private _depthMapCoordVaryings:Array<ShaderRegisterElement>;

	private _vertexConstantsIndex:number;
	private _fragmentConstantsIndex:number;
	private _projectionMatrices:Array<Matrix3D>;

	/**
	 * @inheritDoc
	 */
	public _initVO(chunkVO:ChunkVO):void
	{
		super._initVO(chunkVO);

		chunkVO.needsProjection = true;
	}

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
		super._initConstants();
		
		var fragmentData:Float32Array = this._shader.fragmentConstantData;
		var vertexData:Float32Array = this._shader.vertexConstantData;
		var index:number = this._fragmentConstantsIndex;
		fragmentData[index] = 1.0;
		fragmentData[index + 1] = 1/255.0;
		fragmentData[index + 2] = 1/65025.0;
		fragmentData[index + 3] = 1/16581375.0;

		fragmentData[index + 6] = .5;
		fragmentData[index + 7] = -.5;

		index = this._vertexConstantsIndex;
		vertexData[index] = .5;
		vertexData[index + 1] = -.5;
		vertexData[index + 2] = 0;

		var numCascades:number = (<CascadeShadowMapper> this._mapper).numCascades;

		this._projectionMatrices = new Array<Matrix3D>(numCascades);
		for (var k:number = 0; k < numCascades; ++k)
			this._projectionMatrices[k] = new Matrix3D(new Float32Array(this._shader.vertexConstantData.buffer, (this._vertexConstantsIndex + 4 + k*16)*4, 16));
	}

	/**
	 * @inheritDoc
	 */
	public _cleanCompilationData():void
	{
		super._cleanCompilationData();

		this._cascadeProjections = null;
		this._depthMapCoordVaryings = null;
		this._projectionMatrices = null;
	}

	/**
	 * @inheritDoc
	 */
	public _getVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var dataReg:ShaderRegisterElement = registerCache.getFreeVertexConstant();

		this._vertexConstantsIndex = dataReg.index*4;

		//Create the registers for the cascades' projection coordinates.
		this._cascadeProjections = new Array<ShaderRegisterElement>((<CascadeShadowMapper> this._mapper).numCascades);
		this._depthMapCoordVaryings = new Array<ShaderRegisterElement>((<CascadeShadowMapper> this._mapper).numCascades);

		for (var i:number = 0; i < (<CascadeShadowMapper> this._mapper).numCascades; ++i) {
			this._depthMapCoordVaryings[i] = registerCache.getFreeVarying();
			this._cascadeProjections[i] = registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
		}

		var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();

		for (var i:number = 0; i < (<CascadeShadowMapper> this._mapper).numCascades; ++i) {
			code += "m44 " + temp + ", " + sharedRegisters.globalPositionVertex + ", " + this._cascadeProjections[i] + "\n" +
				"add " + this._depthMapCoordVaryings[i] + ", " + temp + ", " + dataReg + ".zzwz\n";
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var numCascades:number = (<CascadeShadowMapper> this._mapper).numCascades;
		var decReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var planeDistanceReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var planeDistances:Array<string> = Array<string>( planeDistanceReg + ".x", planeDistanceReg + ".y", planeDistanceReg + ".z", planeDistanceReg + ".w" );
		var code:string;

		this._fragmentConstantsIndex = decReg.index*4;

		var inQuad:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(inQuad, 1);
		var uvCoord:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(uvCoord, 1);

		// assume lowest partition is selected, will be overwritten later otherwise
		code = "mov " + uvCoord + ", " + this._depthMapCoordVaryings[numCascades - 1] + "\n";

		for (var i:number = numCascades - 2; i >= 0; --i) {
			var uvProjection:ShaderRegisterElement = this._depthMapCoordVaryings[i];

			// calculate if in texturemap (result == 0 or 1, only 1 for a single partition)
			code += "slt " + inQuad + ".z, " + sharedRegisters.projectionFragment + ".z, " + planeDistances[i] + "\n"; // z = x > minX, w = y > minY

			var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

			// linearly interpolate between old and new uv coords using predicate value == conditional toggle to new value if predicate == 1 (true)
			code += "sub " + temp + ", " + uvProjection + ", " + uvCoord + "\n" +
				"mul " + temp + ", " + temp + ", " + inQuad + ".z\n" +
				"add " + uvCoord + ", " + uvCoord + ", " + temp + "\n";
		}

		registerCache.removeFragmentTempUsage(inQuad);

		code += "div " + uvCoord + ", " + uvCoord + ", " + uvCoord + ".w\n" +
			"mul " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zw\n" +
			"add " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zz\n";

		// code += (<ShadowChunkBase> this._baseChunk)._getCascadeFragmentCode(decReg, uvCoord, targetReg, registerCache, sharedRegisters) +
		// 	"add " + targetReg + ".w, " + targetReg + ".w, " + dataReg + ".y\n";
        //
		registerCache.removeFragmentTempUsage(uvCoord);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		// (<ShadowChunkBase> this._baseChunk).depthMap.activate();

		this._shader.vertexConstantData[this._vertexConstantsIndex + 3] = -1/((<CascadeShadowMapper> this._mapper).depth*(<CascadeShadowMapper> this._mapper).epsilon);

		var numCascades:number = (<CascadeShadowMapper> this._mapper).numCascades;
		for (var k:number = 0; k < numCascades; ++k)
			this._projectionMatrices[k].copyFrom((<CascadeShadowMapper> this._mapper).getDepthProjections(k), true);

		var fragmentData:Float32Array = this._shader.fragmentConstantData;
		var fragmentIndex:number = this._fragmentConstantsIndex;
		fragmentData[fragmentIndex + 5] = 1 - (<CascadeShadowMapper> this._mapper).alpha;

		var nearPlaneDistances:Array<number> = (<CascadeShadowMapper> this._mapper)._iNearPlaneDistances;

		fragmentIndex += 8;
		for (var i:number = 0; i < numCascades; ++i)
			fragmentData[fragmentIndex + i] = nearPlaneDistances[i];

		// (<ShadowChunkBase> this._baseChunk)._activateForCascade();
	}

	/**
	 * @inheritDoc
	 */
	public _setRenderState(renderState:RenderStateBase, projection:ProjectionBase):void
	{
	}
}