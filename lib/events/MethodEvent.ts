import {EventBase} from "@awayjs/core";

export class MethodEvent extends EventBase
{
	public static SHADER_INVALIDATED:string = "shaderInvalidated";

	constructor(type:string)
	{
		super(type);
	}
}