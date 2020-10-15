import { Matrix3D, Plane3D, Vector3D, ProjectionBase, Transform, OrthographicProjection } from '@awayjs/core';

import { Image2D } from '@awayjs/stage';

import { PartitionBase } from '@awayjs/view';

import { RenderGroup, DepthRenderer } from '@awayjs/renderer';

import { ShadowTexture2D } from '../textures/ShadowTexture2D';
import { DirectionalLight } from '../lights/DirectionalLight';

import { ShadowMapperBase, _Shader_ShadowMapperBase } from './ShadowMapperBase';

export class DirectionalShadowMapper extends ShadowMapperBase {
	protected _image2D: Image2D;
	protected _localFrustum: Array<number>;

	protected _lightOffset: number = 10000;
	protected _matrix: Matrix3D;
	protected _overallDepthProjection: OrthographicProjection;
	protected _snap: number = 64;

	protected _cullPlanes: Array<Plane3D>;
	protected _minZ: number;
	protected _maxZ: number;

	public static assetType: string = '[asset DirectionalShadowMapper]';

	/**
     * @inheritDoc
     */
	public get assetType(): string {
		return DirectionalShadowMapper.assetType;
	}

	constructor(image2D: Image2D = null) {
		super();

		this._size = 2048;
		this._image2D = image2D || new Image2D(this._size, this._size);

		this._textureMap = new ShadowTexture2D(this._image2D);

		this.iAddTexture(this._textureMap);

		this._cullPlanes = [];
		this._overallDepthProjection = new OrthographicProjection();
		this._overallDepthProjection.transform = new Transform();
		this._localFrustum = [];
		this._matrix = new Matrix3D();
	}

	public dispose(): void {
		super.dispose();

		(<ShadowTexture2D> this._textureMap).image = null;
		this._textureMap = null;
		this._image2D = null;
	}

	public get snap(): number {
		return this._snap;
	}

	public set snap(value: number) {
		this._snap = value;
	}

	public get lightOffset(): number {
		return this._lightOffset;
	}

	public set lightOffset(value: number) {
		this._lightOffset = value;
	}

	//@arcane
	public get depthProjection(): Matrix3D {
		return this._overallDepthProjection.viewMatrix3D;
	}

	//@arcane
	public get depth(): number {
		return this._maxZ - this._minZ;
	}

	protected _updateSize() {
		this._image2D._setSize(this._size, this._size);
	}

	/**
     *
     * @param projection
     * @private
     */
	protected _updateProjection(projection: ProjectionBase): void {
		this._updateProjectionFromFrustumCorners(projection, projection.viewFrustumCorners, this._matrix);
		this._overallDepthProjection.frustumMatrix3D = this._matrix;
		this._updateCullPlanes(projection);
	}

	//@override
	protected _renderMap(partition: PartitionBase, renderGroup: RenderGroup): void {
		const depthRenderer: DepthRenderer = renderGroup.depthRenderGroup.getRenderer(partition);
		depthRenderer.cullPlanes = this._cullPlanes;
		depthRenderer.view.preservePixelRatio = false;
		depthRenderer.view.target = this._image2D;
		depthRenderer.view.projection = this._overallDepthProjection;
		depthRenderer.render();
	}

	/**
	 *
	 * @param projection
	 * @private
	 */
	protected _updateCullPlanes(projection: ProjectionBase): void {
		const lightFrustumPlanes: Array<Plane3D> = this._overallDepthProjection.viewFrustumPlanes;
		const viewFrustumPlanes: Array<Plane3D> = projection.viewFrustumPlanes;
		this._cullPlanes.length = 4;

		this._cullPlanes[0] = lightFrustumPlanes[0];
		this._cullPlanes[1] = lightFrustumPlanes[1];
		this._cullPlanes[2] = lightFrustumPlanes[2];
		this._cullPlanes[3] = lightFrustumPlanes[3];

		const dir: Vector3D = (<DirectionalLight> this._light).sceneDirection;
		const dirX: number = dir.x;
		const dirY: number = dir.y;
		const dirZ: number = dir.z;
		let j: number = 4;
		for (let i: number = 0; i < 6; ++i) {
			const plane: Plane3D = viewFrustumPlanes[i];
			if (plane.a * dirX + plane.b * dirY + plane.c * dirZ < 0)
				this._cullPlanes[j++] = plane;
		}
	}

