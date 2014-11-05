var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
var Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
var BlendMode = require("awayjs-display/lib/base/BlendMode");
var StaticLightPicker = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var TriangleMaterialBase = require("awayjs-renderergl/lib/materials/TriangleMaterialBase");
var TriangleMaterialMode = require("awayjs-methodmaterials/lib/TriangleMaterialMode");
var AmbientBasicMethod = require("awayjs-methodmaterials/lib/methods/AmbientBasicMethod");
var DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
var NormalBasicMethod = require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
var SpecularBasicMethod = require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
var MaterialPassMode = require("awayjs-methodmaterials/lib/passes/MaterialPassMode");
var TriangleMethodPass = require("awayjs-methodmaterials/lib/passes/TriangleMethodPass");
/**
 * TriangleMethodMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var TriangleMethodMaterial = (function (_super) {
    __extends(TriangleMethodMaterial, _super);
    function TriangleMethodMaterial(textureColor, smoothAlpha, repeat, mipmap) {
        if (textureColor === void 0) { textureColor = null; }
        if (smoothAlpha === void 0) { smoothAlpha = null; }
        if (repeat === void 0) { repeat = false; }
        if (mipmap === void 0) { mipmap = false; }
        _super.call(this);
        this._alphaBlending = false;
        this._alpha = 1;
        this._ambientMethod = new AmbientBasicMethod();
        this._diffuseMethod = new DiffuseBasicMethod();
        this._normalMethod = new NormalBasicMethod();
        this._specularMethod = new SpecularBasicMethod();
        this._depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
        this._materialMode = TriangleMaterialMode.SINGLE_PASS;
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
    Object.defineProperty(TriangleMethodMaterial.prototype, "materialMode", {
        get: function () {
            return this._materialMode;
        },
        set: function (value) {
            if (this._materialMode == value)
                return;
            this._materialMode = value;
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "depthCompareMode", {
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
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "alpha", {
        /**
         * The alpha of the surface.
         */
        get: function () {
            return this._alpha;
        },
        set: function (value) {
            if (value > 1)
                value = 1;
            else if (value < 0)
                value = 0;
            if (this._alpha == value)
                return;
            this._alpha = value;
            if (this._colorTransform == null)
                this._colorTransform = new ColorTransform();
            this._colorTransform.alphaMultiplier = value;
            this._pInvalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "colorTransform", {
        /**
         * The ColorTransform object to transform the colour of the material with. Defaults to null.
         */
        get: function () {
            return this._screenPass.colorTransform;
        },
        set: function (value) {
            this._screenPass.colorTransform = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "diffuseTexture", {
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
    Object.defineProperty(TriangleMethodMaterial.prototype, "ambientMethod", {
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
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "shadowMethod", {
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
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "diffuseMethod", {
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
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "specularMethod", {
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
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "normalMethod", {
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
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
     * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
     * methods added prior.
     */
    TriangleMethodMaterial.prototype.addEffectMethod = function (method) {
        if (this._screenPass == null)
            this._screenPass = new TriangleMethodPass();
        this._screenPass.addEffectMethod(method);
        this._pInvalidateScreenPasses();
    };
    Object.defineProperty(TriangleMethodMaterial.prototype, "numEffectMethods", {
        /**
         * The number of "effect" methods added to the material.
         */
        get: function () {
            return this._screenPass ? this._screenPass.numEffectMethods : 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Queries whether a given effect method was added to the material.
     *
     * @param method The method to be queried.
     * @return true if the method was added to the material, false otherwise.
     */
    TriangleMethodMaterial.prototype.hasEffectMethod = function (method) {
        return this._screenPass ? this._screenPass.hasEffectMethod(method) : false;
    };
    /**
     * Returns the method added at the given index.
     * @param index The index of the method to retrieve.
     * @return The method at the given index.
     */
    TriangleMethodMaterial.prototype.getEffectMethodAt = function (index) {
        if (this._screenPass == null)
            return null;
        return this._screenPass.getEffectMethodAt(index);
    };
    /**
     * Adds an effect method at the specified index amongst the methods already added to the material. Effect
     * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
     * etc. The method will be applied to the result of the methods with a lower index.
     */
    TriangleMethodMaterial.prototype.addEffectMethodAt = function (method, index) {
        if (this._screenPass == null)
            this._screenPass = new TriangleMethodPass();
        this._screenPass.addEffectMethodAt(method, index);
        this._pInvalidatePasses();
    };
    /**
     * Removes an effect method from the material.
     * @param method The method to be removed.
     */
    TriangleMethodMaterial.prototype.removeEffectMethod = function (method) {
        if (this._screenPass == null)
            return;
        this._screenPass.removeEffectMethod(method);
        // reconsider
        if (this._screenPass.numEffectMethods == 0)
            this._pInvalidatePasses();
    };
    Object.defineProperty(TriangleMethodMaterial.prototype, "normalMap", {
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
    Object.defineProperty(TriangleMethodMaterial.prototype, "specularMap", {
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
    Object.defineProperty(TriangleMethodMaterial.prototype, "gloss", {
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
    Object.defineProperty(TriangleMethodMaterial.prototype, "ambient", {
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
    Object.defineProperty(TriangleMethodMaterial.prototype, "specular", {
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
    Object.defineProperty(TriangleMethodMaterial.prototype, "ambientColor", {
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
    Object.defineProperty(TriangleMethodMaterial.prototype, "diffuseColor", {
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
    Object.defineProperty(TriangleMethodMaterial.prototype, "specularColor", {
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
    Object.defineProperty(TriangleMethodMaterial.prototype, "alphaBlending", {
        /**
         * Indicates whether or not the material has transparency. If binary transparency is sufficient, for
         * example when using textures of foliage, consider using alphaThreshold instead.
         */
        get: function () {
            return this._alphaBlending;
        },
        set: function (value) {
            if (this._alphaBlending == value)
                return;
            this._alphaBlending = value;
            this._pInvalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    TriangleMethodMaterial.prototype._iUpdateMaterial = function () {
        if (this._pScreenPassesInvalid) {
            //Updates screen passes when they were found to be invalid.
            this._pScreenPassesInvalid = false;
            this.initPasses();
            this.setBlendAndCompareModes();
            this._pClearScreenPasses();
            if (this._materialMode == TriangleMaterialMode.MULTI_PASS) {
                if (this._casterLightPass)
                    this._pAddScreenPass(this._casterLightPass);
                if (this._nonCasterLightPasses)
                    for (var i = 0; i < this._nonCasterLightPasses.length; ++i)
                        this._pAddScreenPass(this._nonCasterLightPasses[i]);
            }
            if (this._screenPass)
                this._pAddScreenPass(this._screenPass);
        }
    };
    /**
     * Initializes all the passes and their dependent passes.
     */
    TriangleMethodMaterial.prototype.initPasses = function () {
        // let the effects pass handle everything if there are no lights, when there are effect methods applied
        // after shading, or when the material mode is single pass.
        if (this.numLights == 0 || this.numEffectMethods > 0 || this._materialMode == TriangleMaterialMode.SINGLE_PASS)
            this.initEffectPass();
        else if (this._screenPass)
            this.removeEffectPass();
        // only use a caster light pass if shadows need to be rendered
        if (this._shadowMethod && this._materialMode == TriangleMaterialMode.MULTI_PASS)
            this.initCasterLightPass();
        else if (this._casterLightPass)
            this.removeCasterLightPass();
        // only use non caster light passes if there are lights that don't cast
        if (this.numNonCasters > 0 && this._materialMode == TriangleMaterialMode.MULTI_PASS)
            this.initNonCasterLightPasses();
        else if (this._nonCasterLightPasses)
            this.removeNonCasterLightPasses();
    };
    /**
     * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
     */
    TriangleMethodMaterial.prototype.setBlendAndCompareModes = function () {
        var forceSeparateMVP = Boolean(this._casterLightPass || this._screenPass);
        // caster light pass is always first if it exists, hence it uses normal blending
        if (this._casterLightPass) {
            this._casterLightPass.forceSeparateMVP = forceSeparateMVP;
            this._casterLightPass.setBlendMode(BlendMode.NORMAL);
            this._casterLightPass.depthCompareMode = this._depthCompareMode;
        }
        if (this._nonCasterLightPasses) {
            var firstAdditiveIndex = 0;
            // if there's no caster light pass, the first non caster light pass will be the first
            // and should use normal blending
            if (!this._casterLightPass) {
                this._nonCasterLightPasses[0].forceSeparateMVP = forceSeparateMVP;
                this._nonCasterLightPasses[0].setBlendMode(BlendMode.NORMAL);
                this._nonCasterLightPasses[0].depthCompareMode = this._depthCompareMode;
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
                this._screenPass.passMode = MaterialPassMode.EFFECTS;
                this._screenPass.depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
                this._screenPass.setBlendMode(BlendMode.LAYER);
                this._screenPass.forceSeparateMVP = forceSeparateMVP;
            }
        }
        else if (this._screenPass) {
            this._pRequiresBlending = (this._pBlendMode != BlendMode.NORMAL || this._alphaBlending || (this._colorTransform && this._colorTransform.alphaMultiplier < 1));
            // effects pass is the only pass, so it should just blend normally
            this._screenPass.passMode = MaterialPassMode.SUPER_SHADER;
            this._screenPass.depthCompareMode = this._depthCompareMode;
            this._screenPass.preserveAlpha = this._pRequiresBlending;
            this._screenPass.colorTransform = this._colorTransform;
            this._screenPass.setBlendMode((this._pBlendMode == BlendMode.NORMAL && this._pRequiresBlending) ? BlendMode.LAYER : this._pBlendMode);
            this._screenPass.forceSeparateMVP = false;
        }
    };
    TriangleMethodMaterial.prototype.initCasterLightPass = function () {
        if (this._casterLightPass == null)
            this._casterLightPass = new TriangleMethodPass(MaterialPassMode.LIGHTING);
        this._casterLightPass.lightPicker = new StaticLightPicker([this._shadowMethod.castingLight]);
        this._casterLightPass.shadowMethod = this._shadowMethod;
        this._casterLightPass.diffuseMethod = this._diffuseMethod;
        this._casterLightPass.ambientMethod = this._ambientMethod;
        this._casterLightPass.normalMethod = this._normalMethod;
        this._casterLightPass.specularMethod = this._specularMethod;
    };
    TriangleMethodMaterial.prototype.removeCasterLightPass = function () {
        this._casterLightPass.dispose();
        this._pRemoveScreenPass(this._casterLightPass);
        this._casterLightPass = null;
    };
    TriangleMethodMaterial.prototype.initNonCasterLightPasses = function () {
        this.removeNonCasterLightPasses();
        var pass;
        var numDirLights = this._pLightPicker.numDirectionalLights;
        var numPointLights = this._pLightPicker.numPointLights;
        var numLightProbes = this._pLightPicker.numLightProbes;
        var dirLightOffset = 0;
        var pointLightOffset = 0;
        var probeOffset = 0;
        if (!this._casterLightPass) {
            numDirLights += this._pLightPicker.numCastingDirectionalLights;
            numPointLights += this._pLightPicker.numCastingPointLights;
        }
        this._nonCasterLightPasses = new Array();
        while (dirLightOffset < numDirLights || pointLightOffset < numPointLights || probeOffset < numLightProbes) {
            pass = new TriangleMethodPass(MaterialPassMode.LIGHTING);
            pass.includeCasters = this._shadowMethod == null;
            pass.directionalLightsOffset = dirLightOffset;
            pass.pointLightsOffset = pointLightOffset;
            pass.lightProbesOffset = probeOffset;
            pass.lightPicker = this._pLightPicker;
            pass.diffuseMethod = this._diffuseMethod;
            pass.ambientMethod = this._ambientMethod;
            pass.normalMethod = this._normalMethod;
            pass.specularMethod = this._specularMethod;
            this._nonCasterLightPasses.push(pass);
            dirLightOffset += pass.iNumDirectionalLights;
            pointLightOffset += pass.iNumPointLights;
            probeOffset += pass.iNumLightProbes;
        }
    };
    TriangleMethodMaterial.prototype.removeNonCasterLightPasses = function () {
        if (!this._nonCasterLightPasses)
            return;
        for (var i = 0; i < this._nonCasterLightPasses.length; ++i)
            this._pRemoveScreenPass(this._nonCasterLightPasses[i]);
        this._nonCasterLightPasses = null;
    };
    TriangleMethodMaterial.prototype.removeEffectPass = function () {
        if (this._screenPass.ambientMethod != this._ambientMethod)
            this._screenPass.ambientMethod.dispose();
        if (this._screenPass.diffuseMethod != this._diffuseMethod)
            this._screenPass.diffuseMethod.dispose();
        if (this._screenPass.specularMethod != this._specularMethod)
            this._screenPass.specularMethod.dispose();
        if (this._screenPass.normalMethod != this._normalMethod)
            this._screenPass.normalMethod.dispose();
        this._pRemoveScreenPass(this._screenPass);
        this._screenPass = null;
    };
    TriangleMethodMaterial.prototype.initEffectPass = function () {
        if (this._screenPass == null)
            this._screenPass = new TriangleMethodPass();
        if (this._materialMode == TriangleMaterialMode.SINGLE_PASS) {
            this._screenPass.ambientMethod = this._ambientMethod;
            this._screenPass.diffuseMethod = this._diffuseMethod;
            this._screenPass.specularMethod = this._specularMethod;
            this._screenPass.normalMethod = this._normalMethod;
            this._screenPass.shadowMethod = this._shadowMethod;
        }
        else if (this._materialMode == TriangleMaterialMode.MULTI_PASS) {
            if (this.numLights == 0) {
                this._screenPass.ambientMethod = this._ambientMethod;
            }
            else {
                this._screenPass.ambientMethod = null;
            }
            this._screenPass.preserveAlpha = false;
            this._screenPass.normalMethod = this._normalMethod;
        }
    };
    Object.defineProperty(TriangleMethodMaterial.prototype, "numLights", {
        /**
         * The maximum total number of lights provided by the light picker.
         */
        get: function () {
            return this._pLightPicker ? this._pLightPicker.numLightProbes + this._pLightPicker.numDirectionalLights + this._pLightPicker.numPointLights + this._pLightPicker.numCastingDirectionalLights + this._pLightPicker.numCastingPointLights : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "numNonCasters", {
        /**
         * The amount of lights that don't cast shadows.
         */
        get: function () {
            return this._pLightPicker ? this._pLightPicker.numLightProbes + this._pLightPicker.numDirectionalLights + this._pLightPicker.numPointLights : 0;
        },
        enumerable: true,
        configurable: true
    });
    return TriangleMethodMaterial;
})(TriangleMaterialBase);
module.exports = TriangleMethodMaterial;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL1RyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwudHMiXSwibmFtZXMiOlsiVHJpYW5nbGVNZXRob2RNYXRlcmlhbCIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuY29uc3RydWN0b3IiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLm1hdGVyaWFsTW9kZSIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuZGVwdGhDb21wYXJlTW9kZSIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuYWxwaGEiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmNvbG9yVHJhbnNmb3JtIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5kaWZmdXNlVGV4dHVyZSIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuYW1iaWVudE1ldGhvZCIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuc2hhZG93TWV0aG9kIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5kaWZmdXNlTWV0aG9kIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5zcGVjdWxhck1ldGhvZCIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwubm9ybWFsTWV0aG9kIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5hZGRFZmZlY3RNZXRob2QiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLm51bUVmZmVjdE1ldGhvZHMiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmhhc0VmZmVjdE1ldGhvZCIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuZ2V0RWZmZWN0TWV0aG9kQXQiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmFkZEVmZmVjdE1ldGhvZEF0IiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5yZW1vdmVFZmZlY3RNZXRob2QiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLm5vcm1hbE1hcCIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuc3BlY3VsYXJNYXAiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmdsb3NzIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5hbWJpZW50IiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5zcGVjdWxhciIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuYW1iaWVudENvbG9yIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5kaWZmdXNlQ29sb3IiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLnNwZWN1bGFyQ29sb3IiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmFscGhhQmxlbmRpbmciLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLl9pVXBkYXRlTWF0ZXJpYWwiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmluaXRQYXNzZXMiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLnNldEJsZW5kQW5kQ29tcGFyZU1vZGVzIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5pbml0Q2FzdGVyTGlnaHRQYXNzIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5yZW1vdmVDYXN0ZXJMaWdodFBhc3MiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmluaXROb25DYXN0ZXJMaWdodFBhc3NlcyIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwucmVtb3ZlTm9uQ2FzdGVyTGlnaHRQYXNzZXMiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLnJlbW92ZUVmZmVjdFBhc3MiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmluaXRFZmZlY3RQYXNzIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5udW1MaWdodHMiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLm51bU5vbkNhc3RlcnMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8sY0FBYyxXQUFjLHFDQUFxQyxDQUFDLENBQUM7QUFDMUUsSUFBTyxhQUFhLFdBQWMsd0NBQXdDLENBQUMsQ0FBQztBQUU1RSxJQUFPLFNBQVMsV0FBZSxtQ0FBbUMsQ0FBQyxDQUFDO0FBRXBFLElBQU8saUJBQWlCLFdBQWEsNkRBQTZELENBQUMsQ0FBQztBQUdwRyxJQUFPLG9CQUFvQixXQUFhLDhDQUE4QyxDQUFDLENB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Q0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDckRBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBO1FBQ2pFQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hDQSxJQUFJQSxrQkFBa0JBLEdBQVVBLENBQUNBLENBQUNBO1lBRWxDQSxBQUVBQSxxRkFGcUZBO1lBQ3JGQSxpQ0FBaUNBO1lBQ2pDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBLENBQUNBO2dCQUM1QkEsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLGdCQUFnQkEsQ0FBQ0E7Z0JBQ2xFQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO2dCQUM3REEsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0E7Z0JBQ3hFQSxrQkFBa0JBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQTtZQUdEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxrQkFBa0JBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsTUFBTUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7Z0JBQ3BGQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLGdCQUFnQkEsR0FBR0EsZ0JBQWdCQSxDQUFDQTtnQkFDbEVBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0Es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QSxDQUFDQSxDQUFDQTtRQUM1T0EsQ0FBQ0E7OztPQUFBcEM7SUFLREEsc0JBQVlBLGlEQUFhQTtRQUh6QkE7O1dBRUdBO2FBQ0hBO1lBRUNxQyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFFQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxjQUFjQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxvQkFBb0JBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLGNBQWNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ2hKQSxDQUFDQTs7O09BQUFyQztJQUNGQSw2QkFBQ0E7QUFBREEsQ0E3cUJBLEFBNnFCQ0EsRUE3cUJvQyxvQkFBb0IsRUE2cUJ4RDtBQUVELEFBQWdDLGlCQUF2QixzQkFBc0IsQ0FBQyIsImZpbGUiOiJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbIu+7v2ltcG9ydCBDb2xvclRyYW5zZm9ybVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vQ29sb3JUcmFuc2Zvcm1cIik7XG5pbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmUyREJhc2VcIik7XG5cbmltcG9ydCBCbGVuZE1vZGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvQmxlbmRNb2RlXCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5pbXBvcnQgU3RhdGljTGlnaHRQaWNrZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL2xpZ2h0cGlja2Vycy9TdGF0aWNMaWdodFBpY2tlclwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5pbXBvcnQgQ29udGV4dEdMQ29tcGFyZU1vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xDb21wYXJlTW9kZVwiKTtcblxuaW1wb3J0IFRyaWFuZ2xlTWF0ZXJpYWxCYXNlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9UcmlhbmdsZU1hdGVyaWFsQmFzZVwiKTtcblxuaW1wb3J0IFRyaWFuZ2xlTWF0ZXJpYWxNb2RlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvVHJpYW5nbGVNYXRlcmlhbE1vZGVcIik7XG5pbXBvcnQgQW1iaWVudEJhc2ljTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9BbWJpZW50QmFzaWNNZXRob2RcIik7XG5pbXBvcnQgRGlmZnVzZUJhc2ljTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9EaWZmdXNlQmFzaWNNZXRob2RcIik7XG5pbXBvcnQgRWZmZWN0TWV0aG9kQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9FZmZlY3RNZXRob2RCYXNlXCIpO1xuaW1wb3J0IE5vcm1hbEJhc2ljTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9Ob3JtYWxCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBTaGFkb3dNYXBNZXRob2RCYXNlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9TaGFkb3dNYXBNZXRob2RCYXNlXCIpO1xuaW1wb3J0IFNwZWN1bGFyQmFzaWNNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL1NwZWN1bGFyQmFzaWNNZXRob2RcIik7XG5pbXBvcnQgTWF0ZXJpYWxQYXNzTW9kZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvcGFzc2VzL01hdGVyaWFsUGFzc01vZGVcIik7XG5pbXBvcnQgVHJpYW5nbGVNZXRob2RQYXNzXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvcGFzc2VzL1RyaWFuZ2xlTWV0aG9kUGFzc1wiKTtcblxuLyoqXG4gKiBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsIGZvcm1zIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIHRoZSBkZWZhdWx0IHNoYWRlZCBtYXRlcmlhbHMgcHJvdmlkZWQgYnkgU3RhZ2UsXG4gKiB1c2luZyBtYXRlcmlhbCBtZXRob2RzIHRvIGRlZmluZSB0aGVpciBhcHBlYXJhbmNlLlxuICovXG5jbGFzcyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsIGV4dGVuZHMgVHJpYW5nbGVNYXRlcmlhbEJhc2Vcbntcblx0cHJpdmF0ZSBfYWxwaGFCbGVuZGluZzpib29sZWFuID0gZmFsc2U7XG5cdHByaXZhdGUgX2FscGhhOm51bWJlciA9IDE7XG5cdHByaXZhdGUgX2NvbG9yVHJhbnNmb3JtOkNvbG9yVHJhbnNmb3JtO1xuXHRwcml2YXRlIF9tYXRlcmlhbE1vZGU6c3RyaW5nO1xuXHRwcml2YXRlIF9jYXN0ZXJMaWdodFBhc3M6VHJpYW5nbGVNZXRob2RQYXNzO1xuXHRwcml2YXRlIF9ub25DYXN0ZXJMaWdodFBhc3NlczpBcnJheTxUcmlhbmdsZU1ldGhvZFBhc3M+O1xuXHRwcml2YXRlIF9zY3JlZW5QYXNzOlRyaWFuZ2xlTWV0aG9kUGFzcztcblxuXHRwcml2YXRlIF9hbWJpZW50TWV0aG9kOkFtYmllbnRCYXNpY01ldGhvZCA9IG5ldyBBbWJpZW50QmFzaWNNZXRob2QoKTtcblx0cHJpdmF0ZSBfc2hhZG93TWV0aG9kOlNoYWRvd01hcE1ldGhvZEJhc2U7XG5cdHByaXZhdGUgX2RpZmZ1c2VNZXRob2Q6RGlmZnVzZUJhc2ljTWV0aG9kID0gbmV3IERpZmZ1c2VCYXNpY01ldGhvZCgpO1xuXHRwcml2YXRlIF9ub3JtYWxNZXRob2Q6Tm9ybWFsQmFzaWNNZXRob2QgPSBuZXcgTm9ybWFsQmFzaWNNZXRob2QoKTtcblx0cHJpdmF0ZSBfc3BlY3VsYXJNZXRob2Q6U3BlY3VsYXJCYXNpY01ldGhvZCA9IG5ldyBTcGVjdWxhckJhc2ljTWV0aG9kKCk7XG5cblxuXHRwcml2YXRlIF9kZXB0aENvbXBhcmVNb2RlOnN0cmluZyA9IENvbnRleHRHTENvbXBhcmVNb2RlLkxFU1NfRVFVQUw7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbCBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB0ZXh0dXJlIFRoZSB0ZXh0dXJlIHVzZWQgZm9yIHRoZSBtYXRlcmlhbCdzIGFsYmVkbyBjb2xvci5cblx0ICogQHBhcmFtIHNtb290aCBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdGV4dHVyZSBzaG91bGQgYmUgZmlsdGVyZWQgd2hlbiBzYW1wbGVkLiBEZWZhdWx0cyB0byB0cnVlLlxuXHQgKiBAcGFyYW0gcmVwZWF0IEluZGljYXRlcyB3aGV0aGVyIHRoZSB0ZXh0dXJlIHNob3VsZCBiZSB0aWxlZCB3aGVuIHNhbXBsZWQuIERlZmF1bHRzIHRvIGZhbHNlLlxuXHQgKiBAcGFyYW0gbWlwbWFwIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBhbnkgdXNlZCB0ZXh0dXJlcyBzaG91bGQgdXNlIG1pcG1hcHBpbmcuIERlZmF1bHRzIHRvIGZhbHNlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IodGV4dHVyZT86VGV4dHVyZTJEQmFzZSwgc21vb3RoPzpib29sZWFuLCByZXBlYXQ/OmJvb2xlYW4sIG1pcG1hcD86Ym9vbGVhbik7XG5cdGNvbnN0cnVjdG9yKGNvbG9yPzpudW1iZXIsIGFscGhhPzpudW1iZXIpO1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlQ29sb3I6YW55ID0gbnVsbCwgc21vb3RoQWxwaGE6YW55ID0gbnVsbCwgcmVwZWF0OmJvb2xlYW4gPSBmYWxzZSwgbWlwbWFwOmJvb2xlYW4gPSBmYWxzZSlcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9tYXRlcmlhbE1vZGUgPSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5TSU5HTEVfUEFTUztcblxuXHRcdGlmICh0ZXh0dXJlQ29sb3IgaW5zdGFuY2VvZiBUZXh0dXJlMkRCYXNlKSB7XG5cdFx0XHR0aGlzLnRleHR1cmUgPSA8VGV4dHVyZTJEQmFzZT4gdGV4dHVyZUNvbG9yO1xuXG5cdFx0XHR0aGlzLnNtb290aCA9IChzbW9vdGhBbHBoYSA9PSBudWxsKT8gdHJ1ZSA6IGZhbHNlO1xuXHRcdFx0dGhpcy5yZXBlYXQgPSByZXBlYXQ7XG5cdFx0XHR0aGlzLm1pcG1hcCA9IG1pcG1hcDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5jb2xvciA9ICh0ZXh0dXJlQ29sb3IgPT0gbnVsbCk/IDB4RkZGRkZGIDogTnVtYmVyKHRleHR1cmVDb2xvcik7XG5cdFx0XHR0aGlzLmFscGhhID0gKHNtb290aEFscGhhID09IG51bGwpPyAxIDogTnVtYmVyKHNtb290aEFscGhhKTtcblx0XHR9XG5cdH1cblxuXG5cdHB1YmxpYyBnZXQgbWF0ZXJpYWxNb2RlKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbWF0ZXJpYWxNb2RlO1xuXHR9XG5cblx0cHVibGljIHNldCBtYXRlcmlhbE1vZGUodmFsdWU6c3RyaW5nKVxuXHR7XG5cdFx0aWYgKHRoaXMuX21hdGVyaWFsTW9kZSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX21hdGVyaWFsTW9kZSA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVTY3JlZW5QYXNzZXMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZGVwdGggY29tcGFyZSBtb2RlIHVzZWQgdG8gcmVuZGVyIHRoZSByZW5kZXJhYmxlcyB1c2luZyB0aGlzIG1hdGVyaWFsLlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkuc3RhZ2VnbC5Db250ZXh0R0xDb21wYXJlTW9kZVxuXHQgKi9cblxuXHRwdWJsaWMgZ2V0IGRlcHRoQ29tcGFyZU1vZGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLl9kZXB0aENvbXBhcmVNb2RlO1xuXHR9XG5cblx0cHVibGljIHNldCBkZXB0aENvbXBhcmVNb2RlKHZhbHVlOnN0cmluZylcblx0e1xuXHRcdGlmICh0aGlzLl9kZXB0aENvbXBhcmVNb2RlID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fZGVwdGhDb21wYXJlTW9kZSA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVTY3JlZW5QYXNzZXMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYWxwaGEgb2YgdGhlIHN1cmZhY2UuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFscGhhKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYWxwaGE7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGFscGhhKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh2YWx1ZSA+IDEpXG5cdFx0XHR2YWx1ZSA9IDE7XG5cdFx0ZWxzZSBpZiAodmFsdWUgPCAwKVxuXHRcdFx0dmFsdWUgPSAwO1xuXG5cdFx0aWYgKHRoaXMuX2FscGhhID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYWxwaGEgPSB2YWx1ZTtcblxuXHRcdGlmICh0aGlzLl9jb2xvclRyYW5zZm9ybSA9PSBudWxsKVxuXHRcdFx0dGhpcy5fY29sb3JUcmFuc2Zvcm0gPSBuZXcgQ29sb3JUcmFuc2Zvcm0oKTtcblxuXHRcdHRoaXMuX2NvbG9yVHJhbnNmb3JtLmFscGhhTXVsdGlwbGllciA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVQYXNzZXMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgQ29sb3JUcmFuc2Zvcm0gb2JqZWN0IHRvIHRyYW5zZm9ybSB0aGUgY29sb3VyIG9mIHRoZSBtYXRlcmlhbCB3aXRoLiBEZWZhdWx0cyB0byBudWxsLlxuXHQgKi9cblx0cHVibGljIGdldCBjb2xvclRyYW5zZm9ybSgpOkNvbG9yVHJhbnNmb3JtXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc2NyZWVuUGFzcy5jb2xvclRyYW5zZm9ybTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgY29sb3JUcmFuc2Zvcm0odmFsdWU6Q29sb3JUcmFuc2Zvcm0pXG5cdHtcblx0XHR0aGlzLl9zY3JlZW5QYXNzLmNvbG9yVHJhbnNmb3JtID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRleHR1cmUgb2JqZWN0IHRvIHVzZSBmb3IgdGhlIGFtYmllbnQgY29sb3VyLlxuXHQgKi9cblx0cHVibGljIGdldCBkaWZmdXNlVGV4dHVyZSgpOlRleHR1cmUyREJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9kaWZmdXNlTWV0aG9kLnRleHR1cmU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGRpZmZ1c2VUZXh0dXJlKHZhbHVlOlRleHR1cmUyREJhc2UpXG5cdHtcblx0XHR0aGlzLl9kaWZmdXNlTWV0aG9kLnRleHR1cmUgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHRoYXQgcHJvdmlkZXMgdGhlIGFtYmllbnQgbGlnaHRpbmcgY29udHJpYnV0aW9uLiBEZWZhdWx0cyB0byBBbWJpZW50QmFzaWNNZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFtYmllbnRNZXRob2QoKTpBbWJpZW50QmFzaWNNZXRob2Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9hbWJpZW50TWV0aG9kO1xuXHR9XG5cblx0cHVibGljIHNldCBhbWJpZW50TWV0aG9kKHZhbHVlOkFtYmllbnRCYXNpY01ldGhvZClcblx0e1xuXHRcdGlmICh0aGlzLl9hbWJpZW50TWV0aG9kID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHZhbHVlICYmIHRoaXMuX2FtYmllbnRNZXRob2QpXG5cdFx0XHR2YWx1ZS5jb3B5RnJvbSh0aGlzLl9hbWJpZW50TWV0aG9kKTtcblxuXHRcdHRoaXMuX2FtYmllbnRNZXRob2QgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlU2NyZWVuUGFzc2VzKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB1c2VkIHRvIHJlbmRlciBzaGFkb3dzIGNhc3Qgb24gdGhpcyBzdXJmYWNlLCBvciBudWxsIGlmIG5vIHNoYWRvd3MgYXJlIHRvIGJlIHJlbmRlcmVkLiBEZWZhdWx0cyB0byBudWxsLlxuXHQgKi9cblx0cHVibGljIGdldCBzaGFkb3dNZXRob2QoKTpTaGFkb3dNYXBNZXRob2RCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc2hhZG93TWV0aG9kO1xuXHR9XG5cblx0cHVibGljIHNldCBzaGFkb3dNZXRob2QodmFsdWU6U2hhZG93TWFwTWV0aG9kQmFzZSlcblx0e1xuXHRcdGlmICh0aGlzLl9zaGFkb3dNZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodmFsdWUgJiYgdGhpcy5fc2hhZG93TWV0aG9kKVxuXHRcdFx0dmFsdWUuY29weUZyb20odGhpcy5fc2hhZG93TWV0aG9kKTtcblxuXHRcdHRoaXMuX3NoYWRvd01ldGhvZCA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVTY3JlZW5QYXNzZXMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHRoYXQgcHJvdmlkZXMgdGhlIGRpZmZ1c2UgbGlnaHRpbmcgY29udHJpYnV0aW9uLiBEZWZhdWx0cyB0byBEaWZmdXNlQmFzaWNNZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGRpZmZ1c2VNZXRob2QoKTpEaWZmdXNlQmFzaWNNZXRob2Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9kaWZmdXNlTWV0aG9kO1xuXHR9XG5cblx0cHVibGljIHNldCBkaWZmdXNlTWV0aG9kKHZhbHVlOkRpZmZ1c2VCYXNpY01ldGhvZClcblx0e1xuXHRcdGlmICh0aGlzLl9kaWZmdXNlTWV0aG9kID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHZhbHVlICYmIHRoaXMuX2RpZmZ1c2VNZXRob2QpXG5cdFx0XHR2YWx1ZS5jb3B5RnJvbSh0aGlzLl9kaWZmdXNlTWV0aG9kKTtcblxuXHRcdHRoaXMuX2RpZmZ1c2VNZXRob2QgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlU2NyZWVuUGFzc2VzKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIHRoZSBzcGVjdWxhciBsaWdodGluZyBjb250cmlidXRpb24uIERlZmF1bHRzIHRvIFNwZWN1bGFyQmFzaWNNZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNwZWN1bGFyTWV0aG9kKCk6U3BlY3VsYXJCYXNpY01ldGhvZFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3NwZWN1bGFyTWV0aG9kO1xuXHR9XG5cblx0cHVibGljIHNldCBzcGVjdWxhck1ldGhvZCh2YWx1ZTpTcGVjdWxhckJhc2ljTWV0aG9kKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3NwZWN1bGFyTWV0aG9kID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHZhbHVlICYmIHRoaXMuX3NwZWN1bGFyTWV0aG9kKVxuXHRcdFx0dmFsdWUuY29weUZyb20odGhpcy5fc3BlY3VsYXJNZXRob2QpO1xuXG5cdFx0dGhpcy5fc3BlY3VsYXJNZXRob2QgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlU2NyZWVuUGFzc2VzKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB1c2VkIHRvIGdlbmVyYXRlIHRoZSBwZXItcGl4ZWwgbm9ybWFscy4gRGVmYXVsdHMgdG8gTm9ybWFsQmFzaWNNZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG5vcm1hbE1ldGhvZCgpOk5vcm1hbEJhc2ljTWV0aG9kXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbm9ybWFsTWV0aG9kO1xuXHR9XG5cblx0cHVibGljIHNldCBub3JtYWxNZXRob2QodmFsdWU6Tm9ybWFsQmFzaWNNZXRob2QpXG5cdHtcblx0XHRpZiAodGhpcy5fbm9ybWFsTWV0aG9kID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHZhbHVlICYmIHRoaXMuX25vcm1hbE1ldGhvZClcblx0XHRcdHZhbHVlLmNvcHlGcm9tKHRoaXMuX25vcm1hbE1ldGhvZCk7XG5cblx0XHR0aGlzLl9ub3JtYWxNZXRob2QgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlU2NyZWVuUGFzc2VzKCk7XG5cdH1cblxuXHQvKipcblx0ICogQXBwZW5kcyBhbiBcImVmZmVjdFwiIHNoYWRpbmcgbWV0aG9kIHRvIHRoZSBzaGFkZXIuIEVmZmVjdCBtZXRob2RzIGFyZSB0aG9zZSB0aGF0IGRvIG5vdCBpbmZsdWVuY2UgdGhlIGxpZ2h0aW5nXG5cdCAqIGJ1dCBtb2R1bGF0ZSB0aGUgc2hhZGVkIGNvbG91ciwgdXNlZCBmb3IgZm9nLCBvdXRsaW5lcywgZXRjLiBUaGUgbWV0aG9kIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcmVzdWx0IG9mIHRoZVxuXHQgKiBtZXRob2RzIGFkZGVkIHByaW9yLlxuXHQgKi9cblx0cHVibGljIGFkZEVmZmVjdE1ldGhvZChtZXRob2Q6RWZmZWN0TWV0aG9kQmFzZSlcblx0e1xuXHRcdGlmICh0aGlzLl9zY3JlZW5QYXNzID09IG51bGwpXG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzID0gbmV3IFRyaWFuZ2xlTWV0aG9kUGFzcygpO1xuXG5cdFx0dGhpcy5fc2NyZWVuUGFzcy5hZGRFZmZlY3RNZXRob2QobWV0aG9kKTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlU2NyZWVuUGFzc2VzKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG51bWJlciBvZiBcImVmZmVjdFwiIG1ldGhvZHMgYWRkZWQgdG8gdGhlIG1hdGVyaWFsLlxuXHQgKi9cblx0cHVibGljIGdldCBudW1FZmZlY3RNZXRob2RzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc2NyZWVuUGFzcz8gdGhpcy5fc2NyZWVuUGFzcy5udW1FZmZlY3RNZXRob2RzIDogMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBRdWVyaWVzIHdoZXRoZXIgYSBnaXZlbiBlZmZlY3QgbWV0aG9kIHdhcyBhZGRlZCB0byB0aGUgbWF0ZXJpYWwuXG5cdCAqXG5cdCAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCB0byBiZSBxdWVyaWVkLlxuXHQgKiBAcmV0dXJuIHRydWUgaWYgdGhlIG1ldGhvZCB3YXMgYWRkZWQgdG8gdGhlIG1hdGVyaWFsLCBmYWxzZSBvdGhlcndpc2UuXG5cdCAqL1xuXHRwdWJsaWMgaGFzRWZmZWN0TWV0aG9kKG1ldGhvZDpFZmZlY3RNZXRob2RCYXNlKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc2NyZWVuUGFzcz8gdGhpcy5fc2NyZWVuUGFzcy5oYXNFZmZlY3RNZXRob2QobWV0aG9kKSA6IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG1ldGhvZCBhZGRlZCBhdCB0aGUgZ2l2ZW4gaW5kZXguXG5cdCAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG1ldGhvZCB0byByZXRyaWV2ZS5cblx0ICogQHJldHVybiBUaGUgbWV0aG9kIGF0IHRoZSBnaXZlbiBpbmRleC5cblx0ICovXG5cdHB1YmxpYyBnZXRFZmZlY3RNZXRob2RBdChpbmRleDpudW1iZXIpOkVmZmVjdE1ldGhvZEJhc2Vcblx0e1xuXHRcdGlmICh0aGlzLl9zY3JlZW5QYXNzID09IG51bGwpXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdHJldHVybiB0aGlzLl9zY3JlZW5QYXNzLmdldEVmZmVjdE1ldGhvZEF0KGluZGV4KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIGFuIGVmZmVjdCBtZXRob2QgYXQgdGhlIHNwZWNpZmllZCBpbmRleCBhbW9uZ3N0IHRoZSBtZXRob2RzIGFscmVhZHkgYWRkZWQgdG8gdGhlIG1hdGVyaWFsLiBFZmZlY3Rcblx0ICogbWV0aG9kcyBhcmUgdGhvc2UgdGhhdCBkbyBub3QgaW5mbHVlbmNlIHRoZSBsaWdodGluZyBidXQgbW9kdWxhdGUgdGhlIHNoYWRlZCBjb2xvdXIsIHVzZWQgZm9yIGZvZywgb3V0bGluZXMsXG5cdCAqIGV0Yy4gVGhlIG1ldGhvZCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHJlc3VsdCBvZiB0aGUgbWV0aG9kcyB3aXRoIGEgbG93ZXIgaW5kZXguXG5cdCAqL1xuXHRwdWJsaWMgYWRkRWZmZWN0TWV0aG9kQXQobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UsIGluZGV4Om51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9zY3JlZW5QYXNzID09IG51bGwpXG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzID0gbmV3IFRyaWFuZ2xlTWV0aG9kUGFzcygpO1xuXG5cdFx0dGhpcy5fc2NyZWVuUGFzcy5hZGRFZmZlY3RNZXRob2RBdChtZXRob2QsIGluZGV4KTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlUGFzc2VzKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBhbiBlZmZlY3QgbWV0aG9kIGZyb20gdGhlIG1hdGVyaWFsLlxuXHQgKiBAcGFyYW0gbWV0aG9kIFRoZSBtZXRob2QgdG8gYmUgcmVtb3ZlZC5cblx0ICovXG5cdHB1YmxpYyByZW1vdmVFZmZlY3RNZXRob2QobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UpXG5cdHtcblx0XHRpZiAodGhpcy5fc2NyZWVuUGFzcyA9PSBudWxsKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fc2NyZWVuUGFzcy5yZW1vdmVFZmZlY3RNZXRob2QobWV0aG9kKTtcblxuXHRcdC8vIHJlY29uc2lkZXJcblx0XHRpZiAodGhpcy5fc2NyZWVuUGFzcy5udW1FZmZlY3RNZXRob2RzID09IDApXG5cdFx0XHR0aGlzLl9wSW52YWxpZGF0ZVBhc3NlcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBub3JtYWwgbWFwIHRvIG1vZHVsYXRlIHRoZSBkaXJlY3Rpb24gb2YgdGhlIHN1cmZhY2UgZm9yIGVhY2ggdGV4ZWwuIFRoZSBkZWZhdWx0IG5vcm1hbCBtZXRob2QgZXhwZWN0c1xuXHQgKiB0YW5nZW50LXNwYWNlIG5vcm1hbCBtYXBzLCBidXQgb3RoZXJzIGNvdWxkIGV4cGVjdCBvYmplY3Qtc3BhY2UgbWFwcy5cblx0ICovXG5cdHB1YmxpYyBnZXQgbm9ybWFsTWFwKCk6VGV4dHVyZTJEQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX25vcm1hbE1ldGhvZC5ub3JtYWxNYXA7XG5cdH1cblxuXHRwdWJsaWMgc2V0IG5vcm1hbE1hcCh2YWx1ZTpUZXh0dXJlMkRCYXNlKVxuXHR7XG5cdFx0dGhpcy5fbm9ybWFsTWV0aG9kLm5vcm1hbE1hcCA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgc3BlY3VsYXIgbWFwIHRoYXQgZGVmaW5lcyB0aGUgc3RyZW5ndGggb2Ygc3BlY3VsYXIgcmVmbGVjdGlvbnMgZm9yIGVhY2ggdGV4ZWwgaW4gdGhlIHJlZCBjaGFubmVsLFxuXHQgKiBhbmQgdGhlIGdsb3NzIGZhY3RvciBpbiB0aGUgZ3JlZW4gY2hhbm5lbC4gWW91IGNhbiB1c2UgU3BlY3VsYXJCaXRtYXBUZXh0dXJlIGlmIHlvdSB3YW50IHRvIGVhc2lseSBzZXRcblx0ICogc3BlY3VsYXIgYW5kIGdsb3NzIG1hcHMgZnJvbSBncmF5c2NhbGUgaW1hZ2VzLCBidXQgY29ycmVjdGx5IGF1dGhvcmVkIGltYWdlcyBhcmUgcHJlZmVycmVkLlxuXHQgKi9cblx0cHVibGljIGdldCBzcGVjdWxhck1hcCgpOlRleHR1cmUyREJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zcGVjdWxhck1ldGhvZC50ZXh0dXJlO1xuXHR9XG5cblx0cHVibGljIHNldCBzcGVjdWxhck1hcCh2YWx1ZTpUZXh0dXJlMkRCYXNlKVxuXHR7XG5cdFx0dGhpcy5fc3BlY3VsYXJNZXRob2QudGV4dHVyZSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBnbG9zc2luZXNzIG9mIHRoZSBtYXRlcmlhbCAoc2hhcnBuZXNzIG9mIHRoZSBzcGVjdWxhciBoaWdobGlnaHQpLlxuXHQgKi9cblx0cHVibGljIGdldCBnbG9zcygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3NwZWN1bGFyTWV0aG9kLmdsb3NzO1xuXHR9XG5cblx0cHVibGljIHNldCBnbG9zcyh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9zcGVjdWxhck1ldGhvZC5nbG9zcyA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBzdHJlbmd0aCBvZiB0aGUgYW1iaWVudCByZWZsZWN0aW9uLlxuXHQgKi9cblx0cHVibGljIGdldCBhbWJpZW50KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYW1iaWVudE1ldGhvZC5hbWJpZW50O1xuXHR9XG5cblx0cHVibGljIHNldCBhbWJpZW50KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX2FtYmllbnRNZXRob2QuYW1iaWVudCA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBvdmVyYWxsIHN0cmVuZ3RoIG9mIHRoZSBzcGVjdWxhciByZWZsZWN0aW9uLlxuXHQgKi9cblx0cHVibGljIGdldCBzcGVjdWxhcigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3NwZWN1bGFyTWV0aG9kLnNwZWN1bGFyO1xuXHR9XG5cblx0cHVibGljIHNldCBzcGVjdWxhcih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9zcGVjdWxhck1ldGhvZC5zcGVjdWxhciA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBjb2xvdXIgb2YgdGhlIGFtYmllbnQgcmVmbGVjdGlvbi5cblx0ICovXG5cdHB1YmxpYyBnZXQgYW1iaWVudENvbG9yKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZGlmZnVzZU1ldGhvZC5hbWJpZW50Q29sb3I7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGFtYmllbnRDb2xvcih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9kaWZmdXNlTWV0aG9kLmFtYmllbnRDb2xvciA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBjb2xvdXIgb2YgdGhlIGRpZmZ1c2UgcmVmbGVjdGlvbi5cblx0ICovXG5cdHB1YmxpYyBnZXQgZGlmZnVzZUNvbG9yKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZGlmZnVzZU1ldGhvZC5kaWZmdXNlQ29sb3I7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGRpZmZ1c2VDb2xvcih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9kaWZmdXNlTWV0aG9kLmRpZmZ1c2VDb2xvciA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBjb2xvdXIgb2YgdGhlIHNwZWN1bGFyIHJlZmxlY3Rpb24uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNwZWN1bGFyQ29sb3IoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zcGVjdWxhck1ldGhvZC5zcGVjdWxhckNvbG9yO1xuXHR9XG5cblx0cHVibGljIHNldCBzcGVjdWxhckNvbG9yKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3NwZWN1bGFyTWV0aG9kLnNwZWN1bGFyQ29sb3IgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdGhlIG1hdGVyaWFsIGhhcyB0cmFuc3BhcmVuY3kuIElmIGJpbmFyeSB0cmFuc3BhcmVuY3kgaXMgc3VmZmljaWVudCwgZm9yXG5cdCAqIGV4YW1wbGUgd2hlbiB1c2luZyB0ZXh0dXJlcyBvZiBmb2xpYWdlLCBjb25zaWRlciB1c2luZyBhbHBoYVRocmVzaG9sZCBpbnN0ZWFkLlxuXHQgKi9cblxuXHRwdWJsaWMgZ2V0IGFscGhhQmxlbmRpbmcoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYWxwaGFCbGVuZGluZztcblx0fVxuXG5cdHB1YmxpYyBzZXQgYWxwaGFCbGVuZGluZyh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2FscGhhQmxlbmRpbmcgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9hbHBoYUJsZW5kaW5nID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wSW52YWxpZGF0ZVBhc3NlcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lVcGRhdGVNYXRlcmlhbCgpXG5cdHtcblx0XHRpZiAodGhpcy5fcFNjcmVlblBhc3Nlc0ludmFsaWQpIHtcblx0XHRcdC8vVXBkYXRlcyBzY3JlZW4gcGFzc2VzIHdoZW4gdGhleSB3ZXJlIGZvdW5kIHRvIGJlIGludmFsaWQuXG5cdFx0XHR0aGlzLl9wU2NyZWVuUGFzc2VzSW52YWxpZCA9IGZhbHNlO1xuXG5cdFx0XHR0aGlzLmluaXRQYXNzZXMoKTtcblxuXHRcdFx0dGhpcy5zZXRCbGVuZEFuZENvbXBhcmVNb2RlcygpO1xuXG5cdFx0XHR0aGlzLl9wQ2xlYXJTY3JlZW5QYXNzZXMoKTtcblxuXHRcdFx0aWYgKHRoaXMuX21hdGVyaWFsTW9kZSA9PSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5NVUxUSV9QQVNTKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9jYXN0ZXJMaWdodFBhc3MpXG5cdFx0XHRcdFx0dGhpcy5fcEFkZFNjcmVlblBhc3ModGhpcy5fY2FzdGVyTGlnaHRQYXNzKTtcblxuXHRcdFx0XHRpZiAodGhpcy5fbm9uQ2FzdGVyTGlnaHRQYXNzZXMpXG5cdFx0XHRcdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy5fbm9uQ2FzdGVyTGlnaHRQYXNzZXMubGVuZ3RoOyArK2kpXG5cdFx0XHRcdFx0XHR0aGlzLl9wQWRkU2NyZWVuUGFzcyh0aGlzLl9ub25DYXN0ZXJMaWdodFBhc3Nlc1tpXSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl9zY3JlZW5QYXNzKVxuXHRcdFx0XHR0aGlzLl9wQWRkU2NyZWVuUGFzcyh0aGlzLl9zY3JlZW5QYXNzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZXMgYWxsIHRoZSBwYXNzZXMgYW5kIHRoZWlyIGRlcGVuZGVudCBwYXNzZXMuXG5cdCAqL1xuXHRwcml2YXRlIGluaXRQYXNzZXMoKVxuXHR7XG5cdFx0Ly8gbGV0IHRoZSBlZmZlY3RzIHBhc3MgaGFuZGxlIGV2ZXJ5dGhpbmcgaWYgdGhlcmUgYXJlIG5vIGxpZ2h0cywgd2hlbiB0aGVyZSBhcmUgZWZmZWN0IG1ldGhvZHMgYXBwbGllZFxuXHRcdC8vIGFmdGVyIHNoYWRpbmcsIG9yIHdoZW4gdGhlIG1hdGVyaWFsIG1vZGUgaXMgc2luZ2xlIHBhc3MuXG5cdFx0aWYgKHRoaXMubnVtTGlnaHRzID09IDAgfHwgdGhpcy5udW1FZmZlY3RNZXRob2RzID4gMCB8fCB0aGlzLl9tYXRlcmlhbE1vZGUgPT0gVHJpYW5nbGVNYXRlcmlhbE1vZGUuU0lOR0xFX1BBU1MpXG5cdFx0XHR0aGlzLmluaXRFZmZlY3RQYXNzKCk7XG5cdFx0ZWxzZSBpZiAodGhpcy5fc2NyZWVuUGFzcylcblx0XHRcdHRoaXMucmVtb3ZlRWZmZWN0UGFzcygpO1xuXG5cdFx0Ly8gb25seSB1c2UgYSBjYXN0ZXIgbGlnaHQgcGFzcyBpZiBzaGFkb3dzIG5lZWQgdG8gYmUgcmVuZGVyZWRcblx0XHRpZiAodGhpcy5fc2hhZG93TWV0aG9kICYmIHRoaXMuX21hdGVyaWFsTW9kZSA9PSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5NVUxUSV9QQVNTKVxuXHRcdFx0dGhpcy5pbml0Q2FzdGVyTGlnaHRQYXNzKCk7XG5cdFx0ZWxzZSBpZiAodGhpcy5fY2FzdGVyTGlnaHRQYXNzKVxuXHRcdFx0dGhpcy5yZW1vdmVDYXN0ZXJMaWdodFBhc3MoKTtcblxuXHRcdC8vIG9ubHkgdXNlIG5vbiBjYXN0ZXIgbGlnaHQgcGFzc2VzIGlmIHRoZXJlIGFyZSBsaWdodHMgdGhhdCBkb24ndCBjYXN0XG5cdFx0aWYgKHRoaXMubnVtTm9uQ2FzdGVycyA+IDAgJiYgdGhpcy5fbWF0ZXJpYWxNb2RlID09IFRyaWFuZ2xlTWF0ZXJpYWxNb2RlLk1VTFRJX1BBU1MpXG5cdFx0XHR0aGlzLmluaXROb25DYXN0ZXJMaWdodFBhc3NlcygpO1xuXHRcdGVsc2UgaWYgKHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzKVxuXHRcdFx0dGhpcy5yZW1vdmVOb25DYXN0ZXJMaWdodFBhc3NlcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdXAgdGhlIHZhcmlvdXMgYmxlbmRpbmcgbW9kZXMgZm9yIGFsbCBzY3JlZW4gcGFzc2VzLCBiYXNlZCBvbiB3aGV0aGVyIG9yIG5vdCB0aGVyZSBhcmUgcHJldmlvdXMgcGFzc2VzLlxuXHQgKi9cblx0cHJpdmF0ZSBzZXRCbGVuZEFuZENvbXBhcmVNb2RlcygpXG5cdHtcblx0XHR2YXIgZm9yY2VTZXBhcmF0ZU1WUDpib29sZWFuID0gQm9vbGVhbih0aGlzLl9jYXN0ZXJMaWdodFBhc3MgfHwgdGhpcy5fc2NyZWVuUGFzcyk7XG5cblx0XHQvLyBjYXN0ZXIgbGlnaHQgcGFzcyBpcyBhbHdheXMgZmlyc3QgaWYgaXQgZXhpc3RzLCBoZW5jZSBpdCB1c2VzIG5vcm1hbCBibGVuZGluZ1xuXHRcdGlmICh0aGlzLl9jYXN0ZXJMaWdodFBhc3MpIHtcblx0XHRcdHRoaXMuX2Nhc3RlckxpZ2h0UGFzcy5mb3JjZVNlcGFyYXRlTVZQID0gZm9yY2VTZXBhcmF0ZU1WUDtcblx0XHRcdHRoaXMuX2Nhc3RlckxpZ2h0UGFzcy5zZXRCbGVuZE1vZGUoQmxlbmRNb2RlLk5PUk1BTCk7XG5cdFx0XHR0aGlzLl9jYXN0ZXJMaWdodFBhc3MuZGVwdGhDb21wYXJlTW9kZSA9IHRoaXMuX2RlcHRoQ29tcGFyZU1vZGU7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzKSB7XG5cdFx0XHR2YXIgZmlyc3RBZGRpdGl2ZUluZGV4Om51bWJlciA9IDA7XG5cblx0XHRcdC8vIGlmIHRoZXJlJ3Mgbm8gY2FzdGVyIGxpZ2h0IHBhc3MsIHRoZSBmaXJzdCBub24gY2FzdGVyIGxpZ2h0IHBhc3Mgd2lsbCBiZSB0aGUgZmlyc3Rcblx0XHRcdC8vIGFuZCBzaG91bGQgdXNlIG5vcm1hbCBibGVuZGluZ1xuXHRcdFx0aWYgKCF0aGlzLl9jYXN0ZXJMaWdodFBhc3MpIHtcblx0XHRcdFx0dGhpcy5fbm9uQ2FzdGVyTGlnaHRQYXNzZXNbMF0uZm9yY2VTZXBhcmF0ZU1WUCA9IGZvcmNlU2VwYXJhdGVNVlA7XG5cdFx0XHRcdHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzWzBdLnNldEJsZW5kTW9kZShCbGVuZE1vZGUuTk9STUFMKTtcblx0XHRcdFx0dGhpcy5fbm9uQ2FzdGVyTGlnaHRQYXNzZXNbMF0uZGVwdGhDb21wYXJlTW9kZSA9IHRoaXMuX2RlcHRoQ29tcGFyZU1vZGU7XG5cdFx0XHRcdGZpcnN0QWRkaXRpdmVJbmRleCA9IDE7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGFsbCBsaWdodGluZyBwYXNzZXMgZm9sbG93aW5nIHRoZSBmaXJzdCBsaWdodCBwYXNzIHNob3VsZCB1c2UgYWRkaXRpdmUgYmxlbmRpbmdcblx0XHRcdGZvciAodmFyIGk6bnVtYmVyID0gZmlyc3RBZGRpdGl2ZUluZGV4OyBpIDwgdGhpcy5fbm9uQ2FzdGVyTGlnaHRQYXNzZXMubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0dGhpcy5fbm9uQ2FzdGVyTGlnaHRQYXNzZXNbaV0uZm9yY2VTZXBhcmF0ZU1WUCA9IGZvcmNlU2VwYXJhdGVNVlA7XG5cdFx0XHRcdHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzW2ldLnNldEJsZW5kTW9kZShCbGVuZE1vZGUuQUREKTtcblx0XHRcdFx0dGhpcy5fbm9uQ2FzdGVyTGlnaHRQYXNzZXNbaV0uZGVwdGhDb21wYXJlTW9kZSA9IENvbnRleHRHTENvbXBhcmVNb2RlLkxFU1NfRVFVQUw7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2Nhc3RlckxpZ2h0UGFzcyB8fCB0aGlzLl9ub25DYXN0ZXJMaWdodFBhc3Nlcykge1xuXHRcdFx0Ly9jYW5ub3QgYmUgYmxlbmRlZCBieSBibGVuZG1vZGUgcHJvcGVydHkgaWYgbXVsdGlwYXNzIGVuYWJsZWRcblx0XHRcdHRoaXMuX3BSZXF1aXJlc0JsZW5kaW5nID0gZmFsc2U7XG5cblx0XHRcdC8vIHRoZXJlIGFyZSBsaWdodCBwYXNzZXMsIHNvIHRoaXMgc2hvdWxkIGJlIGJsZW5kZWQgaW5cblx0XHRcdGlmICh0aGlzLl9zY3JlZW5QYXNzKSB7XG5cdFx0XHRcdHRoaXMuX3NjcmVlblBhc3MucGFzc01vZGUgPSBNYXRlcmlhbFBhc3NNb2RlLkVGRkVDVFM7XG5cdFx0XHRcdHRoaXMuX3NjcmVlblBhc3MuZGVwdGhDb21wYXJlTW9kZSA9IENvbnRleHRHTENvbXBhcmVNb2RlLkxFU1NfRVFVQUw7XG5cdFx0XHRcdHRoaXMuX3NjcmVlblBhc3Muc2V0QmxlbmRNb2RlKEJsZW5kTW9kZS5MQVlFUik7XG5cdFx0XHRcdHRoaXMuX3NjcmVlblBhc3MuZm9yY2VTZXBhcmF0ZU1WUCA9IGZvcmNlU2VwYXJhdGVNVlA7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2UgaWYgKHRoaXMuX3NjcmVlblBhc3MpIHtcblx0XHRcdHRoaXMuX3BSZXF1aXJlc0JsZW5kaW5nID0gKHRoaXMuX3BCbGVuZE1vZGUgIT0gQmxlbmRNb2RlLk5PUk1BTCB8fCB0aGlzLl9hbHBoYUJsZW5kaW5nIHx8ICh0aGlzLl9jb2xvclRyYW5zZm9ybSAmJiB0aGlzLl9jb2xvclRyYW5zZm9ybS5hbHBoYU11bHRpcGxpZXIgPCAxKSk7XG5cdFx0XHQvLyBlZmZlY3RzIHBhc3MgaXMgdGhlIG9ubHkgcGFzcywgc28gaXQgc2hvdWxkIGp1c3QgYmxlbmQgbm9ybWFsbHlcblx0XHRcdHRoaXMuX3NjcmVlblBhc3MucGFzc01vZGUgPSBNYXRlcmlhbFBhc3NNb2RlLlNVUEVSX1NIQURFUjtcblx0XHRcdHRoaXMuX3NjcmVlblBhc3MuZGVwdGhDb21wYXJlTW9kZSA9IHRoaXMuX2RlcHRoQ29tcGFyZU1vZGU7XG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzLnByZXNlcnZlQWxwaGEgPSB0aGlzLl9wUmVxdWlyZXNCbGVuZGluZztcblx0XHRcdHRoaXMuX3NjcmVlblBhc3MuY29sb3JUcmFuc2Zvcm0gPSB0aGlzLl9jb2xvclRyYW5zZm9ybTtcblx0XHRcdHRoaXMuX3NjcmVlblBhc3Muc2V0QmxlbmRNb2RlKCh0aGlzLl9wQmxlbmRNb2RlID09IEJsZW5kTW9kZS5OT1JNQUwgJiYgdGhpcy5fcFJlcXVpcmVzQmxlbmRpbmcpPyBCbGVuZE1vZGUuTEFZRVIgOiB0aGlzLl9wQmxlbmRNb2RlKTtcblx0XHRcdHRoaXMuX3NjcmVlblBhc3MuZm9yY2VTZXBhcmF0ZU1WUCA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgaW5pdENhc3RlckxpZ2h0UGFzcygpXG5cdHtcblxuXHRcdGlmICh0aGlzLl9jYXN0ZXJMaWdodFBhc3MgPT0gbnVsbClcblx0XHRcdHRoaXMuX2Nhc3RlckxpZ2h0UGFzcyA9IG5ldyBUcmlhbmdsZU1ldGhvZFBhc3MoTWF0ZXJpYWxQYXNzTW9kZS5MSUdIVElORyk7XG5cblx0XHR0aGlzLl9jYXN0ZXJMaWdodFBhc3MubGlnaHRQaWNrZXIgPSBuZXcgU3RhdGljTGlnaHRQaWNrZXIoW3RoaXMuX3NoYWRvd01ldGhvZC5jYXN0aW5nTGlnaHRdKTtcblx0XHR0aGlzLl9jYXN0ZXJMaWdodFBhc3Muc2hhZG93TWV0aG9kID0gdGhpcy5fc2hhZG93TWV0aG9kO1xuXHRcdHRoaXMuX2Nhc3RlckxpZ2h0UGFzcy5kaWZmdXNlTWV0aG9kID0gdGhpcy5fZGlmZnVzZU1ldGhvZDtcblx0XHR0aGlzLl9jYXN0ZXJMaWdodFBhc3MuYW1iaWVudE1ldGhvZCA9IHRoaXMuX2FtYmllbnRNZXRob2Q7XG5cdFx0dGhpcy5fY2FzdGVyTGlnaHRQYXNzLm5vcm1hbE1ldGhvZCA9IHRoaXMuX25vcm1hbE1ldGhvZDtcblx0XHR0aGlzLl9jYXN0ZXJMaWdodFBhc3Muc3BlY3VsYXJNZXRob2QgPSB0aGlzLl9zcGVjdWxhck1ldGhvZDtcblx0fVxuXG5cdHByaXZhdGUgcmVtb3ZlQ2FzdGVyTGlnaHRQYXNzKClcblx0e1xuXHRcdHRoaXMuX2Nhc3RlckxpZ2h0UGFzcy5kaXNwb3NlKCk7XG5cdFx0dGhpcy5fcFJlbW92ZVNjcmVlblBhc3ModGhpcy5fY2FzdGVyTGlnaHRQYXNzKTtcblx0XHR0aGlzLl9jYXN0ZXJMaWdodFBhc3MgPSBudWxsO1xuXHR9XG5cblx0cHJpdmF0ZSBpbml0Tm9uQ2FzdGVyTGlnaHRQYXNzZXMoKVxuXHR7XG5cdFx0dGhpcy5yZW1vdmVOb25DYXN0ZXJMaWdodFBhc3NlcygpO1xuXHRcdHZhciBwYXNzOlRyaWFuZ2xlTWV0aG9kUGFzcztcblx0XHR2YXIgbnVtRGlyTGlnaHRzOm51bWJlciA9IHRoaXMuX3BMaWdodFBpY2tlci5udW1EaXJlY3Rpb25hbExpZ2h0cztcblx0XHR2YXIgbnVtUG9pbnRMaWdodHM6bnVtYmVyID0gdGhpcy5fcExpZ2h0UGlja2VyLm51bVBvaW50TGlnaHRzO1xuXHRcdHZhciBudW1MaWdodFByb2JlczpudW1iZXIgPSB0aGlzLl9wTGlnaHRQaWNrZXIubnVtTGlnaHRQcm9iZXM7XG5cdFx0dmFyIGRpckxpZ2h0T2Zmc2V0Om51bWJlciA9IDA7XG5cdFx0dmFyIHBvaW50TGlnaHRPZmZzZXQ6bnVtYmVyID0gMDtcblx0XHR2YXIgcHJvYmVPZmZzZXQ6bnVtYmVyID0gMDtcblxuXHRcdGlmICghdGhpcy5fY2FzdGVyTGlnaHRQYXNzKSB7XG5cdFx0XHRudW1EaXJMaWdodHMgKz0gdGhpcy5fcExpZ2h0UGlja2VyLm51bUNhc3RpbmdEaXJlY3Rpb25hbExpZ2h0cztcblx0XHRcdG51bVBvaW50TGlnaHRzICs9IHRoaXMuX3BMaWdodFBpY2tlci5udW1DYXN0aW5nUG9pbnRMaWdodHM7XG5cdFx0fVxuXG5cdFx0dGhpcy5fbm9uQ2FzdGVyTGlnaHRQYXNzZXMgPSBuZXcgQXJyYXk8VHJpYW5nbGVNZXRob2RQYXNzPigpO1xuXG5cdFx0d2hpbGUgKGRpckxpZ2h0T2Zmc2V0IDwgbnVtRGlyTGlnaHRzIHx8IHBvaW50TGlnaHRPZmZzZXQgPCBudW1Qb2ludExpZ2h0cyB8fCBwcm9iZU9mZnNldCA8IG51bUxpZ2h0UHJvYmVzKSB7XG5cdFx0XHRwYXNzID0gbmV3IFRyaWFuZ2xlTWV0aG9kUGFzcyhNYXRlcmlhbFBhc3NNb2RlLkxJR0hUSU5HKTtcblx0XHRcdHBhc3MuaW5jbHVkZUNhc3RlcnMgPSB0aGlzLl9zaGFkb3dNZXRob2QgPT0gbnVsbDtcblx0XHRcdHBhc3MuZGlyZWN0aW9uYWxMaWdodHNPZmZzZXQgPSBkaXJMaWdodE9mZnNldDtcblx0XHRcdHBhc3MucG9pbnRMaWdodHNPZmZzZXQgPSBwb2ludExpZ2h0T2Zmc2V0O1xuXHRcdFx0cGFzcy5saWdodFByb2Jlc09mZnNldCA9IHByb2JlT2Zmc2V0O1xuXHRcdFx0cGFzcy5saWdodFBpY2tlciA9IHRoaXMuX3BMaWdodFBpY2tlcjtcblx0XHRcdHBhc3MuZGlmZnVzZU1ldGhvZCA9IHRoaXMuX2RpZmZ1c2VNZXRob2Q7XG5cdFx0XHRwYXNzLmFtYmllbnRNZXRob2QgPSB0aGlzLl9hbWJpZW50TWV0aG9kO1xuXHRcdFx0cGFzcy5ub3JtYWxNZXRob2QgPSB0aGlzLl9ub3JtYWxNZXRob2Q7XG5cdFx0XHRwYXNzLnNwZWN1bGFyTWV0aG9kID0gdGhpcy5fc3BlY3VsYXJNZXRob2Q7XG5cdFx0XHR0aGlzLl9ub25DYXN0ZXJMaWdodFBhc3Nlcy5wdXNoKHBhc3MpO1xuXG5cdFx0XHRkaXJMaWdodE9mZnNldCArPSBwYXNzLmlOdW1EaXJlY3Rpb25hbExpZ2h0cztcblx0XHRcdHBvaW50TGlnaHRPZmZzZXQgKz0gcGFzcy5pTnVtUG9pbnRMaWdodHM7XG5cdFx0XHRwcm9iZU9mZnNldCArPSBwYXNzLmlOdW1MaWdodFByb2Jlcztcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHJlbW92ZU5vbkNhc3RlckxpZ2h0UGFzc2VzKClcblx0e1xuXHRcdGlmICghdGhpcy5fbm9uQ2FzdGVyTGlnaHRQYXNzZXMpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCB0aGlzLl9ub25DYXN0ZXJMaWdodFBhc3Nlcy5sZW5ndGg7ICsraSlcblx0XHRcdHRoaXMuX3BSZW1vdmVTY3JlZW5QYXNzKHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzW2ldKTtcblxuXHRcdHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzID0gbnVsbDtcblx0fVxuXG5cdHByaXZhdGUgcmVtb3ZlRWZmZWN0UGFzcygpXG5cdHtcblx0XHRpZiAodGhpcy5fc2NyZWVuUGFzcy5hbWJpZW50TWV0aG9kICE9IHRoaXMuX2FtYmllbnRNZXRob2QpXG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzLmFtYmllbnRNZXRob2QuZGlzcG9zZSgpO1xuXG5cdFx0aWYgKHRoaXMuX3NjcmVlblBhc3MuZGlmZnVzZU1ldGhvZCAhPSB0aGlzLl9kaWZmdXNlTWV0aG9kKVxuXHRcdFx0dGhpcy5fc2NyZWVuUGFzcy5kaWZmdXNlTWV0aG9kLmRpc3Bvc2UoKTtcblxuXHRcdGlmICh0aGlzLl9zY3JlZW5QYXNzLnNwZWN1bGFyTWV0aG9kICE9IHRoaXMuX3NwZWN1bGFyTWV0aG9kKVxuXHRcdFx0dGhpcy5fc2NyZWVuUGFzcy5zcGVjdWxhck1ldGhvZC5kaXNwb3NlKCk7XG5cblx0XHRpZiAodGhpcy5fc2NyZWVuUGFzcy5ub3JtYWxNZXRob2QgIT0gdGhpcy5fbm9ybWFsTWV0aG9kKVxuXHRcdFx0dGhpcy5fc2NyZWVuUGFzcy5ub3JtYWxNZXRob2QuZGlzcG9zZSgpO1xuXG5cdFx0dGhpcy5fcFJlbW92ZVNjcmVlblBhc3ModGhpcy5fc2NyZWVuUGFzcyk7XG5cdFx0dGhpcy5fc2NyZWVuUGFzcyA9IG51bGw7XG5cdH1cblxuXHRwcml2YXRlIGluaXRFZmZlY3RQYXNzKClcblx0e1xuXHRcdGlmICh0aGlzLl9zY3JlZW5QYXNzID09IG51bGwpXG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzID0gbmV3IFRyaWFuZ2xlTWV0aG9kUGFzcygpO1xuXG5cdFx0aWYgKHRoaXMuX21hdGVyaWFsTW9kZSA9PSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5TSU5HTEVfUEFTUykge1xuXHRcdFx0dGhpcy5fc2NyZWVuUGFzcy5hbWJpZW50TWV0aG9kID0gdGhpcy5fYW1iaWVudE1ldGhvZDtcblx0XHRcdHRoaXMuX3NjcmVlblBhc3MuZGlmZnVzZU1ldGhvZCA9IHRoaXMuX2RpZmZ1c2VNZXRob2Q7XG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzLnNwZWN1bGFyTWV0aG9kID0gdGhpcy5fc3BlY3VsYXJNZXRob2Q7XG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzLm5vcm1hbE1ldGhvZCA9IHRoaXMuX25vcm1hbE1ldGhvZDtcblx0XHRcdHRoaXMuX3NjcmVlblBhc3Muc2hhZG93TWV0aG9kID0gdGhpcy5fc2hhZG93TWV0aG9kO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5fbWF0ZXJpYWxNb2RlID09IFRyaWFuZ2xlTWF0ZXJpYWxNb2RlLk1VTFRJX1BBU1MpIHtcblx0XHRcdGlmICh0aGlzLm51bUxpZ2h0cyA9PSAwKSB7XG5cdFx0XHRcdHRoaXMuX3NjcmVlblBhc3MuYW1iaWVudE1ldGhvZCA9IHRoaXMuX2FtYmllbnRNZXRob2Q7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9zY3JlZW5QYXNzLmFtYmllbnRNZXRob2QgPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzLnByZXNlcnZlQWxwaGEgPSBmYWxzZTtcblx0XHRcdHRoaXMuX3NjcmVlblBhc3Mubm9ybWFsTWV0aG9kID0gdGhpcy5fbm9ybWFsTWV0aG9kO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWF4aW11bSB0b3RhbCBudW1iZXIgb2YgbGlnaHRzIHByb3ZpZGVkIGJ5IHRoZSBsaWdodCBwaWNrZXIuXG5cdCAqL1xuXHRwcml2YXRlIGdldCBudW1MaWdodHMoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wTGlnaHRQaWNrZXI/IHRoaXMuX3BMaWdodFBpY2tlci5udW1MaWdodFByb2JlcyArIHRoaXMuX3BMaWdodFBpY2tlci5udW1EaXJlY3Rpb25hbExpZ2h0cyArIHRoaXMuX3BMaWdodFBpY2tlci5udW1Qb2ludExpZ2h0cyArIHRoaXMuX3BMaWdodFBpY2tlci5udW1DYXN0aW5nRGlyZWN0aW9uYWxMaWdodHMgKyB0aGlzLl9wTGlnaHRQaWNrZXIubnVtQ2FzdGluZ1BvaW50TGlnaHRzIDogMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYW1vdW50IG9mIGxpZ2h0cyB0aGF0IGRvbid0IGNhc3Qgc2hhZG93cy5cblx0ICovXG5cdHByaXZhdGUgZ2V0IG51bU5vbkNhc3RlcnMoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wTGlnaHRQaWNrZXI/IHRoaXMuX3BMaWdodFBpY2tlci5udW1MaWdodFByb2JlcyArIHRoaXMuX3BMaWdodFBpY2tlci5udW1EaXJlY3Rpb25hbExpZ2h0cyArIHRoaXMuX3BMaWdodFBpY2tlci5udW1Qb2ludExpZ2h0cyA6IDA7XG5cdH1cbn1cblxuZXhwb3J0ID0gVHJpYW5nbGVNZXRob2RNYXRlcmlhbDsiXX0=