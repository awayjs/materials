import {Matrix3D, EventDispatcher, ProjectionBase} from "@awayjs/core";

import {Stage, GL_ImageBase, ShaderRegisterCache, ShaderRegisterData} from "@awayjs/stage";

import {RenderStateBase, MaterialStatePool, PassEvent, IRenderable, Style, IAnimationSet, IPass, ShaderBase} from "@awayjs/renderer";

import {GL_MaterialBase} from "../GL_MaterialBase";
import {MaterialBase} from "../MaterialBase";

/**
 * PassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
export class PassBase extends EventDispatcher implements IPass
{
	public _materialState:GL_MaterialBase;
	public _materialStatePool:MaterialStatePool;
	public _stage:Stage;
	
	public _shader:ShaderBase;

	private _preserveAlpha:boolean = true;
	private _forceSeparateMVP:boolean = false;

	public get shader():ShaderBase
	{
		return this._shader;
	}

	public get numUsedStreams():number
	{
		return this._shader.numUsedStreams;
	}

    public get numUsedTextures():number
    {
        return this._shader.numUsedTextures;
    }

	public get animationSet():IAnimationSet
	{
		return <IAnimationSet> (<MaterialBase> this._materialState.material).animationSet;
	}

	/**
	 * Indicates whether the output alpha value should remain unchanged compared to the material's original alpha.
	 */
	public get preserveAlpha():boolean
	{
		return this._preserveAlpha;
	}

	public set preserveAlpha(value:boolean)
	{
		if (this._preserveAlpha == value)
			return;

		this._preserveAlpha = value;

		this.invalidate();
	}

	/**
	 * Indicates whether the screen projection should be calculated by forcing a separate scene matrix and
	 * view-projection matrix. This is used to prevent rounding errors when using multiple passes with different
	 * projection code.
	 */
	public get forceSeparateMVP():boolean
	{
		return this._forceSeparateMVP;
	}

	public set forceSeparateMVP(value:boolean)
	{
		if (this._forceSeparateMVP == value)
			return;

		this._forceSeparateMVP = value;

		this.invalidate();
	}

	/**
	 * Creates a new PassBase object.
	 */
	constructor(materialState:GL_MaterialBase, materialStatePool:MaterialStatePool)
	{
		super();

		this._materialState = materialState;
		this._materialStatePool = materialStatePool;
		this._stage = materialStatePool.stage;
	}

	/**
	 * Marks the shader program as invalid, so it will be recompiled before the next render.
	 */
	public invalidate():void
	{
		this._shader.invalidateProgram();

		this.dispatchEvent(new PassEvent(PassEvent.INVALIDATE, this));
	}

	/**
	 * Cleans up any resources used by the current object.
	 * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
	 */
	public dispose():void
	{
		this._materialState = null;
		this._materialStatePool = null;
		this._stage = null;

		if (this._shader) {
			this._shader.dispose();
			this._shader = null;
		}
	}

	/**
	 * Renders the current pass. Before calling pass, activatePass needs to be called with the same index.
	 * @param pass The pass used to render the renderable.
	 * @param renderable The IRenderable object to draw.
	 * @param stage The Stage object used for rendering.
	 * @param entityCollector The EntityCollector object that contains the visible scene data.
	 * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
	 * camera.viewProjection as it includes the scaling factors when rendering to textures.
	 *
	 * @internal
	 */
	public _setRenderState(renderState:RenderStateBase, projection:ProjectionBase):void
	{
		this._shader._setRenderState(renderState, projection);
	}

	/**
	 * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
	 * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
	 * @param stage The Stage object which is currently used for rendering.
	 * @param camera The camera from which the scene is viewed.
	 * @private
	 */
	public _activate(projection:ProjectionBase):void
	{
		this._shader._activate(projection);
	}

	/**
	 * Clears the render state for the pass. This needs to be called before activating another pass.
	 * @param stage The Stage used for rendering
	 *
	 * @private
	 */
	public _deactivate():void
	{
		this._shader._deactivate();
	}

	public _includeDependencies(shader:ShaderBase):void
	{
		this._materialState._includeDependencies(shader);
		
		if (this._forceSeparateMVP)
			this._shader.globalPosDependencies++;
	}


	public _initConstantData():void
	{

	}

	public _getVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _getFragmentCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _getPostAnimationFragmentCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _getNormalVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _getNormalFragmentCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}
}