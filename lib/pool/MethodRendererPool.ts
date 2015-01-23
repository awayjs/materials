import BitmapData					= require("awayjs-core/lib/base/BitmapData");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Plane3D						= require("awayjs-core/lib/geom/Plane3D");
import Point						= require("awayjs-core/lib/geom/Point");
import Rectangle					= require("awayjs-core/lib/geom/Rectangle");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import EventDispatcher				= require("awayjs-core/lib/events/EventDispatcher");
import TextureProxyBase				= require("awayjs-core/lib/textures/TextureProxyBase");
import ByteArray					= require("awayjs-core/lib/utils/ByteArray");

import LineSubMesh					= require("awayjs-display/lib/base/LineSubMesh");
import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import TriangleSubMesh				= require("awayjs-display/lib/base/TriangleSubMesh");
import EntityListItem				= require("awayjs-display/lib/pool/EntityListItem");
import IEntitySorter				= require("awayjs-display/lib/sort/IEntitySorter");
import RenderableMergeSort			= require("awayjs-display/lib/sort/RenderableMergeSort");
import IRenderer					= require("awayjs-display/lib/render/IRenderer");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import Camera						= require("awayjs-display/lib/entities/Camera");
import IEntity						= require("awayjs-display/lib/entities/IEntity");
import Skybox						= require("awayjs-display/lib/entities/Skybox");
import RendererEvent				= require("awayjs-display/lib/events/RendererEvent");
import StageEvent					= require("awayjs-display/lib/events/StageEvent");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import EntityCollector				= require("awayjs-display/lib/traverse/EntityCollector");
import ICollector					= require("awayjs-display/lib/traverse/ICollector");
import ShadowCasterCollector		= require("awayjs-display/lib/traverse/ShadowCasterCollector");
import DefaultMaterialManager		= require("awayjs-display/lib/managers/DefaultMaterialManager");

import AGALMiniAssembler			= require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
import ContextGLBlendFactor			= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");
import StageManager					= require("awayjs-stagegl/lib/managers/StageManager");
import ProgramData					= require("awayjs-stagegl/lib/pool/ProgramData");

import AnimationSetBase				= require("awayjs-renderergl/lib/animators/AnimationSetBase");
import AnimatorBase					= require("awayjs-renderergl/lib/animators/AnimatorBase");
import BillboardRenderable			= require("awayjs-renderergl/lib/pool/BillboardRenderable");
import LineSubMeshRenderable		= require("awayjs-renderergl/lib/pool/LineSubMeshRenderable");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import TriangleSubMeshRenderable	= require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
import RTTBufferManager				= require("awayjs-renderergl/lib/managers/RTTBufferManager");
import RenderPassBase				= require("awayjs-renderergl/lib/passes/RenderPassBase");
import RendererPoolBase				= require("awayjs-renderergl/lib/pool/RendererPoolBase");
import RendererBase					= require("awayjs-renderergl/lib/base/RendererBase");

import MethodRenderablePool			= require("awayjs-methodmaterials/lib/pool/MethodRenderablePool");

/**
 * MethodRendererPool forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.MethodRendererPool
 */
class MethodRendererPool extends RendererPoolBase
{
	/**
	 * Creates a new MethodRendererPool object.
	 */
	constructor(renderer:RendererBase)
	{
		super(renderer);
	}

	public _pUpdatePool()
	{
		this._billboardRenderablePool = MethodRenderablePool.getPool(BillboardRenderable, this._pStage);
		this._triangleSubMeshRenderablePool = MethodRenderablePool.getPool(TriangleSubMeshRenderable, this._pStage);
		this._lineSubMeshRenderablePool = MethodRenderablePool.getPool(LineSubMeshRenderable, this._pStage);
	}
}

export = MethodRendererPool;