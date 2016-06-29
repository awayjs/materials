"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BitmapImage2D_1 = require("@awayjs/core/lib/image/BitmapImage2D");
var Single2DTexture_1 = require("@awayjs/display/lib/textures/Single2DTexture");
var ShadowMethodBase_1 = require("../methods/ShadowMethodBase");
/**
 * ShadowDitheredMethod provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
 */
var ShadowDitheredMethod = (function (_super) {
    __extends(ShadowDitheredMethod, _super);
    /**
     * Creates a new ShadowDitheredMethod object.
     * @param castingLight The light casting the shadows
     * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 24.
     */
    function ShadowDitheredMethod(castingLight, numSamples, range) {
        if (numSamples === void 0) { numSamples = 4; }
        if (range === void 0) { range = 1; }
        _super.call(this, castingLight);
        this._depthMapSize = this._pCastingLight.shadowMapper.depthMapSize;
        this.numSamples = numSamples;
        this.range = range;
        ++ShadowDitheredMethod._grainUsages;
        if (!ShadowDitheredMethod._grainTexture)
            this.initGrainTexture();
    }
    Object.defineProperty(ShadowDitheredMethod.prototype, "numSamples", {
        /**
         * The amount of samples to take for dithering. Minimum 1, maximum 24. The actual maximum may depend on the
         * complexity of the shader.
         */
        get: function () {
            return this._numSamples;
        },
        set: function (value /*int*/) {
            if (value < 1)
                value = 1;
            else if (value > 24)
                value = 24;
            if (this._numSamples == value)
                return;
            this._numSamples = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iInitVO = function (shader, methodVO) {
        _super.prototype.iInitVO.call(this, shader, methodVO);
        methodVO.needsProjection = true;
        methodVO.secondaryTextureGL = shader.getAbstraction(ShadowDitheredMethod._grainTexture);
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iInitConstants = function (shader, methodVO) {
        _super.prototype.iInitConstants.call(this, shader, methodVO);
        var fragmentData = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        fragmentData[index + 8] = 1 / this._numSamples;
    };
    Object.defineProperty(ShadowDitheredMethod.prototype, "range", {
        /**
         * The range in the shadow map in which to distribute the samples.
         */
        get: function () {
            return this._range * 2;
        },
        set: function (value) {
            this._range = value / 2;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a texture containing the dithering noise texture.
     */
    ShadowDitheredMethod.prototype.initGrainTexture = function () {
        ShadowDitheredMethod._grainBitmapImage2D = new BitmapImage2D_1.BitmapImage2D(64, 64, false);
        var vec = new Array();
        var len = 4096;
        var step = 1 / (this._depthMapSize * this._range);
        var r, g;
        for (var i = 0; i < len; ++i) {
            r = 2 * (Math.random() - .5);
            g = 2 * (Math.random() - .5);
            if (r < 0)
                r -= step;
            else
                r += step;
            if (g < 0)
                g -= step;
            else
                g += step;
            if (r > 1)
                r = 1;
            else if (r < -1)
                r = -1;
            if (g > 1)
                g = 1;
            else if (g < -1)
                g = -1;
            vec[i] = (Math.floor((r * .5 + .5) * 0xff) << 16) | (Math.floor((g * .5 + .5) * 0xff) << 8);
        }
        ShadowDitheredMethod._grainBitmapImage2D.setArray(ShadowDitheredMethod._grainBitmapImage2D.rect, vec);
        ShadowDitheredMethod._grainTexture = new Single2DTexture_1.Single2DTexture(ShadowDitheredMethod._grainBitmapImage2D);
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.dispose = function () {
        if (--ShadowDitheredMethod._grainUsages == 0) {
            ShadowDitheredMethod._grainTexture.dispose();
            ShadowDitheredMethod._grainBitmapImage2D.dispose();
            ShadowDitheredMethod._grainTexture = null;
        }
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var data = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index + 9] = (stage.width - 1) / 63;
        data[index + 10] = (stage.height - 1) / 63;
        data[index + 11] = 2 * this._range / this._depthMapSize;
        methodVO.secondaryTextureGL.activate(methodVO.pass._render);
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        _super.prototype.iSetRenderState.call(this, shader, methodVO, renderable, stage, camera);
        methodVO.secondaryTextureGL._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype._pGetPlanarFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        var decReg = regCache.getFreeFragmentConstant();
        var dataReg = regCache.getFreeFragmentConstant();
        var customDataReg = regCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        return this.getSampleCode(shader, methodVO, customDataReg, decReg, targetReg, regCache, sharedRegisters);
    };
    /**
     * Get the actual shader code for shadow mapping
     * @param regCache The register cache managing the registers.
     * @param depthMapRegister The texture register containing the depth map.
     * @param decReg The register containing the depth map decoding data.
     * @param targetReg The target register to add the shadow coverage.
     */
    ShadowDitheredMethod.prototype.getSampleCode = function (shader, methodVO, customDataReg, decReg, targetReg, regCache, sharedRegisters) {
        var code = "";
        var numSamples = this._numSamples;
        var uvReg = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(uvReg, 1);
        var temp = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(temp, 1);
        var projectionReg = sharedRegisters.projectionFragment;
        code += "div " + uvReg + ", " + projectionReg + ", " + projectionReg + ".w\n" +
            "mul " + uvReg + ".xy, " + uvReg + ".xy, " + customDataReg + ".yz\n";
        while (numSamples > 0) {
            if (numSamples == this._numSamples) {
                code += methodVO.secondaryTextureGL._iGetFragmentCode(uvReg, regCache, sharedRegisters, uvReg);
            }
            else {
                code += "mov " + temp + ", " + uvReg + ".zwxy \n" +
                    methodVO.secondaryTextureGL._iGetFragmentCode(uvReg, regCache, sharedRegisters, temp);
            }
            // keep grain in uvReg.zw
            code += "sub " + uvReg + ".zw, " + uvReg + ".xy, fc0.xx\n" +
                "mul " + uvReg + ".zw, " + uvReg + ".zw, " + customDataReg + ".w\n"; // (tex unpack scale and tex scale in one)
            if (numSamples == this._numSamples) {
                // first sample
                code += "add " + uvReg + ".xy, " + uvReg + ".zw, " + this._pDepthMapCoordReg + ".xy\n" +
                    methodVO.textureGL._iGetFragmentCode(temp, regCache, sharedRegisters, uvReg) +
                    "dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" +
                    "slt " + targetReg + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow
            }
            else {
                code += this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            }
            if (numSamples > 4)
                code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            if (numSamples > 1)
                code += "sub " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + uvReg + ".zw\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            if (numSamples > 5)
                code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            if (numSamples > 2) {
                code += "neg " + uvReg + ".w, " + uvReg + ".w\n"; // will be rotated 90 degrees when being accessed as wz
                code += "add " + uvReg + ".xy, " + uvReg + ".wz, " + this._pDepthMapCoordReg + ".xy\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            }
            if (numSamples > 6)
                code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            if (numSamples > 3)
                code += "sub " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + uvReg + ".wz\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            if (numSamples > 7)
                code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            numSamples -= 8;
        }
        regCache.removeFragmentTempUsage(temp);
        regCache.removeFragmentTempUsage(uvReg);
        code += "mul " + targetReg + ".w, " + targetReg + ".w, " + customDataReg + ".x\n"; // average
        return code;
    };
    /**
     * Adds the code for another tap to the shader code.
     * @param uvReg The uv register for the tap.
     * @param depthMapRegister The texture register containing the depth map.
     * @param decReg The register containing the depth map decoding data.
     * @param targetReg The target register to add the tap comparison result.
     * @param regCache The register cache managing the registers.
     * @return
     */
    ShadowDitheredMethod.prototype.addSample = function (shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters) {
        var temp = regCache.getFreeFragmentVectorTemp();
        return methodVO.textureGL._iGetFragmentCode(temp, regCache, sharedRegisters, uvReg) +
            "dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" +
            "slt " + temp + ".z, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" +
            "add " + targetReg + ".w, " + targetReg + ".w, " + temp + ".z\n";
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iActivateForCascade = function (shader, methodVO, stage) {
        var data = shader.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        data[index] = 1 / this._numSamples;
        data[index + 1] = (stage.width - 1) / 63;
        data[index + 2] = (stage.height - 1) / 63;
        data[index + 3] = 2 * this._range / this._depthMapSize;
        methodVO.secondaryTextureGL.activate(methodVO.pass._render);
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype._iGetCascadeFragmentCode = function (shader, methodVO, decodeRegister, depthProjection, targetRegister, registerCache, sharedRegisters) {
        this._pDepthMapCoordReg = depthProjection;
        var dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
        return this.getSampleCode(shader, methodVO, dataReg, decodeRegister, targetRegister, registerCache, sharedRegisters);
    };
    return ShadowDitheredMethod;
}(ShadowMethodBase_1.ShadowMethodBase));
exports.ShadowDitheredMethod = ShadowDitheredMethod;
