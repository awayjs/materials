import { Vector3D, PerspectiveProjection, ProjectionBase, Transform } from '@awayjs/core';

import { ImageCube } from '@awayjs/stage';

import { PartitionBase, View } from '@awayjs/view';

import { RenderGroup, DistanceRenderer } from '@awayjs/renderer';

import { ShadowTextureCube } from '../textures/ShadowTextureCube';
import { PointLight } from '../lights/PointLight';

import { ShadowMapperBase, _Shader_ShadowMapperBase } from './ShadowMapperBase';

export class PointShadowMapper extends ShadowMapperBase {
	protected _imageCube: ImageCube;
	private _depthProjections: Array<PerspectiveProjection>;
	private _needsRender: Array<boolean> = new Array<boolean>();

	public static assetType: string = '[asset PointShadowMapper]';

	/**
     * @inheritDoc
     */
	public get assetType(): string {
		return PointShadowMapper.assetType;
	}

	constructor(imageCube: ImageCube = null) {
		super();

		this._size = 512;
		this._imageCube = imageCube || new ImageCube(this._size);

		this._textureMap = new ShadowTextureCube(this, this._imageCube);

		this.iAddTexture(this._textureMap);

		this.initCameras();
	}

	public dispose(): void {
		super.dispose();

		(<ShadowTextureCube> this._textureMap).image = null;
		this._textureMap = null;
		this._imageCube = null;
	}

	private initCameras(): void {
		this._depthProjections = new Array();

		// posX, negX, posY, negY, posZ, negZ
		this.addProjection(0, 90, 0);
		this.addProjection(0, -90, 0);
		this.addProjection(-90, 0, 0);
		this.addProjection(90, 0, 0);
		this.addProjection(0, 0, 0);
		this.addProjection(0, 180, 0);
	}

	private addProjection(rotationX: number, rotationY: number, rotationZ: number): void {
		const projection: PerspectiveProjection = new PerspectiveProjection();
		projection.transform = new Transform();
		projection.transform.rotateTo(rotationX, rotationY, rotationZ);
		projection.near = .01;
		projection.fieldOfView = 90;
		this._depthProjections.push(projection);
	}

	protected _updateSize() {
		this._imageCube._setSize(this._size);
	}

	/**
	 *
	 * @param projection
	 * @private
	 */
	protected _updateProjection(projection: ProjectionBase): void {
		const light: PointLight = <PointLight>(this._light);
		const maxDistance: number = light.fallOff;
		const pos: Vector3D = this._light.transform.matrix3D.position;

		// todo: faces outside frustum which are pointing away from camera need not be rendered!
		for (let i: number = 0; i < 6; ++i) {
			this._depthProjections[i].far = maxDistance;
			this._depthProjections[i].transform.moveTo(pos.x, pos.y, pos.z);
			this._needsRender[i] = true;
		}
	}

	/**
	 *
	 * @param view
	 * @param target
	 * @param renderer
	 * @private
	 */
	protected _renderMap(partition: PartitionBase, renderGroup: RenderGroup): void {
		const distanceRenderer: DistanceRenderer = RenderGroup
			.getInstance(new View(null, renderGroup.stage), DistanceRenderer)
			.getRenderer(partition);

		for (let i: number = 0; i < 6; ++i) {
			if (this._needsRender[i]) {
				distanceRenderer.view.target = this._imageCube;
				distanceRenderer.view.projection = this._depthProjections[i];
				distanceRenderer.render(null, i);
			}
		}
	}
}

import { ShaderRegisterCache, ShaderRegisterData } from '@awayjs/stage';

import { ShaderBase, ChunkVO } from '@awayjs/renderer';

/**
 * _Shader_PointShadowMapper provides an abstract method for simple (non-wrapping) shadow map methods.
 */
export class _Shader_PointShadowMapper extends _Shader_ShadowMapperBase {
	/**
     * @inheritDoc
     */
	public _initVO(chunkVO: ChunkVO): void {
		super._initVO(chunkVO);

		chunkVO.needsGlobalFragmentPos = true;
	}

	/**
     * @inheritDoc
     */
	public _getVertexCode(regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string {
		this._depthMapCoordReg = sharedRegisters.globalPositionVarying;

		return '';
	}
}

ShaderBase.registerAbstraction(_Shader_PointShadowMapper, PointShadowMapper);