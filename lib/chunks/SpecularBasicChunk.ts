import {AssetEvent, ProjectionBase} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {RenderStateBase, TextureStateBase, ChunkVO} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";
import {TextureBase} from "../textures/TextureBase";
import {SpecularBasicMethod} from "../methods/SpecularBasicMethod";

import {ILightingChunk} from "./ILightingChunk";
import {ShaderChunkBase} from "./ShaderChunkBase";

/**
 * SpecularBasicChunk provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
 * version of Phong specularity).
 */
export class SpecularBasicChunk extends ShaderChunkBase implements ILightingChunk
{
	public _totalLightColorReg:ShaderRegisterElement;
	public _specularTexData:ShaderRegisterElement;
	public _specularDataRegister:ShaderRegisterElement;

	public _specularDataIndex:number;

	protected _method:SpecularBasicMethod;
	protected _shader:LightingShader;

	protected _texture:TextureStateBase;

	public _pIsFirstLight:boolean;

	public _modulateFunction:(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => string;

	/**
	 * Creates a new EffectEnvMapChunk.
	 */
	constructor(method:SpecularBasicMethod, shader:LightingShader)
	{
		super(method, shader);

		this._method = method;
		this._shader = shader;
	}

	public _isUsed():boolean
	{
		if (!this._shader.numLights)
			return false;

		return true;
	}

	/**
	 * @inheritDoc
	 */
	public _initVO(chunkVO:ChunkVO):void
	{
		chunkVO.needsNormals = this._shader.numLights > 0;
		chunkVO.needsView = this._shader.numLights > 0;

		if (this._method.texture) {
			this._texture = <TextureStateBase> this._shader.getAbstraction(this._method.texture);
            this._texture._initVO(chunkVO);
			this._shader.uvDependencies++;
		} else if (this._texture) {
			this._texture = null;
		}
	}

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        if (this._method.texture)
            this._texture._initConstants();
    }

	/**
	 * @inheritDoc
	 */
	public _cleanCompilationData():void
	{
		super._cleanCompilationData();

		this._totalLightColorReg = null;
		this._specularTexData = null;
		this._specularDataRegister = null;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentPreLightingCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		this._pIsFirstLight = true;

		this._specularDataRegister = registerCache.getFreeFragmentConstant();
		this._specularDataIndex = this._specularDataRegister.index*4;

		if (this._texture) {

			this._specularTexData = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(this._specularTexData, 1);

			code += this._texture._getFragmentCode(this._specularTexData, registerCache, sharedRegisters, sharedRegisters.uvVarying);
		}

		this._totalLightColorReg = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(this._totalLightColorReg, 1);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCodePerLight(lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var t:ShaderRegisterElement;

		if (this._pIsFirstLight) {
			t = this._totalLightColorReg;
		} else {
			t = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(t, 1);
		}

		var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;
		var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;

		// blinn-phong half vector model
		code += "add " + t + ", " + lightDirReg + ", " + viewDirReg + "\n" +
				"nrm " + t + ".xyz, " + t + "\n" +
				"dp3 " + t + ".w, " + normalReg + ", " + t + "\n" +
				"sat " + t + ".w, " + t + ".w\n";

		if (this._texture) {
			// apply gloss modulation from texture
			code += "mul " + this._specularTexData + ".w, " + this._specularTexData + ".y, " + this._specularDataRegister + ".w\n" +
					"pow " + t + ".w, " + t + ".w, " + this._specularTexData + ".w\n";
		} else {
			code += "pow " + t + ".w, " + t + ".w, " + this._specularDataRegister + ".w\n";
		}

		// attenuate
		if (this._shader.usesLightFallOff)
			code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";

		if (this._modulateFunction != null)
			code += this._modulateFunction(t, registerCache, sharedRegisters);

		code += "mul " + t + ".xyz, " + lightColReg + ", " + t + ".w\n";

		if (!this._pIsFirstLight) {
			code += "add " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + t + "\n";
			registerCache.removeFragmentTempUsage(t);
		}

		this._pIsFirstLight = false;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCodePerProbe(cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var t:ShaderRegisterElement;

		// write in temporary if not first light, so we can add to total diffuse colour
		if (this._pIsFirstLight) {
			t = this._totalLightColorReg;
		} else {
			t = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(t, 1);
		}

		var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;
		var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;

		code += "dp3 " + t + ".w, " + normalReg + ", " + viewDirReg + "\n" +
				"add " + t + ".w, " + t + ".w, " + t + ".w\n" +
				"mul " + t + ", " + t + ".w, " + normalReg + "\n" +
				"sub " + t + ", " + t + ", " + viewDirReg + "\n" +
				"tex " + t + ", " + t + ", " + cubeMapReg + " <cube," + "linear" + ",miplinear>\n" +
				"mul " + t + ".xyz, " + t + ", " + weightRegister + "\n";

		if (this._modulateFunction != null)
			code += this._modulateFunction(t, registerCache, sharedRegisters);

		if (!this._pIsFirstLight) {
			code += "add " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + t + "\n";
			registerCache.removeFragmentTempUsage(t);
		}

		this._pIsFirstLight = false;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (sharedRegisters.shadowTarget)
			code += "mul " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";

		if (this._texture) {
			// apply strength modulation from texture
			code += "mul " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + this._specularTexData + ".x\n";
			registerCache.removeFragmentTempUsage(this._specularTexData);
		}

		// apply material's specular reflection
		code += "mul " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + this._specularDataRegister + "\n" +
			"add " + targetReg + ".xyz, " + targetReg + ", " + this._totalLightColorReg + "\n";
		registerCache.removeFragmentTempUsage(this._totalLightColorReg);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		if (this._texture)
			this._texture.activate();

		if (this._invalid) {
			var index:number = this._specularDataIndex;
			var data:Float32Array = this._shader.fragmentConstantData;

			data[index] = (( this._method.color >> 16) & 0xff)/0xff*this._method.strength;
			data[index + 1] = (( this._method.color >> 8) & 0xff)/0xff*this._method.strength;
			data[index + 2] = ( this._method.color & 0xff)/0xff*this._method.strength;
			data[index + 3] = this._method.gloss;
		}
	}

	public _setRenderState(renderState:RenderStateBase, projection:ProjectionBase):void
	{
		if (this._texture)
			this._texture._setRenderState(renderState);
	}
}