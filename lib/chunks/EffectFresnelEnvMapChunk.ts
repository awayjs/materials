import {ProjectionBase} from "@awayjs/core";

import {GL_RenderableBase, ShaderBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {EffectEnvMapChunk} from "./EffectEnvMapChunk";

import {EffectFresnelEnvMapMethod} from "../methods/EffectFresnelEnvMapMethod";

/**
 * EffectFresnelEnvMapChunk provides a method to add fresnel-based reflectivity to an object using cube maps, which gets
 * stronger as the viewing angle becomes more grazing.
 */
export class EffectFresnelEnvMapChunk extends EffectEnvMapChunk
{

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var dataRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var code:string = "";
		var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;
		var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;

		this._fragmentIndex = dataRegister.index*4;

		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp2, 1);

		// r = V - 2(V.N)*N
		code += "dp3 " + temp + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
				"add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" +
				"mul " + temp + ".xyz, " + normalReg + ".xyz, " + temp + ".w\n" +
				"sub " + temp + ".xyz, " + temp + ".xyz, " + viewDirReg + ".xyz\n" +
			this._envMap._getFragmentCode(temp, registerCache, sharedRegisters, temp) +
				"sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" +               	// -.5
				"kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
				"sub " + temp + ", " + temp + ", " + targetReg + "\n";

		// calculate fresnel term
		code += "dp3 " + viewDirReg + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +  // dot(V, H)
				"sub " + viewDirReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" +       // base = 1-dot(V, H)
				"pow " + viewDirReg + ".w, " + viewDirReg + ".w, " + dataRegister + ".z\n" +       // exp = pow(base, 5)
				"sub " + normalReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" +        // 1 - exp
				"mul " + normalReg + ".w, " + dataRegister + ".y, " + normalReg + ".w\n" +         // f0*(1 - exp)
				"add " + viewDirReg + ".w, " + viewDirReg + ".w, " + normalReg + ".w\n" +          // exp + f0*(1 - exp)

				// total alpha
				"mul " + viewDirReg + ".w, " + dataRegister + ".x, " + viewDirReg + ".w\n";

		if (this._maskMap) {
			code += this._maskMap._getFragmentCode(temp2, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
				"mul " + viewDirReg + ".w, " + temp2 + ".x, " + viewDirReg + ".w\n";
		}

		// blend
		code += "mul " + temp + ", " + temp + ", " + viewDirReg + ".w\n" +
				"add " + targetReg + ", " + targetReg + ", " + temp + "\n";

		registerCache.removeFragmentTempUsage(temp);
		registerCache.removeFragmentTempUsage(temp2);

		return code;
	}

	protected _updateProperties()
	{
		var index:number = this._fragmentIndex;
		var data:Float32Array = this._shader.fragmentConstantData;

		data[index] = this._method.alpha;
		data[index + 1] = (<EffectFresnelEnvMapMethod> this._method).normalReflectance;
		data[index + 2] = (<EffectFresnelEnvMapMethod> this._method).fresnelPower;
	}
}