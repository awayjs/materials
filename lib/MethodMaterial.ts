import BlendMode					= require("awayjs-core/lib/data/BlendMode");
import Image2D						= require("awayjs-core/lib/data/Image2D");

import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import Camera						= require("awayjs-display/lib/entities/Camera");
import StaticLightPicker			= require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import IRender						= require("awayjs-display/lib/pool/IRender");
import Single2DTexture				= require("awayjs-display/lib/textures/Single2DTexture");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");

import RenderPool					= require("awayjs-renderergl/lib/render/RenderPool");

import MethodMaterialMode			= require("awayjs-methodmaterials/lib/MethodMaterialMode");
import AmbientBasicMethod			= require("awayjs-methodmaterials/lib/methods/AmbientBasicMethod");
import DiffuseBasicMethod			= require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
import EffectMethodBase				= require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
import NormalBasicMethod			= require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
import ShadowMapMethodBase			= require("awayjs-methodmaterials/lib/methods/ShadowMapMethodBase");
import SpecularBasicMethod			= require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
import MethodMaterialRender			= require("awayjs-methodmaterials/lib/render/MethodMaterialRender");

/**
 * MethodMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class MethodMaterial extends MaterialBase
{
	public static assetType:string = "[materials MethodMaterial]";

	private _effectMethods:Array<EffectMethodBase> = new Array<EffectMethodBase>();
	private _mode:string;

	private _ambientMethod:AmbientBasicMethod = new AmbientBasicMethod();
	private _shadowMethod:ShadowMapMethodBase;
	private _diffuseMethod:DiffuseBasicMethod = new DiffuseBasicMethod();
	private _normalMethod:NormalBasicMethod = new NormalBasicMethod();
	private _specularMethod:SpecularBasicMethod = new SpecularBasicMethod();


	private _depthCompareMode:string = ContextGLCompareMode.LESS_EQUAL;

	private static register = MethodMaterial.addRenderable();

	private static addRenderable()
	{
		RenderPool.registerClass(MethodMaterialRender, MethodMaterial);
	}

	/**
	 *
	 */
	public get assetType():string
	{
		return MethodMaterial.assetType;
	}

	/**
	 * Creates a new MethodMaterial object.
	 *
	 * @param texture The texture used for the material's albedo color.
	 * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
	 * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to false.
	 * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to false.
	 */
	constructor(texture?:Image2D, smooth?:boolean, repeat?:boolean, mipmap?:boolean);
	constructor(texture?:TextureBase, smooth?:boolean, repeat?:boolean, mipmap?:boolean);
	constructor(color?:number, alpha?:number);
	constructor(textureColor:any = null, smoothAlpha:any = null, repeat:boolean = false, mipmap:boolean = true)
	{
		super();

		this._mode = MethodMaterialMode.SINGLE_PASS;

		if (textureColor instanceof Image2D)
			textureColor = new Single2DTexture(textureColor);

		if (textureColor instanceof TextureBase) {
			this.texture = <TextureBase> textureColor;

			this.smooth = (smoothAlpha == null)? true : false;
			this.repeat = repeat;
			this.mipmap = mipmap;
		} else {
			this.color = (textureColor == null)? 0xFFFFFF : Number(textureColor);
			this.alpha = (smoothAlpha == null)? 1 : Number(smoothAlpha);
		}

		//add default methods owners
		this._ambientMethod.iAddOwner(this);
		this._diffuseMethod.iAddOwner(this);
		this._normalMethod.iAddOwner(this);
		this._specularMethod.iAddOwner(this);
	}


	public get mode():string
	{
		return this._mode;
	}

	public set mode(value:string)
	{
		if (this._mode == value)
			return;

		this._mode = value;

		this._pInvalidateRender();
	}

	/**
	 * The depth compare mode used to render the renderables using this material.
	 *
	 * @see away.stagegl.ContextGLCompareMode
	 */

	public get depthCompareMode():string
	{
		return this._depthCompareMode;
	}

	public set depthCompareMode(value:string)
	{
		if (this._depthCompareMode == value)
			return;

		this._depthCompareMode = value;

		this._pInvalidateRender();
	}

	/**
	 * The texture object to use for the ambient colour.
	 */
	public get diffuseTexture():TextureBase
	{
		return this._diffuseMethod.texture;
	}

	public set diffuseTexture(value:TextureBase)
	{
		this._diffuseMethod.texture = value;
	}

	/**
	 * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
	 */
	public get ambientMethod():AmbientBasicMethod
	{
		return this._ambientMethod;
	}

	public set ambientMethod(value:AmbientBasicMethod)
	{
		if (this._ambientMethod == value)
			return;

		if (value && this._ambientMethod)
			value.copyFrom(this._ambientMethod);

		if (this._ambientMethod)
			this._ambientMethod.iRemoveOwner(this);

		this._ambientMethod = value;

		if (this._ambientMethod)
			this._ambientMethod.iAddOwner(this);

		this._pInvalidateRender();
	}

	/**
	 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
	 */
	public get shadowMethod():ShadowMapMethodBase
	{
		return this._shadowMethod;
	}

	public set shadowMethod(value:ShadowMapMethodBase)
	{
		if (this._shadowMethod == value)
			return;

		if (value && this._shadowMethod)
			value.copyFrom(this._shadowMethod);

		if (this._shadowMethod)
			this._shadowMethod.iRemoveOwner(this);

		this._shadowMethod = value;

		if (this._shadowMethod)
			this._shadowMethod.iAddOwner(this);

		this._pInvalidateRender();
	}

	/**
	 * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
	 */
	public get diffuseMethod():DiffuseBasicMethod
	{
		return this._diffuseMethod;
	}

	public set diffuseMethod(value:DiffuseBasicMethod)
	{
		if (this._diffuseMethod == value)
			return;

		if (value && this._diffuseMethod)
			value.copyFrom(this._diffuseMethod);

		if (this._diffuseMethod)
			this._diffuseMethod.iRemoveOwner(this);

		this._diffuseMethod = value;

		if (this._diffuseMethod)
			this._diffuseMethod.iAddOwner(this);

		this._pInvalidateRender();
	}

	/**
	 * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
	 */
	public get specularMethod():SpecularBasicMethod
	{
		return this._specularMethod;
	}

	public set specularMethod(value:SpecularBasicMethod)
	{
		if (this._specularMethod == value)
			return;

		if (value && this._specularMethod)
			value.copyFrom(this._specularMethod);

		if (this._specularMethod)
			this._specularMethod.iRemoveOwner(this);

		this._specularMethod = value;

		if (this._specularMethod)
			this._specularMethod.iAddOwner(this);

		this._pInvalidateRender();
	}

	/**
	 * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
	 */
	public get normalMethod():NormalBasicMethod
	{
		return this._normalMethod;
	}

	public set normalMethod(value:NormalBasicMethod)
	{
		if (this._normalMethod == value)
			return;

		if (value && this._normalMethod)
			value.copyFrom(this._normalMethod);

		if (this._normalMethod)
			this._normalMethod.iRemoveOwner(this);

		this._normalMethod = value;

		if (this._normalMethod)
			this._normalMethod.iAddOwner(this);

		this._pInvalidateRender();
	}

	public get numEffectMethods():number
	{
		return this._effectMethods.length;
	}

	/**
	 * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
	 * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
	 * methods added prior.
	 */
	public addEffectMethod(method:EffectMethodBase)
	{
		method.iAddOwner(this);

		this._effectMethods.push(method);

		this._pInvalidateRender();
	}

	/**
	 * Returns the method added at the given index.
	 * @param index The index of the method to retrieve.
	 * @return The method at the given index.
	 */
	public getEffectMethodAt(index:number):EffectMethodBase
	{
		return this._effectMethods[index];
	}

	/**
	 * Adds an effect method at the specified index amongst the methods already added to the material. Effect
	 * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
	 * etc. The method will be applied to the result of the methods with a lower index.
	 */
	public addEffectMethodAt(method:EffectMethodBase, index:number)
	{
		method.iAddOwner(this);

		this._effectMethods.splice(index, 0, method);

		this._pInvalidateRender();
	}

	/**
	 * Removes an effect method from the material.
	 * @param method The method to be removed.
	 */
	public removeEffectMethod(method:EffectMethodBase)
	{
		method.iRemoveOwner(this);

		this._effectMethods.splice(this._effectMethods.indexOf(method), 1);

		this._pInvalidateRender();
	}

	/**
	 * The normal map to modulate the direction of the surface for each texel. The default normal method expects
	 * tangent-space normal maps, but others could expect object-space maps.
	 */
	public get normalMap():TextureBase
	{
		return this._normalMethod.normalMap;
	}

	public set normalMap(value:TextureBase)
	{
		this._normalMethod.normalMap = value;
	}

	/**
	 * A specular map that defines the strength of specular reflections for each texel in the red channel,
	 * and the gloss factor in the green channel. You can use Specular2DTexture if you want to easily set
	 * specular and gloss maps from grayscale images, but correctly authored images are preferred.
	 */
	public get specularMap():TextureBase
	{
		return this._specularMethod.texture;
	}

	public set specularMap(value:TextureBase)
	{
		this._specularMethod.texture = value;
	}

	/**
	 * The glossiness of the material (sharpness of the specular highlight).
	 */
	public get gloss():number
	{
		return this._specularMethod.gloss;
	}

	public set gloss(value:number)
	{
		this._specularMethod.gloss = value;
	}

	/**
	 * The strength of the ambient reflection.
	 */
	public get ambient():number
	{
		return this._ambientMethod.ambient;
	}

	public set ambient(value:number)
	{
		this._ambientMethod.ambient = value;
	}

	/**
	 * The overall strength of the specular reflection.
	 */
	public get specular():number
	{
		return this._specularMethod.specular;
	}

	public set specular(value:number)
	{
		this._specularMethod.specular = value;
	}

	/**
	 * The colour of the ambient reflection.
	 */
	public get ambientColor():number
	{
		return this._diffuseMethod.ambientColor;
	}

	public set ambientColor(value:number)
	{
		this._diffuseMethod.ambientColor = value;
	}

	/**
	 * The colour of the diffuse reflection.
	 */
	public get diffuseColor():number
	{
		return this._diffuseMethod.diffuseColor;
	}

	public set diffuseColor(value:number)
	{
		this._diffuseMethod.diffuseColor = value;
	}

	/**
	 * The colour of the specular reflection.
	 */
	public get specularColor():number
	{
		return this._specularMethod.specularColor;
	}

	public set specularColor(value:number)
	{
		this._specularMethod.specularColor = value;
	}
}

export = MethodMaterial;