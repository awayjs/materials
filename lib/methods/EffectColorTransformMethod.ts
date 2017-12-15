import {ColorTransform} from "@awayjs/core";

import {MethodBase, _Shader_MethodBase} from "./MethodBase";

/**
 * EffectColorTransformMethod provides a shading method that changes the colour of a material analogous to a
 * ColorTransform object.
 */
export class EffectColorTransformMethod extends MethodBase
{
	private _colorTransform:ColorTransform;

	public static assetType:string = "[asset EffectColorTransformMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectColorTransformMethod.assetType;
	}

	/**
	 * The ColorTransform object to transform the colour of the material with.
	 */
	public get colorTransform():ColorTransform
	{
		return this._colorTransform;
	}

	public set colorTransform(value:ColorTransform)
	{
		this._colorTransform = value;

		this.invalidate();
	}

	/**
	 * Creates a new EffectColorTransformMethod.
	 */
	constructor(colorTransform:ColorTransform = null)
	{
		super();

		this._colorTransform = colorTransform;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase} from "@awayjs/renderer";

/**
 * EffectColorTransformChumk provides a shading method that changes the colour of a material analogous to a
 * ColorTransform object.
 */
export class _Shader_EffectColorTransformMethod extends _Shader_MethodBase
{
    private _method:EffectColorTransformMethod;
    private _shader:ShaderBase;

    private _colorTransformIndex:number;

    /**
     * Creates a new EffectColorTransformChumk.
     */
    constructor(method:EffectColorTransformMethod, shader:ShaderBase)
    {
        super(method, shader);

        this._method = method;
        this._shader = shader;
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";
        var colorMultReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
        var colorOffsReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

        this._colorTransformIndex = colorMultReg.index*4;

        //TODO: AGAL <> GLSL

        code += "mul " + targetReg + ", " + targetReg + ", " + colorMultReg + "\n" +
            "add " + targetReg + ", " + targetReg + ", " + colorOffsReg + "\n";

        return code;
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        if (this._invalid) {
            var index:number = this._colorTransformIndex;
            var data:Float32Array = this._shader.fragmentConstantData;
            var rawData:Float32Array = this._method.colorTransform._rawData;

            data[index] = rawData[0];
            data[index + 1] = rawData[1];
            data[index + 2] = rawData[2];
            data[index + 3] = rawData[3];
            data[index + 4] = rawData[4];
            data[index + 5] = rawData[5];
            data[index + 6] = rawData[6];
            data[index + 7] = rawData[7];
        }
    }
}

ShaderBase.registerAbstraction(_Shader_EffectColorTransformMethod, EffectColorTransformMethod);