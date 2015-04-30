import Image2D							= require("awayjs-core/lib/data/Image2D");
import TriangleSubGeometry				= require("awayjs-core/lib/data/TriangleSubGeometry");
import Matrix3D							= require("awayjs-core/lib/geom/Matrix3D");

import LightBase						= require("awayjs-display/lib/base/LightBase");
import Camera							= require("awayjs-display/lib/entities/Camera");
import MaterialBase						= require("awayjs-display/lib/materials/MaterialBase");
import IRenderObjectOwner				= require("awayjs-display/lib/base/IRenderObjectOwner");
import Single2DTexture					= require("awayjs-display/lib/textures/Single2DTexture");
import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import ContextGLProgramType				= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import IContextGL						= require("awayjs-stagegl/lib/base/IContextGL");
import Stage							= require("awayjs-stagegl/lib/base/Stage");

import RendererBase						= require("awayjs-renderergl/lib/RendererBase");
import RenderObjectBase					= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderableBase					= require("awayjs-renderergl/lib/pool/RenderableBase");
import ShaderObjectBase					= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import IRenderableClass					= require("awayjs-renderergl/lib/pool/IRenderableClass");
import RenderPassBase					= require("awayjs-renderergl/lib/passes/RenderPassBase");

/**
 * The SingleObjectDepthPass provides a material pass that renders a single object to a depth map from the point
 * of view from a light.
 */
class SingleObjectDepthPass extends RenderPassBase
{
	private _textures:Object;
	private _projections:Object;
	private _textureSize:number /*uint*/ = 512;
	private _polyOffset:Array<number> = Array<number>(15, 0, 0, 0);
	private _enc:Array<number>;
	private _projectionTexturesInvalid:Boolean = true;

	/**
	 * The size of the depth map texture to render to.
	 */
	public get textureSize():number
	{
		return this._textureSize;
	}

	public set textureSize(value:number)
	{
		this._textureSize = value;
	}

	/**
	 * The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
	 */
	public get polyOffset():number
	{
		return this._polyOffset[0];
	}

	public set polyOffset(value:number)
	{
		this._polyOffset[0] = value;
	}

	/**
	 * Creates a new SingleObjectDepthPass object.
	 */
	constructor(renderObject:RenderObjectBase, renderObjectOwner:IRenderObjectOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		super(renderObject, renderObjectOwner, renderableClass, stage);

		//this._pNumUsedStreams = 2;
		//this._pNumUsedVertexConstants = 7;
		//this._enc = Array<number>(1.0, 255.0, 65025.0, 16581375.0, 1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
		//
		//this._pAnimatableAttributes = Array<string>("va0", "va1");
		//this._pAnimationTargetRegisters = Array<string>("vt0", "vt1");
	}

	/**
	 * @inheritDoc
	 */
	public dispose()
	{
		if (this._textures) {
			for (var key in this._textures) {
				var texture:TextureBase = this._textures[key];
				texture.dispose();
			}
			this._textures = null;
		}
	}

	/**
	 * Updates the projection textures used to contain the depth renders.
	 */
	private updateProjectionTextures()
	{
		if (this._textures) {
			for (var key in this._textures) {
				var texture:TextureBase = this._textures[key];
				texture.dispose();
			}
		}

		this._textures = new Object();
		this._projections = new Object();
		this._projectionTexturesInvalid = false;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetVertexCode():string
	{
		var code:string;
		// offset
		code = "mul vt7, vt1, vc4.x	\n" +
				"add vt7, vt7, vt0\n" +
				"mov vt7.w, vt0.w\n";
		// project
		code += "m44 vt2, vt7, vc0\n" +
				"mov op, vt2\n";

		// perspective divide
		code += "div v0, vt2, vt2.w\n";

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		// encode float -> rgba
		code += "mul ft0, fc0, v0.z\n" +
				"frc ft0, ft0\n" +
				"mul ft1, ft0.yzww, fc1\n" +
				"sub ft0, ft0, ft1\n" +
				"mov oc, ft0\n";

		return code;
	}

	/**
	 * Gets the depth maps rendered for this object from all lights.
	 * @param renderable The renderable for which to retrieve the depth maps.
	 * @param stage3DProxy The Stage3DProxy object currently used for rendering.
	 * @return A list of depth map textures for all supported lights.
	 */
	public _iGetDepthMap(renderable:RenderableBase):TextureBase
	{
		return this._textures[renderable.renderableOwner.id];
	}

	/**
	 * Retrieves the depth map projection maps for all lights.
	 * @param renderable The renderable for which to retrieve the projection maps.
	 * @return A list of projection maps for all supported lights.
	 */
	public _iGetProjection(renderable:RenderableBase):Matrix3D
	{
		return this._projections[renderable.renderableOwner.id];
	}

	/**
	 * @inheritDoc
	 */
	public _iRender(renderable:RenderableBase, camera:Camera, viewProjection:Matrix3D)
	{
		var matrix:Matrix3D;
		var context:IContextGL = this._stage.context;
		var len:number /*uint*/;
		var light:LightBase;
		var lights:Array<LightBase> = this._renderObjectOwner.lightPicker.allPickedLights;
		var rId:number = renderable.renderableOwner.id;

		if (!this._textures[rId])
			this._textures[rId] = new Single2DTexture(new Image2D(this._textureSize, this._textureSize));

		if (!this._projections[rId])
			this._projections[rId] = new Matrix3D();

		len = lights.length;

		// local position = enough
		light = lights[0];

		matrix = light.iGetObjectProjectionMatrix(renderable.sourceEntity, camera, this._projections[rId]);

		this._stage.setRenderTarget(this._textures[rId], true);
		context.clear(1.0, 1.0, 1.0);
		context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, matrix, true);
		context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._enc, 2);

		this._stage.activateBuffer(0, renderable.getVertexData(TriangleSubGeometry.POSITION_DATA), renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
		this._stage.activateBuffer(1, renderable.getVertexData(TriangleSubGeometry.NORMAL_DATA), renderable.getVertexOffset(TriangleSubGeometry.NORMAL_DATA), TriangleSubGeometry.NORMAL_FORMAT);
		context.drawTriangles(this._stage.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);
	}

	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera)
	{
		if (this._projectionTexturesInvalid)
			this.updateProjectionTextures();

		// never scale
		super._iActivate(camera);

		this._stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._polyOffset, 1);
	}
}

export = SingleObjectDepthPass;