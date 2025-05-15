import { AssetEvent } from '@awayjs/core';

import { ContextGLCompareMode, ImageBase } from '@awayjs/stage';

import { DefaultRenderer, DepthRenderer, DistanceRenderer, ImageTexture2D } from '@awayjs/renderer';

import { AmbientBasicMethod } from './methods/AmbientBasicMethod';
import { DiffuseBasicMethod } from './methods/DiffuseBasicMethod';
import { DiffuseCompositeMethod } from './methods/DiffuseCompositeMethod';
import { MethodBase } from './methods/MethodBase';
import { NormalBasicMethod } from './methods/NormalBasicMethod';
import { ShadowMethodBase } from './methods/ShadowMethodBase';
import { SpecularBasicMethod } from './methods/SpecularBasicMethod';
import { SpecularCompositeMethod } from './methods/SpecularCompositeMethod';
import { LightPickerBase } from './lightpickers/LightPickerBase';

import { MaterialBase } from './MaterialBase';
import { MethodMaterialMode } from './MethodMaterialMode';

/**
 * MethodMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export class MethodMaterial extends MaterialBase {
	public static assetType: string = '[materials MethodMaterial]';

	private _effectMethods: Array<MethodBase> = new Array<MethodBase>();
	private _mode: string;

	private _enableLightFallOff: boolean = true;
	private _specularLightSources: number = 0x01;
	private _diffuseLightSources: number = 0x03;

	private _ambientMethod: AmbientBasicMethod = new AmbientBasicMethod();
	private _shadowMethod: ShadowMethodBase;
	private _diffuseMethod: DiffuseBasicMethod | DiffuseCompositeMethod = new DiffuseBasicMethod();
	private _normalMethod: NormalBasicMethod = new NormalBasicMethod();
	private _specularMethod: SpecularBasicMethod | SpecularCompositeMethod = new SpecularBasicMethod();
	public _pLightPicker: LightPickerBase;

	private _depthCompareMode: ContextGLCompareMode = ContextGLCompareMode.LESS_EQUAL;

	private _onLightChangeDelegate: (event: AssetEvent) => void;

	/**
	 *
	 */
	public get assetType(): string {
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
	constructor(image?: ImageBase, alpha?: number);
	constructor(color?: number, alpha?: number);
	constructor(imageColor: any = 0xFFFFFF, alpha: number = 1) {
		super(imageColor, alpha);

		this._mode = MethodMaterialMode.SINGLE_PASS;

		//add default methods owners
		this._ambientMethod.iAddOwner(this);
		this._diffuseMethod.iAddOwner(this);
		this._normalMethod.iAddOwner(this);
		this._specularMethod.iAddOwner(this);

		this._onLightChangeDelegate = (event: AssetEvent) => this.onLightsChange(event);

		//set a texture if an image is present
		if (imageColor instanceof ImageBase)
			this._ambientMethod.texture = new ImageTexture2D();
	}

	/**
	 * The light picker used by the material to provide lights to the material if it supports lighting.
	 *
	 * @see LightPickerBase
	 * @see StaticLightPicker
	 */
	public get lightPicker(): LightPickerBase {
		return this._pLightPicker;
	}

	public set lightPicker(value: LightPickerBase) {
		if (this._pLightPicker == value)
			return;

		if (this._pLightPicker)
			this._pLightPicker.removeEventListener(AssetEvent.INVALIDATE, this._onLightChangeDelegate);

		this._pLightPicker = value;

		if (this._pLightPicker)
			this._pLightPicker.addEventListener(AssetEvent.INVALIDATE, this._onLightChangeDelegate);

		this.invalidate();
	}

	/**
	 * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
	 * compatibility for constrained mode.
	 */
	public get enableLightFallOff(): boolean {
		return this._enableLightFallOff;
	}

	public set enableLightFallOff(value: boolean) {
		if (this._enableLightFallOff == value)
			return;

		this._enableLightFallOff = value;

		this.invalidatePasses();
	}

	/**
	 * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
	 * and/or light probes for diffuse reflections.
	 *
	 * @see away3d.materials.LightSources
	 */
	public get diffuseLightSources(): number {
		return this._diffuseLightSources;
	}

	public set diffuseLightSources(value: number) {
		if (this._diffuseLightSources == value)
			return;

		this._diffuseLightSources = value;

		this.invalidatePasses();
	}

	/**
	 * Define which light source types to use for specular reflections. This allows choosing between regular lights
	 * and/or light probes for specular reflections.
	 *
	 * @see away3d.materials.LightSources
	 */
	public get specularLightSources(): number {
		return this._specularLightSources;
	}

	public set specularLightSources(value: number) {
		if (this._specularLightSources == value)
			return;

		this._specularLightSources = value;

		this.invalidatePasses();
	}

	public get mode(): string {
		return this._mode;
	}

	public set mode(value: string) {
		if (this._mode == value)
			return;

		this._mode = value;

		this.invalidate();
	}

	/**
	 * The depth compare mode used to render the renderables using this material.
	 *
	 * @see away.stagegl.ContextGLCompareMode
	 */

	public get depthCompareMode(): ContextGLCompareMode {
		return this._depthCompareMode;
	}

	public set depthCompareMode(value: ContextGLCompareMode) {
		if (this._depthCompareMode == value)
			return;

		this._depthCompareMode = value;

		this.invalidate();
	}

	/**
	 * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
	 */
	public get ambientMethod(): AmbientBasicMethod {
		return this._ambientMethod;
	}

	public set ambientMethod(value: AmbientBasicMethod) {
		if (this._ambientMethod == value)
			return;

		if (this._ambientMethod)
			this._ambientMethod.iRemoveOwner(this);

		this._ambientMethod = value;

		if (this._ambientMethod)
			this._ambientMethod.iAddOwner(this);

		this.invalidate();
	}

	/**
	 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
	 */
	public get shadowMethod(): ShadowMethodBase {
		return this._shadowMethod;
	}

	public set shadowMethod(value: ShadowMethodBase) {
		if (this._shadowMethod == value)
			return;

		if (this._shadowMethod)
			this._shadowMethod.iRemoveOwner(this);

		this._shadowMethod = value;

		if (this._shadowMethod)
			this._shadowMethod.iAddOwner(this);

		this.invalidate();
	}

	/**
	 * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
	 */
	public get diffuseMethod(): DiffuseBasicMethod | DiffuseCompositeMethod {
		return this._diffuseMethod;
	}

	public set diffuseMethod(value: DiffuseBasicMethod | DiffuseCompositeMethod) {
		if (this._diffuseMethod == value)
			return;

		if (this._diffuseMethod)
			this._diffuseMethod.iRemoveOwner(this);

		this._diffuseMethod = value;

		if (this._diffuseMethod)
			this._diffuseMethod.iAddOwner(this);

		this.invalidate();
	}

	/**
	 * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
	 */
	public get specularMethod(): SpecularBasicMethod | SpecularCompositeMethod {
		return this._specularMethod;
	}

	public set specularMethod(value: SpecularBasicMethod | SpecularCompositeMethod) {
		if (this._specularMethod == value)
			return;

		if (this._specularMethod)
			this._specularMethod.iRemoveOwner(this);

		this._specularMethod = value;

		if (this._specularMethod)
			this._specularMethod.iAddOwner(this);

		this.invalidate();
	}

	/**
	 * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
	 */
	public get normalMethod(): NormalBasicMethod {
		return this._normalMethod;
	}

	public set normalMethod(value: NormalBasicMethod) {
		if (this._normalMethod == value)
			return;

		if (this._normalMethod)
			this._normalMethod.iRemoveOwner(this);

		this._normalMethod = value;

		if (this._normalMethod)
			this._normalMethod.iAddOwner(this);

		this.invalidate();
	}

	public get numEffectMethods(): number {
		return this._effectMethods.length;
	}

	/**
	 * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
	 * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
	 * methods added prior.
	 */
	public addEffectMethod(method: MethodBase): void {
		method.iAddOwner(this);

		this._effectMethods.push(method);

		this.invalidate();
	}

	/**
	 * Returns the method added at the given index.
	 * @param index The index of the method to retrieve.
	 * @return The method at the given index.
	 */
	public getEffectMethodAt(index: number): MethodBase {
		return this._effectMethods[index];
	}

	/**
	 * Adds an effect method at the specified index amongst the methods already added to the material. Effect
	 * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
	 * etc. The method will be applied to the result of the methods with a lower index.
	 */
	public addEffectMethodAt(method: MethodBase, index: number): void {
		method.iAddOwner(this);

		this._effectMethods.splice(index, 0, method);

		this.invalidate();
	}

	/**
	 * Removes an effect method from the material.
	 * @param method The method to be removed.
	 */
	public removeEffectMethod(method: MethodBase): void {
		method.iRemoveOwner(this);

		this._effectMethods.splice(this._effectMethods.indexOf(method), 1);

		this.invalidate();
	}

	/**
	 * Called when the light picker's configuration changed.
	 */
	private onLightsChange(event: AssetEvent): void {
		this.invalidate();
	}
}

