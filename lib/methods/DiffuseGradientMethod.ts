import {TextureBase} from "../textures/TextureBase";

import {DiffuseBasicMethod, _Shader_DiffuseBasicMethod} from "./DiffuseBasicMethod";

/**
 * DiffuseGradientMethod is an alternative to DiffuseBasicMethod in which the shading can be modulated with a gradient
 * to introduce color-tinted shading as opposed to the single-channel diffuse strength. This can be used as a crude
 * approximation to subsurface scattering (for instance, the mid-range shading for skin can be tinted red to similate
 * scattered light within the skin attributing to the final colour)
 */
export class DiffuseGradientMethod extends DiffuseBasicMethod
{
	private _gradient:TextureBase;

	public static assetType:string = "[asset DiffuseGradientMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return DiffuseGradientMethod.assetType;
	}

	/**
	 * A texture that contains the light colour based on the angle. This can be used to change the light colour
	 * due to subsurface scattering when the surface faces away from the light.
	 */
	public get gradient():TextureBase
	{
		return this._gradient;
	}

	public set gradient(value:TextureBase)
	{
		if (this._gradient == value)
			return;

		if (this._gradient)
			this.iRemoveTexture(this._gradient);

		this._gradient = value;

		if (this._gradient)
			this.iAddTexture(this._gradient);

		this.invalidateShaderProgram();
	}

	/**
	 * Creates a new DiffuseGradientMethod object.
	 * @param gradient A texture that contains the light colour based on the angle. This can be used to change
	 * the light colour due to subsurface scattering when the surface faces away from the light.
	 */
	constructor(gradient:TextureBase)
	{
		super();

		this._gradient = gradient;

		this.iAddTexture(this._gradient);
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {ShaderBase, _Render_RenderableBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";
import {ImageTexture2D} from "../textures/ImageTexture2D";

/**
 * _Shader_DiffuseGradientMethod is an alternative to _Shader_DiffuseBasicMethod in which the shading can be modulated with a gradient
 * to introduce color-tinted shading as opposed to the single-channel diffuse strength. This can be used as a crude
 * approximation to subsurface scattering (for instance, the mid-range shading for skin can be tinted red to similate
 * scattered light within the skin attributing to the final colour)
 */
export class _Shader_DiffuseGradientMethod extends _Shader_DiffuseBasicMethod
{
    private _gradient:_Shader_TextureBase;

    /**
     * Creates a new _Shader_DiffuseGradientMethod object.
     * @param gradient A texture that contains the light colour based on the angle. This can be used to change
     * the light colour due to subsurface scattering when the surface faces away from the light.
     */
    constructor(method:DiffuseGradientMethod, shader:LightingShader)
    {
        super(method, shader);
    }

    public _initVO(chunkVO:ChunkVO):void
    {
        super._initVO(chunkVO);

        this._gradient = <_Shader_TextureBase> this._shader.getAbstraction((<DiffuseGradientMethod> this._method).gradient || new ImageTexture2D());

        this._gradient._initVO(chunkVO);
    }

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        this._gradient._initConstants();
    }

    /**
     * @inheritDoc
     */
    public _getFragmentPreLightingCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = super._getFragmentPreLightingCode(registerCache, sharedRegisters);

        this._pIsFirstLight = true;

        return code;
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCodePerLight(lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";
        var t:ShaderRegisterElement;

        // write in temporary if not first light, so we can add to total diffuse colour
        if (this._pIsFirstLight)
            t = this._totalLightColorReg;
        else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }

        code += "dp3 " + t + ".w, " + lightDirReg + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
            "mul " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".x\n" +
            "add " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".x\n" +
            "mul " + t + ".xyz, " + t + ".w, " + lightDirReg + ".w\n";

        if (this._modulateFunction != null)
            code += this._modulateFunction(t, registerCache, sharedRegisters);

        code += this._gradient._getFragmentCode(t, registerCache, sharedRegisters, t) +
            //					"mul " + t + ".xyz, " + t + ".xyz, " + t + ".w\n" +
            "mul " + t + ".xyz, " + t + ".xyz, " + lightColReg + ".xyz\n";

        if (!this._pIsFirstLight) {
            code += "add " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ".xyz, " + t + ".xyz\n";
            registerCache.removeFragmentTempUsage(t);
        }

        this._pIsFirstLight = false;

        return code;
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        super._activate();

        this._gradient.activate();
    }


    /**
     * @inheritDoc
     */
    public _setRenderState(renderState:_Render_RenderableBase, view:View):void
    {
        super._setRenderState(renderState, view);

        this._gradient._setRenderState(renderState);
    }
}

ShaderBase.registerAbstraction(_Shader_DiffuseGradientMethod, DiffuseGradientMethod);