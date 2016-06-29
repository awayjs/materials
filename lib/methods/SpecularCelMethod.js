"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SpecularCompositeMethod_1 = require("../methods/SpecularCompositeMethod");
/**
 * SpecularCelMethod provides a shading method to add specular cel (cartoon) shading.
 */
var SpecularCelMethod = (function (_super) {
    __extends(SpecularCelMethod, _super);
    /**
     * Creates a new SpecularCelMethod object.
     * @param specularCutOff The threshold at which the specular highlight should be shown.
     * @param baseMethod An optional specular method on which the cartoon shading is based. If ommitted, SpecularBasicMethod is used.
     */
    function SpecularCelMethod(specularCutOff, baseMethod) {
        var _this = this;
        if (specularCutOff === void 0) { specularCutOff = .5; }
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this, null, baseMethod);
        this._smoothness = .1;
        this._specularCutOff = .1;
        this.baseMethod._iModulateMethod = function (shader, methodVO, targetReg, registerCache, sharedRegisters) { return _this.clampSpecular(shader, methodVO, targetReg, registerCache, sharedRegisters); };
        this._specularCutOff = specularCutOff;
    }
    Object.defineProperty(SpecularCelMethod.prototype, "smoothness", {
        /**
         * The smoothness of the highlight edge.
         */
        get: function () {
            return this._smoothness;
        },
        set: function (value) {
            this._smoothness = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularCelMethod.prototype, "specularCutOff", {
        /**
         * The threshold at which the specular highlight should be shown.
         */
        get: function () {
            return this._specularCutOff;
        },
        set: function (value) {
            this._specularCutOff = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SpecularCelMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var index = methodVO.secondaryFragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = this._smoothness;
        data[index + 1] = this._specularCutOff;
    };
    /**
     * @inheritDoc
     */
    SpecularCelMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._dataReg = null;
    };
    /**
     * Snaps the specular shading strength of the wrapped method to zero or one, depending on whether or not it exceeds the specularCutOff
     * @param vo The MethodVO used to compile the current shader.
     * @param t The register containing the specular strength in the "w" component, and either the half-vector or the reflection vector in "xyz".
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared register data for this shader.
     * @return The AGAL fragment code for the method.
     */
    SpecularCelMethod.prototype.clampSpecular = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        return "sub " + targetReg + ".y, " + targetReg + ".w, " + this._dataReg + ".y\n" +
            "div " + targetReg + ".y, " + targetReg + ".y, " + this._dataReg + ".x\n" +
            "sat " + targetReg + ".y, " + targetReg + ".y\n" +
            "sge " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".y\n" +
            "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
    };
    /**
     * @inheritDoc
     */
    SpecularCelMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shader, methodVO, registerCache, sharedRegisters);
    };
    return SpecularCelMethod;
}(SpecularCompositeMethod_1.SpecularCompositeMethod));
exports.SpecularCelMethod = SpecularCelMethod;