	/**
	 *
	 * @param projection
	 * @param matrix
	 * @private
	 */
	protected _updateProjectionFromFrustumCorners(projection: ProjectionBase, corners: Array<number>, matrix: Matrix3D): void {
		let x: number, y: number, z: number;
		let minX: number, minY: number;
		let maxX: number, maxY: number;
		let i: number;

		const pos: Vector3D = projection.transform.concatenatedMatrix3D.position;
		const dir: Vector3D = (<DirectionalLight> this._light).sceneDirection;
		this._overallDepthProjection.transform.matrix3D = this._light.transform.concatenatedMatrix3D;
		x = Math.floor((pos.x - dir.x * this._lightOffset) / this._snap) * this._snap;
		y = Math.floor((pos.y - dir.y * this._lightOffset) / this._snap) * this._snap;
		z = Math.floor((pos.z - dir.z * this._lightOffset) / this._snap) * this._snap;
		this._overallDepthProjection.transform.moveTo(x, y, z);

		this._overallDepthProjection.transform.inverseConcatenatedMatrix3D.transformVectors(corners, this._localFrustum);

		minX = maxX = this._localFrustum[0];
		minY = maxY = this._localFrustum[1];
		this._maxZ = this._localFrustum[2];

		i = 3;
		while (i < 24) {
			x = this._localFrustum[i];
			y = this._localFrustum[i + 1];
			z = this._localFrustum[i + 2];
			if (x < minX)
				minX = x;
			if (x > maxX)
				maxX = x;
			if (y < minY)
				minY = y;
			if (y > maxY)
				maxY = y;
			if (z > this._maxZ)
				this._maxZ = z;
			i += 3;
		}

		this._minZ = 1;

		let w: number = maxX - minX;
		let h: number = maxY - minY;
		const d: number = 1 / (this._maxZ - this._minZ);

		if (minX < 0)
			minX -= this._snap; // because int() rounds up for < 0

		if (minY < 0)
			minY -= this._snap;

		minX = Math.floor(minX / this._snap) * this._snap;
		minY = Math.floor(minY / this._snap) * this._snap;

		const snap2: number = 2 * this._snap;
		w = Math.floor(w / snap2 + 2) * snap2;
		h = Math.floor(h / snap2 + 2) * snap2;

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
		raw[14] = -this._minZ * d;
		raw[15] = 1;
		raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;

		matrix.invalidatePosition();
	}
}

import { ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement } from '@awayjs/stage';

import { ShaderBase, _Render_RenderableBase, _Shader_TextureBase, ChunkVO } from '@awayjs/renderer';

/**
 * ShadowChunkBase provides an abstract method for simple (non-wrapping) shadow map methods.
 */
export class _Shader_DirectionalShadowMapper extends _Shader_ShadowMapperBase {
	private _vertexScalingIndex: number;

	protected _depthProjectionMatrix: Matrix3D;

	/**
     * @inheritDoc
     */
	public _initVO(chunkVO: ChunkVO): void {
		super._initVO(chunkVO);

		chunkVO.needsView = true;
		chunkVO.needsGlobalVertexPos = true;
	}

	/**
     * @inheritDoc
     */
	public _initConstants(): void {
		super._initConstants();

		const vertexData: Float32Array = this._shader.vertexConstantData;
		const index: number = this._vertexScalingIndex;

		vertexData[index] = .5;
		vertexData[index + 1] = .5;
		vertexData[index + 2] = 0.0;
		vertexData[index + 3] = 1.0;

		this._depthProjectionMatrix = new Matrix3D(new Float32Array(this._shader.vertexConstantData.buffer, (index + 4) * 4, 16));
	}

	/**
     * @inheritDoc
     */
	public _getVertexCode(regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string {
		let code: string = '';
		const temp: ShaderRegisterElement = regCache.getFreeVertexVectorTemp();
		const dataReg: ShaderRegisterElement = regCache.getFreeVertexConstant();
		this._vertexScalingIndex = dataReg.index * 4;

		const depthMapProj: ShaderRegisterElement = regCache.getFreeVertexConstant();
		regCache.getFreeVertexConstant();
		regCache.getFreeVertexConstant();
		regCache.getFreeVertexConstant();

		this._depthMapCoordReg = regCache.getFreeVarying();

		code += 'm44 ' + temp + ', ' + sharedRegisters.globalPositionVertex + ', ' + depthMapProj + '\n' +
            'div ' + temp + ', ' + temp + ', ' + temp + '.w\n' +
            'mul ' + temp + '.xy, ' + temp + '.xy, ' + dataReg + '.xy\n' +
            'add ' + this._depthMapCoordReg + ', ' + temp + ', ' + dataReg + '.xxwz\n';

		return code;
	}

	/**
     * @inheritDoc
     */
	public _activate(): void {
		super._activate();

		const vertexData: Float32Array = this._shader.vertexConstantData;
		const index: number = this._vertexScalingIndex;

		vertexData[this._vertexScalingIndex + 3] = -1 / ((<DirectionalShadowMapper> this._mapper).depth * (<DirectionalShadowMapper> this._mapper).epsilon);

		this._depthProjectionMatrix.copyFrom((<DirectionalShadowMapper> this._mapper).depthProjection, true);
	}
}

ShaderBase.registerAbstraction(_Shader_DirectionalShadowMapper, DirectionalShadowMapper);