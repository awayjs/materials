import {Vector3D, Transform} from "@awayjs/core";

import {PointShadowMapper} from "../mappers/PointShadowMapper";

import {LightBase} from "./LightBase";

export class PointLight extends LightBase
{
	public static assetType:string = "[light PointLight]";

	private _radius:number = 90000;
	private _fallOff:number = 100000;
    private _fallOffFactor:number;
	
	public get assetType():string
	{
		return PointLight.assetType;
	}

    /**
	 *
     */
	public get radius():number
	{
		return this._radius;
	}

	public set radius(value:number)
	{
		this._radius = value;

		if (this._radius < 0) {
			this._radius = 0;
		} else if (this._radius > this._fallOff) {
			this._fallOff = this._radius;
			//this._pInvalidateBounds();
		}
		this._fallOffFactor = 1/( this._fallOff*this._fallOff - this._radius*this._radius );
	}

    /**
	 *
     */
    public get fallOff():number
    {
        return this._fallOff;
    }

    public set fallOff(value:number)
    {
        this._fallOff = value;

        if (this._fallOff < 0)
            this._fallOff = 0;

        if (this._fallOff < this._radius)
            this._radius = this._fallOff;

        this._fallOffFactor = 1/( this._fallOff*this._fallOff - this._radius*this._radius);

        //this._pInvalidateBounds();
    }

    public get fallOffFactor():number
    {
        return this._fallOffFactor;
    }


    /**
     * Indicates the <i>x</i> coordinate of the DisplayObject instance relative
     * to the local coordinates of the parent DisplayObjectContainer. If the
     * object is inside a DisplayObjectContainer that has transformations, it is
     * in the local coordinate system of the enclosing DisplayObjectContainer.
     * Thus, for a DisplayObjectContainer rotated 90° counterclockwise, the
     * DisplayObjectContainer's children inherit a coordinate system that is
     * rotated 90° counterclockwise. The object's coordinates refer to the
     * registration point position.
     */
    public get x():number
    {
        return this._transform.position.x;
    }

    public set x(val:number)
    {
        if (this._transform.position.x == val)
            return;

        this._transform.matrix3D._rawData[12] = val;

        this._transform.invalidatePosition();
    }

    /**
     * Indicates the <i>y</i> coordinate of the DisplayObject instance relative
     * to the local coordinates of the parent DisplayObjectContainer. If the
     * object is inside a DisplayObjectContainer that has transformations, it is
     * in the local coordinate system of the enclosing DisplayObjectContainer.
     * Thus, for a DisplayObjectContainer rotated 90° counterclockwise, the
     * DisplayObjectContainer's children inherit a coordinate system that is
     * rotated 90° counterclockwise. The object's coordinates refer to the
     * registration point position.
     */
    public get y():number
    {
        return this._transform.position.y;
    }

    public set y(val:number)
    {
        if (this._transform.position.y == val)
            return;

        this._transform.matrix3D._rawData[13] = val;

        this._transform.invalidatePosition();
    }

    /**
     * Indicates the z coordinate position along the z-axis of the DisplayObject
     * instance relative to the 3D parent container. The z property is used for
     * 3D coordinates, not screen or pixel coordinates.
     *
     * <p>When you set a <code>z</code> property for a display object to
     * something other than the default value of <code>0</code>, a corresponding
     * Matrix3D object is automatically created. for adjusting a display object's
     * position and orientation in three dimensions. When working with the
     * z-axis, the existing behavior of x and y properties changes from screen or
     * pixel coordinates to positions relative to the 3D parent container.</p>
     *
     * <p>For example, a child of the <code>_root</code> at position x = 100, y =
     * 100, z = 200 is not drawn at pixel location(100,100). The child is drawn
     * wherever the 3D projection calculation puts it. The calculation is:</p>
     *
     * <p><code>(x~~cameraFocalLength/cameraRelativeZPosition,
     * y~~cameraFocalLength/cameraRelativeZPosition)</code></p>
     */
    public get z():number
    {
        return this._transform.position.z;
    }

    public set z(val:number)
    {
        if (this._transform.position.z == val)
            return;

        this._transform.matrix3D._rawData[14] = val;

        this._transform.invalidatePosition();
    }

    public get scenePosition():Vector3D
	{
    	return this._transform.concatenatedMatrix3D.position;
	}

    /**
	 * 
     */
    constructor(position:Vector3D = null, transform:Transform = null)
    {
        super(transform);

        if (position) {
            this._transform.matrix3D._rawData[12] = position.x;
            this._transform.matrix3D._rawData[13] = position.y;
            this._transform.matrix3D._rawData[14] = position.z;

            this._transform.invalidatePosition();
		}

        this._fallOffFactor = 1/(this._fallOff*this._fallOff - this._radius*this._radius);
    }

    protected _createShadowMapper():PointShadowMapper
    {
        return new PointShadowMapper();
    }

    //TODO: properly cull pointlight calculations when falloff volume is outside the frustum
	// public _pUpdateSphereBounds():void
	// {
	// 	super._pUpdateSphereBounds();
    //
	// 	this._pSphereBounds.radius = this._fallOff;
	// }
    
	// public _getEntityProjectionMatrix(entity:IEntity, cameraTransform:Matrix3D, target:Matrix3D = null):Matrix3D
	// {
	// 	if (!target)
	// 		target = new Matrix3D();

    //     var m:Matrix3D = Matrix3D.CALCULATION_MATRIX;
    //     var pointAtMatrix:Matrix3D = Matrix3D.getPointAtMatrix(new Vector3D(), entity.getRenderSceneTransform(cameraTransform).position.subtract(this.transform.concatenatedMatrix3D.position), Vector3D.Y_AXIS);
    //     pointAtMatrix.invert();

	// 	m.copyFrom(entity.getRenderSceneTransform(cameraTransform));
    //     m.append(pointAtMatrix);

    //     var box:Box = entity.getBoxBounds();

    //     if (box == null)
    //         box = new Box();
            
	// 	var v1:Vector3D = m.deltaTransformVector(new Vector3D(box.left, box.bottom, box.front));
	// 	var v2:Vector3D = m.deltaTransformVector(new Vector3D(box.right, box.top, box.back));
	// 	var d1:number = v1.x*v1.x + v1.y*v1.y + v1.z*v1.z;
	// 	var d2:number = v2.x*v2.x + v2.y*v2.y + v2.z*v2.z;
	// 	var d:number = Math.sqrt(d1 > d2? d1 : d2);
	// 	var zMin:number;
	// 	var zMax:number;

	// 	var z:number = m._rawData[14];
	// 	zMin = z - d;
	// 	zMax = z + d;

	// 	var targetData:Float32Array = target._rawData;

	// 	targetData[5] = targetData[0] = zMin/d;
	// 	targetData[10] = zMax/(zMax - zMin);
	// 	targetData[11] = 1;
	// 	targetData[1] = targetData[2] = targetData[3] = targetData[4] = targetData[6] = targetData[7] = targetData[8] = targetData[9] = targetData[12] = targetData[13] = targetData[15] = 0;
	// 	targetData[14] = -zMin*targetData[10];
		
	// 	target.prepend(m);

	// 	return target;
	// }
}