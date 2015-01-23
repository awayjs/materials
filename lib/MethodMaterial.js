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
        if (mipmap === void 0) { mipmap = false; }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL01ldGhvZE1hdGVyaWFsLnRzIl0sIm5hbWVzIjpbIk1ldGhvZE1hdGVyaWFsIiwiTWV0aG9kTWF0ZXJpYWwuY29uc3RydWN0b3IiLCJNZXRob2RNYXRlcmlhbC5tb2RlIiwiTWV0aG9kTWF0ZXJpYWwuZGVwdGhDb21wYXJlTW9kZSIsIk1ldGhvZE1hdGVyaWFsLmRpZmZ1c2VUZXh0dXJlIiwiTWV0aG9kTWF0ZXJpYWwuYW1iaWVudE1ldGhvZCIsIk1ldGhvZE1hdGVyaWFsLnNoYWRvd01ldGhvZCIsIk1ldGhvZE1hdGVyaWFsLmRpZmZ1c2VNZXRob2QiLCJNZXRob2RNYXRlcmlhbC5zcGVjdWxhck1ldGhvZCIsIk1ldGhvZE1hdGVyaWFsLm5vcm1hbE1ldGhvZCIsIk1ldGhvZE1hdGVyaWFsLm51bUVmZmVjdE1ldGhvZHMiLCJNZXRob2RNYXRlcmlhbC5hZGRFZmZlY3RNZXRob2QiLCJNZXRob2RNYXRlcmlhbC5nZXRFZmZlY3RNZXRob2RBdCIsIk1ldGhvZE1hdGVyaWFsLmFkZEVmZmVjdE1ldGhvZEF0IiwiTWV0aG9kTWF0ZXJpYWwucmVtb3ZlRWZmZWN0TWV0aG9kIiwiTWV0aG9kTWF0ZXJpYWwubm9ybWFsTWFwIiwiTWV0aG9kTWF0ZXJpYWwuc3BlY3VsYXJNYXAiLCJNZXRob2RNYXRlcmlhbC5nbG9zcyIsIk1ldGhvZE1hdGVyaWFsLmFtYmllbnQiLCJNZXRob2RNYXRlcmlhbC5zcGVjdWxhciIsIk1ldGhvZE1hdGVyaWFsLmFtYmllbnRDb2xvciIsIk1ldGhvZE1hdGVyaWFsLmRpZmZ1c2VDb2xvciIsIk1ldGhvZE1hdGVyaWFsLnNwZWN1bGFyQ29sb3IiLCJNZXRob2RNYXRlcmlhbC5nZXRSZW5kZXJPYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8sYUFBYSxXQUFjLHdDQUF3QyxDQUFDLENBQUM7QUFNNUUsSUFBTyxZQUFZLFdBQWUsMkNBQTJDLENBQUMsQ0FBQztBQUkvRSxJQUFP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LEtBQUtBLENBQUNBO1FBQzFDQSxDQUFDQTs7O09BTEFwQjtJQVVEQSxzQkFBV0Esd0NBQVlBO1FBSHZCQTs7V0FFR0E7YUFDSEE7WUFFQ3FCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFlBQVlBLENBQUNBO1FBQ3pDQSxDQUFDQTthQUVEckIsVUFBd0JBLEtBQVlBO1lBRW5DcUIsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDMUNBLENBQUNBOzs7T0FMQXJCO0lBVURBLHNCQUFXQSx5Q0FBYUE7UUFIeEJBOztXQUVHQTthQUNIQTtZQUVDc0IsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFDM0NBLENBQUNBO2FBRUR0QixVQUF5QkEsS0FBWUE7WUFFcENzQixJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxhQUFhQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUM1Q0EsQ0FBQ0E7OztPQUxBdEI7SUFPREE7Ozs7O09BS0dBO0lBQ0lBLHdDQUFlQSxHQUF0QkEsVUFBdUJBLGNBQW1DQTtRQUV6RHVCLE1BQU1BLENBQUNBLGNBQWNBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDbkRBLENBQUNBO0lBQ0Z2QixxQkFBQ0E7QUFBREEsQ0E1V0EsQUE0V0NBLEVBNVc0QixZQUFZLEVBNFd4QztBQUVELEFBQXdCLGlCQUFmLGNBQWMsQ0FBQyIsImZpbGUiOiJNZXRob2RNYXRlcmlhbC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyLvu79pbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmUyREJhc2VcIik7XG5cbmltcG9ydCBCbGVuZE1vZGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvQmxlbmRNb2RlXCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5pbXBvcnQgU3RhdGljTGlnaHRQaWNrZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL2xpZ2h0cGlja2Vycy9TdGF0aWNMaWdodFBpY2tlclwiKTtcbmltcG9ydCBJUmVuZGVyT2JqZWN0T3duZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9JUmVuZGVyT2JqZWN0T3duZXJcIik7XG5pbXBvcnQgTWF0ZXJpYWxCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvTWF0ZXJpYWxCYXNlXCIpO1xuaW1wb3J0IElSZW5kZXJPYmplY3RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wb29sL0lSZW5kZXJPYmplY3RcIik7XG5cbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuaW1wb3J0IENvbnRleHRHTENvbXBhcmVNb2RlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMQ29tcGFyZU1vZGVcIik7XG5cbmltcG9ydCBBbWJpZW50QmFzaWNNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0FtYmllbnRCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBEaWZmdXNlQmFzaWNNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0RpZmZ1c2VCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBFZmZlY3RNZXRob2RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0VmZmVjdE1ldGhvZEJhc2VcIik7XG5pbXBvcnQgTm9ybWFsQmFzaWNNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL05vcm1hbEJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IFNoYWRvd01hcE1ldGhvZEJhc2VcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL1NoYWRvd01hcE1ldGhvZEJhc2VcIik7XG5pbXBvcnQgU3BlY3VsYXJCYXNpY01ldGhvZFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU3BlY3VsYXJCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBNZXRob2RNYXRlcmlhbE1vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9NZXRob2RNYXRlcmlhbE1vZGVcIik7XG5cbmltcG9ydCBNZXRob2RSZW5kZXJhYmxlUG9vbFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL3Bvb2wvTWV0aG9kUmVuZGVyYWJsZVBvb2xcIik7XG5cbi8qKlxuICogTWV0aG9kTWF0ZXJpYWwgZm9ybXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgdGhlIGRlZmF1bHQgc2hhZGVkIG1hdGVyaWFscyBwcm92aWRlZCBieSBTdGFnZSxcbiAqIHVzaW5nIG1hdGVyaWFsIG1ldGhvZHMgdG8gZGVmaW5lIHRoZWlyIGFwcGVhcmFuY2UuXG4gKi9cbmNsYXNzIE1ldGhvZE1hdGVyaWFsIGV4dGVuZHMgTWF0ZXJpYWxCYXNlXG57XG5cdHByaXZhdGUgX2VmZmVjdE1ldGhvZHM6QXJyYXk8RWZmZWN0TWV0aG9kQmFzZT4gPSBuZXcgQXJyYXk8RWZmZWN0TWV0aG9kQmFzZT4oKTtcblx0cHJpdmF0ZSBfbW9kZTpzdHJpbmc7XG5cblx0cHJpdmF0ZSBfYW1iaWVudE1ldGhvZDpBbWJpZW50QmFzaWNNZXRob2QgPSBuZXcgQW1iaWVudEJhc2ljTWV0aG9kKCk7XG5cdHByaXZhdGUgX3NoYWRvd01ldGhvZDpTaGFkb3dNYXBNZXRob2RCYXNlO1xuXHRwcml2YXRlIF9kaWZmdXNlTWV0aG9kOkRpZmZ1c2VCYXNpY01ldGhvZCA9IG5ldyBEaWZmdXNlQmFzaWNNZXRob2QoKTtcblx0cHJpdmF0ZSBfbm9ybWFsTWV0aG9kOk5vcm1hbEJhc2ljTWV0aG9kID0gbmV3IE5vcm1hbEJhc2ljTWV0aG9kKCk7XG5cdHByaXZhdGUgX3NwZWN1bGFyTWV0aG9kOlNwZWN1bGFyQmFzaWNNZXRob2QgPSBuZXcgU3BlY3VsYXJCYXNpY01ldGhvZCgpO1xuXG5cblx0cHJpdmF0ZSBfZGVwdGhDb21wYXJlTW9kZTpzdHJpbmcgPSBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IE1ldGhvZE1hdGVyaWFsIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHRleHR1cmUgVGhlIHRleHR1cmUgdXNlZCBmb3IgdGhlIG1hdGVyaWFsJ3MgYWxiZWRvIGNvbG9yLlxuXHQgKiBAcGFyYW0gc21vb3RoIEluZGljYXRlcyB3aGV0aGVyIHRoZSB0ZXh0dXJlIHNob3VsZCBiZSBmaWx0ZXJlZCB3aGVuIHNhbXBsZWQuIERlZmF1bHRzIHRvIHRydWUuXG5cdCAqIEBwYXJhbSByZXBlYXQgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHRleHR1cmUgc2hvdWxkIGJlIHRpbGVkIHdoZW4gc2FtcGxlZC4gRGVmYXVsdHMgdG8gZmFsc2UuXG5cdCAqIEBwYXJhbSBtaXBtYXAgSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IGFueSB1c2VkIHRleHR1cmVzIHNob3VsZCB1c2UgbWlwbWFwcGluZy4gRGVmYXVsdHMgdG8gZmFsc2UuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlPzpUZXh0dXJlMkRCYXNlLCBzbW9vdGg/OmJvb2xlYW4sIHJlcGVhdD86Ym9vbGVhbiwgbWlwbWFwPzpib29sZWFuKTtcblx0Y29uc3RydWN0b3IoY29sb3I/Om51bWJlciwgYWxwaGE/Om51bWJlcik7XG5cdGNvbnN0cnVjdG9yKHRleHR1cmVDb2xvcjphbnkgPSBudWxsLCBzbW9vdGhBbHBoYTphbnkgPSBudWxsLCByZXBlYXQ6Ym9vbGVhbiA9IGZhbHNlLCBtaXBtYXA6Ym9vbGVhbiA9IGZhbHNlKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX21vZGUgPSBNZXRob2RNYXRlcmlhbE1vZGUuU0lOR0xFX1BBU1M7XG5cblx0XHRpZiAodGV4dHVyZUNvbG9yIGluc3RhbmNlb2YgVGV4dHVyZTJEQmFzZSkge1xuXHRcdFx0dGhpcy50ZXh0dXJlID0gPFRleHR1cmUyREJhc2U+IHRleHR1cmVDb2xvcjtcblxuXHRcdFx0dGhpcy5zbW9vdGggPSAoc21vb3RoQWxwaGEgPT0gbnVsbCk/IHRydWUgOiBmYWxzZTtcblx0XHRcdHRoaXMucmVwZWF0ID0gcmVwZWF0O1xuXHRcdFx0dGhpcy5taXBtYXAgPSBtaXBtYXA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuY29sb3IgPSAodGV4dHVyZUNvbG9yID09IG51bGwpPyAweEZGRkZGRiA6IE51bWJlcih0ZXh0dXJlQ29sb3IpO1xuXHRcdFx0dGhpcy5hbHBoYSA9IChzbW9vdGhBbHBoYSA9PSBudWxsKT8gMSA6IE51bWJlcihzbW9vdGhBbHBoYSk7XG5cdFx0fVxuXHR9XG5cblxuXHRwdWJsaWMgZ2V0IG1vZGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLl9tb2RlO1xuXHR9XG5cblx0cHVibGljIHNldCBtb2RlKHZhbHVlOnN0cmluZylcblx0e1xuXHRcdGlmICh0aGlzLl9tb2RlID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fbW9kZSA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVSZW5kZXJPYmplY3QoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZGVwdGggY29tcGFyZSBtb2RlIHVzZWQgdG8gcmVuZGVyIHRoZSByZW5kZXJhYmxlcyB1c2luZyB0aGlzIG1hdGVyaWFsLlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkuc3RhZ2VnbC5Db250ZXh0R0xDb21wYXJlTW9kZVxuXHQgKi9cblxuXHRwdWJsaWMgZ2V0IGRlcHRoQ29tcGFyZU1vZGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLl9kZXB0aENvbXBhcmVNb2RlO1xuXHR9XG5cblx0cHVibGljIHNldCBkZXB0aENvbXBhcmVNb2RlKHZhbHVlOnN0cmluZylcblx0e1xuXHRcdGlmICh0aGlzLl9kZXB0aENvbXBhcmVNb2RlID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fZGVwdGhDb21wYXJlTW9kZSA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVSZW5kZXJPYmplY3QoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdGV4dHVyZSBvYmplY3QgdG8gdXNlIGZvciB0aGUgYW1iaWVudCBjb2xvdXIuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGRpZmZ1c2VUZXh0dXJlKCk6VGV4dHVyZTJEQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2RpZmZ1c2VNZXRob2QudGV4dHVyZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZGlmZnVzZVRleHR1cmUodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0e1xuXHRcdHRoaXMuX2RpZmZ1c2VNZXRob2QudGV4dHVyZSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBtZXRob2QgdGhhdCBwcm92aWRlcyB0aGUgYW1iaWVudCBsaWdodGluZyBjb250cmlidXRpb24uIERlZmF1bHRzIHRvIEFtYmllbnRCYXNpY01ldGhvZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgYW1iaWVudE1ldGhvZCgpOkFtYmllbnRCYXNpY01ldGhvZFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2FtYmllbnRNZXRob2Q7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGFtYmllbnRNZXRob2QodmFsdWU6QW1iaWVudEJhc2ljTWV0aG9kKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2FtYmllbnRNZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodmFsdWUgJiYgdGhpcy5fYW1iaWVudE1ldGhvZClcblx0XHRcdHZhbHVlLmNvcHlGcm9tKHRoaXMuX2FtYmllbnRNZXRob2QpO1xuXG5cdFx0dGhpcy5fYW1iaWVudE1ldGhvZCA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVSZW5kZXJPYmplY3QoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIHNoYWRvd3MgY2FzdCBvbiB0aGlzIHN1cmZhY2UsIG9yIG51bGwgaWYgbm8gc2hhZG93cyBhcmUgdG8gYmUgcmVuZGVyZWQuIERlZmF1bHRzIHRvIG51bGwuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNoYWRvd01ldGhvZCgpOlNoYWRvd01hcE1ldGhvZEJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zaGFkb3dNZXRob2Q7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHNoYWRvd01ldGhvZCh2YWx1ZTpTaGFkb3dNYXBNZXRob2RCYXNlKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3NoYWRvd01ldGhvZCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdGlmICh2YWx1ZSAmJiB0aGlzLl9zaGFkb3dNZXRob2QpXG5cdFx0XHR2YWx1ZS5jb3B5RnJvbSh0aGlzLl9zaGFkb3dNZXRob2QpO1xuXG5cdFx0dGhpcy5fc2hhZG93TWV0aG9kID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wSW52YWxpZGF0ZVJlbmRlck9iamVjdCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBtZXRob2QgdGhhdCBwcm92aWRlcyB0aGUgZGlmZnVzZSBsaWdodGluZyBjb250cmlidXRpb24uIERlZmF1bHRzIHRvIERpZmZ1c2VCYXNpY01ldGhvZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgZGlmZnVzZU1ldGhvZCgpOkRpZmZ1c2VCYXNpY01ldGhvZFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2RpZmZ1c2VNZXRob2Q7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGRpZmZ1c2VNZXRob2QodmFsdWU6RGlmZnVzZUJhc2ljTWV0aG9kKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2RpZmZ1c2VNZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodmFsdWUgJiYgdGhpcy5fZGlmZnVzZU1ldGhvZClcblx0XHRcdHZhbHVlLmNvcHlGcm9tKHRoaXMuX2RpZmZ1c2VNZXRob2QpO1xuXG5cdFx0dGhpcy5fZGlmZnVzZU1ldGhvZCA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVSZW5kZXJPYmplY3QoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHRoYXQgcHJvdmlkZXMgdGhlIHNwZWN1bGFyIGxpZ2h0aW5nIGNvbnRyaWJ1dGlvbi4gRGVmYXVsdHMgdG8gU3BlY3VsYXJCYXNpY01ldGhvZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgc3BlY3VsYXJNZXRob2QoKTpTcGVjdWxhckJhc2ljTWV0aG9kXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc3BlY3VsYXJNZXRob2Q7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHNwZWN1bGFyTWV0aG9kKHZhbHVlOlNwZWN1bGFyQmFzaWNNZXRob2QpXG5cdHtcblx0XHRpZiAodGhpcy5fc3BlY3VsYXJNZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodmFsdWUgJiYgdGhpcy5fc3BlY3VsYXJNZXRob2QpXG5cdFx0XHR2YWx1ZS5jb3B5RnJvbSh0aGlzLl9zcGVjdWxhck1ldGhvZCk7XG5cblx0XHR0aGlzLl9zcGVjdWxhck1ldGhvZCA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVSZW5kZXJPYmplY3QoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHVzZWQgdG8gZ2VuZXJhdGUgdGhlIHBlci1waXhlbCBub3JtYWxzLiBEZWZhdWx0cyB0byBOb3JtYWxCYXNpY01ldGhvZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgbm9ybWFsTWV0aG9kKCk6Tm9ybWFsQmFzaWNNZXRob2Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9ub3JtYWxNZXRob2Q7XG5cdH1cblxuXHRwdWJsaWMgc2V0IG5vcm1hbE1ldGhvZCh2YWx1ZTpOb3JtYWxCYXNpY01ldGhvZClcblx0e1xuXHRcdGlmICh0aGlzLl9ub3JtYWxNZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodmFsdWUgJiYgdGhpcy5fbm9ybWFsTWV0aG9kKVxuXHRcdFx0dmFsdWUuY29weUZyb20odGhpcy5fbm9ybWFsTWV0aG9kKTtcblxuXHRcdHRoaXMuX25vcm1hbE1ldGhvZCA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVSZW5kZXJPYmplY3QoKTtcblx0fVxuXG5cdHB1YmxpYyBnZXQgbnVtRWZmZWN0TWV0aG9kcygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2VmZmVjdE1ldGhvZHMubGVuZ3RoO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGVuZHMgYW4gXCJlZmZlY3RcIiBzaGFkaW5nIG1ldGhvZCB0byB0aGUgc2hhZGVyLiBFZmZlY3QgbWV0aG9kcyBhcmUgdGhvc2UgdGhhdCBkbyBub3QgaW5mbHVlbmNlIHRoZSBsaWdodGluZ1xuXHQgKiBidXQgbW9kdWxhdGUgdGhlIHNoYWRlZCBjb2xvdXIsIHVzZWQgZm9yIGZvZywgb3V0bGluZXMsIGV0Yy4gVGhlIG1ldGhvZCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHJlc3VsdCBvZiB0aGVcblx0ICogbWV0aG9kcyBhZGRlZCBwcmlvci5cblx0ICovXG5cdHB1YmxpYyBhZGRFZmZlY3RNZXRob2QobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UpXG5cdHtcblx0XHR0aGlzLl9lZmZlY3RNZXRob2RzLnB1c2gobWV0aG9kKTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlUmVuZGVyT2JqZWN0KCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbWV0aG9kIGFkZGVkIGF0IHRoZSBnaXZlbiBpbmRleC5cblx0ICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCBvZiB0aGUgbWV0aG9kIHRvIHJldHJpZXZlLlxuXHQgKiBAcmV0dXJuIFRoZSBtZXRob2QgYXQgdGhlIGdpdmVuIGluZGV4LlxuXHQgKi9cblx0cHVibGljIGdldEVmZmVjdE1ldGhvZEF0KGluZGV4Om51bWJlcik6RWZmZWN0TWV0aG9kQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2VmZmVjdE1ldGhvZHNbaW5kZXhdO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgYW4gZWZmZWN0IG1ldGhvZCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4IGFtb25nc3QgdGhlIG1ldGhvZHMgYWxyZWFkeSBhZGRlZCB0byB0aGUgbWF0ZXJpYWwuIEVmZmVjdFxuXHQgKiBtZXRob2RzIGFyZSB0aG9zZSB0aGF0IGRvIG5vdCBpbmZsdWVuY2UgdGhlIGxpZ2h0aW5nIGJ1dCBtb2R1bGF0ZSB0aGUgc2hhZGVkIGNvbG91ciwgdXNlZCBmb3IgZm9nLCBvdXRsaW5lcyxcblx0ICogZXRjLiBUaGUgbWV0aG9kIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcmVzdWx0IG9mIHRoZSBtZXRob2RzIHdpdGggYSBsb3dlciBpbmRleC5cblx0ICovXG5cdHB1YmxpYyBhZGRFZmZlY3RNZXRob2RBdChtZXRob2Q6RWZmZWN0TWV0aG9kQmFzZSwgaW5kZXg6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fZWZmZWN0TWV0aG9kcy5zcGxpY2UoaW5kZXgsIDAsIG1ldGhvZCk7XG5cblx0XHR0aGlzLl9wSW52YWxpZGF0ZVJlbmRlck9iamVjdCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYW4gZWZmZWN0IG1ldGhvZCBmcm9tIHRoZSBtYXRlcmlhbC5cblx0ICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIGJlIHJlbW92ZWQuXG5cdCAqL1xuXHRwdWJsaWMgcmVtb3ZlRWZmZWN0TWV0aG9kKG1ldGhvZDpFZmZlY3RNZXRob2RCYXNlKVxuXHR7XG5cdFx0dGhpcy5fZWZmZWN0TWV0aG9kcy5zcGxpY2UodGhpcy5fZWZmZWN0TWV0aG9kcy5pbmRleE9mKG1ldGhvZCksIDEpO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVSZW5kZXJPYmplY3QoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbm9ybWFsIG1hcCB0byBtb2R1bGF0ZSB0aGUgZGlyZWN0aW9uIG9mIHRoZSBzdXJmYWNlIGZvciBlYWNoIHRleGVsLiBUaGUgZGVmYXVsdCBub3JtYWwgbWV0aG9kIGV4cGVjdHNcblx0ICogdGFuZ2VudC1zcGFjZSBub3JtYWwgbWFwcywgYnV0IG90aGVycyBjb3VsZCBleHBlY3Qgb2JqZWN0LXNwYWNlIG1hcHMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG5vcm1hbE1hcCgpOlRleHR1cmUyREJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9ub3JtYWxNZXRob2Qubm9ybWFsTWFwO1xuXHR9XG5cblx0cHVibGljIHNldCBub3JtYWxNYXAodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0e1xuXHRcdHRoaXMuX25vcm1hbE1ldGhvZC5ub3JtYWxNYXAgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIHNwZWN1bGFyIG1hcCB0aGF0IGRlZmluZXMgdGhlIHN0cmVuZ3RoIG9mIHNwZWN1bGFyIHJlZmxlY3Rpb25zIGZvciBlYWNoIHRleGVsIGluIHRoZSByZWQgY2hhbm5lbCxcblx0ICogYW5kIHRoZSBnbG9zcyBmYWN0b3IgaW4gdGhlIGdyZWVuIGNoYW5uZWwuIFlvdSBjYW4gdXNlIFNwZWN1bGFyQml0bWFwVGV4dHVyZSBpZiB5b3Ugd2FudCB0byBlYXNpbHkgc2V0XG5cdCAqIHNwZWN1bGFyIGFuZCBnbG9zcyBtYXBzIGZyb20gZ3JheXNjYWxlIGltYWdlcywgYnV0IGNvcnJlY3RseSBhdXRob3JlZCBpbWFnZXMgYXJlIHByZWZlcnJlZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgc3BlY3VsYXJNYXAoKTpUZXh0dXJlMkRCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc3BlY3VsYXJNZXRob2QudGV4dHVyZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3BlY3VsYXJNYXAodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0e1xuXHRcdHRoaXMuX3NwZWN1bGFyTWV0aG9kLnRleHR1cmUgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZ2xvc3NpbmVzcyBvZiB0aGUgbWF0ZXJpYWwgKHNoYXJwbmVzcyBvZiB0aGUgc3BlY3VsYXIgaGlnaGxpZ2h0KS5cblx0ICovXG5cdHB1YmxpYyBnZXQgZ2xvc3MoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zcGVjdWxhck1ldGhvZC5nbG9zcztcblx0fVxuXG5cdHB1YmxpYyBzZXQgZ2xvc3ModmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fc3BlY3VsYXJNZXRob2QuZ2xvc3MgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgc3RyZW5ndGggb2YgdGhlIGFtYmllbnQgcmVmbGVjdGlvbi5cblx0ICovXG5cdHB1YmxpYyBnZXQgYW1iaWVudCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2FtYmllbnRNZXRob2QuYW1iaWVudDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgYW1iaWVudCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9hbWJpZW50TWV0aG9kLmFtYmllbnQgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgb3ZlcmFsbCBzdHJlbmd0aCBvZiB0aGUgc3BlY3VsYXIgcmVmbGVjdGlvbi5cblx0ICovXG5cdHB1YmxpYyBnZXQgc3BlY3VsYXIoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zcGVjdWxhck1ldGhvZC5zcGVjdWxhcjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3BlY3VsYXIodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fc3BlY3VsYXJNZXRob2Quc3BlY3VsYXIgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgY29sb3VyIG9mIHRoZSBhbWJpZW50IHJlZmxlY3Rpb24uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFtYmllbnRDb2xvcigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2RpZmZ1c2VNZXRob2QuYW1iaWVudENvbG9yO1xuXHR9XG5cblx0cHVibGljIHNldCBhbWJpZW50Q29sb3IodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fZGlmZnVzZU1ldGhvZC5hbWJpZW50Q29sb3IgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgY29sb3VyIG9mIHRoZSBkaWZmdXNlIHJlZmxlY3Rpb24uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGRpZmZ1c2VDb2xvcigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2RpZmZ1c2VNZXRob2QuZGlmZnVzZUNvbG9yO1xuXHR9XG5cblx0cHVibGljIHNldCBkaWZmdXNlQ29sb3IodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fZGlmZnVzZU1ldGhvZC5kaWZmdXNlQ29sb3IgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgY29sb3VyIG9mIHRoZSBzcGVjdWxhciByZWZsZWN0aW9uLlxuXHQgKi9cblx0cHVibGljIGdldCBzcGVjdWxhckNvbG9yKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc3BlY3VsYXJNZXRob2Quc3BlY3VsYXJDb2xvcjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3BlY3VsYXJDb2xvcih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9zcGVjdWxhck1ldGhvZC5zcGVjdWxhckNvbG9yID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHJlbmRlcmVyXG5cdCAqXG5cdCAqIEBpbnRlcm5hbFxuXHQgKi9cblx0cHVibGljIGdldFJlbmRlck9iamVjdChyZW5kZXJhYmxlUG9vbDpNZXRob2RSZW5kZXJhYmxlUG9vbCk6SVJlbmRlck9iamVjdFxuXHR7XG5cdFx0cmV0dXJuIHJlbmRlcmFibGVQb29sLmdldE1ldGhvZFJlbmRlck9iamVjdCh0aGlzKTtcblx0fVxufVxuXG5leHBvcnQgPSBNZXRob2RNYXRlcmlhbDsiXX0=