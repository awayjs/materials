import { ImageTexture2D } from "@awayjs/renderer";


export class VideoTexture extends ImageTexture2D {
	public static assetType: string = '[texture VideoTexture]';

	/**
	 *
	 * @returns {string}
	 */
	public get assetType(): string {
		return VideoTexture.assetType;
	}

	constructor() {
		super();

	}
}