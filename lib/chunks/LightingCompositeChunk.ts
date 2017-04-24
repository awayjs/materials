import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ILightingChunk} from "./ILightingChunk";
import {CompositeChunkBase} from "./CompositeChunkBase";

/**
 * LightingCompositeBase provides a base class for diffuse methods that wrap a diffuse method to alter the
 * calculated diffuse reflection strength.
 */
export class LightingCompositeChunk extends CompositeChunkBase implements ILightingChunk
{
	public _totalLightColorReg:ShaderRegisterElement;

	public _modulateFunction:(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => string;

	/**
	 * @inheritDoc
	 */
	public _getFragmentPreLightingCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (<ILightingChunk> this._baseChunk)._getFragmentPreLightingCode(registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCodePerLight(lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = (<ILightingChunk> this._baseChunk)._getFragmentCodePerLight(lightDirReg, lightColReg, registerCache, sharedRegisters);

		this._totalLightColorReg = (<ILightingChunk> this._baseChunk)._totalLightColorReg;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCodePerProbe(cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = (<ILightingChunk> this._baseChunk)._getFragmentCodePerProbe(cubeMapReg, weightRegister, registerCache, sharedRegisters);

		this._totalLightColorReg = (<ILightingChunk> this._baseChunk)._totalLightColorReg;
		
		return code;
	}
}