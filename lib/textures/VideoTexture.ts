import {ImageTexture2D} from "./ImageTexture2D";

export class VideoTexture extends ImageTexture2D
{
	public static assetType:string = "[texture VideoTexture]";

	/**
	 *
	 * @returns {string}
	 */
	public get assetType():string
	{
		return VideoTexture.assetType;
	}



	constructor()
	{
		super();

	}
}