import { BlendMode } from '@awayjs/stage';

import { _Render_MaterialBase, _Render_ElementsBase } from '@awayjs/renderer';

import { StaticLightPicker } from './lightpickers/StaticLightPicker';
import { MethodPassMode } from './passes/MethodPassMode';
import { MethodPass } from './passes/MethodPass';
import { _Render_DepthMaterial, _Render_DistanceMaterial } from './MaterialBase';
import { CacheRenderer } from '@awayjs/renderer';
/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
export class _Render_MethodMaterial extends _Render_MaterialBase {
	private _pass: MethodPass;
	private _casterLightPass: MethodPass;
	private _nonCasterLightPasses: Array<MethodPass>;

	/**
     * The maximum total number of lights provided by the light picker.
     */
	private get numLights(): number {
		return (<MethodMaterial> this._asset).lightPicker ? (<MethodMaterial> this._asset).lightPicker.numLightProbes + (<MethodMaterial> this._asset).lightPicker.numDirectionalLights + (<MethodMaterial> this._asset).lightPicker.numPointLights + (<MethodMaterial> this._asset).lightPicker.numCastingDirectionalLights + (<MethodMaterial> this._asset).lightPicker.numCastingPointLights : 0;
	}

	/**
     * The amount of lights that don't cast shadows.
     */
	private get numNonCasters(): number {
		return (<MethodMaterial> this._asset).lightPicker ? (<MethodMaterial> this._asset).lightPicker.numLightProbes + (<MethodMaterial> this._asset).lightPicker.numDirectionalLights + (<MethodMaterial> this._asset).lightPicker.numPointLights : 0;
	}

