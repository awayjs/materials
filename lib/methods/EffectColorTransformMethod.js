"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EffectMethodBase_1 = require("../methods/EffectMethodBase");
/**
 * EffectColorTransformMethod provides a shading method that changes the colour of a material analogous to a
 * ColorTransform object.
 */
var EffectColorTransformMethod = (function (_super) {
    __extends(EffectColorTransformMethod, _super);
    /**
     * Creates a new EffectColorTransformMethod.
     */
    function EffectColorTransformMethod() {
        _super.call(this);
    }
    Object.defineProperty(EffectColorTransformMethod.prototype, "colorTransform", {
        /**
         * The ColorTransform object to transform the colour of the material with.
         */
        get: function () {
            return this._colorTransform;
        },
        set: function (value) {
            this._colorTransform = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectColorTransformMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var colorMultReg = registerCache.getFreeFragmentConstant();
        var colorOffsReg = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = colorMultReg.index * 4;
        //TODO: AGAL <> GLSL
        code += "mul " + targetReg + ", " + targetReg + ", " + colorMultReg + "\n" + "add " + targetReg + ", " + targetReg + ", " + colorOffsReg + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    EffectColorTransformMethod.prototype.iActivate = function (shader, methodVO, stage) {
        var inv = 1 / 0xff;
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = this._colorTransform.redMultiplier;
        data[index + 1] = this._colorTransform.greenMultiplier;
        data[index + 2] = this._colorTransform.blueMultiplier;
        data[index + 3] = this._colorTransform.alphaMultiplier;
        data[index + 4] = this._colorTransform.redOffset * inv;
        data[index + 5] = this._colorTransform.greenOffset * inv;
        data[index + 6] = this._colorTransform.blueOffset * inv;
        data[index + 7] = this._colorTransform.alphaOffset * inv;
    };
    return EffectColorTransformMethod;
}(EffectMethodBase_1.EffectMethodBase));
exports.EffectColorTransformMethod = EffectColorTransformMethod;
