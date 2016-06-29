"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DiffuseBasicMethod_1 = require("../methods/DiffuseBasicMethod");
/**
 * DiffuseWrapMethod is an alternative to DiffuseBasicMethod in which the light is allowed to be "wrapped around" the normally dark area, to some extent.
 * It can be used as a crude approximation to Oren-Nayar or simple subsurface scattering.
 */
var DiffuseWrapMethod = (function (_super) {
    __extends(DiffuseWrapMethod, _super);
    /**
     * Creates a new DiffuseWrapMethod object.
     * @param wrapFactor A factor to indicate the amount by which the light is allowed to wrap
     */
    function DiffuseWrapMethod(wrapFactor) {
        if (wrapFactor === void 0) { wrapFactor = .5; }
        _super.call(this);
        this.wrapFactor = wrapFactor;
    }
    /**
     * @inheritDoc
     */
    DiffuseWrapMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._wrapDataRegister = null;
    };
    Object.defineProperty(DiffuseWrapMethod.prototype, "wrapFactor", {
        /**
         * A factor to indicate the amount by which the light is allowed to wrap.
         */
        get: function () {
            return this._wrapFactor;
        },
        set: function (value) {
            this._wrapFactor = value;
            this._wrapFactor = 1 / (value + 1);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseWrapMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        var code = _super.prototype.iGetFragmentPreLightingCode.call(this, shader, methodVO, registerCache, sharedRegisters);
        this._pIsFirstLight = true;
        this._wrapDataRegister = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._wrapDataRegister.index * 4;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseWrapMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        var code = "";
        var t;
        // write in temporary if not first light, so we can add to total diffuse colour
        if (this._pIsFirstLight) {
            t = this._pTotalLightColorReg;
        }
        else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }
        code += "dp3 " + t + ".x, " + lightDirReg + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
            "add " + t + ".y, " + t + ".x, " + this._wrapDataRegister + ".x\n" +
            "mul " + t + ".y, " + t + ".y, " + this._wrapDataRegister + ".y\n" +
            "sat " + t + ".w, " + t + ".y\n" +
            "mul " + t + ".xz, " + t + ".w, " + lightDirReg + ".wz\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shader, methodVO, lightDirReg, registerCache, sharedRegisters);
        code += "mul " + t + ", " + t + ".x, " + lightColReg + "\n";
        if (!this._pIsFirstLight) {
            code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
            registerCache.removeFragmentTempUsage(t);
        }
        this._pIsFirstLight = false;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseWrapMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var index = methodVO.secondaryFragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = this._wrapFactor;
        data[index + 1] = 1 / (this._wrapFactor + 1);
    };
    return DiffuseWrapMethod;
}(DiffuseBasicMethod_1.DiffuseBasicMethod));
exports.DiffuseWrapMethod = DiffuseWrapMethod;
