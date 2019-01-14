import {EventDispatcher} from "@awayjs/core";

import {Stage, _Stage_ImageBase, ShaderRegisterCache, ShaderRegisterData} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {_Render_RenderableBase, _Render_ElementsBase, _Render_MaterialBase, PassEvent, IAnimationSet, IPass, ShaderBase} from "@awayjs/renderer";

import {MaterialBase} from "../MaterialBase";

/**
 * PassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
export class PassBase extends EventDispatcher implements IPass
{
	protected _renderMaterial:_Render_MaterialBase;
    protected _renderElements:_Render_ElementsBase;
    protected _stage:Stage;

    protected _shader:ShaderBase;

	private _preserveAlpha:boolean = true;
	private _forceSeparateMVP:boolean = false;

	public get shader():ShaderBase
	{
		return this._shader;
	}

	public get animationSet():IAnimationSet
	{
		return <IAnimationSet> (<MaterialBase> this._renderMaterial.material).animationSet;
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
	constructor(renderMaterial:_Render_MaterialBase, renderElements:_Render_ElementsBase)
	{
		super();

		this._renderMaterial = renderMaterial;
		this._renderElements = renderElements;
		this._stage = renderElements.stage;
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
		this._renderMaterial = null;
		this._renderElements = null;
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
	public _setRenderState(renderState:_Render_RenderableBase, view:View):void
	{
		this._shader._setRenderState(renderState, view.projection);
	}

	/**
	 * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
	 * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
	 * @param stage The Stage object which is currently used for rendering.
	 * @param camera The camera from which the scene is viewed.
	 * @private
	 */
	public _activate(view:View):void
	{
		this._shader._activate(view.projection);
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
        shader.alphaThreshold = (<MaterialBase> this._renderMaterial.material).alphaThreshold;
        shader.useImageRect = (<MaterialBase> this._renderMaterial.material).imageRect;
        shader.usesCurves = (<MaterialBase> this._renderMaterial.material).curves;
        shader.useAlphaPremultiplied = (<MaterialBase> this._renderMaterial.material).alphaPremultiplied;
        shader.useBothSides = (<MaterialBase> this._renderMaterial.material).bothSides;
        shader.usesUVTransform = (<MaterialBase> this._renderMaterial.material).animateUVs;
        shader.usesColorTransform = (<MaterialBase> this._renderMaterial.material).useColorTransform;
		
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