import {ImageCube, ImageSampler} from "@awayjs/stage";

import {LightBase} from "./LightBase";

export class LightProbe extends LightBase
{
	public static assetType:string = "[light LightProbe]";

	public diffuseMap:ImageCube;

	public diffuseSampler:ImageSampler = new ImageSampler();

	public specularMap:ImageCube;

	public specularSampler:ImageSampler = new ImageSampler();


    public get assetType():string
    {
        return LightProbe.assetType;
    }

	constructor(diffuseMap:ImageCube, specularMap:ImageCube = null)
	{
		super();

		this.diffuseMap = diffuseMap;
		this.specularMap = specularMap;
	}

	//@override
	// public _getEntityProjectionMatrix(entity:IEntity, cameraTransform:Matrix3D, target:Matrix3D = null):Matrix3D
	// {
	// 	throw new ErrorBase("Object projection matrices are not supported for LightProbe objects!");
	// }
}