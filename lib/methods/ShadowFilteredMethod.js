"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ShadowMethodBase_1 = require("../methods/ShadowMethodBase");
/**
 * ShadowFilteredMethod provides a softened shadowing technique by bilinearly interpolating shadow comparison
 * results of neighbouring pixels.
 */
var ShadowFilteredMethod = (function (_super) {
    __extends(ShadowFilteredMethod, _super);
    /**
     * Creates a new DiffuseBasicMethod object.
     *
     * @param castingLight The light casting the shadow
     */
    function ShadowFilteredMethod(castingLight) {
        _super.call(this, castingLight);
    }
    /**
     * @inheritDoc
     */
    ShadowFilteredMethod.prototype.iInitConstants = function (shader, methodVO) {
        _super.prototype.iInitConstants.call(this, shader, methodVO);
        var fragmentData = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        fragmentData[index + 8] = .5;
        var size = this.castingLight.shadowMapper.depthMapSize;
        fragmentData[index + 9] = size;
        fragmentData[index + 10] = 1 / size;
    };
    /**
     * @inheritDoc
     */
    ShadowFilteredMethod.prototype._pGetPlanarFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        var code = "";
        var decReg = regCache.getFreeFragmentConstant();
        regCache.getFreeFragmentConstant();
        var customDataReg = regCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        var depthCol = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(depthCol, 1);
        var uvReg = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(uvReg, 1);
        code += "mov " + uvReg + ", " + this._pDepthMapCoordReg + "\n" +
            methodVO.textureGL._iGetFragmentCode(depthCol, regCache, sharedRegisters, this._pDepthMapCoordReg) +
            "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
            "slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +
            "add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" +
            methodVO.textureGL._iGetFragmentCode(depthCol, regCache, sharedRegisters, uvReg) +
            "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
            "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +
            "mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" +
            "frc " + depthCol + ".x, " + depthCol + ".x\n" +
            "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" +
            "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" +
            "add " + targetReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" +
            "mov " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x\n" +
            "add " + uvReg + ".y, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".z\n" +
            methodVO.textureGL._iGetFragmentCode(depthCol, regCache, sharedRegisters, uvReg) +
            "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
            "slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +
            "add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" +
            methodVO.textureGL._iGetFragmentCode(depthCol, regCache, sharedRegisters, uvReg) +
            "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
            "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +
            // recalculate fraction, since we ran out of registers :(
            "mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" +
            "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" +
            "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" +
            "add " + uvReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" +
            "mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".y\n" +
            "frc " + depthCol + ".x, " + depthCol + ".x\n" +
            "sub " + uvReg + ".w, " + uvReg + ".w, " + targetReg + ".w\n" +
            "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" +
            "add " + targetReg + ".w, " + targetReg + ".w, " + uvReg + ".w\n";
        regCache.removeFragmentTempUsage(depthCol);
        regCache.removeFragmentTempUsage(uvReg);
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowFilteredMethod.prototype.iActivateForCascade = function (shader, methodVO, stage) {
        var size = this.castingLight.shadowMapper.depthMapSize;
        var index = methodVO.secondaryFragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = size;
        data[index + 1] = 1 / size;
    };
    /**
     * @inheritDoc
     */
    ShadowFilteredMethod.prototype._iGetCascadeFragmentCode = function (shader, methodVO, decodeRegister, depthProjection, targetRegister, registerCache, sharedRegisters) {
        var code;
        var dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
        var temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var predicate = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(predicate, 1);
        code = methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
            "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
            "slt " + predicate + ".x, " + depthProjection + ".z, " + temp + ".z\n" +
            "add " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" +
            methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
            "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
            "slt " + predicate + ".z, " + depthProjection + ".z, " + temp + ".z\n" +
            "add " + depthProjection + ".y, " + depthProjection + ".y, " + dataReg + ".y\n" +
            methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
            "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
            "slt " + predicate + ".w, " + depthProjection + ".z, " + temp + ".z\n" +
            "sub " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" +
            methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) +
            "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
            "slt " + predicate + ".y, " + depthProjection + ".z, " + temp + ".z\n" +
            "mul " + temp + ".xy, " + depthProjection + ".xy, " + dataReg + ".x\n" +
            "frc " + temp + ".xy, " + temp + ".xy\n" +
            // some strange register juggling to prevent agal bugging out
            "sub " + depthProjection + ", " + predicate + ".xyzw, " + predicate + ".zwxy\n" +
            "mul " + depthProjection + ", " + depthProjection + ", " + temp + ".x\n" +
            "add " + predicate + ".xy, " + predicate + ".xy, " + depthProjection + ".zw\n" +
            "sub " + predicate + ".y, " + predicate + ".y, " + predicate + ".x\n" +
            "mul " + predicate + ".y, " + predicate + ".y, " + temp + ".y\n" +
            "add " + targetRegister + ".w, " + predicate + ".x, " + predicate + ".y\n";
        registerCache.removeFragmentTempUsage(temp);
        registerCache.removeFragmentTempUsage(predicate);
        return code;
    };
    return ShadowFilteredMethod;
}(ShadowMethodBase_1.ShadowMethodBase));
exports.ShadowFilteredMethod = ShadowFilteredMethod;
