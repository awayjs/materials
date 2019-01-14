import {AssetBase} from "@awayjs/core";

import {TextureBase} from "../textures/TextureBase";
import {MethodEvent} from "../events/MethodEvent";
import {MaterialBase} from "../MaterialBase";


/**
 * MethodBase provides an abstract base method for shading methods, used by compiled passes to compile
 * the final shading program.
 */
export class MethodBase extends AssetBase
{
	public _textures:Array<TextureBase> = new Array<TextureBase>();

	public _owners:Array<MaterialBase> = new Array<MaterialBase>();
	public _counts:Array<number> = new Array<number>();

	/**
	 * Create a new MethodBase object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * Cleans up any resources used by the current object.
	 */
	public dispose():void
	{

	}


	public iAddOwner(owner:MaterialBase):void
	{
		//a method can be used more than once in the same material, so we check for this
		var index:number = this._owners.indexOf(owner);

		if (index != -1) {
			this._counts[index]++;
		} else {
			this._owners.push(owner);
			this._counts.push(1);

			//add textures
			var len:number = this._textures.length;
			for (var i:number = 0; i< len; i++)
				owner.addTexture(this._textures[i]);
		}
	}

	public iRemoveOwner(owner:MaterialBase):void
	{
		var index:number = this._owners.indexOf(owner);

		if (this._counts[index] != 1) {
			this._counts[index]--;
		} else {
			this._owners.splice(index, 1);
			this._counts.splice(index, 1);

			//remove textures
			var len:number = this._textures.length;
			for (var i:number = 0; i< len; i++)
				owner.removeTexture(this._textures[i]);
		}
	}


	/**
	 *
	 */
	public iAddTexture(texture:TextureBase):void
	{
		this._textures.push(texture);

		var len:number = this._owners.length;
		for (var i:number = 0; i < len; i++)
			this._owners[i].addTexture(texture);
	}

	/**
	 *
	 */
	public iRemoveTexture(texture:TextureBase):void
	{
		this._textures.splice(this._textures.indexOf(texture), 1);

		var len:number = this._owners.length;
		for (var i:number = 0; i < len; i++)
			this._owners[i].removeTexture(texture);
	}

	/**
	 * Marks the shader program as invalid, so it will be recompiled before the next render.
	 *
	 * @internal
	 */
	public invalidateShaderProgram():void
	{
		this.invalidate();

		this.dispatchEvent(new MethodEvent(MethodEvent.SHADER_INVALIDATED));
	}

	/**
	 * Copies the state from a MethodBase object into the current object.
	 */
	public copyFrom(method:MethodBase):void
	{
	}
}

import {AbstractionBase} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {_Render_RenderableBase, ShaderBase, ChunkVO} from "@awayjs/renderer";

import {_IShader_Method} from "./_IShader_Method";

/**
 * _Shader_MethodBase provides an abstract base method for shading methods, used by compiled passes to compile
 * the final shading program.
 */
export class _Shader_MethodBase extends AbstractionBase implements _IShader_Method
{
    public chunkVO:ChunkVO = new ChunkVO();

    /**
     * Create a new _Shader_MethodBase object.
     */
    constructor(method:MethodBase, shader:ShaderBase)
    {
        super(method, shader);
    }

    public _isUsed():boolean
    {
        return true;
    }

    public _usesTangentSpace():boolean
    {
        return true;
    }

    /**
     * Initializes the properties for a MethodVO, including register and texture indices.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    public _initVO(chunkVO:ChunkVO):void
    {

    }

    /**
     * Initializes unchanging shader constants using the data from a MethodVO.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    public _initConstants():void
    {

    }

    /**
     * Resets the compilation state of the method.
     *
     * @internal
     */
    public _reset(chunkVO:ChunkVO):void
    {
        this._invalid = true;

        chunkVO.useChunk = false;

        chunkVO.needsProjection = false;
        chunkVO.needsView = false;
        chunkVO.needsNormals = false;
        chunkVO.needsTangents = false;
        chunkVO.needsGlobalVertexPos = false;
        chunkVO.needsGlobalFragmentPos = false;

        this._cleanCompilationData();
    }

    /**
     * Resets the method's state for compilation.
     *
     * @internal
     */
    public _cleanCompilationData():void
    {

    }

    /**
     * Get the vertex shader code for this method.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     *
     * @internal
     */
    public _getVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        return "";
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        return "";
    }

    /**
     * Sets the render state for this method.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param stage The Stage object currently used for rendering.
     *
     * @internal
     */
    public _activate():void
    {

    }

    /**
     * Sets the render state for a single renderable.
     *
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param renderable The renderable currently being rendered.
     * @param stage The Stage object currently used for rendering.
     * @param camera The camera from which the scene is currently rendered.
     *
     * @internal
     */
    public _setRenderState(renderState:_Render_RenderableBase, view:View):void
    {

    }

    /**
     * Clears the render state for this method.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param stage The Stage object currently used for rendering.
     *
     * @internal
     */
    public _deactivate():void
    {
        this._invalid = false;
    }
}