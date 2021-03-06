import { Matrix3D, Rectangle, AssetEvent, PerspectiveProjection, ProjectionBase } from '@awayjs/core';

import { Image2D } from '@awayjs/stage';

import { PartitionBase } from '@awayjs/view';

import { RenderGroup } from '@awayjs/renderer';

import { DirectionalShadowMapper, _Shader_DirectionalShadowMapper } from './DirectionalShadowMapper';

export class CascadeShadowMapper extends DirectionalShadowMapper {
	private _onClearDelegate: (event: AssetEvent) => void;

	public _pScissorRects: Rectangle[];
	private _scissorRectsInvalid: boolean = true;
	private _splitRatios: number[];

	private _numCascades: number;
	private _depthProjections: Array<PerspectiveProjection>;

	private _texOffsetsX: Array<number>;
	private _texOffsetsY: Array<number>;

	private _nearPlaneDistances: number[];

	public static assetType: string = '[asset CascadeShadowMapper]';

	/**
     * @inheritDoc
     */
	public get assetType(): string {
		return CascadeShadowMapper.assetType;
	}

	constructor(image2D: Image2D = null, numCascades: number = 3) {
		super(image2D);

		this._onClearDelegate = (event: AssetEvent) => this.onClear(event);
		image2D.addEventListener(AssetEvent.CLEAR, this._onClearDelegate);

		if (numCascades < 1 || numCascades > 4)
			throw new Error('numCascades must be an integer between 1 and 4');

		this._numCascades = numCascades;
		this.init();
	}

	public dispose(): void {
		this._image2D.removeEventListener(AssetEvent.CLEAR, this._onClearDelegate);

		super.dispose();
	}

	public getSplitRatio(index: number): number {
		return this._splitRatios[index];
	}

	public setSplitRatio(index: number, value: number): void {
		if (value < 0)
			value = 0;
		else if (value > 1)
			value = 1;

		if (index >= this._numCascades)
			throw new Error('index must be smaller than the number of cascades!');

		this._splitRatios[index] = value;
	}

	public getDepthProjections(partition: number): Matrix3D {
		return this._depthProjections[partition].viewMatrix3D;
	}

	private init(): void {
		this._splitRatios = new Array<number>(this._numCascades);
		this._nearPlaneDistances = new Array<number>(this._numCascades);

		let s: number = 1;
		for (var i: number /*int*/ = this._numCascades - 1; i >= 0; --i) {
			this._splitRatios[i] = s;
			s *= .4;
		}

		this._texOffsetsX = Array<number>(-1, 1, -1, 1);
		this._texOffsetsY = Array<number>(1, 1, -1, -1);
		this._pScissorRects = new Array<Rectangle>(4);
		this._depthProjections = new Array<PerspectiveProjection>();

		for (i = 0; i < this._numCascades; ++i)
			this._depthProjections[i] = new PerspectiveProjection();
	}

	/**
     *
     */
	public onClear(event: AssetEvent): void {
		this._scissorRectsInvalid = true;
	}

	public get numCascades(): number {
		return this._numCascades;
	}

	public set numCascades(value: number) {
		if (value == this._numCascades)
			return;

		if (value < 1 || value > 4)
			throw new Error('numCascades must be an integer between 1 and 4');

		this._numCascades = value;
		this._scissorRectsInvalid = true;
		this.init();
		this.dispatchEvent(new AssetEvent(AssetEvent.INVALIDATE, this));
	}

	protected _renderMap(partition: PartitionBase, renderGroup: RenderGroup): void {
		if (this._scissorRectsInvalid)
			this.updateScissorRects();

		//renderGroup.depthRenderGroup.getRenderer(partition).cullPlanes = this._cullPlanes;
		//rootRenderer.getDepthRenderer()._iRenderCascades(this._overallDepthProjection, view, this._image2D, this._numCascades, this._pScissorRects, this._depthProjections);
	}

