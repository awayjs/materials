import {Stage} from "@awayjs/stage";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";
import {DiffuseCelMethod} from "../methods/DiffuseCelMethod";

import {ILightingChunk} from "./ILightingChunk";
import {LightingCompositeChunk} from "./LightingCompositeChunk";

/**
 * DiffuseCelChunk provides a shading method to add diffuse cel (cartoon) shading.
 */
export class DiffuseCelChunk extends LightingCompositeChunk
{
	private _method:DiffuseCelMethod;
	private _shader:LightingShader;
	private _clampDataRegister:ShaderRegisterElement;
	private _clampDataIndex:number;

	/**
	 * Creates a new DiffuseCelChunk object.
	 * @param levels The amount of shadow gradations.
	 * @param baseMethod An optional diffuse method on which the cartoon shading is based. If omitted, DiffuseBasicMethod is used.
	 */
	constructor(method:DiffuseCelMethod, shader:LightingShader)
	{
		super(method, shader);

		this._method = method;
		this._shader = shader;

		(<ILightingChunk> this._baseChunk)._modulateFunction = (targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => this.clampDiffuse(targetReg, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
		super._initConstants();

		var data:Float32Array = this._shader.fragmentConstantData;
		var index:number = this._clampDataIndex;
		data[index + 1] = 1;
		data[index + 2] = 0;
	}

	/**
	 * @inheritDoc
	 */
	public _cleanCompilationData():void
	{
		super._cleanCompilationData();
		this._clampDataRegister = null;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentPreLightingCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._clampDataRegister = registerCache.getFreeFragmentConstant();
		this._clampDataIndex = this._clampDataRegister.index*4;

		return super._getFragmentPreLightingCode(registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		super._activate();

		if (this._invalid) {
			var data:Float32Array = this._shader.fragmentConstantData;
			var index:number = this._clampDataIndex;
			data[index] = this._method.levels;
			data[index + 3] = this._method.smoothness;
		}
	}

	/**
	 * Snaps the diffuse shading of the wrapped method to one of the levels.
	 * @param vo The MethodVO used to compile the current shader.
	 * @param t The register containing the diffuse strength in the "w" component.
	 * @param regCache The register cache used for the shader compilation.
	 * @param sharedRegisters The shared register data for this shader.
	 * @return The AGAL fragment code for the method.
	 */
	private clampDiffuse(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "mul " + targetReg + ".w, " + targetReg + ".w, " + this._clampDataRegister + ".x\n" +
			"frc " + targetReg + ".z, " + targetReg + ".w\n" +
			"sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".z\n" +
			"mov " + targetReg + ".x, " + this._clampDataRegister + ".x\n" +
			"sub " + targetReg + ".x, " + targetReg + ".x, " + this._clampDataRegister + ".y\n" +
			"rcp " + targetReg + ".x," + targetReg + ".x\n" +
			"mul " + targetReg + ".w, " + targetReg + ".y, " + targetReg + ".x\n" +

			// previous clamped strength
			"sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".x\n" +

			// fract/epsilon (so 0 - epsilon will become 0 - 1)
			"div " + targetReg + ".z, " + targetReg + ".z, " + this._clampDataRegister + ".w\n" +
			"sat " + targetReg + ".z, " + targetReg + ".z\n" +

			"mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".z\n" +
			// 1-z
			"sub " + targetReg + ".z, " + this._clampDataRegister + ".y, " + targetReg + ".z\n" +
			"mul " + targetReg + ".y, " + targetReg + ".y, " + targetReg + ".z\n" +
			"add " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n" +
			"sat " + targetReg + ".w, " + targetReg + ".w\n";
	}
}