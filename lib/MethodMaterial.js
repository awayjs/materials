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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL01ldGhvZE1hdGVyaWFsLnRzIl0sIm5hbWVzIjpbIk1ldGhvZE1hdGVyaWFsIiwiTWV0aG9kTWF0ZXJpYWwuY29uc3RydWN0b3IiLCJNZXRob2RNYXRlcmlhbC5tb2RlIiwiTWV0aG9kTWF0ZXJpYWwuZGVwdGhDb21wYXJlTW9kZSIsIk1ldGhvZE1hdGVyaWFsLmRpZmZ1c2VUZXh0dXJlIiwiTWV0aG9kTWF0ZXJpYWwuYW1iaWVudE1ldGhvZCIsIk1ldGhvZE1hdGVyaWFsLnNoYWRvd01ldGhvZCIsIk1ldGhvZE1hdGVyaWFsLmRpZmZ1c2VNZXRob2QiLCJNZXRob2RNYXRlcmlhbC5zcGVjdWxhck1ldGhvZCIsIk1ldGhvZE1hdGVyaWFsLm5vcm1hbE1ldGhvZCIsIk1ldGhvZE1hdGVyaWFsLm51bUVmZmVjdE1ldGhvZHMiLCJNZXRob2RNYXRlcmlhbC5hZGRFZmZlY3RNZXRob2QiLCJNZXRob2RNYXRlcmlhbC5nZXRFZmZlY3RNZXRob2RBdCIsIk1ldGhvZE1hdGVyaWFsLmFkZEVmZmVjdE1ldGhvZEF0IiwiTWV0aG9kTWF0ZXJpYWwucmVtb3ZlRWZmZWN0TWV0aG9kIiwiTWV0aG9kTWF0ZXJpYWwubm9ybWFsTWFwIiwiTWV0aG9kTWF0ZXJpYWwuc3BlY3VsYXJNYXAiLCJNZXRob2RNYXRlcmlhbC5nbG9zcyIsIk1ldGhvZE1hdGVyaWFsLmFtYmllbnQiLCJNZXRob2RNYXRlcmlhbC5zcGVjdWxhciIsIk1ldGhvZE1hdGVyaWFsLmFtYmllbnRDb2xvciIsIk1ldGhvZE1hdGVyaWFsLmRpZmZ1c2VDb2xvciIsIk1ldGhvZE1hdGVyaWFsLnNwZWN1bGFyQ29sb3IiLCJNZXRob2RNYXRlcmlhbC5nZXRSZW5kZXJPYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8sYUFBYSxXQUFjLHdDQUF3QyxDQUFDLENBQUM7QUFNNUUsSUFBTyxZQUFZLFdBQWUsMkNBQTJDLENBQUMsQ0FBQztBQUcvRSxJQUFP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LEtBQUtBLENBQUNBO1FBQzFDQSxDQUFDQTs7O09BTEFwQjtJQVVEQSxzQkFBV0Esd0NBQVlBO1FBSHZCQTs7V0FFR0E7YUFDSEE7WUFFQ3FCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFlBQVlBLENBQUNBO1FBQ3pDQSxDQUFDQTthQUVEckIsVUFBd0JBLEtBQVlBO1lBRW5DcUIsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDMUNBLENBQUNBOzs7T0FMQXJCO0lBVURBLHNCQUFXQSx5Q0FBYUE7UUFIeEJBOztXQUVHQTthQUNIQTtZQUVDc0IsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFDM0NBLENBQUNBO2FBRUR0QixVQUF5QkEsS0FBWUE7WUFFcENzQixJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxhQUFhQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUM1Q0EsQ0FBQ0E7OztPQUxBdEI7SUFPREE7Ozs7O09BS0dBO0lBQ0lBLHdDQUFlQSxHQUF0QkEsVUFBdUJBLGNBQW1DQTtRQUV6RHVCLE1BQU1BLENBQUNBLGNBQWNBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDbkRBLENBQUNBO0lBQ0Z2QixxQkFBQ0E7QUFBREEsQ0E1V0EsQUE0V0NBLEVBNVc0QixZQUFZLEVBNFd4QztBQUVELEFBQXdCLGlCQUFmLGNBQWMsQ0FBQyIsImZpbGUiOiJNZXRob2RNYXRlcmlhbC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyLvu79pbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmUyREJhc2VcIik7XHJcblxyXG5pbXBvcnQgQmxlbmRNb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9iYXNlL0JsZW5kTW9kZVwiKTtcclxuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XHJcbmltcG9ydCBTdGF0aWNMaWdodFBpY2tlclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvbGlnaHRwaWNrZXJzL1N0YXRpY0xpZ2h0UGlja2VyXCIpO1xyXG5pbXBvcnQgSVJlbmRlck9iamVjdE93bmVyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvSVJlbmRlck9iamVjdE93bmVyXCIpO1xyXG5pbXBvcnQgTWF0ZXJpYWxCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvTWF0ZXJpYWxCYXNlXCIpO1xyXG5pbXBvcnQgSVJlbmRlck9iamVjdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3Bvb2wvSVJlbmRlck9iamVjdFwiKTtcclxuXHJcbmltcG9ydCBDb250ZXh0R0xDb21wYXJlTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTENvbXBhcmVNb2RlXCIpO1xyXG5cclxuaW1wb3J0IEFtYmllbnRCYXNpY01ldGhvZFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvQW1iaWVudEJhc2ljTWV0aG9kXCIpO1xyXG5pbXBvcnQgRGlmZnVzZUJhc2ljTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9EaWZmdXNlQmFzaWNNZXRob2RcIik7XHJcbmltcG9ydCBFZmZlY3RNZXRob2RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0VmZmVjdE1ldGhvZEJhc2VcIik7XHJcbmltcG9ydCBOb3JtYWxCYXNpY01ldGhvZFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvTm9ybWFsQmFzaWNNZXRob2RcIik7XHJcbmltcG9ydCBTaGFkb3dNYXBNZXRob2RCYXNlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9TaGFkb3dNYXBNZXRob2RCYXNlXCIpO1xyXG5pbXBvcnQgU3BlY3VsYXJCYXNpY01ldGhvZFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU3BlY3VsYXJCYXNpY01ldGhvZFwiKTtcclxuaW1wb3J0IE1ldGhvZE1hdGVyaWFsTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL01ldGhvZE1hdGVyaWFsTW9kZVwiKTtcclxuXHJcbmltcG9ydCBNZXRob2RSZW5kZXJhYmxlUG9vbFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL3Bvb2wvTWV0aG9kUmVuZGVyYWJsZVBvb2xcIik7XHJcblxyXG4vKipcclxuICogTWV0aG9kTWF0ZXJpYWwgZm9ybXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgdGhlIGRlZmF1bHQgc2hhZGVkIG1hdGVyaWFscyBwcm92aWRlZCBieSBTdGFnZSxcclxuICogdXNpbmcgbWF0ZXJpYWwgbWV0aG9kcyB0byBkZWZpbmUgdGhlaXIgYXBwZWFyYW5jZS5cclxuICovXHJcbmNsYXNzIE1ldGhvZE1hdGVyaWFsIGV4dGVuZHMgTWF0ZXJpYWxCYXNlXHJcbntcclxuXHRwcml2YXRlIF9lZmZlY3RNZXRob2RzOkFycmF5PEVmZmVjdE1ldGhvZEJhc2U+ID0gbmV3IEFycmF5PEVmZmVjdE1ldGhvZEJhc2U+KCk7XHJcblx0cHJpdmF0ZSBfbW9kZTpzdHJpbmc7XHJcblxyXG5cdHByaXZhdGUgX2FtYmllbnRNZXRob2Q6QW1iaWVudEJhc2ljTWV0aG9kID0gbmV3IEFtYmllbnRCYXNpY01ldGhvZCgpO1xyXG5cdHByaXZhdGUgX3NoYWRvd01ldGhvZDpTaGFkb3dNYXBNZXRob2RCYXNlO1xyXG5cdHByaXZhdGUgX2RpZmZ1c2VNZXRob2Q6RGlmZnVzZUJhc2ljTWV0aG9kID0gbmV3IERpZmZ1c2VCYXNpY01ldGhvZCgpO1xyXG5cdHByaXZhdGUgX25vcm1hbE1ldGhvZDpOb3JtYWxCYXNpY01ldGhvZCA9IG5ldyBOb3JtYWxCYXNpY01ldGhvZCgpO1xyXG5cdHByaXZhdGUgX3NwZWN1bGFyTWV0aG9kOlNwZWN1bGFyQmFzaWNNZXRob2QgPSBuZXcgU3BlY3VsYXJCYXNpY01ldGhvZCgpO1xyXG5cclxuXHJcblx0cHJpdmF0ZSBfZGVwdGhDb21wYXJlTW9kZTpzdHJpbmcgPSBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMO1xyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGVzIGEgbmV3IE1ldGhvZE1hdGVyaWFsIG9iamVjdC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB0ZXh0dXJlIFRoZSB0ZXh0dXJlIHVzZWQgZm9yIHRoZSBtYXRlcmlhbCdzIGFsYmVkbyBjb2xvci5cclxuXHQgKiBAcGFyYW0gc21vb3RoIEluZGljYXRlcyB3aGV0aGVyIHRoZSB0ZXh0dXJlIHNob3VsZCBiZSBmaWx0ZXJlZCB3aGVuIHNhbXBsZWQuIERlZmF1bHRzIHRvIHRydWUuXHJcblx0ICogQHBhcmFtIHJlcGVhdCBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdGV4dHVyZSBzaG91bGQgYmUgdGlsZWQgd2hlbiBzYW1wbGVkLiBEZWZhdWx0cyB0byBmYWxzZS5cclxuXHQgKiBAcGFyYW0gbWlwbWFwIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBhbnkgdXNlZCB0ZXh0dXJlcyBzaG91bGQgdXNlIG1pcG1hcHBpbmcuIERlZmF1bHRzIHRvIGZhbHNlLlxyXG5cdCAqL1xyXG5cdGNvbnN0cnVjdG9yKHRleHR1cmU/OlRleHR1cmUyREJhc2UsIHNtb290aD86Ym9vbGVhbiwgcmVwZWF0Pzpib29sZWFuLCBtaXBtYXA/OmJvb2xlYW4pO1xyXG5cdGNvbnN0cnVjdG9yKGNvbG9yPzpudW1iZXIsIGFscGhhPzpudW1iZXIpO1xyXG5cdGNvbnN0cnVjdG9yKHRleHR1cmVDb2xvcjphbnkgPSBudWxsLCBzbW9vdGhBbHBoYTphbnkgPSBudWxsLCByZXBlYXQ6Ym9vbGVhbiA9IGZhbHNlLCBtaXBtYXA6Ym9vbGVhbiA9IHRydWUpXHJcblx0e1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHR0aGlzLl9tb2RlID0gTWV0aG9kTWF0ZXJpYWxNb2RlLlNJTkdMRV9QQVNTO1xyXG5cclxuXHRcdGlmICh0ZXh0dXJlQ29sb3IgaW5zdGFuY2VvZiBUZXh0dXJlMkRCYXNlKSB7XHJcblx0XHRcdHRoaXMudGV4dHVyZSA9IDxUZXh0dXJlMkRCYXNlPiB0ZXh0dXJlQ29sb3I7XHJcblxyXG5cdFx0XHR0aGlzLnNtb290aCA9IChzbW9vdGhBbHBoYSA9PSBudWxsKT8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHR0aGlzLnJlcGVhdCA9IHJlcGVhdDtcclxuXHRcdFx0dGhpcy5taXBtYXAgPSBtaXBtYXA7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmNvbG9yID0gKHRleHR1cmVDb2xvciA9PSBudWxsKT8gMHhGRkZGRkYgOiBOdW1iZXIodGV4dHVyZUNvbG9yKTtcclxuXHRcdFx0dGhpcy5hbHBoYSA9IChzbW9vdGhBbHBoYSA9PSBudWxsKT8gMSA6IE51bWJlcihzbW9vdGhBbHBoYSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0cHVibGljIGdldCBtb2RlKCk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX21vZGU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IG1vZGUodmFsdWU6c3RyaW5nKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9tb2RlID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fbW9kZSA9IHZhbHVlO1xyXG5cclxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlUmVuZGVyT2JqZWN0KCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgZGVwdGggY29tcGFyZSBtb2RlIHVzZWQgdG8gcmVuZGVyIHRoZSByZW5kZXJhYmxlcyB1c2luZyB0aGlzIG1hdGVyaWFsLlxyXG5cdCAqXHJcblx0ICogQHNlZSBhd2F5LnN0YWdlZ2wuQ29udGV4dEdMQ29tcGFyZU1vZGVcclxuXHQgKi9cclxuXHJcblx0cHVibGljIGdldCBkZXB0aENvbXBhcmVNb2RlKCk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2RlcHRoQ29tcGFyZU1vZGU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGRlcHRoQ29tcGFyZU1vZGUodmFsdWU6c3RyaW5nKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9kZXB0aENvbXBhcmVNb2RlID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fZGVwdGhDb21wYXJlTW9kZSA9IHZhbHVlO1xyXG5cclxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlUmVuZGVyT2JqZWN0KCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgdGV4dHVyZSBvYmplY3QgdG8gdXNlIGZvciB0aGUgYW1iaWVudCBjb2xvdXIuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBkaWZmdXNlVGV4dHVyZSgpOlRleHR1cmUyREJhc2VcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGlmZnVzZU1ldGhvZC50ZXh0dXJlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBkaWZmdXNlVGV4dHVyZSh2YWx1ZTpUZXh0dXJlMkRCYXNlKVxyXG5cdHtcclxuXHRcdHRoaXMuX2RpZmZ1c2VNZXRob2QudGV4dHVyZSA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIHRoZSBhbWJpZW50IGxpZ2h0aW5nIGNvbnRyaWJ1dGlvbi4gRGVmYXVsdHMgdG8gQW1iaWVudEJhc2ljTWV0aG9kLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgYW1iaWVudE1ldGhvZCgpOkFtYmllbnRCYXNpY01ldGhvZFxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9hbWJpZW50TWV0aG9kO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBhbWJpZW50TWV0aG9kKHZhbHVlOkFtYmllbnRCYXNpY01ldGhvZClcclxuXHR7XHJcblx0XHRpZiAodGhpcy5fYW1iaWVudE1ldGhvZCA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmICh2YWx1ZSAmJiB0aGlzLl9hbWJpZW50TWV0aG9kKVxyXG5cdFx0XHR2YWx1ZS5jb3B5RnJvbSh0aGlzLl9hbWJpZW50TWV0aG9kKTtcclxuXHJcblx0XHR0aGlzLl9hbWJpZW50TWV0aG9kID0gdmFsdWU7XHJcblxyXG5cdFx0dGhpcy5fcEludmFsaWRhdGVSZW5kZXJPYmplY3QoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBtZXRob2QgdXNlZCB0byByZW5kZXIgc2hhZG93cyBjYXN0IG9uIHRoaXMgc3VyZmFjZSwgb3IgbnVsbCBpZiBubyBzaGFkb3dzIGFyZSB0byBiZSByZW5kZXJlZC4gRGVmYXVsdHMgdG8gbnVsbC5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IHNoYWRvd01ldGhvZCgpOlNoYWRvd01hcE1ldGhvZEJhc2VcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fc2hhZG93TWV0aG9kO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBzaGFkb3dNZXRob2QodmFsdWU6U2hhZG93TWFwTWV0aG9kQmFzZSlcclxuXHR7XHJcblx0XHRpZiAodGhpcy5fc2hhZG93TWV0aG9kID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0aWYgKHZhbHVlICYmIHRoaXMuX3NoYWRvd01ldGhvZClcclxuXHRcdFx0dmFsdWUuY29weUZyb20odGhpcy5fc2hhZG93TWV0aG9kKTtcclxuXHJcblx0XHR0aGlzLl9zaGFkb3dNZXRob2QgPSB2YWx1ZTtcclxuXHJcblx0XHR0aGlzLl9wSW52YWxpZGF0ZVJlbmRlck9iamVjdCgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIHRoZSBkaWZmdXNlIGxpZ2h0aW5nIGNvbnRyaWJ1dGlvbi4gRGVmYXVsdHMgdG8gRGlmZnVzZUJhc2ljTWV0aG9kLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgZGlmZnVzZU1ldGhvZCgpOkRpZmZ1c2VCYXNpY01ldGhvZFxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9kaWZmdXNlTWV0aG9kO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBkaWZmdXNlTWV0aG9kKHZhbHVlOkRpZmZ1c2VCYXNpY01ldGhvZClcclxuXHR7XHJcblx0XHRpZiAodGhpcy5fZGlmZnVzZU1ldGhvZCA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmICh2YWx1ZSAmJiB0aGlzLl9kaWZmdXNlTWV0aG9kKVxyXG5cdFx0XHR2YWx1ZS5jb3B5RnJvbSh0aGlzLl9kaWZmdXNlTWV0aG9kKTtcclxuXHJcblx0XHR0aGlzLl9kaWZmdXNlTWV0aG9kID0gdmFsdWU7XHJcblxyXG5cdFx0dGhpcy5fcEludmFsaWRhdGVSZW5kZXJPYmplY3QoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBtZXRob2QgdGhhdCBwcm92aWRlcyB0aGUgc3BlY3VsYXIgbGlnaHRpbmcgY29udHJpYnV0aW9uLiBEZWZhdWx0cyB0byBTcGVjdWxhckJhc2ljTWV0aG9kLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgc3BlY3VsYXJNZXRob2QoKTpTcGVjdWxhckJhc2ljTWV0aG9kXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3NwZWN1bGFyTWV0aG9kO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBzcGVjdWxhck1ldGhvZCh2YWx1ZTpTcGVjdWxhckJhc2ljTWV0aG9kKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9zcGVjdWxhck1ldGhvZCA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmICh2YWx1ZSAmJiB0aGlzLl9zcGVjdWxhck1ldGhvZClcclxuXHRcdFx0dmFsdWUuY29weUZyb20odGhpcy5fc3BlY3VsYXJNZXRob2QpO1xyXG5cclxuXHRcdHRoaXMuX3NwZWN1bGFyTWV0aG9kID0gdmFsdWU7XHJcblxyXG5cdFx0dGhpcy5fcEludmFsaWRhdGVSZW5kZXJPYmplY3QoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBtZXRob2QgdXNlZCB0byBnZW5lcmF0ZSB0aGUgcGVyLXBpeGVsIG5vcm1hbHMuIERlZmF1bHRzIHRvIE5vcm1hbEJhc2ljTWV0aG9kLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgbm9ybWFsTWV0aG9kKCk6Tm9ybWFsQmFzaWNNZXRob2RcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fbm9ybWFsTWV0aG9kO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBub3JtYWxNZXRob2QodmFsdWU6Tm9ybWFsQmFzaWNNZXRob2QpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuX25vcm1hbE1ldGhvZCA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmICh2YWx1ZSAmJiB0aGlzLl9ub3JtYWxNZXRob2QpXHJcblx0XHRcdHZhbHVlLmNvcHlGcm9tKHRoaXMuX25vcm1hbE1ldGhvZCk7XHJcblxyXG5cdFx0dGhpcy5fbm9ybWFsTWV0aG9kID0gdmFsdWU7XHJcblxyXG5cdFx0dGhpcy5fcEludmFsaWRhdGVSZW5kZXJPYmplY3QoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgbnVtRWZmZWN0TWV0aG9kcygpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9lZmZlY3RNZXRob2RzLmxlbmd0aDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEFwcGVuZHMgYW4gXCJlZmZlY3RcIiBzaGFkaW5nIG1ldGhvZCB0byB0aGUgc2hhZGVyLiBFZmZlY3QgbWV0aG9kcyBhcmUgdGhvc2UgdGhhdCBkbyBub3QgaW5mbHVlbmNlIHRoZSBsaWdodGluZ1xyXG5cdCAqIGJ1dCBtb2R1bGF0ZSB0aGUgc2hhZGVkIGNvbG91ciwgdXNlZCBmb3IgZm9nLCBvdXRsaW5lcywgZXRjLiBUaGUgbWV0aG9kIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcmVzdWx0IG9mIHRoZVxyXG5cdCAqIG1ldGhvZHMgYWRkZWQgcHJpb3IuXHJcblx0ICovXHJcblx0cHVibGljIGFkZEVmZmVjdE1ldGhvZChtZXRob2Q6RWZmZWN0TWV0aG9kQmFzZSlcclxuXHR7XHJcblx0XHR0aGlzLl9lZmZlY3RNZXRob2RzLnB1c2gobWV0aG9kKTtcclxuXHJcblx0XHR0aGlzLl9wSW52YWxpZGF0ZVJlbmRlck9iamVjdCgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyB0aGUgbWV0aG9kIGFkZGVkIGF0IHRoZSBnaXZlbiBpbmRleC5cclxuXHQgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBtZXRob2QgdG8gcmV0cmlldmUuXHJcblx0ICogQHJldHVybiBUaGUgbWV0aG9kIGF0IHRoZSBnaXZlbiBpbmRleC5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0RWZmZWN0TWV0aG9kQXQoaW5kZXg6bnVtYmVyKTpFZmZlY3RNZXRob2RCYXNlXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VmZmVjdE1ldGhvZHNbaW5kZXhdO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQWRkcyBhbiBlZmZlY3QgbWV0aG9kIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXggYW1vbmdzdCB0aGUgbWV0aG9kcyBhbHJlYWR5IGFkZGVkIHRvIHRoZSBtYXRlcmlhbC4gRWZmZWN0XHJcblx0ICogbWV0aG9kcyBhcmUgdGhvc2UgdGhhdCBkbyBub3QgaW5mbHVlbmNlIHRoZSBsaWdodGluZyBidXQgbW9kdWxhdGUgdGhlIHNoYWRlZCBjb2xvdXIsIHVzZWQgZm9yIGZvZywgb3V0bGluZXMsXHJcblx0ICogZXRjLiBUaGUgbWV0aG9kIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcmVzdWx0IG9mIHRoZSBtZXRob2RzIHdpdGggYSBsb3dlciBpbmRleC5cclxuXHQgKi9cclxuXHRwdWJsaWMgYWRkRWZmZWN0TWV0aG9kQXQobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UsIGluZGV4Om51bWJlcilcclxuXHR7XHJcblx0XHR0aGlzLl9lZmZlY3RNZXRob2RzLnNwbGljZShpbmRleCwgMCwgbWV0aG9kKTtcclxuXHJcblx0XHR0aGlzLl9wSW52YWxpZGF0ZVJlbmRlck9iamVjdCgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmVtb3ZlcyBhbiBlZmZlY3QgbWV0aG9kIGZyb20gdGhlIG1hdGVyaWFsLlxyXG5cdCAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCB0byBiZSByZW1vdmVkLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyByZW1vdmVFZmZlY3RNZXRob2QobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UpXHJcblx0e1xyXG5cdFx0dGhpcy5fZWZmZWN0TWV0aG9kcy5zcGxpY2UodGhpcy5fZWZmZWN0TWV0aG9kcy5pbmRleE9mKG1ldGhvZCksIDEpO1xyXG5cclxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlUmVuZGVyT2JqZWN0KCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgbm9ybWFsIG1hcCB0byBtb2R1bGF0ZSB0aGUgZGlyZWN0aW9uIG9mIHRoZSBzdXJmYWNlIGZvciBlYWNoIHRleGVsLiBUaGUgZGVmYXVsdCBub3JtYWwgbWV0aG9kIGV4cGVjdHNcclxuXHQgKiB0YW5nZW50LXNwYWNlIG5vcm1hbCBtYXBzLCBidXQgb3RoZXJzIGNvdWxkIGV4cGVjdCBvYmplY3Qtc3BhY2UgbWFwcy5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IG5vcm1hbE1hcCgpOlRleHR1cmUyREJhc2VcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fbm9ybWFsTWV0aG9kLm5vcm1hbE1hcDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgbm9ybWFsTWFwKHZhbHVlOlRleHR1cmUyREJhc2UpXHJcblx0e1xyXG5cdFx0dGhpcy5fbm9ybWFsTWV0aG9kLm5vcm1hbE1hcCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQSBzcGVjdWxhciBtYXAgdGhhdCBkZWZpbmVzIHRoZSBzdHJlbmd0aCBvZiBzcGVjdWxhciByZWZsZWN0aW9ucyBmb3IgZWFjaCB0ZXhlbCBpbiB0aGUgcmVkIGNoYW5uZWwsXHJcblx0ICogYW5kIHRoZSBnbG9zcyBmYWN0b3IgaW4gdGhlIGdyZWVuIGNoYW5uZWwuIFlvdSBjYW4gdXNlIFNwZWN1bGFyQml0bWFwVGV4dHVyZSBpZiB5b3Ugd2FudCB0byBlYXNpbHkgc2V0XHJcblx0ICogc3BlY3VsYXIgYW5kIGdsb3NzIG1hcHMgZnJvbSBncmF5c2NhbGUgaW1hZ2VzLCBidXQgY29ycmVjdGx5IGF1dGhvcmVkIGltYWdlcyBhcmUgcHJlZmVycmVkLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgc3BlY3VsYXJNYXAoKTpUZXh0dXJlMkRCYXNlXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3NwZWN1bGFyTWV0aG9kLnRleHR1cmU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHNwZWN1bGFyTWFwKHZhbHVlOlRleHR1cmUyREJhc2UpXHJcblx0e1xyXG5cdFx0dGhpcy5fc3BlY3VsYXJNZXRob2QudGV4dHVyZSA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIGdsb3NzaW5lc3Mgb2YgdGhlIG1hdGVyaWFsIChzaGFycG5lc3Mgb2YgdGhlIHNwZWN1bGFyIGhpZ2hsaWdodCkuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBnbG9zcygpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9zcGVjdWxhck1ldGhvZC5nbG9zcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgZ2xvc3ModmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX3NwZWN1bGFyTWV0aG9kLmdsb3NzID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgc3RyZW5ndGggb2YgdGhlIGFtYmllbnQgcmVmbGVjdGlvbi5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGFtYmllbnQoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fYW1iaWVudE1ldGhvZC5hbWJpZW50O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBhbWJpZW50KHZhbHVlOm51bWJlcilcclxuXHR7XHJcblx0XHR0aGlzLl9hbWJpZW50TWV0aG9kLmFtYmllbnQgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBvdmVyYWxsIHN0cmVuZ3RoIG9mIHRoZSBzcGVjdWxhciByZWZsZWN0aW9uLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgc3BlY3VsYXIoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fc3BlY3VsYXJNZXRob2Quc3BlY3VsYXI7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHNwZWN1bGFyKHZhbHVlOm51bWJlcilcclxuXHR7XHJcblx0XHR0aGlzLl9zcGVjdWxhck1ldGhvZC5zcGVjdWxhciA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIGNvbG91ciBvZiB0aGUgYW1iaWVudCByZWZsZWN0aW9uLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgYW1iaWVudENvbG9yKCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2RpZmZ1c2VNZXRob2QuYW1iaWVudENvbG9yO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBhbWJpZW50Q29sb3IodmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX2RpZmZ1c2VNZXRob2QuYW1iaWVudENvbG9yID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgY29sb3VyIG9mIHRoZSBkaWZmdXNlIHJlZmxlY3Rpb24uXHJcblx0ICovXHJcblx0cHVibGljIGdldCBkaWZmdXNlQ29sb3IoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGlmZnVzZU1ldGhvZC5kaWZmdXNlQ29sb3I7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGRpZmZ1c2VDb2xvcih2YWx1ZTpudW1iZXIpXHJcblx0e1xyXG5cdFx0dGhpcy5fZGlmZnVzZU1ldGhvZC5kaWZmdXNlQ29sb3IgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBjb2xvdXIgb2YgdGhlIHNwZWN1bGFyIHJlZmxlY3Rpb24uXHJcblx0ICovXHJcblx0cHVibGljIGdldCBzcGVjdWxhckNvbG9yKCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3NwZWN1bGFyTWV0aG9kLnNwZWN1bGFyQ29sb3I7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHNwZWN1bGFyQ29sb3IodmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX3NwZWN1bGFyTWV0aG9kLnNwZWN1bGFyQ29sb3IgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHJlbmRlcmVyXHJcblx0ICpcclxuXHQgKiBAaW50ZXJuYWxcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0UmVuZGVyT2JqZWN0KHJlbmRlcmFibGVQb29sOk1ldGhvZFJlbmRlcmFibGVQb29sKTpJUmVuZGVyT2JqZWN0XHJcblx0e1xyXG5cdFx0cmV0dXJuIHJlbmRlcmFibGVQb29sLmdldE1ldGhvZFJlbmRlck9iamVjdCh0aGlzKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCA9IE1ldGhvZE1hdGVyaWFsOyJdfQ==