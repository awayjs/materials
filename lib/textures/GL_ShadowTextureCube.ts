import {AssetEvent, Vector3D} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, GL_Image2D, ImageSampler} from "@awayjs/stage";

import {ShaderBase, RenderStateBase, ChunkVO} from "@awayjs/renderer";

import {PointLight} from "../lights/PointLight";

import {ShadowTextureCube} from "./ShadowTextureCube";
import {GL_DepthTexture} from "./GL_DepthTexture";

/**
 *
 * @class away.pool.GL_DepthTexture
 */
export class GL_ShadowTextureCube extends GL_DepthTexture
{
    private _positionIndex:number;

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData, inputReg:ShaderRegisterElement):string
    {
        var posReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
        this._positionIndex = posReg.index*4;

        var epsReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

        var code:string = "";

        var lightDir:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

        code += "sub " + lightDir + ", " + inputReg + ", " + posReg + "\n" +
            "dp3 " + lightDir + ".w, " + lightDir + ".xyz, " + lightDir + ".xyz\n" +
            "nrm " + lightDir + ".xyz, " + lightDir + ".xyz\n";

        code += super._getFragmentCode(targetReg, regCache, sharedRegisters, lightDir) +
            "add " + lightDir + ".w, " + lightDir + ".w, " + epsReg + ".x\n" +    // offset by epsilon (add 2*light*epsilon)?
            "mul " + lightDir + ".w, " + lightDir + ".w, " + posReg + ".w\n" + // divide by falloff squared to normalise
            "slt " + targetReg + ".w, " + lightDir + ".w, " + targetReg + ".w\n"; // 0 if in shadow

        return code;
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        super.activate();

        var fragmentData:Float32Array = this._shader.fragmentConstantData;
        var index:number = this._positionIndex;

        var pos:Vector3D = (<ShadowTextureCube> this._texture).mapper.light.transform.concatenatedMatrix3D.position;
        var fallOff:number = (<PointLight> (<ShadowTextureCube> this._texture).mapper.light).fallOff; // used to decompress distance

        fragmentData[index] = pos.x;
        fragmentData[index + 1] = pos.y;
        fragmentData[index + 2] = pos.z;
        fragmentData[index + 3] = 1/(2*fallOff*fallOff); //TODO: do we need the 2?

        //epsilon
        fragmentData[index + 4] = -Math.pow(1/(fallOff*(<ShadowTextureCube> this._texture).mapper.epsilon), 2);
    }
}