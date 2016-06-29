"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DiffuseBasicMethod_1 = require("../methods/DiffuseBasicMethod");
/**
 * DiffuseDepthMethod provides a debug method to visualise depth maps
 */
var DiffuseDepthMethod = (function (_super) {
    __extends(DiffuseDepthMethod, _super);
    /**
     * Creates a new DiffuseBasicMethod object.
     */
    function DiffuseDepthMethod() {
        _super.call(this);
    }
    /**
     * @inheritDoc
     */
    DiffuseDepthMethod.prototype.iInitConstants = function (shader, methodVO) {
        var data = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index] = 1.0;
        data[index + 1] = 1 / 255.0;
        data[index + 2] = 1 / 65025.0;
        data[index + 3] = 1 / 16581375.0;
    };
    /**
     * @inheritDoc
     */
    DiffuseDepthMethod.prototype.iGetFragmentPostLightingCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var temp;
        var decReg;
        if (!this._texture)
            throw new Error("DiffuseDepthMethod requires texture!");
        // incorporate input from ambient
        if (shader.numLights > 0) {
            if (sharedRegisters.shadowTarget)
                code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + sharedRegisters.shadowTarget + ".w\n";
            code += "add " + targetReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + targetReg + ".xyz\n" +
                "sat " + targetReg + ".xyz, " + targetReg + ".xyz\n";
            registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
            registerCache.addFragmentTempUsages(temp = registerCache.getFreeFragmentVectorTemp(), 1);
        }
        else {
            temp = targetReg;
        }
        decReg = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        code += methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
            "dp4 " + temp + ".x, " + temp + ", " + decReg + "\n" +
            "mov " + temp + ".yz, " + temp + ".xx			\n" +
            "mov " + temp + ".w, " + decReg + ".x\n" +
            "sub " + temp + ".xyz, " + decReg + ".xxx, " + temp + ".xyz\n";
        if (shader.numLights == 0)
            return code;
        code += "mul " + targetReg + ".xyz, " + temp + ".xyz, " + targetReg + ".xyz\n" +
            "mov " + targetReg + ".w, " + temp + ".w\n";
        if (shader.numLights > 0)
            registerCache.removeFragmentTempUsage(temp);
        return code;
    };
    return DiffuseDepthMethod;
}(DiffuseBasicMethod_1.DiffuseBasicMethod));
exports.DiffuseDepthMethod = DiffuseDepthMethod;
