"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractMethodError_1 = require("@awayjs/core/lib/errors/AbstractMethodError");
var PointLight_1 = require("@awayjs/display/lib/display/PointLight");
var ShadowMapMethodBase_1 = require("../methods/ShadowMapMethodBase");
/**
 * ShadowMethodBase provides an abstract method for simple (non-wrapping) shadow map methods.
 */
var ShadowMethodBase = (function (_super) {
    __extends(ShadowMethodBase, _super);
    /**
     * Creates a new ShadowMethodBase object.
     * @param castingLight The light used to cast shadows.
     */
    function ShadowMethodBase(castingLight) {
        _super.call(this, castingLight);
        this._pUsePoint = (castingLight instanceof PointLight_1.PointLight);
    }
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsView = true;
        methodVO.needsGlobalVertexPos = true;
        methodVO.needsGlobalFragmentPos = this._pUsePoint;
        methodVO.needsNormals = shader.numLights > 0;
        methodVO.textureGL = shader.getAbstraction(this._pCastingLight.shadowMapper.depthMap);
    };
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iInitConstants = function (shader, methodVO) {
        var fragmentData = shader.fragmentConstantData;
        var vertexData = shader.vertexConstantData;
        var index = methodVO.fragmentConstantsIndex;
        fragmentData[index] = 1.0;
        fragmentData[index + 1] = 1 / 255.0;
        fragmentData[index + 2] = 1 / 65025.0;
        fragmentData[index + 3] = 1 / 16581375.0;
        fragmentData[index + 6] = 0;
        fragmentData[index + 7] = 1;
        if (this._pUsePoint) {
            fragmentData[index + 8] = 0;
            fragmentData[index + 9] = 0;
            fragmentData[index + 10] = 0;
            fragmentData[index + 11] = 1;
        }
        index = methodVO.vertexConstantsIndex;
        if (index != -1) {
            vertexData[index] = .5;
            vertexData[index + 1] = .5;
            vertexData[index + 2] = 0.0;
            vertexData[index + 3] = 1.0;
        }
    };
    Object.defineProperty(ShadowMethodBase.prototype, "_iDepthMapCoordReg", {
        /**
         * Wrappers that override the vertex shader need to set this explicitly
         */
        get: function () {
            return this._pDepthMapCoordReg;
        },
        set: function (value) {
            this._pDepthMapCoordReg = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._pDepthMapCoordReg = null;
    };
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iGetVertexCode = function (shader, methodVO, regCache, sharedRegisters) {
        return this._pUsePoint ? this._pGetPointVertexCode(methodVO, regCache, sharedRegisters) : this.pGetPlanarVertexCode(methodVO, regCache, sharedRegisters);
    };
    /**
     * Gets the vertex code for shadow mapping with a point light.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     */
    ShadowMethodBase.prototype._pGetPointVertexCode = function (methodVO, regCache, sharedRegisters) {
        methodVO.vertexConstantsIndex = -1;
        return "";
    };
    /**
     * Gets the vertex code for shadow mapping with a planar shadow map (fe: directional lights).
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     */
    ShadowMethodBase.prototype.pGetPlanarVertexCode = function (methodVO, regCache, sharedRegisters) {
        var code = "";
        var temp = regCache.getFreeVertexVectorTemp();
        var dataReg = regCache.getFreeVertexConstant();
        var depthMapProj = regCache.getFreeVertexConstant();
        regCache.getFreeVertexConstant();
        regCache.getFreeVertexConstant();
        regCache.getFreeVertexConstant();
        this._pDepthMapCoordReg = regCache.getFreeVarying();
        methodVO.vertexConstantsIndex = dataReg.index * 4;
        // todo: can epsilon be applied here instead of fragment shader?
        code += "m44 " + temp + ", " + sharedRegisters.globalPositionVertex + ", " + depthMapProj + "\n" +
            "div " + temp + ", " + temp + ", " + temp + ".w\n" +
            "mul " + temp + ".xy, " + temp + ".xy, " + dataReg + ".xy\n" +
            "add " + this._pDepthMapCoordReg + ", " + temp + ", " + dataReg + ".xxwz\n";
        //"sub " + this._pDepthMapCoordReg + ".z, " + this._pDepthMapCoordReg + ".z, " + this._pDepthMapCoordReg + ".w\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = this._pUsePoint ? this._pGetPointFragmentCode(shader, methodVO, targetReg, registerCache, sharedRegisters) : this._pGetPlanarFragmentCode(shader, methodVO, targetReg, registerCache, sharedRegisters);
        code += "add " + targetReg + ".w, " + targetReg + ".w, fc" + (methodVO.fragmentConstantsIndex / 4 + 1) + ".y\n" +
            "sat " + targetReg + ".w, " + targetReg + ".w\n";
        return code;
    };
    /**
     * Gets the fragment code for shadow mapping with a planar shadow map.
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     * @param targetReg The register to contain the shadow coverage
     * @return
     */
    ShadowMethodBase.prototype._pGetPlanarFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    /**
     * Gets the fragment code for shadow mapping with a point light.
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     * @param targetReg The register to contain the shadow coverage
     * @return
     */
    ShadowMethodBase.prototype._pGetPointFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        if (!this._pUsePoint)
            this._pShadowMapper.iDepthProjection.copyRawDataTo(shader.vertexConstantData, methodVO.vertexConstantsIndex + 4, true);
        methodVO.textureGL._setRenderState(renderable);
    };
    /**
     * Gets the fragment code for combining this method with a cascaded shadow map method.
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     * @param decodeRegister The register containing the data to decode the shadow map depth value.
     * @param depthTexture The texture containing the shadow map.
     * @param depthProjection The projection of the fragment relative to the light.
     * @param targetRegister The register to contain the shadow coverage
     * @return
     */
    ShadowMethodBase.prototype._iGetCascadeFragmentCode = function (shader, methodVO, decodeRegister, depthProjection, targetRegister, registerCache, sharedRegisters) {
        throw new Error("This shadow method is incompatible with cascade shadows");
    };
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iActivate = function (shader, methodVO, stage) {
        var fragmentData = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        if (this._pUsePoint)
            fragmentData[index + 4] = -Math.pow(1 / (this._pCastingLight.fallOff * this._pEpsilon), 2);
        else
            shader.vertexConstantData[methodVO.vertexConstantsIndex + 3] = -1 / (this._pShadowMapper.depth * this._pEpsilon);
        fragmentData[index + 5] = 1 - this._pAlpha;
        if (this._pUsePoint) {
            var pos = this._pCastingLight.scenePosition;
            fragmentData[index + 8] = pos.x;
            fragmentData[index + 9] = pos.y;
            fragmentData[index + 10] = pos.z;
            // used to decompress distance
            var f = this._pCastingLight.fallOff;
            fragmentData[index + 11] = 1 / (2 * f * f);
        }
        methodVO.textureGL.activate(methodVO.pass._render);
    };
    /**
     * Sets the method state for cascade shadow mapping.
     */
    ShadowMethodBase.prototype.iActivateForCascade = function (shader, methodVO, stage) {
        throw new Error("This shadow method is incompatible with cascade shadows");
    };
    return ShadowMethodBase;
}(ShadowMapMethodBase_1.ShadowMapMethodBase));
exports.ShadowMethodBase = ShadowMethodBase;
