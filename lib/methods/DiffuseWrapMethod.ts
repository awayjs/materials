import {DiffuseBasicMethod, _Shader_DiffuseBasicMethod} from "./DiffuseBasicMethod";

/**
 * DiffuseWrapMethod is an alternative to DiffuseBasicMethod in which the light is allowed to be "wrapped around" the normally dark area, to some extent.
 * It can be used as a crude approximation to Oren-Nayar or simple subsurface scattering.
 */
export class DiffuseWrapMethod extends DiffuseBasicMethod
{
	private _wrapFactor:number;

	public static assetType:string = "[asset DiffuseWrapMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return DiffuseWrapMethod.assetType;
	}

	/**
	 * A factor to indicate the amount by which the light is allowed to wrap.
	 */
	public get wrapFactor():number
	{
		return this._wrapFactor;
	}

	public set wrapFactor(value:number)
	{
		this._wrapFactor = value;
		this._wrapFactor = 1/(value + 1);

		this.invalidate();
	}

	/**
	 * Creates a new DiffuseWrapMethod object.
	 * @param wrapFactor A factor to indicate the amount by which the light is allowed to wrap
	 */
	constructor(wrapFactor:number = .5)
	{
		super();

		this.wrapFactor = wrapFactor;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";

/**
 * _Shader_DiffuseWrapMethod is an alternative to _Shader_DiffuseBasicMethod in which the light is allowed to be "wrapped around" the normally dark area, to some extent.
 * It can be used as a crude approximation to Oren-Nayar or simple subsurface scattering.
 */
export class _Shader_DiffuseWrapMethod extends _Shader_DiffuseBasicMethod
{
    private _wrapDataIndex:number;
    private _wrapDataRegister:ShaderRegisterElement;

    /**
     * Creates a new _Shader_DiffuseWrapMethod object.
     */
    constructor(method:DiffuseWrapMethod, shader:LightingShader)
    {
        super(method, shader);
    }

    /**
     * @inheritDoc
     */
    public _cleanCompilationData():void
    {
        super._cleanCompilationData();

        this._wrapDataRegister = null;
    }

    /**
     * @inheritDoc
     */
    public _getFragmentPreLightingCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = super._getFragmentPreLightingCode(registerCache, sharedRegisters);

        this._pIsFirstLight = true;

        this._wrapDataRegister = registerCache.getFreeFragmentConstant();
        this._wrapDataIndex = this._wrapDataRegister.index*4;

        return code;
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCodePerLight(lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";
        var t:ShaderRegisterElement;

        // write in temporary if not first light, so we can add to total diffuse colour
        if (this._pIsFirstLight) {
            t = this._totalLightColorReg;
        } else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }

        code += "dp3 " + t + ".x, " + lightDirReg + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
            "add " + t + ".y, " + t + ".x, " + this._wrapDataRegister + ".x\n" +
            "mul " + t + ".y, " + t + ".y, " + this._wrapDataRegister + ".y\n" +
            "sat " + t + ".w, " + t + ".y\n" +
            "mul " + t + ".xz, " + t + ".w, " + lightDirReg + ".wz\n";

        if (this._modulateFunction != null)
            code += this._modulateFunction(lightDirReg, registerCache, sharedRegisters);

        code += "mul " + t + ", " + t + ".x, " + lightColReg + "\n";

        if (!this._pIsFirstLight) {
            code += "add " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ".xyz, " + t + ".xyz\n";
            registerCache.removeFragmentTempUsage(t);
        }

        this._pIsFirstLight = false;

        return code;
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        super._activate();

        if (this._invalid) {
            var index:number = this._wrapDataIndex;
            var data:Float32Array = this._shader.fragmentConstantData;
            data[index] = (<DiffuseWrapMethod> this._method).wrapFactor;
            data[index + 1] = 1/((<DiffuseWrapMethod> this._method).wrapFactor + 1);
        }
    }
}

ShaderBase.registerAbstraction(_Shader_DiffuseWrapMethod, DiffuseWrapMethod);