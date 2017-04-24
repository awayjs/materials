import {AssetEvent, ProjectionBase} from "@awayjs/core";

import {MappingMode} from "@awayjs/graphics";

import {GL_RenderableBase, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, GL_TextureBase} from "@awayjs/stage";

import {LightingShader} from "@awayjs/renderer";

import {ChunkVO} from "../data/ChunkVO";
import {DiffuseBasicMethod} from "../methods/DiffuseBasicMethod";

import {ILightingChunk} from "./ILightingChunk";
import {ShaderChunkBase} from "./ShaderChunkBase";

/**
 * DiffuseBasicChunk provides the default shading method for Lambert (dot3) diffuse lighting.
 */
export class DiffuseBasicChunk extends ShaderChunkBase implements ILightingChunk
{
	protected _method:DiffuseBasicMethod;
	protected _shader:LightingShader;

	protected _texture:GL_TextureBase;

	private _ambientColor:number;
	private _ambientColorR:number = 1;
	private _ambientColorG:number = 1;
	private _ambientColorB:number = 1;
	private _color:number = 0xffffff;
	private _colorR:number = 1;
	private _colorG:number = 1;
	private _colorB:number = 1;

	public _pIsFirstLight:boolean;

	private _ambientColorRegister:number;
	private _diffuseColorRegister:number;

	public _totalLightColorReg:ShaderRegisterElement;

