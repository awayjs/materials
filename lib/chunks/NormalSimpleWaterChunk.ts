import {AssetEvent, ProjectionBase} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {RenderStateBase, ShaderBase, TextureStateBase, ChunkVO} from "@awayjs/renderer";

import {NormalSimpleWaterMethod} from "../methods/NormalSimpleWaterMethod";

import {NormalBasicChunk} from "./NormalBasicChunk";

/**
 * NormalSimpleWaterChunk provides a basic normal map method to create water ripples by translating two wave normal maps.
 */
export class NormalSimpleWaterChunk extends NormalBasicChunk
{
	private _secondaryNormalMap:TextureStateBase;
	private _fragmentConstantsIndex:number;
	
	/**
	 * Creates a new NormalHeightMapChunk.
	 */
	constructor(method:NormalSimpleWaterMethod, shader:ShaderBase)
	{
		super(method, shader);
	}

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
		super._initConstants();

		var index:number = this._fragmentConstantsIndex;
		var data:Float32Array = this._shader.fragmentConstantData;
		data[index] = .5;
		data[index + 1] = 0;
		data[index + 2] = 0;
		data[index + 3] = 1;
	}

	/**
	 * @inheritDoc
	 */
	public _initVO(chunkVO:ChunkVO):void
	{
		super._initVO(chunkVO);
		
		if ((<NormalSimpleWaterMethod> this._method).secondaryNormalMap) {
			this._secondaryNormalMap = <TextureStateBase> this._shader.getAbstraction((<NormalSimpleWaterMethod> this._method).secondaryNormalMap);
			this._shader.uvDependencies++;
		}
	}

	/**
	 * @inheritDoc
	 */
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._secondaryNormalMap = null;
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		super._activate();

		if (this._invalid) {
			var data:Float32Array = this._shader.fragmentConstantData;
			var index:number = this._fragmentConstantsIndex;

			data[index + 4] = (<NormalSimpleWaterMethod> this._method).water1OffsetX;
			data[index + 5] = (<NormalSimpleWaterMethod> this._method).water1OffsetY;
			data[index + 6] = (<NormalSimpleWaterMethod> this._method).water2OffsetX;
			data[index + 7] = (<NormalSimpleWaterMethod> this._method).water2OffsetY;
		}

		if (this._secondaryNormalMap)
			this._secondaryNormalMap.activate();
	}

	/**
	 * @inheritDoc
	 */
	public _setRenderState(renderState:RenderStateBase, projection:ProjectionBase):void
	{
		super._setRenderState(renderState, projection);

		if (this._secondaryNormalMap)
			this._secondaryNormalMap._setRenderState(renderState);
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);

		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataReg2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		this._fragmentConstantsIndex = dataReg.index*4;

		code += "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".xyxy\n";

		if (this._texture)
			code += this._texture._getFragmentCode(targetReg, registerCache, sharedRegisters, temp);

		code += "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".zwzw\n";

		if (this._secondaryNormalMap)
			code += this._secondaryNormalMap._getFragmentCode(temp, registerCache, sharedRegisters, temp);

		code +=	"add " + targetReg + ", " + targetReg + ", " + temp + "		\n" +
			"mul " + targetReg + ", " + targetReg + ", " + dataReg + ".x	\n" +
			"sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx	\n" +
			"nrm " + targetReg + ".xyz, " + targetReg + ".xyz							\n";

		return code;
	}
}