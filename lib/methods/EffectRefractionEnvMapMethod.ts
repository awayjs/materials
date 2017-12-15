import {TextureBase} from "../textures/TextureBase";

import {EffectEnvMapMethod, _Shader_EffectEnvMapMethod} from "./EffectEnvMapMethod";

/**
 * EffectRefractionEnvMapMethod provides a method to add refracted transparency based on cube maps.
 */
export class EffectRefractionEnvMapMethod extends EffectEnvMapMethod
{
	private _dispersionR:number = 0;
	private _dispersionG:number = 0;
	private _dispersionB:number = 0;
	private _refractionIndex:number;

	public static assetType:string = "[asset EffectRefractionEnvMapMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectRefractionEnvMapMethod.assetType;
	}

	/**
	 * The refractive index of the material.
	 */
	public get refractionIndex():number
	{
		return this._refractionIndex;
	}

	public set refractionIndex(value:number)
	{
		this._refractionIndex = value;

		this.invalidate();
	}

	/**
	 * The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
	 */
	public get dispersionR():number
	{
		return this._dispersionR;
	}

	public set dispersionR(value:number)
	{
		if (this._dispersionR == value)
			return;

		this._dispersionR = value;

		this.invalidateShaderProgram();
	}

	/**
	 * The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
	 */
	public get dispersionG():number
	{
		return this._dispersionG;
	}

	public set dispersionG(value:number)
	{
		if (this._dispersionG == value)
			return;

		this._dispersionG = value;

		this.invalidateShaderProgram();
	}

	/**
	 * The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
	 */
	public get dispersionB():number
	{
		return this._dispersionB;
	}

	public set dispersionB(value:number)
	{
		if (this._dispersionB == value)
			return;

		this._dispersionB = value;

		this.invalidateShaderProgram();
	}

	/**
	 * Creates a new EffectRefractionEnvMapMethod object. Example values for dispersion are: dispersionR: -0.03, dispersionG: -0.01, dispersionB: = .0015
	 *
	 * @param envMap The environment map containing the refracted scene.
	 * @param refractionIndex The refractive index of the material.
	 * @param dispersionR The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
	 * @param dispersionG The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
	 * @param dispersionB The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
	 */
	constructor(envMap:TextureBase, alpha:number = 1, refractionIndex:number = .1, dispersionR:number = 0, dispersionG:number = 0, dispersionB:number = 0)
	{
		super(envMap, alpha);

		this._refractionIndex = refractionIndex;

		this._dispersionR = dispersionR;
		this._dispersionG = dispersionG;
		this._dispersionB = dispersionB;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase, ChunkVO} from "@awayjs/renderer";

/**
 * EffectRefractionEnvMapMethod provides a method to add refracted transparency based on cube maps.
 */
export class _Shader_EffectRefractionEnvMapMethod extends _Shader_EffectEnvMapMethod
{
    private _useDispersion:boolean;

    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        super._initVO(chunkVO);

        this._useDispersion = !((<EffectRefractionEnvMapMethod> this._method).dispersionR == (<EffectRefractionEnvMapMethod> this._method).dispersionB && (<EffectRefractionEnvMapMethod> this._method).dispersionR == (<EffectRefractionEnvMapMethod> this._method).dispersionG);
    }
    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        // todo: data2.x could use common reg, so only 1 reg is used
        var data:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
        var data2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
        var code:string = "";
        var refractionDir:ShaderRegisterElement;
        var refractionColor:ShaderRegisterElement;
        var temp:ShaderRegisterElement;

        this._fragmentIndex = data.index*4;

        refractionDir = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(refractionDir, 1);
        refractionColor = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(refractionColor, 1);
        temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);

        var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;
        var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;

        code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";

        code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
            "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
            "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
            "mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" +
            "mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" +
            "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
            "sqt " + temp + ".y, " + temp + ".w\n" +

            "mul " + temp + ".x, " + data + ".x, " + temp + ".x\n" +
            "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
            "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +

            "mul " + refractionDir + ", " + data + ".x, " + viewDirReg + "\n" +
            "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
            "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" +
            this._envMap._getFragmentCode(refractionColor, registerCache, sharedRegisters, refractionDir) +
            "sub " + refractionColor + ".w, " + refractionColor + ".w, fc0.x	\n" +
            "kil " + refractionColor + ".w\n";

        if (this._useDispersion) {
            // GREEN
            code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
                "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
                "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
                "mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" +
                "mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" +
                "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
                "sqt " + temp + ".y, " + temp + ".w\n" +

                "mul " + temp + ".x, " + data + ".y, " + temp + ".x\n" +
                "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
                "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +

                "mul " + refractionDir + ", " + data + ".y, " + viewDirReg + "\n" +
                "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
                "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" +
                this._envMap._getFragmentCode(temp, registerCache, sharedRegisters, refractionDir) +
                "mov " + refractionColor + ".y, " + temp + ".y\n";

            // BLUE
            code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
                "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
                "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
                "mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" +
                "mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" +
                "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
                "sqt " + temp + ".y, " + temp + ".w\n" +

                "mul " + temp + ".x, " + data + ".z, " + temp + ".x\n" +
                "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
                "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +

                "mul " + refractionDir + ", " + data + ".z, " + viewDirReg + "\n" +
                "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
                "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" +
                this._envMap._getFragmentCode(temp, registerCache, sharedRegisters, refractionDir) +
                "mov " + refractionColor + ".z, " + temp + ".z\n";
        }

        code += "sub " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + targetReg + ".xyz\n" +
            "mul " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + data + ".w\n" +
            "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + refractionColor + ".xyz\n";

        registerCache.removeFragmentTempUsage(temp);
        registerCache.removeFragmentTempUsage(refractionDir);
        registerCache.removeFragmentTempUsage(refractionColor);

        // restore
        code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";

        return code;
    }

    protected _updateProperties()
    {
        var index:number = this._fragmentIndex;
        var data:Float32Array = this._shader.fragmentConstantData;
        var refractionIndex:number = (<EffectRefractionEnvMapMethod> this._method).refractionIndex;

        data[index] = (<EffectRefractionEnvMapMethod> this._method).dispersionR + refractionIndex;

        if (this._useDispersion) {
            data[index + 1] = (<EffectRefractionEnvMapMethod> this._method).dispersionG + refractionIndex;
            data[index + 2] = (<EffectRefractionEnvMapMethod> this._method).dispersionB + refractionIndex;
        }
        data[index + 3] = this._method.alpha;
    }
}

ShaderBase.registerAbstraction(_Shader_EffectRefractionEnvMapMethod, EffectRefractionEnvMapMethod);