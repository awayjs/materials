import {Matrix3D, Rectangle, AssetEvent, PerspectiveProjection, ProjectionBase} from "@awayjs/core";

import {Image2D} from "@awayjs/stage";

import {DefaultRenderer, IView} from "@awayjs/renderer";

import {DirectionalShadowMapper} from "./DirectionalShadowMapper";

export class CascadeShadowMapper extends DirectionalShadowMapper
{
    private _onClearDelegate:(event:AssetEvent) => void;

	public _pScissorRects:Rectangle[];
	private _scissorRectsInvalid:boolean = true;
	private _splitRatios:number[];

	private _numCascades:number;
	private _depthProjections:Array<PerspectiveProjection>;

	private _texOffsetsX:Array<number>;
	private _texOffsetsY:Array<number>;

	private _nearPlaneDistances:number[];

    public static assetType:string = "[asset CascadeShadowMapper]";

    /**
     * @inheritDoc
     */
    public get assetType():string
    {
        return CascadeShadowMapper.assetType;
    }

	constructor(image2D:Image2D = null, numCascades:number = 3)
	{
		super(image2D);

        this._onClearDelegate = (event:AssetEvent) => this.onClear(event);
        image2D.addEventListener(AssetEvent.CLEAR, this._onClearDelegate);

		if (numCascades < 1 || numCascades > 4)
			throw new Error("numCascades must be an integer between 1 and 4");

		this._numCascades = numCascades;
		this.init();
	}

	public dispose():void
	{
        this._image2D.removeEventListener(AssetEvent.CLEAR, this._onClearDelegate);

		super.dispose();
	}

	public getSplitRatio(index:number):number
	{
		return this._splitRatios[index];
	}

	public setSplitRatio(index:number, value:number):void
	{
		if (value < 0)
			value = 0;
		else if (value > 1)
			value = 1;

		if (index >= this._numCascades)
			throw new Error("index must be smaller than the number of cascades!");

		this._splitRatios[index] = value;
	}

	public getDepthProjections(partition:number):Matrix3D
	{
		return this._depthProjections[partition].viewMatrix3D;
	}

	private init():void
	{
		this._splitRatios = new Array<number>(this._numCascades);
		this._nearPlaneDistances = new Array<number>(this._numCascades);

		var s:number = 1;
		for (var i:number /*int*/ = this._numCascades - 1; i >= 0; --i) {
			this._splitRatios[i] = s;
			s *= .4;
		}

		this._texOffsetsX = Array<number>(-1, 1, -1, 1);
		this._texOffsetsY = Array<number>(1, 1, -1, -1);
		this._pScissorRects = new Array<Rectangle>(4);
		this._depthProjections = new Array<PerspectiveProjection>();

		for (i = 0; i < this._numCascades; ++i)
			this._depthProjections[i] = new PerspectiveProjection();
	}
    /**
     *
     */
    public onClear(event:AssetEvent):void
    {
        this._scissorRectsInvalid = true;
	}

	public get numCascades():number /*int*/
	{
		return this._numCascades;
	}

	public set numCascades(value:number /*int*/)
	{
		if (value == this._numCascades)
			return;

		if (value < 1 || value > 4)
			throw new Error("numCascades must be an integer between 1 and 4");

		this._numCascades = value;
        this._scissorRectsInvalid = true;
		this.init();
		this.dispatchEvent(new AssetEvent(AssetEvent.INVALIDATE, this));
	}

	protected _renderMap(view:IView, rootRenderer:DefaultRenderer):void
	{
		if (this._scissorRectsInvalid)
			this.updateScissorRects();

        rootRenderer.getDepthRenderer().cullPlanes = this._cullPlanes;
        rootRenderer.getDepthRenderer()._iRenderCascades(this._overallDepthProjection, view, this._image2D, this._numCascades, this._pScissorRects, this._depthProjections);
	}

	private updateScissorRects():void
	{
		var half:number = this._image2D.width*.5;

		this._pScissorRects[0] = new Rectangle(0, 0, half, half);
		this._pScissorRects[1] = new Rectangle(half, 0, half, half);
		this._pScissorRects[2] = new Rectangle(0, half, half, half);
		this._pScissorRects[3] = new Rectangle(half, half, half, half);

		this._scissorRectsInvalid = false;
	}

