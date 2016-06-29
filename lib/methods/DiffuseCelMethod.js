"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DiffuseCompositeMethod_1 = require("../methods/DiffuseCompositeMethod");
/**
 * DiffuseCelMethod provides a shading method to add diffuse cel (cartoon) shading.
 */
var DiffuseCelMethod = (function (_super) {
    __extends(DiffuseCelMethod, _super);
    /**
     * Creates a new DiffuseCelMethod object.
     * @param levels The amount of shadow gradations.
     * @param baseMethod An optional diffuse method on which the cartoon shading is based. If omitted, DiffuseBasicMethod is used.
     */
    function DiffuseCelMethod(levels, baseMethod) {
        var _this = this;
        if (levels === void 0) { levels = 3; }
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this, null, baseMethod);
        this._smoothness = .1;
        this.baseMethod._iModulateMethod = function (shader, methodVO, targetReg, registerCache, sharedRegisters) { return _this.clampDiffuse(shader, methodVO, targetReg, registerCache, sharedRegisters); };
        this._levels = levels;
    }
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iInitConstants = function (shader, methodVO) {
        var data = shader.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        _super.prototype.iInitConstants.call(this, shader, methodVO);
        data[index + 1] = 1;
        data[index + 2] = 0;
    };
    Object.defineProperty(DiffuseCelMethod.prototype, "levels", {
        /**
         * The amount of shadow gradations.
         */
        get: function () {
            return this._levels;
        },
        set: function (value /*uint*/) {
            this._levels = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseCelMethod.prototype, "smoothness", {
        /**
         * The smoothness of the edge between 2 shading levels.
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
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._dataReg = null;
    };
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shader, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var data = shader.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        data[index] = this._levels;
        data[index + 3] = this._smoothness;
    };
    /**
     * Snaps the diffuse shading of the wrapped method to one of the levels.
     * @param vo The MethodVO used to compile the current shader.
     * @param t The register containing the diffuse strength in the "w" component.
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared register data for this shader.
     * @return The AGAL fragment code for the method.
     */
    DiffuseCelMethod.prototype.clampDiffuse = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        return "mul " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".x\n" +
            "frc " + targetReg + ".z, " + targetReg + ".w\n" +
            "sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".z\n" +
            "mov " + targetReg + ".x, " + this._dataReg + ".x\n" +
            "sub " + targetReg + ".x, " + targetReg + ".x, " + this._dataReg + ".y\n" +
            "rcp " + targetReg + ".x," + targetReg + ".x\n" +
            "mul " + targetReg + ".w, " + targetReg + ".y, " + targetReg + ".x\n" +
            // previous clamped strength
            "sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".x\n" +
            // fract/epsilon (so 0 - epsilon will become 0 - 1)
            "div " + targetReg + ".z, " + targetReg + ".z, " + this._dataReg + ".w\n" +
            "sat " + targetReg + ".z, " + targetReg + ".z\n" +
            "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".z\n" +
            // 1-z
            "sub " + targetReg + ".z, " + this._dataReg + ".y, " + targetReg + ".z\n" +
            "mul " + targetReg + ".y, " + targetReg + ".y, " + targetReg + ".z\n" +
            "add " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n" +
            "sat " + targetReg + ".w, " + targetReg + ".w\n";
    };
    return DiffuseCelMethod;
}(DiffuseCompositeMethod_1.DiffuseCompositeMethod));
exports.DiffuseCelMethod = DiffuseCelMethod;
