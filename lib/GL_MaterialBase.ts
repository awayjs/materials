import {Stage} from "@awayjs/stage";

import {MaterialStateBase, ShaderBase} from "@awayjs/renderer";

import {MaterialBase} from "./MaterialBase";

/**
 *
 * @class away.pool.Passes
 */
export class GL_MaterialBase extends MaterialStateBase
{
	public _includeDependencies(shader:ShaderBase):void
	{
		super._includeDependencies(shader);

        shader.useAlphaPremultiplied = (<MaterialBase> this._material).alphaPremultiplied;
        shader.useBothSides = (<MaterialBase> this._material).bothSides;
        shader.usesUVTransform = (<MaterialBase> this._material).animateUVs;
        shader.usesColorTransform = (<MaterialBase> this._material).useColorTransform;
	}
}