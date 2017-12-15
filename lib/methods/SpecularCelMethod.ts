import {SpecularBasicMethod} from "./SpecularBasicMethod";
import {SpecularCompositeMethod} from "./SpecularCompositeMethod";

/**
 * SpecularCelMethod provides a shading method to add specular cel (cartoon) shading.
 */
export class SpecularCelMethod extends SpecularCompositeMethod
{
	private _smoothness:number;
	private _specularCutOff:number;

	public static assetType:string = "[asset SpecularCelMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return SpecularCelMethod.assetType;
	}

	/**
	 * The smoothness of the highlight edge.
	 */
	public get smoothness():number
	{
		return this._smoothness;
	}

	public set smoothness(value:number)
	{
		if (this._smoothness == value)
			return;

		this._smoothness = value;

		this.invalidate();
	}

	/**
	 * The threshold at which the specular highlight should be shown.
	 */
	public get specularCutOff():number
	{
		return this._specularCutOff;
	}

	public set specularCutOff(value:number)
	{
		if (this._specularCutOff == value)
			return;

		this._specularCutOff = value;

		this.invalidate();
	}

	/**
	 * Creates a new SpecularCelMethod object.
	 * @param specularCutOff The threshold at which the specular highlight should be shown.
	 * @param smoothness The smoothness of the highlight edge.
	 * @param baseMethod An optional specular method on which the cartoon shading is based. If ommitted, SpecularBasicMethod is used.
	 */
	constructor(specularCutOff:number = 0.5, smoothness:number = 0.1, baseMethod:SpecularBasicMethod | SpecularCompositeMethod = null)
	{
		super(baseMethod);

		this._specularCutOff = specularCutOff;
		this._smoothness = smoothness;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";

import {_Shader_LightingCompositeMethod} from "./CompositeMethodBase";
import {_IShader_LightingMethod} from "./_IShader_LightingMethod";

/**
 * _Shader_SpecularCelMethod provides a shading method to add specular cel (cartoon) shading.
 */
export class _Shader_SpecularCelMethod extends _Shader_LightingCompositeMethod
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

        (<_IShader_LightingMethod> this._baseChunk)._modulateFunction = (targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => this.clampSpecular(targetReg, registerCache, sharedRegisters);
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

ShaderBase.registerAbstraction(_Shader_SpecularCelMethod, SpecularCelMethod);