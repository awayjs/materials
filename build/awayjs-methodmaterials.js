require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./methodmaterials.ts":[function(require,module,exports){
var RenderPool = require("awayjs-renderergl/lib/render/RenderPool");
var MethodMaterial = require("awayjs-methodmaterials/lib/MethodMaterial");
var MethodMaterialRender = require("awayjs-methodmaterials/lib/render/MethodMaterialRender");
RenderPool.registerAbstraction(MethodMaterialRender, MethodMaterial);
/**
 *
 * static shim
 */
var methodmaterials = (function () {
    function methodmaterials() {
    }
    return methodmaterials;
})();
module.exports = methodmaterials;

},{"awayjs-methodmaterials/lib/MethodMaterial":"awayjs-methodmaterials/lib/MethodMaterial","awayjs-methodmaterials/lib/render/MethodMaterialRender":"awayjs-methodmaterials/lib/render/MethodMaterialRender","awayjs-renderergl/lib/render/RenderPool":undefined}],"awayjs-methodmaterials/lib/MethodMaterialMode":[function(require,module,exports){
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

},{}],"awayjs-methodmaterials/lib/MethodMaterial":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Image2D = require("awayjs-core/lib/image/Image2D");
var MaterialBase = require("awayjs-display/lib/materials/MaterialBase");
var Single2DTexture = require("awayjs-display/lib/textures/Single2DTexture");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var MethodMaterialMode = require("awayjs-methodmaterials/lib/MethodMaterialMode");
var AmbientBasicMethod = require("awayjs-methodmaterials/lib/methods/AmbientBasicMethod");
var DiffuseBasicMethod = require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
var NormalBasicMethod = require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
var SpecularBasicMethod = require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
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
        this._ambientMethod = new AmbientBasicMethod();
        this._diffuseMethod = new DiffuseBasicMethod();
        this._normalMethod = new NormalBasicMethod();
        this._specularMethod = new SpecularBasicMethod();
        this._depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
        this._mode = MethodMaterialMode.SINGLE_PASS;
        //add default methods owners
        this._ambientMethod.iAddOwner(this);
        this._diffuseMethod.iAddOwner(this);
        this._normalMethod.iAddOwner(this);
        this._specularMethod.iAddOwner(this);
        //set a texture if an image is present
        if (imageColor instanceof Image2D)
            this._ambientMethod.texture = new Single2DTexture();
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
         * @see away.stagegl.ContextGLCompareMode
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
})(MaterialBase);
module.exports = MethodMaterial;

},{"awayjs-core/lib/image/Image2D":undefined,"awayjs-display/lib/materials/MaterialBase":undefined,"awayjs-display/lib/textures/Single2DTexture":undefined,"awayjs-methodmaterials/lib/MethodMaterialMode":"awayjs-methodmaterials/lib/MethodMaterialMode","awayjs-methodmaterials/lib/methods/AmbientBasicMethod":"awayjs-methodmaterials/lib/methods/AmbientBasicMethod","awayjs-methodmaterials/lib/methods/DiffuseBasicMethod":"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod","awayjs-methodmaterials/lib/methods/NormalBasicMethod":"awayjs-methodmaterials/lib/methods/NormalBasicMethod","awayjs-methodmaterials/lib/methods/SpecularBasicMethod":"awayjs-methodmaterials/lib/methods/SpecularBasicMethod","awayjs-stagegl/lib/base/ContextGLCompareMode":undefined}],"awayjs-methodmaterials/lib/data/MethodVO":[function(require,module,exports){
/**
 * MethodVO contains data for a given shader object for the use within a single material.
 * This allows shader methods to be shared across materials while their non-public state differs.
 */
var MethodVO = (function () {
    /**
     * Creates a new MethodVO object.
     */
    function MethodVO(method, pass) {
        this.useMethod = true;
        this.method = method;
        this.pass = pass;
    }
    /**
     * Resets the values of the value object to their "unused" state.
     */
    MethodVO.prototype.reset = function () {
        this.method.iReset();
        this.vertexConstantsIndex = -1;
        this.secondaryVertexConstantsIndex = -1;
        this.fragmentConstantsIndex = -1;
        this.secondaryFragmentConstantsIndex = -1;
        this.needsProjection = false;
        this.needsView = false;
        this.needsNormals = false;
        this.needsTangents = false;
        this.needsGlobalVertexPos = false;
        this.needsGlobalFragmentPos = false;
    };
    return MethodVO;
})();
module.exports = MethodVO;

},{}],"awayjs-methodmaterials/lib/methods/AmbientBasicMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
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
        this._alpha = 1;
        this._colorR = 1;
        this._colorG = 1;
        this._colorB = 1;
        this._strength = 1;
    }
    /**
     * @inheritDoc
     */
    AmbientBasicMethod.prototype.iInitVO = function (shader, methodVO) {
        if (this._texture) {
            methodVO.textureVO = shader.getAbstraction(this._texture);
            shader.uvDependencies++;
        }
        else if (methodVO.textureVO) {
            methodVO.textureVO.onClear(new AssetEvent(AssetEvent.CLEAR, this._texture));
            methodVO.textureVO = null;
        }
    };
    /**
     * @inheritDoc
     */
    AmbientBasicMethod.prototype.iInitConstants = function (shader, methodVO) {
        if (!methodVO.textureVO) {
            this._color = shader.numLights ? 0xFFFFFF : methodVO.pass._renderOwner.style.color;
            this.updateColor();
        }
    };
    Object.defineProperty(AmbientBasicMethod.prototype, "strength", {
        /**
         * The strength of the ambient reflection of the surface.
         */
        get: function () {
            return this._strength;
        },
        set: function (value) {
            if (this._strength == value)
                return;
            this._strength = value;
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
    Object.defineProperty(AmbientBasicMethod.prototype, "texture", {
        /**
         * The texture to use to define the diffuse reflection color per texel.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            if (this._texture == value)
                return;
            if (this._texture)
                this.iRemoveTexture(this._texture);
            this._texture = value;
            if (this._texture)
                this.iAddTexture(this._texture);
            this.iInvalidateShaderProgram();
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
    AmbientBasicMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        if (methodVO.textureVO) {
            code += methodVO.textureVO._iGetFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying);
            if (shader.alphaThreshold > 0) {
                var cutOffReg = registerCache.getFreeFragmentConstant();
                methodVO.fragmentConstantsIndex = cutOffReg.index * 4;
                code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" + "kil " + targetReg + ".w\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
            }
        }
        else {
            var ambientInputRegister = registerCache.getFreeFragmentConstant();
            methodVO.fragmentConstantsIndex = ambientInputRegister.index * 4;
            code += "mov " + targetReg + ", " + ambientInputRegister + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    AmbientBasicMethod.prototype.iActivate = function (shader, methodVO, stage) {
        if (methodVO.textureVO) {
            methodVO.textureVO.activate(methodVO.pass._render);
            if (shader.alphaThreshold > 0)
                shader.fragmentConstantData[methodVO.fragmentConstantsIndex] = shader.alphaThreshold;
        }
        else {
            var index = methodVO.fragmentConstantsIndex;
            var data = shader.fragmentConstantData;
            data[index] = this._colorR;
            data[index + 1] = this._colorG;
            data[index + 2] = this._colorB;
            data[index + 3] = this._alpha;
        }
    };
    AmbientBasicMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        if (methodVO.textureVO)
            methodVO.textureVO._setRenderState(renderable);
    };
    /**
     * Updates the ambient color data used by the render state.
     */
    AmbientBasicMethod.prototype.updateColor = function () {
        this._colorR = ((this._color >> 16) & 0xff) / 0xff * this._strength;
        this._colorG = ((this._color >> 8) & 0xff) / 0xff * this._strength;
        this._colorB = (this._color & 0xff) / 0xff * this._strength;
    };
    return AmbientBasicMethod;
})(ShadingMethodBase);
module.exports = AmbientBasicMethod;

},{"awayjs-core/lib/events/AssetEvent":undefined,"awayjs-methodmaterials/lib/methods/ShadingMethodBase":"awayjs-methodmaterials/lib/methods/ShadingMethodBase"}],"awayjs-methodmaterials/lib/methods/AmbientEnvMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
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
    function AmbientEnvMapMethod() {
        _super.call(this);
    }
    /**
     * @inheritDoc
     */
    AmbientEnvMapMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsNormals = true;
        if (this._texture) {
            methodVO.textureVO = shader.getAbstraction(this._texture);
            shader.uvDependencies++;
        }
        else if (methodVO.textureVO) {
            methodVO.textureVO.onClear(new AssetEvent(AssetEvent.CLEAR, this._texture));
            methodVO.textureVO = null;
        }
    };
    /**
     * @inheritDoc
     */
    AmbientEnvMapMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        return (this._texture) ? methodVO.textureVO._iGetFragmentCode(targetReg, regCache, sharedRegisters, sharedRegisters.normalFragment) : "";
    };
    return AmbientEnvMapMethod;
})(AmbientBasicMethod);
module.exports = AmbientEnvMapMethod;

},{"awayjs-core/lib/events/AssetEvent":undefined,"awayjs-methodmaterials/lib/methods/AmbientBasicMethod":"awayjs-methodmaterials/lib/methods/AmbientBasicMethod"}],"awayjs-methodmaterials/lib/methods/CurveBasicMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
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
    CurveBasicMethod.prototype.iInitVO = function (shader, methodVO) {
        if (this._texture) {
            methodVO.textureVO = shader.getAbstraction(this._texture);
            shader.uvDependencies++;
        }
        else if (methodVO.textureVO) {
            methodVO.textureVO.onClear(new AssetEvent(AssetEvent.CLEAR, this._texture));
            methodVO.textureVO = null;
        }
    };
    /**
     * @inheritDoc
     */
    CurveBasicMethod.prototype.iInitConstants = function (shader, methodVO) {
        if (!methodVO.textureVO) {
            this._color = methodVO.pass._renderOwner.style.color;
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
    Object.defineProperty(CurveBasicMethod.prototype, "texture", {
        /**
         * The texture to use to define the diffuse reflection color per texel.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            if (this._texture == value)
                return;
            if (this._texture)
                this.iRemoveTexture(this._texture);
            this._texture = value;
            if (this._texture)
                this.iAddTexture(this._texture);
            this.iInvalidateShaderProgram();
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
    public iGeVertexCode(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string {
        var code:string = "";
        code = "mov " + sharedRegisters.uvVarying + " " + registerCache.uv +  " \n";
    }*/
    CurveBasicMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var ambientInputRegister;
        if (methodVO.textureVO) {
            code += methodVO.textureVO._iGetFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying);
            if (shader.alphaThreshold > 0) {
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
    CurveBasicMethod.prototype.iActivate = function (shader, methodVO, stage) {
        if (methodVO.textureVO) {
            methodVO.textureVO.activate(methodVO.pass._render);
            if (shader.alphaThreshold > 0)
                shader.fragmentConstantData[methodVO.fragmentConstantsIndex] = shader.alphaThreshold;
        }
        else {
            var index = methodVO.fragmentConstantsIndex;
            var data = shader.fragmentConstantData;
            data[index] = this._colorR;
            data[index + 1] = this._colorG;
            data[index + 2] = this._colorB;
            data[index + 3] = this._alpha;
        }
    };
    CurveBasicMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        if (methodVO.textureVO)
            methodVO.textureVO._setRenderState(renderable);
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

},{"awayjs-core/lib/events/AssetEvent":undefined,"awayjs-methodmaterials/lib/methods/ShadingMethodBase":"awayjs-methodmaterials/lib/methods/ShadingMethodBase"}],"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
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
        this._ambientColorR = 1;
        this._ambientColorG = 1;
        this._ambientColorB = 1;
        this._color = 0xffffff;
        this._colorR = 1;
        this._colorG = 1;
        this._colorB = 1;
    }
    DiffuseBasicMethod.prototype.iIsUsed = function (shader) {
        if (!shader.numLights)
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
    DiffuseBasicMethod.prototype.iInitVO = function (shader, methodVO) {
        if (this._texture) {
            methodVO.textureVO = shader.getAbstraction(this._texture);
            shader.uvDependencies++;
        }
        else if (methodVO.textureVO) {
            methodVO.textureVO.onClear(new AssetEvent(AssetEvent.CLEAR, null));
            methodVO.textureVO = null;
        }
        if (shader.numLights > 0) {
            shader.usesCommonData = true;
            methodVO.needsNormals = true;
        }
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iInitConstants = function (shader, methodVO) {
        if (shader.numLights > 0) {
            this._ambientColor = methodVO.pass._renderOwner.style.color;
            this.updateAmbientColor();
        }
        else {
            this._ambientColor = null;
        }
    };
    Object.defineProperty(DiffuseBasicMethod.prototype, "color", {
        /**
         * The color of the diffuse reflection when not using a texture.
         */
        get: function () {
            return this._color;
        },
        set: function (value) {
            if (this._color == value)
                return;
            this._color = value;
            this.updateColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseBasicMethod.prototype, "texture", {
        /**
         * The texture to use to define the diffuse reflection color per texel.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            if (this._texture == value)
                return;
            if (this._texture)
                this.iRemoveTexture(this._texture);
            this._texture = value;
            if (this._texture)
                this.iAddTexture(this._texture);
            this.iInvalidateShaderProgram();
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
        this.color = diff.color;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._pTotalLightColorReg = null;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        var code = "";
        this._pIsFirstLight = true;
        registerCache.addFragmentTempUsages(this._pTotalLightColorReg = registerCache.getFreeFragmentVectorTemp(), 1);
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
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
        if (shader.usesLightFallOff)
            code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);
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
    DiffuseBasicMethod.prototype.iGetFragmentCodePerProbe = function (shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
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
            code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);
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
    DiffuseBasicMethod.prototype.iGetFragmentPostLightingCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var diffuseColor;
        var cutOffReg;
        // incorporate input from ambient
        if (sharedRegisters.shadowTarget)
            code += this.pApplyShadow(shader, methodVO, registerCache, sharedRegisters);
        registerCache.addFragmentTempUsages(diffuseColor = registerCache.getFreeFragmentVectorTemp(), 1);
        var ambientColorRegister = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = ambientColorRegister.index * 4;
        if (this._texture) {
            code += methodVO.textureVO._iGetFragmentCode(diffuseColor, registerCache, sharedRegisters, sharedRegisters.uvVarying);
        }
        else {
            var diffuseInputRegister = registerCache.getFreeFragmentConstant();
            code += "mov " + diffuseColor + ", " + diffuseInputRegister + "\n";
        }
        code += "sat " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + "\n" + "mul " + diffuseColor + ".xyz, " + diffuseColor + ", " + this._pTotalLightColorReg + "\n";
        if (this._multiply) {
            code += "add " + diffuseColor + ".xyz, " + diffuseColor + ", " + ambientColorRegister + "\n" + "mul " + targetReg + ".xyz, " + targetReg + ", " + diffuseColor + "\n";
        }
        else if (this._texture) {
            code += "mul " + targetReg + ".xyz, " + targetReg + ", " + ambientColorRegister + "\n" + "mul " + this._pTotalLightColorReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" + "sub " + targetReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" + "add " + targetReg + ".xyz, " + targetReg + ", " + diffuseColor + "\n"; //add diffuse color and ambient color
        }
        else {
            code += "mul " + this._pTotalLightColorReg + ".xyz, " + ambientColorRegister + ", " + this._pTotalLightColorReg + "\n" + "sub " + this._pTotalLightColorReg + ".xyz, " + ambientColorRegister + ", " + this._pTotalLightColorReg + "\n" + "add " + diffuseColor + ".xyz, " + diffuseColor + ", " + this._pTotalLightColorReg + "\n" + "mul " + targetReg + ".xyz, " + targetReg + ", " + diffuseColor + "\n"; // multiply by target which could be texture or white
        }
        registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
        registerCache.removeFragmentTempUsage(diffuseColor);
        return code;
    };
    /**
     * Generate the code that applies the calculated shadow to the diffuse light
     * @param methodVO The MethodVO object for which the compilation is currently happening.
     * @param regCache The register cache the compiler is currently using for the register management.
     */
    DiffuseBasicMethod.prototype.pApplyShadow = function (shader, methodVO, regCache, sharedRegisters) {
        return "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iActivate = function (shader, methodVO, stage) {
        if (this._texture) {
            methodVO.textureVO.activate(methodVO.pass._render);
        }
        else {
            var index = methodVO.fragmentConstantsIndex;
            var data = shader.fragmentConstantData;
            if (this._multiply) {
                data[index + 4] = this._colorR * this._ambientColorR;
                data[index + 5] = this._colorG * this._ambientColorG;
                data[index + 6] = this._colorB * this._ambientColorB;
            }
            else {
                data[index + 4] = this._colorR;
                data[index + 5] = this._colorG;
                data[index + 6] = this._colorB;
            }
            data[index + 7] = 1;
        }
    };
    /**
     * Updates the diffuse color data used by the render state.
     */
    DiffuseBasicMethod.prototype.updateColor = function () {
        this._colorR = ((this._color >> 16) & 0xff) / 0xff;
        this._colorG = ((this._color >> 8) & 0xff) / 0xff;
        this._colorB = (this._color & 0xff) / 0xff;
    };
    /**
     * Updates the ambient color data used by the render state.
     */
    DiffuseBasicMethod.prototype.updateAmbientColor = function () {
        this._ambientColorR = ((this._ambientColor >> 16) & 0xff) / 0xff;
        this._ambientColorG = ((this._ambientColor >> 8) & 0xff) / 0xff;
        this._ambientColorB = (this._ambientColor & 0xff) / 0xff;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        if (this._texture)
            methodVO.textureVO._setRenderState(renderable);
        //TODO move this to Activate (ambientR/G/B currently calc'd in render state)
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = shader.ambientR * this._ambientColorR;
        data[index + 1] = shader.ambientG * this._ambientColorG;
        data[index + 2] = shader.ambientB * this._ambientColorB;
        data[index + 3] = 1;
    };
    return DiffuseBasicMethod;
})(LightingMethodBase);
module.exports = DiffuseBasicMethod;

},{"awayjs-core/lib/events/AssetEvent":undefined,"awayjs-methodmaterials/lib/methods/LightingMethodBase":"awayjs-methodmaterials/lib/methods/LightingMethodBase"}],"awayjs-methodmaterials/lib/methods/DiffuseCelMethod":[function(require,module,exports){
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
        this.baseMethod._iModulateMethod = function (shader, methodVO, targetReg, registerCache, sharedRegisters) { return _this.clampDiffuse(shader, methodVO, targetReg, registerCache, sharedRegisters); };
        this._levels = levels;
    }
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iInitConstants = function (shader, methodVO) {
        var data = shader.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        _super.prototype.iInitConstants.call(this, shader, methodVO);
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
    DiffuseCelMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shader, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var data = shader.fragmentConstantData;
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
    DiffuseCelMethod.prototype.clampDiffuse = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        return "mul " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".x\n" + "frc " + targetReg + ".z, " + targetReg + ".w\n" + "sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".z\n" + "mov " + targetReg + ".x, " + this._dataReg + ".x\n" + "sub " + targetReg + ".x, " + targetReg + ".x, " + this._dataReg + ".y\n" + "rcp " + targetReg + ".x," + targetReg + ".x\n" + "mul " + targetReg + ".w, " + targetReg + ".y, " + targetReg + ".x\n" + "sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".x\n" + "div " + targetReg + ".z, " + targetReg + ".z, " + this._dataReg + ".w\n" + "sat " + targetReg + ".z, " + targetReg + ".z\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".z\n" + "sub " + targetReg + ".z, " + this._dataReg + ".y, " + targetReg + ".z\n" + "mul " + targetReg + ".y, " + targetReg + ".y, " + targetReg + ".z\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n" + "sat " + targetReg + ".w, " + targetReg + ".w\n";
    };
    return DiffuseCelMethod;
})(DiffuseCompositeMethod);
module.exports = DiffuseCelMethod;

},{"awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod":"awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod"}],"awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod":[function(require,module,exports){
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
    DiffuseCompositeMethod.prototype.iInitVO = function (shader, methodVO) {
        this.pBaseMethod.iInitVO(shader, methodVO);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iInitConstants = function (shader, methodVO) {
        this.pBaseMethod.iInitConstants(shader, methodVO);
    };
    DiffuseCompositeMethod.prototype.iAddOwner = function (owner) {
        _super.prototype.iAddOwner.call(this, owner);
        this.pBaseMethod.iAddOwner(owner);
    };
    DiffuseCompositeMethod.prototype.iRemoveOwner = function (owner) {
        _super.prototype.iRemoveOwner.call(this, owner);
        this.pBaseMethod.iRemoveOwner(owner);
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
    Object.defineProperty(DiffuseCompositeMethod.prototype, "color", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this.pBaseMethod.color;
        },
        /**
         * @inheritDoc
         */
        set: function (value) {
            this.pBaseMethod.color = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseCompositeMethod.prototype, "multiply", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this.pBaseMethod.multiply;
        },
        /**
         * @inheritDoc
         */
        set: function (value) {
            this.pBaseMethod.multiply = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        return this.pBaseMethod.iGetFragmentPreLightingCode(shader, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        var code = this.pBaseMethod.iGetFragmentCodePerLight(shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
        this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentCodePerProbe = function (shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
        var code = this.pBaseMethod.iGetFragmentCodePerProbe(shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
        this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iActivate = function (shader, methodVO, stage) {
        this.pBaseMethod.iActivate(shader, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        this.pBaseMethod.iSetRenderState(shader, methodVO, renderable, stage, camera);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iDeactivate = function (shader, methodVO, stage) {
        this.pBaseMethod.iDeactivate(shader, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetVertexCode = function (shader, methodVO, registerCache, sharedRegisters) {
        return this.pBaseMethod.iGetVertexCode(shader, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCompositeMethod.prototype.iGetFragmentPostLightingCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        return this.pBaseMethod.iGetFragmentPostLightingCode(shader, methodVO, targetReg, registerCache, sharedRegisters);
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

},{"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod":"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod","awayjs-renderergl/lib/events/ShadingMethodEvent":undefined}],"awayjs-methodmaterials/lib/methods/DiffuseDepthMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
    DiffuseDepthMethod.prototype.iInitConstants = function (shader, methodVO) {
        var data = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index] = 1.0;
        data[index + 1] = 1 / 255.0;
        data[index + 2] = 1 / 65025.0;
        data[index + 3] = 1 / 16581375.0;
    };
    /**
     * @inheritDoc
     */
    DiffuseDepthMethod.prototype.iGetFragmentPostLightingCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var temp;
        var decReg;
        if (!this._texture)
            throw new Error("DiffuseDepthMethod requires texture!");
        // incorporate input from ambient
        if (shader.numLights > 0) {
            if (sharedRegisters.shadowTarget)
                code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + sharedRegisters.shadowTarget + ".w\n";
            code += "add " + targetReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + targetReg + ".xyz\n" + "sat " + targetReg + ".xyz, " + targetReg + ".xyz\n";
            registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
            registerCache.addFragmentTempUsages(temp = registerCache.getFreeFragmentVectorTemp(), 1);
        }
        else {
            temp = targetReg;
        }
        decReg = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        code += methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, sharedRegisters.uvVarying) + "dp4 " + temp + ".x, " + temp + ", " + decReg + "\n" + "mov " + temp + ".yz, " + temp + ".xx			\n" + "mov " + temp + ".w, " + decReg + ".x\n" + "sub " + temp + ".xyz, " + decReg + ".xxx, " + temp + ".xyz\n";
        if (shader.numLights == 0)
            return code;
        code += "mul " + targetReg + ".xyz, " + temp + ".xyz, " + targetReg + ".xyz\n" + "mov " + targetReg + ".w, " + temp + ".w\n";
        if (shader.numLights > 0)
            registerCache.removeFragmentTempUsage(temp);
        return code;
    };
    return DiffuseDepthMethod;
})(DiffuseBasicMethod);
module.exports = DiffuseDepthMethod;

},{"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod":"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod"}],"awayjs-methodmaterials/lib/methods/DiffuseGradientMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        if (this._gradient)
            this.iAddTexture(this._gradient);
    }
    DiffuseGradientMethod.prototype.iInitVO = function (shader, methodVO) {
        _super.prototype.iInitVO.call(this, shader, methodVO);
        methodVO.secondaryTextureVO = shader.getAbstraction(this._gradient);
    };
    Object.defineProperty(DiffuseGradientMethod.prototype, "gradient", {
        /**
         * A texture that contains the light colour based on the angle. This can be used to change the light colour
         * due to subsurface scattering when the surface faces away from the light.
         */
        get: function () {
            return this._gradient;
        },
        set: function (value) {
            if (this._gradient == value)
                return;
            if (this._gradient)
                this.iRemoveTexture(this._gradient);
            this._gradient = value;
            if (this._gradient)
                this.iAddTexture(this._gradient);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
    };
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        var code = _super.prototype.iGetFragmentPreLightingCode.call(this, shader, methodVO, registerCache, sharedRegisters);
        this._pIsFirstLight = true;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
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
            code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);
        code += methodVO.secondaryTextureVO._iGetFragmentCode(t, registerCache, sharedRegisters, t) + "mul " + t + ".xyz, " + t + ".xyz, " + lightColReg + ".xyz\n";
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
    DiffuseGradientMethod.prototype.pApplyShadow = function (shader, methodVO, regCache, sharedRegisters) {
        var t = regCache.getFreeFragmentVectorTemp();
        return "mov " + t + ", " + sharedRegisters.shadowTarget + ".wwww\n" + methodVO.secondaryTextureVO._iGetFragmentCode(t, regCache, sharedRegisters, sharedRegisters.uvVarying) + "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
    };
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        methodVO.secondaryTextureVO.activate(methodVO.pass._render);
    };
    /**
     * @inheritDoc
     */
    DiffuseGradientMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        _super.prototype.iSetRenderState.call(this, shader, methodVO, renderable, stage, camera);
        if (shader.numLights > 0)
            methodVO.secondaryTextureVO._setRenderState(renderable);
    };
    return DiffuseGradientMethod;
})(DiffuseBasicMethod);
module.exports = DiffuseGradientMethod;

},{"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod":"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod"}],"awayjs-methodmaterials/lib/methods/DiffuseLightMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        this._lightMap = lightMap;
        this.blendMode = blendMode;
        if (this._lightMap)
            this.iAddTexture(this._lightMap);
    }
    /**
     * @inheritDoc
     */
    DiffuseLightMapMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.secondaryTextureVO = shader.getAbstraction(this._lightMap);
        if (this._useSecondaryUV)
            shader.secondaryUVDependencies++;
        else
            shader.uvDependencies++;
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
    Object.defineProperty(DiffuseLightMapMethod.prototype, "lightMap", {
        /**
         * The texture containing the light map data.
         */
        get: function () {
            return this._lightMap;
        },
        set: function (value) {
            if (this._lightMap == value)
                return;
            if (this._lightMap)
                this.iRemoveTexture(this._lightMap);
            this._lightMap = value;
            if (this._lightMap)
                this.iAddTexture(this._lightMap);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseLightMapMethod.prototype, "useSecondaryUV", {
        /**
         * Indicates whether the secondary UV set should be used to map the light map.
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
    /**
     * @inheritDoc
     */
    DiffuseLightMapMethod.prototype.iGetFragmentPostLightingCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code;
        var temp = registerCache.getFreeFragmentVectorTemp();
        code = methodVO.secondaryTextureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, this._useSecondaryUV ? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);
        switch (this._blendMode) {
            case DiffuseLightMapMethod.MULTIPLY:
                code += "mul " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
                break;
            case DiffuseLightMapMethod.ADD:
                code += "add " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
                break;
        }
        code += _super.prototype.iGetFragmentPostLightingCode.call(this, shader, methodVO, targetReg, registerCache, sharedRegisters);
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseLightMapMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        methodVO.secondaryTextureVO.activate(methodVO.pass._render);
    };
    /**
     * @inheritDoc
     */
    DiffuseLightMapMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        _super.prototype.iSetRenderState.call(this, shader, methodVO, renderable, stage, camera);
        methodVO.secondaryTextureVO._setRenderState(renderable);
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

},{"awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod":"awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod"}],"awayjs-methodmaterials/lib/methods/DiffuseSubSurfaceMethod":[function(require,module,exports){
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
        code += "m44 " + temp + ", vt0, " + lightProjection + "\n" + "div " + temp + ".xyz, " + temp + ".xyz, " + temp + ".w\n" + "mul " + temp + ".xy, " + temp + ".xy, " + toTexRegister + ".xy\n" + "add " + temp + ".xy, " + temp + ".xy, " + toTexRegister + ".xx\n" + "mov " + this._lightProjVarying + ".xyz, " + temp + ".xyz\n" + "mov " + this._lightProjVarying + ".w, va0.w\n";
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
        code += "mul " + temp + ".xyz, " + this._lightColorReg + ".xyz, " + this._targetReg + ".w\n" + "mul " + temp + ".xyz, " + temp + ".xyz, " + this._colorReg + ".xyz\n" + "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
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
        methodVO.secondaryTextureVO = shader.getAbstraction(this._depthPass._iGetDepthMap(renderable));
        methodVO.secondaryTextureVO._setRenderState(renderable);
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
        code += methodVO.secondaryTextureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, this._lightProjVarying) + "dp4 " + targetReg + ".z, " + temp + ", " + this._decReg + "\n";
        // currentDistanceToLight - closestDistanceToLight
        code += "sub " + targetReg + ".z, " + this._lightProjVarying + ".z, " + targetReg + ".z\n" + "sub " + targetReg + ".z, " + this._propReg + ".x, " + targetReg + ".z\n" + "mul " + targetReg + ".z, " + this._propReg + ".y, " + targetReg + ".z\n" + "sat " + targetReg + ".z, " + targetReg + ".z\n" + "neg " + targetReg + ".y, " + targetReg + ".x\n" + "mul " + targetReg + ".y, " + targetReg + ".y, " + this._propReg + ".z\n" + "add " + targetReg + ".y, " + targetReg + ".y, " + this._propReg + ".z\n" + "mul " + this._targetReg + ".w, " + targetReg + ".z, " + targetReg + ".y\n" + "sub " + targetReg + ".y, " + this._colorReg + ".w, " + this._targetReg + ".w\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
        return code;
    };
    return DiffuseSubSurfaceMethod;
})(DiffuseCompositeMethod);
module.exports = DiffuseSubSurfaceMethod;

},{"awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod":"awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod"}],"awayjs-methodmaterials/lib/methods/DiffuseWrapMethod":[function(require,module,exports){
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
    DiffuseWrapMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        var code = _super.prototype.iGetFragmentPreLightingCode.call(this, shader, methodVO, registerCache, sharedRegisters);
        this._pIsFirstLight = true;
        this._wrapDataRegister = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._wrapDataRegister.index * 4;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseWrapMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
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
            code += this._iModulateMethod(shader, methodVO, lightDirReg, registerCache, sharedRegisters);
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
    DiffuseWrapMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var index = methodVO.secondaryFragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = this._wrapFactor;
        data[index + 1] = 1 / (this._wrapFactor + 1);
    };
    return DiffuseWrapMethod;
})(DiffuseBasicMethod);
module.exports = DiffuseWrapMethod;

},{"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod":"awayjs-methodmaterials/lib/methods/DiffuseBasicMethod"}],"awayjs-methodmaterials/lib/methods/EffectAlphaMaskMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        if (this._texture)
            this.iAddTexture(this._texture);
    }
    /**
     * @inheritDoc
     */
    EffectAlphaMaskMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.textureVO = shader.getAbstraction(this._texture);
        if (this._useSecondaryUV)
            shader.secondaryUVDependencies++;
        else
            shader.uvDependencies++;
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
            if (this._texture == value)
                return;
            if (this._texture)
                this.iRemoveTexture(this._texture);
            this._texture = value;
            if (this._texture)
                this.iAddTexture(this._texture);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectAlphaMaskMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var temp = registerCache.getFreeFragmentVectorTemp();
        return methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, this._useSecondaryUV ? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying) + "mul " + targetReg + ", " + targetReg + ", " + temp + ".x\n";
    };
    /**
     * @inheritDoc
     */
    EffectAlphaMaskMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        methodVO.textureVO.activate(methodVO.pass._render);
    };
    EffectAlphaMaskMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        methodVO.textureVO._setRenderState(renderable);
    };
    return EffectAlphaMaskMethod;
})(EffectMethodBase);
module.exports = EffectAlphaMaskMethod;

},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":"awayjs-methodmaterials/lib/methods/EffectMethodBase"}],"awayjs-methodmaterials/lib/methods/EffectColorMatrixMethod":[function(require,module,exports){
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
    EffectColorMatrixMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
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
    EffectColorMatrixMethod.prototype.iActivate = function (shader, methodVO, stage) {
        var matrix = this._matrix;
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
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

},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":"awayjs-methodmaterials/lib/methods/EffectMethodBase"}],"awayjs-methodmaterials/lib/methods/EffectColorTransformMethod":[function(require,module,exports){
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
    EffectColorTransformMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
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
    EffectColorTransformMethod.prototype.iActivate = function (shader, methodVO, stage) {
        var inv = 1 / 0xff;
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
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

},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":"awayjs-methodmaterials/lib/methods/EffectMethodBase"}],"awayjs-methodmaterials/lib/methods/EffectEnvMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        this._envMap = envMap;
        this._alpha = alpha;
        if (this._envMap)
            this.iAddTexture(this._envMap);
    }
    Object.defineProperty(EffectEnvMapMethod.prototype, "mask", {
        /**
         * An optional texture to modulate the reflectivity of the surface.
         */
        get: function () {
            return this._mask;
        },
        set: function (value) {
            if (value == this._mask)
                return;
            if (this._mask)
                this.iRemoveTexture(this._mask);
            this._mask = value;
            if (this._mask)
                this.iAddTexture(this._mask);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectEnvMapMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsNormals = true;
        methodVO.needsView = true;
        if (this._envMap)
            methodVO.textureVO = shader.getAbstraction(this._envMap);
        if (this._mask) {
            methodVO.secondaryTextureVO = shader.getAbstraction(this._mask);
            shader.uvDependencies++;
        }
    };
    Object.defineProperty(EffectEnvMapMethod.prototype, "envMap", {
        /**
         * The cubic environment map containing the reflected scene.
         */
        get: function () {
            return this._envMap;
        },
        set: function (value) {
            if (this._envMap == value)
                return;
            if (this._envMap)
                this.iRemoveTexture(this._envMap);
            this._envMap = value;
            if (this._envMap)
                this.iAddTexture(this._envMap);
            this.iInvalidateShaderProgram();
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
    EffectEnvMapMethod.prototype.iActivate = function (shader, methodVO, stage) {
        shader.fragmentConstantData[methodVO.fragmentConstantsIndex] = this._alpha;
        methodVO.textureVO.activate(methodVO.pass._render);
        if (this._mask)
            methodVO.secondaryTextureVO.activate(methodVO.pass._render);
    };
    EffectEnvMapMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        methodVO.textureVO._setRenderState(renderable);
        if (this._mask)
            methodVO.secondaryTextureVO._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    EffectEnvMapMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var dataRegister = registerCache.getFreeFragmentConstant();
        var code = "";
        methodVO.fragmentConstantsIndex = dataRegister.index * 4;
        var temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp2, 1);
        // r = I - 2(I.N)*N
        code += "dp3 " + temp + ".w, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" + "add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" + "mul " + temp + ".xyz, " + sharedRegisters.normalFragment + ".xyz, " + temp + ".w\n" + "sub " + temp + ".xyz, " + temp + ".xyz, " + sharedRegisters.viewDirFragment + ".xyz\n" + methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) + "sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" + "kil " + temp2 + ".w\n" + "sub " + temp + ", " + temp + ", " + targetReg + "\n";
        if (this._mask) {
            code += methodVO.secondaryTextureVO._iGetFragmentCode(temp2, registerCache, sharedRegisters, sharedRegisters.uvVarying) + "mul " + temp + ", " + temp2 + ", " + temp + "\n";
        }
        code += "mul " + temp + ", " + temp + ", " + dataRegister + ".x\n" + "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
        registerCache.removeFragmentTempUsage(temp);
        registerCache.removeFragmentTempUsage(temp2);
        return code;
    };
    return EffectEnvMapMethod;
})(EffectMethodBase);
module.exports = EffectEnvMapMethod;

},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":"awayjs-methodmaterials/lib/methods/EffectMethodBase"}],"awayjs-methodmaterials/lib/methods/EffectFogMethod":[function(require,module,exports){
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
    EffectFogMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsProjection = true;
    };
    /**
     * @inheritDoc
     */
    EffectFogMethod.prototype.iInitConstants = function (shader, methodVO) {
        var data = shader.fragmentConstantData;
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
    EffectFogMethod.prototype.iActivate = function (shader, methodVO, stage) {
        var data = shader.fragmentConstantData;
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
    EffectFogMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
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

},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":"awayjs-methodmaterials/lib/methods/EffectMethodBase"}],"awayjs-methodmaterials/lib/methods/EffectFresnelEnvMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        this._envMap = envMap;
        this._alpha = alpha;
        if (this._envMap)
            this.iAddTexture(this._envMap);
    }
    /**
     * @inheritDoc
     */
    EffectFresnelEnvMapMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsNormals = true;
        methodVO.needsView = true;
        methodVO.textureVO = shader.getAbstraction(this._envMap);
        if (this._mask != null) {
            methodVO.secondaryTextureVO = shader.getAbstraction(this._mask);
            shader.uvDependencies++;
        }
    };
    /**
     * @inheritDoc
     */
    EffectFresnelEnvMapMethod.prototype.iInitConstants = function (shader, methodVO) {
        shader.fragmentConstantData[methodVO.fragmentConstantsIndex + 3] = 1;
    };
    Object.defineProperty(EffectFresnelEnvMapMethod.prototype, "mask", {
        /**
         * An optional texture to modulate the reflectivity of the surface.
         */
        get: function () {
            return this._mask;
        },
        set: function (value) {
            if (this._mask == value)
                return;
            if (this._mask)
                this.iRemoveTexture(this._mask);
            this._mask = value;
            if (this._mask)
                this.iAddTexture(this._mask);
            this.iInvalidateShaderProgram();
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
            return this._envMap;
        },
        set: function (value) {
            if (this._envMap == value)
                return;
            if (this._envMap)
                this.iRemoveTexture(this._envMap);
            this._envMap = value;
            if (this._envMap)
                this.iAddTexture(this._envMap);
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
    EffectFresnelEnvMapMethod.prototype.iActivate = function (shader, methodVO, stage) {
        var data = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index] = this._alpha;
        data[index + 1] = this._normalReflectance;
        data[index + 2] = this._fresnelPower;
        methodVO.textureVO.activate(methodVO.pass._render);
        if (this._mask)
            methodVO.secondaryTextureVO.activate(methodVO.pass._render);
    };
    EffectFresnelEnvMapMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        methodVO.textureVO._setRenderState(renderable);
        if (this._mask)
            methodVO.secondaryTextureVO._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    EffectFresnelEnvMapMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var dataRegister = registerCache.getFreeFragmentConstant();
        var code = "";
        var viewDirReg = sharedRegisters.viewDirFragment;
        var normalReg = sharedRegisters.normalFragment;
        methodVO.fragmentConstantsIndex = dataRegister.index * 4;
        var temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp2, 1);
        // r = V - 2(V.N)*N
        code += "dp3 " + temp + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" + "mul " + temp + ".xyz, " + normalReg + ".xyz, " + temp + ".w\n" + "sub " + temp + ".xyz, " + temp + ".xyz, " + viewDirReg + ".xyz\n" + methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) + "sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" + "kil " + temp2 + ".w\n" + "sub " + temp + ", " + temp + ", " + targetReg + "\n";
        // calculate fresnel term
        code += "dp3 " + viewDirReg + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "sub " + viewDirReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" + "pow " + viewDirReg + ".w, " + viewDirReg + ".w, " + dataRegister + ".z\n" + "sub " + normalReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" + "mul " + normalReg + ".w, " + dataRegister + ".y, " + normalReg + ".w\n" + "add " + viewDirReg + ".w, " + viewDirReg + ".w, " + normalReg + ".w\n" + "mul " + viewDirReg + ".w, " + dataRegister + ".x, " + viewDirReg + ".w\n";
        if (this._mask) {
            code += methodVO.secondaryTextureVO._iGetFragmentCode(temp2, registerCache, sharedRegisters, sharedRegisters.uvVarying) + "mul " + viewDirReg + ".w, " + temp2 + ".x, " + viewDirReg + ".w\n";
        }
        // blend
        code += "mul " + temp + ", " + temp + ", " + viewDirReg + ".w\n" + "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
        registerCache.removeFragmentTempUsage(temp);
        registerCache.removeFragmentTempUsage(temp2);
        return code;
    };
    return EffectFresnelEnvMapMethod;
})(EffectMethodBase);
module.exports = EffectFresnelEnvMapMethod;

},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":"awayjs-methodmaterials/lib/methods/EffectMethodBase"}],"awayjs-methodmaterials/lib/methods/EffectLightMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
     * @param lightMap The texture containing the light map.
     * @param blendMode The blend mode with which the light map should be applied to the lighting result.
     * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
     */
    function EffectLightMapMethod(lightMap, blendMode, useSecondaryUV) {
        if (blendMode === void 0) { blendMode = "multiply"; }
        if (useSecondaryUV === void 0) { useSecondaryUV = false; }
        _super.call(this);
        if (blendMode != EffectLightMapMethod.ADD && blendMode != EffectLightMapMethod.MULTIPLY)
            throw new Error("Unknown blendmode!");
        this._lightMap = lightMap;
        this._blendMode = blendMode;
        this._useSecondaryUV = useSecondaryUV;
        if (this._lightMap)
            this.iAddTexture(this._lightMap);
    }
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.textureVO = shader.getAbstraction(this._lightMap);
        if (this._useSecondaryUV)
            shader.secondaryUVDependencies++;
        else
            shader.uvDependencies++;
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
            if (this._blendMode == value)
                return;
            if (value != EffectLightMapMethod.ADD && value != EffectLightMapMethod.MULTIPLY)
                throw new Error("Unknown blendmode!");
            this._blendMode = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectLightMapMethod.prototype, "lightMap", {
        /**
         * The lightMap containing the light map.
         */
        get: function () {
            return this._lightMap;
        },
        set: function (value) {
            if (this._lightMap == value)
                return;
            if (this._lightMap)
                this.iRemoveTexture(this._lightMap);
            this._lightMap = value;
            if (this._lightMap)
                this.iAddTexture(this._lightMap);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectLightMapMethod.prototype, "useSecondaryUV", {
        /**
         * Indicates whether the secondary UV set should be used to map the light map.
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
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code;
        var temp = registerCache.getFreeFragmentVectorTemp();
        code = methodVO.secondaryTextureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, this._useSecondaryUV ? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);
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
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iActivate = function (shader, methodVO, stage) {
        methodVO.textureVO.activate(methodVO.pass._render);
    };
    EffectLightMapMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        methodVO.textureVO._setRenderState(renderable);
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

},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":"awayjs-methodmaterials/lib/methods/EffectMethodBase"}],"awayjs-methodmaterials/lib/methods/EffectMethodBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
            return EffectMethodBase.assetType;
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
    EffectMethodBase.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        throw new AbstractMethodError();
        return "";
    };
    EffectMethodBase.assetType = "[asset EffectMethod]";
    return EffectMethodBase;
})(ShadingMethodBase);
module.exports = EffectMethodBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-methodmaterials/lib/methods/ShadingMethodBase":"awayjs-methodmaterials/lib/methods/ShadingMethodBase"}],"awayjs-methodmaterials/lib/methods/EffectRefractionEnvMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        if (this._envMap)
            this.iAddTexture(this._envMap);
    }
    /**
     * @inheritDoc
     */
    EffectRefractionEnvMapMethod.prototype.iInitConstants = function (shader, methodVO) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index + 4] = 1;
        data[index + 5] = 0;
        data[index + 7] = 1;
    };
    /**
     * @inheritDoc
     */
    EffectRefractionEnvMapMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsNormals = true;
        methodVO.needsView = true;
        methodVO.textureVO = shader.getAbstraction(this._envMap);
    };
    Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "envMap", {
        /**
         * The cube environment map to use for the refraction.
         */
        get: function () {
            return this._envMap;
        },
        set: function (value) {
            if (this._envMap == value)
                return;
            if (this._envMap)
                this.iRemoveTexture(this._envMap);
            this._envMap = value;
            if (this._envMap)
                this.iAddTexture(this._envMap);
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
    EffectRefractionEnvMapMethod.prototype.iActivate = function (shader, methodVO, stage) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = this._dispersionR + this._refractionIndex;
        if (this._useDispersion) {
            data[index + 1] = this._dispersionG + this._refractionIndex;
            data[index + 2] = this._dispersionB + this._refractionIndex;
        }
        data[index + 3] = this._alpha;
        methodVO.textureVO.activate(methodVO.pass._render);
    };
    EffectRefractionEnvMapMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        methodVO.textureVO._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    EffectRefractionEnvMapMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        // todo: data2.x could use common reg, so only 1 reg is used
        var data = registerCache.getFreeFragmentConstant();
        var data2 = registerCache.getFreeFragmentConstant();
        var code = "";
        var refractionDir;
        var refractionColor;
        var temp;
        methodVO.fragmentConstantsIndex = data.index * 4;
        refractionDir = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(refractionDir, 1);
        refractionColor = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(refractionColor, 1);
        temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var viewDirReg = sharedRegisters.viewDirFragment;
        var normalReg = sharedRegisters.normalFragment;
        code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";
        code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "sqt " + temp + ".y, " + temp + ".w\n" + "mul " + temp + ".x, " + data + ".x, " + temp + ".x\n" + "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" + "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" + "mul " + refractionDir + ", " + data + ".x, " + viewDirReg + "\n" + "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" + "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" + methodVO.textureVO._iGetFragmentCode(refractionColor, registerCache, sharedRegisters, refractionDir) + "sub " + refractionColor + ".w, " + refractionColor + ".w, fc0.x	\n" + "kil " + refractionColor + ".w\n";
        if (this._useDispersion) {
            // GREEN
            code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "sqt " + temp + ".y, " + temp + ".w\n" + "mul " + temp + ".x, " + data + ".y, " + temp + ".x\n" + "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" + "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" + "mul " + refractionDir + ", " + data + ".y, " + viewDirReg + "\n" + "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" + "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" + methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, refractionDir) + "mov " + refractionColor + ".y, " + temp + ".y\n";
            // BLUE
            code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "sqt " + temp + ".y, " + temp + ".w\n" + "mul " + temp + ".x, " + data + ".z, " + temp + ".x\n" + "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" + "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" + "mul " + refractionDir + ", " + data + ".z, " + viewDirReg + "\n" + "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" + "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n" + methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, refractionDir) + "mov " + refractionColor + ".z, " + temp + ".z\n";
        }
        code += "sub " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + targetReg + ".xyz\n" + "mul " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + data + ".w\n" + "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + refractionColor + ".xyz\n";
        registerCache.removeFragmentTempUsage(temp);
        registerCache.removeFragmentTempUsage(refractionDir);
        registerCache.removeFragmentTempUsage(refractionColor);
        // restore
        code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";
        return code;
    };
    return EffectRefractionEnvMapMethod;
})(EffectMethodBase);
module.exports = EffectRefractionEnvMapMethod;

},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":"awayjs-methodmaterials/lib/methods/EffectMethodBase"}],"awayjs-methodmaterials/lib/methods/EffectRimLightMethod":[function(require,module,exports){
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
    EffectRimLightMethod.prototype.iInitConstants = function (shader, methodVO) {
        shader.fragmentConstantData[methodVO.fragmentConstantsIndex + 3] = 1;
    };
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iInitVO = function (shader, methodVO) {
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
    EffectRimLightMethod.prototype.iActivate = function (shader, methodVO, stage) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = this._colorR;
        data[index + 1] = this._colorG;
        data[index + 2] = this._colorB;
        data[index + 4] = this._strength;
        data[index + 5] = this._power;
    };
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
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

},{"awayjs-methodmaterials/lib/methods/EffectMethodBase":"awayjs-methodmaterials/lib/methods/EffectMethodBase"}],"awayjs-methodmaterials/lib/methods/LightingMethodBase":[function(require,module,exports){
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
    LightingMethodBase.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
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
    LightingMethodBase.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
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
    LightingMethodBase.prototype.iGetFragmentCodePerProbe = function (shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
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
    LightingMethodBase.prototype.iGetFragmentPostLightingCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        return "";
    };
    return LightingMethodBase;
})(ShadingMethodBase);
module.exports = LightingMethodBase;

},{"awayjs-methodmaterials/lib/methods/ShadingMethodBase":"awayjs-methodmaterials/lib/methods/ShadingMethodBase"}],"awayjs-methodmaterials/lib/methods/NormalBasicMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
/**
 * NormalBasicMethod is the default method for standard tangent-space normal mapping.
 */
