import { TextureBase } from '@awayjs/renderer';

import { NormalBasicMethod, _Shader_NormalBasicMethod } from './NormalBasicMethod';

/**
 * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
 */
export class NormalSimpleWaterMethod extends NormalBasicMethod {
	private _secondaryNormalMap: TextureBase;
	private _water1OffsetX: number = 0;
	private _water1OffsetY: number = 0;
	private _water2OffsetX: number = 0;
	private _water2OffsetY: number = 0;

	public static assetType: string = '[asset NormalSimpleWaterMethod]';

	/**
	 * @inheritDoc
	 */
	public get assetType(): string {
		return NormalSimpleWaterMethod.assetType;
	}

	/**
	 * The translation of the first wave layer along the X-axis.
	 */
	public get water1OffsetX(): number {
		return this._water1OffsetX;
	}

	public set water1OffsetX(value: number) {
		this._water1OffsetX = value;

		this.invalidate();
	}

	/**
	 * The translation of the first wave layer along the Y-axis.
	 */
	public get water1OffsetY(): number {
		return this._water1OffsetY;
	}

	public set water1OffsetY(value: number) {
		this._water1OffsetY = value;

		this.invalidate();
	}

	/**
	 * The translation of the second wave layer along the X-axis.
	 */
	public get water2OffsetX(): number {
		return this._water2OffsetX;
	}

	public set water2OffsetX(value: number) {
		this._water2OffsetX = value;

		this.invalidate();
	}

	/**
	 * The translation of the second wave layer along the Y-axis.
	 */
	public get water2OffsetY(): number {
		return this._water2OffsetY;
	}

	public set water2OffsetY(value: number) {
		this._water2OffsetY = value;

		this.invalidate();
	}

	/**
	 * A second normal map that will be combined with the first to create a wave-like animation pattern.
	 */
	public get secondaryNormalMap(): TextureBase {
		return this._secondaryNormalMap;
	}

	public set secondaryNormalMap(value: TextureBase) {
		if (this._secondaryNormalMap == value)
			return;

		if (this._secondaryNormalMap)
			this.iRemoveTexture(this._secondaryNormalMap);

		this._secondaryNormalMap = value;

		if (this._secondaryNormalMap)
			this.iAddTexture(this._secondaryNormalMap);

		this.invalidateShaderProgram();
	}

	/**
	 * Creates a new NormalSimpleWaterMethod object.
	 * @param waveMap1 A normal map containing one layer of a wave structure.
	 * @param waveMap2 A normal map containing a second layer of a wave structure.
	 */
	constructor(normalMap: TextureBase = null, secondaryNormalMap: TextureBase = null) {
		super(normalMap);

		this._secondaryNormalMap = secondaryNormalMap;

		if (this._secondaryNormalMap)
			this.iAddTexture(this._secondaryNormalMap);
	}

	/**
	 * @inheritDoc
	 */
	public dispose(): void {
		super.dispose();

		this._secondaryNormalMap = null;
	}
}

import { AssetEvent } from '@awayjs/core';

import { ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement } from '@awayjs/stage';

import { _Render_RenderableBase, ShaderBase, _Shader_TextureBase, ChunkVO } from '@awayjs/renderer';

/**
 * _Shader_NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
 */
export class _Shader_NormalSimpleWaterMethod extends _Shader_NormalBasicMethod {
	private _secondaryNormalMap: _Shader_TextureBase;
	private _fragmentConstantsIndex: number;

	/**
     * Creates a new NormalHeightMapChunk.
     */
	constructor(method: NormalSimpleWaterMethod, shader: ShaderBase) {
		super(method, shader);
	}

	/**
     * @inheritDoc
     */
	public _initConstants(): void {
		super._initConstants();

		const index: number = this._fragmentConstantsIndex;
		const data: Float32Array = this._shader.fragmentConstantData;
		data[index] = .5;
		data[index + 1] = 0;
		data[index + 2] = 0;
		data[index + 3] = 1;
	}

	/**
     * @inheritDoc
     */
	public _initVO(chunkVO: ChunkVO): void {
		super._initVO(chunkVO);

		const secondaryNormalMap: TextureBase = (<NormalSimpleWaterMethod> this._method).secondaryNormalMap;
		if (secondaryNormalMap) {
			this._secondaryNormalMap = secondaryNormalMap.getAbstraction<_Shader_TextureBase>(this._shader);

			this._shader.uvDependencies++;
		}
	}

	/**
     * @inheritDoc
     */
	public onClear(event: AssetEvent): void {
		super.onClear(event);

		this._secondaryNormalMap = null;
	}

	/**
     * @inheritDoc
     */
	public _activate(): void {
		super._activate();

		if (this._invalid) {
			const data: Float32Array = this._shader.fragmentConstantData;
			const index: number = this._fragmentConstantsIndex;

			data[index + 4] = (<NormalSimpleWaterMethod> this._method).water1OffsetX;
			data[index + 5] = (<NormalSimpleWaterMethod> this._method).water1OffsetY;
			data[index + 6] = (<NormalSimpleWaterMethod> this._method).water2OffsetX;
			data[index + 7] = (<NormalSimpleWaterMethod> this._method).water2OffsetY;
		}

		if (this._secondaryNormalMap)
			this._secondaryNormalMap.activate();
	}

	/**
     * @inheritDoc
     */
	public _setRenderState(renderState: _Render_RenderableBase): void {
		super._setRenderState(renderState);

		if (this._secondaryNormalMap)
			this._secondaryNormalMap._setRenderState(renderState);
	}

	/**
     * @inheritDoc
     */
	public _getFragmentCode(targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string {
		let code: string = '';
		const temp: ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);

		const dataReg: ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		const dataReg2: ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		this._fragmentConstantsIndex = dataReg.index * 4;

		code += 'add ' + temp + ', ' + sharedRegisters.uvVarying + ', ' + dataReg2 + '.xyxy\n';

		if (this._texture)
			code += this._texture._getFragmentCode(targetReg, registerCache, sharedRegisters, temp);

		code += 'add ' + temp + ', ' + sharedRegisters.uvVarying + ', ' + dataReg2 + '.zwzw\n';

		if (this._secondaryNormalMap)
			code += this._secondaryNormalMap._getFragmentCode(temp, registerCache, sharedRegisters, temp);

		code +=	'add ' + targetReg + ', ' + targetReg + ', ' + temp + '		\n' +
            'mul ' + targetReg + ', ' + targetReg + ', ' + dataReg + '.x	\n' +
            'sub ' + targetReg + '.xyz, ' + targetReg + '.xyz, ' + sharedRegisters.commons + '.xxx	\n' +
            'nrm ' + targetReg + '.xyz, ' + targetReg + '.xyz							\n';

		return code;
	}
}

ShaderBase.registerAbstraction(_Shader_NormalSimpleWaterMethod, NormalSimpleWaterMethod);