import {AbstractMethodError, AssetBase, Transform, TransformEvent} from "@awayjs/core";

import {LightEvent} from "../events/LightEvent";
import {ShadowMapperBase} from "../mappers/ShadowMapperBase";

export class LightBase extends AssetBase
{
	protected _transform:Transform;
	
	private _color:number = 0xffffff;
	private _colorR:number = 1;
	private _colorG:number = 1;
	private _colorB:number = 1;

	private _ambientColor:number = 0xffffff;
	private _ambient:number = 0;
	private _specular:number = 1;
	private _diffuse:number = 1;

	private _shadowsEnabled:boolean = false;
	private _shadowMapper:ShadowMapperBase;
    private _onInvalidateConcatenatedMatrix3DDelegate:(event:TransformEvent) => void;

    public _ambientR:number = 0;
    public _ambientG:number = 0;
    public _ambientB:number = 0;

    public _specularR:number = 1;
    public _specularG:number = 1;
    public _specularB:number = 1;

    public _diffuseR:number = 1;
    public _diffuseG:number = 1;
    public _diffuseB:number = 1;

    public get transform():Transform
    {
        return this._transform;
    }

    public set transform(value:Transform)
    {
        if (this._transform == value)
            return;

        if (this._transform)
            this._transform.removeEventListener(TransformEvent.INVALIDATE_CONCATENATED_MATRIX3D, this._onInvalidateConcatenatedMatrix3DDelegate);


        this._transform = value;

        if (this._transform)
            this._transform.addEventListener(TransformEvent.INVALIDATE_CONCATENATED_MATRIX3D, this._onInvalidateConcatenatedMatrix3DDelegate);
    }

	public get shadowsEnabled():boolean
	{
		return this._shadowsEnabled;
	}

	public set shadowsEnabled(value:boolean)
	{
		if (this._shadowsEnabled == value)
			return;

		this._shadowsEnabled = value;

		if (value && this._shadowMapper == null) {
			this._shadowMapper = this._createShadowMapper();
            this._shadowMapper.light = this;
		} else if (!value) {
			this._shadowMapper.dispose();
			this._shadowMapper = null;
		}
		
		this.dispatchEvent(new LightEvent(LightEvent.CASTS_SHADOW_CHANGE));
	}

	public get specular():number
	{
		return this._specular;
	}

	public set specular(value:number)
	{
		if (value < 0)
			value = 0;

		this._specular = value;

		this._updateSpecular();
	}

	public get diffuse():number
	{
		return this._diffuse;
	}

	public set diffuse(value:number)
	{
		if (value < 0)
			value = 0;

		this._diffuse = value;

		this._updateDiffuse();
	}

	public get color():number
	{
		return this._color;
	}

	public set color(value:number)
	{
		this._color = value;
		this._colorR = ((this._color >> 16) & 0xff)/0xff;
		this._colorG = ((this._color >> 8) & 0xff)/0xff;
		this._colorB = (this._color & 0xff)/0xff;

		this._updateDiffuse();
		this._updateSpecular();
	}

	public get ambient():number
	{
		return this._ambient;
	}

	public set ambient(value:number)
	{
		if (value < 0)
			value = 0;
		else if (value > 1)
			value = 1;

		this._ambient = value;
		
		this._updateAmbient();
	}

	public get ambientColor():number
	{
		return this._ambientColor;
	}

	public set ambientColor(value:number)
	{
		if (this._ambientColor == value)
			return;
		
		this._ambientColor = value;
		
		this._updateAmbient();
	}

    public get shadowMapper():ShadowMapperBase
    {
    	this.shadowsEnabled = true; //ensure shadows are enabled on light

        return this._shadowMapper;
    }

    public set shadowMapper(value:ShadowMapperBase)
    {
    	if (this._shadowMapper == value)
			return;

        this._shadowMapper = value;

        this._shadowMapper.light = this;
    }

    constructor(transform:Transform = null)
    {
        super();

        this._onInvalidateConcatenatedMatrix3DDelegate = (event:TransformEvent) => this._onInvalidateConcatenatedMatrix3D(event);

        this.transform = transform || new Transform();
    }

	// public _getEntityProjectionMatrix(entity:IEntity, cameraTransform:Matrix3D, target:Matrix3D = null):Matrix3D
	// {
	// 	throw new AbstractMethodError();
	// }
	
    protected _createShadowMapper():ShadowMapperBase
    {
        throw new AbstractMethodError();
    }

	private _updateSpecular():void
	{
		this._specularR = this._colorR*this._specular;
		this._specularG = this._colorG*this._specular;
		this._specularB = this._colorB*this._specular;
	}

	private _updateDiffuse():void
	{
		this._diffuseR = this._colorR*this._diffuse;
		this._diffuseG = this._colorG*this._diffuse;
		this._diffuseB = this._colorB*this._diffuse;
	}
	
    private _updateAmbient():void
    {
        this._ambientR = ((this._ambientColor >> 16) & 0xff)/0xff*this._ambient;
        this._ambientG = ((this._ambientColor >> 8) & 0xff)/0xff*this._ambient;
        this._ambientB = (this._ambientColor & 0xff)/0xff*this._ambient;
    }

    protected _onInvalidateConcatenatedMatrix3D(event:TransformEvent):void
    {
		//do nothing - to be overridden
    }
}