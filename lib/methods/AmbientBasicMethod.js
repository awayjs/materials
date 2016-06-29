"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("@awayjs/core/lib/events/AssetEvent");
var ShadingMethodBase_1 = require("../methods/ShadingMethodBase");
/**
 * AmbientBasicMethod provides the default shading method for uniform ambient lighting.
 */
var AmbientBasicMethod = (function (_super) {
    __extends(AmbientBasicMethod, _super);
    /**
     * Creates a new AmbientBasicMethod object.
     */
    function AmbientBasicMethod() {
        _super.call(this);
        this._alpha = 1;
        this._colorR = 1;
        this._colorG = 1;
        this._colorB = 1;
        this._strength = 1;
    }
    /**
     * @inheritDoc
     */
    AmbientBasicMethod.prototype.iInitVO = function (shader, methodVO) {
        if (this._texture) {
            methodVO.textureGL = shader.getAbstraction(this._texture);
            shader.uvDependencies++;
        }
        else if (methodVO.textureGL) {
            methodVO.textureGL.onClear(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.CLEAR, this._texture));
            methodVO.textureGL = null;
        }
    };
    /**
     * @inheritDoc
     */
    AmbientBasicMethod.prototype.iInitConstants = function (shader, methodVO) {
        if (!methodVO.textureGL) {
            this._color = shader.numLights ? 0xFFFFFF : methodVO.pass._surface.style.color;
            this.updateColor();
        }
    };
    Object.defineProperty(AmbientBasicMethod.prototype, "strength", {
        /**
         * The strength of the ambient reflection of the surface.
         */
        get: function () {
            return this._strength;
        },
        set: function (value) {
            if (this._strength == value)
                return;
            this._strength = value;
            this.updateColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmbientBasicMethod.prototype, "alpha", {
        /**
         * The alpha component of the surface.
         */
        get: function () {
            return this._alpha;
        },
        set: function (value) {
            if (this._alpha == value)
                return;
            this._alpha = value;
            this.updateColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmbientBasicMethod.prototype, "texture", {
        /**
         * The texture to use to define the diffuse reflection color per texel.
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
    AmbientBasicMethod.prototype.copyFrom = function (method) {
        var m = method;
        var b = m;
    };
    /**
     * @inheritDoc
     */
    AmbientBasicMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        if (methodVO.textureGL) {
            code += methodVO.textureGL._iGetFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying);
            if (shader.alphaThreshold > 0) {
                var cutOffReg = registerCache.getFreeFragmentConstant();
                methodVO.fragmentConstantsIndex = cutOffReg.index * 4;
                code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" +
                    "kil " + targetReg + ".w\n" +
                    "add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
            }
        }
        else {
            var ambientInputRegister = registerCache.getFreeFragmentConstant();
            methodVO.fragmentConstantsIndex = ambientInputRegister.index * 4;
            code += "mov " + targetReg + ", " + ambientInputRegister + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    AmbientBasicMethod.prototype.iActivate = function (shader, methodVO, stage) {
        if (methodVO.textureGL) {
            methodVO.textureGL.activate(methodVO.pass._render);
            if (shader.alphaThreshold > 0)
                shader.fragmentConstantData[methodVO.fragmentConstantsIndex] = shader.alphaThreshold;
        }
        else {
            var index = methodVO.fragmentConstantsIndex;
            var data = shader.fragmentConstantData;
            data[index] = this._colorR;
            data[index + 1] = this._colorG;
            data[index + 2] = this._colorB;
            data[index + 3] = this._alpha;
        }
    };
    AmbientBasicMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        if (methodVO.textureGL)
            methodVO.textureGL._setRenderState(renderable);
    };
    /**
     * Updates the ambient color data used by the render state.
     */
    AmbientBasicMethod.prototype.updateColor = function () {
        this._colorR = ((this._color >> 16) & 0xff) / 0xff * this._strength;
        this._colorG = ((this._color >> 8) & 0xff) / 0xff * this._strength;
        this._colorB = (this._color & 0xff) / 0xff * this._strength;
    };
    return AmbientBasicMethod;
}(ShadingMethodBase_1.ShadingMethodBase));
exports.AmbientBasicMethod = AmbientBasicMethod;