	public get lightPicker(): LightPickerBase {
		return (<MethodMaterial> this._asset).lightPicker;
	}

	/**
     * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
     * compatibility for constrained mode.
     */
	public get enableLightFallOff(): boolean {
		return (<MethodMaterial> this._asset).enableLightFallOff;
	}

	/**
     * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
     * and/or light probes for diffuse reflections.
     *
     * @see away3d.materials.LightSources
     */
	public get diffuseLightSources(): number {
		return (<MethodMaterial> this._asset).diffuseLightSources;
	}

	/**
     * Define which light source types to use for specular reflections. This allows choosing between regular lights
     * and/or light probes for specular reflections.
     *
     * @see away3d.materials.LightSources
     */
	public get specularLightSources(): number {
		return (<MethodMaterial> this._asset).specularLightSources;
	}

	/**
     * Creates a new CompiledPass object.
     *
     * @param material The material to which this pass belongs.
     */
	public init(material: MethodMaterial, renderElements: _Render_ElementsBase): void {
		super.init(material, renderElements);

		(<MethodMaterial> this._asset) = material;
	}

	/**
     * @inheritDoc
     */
	public _pUpdateRender(): void {
		super._pUpdateRender();

		this.initPasses();

		this.setBlendAndCompareModes();

		this._pClearPasses();

		if ((<MethodMaterial> this._asset).mode == MethodMaterialMode.MULTI_PASS) {
			if (this._casterLightPass)
				this._pAddPass(this._casterLightPass);

			if (this._nonCasterLightPasses)
				for (let i: number = 0; i < this._nonCasterLightPasses.length; ++i)
					this._pAddPass(this._nonCasterLightPasses[i]);
		}

		if (this._pass)
			this._pAddPass(this._pass);
	}

	/**
     * Initializes all the passes and their dependent passes.
     */
	private initPasses(): void {
		// let the effects pass handle everything if there are no lights, when there are effect methods applied
		// after shading, or when the material mode is single pass.
		if (this.numLights == 0 || (<MethodMaterial> this._asset).numEffectMethods > 0 || (<MethodMaterial> this._asset).mode == MethodMaterialMode.SINGLE_PASS)
			this.initEffectPass();
		else if (this._pass)
			this.removeEffectPass();

		// only use a caster light pass if shadows need to be rendered
		if ((<MethodMaterial> this._asset).shadowMethod && (<MethodMaterial> this._asset).mode == MethodMaterialMode.MULTI_PASS)
			this.initCasterLightPass();
		else if (this._casterLightPass)
			this.removeCasterLightPass();

		// only use non caster light passes if there are lights that don't cast
		if (this.numNonCasters > 0 && (<MethodMaterial> this._asset).mode == MethodMaterialMode.MULTI_PASS)
			this.initNonCasterLightPasses();
		else if (this._nonCasterLightPasses)
			this.removeNonCasterLightPasses();
	}

