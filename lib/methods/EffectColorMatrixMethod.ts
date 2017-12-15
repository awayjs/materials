import {MethodBase, _Shader_MethodBase} from "./MethodBase";

/**
 * EffectColorMatrixMethod provides a shading method that changes the colour of a material analogous to a ColorMatrixFilter.
 */
export class EffectColorMatrixMethod extends MethodBase
{
	private _matrix:Array<number>;


	public static assetType:string = "[asset EffectColorMatrixMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectColorMatrixMethod.assetType;
	}

	/**
	 * The 4 x 5 matrix to transform the color of the material.
	 */
	public get matrix():Array<number>
	{
		return this._matrix;
	}

	public set matrix(value:Array<number>)
	{
		if (value.length != 20)
			throw new Error("Matrix length must be 20!");

		this._matrix = value;

		this.invalidate();
	}

	/**
	 * Creates a new EffectColorTransformMethod.
	 *
	 * @param matrix An array of 20 items for 4 x 5 color transform.
	 */
	constructor(matrix:Array<number>)
	{
		super();

		if (matrix.length != 20)
			throw new Error("Matrix length must be 20!");

		this._matrix = matrix;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase} from "@awayjs/renderer";

/**
 * _Shader_EffectColorMatrixMethod provides a shading method that changes the colour of a material analogous to a ColorMatrixFilter.
 */
export class _Shader_EffectColorMatrixMethod extends _Shader_MethodBase
{
    private _method:EffectColorMatrixMethod;
    private _shader:ShaderBase;

    private _colorMatrixIndex:number;

    /**
     * Creates a new _Shader_EffectColorMatrixMethod
     *
     * @param method
     * @param shader
     */
    constructor(method:EffectColorMatrixMethod, shader:ShaderBase)
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
        registerCache.getFreeFragmentConstant();
        registerCache.getFreeFragmentConstant();
        registerCache.getFreeFragmentConstant();

        var colorOffsetReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

        this._colorMatrixIndex = colorMultReg.index*4;

        var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

        code += "m44 " + temp + ", " + targetReg + ", " + colorMultReg + "\n" +
            "add " + targetReg + ", " + temp + ", " + colorOffsetReg + "\n";

        return code;
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        if (this._invalid) {
            var matrix:Array<number> = this._method.matrix;
            var index:number = this._colorMatrixIndex;
            var data:Float32Array = this._shader.fragmentConstantData;

            // r
            data[index] = matrix[0];
            data[index + 1] = matrix[1];
            data[index + 2] = matrix[2];
            data[index + 3] = matrix[3];

            // g
            data[index + 4] = matrix[5];
            data[index + 5] = matrix[6];
            data[index + 6] = matrix[7];
            data[index + 7] = matrix[8];

            // b
            data[index + 8] = matrix[10];
            data[index + 9] = matrix[11];
            data[index + 10] = matrix[12];
            data[index + 11] = matrix[13];

            // a
            data[index + 12] = matrix[15];
            data[index + 13] = matrix[16];
            data[index + 14] = matrix[17];
            data[index + 15] = matrix[18];

            // rgba offset
            data[index + 16] = matrix[4];
            data[index + 17] = matrix[9];
            data[index + 18] = matrix[14];
            data[index + 19] = matrix[19];
        }
    }
}

ShaderBase.registerAbstraction(_Shader_EffectColorMatrixMethod, EffectColorMatrixMethod);