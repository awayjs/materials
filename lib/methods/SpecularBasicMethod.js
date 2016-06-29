"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("@awayjs/core/lib/events/AssetEvent");
var LightingMethodBase_1 = require("../methods/LightingMethodBase");
/**
 * SpecularBasicMethod provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
 * version of Phong specularity).
 */
var SpecularBasicMethod = (function (_super) {
    __extends(SpecularBasicMethod, _super);
    /**
     * Creates a new SpecularBasicMethod object.
     */
    function SpecularBasicMethod() {
        _super.call(this);
        this._gloss = 50;
        this._strength = 1;
        this._color = 0xffffff;
        this._iSpecularR = 1;
        this._iSpecularG = 1;
        this._iSpecularB = 1;
    }
    SpecularBasicMethod.prototype.iIsUsed = function (shader) {
        if (!shader.numLights)
            return false;
        return true;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsNormals = shader.numLights > 0;
        methodVO.needsView = shader.numLights > 0;
        if (this._texture) {
            methodVO.textureGL = shader.getAbstraction(this._texture);
            shader.uvDependencies++;
        }
        else if (methodVO.textureGL) {
            methodVO.textureGL.onClear(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.CLEAR, null));
            methodVO.textureGL = null;
        }
    };
    Object.defineProperty(SpecularBasicMethod.prototype, "gloss", {
        /**
         * The glossiness of the material (sharpness of the specular highlight).
         */
        get: function () {
            return this._gloss;
        },
        set: function (value) {
            this._gloss = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularBasicMethod.prototype, "strength", {
        /**
         * The overall strength of the specular highlights.
         */
        get: function () {
            return this._strength;
        },
        set: function (value) {
            if (value == this._strength)
                return;
            this._strength = value;
            this.updateSpecular();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularBasicMethod.prototype, "color", {
        /**
         * The colour of the specular reflection of the surface.
         */
        get: function () {
            return this._color;
        },
        set: function (value) {
            if (this._color == value)
                return;
            // specular is now either enabled or disabled
            if (this._color == 0 || value == 0)
                this.iInvalidateShaderProgram();
            this._color = value;
            this.updateSpecular();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularBasicMethod.prototype, "texture", {
        /**
         * A texture that defines the strength of specular reflections for each texel in the red channel,
         * and the gloss factor (sharpness) in the green channel. You can use Specular2DTexture if you want to easily set
         * specular and gloss maps from grayscale images, but correctly authored images are preferred.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            if (this._texture == value)
                return;
            if (this._texture)
                this.iRemoveTexture(this._texture);
            this._texture = value;
            if (this._texture)
                this.iAddTexture(this._texture);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.copyFrom = function (method) {
        var m = method;
        var bsm = method;
        var spec = bsm; //SpecularBasicMethod(method);
        this.texture = spec.texture;
        this.strength = spec.strength;
        this.color = spec.color;
        this.gloss = spec.gloss;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._pTotalLightColorReg = null;
        this._pSpecularTexData = null;
        this._pSpecularDataRegister = null;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        var code = "";
        this._pIsFirstLight = true;
        this._pSpecularDataRegister = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = this._pSpecularDataRegister.index * 4;
        if (this._texture) {
            this._pSpecularTexData = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(this._pSpecularTexData, 1);
            code += methodVO.textureGL._iGetFragmentCode(this._pSpecularTexData, registerCache, sharedRegisters, sharedRegisters.uvVarying);
        }
        this._pTotalLightColorReg = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(this._pTotalLightColorReg, 1);
        return code;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        var code = "";
        var t;
        if (this._pIsFirstLight) {
            t = this._pTotalLightColorReg;
        }
        else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }
        var viewDirReg = sharedRegisters.viewDirFragment;
        var normalReg = sharedRegisters.normalFragment;
        // blinn-phong half vector model
        code += "add " + t + ", " + lightDirReg + ", " + viewDirReg + "\n" +
            "nrm " + t + ".xyz, " + t + "\n" +
            "dp3 " + t + ".w, " + normalReg + ", " + t + "\n" +
            "sat " + t + ".w, " + t + ".w\n";
        if (this._texture) {
            // apply gloss modulation from texture
            code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" +
                "pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
        }
        else {
            code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";
        }
        // attenuate
        if (shader.usesLightFallOff)
            code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);
        code += "mul " + t + ".xyz, " + lightColReg + ", " + t + ".w\n";
        if (!this._pIsFirstLight) {
            code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
            registerCache.removeFragmentTempUsage(t);
        }
        this._pIsFirstLight = false;
        return code;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iGetFragmentCodePerProbe = function (shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
        var code = "";
        var t;
        // write in temporary if not first light, so we can add to total diffuse colour
        if (this._pIsFirstLight) {
            t = this._pTotalLightColorReg;
        }
        else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }
        var normalReg = sharedRegisters.normalFragment;
        var viewDirReg = sharedRegisters.viewDirFragment;
        code += "dp3 " + t + ".w, " + normalReg + ", " + viewDirReg + "\n" +
            "add " + t + ".w, " + t + ".w, " + t + ".w\n" +
            "mul " + t + ", " + t + ".w, " + normalReg + "\n" +
            "sub " + t + ", " + t + ", " + viewDirReg + "\n" +
            "tex " + t + ", " + t + ", " + cubeMapReg + " <cube," + "linear" + ",miplinear>\n" +
            "mul " + t + ".xyz, " + t + ", " + weightRegister + "\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);
        if (!this._pIsFirstLight) {
            code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
            registerCache.removeFragmentTempUsage(t);
        }
        this._pIsFirstLight = false;
        return code;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iGetFragmentPostLightingCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        if (sharedRegisters.shadowTarget)
            code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";
        if (this._texture) {
            // apply strength modulation from texture
            code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + this._pSpecularTexData + ".x\n";
            registerCache.removeFragmentTempUsage(this._pSpecularTexData);
        }
        // apply material's specular reflection
        code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + this._pSpecularDataRegister + "\n" +
            "add " + targetReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n";
        registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
        return code;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iActivate = function (shader, methodVO, stage) {
        if (this._texture)
            methodVO.textureGL.activate(methodVO.pass._render);
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = this._iSpecularR;
        data[index + 1] = this._iSpecularG;
        data[index + 2] = this._iSpecularB;
        data[index + 3] = this._gloss;
    };
    SpecularBasicMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        if (this._texture)
            methodVO.textureGL._setRenderState(renderable);
    };
    /**
     * Updates the specular color data used by the render state.
     */
    SpecularBasicMethod.prototype.updateSpecular = function () {
        this._iSpecularR = ((this._color >> 16) & 0xff) / 0xff * this._strength;
        this._iSpecularG = ((this._color >> 8) & 0xff) / 0xff * this._strength;
        this._iSpecularB = (this._color & 0xff) / 0xff * this._strength;
    };
    return SpecularBasicMethod;
}(LightingMethodBase_1.LightingMethodBase));
exports.SpecularBasicMethod = SpecularBasicMethod;
