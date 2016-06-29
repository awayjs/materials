"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EffectMethodBase_1 = require("../methods/EffectMethodBase");
/**
 * EffectRefractionEnvMapMethod provides a method to add refracted transparency based on cube maps.
 */
var EffectRefractionEnvMapMethod = (function (_super) {
    __extends(EffectRefractionEnvMapMethod, _super);
    /**
     * Creates a new EffectRefractionEnvMapMethod object. Example values for dispersion are: dispersionR: -0.03, dispersionG: -0.01, dispersionB: = .0015
     *
     * @param envMap The environment map containing the refracted scene.
     * @param refractionIndex The refractive index of the material.
     * @param dispersionR The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
     * @param dispersionG The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
     * @param dispersionB The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
     */
    function EffectRefractionEnvMapMethod(envMap, refractionIndex, dispersionR, dispersionG, dispersionB) {
        if (refractionIndex === void 0) { refractionIndex = .1; }
        if (dispersionR === void 0) { dispersionR = 0; }
        if (dispersionG === void 0) { dispersionG = 0; }
        if (dispersionB === void 0) { dispersionB = 0; }
        _super.call(this);
        this._dispersionR = 0;
        this._dispersionG = 0;
        this._dispersionB = 0;
        this._alpha = 1;
        this._envMap = envMap;
        this._dispersionR = dispersionR;
        this._dispersionG = dispersionG;
        this._dispersionB = dispersionB;
        this._useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
        this._refractionIndex = refractionIndex;
        if (this._envMap)
            this.iAddTexture(this._envMap);
    }
    /**
     * @inheritDoc
     */
    EffectRefractionEnvMapMethod.prototype.iInitConstants = function (shader, methodVO) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index + 4] = 1;
        data[index + 5] = 0;
        data[index + 7] = 1;
    };
    /**
     * @inheritDoc
     */
    EffectRefractionEnvMapMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsNormals = true;
        methodVO.needsView = true;
        methodVO.textureGL = shader.getAbstraction(this._envMap);
    };
    Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "envMap", {
        /**
         * The cube environment map to use for the refraction.
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "refractionIndex", {
        /**
         * The refractive index of the material.
         */
        get: function () {
            return this._refractionIndex;
        },
        set: function (value) {
            this._refractionIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "dispersionR", {
        /**
         * The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
         */
        get: function () {
            return this._dispersionR;
        },
        set: function (value) {
            this._dispersionR = value;
            var useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
            if (this._useDispersion != useDispersion) {
                this.iInvalidateShaderProgram();
                this._useDispersion = useDispersion;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "dispersionG", {
        /**
         * The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
         */
        get: function () {
            return this._dispersionG;
        },
        set: function (value) {
            this._dispersionG = value;
            var useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
            if (this._useDispersion != useDispersion) {
                this.iInvalidateShaderProgram();
                this._useDispersion = useDispersion;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "dispersionB", {
        /**
         * The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
         */
        get: function () {
            return this._dispersionB;
        },
        set: function (value) {
            this._dispersionB = value;
            var useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
            if (this._useDispersion != useDispersion) {
                this.iInvalidateShaderProgram();
                this._useDispersion = useDispersion;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "alpha", {
        /**
         * The amount of transparency of the object. Warning: the alpha applies to the refracted color, not the actual
         * material. A value of 1 will make it appear fully transparent.
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
    EffectRefractionEnvMapMethod.prototype.iActivate = function (shader, methodVO, stage) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = this._dispersionR + this._refractionIndex;
        if (this._useDispersion) {
            data[index + 1] = this._dispersionG + this._refractionIndex;
            data[index + 2] = this._dispersionB + this._refractionIndex;
        }
        data[index + 3] = this._alpha;
        methodVO.textureGL.activate(methodVO.pass._render);
    };
    EffectRefractionEnvMapMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        methodVO.textureGL._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    EffectRefractionEnvMapMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        // todo: data2.x could use common reg, so only 1 reg is used
        var data = registerCache.getFreeFragmentConstant();
        var data2 = registerCache.getFreeFragmentConstant();
        var code = "";
        var refractionDir;
        var refractionColor;
        var temp;
        methodVO.fragmentConstantsIndex = data.index * 4;
        refractionDir = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(refractionDir, 1);
        refractionColor = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(refractionColor, 1);
        temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var viewDirReg = sharedRegisters.viewDirFragment;
        var normalReg = sharedRegisters.normalFragment;
        code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";
        code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
            "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
            "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
            "mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" +
            "mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" +
            "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
            "sqt " + temp + ".y, " + temp + ".w\n" +
            "mul " + temp + ".x, " + data + ".x, " + temp + ".x\n" +
            "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
            "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +
            "mul " + refractionDir + ", " + data + ".x, " + viewDirReg + "\n" +
            "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
            "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" +
            methodVO.textureGL._iGetFragmentCode(refractionColor, registerCache, sharedRegisters, refractionDir) +
            "sub " + refractionColor + ".w, " + refractionColor + ".w, fc0.x	\n" +
            "kil " + refractionColor + ".w\n";
        if (this._useDispersion) {
            // GREEN
            code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
                "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
                "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
                "mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" +
                "mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" +
                "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
                "sqt " + temp + ".y, " + temp + ".w\n" +
                "mul " + temp + ".x, " + data + ".y, " + temp + ".x\n" +
                "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
                "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +
                "mul " + refractionDir + ", " + data + ".y, " + viewDirReg + "\n" +
                "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
                "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" +
                methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, refractionDir) +
                "mov " + refractionColor + ".y, " + temp + ".y\n";
            // BLUE
            code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
                "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
                "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
                "mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" +
                "mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" +
                "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
                "sqt " + temp + ".y, " + temp + ".w\n" +
                "mul " + temp + ".x, " + data + ".z, " + temp + ".x\n" +
                "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
                "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +
                "mul " + refractionDir + ", " + data + ".z, " + viewDirReg + "\n" +
                "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
                "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" +
                methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, refractionDir) +
                "mov " + refractionColor + ".z, " + temp + ".z\n";
        }
        code += "sub " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + targetReg + ".xyz\n" +
            "mul " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + data + ".w\n" +
            "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + refractionColor + ".xyz\n";
        registerCache.removeFragmentTempUsage(temp);
        registerCache.removeFragmentTempUsage(refractionDir);
        registerCache.removeFragmentTempUsage(refractionColor);
        // restore
        code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";
        return code;
    };
    return EffectRefractionEnvMapMethod;
}(EffectMethodBase_1.EffectMethodBase));
exports.EffectRefractionEnvMapMethod = EffectRefractionEnvMapMethod;
