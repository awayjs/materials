import {Vector3D, Matrix3D, AbstractMethodError, ProjectionBase, AssetEvent} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {_Render_RenderableBase, ShaderBase, _Shader_TextureBase, ChunkVO, IRenderer, IView, IMapper} from "@awayjs/renderer";

import {LightBase} from "../lights/LightBase";
import {PointLight} from "../lights/PointLight";
import {DirectionalShadowMapper} from "./DirectionalShadowMapper";
import {LightingShader} from "../shaders/LightingShader";
import {ShadowMapperBase} from "./ShadowMapperBase";

import {GL_ShadowMapperBase} from "./GL_ShadowMapperBase";

/**
 * GL_PointShadowMapper provides an abstract method for simple (non-wrapping) shadow map methods.
 */
export class GL_PointShadowMapper extends GL_ShadowMapperBase
{
    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        super._initVO(chunkVO);

        chunkVO.needsGlobalFragmentPos = true;
    }

    /**
     * @inheritDoc
     */
    public _getVertexCode(regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        this._depthMapCoordReg = sharedRegisters.globalPositionVarying;

        return "";
    }
}