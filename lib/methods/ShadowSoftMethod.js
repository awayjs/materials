"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PoissonLookup_1 = require("@awayjs/core/lib/geom/PoissonLookup");
var ShadowMethodBase_1 = require("../methods/ShadowMethodBase");
/**
 * ShadowSoftMethod provides a soft shadowing technique by randomly distributing sample points.
 */
var ShadowSoftMethod = (function (_super) {
    __extends(ShadowSoftMethod, _super);
    /**
     * Creates a new DiffuseBasicMethod object.
     *
     * @param castingLight The light casting the shadows
     * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 32.
     */
    function ShadowSoftMethod(castingLight, numSamples, range) {
        if (numSamples === void 0) { numSamples = 5; }
        if (range === void 0) { range = 1; }
        _super.call(this, castingLight);
        this._range = 1;
        this.numSamples = numSamples;
        this.range = range;
    }
    Object.defineProperty(ShadowSoftMethod.prototype, "numSamples", {
        /**
         * The amount of samples to take for dithering. Minimum 1, maximum 32. The actual maximum may depend on the
         * complexity of the shader.
         */
        get: function () {
            return this._numSamples;
        },
        set: function (value /*int*/) {
            this._numSamples = value;
            if (this._numSamples < 1)
                this._numSamples = 1;
            else if (this._numSamples > 32)
                this._numSamples = 32;
            this._offsets = PoissonLookup_1.PoissonLookup.getDistribution(this._numSamples);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowSoftMethod.prototype, "range", {
        /**
         * The range in the shadow map in which to distribute the samples.
         */
        get: function () {
            return this._range;
        },
        set: function (value) {
            this._range = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype.iInitConstants = function (shader, methodVO) {
        _super.prototype.iInitConstants.call(this, shader, methodVO);
        shader.fragmentConstantData[methodVO.fragmentConstantsIndex + 8] = 1 / this._numSamples;
        shader.fragmentConstantData[methodVO.fragmentConstantsIndex + 9] = 0;
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var texRange = .5 * this._range / this._pCastingLight.shadowMapper.depthMapSize;
        var data = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex + 10;
        var len = this._numSamples << 1;
        for (var i = 0; i < len; ++i)
            data[index + i] = this._offsets[i] * texRange;
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype._pGetPlanarFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        // todo: move some things to super
        var decReg = regCache.getFreeFragmentConstant();
        regCache.getFreeFragmentConstant();
        var dataReg = regCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        return this.getSampleCode(shader, methodVO, decReg, targetReg, regCache, sharedRegisters, dataReg);
    };
    /**
     * Adds the code for another tap to the shader code.
     * @param uv The uv register for the tap.
     * @param texture The texture register containing the depth map.
     * @param decode The register containing the depth map decoding data.
     * @param target The target register to add the tap comparison result.
     * @param regCache The register cache managing the registers.
     * @return
     */
    ShadowSoftMethod.prototype.addSample = function (shader, methodVO, decodeRegister, targetRegister, registerCache, sharedRegisters, uvReg) {
        var temp = registerCache.getFreeFragmentVectorTemp();
        return methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, uvReg) +
            "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
            "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" +
            "add " + targetRegister + ".w, " + targetRegister + ".w, " + uvReg + ".w\n";
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype.iActivateForCascade = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var texRange = this._range / this._pCastingLight.shadowMapper.depthMapSize;
        var data = shader.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        var len = this._numSamples << 1;
        data[index] = 1 / this._numSamples;
        data[index + 1] = 0;
        index += 2;
        for (var i = 0; i < len; ++i)
            data[index + i] = this._offsets[i] * texRange;
        if (len % 4 == 0) {
            data[index + len] = 0;
            data[index + len + 1] = 0;
        }
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype._iGetCascadeFragmentCode = function (shader, methodVO, decodeRegister, depthProjection, targetRegister, registerCache, sharedRegisters) {
        this._pDepthMapCoordReg = depthProjection;
        var dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
        return this.getSampleCode(shader, methodVO, decodeRegister, targetRegister, registerCache, sharedRegisters, dataReg);
    };
    /**
     * Get the actual shader code for shadow mapping
     * @param regCache The register cache managing the registers.
     * @param depthTexture The texture register containing the depth map.
     * @param decodeRegister The register containing the depth map decoding data.
     * @param targetReg The target register to add the shadow coverage.
     * @param dataReg The register containing additional data.
     */
    ShadowSoftMethod.prototype.getSampleCode = function (shader, methodVO, decodeRegister, targetRegister, registerCache, sharedRegisters, dataReg) {
        var code;
        var uvReg = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(uvReg, 1);
        var offsets = new Array(dataReg + ".zw");
        var numRegs = this._numSamples >> 1;
        for (var i = 0; i < numRegs; ++i) {
            var reg = registerCache.getFreeFragmentConstant();
            offsets.push(reg + ".xy");
            offsets.push(reg + ".zw");
        }
        for (i = 0; i < this._numSamples; ++i) {
            if (i == 0) {
                var temp = registerCache.getFreeFragmentVectorTemp();
                code = "add " + uvReg + ", " + this._pDepthMapCoordReg + ", " + dataReg + ".zwyy\n" +
                    methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, uvReg) +
                    "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
                    "slt " + targetRegister + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow;
            }
            else {
                code += "add " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + offsets[i] + "\n" +
                    this.addSample(shader, methodVO, decodeRegister, targetRegister, registerCache, sharedRegisters, uvReg);
            }
        }
        registerCache.removeFragmentTempUsage(uvReg);
        code += "mul " + targetRegister + ".w, " + targetRegister + ".w, " + dataReg + ".x\n"; // average
        return code;
    };
    return ShadowSoftMethod;
}(ShadowMethodBase_1.ShadowMethodBase));
exports.ShadowSoftMethod = ShadowSoftMethod;
