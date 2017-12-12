import {AssetBase} from "@awayjs/core";

import {TextureBase} from "../textures/TextureBase";
import {ShadingMethodEvent} from "../events/ShadingMethodEvent";
import {MaterialBase} from "../MaterialBase";


/**
 * ShadingMethodBase provides an abstract base method for shading methods, used by compiled passes to compile
 * the final shading program.
 */
export class ShadingMethodBase extends AssetBase
{
	public _textures:Array<TextureBase> = new Array<TextureBase>();

	public _owners:Array<MaterialBase> = new Array<MaterialBase>();
	public _counts:Array<number> = new Array<number>();

	/**
	 * Create a new ShadingMethodBase object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * Cleans up any resources used by the current object.
	 */
	public dispose():void
	{

	}


	public iAddOwner(owner:MaterialBase):void
	{
		//a method can be used more than once in the same material, so we check for this
		var index:number = this._owners.indexOf(owner);

		if (index != -1) {
			this._counts[index]++;
		} else {
			this._owners.push(owner);
			this._counts.push(1);

			//add textures
			var len:number = this._textures.length;
			for (var i:number = 0; i< len; i++)
				owner.addTexture(this._textures[i]);
		}
	}

	public iRemoveOwner(owner:MaterialBase):void
	{
		var index:number = this._owners.indexOf(owner);

		if (this._counts[index] != 1) {
			this._counts[index]--;
		} else {
			this._owners.splice(index, 1);
			this._counts.splice(index, 1);

			//remove textures
			var len:number = this._textures.length;
			for (var i:number = 0; i< len; i++)
				owner.removeTexture(this._textures[i]);
		}
	}


	/**
	 *
	 */
	public iAddTexture(texture:TextureBase):void
	{
		this._textures.push(texture);

		var len:number = this._owners.length;
		for (var i:number = 0; i < len; i++)
			this._owners[i].addTexture(texture);
	}

	/**
	 *
	 */
	public iRemoveTexture(texture:TextureBase):void
	{
		this._textures.splice(this._textures.indexOf(texture), 1);

		var len:number = this._owners.length;
		for (var i:number = 0; i < len; i++)
			this._owners[i].removeTexture(texture);
	}

	/**
	 * Marks the shader program as invalid, so it will be recompiled before the next render.
	 *
	 * @internal
	 */
	public invalidateShaderProgram():void
	{
		this.invalidate();

		this.dispatchEvent(new ShadingMethodEvent(ShadingMethodEvent.SHADER_INVALIDATED));
	}

	/**
	 * Copies the state from a ShadingMethodBase object into the current object.
	 */
	public copyFrom(method:ShadingMethodBase):void
	{
	}
}