import {ImageBase} from "@awayjs/stage";

import {MaterialBase} from "./MaterialBase";
import {ImageTexture2D} from "./textures/ImageTexture2D";
import {TextureBase} from "./textures/TextureBase";

/**
 * BasicMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export class BasicMaterial extends MaterialBase
{
	public static assetType:string = "[materials BasicMaterial]";

    private _preserveAlpha:boolean = false;
    private _texture:TextureBase;

	/**
	 *
	 */
	public get assetType():string
	{
		return BasicMaterial.assetType;
	}

	/**
	 * Creates a new BasicMaterial object.
	 *
	 * @param texture The texture used for the material's albedo color.
	 * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
	 * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to false.
	 * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to false.
	 */
	constructor(image?:ImageBase, alpha?:number);
	constructor(color?:number, alpha?:number);
	constructor(imageColor:any = null, alpha:number = 1)
	{
		super(imageColor, alpha);

        //set a texture if an image is present
        if (imageColor instanceof ImageBase)
            this.texture = new ImageTexture2D();
	}

    /**
     * Indicates whether alpha should be preserved - defaults to false
     */
    public get preserveAlpha():boolean
    {
        return this._preserveAlpha;
    }
    public set preserveAlpha(value:boolean)
    {
        if (this._preserveAlpha == value)
            return;

        this._preserveAlpha = value;

        this.invalidate();
    }


    /**
     * The texture object to use for the albedo colour.
     */
    public get texture():TextureBase
    {
        return this._texture;
    }

    public set texture(value:TextureBase)
    {
        if (this._texture == value)
            return;

        if (this._texture)
            this.removeTexture(this._texture);

        this._texture = value;

        if (this._texture)
            this.addTexture(this._texture);

        this.invalidateTexture();
    }
}

import {DefaultRenderer, DepthRenderer, DistanceRenderer, MaterialUtils} from "@awayjs/renderer";

import {AssetEvent} from "@awayjs/core";

import {BlendMode} from "@awayjs/stage";

import {_Render_MaterialBase, _Render_ElementsBase} from "@awayjs/renderer";

import {BasicMaterialPass} from "./passes/BasicMaterialPass";
import {_Render_DepthMaterial, _Render_DistanceMaterial} from "./MaterialBase";

/**
 * RenderMaterialObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export class _Render_BasicMaterial extends _Render_MaterialBase
{
    private _basicMaterial:BasicMaterial;
    private _pass:BasicMaterialPass;


    constructor(material:BasicMaterial, renderElements:_Render_ElementsBase)
    {
        super(material, renderElements);

        this._basicMaterial = material;

        this._pAddPass(this._pass = new BasicMaterialPass(this, renderElements));
    }

    public onClear(event:AssetEvent):void
    {
        super.onClear(event);

        this._basicMaterial = null;
    }

    /**
     * @inheritDoc
     */
    public _pUpdateRender():void
    {
        super._pUpdateRender();

        this.requiresBlending = (this._basicMaterial.blendMode != BlendMode.NORMAL || this._basicMaterial.alphaBlending || (this._basicMaterial.colorTransform && this._basicMaterial.colorTransform.alphaMultiplier < 1));
        this._pass.preserveAlpha = this._basicMaterial.preserveAlpha;//this._pRequiresBlending;
        this._pass.shader.setBlendMode((this._basicMaterial.blendMode == BlendMode.NORMAL && this.requiresBlending)? BlendMode.LAYER : this._basicMaterial.blendMode);
        //this._pass.forceSeparateMVP = false;
    }
}

DefaultRenderer.registerMaterial(_Render_BasicMaterial, BasicMaterial);
DepthRenderer.registerMaterial(_Render_DepthMaterial, BasicMaterial);
DistanceRenderer.registerMaterial(_Render_DistanceMaterial, BasicMaterial);

MaterialUtils.setDefaultMaterialClass(BasicMaterial);