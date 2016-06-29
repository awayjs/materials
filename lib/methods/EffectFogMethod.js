"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EffectMethodBase_1 = require("../methods/EffectMethodBase");
/**
 * EffectFogMethod provides a method to add distance-based fog to a material.
 */
var EffectFogMethod = (function (_super) {
    __extends(EffectFogMethod, _super);
    /**
     * Creates a new EffectFogMethod object.
     * @param minDistance The distance from which the fog starts appearing.
     * @param maxDistance The distance at which the fog is densest.
     * @param fogColor The colour of the fog.
     */
    function EffectFogMethod(minDistance, maxDistance, fogColor) {
        if (fogColor === void 0) { fogColor = 0x808080; }
        _super.call(this);
        this._minDistance = 0;
        this._maxDistance = 1000;
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.fogColor = fogColor;
    }
    /**
     * @inheritDoc
     */
    EffectFogMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsProjection = true;
    };
    /**
     * @inheritDoc
     */
    EffectFogMethod.prototype.iInitConstants = function (shader, methodVO) {
        var data = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index + 3] = 1;
        data[index + 6] = 0;
        data[index + 7] = 0;
    };
    Object.defineProperty(EffectFogMethod.prototype, "minDistance", {
        /**
         * The distance from which the fog starts appearing.
         */
        get: function () {
            return this._minDistance;
        },
        set: function (value) {
            this._minDistance = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectFogMethod.prototype, "maxDistance", {
        /**
         * The distance at which the fog is densest.
         */
        get: function () {
            return this._maxDistance;
        },
        set: function (value) {
            this._maxDistance = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectFogMethod.prototype, "fogColor", {
        /**
         * The colour of the fog.
         */
        get: function () {
            return this._fogColor;
        },
        set: function (value /*uint*/) {
            this._fogColor = value;
            this._fogR = ((value >> 16) & 0xff) / 0xff;
            this._fogG = ((value >> 8) & 0xff) / 0xff;
            this._fogB = (value & 0xff) / 0xff;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectFogMethod.prototype.iActivate = function (shader, methodVO, stage) {
        var data = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index] = this._fogR;
        data[index + 1] = this._fogG;
        data[index + 2] = this._fogB;
        data[index + 4] = this._minDistance;
        data[index + 5] = 1 / (this._maxDistance - this._minDistance);
    };
    /**
     * @inheritDoc
     */
    EffectFogMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var fogColor = registerCache.getFreeFragmentConstant();
        var fogData = registerCache.getFreeFragmentConstant();
        var temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        var code = "";
        methodVO.fragmentConstantsIndex = fogColor.index * 4;
        code += "sub " + temp2 + ".w, " + sharedRegisters.projectionFragment + ".z, " + fogData + ".x\n" +
            "mul " + temp2 + ".w, " + temp2 + ".w, " + fogData + ".y\n" +
            "sat " + temp2 + ".w, " + temp2 + ".w\n" +
            "sub " + temp + ", " + fogColor + ", " + targetReg + "\n" +
            "mul " + temp + ", " + temp + ", " + temp2 + ".w\n" +
            "add " + targetReg + ", " + targetReg + ", " + temp + "\n"; // fogRatio*(fogColor- col) + col
        registerCache.removeFragmentTempUsage(temp);
        return code;
    };
    return EffectFogMethod;
}(EffectMethodBase_1.EffectMethodBase));
exports.EffectFogMethod = EffectFogMethod;
