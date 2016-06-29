"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DiffuseBasicMethod_1 = require("../methods/DiffuseBasicMethod");
/**
 * DiffuseGradientMethod is an alternative to DiffuseBasicMethod in which the shading can be modulated with a gradient
 * to introduce color-tinted shading as opposed to the single-channel diffuse strength. This can be used as a crude
 * approximation to subsurface scattering (for instance, the mid-range shading for skin can be tinted red to similate
 * scattered light within the skin attributing to the final colour)
 */
var DiffuseGradientMethod = (function (_super) {
    __extends(DiffuseGradientMethod, _super);
    /**
     * Creates a new DiffuseGradientMethod object.
     * @param gradient A texture that contains the light colour based on the angle. This can be used to change
     * the light colour due to subsurface scattering when the surface faces away from the light.
     */
    function DiffuseGradientMethod(gradient) {
        _super.call(this);
        this._gradient = gradient;
        if (this._gradient)
            this.iAddTexture(this._gradient);
    }
    DiffuseGradientMethod.prototype.iInitVO = function (shader, methodVO) {
        _super.prototype.iInitVO.call(this, shader, methodVO);
        methodVO.secondaryTextureGL = shader.getAbstraction(this._gradient);
    };
    Object.defineProperty(DiffuseGradientMethod.prototype, "gradient", {
        /**
         * A texture that contains the light colour based on the angle. This can be used to change the light colour
         * due to subsurface scattering when the surface faces away from the light.
         */
        get: function () {
            return this._gradient;
        },
        set: function (value) {
            if (this._gradient == value)
                return;
            if (this._gradient)
                this.iRemoveTexture(this._gradient);
            this._gradient = value;
            if (this._gradient)
                this.iAddTexture(this._gradient);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
    };
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        var code = _super.prototype.iGetFragmentPreLightingCode.call(this, shader, methodVO, registerCache, sharedRegisters);
        this._pIsFirstLight = true;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        var code = "";
        var t;
        // write in temporary if not first light, so we can add to total diffuse colour
        if (this._pIsFirstLight)
            t = this._pTotalLightColorReg;
        else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }
        code += "dp3 " + t + ".w, " + lightDirReg + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
            "mul " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".x\n" +
            "add " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".x\n" +
            "mul " + t + ".xyz, " + t + ".w, " + lightDirReg + ".w\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);
        code += methodVO.secondaryTextureGL._iGetFragmentCode(t, registerCache, sharedRegisters, t) +
            //					"mul " + t + ".xyz, " + t + ".xyz, " + t + ".w\n" +
            "mul " + t + ".xyz, " + t + ".xyz, " + lightColReg + ".xyz\n";
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
    DiffuseGradientMethod.prototype.pApplyShadow = function (shader, methodVO, regCache, sharedRegisters) {
        var t = regCache.getFreeFragmentVectorTemp();
        return "mov " + t + ", " + sharedRegisters.shadowTarget + ".wwww\n" +
            methodVO.secondaryTextureGL._iGetFragmentCode(t, regCache, sharedRegisters, sharedRegisters.uvVarying) +
            "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
    };
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        methodVO.secondaryTextureGL.activate(methodVO.pass._render);
    };
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        _super.prototype.iSetRenderState.call(this, shader, methodVO, renderable, stage, camera);
        if (shader.numLights > 0)
            methodVO.secondaryTextureGL._setRenderState(renderable);
    };
    return DiffuseGradientMethod;
}(DiffuseBasicMethod_1.DiffuseBasicMethod));
exports.DiffuseGradientMethod = DiffuseGradientMethod;
