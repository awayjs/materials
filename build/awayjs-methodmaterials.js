require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"awayjs-methodmaterials\\lib\\MethodMaterialMode":[function(require,module,exports){
var MethodMaterialMode = (function () {
    function MethodMaterialMode() {
    }
    /**
     *
     */
    MethodMaterialMode.SINGLE_PASS = "singlePass";
    /**
     *
     */
    MethodMaterialMode.MULTI_PASS = "multiPass";
    return MethodMaterialMode;
})();
module.exports = MethodMaterialMode;


},{}],"awayjs-methodmaterials\\lib\\MethodMaterial":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
var MaterialBase = require("awayjs-display/lib/materials/MaterialBase");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var AmbientBasicMethod = require("awayjs-methodmaterials/lib/methods/AmbientBasicMethod");
var DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
var NormalBasicMethod = require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
var SpecularBasicMethod = require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
var MethodMaterialMode = require("awayjs-methodmaterials/lib/MethodMaterialMode");
/**
 * MethodMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var MethodMaterial = (function (_super) {
    __extends(MethodMaterial, _super);
    function MethodMaterial(textureColor, smoothAlpha, repeat, mipmap) {
        if (textureColor === void 0) { textureColor = null; }
        if (smoothAlpha === void 0) { smoothAlpha = null; }
        if (repeat === void 0) { repeat = false; }
        if (mipmap === void 0) { mipmap = true; }
        _super.call(this);
        this._effectMethods = new Array();
        this._ambientMethod = new AmbientBasicMethod();
        this._diffuseMethod = new DiffuseBasicMethod();
        this._normalMethod = new NormalBasicMethod();
        this._specularMethod = new SpecularBasicMethod();
        this._depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
        this._mode = MethodMaterialMode.SINGLE_PASS;
        if (textureColor instanceof Texture2DBase) {
            this.texture = textureColor;
            this.smooth = (smoothAlpha == null) ? true : false;
            this.repeat = repeat;
            this.mipmap = mipmap;
        }
        else {
            this.color = (textureColor == null) ? 0xFFFFFF : Number(textureColor);
            this.alpha = (smoothAlpha == null) ? 1 : Number(smoothAlpha);
        }
    }
    Object.defineProperty(MethodMaterial.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        set: function (value) {
            if (this._mode == value)
                return;
            this._mode = value;
            this._pInvalidateRenderObject();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "depthCompareMode", {
        /**
         * The depth compare mode used to render the renderables using this material.
         *
         * @see away.stagegl.ContextGLCompareMode
         */
        get: function () {
            return this._depthCompareMode;
        },
        set: function (value) {
            if (this._depthCompareMode == value)
                return;
            this._depthCompareMode = value;
            this._pInvalidateRenderObject();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "diffuseTexture", {
        /**
         * The texture object to use for the ambient colour.
         */
        get: function () {
            return this._diffuseMethod.texture;
        },
        set: function (value) {
            this._diffuseMethod.texture = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "ambientMethod", {
        /**
         * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
         */
        get: function () {
            return this._ambientMethod;
        },
        set: function (value) {
            if (this._ambientMethod == value)
                return;
            if (value && this._ambientMethod)
                value.copyFrom(this._ambientMethod);
            this._ambientMethod = value;
            this._pInvalidateRenderObject();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "shadowMethod", {
        /**
         * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
         */
        get: function () {
            return this._shadowMethod;
        },
        set: function (value) {
            if (this._shadowMethod == value)
                return;
            if (value && this._shadowMethod)
                value.copyFrom(this._shadowMethod);
            this._shadowMethod = value;
            this._pInvalidateRenderObject();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "diffuseMethod", {
        /**
         * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
         */
        get: function () {
            return this._diffuseMethod;
        },
        set: function (value) {
            if (this._diffuseMethod == value)
                return;
            if (value && this._diffuseMethod)
                value.copyFrom(this._diffuseMethod);
            this._diffuseMethod = value;
            this._pInvalidateRenderObject();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "specularMethod", {
        /**
         * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
         */
        get: function () {
            return this._specularMethod;
        },
        set: function (value) {
            if (this._specularMethod == value)
                return;
            if (value && this._specularMethod)
                value.copyFrom(this._specularMethod);
            this._specularMethod = value;
            this._pInvalidateRenderObject();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "normalMethod", {
        /**
         * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
         */
        get: function () {
            return this._normalMethod;
        },
        set: function (value) {
            if (this._normalMethod == value)
                return;
            if (value && this._normalMethod)
                value.copyFrom(this._normalMethod);
            this._normalMethod = value;
            this._pInvalidateRenderObject();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "numEffectMethods", {
        get: function () {
            return this._effectMethods.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
     * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
     * methods added prior.
     */
    MethodMaterial.prototype.addEffectMethod = function (method) {
        this._effectMethods.push(method);
        this._pInvalidateRenderObject();
    };
    /**
     * Returns the method added at the given index.
     * @param index The index of the method to retrieve.
     * @return The method at the given index.
     */
    MethodMaterial.prototype.getEffectMethodAt = function (index) {
        return this._effectMethods[index];
    };
    /**
     * Adds an effect method at the specified index amongst the methods already added to the material. Effect
     * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
     * etc. The method will be applied to the result of the methods with a lower index.
     */
    MethodMaterial.prototype.addEffectMethodAt = function (method, index) {
        this._effectMethods.splice(index, 0, method);
        this._pInvalidateRenderObject();
    };
    /**
     * Removes an effect method from the material.
     * @param method The method to be removed.
     */
    MethodMaterial.prototype.removeEffectMethod = function (method) {
        this._effectMethods.splice(this._effectMethods.indexOf(method), 1);
        this._pInvalidateRenderObject();
    };
    Object.defineProperty(MethodMaterial.prototype, "normalMap", {
        /**
         * The normal map to modulate the direction of the surface for each texel. The default normal method expects
         * tangent-space normal maps, but others could expect object-space maps.
         */
        get: function () {
            return this._normalMethod.normalMap;
        },
        set: function (value) {
            this._normalMethod.normalMap = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "specularMap", {
        /**
         * A specular map that defines the strength of specular reflections for each texel in the red channel,
         * and the gloss factor in the green channel. You can use SpecularBitmapTexture if you want to easily set
         * specular and gloss maps from grayscale images, but correctly authored images are preferred.
         */
        get: function () {
            return this._specularMethod.texture;
        },
        set: function (value) {
            this._specularMethod.texture = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "gloss", {
        /**
         * The glossiness of the material (sharpness of the specular highlight).
         */
        get: function () {
            return this._specularMethod.gloss;
        },
        set: function (value) {
            this._specularMethod.gloss = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "ambient", {
        /**
         * The strength of the ambient reflection.
         */
        get: function () {
            return this._ambientMethod.ambient;
        },
        set: function (value) {
            this._ambientMethod.ambient = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "specular", {
        /**
         * The overall strength of the specular reflection.
         */
        get: function () {
            return this._specularMethod.specular;
        },
        set: function (value) {
            this._specularMethod.specular = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "ambientColor", {
        /**
         * The colour of the ambient reflection.
         */
        get: function () {
            return this._diffuseMethod.ambientColor;
        },
        set: function (value) {
            this._diffuseMethod.ambientColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "diffuseColor", {
        /**
         * The colour of the diffuse reflection.
         */
        get: function () {
            return this._diffuseMethod.diffuseColor;
        },
        set: function (value) {
            this._diffuseMethod.diffuseColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "specularColor", {
        /**
         * The colour of the specular reflection.
         */
        get: function () {
            return this._specularMethod.specularColor;
        },
        set: function (value) {
            this._specularMethod.specularColor = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param renderer
     *
     * @internal
     */
    MethodMaterial.prototype.getRenderObject = function (renderablePool) {
        return renderablePool.getMethodRenderObject(this);
    };
    return MethodMaterial;
})(MaterialBase);
module.exports = MethodMaterial;


},{"awayjs-core/lib/textures/Texture2DBase":undefined,"awayjs-display/lib/materials/MaterialBase":undefined,"awayjs-methodmaterials/lib/MethodMaterialMode":undefined,"awayjs-methodmaterials/lib/methods/AmbientBasicMethod":undefined,"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod":undefined,"awayjs-methodmaterials/lib/methods/NormalBasicMethod":undefined,"awayjs-methodmaterials/lib/methods/SpecularBasicMethod":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined}],"awayjs-methodmaterials\\lib\\compilation\\RenderMethodMaterialObject":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BlendMode = require("awayjs-core/lib/base/BlendMode");
var StaticLightPicker = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
var MethodPassMode = require("awayjs-methodmaterials/lib/passes/MethodPassMode");
var MethodPass = require("awayjs-methodmaterials/lib/passes/MethodPass");
var MethodMaterialMode = require("awayjs-methodmaterials/lib/MethodMaterialMode");
/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
var RenderMethodMaterialObject = (function (_super) {
    __extends(RenderMethodMaterialObject, _super);
    /**
     * Creates a new CompiledPass object.
     *
     * @param material The material to which this pass belongs.
     */
    function RenderMethodMaterialObject(pool, material, renderableClass, stage) {
        _super.call(this, pool, material, renderableClass, stage);
        this._material = material;
    }
    Object.defineProperty(RenderMethodMaterialObject.prototype, "numLights", {
        /**
         * The maximum total number of lights provided by the light picker.
         */
        get: function () {
            return this._material.lightPicker ? this._material.lightPicker.numLightProbes + this._material.lightPicker.numDirectionalLights + this._material.lightPicker.numPointLights + this._material.lightPicker.numCastingDirectionalLights + this._material.lightPicker.numCastingPointLights : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderMethodMaterialObject.prototype, "numNonCasters", {
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
    RenderMethodMaterialObject.prototype._pUpdateRenderObject = function () {
        _super.prototype._pUpdateRenderObject.call(this);
        this.initPasses();
        this.setBlendAndCompareModes();
        this._pClearScreenPasses();
        if (this._material.mode == MethodMaterialMode.MULTI_PASS) {
            if (this._casterLightPass)
                this._pAddScreenPass(this._casterLightPass);
            if (this._nonCasterLightPasses)
                for (var i = 0; i < this._nonCasterLightPasses.length; ++i)
                    this._pAddScreenPass(this._nonCasterLightPasses[i]);
        }
        if (this._screenPass)
            this._pAddScreenPass(this._screenPass);
    };
    /**
     * Initializes all the passes and their dependent passes.
     */
    RenderMethodMaterialObject.prototype.initPasses = function () {
        // let the effects pass handle everything if there are no lights, when there are effect methods applied
        // after shading, or when the material mode is single pass.
        if (this.numLights == 0 || this._material.numEffectMethods > 0 || this._material.mode == MethodMaterialMode.SINGLE_PASS)
            this.initEffectPass();
        else if (this._screenPass)
            this.removeEffectPass();
        // only use a caster light pass if shadows need to be rendered
        if (this._material.shadowMethod && this._material.mode == MethodMaterialMode.MULTI_PASS)
            this.initCasterLightPass();
        else if (this._casterLightPass)
            this.removeCasterLightPass();
        // only use non caster light passes if there are lights that don't cast
        if (this.numNonCasters > 0 && this._material.mode == MethodMaterialMode.MULTI_PASS)
            this.initNonCasterLightPasses();
        else if (this._nonCasterLightPasses)
            this.removeNonCasterLightPasses();
    };
    /**
     * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
     */
    RenderMethodMaterialObject.prototype.setBlendAndCompareModes = function () {
        var forceSeparateMVP = Boolean(this._casterLightPass || this._screenPass);
        // caster light pass is always first if it exists, hence it uses normal blending
        if (this._casterLightPass) {
            this._casterLightPass.forceSeparateMVP = forceSeparateMVP;
            this._casterLightPass.setBlendMode(BlendMode.NORMAL);
            this._casterLightPass.depthCompareMode = this._material.depthCompareMode;
        }
        if (this._nonCasterLightPasses) {
            var firstAdditiveIndex = 0;
            // if there's no caster light pass, the first non caster light pass will be the first
            // and should use normal blending
            if (!this._casterLightPass) {
                this._nonCasterLightPasses[0].forceSeparateMVP = forceSeparateMVP;
                this._nonCasterLightPasses[0].setBlendMode(BlendMode.NORMAL);
                this._nonCasterLightPasses[0].depthCompareMode = this._material.depthCompareMode;
                firstAdditiveIndex = 1;
            }
            for (var i = firstAdditiveIndex; i < this._nonCasterLightPasses.length; ++i) {
                this._nonCasterLightPasses[i].forceSeparateMVP = forceSeparateMVP;
                this._nonCasterLightPasses[i].setBlendMode(BlendMode.ADD);
                this._nonCasterLightPasses[i].depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
            }
        }
        if (this._casterLightPass || this._nonCasterLightPasses) {
            //cannot be blended by blendmode property if multipass enabled
            this._pRequiresBlending = false;
            // there are light passes, so this should be blended in
            if (this._screenPass) {
                this._screenPass.mode = MethodPassMode.EFFECTS;
                this._screenPass.depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
                this._screenPass.setBlendMode(BlendMode.LAYER);
                this._screenPass.forceSeparateMVP = forceSeparateMVP;
            }
        }
        else if (this._screenPass) {
            this._pRequiresBlending = (this._material.blendMode != BlendMode.NORMAL || this._material.alphaBlending || (this._material.colorTransform && this._material.colorTransform.alphaMultiplier < 1));
            // effects pass is the only pass, so it should just blend normally
            this._screenPass.mode = MethodPassMode.SUPER_SHADER;
            this._screenPass.depthCompareMode = this._material.depthCompareMode;
            this._screenPass.preserveAlpha = this._pRequiresBlending;
            this._screenPass.colorTransform = this._material.colorTransform;
            this._screenPass.setBlendMode((this._material.blendMode == BlendMode.NORMAL && this._pRequiresBlending) ? BlendMode.LAYER : this._material.blendMode);
            this._screenPass.forceSeparateMVP = false;
        }
    };
    RenderMethodMaterialObject.prototype.initCasterLightPass = function () {
        if (this._casterLightPass == null)
            this._casterLightPass = new MethodPass(MethodPassMode.LIGHTING, this, this._material, this._renderableClass, this._stage);
        this._casterLightPass.lightPicker = new StaticLightPicker([this._material.shadowMethod.castingLight]);
        this._casterLightPass.shadowMethod = this._material.shadowMethod;
        this._casterLightPass.diffuseMethod = this._material.diffuseMethod;
        this._casterLightPass.ambientMethod = this._material.ambientMethod;
        this._casterLightPass.normalMethod = this._material.normalMethod;
        this._casterLightPass.specularMethod = this._material.specularMethod;
    };
    RenderMethodMaterialObject.prototype.removeCasterLightPass = function () {
        this._casterLightPass.dispose();
        this._pRemoveScreenPass(this._casterLightPass);
        this._casterLightPass = null;
    };
    RenderMethodMaterialObject.prototype.initNonCasterLightPasses = function () {
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
            pass = new MethodPass(MethodPassMode.LIGHTING, this, this._material, this._renderableClass, this._stage);
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
    RenderMethodMaterialObject.prototype.removeNonCasterLightPasses = function () {
        if (!this._nonCasterLightPasses)
            return;
        for (var i = 0; i < this._nonCasterLightPasses.length; ++i)
            this._pRemoveScreenPass(this._nonCasterLightPasses[i]);
        this._nonCasterLightPasses = null;
    };
    RenderMethodMaterialObject.prototype.removeEffectPass = function () {
        if (this._screenPass.ambientMethod != this._material.ambientMethod)
            this._screenPass.ambientMethod.dispose();
        if (this._screenPass.diffuseMethod != this._material.diffuseMethod)
            this._screenPass.diffuseMethod.dispose();
        if (this._screenPass.specularMethod != this._material.specularMethod)
            this._screenPass.specularMethod.dispose();
        if (this._screenPass.normalMethod != this._material.normalMethod)
            this._screenPass.normalMethod.dispose();
        this._pRemoveScreenPass(this._screenPass);
        this._screenPass = null;
    };
    RenderMethodMaterialObject.prototype.initEffectPass = function () {
        if (this._screenPass == null)
            this._screenPass = new MethodPass(MethodPassMode.SUPER_SHADER, this, this._material, this._renderableClass, this._stage);
        if (this._material.mode == MethodMaterialMode.SINGLE_PASS) {
            this._screenPass.ambientMethod = this._material.ambientMethod;
            this._screenPass.diffuseMethod = this._material.diffuseMethod;
            this._screenPass.specularMethod = this._material.specularMethod;
            this._screenPass.normalMethod = this._material.normalMethod;
            this._screenPass.shadowMethod = this._material.shadowMethod;
        }
        else if (this._material.mode == MethodMaterialMode.MULTI_PASS) {
            if (this.numLights == 0) {
                this._screenPass.ambientMethod = this._material.ambientMethod;
            }
            else {
                this._screenPass.ambientMethod = null;
            }
            this._screenPass.preserveAlpha = false;
            this._screenPass.normalMethod = this._material.normalMethod;
        }
        //update effect methods
        var i = 0;
        var effectMethod;
        var len = Math.max(this._material.numEffectMethods, this._screenPass.numEffectMethods);
        while (i < len) {
            effectMethod = this._material.getEffectMethodAt(i);
            if (effectMethod != this._screenPass.getEffectMethodAt(i)) {
                this._screenPass.removeEffectMethodAt(i);
                if (effectMethod != null) {
                    if (i < this._screenPass.numEffectMethods)
                        this._screenPass.addEffectMethodAt(effectMethod, i);
                    else
                        this._screenPass.addEffectMethod(effectMethod);
                }
            }
            i++;
        }
    };
    /**
     * @inheritDoc
     */
    RenderMethodMaterialObject.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        //TODO
    };
    /**
     *
     */
    RenderMethodMaterialObject.id = "method";
    return RenderMethodMaterialObject;
})(RenderObjectBase);
module.exports = RenderMethodMaterialObject;


},{"awayjs-core/lib/base/BlendMode":undefined,"awayjs-display/lib/materials/lightpickers/StaticLightPicker":undefined,"awayjs-methodmaterials/lib/MethodMaterialMode":undefined,"awayjs-methodmaterials/lib/passes/MethodPass":undefined,"awayjs-methodmaterials/lib/passes/MethodPassMode":undefined,"awayjs-renderergl/lib/compilation/RenderObjectBase":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined}],"awayjs-methodmaterials\\lib\\data\\MethodVO":[function(require,module,exports){
/**
 * MethodVO contains data for a given shader object for the use within a single material.
 * This allows shader methods to be shared across materials while their non-public state differs.
 */
var MethodVO = (function () {
    /**
     * Creates a new MethodVO object.
     */
    function MethodVO(method) {
        this.useMethod = true;
        this.method = method;
    }
    /**
     * Resets the values of the value object to their "unused" state.
     */
    MethodVO.prototype.reset = function () {
        this.method.iReset();
        this.texturesIndex = -1;
        this.vertexConstantsIndex = -1;
        this.fragmentConstantsIndex = -1;
        this.needsProjection = false;
        this.needsView = false;
        this.needsNormals = false;
        this.needsTangents = false;
        this.needsUV = false;
        this.needsSecondaryUV = false;
        this.needsGlobalVertexPos = false;
        this.needsGlobalFragmentPos = false;
    };
    return MethodVO;
})();
module.exports = MethodVO;


},{}],"awayjs-methodmaterials\\lib\\methods\\AmbientBasicMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
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
        this._color = 0xffffff;
        this._alpha = 1;
        this._colorR = 1;
        this._colorG = 1;
        this._colorB = 1;
        this._ambient = 1;
    }
    /**
     * @inheritDoc
     */
    AmbientBasicMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsUV = Boolean(shaderObject.texture != null);
    };
    /**
     * @inheritDoc
     */
    AmbientBasicMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        if (!methodVO.needsUV) {
            this._color = shaderObject.color;
            this.updateColor();
        }
    };
    Object.defineProperty(AmbientBasicMethod.prototype, "ambient", {
        /**
         * The strength of the ambient reflection of the surface.
         */
        get: function () {
            return this._ambient;
        },
        set: function (value) {
            if (this._ambient == value)
                return;
            this._ambient = value;
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
    AmbientBasicMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var ambientInputRegister;
        if (methodVO.needsUV) {
            ambientInputRegister = registerCache.getFreeTextureReg();
            methodVO.texturesIndex = ambientInputRegister.index;
            code += ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedRegisters, ambientInputRegister, shaderObject.texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, false);
            if (shaderObject.alphaThreshold > 0) {
                var cutOffReg = registerCache.getFreeFragmentConstant();
                methodVO.fragmentConstantsIndex = cutOffReg.index * 4;
                code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" + "kil " + targetReg + ".w\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
            }
        }
        else {
            ambientInputRegister = registerCache.getFreeFragmentConstant();
            methodVO.fragmentConstantsIndex = ambientInputRegister.index * 4;
            code += "mov " + targetReg + ", " + ambientInputRegister + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    AmbientBasicMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        if (methodVO.needsUV) {
            stage.activateTexture(methodVO.texturesIndex, shaderObject.texture, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
            if (shaderObject.alphaThreshold > 0)
                shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex] = shaderObject.alphaThreshold;
        }
        else {
            var index = methodVO.fragmentConstantsIndex;
            var data = shaderObject.fragmentConstantData;
            data[index] = this._colorR;
            data[index + 1] = this._colorG;
            data[index + 2] = this._colorB;
            data[index + 3] = this._alpha;
        }
    };
    /**
     * Updates the ambient color data used by the render state.
     */
    AmbientBasicMethod.prototype.updateColor = function () {
        this._colorR = ((this._color >> 16) & 0xff) / 0xff * this._ambient;
        this._colorG = ((this._color >> 8) & 0xff) / 0xff * this._ambient;
        this._colorB = (this._color & 0xff) / 0xff * this._ambient;
    };
    return AmbientBasicMethod;
})(ShadingMethodBase);
module.exports = AmbientBasicMethod;


},{"awayjs-methodmaterials/lib/methods/ShadingMethodBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\AmbientEnvMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var AmbientBasicMethod = require("awayjs-methodmaterials/lib/methods/AmbientBasicMethod");
/**
 * AmbientEnvMapMethod provides a diffuse shading method that uses a diffuse irradiance environment map to
 * approximate global lighting rather than lights.
 */
var AmbientEnvMapMethod = (function (_super) {
    __extends(AmbientEnvMapMethod, _super);
    /**
     * Creates a new <code>AmbientEnvMapMethod</code> object.
     *
     * @param envMap The cube environment map to use for the ambient lighting.
     */
    function AmbientEnvMapMethod(envMap) {
        _super.call(this);
        this._cubeTexture = envMap;
    }
    /**
     * @inheritDoc
     */
    AmbientEnvMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        _super.prototype.iInitVO.call(this, shaderObject, methodVO);
        methodVO.needsNormals = true;
    };
    Object.defineProperty(AmbientEnvMapMethod.prototype, "envMap", {
        /**
         * The cube environment map to use for the diffuse lighting.
         */
        get: function () {
            return this._cubeTexture;
        },
        set: function (value) {
            this._cubeTexture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    AmbientEnvMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        stage.activateCubeTexture(methodVO.texturesIndex, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
    };
    /**
     * @inheritDoc
     */
    AmbientEnvMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, regCache, sharedRegisters) {
        var code = "";
        var ambientInputRegister;
        var cubeMapReg = regCache.getFreeTextureReg();
        methodVO.texturesIndex = cubeMapReg.index;
        code += ShaderCompilerHelper.getTexCubeSampleCode(targetReg, cubeMapReg, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping, sharedRegisters.normalFragment);
        ambientInputRegister = regCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = ambientInputRegister.index;
        code += "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + ambientInputRegister + ".xyz\n";
        return code;
    };
    return AmbientEnvMapMethod;
})(AmbientBasicMethod);
module.exports = AmbientEnvMapMethod;


},{"awayjs-methodmaterials/lib/methods/AmbientBasicMethod":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\CurveBasicMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
/**
 * AmbientBasicMethod provides the default shading method for uniform ambient lighting.
 */
var CurveBasicMethod = (function (_super) {
    __extends(CurveBasicMethod, _super);
    /**
     * Creates a new AmbientBasicMethod object.
     */
    function CurveBasicMethod() {
        _super.call(this);
        this._color = 0xffffff;
        this._alpha = 1;
        this._colorR = 1;
        this._colorG = 1;
        this._colorB = 1;
        this._ambient = 1;
    }
    /**
     * @inheritDoc
     */
    CurveBasicMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsUV = true; // Boolean(shaderObject.texture != null);
    };
    /**
     * @inheritDoc
     */
    CurveBasicMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        if (!methodVO.needsUV) {
            this._color = shaderObject.color;
            this.updateColor();
        }
    };
    Object.defineProperty(CurveBasicMethod.prototype, "ambient", {
        /**
         * The strength of the ambient reflection of the surface.
         */
        get: function () {
            return this._ambient;
        },
        set: function (value) {
            if (this._ambient == value)
                return;
            this._ambient = value;
            this.updateColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CurveBasicMethod.prototype, "alpha", {
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
    /**
     * @inheritDoc
     */
    CurveBasicMethod.prototype.copyFrom = function (method) {
        var m = method;
        var b = m;
    };
    /**
     * @inheritDoc
     */
    /*
    public iGeVertexCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string {
        var code:string = "";
        code = "mov " + sharedRegisters.uvVarying + " " + registerCache.uv +  " \n";
    }*/
    CurveBasicMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var ambientInputRegister;
        if (methodVO.needsUV) {
            ambientInputRegister = registerCache.getFreeTextureReg();
            methodVO.texturesIndex = ambientInputRegister.index;
            code += ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedRegisters, ambientInputRegister, shaderObject.texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, false);
            if (shaderObject.alphaThreshold > 0) {
                var cutOffReg = registerCache.getFreeFragmentConstant();
                methodVO.fragmentConstantsIndex = cutOffReg.index * 4;
                code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" + "kil " + targetReg + ".w\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
            }
        }
        else {
            ambientInputRegister = registerCache.getFreeFragmentConstant();
            methodVO.fragmentConstantsIndex = ambientInputRegister.index * 4;
            code += "mov " + targetReg + ", " + ambientInputRegister + "\n";
        }
        code = "mov " + targetReg + ", " + sharedRegisters.uvVarying + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    CurveBasicMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        if (methodVO.needsUV) {
            stage.activateTexture(methodVO.texturesIndex, shaderObject.texture, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
            if (shaderObject.alphaThreshold > 0)
                shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex] = shaderObject.alphaThreshold;
        }
        else {
            var index = methodVO.fragmentConstantsIndex;
            var data = shaderObject.fragmentConstantData;
            data[index] = this._colorR;
            data[index + 1] = this._colorG;
            data[index + 2] = this._colorB;
            data[index + 3] = this._alpha;
        }
    };
    /**
     * Updates the ambient color data used by the render state.
     */
    CurveBasicMethod.prototype.updateColor = function () {
        this._colorR = ((this._color >> 16) & 0xff) / 0xff * this._ambient;
        this._colorG = ((this._color >> 8) & 0xff) / 0xff * this._ambient;
        this._colorB = (this._color & 0xff) / 0xff * this._ambient;
    };
    return CurveBasicMethod;
})(ShadingMethodBase);
module.exports = CurveBasicMethod;


},{"awayjs-methodmaterials/lib/methods/ShadingMethodBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\DiffuseBasicMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var LightingMethodBase = require("awayjs-methodmaterials/lib/methods/LightingMethodBase");
/**
 * DiffuseBasicMethod provides the default shading method for Lambert (dot3) diffuse lighting.
 */
var DiffuseBasicMethod = (function (_super) {
    __extends(DiffuseBasicMethod, _super);
    /**
     * Creates a new DiffuseBasicMethod object.
     */
    function DiffuseBasicMethod() {
        _super.call(this);
        this._multiply = true;
        this._diffuseColor = 0xffffff;
        this._ambientColor = 0xffffff;
        this._diffuseR = 1;
        this._diffuseG = 1;
        this._diffuseB = 1;
        this._ambientR = 1;
        this._ambientG = 1;
        this._ambientB = 1;
    }
    DiffuseBasicMethod.prototype.iIsUsed = function (shaderObject) {
        if (!shaderObject.numLights)
            return false;
        return true;
    };
    Object.defineProperty(DiffuseBasicMethod.prototype, "multiply", {
        /**
         * Set internally if diffuse color component multiplies or replaces the ambient color
         */
        get: function () {
            return this._multiply;
        },
        set: function (value) {
            if (this._multiply == value)
                return;
            this._multiply = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    DiffuseBasicMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsUV = this._pUseTexture;
        methodVO.needsNormals = shaderObject.numLights > 0;
    };
    /**
     * Forces the creation of the texture's mipmaps.
     * @param stage The Stage used by the renderer
     */
    DiffuseBasicMethod.prototype.generateMip = function (stage) {
        if (this._pUseTexture)
            stage.activateTexture(0, this._texture, true, true, true);
    };
    Object.defineProperty(DiffuseBasicMethod.prototype, "diffuseColor", {
        /**
         * The color of the diffuse reflection when not using a texture.
         */
        get: function () {
            return this._diffuseColor;
        },
        set: function (value) {
            if (this._diffuseColor == value)
                return;
            this._diffuseColor = value;
            this.updateDiffuse();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseBasicMethod.prototype, "ambientColor", {
        /**
         * The color of the ambient reflection
         */
        get: function () {
            return this._ambientColor;
        },
        set: function (value) {
            if (this._ambientColor == value)
                return;
            this._ambientColor = value;
            this.updateAmbient();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseBasicMethod.prototype, "texture", {
        /**
         * The bitmapData to use to define the diffuse reflection color per texel.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            var b = (value != null);
            if (b != this._pUseTexture || (value && this._texture && (value.format != this._texture.format)))
                this.iInvalidateShaderProgram();
            this._pUseTexture = b;
            this._texture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.dispose = function () {
        this._texture = null;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.copyFrom = function (method) {
        var diff = method;
        this.texture = diff.texture;
        this.multiply = diff.multiply;
        this.diffuseColor = diff.diffuseColor;
        this.ambientColor = diff.ambientColor;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._pTotalLightColorReg = null;
        this._pDiffuseInputRegister = null;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        var code = "";
        this._pIsFirstLight = true;
        this._pTotalLightColorReg = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(this._pTotalLightColorReg, 1);
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
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
        code += "dp3 " + t + ".x, " + lightDirReg + ", " + sharedRegisters.normalFragment + "\n" + "max " + t + ".w, " + t + ".x, " + sharedRegisters.commons + ".y\n";
        if (shaderObject.usesLightFallOff)
            code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);
        code += "mul " + t + ", " + t + ".w, " + lightColReg + "\n";
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
    DiffuseBasicMethod.prototype.iGetFragmentCodePerProbe = function (shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
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
        code += "tex " + t + ", " + sharedRegisters.normalFragment + ", " + cubeMapReg + " <cube,linear,miplinear>\n" + "mul " + t + ".xyz, " + t + ".xyz, " + weightRegister + "\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);
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
    DiffuseBasicMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var albedo;
        var cutOffReg;
        // incorporate input from ambient
        if (sharedRegisters.shadowTarget)
            code += this.pApplyShadow(shaderObject, methodVO, registerCache, sharedRegisters);
        albedo = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(albedo, 1);
        var ambientColorRegister = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = ambientColorRegister.index * 4;
        if (this._pUseTexture) {
            this._pDiffuseInputRegister = registerCache.getFreeTextureReg();
            methodVO.texturesIndex = this._pDiffuseInputRegister.index;
            code += ShaderCompilerHelper.getTex2DSampleCode(albedo, sharedRegisters, this._pDiffuseInputRegister, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping);
        }
        else {
            this._pDiffuseInputRegister = registerCache.getFreeFragmentConstant();
            code += "mov " + albedo + ", " + this._pDiffuseInputRegister + "\n";
        }
        code += "sat " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + "\n" + "mul " + albedo + ".xyz, " + albedo + ", " + this._pTotalLightColorReg + "\n";
        if (this._multiply) {
            code += "add " + albedo + ".xyz, " + albedo + ", " + ambientColorRegister + "\n" + "mul " + targetReg + ".xyz, " + targetReg + ", " + albedo + "\n";
        }
        else {
            code += "mul " + targetReg + ".xyz, " + targetReg + ", " + ambientColorRegister + "\n" + "mul " + this._pTotalLightColorReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" + "sub " + targetReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" + "add " + targetReg + ".xyz, " + targetReg + ", " + albedo + "\n";
        }
        registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
        registerCache.removeFragmentTempUsage(albedo);
        return code;
    };
    /**
     * Generate the code that applies the calculated shadow to the diffuse light
     * @param methodVO The MethodVO object for which the compilation is currently happening.
     * @param regCache The register cache the compiler is currently using for the register management.
     */
    DiffuseBasicMethod.prototype.pApplyShadow = function (shaderObject, methodVO, regCache, sharedRegisters) {
        return "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        if (this._pUseTexture) {
            stage.activateTexture(methodVO.texturesIndex, this._texture, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
        }
        else {
            var index = methodVO.fragmentConstantsIndex;
            var data = shaderObject.fragmentConstantData;
            data[index + 4] = this._diffuseR;
            data[index + 5] = this._diffuseG;
            data[index + 6] = this._diffuseB;
            data[index + 7] = 1;
        }
    };
    /**
     * Updates the diffuse color data used by the render state.
     */
    DiffuseBasicMethod.prototype.updateDiffuse = function () {
        this._diffuseR = ((this._diffuseColor >> 16) & 0xff) / 0xff;
        this._diffuseG = ((this._diffuseColor >> 8) & 0xff) / 0xff;
        this._diffuseB = (this._diffuseColor & 0xff) / 0xff;
    };
    /**
     * Updates the ambient color data used by the render state.
     */
    DiffuseBasicMethod.prototype.updateAmbient = function () {
        this._ambientR = ((this._ambientColor >> 16) & 0xff) / 0xff;
        this._ambientG = ((this._ambientColor >> 8) & 0xff) / 0xff;
        this._ambientB = (this._ambientColor & 0xff) / 0xff;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
        //TODO move this to Activate (ambientR/G/B currently calc'd in render state)
        if (shaderObject.numLights > 0) {
            var index = methodVO.fragmentConstantsIndex;
            var data = shaderObject.fragmentConstantData;
            data[index] = shaderObject.ambientR * this._ambientR;
            data[index + 1] = shaderObject.ambientG * this._ambientG;
            data[index + 2] = shaderObject.ambientB * this._ambientB;
            data[index + 3] = 1;
        }
    };
    return DiffuseBasicMethod;
})(LightingMethodBase);
module.exports = DiffuseBasicMethod;


},{"awayjs-methodmaterials/lib/methods/LightingMethodBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\DiffuseCelMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DiffuseCompositeMethod = require("awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod");
/**
 * DiffuseCelMethod provides a shading method to add diffuse cel (cartoon) shading.
 */
var DiffuseCelMethod = (function (_super) {
    __extends(DiffuseCelMethod, _super);
    /**
     * Creates a new DiffuseCelMethod object.
     * @param levels The amount of shadow gradations.
     * @param baseMethod An optional diffuse method on which the cartoon shading is based. If omitted, DiffuseBasicMethod is used.
     */
    function DiffuseCelMethod(levels, baseMethod) {
        var _this = this;
        if (levels === void 0) { levels = 3; }
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this, null, baseMethod);
        this._smoothness = .1;
        this.baseMethod._iModulateMethod = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) { return _this.clampDiffuse(shaderObject, methodVO, targetReg, registerCache, sharedRegisters); };
        this._levels = levels;
    }
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        _super.prototype.iInitConstants.call(this, shaderObject, methodVO);
        data[index + 1] = 1;
        data[index + 2] = 0;
    };
    Object.defineProperty(DiffuseCelMethod.prototype, "levels", {
        /**
         * The amount of shadow gradations.
         */
        get: function () {
            return this._levels;
        },
        set: function (value /*uint*/) {
            this._levels = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseCelMethod.prototype, "smoothness", {
        /**
         * The smoothness of the edge between 2 shading levels.
         */
        get: function () {
            return this._smoothness;
        },
        set: function (value) {
            this._smoothness = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._dataReg = null;
    };
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        data[index] = this._levels;
        data[index + 3] = this._smoothness;
    };
    /**
     * Snaps the diffuse shading of the wrapped method to one of the levels.
     * @param vo The MethodVO used to compile the current shader.
     * @param t The register containing the diffuse strength in the "w" component.
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared register data for this shader.
     * @return The AGAL fragment code for the method.
     */
    DiffuseCelMethod.prototype.clampDiffuse = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        return "mul " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".x\n" + "frc " + targetReg + ".z, " + targetReg + ".w\n" + "sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".z\n" + "mov " + targetReg + ".x, " + this._dataReg + ".x\n" + "sub " + targetReg + ".x, " + targetReg + ".x, " + this._dataReg + ".y\n" + "rcp " + targetReg + ".x," + targetReg + ".x\n" + "mul " + targetReg + ".w, " + targetReg + ".y, " + targetReg + ".x\n" + "sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".x\n" + "div " + targetReg + ".z, " + targetReg + ".z, " + this._dataReg + ".w\n" + "sat " + targetReg + ".z, " + targetReg + ".z\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".z\n" + "sub " + targetReg + ".z, " + this._dataReg + ".y, " + targetReg + ".z\n" + "mul " + targetReg + ".y, " + targetReg + ".y, " + targetReg + ".z\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n" + "sat " + targetReg + ".w, " + targetReg + ".w\n";
    };
    return DiffuseCelMethod;
})(DiffuseCompositeMethod);
module.exports = DiffuseCelMethod;


},{"awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod":undefined}],"awayjs-methodmaterials\\lib\\methods\\DiffuseCompositeMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShadingMethodEvent = require("awayjs-renderergl/lib/events/ShadingMethodEvent");
var DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
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
        this.pBaseMethod = baseMethod || new DiffuseBasicMethod();
        this.pBaseMethod._iModulateMethod = modulateMethod;
        this.pBaseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
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
            this.pBaseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            this.pBaseMethod = value;
            this.pBaseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        this.pBaseMethod.iInitVO(shaderObject, methodVO);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        this.pBaseMethod.iInitConstants(shaderObject, methodVO);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.dispose = function () {
        this.pBaseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
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
    Object.defineProperty(DiffuseCompositeMethod.prototype, "diffuseColor", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this.pBaseMethod.diffuseColor;
        },
        /**
         * @inheritDoc
         */
        set: function (value) {
            this.pBaseMethod.diffuseColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseCompositeMethod.prototype, "ambientColor", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this.pBaseMethod.ambientColor;
        },
        /**
         * @inheritDoc
         */
        set: function (value) {
            this.pBaseMethod.ambientColor = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        return this.pBaseMethod.iGetFragmentPreLightingCode(shaderObject, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        var code = this.pBaseMethod.iGetFragmentCodePerLight(shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
        this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentCodePerProbe = function (shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
        var code = this.pBaseMethod.iGetFragmentCodePerProbe(shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
        this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        this.pBaseMethod.iActivate(shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
        this.pBaseMethod.iSetRenderState(shaderObject, methodVO, renderable, stage, camera);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iDeactivate = function (shaderObject, methodVO, stage) {
        this.pBaseMethod.iDeactivate(shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetVertexCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        return this.pBaseMethod.iGetVertexCode(shaderObject, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        return this.pBaseMethod.iGetFragmentPostLightingCode(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
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
})(DiffuseBasicMethod);
module.exports = DiffuseCompositeMethod;


},{"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod":undefined,"awayjs-renderergl/lib/events/ShadingMethodEvent":undefined}],"awayjs-methodmaterials\\lib\\methods\\DiffuseDepthMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
/**
 * DiffuseDepthMethod provides a debug method to visualise depth maps
 */
var DiffuseDepthMethod = (function (_super) {
    __extends(DiffuseDepthMethod, _super);
    /**
     * Creates a new DiffuseBasicMethod object.
     */
    function DiffuseDepthMethod() {
        _super.call(this);
    }
    /**
     * @inheritDoc
     */
    DiffuseDepthMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index] = 1.0;
        data[index + 1] = 1 / 255.0;
        data[index + 2] = 1 / 65025.0;
        data[index + 3] = 1 / 16581375.0;
    };
    /**
     * @inheritDoc
     */
    DiffuseDepthMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var temp;
        var decReg;
        if (!this._pUseTexture)
            throw new Error("DiffuseDepthMethod requires texture!");
        // incorporate input from ambient
        if (shaderObject.numLights > 0) {
            if (sharedRegisters.shadowTarget)
                code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + sharedRegisters.shadowTarget + ".w\n";
            code += "add " + targetReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + targetReg + ".xyz\n" + "sat " + targetReg + ".xyz, " + targetReg + ".xyz\n";
            registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
        }
        temp = shaderObject.numLights > 0 ? registerCache.getFreeFragmentVectorTemp() : targetReg;
        this._pDiffuseInputRegister = registerCache.getFreeTextureReg();
        methodVO.texturesIndex = this._pDiffuseInputRegister.index;
        decReg = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        code += ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, this._pDiffuseInputRegister, this.texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping) + "dp4 " + temp + ".x, " + temp + ", " + decReg + "\n" + "mov " + temp + ".yz, " + temp + ".xx			\n" + "mov " + temp + ".w, " + decReg + ".x\n" + "sub " + temp + ".xyz, " + decReg + ".xxx, " + temp + ".xyz\n";
        if (shaderObject.numLights == 0)
            return code;
        code += "mul " + targetReg + ".xyz, " + temp + ".xyz, " + targetReg + ".xyz\n" + "mov " + targetReg + ".w, " + temp + ".w\n";
        return code;
    };
    return DiffuseDepthMethod;
})(DiffuseBasicMethod);
module.exports = DiffuseDepthMethod;


},{"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\DiffuseGradientMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
/**
 * DiffuseGradientMethod is an alternative to DiffuseBasicMethod in which the shading can be modulated with a gradient
 * to introduce color-tinted shading as opposed to the single-channel diffuse strength. This can be used as a crude
 * approximation to subsurface scattering (for instance, the mid-range shading for skin can be tinted red to similate
 * scattered light within the skin attributing to the final colour)
 */
var DiffuseGradientMethod = (function (_super) {
    __extends(DiffuseGradientMethod, _super);
    /**
     * Creates a new DiffuseGradientMethod object.
     * @param gradient A texture that contains the light colour based on the angle. This can be used to change
     * the light colour due to subsurface scattering when the surface faces away from the light.
     */
    function DiffuseGradientMethod(gradient) {
        _super.call(this);
        this._gradient = gradient;
    }
    Object.defineProperty(DiffuseGradientMethod.prototype, "gradient", {
        /**
         * A texture that contains the light colour based on the angle. This can be used to change the light colour
         * due to subsurface scattering when the surface faces away from the light.
         */
        get: function () {
            return this._gradient;
        },
        set: function (value) {
            if (value.format != this._gradient.format)
                this.iInvalidateShaderProgram();
            this._gradient = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._gradientTextureRegister = null;
    };
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        var code = _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
        this._pIsFirstLight = true;
        if (shaderObject.numLights > 0) {
            this._gradientTextureRegister = registerCache.getFreeTextureReg();
            methodVO.secondaryTexturesIndex = this._gradientTextureRegister.index;
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        var code = "";
        var t;
        // write in temporary if not first light, so we can add to total diffuse colour
        if (this._pIsFirstLight)
            t = this._pTotalLightColorReg;
        else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }
        code += "dp3 " + t + ".w, " + lightDirReg + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" + "mul " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".x\n" + "add " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".x\n" + "mul " + t + ".xyz, " + t + ".w, " + lightDirReg + ".w\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);
        code += ShaderCompilerHelper.getTex2DSampleCode(t, sharedRegisters, this._gradientTextureRegister, this._gradient, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, t, "clamp") + "mul " + t + ".xyz, " + t + ".xyz, " + lightColReg + ".xyz\n";
        if (!this._pIsFirstLight) {
            code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
            registerCache.removeFragmentTempUsage(t);
        }
        this._pIsFirstLight = false;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.pApplyShadow = function (shaderObject, methodVO, regCache, sharedRegisters) {
        var t = regCache.getFreeFragmentVectorTemp();
        return "mov " + t + ", " + sharedRegisters.shadowTarget + ".wwww\n" + ShaderCompilerHelper.getTex2DSampleCode(t, sharedRegisters, this._gradientTextureRegister, this._gradient, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, t, "clamp") + "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
    };
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        stage.activateTexture(methodVO.secondaryTexturesIndex, this._gradient, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
    };
    return DiffuseGradientMethod;
})(DiffuseBasicMethod);
module.exports = DiffuseGradientMethod;


},{"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\DiffuseLightMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var DiffuseCompositeMethod = require("awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod");
/**
 * DiffuseLightMapMethod provides a diffuse shading method that uses a light map to modulate the calculated diffuse
 * lighting. It is different from EffectLightMapMethod in that the latter modulates the entire calculated pixel color, rather
 * than only the diffuse lighting value.
 */
var DiffuseLightMapMethod = (function (_super) {
    __extends(DiffuseLightMapMethod, _super);
    /**
     * Creates a new DiffuseLightMapMethod method.
     *
     * @param lightMap The texture containing the light map.
     * @param blendMode The blend mode with which the light map should be applied to the lighting result.
     * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
     * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
     */
    function DiffuseLightMapMethod(lightMap, blendMode, useSecondaryUV, baseMethod) {
        if (blendMode === void 0) { blendMode = "multiply"; }
        if (useSecondaryUV === void 0) { useSecondaryUV = false; }
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this, null, baseMethod);
        this._useSecondaryUV = useSecondaryUV;
        this._lightMapTexture = lightMap;
        this.blendMode = blendMode;
    }
    /**
     * @inheritDoc
     */
    DiffuseLightMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsSecondaryUV = this._useSecondaryUV;
        methodVO.needsUV = !this._useSecondaryUV;
    };
    Object.defineProperty(DiffuseLightMapMethod.prototype, "blendMode", {
        /**
         * The blend mode with which the light map should be applied to the lighting result.
         *
         * @see DiffuseLightMapMethod.ADD
         * @see DiffuseLightMapMethod.MULTIPLY
         */
        get: function () {
            return this._blendMode;
        },
        set: function (value) {
            if (value != DiffuseLightMapMethod.ADD && value != DiffuseLightMapMethod.MULTIPLY)
                throw new Error("Unknown blendmode!");
            if (this._blendMode == value)
                return;
            this._blendMode = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseLightMapMethod.prototype, "lightMapTexture", {
        /**
         * The texture containing the light map data.
         */
        get: function () {
            return this._lightMapTexture;
        },
        set: function (value) {
            this._lightMapTexture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseLightMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        stage.activateTexture(methodVO.secondaryTexturesIndex, this._lightMapTexture, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    DiffuseLightMapMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code;
        var lightMapReg = registerCache.getFreeTextureReg();
        var temp = registerCache.getFreeFragmentVectorTemp();
        methodVO.secondaryTexturesIndex = lightMapReg.index;
        code = ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, lightMapReg, this._lightMapTexture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, sharedRegisters.secondaryUVVarying);
        switch (this._blendMode) {
            case DiffuseLightMapMethod.MULTIPLY:
                code += "mul " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
                break;
            case DiffuseLightMapMethod.ADD:
                code += "add " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
                break;
        }
        code += _super.prototype.iGetFragmentPostLightingCode.call(this, shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
        return code;
    };
    /**
     * Indicates the light map should be multiplied with the calculated shading result.
     * This can be used to add pre-calculated shadows or occlusion.
     */
    DiffuseLightMapMethod.MULTIPLY = "multiply";
    /**
     * Indicates the light map should be added into the calculated shading result.
     * This can be used to add pre-calculated lighting or global illumination.
     */
    DiffuseLightMapMethod.ADD = "add";
    return DiffuseLightMapMethod;
})(DiffuseCompositeMethod);
module.exports = DiffuseLightMapMethod;


},{"awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\DiffuseSubSurfaceMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DiffuseCompositeMethod = require("awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod");
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
        this.pBaseMethod._iModulateMethod = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) { return _this.scatterLight(shaderObject, methodVO, targetReg, registerCache, sharedRegisters); };
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
    DiffuseSubSurfaceMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        _super.prototype.iInitConstants.call(this, shaderObject, methodVO);
        var data = shaderObject.vertexConstantData;
        var index = methodVO.secondaryVertexConstantsIndex;
        data[index] = .5;
        data[index + 1] = -.5;
        data[index + 2] = 0;
        data[index + 3] = 1;
        data = shaderObject.fragmentConstantData;
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
    DiffuseSubSurfaceMethod.prototype.iGetVertexCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        var code = _super.prototype.iGetVertexCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
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
        code += "m44 " + temp + ", vt0, " + lightProjection + "\n" + "div " + temp + ".xyz, " + temp + ".xyz, " + temp + ".w\n" + "mul " + temp + ".xy, " + temp + ".xy, " + toTexRegister + ".xy\n" + "add " + temp + ".xy, " + temp + ".xy, " + toTexRegister + ".xx\n" + "mov " + this._lightProjVarying + ".xyz, " + temp + ".xyz\n" + "mov " + this._lightProjVarying + ".w, va0.w\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseSubSurfaceMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        this._colorReg = registerCache.getFreeFragmentConstant();
        this._decReg = registerCache.getFreeFragmentConstant();
        this._propReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._colorReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseSubSurfaceMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        this._pIsFirstLight = true;
        this._lightColorReg = lightColReg;
        return _super.prototype.iGetFragmentCodePerLight.call(this, shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseSubSurfaceMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = _super.prototype.iGetFragmentPostLightingCode.call(this, shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
        var temp = registerCache.getFreeFragmentVectorTemp();
        code += "mul " + temp + ".xyz, " + this._lightColorReg + ".xyz, " + this._targetReg + ".w\n" + "mul " + temp + ".xyz, " + temp + ".xyz, " + this._colorReg + ".xyz\n" + "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        if (this._targetReg != sharedRegisters.viewDirFragment)
            registerCache.removeFragmentTempUsage(targetReg);
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseSubSurfaceMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var index = methodVO.secondaryFragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = this._scatterR;
        data[index + 1] = this._scatterG;
        data[index + 2] = this._scatterB;
        data[index + 8] = this._scattering;
        data[index + 9] = this._translucency;
    };
    /**
     * @inheritDoc
     */
    DiffuseSubSurfaceMethod.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
        stage.activateTexture(methodVO.secondaryTexturesIndex, this._depthPass._iGetDepthMap(renderable), shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
        this._depthPass._iGetProjection(renderable).copyRawDataTo(shaderObject.vertexConstantData, methodVO.secondaryVertexConstantsIndex + 4, true);
    };
    /**
     * Generates the code for this method
     */
    DiffuseSubSurfaceMethod.prototype.scatterLight = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        // only scatter first light
        if (!this._pIsFirstLight)
            return "";
        this._pIsFirstLight = false;
        var code = "";
        var depthReg = registerCache.getFreeTextureReg();
        if (sharedRegisters.viewDirFragment) {
            this._targetReg = sharedRegisters.viewDirFragment;
        }
        else {
            this._targetReg = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(this._targetReg, 1);
        }
        methodVO.secondaryTexturesIndex = depthReg.index;
        var temp = registerCache.getFreeFragmentVectorTemp();
        code += "tex " + temp + ", " + this._lightProjVarying + ", " + depthReg + " <2d,nearest,clamp>\n" + "dp4 " + targetReg + ".z, " + temp + ", " + this._decReg + "\n";
        // currentDistanceToLight - closestDistanceToLight
        code += "sub " + targetReg + ".z, " + this._lightProjVarying + ".z, " + targetReg + ".z\n" + "sub " + targetReg + ".z, " + this._propReg + ".x, " + targetReg + ".z\n" + "mul " + targetReg + ".z, " + this._propReg + ".y, " + targetReg + ".z\n" + "sat " + targetReg + ".z, " + targetReg + ".z\n" + "neg " + targetReg + ".y, " + targetReg + ".x\n" + "mul " + targetReg + ".y, " + targetReg + ".y, " + this._propReg + ".z\n" + "add " + targetReg + ".y, " + targetReg + ".y, " + this._propReg + ".z\n" + "mul " + this._targetReg + ".w, " + targetReg + ".z, " + targetReg + ".y\n" + "sub " + targetReg + ".y, " + this._colorReg + ".w, " + this._targetReg + ".w\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
        return code;
    };
    return DiffuseSubSurfaceMethod;
})(DiffuseCompositeMethod);
module.exports = DiffuseSubSurfaceMethod;


},{"awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod":undefined}],"awayjs-methodmaterials\\lib\\methods\\DiffuseWrapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
/**
 * DiffuseWrapMethod is an alternative to DiffuseBasicMethod in which the light is allowed to be "wrapped around" the normally dark area, to some extent.
 * It can be used as a crude approximation to Oren-Nayar or simple subsurface scattering.
 */
var DiffuseWrapMethod = (function (_super) {
    __extends(DiffuseWrapMethod, _super);
    /**
     * Creates a new DiffuseWrapMethod object.
     * @param wrapFactor A factor to indicate the amount by which the light is allowed to wrap
     */
    function DiffuseWrapMethod(wrapFactor) {
        if (wrapFactor === void 0) { wrapFactor = .5; }
        _super.call(this);
        this.wrapFactor = wrapFactor;
    }
    /**
     * @inheritDoc
     */
    DiffuseWrapMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._wrapDataRegister = null;
    };
    Object.defineProperty(DiffuseWrapMethod.prototype, "wrapFactor", {
        /**
         * A factor to indicate the amount by which the light is allowed to wrap.
         */
        get: function () {
            return this._wrapFactor;
        },
        set: function (value) {
            this._wrapFactor = value;
            this._wrapFactor = 1 / (value + 1);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseWrapMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        var code = _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
        this._pIsFirstLight = true;
        this._wrapDataRegister = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._wrapDataRegister.index * 4;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseWrapMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
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
        code += "dp3 " + t + ".x, " + lightDirReg + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" + "add " + t + ".y, " + t + ".x, " + this._wrapDataRegister + ".x\n" + "mul " + t + ".y, " + t + ".y, " + this._wrapDataRegister + ".y\n" + "sat " + t + ".w, " + t + ".y\n" + "mul " + t + ".xz, " + t + ".w, " + lightDirReg + ".wz\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shaderObject, methodVO, lightDirReg, registerCache, sharedRegisters);
        code += "mul " + t + ", " + t + ".x, " + lightColReg + "\n";
        if (!this._pIsFirstLight) {
            code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
            registerCache.removeFragmentTempUsage(t);
        }
        this._pIsFirstLight = false;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseWrapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var index = methodVO.secondaryFragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = this._wrapFactor;
        data[index + 1] = 1 / (this._wrapFactor + 1);
    };
    return DiffuseWrapMethod;
})(DiffuseBasicMethod);
module.exports = DiffuseWrapMethod;


},{"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod":undefined}],"awayjs-methodmaterials\\lib\\methods\\EffectAlphaMaskMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
/**
 * EffectAlphaMaskMethod allows the use of an additional texture to specify the alpha value of the material. When used
 * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
 * etc).
 */
var EffectAlphaMaskMethod = (function (_super) {
    __extends(EffectAlphaMaskMethod, _super);
    /**
     * Creates a new EffectAlphaMaskMethod object.
     *
     * @param texture The texture to use as the alpha mask.
     * @param useSecondaryUV Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently.
     */
    function EffectAlphaMaskMethod(texture, useSecondaryUV) {
        if (useSecondaryUV === void 0) { useSecondaryUV = false; }
        _super.call(this);
        this._texture = texture;
        this._useSecondaryUV = useSecondaryUV;
    }
    /**
     * @inheritDoc
     */
    EffectAlphaMaskMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsSecondaryUV = this._useSecondaryUV;
        methodVO.needsUV = !this._useSecondaryUV;
    };
    Object.defineProperty(EffectAlphaMaskMethod.prototype, "useSecondaryUV", {
        /**
         * Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently, for
         * instance to tile the main texture and normal map while providing untiled alpha, for example to define the
         * transparency over a tiled water surface.
         */
        get: function () {
            return this._useSecondaryUV;
        },
        set: function (value) {
            if (this._useSecondaryUV == value)
                return;
            this._useSecondaryUV = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectAlphaMaskMethod.prototype, "texture", {
        /**
         * The texture to use as the alpha mask.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            this._texture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectAlphaMaskMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        stage.activateTexture(methodVO.texturesIndex, this._texture, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
    };
    /**
     * @inheritDoc
     */
    EffectAlphaMaskMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var textureReg = registerCache.getFreeTextureReg();
        var temp = registerCache.getFreeFragmentVectorTemp();
        var uvReg = this._useSecondaryUV ? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying;
        methodVO.texturesIndex = textureReg.index;
        return ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, textureReg, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, uvReg) + "mul " + targetReg + ", " + targetReg + ", " + temp + ".x\n";
    };
    return EffectAlphaMaskMethod;
})(EffectMethodBase);
module.exports = EffectAlphaMaskMethod;


},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\EffectColorMatrixMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
/**
 * EffectColorMatrixMethod provides a shading method that changes the colour of a material analogous to a ColorMatrixFilter.
 */
var EffectColorMatrixMethod = (function (_super) {
    __extends(EffectColorMatrixMethod, _super);
    /**
     * Creates a new EffectColorTransformMethod.
     *
     * @param matrix An array of 20 items for 4 x 5 color transform.
     */
    function EffectColorMatrixMethod(matrix) {
        _super.call(this);
        if (matrix.length != 20)
            throw new Error("Matrix length must be 20!");
        this._matrix = matrix;
    }
    Object.defineProperty(EffectColorMatrixMethod.prototype, "colorMatrix", {
        /**
         * The 4 x 5 matrix to transform the color of the material.
         */
        get: function () {
            return this._matrix;
        },
        set: function (value) {
            this._matrix = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectColorMatrixMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var colorMultReg = registerCache.getFreeFragmentConstant();
        registerCache.getFreeFragmentConstant();
        registerCache.getFreeFragmentConstant();
        registerCache.getFreeFragmentConstant();
        var colorOffsetReg = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = colorMultReg.index * 4;
        var temp = registerCache.getFreeFragmentVectorTemp();
        code += "m44 " + temp + ", " + targetReg + ", " + colorMultReg + "\n" + "add " + targetReg + ", " + temp + ", " + colorOffsetReg + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    EffectColorMatrixMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        var matrix = this._matrix;
        var index = methodVO.fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        // r
        data[index] = matrix[0];
        data[index + 1] = matrix[1];
        data[index + 2] = matrix[2];
        data[index + 3] = matrix[3];
        // g
        data[index + 4] = matrix[5];
        data[index + 5] = matrix[6];
        data[index + 6] = matrix[7];
        data[index + 7] = matrix[8];
        // b
        data[index + 8] = matrix[10];
        data[index + 9] = matrix[11];
        data[index + 10] = matrix[12];
        data[index + 11] = matrix[13];
        // a
        data[index + 12] = matrix[15];
        data[index + 13] = matrix[16];
        data[index + 14] = matrix[17];
        data[index + 15] = matrix[18];
        // rgba offset
        data[index + 16] = matrix[4];
        data[index + 17] = matrix[9];
        data[index + 18] = matrix[14];
        data[index + 19] = matrix[19];
    };
    return EffectColorMatrixMethod;
})(EffectMethodBase);
module.exports = EffectColorMatrixMethod;


},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":undefined}],"awayjs-methodmaterials\\lib\\methods\\EffectColorTransformMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
/**
 * EffectColorTransformMethod provides a shading method that changes the colour of a material analogous to a
 * ColorTransform object.
 */
var EffectColorTransformMethod = (function (_super) {
    __extends(EffectColorTransformMethod, _super);
    /**
     * Creates a new EffectColorTransformMethod.
     */
    function EffectColorTransformMethod() {
        _super.call(this);
    }
    Object.defineProperty(EffectColorTransformMethod.prototype, "colorTransform", {
        /**
         * The ColorTransform object to transform the colour of the material with.
         */
        get: function () {
            return this._colorTransform;
        },
        set: function (value) {
            this._colorTransform = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectColorTransformMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var colorMultReg = registerCache.getFreeFragmentConstant();
        var colorOffsReg = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = colorMultReg.index * 4;
        //TODO: AGAL <> GLSL
        code += "mul " + targetReg + ", " + targetReg + ", " + colorMultReg + "\n" + "add " + targetReg + ", " + targetReg + ", " + colorOffsReg + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    EffectColorTransformMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        var inv = 1 / 0xff;
        var index = methodVO.fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = this._colorTransform.redMultiplier;
        data[index + 1] = this._colorTransform.greenMultiplier;
        data[index + 2] = this._colorTransform.blueMultiplier;
        data[index + 3] = this._colorTransform.alphaMultiplier;
        data[index + 4] = this._colorTransform.redOffset * inv;
        data[index + 5] = this._colorTransform.greenOffset * inv;
        data[index + 6] = this._colorTransform.blueOffset * inv;
        data[index + 7] = this._colorTransform.alphaOffset * inv;
    };
    return EffectColorTransformMethod;
})(EffectMethodBase);
module.exports = EffectColorTransformMethod;


},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":undefined}],"awayjs-methodmaterials\\lib\\methods\\EffectEnvMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
/**
 * EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
 */
var EffectEnvMapMethod = (function (_super) {
    __extends(EffectEnvMapMethod, _super);
    /**
     * Creates an EffectEnvMapMethod object.
     * @param envMap The environment map containing the reflected scene.
     * @param alpha The reflectivity of the surface.
     */
    function EffectEnvMapMethod(envMap, alpha) {
        if (alpha === void 0) { alpha = 1; }
        _super.call(this);
        this._cubeTexture = envMap;
        this._alpha = alpha;
    }
    Object.defineProperty(EffectEnvMapMethod.prototype, "mask", {
        /**
         * An optional texture to modulate the reflectivity of the surface.
         */
        get: function () {
            return this._mask;
        },
        set: function (value) {
            if (value != this._mask || (value && this._mask && (value.format != this._mask.format)))
                this.iInvalidateShaderProgram();
            this._mask = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectEnvMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsNormals = true;
        methodVO.needsView = true;
        methodVO.needsUV = this._mask != null;
    };
    Object.defineProperty(EffectEnvMapMethod.prototype, "envMap", {
        /**
         * The cubic environment map containing the reflected scene.
         */
        get: function () {
            return this._cubeTexture;
        },
        set: function (value) {
            this._cubeTexture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectEnvMapMethod.prototype.dispose = function () {
    };
    Object.defineProperty(EffectEnvMapMethod.prototype, "alpha", {
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
    /**
     * @inheritDoc
     */
    EffectEnvMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex] = this._alpha;
        stage.activateCubeTexture(methodVO.texturesIndex, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
        if (this._mask)
            stage.activateTexture(methodVO.texturesIndex + 1, this._mask, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
    };
    /**
     * @inheritDoc
     */
    EffectEnvMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var dataRegister = registerCache.getFreeFragmentConstant();
        var temp = registerCache.getFreeFragmentVectorTemp();
        var code = "";
        var cubeMapReg = registerCache.getFreeTextureReg();
        methodVO.texturesIndex = cubeMapReg.index;
        methodVO.fragmentConstantsIndex = dataRegister.index * 4;
        registerCache.addFragmentTempUsages(temp, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        // r = I - 2(I.N)*N
        code += "dp3 " + temp + ".w, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" + "add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" + "mul " + temp + ".xyz, " + sharedRegisters.normalFragment + ".xyz, " + temp + ".w\n" + "sub " + temp + ".xyz, " + temp + ".xyz, " + sharedRegisters.viewDirFragment + ".xyz\n" + ShaderCompilerHelper.getTexCubeSampleCode(temp, cubeMapReg, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping, temp) + "sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" + "kil " + temp2 + ".w\n" + "sub " + temp + ", " + temp + ", " + targetReg + "\n";
        if (this._mask)
            code += ShaderCompilerHelper.getTex2DSampleCode(temp2, sharedRegisters, registerCache.getFreeTextureReg(), this._mask, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping) + "mul " + temp + ", " + temp2 + ", " + temp + "\n";
        code += "mul " + temp + ", " + temp + ", " + dataRegister + ".x\n" + "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
        registerCache.removeFragmentTempUsage(temp);
        return code;
    };
    return EffectEnvMapMethod;
})(EffectMethodBase);
module.exports = EffectEnvMapMethod;


},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\EffectFogMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
/**
 * EffectFogMethod provides a method to add distance-based fog to a material.
 */
var EffectFogMethod = (function (_super) {
    __extends(EffectFogMethod, _super);
    /**
     * Creates a new EffectFogMethod object.
     * @param minDistance The distance from which the fog starts appearing.
     * @param maxDistance The distance at which the fog is densest.
     * @param fogColor The colour of the fog.
     */
    function EffectFogMethod(minDistance, maxDistance, fogColor) {
        if (fogColor === void 0) { fogColor = 0x808080; }
        _super.call(this);
        this._minDistance = 0;
        this._maxDistance = 1000;
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.fogColor = fogColor;
    }
    /**
     * @inheritDoc
     */
    EffectFogMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsProjection = true;
    };
    /**
     * @inheritDoc
     */
    EffectFogMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index + 3] = 1;
        data[index + 6] = 0;
        data[index + 7] = 0;
    };
    Object.defineProperty(EffectFogMethod.prototype, "minDistance", {
        /**
         * The distance from which the fog starts appearing.
         */
        get: function () {
            return this._minDistance;
        },
        set: function (value) {
            this._minDistance = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectFogMethod.prototype, "maxDistance", {
        /**
         * The distance at which the fog is densest.
         */
        get: function () {
            return this._maxDistance;
        },
        set: function (value) {
            this._maxDistance = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectFogMethod.prototype, "fogColor", {
        /**
         * The colour of the fog.
         */
        get: function () {
            return this._fogColor;
        },
        set: function (value /*uint*/) {
            this._fogColor = value;
            this._fogR = ((value >> 16) & 0xff) / 0xff;
            this._fogG = ((value >> 8) & 0xff) / 0xff;
            this._fogB = (value & 0xff) / 0xff;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectFogMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index] = this._fogR;
        data[index + 1] = this._fogG;
        data[index + 2] = this._fogB;
        data[index + 4] = this._minDistance;
        data[index + 5] = 1 / (this._maxDistance - this._minDistance);
    };
    /**
     * @inheritDoc
     */
    EffectFogMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var fogColor = registerCache.getFreeFragmentConstant();
        var fogData = registerCache.getFreeFragmentConstant();
        var temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        var code = "";
        methodVO.fragmentConstantsIndex = fogColor.index * 4;
        code += "sub " + temp2 + ".w, " + sharedRegisters.projectionFragment + ".z, " + fogData + ".x\n" + "mul " + temp2 + ".w, " + temp2 + ".w, " + fogData + ".y\n" + "sat " + temp2 + ".w, " + temp2 + ".w\n" + "sub " + temp + ", " + fogColor + ", " + targetReg + "\n" + "mul " + temp + ", " + temp + ", " + temp2 + ".w\n" + "add " + targetReg + ", " + targetReg + ", " + temp + "\n"; // fogRatio*(fogColor- col) + col
        registerCache.removeFragmentTempUsage(temp);
        return code;
    };
    return EffectFogMethod;
})(EffectMethodBase);
module.exports = EffectFogMethod;


},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":undefined}],"awayjs-methodmaterials\\lib\\methods\\EffectFresnelEnvMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
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
        this._cubeTexture = envMap;
        this._alpha = alpha;
    }
    /**
     * @inheritDoc
     */
    EffectFresnelEnvMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsNormals = true;
        methodVO.needsView = true;
        methodVO.needsUV = this._mask != null;
    };
    /**
     * @inheritDoc
     */
    EffectFresnelEnvMapMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 3] = 1;
    };
    Object.defineProperty(EffectFresnelEnvMapMethod.prototype, "mask", {
        /**
         * An optional texture to modulate the reflectivity of the surface.
         */
        get: function () {
            return this._mask;
        },
        set: function (value) {
            if (Boolean(value) != Boolean(this._mask) || (value && this._mask && (value.format != this._mask.format))) {
                this.iInvalidateShaderProgram();
            }
            this._mask = value;
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
            return this._cubeTexture;
        },
        set: function (value) {
            this._cubeTexture = value;
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
    EffectFresnelEnvMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index] = this._alpha;
        data[index + 1] = this._normalReflectance;
        data[index + 2] = this._fresnelPower;
        stage.activateCubeTexture(methodVO.texturesIndex, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
        if (this._mask)
            stage.activateTexture(methodVO.texturesIndex + 1, this._mask, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
    };
    /**
     * @inheritDoc
     */
    EffectFresnelEnvMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var dataRegister = registerCache.getFreeFragmentConstant();
        var temp = registerCache.getFreeFragmentVectorTemp();
        var code = "";
        var cubeMapReg = registerCache.getFreeTextureReg();
        var viewDirReg = sharedRegisters.viewDirFragment;
        var normalReg = sharedRegisters.normalFragment;
        methodVO.texturesIndex = cubeMapReg.index;
        methodVO.fragmentConstantsIndex = dataRegister.index * 4;
        registerCache.addFragmentTempUsages(temp, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        // r = V - 2(V.N)*N
        code += "dp3 " + temp + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" + "mul " + temp + ".xyz, " + normalReg + ".xyz, " + temp + ".w\n" + "sub " + temp + ".xyz, " + temp + ".xyz, " + viewDirReg + ".xyz\n" + ShaderCompilerHelper.getTexCubeSampleCode(temp, cubeMapReg, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping, temp) + "sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" + "kil " + temp2 + ".w\n" + "sub " + temp + ", " + temp + ", " + targetReg + "\n";
        // calculate fresnel term
        code += "dp3 " + viewDirReg + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "sub " + viewDirReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" + "pow " + viewDirReg + ".w, " + viewDirReg + ".w, " + dataRegister + ".z\n" + "sub " + normalReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" + "mul " + normalReg + ".w, " + dataRegister + ".y, " + normalReg + ".w\n" + "add " + viewDirReg + ".w, " + viewDirReg + ".w, " + normalReg + ".w\n" + "mul " + viewDirReg + ".w, " + dataRegister + ".x, " + viewDirReg + ".w\n";
        if (this._mask) {
            var maskReg = registerCache.getFreeTextureReg();
            code += ShaderCompilerHelper.getTex2DSampleCode(temp2, sharedRegisters, maskReg, this._mask, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping) + "mul " + viewDirReg + ".w, " + temp2 + ".x, " + viewDirReg + ".w\n";
        }
        // blend
        code += "mul " + temp + ", " + temp + ", " + viewDirReg + ".w\n" + "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
        registerCache.removeFragmentTempUsage(temp);
        return code;
    };
    return EffectFresnelEnvMapMethod;
})(EffectMethodBase);
module.exports = EffectFresnelEnvMapMethod;


},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\EffectLightMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
/**
 * EffectLightMapMethod provides a method that allows applying a light map texture to the calculated pixel colour.
 * It is different from DiffuseLightMapMethod in that the latter only modulates the diffuse shading value rather
 * than the whole pixel colour.
 */
var EffectLightMapMethod = (function (_super) {
    __extends(EffectLightMapMethod, _super);
    /**
     * Creates a new EffectLightMapMethod object.
     *
     * @param texture The texture containing the light map.
     * @param blendMode The blend mode with which the light map should be applied to the lighting result.
     * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
     */
    function EffectLightMapMethod(texture, blendMode, useSecondaryUV) {
        if (blendMode === void 0) { blendMode = "multiply"; }
        if (useSecondaryUV === void 0) { useSecondaryUV = false; }
        _super.call(this);
        this._useSecondaryUV = useSecondaryUV;
        this._texture = texture;
        this.blendMode = blendMode;
    }
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsUV = !this._useSecondaryUV;
        methodVO.needsSecondaryUV = this._useSecondaryUV;
    };
    Object.defineProperty(EffectLightMapMethod.prototype, "blendMode", {
        /**
         * The blend mode with which the light map should be applied to the lighting result.
         *
         * @see EffectLightMapMethod.ADD
         * @see EffectLightMapMethod.MULTIPLY
         */
        get: function () {
            return this._blendMode;
        },
        set: function (value) {
            if (value != EffectLightMapMethod.ADD && value != EffectLightMapMethod.MULTIPLY)
                throw new Error("Unknown blendmode!");
            if (this._blendMode == value)
                return;
            this._blendMode = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectLightMapMethod.prototype, "texture", {
        /**
         * The texture containing the light map.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            if (value.format != this._texture.format)
                this.iInvalidateShaderProgram();
            this._texture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        stage.activateTexture(methodVO.texturesIndex, this._texture, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code;
        var lightMapReg = registerCache.getFreeTextureReg();
        var temp = registerCache.getFreeFragmentVectorTemp();
        methodVO.texturesIndex = lightMapReg.index;
        code = ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, lightMapReg, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, this._useSecondaryUV ? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);
        switch (this._blendMode) {
            case EffectLightMapMethod.MULTIPLY:
                code += "mul " + targetReg + ", " + targetReg + ", " + temp + "\n";
                break;
            case EffectLightMapMethod.ADD:
                code += "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
                break;
        }
        return code;
    };
    /**
     * Indicates the light map should be multiplied with the calculated shading result.
     */
    EffectLightMapMethod.MULTIPLY = "multiply";
    /**
     * Indicates the light map should be added into the calculated shading result.
     */
    EffectLightMapMethod.ADD = "add";
    return EffectLightMapMethod;
})(EffectMethodBase);
module.exports = EffectLightMapMethod;


},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\EffectMethodBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/library/AssetType");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
/**
 * EffectMethodBase forms an abstract base class for shader methods that are not dependent on light sources,
 * and are in essence post-process effects on the materials.
 */
var EffectMethodBase = (function (_super) {
    __extends(EffectMethodBase, _super);
    function EffectMethodBase() {
        _super.call(this);
    }
    Object.defineProperty(EffectMethodBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return AssetType.EFFECTS_METHOD;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
     * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
     * @param regCache The register cache used during the compilation.
     * @param targetReg The register that will be containing the method's output.
     * @private
     */
    EffectMethodBase.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        throw new AbstractMethodError();
        return "";
    };
    return EffectMethodBase;
})(ShadingMethodBase);
module.exports = EffectMethodBase;


},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/library/AssetType":undefined,"awayjs-methodmaterials/lib/methods/ShadingMethodBase":undefined}],"awayjs-methodmaterials\\lib\\methods\\EffectRefractionEnvMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
/**
 * EffectRefractionEnvMapMethod provides a method to add refracted transparency based on cube maps.
 */
var EffectRefractionEnvMapMethod = (function (_super) {
    __extends(EffectRefractionEnvMapMethod, _super);
    /**
     * Creates a new EffectRefractionEnvMapMethod object. Example values for dispersion are: dispersionR: -0.03, dispersionG: -0.01, dispersionB: = .0015
     *
     * @param envMap The environment map containing the refracted scene.
     * @param refractionIndex The refractive index of the material.
     * @param dispersionR The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
     * @param dispersionG The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
     * @param dispersionB The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
     */
    function EffectRefractionEnvMapMethod(envMap, refractionIndex, dispersionR, dispersionG, dispersionB) {
        if (refractionIndex === void 0) { refractionIndex = .1; }
        if (dispersionR === void 0) { dispersionR = 0; }
        if (dispersionG === void 0) { dispersionG = 0; }
        if (dispersionB === void 0) { dispersionB = 0; }
        _super.call(this);
        this._dispersionR = 0;
        this._dispersionG = 0;
        this._dispersionB = 0;
        this._alpha = 1;
        this._envMap = envMap;
        this._dispersionR = dispersionR;
        this._dispersionG = dispersionG;
        this._dispersionB = dispersionB;
        this._useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
        this._refractionIndex = refractionIndex;
    }
    /**
     * @inheritDoc
     */
    EffectRefractionEnvMapMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index + 4] = 1;
        data[index + 5] = 0;
        data[index + 7] = 1;
    };
    /**
     * @inheritDoc
     */
    EffectRefractionEnvMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsNormals = true;
        methodVO.needsView = true;
    };
    Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "envMap", {
        /**
         * The cube environment map to use for the refraction.
         */
        get: function () {
            return this._envMap;
        },
        set: function (value) {
            this._envMap = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "refractionIndex", {
        /**
         * The refractive index of the material.
         */
        get: function () {
            return this._refractionIndex;
        },
        set: function (value) {
            this._refractionIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "dispersionR", {
        /**
         * The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
         */
        get: function () {
            return this._dispersionR;
        },
        set: function (value) {
            this._dispersionR = value;
            var useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
            if (this._useDispersion != useDispersion) {
                this.iInvalidateShaderProgram();
                this._useDispersion = useDispersion;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "dispersionG", {
        /**
         * The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
         */
        get: function () {
            return this._dispersionG;
        },
        set: function (value) {
            this._dispersionG = value;
            var useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
            if (this._useDispersion != useDispersion) {
                this.iInvalidateShaderProgram();
                this._useDispersion = useDispersion;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "dispersionB", {
        /**
         * The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
         */
        get: function () {
            return this._dispersionB;
        },
        set: function (value) {
            this._dispersionB = value;
            var useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
            if (this._useDispersion != useDispersion) {
                this.iInvalidateShaderProgram();
                this._useDispersion = useDispersion;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "alpha", {
        /**
         * The amount of transparency of the object. Warning: the alpha applies to the refracted color, not the actual
         * material. A value of 1 will make it appear fully transparent.
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
    /**
     * @inheritDoc
     */
    EffectRefractionEnvMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = this._dispersionR + this._refractionIndex;
        if (this._useDispersion) {
            data[index + 1] = this._dispersionG + this._refractionIndex;
            data[index + 2] = this._dispersionB + this._refractionIndex;
        }
        data[index + 3] = this._alpha;
        stage.activateCubeTexture(methodVO.texturesIndex, this._envMap, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
    };
    /**
     * @inheritDoc
     */
    EffectRefractionEnvMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        // todo: data2.x could use common reg, so only 1 reg is used
        var data = registerCache.getFreeFragmentConstant();
        var data2 = registerCache.getFreeFragmentConstant();
        var code = "";
        var cubeMapReg = registerCache.getFreeTextureReg();
        var refractionDir;
        var refractionColor;
        var temp;
        methodVO.texturesIndex = cubeMapReg.index;
        methodVO.fragmentConstantsIndex = data.index * 4;
        refractionDir = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(refractionDir, 1);
        refractionColor = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(refractionColor, 1);
        temp = registerCache.getFreeFragmentVectorTemp();
        var viewDirReg = sharedRegisters.viewDirFragment;
        var normalReg = sharedRegisters.normalFragment;
        code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";
        code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "sqt " + temp + ".y, " + temp + ".w\n" + "mul " + temp + ".x, " + data + ".x, " + temp + ".x\n" + "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" + "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" + "mul " + refractionDir + ", " + data + ".x, " + viewDirReg + "\n" + "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" + "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n";
        code += ShaderCompilerHelper.getTexCubeSampleCode(refractionColor, cubeMapReg, this._envMap, shaderObject.useSmoothTextures, shaderObject.useMipmapping, refractionDir) + "sub " + refractionColor + ".w, " + refractionColor + ".w, fc0.x	\n" + "kil " + refractionColor + ".w\n";
        if (this._useDispersion) {
            // GREEN
            code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "sqt " + temp + ".y, " + temp + ".w\n" + "mul " + temp + ".x, " + data + ".y, " + temp + ".x\n" + "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" + "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" + "mul " + refractionDir + ", " + data + ".y, " + viewDirReg + "\n" + "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" + "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n";
            code += ShaderCompilerHelper.getTexCubeSampleCode(temp, cubeMapReg, this._envMap, shaderObject.useSmoothTextures, shaderObject.useMipmapping, refractionDir) + "mov " + refractionColor + ".y, " + temp + ".y\n";
            // BLUE
            code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "sqt " + temp + ".y, " + temp + ".w\n" + "mul " + temp + ".x, " + data + ".z, " + temp + ".x\n" + "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" + "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" + "mul " + refractionDir + ", " + data + ".z, " + viewDirReg + "\n" + "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" + "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n";
            code += ShaderCompilerHelper.getTexCubeSampleCode(temp, cubeMapReg, this._envMap, shaderObject.useSmoothTextures, shaderObject.useMipmapping, refractionDir) + "mov " + refractionColor + ".z, " + temp + ".z\n";
        }
        registerCache.removeFragmentTempUsage(refractionDir);
        code += "sub " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + targetReg + ".xyz\n" + "mul " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + data + ".w\n" + "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + refractionColor + ".xyz\n";
        registerCache.removeFragmentTempUsage(refractionColor);
        // restore
        code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";
        return code;
    };
    return EffectRefractionEnvMapMethod;
})(EffectMethodBase);
module.exports = EffectRefractionEnvMapMethod;


},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\EffectRimLightMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
/**
 * EffectRimLightMethod provides a method to add rim lighting to a material. This adds a glow-like effect to edges of objects.
 */
var EffectRimLightMethod = (function (_super) {
    __extends(EffectRimLightMethod, _super);
    /**
     * Creates a new <code>EffectRimLightMethod</code> object.
     *
     * @param color The colour of the rim light.
     * @param strength The strength of the rim light.
     * @param power The power of the rim light. Higher values will result in a higher edge fall-off.
     * @param blend The blend mode with which to add the light to the object.
     */
    function EffectRimLightMethod(color, strength, power, blend) {
        if (color === void 0) { color = 0xffffff; }
        if (strength === void 0) { strength = .4; }
        if (power === void 0) { power = 2; }
        if (blend === void 0) { blend = "mix"; }
        _super.call(this);
        this._blendMode = blend;
        this._strength = strength;
        this._power = power;
        this.color = color;
    }
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 3] = 1;
    };
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsNormals = true;
        methodVO.needsView = true;
    };
    Object.defineProperty(EffectRimLightMethod.prototype, "blendMode", {
        /**
         * The blend mode with which to add the light to the object.
         *
         * EffectRimLightMethod.MULTIPLY multiplies the rim light with the material's colour.
         * EffectRimLightMethod.ADD adds the rim light with the material's colour.
         * EffectRimLightMethod.MIX provides normal alpha blending.
         */
        get: function () {
            return this._blendMode;
        },
        set: function (value) {
            if (this._blendMode == value)
                return;
            this._blendMode = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRimLightMethod.prototype, "color", {
        /**
         * The color of the rim light.
         */
        get: function () {
            return this._color;
        },
        set: function (value /*uint*/) {
            this._color = value;
            this._colorR = ((value >> 16) & 0xff) / 0xff;
            this._colorG = ((value >> 8) & 0xff) / 0xff;
            this._colorB = (value & 0xff) / 0xff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRimLightMethod.prototype, "strength", {
        /**
         * The strength of the rim light.
         */
        get: function () {
            return this._strength;
        },
        set: function (value) {
            this._strength = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRimLightMethod.prototype, "power", {
        /**
         * The power of the rim light. Higher values will result in a higher edge fall-off.
         */
        get: function () {
            return this._power;
        },
        set: function (value) {
            this._power = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = this._colorR;
        data[index + 1] = this._colorG;
        data[index + 2] = this._colorB;
        data[index + 4] = this._strength;
        data[index + 5] = this._power;
    };
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var dataRegister = registerCache.getFreeFragmentConstant();
        var dataRegister2 = registerCache.getFreeFragmentConstant();
        var temp = registerCache.getFreeFragmentVectorTemp();
        var code = "";
        methodVO.fragmentConstantsIndex = dataRegister.index * 4;
        code += "dp3 " + temp + ".x, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" + "sat " + temp + ".x, " + temp + ".x\n" + "sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" + "pow " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".y\n" + "mul " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".x\n" + "sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" + "mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".x\n" + "sub " + temp + ".w, " + dataRegister + ".w, " + temp + ".x\n";
        if (this._blendMode == EffectRimLightMethod.ADD) {
            code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" + "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        }
        else if (this._blendMode == EffectRimLightMethod.MULTIPLY) {
            code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" + "mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        }
        else {
            code += "sub " + temp + ".xyz, " + dataRegister + ".xyz, " + targetReg + ".xyz\n" + "mul " + temp + ".xyz, " + temp + ".xyz, " + temp + ".w\n" + "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        }
        return code;
    };
    EffectRimLightMethod.ADD = "add";
    EffectRimLightMethod.MULTIPLY = "multiply";
    EffectRimLightMethod.MIX = "mix";
    return EffectRimLightMethod;
})(EffectMethodBase);
module.exports = EffectRimLightMethod;


},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":undefined}],"awayjs-methodmaterials\\lib\\methods\\LightingMethodBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
/**
 * LightingMethodBase provides an abstract base method for shading methods that uses lights.
 * Used for diffuse and specular shaders only.
 */
var LightingMethodBase = (function (_super) {
    __extends(LightingMethodBase, _super);
    /**
     * Creates a new LightingMethodBase.
     */
    function LightingMethodBase() {
        _super.call(this);
    }
    /**
     * Get the fragment shader code that will be needed before any per-light code is added.
     * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
     * @param regCache The register cache used during the compilation.
     * @private
     */
    LightingMethodBase.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * Get the fragment shader code that will generate the code relevant to a single light.
     *
     * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
     * @param lightDirReg The register containing the light direction vector.
     * @param lightColReg The register containing the light colour.
     * @param regCache The register cache used during the compilation.
     */
    LightingMethodBase.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * Get the fragment shader code that will generate the code relevant to a single light probe object.
     *
     * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
     * @param cubeMapReg The register containing the cube map for the current probe
     * @param weightRegister A string representation of the register + component containing the current weight
     * @param regCache The register cache providing any necessary registers to the shader
     */
    LightingMethodBase.prototype.iGetFragmentCodePerProbe = function (shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
     *
     * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
     * @param regCache The register cache used during the compilation.
     * @param targetReg The register containing the final shading output.
     * @private
     */
    LightingMethodBase.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        return "";
    };
    return LightingMethodBase;
})(ShadingMethodBase);
module.exports = LightingMethodBase;


},{"awayjs-methodmaterials/lib/methods/ShadingMethodBase":undefined}],"awayjs-methodmaterials\\lib\\methods\\NormalBasicMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
/**
 * NormalBasicMethod is the default method for standard tangent-space normal mapping.
 */
var NormalBasicMethod = (function (_super) {
    __extends(NormalBasicMethod, _super);
    /**
     * Creates a new NormalBasicMethod object.
     */
    function NormalBasicMethod() {
        _super.call(this);
    }
    NormalBasicMethod.prototype.iIsUsed = function (shaderObject) {
        if (!this._useTexture || !shaderObject.normalDependencies)
            return false;
        return true;
    };
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsUV = this._useTexture;
    };
    /**
     * Indicates whether or not this method outputs normals in tangent space. Override for object-space normals.
     */
    NormalBasicMethod.prototype.iOutputsTangentNormals = function () {
        return true;
    };
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.copyFrom = function (method) {
        var s = method;
        var bnm = method;
        if (bnm.normalMap != null)
            this.normalMap = bnm.normalMap;
    };
    Object.defineProperty(NormalBasicMethod.prototype, "normalMap", {
        /**
         * The texture containing the normals per pixel.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            var b = (value != null);
            if (b != this._useTexture || (value && this._texture && (value.format != this._texture.format)))
                this.iInvalidateShaderProgram();
            this._useTexture = b;
            this._texture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._pNormalTextureRegister = null;
    };
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.dispose = function () {
        if (this._texture)
            this._texture = null;
    };
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        if (methodVO.texturesIndex >= 0)
            stage.activateTexture(methodVO.texturesIndex, this._texture, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
    };
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        this._pNormalTextureRegister = registerCache.getFreeTextureReg();
        methodVO.texturesIndex = this._pNormalTextureRegister.index;
        return ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedRegisters, this._pNormalTextureRegister, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping) + "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx\n" + "nrm " + targetReg + ".xyz, " + targetReg + "\n";
    };
    return NormalBasicMethod;
})(ShadingMethodBase);
module.exports = NormalBasicMethod;


},{"awayjs-methodmaterials/lib/methods/ShadingMethodBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\NormalHeightMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var NormalBasicMethod = require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
/**
 * NormalHeightMapMethod provides a normal map method that uses a height map to calculate the normals.
 */
var NormalHeightMapMethod = (function (_super) {
    __extends(NormalHeightMapMethod, _super);
    /**
     * Creates a new NormalHeightMapMethod method.
     *
     * @param heightMap The texture containing the height data. 0 means low, 1 means high.
     * @param worldWidth The width of the 'world'. This is used to map uv coordinates' u component to scene dimensions.
     * @param worldHeight The height of the 'world'. This is used to map the height map values to scene dimensions.
     * @param worldDepth The depth of the 'world'. This is used to map uv coordinates' v component to scene dimensions.
     */
    function NormalHeightMapMethod(heightMap, worldWidth, worldHeight, worldDepth) {
        _super.call(this);
        this.normalMap = heightMap;
        this._worldXYRatio = worldWidth / worldHeight;
        this._worldXZRatio = worldDepth / worldHeight;
    }
    /**
     * @inheritDoc
     */
    NormalHeightMapMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = 1 / this.normalMap.width;
        data[index + 1] = 1 / this.normalMap.height;
        data[index + 2] = 0;
        data[index + 3] = 1;
        data[index + 4] = this._worldXYRatio;
        data[index + 5] = this._worldXZRatio;
    };
    Object.defineProperty(NormalHeightMapMethod.prototype, "tangentSpace", {
        /**
         * @inheritDoc
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    NormalHeightMapMethod.prototype.copyFrom = function (method) {
        _super.prototype.copyFrom.call(this, method);
        this._worldXYRatio = method._worldXYRatio;
        this._worldXZRatio = method._worldXZRatio;
    };
    /**
     * @inheritDoc
     */
    NormalHeightMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var temp = registerCache.getFreeFragmentVectorTemp();
        var dataReg = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        this._pNormalTextureRegister = registerCache.getFreeTextureReg();
        methodVO.texturesIndex = this._pNormalTextureRegister.index;
        methodVO.fragmentConstantsIndex = dataReg.index * 4;
        return ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedRegisters, this._pNormalTextureRegister, this.normalMap, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, sharedRegisters.uvVarying, "clamp") + "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".xzzz\n" + ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, this._pNormalTextureRegister, this.normalMap, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp, "clamp") + "sub " + targetReg + ".x, " + targetReg + ".x, " + temp + ".x\n" + "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".zyzz\n" + ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, this._pNormalTextureRegister, this.normalMap, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp, "clamp") + "sub " + targetReg + ".z, " + targetReg + ".z, " + temp + ".x\n" + "mov " + targetReg + ".y, " + dataReg + ".w\n" + "mul " + targetReg + ".xz, " + targetReg + ".xz, " + dataReg2 + ".xy\n" + "nrm " + targetReg + ".xyz, " + targetReg + ".xyz\n";
    };
    return NormalHeightMapMethod;
})(NormalBasicMethod);
module.exports = NormalHeightMapMethod;


},{"awayjs-methodmaterials/lib/methods/NormalBasicMethod":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\NormalSimpleWaterMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var NormalBasicMethod = require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
/**
 * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
 */
var NormalSimpleWaterMethod = (function (_super) {
    __extends(NormalSimpleWaterMethod, _super);
    /**
     * Creates a new NormalSimpleWaterMethod object.
     * @param waveMap1 A normal map containing one layer of a wave structure.
     * @param waveMap2 A normal map containing a second layer of a wave structure.
     */
    function NormalSimpleWaterMethod(waveMap1, waveMap2) {
        _super.call(this);
        this._useSecondNormalMap = false;
        this._water1OffsetX = 0;
        this._water1OffsetY = 0;
        this._water2OffsetX = 0;
        this._water2OffsetY = 0;
        this.normalMap = waveMap1;
        this.secondaryNormalMap = waveMap2;
    }
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = .5;
        data[index + 1] = 0;
        data[index + 2] = 0;
        data[index + 3] = 1;
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        _super.prototype.iInitVO.call(this, shaderObject, methodVO);
        this._useSecondNormalMap = this.normalMap != this.secondaryNormalMap;
    };
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water1OffsetX", {
        /**
         * The translation of the first wave layer along the X-axis.
         */
        get: function () {
            return this._water1OffsetX;
        },
        set: function (value) {
            this._water1OffsetX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water1OffsetY", {
        /**
         * The translation of the first wave layer along the Y-axis.
         */
        get: function () {
            return this._water1OffsetY;
        },
        set: function (value) {
            this._water1OffsetY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water2OffsetX", {
        /**
         * The translation of the second wave layer along the X-axis.
         */
        get: function () {
            return this._water2OffsetX;
        },
        set: function (value) {
            this._water2OffsetX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water2OffsetY", {
        /**
         * The translation of the second wave layer along the Y-axis.
         */
        get: function () {
            return this._water2OffsetY;
        },
        set: function (value) {
            this._water2OffsetY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "secondaryNormalMap", {
        /**
         * A second normal map that will be combined with the first to create a wave-like animation pattern.
         */
        get: function () {
            return this._texture2;
        },
        set: function (value) {
            this._texture2 = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._normalTextureRegister2 = null;
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._texture2 = null;
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index + 4] = this._water1OffsetX;
        data[index + 5] = this._water1OffsetY;
        data[index + 6] = this._water2OffsetX;
        data[index + 7] = this._water2OffsetY;
        //if (this._useSecondNormalMap >= 0)
        if (this._useSecondNormalMap)
            stage.activateTexture(methodVO.texturesIndex + 1, this._texture2, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var temp = registerCache.getFreeFragmentVectorTemp();
        var dataReg = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        this._pNormalTextureRegister = registerCache.getFreeTextureReg();
        this._normalTextureRegister2 = this._useSecondNormalMap ? registerCache.getFreeTextureReg() : this._pNormalTextureRegister;
        methodVO.texturesIndex = this._pNormalTextureRegister.index;
        methodVO.fragmentConstantsIndex = dataReg.index * 4;
        return "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".xyxy\n" + ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedRegisters, this._pNormalTextureRegister, this.normalMap, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp) + "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".zwzw\n" + ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, this._normalTextureRegister2, this._texture2, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp) + "add " + targetReg + ", " + targetReg + ", " + temp + "		\n" + "mul " + targetReg + ", " + targetReg + ", " + dataReg + ".x	\n" + "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx	\n" + "nrm " + targetReg + ".xyz, " + targetReg + ".xyz							\n";
    };
    return NormalSimpleWaterMethod;
})(NormalBasicMethod);
module.exports = NormalSimpleWaterMethod;


},{"awayjs-methodmaterials/lib/methods/NormalBasicMethod":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\ShadingMethodBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
var ShadingMethodEvent = require("awayjs-renderergl/lib/events/ShadingMethodEvent");
/**
 * ShadingMethodBase provides an abstract base method for shading methods, used by compiled passes to compile
 * the final shading program.
 */
var ShadingMethodBase = (function (_super) {
    __extends(ShadingMethodBase, _super);
    /**
     * Create a new ShadingMethodBase object.
     */
    function ShadingMethodBase() {
        _super.call(this);
    }
    ShadingMethodBase.prototype.iIsUsed = function (shaderObject) {
        return true;
    };
    /**
     * Initializes the properties for a MethodVO, including register and texture indices.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iInitVO = function (shaderObject, methodVO) {
    };
    /**
     * Initializes unchanging shader constants using the data from a MethodVO.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iInitConstants = function (shaderObject, methodVO) {
    };
    /**
     * Indicates whether or not this method expects normals in tangent space. Override for object-space normals.
     */
    ShadingMethodBase.prototype.iUsesTangentSpace = function () {
        return true;
    };
    /**
     * Cleans up any resources used by the current object.
     */
    ShadingMethodBase.prototype.dispose = function () {
    };
    /**
     * Resets the compilation state of the method.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iReset = function () {
        this.iCleanCompilationData();
    };
    /**
     * Resets the method's state for compilation.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iCleanCompilationData = function () {
    };
    /**
     * Get the vertex shader code for this method.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iGetVertexCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * @inheritDoc
     */
    ShadingMethodBase.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        return null;
    };
    /**
     * Sets the render state for this method.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param stage The Stage object currently used for rendering.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iActivate = function (shaderObject, methodVO, stage) {
    };
    /**
     * Sets the render state for a single renderable.
     *
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param renderable The renderable currently being rendered.
     * @param stage The Stage object currently used for rendering.
     * @param camera The camera from which the scene is currently rendered.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
    };
    /**
     * Clears the render state for this method.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param stage The Stage object currently used for rendering.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iDeactivate = function (shaderObject, methodVO, stage) {
    };
    /**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iInvalidateShaderProgram = function () {
        this.dispatchEvent(new ShadingMethodEvent(ShadingMethodEvent.SHADER_INVALIDATED));
    };
    /**
     * Copies the state from a ShadingMethodBase object into the current object.
     */
    ShadingMethodBase.prototype.copyFrom = function (method) {
    };
    return ShadingMethodBase;
})(NamedAssetBase);
module.exports = ShadingMethodBase;


},{"awayjs-core/lib/library/NamedAssetBase":undefined,"awayjs-renderergl/lib/events/ShadingMethodEvent":undefined}],"awayjs-methodmaterials\\lib\\methods\\ShadowCascadeMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
var DirectionalLight = require("awayjs-display/lib/entities/DirectionalLight");
var ShadingMethodEvent = require("awayjs-renderergl/lib/events/ShadingMethodEvent");
var MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
var ShadowMapMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMapMethodBase");
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
        if (!(this._pCastingLight instanceof DirectionalLight))
            throw new Error("ShadowCascadeMethod is only compatible with DirectionalLight");
        this._cascadeShadowMapper = this._pCastingLight.shadowMapper;
        if (!this._cascadeShadowMapper)
            throw new Error("ShadowCascadeMethod requires a light that has a CascadeShadowMapper instance assigned to shadowMapper.");
        this._cascadeShadowMapper.addEventListener(Event.CHANGE, function (event) { return _this.onCascadeChange(event); });
        this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, function (event) { return _this.onShaderInvalidated(event); });
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
            this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, function (event) { return _this.onShaderInvalidated(event); });
            this._baseMethod = value;
            this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, function (event) { return _this.onShaderInvalidated(event); });
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ShadowCascadeMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        var tempVO = new MethodVO(this._baseMethod);
        this._baseMethod.iInitVO(shaderObject, tempVO);
        methodVO.needsGlobalVertexPos = true;
        methodVO.needsProjection = true;
    };
    /**
     * @inheritDoc
     */
    ShadowCascadeMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var fragmentData = shaderObject.fragmentConstantData;
        var vertexData = shaderObject.vertexConstantData;
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
    ShadowCascadeMethod.prototype.iGetVertexCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        var code = "";
        var dataReg = registerCache.getFreeVertexConstant();
        this.initProjectionsRegs(registerCache);
        methodVO.vertexConstantsIndex = dataReg.index * 4;
        var temp = registerCache.getFreeVertexVectorTemp();
        for (var i = 0; i < this._cascadeShadowMapper.numCascades; ++i) {
            code += "m44 " + temp + ", " + sharedRegisters.globalPositionVertex + ", " + this._cascadeProjections[i] + "\n" + "add " + this._depthMapCoordVaryings[i] + ", " + temp + ", " + dataReg + ".zzwz\n";
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
    ShadowCascadeMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var numCascades = this._cascadeShadowMapper.numCascades;
        var depthMapRegister = registerCache.getFreeTextureReg();
        var decReg = registerCache.getFreeFragmentConstant();
        var dataReg = registerCache.getFreeFragmentConstant();
        var planeDistanceReg = registerCache.getFreeFragmentConstant();
        var planeDistances = Array(planeDistanceReg + ".x", planeDistanceReg + ".y", planeDistanceReg + ".z", planeDistanceReg + ".w");
        var code;
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        methodVO.texturesIndex = depthMapRegister.index;
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
            code += "sub " + temp + ", " + uvProjection + ", " + uvCoord + "\n" + "mul " + temp + ", " + temp + ", " + inQuad + ".z\n" + "add " + uvCoord + ", " + uvCoord + ", " + temp + "\n";
        }
        registerCache.removeFragmentTempUsage(inQuad);
        code += "div " + uvCoord + ", " + uvCoord + ", " + uvCoord + ".w\n" + "mul " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zw\n" + "add " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zz\n";
        code += this._baseMethod._iGetCascadeFragmentCode(shaderObject, methodVO, decReg, depthMapRegister, uvCoord, targetReg, registerCache, sharedRegisters) + "add " + targetReg + ".w, " + targetReg + ".w, " + dataReg + ".y\n";
        registerCache.removeFragmentTempUsage(uvCoord);
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowCascadeMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        stage.activateTexture(methodVO.texturesIndex, this._pCastingLight.shadowMapper.depthMap, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
        var vertexData = shaderObject.vertexConstantData;
        var vertexIndex = methodVO.vertexConstantsIndex;
        shaderObject.vertexConstantData[methodVO.vertexConstantsIndex + 3] = -1 / (this._cascadeShadowMapper.depth * this._pEpsilon);
        var numCascades = this._cascadeShadowMapper.numCascades;
        vertexIndex += 4;
        for (var k = 0; k < numCascades; ++k) {
            this._cascadeShadowMapper.getDepthProjections(k).copyRawDataTo(vertexData, vertexIndex, true);
            vertexIndex += 16;
        }
        var fragmentData = shaderObject.fragmentConstantData;
        var fragmentIndex = methodVO.fragmentConstantsIndex;
        fragmentData[fragmentIndex + 5] = 1 - this._pAlpha;
        var nearPlaneDistances = this._cascadeShadowMapper._iNearPlaneDistances;
        fragmentIndex += 8;
        for (var i = 0; i < numCascades; ++i)
            fragmentData[fragmentIndex + i] = nearPlaneDistances[i];
        this._baseMethod.iActivateForCascade(shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    ShadowCascadeMethod.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
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
})(ShadowMapMethodBase);
module.exports = ShadowCascadeMethod;


},{"awayjs-core/lib/events/Event":undefined,"awayjs-display/lib/entities/DirectionalLight":undefined,"awayjs-methodmaterials/lib/data/MethodVO":undefined,"awayjs-methodmaterials/lib/methods/ShadowMapMethodBase":undefined,"awayjs-renderergl/lib/events/ShadingMethodEvent":undefined}],"awayjs-methodmaterials\\lib\\methods\\ShadowDitheredMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BitmapData = require("awayjs-core/lib/base/BitmapData");
var BitmapTexture = require("awayjs-core/lib/textures/BitmapTexture");
var ShadowMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");
/**
 * ShadowDitheredMethod provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
 */
var ShadowDitheredMethod = (function (_super) {
    __extends(ShadowDitheredMethod, _super);
    /**
     * Creates a new ShadowDitheredMethod object.
     * @param castingLight The light casting the shadows
     * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 24.
     */
    function ShadowDitheredMethod(castingLight, numSamples, range) {
        if (numSamples === void 0) { numSamples = 4; }
        if (range === void 0) { range = 1; }
        _super.call(this, castingLight);
        this._depthMapSize = this._pCastingLight.shadowMapper.depthMapSize;
        this.numSamples = numSamples;
        this.range = range;
        ++ShadowDitheredMethod._grainUsages;
        if (!ShadowDitheredMethod._grainTexture)
            this.initGrainTexture();
    }
    Object.defineProperty(ShadowDitheredMethod.prototype, "numSamples", {
        /**
         * The amount of samples to take for dithering. Minimum 1, maximum 24. The actual maximum may depend on the
         * complexity of the shader.
         */
        get: function () {
            return this._numSamples;
        },
        set: function (value /*int*/) {
            this._numSamples = value;
            if (this._numSamples < 1)
                this._numSamples = 1;
            else if (this._numSamples > 24)
                this._numSamples = 24;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        _super.prototype.iInitVO.call(this, shaderObject, methodVO);
        methodVO.needsProjection = true;
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        _super.prototype.iInitConstants.call(this, shaderObject, methodVO);
        var fragmentData = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        fragmentData[index + 8] = 1 / this._numSamples;
    };
    Object.defineProperty(ShadowDitheredMethod.prototype, "range", {
        /**
         * The range in the shadow map in which to distribute the samples.
         */
        get: function () {
            return this._range * 2;
        },
        set: function (value) {
            this._range = value / 2;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a texture containing the dithering noise texture.
     */
    ShadowDitheredMethod.prototype.initGrainTexture = function () {
        ShadowDitheredMethod._grainBitmapData = new BitmapData(64, 64, false);
        var vec = new Array();
        var len = 4096;
        var step = 1 / (this._depthMapSize * this._range);
        var r, g;
        for (var i = 0; i < len; ++i) {
            r = 2 * (Math.random() - .5);
            g = 2 * (Math.random() - .5);
            if (r < 0)
                r -= step;
            else
                r += step;
            if (g < 0)
                g -= step;
            else
                g += step;
            if (r > 1)
                r = 1;
            else if (r < -1)
                r = -1;
            if (g > 1)
                g = 1;
            else if (g < -1)
                g = -1;
            vec[i] = (Math.floor((r * .5 + .5) * 0xff) << 16) | (Math.floor((g * .5 + .5) * 0xff) << 8);
        }
        ShadowDitheredMethod._grainBitmapData.setArray(ShadowDitheredMethod._grainBitmapData.rect, vec);
        ShadowDitheredMethod._grainTexture = new BitmapTexture(ShadowDitheredMethod._grainBitmapData);
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.dispose = function () {
        if (--ShadowDitheredMethod._grainUsages == 0) {
            ShadowDitheredMethod._grainTexture.dispose();
            ShadowDitheredMethod._grainBitmapData.dispose();
            ShadowDitheredMethod._grainTexture = null;
        }
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index + 9] = (stage.width - 1) / 63;
        data[index + 10] = (stage.height - 1) / 63;
        data[index + 11] = 2 * this._range / this._depthMapSize;
        stage.activateTexture(methodVO.texturesIndex + 1, ShadowDitheredMethod._grainTexture, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype._pGetPlanarFragmentCode = function (methodVO, targetReg, regCache, sharedRegisters) {
        var depthMapRegister = regCache.getFreeTextureReg();
        var decReg = regCache.getFreeFragmentConstant();
        var dataReg = regCache.getFreeFragmentConstant();
        var customDataReg = regCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        methodVO.texturesIndex = depthMapRegister.index;
        return this.getSampleCode(customDataReg, depthMapRegister, decReg, targetReg, regCache, sharedRegisters);
    };
    /**
     * Get the actual shader code for shadow mapping
     * @param regCache The register cache managing the registers.
     * @param depthMapRegister The texture register containing the depth map.
     * @param decReg The register containing the depth map decoding data.
     * @param targetReg The target register to add the shadow coverage.
     */
    ShadowDitheredMethod.prototype.getSampleCode = function (customDataReg, depthMapRegister, decReg, targetReg, regCache, sharedRegisters) {
        var code = "";
        var grainRegister = regCache.getFreeTextureReg();
        var uvReg = regCache.getFreeFragmentVectorTemp();
        var numSamples = this._numSamples;
        regCache.addFragmentTempUsages(uvReg, 1);
        var temp = regCache.getFreeFragmentVectorTemp();
        var projectionReg = sharedRegisters.projectionFragment;
        code += "div " + uvReg + ", " + projectionReg + ", " + projectionReg + ".w\n" + "mul " + uvReg + ".xy, " + uvReg + ".xy, " + customDataReg + ".yz\n";
        while (numSamples > 0) {
            if (numSamples == this._numSamples)
                code += "tex " + uvReg + ", " + uvReg + ", " + grainRegister + " <2d,nearest,repeat,mipnone>\n";
            else
                code += "tex " + uvReg + ", " + uvReg + ".zwxy, " + grainRegister + " <2d,nearest,repeat,mipnone>\n";
            // keep grain in uvReg.zw
            code += "sub " + uvReg + ".zw, " + uvReg + ".xy, fc0.xx\n" + "mul " + uvReg + ".zw, " + uvReg + ".zw, " + customDataReg + ".w\n"; // (tex unpack scale and tex scale in one)
            if (numSamples == this._numSamples) {
                // first sample
                code += "add " + uvReg + ".xy, " + uvReg + ".zw, " + this._pDepthMapCoordReg + ".xy\n" + "tex " + temp + ", " + uvReg + ", " + depthMapRegister + " <2d,nearest,clamp,mipnone>\n" + "dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" + "slt " + targetReg + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow
            }
            else {
                code += this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
            }
            if (numSamples > 4)
                code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
            if (numSamples > 1)
                code += "sub " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + uvReg + ".zw\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
            if (numSamples > 5)
                code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
            if (numSamples > 2) {
                code += "neg " + uvReg + ".w, " + uvReg + ".w\n"; // will be rotated 90 degrees when being accessed as wz
                code += "add " + uvReg + ".xy, " + uvReg + ".wz, " + this._pDepthMapCoordReg + ".xy\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
            }
            if (numSamples > 6)
                code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
            if (numSamples > 3)
                code += "sub " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + uvReg + ".wz\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
            if (numSamples > 7)
                code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
            numSamples -= 8;
        }
        regCache.removeFragmentTempUsage(uvReg);
        code += "mul " + targetReg + ".w, " + targetReg + ".w, " + customDataReg + ".x\n"; // average
        return code;
    };
    /**
     * Adds the code for another tap to the shader code.
     * @param uvReg The uv register for the tap.
     * @param depthMapRegister The texture register containing the depth map.
     * @param decReg The register containing the depth map decoding data.
     * @param targetReg The target register to add the tap comparison result.
     * @param regCache The register cache managing the registers.
     * @return
     */
    ShadowDitheredMethod.prototype.addSample = function (uvReg, depthMapRegister, decReg, targetReg, regCache) {
        var temp = regCache.getFreeFragmentVectorTemp();
        return "tex " + temp + ", " + uvReg + ", " + depthMapRegister + " <2d,nearest,clamp,mipnone>\n" + "dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" + "slt " + temp + ".z, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + temp + ".z\n";
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iActivateForCascade = function (shaderObject, methodVO, stage) {
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        data[index] = 1 / this._numSamples;
        data[index + 1] = (stage.width - 1) / 63;
        data[index + 2] = (stage.height - 1) / 63;
        data[index + 3] = 2 * this._range / this._depthMapSize;
        stage.activateTexture(methodVO.texturesIndex + 1, ShadowDitheredMethod._grainTexture, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype._iGetCascadeFragmentCode = function (shaderObject, methodVO, decodeRegister, depthTexture, depthProjection, targetRegister, registerCache, sharedRegisters) {
        this._pDepthMapCoordReg = depthProjection;
        var dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
        return this.getSampleCode(dataReg, depthTexture, decodeRegister, targetRegister, registerCache, sharedRegisters);
    };
    return ShadowDitheredMethod;
})(ShadowMethodBase);
module.exports = ShadowDitheredMethod;


},{"awayjs-core/lib/base/BitmapData":undefined,"awayjs-core/lib/textures/BitmapTexture":undefined,"awayjs-methodmaterials/lib/methods/ShadowMethodBase":undefined}],"awayjs-methodmaterials\\lib\\methods\\ShadowFilteredMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShadowMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");
/**
 * ShadowFilteredMethod provides a softened shadowing technique by bilinearly interpolating shadow comparison
 * results of neighbouring pixels.
 */
var ShadowFilteredMethod = (function (_super) {
    __extends(ShadowFilteredMethod, _super);
    /**
     * Creates a new DiffuseBasicMethod object.
     *
     * @param castingLight The light casting the shadow
     */
    function ShadowFilteredMethod(castingLight) {
        _super.call(this, castingLight);
    }
    /**
     * @inheritDoc
     */
    ShadowFilteredMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        _super.prototype.iInitConstants.call(this, shaderObject, methodVO);
        var fragmentData = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        fragmentData[index + 8] = .5;
        var size = this.castingLight.shadowMapper.depthMapSize;
        fragmentData[index + 9] = size;
        fragmentData[index + 10] = 1 / size;
    };
    /**
     * @inheritDoc
     */
    ShadowFilteredMethod.prototype._pGetPlanarFragmentCode = function (methodVO, targetReg, regCache, sharedRegisters) {
        var depthMapRegister = regCache.getFreeTextureReg();
        var decReg = regCache.getFreeFragmentConstant();
        var dataReg = regCache.getFreeFragmentConstant();
        // TODO: not used
        dataReg = dataReg;
        var customDataReg = regCache.getFreeFragmentConstant();
        var depthCol = regCache.getFreeFragmentVectorTemp();
        var uvReg;
        var code = "";
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        regCache.addFragmentTempUsages(depthCol, 1);
        uvReg = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(uvReg, 1);
        code += "mov " + uvReg + ", " + this._pDepthMapCoordReg + "\n" + "tex " + depthCol + ", " + this._pDepthMapCoordReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" + "add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" + "tex " + depthCol + ", " + uvReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" + "mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + targetReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" + "mov " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x\n" + "add " + uvReg + ".y, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".z\n" + "tex " + depthCol + ", " + uvReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" + "add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" + "tex " + depthCol + ", " + uvReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" + "mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + uvReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" + "mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + targetReg + ".w\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + uvReg + ".w\n";
        regCache.removeFragmentTempUsage(depthCol);
        regCache.removeFragmentTempUsage(uvReg);
        methodVO.texturesIndex = depthMapRegister.index;
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowFilteredMethod.prototype.iActivateForCascade = function (shaderObject, methodVO, stage) {
        var size = this.castingLight.shadowMapper.depthMapSize;
        var index = methodVO.secondaryFragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = size;
        data[index + 1] = 1 / size;
    };
    /**
     * @inheritDoc
     */
    ShadowFilteredMethod.prototype._iGetCascadeFragmentCode = function (shaderObject, methodVO, decodeRegister, depthTexture, depthProjection, targetRegister, registerCache, sharedRegisters) {
        var code;
        var dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
        var temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var predicate = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(predicate, 1);
        code = "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".x, " + depthProjection + ".z, " + temp + ".z\n" + "add " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" + "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".z, " + depthProjection + ".z, " + temp + ".z\n" + "add " + depthProjection + ".y, " + depthProjection + ".y, " + dataReg + ".y\n" + "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".w, " + depthProjection + ".z, " + temp + ".z\n" + "sub " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" + "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".y, " + depthProjection + ".z, " + temp + ".z\n" + "mul " + temp + ".xy, " + depthProjection + ".xy, " + dataReg + ".x\n" + "frc " + temp + ".xy, " + temp + ".xy\n" + "sub " + depthProjection + ", " + predicate + ".xyzw, " + predicate + ".zwxy\n" + "mul " + depthProjection + ", " + depthProjection + ", " + temp + ".x\n" + "add " + predicate + ".xy, " + predicate + ".xy, " + depthProjection + ".zw\n" + "sub " + predicate + ".y, " + predicate + ".y, " + predicate + ".x\n" + "mul " + predicate + ".y, " + predicate + ".y, " + temp + ".y\n" + "add " + targetRegister + ".w, " + predicate + ".x, " + predicate + ".y\n";
        registerCache.removeFragmentTempUsage(temp);
        registerCache.removeFragmentTempUsage(predicate);
        return code;
    };
    return ShadowFilteredMethod;
})(ShadowMethodBase);
module.exports = ShadowFilteredMethod;


},{"awayjs-methodmaterials/lib/methods/ShadowMethodBase":undefined}],"awayjs-methodmaterials\\lib\\methods\\ShadowHardMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShadowMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");
/**
 * ShadowHardMethod provides the cheapest shadow map method by using a single tap without any filtering.
 */
var ShadowHardMethod = (function (_super) {
    __extends(ShadowHardMethod, _super);
    /**
     * Creates a new ShadowHardMethod object.
     */
    function ShadowHardMethod(castingLight) {
        _super.call(this, castingLight);
    }
    /**
     * @inheritDoc
     */
    ShadowHardMethod.prototype._pGetPlanarFragmentCode = function (methodVO, targetReg, regCache, sharedRegisters) {
        var depthMapRegister = regCache.getFreeTextureReg();
        var decReg = regCache.getFreeFragmentConstant();
        // needs to be reserved anyway. DO NOT REMOVE
        var dataReg = regCache.getFreeFragmentConstant();
        var depthCol = regCache.getFreeFragmentVectorTemp();
        var code = "";
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        methodVO.texturesIndex = depthMapRegister.index;
        code += "tex " + depthCol + ", " + this._pDepthMapCoordReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + targetReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n"; // 0 if in shadow
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowHardMethod.prototype._pGetPointFragmentCode = function (methodVO, targetReg, regCache, sharedRegisters) {
        var depthMapRegister = regCache.getFreeTextureReg();
        var decReg = regCache.getFreeFragmentConstant();
        var epsReg = regCache.getFreeFragmentConstant();
        var posReg = regCache.getFreeFragmentConstant();
        var depthSampleCol = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(depthSampleCol, 1);
        var lightDir = regCache.getFreeFragmentVectorTemp();
        var code = "";
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        methodVO.texturesIndex = depthMapRegister.index;
        code += "sub " + lightDir + ", " + sharedRegisters.globalPositionVarying + ", " + posReg + "\n" + "dp3 " + lightDir + ".w, " + lightDir + ".xyz, " + lightDir + ".xyz\n" + "mul " + lightDir + ".w, " + lightDir + ".w, " + posReg + ".w\n" + "nrm " + lightDir + ".xyz, " + lightDir + ".xyz\n" + "tex " + depthSampleCol + ", " + lightDir + ", " + depthMapRegister + " <cube, nearest, clamp>\n" + "dp4 " + depthSampleCol + ".z, " + depthSampleCol + ", " + decReg + "\n" + "add " + targetReg + ".w, " + lightDir + ".w, " + epsReg + ".x\n" + "slt " + targetReg + ".w, " + targetReg + ".w, " + depthSampleCol + ".z\n"; // 0 if in shadow
        regCache.removeFragmentTempUsage(depthSampleCol);
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowHardMethod.prototype._iGetCascadeFragmentCode = function (shaderObject, methodVO, decodeRegister, depthTexture, depthProjection, targetRegister, registerCache, sharedRegisters) {
        var temp = registerCache.getFreeFragmentVectorTemp();
        return "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + targetRegister + ".w, " + depthProjection + ".z, " + temp + ".z\n"; // 0 if in shadow
    };
    /**
     * @inheritDoc
     */
    ShadowHardMethod.prototype.iActivateForCascade = function (shaderObject, methodVO, stage) {
    };
    return ShadowHardMethod;
})(ShadowMethodBase);
module.exports = ShadowHardMethod;


},{"awayjs-methodmaterials/lib/methods/ShadowMethodBase":undefined}],"awayjs-methodmaterials\\lib\\methods\\ShadowMapMethodBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/library/AssetType");
var ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
/**
 * ShadowMapMethodBase provides an abstract base method for shadow map methods.
 */
var ShadowMapMethodBase = (function (_super) {
    __extends(ShadowMapMethodBase, _super);
    /**
     * Creates a new ShadowMapMethodBase object.
     * @param castingLight The light used to cast shadows.
     */
    function ShadowMapMethodBase(castingLight) {
        _super.call(this);
        this._pEpsilon = .02;
        this._pAlpha = 1;
        this._pCastingLight = castingLight;
        castingLight.castsShadows = true;
        this._pShadowMapper = castingLight.shadowMapper;
    }
    Object.defineProperty(ShadowMapMethodBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return AssetType.SHADOW_MAP_METHOD;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowMapMethodBase.prototype, "alpha", {
        /**
         * The "transparency" of the shadows. This allows making shadows less strong.
         */
        get: function () {
            return this._pAlpha;
        },
        set: function (value) {
            this._pAlpha = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowMapMethodBase.prototype, "castingLight", {
        /**
         * The light casting the shadows.
         */
        get: function () {
            return this._pCastingLight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowMapMethodBase.prototype, "epsilon", {
        /**
         * A small value to counter floating point precision errors when comparing values in the shadow map with the
         * calculated depth value. Increase this if shadow banding occurs, decrease it if the shadow seems to be too detached.
         */
        get: function () {
            return this._pEpsilon;
        },
        set: function (value) {
            this._pEpsilon = value;
        },
        enumerable: true,
        configurable: true
    });
    return ShadowMapMethodBase;
})(ShadingMethodBase);
module.exports = ShadowMapMethodBase;


},{"awayjs-core/lib/library/AssetType":undefined,"awayjs-methodmaterials/lib/methods/ShadingMethodBase":undefined}],"awayjs-methodmaterials\\lib\\methods\\ShadowMethodBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var PointLight = require("awayjs-display/lib/entities/PointLight");
var ShadowMapMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMapMethodBase");
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
        this._pUsePoint = (castingLight instanceof PointLight);
        _super.call(this, castingLight);
    }
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsView = true;
        methodVO.needsGlobalVertexPos = true;
        methodVO.needsGlobalFragmentPos = this._pUsePoint;
        methodVO.needsNormals = shaderObject.numLights > 0;
    };
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iInitConstants = function (shaderObject, methodVO) {
        var fragmentData = shaderObject.fragmentConstantData;
        var vertexData = shaderObject.vertexConstantData;
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
    ShadowMethodBase.prototype.iGetVertexCode = function (shaderObject, methodVO, regCache, sharedRegisters) {
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
        code += "m44 " + temp + ", " + sharedRegisters.globalPositionVertex + ", " + depthMapProj + "\n" + "div " + temp + ", " + temp + ", " + temp + ".w\n" + "mul " + temp + ".xy, " + temp + ".xy, " + dataReg + ".xy\n" + "add " + this._pDepthMapCoordReg + ", " + temp + ", " + dataReg + ".xxwz\n";
        //"sub " + this._pDepthMapCoordReg + ".z, " + this._pDepthMapCoordReg + ".z, " + this._pDepthMapCoordReg + ".w\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = this._pUsePoint ? this._pGetPointFragmentCode(methodVO, targetReg, registerCache, sharedRegisters) : this._pGetPlanarFragmentCode(methodVO, targetReg, registerCache, sharedRegisters);
        code += "add " + targetReg + ".w, " + targetReg + ".w, fc" + (methodVO.fragmentConstantsIndex / 4 + 1) + ".y\n" + "sat " + targetReg + ".w, " + targetReg + ".w\n";
        return code;
    };
    /**
     * Gets the fragment code for shadow mapping with a planar shadow map.
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     * @param targetReg The register to contain the shadow coverage
     * @return
     */
    ShadowMethodBase.prototype._pGetPlanarFragmentCode = function (methodVO, targetReg, regCache, sharedRegisters) {
        throw new AbstractMethodError();
        return "";
    };
    /**
     * Gets the fragment code for shadow mapping with a point light.
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     * @param targetReg The register to contain the shadow coverage
     * @return
     */
    ShadowMethodBase.prototype._pGetPointFragmentCode = function (methodVO, targetReg, regCache, sharedRegisters) {
        throw new AbstractMethodError();
        return "";
    };
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
        if (!this._pUsePoint)
            this._pShadowMapper.iDepthProjection.copyRawDataTo(shaderObject.vertexConstantData, methodVO.vertexConstantsIndex + 4, true);
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
    ShadowMethodBase.prototype._iGetCascadeFragmentCode = function (shaderObject, methodVO, decodeRegister, depthTexture, depthProjection, targetRegister, registerCache, sharedRegisters) {
        throw new Error("This shadow method is incompatible with cascade shadows");
    };
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iActivate = function (shaderObject, methodVO, stage) {
        var fragmentData = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        if (this._pUsePoint)
            fragmentData[index + 4] = -Math.pow(1 / (this._pCastingLight.fallOff * this._pEpsilon), 2);
        else
            shaderObject.vertexConstantData[methodVO.vertexConstantsIndex + 3] = -1 / (this._pShadowMapper.depth * this._pEpsilon);
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
        if (!this._pUsePoint)
            stage.activateRenderTexture(methodVO.texturesIndex, this._pCastingLight.shadowMapper.depthMap);
        //else
        //	stage.activateCubeRenderTexture(methodVO.texturesIndex, <CubeTextureBase> this._pCastingLight.shadowMapper.depthMap);
    };
    /**
     * Sets the method state for cascade shadow mapping.
     */
    ShadowMethodBase.prototype.iActivateForCascade = function (shaderObject, methodVO, stage) {
        throw new Error("This shadow method is incompatible with cascade shadows");
    };
    return ShadowMethodBase;
})(ShadowMapMethodBase);
module.exports = ShadowMethodBase;


},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-display/lib/entities/PointLight":undefined,"awayjs-methodmaterials/lib/methods/ShadowMapMethodBase":undefined}],"awayjs-methodmaterials\\lib\\methods\\ShadowNearMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShadingMethodEvent = require("awayjs-renderergl/lib/events/ShadingMethodEvent");
var ShadowMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");
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
        this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
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
            this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            this._baseMethod = value;
            this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        _super.prototype.iInitConstants.call(this, shaderObject, methodVO);
        this._baseMethod.iInitConstants(shaderObject, methodVO);
        var fragmentData = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        fragmentData[index + 2] = 0;
        fragmentData[index + 3] = 1;
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        this._baseMethod.iInitVO(shaderObject, methodVO);
        methodVO.needsProjection = true;
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.dispose = function () {
        this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
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
    ShadowNearMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = this._baseMethod.iGetFragmentCode(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
        var dataReg = registerCache.getFreeFragmentConstant();
        var temp = registerCache.getFreeFragmentSingleTemp();
        methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
        code += "abs " + temp + ", " + sharedRegisters.projectionFragment + ".w\n" + "sub " + temp + ", " + temp + ", " + dataReg + ".x\n" + "mul " + temp + ", " + temp + ", " + dataReg + ".y\n" + "sat " + temp + ", " + temp + "\n" + "sub " + temp + ", " + dataReg + ".w," + temp + "\n" + "sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + temp + "\n" + "sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        this._baseMethod.iActivate(shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iDeactivate = function (shaderObject, methodVO, stage) {
        this._baseMethod.iDeactivate(shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
        // todo: move this to activate (needs camera)
        var near = camera.projection.near;
        var d = camera.projection.far - near;
        var maxDistance = this._nearShadowMapper.coverageRatio;
        var minDistance = maxDistance * (1 - this._fadeRatio);
        maxDistance = near + maxDistance * d;
        minDistance = near + minDistance * d;
        var fragmentData = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        fragmentData[index] = minDistance;
        fragmentData[index + 1] = 1 / (maxDistance - minDistance);
        this._baseMethod.iSetRenderState(shaderObject, methodVO, renderable, stage, camera);
    };
    /**
     * @inheritDoc
     */
    ShadowNearMethod.prototype.iGetVertexCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        return this._baseMethod.iGetVertexCode(shaderObject, methodVO, registerCache, sharedRegisters);
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
})(ShadowMethodBase);
module.exports = ShadowNearMethod;


},{"awayjs-methodmaterials/lib/methods/ShadowMethodBase":undefined,"awayjs-renderergl/lib/events/ShadingMethodEvent":undefined}],"awayjs-methodmaterials\\lib\\methods\\ShadowSoftMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PoissonLookup = require("awayjs-core/lib/geom/PoissonLookup");
var ShadowMethodBase = require("awayjs-methodmaterials/lib/methods/ShadowMethodBase");
/**
 * ShadowSoftMethod provides a soft shadowing technique by randomly distributing sample points.
 */
var ShadowSoftMethod = (function (_super) {
    __extends(ShadowSoftMethod, _super);
    /**
     * Creates a new DiffuseBasicMethod object.
     *
     * @param castingLight The light casting the shadows
     * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 32.
     */
    function ShadowSoftMethod(castingLight, numSamples, range) {
        if (numSamples === void 0) { numSamples = 5; }
        if (range === void 0) { range = 1; }
        _super.call(this, castingLight);
        this._range = 1;
        this.numSamples = numSamples;
        this.range = range;
    }
    Object.defineProperty(ShadowSoftMethod.prototype, "numSamples", {
        /**
         * The amount of samples to take for dithering. Minimum 1, maximum 32. The actual maximum may depend on the
         * complexity of the shader.
         */
        get: function () {
            return this._numSamples;
        },
        set: function (value /*int*/) {
            this._numSamples = value;
            if (this._numSamples < 1)
                this._numSamples = 1;
            else if (this._numSamples > 32)
                this._numSamples = 32;
            this._offsets = PoissonLookup.getDistribution(this._numSamples);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowSoftMethod.prototype, "range", {
        /**
         * The range in the shadow map in which to distribute the samples.
         */
        get: function () {
            return this._range;
        },
        set: function (value) {
            this._range = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        _super.prototype.iInitConstants.call(this, shaderObject, methodVO);
        shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 8] = 1 / this._numSamples;
        shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 9] = 0;
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var texRange = .5 * this._range / this._pCastingLight.shadowMapper.depthMapSize;
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex + 10;
        var len = this._numSamples << 1;
        for (var i = 0; i < len; ++i)
            data[index + i] = this._offsets[i] * texRange;
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype._pGetPlanarFragmentCode = function (methodVO, targetReg, regCache, sharedRegisters) {
        // todo: move some things to super
        var depthMapRegister = regCache.getFreeTextureReg();
        var decReg = regCache.getFreeFragmentConstant();
        var dataReg = regCache.getFreeFragmentConstant();
        var customDataReg = regCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        methodVO.texturesIndex = depthMapRegister.index;
        return this.getSampleCode(regCache, depthMapRegister, decReg, targetReg, customDataReg);
    };
    /**
     * Adds the code for another tap to the shader code.
     * @param uv The uv register for the tap.
     * @param texture The texture register containing the depth map.
     * @param decode The register containing the depth map decoding data.
     * @param target The target register to add the tap comparison result.
     * @param regCache The register cache managing the registers.
     * @return
     */
    ShadowSoftMethod.prototype.addSample = function (uv, texture, decode, target, regCache) {
        var temp = regCache.getFreeFragmentVectorTemp();
        return "tex " + temp + ", " + uv + ", " + texture + " <2d,nearest,clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decode + "\n" + "slt " + uv + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" + "add " + target + ".w, " + target + ".w, " + uv + ".w\n";
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype.iActivateForCascade = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var texRange = this._range / this._pCastingLight.shadowMapper.depthMapSize;
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        var len = this._numSamples << 1;
        data[index] = 1 / this._numSamples;
        data[index + 1] = 0;
        index += 2;
        for (var i = 0; i < len; ++i)
            data[index + i] = this._offsets[i] * texRange;
        if (len % 4 == 0) {
            data[index + len] = 0;
            data[index + len + 1] = 0;
        }
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype._iGetCascadeFragmentCode = function (shaderObject, methodVO, decodeRegister, depthTexture, depthProjection, targetRegister, registerCache, sharedRegisters) {
        this._pDepthMapCoordReg = depthProjection;
        var dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
        return this.getSampleCode(registerCache, depthTexture, decodeRegister, targetRegister, dataReg);
    };
    /**
     * Get the actual shader code for shadow mapping
     * @param regCache The register cache managing the registers.
     * @param depthTexture The texture register containing the depth map.
     * @param decodeRegister The register containing the depth map decoding data.
     * @param targetReg The target register to add the shadow coverage.
     * @param dataReg The register containing additional data.
     */
    ShadowSoftMethod.prototype.getSampleCode = function (regCache, depthTexture, decodeRegister, targetRegister, dataReg) {
        var uvReg;
        var code;
        var offsets = new Array(dataReg + ".zw");
        uvReg = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(uvReg, 1);
        var temp = regCache.getFreeFragmentVectorTemp();
        var numRegs = this._numSamples >> 1;
        for (var i = 0; i < numRegs; ++i) {
            var reg = regCache.getFreeFragmentConstant();
            offsets.push(reg + ".xy");
            offsets.push(reg + ".zw");
        }
        for (i = 0; i < this._numSamples; ++i) {
            if (i == 0) {
                code = "add " + uvReg + ", " + this._pDepthMapCoordReg + ", " + dataReg + ".zwyy\n" + "tex " + temp + ", " + uvReg + ", " + depthTexture + " <2d,nearest,clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + targetRegister + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow;
            }
            else {
                code += "add " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + offsets[i] + "\n" + this.addSample(uvReg, depthTexture, decodeRegister, targetRegister, regCache);
            }
        }
        regCache.removeFragmentTempUsage(uvReg);
        code += "mul " + targetRegister + ".w, " + targetRegister + ".w, " + dataReg + ".x\n"; // average
        return code;
    };
    return ShadowSoftMethod;
})(ShadowMethodBase);
module.exports = ShadowSoftMethod;


},{"awayjs-core/lib/geom/PoissonLookup":undefined,"awayjs-methodmaterials/lib/methods/ShadowMethodBase":undefined}],"awayjs-methodmaterials\\lib\\methods\\SpecularAnisotropicMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SpecularBasicMethod = require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
/**
 * SpecularAnisotropicMethod provides a specular method resulting in anisotropic highlights. These are typical for
 * surfaces with microfacet details such as tiny grooves. In particular, this uses the Heidrich-Seidel distrubution.
 * The tangent vectors are used as the surface groove directions.
 */
var SpecularAnisotropicMethod = (function (_super) {
    __extends(SpecularAnisotropicMethod, _super);
    /**
     * Creates a new SpecularAnisotropicMethod object.
     */
    function SpecularAnisotropicMethod() {
        _super.call(this);
    }
    /**
     * @inheritDoc
     */
    SpecularAnisotropicMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsTangents = true;
        methodVO.needsView = true;
    };
    /**
     * @inheritDoc
     */
    SpecularAnisotropicMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        var code = "";
        var t;
        if (this._pIsFirstLight)
            t = this._pTotalLightColorReg;
        else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }
        // (sin(l,t) * sin(v,t) - cos(l,t)*cos(v,t)) ^ k
        code += "nrm " + t + ".xyz, " + sharedRegisters.tangentVarying + ".xyz\n" + "dp3 " + t + ".w, " + t + ".xyz, " + lightDirReg + ".xyz\n" + "dp3 " + t + ".z, " + t + ".xyz, " + sharedRegisters.viewDirFragment + ".xyz\n";
        // (sin(t.w) * sin(t.z) - cos(t.w)*cos(t.z)) ^ k
        code += "sin " + t + ".x, " + t + ".w\n" + "sin " + t + ".y, " + t + ".z\n" + "mul " + t + ".x, " + t + ".x, " + t + ".y\n" + "cos " + t + ".z, " + t + ".z\n" + "cos " + t + ".w, " + t + ".w\n" + "mul " + t + ".w, " + t + ".w, " + t + ".z\n" + "sub " + t + ".w, " + t + ".x, " + t + ".w\n";
        if (this._pUseTexture) {
            // apply gloss modulation from texture
            code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" + "pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
        }
        else
            code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";
        // attenuate
        code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);
        code += "mul " + t + ".xyz, " + lightColReg + ".xyz, " + t + ".w\n";
        if (!this._pIsFirstLight) {
            code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
            registerCache.removeFragmentTempUsage(t);
        }
        this._pIsFirstLight = false;
        return code;
    };
    return SpecularAnisotropicMethod;
})(SpecularBasicMethod);
module.exports = SpecularAnisotropicMethod;


},{"awayjs-methodmaterials/lib/methods/SpecularBasicMethod":undefined}],"awayjs-methodmaterials\\lib\\methods\\SpecularBasicMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var LightingMethodBase = require("awayjs-methodmaterials/lib/methods/LightingMethodBase");
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
        this._specular = 1;
        this._specularColor = 0xffffff;
        this._iSpecularR = 1;
        this._iSpecularG = 1;
        this._iSpecularB = 1;
    }
    SpecularBasicMethod.prototype.iIsUsed = function (shaderObject) {
        if (!shaderObject.numLights)
            return false;
        return true;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsUV = this._pUseTexture;
        methodVO.needsNormals = shaderObject.numLights > 0;
        methodVO.needsView = shaderObject.numLights > 0;
    };
    Object.defineProperty(SpecularBasicMethod.prototype, "gloss", {
        /**
         * The sharpness of the specular highlight.
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
    Object.defineProperty(SpecularBasicMethod.prototype, "specular", {
        /**
         * The overall strength of the specular highlights.
         */
        get: function () {
            return this._specular;
        },
        set: function (value) {
            if (value == this._specular)
                return;
            this._specular = value;
            this.updateSpecular();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularBasicMethod.prototype, "specularColor", {
        /**
         * The colour of the specular reflection of the surface.
         */
        get: function () {
            return this._specularColor;
        },
        set: function (value) {
            if (this._specularColor == value)
                return;
            // specular is now either enabled or disabled
            if (this._specularColor == 0 || value == 0)
                this.iInvalidateShaderProgram();
            this._specularColor = value;
            this.updateSpecular();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularBasicMethod.prototype, "texture", {
        /**
         * The bitmapData that encodes the specular highlight strength per texel in the red channel, and the sharpness
         * in the green channel. You can use SpecularBitmapTexture if you want to easily set specular and gloss maps
         * from grayscale images, but prepared images are preferred.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            var b = (value != null);
            if (b != this._pUseTexture || (value && this._texture && (value.format != this._texture.format)))
                this.iInvalidateShaderProgram();
            this._pUseTexture = b;
            this._texture = value;
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
        this.specular = spec.specular;
        this.specularColor = spec.specularColor;
        this.gloss = spec.gloss;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._pTotalLightColorReg = null;
        this._pSpecularTextureRegister = null;
        this._pSpecularTexData = null;
        this._pSpecularDataRegister = null;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        var code = "";
        this._pIsFirstLight = true;
        this._pSpecularDataRegister = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = this._pSpecularDataRegister.index * 4;
        if (this._pUseTexture) {
            this._pSpecularTexData = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(this._pSpecularTexData, 1);
            this._pSpecularTextureRegister = registerCache.getFreeTextureReg();
            methodVO.texturesIndex = this._pSpecularTextureRegister.index;
            code = ShaderCompilerHelper.getTex2DSampleCode(this._pSpecularTexData, sharedRegisters, this._pSpecularTextureRegister, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping);
        }
        else {
            this._pSpecularTextureRegister = null;
        }
        this._pTotalLightColorReg = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(this._pTotalLightColorReg, 1);
        return code;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
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
        code += "add " + t + ", " + lightDirReg + ", " + viewDirReg + "\n" + "nrm " + t + ".xyz, " + t + "\n" + "dp3 " + t + ".w, " + normalReg + ", " + t + "\n" + "sat " + t + ".w, " + t + ".w\n";
        if (this._pUseTexture) {
            // apply gloss modulation from texture
            code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" + "pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
        }
        else {
            code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";
        }
        // attenuate
        if (shaderObject.usesLightFallOff)
            code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);
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
    SpecularBasicMethod.prototype.iGetFragmentCodePerProbe = function (shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
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
        code += "dp3 " + t + ".w, " + normalReg + ", " + viewDirReg + "\n" + "add " + t + ".w, " + t + ".w, " + t + ".w\n" + "mul " + t + ", " + t + ".w, " + normalReg + "\n" + "sub " + t + ", " + t + ", " + viewDirReg + "\n" + "tex " + t + ", " + t + ", " + cubeMapReg + " <cube," + (shaderObject.useSmoothTextures ? "linear" : "nearest") + ",miplinear>\n" + "mul " + t + ".xyz, " + t + ", " + weightRegister + "\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);
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
    SpecularBasicMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        if (sharedRegisters.shadowTarget)
            code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";
        if (this._pUseTexture) {
            // apply strength modulation from texture
            code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + this._pSpecularTexData + ".x\n";
            registerCache.removeFragmentTempUsage(this._pSpecularTexData);
        }
        // apply material's specular reflection
        code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + this._pSpecularDataRegister + "\n" + "add " + targetReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n";
        registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
        return code;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        if (methodVO.texturesIndex >= 0)
            stage.activateTexture(methodVO.texturesIndex, this._texture, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
        var index = methodVO.fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = this._iSpecularR;
        data[index + 1] = this._iSpecularG;
        data[index + 2] = this._iSpecularB;
        data[index + 3] = this._gloss;
    };
    /**
     * Updates the specular color data used by the render state.
     */
    SpecularBasicMethod.prototype.updateSpecular = function () {
        this._iSpecularR = ((this._specularColor >> 16) & 0xff) / 0xff * this._specular;
        this._iSpecularG = ((this._specularColor >> 8) & 0xff) / 0xff * this._specular;
        this._iSpecularB = (this._specularColor & 0xff) / 0xff * this._specular;
    };
    return SpecularBasicMethod;
})(LightingMethodBase);
module.exports = SpecularBasicMethod;


},{"awayjs-methodmaterials/lib/methods/LightingMethodBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined}],"awayjs-methodmaterials\\lib\\methods\\SpecularCelMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SpecularCompositeMethod = require("awayjs-methodmaterials/lib/methods/SpecularCompositeMethod");
/**
 * SpecularCelMethod provides a shading method to add specular cel (cartoon) shading.
 */
var SpecularCelMethod = (function (_super) {
    __extends(SpecularCelMethod, _super);
    /**
     * Creates a new SpecularCelMethod object.
     * @param specularCutOff The threshold at which the specular highlight should be shown.
     * @param baseMethod An optional specular method on which the cartoon shading is based. If ommitted, SpecularBasicMethod is used.
     */
    function SpecularCelMethod(specularCutOff, baseMethod) {
        var _this = this;
        if (specularCutOff === void 0) { specularCutOff = .5; }
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this, null, baseMethod);
        this._smoothness = .1;
        this._specularCutOff = .1;
        this.baseMethod._iModulateMethod = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) { return _this.clampSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters); };
        this._specularCutOff = specularCutOff;
    }
    Object.defineProperty(SpecularCelMethod.prototype, "smoothness", {
        /**
         * The smoothness of the highlight edge.
         */
        get: function () {
            return this._smoothness;
        },
        set: function (value) {
            this._smoothness = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularCelMethod.prototype, "specularCutOff", {
        /**
         * The threshold at which the specular highlight should be shown.
         */
        get: function () {
            return this._specularCutOff;
        },
        set: function (value) {
            this._specularCutOff = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SpecularCelMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var index = methodVO.secondaryFragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = this._smoothness;
        data[index + 1] = this._specularCutOff;
    };
    /**
     * @inheritDoc
     */
    SpecularCelMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._dataReg = null;
    };
    /**
     * Snaps the specular shading strength of the wrapped method to zero or one, depending on whether or not it exceeds the specularCutOff
     * @param vo The MethodVO used to compile the current shader.
     * @param t The register containing the specular strength in the "w" component, and either the half-vector or the reflection vector in "xyz".
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared register data for this shader.
     * @return The AGAL fragment code for the method.
     */
    SpecularCelMethod.prototype.clampSpecular = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        return "sub " + targetReg + ".y, " + targetReg + ".w, " + this._dataReg + ".y\n" + "div " + targetReg + ".y, " + targetReg + ".y, " + this._dataReg + ".x\n" + "sat " + targetReg + ".y, " + targetReg + ".y\n" + "sge " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".y\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
    };
    /**
     * @inheritDoc
     */
    SpecularCelMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
    };
    return SpecularCelMethod;
})(SpecularCompositeMethod);
module.exports = SpecularCelMethod;


},{"awayjs-methodmaterials/lib/methods/SpecularCompositeMethod":undefined}],"awayjs-methodmaterials\\lib\\methods\\SpecularCompositeMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShadingMethodEvent = require("awayjs-renderergl/lib/events/ShadingMethodEvent");
var SpecularBasicMethod = require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
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
        this._baseMethod = baseMethod || new SpecularBasicMethod();
        this._baseMethod._iModulateMethod = modulateMethod;
        this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
    }
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        this._baseMethod.iInitVO(shaderObject, methodVO);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        this._baseMethod.iInitConstants(shaderObject, methodVO);
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
            this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            this._baseMethod = value;
            this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
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
    Object.defineProperty(SpecularCompositeMethod.prototype, "specular", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._baseMethod.specular;
        },
        set: function (value) {
            this._baseMethod.specular = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.dispose = function () {
        this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
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
    SpecularCompositeMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        this._baseMethod.iActivate(shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
        this._baseMethod.iSetRenderState(shaderObject, methodVO, renderable, stage, camera);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iDeactivate = function (shaderObject, methodVO, stage) {
        this._baseMethod.iDeactivate(shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iGetVertexCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        return this._baseMethod.iGetVertexCode(shaderObject, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        return this._baseMethod.iGetFragmentPreLightingCode(shaderObject, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        return this._baseMethod.iGetFragmentCodePerLight(shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     * @return
     */
    SpecularCompositeMethod.prototype.iGetFragmentCodePerProbe = function (shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
        return this._baseMethod.iGetFragmentCodePerProbe(shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        return this._baseMethod.iGetFragmentPostLightingCode(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
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
})(SpecularBasicMethod);
module.exports = SpecularCompositeMethod;


},{"awayjs-methodmaterials/lib/methods/SpecularBasicMethod":undefined,"awayjs-renderergl/lib/events/ShadingMethodEvent":undefined}],"awayjs-methodmaterials\\lib\\methods\\SpecularFresnelMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SpecularCompositeMethod = require("awayjs-methodmaterials/lib/methods/SpecularCompositeMethod");
/**
 * SpecularFresnelMethod provides a specular shading method that causes stronger highlights on grazing view angles.
 */
var SpecularFresnelMethod = (function (_super) {
    __extends(SpecularFresnelMethod, _super);
    /**
     * Creates a new SpecularFresnelMethod object.
     * @param basedOnSurface Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
     * @param baseMethod The specular method to which the fresnel equation. Defaults to SpecularBasicMethod.
     */
    function SpecularFresnelMethod(basedOnSurface, baseMethod) {
        var _this = this;
        if (basedOnSurface === void 0) { basedOnSurface = true; }
        if (baseMethod === void 0) { baseMethod = null; }
        // may want to offer diff speculars
        _super.call(this, null, baseMethod);
        this._fresnelPower = 5;
        this._normalReflectance = .028; // default value for skin
        this.baseMethod._iModulateMethod = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) { return _this.modulateSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters); };
        this._incidentLight = !basedOnSurface;
    }
    /**
     * @inheritDoc
     */
    SpecularFresnelMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var index = methodVO.secondaryFragmentConstantsIndex;
        shaderObject.fragmentConstantData[index + 2] = 1;
        shaderObject.fragmentConstantData[index + 3] = 0;
    };
    Object.defineProperty(SpecularFresnelMethod.prototype, "basedOnSurface", {
        /**
         * Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
         */
        get: function () {
            return !this._incidentLight;
        },
        set: function (value) {
            if (this._incidentLight != value)
                return;
            this._incidentLight = !value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularFresnelMethod.prototype, "fresnelPower", {
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
    /**
     * @inheritDoc
     */
    SpecularFresnelMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._dataReg = null;
    };
    Object.defineProperty(SpecularFresnelMethod.prototype, "normalReflectance", {
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
    SpecularFresnelMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var fragmentData = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        fragmentData[index] = this._normalReflectance;
        fragmentData[index + 1] = this._fresnelPower;
    };
    /**
     * @inheritDoc
     */
    SpecularFresnelMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
    };
    /**
     * Applies the fresnel effect to the specular strength.
     *
     * @param vo The MethodVO object containing the method data for the currently compiled material pass.
     * @param target The register containing the specular strength in the "w" component, and the half-vector/reflection vector in "xyz".
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared registers created by the compiler.
     * @return The AGAL fragment code for the method.
     */
    SpecularFresnelMethod.prototype.modulateSpecular = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code;
        code = "dp3 " + targetReg + ".y, " + sharedRegisters.viewDirFragment + ".xyz, " + (this._incidentLight ? targetReg : sharedRegisters.normalFragment) + ".xyz\n" + "sub " + targetReg + ".y, " + this._dataReg + ".z, " + targetReg + ".y\n" + "pow " + targetReg + ".x, " + targetReg + ".y, " + this._dataReg + ".y\n" + "sub " + targetReg + ".y, " + this._dataReg + ".z, " + targetReg + ".y\n" + "mul " + targetReg + ".y, " + this._dataReg + ".x, " + targetReg + ".y\n" + "add " + targetReg + ".y, " + targetReg + ".x, " + targetReg + ".y\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
        return code;
    };
    return SpecularFresnelMethod;
})(SpecularCompositeMethod);
module.exports = SpecularFresnelMethod;


},{"awayjs-methodmaterials/lib/methods/SpecularCompositeMethod":undefined}],"awayjs-methodmaterials\\lib\\methods\\SpecularPhongMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SpecularBasicMethod = require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
/**
 * SpecularPhongMethod provides a specular method that provides Phong highlights.
 */
var SpecularPhongMethod = (function (_super) {
    __extends(SpecularPhongMethod, _super);
    /**
     * Creates a new SpecularPhongMethod object.
     */
    function SpecularPhongMethod() {
        _super.call(this);
    }
    /**
     * @inheritDoc
     */
    SpecularPhongMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
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
        // phong model
        code += "dp3 " + t + ".w, " + lightDirReg + ", " + normalReg + "\n" + "add " + t + ".w, " + t + ".w, " + t + ".w\n" + "mul " + t + ".xyz, " + normalReg + ", " + t + ".w\n" + "sub " + t + ".xyz, " + t + ", " + lightDirReg + "\n" + "add " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".w\n" + "sat " + t + ".w, " + t + ".w\n" + "mul " + t + ".xyz, " + t + ", " + t + ".w\n" + "dp3 " + t + ".w, " + t + ", " + viewDirReg + "\n" + "sat " + t + ".w, " + t + ".w\n";
        if (this._pUseTexture) {
            // apply gloss modulation from texture
            code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" + "pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
        }
        else
            code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";
        // attenuate
        if (shaderObject.usesLightFallOff)
            code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);
        code += "mul " + t + ".xyz, " + lightColReg + ".xyz, " + t + ".w\n";
        if (!this._pIsFirstLight) {
            code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
            registerCache.removeFragmentTempUsage(t);
        }
        this._pIsFirstLight = false;
        return code;
    };
    return SpecularPhongMethod;
})(SpecularBasicMethod);
module.exports = SpecularPhongMethod;


},{"awayjs-methodmaterials/lib/methods/SpecularBasicMethod":undefined}],"awayjs-methodmaterials\\lib\\passes\\MethodPassMode":[function(require,module,exports){
var PassMode = (function () {
    function PassMode() {
    }
    /**
     *
     */
    PassMode.EFFECTS = 0x01;
    /**
     *
     */
    PassMode.LIGHTING = 0x02;
    /**
     *
     */
    PassMode.SUPER_SHADER = 0x03;
    return PassMode;
})();
module.exports = PassMode;


},{}],"awayjs-methodmaterials\\lib\\passes\\MethodPass":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
var LightSources = require("awayjs-display/lib/materials/LightSources");
var ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
var ShadingMethodEvent = require("awayjs-renderergl/lib/events/ShadingMethodEvent");
var ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
var RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
var MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
var EffectColorTransformMethod = require("awayjs-methodmaterials/lib/methods/EffectColorTransformMethod");
var MethodPassMode = require("awayjs-methodmaterials/lib/passes/MethodPassMode");
/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
var MethodPass = (function (_super) {
    __extends(MethodPass, _super);
    /**
     * Creates a new CompiledPass object.
     *
     * @param material The material to which this pass belongs.
     */
    function MethodPass(mode, renderObject, renderObjectOwner, renderableClass, stage) {
        var _this = this;
        _super.call(this, renderObject, renderObjectOwner, renderableClass, stage);
        this._maxLights = 3;
        this._mode = 0x03;
        this._includeCasters = true;
        this._iMethodVOs = new Array();
        this._numEffectDependencies = 0;
        this.numDirectionalLights = 0;
        this.numPointLights = 0;
        this.numLightProbes = 0;
        this.pointLightsOffset = 0;
        this.directionalLightsOffset = 0;
        this.lightProbesOffset = 0;
        this._mode = mode;
        this._material = renderObjectOwner;
        this._onLightsChangeDelegate = function (event) { return _this.onLightsChange(event); };
        this._onMethodInvalidatedDelegate = function (event) { return _this.onMethodInvalidated(event); };
        this.lightPicker = renderObjectOwner.lightPicker;
        if (this._shader == null)
            this._updateShader();
    }
    Object.defineProperty(MethodPass.prototype, "mode", {
        /**
         *
         */
        get: function () {
            return this._mode;
        },
        set: function (value) {
            if (this._mode == value)
                return;
            this._mode = value;
            this._updateLights();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodPass.prototype, "includeCasters", {
        /**
         * Indicates whether or not shadow casting lights need to be included.
         */
        get: function () {
            return this._includeCasters;
        },
        set: function (value) {
            if (this._includeCasters == value)
                return;
            this._includeCasters = value;
            this._updateLights();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodPass.prototype, "lightPicker", {
        /**
         *
         * @returns {LightPickerBase}
         */
        get: function () {
            return this._lightPicker;
        },
        set: function (value) {
            //if (this._lightPicker == value)
            //	return;
            if (this._lightPicker)
                this._lightPicker.removeEventListener(Event.CHANGE, this._onLightsChangeDelegate);
            this._lightPicker = value;
            if (this._lightPicker)
                this._lightPicker.addEventListener(Event.CHANGE, this._onLightsChangeDelegate);
            this._updateLights();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodPass.prototype, "enableLightFallOff", {
        /**
         * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
         * compatibility for constrained mode.
         */
        get: function () {
            return this._material.enableLightFallOff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodPass.prototype, "diffuseLightSources", {
        /**
         * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
         * and/or light probes for diffuse reflections.
         *
         * @see away3d.materials.LightSources
         */
        get: function () {
            return this._material.diffuseLightSources;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodPass.prototype, "specularLightSources", {
        /**
         * Define which light source types to use for specular reflections. This allows choosing between regular lights
         * and/or light probes for specular reflections.
         *
         * @see away3d.materials.LightSources
         */
        get: function () {
            return this._material.specularLightSources;
        },
        enumerable: true,
        configurable: true
    });
    MethodPass.prototype._updateShader = function () {
        if ((this.numDirectionalLights || this.numPointLights || this.numLightProbes) && !(this._shader instanceof ShaderLightingObject)) {
            if (this._shader != null)
                this._shader.dispose();
            this._shader = new ShaderLightingObject(this._renderableClass, this, this._stage);
        }
        else if (!(this._shader instanceof ShaderObjectBase)) {
            if (this._shader != null)
                this._shader.dispose();
            this._shader = new ShaderObjectBase(this._renderableClass, this, this._stage);
        }
    };
    /**
     * Initializes the unchanging constant data for this material.
     */
    MethodPass.prototype._iInitConstantData = function (shaderObject) {
        _super.prototype._iInitConstantData.call(this, shaderObject);
        //Updates method constants if they have changed.
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i)
            this._iMethodVOs[i].method.iInitConstants(shaderObject, this._iMethodVOs[i]);
    };
    Object.defineProperty(MethodPass.prototype, "colorTransform", {
        /**
         * The ColorTransform object to transform the colour of the material with. Defaults to null.
         */
        get: function () {
            return this.colorTransformMethod ? this.colorTransformMethod.colorTransform : null;
        },
        set: function (value) {
            if (value) {
                if (this.colorTransformMethod == null)
                    this.colorTransformMethod = new EffectColorTransformMethod();
                this.colorTransformMethod.colorTransform = value;
            }
            else if (!value) {
                if (this.colorTransformMethod)
                    this.colorTransformMethod = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodPass.prototype, "colorTransformMethod", {
        /**
         * The EffectColorTransformMethod object to transform the colour of the material with. Defaults to null.
         */
        get: function () {
            return this._iColorTransformMethodVO ? this._iColorTransformMethodVO.method : null;
        },
        set: function (value) {
            if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.method == value)
                return;
            if (this._iColorTransformMethodVO) {
                this._removeDependency(this._iColorTransformMethodVO);
                this._iColorTransformMethodVO = null;
            }
            if (value) {
                this._iColorTransformMethodVO = new MethodVO(value);
                this._addDependency(this._iColorTransformMethodVO);
            }
        },
        enumerable: true,
        configurable: true
    });
    MethodPass.prototype._removeDependency = function (methodVO, effectsDependency) {
        if (effectsDependency === void 0) { effectsDependency = false; }
        var index = this._iMethodVOs.indexOf(methodVO);
        if (!effectsDependency)
            this._numEffectDependencies--;
        methodVO.method.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onMethodInvalidatedDelegate);
        this._iMethodVOs.splice(index, 1);
        this.invalidatePass();
    };
    MethodPass.prototype._addDependency = function (methodVO, effectsDependency, index) {
        if (effectsDependency === void 0) { effectsDependency = false; }
        if (index === void 0) { index = -1; }
        methodVO.method.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onMethodInvalidatedDelegate);
        if (effectsDependency) {
            if (index != -1)
                this._iMethodVOs.splice(index + this._iMethodVOs.length - this._numEffectDependencies, 0, methodVO);
            else
                this._iMethodVOs.push(methodVO);
            this._numEffectDependencies++;
        }
        else {
            this._iMethodVOs.splice(this._iMethodVOs.length - this._numEffectDependencies, 0, methodVO);
        }
        this.invalidatePass();
    };
    /**
     * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
     * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
     * methods added prior.
     */
    MethodPass.prototype.addEffectMethod = function (method) {
        this._addDependency(new MethodVO(method), true);
    };
    Object.defineProperty(MethodPass.prototype, "numEffectMethods", {
        /**
         * The number of "effect" methods added to the material.
         */
        get: function () {
            return this._numEffectDependencies;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Queries whether a given effects method was added to the material.
     *
     * @param method The method to be queried.
     * @return true if the method was added to the material, false otherwise.
     */
    MethodPass.prototype.hasEffectMethod = function (method) {
        return this.getDependencyForMethod(method) != null;
    };
    /**
     * Returns the method added at the given index.
     * @param index The index of the method to retrieve.
     * @return The method at the given index.
     */
    MethodPass.prototype.getEffectMethodAt = function (index) {
        if (index < 0 || index > this._numEffectDependencies - 1)
            return null;
        return this._iMethodVOs[index + this._iMethodVOs.length - this._numEffectDependencies].method;
    };
    /**
     * Adds an effect method at the specified index amongst the methods already added to the material. Effect
     * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
     * etc. The method will be applied to the result of the methods with a lower index.
     */
    MethodPass.prototype.addEffectMethodAt = function (method, index) {
        this._addDependency(new MethodVO(method), true, index);
    };
    /**
     * Removes an effect method from the material.
     * @param method The method to be removed.
     */
    MethodPass.prototype.removeEffectMethod = function (method) {
        var methodVO = this.getDependencyForMethod(method);
        if (methodVO != null)
            this._removeDependency(methodVO, true);
    };
    /**
     * remove an effect method at the specified index from the material.
     */
    MethodPass.prototype.removeEffectMethodAt = function (index) {
        if (index < 0 || index > this._numEffectDependencies - 1)
            return;
        var methodVO = this._iMethodVOs[index + this._iMethodVOs.length - this._numEffectDependencies];
        if (methodVO != null)
            this._removeDependency(methodVO, true);
    };
    MethodPass.prototype.getDependencyForMethod = function (method) {
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i)
            if (this._iMethodVOs[i].method == method)
                return this._iMethodVOs[i];
        return null;
    };
    Object.defineProperty(MethodPass.prototype, "normalMethod", {
        /**
         * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
         */
        get: function () {
            return this._iNormalMethodVO ? this._iNormalMethodVO.method : null;
        },
        set: function (value) {
            if (this._iNormalMethodVO && this._iNormalMethodVO.method == value)
                return;
            if (this._iNormalMethodVO) {
                this._removeDependency(this._iNormalMethodVO);
                this._iNormalMethodVO = null;
            }
            if (value) {
                this._iNormalMethodVO = new MethodVO(value);
                this._addDependency(this._iNormalMethodVO);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodPass.prototype, "ambientMethod", {
        /**
         * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
         */
        get: function () {
            return this._iAmbientMethodVO ? this._iAmbientMethodVO.method : null;
        },
        set: function (value) {
            if (this._iAmbientMethodVO && this._iAmbientMethodVO.method == value)
                return;
            if (this._iAmbientMethodVO) {
                this._removeDependency(this._iAmbientMethodVO);
                this._iAmbientMethodVO = null;
            }
            if (value) {
                this._iAmbientMethodVO = new MethodVO(value);
                this._addDependency(this._iAmbientMethodVO);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodPass.prototype, "shadowMethod", {
        /**
         * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
         */
        get: function () {
            return this._iShadowMethodVO ? this._iShadowMethodVO.method : null;
        },
        set: function (value) {
            if (this._iShadowMethodVO && this._iShadowMethodVO.method == value)
                return;
            if (this._iShadowMethodVO) {
                this._removeDependency(this._iShadowMethodVO);
                this._iShadowMethodVO = null;
            }
            if (value) {
                this._iShadowMethodVO = new MethodVO(value);
                this._addDependency(this._iShadowMethodVO);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodPass.prototype, "diffuseMethod", {
        /**
         * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
         */
        get: function () {
            return this._iDiffuseMethodVO ? this._iDiffuseMethodVO.method : null;
        },
        set: function (value) {
            if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.method == value)
                return;
            if (this._iDiffuseMethodVO) {
                this._removeDependency(this._iDiffuseMethodVO);
                this._iDiffuseMethodVO = null;
            }
            if (value) {
                this._iDiffuseMethodVO = new MethodVO(value);
                this._addDependency(this._iDiffuseMethodVO);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodPass.prototype, "specularMethod", {
        /**
         * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
         */
        get: function () {
            return this._iSpecularMethodVO ? this._iSpecularMethodVO.method : null;
        },
        set: function (value) {
            if (this._iSpecularMethodVO && this._iSpecularMethodVO.method == value)
                return;
            if (this._iSpecularMethodVO) {
                this._removeDependency(this._iSpecularMethodVO);
                this._iSpecularMethodVO = null;
            }
            if (value) {
                this._iSpecularMethodVO = new MethodVO(value);
                this._addDependency(this._iSpecularMethodVO);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    MethodPass.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this._lightPicker)
            this._lightPicker.removeEventListener(Event.CHANGE, this._onLightsChangeDelegate);
        while (this._iMethodVOs.length)
            this._removeDependency(this._iMethodVOs[0]);
        this._iMethodVOs = null;
    };
    /**
     * Called when any method's shader code is invalidated.
     */
    MethodPass.prototype.onMethodInvalidated = function (event) {
        this.invalidatePass();
    };
    // RENDER LOOP
    /**
     * @inheritDoc
     */
    MethodPass.prototype._iActivate = function (camera) {
        _super.prototype._iActivate.call(this, camera);
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod)
                methodVO.method.iActivate(this._shader, methodVO, this._stage);
        }
    };
    /**
     *
     *
     * @param renderable
     * @param stage
     * @param camera
     */
    MethodPass.prototype._iRender = function (renderable, camera, viewProjection) {
        _super.prototype._iRender.call(this, renderable, camera, viewProjection);
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod)
                methodVO.method.iSetRenderState(this._shader, methodVO, renderable, this._stage, camera);
        }
    };
    /**
     * @inheritDoc
     */
    MethodPass.prototype._iDeactivate = function () {
        _super.prototype._iDeactivate.call(this);
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod)
                methodVO.method.iDeactivate(this._shader, methodVO, this._stage);
        }
    };
    MethodPass.prototype._iIncludeDependencies = function (shaderObject) {
        _super.prototype._iIncludeDependencies.call(this, shaderObject);
        //TODO: fragment animtion should be compatible with lighting pass
        shaderObject.usesFragmentAnimation = Boolean(this._mode == MethodPassMode.SUPER_SHADER);
        if (!shaderObject.usesTangentSpace && this.numPointLights > 0 && shaderObject.usesLights) {
            shaderObject.globalPosDependencies++;
            if (Boolean(this._mode & MethodPassMode.EFFECTS))
                shaderObject.usesGlobalPosFragment = true;
        }
        var i;
        var len = this._iMethodVOs.length;
        for (i = 0; i < len; ++i)
            this.setupAndCountDependencies(shaderObject, this._iMethodVOs[i]);
        for (i = 0; i < len; ++i)
            this._iMethodVOs[i].useMethod = this._iMethodVOs[i].method.iIsUsed(shaderObject);
    };
    /**
     * Counts the dependencies for a given method.
     * @param method The method to count the dependencies for.
     * @param methodVO The method's data for this material.
     */
    MethodPass.prototype.setupAndCountDependencies = function (shaderObject, methodVO) {
        methodVO.reset();
        methodVO.method.iInitVO(shaderObject, methodVO);
        if (methodVO.needsProjection)
            shaderObject.projectionDependencies++;
        if (methodVO.needsGlobalVertexPos) {
            shaderObject.globalPosDependencies++;
            if (methodVO.needsGlobalFragmentPos)
                shaderObject.usesGlobalPosFragment = true;
        }
        else if (methodVO.needsGlobalFragmentPos) {
            shaderObject.globalPosDependencies++;
            shaderObject.usesGlobalPosFragment = true;
        }
        if (methodVO.needsNormals)
            shaderObject.normalDependencies++;
        if (methodVO.needsTangents)
            shaderObject.tangentDependencies++;
        if (methodVO.needsView)
            shaderObject.viewDirDependencies++;
        if (methodVO.needsUV)
            shaderObject.uvDependencies++;
        if (methodVO.needsSecondaryUV)
            shaderObject.secondaryUVDependencies++;
    };
    MethodPass.prototype._iGetPreLightingVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        if (this._iAmbientMethodVO && this._iAmbientMethodVO.useMethod)
            code += this._iAmbientMethodVO.method.iGetVertexCode(shaderObject, this._iAmbientMethodVO, registerCache, sharedRegisters);
        if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod)
            code += this._iDiffuseMethodVO.method.iGetVertexCode(shaderObject, this._iDiffuseMethodVO, registerCache, sharedRegisters);
        if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod)
            code += this._iSpecularMethodVO.method.iGetVertexCode(shaderObject, this._iSpecularMethodVO, registerCache, sharedRegisters);
        return code;
    };
    MethodPass.prototype._iGetPreLightingFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        if (this._iAmbientMethodVO && this._iAmbientMethodVO.useMethod) {
            code += this._iAmbientMethodVO.method.iGetFragmentCode(shaderObject, this._iAmbientMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);
            if (this._iAmbientMethodVO.needsNormals)
                registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);
            if (this._iAmbientMethodVO.needsView)
                registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
        }
        if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod)
            code += this._iDiffuseMethodVO.method.iGetFragmentPreLightingCode(shaderObject, this._iDiffuseMethodVO, registerCache, sharedRegisters);
        if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod)
            code += this._iSpecularMethodVO.method.iGetFragmentPreLightingCode(shaderObject, this._iSpecularMethodVO, registerCache, sharedRegisters);
        return code;
    };
    MethodPass.prototype._iGetPerLightDiffuseFragmentCode = function (shaderObject, lightDirReg, diffuseColorReg, registerCache, sharedRegisters) {
        return this._iDiffuseMethodVO.method.iGetFragmentCodePerLight(shaderObject, this._iDiffuseMethodVO, lightDirReg, diffuseColorReg, registerCache, sharedRegisters);
    };
    MethodPass.prototype._iGetPerLightSpecularFragmentCode = function (shaderObject, lightDirReg, specularColorReg, registerCache, sharedRegisters) {
        return this._iSpecularMethodVO.method.iGetFragmentCodePerLight(shaderObject, this._iSpecularMethodVO, lightDirReg, specularColorReg, registerCache, sharedRegisters);
    };
    MethodPass.prototype._iGetPerProbeDiffuseFragmentCode = function (shaderObject, texReg, weightReg, registerCache, sharedRegisters) {
        return this._iDiffuseMethodVO.method.iGetFragmentCodePerProbe(shaderObject, this._iDiffuseMethodVO, texReg, weightReg, registerCache, sharedRegisters);
    };
    MethodPass.prototype._iGetPerProbeSpecularFragmentCode = function (shaderObject, texReg, weightReg, registerCache, sharedRegisters) {
        return this._iSpecularMethodVO.method.iGetFragmentCodePerProbe(shaderObject, this._iSpecularMethodVO, texReg, weightReg, registerCache, sharedRegisters);
    };
    MethodPass.prototype._iGetPostLightingVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        if (this._iShadowMethodVO)
            code += this._iShadowMethodVO.method.iGetVertexCode(shaderObject, this._iShadowMethodVO, registerCache, sharedRegisters);
        return code;
    };
    MethodPass.prototype._iGetPostLightingFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        if (shaderObject.useAlphaPremultiplied && this._pEnableBlending) {
            code += "add " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" + "div " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + ", " + sharedRegisters.shadedTarget + ".w\n" + "sub " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" + "sat " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + "\n";
        }
        if (this._iShadowMethodVO)
            code += this._iShadowMethodVO.method.iGetFragmentCode(shaderObject, this._iShadowMethodVO, sharedRegisters.shadowTarget, registerCache, sharedRegisters);
        if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod) {
            code += this._iDiffuseMethodVO.method.iGetFragmentPostLightingCode(shaderObject, this._iDiffuseMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);
            // resolve other dependencies as well?
            if (this._iDiffuseMethodVO.needsNormals)
                registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);
            if (this._iDiffuseMethodVO.needsView)
                registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
        }
        if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod) {
            code += this._iSpecularMethodVO.method.iGetFragmentPostLightingCode(shaderObject, this._iSpecularMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);
            if (this._iSpecularMethodVO.needsNormals)
                registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);
            if (this._iSpecularMethodVO.needsView)
                registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
        }
        if (this._iShadowMethodVO)
            registerCache.removeFragmentTempUsage(sharedRegisters.shadowTarget);
        return code;
    };
    /**
     * Indicates whether or not normals are allowed in tangent space. This is only the case if no object-space
     * dependencies exist.
     */
    MethodPass.prototype._pUsesTangentSpace = function (shaderObject) {
        if (shaderObject.usesProbes)
            return false;
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod && !methodVO.method.iUsesTangentSpace())
                return false;
        }
        return true;
    };
    /**
     * Indicates whether or not normals are output in tangent space.
     */
    MethodPass.prototype._pOutputsTangentNormals = function (shaderObject) {
        return this._iNormalMethodVO.method.iOutputsTangentNormals();
    };
    /**
     * Indicates whether or not normals are output by the pass.
     */
    MethodPass.prototype._pOutputsNormals = function (shaderObject) {
        return this._iNormalMethodVO && this._iNormalMethodVO.useMethod;
    };
    MethodPass.prototype._iGetNormalVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return this._iNormalMethodVO.method.iGetVertexCode(shaderObject, this._iNormalMethodVO, registerCache, sharedRegisters);
    };
    MethodPass.prototype._iGetNormalFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = this._iNormalMethodVO.method.iGetFragmentCode(shaderObject, this._iNormalMethodVO, sharedRegisters.normalFragment, registerCache, sharedRegisters);
        if (this._iNormalMethodVO.needsView)
            registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
        if (this._iNormalMethodVO.needsGlobalFragmentPos || this._iNormalMethodVO.needsGlobalVertexPos)
            registerCache.removeVertexTempUsage(sharedRegisters.globalPositionVertex);
        return code;
    };
    /**
     * @inheritDoc
     */
    MethodPass.prototype._iGetVertexCode = function (shaderObject, regCache, sharedReg) {
        var code = "";
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = len - this._numEffectDependencies; i < len; i++) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod) {
                code += methodVO.method.iGetVertexCode(shaderObject, methodVO, regCache, sharedReg);
                if (methodVO.needsGlobalVertexPos || methodVO.needsGlobalFragmentPos)
                    regCache.removeVertexTempUsage(sharedReg.globalPositionVertex);
            }
        }
        if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.useMethod)
            code += this._iColorTransformMethodVO.method.iGetVertexCode(shaderObject, this._iColorTransformMethodVO, regCache, sharedReg);
        return code;
    };
    /**
     * @inheritDoc
     */
    MethodPass.prototype._iGetFragmentCode = function (shaderObject, regCache, sharedReg) {
        var code = "";
        var alphaReg;
        if (this.preserveAlpha && this._numEffectDependencies > 0) {
            alphaReg = regCache.getFreeFragmentSingleTemp();
            regCache.addFragmentTempUsages(alphaReg, 1);
            code += "mov " + alphaReg + ", " + sharedReg.shadedTarget + ".w\n";
        }
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = len - this._numEffectDependencies; i < len; i++) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod) {
                code += methodVO.method.iGetFragmentCode(shaderObject, methodVO, sharedReg.shadedTarget, regCache, sharedReg);
                if (methodVO.needsNormals)
                    regCache.removeFragmentTempUsage(sharedReg.normalFragment);
                if (methodVO.needsView)
                    regCache.removeFragmentTempUsage(sharedReg.viewDirFragment);
            }
        }
        if (this.preserveAlpha && this._numEffectDependencies > 0) {
            code += "mov " + sharedReg.shadedTarget + ".w, " + alphaReg + "\n";
            regCache.removeFragmentTempUsage(alphaReg);
        }
        if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.useMethod)
            code += this._iColorTransformMethodVO.method.iGetFragmentCode(shaderObject, this._iColorTransformMethodVO, sharedReg.shadedTarget, regCache, sharedReg);
        return code;
    };
    /**
     * Indicates whether the shader uses any shadows.
     */
    MethodPass.prototype._iUsesShadows = function (shaderObject) {
        return Boolean(this._iShadowMethodVO && (this._lightPicker.castingDirectionalLights.length > 0 || this._lightPicker.castingPointLights.length > 0));
    };
    /**
     * Indicates whether the shader uses any specular component.
     */
    MethodPass.prototype._iUsesSpecular = function (shaderObject) {
        return Boolean(this._iSpecularMethodVO);
    };
    /**
     * Indicates whether the shader uses any specular component.
     */
    MethodPass.prototype._iUsesDiffuse = function (shaderObject) {
        return Boolean(this._iDiffuseMethodVO);
    };
    MethodPass.prototype.onLightsChange = function (event) {
        this._updateLights();
    };
    MethodPass.prototype._updateLights = function () {
        var numDirectionalLightsOld = this.numDirectionalLights;
        var numPointLightsOld = this.numPointLights;
        var numLightProbesOld = this.numLightProbes;
        if (this._lightPicker && (this._mode & MethodPassMode.LIGHTING)) {
            this.numDirectionalLights = this.calculateNumDirectionalLights(this._lightPicker.numDirectionalLights);
            this.numPointLights = this.calculateNumPointLights(this._lightPicker.numPointLights);
            this.numLightProbes = this.calculateNumProbes(this._lightPicker.numLightProbes);
            if (this._includeCasters) {
                this.numDirectionalLights += this._lightPicker.numCastingDirectionalLights;
                this.numPointLights += this._lightPicker.numCastingPointLights;
            }
        }
        else {
            this.numDirectionalLights = 0;
            this.numPointLights = 0;
            this.numLightProbes = 0;
        }
        if (numDirectionalLightsOld != this.numDirectionalLights || numPointLightsOld != this.numPointLights || numLightProbesOld != this.numLightProbes) {
            this._updateShader();
            this.invalidatePass();
        }
    };
    /**
     * Calculates the amount of directional lights this material will support.
     * @param numDirectionalLights The maximum amount of directional lights to support.
     * @return The amount of directional lights this material will support, bounded by the amount necessary.
     */
    MethodPass.prototype.calculateNumDirectionalLights = function (numDirectionalLights) {
        return Math.min(numDirectionalLights - this.directionalLightsOffset, this._maxLights);
    };
    /**
     * Calculates the amount of point lights this material will support.
     * @param numDirectionalLights The maximum amount of point lights to support.
     * @return The amount of point lights this material will support, bounded by the amount necessary.
     */
    MethodPass.prototype.calculateNumPointLights = function (numPointLights) {
        var numFree = this._maxLights - this.numDirectionalLights;
        return Math.min(numPointLights - this.pointLightsOffset, numFree);
    };
    /**
     * Calculates the amount of light probes this material will support.
     * @param numDirectionalLights The maximum amount of light probes to support.
     * @return The amount of light probes this material will support, bounded by the amount necessary.
     */
    MethodPass.prototype.calculateNumProbes = function (numLightProbes) {
        var numChannels = 0;
        if ((this.specularLightSources & LightSources.PROBES) != 0)
            ++numChannels;
        if ((this.diffuseLightSources & LightSources.PROBES) != 0)
            ++numChannels;
        // 4 channels available
        return Math.min(numLightProbes - this.lightProbesOffset, (4 / numChannels) | 0);
    };
    return MethodPass;
})(RenderPassBase);
module.exports = MethodPass;


},{"awayjs-core/lib/events/Event":undefined,"awayjs-display/lib/materials/LightSources":undefined,"awayjs-methodmaterials/lib/data/MethodVO":undefined,"awayjs-methodmaterials/lib/methods/EffectColorTransformMethod":undefined,"awayjs-methodmaterials/lib/passes/MethodPassMode":undefined,"awayjs-renderergl/lib/compilation/ShaderLightingObject":undefined,"awayjs-renderergl/lib/compilation/ShaderObjectBase":undefined,"awayjs-renderergl/lib/events/ShadingMethodEvent":undefined,"awayjs-renderergl/lib/passes/RenderPassBase":undefined}],"awayjs-methodmaterials\\lib\\passes\\SingleObjectDepthPass":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var RenderTexture = require("awayjs-core/lib/textures/RenderTexture");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
/**
 * The SingleObjectDepthPass provides a material pass that renders a single object to a depth map from the point
 * of view from a light.
 */
var SingleObjectDepthPass = (function (_super) {
    __extends(SingleObjectDepthPass, _super);
    /**
     * Creates a new SingleObjectDepthPass object.
     */
    function SingleObjectDepthPass(renderObject, renderObjectOwner, renderableClass, stage) {
        _super.call(this, renderObject, renderObjectOwner, renderableClass, stage);
        this._textureSize = 512;
        this._polyOffset = Array(15, 0, 0, 0);
        this._projectionTexturesInvalid = true;
        //this._pNumUsedStreams = 2;
        //this._pNumUsedVertexConstants = 7;
        //this._enc = Array<number>(1.0, 255.0, 65025.0, 16581375.0, 1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
        //
        //this._pAnimatableAttributes = Array<string>("va0", "va1");
        //this._pAnimationTargetRegisters = Array<string>("vt0", "vt1");
    }
    Object.defineProperty(SingleObjectDepthPass.prototype, "textureSize", {
        /**
         * The size of the depth map texture to render to.
         */
        get: function () {
            return this._textureSize;
        },
        set: function (value) {
            this._textureSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingleObjectDepthPass.prototype, "polyOffset", {
        /**
         * The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
         */
        get: function () {
            return this._polyOffset[0];
        },
        set: function (value) {
            this._polyOffset[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype.dispose = function () {
        if (this._textures) {
            for (var key in this._textures) {
                var texture = this._textures[key];
                texture.dispose();
            }
            this._textures = null;
        }
    };
    /**
     * Updates the projection textures used to contain the depth renders.
     */
    SingleObjectDepthPass.prototype.updateProjectionTextures = function () {
        if (this._textures) {
            for (var key in this._textures) {
                var texture = this._textures[key];
                texture.dispose();
            }
        }
        this._textures = new Object();
        this._projections = new Object();
        this._projectionTexturesInvalid = false;
    };
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype._iGetVertexCode = function () {
        var code;
        // offset
        code = "mul vt7, vt1, vc4.x	\n" + "add vt7, vt7, vt0\n" + "mov vt7.w, vt0.w\n";
        // project
        code += "m44 vt2, vt7, vc0\n" + "mov op, vt2\n";
        // perspective divide
        code += "div v0, vt2, vt2.w\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype._iGetFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        // encode float -> rgba
        code += "mul ft0, fc0, v0.z\n" + "frc ft0, ft0\n" + "mul ft1, ft0.yzww, fc1\n" + "sub ft0, ft0, ft1\n" + "mov oc, ft0\n";
        return code;
    };
    /**
     * Gets the depth maps rendered for this object from all lights.
     * @param renderable The renderable for which to retrieve the depth maps.
     * @param stage3DProxy The Stage3DProxy object currently used for rendering.
     * @return A list of depth map textures for all supported lights.
     */
    SingleObjectDepthPass.prototype._iGetDepthMap = function (renderable) {
        return this._textures[renderable.renderableOwner.id];
    };
    /**
     * Retrieves the depth map projection maps for all lights.
     * @param renderable The renderable for which to retrieve the projection maps.
     * @return A list of projection maps for all supported lights.
     */
    SingleObjectDepthPass.prototype._iGetProjection = function (renderable) {
        return this._projections[renderable.renderableOwner.id];
    };
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype._iRender = function (renderable, camera, viewProjection) {
        var matrix;
        var context = this._stage.context;
        var len /*uint*/;
        var light;
        var lights = this._renderObjectOwner.lightPicker.allPickedLights;
        var rId = renderable.renderableOwner.id;
        if (!this._textures[rId])
            this._textures[rId] = new RenderTexture(this._textureSize, this._textureSize);
        if (!this._projections[rId])
            this._projections[rId] = new Matrix3D();
        len = lights.length;
        // local position = enough
        light = lights[0];
        matrix = light.iGetObjectProjectionMatrix(renderable.sourceEntity, camera, this._projections[rId]);
        this._stage.setRenderTarget(this._textures[rId], true);
        context.clear(1.0, 1.0, 1.0);
        context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, matrix, true);
        context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._enc, 2);
        this._stage.activateBuffer(0, renderable.getVertexData(TriangleSubGeometry.POSITION_DATA), renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
        this._stage.activateBuffer(1, renderable.getVertexData(TriangleSubGeometry.NORMAL_DATA), renderable.getVertexOffset(TriangleSubGeometry.NORMAL_DATA), TriangleSubGeometry.NORMAL_FORMAT);
        context.drawTriangles(this._stage.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);
    };
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype._iActivate = function (camera) {
        if (this._projectionTexturesInvalid)
            this.updateProjectionTextures();
        // never scale
        _super.prototype._iActivate.call(this, camera);
        this._stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._polyOffset, 1);
    };
    return SingleObjectDepthPass;
})(RenderPassBase);
module.exports = SingleObjectDepthPass;


},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/textures/RenderTexture":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-renderergl/lib/passes/RenderPassBase":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-methodmaterials\\lib\\pool\\MethodRenderablePool":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RenderablePoolBase = require("awayjs-renderergl/lib/pool/RenderablePoolBase");
var RenderObjectPool = require("awayjs-renderergl/lib/compilation/RenderObjectPool");
var RenderMethodMaterialObject = require("awayjs-methodmaterials/lib/compilation/RenderMethodMaterialObject");
/**
 * @class away.pool.MethodRenderablePool
 */
var MethodRenderablePool = (function (_super) {
    __extends(MethodRenderablePool, _super);
    /**
     * //TODO
     *
     * @param renderableClass
     */
    function MethodRenderablePool(renderableClass, stage) {
        _super.call(this, renderableClass, stage);
        this._methodMaterialRenderObjectPool = new RenderObjectPool(RenderMethodMaterialObject, this._renderableClass, this._stage);
    }
    /**
     *
     * @param material
     * @param renderable
     */
    MethodRenderablePool.prototype.getMethodRenderObject = function (renderObjectOwner) {
        return this._methodMaterialRenderObjectPool.getItem(renderObjectOwner);
    };
    /**
     * //TODO
     *
     * @param renderableClass
     * @returns MethodRenderablePool
     */
    MethodRenderablePool.getPool = function (renderableClass, stage) {
        var pools = (RenderablePoolBase._pools[stage.stageIndex] || (RenderablePoolBase._pools[stage.stageIndex] = new Object()));
        return (pools[renderableClass.id] || (pools[renderableClass.id] = new MethodRenderablePool(renderableClass, stage)));
    };
    return MethodRenderablePool;
})(RenderablePoolBase);
module.exports = MethodRenderablePool;


},{"awayjs-methodmaterials/lib/compilation/RenderMethodMaterialObject":undefined,"awayjs-renderergl/lib/compilation/RenderObjectPool":undefined,"awayjs-renderergl/lib/pool/RenderablePoolBase":undefined}],"awayjs-methodmaterials\\lib\\pool\\MethodRendererPool":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BillboardRenderable = require("awayjs-renderergl/lib/pool/BillboardRenderable");
var LineSegmentRenderable = require("awayjs-renderergl/lib/pool/LineSegmentRenderable");
var LineSubMeshRenderable = require("awayjs-renderergl/lib/pool/LineSubMeshRenderable");
var TriangleSubMeshRenderable = require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
var CurveSubMeshRenderable = require("awayjs-renderergl/lib/pool/CurveSubMeshRenderable");
var RendererPoolBase = require("awayjs-renderergl/lib/pool/RendererPoolBase");
var MethodRenderablePool = require("awayjs-methodmaterials/lib/pool/MethodRenderablePool");
/**
 * MethodRendererPool forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.MethodRendererPool
 */
var MethodRendererPool = (function (_super) {
    __extends(MethodRendererPool, _super);
    /**
     * Creates a new MethodRendererPool object.
     */
    function MethodRendererPool(renderer) {
        _super.call(this, renderer);
    }
    MethodRendererPool.prototype._pUpdatePool = function () {
        this._billboardRenderablePool = MethodRenderablePool.getPool(BillboardRenderable, this._pStage);
        this._lineSegmentRenderablePool = MethodRenderablePool.getPool(LineSegmentRenderable, this._pStage);
        this._triangleSubMeshRenderablePool = MethodRenderablePool.getPool(TriangleSubMeshRenderable, this._pStage);
        this._lineSubMeshRenderablePool = MethodRenderablePool.getPool(LineSubMeshRenderable, this._pStage);
        this._curveSubMeshRenderablePool = MethodRenderablePool.getPool(CurveSubMeshRenderable, this._pStage);
    };
    return MethodRendererPool;
})(RendererPoolBase);
module.exports = MethodRendererPool;


},{"awayjs-methodmaterials/lib/pool/MethodRenderablePool":undefined,"awayjs-renderergl/lib/pool/BillboardRenderable":undefined,"awayjs-renderergl/lib/pool/CurveSubMeshRenderable":undefined,"awayjs-renderergl/lib/pool/LineSegmentRenderable":undefined,"awayjs-renderergl/lib/pool/LineSubMeshRenderable":undefined,"awayjs-renderergl/lib/pool/RendererPoolBase":undefined,"awayjs-renderergl/lib/pool/TriangleSubMeshRenderable":undefined}]},{},[])


//# sourceMappingURL=awayjs-methodmaterials.js.map