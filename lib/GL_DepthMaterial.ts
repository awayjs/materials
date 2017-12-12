import {ProjectionBase} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {MaterialStatePool, ShaderBase, TextureStateBase} from "@awayjs/renderer";

import {GL_MaterialPassBase} from "./passes/GL_MaterialPassBase";

import {MaterialBase} from "./MaterialBase";
import {GL_MaterialBase} from "./GL_MaterialBase";

/**
 * GL_DepthMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export class GL_DepthMaterial extends GL_MaterialPassBase
{
	private _fragmentConstantsIndex:number;
	private _textureVO:TextureStateBase;

	/**
	 *
	 * @param pool
	 * @param surface
	 * @param elementsClass
	 * @param stage
	 */
	constructor(material:MaterialBase, materialStatePool:MaterialStatePool)
	{
		super(material, materialStatePool);

		this._shader = new ShaderBase(materialStatePool, this, this, this._stage);

		this._pAddPass(this);

        this.invalidate();
	}

	public invalidate():void
	{
		super.invalidate();

		this._textureVO = (<MaterialBase> this._material).getTextureAt(0)? <TextureStateBase> this._shader.getAbstraction((<MaterialBase> this._material).getTextureAt(0)) : null;
	}

	public _includeDependencies(shader:ShaderBase):void
	{
		super._includeDependencies(shader);

		shader.projectionDependencies++;

		if (shader.alphaThreshold > 0)
			shader.uvDependencies++;
	}


	public _initConstantData():void
	{
		var index:number = this._fragmentConstantsIndex;
		var data:Float32Array = this._shader.fragmentConstantData;
		data[index] = 1.0;
		data[index + 1] = 255.0;
		data[index + 2] = 65025.0;
		data[index + 3] = 16581375.0;
		data[index + 4] = 1.0/255.0;
		data[index + 5] = 1.0/255.0;
		data[index + 6] = 1.0/255.0;
		data[index + 7] = 0.0;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var targetReg:ShaderRegisterElement = sharedRegisters.shadedTarget;
		var dataReg1:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataReg2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

		this._fragmentConstantsIndex = dataReg1.index*4;

		var temp1:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp1, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp2, 1);

		code += "div " + temp1 + ", " + sharedRegisters.projectionFragment + ", " + sharedRegisters.projectionFragment + ".w\n" + //"sub ft2.z, fc0.x, ft2.z\n" +    //invert
			"mul " + temp1 + ", " + dataReg1 + ", " + temp1 + ".z\n" +
			"frc " + temp1 + ", " + temp1 + "\n" +
			"mul " + temp2 + ", " + temp1 + ".yzww, " + dataReg2 + "\n";

		//codeF += "mov ft1.w, fc1.w	\n" +
		//    "mov ft0.w, fc0.x	\n";

		if (this._textureVO && this._shader.alphaThreshold > 0) {

			var albedo:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
			code += this._textureVO._getFragmentCode(albedo, registerCache, sharedRegisters, sharedRegisters.uvVarying);

			var cutOffReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

			code += "sub " + albedo + ".w, " + albedo + ".w, " + cutOffReg + ".x\n" +
				"kil " + albedo + ".w\n";
		}

		code += "sub " + targetReg + ", " + temp1 + ", " + temp2 + "\n";

		registerCache.removeFragmentTempUsage(temp1);
		registerCache.removeFragmentTempUsage(temp2);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _activate(projection:ProjectionBase):void
	{
		super._activate(projection);

		if (this._textureVO && this._shader.alphaThreshold > 0) {
			this._textureVO.activate();

			this._shader.fragmentConstantData[this._fragmentConstantsIndex + 8] = this._shader.alphaThreshold;
		}
	}
}