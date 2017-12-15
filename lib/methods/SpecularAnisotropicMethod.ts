import {SpecularBasicMethod, _Shader_SpecularBasicMethod} from "./SpecularBasicMethod";

/**
 * SpecularAnisotropicMethod provides a specular method resulting in anisotropic highlights. These are typical for
 * surfaces with microfacet details such as tiny grooves. In particular, this uses the Heidrich-Seidel distrubution.
 * The tangent vectors are used as the surface groove directions.
 */
export class SpecularAnisotropicMethod extends SpecularBasicMethod
{
	public static assetType:string = "[asset SpecularAnisotropicMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return SpecularAnisotropicMethod.assetType;
	}

	/**
	 * Creates a new SpecularAnisotropicMethod object.
	 */
	constructor()
	{
		super();
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase, ChunkVO} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";

/**
 * _Shader_SpecularAnisotropicMethod provides a specular method resulting in anisotropic highlights. These are typical for
 * surfaces with microfacet details such as tiny grooves. In particular, this uses the Heidrich-Seidel distrubution.
 * The tangent vectors are used as the surface groove directions.
 */
export class _Shader_SpecularAnisotropicMethod extends _Shader_SpecularBasicMethod
{

    /**
     * Creates a new EffectEnvMapChunk.
     */
    constructor(method:SpecularAnisotropicMethod, shader:LightingShader)
    {
        super(method, shader);
    }


    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        super._initVO(chunkVO);

        chunkVO.needsTangents = this._shader.numLights > 0;
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCodePerLight(lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";
        var t:ShaderRegisterElement;

        if (this._pIsFirstLight)
            t = this._totalLightColorReg;
        else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }

        // (sin(l,t) * sin(v,t) - cos(l,t)*cos(v,t)) ^ k

        code += "nrm " + t + ".xyz, " + sharedRegisters.tangentVarying + ".xyz\n" +
            "dp3 " + t + ".w, " + t + ".xyz, " + lightDirReg + ".xyz\n" +
            "dp3 " + t + ".z, " + t + ".xyz, " + sharedRegisters.viewDirFragment + ".xyz\n";

        // (sin(t.w) * sin(t.z) - cos(t.w)*cos(t.z)) ^ k
        code += "sin " + t + ".x, " + t + ".w\n" +
            "sin " + t + ".y, " + t + ".z\n" +
            // (t.x * t.y - cos(t.w)*cos(t.z)) ^ k
            "mul " + t + ".x, " + t + ".x, " + t + ".y\n" +
            // (t.x - cos(t.w)*cos(t.z)) ^ k
            "cos " + t + ".z, " + t + ".z\n" +
            "cos " + t + ".w, " + t + ".w\n" +
            // (t.x - t.w*t.z) ^ k
            "mul " + t + ".w, " + t + ".w, " + t + ".z\n" +
            // (t.x - t.w) ^ k
            "sub " + t + ".w, " + t + ".x, " + t + ".w\n";

        if (this._texture) {
            // apply gloss modulation from texture
            code += "mul " + this._specularTexData + ".w, " + this._specularTexData + ".y, " + this._specularDataRegister + ".w\n" +
                "pow " + t + ".w, " + t + ".w, " + this._specularTexData + ".w\n";
        } else
            code += "pow " + t + ".w, " + t + ".w, " + this._specularDataRegister + ".w\n";

        // attenuate
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

ShaderBase.registerAbstraction(_Shader_SpecularAnisotropicMethod, SpecularAnisotropicMethod);