	public _modulateFunction:(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => string;
	
	/**
	 * Creates a new DiffuseBasicChunk object.
	 */
	constructor(method:DiffuseBasicMethod, shader:LightingShader)
	{
		super(method, shader);

		this._method = method;
		this._shader = shader;
	}

	/**
	 *
	 */
	public onInvalidate(event:AssetEvent):void
	{
		super.onInvalidate(event);

		this._updateProperties();
	}

	public _isUsed():boolean
	{
		return Boolean(this._shader.numLights);
	}

	public _initVO(chunkVO:ChunkVO):void
	{
		if (this._method.texture) {
			this._texture = <GL_TextureBase> this._shader.getAbstraction(this._method.texture);

			if (this._method.texture.mappingMode == MappingMode.CUBE)
				chunkVO.needsNormals = true;
			else
				this._shader.uvDependencies++;

		} else if (this._texture) {
			this._texture = null;
		}

		if (this._shader.numLights) {
			this._shader.usesCommonData = true;
			chunkVO.needsNormals = true;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _initConstants():void
	{
		this._updateProperties();
	}

	/**
	 * @inheritDoc
	 */
	public _cleanCompilationData():void
	{
		super._cleanCompilationData();

		this._totalLightColorReg = null;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentPreLightingCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		this._pIsFirstLight = true;

		registerCache.addFragmentTempUsages(this._totalLightColorReg = registerCache.getFreeFragmentVectorTemp(), 1);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCodePerLight(lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var t:ShaderRegisterElement;

		// write in temporary if not first light, so we can add to total diffuse colour
		if (this._pIsFirstLight) {
			t = this._totalLightColorReg;
		} else {
			t = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(t, 1);
		}

		code += "dp3 " + t + ".x, " + lightDirReg + ", " + sharedRegisters.normalFragment + "\n" +
				"max " + t + ".w, " + t + ".x, " + sharedRegisters.commons + ".y\n";

		if (this._shader.usesLightFallOff)
			code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";

		if (this._modulateFunction != null)
			code += this._modulateFunction(t, registerCache, sharedRegisters);

		code += "mul " + t + ", " + t + ".w, " + lightColReg + "\n";

		if (!this._pIsFirstLight) {
			code += "add " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + t + "\n";
			registerCache.removeFragmentTempUsage(t);
		}

		this._pIsFirstLight = false;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCodePerProbe(cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var t:ShaderRegisterElement;

		// write in temporary if not first light, so we can add to total diffuse colour
		if (this._pIsFirstLight) {
			t = this._totalLightColorReg;
		} else {
			t = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(t, 1);
		}

		code += "tex " + t + ", " + sharedRegisters.normalFragment + ", " + cubeMapReg + " <cube,linear,miplinear>\n" +
				"mul " + t + ".xyz, " + t + ".xyz, " + weightRegister + "\n";

		if (this._modulateFunction != null)
			code += this._modulateFunction(t, registerCache, sharedRegisters);

		if (!this._pIsFirstLight) {
			code += "add " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + t + "\n";
			registerCache.removeFragmentTempUsage(t);
		}

		this._pIsFirstLight = false;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		var diffuseColor:ShaderRegisterElement;
		var cutOffReg:ShaderRegisterElement;

		// incorporate input from ambient
		if (sharedRegisters.shadowTarget)
			code += this._applyShadow(registerCache, sharedRegisters);

		registerCache.addFragmentTempUsages(diffuseColor = registerCache.getFreeFragmentVectorTemp(), 1);

		var ambientColorRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		this._ambientColorRegister = ambientColorRegister.index*4;

		if (this._texture) {
			code += this._texture._getFragmentCode(diffuseColor, registerCache, sharedRegisters, (this._method.texture.mappingMode == MappingMode.CUBE)? sharedRegisters.normalFragment : sharedRegisters.uvVarying);
		} else {
			var diffuseColorRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
			this._diffuseColorRegister = diffuseColorRegister.index*4;

			code += "mov " + diffuseColor + ", " + diffuseColorRegister + "\n";
		}

		code += "sat " + this._totalLightColorReg + ", " + this._totalLightColorReg + "\n" +
			"mul " + diffuseColor + ".xyz, " + diffuseColor + ", " + this._totalLightColorReg + "\n";

		if (this._method.multiply) {
			code += "add " + diffuseColor + ".xyz, " + diffuseColor + ", " + ambientColorRegister + "\n" +
				"mul " + targetReg + ".xyz, " + targetReg + ", " + diffuseColor + "\n";
		} else if (this._texture) {
			code += "mul " + targetReg + ".xyz, " + targetReg + ", " + ambientColorRegister + "\n" + // multiply target by ambient for total ambient
				"mul " + this._totalLightColorReg + ".xyz, " + targetReg + ", " + this._totalLightColorReg + "\n" +
				"sub " + targetReg + ".xyz, " + targetReg + ", " + this._totalLightColorReg + "\n" + // ambient * (1 - totalLightColor)
				"add " + targetReg + ".xyz, " + targetReg + ", " + diffuseColor + "\n"; //add diffuse color and ambient color
		} else {
			code += "mul " + this._totalLightColorReg + ".xyz, " + ambientColorRegister + ", " + this._totalLightColorReg + "\n" +
				"sub " + this._totalLightColorReg + ".xyz, " + ambientColorRegister + ", " + this._totalLightColorReg + "\n" + // ambient * (1 - totalLightColor)
				"add " + diffuseColor + ".xyz, " + diffuseColor + ", " + this._totalLightColorReg + "\n" + // add diffuse color and  ambient color
				"mul " + targetReg + ".xyz, " + targetReg + ", " + diffuseColor + "\n"; // multiply by target which could be texture or white
		}

		registerCache.removeFragmentTempUsage(this._totalLightColorReg);
		registerCache.removeFragmentTempUsage(diffuseColor);

		return code;
	}

	/**
	 * Generate the code that applies the calculated shadow to the diffuse light
	 * @param methodVO The MethodVO object for which the compilation is currently happening.
	 * @param regCache The register cache the compiler is currently using for the register management.
	 */
	public _applyShadow(regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "mul " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";
	}

	/**
	 * @inheritDoc
	 */
	public _activate():void
	{
		if (this._texture) {
			this._texture.activate();
		} else {
			var index:number = this._diffuseColorRegister;
			var data:Float32Array = this._shader.fragmentConstantData;
			if (this._method.multiply) {
				data[index] = this._colorR*this._ambientColorR;
				data[index + 1] = this._colorG*this._ambientColorG;
				data[index + 2] = this._colorB*this._ambientColorB;
			} else {
				data[index] = this._colorR;
				data[index + 1] = this._colorG;
				data[index + 2] = this._colorB;
			}
			data[index + 3] = 1;
		}
	}


	/**
	 * Updates the diffuse and ambient color data used by the render state.
	 */
	private _updateProperties():void
	{
		this._ambientColor = this._shader.pass.style.color;
		this._ambientColorR = ((this._ambientColor >> 16) & 0xff)/0xff;
		this._ambientColorG = ((this._ambientColor >> 8) & 0xff)/0xff;
		this._ambientColorB = (this._ambientColor & 0xff)/0xff;

		this._color = this._method.color;
		this._colorR = ((this._color >> 16) & 0xff)/0xff;
		this._colorG = ((this._color >> 8) & 0xff)/0xff;
		this._colorB = (this._color & 0xff)/0xff;
	}

	/**
	 * @inheritDoc
	 */
	public _setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase):void
	{
		if (this._texture)
			this._texture._setRenderState(renderable);

		//TODO move this to Activate (ambientR/G/B currently calc'd in render state)
		var index:number = this._ambientColorRegister;
		var data:Float32Array = this._shader.fragmentConstantData;
		data[index] = this._shader.ambientR*this._ambientColorR;
		data[index + 1] = this._shader.ambientG*this._ambientColorG;
		data[index + 2] = this._shader.ambientB*this._ambientColorB;
		data[index + 3] = 1;
	}
}