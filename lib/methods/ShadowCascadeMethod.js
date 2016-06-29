"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("@awayjs/core/lib/events/AssetEvent");
var DirectionalLight_1 = require("@awayjs/display/lib/display/DirectionalLight");
var ShadingMethodEvent_1 = require("@awayjs/renderer/lib/events/ShadingMethodEvent");
var MethodVO_1 = require("../data/MethodVO");
var ShadowMapMethodBase_1 = require("../methods/ShadowMapMethodBase");
/**
 * ShadowCascadeMethod is a shadow map method to apply cascade shadow mapping on materials.
 * Must be used with a DirectionalLight with a CascadeShadowMapper assigned to its shadowMapper property.
 *
 * @see away.lights.CascadeShadowMapper
 */
var ShadowCascadeMethod = (function (_super) {
    __extends(ShadowCascadeMethod, _super);
    /**
     * Creates a new ShadowCascadeMethod object.
     *
     * @param shadowMethodBase The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
     */
    function ShadowCascadeMethod(shadowMethodBase) {
        var _this = this;
        _super.call(this, shadowMethodBase.castingLight);
        this._baseMethod = shadowMethodBase;
        if (!(this._pCastingLight instanceof DirectionalLight_1.DirectionalLight))
            throw new Error("ShadowCascadeMethod is only compatible with DirectionalLight");
        this._cascadeShadowMapper = this._pCastingLight.shadowMapper;
        if (!this._cascadeShadowMapper)
            throw new Error("ShadowCascadeMethod requires a light that has a CascadeShadowMapper instance assigned to shadowMapper.");
        this._cascadeShadowMapper.addEventListener(AssetEvent_1.AssetEvent.INVALIDATE, function (event) { return _this.onCascadeChange(event); });
        this._baseMethod.addEventListener(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED, function (event) { return _this.onShaderInvalidated(event); });
    }
    Object.defineProperty(ShadowCascadeMethod.prototype, "baseMethod", {
        /**
         * The shadow map sampling method used to sample individual cascades. These are typically those used in conjunction
         * with a DirectionalShadowMapper.
         *
         * @see ShadowHardMethod
         * @see ShadowSoftMethod
         */
        get: function () {
            return this._baseMethod;
        },
        set: function (value) {
            var _this = this;
            if (this._baseMethod == value)
                return;
            this._baseMethod.removeEventListener(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED, function (event) { return _this.onShaderInvalidated(event); });
            this._baseMethod = value;
            this._baseMethod.addEventListener(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED, function (event) { return _this.onShaderInvalidated(event); });
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ShadowCascadeMethod.prototype.iInitVO = function (shader, methodVO) {
        var tempVO = new MethodVO_1.MethodVO(this._baseMethod, methodVO.pass);
        this._baseMethod.iInitVO(shader, tempVO);
        methodVO.needsGlobalVertexPos = true;
        methodVO.needsProjection = true;
        methodVO.textureGL = shader.getAbstraction(this._pCastingLight.shadowMapper.depthMap);
    };
    /**
     * @inheritDoc
     */
    ShadowCascadeMethod.prototype.iInitConstants = function (shader, methodVO) {
        var fragmentData = shader.fragmentConstantData;
        var vertexData = shader.vertexConstantData;
        var index = methodVO.fragmentConstantsIndex;
        fragmentData[index] = 1.0;
        fragmentData[index + 1] = 1 / 255.0;
        fragmentData[index + 2] = 1 / 65025.0;
        fragmentData[index + 3] = 1 / 16581375.0;
        fragmentData[index + 6] = .5;
        fragmentData[index + 7] = -.5;
        index = methodVO.vertexConstantsIndex;
        vertexData[index] = .5;
        vertexData[index + 1] = -.5;
        vertexData[index + 2] = 0;
    };
    /**
     * @inheritDoc
     */
    ShadowCascadeMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._cascadeProjections = null;
        this._depthMapCoordVaryings = null;
    };
    /**
     * @inheritDoc
     */
    ShadowCascadeMethod.prototype.iGetVertexCode = function (shader, methodVO, registerCache, sharedRegisters) {
        var code = "";
        var dataReg = registerCache.getFreeVertexConstant();
        this.initProjectionsRegs(registerCache);
        methodVO.vertexConstantsIndex = dataReg.index * 4;
        var temp = registerCache.getFreeVertexVectorTemp();
        for (var i = 0; i < this._cascadeShadowMapper.numCascades; ++i) {
            code += "m44 " + temp + ", " + sharedRegisters.globalPositionVertex + ", " + this._cascadeProjections[i] + "\n" +
                "add " + this._depthMapCoordVaryings[i] + ", " + temp + ", " + dataReg + ".zzwz\n";
        }
        return code;
    };
    /**
     * Creates the registers for the cascades' projection coordinates.
     */
    ShadowCascadeMethod.prototype.initProjectionsRegs = function (registerCache) {
        this._cascadeProjections = new Array(this._cascadeShadowMapper.numCascades);
        this._depthMapCoordVaryings = new Array(this._cascadeShadowMapper.numCascades);
        for (var i = 0; i < this._cascadeShadowMapper.numCascades; ++i) {
            this._depthMapCoordVaryings[i] = registerCache.getFreeVarying();
            this._cascadeProjections[i] = registerCache.getFreeVertexConstant();
            registerCache.getFreeVertexConstant();
            registerCache.getFreeVertexConstant();
            registerCache.getFreeVertexConstant();
        }
    };
    /**
     * @inheritDoc
     */
    ShadowCascadeMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var numCascades = this._cascadeShadowMapper.numCascades;
        var decReg = registerCache.getFreeFragmentConstant();
        var dataReg = registerCache.getFreeFragmentConstant();
        var planeDistanceReg = registerCache.getFreeFragmentConstant();
        var planeDistances = Array(planeDistanceReg + ".x", planeDistanceReg + ".y", planeDistanceReg + ".z", planeDistanceReg + ".w");
        var code;
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        var inQuad = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(inQuad, 1);
        var uvCoord = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(uvCoord, 1);
        // assume lowest partition is selected, will be overwritten later otherwise
        code = "mov " + uvCoord + ", " + this._depthMapCoordVaryings[numCascades - 1] + "\n";
        for (var i = numCascades - 2; i >= 0; --i) {
            var uvProjection = this._depthMapCoordVaryings[i];
            // calculate if in texturemap (result == 0 or 1, only 1 for a single partition)
            code += "slt " + inQuad + ".z, " + sharedRegisters.projectionFragment + ".z, " + planeDistances[i] + "\n"; // z = x > minX, w = y > minY
            var temp = registerCache.getFreeFragmentVectorTemp();
            // linearly interpolate between old and new uv coords using predicate value == conditional toggle to new value if predicate == 1 (true)
            code += "sub " + temp + ", " + uvProjection + ", " + uvCoord + "\n" +
                "mul " + temp + ", " + temp + ", " + inQuad + ".z\n" +
                "add " + uvCoord + ", " + uvCoord + ", " + temp + "\n";
        }
        registerCache.removeFragmentTempUsage(inQuad);
        code += "div " + uvCoord + ", " + uvCoord + ", " + uvCoord + ".w\n" +
            "mul " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zw\n" +
            "add " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zz\n";
        code += this._baseMethod._iGetCascadeFragmentCode(shader, methodVO, decReg, uvCoord, targetReg, registerCache, sharedRegisters) +
            "add " + targetReg + ".w, " + targetReg + ".w, " + dataReg + ".y\n";
        registerCache.removeFragmentTempUsage(uvCoord);
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowCascadeMethod.prototype.iActivate = function (shader, methodVO, stage) {
        methodVO.textureGL.activate(methodVO.pass._render);
        var vertexData = shader.vertexConstantData;
        var vertexIndex = methodVO.vertexConstantsIndex;
        shader.vertexConstantData[methodVO.vertexConstantsIndex + 3] = -1 / (this._cascadeShadowMapper.depth * this._pEpsilon);
        var numCascades = this._cascadeShadowMapper.numCascades;
        vertexIndex += 4;
        for (var k = 0; k < numCascades; ++k) {
            this._cascadeShadowMapper.getDepthProjections(k).copyRawDataTo(vertexData, vertexIndex, true);
            vertexIndex += 16;
        }
        var fragmentData = shader.fragmentConstantData;
        var fragmentIndex = methodVO.fragmentConstantsIndex;
        fragmentData[fragmentIndex + 5] = 1 - this._pAlpha;
        var nearPlaneDistances = this._cascadeShadowMapper._iNearPlaneDistances;
        fragmentIndex += 8;
        for (var i = 0; i < numCascades; ++i)
            fragmentData[fragmentIndex + i] = nearPlaneDistances[i];
        this._baseMethod.iActivateForCascade(shader, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    ShadowCascadeMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
    };
    /**
     * Called when the shadow mappers cascade configuration changes.
     */
    ShadowCascadeMethod.prototype.onCascadeChange = function (event) {
        this.iInvalidateShaderProgram();
    };
    /**
     * Called when the base method's shader code is invalidated.
     */
    ShadowCascadeMethod.prototype.onShaderInvalidated = function (event) {
        this.iInvalidateShaderProgram();
    };
    return ShadowCascadeMethod;
}(ShadowMapMethodBase_1.ShadowMapMethodBase));
exports.ShadowCascadeMethod = ShadowCascadeMethod;
