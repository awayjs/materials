import {AbstractMethodError, ProjectionBase} from "@awayjs/core";

import {IRenderer, IView, IMapper} from "@awayjs/renderer";

import {TextureBase} from "../textures/TextureBase";
import {LightBase} from "../lights/LightBase";

import {ShadingMethodBase} from "../methods/ShadingMethodBase";

export class ShadowMapperBase extends ShadingMethodBase implements IMapper
{
    protected _textureMap:TextureBase;
	protected _size:number;
	protected _light:LightBase;
    protected _epsilon:number = .02;
    protected _alpha:number = 1;

	public autoUpdate:boolean = true;

    public get textureMap():TextureBase
    {
        return this._textureMap;
    }

    /**
     * The "transparency" of the shadows. This allows making shadows less strong.
     */
    public get alpha():number
    {
        return this._alpha;
    }

    public set alpha(value:number)
    {
        this._alpha = value;
    }

	public get light():LightBase
	{
		return this._light;
	}

	public set light(value:LightBase)
	{
		if (this._light == value)
			return;

		this._light = value;
	}

    /**
     * A small value to counter floating point precision errors when comparing values in the shadow map with the
     * calculated depth value. Increase this if shadow banding occurs, decrease it if the shadow seems to be too detached.
     */
    public get epsilon():number
    {
        return this._epsilon;
    }

    public set epsilon(value:number)
    {
        this._epsilon = value;
    }


    public get size():number
    {
        return this._size;
    }

    public set size(value:number)
    {
    	if (this._size == value)
    		return;

        this._size = value;

        this._updateSize();
    }

    public update(projection:ProjectionBase, view:IView, rootRenderer:IRenderer):void
    {
        this._updateProjection(projection);

        this._renderMap(view, rootRenderer);
    }

    protected _updateProjection(projection:ProjectionBase):void
    {
        throw new AbstractMethodError();
    }

    protected _renderMap(view:IView, rootRenderer:IRenderer):void
    {
        throw new AbstractMethodError();
    }

    protected _updateSize()
	{
		throw new AbstractMethodError();
	}

    public dispose():void
    {
        this._light = null;
    }
}