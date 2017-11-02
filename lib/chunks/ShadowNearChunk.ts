import {ProjectionBase} from "@awayjs/core";

import {NearDirectionalShadowMapper} from "@awayjs/graphics";

import {Stage, GL_RenderableBase, ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShadingMethodEvent, LightingShader} from "@awayjs/renderer";

import {ChunkVO} from "../data/ChunkVO";
import {ShadowNearMethod} from "../methods/ShadowNearMethod";

import {CompositeChunkBase} from "./CompositeChunkBase";

// TODO: shadow mappers references in materials should be an interface so that this class should NOT extend ShadowMapMethodBase just for some delegation work
/**
 * ShadowNearChunk provides a shadow map method that restricts the shadowed area near the camera to optimize
 * shadow map usage. This method needs to be used in conjunction with a NearDirectionalShadowMapper.
 *
 * @see away.lights.NearDirectionalShadowMapper
 */
export class ShadowNearChunk extends CompositeChunkBase
{
	protected _method:ShadowNearMethod;
	protected _shader:LightingShader;
	private _fragmentConstantsIndex:number;
	/**
	 * Creates a new ShadowNearChunk.
	 */
	constructor(method:ShadowNearMethod, shader:LightingShader)
	{
		super(method, shader);

		this._method = method;
		this._shader = shader;
	}

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
		super._initConstants();

		var fragmentData:Float32Array = this._shader.fragmentConstantData;
		var index:number = this._fragmentConstantsIndex;
		fragmentData[index + 2] = 0;
		fragmentData[index + 3] = 1;
	}

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
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = super._getFragmentCode(targetReg, registerCache, sharedRegisters);

		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentSingleTemp();
		this._fragmentConstantsIndex = dataReg.index*4;

		code += "abs " + temp + ", " + sharedRegisters.projectionFragment + ".w\n" +
			"sub " + temp + ", " + temp + ", " + dataReg + ".x\n" +
			"mul " + temp + ", " + temp + ", " + dataReg + ".y\n" +
			"sat " + temp + ", " + temp + "\n" +
			"sub " + temp + ", " + dataReg + ".w," + temp + "\n" +
			"sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n" +
			"mul " + targetReg + ".w, " + targetReg + ".w, " + temp + "\n" +
			"sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n";

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase):void
	{
		// todo: move this to activate (needs camera)
		var near:number = projection.near;
		var d:number = projection.far - near;
		var maxDistance:number = (<NearDirectionalShadowMapper> this._method.castingLight.shadowMapper).coverageRatio;
		var minDistance:number = maxDistance*(1 - this._method.fadeRatio);

		maxDistance = near + maxDistance*d;
		minDistance = near + minDistance*d;

		var fragmentData:Float32Array = this._shader.fragmentConstantData;
		var index:number = this._fragmentConstantsIndex;
		fragmentData[index] = minDistance;
		fragmentData[index + 1] = 1/(maxDistance - minDistance);

		super._setRenderState(renderable, projection);
	}
}