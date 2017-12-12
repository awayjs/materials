import {Vector3D, PerspectiveProjection, ProjectionBase} from "@awayjs/core";

import {ImageCube} from "@awayjs/stage";

import {IRenderer, IView, DefaultRenderer} from "@awayjs/renderer";

import {ShadowTextureCube} from "../textures/ShadowTextureCube"
import {PointLight} from "../lights/PointLight";

import {ShadowMapperBase} from "./ShadowMapperBase";

export class PointShadowMapper extends ShadowMapperBase
{
    protected _imageCube:ImageCube;
	private _depthProjections:Array<PerspectiveProjection>;
	private _needsRender:Array<boolean> = new Array<boolean>();
	
    public static assetType:string = "[asset PointShadowMapper]";

    /**
     * @inheritDoc
     */
    public get assetType():string
    {
        return PointShadowMapper.assetType;
    }
    
	constructor(imageCube:ImageCube = null)
	{
		super();

		this._size = 512;
		this._imageCube = imageCube || new ImageCube(this._size);

        this._textureMap = new ShadowTextureCube(this, this._imageCube);

        this.iAddTexture(this._textureMap);

		this.initCameras();
	}


    public dispose():void
    {
        super.dispose();

		(<ShadowTextureCube> this._textureMap).image = null;
        this._textureMap = null;
        this._imageCube = null;
    }

	private initCameras():void
	{
		this._depthProjections = new Array();

		// posX, negX, posY, negY, posZ, negZ
		this.addProjection(0, 90, 0);
		this.addProjection(0, -90, 0);
		this.addProjection(-90, 0, 0);
		this.addProjection(90, 0, 0);
		this.addProjection(0, 0, 0);
		this.addProjection(0, 180, 0);
	}

	private addProjection(rotationX:number, rotationY:number, rotationZ:number):void
	{
		var projection:PerspectiveProjection = new PerspectiveProjection();
		projection.transform.rotateTo(rotationX, rotationY, rotationZ);
		projection.near = .01;
		projection.fieldOfView = 90;
		this._depthProjections.push(projection);
	}


    protected _updateSize()
    {
        this._imageCube._setSize(this._size);
    }

	/**
	 *
	 * @param projection
	 * @private
	 */
	protected _updateProjection(projection:ProjectionBase):void
	{
		var light:PointLight = <PointLight>(this._light);
		var maxDistance:number = light.fallOff;
		var pos:Vector3D = this._light.transform.concatenatedMatrix3D.position;

		// todo: faces outside frustum which are pointing away from camera need not be rendered!
		for (var i:number = 0; i < 6; ++i) {
			this._depthProjections[i].far = maxDistance;
			this._depthProjections[i].transform.moveTo(pos.x, pos.y, pos.z);
			this._needsRender[i] = true;
		}
	}

	/**
	 *
	 * @param view
	 * @param target
	 * @param renderer
	 * @private
	 */
	protected _renderMap(view:IView, rootRenderer:DefaultRenderer):void
	{
		for (var i:number = 0; i < 6; ++i)
			if (this._needsRender[i])
                rootRenderer.getDistanceRenderer()._iRender(this._depthProjections[i], view, this._imageCube, null, i)
	}
}

import {ShaderBase} from "@awayjs/renderer";

import {GL_PointShadowMapper} from "./GL_PointShadowMapper";

ShaderBase.registerAbstraction(GL_PointShadowMapper, PointShadowMapper);