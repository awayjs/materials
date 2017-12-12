import {ProjectionBase} from "@awayjs/core";

import {Stage, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {RenderStateBase, TextureStateBase, MaterialUtils, ChunkVO} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";
import {DiffuseGradientMethod} from "../methods/DiffuseGradientMethod";
import {ImageTexture2D} from "../textures/ImageTexture2D";

import {DiffuseBasicChunk} from "./DiffuseBasicChunk";

/**
 * DiffuseGradientChunk is an alternative to DiffuseBasicChunk in which the shading can be modulated with a gradient
 * to introduce color-tinted shading as opposed to the single-channel diffuse strength. This can be used as a crude
 * approximation to subsurface scattering (for instance, the mid-range shading for skin can be tinted red to similate
 * scattered light within the skin attributing to the final colour)
 */
export class DiffuseGradientChunk extends DiffuseBasicChunk
{
	private _gradient:TextureStateBase;

	/**
	 * Creates a new DiffuseGradientChunk object.
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

		this._gradient = <TextureStateBase> this._shader.getAbstraction((<DiffuseGradientMethod> this._method).gradient || new ImageTexture2D());

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
	public _setRenderState(renderState:RenderStateBase, projection:ProjectionBase):void
	{
		super._setRenderState(renderState, projection);

		this._gradient._setRenderState(renderState);
	}
}