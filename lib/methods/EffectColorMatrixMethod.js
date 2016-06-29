"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EffectMethodBase_1 = require("../methods/EffectMethodBase");
/**
 * EffectColorMatrixMethod provides a shading method that changes the colour of a material analogous to a ColorMatrixFilter.
 */
var EffectColorMatrixMethod = (function (_super) {
    __extends(EffectColorMatrixMethod, _super);
    /**
     * Creates a new EffectColorTransformMethod.
     *
     * @param matrix An array of 20 items for 4 x 5 color transform.
     */
    function EffectColorMatrixMethod(matrix) {
        _super.call(this);
        if (matrix.length != 20)
            throw new Error("Matrix length must be 20!");
        this._matrix = matrix;
    }
    Object.defineProperty(EffectColorMatrixMethod.prototype, "colorMatrix", {
        /**
         * The 4 x 5 matrix to transform the color of the material.
         */
        get: function () {
            return this._matrix;
        },
        set: function (value) {
            this._matrix = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectColorMatrixMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var colorMultReg = registerCache.getFreeFragmentConstant();
        registerCache.getFreeFragmentConstant();
        registerCache.getFreeFragmentConstant();
        registerCache.getFreeFragmentConstant();
        var colorOffsetReg = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = colorMultReg.index * 4;
        var temp = registerCache.getFreeFragmentVectorTemp();
        code += "m44 " + temp + ", " + targetReg + ", " + colorMultReg + "\n" +
            "add " + targetReg + ", " + temp + ", " + colorOffsetReg + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    EffectColorMatrixMethod.prototype.iActivate = function (shader, methodVO, stage) {
        var matrix = this._matrix;
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        // r
        data[index] = matrix[0];
        data[index + 1] = matrix[1];
        data[index + 2] = matrix[2];
        data[index + 3] = matrix[3];
        // g
        data[index + 4] = matrix[5];
        data[index + 5] = matrix[6];
        data[index + 6] = matrix[7];
        data[index + 7] = matrix[8];
        // b
        data[index + 8] = matrix[10];
        data[index + 9] = matrix[11];
        data[index + 10] = matrix[12];
        data[index + 11] = matrix[13];
        // a
        data[index + 12] = matrix[15];
        data[index + 13] = matrix[16];
        data[index + 14] = matrix[17];
        data[index + 15] = matrix[18];
        // rgba offset
        data[index + 16] = matrix[4];
        data[index + 17] = matrix[9];
        data[index + 18] = matrix[14];
        data[index + 19] = matrix[19];
    };
    return EffectColorMatrixMethod;
}(EffectMethodBase_1.EffectMethodBase));
exports.EffectColorMatrixMethod = EffectColorMatrixMethod;
