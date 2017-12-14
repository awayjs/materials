import {AssetEvent, Matrix3D, ProjectionBase} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {IRenderable, _Render_RenderableBase, _Render_MaterialBase, _Render_ElementsBase, ShaderBase, _Shader_TextureBase} from "@awayjs/renderer";


import {MaterialBase} from "../MaterialBase";

import {PassBase} from "./PassBase";

/**
 * BasicMaterialPass forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export class BasicMaterialPass extends PassBase
{
	private _shaderTexture:_Shader_TextureBase;
	private _diffuseR:number = 1;
	private _diffuseG:number = 1;
	private _diffuseB:number = 1;
	private _diffuseA:number = 1;

	private _fragmentConstantsIndex:number;

	constructor(renderMaterial:_Render_MaterialBase, renderElements:_Render_ElementsBase)
	{
		super(renderMaterial, renderElements);

		this._shader = new ShaderBase(renderElements, renderMaterial, this, this._stage);

		this.invalidate();
	}

	public _includeDependencies(shader:ShaderBase):void
	{
		super._includeDependencies(shader);

		if (this._shaderTexture != null)
			shader.uvDependencies++;
    }

	public invalidate():void
	{
		super.invalidate();

		this._shaderTexture = (<MaterialBase> this._renderMaterial.material).getTextureAt(0)? <_Shader_TextureBase> this._shader.getAbstraction((<MaterialBase> this._renderMaterial.material).getTextureAt(0)) : null;
	}

	public dispose():void
	{
		if (this._shaderTexture) {
			this._shaderTexture.onClear(new AssetEvent(AssetEvent.CLEAR, (<MaterialBase> this._renderMaterial.material).getTextureAt(0)));
			this._shaderTexture = null;
		}

		super.dispose();
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):string
	{
		var code:string = "";

        var alphaReg:ShaderRegisterElement;

        if (this.preserveAlpha) {
            alphaReg = regCache.getFreeFragmentSingleTemp();
            regCache.addFragmentTempUsages(alphaReg, 1);
            code += "mov " + alphaReg + ", " + sharedReg.shadedTarget + ".w\n";
        }

		var targetReg:ShaderRegisterElement = sharedReg.shadedTarget;

		if (this._shaderTexture != null) {

			code += this._shaderTexture._getFragmentCode(targetReg, regCache, sharedReg, sharedReg.uvVarying);

			if (this._shader.alphaThreshold > 0) {
				var cutOffReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
				this._fragmentConstantsIndex = cutOffReg.index*4;

				code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" + "kil " + targetReg + ".w\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
			}
		} else if (this._shader.colorBufferIndex != -1) {

			code += "mov " + targetReg + ", " + sharedReg.colorVarying + "\n";
		} else {
			var diffuseInputReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

			this._fragmentConstantsIndex = diffuseInputReg.index*4;

			code += "mov " + targetReg + ", " + diffuseInputReg + "\n";
		}

        if (this.preserveAlpha) {
            code += "mul " + sharedReg.shadedTarget + ".w, " + sharedReg.shadedTarget + ".w, " + alphaReg + "\n";
            regCache.removeFragmentTempUsage(alphaReg);
        }

		return code;
	}

	public _setRenderState(renderState:_Render_RenderableBase, projection:ProjectionBase):void
	{
		super._setRenderState(renderState, projection);

		if (this._shaderTexture != null)
			this._shaderTexture._setRenderState(renderState);
	}
	/**
	 * @inheritDoc
	 */
	public _activate(projection:ProjectionBase):void
	{
		super._activate(projection);

		if (this._shaderTexture != null) {
			this._shaderTexture.activate();

			if (this._shader.alphaThreshold > 0)
				this._shader.fragmentConstantData[this._fragmentConstantsIndex] = this._shader.alphaThreshold;
		} else if (this._shader.colorBufferIndex == -1) {
			var index:number = this._fragmentConstantsIndex;
			var data:Float32Array = this._shader.fragmentConstantData;
			data[index] = this._diffuseR;
			data[index + 1] = this._diffuseG;
			data[index + 2] = this._diffuseB;
			data[index + 3] = this._diffuseA;
		}
	}
}