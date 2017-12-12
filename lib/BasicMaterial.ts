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

import {GL_BasicMaterial} from "./GL_BasicMaterial";
import {GL_DepthMaterial} from "./GL_DepthMaterial";
import {GL_DistanceMaterial} from "./GL_DistanceMaterial";

DefaultRenderer.registerMaterial(GL_BasicMaterial, BasicMaterial);
DepthRenderer.registerMaterial(GL_DepthMaterial, BasicMaterial);
DistanceRenderer.registerMaterial(GL_DistanceMaterial, BasicMaterial);

MaterialUtils.setDefaultMaterialClass(BasicMaterial);