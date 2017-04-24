import {Vector3D, Matrix3D, AbstractMethodError, ProjectionBase} from "@awayjs/core";

import {LightBase, PointLight, DirectionalShadowMapper} from "@awayjs/scene";

import {GL_TextureBase, GL_RenderableBase, ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {LightingShader} from "@awayjs/renderer";

import {ChunkVO} from "../data/ChunkVO";
import {ShadowMethodBase} from "../methods/ShadowMethodBase";

import {ShaderChunkBase} from "./ShaderChunkBase";

/**
 * ShadowChunkBase provides an abstract method for simple (non-wrapping) shadow map methods.
 */
export class ShadowChunkBase extends ShaderChunkBase
{
	protected _method:ShadowMethodBase;
	protected _shader:ShaderBase;

	protected _depthMapCoordReg:ShaderRegisterElement;
	protected _usePoint:boolean;

	protected _depthMap:GL_TextureBase;
	protected _vertexConstantsIndex:number;
	protected _fragmentConstantsIndex:number;
	protected _depthProjectionMatrix:Matrix3D;

	public get depthMap():GL_TextureBase
	{
		return this._depthMap;
	}

	/**
	 * Creates a new ShadowChunkBase object.
	 */
	constructor(method:ShadowMethodBase, shader:ShaderBase)
	{
		super(method, shader);

		this._method = method;
		this._shader = shader;

		this._usePoint = (method.castingLight instanceof PointLight);
	}

	/**
	 * @inheritDoc
	 */
	public _initVO(chunkVO:ChunkVO):void
	{
		chunkVO.needsView = true;
		chunkVO.needsGlobalVertexPos = true;
		chunkVO.needsGlobalFragmentPos = this._usePoint;
		chunkVO.needsNormals = this._shader.numLights > 0;

		this._depthMap = <GL_TextureBase> this._shader.getAbstraction(this._method.castingLight.shadowMapper.depthMap);
	}

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
		var fragmentData:Float32Array = this._shader.fragmentConstantData;
		var vertexData:Float32Array = this._shader.vertexConstantData;
		var index:number = this._fragmentConstantsIndex;
		fragmentData[index] = 1.0;
		fragmentData[index + 1] = 1/255.0;
		fragmentData[index + 2] = 1/65025.0;
		fragmentData[index + 3] = 1/16581375.0;

		fragmentData[index + 6] = 0;
		fragmentData[index + 7] = 1;

		if (this._usePoint) {
			fragmentData[index + 8] = 0;
			fragmentData[index + 9] = 0;
			fragmentData[index + 10] = 0;
			fragmentData[index + 11] = 1;
		}

		index = this._vertexConstantsIndex;
		if (index != -1) {
			vertexData[index] = .5;
			vertexData[index + 1] = .5;
			vertexData[index + 2] = 0.0;
			vertexData[index + 3] = 1.0;
		}

		this._depthProjectionMatrix = new Matrix3D(new Float32Array(this._shader.vertexConstantData.buffer, (this._vertexConstantsIndex + 4)*4, 16));
	}

	/**
	 * Wrappers that override the vertex shader need to set this explicitly
	 */
	public get _iDepthMapCoordReg():ShaderRegisterElement
	{
		return this._depthMapCoordReg;
	}

	public set _iDepthMapCoordReg(value:ShaderRegisterElement)
	{
		this._depthMapCoordReg = value;
	}

	/**
	 * @inheritDoc
	 */
	public _cleanCompilationData():void
	{
		super._cleanCompilationData();

		this._depthMapCoordReg = null;
	}

	/**
	 * @inheritDoc
	 */
	public _getVertexCode(regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._usePoint? this._getPointVertexCode(regCache, sharedRegisters):this._getPlanarVertexCode(regCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = this._usePoint? this._getPointFragmentCode(targetReg, registerCache, sharedRegisters) : this._getPlanarFragmentCode(targetReg, registerCache, sharedRegisters);

		code += "add " + targetReg + ".w, " + targetReg + ".w, fc" + (this._fragmentConstantsIndex/4 + 1) + ".y\n" + //TODO: remove fc hack
			"sat " + targetReg + ".w, " + targetReg + ".w\n";
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase):void
	{
		if (!this._usePoint)
			this._depthProjectionMatrix.copyFrom((<DirectionalShadowMapper> this._method.castingLight.shadowMapper).iDepthProjection, true);

		this._depthMap._setRenderState(renderable);
	}

	/**
	 * Gets the fragment code for combining this method with a cascaded shadow map method.
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param regCache The register cache used during the compilation.
	 * @param decodeRegister The register containing the data to decode the shadow map depth value.
	 * @param depthTexture The texture containing the shadow map.
	 * @param depthProjection The projection of the fragment relative to the light.
	 * @param targetRegister The register to contain the shadow coverage
	 * @return
	 */
	public _getCascadeFragmentCode(decodeRegister:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new Error("This shadow method is incompatible with cascade shadows");
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		var fragmentData:Float32Array = this._shader.fragmentConstantData;
		var index:number = this._fragmentConstantsIndex;

		if (this._usePoint)
			fragmentData[index + 4] = -Math.pow(1/((<PointLight> this._method.castingLight).fallOff*this._method.epsilon), 2);
		else
			this._shader.vertexConstantData[this._vertexConstantsIndex + 3] = -1/((<DirectionalShadowMapper> this._method.castingLight.shadowMapper).depth*this._method.epsilon);

		fragmentData[index + 5] = 1 - this._method.alpha;

		if (this._usePoint) {
			var pos:Vector3D = this._method.castingLight.scenePosition;
			fragmentData[index + 8] = pos.x;
			fragmentData[index + 9] = pos.y;
			fragmentData[index + 10] = pos.z;
			// used to decompress distance
			var f:number = (<PointLight> this._method.castingLight).fallOff;
			fragmentData[index + 11] = 1/(2*f*f);
		}

		this._depthMap.activate();
	}

	/**
	 * Sets the method state for cascade shadow mapping.
	 */
	public _activateForCascade():void
	{
		throw new Error("This shadow method is incompatible with cascade shadows");
	}
	
	/**
	 * Gets the vertex code for shadow mapping with a point light.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param regCache The register cache used during the compilation.
	 */
	protected _getPointVertexCode(regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._vertexConstantsIndex = -1;
		return "";
	}

	/**
	 * Gets the vertex code for shadow mapping with a planar shadow map (fe: directional lights).
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param regCache The register cache used during the compilation.
	 */
	protected _getPlanarVertexCode(regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var temp:ShaderRegisterElement = regCache.getFreeVertexVectorTemp();
		var dataReg:ShaderRegisterElement = regCache.getFreeVertexConstant();
		this._vertexConstantsIndex = dataReg.index*4;

		var depthMapProj:ShaderRegisterElement = regCache.getFreeVertexConstant();
		regCache.getFreeVertexConstant();
		regCache.getFreeVertexConstant();
		regCache.getFreeVertexConstant();

		this._depthMapCoordReg = regCache.getFreeVarying();

		// todo: can epsilon be applied here instead of fragment shader?

		code += "m44 " + temp + ", " + sharedRegisters.globalPositionVertex + ", " + depthMapProj + "\n" +
			"div " + temp + ", " + temp + ", " + temp + ".w\n" +
			"mul " + temp + ".xy, " + temp + ".xy, " + dataReg + ".xy\n" +
			"add " + this._depthMapCoordReg + ", " + temp + ", " + dataReg + ".xxwz\n";
		//"sub " + this._depthMapCoordReg + ".z, " + this._depthMapCoordReg + ".z, " + this._depthMapCoordReg + ".w\n";

		return code;
	}

	/**
	 * Gets the fragment code for shadow mapping with a planar shadow map.
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param regCache The register cache used during the compilation.
	 * @param targetReg The register to contain the shadow coverage
	 * @return
	 */
	protected _getPlanarFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
	}

	/**
	 * Gets the fragment code for shadow mapping with a point light.
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param regCache The register cache used during the compilation.
	 * @param targetReg The register to contain the shadow coverage
	 * @return
	 */
	protected _getPointFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
	}
}