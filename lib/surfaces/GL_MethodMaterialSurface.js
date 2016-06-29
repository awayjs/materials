"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BlendMode_1 = require("@awayjs/core/lib/image/BlendMode");
var StaticLightPicker_1 = require("@awayjs/display/lib/materials/lightpickers/StaticLightPicker");
var ContextGLCompareMode_1 = require("@awayjs/stage/lib/base/ContextGLCompareMode");
var GL_SurfaceBase_1 = require("@awayjs/renderer/lib/surfaces/GL_SurfaceBase");
var MethodMaterialMode_1 = require("../MethodMaterialMode");
var MethodPassMode_1 = require("../surfaces/passes/MethodPassMode");
var MethodPass_1 = require("../surfaces/passes/MethodPass");
/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
var GL_MethodMaterialSurface = (function (_super) {
    __extends(GL_MethodMaterialSurface, _super);
    /**
     * Creates a new CompiledPass object.
     *
     * @param material The material to which this pass belongs.
     */
    function GL_MethodMaterialSurface(material, elementsClass, pool) {
        _super.call(this, material, elementsClass, pool);
        this._material = material;
    }
    Object.defineProperty(GL_MethodMaterialSurface.prototype, "numLights", {
        /**
         * The maximum total number of lights provided by the light picker.
         */
        get: function () {
            return this._material.lightPicker ? this._material.lightPicker.numLightProbes + this._material.lightPicker.numDirectionalLights + this._material.lightPicker.numPointLights + this._material.lightPicker.numCastingDirectionalLights + this._material.lightPicker.numCastingPointLights : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_MethodMaterialSurface.prototype, "numNonCasters", {
        /**
         * The amount of lights that don't cast shadows.
         */
        get: function () {
            return this._material.lightPicker ? this._material.lightPicker.numLightProbes + this._material.lightPicker.numDirectionalLights + this._material.lightPicker.numPointLights : 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    GL_MethodMaterialSurface.prototype._pUpdateRender = function () {
        _super.prototype._pUpdateRender.call(this);
        this.initPasses();
        this.setBlendAndCompareModes();
        this._pClearPasses();
        if (this._material.mode == MethodMaterialMode_1.MethodMaterialMode.MULTI_PASS) {
            if (this._casterLightPass)
                this._pAddPass(this._casterLightPass);
            if (this._nonCasterLightPasses)
                for (var i = 0; i < this._nonCasterLightPasses.length; ++i)
                    this._pAddPass(this._nonCasterLightPasses[i]);
        }
        if (this._pass)
            this._pAddPass(this._pass);
    };
    /**
     * Initializes all the passes and their dependent passes.
     */
    GL_MethodMaterialSurface.prototype.initPasses = function () {
        // let the effects pass handle everything if there are no lights, when there are effect methods applied
        // after shading, or when the material mode is single pass.
        if (this.numLights == 0 || this._material.numEffectMethods > 0 || this._material.mode == MethodMaterialMode_1.MethodMaterialMode.SINGLE_PASS)
            this.initEffectPass();
        else if (this._pass)
            this.removeEffectPass();
        // only use a caster light pass if shadows need to be rendered
        if (this._material.shadowMethod && this._material.mode == MethodMaterialMode_1.MethodMaterialMode.MULTI_PASS)
            this.initCasterLightPass();
        else if (this._casterLightPass)
            this.removeCasterLightPass();
        // only use non caster light passes if there are lights that don't cast
        if (this.numNonCasters > 0 && this._material.mode == MethodMaterialMode_1.MethodMaterialMode.MULTI_PASS)
            this.initNonCasterLightPasses();
        else if (this._nonCasterLightPasses)
            this.removeNonCasterLightPasses();
    };
    /**
     * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
     */
    GL_MethodMaterialSurface.prototype.setBlendAndCompareModes = function () {
        var forceSeparateMVP = Boolean(this._casterLightPass || this._pass);
        // caster light pass is always first if it exists, hence it uses normal blending
        if (this._casterLightPass) {
            this._casterLightPass.forceSeparateMVP = forceSeparateMVP;
            this._casterLightPass.shader.setBlendMode(BlendMode_1.BlendMode.NORMAL);
            this._casterLightPass.shader.depthCompareMode = this._material.depthCompareMode;
        }
        if (this._nonCasterLightPasses) {
            var firstAdditiveIndex = 0;
            // if there's no caster light pass, the first non caster light pass will be the first
            // and should use normal blending
            if (!this._casterLightPass) {
                this._nonCasterLightPasses[0].forceSeparateMVP = forceSeparateMVP;
                this._nonCasterLightPasses[0].shader.setBlendMode(BlendMode_1.BlendMode.NORMAL);
                this._nonCasterLightPasses[0].shader.depthCompareMode = this._material.depthCompareMode;
                firstAdditiveIndex = 1;
            }
            // all lighting passes following the first light pass should use additive blending
            for (var i = firstAdditiveIndex; i < this._nonCasterLightPasses.length; ++i) {
                this._nonCasterLightPasses[i].forceSeparateMVP = forceSeparateMVP;
                this._nonCasterLightPasses[i].shader.setBlendMode(BlendMode_1.BlendMode.ADD);
                this._nonCasterLightPasses[i].shader.depthCompareMode = ContextGLCompareMode_1.ContextGLCompareMode.LESS_EQUAL;
            }
        }
        if (this._casterLightPass || this._nonCasterLightPasses) {
            //cannot be blended by blendmode property if multipass enabled
            this._pRequiresBlending = false;
            // there are light passes, so this should be blended in
            if (this._pass) {
                this._pass.mode = MethodPassMode_1.MethodPassMode.EFFECTS;
                this._pass.forceSeparateMVP = forceSeparateMVP;
                this._pass.shader.depthCompareMode = ContextGLCompareMode_1.ContextGLCompareMode.LESS_EQUAL;
                this._pass.shader.setBlendMode(BlendMode_1.BlendMode.LAYER);
            }
        }
        else if (this._pass) {
            this._pRequiresBlending = (this._material.blendMode != BlendMode_1.BlendMode.NORMAL || this._material.alphaBlending || (this._material.colorTransform && this._material.colorTransform.alphaMultiplier < 1));
            // effects pass is the only pass, so it should just blend normally
            this._pass.mode = MethodPassMode_1.MethodPassMode.SUPER_SHADER;
            this._pass.preserveAlpha = this._pRequiresBlending;
            this._pass.forceSeparateMVP = false;
            this._pass.colorTransform = this._material.colorTransform;
            this._pass.shader.setBlendMode((this._material.blendMode == BlendMode_1.BlendMode.NORMAL && this._pRequiresBlending) ? BlendMode_1.BlendMode.LAYER : this._material.blendMode);
            this._pass.shader.depthCompareMode = this._material.depthCompareMode;
        }
    };
    GL_MethodMaterialSurface.prototype.initCasterLightPass = function () {
        if (this._casterLightPass == null)
            this._casterLightPass = new MethodPass_1.MethodPass(MethodPassMode_1.MethodPassMode.LIGHTING, this, this._material, this._elementsClass, this._stage);
        this._casterLightPass.lightPicker = new StaticLightPicker_1.StaticLightPicker([this._material.shadowMethod.castingLight]);
        this._casterLightPass.shadowMethod = this._material.shadowMethod;
        this._casterLightPass.diffuseMethod = this._material.diffuseMethod;
        this._casterLightPass.ambientMethod = this._material.ambientMethod;
        this._casterLightPass.normalMethod = this._material.normalMethod;
        this._casterLightPass.specularMethod = this._material.specularMethod;
    };
    GL_MethodMaterialSurface.prototype.removeCasterLightPass = function () {
        this._casterLightPass.dispose();
        this._pRemovePass(this._casterLightPass);
        this._casterLightPass = null;
    };
    GL_MethodMaterialSurface.prototype.initNonCasterLightPasses = function () {
        this.removeNonCasterLightPasses();
        var pass;
        var numDirLights = this._material.lightPicker.numDirectionalLights;
        var numPointLights = this._material.lightPicker.numPointLights;
        var numLightProbes = this._material.lightPicker.numLightProbes;
        var dirLightOffset = 0;
        var pointLightOffset = 0;
        var probeOffset = 0;
        if (!this._casterLightPass) {
            numDirLights += this._material.lightPicker.numCastingDirectionalLights;
            numPointLights += this._material.lightPicker.numCastingPointLights;
        }
        this._nonCasterLightPasses = new Array();
        while (dirLightOffset < numDirLights || pointLightOffset < numPointLights || probeOffset < numLightProbes) {
            pass = new MethodPass_1.MethodPass(MethodPassMode_1.MethodPassMode.LIGHTING, this, this._material, this._elementsClass, this._stage);
            pass.includeCasters = this._material.shadowMethod == null;
            pass.directionalLightsOffset = dirLightOffset;
            pass.pointLightsOffset = pointLightOffset;
            pass.lightProbesOffset = probeOffset;
            pass.lightPicker = this._material.lightPicker;
            pass.diffuseMethod = this._material.diffuseMethod;
            pass.ambientMethod = this._material.ambientMethod;
            pass.normalMethod = this._material.normalMethod;
            pass.specularMethod = this._material.specularMethod;
            this._nonCasterLightPasses.push(pass);
            dirLightOffset += pass.numDirectionalLights;
            pointLightOffset += pass.numPointLights;
            probeOffset += pass.numLightProbes;
        }
    };
    GL_MethodMaterialSurface.prototype.removeNonCasterLightPasses = function () {
        if (!this._nonCasterLightPasses)
            return;
        for (var i = 0; i < this._nonCasterLightPasses.length; ++i)
            this._pRemovePass(this._nonCasterLightPasses[i]);
        this._nonCasterLightPasses = null;
    };
    GL_MethodMaterialSurface.prototype.removeEffectPass = function () {
        if (this._pass.ambientMethod != this._material.ambientMethod)
            this._pass.ambientMethod.dispose();
        if (this._pass.diffuseMethod != this._material.diffuseMethod)
            this._pass.diffuseMethod.dispose();
        if (this._pass.specularMethod != this._material.specularMethod)
            this._pass.specularMethod.dispose();
        if (this._pass.normalMethod != this._material.normalMethod)
            this._pass.normalMethod.dispose();
        this._pRemovePass(this._pass);
        this._pass = null;
    };
    GL_MethodMaterialSurface.prototype.initEffectPass = function () {
        if (this._pass == null)
            this._pass = new MethodPass_1.MethodPass(MethodPassMode_1.MethodPassMode.SUPER_SHADER, this, this._material, this._elementsClass, this._stage);
        if (this._material.mode == MethodMaterialMode_1.MethodMaterialMode.SINGLE_PASS) {
            this._pass.ambientMethod = this._material.ambientMethod;
            this._pass.diffuseMethod = this._material.diffuseMethod;
            this._pass.specularMethod = this._material.specularMethod;
            this._pass.normalMethod = this._material.normalMethod;
            this._pass.shadowMethod = this._material.shadowMethod;
        }
        else if (this._material.mode == MethodMaterialMode_1.MethodMaterialMode.MULTI_PASS) {
            if (this.numLights == 0) {
                this._pass.ambientMethod = this._material.ambientMethod;
            }
            else {
                this._pass.ambientMethod = null;
            }
            this._pass.preserveAlpha = false;
            this._pass.normalMethod = this._material.normalMethod;
        }
        //update effect methods
        var i = 0;
        var effectMethod;
        var len = Math.max(this._material.numEffectMethods, this._pass.numEffectMethods);
        while (i < len) {
            effectMethod = this._material.getEffectMethodAt(i);
            if (effectMethod != this._pass.getEffectMethodAt(i)) {
                this._pass.removeEffectMethodAt(i);
                if (effectMethod != null) {
                    if (i < this._pass.numEffectMethods)
                        this._pass.addEffectMethodAt(effectMethod, i);
                    else
                        this._pass.addEffectMethod(effectMethod);
                }
            }
            i++;
        }
    };
    /**
     * @inheritDoc
     */
    GL_MethodMaterialSurface.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        //TODO
    };
    return GL_MethodMaterialSurface;
}(GL_SurfaceBase_1.GL_SurfaceBase));
exports.GL_MethodMaterialSurface = GL_MethodMaterialSurface;