	/**
     * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
     */
	private setBlendAndCompareModes(): void {
		const forceSeparateMVP: boolean = Boolean(this._casterLightPass || this._pass);

		// caster light pass is always first if it exists, hence it uses normal blending
		if (this._casterLightPass) {
			this._casterLightPass.forceSeparateMVP = forceSeparateMVP;
			this._casterLightPass.shader.setBlendMode(BlendMode.NORMAL);
			this._casterLightPass.shader.depthCompareMode = (<MethodMaterial> this._asset).depthCompareMode;
		}

		if (this._nonCasterLightPasses) {
			let firstAdditiveIndex: number = 0;

			// if there's no caster light pass, the first non caster light pass will be the first
			// and should use normal blending
			if (!this._casterLightPass) {
				this._nonCasterLightPasses[0].forceSeparateMVP = forceSeparateMVP;
				this._nonCasterLightPasses[0].shader.setBlendMode(BlendMode.NORMAL);
				this._nonCasterLightPasses[0].shader.depthCompareMode = (<MethodMaterial> this._asset).depthCompareMode;
				firstAdditiveIndex = 1;
			}

			// all lighting passes following the first light pass should use additive blending
			for (let i: number = firstAdditiveIndex; i < this._nonCasterLightPasses.length; ++i) {
				this._nonCasterLightPasses[i].forceSeparateMVP = forceSeparateMVP;
				this._nonCasterLightPasses[i].shader.setBlendMode(BlendMode.ADD);
				this._nonCasterLightPasses[i].shader.depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
			}
		}

		if (this._casterLightPass || this._nonCasterLightPasses) {
			//cannot be blended by blendmode property if multipass enabled
			this.requiresBlending = false;

			// there are light passes, so this should be blended in
			if (this._pass) {
				this._pass.mode = MethodPassMode.EFFECTS;
				this._pass.forceSeparateMVP = forceSeparateMVP;
				this._pass.shader.depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
				this._pass.shader.setBlendMode(BlendMode.LAYER);
			}

		} else if (this._pass) {
			this.requiresBlending = ((<MethodMaterial> this._asset).blendMode != BlendMode.NORMAL || (<MethodMaterial> this._asset).alphaBlending || ((<MethodMaterial> this._asset).colorTransform && (<MethodMaterial> this._asset).colorTransform.alphaMultiplier < 1));
			// effects pass is the only pass, so it should just blend normally
			this._pass.mode = MethodPassMode.SUPER_SHADER;
			this._pass.preserveAlpha = this.requiresBlending;
			this._pass.forceSeparateMVP = false;
			this._pass.colorTransform = (<MethodMaterial> this._asset).colorTransform;
			this._pass.shader.setBlendMode(((<MethodMaterial> this._asset).blendMode == BlendMode.NORMAL && this.requiresBlending) ? BlendMode.LAYER : (<MethodMaterial> this._asset).blendMode);
			this._pass.shader.depthCompareMode = (<MethodMaterial> this._asset).depthCompareMode;
		}
	}

	private initCasterLightPass(): void {

		if (this._casterLightPass == null)
			this._casterLightPass = new MethodPass(MethodPassMode.LIGHTING, this, this.renderElements);

		this._casterLightPass.lightPicker = new StaticLightPicker([(<MethodMaterial> this._asset).shadowMethod.castingLight]);
		this._casterLightPass.shadowMethod = (<MethodMaterial> this._asset).shadowMethod;
		this._casterLightPass.diffuseMethod = (<MethodMaterial> this._asset).diffuseMethod;
		this._casterLightPass.ambientMethod = (<MethodMaterial> this._asset).ambientMethod;
		this._casterLightPass.normalMethod = (<MethodMaterial> this._asset).normalMethod;
		this._casterLightPass.specularMethod = (<MethodMaterial> this._asset).specularMethod;
	}

	private removeCasterLightPass(): void {
		this._casterLightPass.dispose();
		this._pRemovePass(this._casterLightPass);
		this._casterLightPass = null;
	}

