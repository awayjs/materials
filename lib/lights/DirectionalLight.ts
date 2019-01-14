import {Vector3D, Transform, TransformEvent} from "@awayjs/core";

import {DirectionalShadowMapper} from "../mappers/DirectionalShadowMapper";

import {LightBase} from "./LightBase";

export class DirectionalLight extends LightBase
{
	public static assetType:string = "[light DirectionalLight]";

	private _direction:Vector3D;
	private _tmpLookAt:Vector3D;
	private _sceneDirection:Vector3D;
	private _sceneDirectionDirty:boolean = true;
	private _pAabbPoints:Array<number>;
	private _projAABBPoints:Array<number>;

	constructor(direction:Vector3D = null, transform:Transform = null)
	{
		super(transform);

		if (direction)
			this.direction = direction;

		this._sceneDirection = new Vector3D();
	}

	public get assetType():string
	{
		return DirectionalLight.assetType;
	}

	public get sceneDirection():Vector3D
	{
		if (this._sceneDirectionDirty)
			this._updateSceneDirection();

		return this._sceneDirection;
	}

	public get direction():Vector3D
	{
		return this._direction;
	}

	public set direction(value:Vector3D)
	{
		this._direction = value;

		if (!this._tmpLookAt)
			this._tmpLookAt = new Vector3D();

		this._tmpLookAt.x = this.transform.position.x + this._direction.x;
		this._tmpLookAt.y = this.transform.position.y + this._direction.y;
		this._tmpLookAt.z = this.transform.position.z + this._direction.z;

		this.transform.lookAt(this._tmpLookAt);
	}

    protected _onInvalidateConcatenatedMatrix3D(event:TransformEvent):void
	{
        this._sceneDirectionDirty = true;
    }

    private _updateSceneDirection():void
    {
        this._sceneDirectionDirty = false;

		this.transform.concatenatedMatrix3D.copyColumnTo(2, this._sceneDirection);

		this._sceneDirection.normalize();
	}

	protected _createShadowMapper():DirectionalShadowMapper
	{
		return new DirectionalShadowMapper();
	}

	// public _getEntityProjectionMatrix(entity:IEntity, cameraTransform:Matrix3D, target:Matrix3D = null):Matrix3D
	// {
	// 	if (!target)
	// 		target = new Matrix3D();
		
	// 	var m:Matrix3D = Matrix3D.CALCULATION_MATRIX;

	// 	m.copyFrom(entity.getRenderSceneTransform(cameraTransform));
	// 	m.append(this.transform.inverseConcatenatedMatrix3D);

	// 	if (!this._projAABBPoints)
	// 		this._projAABBPoints = [];

    //     if (!this._pAabbPoints)
    //         this._pAabbPoints = [];
        
    //     //update points
	// 	var box:Box = entity.getBoxBounds();

	// 	if (box == null)
	// 		box = new Box();

    //     var minX:number = box.x;
    //     var minY:number = box.y - box.height;
    //     var minZ:number = box.z;
    //     var maxX:number = box.x + box.width;
    //     var maxY:number = box.y;
    //     var maxZ:number = box.z + box.depth;

    //     this._pAabbPoints[0] = minX;
    //     this._pAabbPoints[1] = minY;
    //     this._pAabbPoints[2] = minZ;
    //     this._pAabbPoints[3] = maxX;
    //     this._pAabbPoints[4] = minY;
    //     this._pAabbPoints[5] = minZ;
    //     this._pAabbPoints[6] = minX;
    //     this._pAabbPoints[7] = maxY;
    //     this._pAabbPoints[8] = minZ;
    //     this._pAabbPoints[9] = maxX;
    //     this._pAabbPoints[10] = maxY;
    //     this._pAabbPoints[11] = minZ;
    //     this._pAabbPoints[12] = minX;
    //     this._pAabbPoints[13] = minY;
    //     this._pAabbPoints[14] = maxZ;
    //     this._pAabbPoints[15] = maxX;
    //     this._pAabbPoints[16] = minY;
    //     this._pAabbPoints[17] = maxZ;
    //     this._pAabbPoints[18] = minX;
    //     this._pAabbPoints[19] = maxY;
    //     this._pAabbPoints[20] = maxZ;
    //     this._pAabbPoints[21] = maxX;
    //     this._pAabbPoints[22] = maxY;
    //     this._pAabbPoints[23] = maxZ;
        
	// 	m.transformVectors(this._pAabbPoints, this._projAABBPoints);

	// 	var xMin:number = Infinity, xMax:number = -Infinity;
	// 	var yMin:number = Infinity, yMax:number = -Infinity;
	// 	var zMin:number = Infinity, zMax:number = -Infinity;
	// 	var d:number;
	// 	for (var i:number = 0; i < 24;) {
	// 		d = this._projAABBPoints[i++];

	// 		if (d < xMin)
	// 			xMin = d;

	// 		if (d > xMax)
	// 			xMax = d;

	// 		d = this._projAABBPoints[i++];

	// 		if (d < yMin)
	// 			yMin = d;

	// 		if (d > yMax)
	// 			yMax = d;

	// 		d = this._projAABBPoints[i++];

	// 		if (d < zMin)
	// 			zMin = d;

	// 		if (d > zMax)
	// 			zMax = d;
	// 	}

	// 	var invXRange:number = 1/(xMax - xMin);
	// 	var invYRange:number = 1/(yMax - yMin);
	// 	var invZRange:number = 1/(zMax - zMin);

	// 	var targetData:Float32Array = target._rawData;

	// 	targetData[0] = 2*invXRange;
	// 	targetData[5] = 2*invYRange;
	// 	targetData[10] = invZRange;
	// 	targetData[12] = -(xMax + xMin)*invXRange;
	// 	targetData[13] = -(yMax + yMin)*invYRange;
	// 	targetData[14] = -zMin*invZRange;
	// 	targetData[1] = targetData[2] = targetData[3] = targetData[4] = targetData[6] = targetData[7] = targetData[8] = targetData[9] = targetData[11] = 0;
	// 	targetData[15] = 1;
		
	// 	target.prepend(m);

	// 	return target;
	// }
}