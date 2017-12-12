import {TextureBase, } from "../textures/TextureBase";
import {TextureProjector} from "../lights/TextureProjector";
import {TextureProjectorEvent} from "../events/TextureProjectorEvent";

import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * ProjectiveTextureMethod is a material method used to project a texture unto the surface of an object.
 * This can be used for various effects apart from acting like a normal projector, such as projecting fake shadows
 * unto a surface, the impact of light coming through a stained glass window, ...
 */
export class EffectProjectiveTextureMethod extends ShadingMethodBase
{
	public static OVERLAY:string = "overlay";
	public static MULTIPLY:string = "multiply";
	public static ADD:string = "add";
	public static MIX:string = "mix";
	
	private _projector:TextureProjector;
	private _mode:string;
	private _exposure:number;
	private _texture:TextureBase;
	private _onTextureChangedDelegate:(event:TextureProjectorEvent) => void;

	public static assetType:string = "[asset EffectProjectiveTextureMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectProjectiveTextureMethod.assetType;
	}
	
	/**
	 * 
	 */
	public get exposure():number
	{
		return this._exposure;
	}
	
	public set exposure(value:number)
	{
		if (this._exposure == value)
			return;
		
		this._exposure = value;
		
		this.invalidate();
	}

	/**
	 * The blend mode with which the texture is blended unto the object.
	 * ProjectiveTextureMethod.MULTIPLY can be used to project shadows. To prevent clamping, the texture's alpha should be white!
	 * ProjectiveTextureMethod.ADD can be used to project light, such as a slide projector or light coming through stained glass. To prevent clamping, the texture's alpha should be black!
	 * ProjectiveTextureMethod.MIX provides normal alpha blending. To prevent clamping, the texture's alpha should be transparent!
	 */
	public get mode():string
	{
		return this._mode;
	}
	
	public set mode(value:string)
	{
		if (this._mode == value)
			return;
		
		this._mode = value;
		
		this.invalidateShaderProgram();
	}
	
	/**
	 * The TextureProjector object that defines the projection properties as well as the texture.
	 *
	 * @see away3d.entities.TextureProjector
	 */
	public get projector():TextureProjector
	{
		return this._projector;
	}
	
	public set projector(value:TextureProjector)
	{
		if (this._projector == value)
			return;

		if (this._projector)
			this._projector.removeEventListener(TextureProjectorEvent.TEXTURE_CHANGE, this._onTextureChangedDelegate);

		this._projector = value;

		if (this._projector)
			this._projector.addEventListener(TextureProjectorEvent.TEXTURE_CHANGE, this._onTextureChangedDelegate);

		this.updateTexture();
	}
	
	/**
	 * Creates a new ProjectiveTextureMethod object.
	 *
	 * @param projector The TextureProjector object that defines the projection properties as well as the texture.
	 * @param mode The blend mode with which the texture is blended unto the surface.
	 *
	 * @see away3d.entities.TextureProjector
	 */
	constructor(projector:TextureProjector, mode:string = "multiply", exposure:number = 1)
	{
		super();

		this._onTextureChangedDelegate = (event:TextureProjectorEvent) => this._onTextureChanged(event);

		this._projector = projector;
		this._exposure = exposure;
		this._mode = mode;

		this._projector.addEventListener(TextureProjectorEvent.TEXTURE_CHANGE, this._onTextureChangedDelegate);
	}

	private _onTextureChanged(event:TextureProjectorEvent):void
	{
		this.updateTexture();
	}

	private updateTexture():void
	{
		if (this._texture)
			this.iRemoveTexture(this._texture);

		this._texture = (this._projector)? this._projector.texture : null;

		if (this._texture)
			this.iAddTexture(this._texture);

		this.invalidateShaderProgram();
	}
}