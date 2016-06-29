"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DiffuseCompositeMethod_1 = require("../methods/DiffuseCompositeMethod");
/**
 * DiffuseSubSurfaceMethod provides a depth map-based diffuse shading method that mimics the scattering of
 * light inside translucent surfaces. It allows light to shine through an object and to soften the diffuse shading.
 * It can be used for candle wax, ice, skin, ...
 */
var DiffuseSubSurfaceMethod = (function (_super) {
    __extends(DiffuseSubSurfaceMethod, _super);
    /**
     * Creates a new <code>DiffuseSubSurfaceMethod</code> object.
     *
     * @param depthMapSize The size of the depth map used.
     * @param depthMapOffset The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
     * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
     */
    function DiffuseSubSurfaceMethod(depthMapSize, depthMapOffset, baseMethod) {
        var _this = this;
        if (depthMapSize === void 0) { depthMapSize = 512; }
        if (depthMapOffset === void 0) { depthMapOffset = 15; }
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this, null, baseMethod);
        this._translucency = 1;
        this._scatterColor = 0xffffff;
        this._scatterR = 1.0;
        this._scatterG = 1.0;
        this._scatterB = 1.0;
        this.pBaseMethod._iModulateMethod = function (shader, methodVO, targetReg, registerCache, sharedRegisters) { return _this.scatterLight(shader, methodVO, targetReg, registerCache, sharedRegisters); };
        //this._passes = new Array<MaterialPassGLBase>();
        //this._depthPass = new SingleObjectDepthPass();
        //this._depthPass.textureSize = depthMapSize;
        //this._depthPass.polyOffset = depthMapOffset;
        //this._passes.push(this._depthPass);
        this._scattering = 0.2;
        this._translucency = 1;
    }
    /**
     * @inheritDoc
     */
    DiffuseSubSurfaceMethod.prototype.iInitConstants = function (shader, methodVO) {
        _super.prototype.iInitConstants.call(this, shader, methodVO);
        var data = shader.vertexConstantData;
        var index = methodVO.secondaryVertexConstantsIndex;
        data[index] = .5;
        data[index + 1] = -.5;
        data[index + 2] = 0;
        data[index + 3] = 1;
        data = shader.fragmentConstantData;
        index = methodVO.secondaryFragmentConstantsIndex;
        data[index + 3] = 1.0;
        data[index + 4] = 1.0;
        data[index + 5] = 1 / 255;
        data[index + 6] = 1 / 65025;
        data[index + 7] = 1 / 16581375;
        data[index + 10] = .5;
        data[index + 11] = -.1;
    };
    DiffuseSubSurfaceMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._lightProjVarying = null;
        this._propReg = null;
        this._lightColorReg = null;
        this._colorReg = null;
        this._decReg = null;
        this._targetReg = null;
    };
    Object.defineProperty(DiffuseSubSurfaceMethod.prototype, "scattering", {
        /**
         * The amount by which the light scatters. It can be used to set the translucent surface's thickness. Use low
         * values for skin.
         */
        get: function () {
            return this._scattering;
        },
        set: function (value) {
            this._scattering = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseSubSurfaceMethod.prototype, "translucency", {
        /**
         * The translucency of the object.
         */
        get: function () {
            return this._translucency;
        },
        set: function (value) {
            this._translucency = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseSubSurfaceMethod.prototype, "scatterColor", {
        /**
         * The colour of the "insides" of the object, ie: the colour the light becomes after leaving the object.
         */
        get: function () {
            return this._scatterColor;
        },
        set: function (scatterColor /*uint*/) {
            this._scatterColor = scatterColor;
            this._scatterR = ((scatterColor >> 16) & 0xff) / 0xff;
            this._scatterG = ((scatterColor >> 8) & 0xff) / 0xff;
            this._scatterB = (scatterColor & 0xff) / 0xff;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseSubSurfaceMethod.prototype.iGetVertexCode = function (shader, methodVO, registerCache, sharedRegisters) {
        var code = _super.prototype.iGetVertexCode.call(this, shader, methodVO, registerCache, sharedRegisters);
        var lightProjection;
        var toTexRegister;
        var temp = registerCache.getFreeVertexVectorTemp();
        toTexRegister = registerCache.getFreeVertexConstant();
        methodVO.secondaryVertexConstantsIndex = toTexRegister.index * 4;
        this._lightProjVarying = registerCache.getFreeVarying();
        lightProjection = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        code += "m44 " + temp + ", vt0, " + lightProjection + "\n" +
            "div " + temp + ".xyz, " + temp + ".xyz, " + temp + ".w\n" +
            "mul " + temp + ".xy, " + temp + ".xy, " + toTexRegister + ".xy\n" +
            "add " + temp + ".xy, " + temp + ".xy, " + toTexRegister + ".xx\n" +
            "mov " + this._lightProjVarying + ".xyz, " + temp + ".xyz\n" +
            "mov " + this._lightProjVarying + ".w, va0.w\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseSubSurfaceMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        this._colorReg = registerCache.getFreeFragmentConstant();
        this._decReg = registerCache.getFreeFragmentConstant();
        this._propReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._colorReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shader, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseSubSurfaceMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        this._pIsFirstLight = true;
        this._lightColorReg = lightColReg;
        return _super.prototype.iGetFragmentCodePerLight.call(this, shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseSubSurfaceMethod.prototype.iGetFragmentPostLightingCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = _super.prototype.iGetFragmentPostLightingCode.call(this, shader, methodVO, targetReg, registerCache, sharedRegisters);
        var temp = registerCache.getFreeFragmentVectorTemp();
        code += "mul " + temp + ".xyz, " + this._lightColorReg + ".xyz, " + this._targetReg + ".w\n" +
            "mul " + temp + ".xyz, " + temp + ".xyz, " + this._colorReg + ".xyz\n" +
            "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        if (this._targetReg != sharedRegisters.viewDirFragment)
            registerCache.removeFragmentTempUsage(targetReg);
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseSubSurfaceMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var index = methodVO.secondaryFragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = this._scatterR;
        data[index + 1] = this._scatterG;
        data[index + 2] = this._scatterB;
        data[index + 8] = this._scattering;
        data[index + 9] = this._translucency;
    };
    /**
     * @inheritDoc
     */
    DiffuseSubSurfaceMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        methodVO.secondaryTextureGL = shader.getAbstraction(this._depthPass._iGetDepthMap(renderable));
        methodVO.secondaryTextureGL._setRenderState(renderable);
        this._depthPass._iGetProjection(renderable).copyRawDataTo(shader.vertexConstantData, methodVO.secondaryVertexConstantsIndex + 4, true);
    };
    /**
     * Generates the code for this method
     */
    DiffuseSubSurfaceMethod.prototype.scatterLight = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        // only scatter first light
        if (!this._pIsFirstLight)
            return "";
        this._pIsFirstLight = false;
        var code = "";
        if (sharedRegisters.viewDirFragment)
            this._targetReg = sharedRegisters.viewDirFragment;
        else
            registerCache.addFragmentTempUsages(this._targetReg = registerCache.getFreeFragmentVectorTemp(), 1);
        var temp = registerCache.getFreeFragmentVectorTemp();
        code += methodVO.secondaryTextureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, this._lightProjVarying) +
            // reencode RGBA
            "dp4 " + targetReg + ".z, " + temp + ", " + this._decReg + "\n";
        // currentDistanceToLight - closestDistanceToLight
        code += "sub " + targetReg + ".z, " + this._lightProjVarying + ".z, " + targetReg + ".z\n" +
            "sub " + targetReg + ".z, " + this._propReg + ".x, " + targetReg + ".z\n" +
            "mul " + targetReg + ".z, " + this._propReg + ".y, " + targetReg + ".z\n" +
            "sat " + targetReg + ".z, " + targetReg + ".z\n" +
            // targetReg.x contains dot(lightDir, normal)
            // modulate according to incident light angle (scatter = scatter*(-.5*dot(light, normal) + .5)
            "neg " + targetReg + ".y, " + targetReg + ".x\n" +
            "mul " + targetReg + ".y, " + targetReg + ".y, " + this._propReg + ".z\n" +
            "add " + targetReg + ".y, " + targetReg + ".y, " + this._propReg + ".z\n" +
            "mul " + this._targetReg + ".w, " + targetReg + ".z, " + targetReg + ".y\n" +
            // blend diffuse: d' = (1-s)*d + s*1
            "sub " + targetReg + ".y, " + this._colorReg + ".w, " + this._targetReg + ".w\n" +
            "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
        return code;
    };
    return DiffuseSubSurfaceMethod;
}(DiffuseCompositeMethod_1.DiffuseCompositeMethod));
exports.DiffuseSubSurfaceMethod = DiffuseSubSurfaceMethod;
