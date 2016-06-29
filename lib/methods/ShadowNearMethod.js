"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ShadingMethodEvent_1 = require("@awayjs/renderer/lib/events/ShadingMethodEvent");
var ShadowMethodBase_1 = require("../methods/ShadowMethodBase");
// TODO: shadow mappers references in materials should be an interface so that this class should NOT extend ShadowMapMethodBase just for some delegation work
/**
 * ShadowNearMethod provides a shadow map method that restricts the shadowed area near the camera to optimize
 * shadow map usage. This method needs to be used in conjunction with a NearDirectionalShadowMapper.
 *
 * @see away.lights.NearDirectionalShadowMapper
 */
var ShadowNearMethod = (function (_super) {
    __extends(ShadowNearMethod, _super);
    /**
     * Creates a new ShadowNearMethod object.
     * @param baseMethod The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
     * @param fadeRatio The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
     */
    function ShadowNearMethod(baseMethod, fadeRatio) {
        var _this = this;
        if (fadeRatio === void 0) { fadeRatio = .1; }
        _super.call(this, baseMethod.castingLight);
        this._onShaderInvalidatedDelegate = function (event) { return _this.onShaderInvalidated(event); };
        this._baseMethod = baseMethod;
        this._fadeRatio = fadeRatio;
        this._nearShadowMapper = this._pCastingLight.shadowMapper;
        if (!this._nearShadowMapper)
            throw new Error("ShadowNearMethod requires a light that has a NearDirectionalShadowMapper instance assigned to shadowMapper.");
        this._baseMethod.addEventListener(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
    }
    Object.defineProperty(ShadowNearMethod.prototype, "baseMethod", {
        /**
         * The base shadow map method on which this method's shading is based.
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
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iInitConstants = function (shader, methodVO) {
        _super.prototype.iInitConstants.call(this, shader, methodVO);
        this._baseMethod.iInitConstants(shader, methodVO);
        var fragmentData = shader.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        fragmentData[index + 2] = 0;
        fragmentData[index + 3] = 1;
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iInitVO = function (shader, methodVO) {
        this._baseMethod.iInitVO(shader, methodVO);
        methodVO.needsProjection = true;
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.dispose = function () {
        this._baseMethod.removeEventListener(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
    };
    Object.defineProperty(ShadowNearMethod.prototype, "alpha", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._baseMethod.alpha;
        },
        set: function (value) {
            this._baseMethod.alpha = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowNearMethod.prototype, "epsilon", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._baseMethod.epsilon;
        },
        set: function (value) {
            this._baseMethod.epsilon = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowNearMethod.prototype, "fadeRatio", {
        /**
         * The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
         */
        get: function () {
            return this._fadeRatio;
        },
        set: function (value) {
            this._fadeRatio = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = this._baseMethod.iGetFragmentCode(shader, methodVO, targetReg, registerCache, sharedRegisters);
        var dataReg = registerCache.getFreeFragmentConstant();
        var temp = registerCache.getFreeFragmentSingleTemp();
        methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
        code += "abs " + temp + ", " + sharedRegisters.projectionFragment + ".w\n" +
            "sub " + temp + ", " + temp + ", " + dataReg + ".x\n" +
            "mul " + temp + ", " + temp + ", " + dataReg + ".y\n" +
            "sat " + temp + ", " + temp + "\n" +
            "sub " + temp + ", " + dataReg + ".w," + temp + "\n" +
            "sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n" +
            "mul " + targetReg + ".w, " + targetReg + ".w, " + temp + "\n" +
            "sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iActivate = function (shader, methodVO, stage) {
        this._baseMethod.iActivate(shader, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iDeactivate = function (shader, methodVO, stage) {
        this._baseMethod.iDeactivate(shader, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        // todo: move this to activate (needs camera)
        var near = camera.projection.near;
        var d = camera.projection.far - near;
        var maxDistance = this._nearShadowMapper.coverageRatio;
        var minDistance = maxDistance * (1 - this._fadeRatio);
        maxDistance = near + maxDistance * d;
        minDistance = near + minDistance * d;
        var fragmentData = shader.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        fragmentData[index] = minDistance;
        fragmentData[index + 1] = 1 / (maxDistance - minDistance);
        this._baseMethod.iSetRenderState(shader, methodVO, renderable, stage, camera);
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iGetVertexCode = function (shader, methodVO, registerCache, sharedRegisters) {
        return this._baseMethod.iGetVertexCode(shader, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iReset = function () {
        this._baseMethod.iReset();
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._baseMethod.iCleanCompilationData();
    };
    /**
     * Called when the base method's shader code is invalidated.
     */
    ShadowNearMethod.prototype.onShaderInvalidated = function (event) {
        this.iInvalidateShaderProgram();
    };
    return ShadowNearMethod;
}(ShadowMethodBase_1.ShadowMethodBase));
exports.ShadowNearMethod = ShadowNearMethod;
