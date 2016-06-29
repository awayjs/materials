"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Image2D_1 = require("@awayjs/core/lib/image/Image2D");
var MaterialBase_1 = require("@awayjs/display/lib/materials/MaterialBase");
var Single2DTexture_1 = require("@awayjs/display/lib/textures/Single2DTexture");
var ContextGLCompareMode_1 = require("@awayjs/stage/lib/base/ContextGLCompareMode");
var MethodMaterialMode_1 = require("./MethodMaterialMode");
var AmbientBasicMethod_1 = require("./methods/AmbientBasicMethod");
var DiffuseBasicMethod_1 = require("./methods/DiffuseBasicMethod");
var NormalBasicMethod_1 = require("./methods/NormalBasicMethod");
var SpecularBasicMethod_1 = require("./methods/SpecularBasicMethod");
/**
 * MethodMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var MethodMaterial = (function (_super) {
    __extends(MethodMaterial, _super);
    function MethodMaterial(imageColor, alpha) {
        if (imageColor === void 0) { imageColor = null; }
        if (alpha === void 0) { alpha = 1; }
        _super.call(this, imageColor, alpha);
        this._effectMethods = new Array();
        this._ambientMethod = new AmbientBasicMethod_1.AmbientBasicMethod();
        this._diffuseMethod = new DiffuseBasicMethod_1.DiffuseBasicMethod();
        this._normalMethod = new NormalBasicMethod_1.NormalBasicMethod();
        this._specularMethod = new SpecularBasicMethod_1.SpecularBasicMethod();
        this._depthCompareMode = ContextGLCompareMode_1.ContextGLCompareMode.LESS_EQUAL;
        this._mode = MethodMaterialMode_1.MethodMaterialMode.SINGLE_PASS;
        //add default methods owners
        this._ambientMethod.iAddOwner(this);
        this._diffuseMethod.iAddOwner(this);
        this._normalMethod.iAddOwner(this);
        this._specularMethod.iAddOwner(this);
        //set a texture if an image is present
        if (imageColor instanceof Image2D_1.Image2D)
            this._ambientMethod.texture = new Single2DTexture_1.Single2DTexture();
    }
    Object.defineProperty(MethodMaterial.prototype, "assetType", {
        /**
         *
         */
        get: function () {
            return MethodMaterial.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        set: function (value) {
            if (this._mode == value)
                return;
            this._mode = value;
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterial.prototype, "depthCompareMode", {
        /**
         * The depth compare mode used to render the renderables using this material.
         *
         * @see away.stage.ContextGLCompareMode
         */
        get: function () {
            return this._depthCompareMode;
        },
        set: function (value) {
            if (this._depthCompareMode == value)
                return;
            this._depthCompareMode = value;
            this.invalidate();
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
            if (this._ambientMethod)
                this._ambientMethod.iRemoveOwner(this);
            this._ambientMethod = value;
            if (this._ambientMethod)
                this._ambientMethod.iAddOwner(this);
            this.invalidate();
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
            if (this._shadowMethod)
                this._shadowMethod.iRemoveOwner(this);
            this._shadowMethod = value;
            if (this._shadowMethod)
                this._shadowMethod.iAddOwner(this);
            this.invalidate();
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
            if (this._diffuseMethod)
                this._diffuseMethod.iRemoveOwner(this);
            this._diffuseMethod = value;
            if (this._diffuseMethod)
                this._diffuseMethod.iAddOwner(this);
            this.invalidate();
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
            if (this._specularMethod)
                this._specularMethod.iRemoveOwner(this);
            this._specularMethod = value;
            if (this._specularMethod)
                this._specularMethod.iAddOwner(this);
            this.invalidate();
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
            if (this._normalMethod)
                this._normalMethod.iRemoveOwner(this);
            this._normalMethod = value;
            if (this._normalMethod)
                this._normalMethod.iAddOwner(this);
            this.invalidate();
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
        method.iAddOwner(this);
        this._effectMethods.push(method);
        this.invalidate();
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
        method.iAddOwner(this);
        this._effectMethods.splice(index, 0, method);
        this.invalidate();
    };
    /**
     * Removes an effect method from the material.
     * @param method The method to be removed.
     */
    MethodMaterial.prototype.removeEffectMethod = function (method) {
        method.iRemoveOwner(this);
        this._effectMethods.splice(this._effectMethods.indexOf(method), 1);
        this.invalidate();
    };
    MethodMaterial.assetType = "[materials MethodMaterial]";
    return MethodMaterial;
}(MaterialBase_1.MaterialBase));
exports.MethodMaterial = MethodMaterial;
