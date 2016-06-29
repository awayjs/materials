"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ShadingMethodEvent_1 = require("@awayjs/renderer/lib/events/ShadingMethodEvent");
var DiffuseBasicMethod_1 = require("../methods/DiffuseBasicMethod");
/**
 * DiffuseCompositeMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
 * calculated diffuse reflection strength.
 */
var DiffuseCompositeMethod = (function (_super) {
    __extends(DiffuseCompositeMethod, _super);
    /**
     * Creates a new <code>DiffuseCompositeMethod</code> object.
     *
     * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
     * @param baseMethod The base diffuse method on which this method's shading is based.
     */
    function DiffuseCompositeMethod(modulateMethod, baseMethod) {
        var _this = this;
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this);
        this._onShaderInvalidatedDelegate = function (event) { return _this.onShaderInvalidated(event); };
        this.pBaseMethod = baseMethod || new DiffuseBasicMethod_1.DiffuseBasicMethod();
        this.pBaseMethod._iModulateMethod = modulateMethod;
        this.pBaseMethod.addEventListener(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
    }
    Object.defineProperty(DiffuseCompositeMethod.prototype, "baseMethod", {
        /**
         * The base diffuse method on which this method's shading is based.
         */
        get: function () {
            return this.pBaseMethod;
        },
        set: function (value) {
            if (this.pBaseMethod == value)
                return;
            this.pBaseMethod.removeEventListener(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            this.pBaseMethod = value;
            this.pBaseMethod.addEventListener(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iInitVO = function (shader, methodVO) {
        this.pBaseMethod.iInitVO(shader, methodVO);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iInitConstants = function (shader, methodVO) {
        this.pBaseMethod.iInitConstants(shader, methodVO);
    };
    DiffuseCompositeMethod.prototype.iAddOwner = function (owner) {
        _super.prototype.iAddOwner.call(this, owner);
        this.pBaseMethod.iAddOwner(owner);
    };
    DiffuseCompositeMethod.prototype.iRemoveOwner = function (owner) {
        _super.prototype.iRemoveOwner.call(this, owner);
        this.pBaseMethod.iRemoveOwner(owner);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.dispose = function () {
        this.pBaseMethod.removeEventListener(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
        this.pBaseMethod.dispose();
    };
    Object.defineProperty(DiffuseCompositeMethod.prototype, "texture", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this.pBaseMethod.texture;
        },
        /**
         * @inheritDoc
         */
        set: function (value) {
            this.pBaseMethod.texture = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseCompositeMethod.prototype, "color", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this.pBaseMethod.color;
        },
        /**
         * @inheritDoc
         */
        set: function (value) {
            this.pBaseMethod.color = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseCompositeMethod.prototype, "multiply", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this.pBaseMethod.multiply;
        },
        /**
         * @inheritDoc
         */
        set: function (value) {
            this.pBaseMethod.multiply = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        return this.pBaseMethod.iGetFragmentPreLightingCode(shader, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        var code = this.pBaseMethod.iGetFragmentCodePerLight(shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
        this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentCodePerProbe = function (shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
        var code = this.pBaseMethod.iGetFragmentCodePerProbe(shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
        this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iActivate = function (shader, methodVO, stage) {
        this.pBaseMethod.iActivate(shader, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        this.pBaseMethod.iSetRenderState(shader, methodVO, renderable, stage, camera);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iDeactivate = function (shader, methodVO, stage) {
        this.pBaseMethod.iDeactivate(shader, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetVertexCode = function (shader, methodVO, registerCache, sharedRegisters) {
        return this.pBaseMethod.iGetVertexCode(shader, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentPostLightingCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        return this.pBaseMethod.iGetFragmentPostLightingCode(shader, methodVO, targetReg, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iReset = function () {
        this.pBaseMethod.iReset();
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this.pBaseMethod.iCleanCompilationData();
    };
    /**
     * Called when the base method's shader code is invalidated.
     */
    DiffuseCompositeMethod.prototype.onShaderInvalidated = function (event) {
        this.iInvalidateShaderProgram();
    };
    return DiffuseCompositeMethod;
}(DiffuseBasicMethod_1.DiffuseBasicMethod));
exports.DiffuseCompositeMethod = DiffuseCompositeMethod;