	private updateScissorRects(): void {
		const half: number = this._image2D.width * .5;

		this._pScissorRects[0] = new Rectangle(0, 0, half, half);
		this._pScissorRects[1] = new Rectangle(half, 0, half, half);
		this._pScissorRects[2] = new Rectangle(0, half, half, half);
		this._pScissorRects[3] = new Rectangle(half, half, half, half);

		this._scissorRectsInvalid = false;
	}

	protected _updateProjection(projection: ProjectionBase): void {
		let matrix: Matrix3D;
		const projectionNear: number = projection.near;
		const projectionRange: number = projection.far - projectionNear;

		this._updateProjectionFromFrustumCorners(projection, projection.viewFrustumCorners, this._matrix);
		this._matrix.appendScale(.96, .96, 1);
		this._overallDepthProjection.frustumMatrix3D = this._matrix;
		this._updateCullPlanes(projection);

		for (let i: number /*int*/ = 0; i < this._numCascades; ++i) {
			matrix = this._depthProjections[i].frustumMatrix3D;

			this._nearPlaneDistances[i] = projectionNear + this._splitRatios[i] * projectionRange;
			this._depthProjections[i].transform.matrix3D = this._overallDepthProjection.transform.matrix3D;

			this.updateProjectionPartition(matrix, this._splitRatios[i], this._texOffsetsX[i], this._texOffsetsY[i]);

			this._depthProjections[i].frustumMatrix3D = matrix;
		}
	}

	private updateProjectionPartition(matrix: Matrix3D, splitRatio: number, texOffsetX: number, texOffsetY: number): void {
		let xN: number, yN: number, zN: number;
		let xF: number, yF: number, zF: number;
		let minX: number = Number.POSITIVE_INFINITY, minY: number = Number.POSITIVE_INFINITY, minZ: number;
		let maxX: number = Number.NEGATIVE_INFINITY, maxY: number = Number.NEGATIVE_INFINITY, maxZ: number = Number.NEGATIVE_INFINITY;
		let i: number = 0;

		while (i < 12) {
			xN = this._localFrustum[i];
			yN = this._localFrustum[i + 1];
			zN = this._localFrustum[i + 2];
			xF = xN + (this._localFrustum[i + 12] - xN) * splitRatio;
			yF = yN + (this._localFrustum[i + 13] - yN) * splitRatio;
			zF = zN + (this._localFrustum[i + 14] - zN) * splitRatio;
			if (xN < minX)
				minX = xN;
			if (xN > maxX)
				maxX = xN;
			if (yN < minY)
				minY = yN;
			if (yN > maxY)
				maxY = yN;
			if (zN > maxZ)
				maxZ = zN;
			if (xF < minX)
				minX = xF;
			if (xF > maxX)
				maxX = xF;
			if (yF < minY)
				minY = yF;
			if (yF > maxY)
				maxY = yF;
			if (zF > maxZ)
				maxZ = zF;
			i += 3;
		}

		minZ = 1;

		let w: number = (maxX - minX);
		let h: number = (maxY - minY);
		const d: number = 1 / (maxZ - minZ);

		if (minX < 0)
			minX -= this._snap; // because int() rounds up for < 0
		if (minY < 0)
			minY -= this._snap;
		minX = Math.floor(minX / this._snap) * this._snap;
		minY = Math.floor(minY / this._snap) * this._snap;

		const snap2: number = 2 * this._snap;
		w = Math.floor(w / snap2 + 1) * snap2;
		h = Math.floor(h / snap2 + 1) * snap2;

		maxX = minX + w;
		maxY = minY + h;

		w = 1 / w;
		h = 1 / h;

		const raw: Float32Array = matrix._rawData;

		raw[0] = 2 * w;
		raw[5] = 2 * h;
		raw[10] = d;
		raw[12] = -(maxX + minX) * w;
		raw[13] = -(maxY + minY) * h;
		raw[14] = -minZ * d;
		raw[15] = 1;
		raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;

		matrix.appendScale(.96, .96, 1);
		matrix.appendTranslation(texOffsetX, texOffsetY, 0);
		matrix.appendScale(.5, .5, 1);
	}

