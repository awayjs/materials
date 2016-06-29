"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EffectMethodBase_1 = require("../methods/EffectMethodBase");
/**
 * EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
 */
var EffectEnvMapMethod = (function (_super) {
    __extends(EffectEnvMapMethod, _super);
    /**
     * Creates an EffectEnvMapMethod object.
     * @param envMap The environment map containing the reflected scene.
     * @param alpha The reflectivity of the surface.
     */
    function EffectEnvMapMethod(envMap, alpha) {
        if (alpha === void 0) { alpha = 1; }
        _super.call(this);
        this._envMap = envMap;
        this._alpha = alpha;
        if (this._envMap)
            this.iAddTexture(this._envMap);
    }
    Object.defineProperty(EffectEnvMapMethod.prototype, "mask", {
        /**
         * An optional texture to modulate the reflectivity of the surface.
         */
        get: function () {
            return this._mask;
        },
        set: function (value) {
            if (value == this._mask)
                return;
            if (this._mask)
                this.iRemoveTexture(this._mask);
            this._mask = value;
            if (this._mask)
                this.iAddTexture(this._mask);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectEnvMapMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsNormals = true;
        methodVO.needsView = true;
        if (this._envMap)
            methodVO.textureGL = shader.getAbstraction(this._envMap);
        if (this._mask) {
            methodVO.secondaryTextureGL = shader.getAbstraction(this._mask);
            shader.uvDependencies++;
        }
    };
    Object.defineProperty(EffectEnvMapMethod.prototype, "envMap", {
        /**
         * The cubic environment map containing the reflected scene.
         */
        get: function () {
            return this._envMap;
        },
        set: function (value) {
            if (this._envMap == value)
                return;
            if (this._envMap)
                this.iRemoveTexture(this._envMap);
            this._envMap = value;
            if (this._envMap)
                this.iAddTexture(this._envMap);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectEnvMapMethod.prototype.dispose = function () {
    };
    Object.defineProperty(EffectEnvMapMethod.prototype, "alpha", {
        /**
         * The reflectivity of the surface.
         */
        get: function () {
            return this._alpha;
        },
        set: function (value) {
            this._alpha = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectEnvMapMethod.prototype.iActivate = function (shader, methodVO, stage) {
        shader.fragmentConstantData[methodVO.fragmentConstantsIndex] = this._alpha;
        methodVO.textureGL.activate(methodVO.pass._render);
        if (this._mask)
            methodVO.secondaryTextureGL.activate(methodVO.pass._render);
    };
    EffectEnvMapMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        methodVO.textureGL._setRenderState(renderable);
        if (this._mask)
            methodVO.secondaryTextureGL._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    EffectEnvMapMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var dataRegister = registerCache.getFreeFragmentConstant();
        var code = "";
        methodVO.fragmentConstantsIndex = dataRegister.index * 4;
        var temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp2, 1);
        // r = I - 2(I.N)*N
        code += "dp3 " + temp + ".w, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
            "add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" +
            "mul " + temp + ".xyz, " + sharedRegisters.normalFragment + ".xyz, " + temp + ".w\n" +
            "sub " + temp + ".xyz, " + temp + ".xyz, " + sharedRegisters.viewDirFragment + ".xyz\n" +
            methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) +
            "sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" +
            "kil " + temp2 + ".w\n" +
            "sub " + temp + ", " + temp + ", " + targetReg + "\n";
        if (this._mask) {
            code += methodVO.secondaryTextureGL._iGetFragmentCode(temp2, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
                "mul " + temp + ", " + temp2 + ", " + temp + "\n";
        }
        code += "mul " + temp + ", " + temp + ", " + dataRegister + ".x\n" +
            "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
        registerCache.removeFragmentTempUsage(temp);
        registerCache.removeFragmentTempUsage(temp2);
        return code;
    };
    return EffectEnvMapMethod;
}(EffectMethodBase_1.EffectMethodBase));
exports.EffectEnvMapMethod = EffectEnvMapMethod;