var NormalBasicMethod = (function (_super) {
    __extends(NormalBasicMethod, _super);
    /**
     * Creates a new NormalBasicMethod object.
     */
    function NormalBasicMethod(texture) {
        if (texture === void 0) { texture = null; }
        _super.call(this);
        this._texture = texture;
        if (this._texture)
            this.iAddTexture(this._texture);
    }
    NormalBasicMethod.prototype.iIsUsed = function (shader) {
        if (this._texture && shader.normalDependencies)
            return true;
        return false;
    };
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.iInitVO = function (shader, methodVO) {
        if (this._texture) {
            methodVO.textureVO = shader.getAbstraction(this._texture);
            shader.uvDependencies++;
        }
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
        if (bnm.texture != null)
            this.texture = bnm.texture;
    };
    Object.defineProperty(NormalBasicMethod.prototype, "texture", {
        /**
         * A texture to modulate the direction of the surface for each texel (normal map). The default normal method expects
         * tangent-space normal maps, but others could expect object-space maps.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            if (this._texture == value)
                return;
            if (this._texture)
                this.iRemoveTexture(this._texture);
            this._texture = value;
            if (this._texture)
                this.iAddTexture(this._texture);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
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
    NormalBasicMethod.prototype.iActivate = function (shader, methodVO, stage) {
        if (this._texture)
            methodVO.textureVO.activate(methodVO.pass._render);
    };
    NormalBasicMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        if (this._texture)
            methodVO.textureVO._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        if (this._texture)
            code += methodVO.textureVO._iGetFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying);
        code += "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx\n" + "nrm " + targetReg + ".xyz, " + targetReg + "\n";
        return code;
    };
    return NormalBasicMethod;
})(ShadingMethodBase);
module.exports = NormalBasicMethod;

},{"awayjs-methodmaterials/lib/methods/ShadingMethodBase":"awayjs-methodmaterials/lib/methods/ShadingMethodBase"}],"awayjs-methodmaterials/lib/methods/NormalHeightMapMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        this.texture = heightMap;
        this._worldXYRatio = worldWidth / worldHeight;
        this._worldXZRatio = worldDepth / worldHeight;
    }
    /**
     * @inheritDoc
     */
    NormalHeightMapMethod.prototype.iInitConstants = function (shader, methodVO) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = 1 / this.texture.image2D.width;
        data[index + 1] = 1 / this.texture.image2D.height;
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
    NormalHeightMapMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var dataReg = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = dataReg.index * 4;
        code += methodVO.textureVO._iGetFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying) + "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".xzzz\n" + methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) + "sub " + targetReg + ".x, " + targetReg + ".x, " + temp + ".x\n" + "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".zyzz\n" + methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) + "sub " + targetReg + ".z, " + targetReg + ".z, " + temp + ".x\n" + "mov " + targetReg + ".y, " + dataReg + ".w\n" + "mul " + targetReg + ".xz, " + targetReg + ".xz, " + dataReg2 + ".xy\n" + "nrm " + targetReg + ".xyz, " + targetReg + ".xyz\n";
        registerCache.removeFragmentTempUsage(temp);
        return code;
    };
    return NormalHeightMapMethod;
})(NormalBasicMethod);
module.exports = NormalHeightMapMethod;

},{"awayjs-methodmaterials/lib/methods/NormalBasicMethod":"awayjs-methodmaterials/lib/methods/NormalBasicMethod"}],"awayjs-methodmaterials/lib/methods/NormalSimpleWaterMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
    function NormalSimpleWaterMethod(normalMap, secondaryNormalMap) {
        if (normalMap === void 0) { normalMap = null; }
        if (secondaryNormalMap === void 0) { secondaryNormalMap = null; }
        _super.call(this, normalMap);
        this._water1OffsetX = 0;
        this._water1OffsetY = 0;
        this._water2OffsetX = 0;
        this._water2OffsetY = 0;
        this._secondaryNormalMap = secondaryNormalMap;
        if (this._secondaryNormalMap)
            this.iAddTexture(this._secondaryNormalMap);
    }
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iInitConstants = function (shader, methodVO) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = .5;
        data[index + 1] = 0;
        data[index + 2] = 0;
        data[index + 3] = 1;
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iInitVO = function (shader, methodVO) {
        _super.prototype.iInitVO.call(this, shader, methodVO);
        if (this._secondaryNormalMap) {
            methodVO.secondaryTextureVO = shader.getAbstraction(this._secondaryNormalMap);
            shader.uvDependencies++;
        }
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
            return this._secondaryNormalMap;
        },
        set: function (value) {
            if (this._secondaryNormalMap == value)
                return;
            if (this._secondaryNormalMap)
                this.iRemoveTexture(this._secondaryNormalMap);
            this._secondaryNormalMap = value;
            if (this._secondaryNormalMap)
                this.iAddTexture(this._secondaryNormalMap);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._secondaryNormalMap = null;
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var data = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index + 4] = this._water1OffsetX;
        data[index + 5] = this._water1OffsetY;
        data[index + 6] = this._water2OffsetX;
        data[index + 7] = this._water2OffsetY;
        if (this._secondaryNormalMap)
            methodVO.secondaryTextureVO.activate(methodVO.pass._render);
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        _super.prototype.iSetRenderState.call(this, shader, methodVO, renderable, stage, camera);
        if (this._secondaryNormalMap)
            methodVO.secondaryTextureVO._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var dataReg = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = dataReg.index * 4;
        code += "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".xyxy\n";
        if (this.texture)
            code += methodVO.textureVO._iGetFragmentCode(targetReg, registerCache, sharedRegisters, temp);
        code += "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".zwzw\n";
        if (this._secondaryNormalMap)
            code += methodVO.secondaryTextureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, temp);
        code += "add " + targetReg + ", " + targetReg + ", " + temp + "		\n" + "mul " + targetReg + ", " + targetReg + ", " + dataReg + ".x	\n" + "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx	\n" + "nrm " + targetReg + ".xyz, " + targetReg + ".xyz							\n";
        return code;
    };
    return NormalSimpleWaterMethod;
})(NormalBasicMethod);
module.exports = NormalSimpleWaterMethod;

},{"awayjs-methodmaterials/lib/methods/NormalBasicMethod":"awayjs-methodmaterials/lib/methods/NormalBasicMethod"}],"awayjs-methodmaterials/lib/methods/ShadingMethodBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetBase = require("awayjs-core/lib/library/AssetBase");
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
        this._textures = new Array();
        this._owners = new Array();
        this._counts = new Array();
    }
    Object.defineProperty(ShadingMethodBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return ShadingMethodBase.assetType;
        },
        enumerable: true,
        configurable: true
    });
    ShadingMethodBase.prototype.iIsUsed = function (shader) {
        return true;
    };
    /**
     * Initializes the properties for a MethodVO, including register and texture indices.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iInitVO = function (shader, methodVO) {
    };
    /**
     * Initializes unchanging shader constants using the data from a MethodVO.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iInitConstants = function (shader, methodVO) {
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
    ShadingMethodBase.prototype.iAddOwner = function (owner) {
        //a method can be used more than once in the same material, so we check for this
        var index = this._owners.indexOf(owner);
        if (index != -1) {
            this._counts[index]++;
        }
        else {
            this._owners.push(owner);
            this._counts.push(1);
            //add textures
            var len = this._textures.length;
            for (var i = 0; i < len; i++)
                owner.addTexture(this._textures[i]);
        }
    };
    ShadingMethodBase.prototype.iRemoveOwner = function (owner) {
        var index = this._owners.indexOf(owner);
        if (this._counts[index] != 1) {
            this._counts[index]--;
        }
        else {
            this._owners.splice(index, 1);
            this._counts.splice(index, 1);
            //remove textures
            var len = this._textures.length;
            for (var i = 0; i < len; i++)
                owner.removeTexture(this._textures[i]);
        }
    };
    /**
     *
     */
    ShadingMethodBase.prototype.iAddTexture = function (texture) {
        this._textures.push(texture);
        var len = this._owners.length;
        for (var i = 0; i < len; i++)
            this._owners[i].addTexture(texture);
    };
    /**
     *
     */
    ShadingMethodBase.prototype.iRemoveTexture = function (texture) {
        this._textures.splice(this._textures.indexOf(texture), 1);
        var len = this._owners.length;
        for (var i = 0; i < len; i++)
            this._owners[i].removeTexture(texture);
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
    ShadingMethodBase.prototype.iGetVertexCode = function (shader, methodVO, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * @inheritDoc
     */
    ShadingMethodBase.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
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
    ShadingMethodBase.prototype.iActivate = function (shader, methodVO, stage) {
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
    ShadingMethodBase.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
    };
    /**
     * Clears the render state for this method.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param stage The Stage object currently used for rendering.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iDeactivate = function (shader, methodVO, stage) {
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
    ShadingMethodBase.assetType = "[asset ShadingMethod]";
    return ShadingMethodBase;
})(AssetBase);
module.exports = ShadingMethodBase;

},{"awayjs-core/lib/library/AssetBase":undefined,"awayjs-renderergl/lib/events/ShadingMethodEvent":undefined}],"awayjs-methodmaterials/lib/methods/ShadowCascadeMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
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
        this._cascadeShadowMapper.addEventListener(AssetEvent.INVALIDATE, function (event) { return _this.onCascadeChange(event); });
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
    ShadowCascadeMethod.prototype.iInitVO = function (shader, methodVO) {
        var tempVO = new MethodVO(this._baseMethod, methodVO.pass);
        this._baseMethod.iInitVO(shader, tempVO);
        methodVO.needsGlobalVertexPos = true;
        methodVO.needsProjection = true;
        methodVO.textureVO = shader.getAbstraction(this._pCastingLight.shadowMapper.depthMap);
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
            code += "sub " + temp + ", " + uvProjection + ", " + uvCoord + "\n" + "mul " + temp + ", " + temp + ", " + inQuad + ".z\n" + "add " + uvCoord + ", " + uvCoord + ", " + temp + "\n";
        }
        registerCache.removeFragmentTempUsage(inQuad);
        code += "div " + uvCoord + ", " + uvCoord + ", " + uvCoord + ".w\n" + "mul " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zw\n" + "add " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zz\n";
        code += this._baseMethod._iGetCascadeFragmentCode(shader, methodVO, decReg, uvCoord, targetReg, registerCache, sharedRegisters) + "add " + targetReg + ".w, " + targetReg + ".w, " + dataReg + ".y\n";
        registerCache.removeFragmentTempUsage(uvCoord);
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowCascadeMethod.prototype.iActivate = function (shader, methodVO, stage) {
        methodVO.textureVO.activate(methodVO.pass._render);
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
})(ShadowMapMethodBase);
module.exports = ShadowCascadeMethod;

},{"awayjs-core/lib/events/AssetEvent":undefined,"awayjs-display/lib/entities/DirectionalLight":undefined,"awayjs-methodmaterials/lib/data/MethodVO":"awayjs-methodmaterials/lib/data/MethodVO","awayjs-methodmaterials/lib/methods/ShadowMapMethodBase":"awayjs-methodmaterials/lib/methods/ShadowMapMethodBase","awayjs-renderergl/lib/events/ShadingMethodEvent":undefined}],"awayjs-methodmaterials/lib/methods/ShadowDitheredMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BitmapImage2D = require("awayjs-core/lib/image/BitmapImage2D");
var Single2DTexture = require("awayjs-display/lib/textures/Single2DTexture");
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
            if (value < 1)
                value = 1;
            else if (value > 24)
                value = 24;
            if (this._numSamples == value)
                return;
            this._numSamples = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iInitVO = function (shader, methodVO) {
        _super.prototype.iInitVO.call(this, shader, methodVO);
        methodVO.needsProjection = true;
        methodVO.secondaryTextureVO = shader.getAbstraction(ShadowDitheredMethod._grainTexture);
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iInitConstants = function (shader, methodVO) {
        _super.prototype.iInitConstants.call(this, shader, methodVO);
        var fragmentData = shader.fragmentConstantData;
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
        ShadowDitheredMethod._grainBitmapImage2D = new BitmapImage2D(64, 64, false);
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
        ShadowDitheredMethod._grainBitmapImage2D.setArray(ShadowDitheredMethod._grainBitmapImage2D.rect, vec);
        ShadowDitheredMethod._grainTexture = new Single2DTexture(ShadowDitheredMethod._grainBitmapImage2D);
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.dispose = function () {
        if (--ShadowDitheredMethod._grainUsages == 0) {
            ShadowDitheredMethod._grainTexture.dispose();
            ShadowDitheredMethod._grainBitmapImage2D.dispose();
            ShadowDitheredMethod._grainTexture = null;
        }
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var data = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index + 9] = (stage.width - 1) / 63;
        data[index + 10] = (stage.height - 1) / 63;
        data[index + 11] = 2 * this._range / this._depthMapSize;
        methodVO.secondaryTextureVO.activate(methodVO.pass._render);
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        _super.prototype.iSetRenderState.call(this, shader, methodVO, renderable, stage, camera);
        methodVO.secondaryTextureVO._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype._pGetPlanarFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        var decReg = regCache.getFreeFragmentConstant();
        var dataReg = regCache.getFreeFragmentConstant();
        var customDataReg = regCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        return this.getSampleCode(shader, methodVO, customDataReg, decReg, targetReg, regCache, sharedRegisters);
    };
    /**
     * Get the actual shader code for shadow mapping
     * @param regCache The register cache managing the registers.
     * @param depthMapRegister The texture register containing the depth map.
     * @param decReg The register containing the depth map decoding data.
     * @param targetReg The target register to add the shadow coverage.
     */
    ShadowDitheredMethod.prototype.getSampleCode = function (shader, methodVO, customDataReg, decReg, targetReg, regCache, sharedRegisters) {
        var code = "";
        var numSamples = this._numSamples;
        var uvReg = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(uvReg, 1);
        var temp = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(temp, 1);
        var projectionReg = sharedRegisters.projectionFragment;
        code += "div " + uvReg + ", " + projectionReg + ", " + projectionReg + ".w\n" + "mul " + uvReg + ".xy, " + uvReg + ".xy, " + customDataReg + ".yz\n";
        while (numSamples > 0) {
            if (numSamples == this._numSamples) {
                code += methodVO.secondaryTextureVO._iGetFragmentCode(uvReg, regCache, sharedRegisters, uvReg);
            }
            else {
                code += "mov " + temp + ", " + uvReg + ".zwxy \n" + methodVO.secondaryTextureVO._iGetFragmentCode(uvReg, regCache, sharedRegisters, temp);
            }
            // keep grain in uvReg.zw
            code += "sub " + uvReg + ".zw, " + uvReg + ".xy, fc0.xx\n" + "mul " + uvReg + ".zw, " + uvReg + ".zw, " + customDataReg + ".w\n"; // (tex unpack scale and tex scale in one)
            if (numSamples == this._numSamples) {
                // first sample
                code += "add " + uvReg + ".xy, " + uvReg + ".zw, " + this._pDepthMapCoordReg + ".xy\n" + methodVO.textureVO._iGetFragmentCode(temp, regCache, sharedRegisters, uvReg) + "dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" + "slt " + targetReg + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow
            }
            else {
                code += this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            }
            if (numSamples > 4)
                code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            if (numSamples > 1)
                code += "sub " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + uvReg + ".zw\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            if (numSamples > 5)
                code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            if (numSamples > 2) {
                code += "neg " + uvReg + ".w, " + uvReg + ".w\n"; // will be rotated 90 degrees when being accessed as wz
                code += "add " + uvReg + ".xy, " + uvReg + ".wz, " + this._pDepthMapCoordReg + ".xy\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            }
            if (numSamples > 6)
                code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            if (numSamples > 3)
                code += "sub " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + uvReg + ".wz\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            if (numSamples > 7)
                code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this.addSample(shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters);
            numSamples -= 8;
        }
        regCache.removeFragmentTempUsage(temp);
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
    ShadowDitheredMethod.prototype.addSample = function (shader, methodVO, uvReg, decReg, targetReg, regCache, sharedRegisters) {
        var temp = regCache.getFreeFragmentVectorTemp();
        return methodVO.textureVO._iGetFragmentCode(temp, regCache, sharedRegisters, uvReg) + "dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" + "slt " + temp + ".z, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + temp + ".z\n";
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype.iActivateForCascade = function (shader, methodVO, stage) {
        var data = shader.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        data[index] = 1 / this._numSamples;
        data[index + 1] = (stage.width - 1) / 63;
        data[index + 2] = (stage.height - 1) / 63;
        data[index + 3] = 2 * this._range / this._depthMapSize;
        methodVO.secondaryTextureVO.activate(methodVO.pass._render);
    };
    /**
     * @inheritDoc
     */
    ShadowDitheredMethod.prototype._iGetCascadeFragmentCode = function (shader, methodVO, decodeRegister, depthProjection, targetRegister, registerCache, sharedRegisters) {
        this._pDepthMapCoordReg = depthProjection;
        var dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
        return this.getSampleCode(shader, methodVO, dataReg, decodeRegister, targetRegister, registerCache, sharedRegisters);
    };
    return ShadowDitheredMethod;
})(ShadowMethodBase);
module.exports = ShadowDitheredMethod;

},{"awayjs-core/lib/image/BitmapImage2D":undefined,"awayjs-display/lib/textures/Single2DTexture":undefined,"awayjs-methodmaterials/lib/methods/ShadowMethodBase":"awayjs-methodmaterials/lib/methods/ShadowMethodBase"}],"awayjs-methodmaterials/lib/methods/ShadowFilteredMethod":[function(require,module,exports){
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
    ShadowFilteredMethod.prototype.iInitConstants = function (shader, methodVO) {
        _super.prototype.iInitConstants.call(this, shader, methodVO);
        var fragmentData = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        fragmentData[index + 8] = .5;
        var size = this.castingLight.shadowMapper.depthMapSize;
        fragmentData[index + 9] = size;
        fragmentData[index + 10] = 1 / size;
    };
    /**
     * @inheritDoc
     */
    ShadowFilteredMethod.prototype._pGetPlanarFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        var code = "";
        var decReg = regCache.getFreeFragmentConstant();
        regCache.getFreeFragmentConstant();
        var customDataReg = regCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        var depthCol = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(depthCol, 1);
        var uvReg = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(uvReg, 1);
        code += "mov " + uvReg + ", " + this._pDepthMapCoordReg + "\n" + methodVO.textureVO._iGetFragmentCode(depthCol, regCache, sharedRegisters, this._pDepthMapCoordReg) + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" + "add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" + methodVO.textureVO._iGetFragmentCode(depthCol, regCache, sharedRegisters, uvReg) + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" + "mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + targetReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" + "mov " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x\n" + "add " + uvReg + ".y, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".z\n" + methodVO.textureVO._iGetFragmentCode(depthCol, regCache, sharedRegisters, uvReg) + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" + "add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" + methodVO.textureVO._iGetFragmentCode(depthCol, regCache, sharedRegisters, uvReg) + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" + "mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + uvReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" + "mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + targetReg + ".w\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + uvReg + ".w\n";
        regCache.removeFragmentTempUsage(depthCol);
        regCache.removeFragmentTempUsage(uvReg);
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowFilteredMethod.prototype.iActivateForCascade = function (shader, methodVO, stage) {
        var size = this.castingLight.shadowMapper.depthMapSize;
        var index = methodVO.secondaryFragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = size;
        data[index + 1] = 1 / size;
    };
    /**
     * @inheritDoc
     */
    ShadowFilteredMethod.prototype._iGetCascadeFragmentCode = function (shader, methodVO, decodeRegister, depthProjection, targetRegister, registerCache, sharedRegisters) {
        var code;
        var dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
        var temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var predicate = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(predicate, 1);
        code = methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".x, " + depthProjection + ".z, " + temp + ".z\n" + "add " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" + methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".z, " + depthProjection + ".z, " + temp + ".z\n" + "add " + depthProjection + ".y, " + depthProjection + ".y, " + dataReg + ".y\n" + methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".w, " + depthProjection + ".z, " + temp + ".z\n" + "sub " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" + methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".y, " + depthProjection + ".z, " + temp + ".z\n" + "mul " + temp + ".xy, " + depthProjection + ".xy, " + dataReg + ".x\n" + "frc " + temp + ".xy, " + temp + ".xy\n" + "sub " + depthProjection + ", " + predicate + ".xyzw, " + predicate + ".zwxy\n" + "mul " + depthProjection + ", " + depthProjection + ", " + temp + ".x\n" + "add " + predicate + ".xy, " + predicate + ".xy, " + depthProjection + ".zw\n" + "sub " + predicate + ".y, " + predicate + ".y, " + predicate + ".x\n" + "mul " + predicate + ".y, " + predicate + ".y, " + temp + ".y\n" + "add " + targetRegister + ".w, " + predicate + ".x, " + predicate + ".y\n";
        registerCache.removeFragmentTempUsage(temp);
        registerCache.removeFragmentTempUsage(predicate);
        return code;
    };
    return ShadowFilteredMethod;
})(ShadowMethodBase);
module.exports = ShadowFilteredMethod;

},{"awayjs-methodmaterials/lib/methods/ShadowMethodBase":"awayjs-methodmaterials/lib/methods/ShadowMethodBase"}],"awayjs-methodmaterials/lib/methods/ShadowHardMethod":[function(require,module,exports){
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
    ShadowHardMethod.prototype._pGetPlanarFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        var code = "";
        var decReg = regCache.getFreeFragmentConstant();
        regCache.getFreeFragmentConstant();
        var depthCol = regCache.getFreeFragmentVectorTemp();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        code += methodVO.textureVO._iGetFragmentCode(depthCol, regCache, sharedRegisters, this._pDepthMapCoordReg) + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + targetReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n"; // 0 if in shadow
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowHardMethod.prototype._pGetPointFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        var code = "";
        var decReg = regCache.getFreeFragmentConstant();
        var epsReg = regCache.getFreeFragmentConstant();
        var posReg = regCache.getFreeFragmentConstant();
        var depthSampleCol = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(depthSampleCol, 1);
        var lightDir = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(lightDir, 1);
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        code += "sub " + lightDir + ", " + sharedRegisters.globalPositionVarying + ", " + posReg + "\n" + "dp3 " + lightDir + ".w, " + lightDir + ".xyz, " + lightDir + ".xyz\n" + "mul " + lightDir + ".w, " + lightDir + ".w, " + posReg + ".w\n" + "nrm " + lightDir + ".xyz, " + lightDir + ".xyz\n" + methodVO.textureVO._iGetFragmentCode(depthSampleCol, regCache, sharedRegisters, lightDir) + "dp4 " + depthSampleCol + ".z, " + depthSampleCol + ", " + decReg + "\n" + "add " + targetReg + ".w, " + lightDir + ".w, " + epsReg + ".x\n" + "slt " + targetReg + ".w, " + targetReg + ".w, " + depthSampleCol + ".z\n"; // 0 if in shadow
        regCache.removeFragmentTempUsage(lightDir);
        regCache.removeFragmentTempUsage(depthSampleCol);
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowHardMethod.prototype._iGetCascadeFragmentCode = function (shader, methodVO, decodeRegister, depthProjection, targetRegister, registerCache, sharedRegisters) {
        var temp = registerCache.getFreeFragmentVectorTemp();
        return methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, depthProjection) + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + targetRegister + ".w, " + depthProjection + ".z, " + temp + ".z\n"; // 0 if in shadow
    };
    /**
     * @inheritDoc
     */
    ShadowHardMethod.prototype.iActivateForCascade = function (shader, methodVO, stage) {
    };
    return ShadowHardMethod;
})(ShadowMethodBase);
module.exports = ShadowHardMethod;

},{"awayjs-methodmaterials/lib/methods/ShadowMethodBase":"awayjs-methodmaterials/lib/methods/ShadowMethodBase"}],"awayjs-methodmaterials/lib/methods/ShadowMapMethodBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        this.iAddTexture(castingLight.shadowMapper.depthMap);
    }
    Object.defineProperty(ShadowMapMethodBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return ShadowMapMethodBase.assetType;
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
    ShadowMapMethodBase.assetType = "[asset ShadowMapMethod]";
    return ShadowMapMethodBase;
})(ShadingMethodBase);
module.exports = ShadowMapMethodBase;

},{"awayjs-methodmaterials/lib/methods/ShadingMethodBase":"awayjs-methodmaterials/lib/methods/ShadingMethodBase"}],"awayjs-methodmaterials/lib/methods/ShadowMethodBase":[function(require,module,exports){
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
    ShadowMethodBase.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsView = true;
        methodVO.needsGlobalVertexPos = true;
        methodVO.needsGlobalFragmentPos = this._pUsePoint;
        methodVO.needsNormals = shader.numLights > 0;
        methodVO.textureVO = shader.getAbstraction(this._pCastingLight.shadowMapper.depthMap);
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
        code += "m44 " + temp + ", " + sharedRegisters.globalPositionVertex + ", " + depthMapProj + "\n" + "div " + temp + ", " + temp + ", " + temp + ".w\n" + "mul " + temp + ".xy, " + temp + ".xy, " + dataReg + ".xy\n" + "add " + this._pDepthMapCoordReg + ", " + temp + ", " + dataReg + ".xxwz\n";
        //"sub " + this._pDepthMapCoordReg + ".z, " + this._pDepthMapCoordReg + ".z, " + this._pDepthMapCoordReg + ".w\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = this._pUsePoint ? this._pGetPointFragmentCode(shader, methodVO, targetReg, registerCache, sharedRegisters) : this._pGetPlanarFragmentCode(shader, methodVO, targetReg, registerCache, sharedRegisters);
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
    ShadowMethodBase.prototype._pGetPlanarFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
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
    ShadowMethodBase.prototype._pGetPointFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        throw new AbstractMethodError();
        return "";
    };
    /**
     * @inheritDoc
     */
    ShadowMethodBase.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        if (!this._pUsePoint)
            this._pShadowMapper.iDepthProjection.copyRawDataTo(shader.vertexConstantData, methodVO.vertexConstantsIndex + 4, true);
        methodVO.textureVO._setRenderState(renderable);
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
        methodVO.textureVO.activate(methodVO.pass._render);
    };
    /**
     * Sets the method state for cascade shadow mapping.
     */
    ShadowMethodBase.prototype.iActivateForCascade = function (shader, methodVO, stage) {
        throw new Error("This shadow method is incompatible with cascade shadows");
    };
    return ShadowMethodBase;
})(ShadowMapMethodBase);
module.exports = ShadowMethodBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-display/lib/entities/PointLight":undefined,"awayjs-methodmaterials/lib/methods/ShadowMapMethodBase":"awayjs-methodmaterials/lib/methods/ShadowMapMethodBase"}],"awayjs-methodmaterials/lib/methods/ShadowNearMethod":[function(require,module,exports){
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
    ShadowNearMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = this._baseMethod.iGetFragmentCode(shader, methodVO, targetReg, registerCache, sharedRegisters);
        var dataReg = registerCache.getFreeFragmentConstant();
        var temp = registerCache.getFreeFragmentSingleTemp();
        methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
        code += "abs " + temp + ", " + sharedRegisters.projectionFragment + ".w\n" + "sub " + temp + ", " + temp + ", " + dataReg + ".x\n" + "mul " + temp + ", " + temp + ", " + dataReg + ".y\n" + "sat " + temp + ", " + temp + "\n" + "sub " + temp + ", " + dataReg + ".w," + temp + "\n" + "sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + temp + "\n" + "sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n";
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
})(ShadowMethodBase);
module.exports = ShadowNearMethod;

},{"awayjs-methodmaterials/lib/methods/ShadowMethodBase":"awayjs-methodmaterials/lib/methods/ShadowMethodBase","awayjs-renderergl/lib/events/ShadingMethodEvent":undefined}],"awayjs-methodmaterials/lib/methods/ShadowSoftMethod":[function(require,module,exports){
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
    ShadowSoftMethod.prototype.iInitConstants = function (shader, methodVO) {
        _super.prototype.iInitConstants.call(this, shader, methodVO);
        shader.fragmentConstantData[methodVO.fragmentConstantsIndex + 8] = 1 / this._numSamples;
        shader.fragmentConstantData[methodVO.fragmentConstantsIndex + 9] = 0;
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var texRange = .5 * this._range / this._pCastingLight.shadowMapper.depthMapSize;
        var data = shader.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex + 10;
        var len = this._numSamples << 1;
        for (var i = 0; i < len; ++i)
            data[index + i] = this._offsets[i] * texRange;
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype._pGetPlanarFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        // todo: move some things to super
        var decReg = regCache.getFreeFragmentConstant();
        regCache.getFreeFragmentConstant();
        var dataReg = regCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        return this.getSampleCode(shader, methodVO, decReg, targetReg, regCache, sharedRegisters, dataReg);
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
    ShadowSoftMethod.prototype.addSample = function (shader, methodVO, decodeRegister, targetRegister, registerCache, sharedRegisters, uvReg) {
        var temp = registerCache.getFreeFragmentVectorTemp();
        return methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, uvReg) + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" + "add " + targetRegister + ".w, " + targetRegister + ".w, " + uvReg + ".w\n";
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype.iActivateForCascade = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var texRange = this._range / this._pCastingLight.shadowMapper.depthMapSize;
        var data = shader.fragmentConstantData;
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
    ShadowSoftMethod.prototype._iGetCascadeFragmentCode = function (shader, methodVO, decodeRegister, depthProjection, targetRegister, registerCache, sharedRegisters) {
        this._pDepthMapCoordReg = depthProjection;
        var dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
        return this.getSampleCode(shader, methodVO, decodeRegister, targetRegister, registerCache, sharedRegisters, dataReg);
    };
    /**
     * Get the actual shader code for shadow mapping
     * @param regCache The register cache managing the registers.
     * @param depthTexture The texture register containing the depth map.
     * @param decodeRegister The register containing the depth map decoding data.
     * @param targetReg The target register to add the shadow coverage.
     * @param dataReg The register containing additional data.
     */
    ShadowSoftMethod.prototype.getSampleCode = function (shader, methodVO, decodeRegister, targetRegister, registerCache, sharedRegisters, dataReg) {
        var code;
        var uvReg = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(uvReg, 1);
        var offsets = new Array(dataReg + ".zw");
        var numRegs = this._numSamples >> 1;
        for (var i = 0; i < numRegs; ++i) {
            var reg = registerCache.getFreeFragmentConstant();
            offsets.push(reg + ".xy");
            offsets.push(reg + ".zw");
        }
        for (i = 0; i < this._numSamples; ++i) {
            if (i == 0) {
                var temp = registerCache.getFreeFragmentVectorTemp();
                code = "add " + uvReg + ", " + this._pDepthMapCoordReg + ", " + dataReg + ".zwyy\n" + methodVO.textureVO._iGetFragmentCode(temp, registerCache, sharedRegisters, uvReg) + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + targetRegister + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow;
            }
            else {
                code += "add " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + offsets[i] + "\n" + this.addSample(shader, methodVO, decodeRegister, targetRegister, registerCache, sharedRegisters, uvReg);
            }
        }
        registerCache.removeFragmentTempUsage(uvReg);
        code += "mul " + targetRegister + ".w, " + targetRegister + ".w, " + dataReg + ".x\n"; // average
        return code;
    };
    return ShadowSoftMethod;
})(ShadowMethodBase);
module.exports = ShadowSoftMethod;

},{"awayjs-core/lib/geom/PoissonLookup":undefined,"awayjs-methodmaterials/lib/methods/ShadowMethodBase":"awayjs-methodmaterials/lib/methods/ShadowMethodBase"}],"awayjs-methodmaterials/lib/methods/SpecularAnisotropicMethod":[function(require,module,exports){
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
    SpecularAnisotropicMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsTangents = true;
        methodVO.needsView = true;
    };
    /**
     * @inheritDoc
     */
    SpecularAnisotropicMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
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
        if (this.texture) {
            // apply gloss modulation from texture
            code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" + "pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
        }
        else
            code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";
        // attenuate
        code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);
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

},{"awayjs-methodmaterials/lib/methods/SpecularBasicMethod":"awayjs-methodmaterials/lib/methods/SpecularBasicMethod"}],"awayjs-methodmaterials/lib/methods/SpecularBasicMethod":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
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
        this._strength = 1;
        this._color = 0xffffff;
        this._iSpecularR = 1;
        this._iSpecularG = 1;
        this._iSpecularB = 1;
    }
    SpecularBasicMethod.prototype.iIsUsed = function (shader) {
        if (!shader.numLights)
            return false;
        return true;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iInitVO = function (shader, methodVO) {
        methodVO.needsNormals = shader.numLights > 0;
        methodVO.needsView = shader.numLights > 0;
        if (this._texture) {
            methodVO.textureVO = shader.getAbstraction(this._texture);
            shader.uvDependencies++;
        }
        else if (methodVO.textureVO) {
            methodVO.textureVO.onClear(new AssetEvent(AssetEvent.CLEAR, null));
            methodVO.textureVO = null;
        }
    };
    Object.defineProperty(SpecularBasicMethod.prototype, "gloss", {
        /**
         * The glossiness of the material (sharpness of the specular highlight).
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
    Object.defineProperty(SpecularBasicMethod.prototype, "strength", {
        /**
         * The overall strength of the specular highlights.
         */
        get: function () {
            return this._strength;
        },
        set: function (value) {
            if (value == this._strength)
                return;
            this._strength = value;
            this.updateSpecular();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularBasicMethod.prototype, "color", {
        /**
         * The colour of the specular reflection of the surface.
         */
        get: function () {
            return this._color;
        },
        set: function (value) {
            if (this._color == value)
                return;
            // specular is now either enabled or disabled
            if (this._color == 0 || value == 0)
                this.iInvalidateShaderProgram();
            this._color = value;
            this.updateSpecular();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularBasicMethod.prototype, "texture", {
        /**
         * A texture that defines the strength of specular reflections for each texel in the red channel,
         * and the gloss factor (sharpness) in the green channel. You can use Specular2DTexture if you want to easily set
         * specular and gloss maps from grayscale images, but correctly authored images are preferred.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            if (this._texture == value)
                return;
            if (this._texture)
                this.iRemoveTexture(this._texture);
            this._texture = value;
            if (this._texture)
                this.iAddTexture(this._texture);
            this.iInvalidateShaderProgram();
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
        this.strength = spec.strength;
        this.color = spec.color;
        this.gloss = spec.gloss;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._pTotalLightColorReg = null;
        this._pSpecularTexData = null;
        this._pSpecularDataRegister = null;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        var code = "";
        this._pIsFirstLight = true;
        this._pSpecularDataRegister = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = this._pSpecularDataRegister.index * 4;
        if (this._texture) {
            this._pSpecularTexData = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(this._pSpecularTexData, 1);
            code += methodVO.textureVO._iGetFragmentCode(this._pSpecularTexData, registerCache, sharedRegisters, sharedRegisters.uvVarying);
        }
        this._pTotalLightColorReg = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(this._pTotalLightColorReg, 1);
        return code;
    };
    /**
     * @inheritDoc
     */
    SpecularBasicMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
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
        if (this._texture) {
            // apply gloss modulation from texture
            code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" + "pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
        }
        else {
            code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";
        }
        // attenuate
        if (shader.usesLightFallOff)
            code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);
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
    SpecularBasicMethod.prototype.iGetFragmentCodePerProbe = function (shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
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
        code += "dp3 " + t + ".w, " + normalReg + ", " + viewDirReg + "\n" + "add " + t + ".w, " + t + ".w, " + t + ".w\n" + "mul " + t + ", " + t + ".w, " + normalReg + "\n" + "sub " + t + ", " + t + ", " + viewDirReg + "\n" + "tex " + t + ", " + t + ", " + cubeMapReg + " <cube," + "linear" + ",miplinear>\n" + "mul " + t + ".xyz, " + t + ", " + weightRegister + "\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);
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
    SpecularBasicMethod.prototype.iGetFragmentPostLightingCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        if (sharedRegisters.shadowTarget)
            code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";
        if (this._texture) {
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
    SpecularBasicMethod.prototype.iActivate = function (shader, methodVO, stage) {
        if (this._texture)
            methodVO.textureVO.activate(methodVO.pass._render);
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = this._iSpecularR;
        data[index + 1] = this._iSpecularG;
        data[index + 2] = this._iSpecularB;
        data[index + 3] = this._gloss;
    };
    SpecularBasicMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        if (this._texture)
            methodVO.textureVO._setRenderState(renderable);
    };
    /**
     * Updates the specular color data used by the render state.
     */
    SpecularBasicMethod.prototype.updateSpecular = function () {
        this._iSpecularR = ((this._color >> 16) & 0xff) / 0xff * this._strength;
        this._iSpecularG = ((this._color >> 8) & 0xff) / 0xff * this._strength;
        this._iSpecularB = (this._color & 0xff) / 0xff * this._strength;
    };
    return SpecularBasicMethod;
})(LightingMethodBase);
module.exports = SpecularBasicMethod;

},{"awayjs-core/lib/events/AssetEvent":undefined,"awayjs-methodmaterials/lib/methods/LightingMethodBase":"awayjs-methodmaterials/lib/methods/LightingMethodBase"}],"awayjs-methodmaterials/lib/methods/SpecularCelMethod":[function(require,module,exports){
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
        this.baseMethod._iModulateMethod = function (shader, methodVO, targetReg, registerCache, sharedRegisters) { return _this.clampSpecular(shader, methodVO, targetReg, registerCache, sharedRegisters); };
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
    SpecularCelMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var index = methodVO.secondaryFragmentConstantsIndex;
        var data = shader.fragmentConstantData;
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
    SpecularCelMethod.prototype.clampSpecular = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        return "sub " + targetReg + ".y, " + targetReg + ".w, " + this._dataReg + ".y\n" + "div " + targetReg + ".y, " + targetReg + ".y, " + this._dataReg + ".x\n" + "sat " + targetReg + ".y, " + targetReg + ".y\n" + "sge " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".y\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
    };
    /**
     * @inheritDoc
     */
    SpecularCelMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shader, methodVO, registerCache, sharedRegisters);
    };
    return SpecularCelMethod;
})(SpecularCompositeMethod);
module.exports = SpecularCelMethod;

},{"awayjs-methodmaterials/lib/methods/SpecularCompositeMethod":"awayjs-methodmaterials/lib/methods/SpecularCompositeMethod"}],"awayjs-methodmaterials/lib/methods/SpecularCompositeMethod":[function(require,module,exports){
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
    SpecularCompositeMethod.prototype.iInitVO = function (shader, methodVO) {
        this._baseMethod.iInitVO(shader, methodVO);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iInitConstants = function (shader, methodVO) {
        this._baseMethod.iInitConstants(shader, methodVO);
    };
    SpecularCompositeMethod.prototype.iAddOwner = function (owner) {
        _super.prototype.iAddOwner.call(this, owner);
        this._baseMethod.iAddOwner(owner);
    };
    SpecularCompositeMethod.prototype.iRemoveOwner = function (owner) {
        _super.prototype.iRemoveOwner.call(this, owner);
        this._baseMethod.iRemoveOwner(owner);
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
    Object.defineProperty(SpecularCompositeMethod.prototype, "strength", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._baseMethod.strength;
        },
        set: function (value) {
            this._baseMethod.strength = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularCompositeMethod.prototype, "color", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._baseMethod.color;
        },
        /**
         * @inheritDoc
         */
        set: function (value) {
            this._baseMethod.color = value;
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
    SpecularCompositeMethod.prototype.iActivate = function (shader, methodVO, stage) {
        this._baseMethod.iActivate(shader, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        this._baseMethod.iSetRenderState(shader, methodVO, renderable, stage, camera);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iDeactivate = function (shader, methodVO, stage) {
        this._baseMethod.iDeactivate(shader, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iGetVertexCode = function (shader, methodVO, registerCache, sharedRegisters) {
        return this._baseMethod.iGetVertexCode(shader, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        return this._baseMethod.iGetFragmentPreLightingCode(shader, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        return this._baseMethod.iGetFragmentCodePerLight(shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     * @return
     */
    SpecularCompositeMethod.prototype.iGetFragmentCodePerProbe = function (shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
        return this._baseMethod.iGetFragmentCodePerProbe(shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    SpecularCompositeMethod.prototype.iGetFragmentPostLightingCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        return this._baseMethod.iGetFragmentPostLightingCode(shader, methodVO, targetReg, registerCache, sharedRegisters);
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

},{"awayjs-methodmaterials/lib/methods/SpecularBasicMethod":"awayjs-methodmaterials/lib/methods/SpecularBasicMethod","awayjs-renderergl/lib/events/ShadingMethodEvent":undefined}],"awayjs-methodmaterials/lib/methods/SpecularFresnelMethod":[function(require,module,exports){
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
        this.baseMethod._iModulateMethod = function (shader, methodVO, targetReg, registerCache, sharedRegisters) { return _this.modulateSpecular(shader, methodVO, targetReg, registerCache, sharedRegisters); };
        this._incidentLight = !basedOnSurface;
    }
    /**
     * @inheritDoc
     */
    SpecularFresnelMethod.prototype.iInitConstants = function (shader, methodVO) {
        var index = methodVO.secondaryFragmentConstantsIndex;
        shader.fragmentConstantData[index + 2] = 1;
        shader.fragmentConstantData[index + 3] = 0;
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
    SpecularFresnelMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        var fragmentData = shader.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        fragmentData[index] = this._normalReflectance;
        fragmentData[index + 1] = this._fresnelPower;
    };
    /**
     * @inheritDoc
     */
    SpecularFresnelMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shader, methodVO, registerCache, sharedRegisters);
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
    SpecularFresnelMethod.prototype.modulateSpecular = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code;
        code = "dp3 " + targetReg + ".y, " + sharedRegisters.viewDirFragment + ".xyz, " + (this._incidentLight ? targetReg : sharedRegisters.normalFragment) + ".xyz\n" + "sub " + targetReg + ".y, " + this._dataReg + ".z, " + targetReg + ".y\n" + "pow " + targetReg + ".x, " + targetReg + ".y, " + this._dataReg + ".y\n" + "sub " + targetReg + ".y, " + this._dataReg + ".z, " + targetReg + ".y\n" + "mul " + targetReg + ".y, " + this._dataReg + ".x, " + targetReg + ".y\n" + "add " + targetReg + ".y, " + targetReg + ".x, " + targetReg + ".y\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
        return code;
    };
    return SpecularFresnelMethod;
})(SpecularCompositeMethod);
module.exports = SpecularFresnelMethod;

},{"awayjs-methodmaterials/lib/methods/SpecularCompositeMethod":"awayjs-methodmaterials/lib/methods/SpecularCompositeMethod"}],"awayjs-methodmaterials/lib/methods/SpecularPhongMethod":[function(require,module,exports){
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
    SpecularPhongMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
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
        if (this.texture) {
            // apply gloss modulation from texture
            code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" + "pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
        }
        else
            code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";
        // attenuate
        if (shader.usesLightFallOff)
            code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);
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

},{"awayjs-methodmaterials/lib/methods/SpecularBasicMethod":"awayjs-methodmaterials/lib/methods/SpecularBasicMethod"}],"awayjs-methodmaterials/lib/render/MethodMaterialRender":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BlendMode = require("awayjs-core/lib/image/BlendMode");
var StaticLightPicker = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var RenderBase = require("awayjs-renderergl/lib/render/RenderBase");
var MethodMaterialMode = require("awayjs-methodmaterials/lib/MethodMaterialMode");
var MethodPassMode = require("awayjs-methodmaterials/lib/render/passes/MethodPassMode");
var MethodPass = require("awayjs-methodmaterials/lib/render/passes/MethodPass");
/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
var MethodMaterialRender = (function (_super) {
    __extends(MethodMaterialRender, _super);
    /**
     * Creates a new CompiledPass object.
     *
     * @param material The material to which this pass belongs.
     */
    function MethodMaterialRender(material, renderableClass, pool) {
        _super.call(this, material, renderableClass, pool);
        this._material = material;
    }
    Object.defineProperty(MethodMaterialRender.prototype, "numLights", {
        /**
         * The maximum total number of lights provided by the light picker.
         */
        get: function () {
            return this._material.lightPicker ? this._material.lightPicker.numLightProbes + this._material.lightPicker.numDirectionalLights + this._material.lightPicker.numPointLights + this._material.lightPicker.numCastingDirectionalLights + this._material.lightPicker.numCastingPointLights : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodMaterialRender.prototype, "numNonCasters", {
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
    MethodMaterialRender.prototype._pUpdateRender = function () {
        _super.prototype._pUpdateRender.call(this);
        this.initPasses();
        this.setBlendAndCompareModes();
        this._pClearPasses();
        if (this._material.mode == MethodMaterialMode.MULTI_PASS) {
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
    MethodMaterialRender.prototype.initPasses = function () {
        // let the effects pass handle everything if there are no lights, when there are effect methods applied
        // after shading, or when the material mode is single pass.
        if (this.numLights == 0 || this._material.numEffectMethods > 0 || this._material.mode == MethodMaterialMode.SINGLE_PASS)
            this.initEffectPass();
        else if (this._pass)
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
    MethodMaterialRender.prototype.setBlendAndCompareModes = function () {
        var forceSeparateMVP = Boolean(this._casterLightPass || this._pass);
        // caster light pass is always first if it exists, hence it uses normal blending
        if (this._casterLightPass) {
            this._casterLightPass.forceSeparateMVP = forceSeparateMVP;
            this._casterLightPass.shader.setBlendMode(BlendMode.NORMAL);
            this._casterLightPass.shader.depthCompareMode = this._material.depthCompareMode;
        }
        if (this._nonCasterLightPasses) {
            var firstAdditiveIndex = 0;
            // if there's no caster light pass, the first non caster light pass will be the first
            // and should use normal blending
            if (!this._casterLightPass) {
                this._nonCasterLightPasses[0].forceSeparateMVP = forceSeparateMVP;
                this._nonCasterLightPasses[0].shader.setBlendMode(BlendMode.NORMAL);
                this._nonCasterLightPasses[0].shader.depthCompareMode = this._material.depthCompareMode;
                firstAdditiveIndex = 1;
            }
            for (var i = firstAdditiveIndex; i < this._nonCasterLightPasses.length; ++i) {
                this._nonCasterLightPasses[i].forceSeparateMVP = forceSeparateMVP;
                this._nonCasterLightPasses[i].shader.setBlendMode(BlendMode.ADD);
                this._nonCasterLightPasses[i].shader.depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
            }
        }
        if (this._casterLightPass || this._nonCasterLightPasses) {
            //cannot be blended by blendmode property if multipass enabled
            this._pRequiresBlending = false;
            // there are light passes, so this should be blended in
            if (this._pass) {
                this._pass.mode = MethodPassMode.EFFECTS;
                this._pass.forceSeparateMVP = forceSeparateMVP;
                this._pass.shader.depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
                this._pass.shader.setBlendMode(BlendMode.LAYER);
            }
        }
        else if (this._pass) {
            this._pRequiresBlending = (this._material.blendMode != BlendMode.NORMAL || this._material.alphaBlending || (this._material.colorTransform && this._material.colorTransform.alphaMultiplier < 1));
            // effects pass is the only pass, so it should just blend normally
            this._pass.mode = MethodPassMode.SUPER_SHADER;
            this._pass.preserveAlpha = this._pRequiresBlending;
            this._pass.forceSeparateMVP = false;
            this._pass.colorTransform = this._material.colorTransform;
            this._pass.shader.setBlendMode((this._material.blendMode == BlendMode.NORMAL && this._pRequiresBlending) ? BlendMode.LAYER : this._material.blendMode);
            this._pass.shader.depthCompareMode = this._material.depthCompareMode;
        }
    };
    MethodMaterialRender.prototype.initCasterLightPass = function () {
        if (this._casterLightPass == null)
            this._casterLightPass = new MethodPass(MethodPassMode.LIGHTING, this, this._material, this._renderableClass, this._stage);
        this._casterLightPass.lightPicker = new StaticLightPicker([this._material.shadowMethod.castingLight]);
        this._casterLightPass.shadowMethod = this._material.shadowMethod;
        this._casterLightPass.diffuseMethod = this._material.diffuseMethod;
        this._casterLightPass.ambientMethod = this._material.ambientMethod;
        this._casterLightPass.normalMethod = this._material.normalMethod;
        this._casterLightPass.specularMethod = this._material.specularMethod;
    };
    MethodMaterialRender.prototype.removeCasterLightPass = function () {
        this._casterLightPass.dispose();
        this._pRemovePass(this._casterLightPass);
        this._casterLightPass = null;
    };
    MethodMaterialRender.prototype.initNonCasterLightPasses = function () {
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
    MethodMaterialRender.prototype.removeNonCasterLightPasses = function () {
        if (!this._nonCasterLightPasses)
            return;
        for (var i = 0; i < this._nonCasterLightPasses.length; ++i)
            this._pRemovePass(this._nonCasterLightPasses[i]);
        this._nonCasterLightPasses = null;
    };
    MethodMaterialRender.prototype.removeEffectPass = function () {
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
    MethodMaterialRender.prototype.initEffectPass = function () {
        if (this._pass == null)
            this._pass = new MethodPass(MethodPassMode.SUPER_SHADER, this, this._material, this._renderableClass, this._stage);
        if (this._material.mode == MethodMaterialMode.SINGLE_PASS) {
            this._pass.ambientMethod = this._material.ambientMethod;
            this._pass.diffuseMethod = this._material.diffuseMethod;
            this._pass.specularMethod = this._material.specularMethod;
            this._pass.normalMethod = this._material.normalMethod;
            this._pass.shadowMethod = this._material.shadowMethod;
        }
        else if (this._material.mode == MethodMaterialMode.MULTI_PASS) {
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
    MethodMaterialRender.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        //TODO
    };
    return MethodMaterialRender;
})(RenderBase);
module.exports = MethodMaterialRender;

},{"awayjs-core/lib/image/BlendMode":undefined,"awayjs-display/lib/materials/lightpickers/StaticLightPicker":undefined,"awayjs-methodmaterials/lib/MethodMaterialMode":"awayjs-methodmaterials/lib/MethodMaterialMode","awayjs-methodmaterials/lib/render/passes/MethodPass":"awayjs-methodmaterials/lib/render/passes/MethodPass","awayjs-methodmaterials/lib/render/passes/MethodPassMode":"awayjs-methodmaterials/lib/render/passes/MethodPassMode","awayjs-renderergl/lib/render/RenderBase":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined}],"awayjs-methodmaterials/lib/render/passes/MethodPassMode":[function(require,module,exports){
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

},{}],"awayjs-methodmaterials/lib/render/passes/MethodPass":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var LightSources = require("awayjs-display/lib/materials/LightSources");
var LightingShader = require("awayjs-renderergl/lib/shaders/LightingShader");
var ShadingMethodEvent = require("awayjs-renderergl/lib/events/ShadingMethodEvent");
var ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
var PassBase = require("awayjs-renderergl/lib/render/passes/PassBase");
var MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
var EffectColorTransformMethod = require("awayjs-methodmaterials/lib/methods/EffectColorTransformMethod");
var MethodPassMode = require("awayjs-methodmaterials/lib/render/passes/MethodPassMode");
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
    function MethodPass(mode, render, renderOwner, renderableClass, stage) {
        var _this = this;
        _super.call(this, render, renderOwner, renderableClass, stage);
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
        this._material = renderOwner;
        this._onLightsChangeDelegate = function (event) { return _this.onLightsChange(event); };
        this._onMethodInvalidatedDelegate = function (event) { return _this.onMethodInvalidated(event); };
        this.lightPicker = renderOwner.lightPicker;
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
                this._lightPicker.removeEventListener(AssetEvent.INVALIDATE, this._onLightsChangeDelegate);
            this._lightPicker = value;
            if (this._lightPicker)
                this._lightPicker.addEventListener(AssetEvent.INVALIDATE, this._onLightsChangeDelegate);
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
        if ((this.numDirectionalLights || this.numPointLights || this.numLightProbes) && !(this._shader instanceof LightingShader)) {
            if (this._shader != null)
                this._shader.dispose();
            this._shader = new LightingShader(this._renderableClass, this, this._stage);
        }
        else if (!(this._shader instanceof ShaderBase)) {
            if (this._shader != null)
                this._shader.dispose();
            this._shader = new ShaderBase(this._renderableClass, this, this._stage);
        }
    };
    /**
     * Initializes the unchanging constant data for this material.
     */
    MethodPass.prototype._iInitConstantData = function (shader) {
        _super.prototype._iInitConstantData.call(this, shader);
        //Updates method constants if they have changed.
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i)
            this._iMethodVOs[i].method.iInitConstants(shader, this._iMethodVOs[i]);
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
                this._iColorTransformMethodVO = new MethodVO(value, this);
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
        this.invalidate();
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
        this.invalidate();
    };
    /**
     * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
     * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
     * methods added prior.
     */
    MethodPass.prototype.addEffectMethod = function (method) {
        this._addDependency(new MethodVO(method, this), true);
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
        this._addDependency(new MethodVO(method, this), true, index);
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
                this._iNormalMethodVO = new MethodVO(value, this);
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
                this._iAmbientMethodVO = new MethodVO(value, this);
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
                this._iShadowMethodVO = new MethodVO(value, this);
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
                this._iDiffuseMethodVO = new MethodVO(value, this);
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
                this._iSpecularMethodVO = new MethodVO(value, this);
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
        if (this._lightPicker)
            this._lightPicker.removeEventListener(AssetEvent.INVALIDATE, this._onLightsChangeDelegate);
        while (this._iMethodVOs.length)
            this._removeDependency(this._iMethodVOs[0]);
        _super.prototype.dispose.call(this);
        this._iMethodVOs = null;
    };
    /**
     * Called when any method's shader code is invalidated.
     */
    MethodPass.prototype.onMethodInvalidated = function (event) {
        this.invalidate();
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
    MethodPass.prototype._iIncludeDependencies = function (shader) {
        _super.prototype._iIncludeDependencies.call(this, shader);
        //TODO: fragment animtion should be compatible with lighting pass
        shader.usesFragmentAnimation = Boolean(this._mode == MethodPassMode.SUPER_SHADER);
        if (shader.useAlphaPremultiplied && shader.usesBlending)
            shader.usesCommonData = true;
        var i;
        var len = this._iMethodVOs.length;
        for (i = 0; i < len; ++i)
            this.setupAndCountDependencies(shader, this._iMethodVOs[i]);
        var usesTangentSpace = true;
        var methodVO;
        for (i = 0; i < len; ++i) {
            methodVO = this._iMethodVOs[i];
            if ((methodVO.useMethod = methodVO.method.iIsUsed(shader)) && !methodVO.method.iUsesTangentSpace())
                usesTangentSpace = false;
        }
        shader.outputsNormals = this._iNormalMethodVO && this._iNormalMethodVO.useMethod;
        shader.outputsTangentNormals = shader.outputsNormals && this._iNormalMethodVO.method.iOutputsTangentNormals();
        shader.usesTangentSpace = shader.outputsTangentNormals && !shader.usesProbes && usesTangentSpace;
        if (!shader.usesTangentSpace) {
            if (shader.viewDirDependencies > 0) {
                shader.globalPosDependencies++;
            }
            else if (this.numPointLights > 0 && shader.usesLights) {
                shader.globalPosDependencies++;
                if (Boolean(this._mode & MethodPassMode.EFFECTS))
                    shader.usesGlobalPosFragment = true;
            }
        }
    };
    /**
     * Counts the dependencies for a given method.
     * @param method The method to count the dependencies for.
     * @param methodVO The method's data for this material.
     */
    MethodPass.prototype.setupAndCountDependencies = function (shader, methodVO) {
        methodVO.reset();
        methodVO.method.iInitVO(shader, methodVO);
        if (methodVO.needsProjection)
            shader.projectionDependencies++;
        if (methodVO.needsGlobalVertexPos || methodVO.needsGlobalFragmentPos) {
            shader.globalPosDependencies++;
            if (methodVO.needsGlobalFragmentPos)
                shader.usesGlobalPosFragment = true;
        }
        if (methodVO.needsNormals)
            shader.normalDependencies++;
        if (methodVO.needsTangents)
            shader.tangentDependencies++;
        if (methodVO.needsView)
            shader.viewDirDependencies++;
    };
    MethodPass.prototype._iGetPreLightingVertexCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        if (this._iAmbientMethodVO && this._iAmbientMethodVO.useMethod)
            code += this._iAmbientMethodVO.method.iGetVertexCode(shader, this._iAmbientMethodVO, registerCache, sharedRegisters);
        if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod)
            code += this._iDiffuseMethodVO.method.iGetVertexCode(shader, this._iDiffuseMethodVO, registerCache, sharedRegisters);
        if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod)
            code += this._iSpecularMethodVO.method.iGetVertexCode(shader, this._iSpecularMethodVO, registerCache, sharedRegisters);
        return code;
    };
    MethodPass.prototype._iGetPreLightingFragmentCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        if (this._iAmbientMethodVO && this._iAmbientMethodVO.useMethod) {
            code += this._iAmbientMethodVO.method.iGetFragmentCode(shader, this._iAmbientMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);
            if (this._iAmbientMethodVO.needsNormals)
                registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);
            if (this._iAmbientMethodVO.needsView)
                registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
        }
        if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod)
            code += this._iDiffuseMethodVO.method.iGetFragmentPreLightingCode(shader, this._iDiffuseMethodVO, registerCache, sharedRegisters);
        if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod)
            code += this._iSpecularMethodVO.method.iGetFragmentPreLightingCode(shader, this._iSpecularMethodVO, registerCache, sharedRegisters);
        return code;
    };
    MethodPass.prototype._iGetPerLightDiffuseFragmentCode = function (shader, lightDirReg, diffuseColorReg, registerCache, sharedRegisters) {
        return this._iDiffuseMethodVO.method.iGetFragmentCodePerLight(shader, this._iDiffuseMethodVO, lightDirReg, diffuseColorReg, registerCache, sharedRegisters);
    };
    MethodPass.prototype._iGetPerLightSpecularFragmentCode = function (shader, lightDirReg, specularColorReg, registerCache, sharedRegisters) {
        return this._iSpecularMethodVO.method.iGetFragmentCodePerLight(shader, this._iSpecularMethodVO, lightDirReg, specularColorReg, registerCache, sharedRegisters);
    };
    MethodPass.prototype._iGetPerProbeDiffuseFragmentCode = function (shader, texReg, weightReg, registerCache, sharedRegisters) {
        return this._iDiffuseMethodVO.method.iGetFragmentCodePerProbe(shader, this._iDiffuseMethodVO, texReg, weightReg, registerCache, sharedRegisters);
    };
    MethodPass.prototype._iGetPerProbeSpecularFragmentCode = function (shader, texReg, weightReg, registerCache, sharedRegisters) {
        return this._iSpecularMethodVO.method.iGetFragmentCodePerProbe(shader, this._iSpecularMethodVO, texReg, weightReg, registerCache, sharedRegisters);
    };
    MethodPass.prototype._iGetPostLightingVertexCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        if (this._iShadowMethodVO)
            code += this._iShadowMethodVO.method.iGetVertexCode(shader, this._iShadowMethodVO, registerCache, sharedRegisters);
        return code;
    };
    MethodPass.prototype._iGetPostLightingFragmentCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        if (shader.useAlphaPremultiplied && shader.usesBlending) {
            code += "add " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" + "div " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + ", " + sharedRegisters.shadedTarget + ".w\n" + "sub " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" + "sat " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + "\n";
        }
        if (this._iShadowMethodVO)
            code += this._iShadowMethodVO.method.iGetFragmentCode(shader, this._iShadowMethodVO, sharedRegisters.shadowTarget, registerCache, sharedRegisters);
        if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod) {
            code += this._iDiffuseMethodVO.method.iGetFragmentPostLightingCode(shader, this._iDiffuseMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);
            // resolve other dependencies as well?
            if (this._iDiffuseMethodVO.needsNormals)
                registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);
            if (this._iDiffuseMethodVO.needsView)
                registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
        }
        if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod) {
            code += this._iSpecularMethodVO.method.iGetFragmentPostLightingCode(shader, this._iSpecularMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);
            if (this._iSpecularMethodVO.needsNormals)
                registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);
            if (this._iSpecularMethodVO.needsView)
                registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
        }
        if (this._iShadowMethodVO)
            registerCache.removeFragmentTempUsage(sharedRegisters.shadowTarget);
        return code;
    };
    MethodPass.prototype._iGetNormalVertexCode = function (shader, registerCache, sharedRegisters) {
        return this._iNormalMethodVO.method.iGetVertexCode(shader, this._iNormalMethodVO, registerCache, sharedRegisters);
    };
    MethodPass.prototype._iGetNormalFragmentCode = function (shader, registerCache, sharedRegisters) {
        var code = this._iNormalMethodVO.method.iGetFragmentCode(shader, this._iNormalMethodVO, sharedRegisters.normalFragment, registerCache, sharedRegisters);
        if (this._iNormalMethodVO.needsView)
            registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
        if (this._iNormalMethodVO.needsGlobalFragmentPos || this._iNormalMethodVO.needsGlobalVertexPos)
            registerCache.removeVertexTempUsage(sharedRegisters.globalPositionVertex);
        return code;
    };
    /**
     * @inheritDoc
     */
    MethodPass.prototype._iGetVertexCode = function (shader, regCache, sharedReg) {
        var code = "";
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = len - this._numEffectDependencies; i < len; i++) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod) {
                code += methodVO.method.iGetVertexCode(shader, methodVO, regCache, sharedReg);
                if (methodVO.needsGlobalVertexPos || methodVO.needsGlobalFragmentPos)
                    regCache.removeVertexTempUsage(sharedReg.globalPositionVertex);
            }
        }
        if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.useMethod)
            code += this._iColorTransformMethodVO.method.iGetVertexCode(shader, this._iColorTransformMethodVO, regCache, sharedReg);
        return code;
    };
    /**
     * @inheritDoc
     */
    MethodPass.prototype._iGetFragmentCode = function (shader, regCache, sharedReg) {
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
                code += methodVO.method.iGetFragmentCode(shader, methodVO, sharedReg.shadedTarget, regCache, sharedReg);
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
            code += this._iColorTransformMethodVO.method.iGetFragmentCode(shader, this._iColorTransformMethodVO, sharedReg.shadedTarget, regCache, sharedReg);
        return code;
    };
    /**
     * Indicates whether the shader uses any shadows.
     */
    MethodPass.prototype._iUsesShadows = function (shader) {
        return Boolean(this._iShadowMethodVO && (this._lightPicker.castingDirectionalLights.length > 0 || this._lightPicker.castingPointLights.length > 0));
    };
    /**
     * Indicates whether the shader uses any specular component.
     */
    MethodPass.prototype._iUsesSpecular = function (shader) {
        return Boolean(this._iSpecularMethodVO);
    };
    /**
     * Indicates whether the shader uses any specular component.
     */
    MethodPass.prototype._iUsesDiffuse = function (shader) {
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
            this.invalidate();
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
})(PassBase);
module.exports = MethodPass;

},{"awayjs-core/lib/events/AssetEvent":undefined,"awayjs-display/lib/materials/LightSources":undefined,"awayjs-methodmaterials/lib/data/MethodVO":"awayjs-methodmaterials/lib/data/MethodVO","awayjs-methodmaterials/lib/methods/EffectColorTransformMethod":"awayjs-methodmaterials/lib/methods/EffectColorTransformMethod","awayjs-methodmaterials/lib/render/passes/MethodPassMode":"awayjs-methodmaterials/lib/render/passes/MethodPassMode","awayjs-renderergl/lib/events/ShadingMethodEvent":undefined,"awayjs-renderergl/lib/render/passes/PassBase":undefined,"awayjs-renderergl/lib/shaders/LightingShader":undefined,"awayjs-renderergl/lib/shaders/ShaderBase":undefined}],"awayjs-methodmaterials/lib/render/passes/SingleObjectDepthPass":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Image2D = require("awayjs-core/lib/image/Image2D");
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Single2DTexture = require("awayjs-display/lib/textures/Single2DTexture");
var ContextGLDrawMode = require("awayjs-stagegl/lib/base/ContextGLDrawMode");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var PassBase = require("awayjs-renderergl/lib/render/passes/PassBase");
/**
 * The SingleObjectDepthPass provides a material pass that renders a single object to a depth map from the point
 * of view from a light.
 */