	private initNonCasterLightPasses(): void {
		this.removeNonCasterLightPasses();
		let pass: MethodPass;
		let numDirLights: number = (<MethodMaterial> this._asset).lightPicker.numDirectionalLights;
		let numPointLights: number = (<MethodMaterial> this._asset).lightPicker.numPointLights;
		const numLightProbes: number = (<MethodMaterial> this._asset).lightPicker.numLightProbes;
		let dirLightOffset: number = 0;
		let pointLightOffset: number = 0;
		let probeOffset: number = 0;

		if (!this._casterLightPass) {
			numDirLights += (<MethodMaterial> this._asset).lightPicker.numCastingDirectionalLights;
			numPointLights += (<MethodMaterial> this._asset).lightPicker.numCastingPointLights;
		}

		this._nonCasterLightPasses = new Array<MethodPass>();

		while (dirLightOffset < numDirLights || pointLightOffset < numPointLights || probeOffset < numLightProbes) {
			pass = new MethodPass(MethodPassMode.LIGHTING, this, this.renderElements);
			pass.includeCasters = (<MethodMaterial> this._asset).shadowMethod == null;
			pass.directionalLightsOffset = dirLightOffset;
			pass.pointLightsOffset = pointLightOffset;
			pass.lightProbesOffset = probeOffset;
			pass.lightPicker = (<MethodMaterial> this._asset).lightPicker;
			pass.diffuseMethod = (<MethodMaterial> this._asset).diffuseMethod;
			pass.ambientMethod = (<MethodMaterial> this._asset).ambientMethod;
			pass.normalMethod = (<MethodMaterial> this._asset).normalMethod;
			pass.specularMethod = (<MethodMaterial> this._asset).specularMethod;
			this._nonCasterLightPasses.push(pass);

			dirLightOffset += pass.numDirectionalLights;
			pointLightOffset += pass.numPointLights;
			probeOffset += pass.numLightProbes;
		}
	}

	private removeNonCasterLightPasses(): void {
		if (!this._nonCasterLightPasses)
			return;

		for (let i: number = 0; i < this._nonCasterLightPasses.length; ++i)
			this._pRemovePass(this._nonCasterLightPasses[i]);

		this._nonCasterLightPasses = null;
	}

	private removeEffectPass(): void {
		if (this._pass.ambientMethod != (<MethodMaterial> this._asset).ambientMethod)
			this._pass.ambientMethod.dispose();

		if (this._pass.diffuseMethod != (<MethodMaterial> this._asset).diffuseMethod)
			this._pass.diffuseMethod.dispose();

		if (this._pass.specularMethod != (<MethodMaterial> this._asset).specularMethod)
			this._pass.specularMethod.dispose();

		if (this._pass.normalMethod != (<MethodMaterial> this._asset).normalMethod)
			this._pass.normalMethod.dispose();

		this._pRemovePass(this._pass);
		this._pass = null;
	}

	private initEffectPass(): void {
		if (this._pass == null)
			this._pass = new MethodPass(MethodPassMode.SUPER_SHADER, this, this.renderElements);

		if ((<MethodMaterial> this._asset).mode == MethodMaterialMode.SINGLE_PASS) {
			this._pass.ambientMethod = (<MethodMaterial> this._asset).ambientMethod;
			this._pass.diffuseMethod = (<MethodMaterial> this._asset).diffuseMethod;
			this._pass.specularMethod = (<MethodMaterial> this._asset).specularMethod;
			this._pass.normalMethod = (<MethodMaterial> this._asset).normalMethod;
			this._pass.shadowMethod = (<MethodMaterial> this._asset).shadowMethod;
		} else if ((<MethodMaterial> this._asset).mode == MethodMaterialMode.MULTI_PASS) {
			if (this.numLights == 0) {
				this._pass.ambientMethod = (<MethodMaterial> this._asset).ambientMethod;
			} else {
				this._pass.ambientMethod = null;
			}

			this._pass.preserveAlpha = false;
			this._pass.normalMethod = (<MethodMaterial> this._asset).normalMethod;
		}

		//update effect methods
		let i: number = 0;
		let effectMethod: MethodBase;
		const len: number = Math.max((<MethodMaterial> this._asset).numEffectMethods, this._pass.numEffectMethods);

		while (i < len) {
			effectMethod = (<MethodMaterial> this._asset).getEffectMethodAt(i);
			if (effectMethod != this._pass.getEffectMethodAt(i)) {
				this._pass.removeEffectMethodAt(i);

				if (effectMethod != null) {
					if (i < this._pass.numEffectMethods)
						this._pass.addEffectMethodAt(effectMethod, i);
					else
						this._pass.addEffectMethod(effectMethod);
				}
			}

			i++;
		}
	}

	/**
     * @inheritDoc
     */
	public onClear(event: AssetEvent): void {
		super.onClear(event);

		this._pass = null;
		this._casterLightPass = null;
		this._nonCasterLightPasses = null;
	}
}

CacheRenderer.registerMaterial(_Render_MethodMaterial, MethodMaterial);
DefaultRenderer.registerMaterial(_Render_MethodMaterial, MethodMaterial);
DepthRenderer.registerMaterial(_Render_DepthMaterial, MethodMaterial);
DistanceRenderer.registerMaterial(_Render_DistanceMaterial, MethodMaterial);