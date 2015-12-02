import Camera							= require("awayjs-display/lib/entities/Camera");
import TextureBase						= require("awayjs-display/lib/textures/TextureBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import RenderableBase					= require("awayjs-renderergl/lib/renderables/RenderableBase");
import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

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

		if (this._secondaryNormalMap)
			this.iAddTexture(this._secondaryNormalMap);
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO)
	{
		var index:number = methodVO.fragmentConstantsIndex;
		var data:Float32Array = shader.fragmentConstantData;
		data[index] = .5;
		data[index + 1] = 0;
		data[index + 2] = 0;
		data[index + 3] = 1;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:ShaderBase, methodVO:MethodVO)
	{
		super.iInitVO(shader, methodVO);
		
		if (this._secondaryNormalMap) {
			methodVO.secondaryTextureVO = shader.getTextureVO(this._secondaryNormalMap);
			shader.uvDependencies++;
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

		if (this._secondaryNormalMap)
			this.iRemoveTexture(this._secondaryNormalMap);

		this._secondaryNormalMap = value;

		if (this._secondaryNormalMap)
			this.iAddTexture(this._secondaryNormalMap);

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
	public iActivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shader, methodVO, stage);

		var data:Float32Array = shader.fragmentConstantData;
		var index:number = methodVO.fragmentConstantsIndex;

		data[index + 4] = this._water1OffsetX;
		data[index + 5] = this._water1OffsetY;
		data[index + 6] = this._water2OffsetX;
		data[index + 7] = this._water2OffsetY;

		if (this._secondaryNormalMap)
			methodVO.secondaryTextureVO.activate(shader);
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shader:ShaderBase, methodVO:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
	{
		super.iSetRenderState(shader, methodVO, renderable, stage, camera);

		if (this._secondaryNormalMap)
			methodVO.secondaryTextureVO._setRenderState(renderable, shader);
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

		code += "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".xyxy\n";

		if (this.normalMap)
			code += methodVO.textureVO._iGetFragmentCode(shader, targetReg, registerCache, sharedRegisters, temp);

		code += "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".zwzw\n";

		if (this._secondaryNormalMap)
			code += methodVO.secondaryTextureVO._iGetFragmentCode(shader, temp, registerCache, sharedRegisters, temp);

		code +=	"add " + targetReg + ", " + targetReg + ", " + temp + "		\n" +
			"mul " + targetReg + ", " + targetReg + ", " + dataReg + ".x	\n" +
			"sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx	\n" +
			"nrm " + targetReg + ".xyz, " + targetReg + ".xyz							\n";

		return code;
	}
}

export = NormalSimpleWaterMethod;