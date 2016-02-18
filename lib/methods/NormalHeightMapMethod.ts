import Single2DTexture					= require("awayjs-display/lib/textures/Single2DTexture");
import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import NormalBasicMethod				= require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
import ShadingMethodBase				= require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");

/**
 * NormalHeightMapMethod provides a normal map method that uses a height map to calculate the normals.
 */
class NormalHeightMapMethod extends NormalBasicMethod
{
	private _worldXYRatio:number;
	private _worldXZRatio:number;

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
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO)
	{
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		var data:Float32Array = shader.fragmentConstantData;
		data[index] = 1/(<Single2DTexture> this.texture).image2D.width;
		data[index + 1] = 1/(<Single2DTexture> this.texture).image2D.height;
		data[index + 2] = 0;
		data[index + 3] = 1;
		data[index + 4] = this._worldXYRatio;
		data[index + 5] = this._worldXZRatio;
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
	public copyFrom(method:ShadingMethodBase)
	{
		super.copyFrom(method);

		this._worldXYRatio = (<NormalHeightMapMethod> method)._worldXYRatio;
		this._worldXZRatio = (<NormalHeightMapMethod> method)._worldXZRatio;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);

		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataReg2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

		methodVO.fragmentConstantsIndex = dataReg.index*4;

		code+= methodVO.textureGL._iGetFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying) +

			"add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".xzzz\n" +

		methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) +

			"sub " + targetReg + ".x, " + targetReg + ".x, " + temp + ".x\n" +
			"add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".zyzz\n" +

		methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) +

			"sub " + targetReg + ".z, " + targetReg + ".z, " + temp + ".x\n" +
			"mov " + targetReg + ".y, " + dataReg + ".w\n" +
			"mul " + targetReg + ".xz, " + targetReg + ".xz, " + dataReg2 + ".xy\n" +
			"nrm " + targetReg + ".xyz, " + targetReg + ".xyz\n";

		registerCache.removeFragmentTempUsage(temp);

		return code;
	}
}

export = NormalHeightMapMethod;