	protected _updateProjection(projection:ProjectionBase):void
	{
		var matrix:Matrix3D;
		var projectionNear:number = projection.near;
		var projectionRange:number = projection.far - projectionNear;

		this._updateProjectionFromFrustumCorners(projection, projection.frustumCorners, this._matrix);
		this._matrix.appendScale(.96, .96, 1);
		this._overallDepthProjection.frustumMatrix3D = this._matrix;
		this._updateCullPlanes(projection);

		for (var i:number /*int*/ = 0; i < this._numCascades; ++i) {
			matrix = this._depthProjections[i].frustumMatrix3D;

			this._nearPlaneDistances[i] = projectionNear + this._splitRatios[i]*projectionRange;
			this._depthProjections[i].transform.matrix3D = this._overallDepthProjection.transform.matrix3D;

			this.updateProjectionPartition(matrix, this._splitRatios[i], this._texOffsetsX[i], this._texOffsetsY[i]);

			this._depthProjections[i].frustumMatrix3D = matrix;
		}
	}

	private updateProjectionPartition(matrix:Matrix3D, splitRatio:number, texOffsetX:number, texOffsetY:number):void
	{
		var xN:number, yN:number, zN:number;
		var xF:number, yF:number, zF:number;
		var minX:number = Number.POSITIVE_INFINITY, minY:number = Number.POSITIVE_INFINITY, minZ:number;
		var maxX:number = Number.NEGATIVE_INFINITY, maxY:number = Number.NEGATIVE_INFINITY, maxZ:number = Number.NEGATIVE_INFINITY;
		var i:number = 0;

		while (i < 12) {
			xN = this._localFrustum[i];
			yN = this._localFrustum[i + 1];
			zN = this._localFrustum[i + 2];
			xF = xN + (this._localFrustum[i + 12] - xN)*splitRatio;
			yF = yN + (this._localFrustum[i + 13] - yN)*splitRatio;
			zF = zN + (this._localFrustum[i + 14] - zN)*splitRatio;
			if (xN < minX)
				minX = xN;
			if (xN > maxX)
				maxX = xN;
			if (yN < minY)
				minY = yN;
			if (yN > maxY)
				maxY = yN;
			if (zN > maxZ)
				maxZ = zN;
			if (xF < minX)
				minX = xF;
			if (xF > maxX)
				maxX = xF;
			if (yF < minY)
				minY = yF;
			if (yF > maxY)
				maxY = yF;
			if (zF > maxZ)
				maxZ = zF;
			i += 3;
		}

		minZ = 1;

		var w:number = (maxX - minX);
		var h:number = (maxY - minY);
		var d:number = 1/(maxZ - minZ);

		if (minX < 0)
			minX -= this._snap; // because int() rounds up for < 0
		if (minY < 0)
			minY -= this._snap;
		minX = Math.floor(minX/this._snap)*this._snap;
		minY = Math.floor(minY/this._snap)*this._snap;

		var snap2:number = 2*this._snap;
		w = Math.floor(w/snap2 + 1)*snap2;
		h = Math.floor(h/snap2 + 1)*snap2;

		maxX = minX + w;
		maxY = minY + h;

		w = 1/w;
		h = 1/h;

		var raw:Float32Array = matrix._rawData;

		raw[0] = 2*w;
		raw[5] = 2*h;
		raw[10] = d;
		raw[12] = -(maxX + minX)*w;
		raw[13] = -(maxY + minY)*h;
		raw[14] = -minZ*d;
		raw[15] = 1;
		raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;

		matrix.appendScale(.96, .96, 1);
		matrix.appendTranslation(texOffsetX, texOffsetY, 0);
		matrix.appendScale(.5, .5, 1);
	}

	get _iNearPlaneDistances():Array<number>
	{
		return this._nearPlaneDistances;
	}
}

import {ShaderBase} from "@awayjs/renderer";

import {GL_CascadeShadowMapper} from "./GL_CascadeShadowMapper";

ShaderBase.registerAbstraction(GL_CascadeShadowMapper, CascadeShadowMapper);