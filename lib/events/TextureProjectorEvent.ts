import {EventBase} from "@awayjs/core";

export class TextureProjectorEvent extends EventBase
{
	public static TEXTURE_CHANGE:string = "textureChange";

	constructor(type:string)
	{
		super(type);
	}

	//@override
	public clone():TextureProjectorEvent
	{
		return new TextureProjectorEvent(this.type);
	}
}