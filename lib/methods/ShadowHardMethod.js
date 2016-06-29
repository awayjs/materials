"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ShadowMethodBase_1 = require("../methods/ShadowMethodBase");
/**
 * ShadowHardMethod provides the cheapest shadow map method by using a single tap without any filtering.
 */
var ShadowHardMethod = (function (_super) {
    __extends(ShadowHardMethod, _super);
    /**
     * Creates a new ShadowHardMethod object.
     */
    function ShadowHardMethod(castingLight) {
        _super.call(this, castingLight);
    }
    /**
     * @inheritDoc
     */
    ShadowHardMethod.prototype._pGetPlanarFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        var code = "";
        var decReg = regCache.getFreeFragmentConstant();
        regCache.getFreeFragmentConstant();
        var depthCol = regCache.getFreeFragmentVectorTemp();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        code += methodVO.textureGL._iGetFragmentCode(depthCol, regCache, sharedRegisters, this._pDepthMapCoordReg) +
            "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
            "slt " + targetReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n"; // 0 if in shadow
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowHardMethod.prototype._pGetPointFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        var code = "";
        var decReg = regCache.getFreeFragmentConstant();
        var epsReg = regCache.getFreeFragmentConstant();
        var posReg = regCache.getFreeFragmentConstant();
        var depthSampleCol = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(depthSampleCol, 1);
        var lightDir = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(lightDir, 1);
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        code += "sub " + lightDir + ", " + sharedRegisters.globalPositionVarying + ", " + posReg + "\n" +
            "dp3 " + lightDir + ".w, " + lightDir + ".xyz, " + lightDir + ".xyz\n" +
            "mul " + lightDir + ".w, " + lightDir + ".w, " + posReg + ".w\n" +
            "nrm " + lightDir + ".xyz, " + lightDir + ".xyz\n" +
            methodVO.textureGL._iGetFragmentCode(depthSampleCol, regCache, sharedRegisters, lightDir) +
            "dp4 " + depthSampleCol + ".z, " + depthSampleCol + ", " + decReg + "\n" +
            "add " + targetReg + ".w, " + lightDir + ".w, " + epsReg + ".x\n" +
            "slt " + targetReg + ".w, " + targetReg + ".w, " + depthSampleCol + ".z\n"; // 0 if in shadow
        regCache.removeFragmentTempUsage(lightDir);
        regCache.removeFragmentTempUsage(depthSampleCol);
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowHardMethod.prototype._iGetCascadeFragmentCode = function (shader, methodVO, decodeRegister, depthProjection, targetRegister, registerCache, sharedRegisters) {
        var temp = registerCache.getFreeFragmentVectorTemp();
        return methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
            "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
            "slt " + targetRegister + ".w, " + depthProjection + ".z, " + temp + ".z\n"; // 0 if in shadow
    };
    /**
     * @inheritDoc
     */
    ShadowHardMethod.prototype.iActivateForCascade = function (shader, methodVO, stage) {
    };
    return ShadowHardMethod;
}(ShadowMethodBase_1.ShadowMethodBase));
exports.ShadowHardMethod = ShadowHardMethod;
