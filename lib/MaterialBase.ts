import { ColorTransform, AssetEvent, AssetBase } from '@awayjs/core';

import { BlendMode, ImageBase } from '@awayjs/stage';

import { IMaterial, MaterialEvent, Style, StyleEvent, TextureBase } from '@awayjs/renderer';

/**
 * MaterialBase forms an abstract base class for any material.
 * A material consists of several passes, each of which constitutes at least one render call. Several passes could
 * be used for special effects (render lighting for many lights in several passes, render an outline in a separate
 * pass) or to provide additional render-to-texture passes (rendering diffuse light to texture for texture-space
 * subsurface scattering, or rendering a depth map for specialized self-shadowing).
 *
 * Away3D provides default materials trough SinglePassMaterialBase and TriangleMaterial, which use modular
 * methods to build the shader code. MaterialBase can be extended to build specific and high-performant custom
 * shaders, or entire new material frameworks.
*/
export class MaterialBase extends AssetBase implements IMaterial {
	private _textures: Array<TextureBase> = new Array<TextureBase>();
	private _colorTransform: ColorTransform;
	private _pUseColorTransform: boolean = false;
	private _alphaBlending: boolean = false;
	private _alpha: number = 1;

	public _pAlphaThreshold: number = 0;
	public _pAnimateUVs: boolean = false;
	private _onInvalidatePropertiesDelegate: (event: StyleEvent) => void;
	private _style: Style = new Style();

	/**
	 * An object to contain any extra data.
	 */
	public extra: Object;

	/**
	 * A value that can be used by materials that only work with a given type of renderer. The renderer can test the
	 * classification to choose which render path to use. For example, a deferred material could set this value so
	 * that the deferred renderer knows not to take the forward rendering path.
	 *
	 * @private
	 */
	public _iClassification: string;

	public _iBaseScreenPassIndex: number = 0;

	private _bothSides: boolean = false; // update

	public _pBlendMode: string = BlendMode.NORMAL;

	private _imageRect: boolean = false;
	private _curves: boolean = false;

	private _onTextureInvalidateDelegate: (event: AssetEvent) => void;

	/**
	 * Creates a new MaterialBase object.
	 */
	constructor(image?: ImageBase, alpha?: number);
	constructor(color?: number, alpha?: number);
	constructor(imageColor: any = 0xFFFFFF, alpha: number = 1) {
		super();

		this._onInvalidatePropertiesDelegate = (event: StyleEvent) => this._onInvalidateProperties(event);
		this._style.addEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);

		if (imageColor instanceof ImageBase)
			this._style.image = <ImageBase> imageColor;
		else
			this._style.color = Number(imageColor);

		this.alpha = alpha;

