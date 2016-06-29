"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ShadingMethodEvent_1 = require("@awayjs/renderer/lib/events/ShadingMethodEvent");
var SpecularBasicMethod_1 = require("../methods/SpecularBasicMethod");
/**
 * SpecularCompositeMethod provides a base class for specular methods that wrap a specular method to alter the
 * calculated specular reflection strength.
 */
var SpecularCompositeMethod = (function (_super) {
    __extends(SpecularCompositeMethod, _super);
    /**
     * Creates a new <code>SpecularCompositeMethod</code> object.
     *
     * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature modSpecular(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the specular strength and t.xyz will contain the half-vector or the reflection vector.
     * @param baseMethod The base specular method on which this method's shading is based.
     */
    function SpecularCompositeMethod(modulateMethod, baseMethod) {
        var _this = this;
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this);
        this._onShaderInvalidatedDelegate = function (event) { return _this.onShaderInvalidated(event); };
        this._baseMethod = baseMethod || new SpecularBasicMethod_1.SpecularBasicMethod();
        this._baseMethod._iModulateMethod = modulateMethod;
        this._baseMethod.addEventListener(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
    }
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iInitVO = function (shader, methodVO) {
        this._baseMethod.iInitVO(shader, methodVO);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iInitConstants = function (shader, methodVO) {
        this._baseMethod.iInitConstants(shader, methodVO);
    };
    SpecularCompositeMethod.prototype.iAddOwner = function (owner) {
        _super.prototype.iAddOwner.call(this, owner);
        this._baseMethod.iAddOwner(owner);
    };
    SpecularCompositeMethod.prototype.iRemoveOwner = function (owner) {
        _super.prototype.iRemoveOwner.call(this, owner);
        this._baseMethod.iRemoveOwner(owner);
    };
    Object.defineProperty(SpecularCompositeMethod.prototype, "baseMethod", {
        /**
         * The base specular method on which this method's shading is based.
         */
        get: function () {
            return this._baseMethod;
        },
        set: function (value) {
            if (this._baseMethod == value)
                return;
            this._baseMethod.removeEventListener(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            this._baseMethod = value;
            this._baseMethod.addEventListener(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularCompositeMethod.prototype, "gloss", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._baseMethod.gloss;
        },
        set: function (value) {
            this._baseMethod.gloss = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularCompositeMethod.prototype, "strength", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._baseMethod.strength;
        },
        set: function (value) {
            this._baseMethod.strength = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularCompositeMethod.prototype, "color", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._baseMethod.color;
        },
        /**
         * @inheritDoc
         */
        set: function (value) {
            this._baseMethod.color = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.dispose = function () {
        this._baseMethod.removeEventListener(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
        this._baseMethod.dispose();
    };
    Object.defineProperty(SpecularCompositeMethod.prototype, "texture", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._baseMethod.texture;
        },
        set: function (value) {
            this._baseMethod.texture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iActivate = function (shader, methodVO, stage) {
        this._baseMethod.iActivate(shader, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        this._baseMethod.iSetRenderState(shader, methodVO, renderable, stage, camera);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iDeactivate = function (shader, methodVO, stage) {
        this._baseMethod.iDeactivate(shader, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iGetVertexCode = function (shader, methodVO, registerCache, sharedRegisters) {
        return this._baseMethod.iGetVertexCode(shader, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        return this._baseMethod.iGetFragmentPreLightingCode(shader, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        return this._baseMethod.iGetFragmentCodePerLight(shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     * @return
     */
    SpecularCompositeMethod.prototype.iGetFragmentCodePerProbe = function (shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
        return this._baseMethod.iGetFragmentCodePerProbe(shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iGetFragmentPostLightingCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        return this._baseMethod.iGetFragmentPostLightingCode(shader, methodVO, targetReg, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iReset = function () {
        this._baseMethod.iReset();
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._baseMethod.iCleanCompilationData();
    };
    /**
     * Called when the base method's shader code is invalidated.
     */
    SpecularCompositeMethod.prototype.onShaderInvalidated = function (event) {
        this.iInvalidateShaderProgram();
    };
    return SpecularCompositeMethod;
}(SpecularBasicMethod_1.SpecularBasicMethod));
exports.SpecularCompositeMethod = SpecularCompositeMethod;
