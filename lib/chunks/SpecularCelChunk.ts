import {Stage, ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {LightingShader} from "@awayjs/renderer";

import {SpecularCelMethod} from "../methods/SpecularCelMethod";

import {ILightingChunk} from "./ILightingChunk";
import {LightingCompositeChunk} from "./LightingCompositeChunk";

/**
 * SpecularCelChunk provides a shading method to add specular cel (cartoon) shading.
 */
export class SpecularCelChunk extends LightingCompositeChunk
{
	private _method:SpecularCelMethod;
	private _shader:LightingShader;
	private _cutoffDataRegister:ShaderRegisterElement;
	private _cutoffDataIndex:number;

	/**
	 * Creates a new DiffuseCelChunk object.
	 * @param levels The amount of shadow gradations.
	 * @param baseMethod An optional diffuse method on which the cartoon shading is based. If omitted, DiffuseBasicMethod is used.
	 */
	constructor(method:SpecularCelMethod, shader:LightingShader)
	{
		super(method, shader);

		this._method = method;
		this._shader = shader;

		(<ILightingChunk> this._baseChunk)._modulateFunction = (targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => this.clampSpecular(targetReg, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		super._activate();

		if (this._invalid) {
			var index:number = this._cutoffDataIndex;
			var data:Float32Array = this._shader.fragmentConstantData;
			data[index] = (<SpecularCelMethod> this._method).smoothness;
			data[index + 1] = (<SpecularCelMethod> this._method).specularCutOff;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _cleanCompilationData():void
	{
		super._cleanCompilationData();

		this._cutoffDataRegister = null;
	}

	/**
	 * Snaps the specular shading strength of the wrapped method to zero or one, depending on whether or not it exceeds the specularCutOff
	 * @param vo The MethodVO used to compile the current shader.
	 * @param t The register containing the specular strength in the "w" component, and either the half-vector or the reflection vector in "xyz".
	 * @param regCache The register cache used for the shader compilation.
	 * @param sharedRegisters The shared register data for this shader.
	 * @return The AGAL fragment code for the method.
	 */
	private clampSpecular(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "sub " + targetReg + ".y, " + targetReg + ".w, " + this._cutoffDataRegister + ".y\n" + // x - cutoff
			"div " + targetReg + ".y, " + targetReg + ".y, " + this._cutoffDataRegister + ".x\n" + // (x - cutoff)/epsilon
			"sat " + targetReg + ".y, " + targetReg + ".y\n" +
			"sge " + targetReg + ".w, " + targetReg + ".w, " + this._cutoffDataRegister + ".y\n" +
			"mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentPreLightingCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._cutoffDataRegister = registerCache.getFreeFragmentConstant();
		this._cutoffDataIndex = this._cutoffDataRegister.index*4;

		return super._getFragmentPreLightingCode(registerCache, sharedRegisters);
	}
}