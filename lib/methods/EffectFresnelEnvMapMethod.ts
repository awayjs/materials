import {TextureBase} from "../textures/TextureBase";

import {EffectEnvMapMethod, _Shader_EffectEnvMapMethod} from "./EffectEnvMapMethod";

/**
 * EffectFresnelEnvMapMethod provides a method to add fresnel-based reflectivity to an object using cube maps, which gets
 * stronger as the viewing angle becomes more grazing.
 */
export class EffectFresnelEnvMapMethod extends EffectEnvMapMethod
{
	private _fresnelPower:number;
	private _normalReflectance:number;

	public static assetType:string = "[asset EffectFresnelEnvMapMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectFresnelEnvMapMethod.assetType;
	}

	/**
	 * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
	 */
	public get fresnelPower():number
	{
		return this._fresnelPower;
	}

	public set fresnelPower(value:number)
	{
		this._fresnelPower = value;
	}

	/**
	 * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
	 */
	public get normalReflectance():number
	{
		return this._normalReflectance;
	}

	public set normalReflectance(value:number)
	{
		if (this._normalReflectance == value)
			return;
		
		this._normalReflectance = value;

		this.invalidate();
	}

	/**
	 * Creates a new <code>EffectFresnelEnvMapMethod</code> object.
	 *
	 * @param envMap The environment map containing the reflected scene.
	 * @param alpha The reflectivity of the material.
	 */
	constructor(envMap:TextureBase, alpha:number = 1, fresnelPower:number = 5, normalReflectance:number = 0)
	{
		super(envMap, alpha);

		this._fresnelPower = fresnelPower;
		this._normalReflectance = normalReflectance;
	}
}

import {ProjectionBase} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase} from "@awayjs/renderer";

/**
 * _Shader_EffectFresnelEnvMapMethod provides a method to add fresnel-based reflectivity to an object using cube maps, which gets
 * stronger as the viewing angle becomes more grazing.
 */
export class _Shader_EffectFresnelEnvMapMethod extends _Shader_EffectEnvMapMethod
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

ShaderBase.registerAbstraction(_Shader_EffectFresnelEnvMapMethod, EffectFresnelEnvMapMethod);