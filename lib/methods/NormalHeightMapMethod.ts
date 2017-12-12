import {TextureBase} from "../textures/TextureBase";

import {NormalBasicMethod} from "./NormalBasicMethod";
import {ShadingMethodBase} from "./ShadingMethodBase";

/**
 * NormalHeightMapMethod provides a normal map method that uses a height map to calculate the normals.
 */
export class NormalHeightMapMethod extends NormalBasicMethod
{
	private _worldXYRatio:number;
	private _worldXZRatio:number;

	public static assetType:string = "[asset NormalHeightMapMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return NormalHeightMapMethod.assetType;
	}

	public get worldXYRatio():number
	{
		return this._worldXYRatio;
	}

	public get worldXZRatio():number
	{
		return this._worldXZRatio;
	}
	
	/**
	 * Creates a new NormalHeightMapMethod method.
	 *
	 * @param heightMap The texture containing the height data. 0 means low, 1 means high.
	 * @param worldWidth The width of the 'world'. This is used to map uv coordinates' u component to scene dimensions.
	 * @param worldHeight The height of the 'world'. This is used to map the height map values to scene dimensions.
	 * @param worldDepth The depth of the 'world'. This is used to map uv coordinates' v component to scene dimensions.
	 */
	constructor(heightMap:TextureBase, worldWidth:number, worldHeight:number, worldDepth:number)
	{
		super();

		this.texture = heightMap;
		this._worldXYRatio = worldWidth/worldHeight;
		this._worldXZRatio = worldDepth/worldHeight;
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase):void
	{
		super.copyFrom(method);

		this._worldXYRatio = (<NormalHeightMapMethod> method)._worldXYRatio;
		this._worldXZRatio = (<NormalHeightMapMethod> method)._worldXZRatio;
	}
}