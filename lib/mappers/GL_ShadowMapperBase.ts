import {Vector3D, Matrix3D, AbstractMethodError, ProjectionBase, AssetEvent} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {_Render_RenderableBase, ShaderBase, _Shader_TextureBase, ChunkVO, IRenderer, IView, IMapper} from "@awayjs/renderer";

import {LightBase} from "../lights/LightBase";
import {PointLight} from "../lights/PointLight";
import {DirectionalShadowMapper} from "./DirectionalShadowMapper";
import {LightingShader} from "../shaders/LightingShader";
import {ShadowMapperBase} from "./ShadowMapperBase";

import {ShaderChunkBase} from "../chunks/ShaderChunkBase";

/**
 * GL_ShadowMapperBase provides an abstract method for simple (non-wrapping) shadow map methods.
 */
export class GL_ShadowMapperBase extends ShaderChunkBase
{
    private _fragmentAlphaIndex:number;

    protected _depthMapCoordReg:ShaderRegisterElement;

	protected _mapper:ShadowMapperBase;
	protected _shader:ShaderBase;

	protected _texture:_Shader_TextureBase;

	public autoUpdate:boolean = true;

    /**
     * @inheritDoc
     */
    public _cleanCompilationData():void
    {
        super._cleanCompilationData();

        this._depthMapCoordReg = null;
    }

    public get texture():_Shader_TextureBase
    {
        return this._texture;
    }
    /**
     * Wrappers that override the vertex shader need to set this explicitly
     */
    public get depthMapCoordReg():ShaderRegisterElement
    {
        return this._depthMapCoordReg;
    }

	/**
	 * Creates a new GL_ShadowMapperBase object.
	 */
	constructor(mapper:ShadowMapperBase, shader:ShaderBase)
	{
		super(mapper, shader);

		this._mapper = mapper;
		this._shader = shader;

        this._shader.renderMaterial.renderGroup.renderer._addMapper(this._mapper);
	}

    /**
     *
     */
    public onClear(event:AssetEvent):void
    {
        super.onClear(event);

        this._shader.renderMaterial.renderGroup.renderer._removeMapper(this._mapper);
    }


    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        this._texture = <_Shader_TextureBase> this._shader.getAbstraction(this._mapper.textureMap);

        this._texture._initVO(chunkVO);
    }

    public _initConstants():void
    {
        this._texture._initConstants();
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegs:ShaderRegisterData):string
    {
        var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
        this._fragmentAlphaIndex = dataReg.index*4;

        return "add " + targetReg + ".w, " + targetReg + ".w, " + dataReg + ".x\n" + // add alpha
            "sat " + targetReg + ".w, " + targetReg + ".w\n";
    }


    /**
     * @inheritDoc
     */
    public _activate():void
    {
        var fragmentData:Float32Array = this._shader.fragmentConstantData;
        var index:number = this._fragmentAlphaIndex;

        fragmentData[index] = 1 - this._mapper.alpha;

        this._texture.activate();
    }

    /**
     * @inheritDoc
     */
    public _setRenderState(renderState:_Render_RenderableBase, projection:ProjectionBase):void
    {
        this._texture._setRenderState(renderState);
    }
}