		this._onTextureInvalidateDelegate = (event: AssetEvent) => this.onTextureInvalidate(event);
	}

	/**
	 * The alpha of the surface.
	 */
	public get alpha(): number {
		return this._alpha;
	}

	public set alpha(value: number) {
		if (value > 1)
			value = 1;
		else if (value < 0)
			value = 0;

		if (this._alpha == value)
			return;

		this._alpha = value;

		if (this._colorTransform == null)
			this._colorTransform = new ColorTransform();

		this._colorTransform.alphaMultiplier = value;

		this.invalidate();
	}

	/**
	 * The ColorTransform object to transform the colour of the material with. Defaults to null.
	 */
	public get colorTransform(): ColorTransform {
		return this._colorTransform;
	}

	public set colorTransform(value: ColorTransform) {
		this._colorTransform = value;

		this.invalidate();
	}

	/**
	 * Indicates whether or not the material has transparency. If binary transparency is sufficient, for
	 * example when using textures of foliage, consider using alphaThreshold instead.
	 */
	public get alphaBlending(): boolean {
		return this._alphaBlending;
	}

	public set alphaBlending(value: boolean) {
		if (this._alphaBlending == value)
			return;

		this._alphaBlending = value;

		this.invalidate();
	}

	/**
	 * Indicates whether material should use curves. Defaults to false.
	 */
	public get curves(): boolean {
		return this._curves;
	}

	public set curves(value: boolean) {
		if (this._curves == value)
			return;

		this._curves = value;

		this.invalidatePasses();
	}

	/**
	 * Indicates whether or not any used textures should use an atlas. Defaults to false.
	 */
	public get imageRect(): boolean {
		return this._imageRect;
	}

	public set imageRect(value: boolean) {
		if (this._imageRect == value)
			return;

		this._imageRect = value;

		this.invalidatePasses();
	}

	/**
	 * The style used to render the current TriangleGraphic. If set to null, its parent Sprite's style will be used instead.
	 */
	public get style(): Style {
		return this._style;
	}

	public set style(value: Style) {
		if (this._style == value)
			return;

		if (this._style)
			this._style.removeEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);

		this._style = value;

		if (this._style)
			this._style.addEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);

		this.invalidatePasses();
	}

	/**
	 * Specifies whether or not the UV coordinates should be animated using a transformation matrix.
	 */
	public get animateUVs(): boolean {
		return this._pAnimateUVs;
	}

	public set animateUVs(value: boolean) {
		if (this._pAnimateUVs == value)
			return;

		this._pAnimateUVs = value;

		this.invalidatePasses();
	}

	/**
	 * Specifies whether or not the UV coordinates should be animated using a transformation matrix.
	 */
	public get useColorTransform(): boolean {
		return this._pUseColorTransform;
	}

	public set useColorTransform(value: boolean) {
		if (this._pUseColorTransform == value)
			return;

		this._pUseColorTransform = value;

		this.invalidatePasses();
	}

	/**
	 * Defines whether or not the material should cull triangles facing away from the camera.
	 */
	public get bothSides(): boolean {
		return this._bothSides;
	}

	public set bothSides(value: boolean) {
		if (this._bothSides == value)
			return;

		this._bothSides = value;

		this.invalidatePasses();
	}

	/**
	 * The blend mode to use when drawing this renderable. The following blend modes are supported:
	 * <ul>
	 * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
	 * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
	 * <li>BlendMode.MULTIPLY</li>
	 * <li>BlendMode.ADD</li>
	 * <li>BlendMode.ALPHA</li>
	 * </ul>
	 */
	public get blendMode(): string {
		return this._pBlendMode;
	}

	public set blendMode(value: string) {
		if (this._pBlendMode == value)
			return;

		this._pBlendMode = value;

		this.invalidate();
	}

	/**
	 * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
	 * invisible or entirely opaque, often used with textures for foliage, etc.
	 * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
	 */
	public get alphaThreshold(): number {
		return this._pAlphaThreshold;
	}

	public set alphaThreshold(value: number) {
		if (value < 0)
			value = 0;
		else if (value > 1)
			value = 1;

		if (this._pAlphaThreshold == value)
			return;

		this._pAlphaThreshold = value;

		this.invalidatePasses();
	}

	public getNumTextures(): number {
		return this._textures.length;
	}

	public getTextureAt(index: number): TextureBase {
		return this._textures[index];
	}

	public dispose() {
		this.clear();
	}

	/**
	 * Marks the shader programs for all passes as invalid, so they will be recompiled before the next use.
	 *
	 * @private
	 */
	public invalidatePasses(): void {
		this.dispatchEvent(new MaterialEvent(MaterialEvent.INVALIDATE_PASSES, this));
	}

	public invalidateTextures(): void {
		this.dispatchEvent(new MaterialEvent(MaterialEvent.INVALIDATE_TEXTURES, this));
	}

	public addTextureAt(texture: TextureBase, index: number): void {
		const i: number = this._textures.indexOf(texture);

		if (i == index)
			return;
		else if (i != -1)
			this._textures.splice(i, 1);

		this._textures.splice(index, 0, texture);

		texture.addEventListener(AssetEvent.INVALIDATE, this._onTextureInvalidateDelegate);

		this.onTextureInvalidate();
	}

	public addTexture(texture: TextureBase): void {
		if (this._textures.indexOf(texture) != -1)
			return;

		this._textures.push(texture);

		texture.addEventListener(AssetEvent.INVALIDATE, this._onTextureInvalidateDelegate);

		this.onTextureInvalidate();
	}

	public removeTexture(texture: TextureBase): void {
		this._textures.splice(this._textures.indexOf(texture), 1);

		texture.removeEventListener(AssetEvent.INVALIDATE, this._onTextureInvalidateDelegate);

		this.onTextureInvalidate();
	}

	private onTextureInvalidate(event: AssetEvent = null): void {
		this.invalidatePasses();

		this.invalidateTextures();
	}

	private _onInvalidateProperties(event: StyleEvent): void {
		this.invalidatePasses();

		this.invalidateTextures();
	}
}

import { ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement } from '@awayjs/stage';

import { _Render_MaterialPassBase, _Render_ElementsBase, _Render_RenderableBase, ShaderBase, _Shader_TextureBase, IPass, _Render_MaterialBase, PassEvent } from '@awayjs/renderer';

/**
 * _Render_DepthMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export class _Render_DepthMaterial extends _Render_MaterialPassBase {
	private _fragmentConstantsIndex: number;
	private _shaderTexture: _Shader_TextureBase;

	/**
     *
     * @param pool
     * @param surface
     * @param elementsClass
     * @param stage
     */
	constructor(material: MaterialBase, renderElements: _Render_ElementsBase) {
		super(material, renderElements);

		this._shader = new ShaderBase(renderElements, this, this, this._stage);

		this._pAddPass(this);

		this.invalidate();
	}

	public invalidate(): void {
		super.invalidate();
		const texture: TextureBase = (<MaterialBase> this._material).getTextureAt(0);
		this._shaderTexture = texture ? texture.getAbstraction<_Shader_TextureBase>(this._shader) : null;
	}

	public _includeDependencies(shader: ShaderBase): void {
		super._includeDependencies(shader);

		shader.projectionDependencies++;

		if (shader.alphaThreshold > 0)
			shader.uvDependencies++;
	}

	public _initConstantData(): void {
		const index: number = this._fragmentConstantsIndex;
		const data: Float32Array = this._shader.fragmentConstantData;
		data[index] = 1.0;
		data[index + 1] = 255.0;
		data[index + 2] = 65025.0;
		data[index + 3] = 16581375.0;
		data[index + 4] = 1.0 / 255.0;
		data[index + 5] = 1.0 / 255.0;
		data[index + 6] = 1.0 / 255.0;
		data[index + 7] = 0.0;
	}

	/**
     * @inheritDoc
     */
	public _getFragmentCode(registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string {
		let code: string = '';
		const targetReg: ShaderRegisterElement = sharedRegisters.shadedTarget;
		const dataReg1: ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		const dataReg2: ShaderRegisterElement = registerCache.getFreeFragmentConstant();

		this._fragmentConstantsIndex = dataReg1.index * 4;

		const temp1: ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp1, 1);
		const temp2: ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp2, 1);

		code += 'div ' + temp1 + ', ' + sharedRegisters.projectionFragment + ', ' + sharedRegisters.projectionFragment + '.w\n' + //"sub ft2.z, fc0.x, ft2.z\n" +    //invert
            'mul ' + temp1 + ', ' + dataReg1 + ', ' + temp1 + '.z\n' +
            'frc ' + temp1 + ', ' + temp1 + '\n' +
            'mul ' + temp2 + ', ' + temp1 + '.yzww, ' + dataReg2 + '\n';

		//codeF += "mov ft1.w, fc1.w	\n" +
		//    "mov ft0.w, fc0.x	\n";

		if (this._shaderTexture && this._shader.alphaThreshold > 0) {

			const albedo: ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
			code += this._shaderTexture._getFragmentCode(albedo, registerCache, sharedRegisters, sharedRegisters.uvVarying);

			const cutOffReg: ShaderRegisterElement = registerCache.getFreeFragmentConstant();

			code += 'sub ' + albedo + '.w, ' + albedo + '.w, ' + cutOffReg + '.x\n' +
                'kil ' + albedo + '.w\n';
		}

		code += 'sub ' + targetReg + ', ' + temp1 + ', ' + temp2 + '\n';
		//DEBUG OPTION: MAKE DEPTHTEXTURES VISIBLE
		//code += "sub " + targetReg + ".xyz, " + temp1 + ".xyz, " + temp2 + ".xyz\n";
		//code += "mov " + targetReg + ".w, " + dataReg1 + ".x\n";

		registerCache.removeFragmentTempUsage(temp1);
		registerCache.removeFragmentTempUsage(temp2);

		return code;
	}

	/**
     * @inheritDoc
     */
	public _activate(): void {
		super._activate();

		if (this._shaderTexture && this._shader.alphaThreshold > 0) {
			this._shaderTexture.activate();

			this._shader.fragmentConstantData[this._fragmentConstantsIndex + 8] = this._shader.alphaThreshold;
		}
	}
}