	get _iNearPlaneDistances(): Array<number> {
		return this._nearPlaneDistances;
	}
}

import { ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement } from '@awayjs/stage';

import { ShaderBase, _Render_RenderableBase, ChunkVO } from '@awayjs/renderer';

/**
 * _Shader_CascadeShadowMapper is a shadow map method to apply cascade shadow mapping on materials.
 * Must be used with a DirectionalLight with a CascadeShadowMapper assigned to its shadowMapper property.
 *
 * @see away.lights.CascadeShadowMapper
 */
export class _Shader_CascadeShadowMapper extends _Shader_DirectionalShadowMapper {
	private _cascadeProjections: Array<ShaderRegisterElement>;
	private _depthMapCoordVaryings: Array<ShaderRegisterElement>;

	private _vertexConstantsIndex: number;
	private _fragmentConstantsIndex: number;
	private _projectionMatrices: Array<Matrix3D>;

	/**
     * @inheritDoc
     */
	public _initVO(chunkVO: ChunkVO): void {
		super._initVO(chunkVO);

		chunkVO.needsProjection = true;
	}

	/**
     * @inheritDoc
     */
	public _initConstants(): void {
		super._initConstants();

		const fragmentData: Float32Array = this._shader.fragmentConstantData;
		const vertexData: Float32Array = this._shader.vertexConstantData;
		let index: number = this._fragmentConstantsIndex;
		fragmentData[index] = 1.0;
		fragmentData[index + 1] = 1 / 255.0;
		fragmentData[index + 2] = 1 / 65025.0;
		fragmentData[index + 3] = 1 / 16581375.0;

		fragmentData[index + 6] = .5;
		fragmentData[index + 7] = -.5;

		index = this._vertexConstantsIndex;
		vertexData[index] = .5;
		vertexData[index + 1] = -.5;
		vertexData[index + 2] = 0;

		const numCascades: number = (<CascadeShadowMapper> this._mapper).numCascades;

		this._projectionMatrices = new Array<Matrix3D>(numCascades);
		for (let k: number = 0; k < numCascades; ++k)
			this._projectionMatrices[k] = new Matrix3D(new Float32Array(this._shader.vertexConstantData.buffer, (this._vertexConstantsIndex + 4 + k * 16) * 4, 16));
	}

	/**
     * @inheritDoc
     */
	public _cleanCompilationData(): void {
		super._cleanCompilationData();

		this._cascadeProjections = null;
		this._depthMapCoordVaryings = null;
		this._projectionMatrices = null;
	}

