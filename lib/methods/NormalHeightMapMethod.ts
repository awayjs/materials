import {TextureBase} from "../textures/TextureBase";

import {NormalBasicMethod, _Shader_NormalBasicMethod} from "./NormalBasicMethod";
import {MethodBase} from "./MethodBase";

/**
 * NormalHeightMapMethod provides a normal map method that uses a height map to calculate the normals.
 */
export class NormalHeightMapMethod extends NormalBasicMethod
{
	private _worldXYRatio:number;
	private _worldXZRatio:number;

	public static assetType:string = "[asset NormalHeightMapMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return NormalHeightMapMethod.assetType;
	}

	public get worldXYRatio():number
	{
		return this._worldXYRatio;
	}

	public get worldXZRatio():number
	{
		return this._worldXZRatio;
	}
	
	/**
	 * Creates a new NormalHeightMapMethod method.
	 *
	 * @param heightMap The texture containing the height data. 0 means low, 1 means high.
	 * @param worldWidth The width of the 'world'. This is used to map uv coordinates' u component to scene dimensions.
	 * @param worldHeight The height of the 'world'. This is used to map the height map values to scene dimensions.
	 * @param worldDepth The depth of the 'world'. This is used to map uv coordinates' v component to scene dimensions.
	 */
	constructor(heightMap:TextureBase, worldWidth:number, worldHeight:number, worldDepth:number)
	{
		super();

		this.texture = heightMap;
		this._worldXYRatio = worldWidth/worldHeight;
		this._worldXZRatio = worldDepth/worldHeight;
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:MethodBase):void
	{
		super.copyFrom(method);

		this._worldXYRatio = (<NormalHeightMapMethod> method)._worldXYRatio;
		this._worldXZRatio = (<NormalHeightMapMethod> method)._worldXZRatio;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, Image2D} from "@awayjs/stage";

import {ShaderBase} from "@awayjs/renderer";

import {ImageTexture2D} from "../textures/ImageTexture2D";

/**
 * _Shader_NormalHeightMapMethod provides a normal map method that uses a height map to calculate the normals.
 */
export class _Shader_NormalHeightMapMethod extends _Shader_NormalBasicMethod
{
    private _fragmentConstantsIndex:number;

    /**
     * Creates a new _Shader_NormalHeightMapMethod.
     */
    constructor(method:NormalHeightMapMethod, shader:ShaderBase)
    {
        super(method, shader);
    }

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        super._initConstants();

        var index:number = this._fragmentConstantsIndex;
        var data:Float32Array = this._shader.fragmentConstantData;
        var image:Image2D = <Image2D> (<ImageTexture2D> this._method.texture).image;

        data[index] = 1/image.width;
        data[index + 1] = 1/image.height;
        data[index + 2] = 0;
        data[index + 3] = 1;
        data[index + 4] = (<NormalHeightMapMethod> this._method).worldXYRatio;
        data[index + 5] = (<NormalHeightMapMethod> this._method).worldXZRatio;
    }

    /**
     * @inheritDoc
     */
    public get tangentSpace():boolean
    {
        return false;
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";
        var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);

        var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
        var dataReg2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

        this._fragmentConstantsIndex = dataReg.index*4;

        code+= this._texture._getFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying) +

            "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".xzzz\n" +

            this._texture._getFragmentCode(temp, registerCache, sharedRegisters, temp) +

            "sub " + targetReg + ".x, " + targetReg + ".x, " + temp + ".x\n" +
            "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".zyzz\n" +

            this._texture._getFragmentCode(temp, registerCache, sharedRegisters, temp) +

            "sub " + targetReg + ".z, " + targetReg + ".z, " + temp + ".x\n" +
            "mov " + targetReg + ".y, " + dataReg + ".w\n" +
            "mul " + targetReg + ".xz, " + targetReg + ".xz, " + dataReg2 + ".xy\n" +
            "nrm " + targetReg + ".xyz, " + targetReg + ".xyz\n";

        registerCache.removeFragmentTempUsage(temp);

        return code;
    }
}

ShaderBase.registerAbstraction(_Shader_NormalHeightMapMethod, NormalHeightMapMethod);