/**
 * DistanceRender is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
 * This is used to render omnidirectional shadow maps.
 */
export class _Render_DistanceMaterial extends _Render_MaterialPassBase {
	private _shaderTexture: _Shader_TextureBase;
	private _fragmentConstantsIndex: number;

	/**
     * Creates a new DistanceRender object.
     *
     * @param material The material to which this pass belongs.
     */
	constructor(material: MaterialBase, renderElements: _Render_ElementsBase) {
		super(material, renderElements);

		this._shader = new ShaderBase(renderElements, this, this, this._stage);

		this._pAddPass(this);

		this.invalidate();
	}

	public invalidate(): void {
		super.invalidate();
		const texture: TextureBase = (<MaterialBase> this._material).getTextureAt(0);
		this._shaderTexture = texture ? texture.getAbstraction<_Shader_TextureBase>(this._shader) : null;
	}

	/**
     * Initializes the unchanging constant data for this material.
     */
	public _initConstantData(): void {
		const index: number = this._fragmentConstantsIndex;
		const data: Float32Array = this._shader.fragmentConstantData;
		data[index + 4] = 1.0 / 255.0;
		data[index + 5] = 1.0 / 255.0;
		data[index + 6] = 1.0 / 255.0;
		data[index + 7] = 0.0;
	}

	public _includeDependencies(shader: ShaderBase): void {
		super._includeDependencies(shader);

		shader.projectionDependencies++;
		shader.viewDirDependencies++;

		if (shader.alphaThreshold > 0)
			shader.uvDependencies++;

		if (shader.viewDirDependencies > 0)
			shader.globalPosDependencies++;
	}

	/**
     * @inheritDoc
     */
	public _getFragmentCode(registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string {
		let code: string;
		const targetReg: ShaderRegisterElement = sharedRegisters.shadedTarget;
		const dataReg1: ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		const dataReg2: ShaderRegisterElement = registerCache.getFreeFragmentConstant();

		this._fragmentConstantsIndex = dataReg1.index * 4;

		const temp1: ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp1, 1);
		const temp2: ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp2, 1);

		// squared distance to view
		code = 'dp3 ' + temp1 + '.z, ' + sharedRegisters.viewDirVarying + '.xyz, ' + sharedRegisters.viewDirVarying + '.xyz\n' +
            'mul ' + temp1 + ', ' + dataReg1 + ', ' + temp1 + '.z\n' +
            'frc ' + temp1 + ', ' + temp1 + '\n' +
            'mul ' + temp2 + ', ' + temp1 + '.yzww, ' + dataReg2 + '\n';

		if (this._shaderTexture && this._shader.alphaThreshold > 0) {

			const albedo: ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
			code += this._shaderTexture._getFragmentCode(albedo, registerCache, sharedRegisters, sharedRegisters.uvVarying);

			const cutOffReg: ShaderRegisterElement = registerCache.getFreeFragmentConstant();

			code += 'sub ' + albedo + '.w, ' + albedo + '.w, ' + cutOffReg + '.x\n' +
                'kil ' + albedo + '.w\n';
		}

		code += 'sub ' + targetReg + ', ' + temp1 + ', ' + temp2 + '\n';

		return code;
	}

	/**
     * @inheritDoc
     */
	public _activate(): void {
		super._activate();

		let f: number =  this._shader.view.projection.far;

		f = 1 / (2 * f * f);
		// sqrt(f*f+f*f) is largest possible distance for any frustum, so we need to divide by it. Rarely a tight fit, but with 32 bits precision, it's enough.
		const index: number = this._fragmentConstantsIndex;
		const data: Float32Array = this._shader.fragmentConstantData;
		data[index] = 1.0 * f;
		data[index + 1] = 255.0 * f;
		data[index + 2] = 65025.0 * f;
		data[index + 3] = 16581375.0 * f;

		if (this._shaderTexture && this._shader.alphaThreshold > 0) {
			this._shaderTexture.activate();

			data[index + 8] = this._shader.alphaThreshold;
		}
	}
}