	/**
     * @inheritDoc
     */
	public _getVertexCode(registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string {
		let code: string = '';
		const dataReg: ShaderRegisterElement = registerCache.getFreeVertexConstant();

		this._vertexConstantsIndex = dataReg.index * 4;

		//Create the registers for the cascades' projection coordinates.
		this._cascadeProjections = new Array<ShaderRegisterElement>((<CascadeShadowMapper> this._mapper).numCascades);
		this._depthMapCoordVaryings = new Array<ShaderRegisterElement>((<CascadeShadowMapper> this._mapper).numCascades);

		for (var i: number = 0; i < (<CascadeShadowMapper> this._mapper).numCascades; ++i) {
			this._depthMapCoordVaryings[i] = registerCache.getFreeVarying();
			this._cascadeProjections[i] = registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
		}

		const temp: ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();

		for (var i: number = 0; i < (<CascadeShadowMapper> this._mapper).numCascades; ++i) {
			code += 'm44 ' + temp + ', ' + sharedRegisters.globalPositionVertex + ', ' + this._cascadeProjections[i] + '\n' +
                'add ' + this._depthMapCoordVaryings[i] + ', ' + temp + ', ' + dataReg + '.zzwz\n';
		}

		return code;
	}

	/**
     * @inheritDoc
     */
	public _getFragmentCode(targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string {
		const numCascades: number = (<CascadeShadowMapper> this._mapper).numCascades;
		const decReg: ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		const dataReg: ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		const planeDistanceReg: ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		const planeDistances: Array<string> = Array<string>(planeDistanceReg + '.x', planeDistanceReg + '.y', planeDistanceReg + '.z', planeDistanceReg + '.w');
		let code: string;

		this._fragmentConstantsIndex = decReg.index * 4;

		const inQuad: ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(inQuad, 1);
		const uvCoord: ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(uvCoord, 1);

		// assume lowest partition is selected, will be overwritten later otherwise
		code = 'mov ' + uvCoord + ', ' + this._depthMapCoordVaryings[numCascades - 1] + '\n';

		for (let i: number = numCascades - 2; i >= 0; --i) {
			const uvProjection: ShaderRegisterElement = this._depthMapCoordVaryings[i];

			// calculate if in texturemap (result == 0 or 1, only 1 for a single partition)
			code += 'slt ' + inQuad + '.z, ' + sharedRegisters.projectionFragment + '.z, ' + planeDistances[i] + '\n'; // z = x > minX, w = y > minY

			const temp: ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

			// linearly interpolate between old and new uv coords using predicate value == conditional toggle to new value if predicate == 1 (true)
			code += 'sub ' + temp + ', ' + uvProjection + ', ' + uvCoord + '\n' +
                'mul ' + temp + ', ' + temp + ', ' + inQuad + '.z\n' +
                'add ' + uvCoord + ', ' + uvCoord + ', ' + temp + '\n';
		}

		registerCache.removeFragmentTempUsage(inQuad);

		code += 'div ' + uvCoord + ', ' + uvCoord + ', ' + uvCoord + '.w\n' +
            'mul ' + uvCoord + '.xy, ' + uvCoord + '.xy, ' + dataReg + '.zw\n' +
            'add ' + uvCoord + '.xy, ' + uvCoord + '.xy, ' + dataReg + '.zz\n';

		// code += (<ShadowChunkBase> this._baseChunk)._getCascadeFragmentCode(decReg, uvCoord, targetReg, registerCache, sharedRegisters) +
		// 	"add " + targetReg + ".w, " + targetReg + ".w, " + dataReg + ".y\n";
		//
		registerCache.removeFragmentTempUsage(uvCoord);

		return code;
	}

	/**
     * @inheritDoc
     */
	public _activate(): void {
		// (<ShadowChunkBase> this._baseChunk).depthMap.activate();

		this._shader.vertexConstantData[this._vertexConstantsIndex + 3] = -1 / ((<CascadeShadowMapper> this._mapper).depth * (<CascadeShadowMapper> this._mapper).epsilon);

		const numCascades: number = (<CascadeShadowMapper> this._mapper).numCascades;
		for (let k: number = 0; k < numCascades; ++k)
			this._projectionMatrices[k].copyFrom((<CascadeShadowMapper> this._mapper).getDepthProjections(k), true);

		const fragmentData: Float32Array = this._shader.fragmentConstantData;
		let fragmentIndex: number = this._fragmentConstantsIndex;
		fragmentData[fragmentIndex + 5] = 1 - (<CascadeShadowMapper> this._mapper).alpha;

		const nearPlaneDistances: Array<number> = (<CascadeShadowMapper> this._mapper)._iNearPlaneDistances;

		fragmentIndex += 8;
		for (let i: number = 0; i < numCascades; ++i)
			fragmentData[fragmentIndex + i] = nearPlaneDistances[i];

		// (<ShadowChunkBase> this._baseChunk)._activateForCascade();
	}

	/**
     * @inheritDoc
     */
	public _setRenderState(renderState: _Render_RenderableBase): void {
	}
}

ShaderBase.registerAbstraction(_Shader_CascadeShadowMapper, CascadeShadowMapper);