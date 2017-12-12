import {AssetEvent} from "@awayjs/core";

import {BlendMode} from "@awayjs/stage";

import {MaterialStatePool} from "@awayjs/renderer";

import {BasicMaterialPass} from "./passes/BasicMaterialPass";

import {GL_MaterialBase} from "./GL_MaterialBase";
import {BasicMaterial} from "./BasicMaterial";

/**
 * RenderMaterialObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export class GL_BasicMaterial extends GL_MaterialBase
{
	private _basicMaterial:BasicMaterial;
	private _pass:BasicMaterialPass;


	constructor(material:BasicMaterial, materialStatePool:MaterialStatePool)
	{
		super(material, materialStatePool);

		this._basicMaterial = material;

		this._pAddPass(this._pass = new BasicMaterialPass(this, materialStatePool));
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._basicMaterial = null;
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateRender():void
	{
		super._pUpdateRender();

		this.requiresBlending = (this._basicMaterial.blendMode != BlendMode.NORMAL || this._basicMaterial.alphaBlending || (this._basicMaterial.colorTransform && this._basicMaterial.colorTransform.alphaMultiplier < 1));
		this._pass.preserveAlpha = this._basicMaterial.preserveAlpha;//this._pRequiresBlending;
		this._pass.shader.setBlendMode((this._basicMaterial.blendMode == BlendMode.NORMAL && this.requiresBlending)? BlendMode.LAYER : this._basicMaterial.blendMode);
		//this._pass.forceSeparateMVP = false;
	}
}