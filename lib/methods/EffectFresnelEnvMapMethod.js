"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EffectMethodBase_1 = require("../methods/EffectMethodBase");
/**
 * EffectFresnelEnvMapMethod provides a method to add fresnel-based reflectivity to an object using cube maps, which gets
 * stronger as the viewing angle becomes more grazing.
 */
var EffectFresnelEnvMapMethod = (function (_super) {
    __extends(EffectFresnelEnvMapMethod, _super);
    /**
     * Creates a new <code>EffectFresnelEnvMapMethod</code> object.
     *
     * @param envMap The environment map containing the reflected scene.
     * @param alpha The reflectivity of the material.
     */
    function EffectFresnelEnvMapMethod(envMap, alpha) {
        if (alpha === void 0) { alpha = 1; }
        _super.call(this);
        this._fresnelPower = 5;
        this._normalReflectance = 0;
        this._envMap = envMap;
        this._alpha = alpha;
        if (this._envMap)
            this.iAddTexture(this._envMap);
    }
    /**
     * @inheritDoc
     */
    EffectFresnelEnvMapMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsNormals = true;
        methodVO.needsView = true;
        methodVO.textureGL = shader.getAbstraction(this._envMap);
        if (this._mask != null) {
            methodVO.secondaryTextureGL = shader.getAbstraction(this._mask);
            shader.uvDependencies++;
        }
    };
    /**
     * @inheritDoc
     */
    EffectFresnelEnvMapMethod.prototype.iInitConstants = function (shader, methodVO) {
        shader.fragmentConstantData[methodVO.fragmentConstantsIndex + 3] = 1;
    };
    Object.defineProperty(EffectFresnelEnvMapMethod.prototype, "mask", {
        /**
         * An optional texture to modulate the reflectivity of the surface.
         */
        get: function () {
            return this._mask;
        },
        set: function (value) {
            if (this._mask == value)
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
    Object.defineProperty(EffectFresnelEnvMapMethod.prototype, "fresnelPower", {
        /**
         * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
         */
        get: function () {
            return this._fresnelPower;
        },
        set: function (value) {
            this._fresnelPower = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectFresnelEnvMapMethod.prototype, "envMap", {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectFresnelEnvMapMethod.prototype, "alpha", {
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
    Object.defineProperty(EffectFresnelEnvMapMethod.prototype, "normalReflectance", {
        /**
         * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
         */
        get: function () {
            return this._normalReflectance;
        },
        set: function (value) {
            this._normalReflectance = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectFresnelEnvMapMethod.prototype.iActivate = function (shader, methodVO, stage) {
        var data = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index] = this._alpha;
        data[index + 1] = this._normalReflectance;
        data[index + 2] = this._fresnelPower;
        methodVO.textureGL.activate(methodVO.pass._render);
        if (this._mask)
            methodVO.secondaryTextureGL.activate(methodVO.pass._render);
    };
    EffectFresnelEnvMapMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        methodVO.textureGL._setRenderState(renderable);
        if (this._mask)
            methodVO.secondaryTextureGL._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    EffectFresnelEnvMapMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var dataRegister = registerCache.getFreeFragmentConstant();
        var code = "";
        var viewDirReg = sharedRegisters.viewDirFragment;
        var normalReg = sharedRegisters.normalFragment;
        methodVO.fragmentConstantsIndex = dataRegister.index * 4;
        var temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp2, 1);
        // r = V - 2(V.N)*N
        code += "dp3 " + temp + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
            "add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" +
            "mul " + temp + ".xyz, " + normalReg + ".xyz, " + temp + ".w\n" +
            "sub " + temp + ".xyz, " + temp + ".xyz, " + viewDirReg + ".xyz\n" +
            methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) +
            "sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" +
            "kil " + temp2 + ".w\n" +
            "sub " + temp + ", " + temp + ", " + targetReg + "\n";
        // calculate fresnel term
        code += "dp3 " + viewDirReg + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
            "sub " + viewDirReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" +
            "pow " + viewDirReg + ".w, " + viewDirReg + ".w, " + dataRegister + ".z\n" +
            "sub " + normalReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" +
            "mul " + normalReg + ".w, " + dataRegister + ".y, " + normalReg + ".w\n" +
            "add " + viewDirReg + ".w, " + viewDirReg + ".w, " + normalReg + ".w\n" +
            // total alpha
            "mul " + viewDirReg + ".w, " + dataRegister + ".x, " + viewDirReg + ".w\n";
        if (this._mask) {
            code += methodVO.secondaryTextureGL._iGetFragmentCode(temp2, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
                "mul " + viewDirReg + ".w, " + temp2 + ".x, " + viewDirReg + ".w\n";
        }
        // blend
        code += "mul " + temp + ", " + temp + ", " + viewDirReg + ".w\n" +
            "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
        registerCache.removeFragmentTempUsage(temp);
        registerCache.removeFragmentTempUsage(temp2);
        return code;
    };
    return EffectFresnelEnvMapMethod;
}(EffectMethodBase_1.EffectMethodBase));
exports.EffectFresnelEnvMapMethod = EffectFresnelEnvMapMethod;
