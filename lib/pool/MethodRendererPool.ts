import BillboardRenderable			= require("awayjs-renderergl/lib/pool/BillboardRenderable");
import LineSubMeshRenderable		= require("awayjs-renderergl/lib/pool/LineSubMeshRenderable");
import TriangleSubMeshRenderable	= require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
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