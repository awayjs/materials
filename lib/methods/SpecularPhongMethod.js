"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SpecularBasicMethod_1 = require("../methods/SpecularBasicMethod");
/**
 * SpecularPhongMethod provides a specular method that provides Phong highlights.
 */
var SpecularPhongMethod = (function (_super) {
    __extends(SpecularPhongMethod, _super);
    /**
     * Creates a new SpecularPhongMethod object.
     */
    function SpecularPhongMethod() {
        _super.call(this);
    }
    /**
     * @inheritDoc
     */
    SpecularPhongMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        var code = "";
        var t;
        if (this._pIsFirstLight) {
            t = this._pTotalLightColorReg;
        }
        else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }
        var viewDirReg = sharedRegisters.viewDirFragment;
        var normalReg = sharedRegisters.normalFragment;
        // phong model
        code += "dp3 " + t + ".w, " + lightDirReg + ", " + normalReg + "\n" +
            //find the reflected light vector R
            "add " + t + ".w, " + t + ".w, " + t + ".w\n" +
            "mul " + t + ".xyz, " + normalReg + ", " + t + ".w\n" +
            "sub " + t + ".xyz, " + t + ", " + lightDirReg + "\n" +
            //smooth the edge as incidence angle approaches 90
            "add " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".w\n" +
            "sat " + t + ".w, " + t + ".w\n" +
            "mul " + t + ".xyz, " + t + ", " + t + ".w\n" +
            //find the dot product between R and V
            "dp3 " + t + ".w, " + t + ", " + viewDirReg + "\n" +
            "sat " + t + ".w, " + t + ".w\n";
        if (this.texture) {
            // apply gloss modulation from texture
            code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" +
                "pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
        }
        else
            code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";
        // attenuate
        if (shader.usesLightFallOff)
            code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);
        code += "mul " + t + ".xyz, " + lightColReg + ".xyz, " + t + ".w\n";
        if (!this._pIsFirstLight) {
            code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
            registerCache.removeFragmentTempUsage(t);
        }
        this._pIsFirstLight = false;
        return code;
    };
    return SpecularPhongMethod;
}(SpecularBasicMethod_1.SpecularBasicMethod));
exports.SpecularPhongMethod = SpecularPhongMethod;
