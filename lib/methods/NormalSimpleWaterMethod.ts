import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import ShaderObjectBase					= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import NormalBasicMethod				= require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");

/**
 * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
 */
class NormalSimpleWaterMethod extends NormalBasicMethod
{
	private _secondaryNormalMap:TextureBase;
	private _water1OffsetX:number = 0;
	private _water1OffsetY:number = 0;
	private _water2OffsetX:number = 0;
	private _water2OffsetY:number = 0;

	/**
	 * Creates a new NormalSimpleWaterMethod object.
	 * @param waveMap1 A normal map containing one layer of a wave structure.
	 * @param waveMap2 A normal map containing a second layer of a wave structure.
	 */
	constructor(normalMap:TextureBase = null, secondaryNormalMap:TextureBase = null)
	{
		super(normalMap);

		this._secondaryNormalMap = secondaryNormalMap;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		var index:number = methodVO.fragmentConstantsIndex;
		var data:Array<number> = shaderObject.fragmentConstantData;
		data[index] = .5;
		data[index + 1] = 0;
		data[index + 2] = 0;
		data[index + 3] = 1;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		super.iInitVO(shaderObject, methodVO);
		
		if (this._secondaryNormalMap) {
			methodVO.secondaryTextureObject = shaderObject.getTextureObject(this._secondaryNormalMap);
			shaderObject.uvDependencies++;
		}
	}

	/**
	 * The translation of the first wave layer along the X-axis.
	 */
	public get water1OffsetX():number
	{
		return this._water1OffsetX;
	}

	public set water1OffsetX(value:number)
	{
		this._water1OffsetX = value;
	}

	/**
	 * The translation of the first wave layer along the Y-axis.
	 */
	public get water1OffsetY():number
	{
		return this._water1OffsetY;
	}

	public set water1OffsetY(value:number)
	{
		this._water1OffsetY = value;
	}

	/**
	 * The translation of the second wave layer along the X-axis.
	 */
	public get water2OffsetX():number
	{
		return this._water2OffsetX;
	}

	public set water2OffsetX(value:number)
	{
		this._water2OffsetX = value;
	}

	/**
	 * The translation of the second wave layer along the Y-axis.
	 */
	public get water2OffsetY():number
	{
		return this._water2OffsetY;
	}

	public set water2OffsetY(value:number)
	{
		this._water2OffsetY = value;
	}

	/**
	 * A second normal map that will be combined with the first to create a wave-like animation pattern.
	 */
	public get secondaryNormalMap():TextureBase
	{
		return this._secondaryNormalMap;
	}

	public set secondaryNormalMap(value:TextureBase)
	{
		if (this._secondaryNormalMap == value)
			return;

		this._secondaryNormalMap = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public dispose()
	{
		super.dispose();

		this._secondaryNormalMap = null;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shaderObject, methodVO, stage);

		var data:Array<number> = shaderObject.fragmentConstantData;
		var index:number = methodVO.fragmentConstantsIndex;

		data[index + 4] = this._water1OffsetX;
		data[index + 5] = this._water1OffsetY;
		data[index + 6] = this._water2OffsetX;
		data[index + 7] = this._water2OffsetY;

		if (this._secondaryNormalMap)
			methodVO.secondaryTextureObject.activate(shaderObject);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);

		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataReg2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		methodVO.fragmentConstantsIndex = dataReg.index*4;

		code += "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".xyxy\n";

		if (this.normalMap) {
			methodVO.textureObject._iInitRegisters(shaderObject, registerCache);

			code += methodVO.textureObject._iGetFragmentCode(shaderObject, targetReg, registerCache, temp);
		}

		code += "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".zwzw\n";

		if (this._secondaryNormalMap) {
			methodVO.secondaryTextureObject._iInitRegisters(shaderObject, registerCache);

			code += methodVO.secondaryTextureObject._iGetFragmentCode(shaderObject, temp, registerCache, temp);
		}

		code +=	"add " + targetReg + ", " + targetReg + ", " + temp + "		\n" +
			"mul " + targetReg + ", " + targetReg + ", " + dataReg + ".x	\n" +
			"sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx	\n" +
			"nrm " + targetReg + ".xyz, " + targetReg + ".xyz							\n";

		return code;
	}
}

export = NormalSimpleWaterMethod;