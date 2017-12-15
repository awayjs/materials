import {SpecularBasicMethod, _Shader_SpecularBasicMethod} from "./SpecularBasicMethod";

/**
 * SpecularPhongMethod provides a specular method that provides Phong highlights.
 */
export class SpecularPhongMethod extends SpecularBasicMethod
{
	public static assetType:string = "[asset SpecularPhongMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return SpecularPhongMethod.assetType;
	}

	/**
	 * Creates a new SpecularPhongMethod object.
	 */
	constructor()
	{
		super();
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";

/**
 * _Shader_SpecularPhongMethod provides a specular method that provides Phong highlights.
 */
export class _Shader_SpecularPhongMethod extends _Shader_SpecularBasicMethod
{
    /**
     * Creates a new _Shader_SpecularPhongMethod object.
     */
    constructor(method:SpecularPhongMethod, shader:LightingShader)
    {
        super(method, shader);
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

        var viewDirReg:ShaderRegisterElement =sharedRegisters.viewDirFragment;
        var normalReg:ShaderRegisterElement =sharedRegisters.normalFragment;

        // phong model
        code += "dp3 " + t + ".w, " + lightDirReg + ", " + normalReg + "\n" + // sca1 = light.normal

            //find the reflected light vector R
            "add " + t + ".w, " + t + ".w, " + t + ".w\n" + // sca1 = sca1*2
            "mul " + t + ".xyz, " + normalReg + ", " + t + ".w\n" + // vec1 = normal*sca1
            "sub " + t + ".xyz, " + t + ", " + lightDirReg + "\n" + // vec1 = vec1 - light (light vector is negative)

            //smooth the edge as incidence angle approaches 90
            "add " + t + ".w, " + t + ".w, " +sharedRegisters.commons + ".w\n" + // sca1 = sca1 + smoothtep;
            "sat " + t + ".w, " + t + ".w\n" + // sca1 range 0 - 1
            "mul " + t + ".xyz, " + t + ", " + t + ".w\n" + // vec1 = vec1*sca1

            //find the dot product between R and V
            "dp3 " + t + ".w, " + t + ", " + viewDirReg + "\n" + // sca1 = vec1.view
            "sat " + t + ".w, " + t + ".w\n";

        if (this._texture) {
            // apply gloss modulation from texture
            code += "mul " + this._specularTexData + ".w, " + this._specularTexData + ".y, " + this._specularDataRegister + ".w\n" +
                "pow " + t + ".w, " + t + ".w, " + this._specularTexData + ".w\n";
        } else
            code += "pow " + t + ".w, " + t + ".w, " + this._specularDataRegister + ".w\n";

        // attenuate
        if (this._shader.usesLightFallOff)
            code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";

        if (this._modulateFunction != null)
            code += this._modulateFunction(t, registerCache, sharedRegisters);

        code += "mul " + t + ".xyz, " + lightColReg + ".xyz, " + t + ".w\n";

        if (!this._pIsFirstLight) {
            code += "add " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ".xyz, " + t + ".xyz\n";
            registerCache.removeFragmentTempUsage(t);
        }

        this._pIsFirstLight = false;

        return code;
    }
}

ShaderBase.registerAbstraction(_Shader_SpecularPhongMethod, SpecularPhongMethod);