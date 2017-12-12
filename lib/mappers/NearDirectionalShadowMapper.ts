import {ProjectionBase} from "@awayjs/core";

import {Image2D} from "@awayjs/stage";

import {DirectionalShadowMapper} from "./DirectionalShadowMapper";

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
		var corners:Array<number> = projection.frustumCorners;

		for (var i:number /*int*/ = 0; i < 12; ++i) {
			var v:number = corners[i];
			this._localFrustum[i] = v;
			this._localFrustum[i + 12] = v + (corners[i + 12] - v)*this._coverageRatio;
		}

		this._updateProjectionFromFrustumCorners(projection, this._localFrustum, this._matrix);
		this._overallDepthProjection.frustumMatrix3D = this._matrix;
	}
}

import {ShaderBase} from "@awayjs/renderer";

import {GL_NearDirectionalShadowMapper} from "./GL_NearDirectionalShadowMapper";

ShaderBase.registerAbstraction(GL_NearDirectionalShadowMapper, NearDirectionalShadowMapper);