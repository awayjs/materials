import {ProjectionBase} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {RenderStateBase, ShaderBase, TextureStateBase, ChunkVO} from "@awayjs/renderer";

import {EffectEnvMapMethod} from "../methods/EffectEnvMapMethod";

import {ShaderChunkBase} from "./ShaderChunkBase";

/**
 * EffectEnvMapChunk provides a material method to perform reflection mapping using cube maps.
 */
export class EffectEnvMapChunk extends ShaderChunkBase
{
	protected _method:EffectEnvMapMethod;
	protected _shader:ShaderBase;

	protected _envMap:TextureStateBase;
	protected _maskMap:TextureStateBase;
	protected _fragmentIndex:number;

	/**
	 * Creates a new EffectEnvMapChunk.
	 */
	constructor(method:EffectEnvMapMethod, shader:ShaderBase)
	{
		super(method, shader);

		this._method = method;
		this._shader = shader;
	}

	/**
	 * @inheritDoc
	 */
	public _initVO(chunkVO:ChunkVO):void
	{
		chunkVO.needsNormals = true;
		chunkVO.needsView = true;

		this._envMap = <TextureStateBase> this._shader.getAbstraction(this._method.envMap);

        this._envMap._initVO(chunkVO);

		if (this._method.mask) {
			this._maskMap = <TextureStateBase> this._shader.getAbstraction(this._method.mask);
			this._shader.uvDependencies++;
		} else if (this._maskMap) {
			this._maskMap = null;
		}
	}

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        this._envMap._initConstants();
    }

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		this._envMap = null;
		this._maskMap = null;
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		this._envMap.activate();

		if (this._maskMap)
			this._maskMap.activate();

		if (this._invalid)
			this._updateProperties();
	}

	public _setRenderState(renderState:RenderStateBase, projection:ProjectionBase):void
	{
		this._envMap._setRenderState(renderState);

		if (this._maskMap)
			this._maskMap._setRenderState(renderState);
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var alphaRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var code:string = "";

		this._fragmentIndex = alphaRegister.index*4;

		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp2, 1);

		// r = I - 2(I.N)*N
		code += "dp3 " + temp + ".w, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
			"add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" +
			"mul " + temp + ".xyz, " + sharedRegisters.normalFragment + ".xyz, " + temp + ".w\n" +
			"sub " + temp + ".xyz, " + temp + ".xyz, " + sharedRegisters.viewDirFragment + ".xyz\n" +
			this._envMap._getFragmentCode(temp, registerCache, sharedRegisters, temp) +
			"sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" + // -.5
			"kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
			"sub " + temp + ", " + temp + ", " + targetReg + "\n";

		if (this._maskMap) {
			code += this._maskMap._getFragmentCode(temp2, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
				"mul " + temp + ", " + temp2 + ", " + temp + "\n";
		}

		code += "mul " + temp + ", " + temp + ", " + alphaRegister + ".x\n" +
				"add " + targetReg + ", " + targetReg + ", " + temp + "\n";

		registerCache.removeFragmentTempUsage(temp);
		registerCache.removeFragmentTempUsage(temp2);

		return code;
	}

	protected _updateProperties()
	{
		this._shader.fragmentConstantData[this._fragmentIndex] = this._method.alpha;
	}
}