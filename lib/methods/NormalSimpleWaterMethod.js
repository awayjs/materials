"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NormalBasicMethod_1 = require("../methods/NormalBasicMethod");
/**
 * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
 */
var NormalSimpleWaterMethod = (function (_super) {
    __extends(NormalSimpleWaterMethod, _super);
    /**
     * Creates a new NormalSimpleWaterMethod object.
     * @param waveMap1 A normal map containing one layer of a wave structure.
     * @param waveMap2 A normal map containing a second layer of a wave structure.
     */
    function NormalSimpleWaterMethod(normalMap, secondaryNormalMap) {
        if (normalMap === void 0) { normalMap = null; }
        if (secondaryNormalMap === void 0) { secondaryNormalMap = null; }
        _super.call(this, normalMap);
        this._water1OffsetX = 0;
        this._water1OffsetY = 0;
        this._water2OffsetX = 0;
        this._water2OffsetY = 0;
        this._secondaryNormalMap = secondaryNormalMap;
        if (this._secondaryNormalMap)
            this.iAddTexture(this._secondaryNormalMap);
    }
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iInitConstants = function (shader, methodVO) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = .5;
        data[index + 1] = 0;
        data[index + 2] = 0;
        data[index + 3] = 1;
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iInitVO = function (shader, methodVO) {
        _super.prototype.iInitVO.call(this, shader, methodVO);
        if (this._secondaryNormalMap) {
            methodVO.secondaryTextureGL = shader.getAbstraction(this._secondaryNormalMap);
            shader.uvDependencies++;
        }
    };
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water1OffsetX", {
        /**
         * The translation of the first wave layer along the X-axis.
         */
        get: function () {
            return this._water1OffsetX;
        },
        set: function (value) {
            this._water1OffsetX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water1OffsetY", {
        /**
         * The translation of the first wave layer along the Y-axis.
         */
        get: function () {
            return this._water1OffsetY;
        },
        set: function (value) {
            this._water1OffsetY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water2OffsetX", {
        /**
         * The translation of the second wave layer along the X-axis.
         */
        get: function () {
            return this._water2OffsetX;
        },
        set: function (value) {
            this._water2OffsetX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water2OffsetY", {
        /**
         * The translation of the second wave layer along the Y-axis.
         */
        get: function () {
            return this._water2OffsetY;
        },
        set: function (value) {
            this._water2OffsetY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "secondaryNormalMap", {
        /**
         * A second normal map that will be combined with the first to create a wave-like animation pattern.
         */
        get: function () {
            return this._secondaryNormalMap;
        },
        set: function (value) {
            if (this._secondaryNormalMap == value)
                return;
            if (this._secondaryNormalMap)
                this.iRemoveTexture(this._secondaryNormalMap);
            this._secondaryNormalMap = value;
            if (this._secondaryNormalMap)
                this.iAddTexture(this._secondaryNormalMap);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._secondaryNormalMap = null;
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var data = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index + 4] = this._water1OffsetX;
        data[index + 5] = this._water1OffsetY;
        data[index + 6] = this._water2OffsetX;
        data[index + 7] = this._water2OffsetY;
        if (this._secondaryNormalMap)
            methodVO.secondaryTextureGL.activate(methodVO.pass._render);
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        _super.prototype.iSetRenderState.call(this, shader, methodVO, renderable, stage, camera);
        if (this._secondaryNormalMap)
            methodVO.secondaryTextureGL._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var dataReg = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = dataReg.index * 4;
        code += "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".xyxy\n";
        if (this.texture)
            code += methodVO.textureGL._iGetFragmentCode(targetReg, registerCache, sharedRegisters, temp);
        code += "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".zwzw\n";
        if (this._secondaryNormalMap)
            code += methodVO.secondaryTextureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, temp);
        code += "add " + targetReg + ", " + targetReg + ", " + temp + "		\n" +
            "mul " + targetReg + ", " + targetReg + ", " + dataReg + ".x	\n" +
            "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx	\n" +
            "nrm " + targetReg + ".xyz, " + targetReg + ".xyz							\n";
        return code;
    };
    return NormalSimpleWaterMethod;
}(NormalBasicMethod_1.NormalBasicMethod));
exports.NormalSimpleWaterMethod = NormalSimpleWaterMethod;
