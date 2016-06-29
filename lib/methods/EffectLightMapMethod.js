"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EffectMethodBase_1 = require("../methods/EffectMethodBase");
/**
 * EffectLightMapMethod provides a method that allows applying a light map texture to the calculated pixel colour.
 * It is different from DiffuseLightMapMethod in that the latter only modulates the diffuse shading value rather
 * than the whole pixel colour.
 */
var EffectLightMapMethod = (function (_super) {
    __extends(EffectLightMapMethod, _super);
    /**
     * Creates a new EffectLightMapMethod object.
     *
     * @param lightMap The texture containing the light map.
     * @param blendMode The blend mode with which the light map should be applied to the lighting result.
     * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
     */
    function EffectLightMapMethod(lightMap, blendMode, useSecondaryUV) {
        if (blendMode === void 0) { blendMode = "multiply"; }
        if (useSecondaryUV === void 0) { useSecondaryUV = false; }
        _super.call(this);
        if (blendMode != EffectLightMapMethod.ADD && blendMode != EffectLightMapMethod.MULTIPLY)
            throw new Error("Unknown blendmode!");
        this._lightMap = lightMap;
        this._blendMode = blendMode;
        this._useSecondaryUV = useSecondaryUV;
        if (this._lightMap)
            this.iAddTexture(this._lightMap);
    }
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.textureGL = shader.getAbstraction(this._lightMap);
        if (this._useSecondaryUV)
            shader.secondaryUVDependencies++;
        else
            shader.uvDependencies++;
    };
    Object.defineProperty(EffectLightMapMethod.prototype, "blendMode", {
        /**
         * The blend mode with which the light map should be applied to the lighting result.
         *
         * @see EffectLightMapMethod.ADD
         * @see EffectLightMapMethod.MULTIPLY
         */
        get: function () {
            return this._blendMode;
        },
        set: function (value) {
            if (this._blendMode == value)
                return;
            if (value != EffectLightMapMethod.ADD && value != EffectLightMapMethod.MULTIPLY)
                throw new Error("Unknown blendmode!");
            this._blendMode = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectLightMapMethod.prototype, "lightMap", {
        /**
         * The lightMap containing the light map.
         */
        get: function () {
            return this._lightMap;
        },
        set: function (value) {
            if (this._lightMap == value)
                return;
            if (this._lightMap)
                this.iRemoveTexture(this._lightMap);
            this._lightMap = value;
            if (this._lightMap)
                this.iAddTexture(this._lightMap);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectLightMapMethod.prototype, "useSecondaryUV", {
        /**
         * Indicates whether the secondary UV set should be used to map the light map.
         */
        get: function () {
            return this._useSecondaryUV;
        },
        set: function (value) {
            if (this._useSecondaryUV == value)
                return;
            this._useSecondaryUV = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code;
        var temp = registerCache.getFreeFragmentVectorTemp();
        code = methodVO.secondaryTextureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, this._useSecondaryUV ? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);
        switch (this._blendMode) {
            case EffectLightMapMethod.MULTIPLY:
                code += "mul " + targetReg + ", " + targetReg + ", " + temp + "\n";
                break;
            case EffectLightMapMethod.ADD:
                code += "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
                break;
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iActivate = function (shader, methodVO, stage) {
        methodVO.textureGL.activate(methodVO.pass._render);
    };
    EffectLightMapMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        methodVO.textureGL._setRenderState(renderable);
    };
    /**
     * Indicates the light map should be multiplied with the calculated shading result.
     */
    EffectLightMapMethod.MULTIPLY = "multiply";
    /**
     * Indicates the light map should be added into the calculated shading result.
     */
    EffectLightMapMethod.ADD = "add";
    return EffectLightMapMethod;
}(EffectMethodBase_1.EffectMethodBase));
exports.EffectLightMapMethod = EffectLightMapMethod;