var SingleObjectDepthPass = (function (_super) {
    __extends(SingleObjectDepthPass, _super);
    /**
     * Creates a new SingleObjectDepthPass object.
     */
    function SingleObjectDepthPass(render, renderOwner, renderableClass, stage) {
        _super.call(this, render, renderOwner, renderableClass, stage);
        this._textureSize = 512;
        this._polyOffset = new Float32Array([15, 0, 0, 0]);
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
    SingleObjectDepthPass.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
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
        var lights = this._renderOwner.lightPicker.allPickedLights;
        var rId = renderable.renderableOwner.id;
        if (!this._textures[rId])
            this._textures[rId] = new Single2DTexture(new Image2D(this._textureSize, this._textureSize));
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
        var subGeometryVO = renderable.subGeometryVO;
        var subGeom = subGeometryVO.subGeometry;
        subGeometryVO.activateVertexBufferVO(0, subGeom.positions);
        subGeometryVO.activateVertexBufferVO(1, subGeom.normals);
        subGeometryVO.getIndexBufferVO().draw(ContextGLDrawMode.TRIANGLES, 0, subGeometryVO.subGeometry.numElements);
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
})(PassBase);
module.exports = SingleObjectDepthPass;

},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/image/Image2D":undefined,"awayjs-display/lib/textures/Single2DTexture":undefined,"awayjs-renderergl/lib/render/passes/PassBase":undefined,"awayjs-stagegl/lib/base/ContextGLDrawMode":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined}]},{},["./methodmaterials.ts"])


//# sourceMappingURL=awayjs-methodmaterials.js.map