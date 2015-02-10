import Texture2DBase				= require("awayjs-core/lib/textures/Texture2DBase");

import BlendMode					= require("awayjs-core/lib/base/BlendMode");
import Camera						= require("awayjs-display/lib/entities/Camera");
import StaticLightPicker			= require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import IRenderObject				= require("awayjs-display/lib/pool/IRenderObject");

import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");

import AmbientBasicMethod			= require("awayjs-methodmaterials/lib/methods/AmbientBasicMethod");
import DiffuseBasicMethod			= require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
import EffectMethodBase				= require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
import NormalBasicMethod			= require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
import ShadowMapMethodBase			= require("awayjs-methodmaterials/lib/methods/ShadowMapMethodBase");
import SpecularBasicMethod			= require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
import MethodMaterialMode			= require("awayjs-methodmaterials/lib/MethodMaterialMode");

import MethodRenderablePool			= require("awayjs-methodmaterials/lib/pool/MethodRenderablePool");

/**
 * MethodMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class MethodMaterial extends MaterialBase
{
	private _effectMethods:Array<EffectMethodBase> = new Array<EffectMethodBase>();
	private _mode:string;

	private _ambientMethod:AmbientBasicMethod = new AmbientBasicMethod();
	private _shadowMethod:ShadowMapMethodBase;
	private _diffuseMethod:DiffuseBasicMethod = new DiffuseBasicMethod();
	private _normalMethod:NormalBasicMethod = new NormalBasicMethod();
	private _specularMethod:SpecularBasicMethod = new SpecularBasicMethod();


	private _depthCompareMode:string = ContextGLCompareMode.LESS_EQUAL;

	/**
	 * Creates a new MethodMaterial object.
	 *
	 * @param texture The texture used for the material's albedo color.
	 * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
	 * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to false.
	 * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to false.
	 */
	constructor(texture?:Texture2DBase, smooth?:boolean, repeat?:boolean, mipmap?:boolean);
	constructor(color?:number, alpha?:number);
	constructor(textureColor:any = null, smoothAlpha:any = null, repeat:boolean = false, mipmap:boolean = true)
	{
		super();

		this._mode = MethodMaterialMode.SINGLE_PASS;

		if (textureColor instanceof Texture2DBase) {
			this.texture = <Texture2DBase> textureColor;

			this.smooth = (smoothAlpha == null)? true : false;
			this.repeat = repeat;
			this.mipmap = mipmap;
		} else {
			this.color = (textureColor == null)? 0xFFFFFF : Number(textureColor);
			this.alpha = (smoothAlpha == null)? 1 : Number(smoothAlpha);
		}
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

		this._pInvalidateRenderObject();
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

		this._pInvalidateRenderObject();
	}

	/**
	 * The texture object to use for the ambient colour.
	 */
	public get diffuseTexture():Texture2DBase
	{
		return this._diffuseMethod.texture;
	}

	public set diffuseTexture(value:Texture2DBase)
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

		this._ambientMethod = value;

		this._pInvalidateRenderObject();
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

		this._shadowMethod = value;

		this._pInvalidateRenderObject();
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

		this._diffuseMethod = value;

		this._pInvalidateRenderObject();
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

		this._specularMethod = value;

		this._pInvalidateRenderObject();
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

		this._normalMethod = value;

		this._pInvalidateRenderObject();
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
		this._effectMethods.push(method);

		this._pInvalidateRenderObject();
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
		this._effectMethods.splice(index, 0, method);

		this._pInvalidateRenderObject();
	}

	/**
	 * Removes an effect method from the material.
	 * @param method The method to be removed.
	 */
	public removeEffectMethod(method:EffectMethodBase)
	{
		this._effectMethods.splice(this._effectMethods.indexOf(method), 1);

		this._pInvalidateRenderObject();
	}

	/**
	 * The normal map to modulate the direction of the surface for each texel. The default normal method expects
	 * tangent-space normal maps, but others could expect object-space maps.
	 */
	public get normalMap():Texture2DBase
	{
		return this._normalMethod.normalMap;
	}

	public set normalMap(value:Texture2DBase)
	{
		this._normalMethod.normalMap = value;
	}

	/**
	 * A specular map that defines the strength of specular reflections for each texel in the red channel,
	 * and the gloss factor in the green channel. You can use SpecularBitmapTexture if you want to easily set
	 * specular and gloss maps from grayscale images, but correctly authored images are preferred.
	 */
	public get specularMap():Texture2DBase
	{
		return this._specularMethod.texture;
	}

	public set specularMap(value:Texture2DBase)
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

	/**
	 *
	 * @param renderer
	 *
	 * @internal
	 */
	public getRenderObject(renderablePool:MethodRenderablePool):IRenderObject
	{
		return renderablePool.getMethodRenderObject(this);
	}
}

export = MethodMaterial;