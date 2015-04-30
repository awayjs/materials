import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import IRenderablePool				= require("awayjs-display/lib/pool/IRenderablePool");
import IRenderObject				= require("awayjs-display/lib/pool/IRenderObject");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import RenderablePoolBase			= require("awayjs-renderergl/lib/pool/RenderablePoolBase");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import SkyboxRenderObject			= require("awayjs-renderergl/lib/compilation/SkyboxRenderObject");
import DepthRenderObject			= require("awayjs-renderergl/lib/compilation/DepthRenderObject");
import DistanceRenderObject			= require("awayjs-renderergl/lib/compilation/DistanceRenderObject");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderMethodMaterialObject	= require("awayjs-methodmaterials/lib/compilation/RenderMethodMaterialObject");

/**
 * @class away.pool.MethodRenderablePool
 */
class MethodRenderablePool extends RenderablePoolBase
{
	private _methodMaterialRenderObjectPool:RenderObjectPool;

	/**
	 * //TODO
	 *
	 * @param renderableClass
	 */
	constructor(renderableClass:IRenderableClass, stage:Stage)
	{
		super(renderableClass, stage);

		this._methodMaterialRenderObjectPool = new RenderObjectPool(RenderMethodMaterialObject, this._renderableClass, this._stage);
	}

	/**
	 *
	 * @param material
	 * @param renderable
	 */
	public getMethodRenderObject(renderObjectOwner:IRenderObjectOwner):RenderObjectBase
	{
		return this._methodMaterialRenderObjectPool.getItem(renderObjectOwner);
	}

	/**
	 * //TODO
	 *
	 * @param renderableClass
	 * @returns MethodRenderablePool
	 */
	public static getPool(renderableClass:IRenderableClass, stage:Stage):MethodRenderablePool
	{
		var pools:Object = (RenderablePoolBase._pools[stage.stageIndex] || (RenderablePoolBase._pools[stage.stageIndex] = new Object()));

		return (pools[renderableClass.id] || (pools[renderableClass.id] = new MethodRenderablePool(renderableClass, stage)));
	}
}

export = MethodRenderablePool;