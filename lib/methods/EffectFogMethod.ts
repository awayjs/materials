import {MethodBase, _Shader_MethodBase} from "./MethodBase";

/**
 * EffectFogMethod provides a method to add distance-based fog to a material.
 */
export class EffectFogMethod extends MethodBase
{
	private _minDistance:number;
	private _maxDistance:number;
	private _fogColor:number;

	public static assetType:string = "[asset EffectFogMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectFogMethod.assetType;
	}

	/**
	 * The distance from which the fog starts appearing.
	 */
	public get minDistance():number
	{
		return this._minDistance;
	}

	public set minDistance(value:number)
	{
		this._minDistance = value;

		this.invalidate();
	}

	/**
	 * The distance at which the fog is densest.
	 */
	public get maxDistance():number
	{
		return this._maxDistance;
	}

	public set maxDistance(value:number)
	{
		this._maxDistance = value;

		this.invalidate();
	}

	/**
	 * The colour of the fog.
	 */
	public get fogColor():number
	{
		return this._fogColor;
	}

	public set fogColor(value:number)
	{
		this._fogColor = value;

		this.invalidate();
	}

	/**
	 * Creates a new EffectFogMethod object.
	 * @param minDistance The distance from which the fog starts appearing.
	 * @param maxDistance The distance at which the fog is densest.
	 * @param fogColor The colour of the fog.
	 */
	constructor(minDistance:number = 0, maxDistance:number = 1000, fogColor:number = 0x808080)
	{
		super();
		this._minDistance = minDistance;
		this._maxDistance = maxDistance;
		this._fogColor = fogColor;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase, ChunkVO} from "@awayjs/renderer";

/**
 * _Shader_EffectFogMethod provides a method to add distance-based fog to a material.
 */
export class _Shader_EffectFogMethod extends _Shader_MethodBase
{
    private _method:EffectFogMethod;
    private _shader:ShaderBase;

    private _fogColorIndex:number;

    /**
     * Creates a new EffectEnvMapChunk.
     */
    constructor(method:EffectFogMethod, shader:ShaderBase)
    {
        super(method, shader);

        this._method = method;
        this._shader = shader;
    }

    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        chunkVO.needsProjection = true;
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        if (this._invalid) {
            var data:Float32Array = this._shader.fragmentConstantData;
            var index:number = this._fogColorIndex;
            var color:number = this._method.fogColor;

            data[index] = ((color >> 16) & 0xff)/0xff;
            data[index + 1] = ((color >> 8) & 0xff)/0xff;
            data[index + 2] = (color & 0xff)/0xff;
            data[index + 3] = 1;
            data[index + 4] = this._method.minDistance;
            data[index + 5] = 1/(this._method.maxDistance - this._method.minDistance);
            data[index + 6] = 0;
            data[index + 7] = 0;
        }
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var fogColor:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
        var fogData:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
        var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
        var code:string = "";

        this._fogColorIndex = fogColor.index*4;

        code += "sub " + temp2 + ".w, " + sharedRegisters.projectionFragment + ".z, " + fogData + ".x\n" +
            "mul " + temp2 + ".w, " + temp2 + ".w, " + fogData + ".y\n" +
            "sat " + temp2 + ".w, " + temp2 + ".w\n" +
            "sub " + temp + ", " + fogColor + ", " + targetReg + "\n" + // (fogColor- col)
            "mul " + temp + ", " + temp + ", " + temp2 + ".w\n" + // (fogColor- col)*fogRatio
            "add " + targetReg + ", " + targetReg + ", " + temp + "\n"; // fogRatio*(fogColor- col) + col

        registerCache.removeFragmentTempUsage(temp);

        return code;
    }
}

ShaderBase.registerAbstraction(_Shader_EffectFogMethod, EffectFogMethod);