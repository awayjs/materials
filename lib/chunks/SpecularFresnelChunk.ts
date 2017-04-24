import {ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {LightingShader} from "@awayjs/renderer";

import {SpecularFresnelMethod} from "../methods/SpecularFresnelMethod";

import {ILightingChunk} from "./ILightingChunk";
import {LightingCompositeChunk} from "./LightingCompositeChunk";

/**
 * SpecularFresnelChunk provides a specular shading method that causes stronger highlights on grazing view angles.
 */
export class SpecularFresnelChunk extends LightingCompositeChunk
{
	private _method:SpecularFresnelMethod;
	private _shader:LightingShader;
	private _fresnelDataRegister:ShaderRegisterElement;
	private _fresnelDataIndex:number;

	/**
	 * Creates a new SpecularFresnelChunk object.
	 */
	constructor(method:SpecularFresnelMethod, shader:LightingShader)
	{
		super(method, shader);

		this._method = method;
		this._shader = shader;

		(<ILightingChunk> this._baseChunk)._modulateFunction = (targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => this.modulateSpecular(targetReg, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public _cleanCompilationData():void
	{
		super._cleanCompilationData();
		
		this._fresnelDataRegister = null;
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		super._activate();

		if (this._invalid) {
			var data:Float32Array = this._shader.fragmentConstantData;
			var index:number = this._fresnelDataIndex;
			data[index] = (<SpecularFresnelMethod> this._method).normalReflectance;
			data[index + 1] = (<SpecularFresnelMethod> this._method).fresnelPower;
			data[index + 2] = 1;
			data[index + 3] = 0;
		}	
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentPreLightingCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._fresnelDataRegister = registerCache.getFreeFragmentConstant();

		this._fresnelDataIndex = this._fresnelDataRegister.index*4;

		return super._getFragmentPreLightingCode(registerCache, sharedRegisters);
	}

	/**
	 * Applies the fresnel effect to the specular strength.
	 *
	 * @param vo The MethodVO object containing the method data for the currently compiled material pass.
	 * @param target The register containing the specular strength in the "w" component, and the half-vector/reflection vector in "xyz".
	 * @param regCache The register cache used for the shader compilation.
	 * @param sharedRegisters The shared registers created by the compiler.
	 * @return The AGAL fragment code for the method.
	 */
	private modulateSpecular(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string;

		code = "dp3 " + targetReg + ".y, " + sharedRegisters.viewDirFragment + ".xyz, " + ((<SpecularFresnelMethod> this._method).basedOnSurface? sharedRegisters.normalFragment : targetReg) + ".xyz\n" +   // dot(V, H)
			"sub " + targetReg + ".y, " + this._fresnelDataRegister + ".z, " + targetReg + ".y\n" +             // base = 1-dot(V, H)
			"pow " + targetReg + ".x, " + targetReg + ".y, " + this._fresnelDataRegister + ".y\n" +             // exp = pow(base, 5)
			"sub " + targetReg + ".y, " + this._fresnelDataRegister + ".z, " + targetReg + ".y\n" +             // 1 - exp
			"mul " + targetReg + ".y, " + this._fresnelDataRegister + ".x, " + targetReg + ".y\n" +             // f0*(1 - exp)
			"add " + targetReg + ".y, " + targetReg + ".x, " + targetReg + ".y\n" +          // exp + f0*(1 - exp)
			"mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";

		return code;
	}

}