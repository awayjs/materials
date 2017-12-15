import {SpecularBasicMethod} from "./SpecularBasicMethod";
import {SpecularCompositeMethod} from "./SpecularCompositeMethod";

/**
 * SpecularFresnelMethod provides a specular shading method that causes stronger highlights on grazing view angles.
 */
export class SpecularFresnelMethod extends SpecularCompositeMethod
{
	private _basedOnSurface:boolean;
	private _fresnelPower:number;
	private _normalReflectance:number;

	public static assetType:string = "[asset SpecularFresnelMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return SpecularFresnelMethod.assetType;
	}

	/**
	 * Creates a new SpecularFresnelMethod object.
	 * @param basedOnSurface Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
	 * @param baseMethod The specular method to which the fresnel equation. Defaults to SpecularBasicMethod.
	 */
	constructor(basedOnSurface:boolean = true, fresnelPower:number = 5, normalReflectance:number = 0.028, baseMethod:SpecularBasicMethod | SpecularCompositeMethod = null)
	{
		super(baseMethod);

		this._basedOnSurface = basedOnSurface;
		this._fresnelPower = fresnelPower;
		this._normalReflectance = normalReflectance;
	}

	/**
	 * Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
	 */
	public get basedOnSurface():boolean
	{
		return this._basedOnSurface;
	}

	public set basedOnSurface(value:boolean)
	{
		if (this._basedOnSurface == value)
			return;

		this._basedOnSurface = value;

		this.invalidateShaderProgram();
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
		if (this._fresnelPower == value)
			return;
		
		this._fresnelPower = value;

		this.invalidate();
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
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";

import {_Shader_LightingCompositeMethod} from "./CompositeMethodBase";
import {_IShader_LightingMethod} from "./_IShader_LightingMethod";

/**
 * _Shader_SpecularFresnelMethod provides a specular shading method that causes stronger highlights on grazing view angles.
 */
export class _Shader_SpecularFresnelMethod extends _Shader_LightingCompositeMethod
{
    private _method:SpecularFresnelMethod;
    private _shader:LightingShader;
    private _fresnelDataRegister:ShaderRegisterElement;
    private _fresnelDataIndex:number;

    /**
     * Creates a new _Shader_SpecularFresnelMethod object.
     */
    constructor(method:SpecularFresnelMethod, shader:LightingShader)
    {
        super(method, shader);

        this._method = method;
        this._shader = shader;

        (<_IShader_LightingMethod> this._baseChunk)._modulateFunction = (targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => this.modulateSpecular(targetReg, registerCache, sharedRegisters);
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

ShaderBase.registerAbstraction(_Shader_SpecularFresnelMethod, SpecularFresnelMethod);