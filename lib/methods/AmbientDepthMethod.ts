import {LightBase} from "../lights/LightBase";
import {ShadowMapperBase} from "../mappers/ShadowMapperBase";

import {AmbientBasicMethod, _Shader_AmbientBasicMethod} from "./AmbientBasicMethod";

/**
 * AmbientDepthMethod provides a debug method to visualise depth maps
 */
export class AmbientDepthMethod extends AmbientBasicMethod
{
	public _castingLight:LightBase;
	public _shadowMapper:ShadowMapperBase;

	public static assetType:string = "[asset AmbientDepthMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return AmbientDepthMethod.assetType;
	}

	/**
	 * Creates a new AmbientDepthMethod object.
	 */
	constructor(castingLight:LightBase)
	{
		super();
		this._castingLight = castingLight;
		castingLight.shadowsEnabled = true;
		this._shadowMapper = castingLight.shadowMapper;

		this.iAddTexture(castingLight.shadowMapper.textureMap);
	}

	/**
	 * The light casting the shadows.
	 */
	public get castingLight():LightBase
	{
		return this._castingLight;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

/**
 * AmbientDepthChunk provides a debug method to visualise depth maps
 */
export class _Shader_AmbientDepthMethod extends _Shader_AmbientBasicMethod
{
    private _decRegIndex:number;
    private _shadowTexture:_Shader_TextureBase

    /**
     * Creates a new AmbientBasicChunk object.
     */
    constructor(method:AmbientDepthMethod, shader:ShaderBase)
    {
        super(method, shader);

        this._shadowTexture = <_Shader_TextureBase> shader.getAbstraction(method.castingLight.shadowMapper.textureMap);
    }

    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        this._shadowTexture._initVO(chunkVO);
    }

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        this._shadowTexture._initConstants();

        var data:Float32Array = this._shader.fragmentConstantData;
        var index:number = this._decRegIndex;
        data[index] = 1.0;
        data[index + 1] = 1/255.0;
        data[index + 2] = 1/65025.0;
        data[index + 3] = 1/16581375.0;
    }

    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";
        var decReg:ShaderRegisterElement;

        var decReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
        this._decRegIndex = decReg.index*4;

        code += this._shadowTexture._getFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
            "dp4 " + targetReg + ".x, " + targetReg + ", " + decReg + "\n" +
            "mov " + targetReg + ".yz, " + targetReg + ".xx			\n" +
            "mov " + targetReg + ".w, " + decReg + ".x\n" +
            "sub " + targetReg + ".xyz, " + decReg + ".xxx, " + targetReg + ".xyz\n";

        return code;
    }
}

ShaderBase.registerAbstraction(_Shader_AmbientDepthMethod, AmbientDepthMethod);