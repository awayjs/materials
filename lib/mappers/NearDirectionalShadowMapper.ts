import {ProjectionBase} from "@awayjs/core";

import {Image2D} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {DirectionalShadowMapper, _Shader_DirectionalShadowMapper} from "./DirectionalShadowMapper";

export class NearDirectionalShadowMapper extends DirectionalShadowMapper
{
    private _fadeRatio:number;
	private _coverageRatio:number;

    public static assetType:string = "[asset NearDirectionalShadowMapper]";

    /**
     * @inheritDoc
     */
    public get assetType():string
    {
        return NearDirectionalShadowMapper.assetType;
    }

	constructor(image2D:Image2D = null, coverageRatio:number = .5, fadeRatio:number = .1)
	{
		super(image2D);

		this.coverageRatio = coverageRatio;

        this._fadeRatio = fadeRatio;
	}

	/**
	 * A value between 0 and 1 to indicate the ratio of the view frustum that needs to be covered by the shadow map.
	 */
	public get coverageRatio():number
	{
		return this._coverageRatio;
	}

	public set coverageRatio(value:number)
	{
		if (value > 1)
			value = 1;
		else if (value < 0)
			value = 0;

		this._coverageRatio = value;
	}

    /**
     * The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
     */
    public get fadeRatio():number
    {
        return this._fadeRatio;
    }

    public set fadeRatio(value:number)
    {
        this._fadeRatio = value;
    }

	protected _updateProjection(projection:ProjectionBase):void
	{
		var corners:Array<number> = projection.viewFrustumCorners;

		for (var i:number /*int*/ = 0; i < 12; ++i) {
			var v:number = corners[i];
			this._localFrustum[i] = v;
			this._localFrustum[i + 12] = v + (corners[i + 12] - v)*this._coverageRatio;
		}

		this._updateProjectionFromFrustumCorners(projection, this._localFrustum, this._matrix);
		this._overallDepthProjection.frustumMatrix3D = this._matrix;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase, _Render_RenderableBase, ChunkVO} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";
import {MethodEvent} from "../events/MethodEvent";

// TODO: shadow mappers references in materials should be an interface so that this class should NOT extend ShadowMapMethodBase just for some delegation work
/**
 * ShadowNearChunk provides a shadow map method that restricts the shadowed area near the camera to optimize
 * shadow map usage. This method needs to be used in conjunction with a NearDirectionalShadowMapper.
 *
 * @see away.lights.NearDirectionalShadowMapper
 */
export class _Shader_NearDirectionalShadowMapper extends _Shader_DirectionalShadowMapper
{
    private _fragmentDistanceIndex:number;

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        super._initConstants();

        var fragmentData:Float32Array = this._shader.fragmentConstantData;
        var index:number = this._fragmentDistanceIndex;
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
        this._fragmentDistanceIndex = dataReg.index*4;

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
    public _setRenderState(renderState:_Render_RenderableBase, view:View):void
    {
        // todo: move this to activate (needs camera)
        var near:number = view.projection.near;
        var d:number = view.projection.far - near;
        var maxDistance:number = (<NearDirectionalShadowMapper> this._mapper).coverageRatio;
        var minDistance:number = maxDistance*(1 - (<NearDirectionalShadowMapper> this._mapper).fadeRatio);

        maxDistance = near + maxDistance*d;
        minDistance = near + minDistance*d;

        var fragmentData:Float32Array = this._shader.fragmentConstantData;
        var index:number = this._fragmentDistanceIndex;
        fragmentData[index] = minDistance;
        fragmentData[index + 1] = 1/(maxDistance - minDistance);

        super._setRenderState(renderState, view);
    }
}

ShaderBase.registerAbstraction(_Shader_NearDirectionalShadowMapper, NearDirectionalShadowMapper);