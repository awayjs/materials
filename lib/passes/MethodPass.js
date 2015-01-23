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
            if (this._lightPicker == value)
                return;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL3Bhc3Nlcy9NZXRob2RQYXNzLnRzIl0sIm5hbWVzIjpbIk1ldGhvZFBhc3MiLCJNZXRob2RQYXNzLmNvbnN0cnVjdG9yIiwiTWV0aG9kUGFzcy5tb2RlIiwiTWV0aG9kUGFzcy5pbmNsdWRlQ2FzdGVycyIsIk1ldGhvZFBhc3MubGlnaHRQaWNrZXIiLCJNZXRob2RQYXNzLmVuYWJsZUxpZ2h0RmFsbE9mZiIsIk1ldGhvZFBhc3MuZGlmZnVzZUxpZ2h0U291cmNlcyIsIk1ldGhvZFBhc3Muc3BlY3VsYXJMaWdodFNvdXJjZXMiLCJNZXRob2RQYXNzLl91cGRhdGVTaGFkZXIiLCJNZXRob2RQYXNzLl9pSW5pdENvbnN0YW50RGF0YSIsIk1ldGhvZFBhc3MuY29sb3JUcmFuc2Zvcm0iLCJNZXRob2RQYXNzLmNvbG9yVHJhbnNmb3JtTWV0aG9kIiwiTWV0aG9kUGFzcy5fcmVtb3ZlRGVwZW5kZW5jeSIsIk1ldGhvZFBhc3MuX2FkZERlcGVuZGVuY3kiLCJNZXRob2RQYXNzLmFkZEVmZmVjdE1ldGhvZCIsIk1ldGhvZFBhc3MubnVtRWZmZWN0TWV0aG9kcyIsIk1ldGhvZFBhc3MuaGFzRWZmZWN0TWV0aG9kIiwiTWV0aG9kUGFzcy5nZXRFZmZlY3RNZXRob2RBdCIsIk1ldGhvZFBhc3MuYWRkRWZmZWN0TWV0aG9kQXQiLCJNZXRob2RQYXNzLnJlbW92ZUVmZmVjdE1ldGhvZCIsIk1ldGhvZFBhc3MucmVtb3ZlRWZmZWN0TWV0aG9kQXQiLCJNZXRob2RQYXNzLmdldERlcGVuZGVuY3lGb3JNZXRob2QiLCJNZXRob2RQYXNzLm5vcm1hbE1ldGhvZCIsIk1ldGhvZFBhc3MuYW1iaWVudE1ldGhvZCIsIk1ldGhvZFBhc3Muc2hhZG93TWV0aG9kIiwiTWV0aG9kUGFzcy5kaWZmdXNlTWV0aG9kIiwiTWV0aG9kUGFzcy5zcGVjdWxhck1ldGhvZCIsIk1ldGhvZFBhc3MuZGlzcG9zZSIsIk1ldGhvZFBhc3Mub25NZXRob2RJbnZhbGlkYXRlZCIsIk1ldGhvZFBhc3MuX2lBY3RpdmF0ZSIsIk1ldGhvZFBhc3MuX2lSZW5kZXIiLCJNZXRob2RQYXNzLl9pRGVhY3RpdmF0ZSIsIk1ldGhvZFBhc3MuX2lJbmNsdWRlRGVwZW5kZW5jaWVzIiwiTWV0aG9kUGFzcy5zZXR1cEFuZENvdW50RGVwZW5kZW5jaWVzIiwiTWV0aG9kUGFzcy5faUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRQcmVMaWdodGluZ0ZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRQZXJMaWdodERpZmZ1c2VGcmFnbWVudENvZGUiLCJNZXRob2RQYXNzLl9pR2V0UGVyTGlnaHRTcGVjdWxhckZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRQZXJQcm9iZURpZmZ1c2VGcmFnbWVudENvZGUiLCJNZXRob2RQYXNzLl9pR2V0UGVyUHJvYmVTcGVjdWxhckZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRQb3N0TGlnaHRpbmdWZXJ0ZXhDb2RlIiwiTWV0aG9kUGFzcy5faUdldFBvc3RMaWdodGluZ0ZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX3BVc2VzVGFuZ2VudFNwYWNlIiwiTWV0aG9kUGFzcy5fcE91dHB1dHNUYW5nZW50Tm9ybWFscyIsIk1ldGhvZFBhc3MuX3BPdXRwdXRzTm9ybWFscyIsIk1ldGhvZFBhc3MuX2lHZXROb3JtYWxWZXJ0ZXhDb2RlIiwiTWV0aG9kUGFzcy5faUdldE5vcm1hbEZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRWZXJ0ZXhDb2RlIiwiTWV0aG9kUGFzcy5faUdldEZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lVc2VzU2hhZG93cyIsIk1ldGhvZFBhc3MuX2lVc2VzU3BlY3VsYXIiLCJNZXRob2RQYXNzLm9uTGlnaHRzQ2hhbmdlIiwiTWV0aG9kUGFzcy5fdXBkYXRlTGlnaHRzIiwiTWV0aG9kUGFzcy5jYWxjdWxhdGVOdW1EaXJlY3Rpb25hbExpZ2h0cyIsIk1ldGhvZFBhc3MuY2FsY3VsYXRlTnVtUG9pbnRMaWdodHMiLCJNZXRob2RQYXNzLmNhbGN1bGF0ZU51bVByb2JlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBTUEsSUFBTyxLQUFLLFdBQWlCLDhCQUE4QixDQUFDLENBQUM7QUFRN0QsSUFBTyxZQUFZLFdBQWdCLDJDQUEyQyxDQUFDLENBQUM7QUFLaEYsSUFBTyxvQkFBb0IsV0FBYyx3REFBd0QsQ0FBQyxDQUFDO0FBQ25HLElBQU8sa0JBQWtCLFdBQWMsaURBQWlELENBQUMsQ0FBQztBQUMxRixJQUFPLGdCQUFnQixXQUFlLG9EQUFvRCxDQUFDLENBQUM7QUFLNUYsSUFBTyxjQUFjLFdBQWUsNkNBQTZDLENBQUMsQ0FBQztBQUluRixJQUFPLFFBQVEsV0FBaUIsMENBQTBDLENBQUMsQ0FBQztBQUk1RSxJQUFPLDBCQUEwQixXQUFZLCtEQUErRCxDQUFDLENBQUM7QUFNOUcsSUFBTyxjQUFjLFdBQWUsa0RBQWtELENBQUMsQ0FBQztBQUV4RixBQUlBOzs7R0FERztJQUNHLFVBQVU7SUFBU0EsVUFBbkJBLFVBQVVBLFVBQXVCQTtJQStIdENBOzs7O09BSUdBO0lBQ0hBLFNBcElLQSxVQUFVQSxDQW9JSEEsSUFBV0EsRUFBRUEsWUFBdUNBLEVBQUVBLGlCQUE4QkEsRUFBRUEsZUFBZ0NBLEVBQUVBLEtBQVdBO1FBcEloSkMsaUJBNjVCQ0E7UUF2eEJDQSxrQkFBTUEsWUFBWUEsRUFBRUEsaUJBQWlCQSxFQUFFQSxlQUFlQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtRQXBJeERBLGVBQVVBLEdBQVVBLENBQUNBLENBQUNBO1FBRXRCQSxVQUFLQSxHQUFVQSxJQUFJQSxDQUFDQTtRQUlwQkEsb0JBQWVBLEdBQVdBLElBQUlBLENBQUNBO1FBUWhDQSxnQkFBV0EsR0FBbUJBLElBQUlBLEtBQUtBLEVBQVlBLENBQUNBO1FBRXBEQSwyQkFBc0JBLEdBQVVBLENBQUNBLENBQUNBO1FBS2xDQSx5QkFBb0JBLEdBQVVBLENBQUNBLENBQUNBO1FBRWhDQSxtQkFBY0EsR0FB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TUEsQ0FBQ0E7UUFDcEVBLENBQUNBO1FBRURBLElBQUlBLFFBQWlCQSxDQUFDQTtRQUN0QkEsSUFBSUEsR0FBR0EsR0FBVUEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDekNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQVVBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLHNCQUFzQkEsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDckVBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQy9CQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeEJBLElBQUlBLElBQUlBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLGdCQUFnQkEsQ0FBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsU0FBU0EsQ0FBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTlHQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxZQUFZQSxDQUFDQTtvQkFDekJBLFFBQVFBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTVEQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxDQUFDQTtvQkFDdEJBLFFBQVFBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7WUFFOURBLENBQUNBO1FBQ0ZBLENBQUNBO1FBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLElBQUlBLElBQUlBLENBQUNBLHNCQUFzQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDM0RBLElBQUlBLElBQUlBLE1BQU1BLEdBQUdBLFNBQVNBLENBQUNBLFlBQVlB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QUNBLElBQUlBLENBQUNBLENBQUNBO1lBQzFEQSxFQUFFQSxXQUFXQSxDQUFDQTtRQUVmQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEdBQUdBLFlBQVlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ3pEQSxFQUFFQSxXQUFXQSxDQUFDQTtRQUVmQSxBQUNBQSx1QkFEdUJBO1FBQ3ZCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxjQUFjQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBLENBQUNBLEdBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO0lBQy9FQSxDQUFDQTtJQUNGdkQsaUJBQUNBO0FBQURBLENBNzVCQSxBQTY1QkNBLEVBNzVCd0IsY0FBYyxFQTY1QnRDO0FBRUQsQUFBb0IsaUJBQVgsVUFBVSxDQUFDIiwiZmlsZSI6InBhc3Nlcy9NZXRob2RQYXNzLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2xvclRyYW5zZm9ybVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9Db2xvclRyYW5zZm9ybVwiKTtcbmltcG9ydCBNYXRyaXhcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL01hdHJpeFwiKTtcbmltcG9ydCBNYXRyaXgzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RcIik7XG5pbXBvcnQgTWF0cml4M0RVdGlsc1x0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFV0aWxzXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBBYnN0cmFjdE1ldGhvZEVycm9yXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXJyb3JzL0Fic3RyYWN0TWV0aG9kRXJyb3JcIik7XG5pbXBvcnQgRXZlbnRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvRXZlbnRcIik7XG5pbXBvcnQgTWF0ZXJpYWxCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9NYXRlcmlhbEJhc2VcIik7XG5pbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IFRyaWFuZ2xlU3ViR2VvbWV0cnlcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1RyaWFuZ2xlU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xuaW1wb3J0IElSZW5kZXJPYmplY3RPd25lclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvSVJlbmRlck9iamVjdE93bmVyXCIpO1xuaW1wb3J0IExpZ2h0UGlja2VyQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL2xpZ2h0cGlja2Vycy9MaWdodFBpY2tlckJhc2VcIik7XG5pbXBvcnQgTGlnaHRTb3VyY2VzXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9MaWdodFNvdXJjZXNcIik7XG5cbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5cbmltcG9ydCBSZW5kZXJlckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYmFzZS9SZW5kZXJlckJhc2VcIik7XG5pbXBvcnQgU2hhZGVyTGlnaHRpbmdPYmplY3RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJMaWdodGluZ09iamVjdFwiKTtcbmltcG9ydCBTaGFkaW5nTWV0aG9kRXZlbnRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9ldmVudHMvU2hhZGluZ01ldGhvZEV2ZW50XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XG5pbXBvcnQgUmVuZGVyUGFzc0Jhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bhc3Nlcy9SZW5kZXJQYXNzQmFzZVwiKTtcbmltcG9ydCBJUmVuZGVyTGlnaHRpbmdQYXNzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFzc2VzL0lSZW5kZXJMaWdodGluZ1Bhc3NcIik7XG5pbXBvcnQgSVJlbmRlcmFibGVDbGFzc1x0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9JUmVuZGVyYWJsZUNsYXNzXCIpO1xuXG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL2RhdGEvTWV0aG9kVk9cIik7XG5pbXBvcnQgUmVuZGVyTWV0aG9kTWF0ZXJpYWxPYmplY3RcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvY29tcGlsYXRpb24vUmVuZGVyTWV0aG9kTWF0ZXJpYWxPYmplY3RcIik7XG5pbXBvcnQgQW1iaWVudEJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0FtYmllbnRCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBEaWZmdXNlQmFzaWNNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRGlmZnVzZUJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kXHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2RcIik7XG5pbXBvcnQgRWZmZWN0TWV0aG9kQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0VmZmVjdE1ldGhvZEJhc2VcIik7XG5pbXBvcnQgTGlnaHRpbmdNZXRob2RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0xpZ2h0aW5nTWV0aG9kQmFzZVwiKTtcbmltcG9ydCBOb3JtYWxCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9Ob3JtYWxCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBTaGFkb3dNYXBNZXRob2RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL1NoYWRvd01hcE1ldGhvZEJhc2VcIik7XG5pbXBvcnQgU3BlY3VsYXJCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9TcGVjdWxhckJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IE1ldGhvZFBhc3NNb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL3Bhc3Nlcy9NZXRob2RQYXNzTW9kZVwiKTtcblxuLyoqXG4gKiBDb21waWxlZFBhc3MgZm9ybXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgdGhlIGRlZmF1bHQgY29tcGlsZWQgcGFzcyBtYXRlcmlhbHMgcHJvdmlkZWQgYnkgQXdheTNELFxuICogdXNpbmcgbWF0ZXJpYWwgbWV0aG9kcyB0byBkZWZpbmUgdGhlaXIgYXBwZWFyYW5jZS5cbiAqL1xuY2xhc3MgTWV0aG9kUGFzcyBleHRlbmRzIFJlbmRlclBhc3NCYXNlIGltcGxlbWVudHMgSVJlbmRlckxpZ2h0aW5nUGFzc1xue1xuXHRwcml2YXRlIF9tYXhMaWdodHM6bnVtYmVyID0gMztcblxuXHRwcml2YXRlIF9tb2RlOm51bWJlciA9IDB4MDM7XG5cdHByaXZhdGUgX21hdGVyaWFsOk1hdGVyaWFsQmFzZTtcblx0cHJpdmF0ZSBfbGlnaHRQaWNrZXI6TGlnaHRQaWNrZXJCYXNlO1xuXG5cdHByaXZhdGUgX2luY2x1ZGVDYXN0ZXJzOmJvb2xlYW4gPSB0cnVlO1xuXG5cdHB1YmxpYyBfaUNvbG9yVHJhbnNmb3JtTWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaU5vcm1hbE1ldGhvZFZPOk1ldGhvZFZPO1xuXHRwdWJsaWMgX2lBbWJpZW50TWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaVNoYWRvd01ldGhvZFZPOk1ldGhvZFZPO1xuXHRwdWJsaWMgX2lEaWZmdXNlTWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaVNwZWN1bGFyTWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaU1ldGhvZFZPczpBcnJheTxNZXRob2RWTz4gPSBuZXcgQXJyYXk8TWV0aG9kVk8+KCk7XG5cblx0cHVibGljIF9udW1FZmZlY3REZXBlbmRlbmNpZXM6bnVtYmVyID0gMDtcblxuXHRwcml2YXRlIF9vbkxpZ2h0c0NoYW5nZURlbGVnYXRlOihldmVudDpFdmVudCkgPT4gdm9pZDtcblx0cHJpdmF0ZSBfb25NZXRob2RJbnZhbGlkYXRlZERlbGVnYXRlOihldmVudDpTaGFkaW5nTWV0aG9kRXZlbnQpID0+IHZvaWQ7XG5cblx0cHVibGljIG51bURpcmVjdGlvbmFsTGlnaHRzOm51bWJlciA9IDA7XG5cblx0cHVibGljIG51bVBvaW50TGlnaHRzOm51bWJlciA9IDA7XG5cblx0cHVibGljIG51bUxpZ2h0UHJvYmVzOm51bWJlciA9IDA7XG5cblx0cHVibGljIHBvaW50TGlnaHRzT2Zmc2V0Om51bWJlciA9IDA7XG5cdFxuXHRwdWJsaWMgZGlyZWN0aW9uYWxMaWdodHNPZmZzZXQ6bnVtYmVyPSAwO1xuXHRcblx0cHVibGljIGxpZ2h0UHJvYmVzT2Zmc2V0Om51bWJlciA9IDA7XG5cdFxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBnZXQgbW9kZSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX21vZGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IG1vZGUodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX21vZGUgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cdFx0XG5cdFx0dGhpcy5fbW9kZSA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fdXBkYXRlTGlnaHRzKCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHNoYWRvdyBjYXN0aW5nIGxpZ2h0cyBuZWVkIHRvIGJlIGluY2x1ZGVkLlxuXHQgKi9cblx0cHVibGljIGdldCBpbmNsdWRlQ2FzdGVycygpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9pbmNsdWRlQ2FzdGVycztcblx0fVxuXG5cdHB1YmxpYyBzZXQgaW5jbHVkZUNhc3RlcnModmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdGlmICh0aGlzLl9pbmNsdWRlQ2FzdGVycyA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2luY2x1ZGVDYXN0ZXJzID0gdmFsdWU7XG5cblx0XHR0aGlzLl91cGRhdGVMaWdodHMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICogQHJldHVybnMge0xpZ2h0UGlja2VyQmFzZX1cblx0ICovXG5cdHB1YmxpYyBnZXQgbGlnaHRQaWNrZXIoKTpMaWdodFBpY2tlckJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9saWdodFBpY2tlcjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgbGlnaHRQaWNrZXIodmFsdWU6TGlnaHRQaWNrZXJCYXNlKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2xpZ2h0UGlja2VyID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHRoaXMuX2xpZ2h0UGlja2VyKVxuXHRcdFx0dGhpcy5fbGlnaHRQaWNrZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5DSEFOR0UsIHRoaXMuX29uTGlnaHRzQ2hhbmdlRGVsZWdhdGUpO1xuXG5cdFx0dGhpcy5fbGlnaHRQaWNrZXIgPSB2YWx1ZTtcblxuXHRcdGlmICh0aGlzLl9saWdodFBpY2tlcilcblx0XHRcdHRoaXMuX2xpZ2h0UGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuQ0hBTkdFLCB0aGlzLl9vbkxpZ2h0c0NoYW5nZURlbGVnYXRlKTtcblxuXHRcdHRoaXMuX3VwZGF0ZUxpZ2h0cygpO1xuXHR9XG5cdFxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gdXNlIGZhbGxPZmYgYW5kIHJhZGl1cyBwcm9wZXJ0aWVzIGZvciBsaWdodHMuIFRoaXMgY2FuIGJlIHVzZWQgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZSBhbmRcblx0ICogY29tcGF0aWJpbGl0eSBmb3IgY29uc3RyYWluZWQgbW9kZS5cblx0ICovXG5cdHB1YmxpYyBnZXQgZW5hYmxlTGlnaHRGYWxsT2ZmKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX21hdGVyaWFsLmVuYWJsZUxpZ2h0RmFsbE9mZjtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWZpbmUgd2hpY2ggbGlnaHQgc291cmNlIHR5cGVzIHRvIHVzZSBmb3IgZGlmZnVzZSByZWZsZWN0aW9ucy4gVGhpcyBhbGxvd3MgY2hvb3NpbmcgYmV0d2VlbiByZWd1bGFyIGxpZ2h0c1xuXHQgKiBhbmQvb3IgbGlnaHQgcHJvYmVzIGZvciBkaWZmdXNlIHJlZmxlY3Rpb25zLlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkzZC5tYXRlcmlhbHMuTGlnaHRTb3VyY2VzXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGRpZmZ1c2VMaWdodFNvdXJjZXMoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9tYXRlcmlhbC5kaWZmdXNlTGlnaHRTb3VyY2VzO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlZmluZSB3aGljaCBsaWdodCBzb3VyY2UgdHlwZXMgdG8gdXNlIGZvciBzcGVjdWxhciByZWZsZWN0aW9ucy4gVGhpcyBhbGxvd3MgY2hvb3NpbmcgYmV0d2VlbiByZWd1bGFyIGxpZ2h0c1xuXHQgKiBhbmQvb3IgbGlnaHQgcHJvYmVzIGZvciBzcGVjdWxhciByZWZsZWN0aW9ucy5cblx0ICpcblx0ICogQHNlZSBhd2F5M2QubWF0ZXJpYWxzLkxpZ2h0U291cmNlc1xuXHQgKi9cblx0cHVibGljIGdldCBzcGVjdWxhckxpZ2h0U291cmNlcygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX21hdGVyaWFsLnNwZWN1bGFyTGlnaHRTb3VyY2VzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgQ29tcGlsZWRQYXNzIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIG1hdGVyaWFsIFRoZSBtYXRlcmlhbCB0byB3aGljaCB0aGlzIHBhc3MgYmVsb25ncy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKG1vZGU6bnVtYmVyLCByZW5kZXJPYmplY3Q6UmVuZGVyTWV0aG9kTWF0ZXJpYWxPYmplY3QsIHJlbmRlck9iamVjdE93bmVyOk1hdGVyaWFsQmFzZSwgcmVuZGVyYWJsZUNsYXNzOklSZW5kZXJhYmxlQ2xhc3MsIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0c3VwZXIocmVuZGVyT2JqZWN0LCByZW5kZXJPYmplY3RPd25lciwgcmVuZGVyYWJsZUNsYXNzLCBzdGFnZSk7XG5cblx0XHR0aGlzLl9tb2RlID0gbW9kZTtcblxuXHRcdHRoaXMuX21hdGVyaWFsID0gcmVuZGVyT2JqZWN0T3duZXI7XG5cblx0XHR0aGlzLl9vbkxpZ2h0c0NoYW5nZURlbGVnYXRlID0gKGV2ZW50OkV2ZW50KSA9PiB0aGlzLm9uTGlnaHRzQ2hhbmdlKGV2ZW50KTtcblx0XHRcblx0XHR0aGlzLl9vbk1ldGhvZEludmFsaWRhdGVkRGVsZWdhdGUgPSAoZXZlbnQ6U2hhZGluZ01ldGhvZEV2ZW50KSA9PiB0aGlzLm9uTWV0aG9kSW52YWxpZGF0ZWQoZXZlbnQpO1xuXG5cdFx0dGhpcy5saWdodFBpY2tlciA9IHJlbmRlck9iamVjdE93bmVyLmxpZ2h0UGlja2VyO1xuXG5cdFx0aWYgKHRoaXMuX3NoYWRlciA9PSBudWxsKVxuXHRcdFx0dGhpcy5fdXBkYXRlU2hhZGVyKCk7XG5cdH1cblxuXHRwcml2YXRlIF91cGRhdGVTaGFkZXIoKVxuXHR7XG5cdFx0aWYgKCh0aGlzLm51bURpcmVjdGlvbmFsTGlnaHRzIHx8IHRoaXMubnVtUG9pbnRMaWdodHMgfHwgdGhpcy5udW1MaWdodFByb2JlcykgJiYgISh0aGlzLl9zaGFkZXIgaW5zdGFuY2VvZiBTaGFkZXJMaWdodGluZ09iamVjdCkpIHtcblx0XHRcdGlmICh0aGlzLl9zaGFkZXIgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5fc2hhZGVyLmRpc3Bvc2UoKTtcblxuXHRcdFx0dGhpcy5fc2hhZGVyID0gbmV3IFNoYWRlckxpZ2h0aW5nT2JqZWN0KHRoaXMuX3JlbmRlcmFibGVDbGFzcywgdGhpcywgdGhpcy5fc3RhZ2UpO1xuXHRcdH0gZWxzZSBpZiAoISh0aGlzLl9zaGFkZXIgaW5zdGFuY2VvZiBTaGFkZXJPYmplY3RCYXNlKSkge1xuXHRcdFx0aWYgKHRoaXMuX3NoYWRlciAhPSBudWxsKVxuXHRcdFx0XHR0aGlzLl9zaGFkZXIuZGlzcG9zZSgpO1xuXG5cdFx0XHR0aGlzLl9zaGFkZXIgPSBuZXcgU2hhZGVyT2JqZWN0QmFzZSh0aGlzLl9yZW5kZXJhYmxlQ2xhc3MsIHRoaXMsIHRoaXMuX3N0YWdlKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZXMgdGhlIHVuY2hhbmdpbmcgY29uc3RhbnQgZGF0YSBmb3IgdGhpcyBtYXRlcmlhbC5cblx0ICovXG5cdHB1YmxpYyBfaUluaXRDb25zdGFudERhdGEoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpXG5cdHtcblx0XHRzdXBlci5faUluaXRDb25zdGFudERhdGEoc2hhZGVyT2JqZWN0KTtcblxuXHRcdC8vVXBkYXRlcyBtZXRob2QgY29uc3RhbnRzIGlmIHRoZXkgaGF2ZSBjaGFuZ2VkLlxuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyArK2kpXG5cdFx0XHR0aGlzLl9pTWV0aG9kVk9zW2ldLm1ldGhvZC5pSW5pdENvbnN0YW50cyhzaGFkZXJPYmplY3QsIHRoaXMuX2lNZXRob2RWT3NbaV0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBDb2xvclRyYW5zZm9ybSBvYmplY3QgdG8gdHJhbnNmb3JtIHRoZSBjb2xvdXIgb2YgdGhlIG1hdGVyaWFsIHdpdGguIERlZmF1bHRzIHRvIG51bGwuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGNvbG9yVHJhbnNmb3JtKCk6Q29sb3JUcmFuc2Zvcm1cblx0e1xuXHRcdHJldHVybiB0aGlzLmNvbG9yVHJhbnNmb3JtTWV0aG9kPyB0aGlzLmNvbG9yVHJhbnNmb3JtTWV0aG9kLmNvbG9yVHJhbnNmb3JtIDogbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgY29sb3JUcmFuc2Zvcm0odmFsdWU6Q29sb3JUcmFuc2Zvcm0pXG5cdHtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGlmICh0aGlzLmNvbG9yVHJhbnNmb3JtTWV0aG9kID09IG51bGwpXG5cdFx0XHRcdHRoaXMuY29sb3JUcmFuc2Zvcm1NZXRob2QgPSBuZXcgRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2QoKTtcblxuXHRcdFx0dGhpcy5jb2xvclRyYW5zZm9ybU1ldGhvZC5jb2xvclRyYW5zZm9ybSA9IHZhbHVlO1xuXG5cdFx0fSBlbHNlIGlmICghdmFsdWUpIHtcblx0XHRcdGlmICh0aGlzLmNvbG9yVHJhbnNmb3JtTWV0aG9kKVxuXHRcdFx0XHR0aGlzLmNvbG9yVHJhbnNmb3JtTWV0aG9kID0gbnVsbDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVGhlIEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kIG9iamVjdCB0byB0cmFuc2Zvcm0gdGhlIGNvbG91ciBvZiB0aGUgbWF0ZXJpYWwgd2l0aC4gRGVmYXVsdHMgdG8gbnVsbC5cblx0ICovXG5cdHB1YmxpYyBnZXQgY29sb3JUcmFuc2Zvcm1NZXRob2QoKTpFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPPyA8RWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2Q+IHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPLm1ldGhvZCA6IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGNvbG9yVHJhbnNmb3JtTWV0aG9kKHZhbHVlOkVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPICYmIHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPLm1ldGhvZCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdGlmICh0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTykge1xuXHRcdFx0dGhpcy5fcmVtb3ZlRGVwZW5kZW5jeSh0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTyk7XG5cdFx0XHR0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTyA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHR0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTyA9IG5ldyBNZXRob2RWTyh2YWx1ZSk7XG5cdFx0XHR0aGlzLl9hZGREZXBlbmRlbmN5KHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9yZW1vdmVEZXBlbmRlbmN5KG1ldGhvZFZPOk1ldGhvZFZPLCBlZmZlY3RzRGVwZW5kZW5jeTpib29sZWFuID0gZmFsc2UpXG5cdHtcblx0XHR2YXIgaW5kZXg6bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5pbmRleE9mKG1ldGhvZFZPKTtcblxuXHRcdGlmICghZWZmZWN0c0RlcGVuZGVuY3kpXG5cdFx0XHR0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXMtLTtcblxuXHRcdG1ldGhvZFZPLm1ldGhvZC5yZW1vdmVFdmVudExpc3RlbmVyKFNoYWRpbmdNZXRob2RFdmVudC5TSEFERVJfSU5WQUxJREFURUQsIHRoaXMuX29uTWV0aG9kSW52YWxpZGF0ZWREZWxlZ2F0ZSk7XG5cdFx0dGhpcy5faU1ldGhvZFZPcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG5cdFx0dGhpcy5pbnZhbGlkYXRlUGFzcygpO1xuXHR9XG5cblx0cHJpdmF0ZSBfYWRkRGVwZW5kZW5jeShtZXRob2RWTzpNZXRob2RWTywgZWZmZWN0c0RlcGVuZGVuY3k6Ym9vbGVhbiA9IGZhbHNlLCBpbmRleDpudW1iZXIgPSAtMSlcblx0e1xuXHRcdG1ldGhvZFZPLm1ldGhvZC5hZGRFdmVudExpc3RlbmVyKFNoYWRpbmdNZXRob2RFdmVudC5TSEFERVJfSU5WQUxJREFURUQsIHRoaXMuX29uTWV0aG9kSW52YWxpZGF0ZWREZWxlZ2F0ZSk7XG5cblx0XHRpZiAoZWZmZWN0c0RlcGVuZGVuY3kpIHtcblx0XHRcdGlmIChpbmRleCAhPSAtMSlcblx0XHRcdFx0dGhpcy5faU1ldGhvZFZPcy5zcGxpY2UoaW5kZXggKyB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aCAtIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llcywgMCwgbWV0aG9kVk8pO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aGlzLl9pTWV0aG9kVk9zLnB1c2gobWV0aG9kVk8pO1xuXHRcdFx0dGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzKys7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2lNZXRob2RWT3Muc3BsaWNlKHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoIC0gdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzLCAwLCBtZXRob2RWTyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5pbnZhbGlkYXRlUGFzcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGVuZHMgYW4gXCJlZmZlY3RcIiBzaGFkaW5nIG1ldGhvZCB0byB0aGUgc2hhZGVyLiBFZmZlY3QgbWV0aG9kcyBhcmUgdGhvc2UgdGhhdCBkbyBub3QgaW5mbHVlbmNlIHRoZSBsaWdodGluZ1xuXHQgKiBidXQgbW9kdWxhdGUgdGhlIHNoYWRlZCBjb2xvdXIsIHVzZWQgZm9yIGZvZywgb3V0bGluZXMsIGV0Yy4gVGhlIG1ldGhvZCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHJlc3VsdCBvZiB0aGVcblx0ICogbWV0aG9kcyBhZGRlZCBwcmlvci5cblx0ICovXG5cdHB1YmxpYyBhZGRFZmZlY3RNZXRob2QobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UpXG5cdHtcblx0XHR0aGlzLl9hZGREZXBlbmRlbmN5KG5ldyBNZXRob2RWTyhtZXRob2QpLCB0cnVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbnVtYmVyIG9mIFwiZWZmZWN0XCIgbWV0aG9kcyBhZGRlZCB0byB0aGUgbWF0ZXJpYWwuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG51bUVmZmVjdE1ldGhvZHMoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXM7XG5cdH1cblxuXHQvKipcblx0ICogUXVlcmllcyB3aGV0aGVyIGEgZ2l2ZW4gZWZmZWN0cyBtZXRob2Qgd2FzIGFkZGVkIHRvIHRoZSBtYXRlcmlhbC5cblx0ICpcblx0ICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIGJlIHF1ZXJpZWQuXG5cdCAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgbWV0aG9kIHdhcyBhZGRlZCB0byB0aGUgbWF0ZXJpYWwsIGZhbHNlIG90aGVyd2lzZS5cblx0ICovXG5cdHB1YmxpYyBoYXNFZmZlY3RNZXRob2QobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLmdldERlcGVuZGVuY3lGb3JNZXRob2QobWV0aG9kKSAhPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG1ldGhvZCBhZGRlZCBhdCB0aGUgZ2l2ZW4gaW5kZXguXG5cdCAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG1ldGhvZCB0byByZXRyaWV2ZS5cblx0ICogQHJldHVybiBUaGUgbWV0aG9kIGF0IHRoZSBnaXZlbiBpbmRleC5cblx0ICovXG5cdHB1YmxpYyBnZXRFZmZlY3RNZXRob2RBdChpbmRleDpudW1iZXIpOkVmZmVjdE1ldGhvZEJhc2Vcblx0e1xuXHRcdGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXMgLSAxKVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRyZXR1cm4gPEVmZmVjdE1ldGhvZEJhc2U+IHRoaXMuX2lNZXRob2RWT3NbaW5kZXggKyB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aCAtIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llc10ubWV0aG9kO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgYW4gZWZmZWN0IG1ldGhvZCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4IGFtb25nc3QgdGhlIG1ldGhvZHMgYWxyZWFkeSBhZGRlZCB0byB0aGUgbWF0ZXJpYWwuIEVmZmVjdFxuXHQgKiBtZXRob2RzIGFyZSB0aG9zZSB0aGF0IGRvIG5vdCBpbmZsdWVuY2UgdGhlIGxpZ2h0aW5nIGJ1dCBtb2R1bGF0ZSB0aGUgc2hhZGVkIGNvbG91ciwgdXNlZCBmb3IgZm9nLCBvdXRsaW5lcyxcblx0ICogZXRjLiBUaGUgbWV0aG9kIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcmVzdWx0IG9mIHRoZSBtZXRob2RzIHdpdGggYSBsb3dlciBpbmRleC5cblx0ICovXG5cdHB1YmxpYyBhZGRFZmZlY3RNZXRob2RBdChtZXRob2Q6RWZmZWN0TWV0aG9kQmFzZSwgaW5kZXg6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fYWRkRGVwZW5kZW5jeShuZXcgTWV0aG9kVk8obWV0aG9kKSwgdHJ1ZSwgaW5kZXgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYW4gZWZmZWN0IG1ldGhvZCBmcm9tIHRoZSBtYXRlcmlhbC5cblx0ICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIGJlIHJlbW92ZWQuXG5cdCAqL1xuXHRwdWJsaWMgcmVtb3ZlRWZmZWN0TWV0aG9kKG1ldGhvZDpFZmZlY3RNZXRob2RCYXNlKVxuXHR7XG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPID0gdGhpcy5nZXREZXBlbmRlbmN5Rm9yTWV0aG9kKG1ldGhvZCk7XG5cblx0XHRpZiAobWV0aG9kVk8gIT0gbnVsbClcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kobWV0aG9kVk8sIHRydWUpO1xuXHR9XG5cblxuXHQvKipcblx0ICogcmVtb3ZlIGFuIGVmZmVjdCBtZXRob2QgYXQgdGhlIHNwZWNpZmllZCBpbmRleCBmcm9tIHRoZSBtYXRlcmlhbC5cblx0ICovXG5cdHB1YmxpYyByZW1vdmVFZmZlY3RNZXRob2RBdChpbmRleDpudW1iZXIpXG5cdHtcblx0XHRpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzIC0gMSlcblx0XHRcdHJldHVybjtcblxuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTyA9IHRoaXMuX2lNZXRob2RWT3NbaW5kZXggKyB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aCAtIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llc107XG5cblx0XHRpZiAobWV0aG9kVk8gIT0gbnVsbClcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kobWV0aG9kVk8sIHRydWUpO1xuXHR9XG5cblxuXHRwcml2YXRlIGdldERlcGVuZGVuY3lGb3JNZXRob2QobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UpOk1ldGhvZFZPXG5cdHtcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKVxuXHRcdFx0aWYgKHRoaXMuX2lNZXRob2RWT3NbaV0ubWV0aG9kID09IG1ldGhvZClcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2lNZXRob2RWT3NbaV07XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHVzZWQgdG8gZ2VuZXJhdGUgdGhlIHBlci1waXhlbCBub3JtYWxzLiBEZWZhdWx0cyB0byBOb3JtYWxCYXNpY01ldGhvZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgbm9ybWFsTWV0aG9kKCk6Tm9ybWFsQmFzaWNNZXRob2Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pTm9ybWFsTWV0aG9kVk8/IDxOb3JtYWxCYXNpY01ldGhvZD4gdGhpcy5faU5vcm1hbE1ldGhvZFZPLm1ldGhvZCA6IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgc2V0IG5vcm1hbE1ldGhvZCh2YWx1ZTpOb3JtYWxCYXNpY01ldGhvZClcblx0e1xuXHRcdGlmICh0aGlzLl9pTm9ybWFsTWV0aG9kVk8gJiYgdGhpcy5faU5vcm1hbE1ldGhvZFZPLm1ldGhvZCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdGlmICh0aGlzLl9pTm9ybWFsTWV0aG9kVk8pIHtcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faU5vcm1hbE1ldGhvZFZPKTtcblx0XHRcdHRoaXMuX2lOb3JtYWxNZXRob2RWTyA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHR0aGlzLl9pTm9ybWFsTWV0aG9kVk8gPSBuZXcgTWV0aG9kVk8odmFsdWUpO1xuXHRcdFx0dGhpcy5fYWRkRGVwZW5kZW5jeSh0aGlzLl9pTm9ybWFsTWV0aG9kVk8pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHRoYXQgcHJvdmlkZXMgdGhlIGFtYmllbnQgbGlnaHRpbmcgY29udHJpYnV0aW9uLiBEZWZhdWx0cyB0byBBbWJpZW50QmFzaWNNZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFtYmllbnRNZXRob2QoKTpBbWJpZW50QmFzaWNNZXRob2Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pQW1iaWVudE1ldGhvZFZPPyA8QW1iaWVudEJhc2ljTWV0aG9kPiB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLm1ldGhvZCA6IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGFtYmllbnRNZXRob2QodmFsdWU6QW1iaWVudEJhc2ljTWV0aG9kKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2lBbWJpZW50TWV0aG9kVk8gJiYgdGhpcy5faUFtYmllbnRNZXRob2RWTy5tZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodGhpcy5faUFtYmllbnRNZXRob2RWTykge1xuXHRcdFx0dGhpcy5fcmVtb3ZlRGVwZW5kZW5jeSh0aGlzLl9pQW1iaWVudE1ldGhvZFZPKTtcblx0XHRcdHRoaXMuX2lBbWJpZW50TWV0aG9kVk8gPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5faUFtYmllbnRNZXRob2RWTyA9IG5ldyBNZXRob2RWTyh2YWx1ZSk7XG5cdFx0XHR0aGlzLl9hZGREZXBlbmRlbmN5KHRoaXMuX2lBbWJpZW50TWV0aG9kVk8pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIHNoYWRvd3MgY2FzdCBvbiB0aGlzIHN1cmZhY2UsIG9yIG51bGwgaWYgbm8gc2hhZG93cyBhcmUgdG8gYmUgcmVuZGVyZWQuIERlZmF1bHRzIHRvIG51bGwuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNoYWRvd01ldGhvZCgpOlNoYWRvd01hcE1ldGhvZEJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pU2hhZG93TWV0aG9kVk8/IDxTaGFkb3dNYXBNZXRob2RCYXNlPiB0aGlzLl9pU2hhZG93TWV0aG9kVk8ubWV0aG9kIDogbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc2hhZG93TWV0aG9kKHZhbHVlOlNoYWRvd01hcE1ldGhvZEJhc2UpXG5cdHtcblx0XHRpZiAodGhpcy5faVNoYWRvd01ldGhvZFZPICYmIHRoaXMuX2lTaGFkb3dNZXRob2RWTy5tZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodGhpcy5faVNoYWRvd01ldGhvZFZPKSB7XG5cdFx0XHR0aGlzLl9yZW1vdmVEZXBlbmRlbmN5KHRoaXMuX2lTaGFkb3dNZXRob2RWTyk7XG5cdFx0XHR0aGlzLl9pU2hhZG93TWV0aG9kVk8gPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5faVNoYWRvd01ldGhvZFZPID0gbmV3IE1ldGhvZFZPKHZhbHVlKTtcblx0XHRcdHRoaXMuX2FkZERlcGVuZGVuY3kodGhpcy5faVNoYWRvd01ldGhvZFZPKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIHRoZSBkaWZmdXNlIGxpZ2h0aW5nIGNvbnRyaWJ1dGlvbi4gRGVmYXVsdHMgdG8gRGlmZnVzZUJhc2ljTWV0aG9kLlxuXHQgKi9cblx0cHVibGljIGdldCBkaWZmdXNlTWV0aG9kKCk6RGlmZnVzZUJhc2ljTWV0aG9kXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faURpZmZ1c2VNZXRob2RWTz8gPERpZmZ1c2VCYXNpY01ldGhvZD4gdGhpcy5faURpZmZ1c2VNZXRob2RWTy5tZXRob2QgOiBudWxsO1xuXHR9XG5cblx0cHVibGljIHNldCBkaWZmdXNlTWV0aG9kKHZhbHVlOkRpZmZ1c2VCYXNpY01ldGhvZClcblx0e1xuXHRcdGlmICh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPICYmIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8pIHtcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faURpZmZ1c2VNZXRob2RWTyk7XG5cdFx0XHR0aGlzLl9pRGlmZnVzZU1ldGhvZFZPID0gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8gPSBuZXcgTWV0aG9kVk8odmFsdWUpO1xuXHRcdFx0dGhpcy5fYWRkRGVwZW5kZW5jeSh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIHRoZSBzcGVjdWxhciBsaWdodGluZyBjb250cmlidXRpb24uIERlZmF1bHRzIHRvIFNwZWN1bGFyQmFzaWNNZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNwZWN1bGFyTWV0aG9kKCk6U3BlY3VsYXJCYXNpY01ldGhvZFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPPyA8U3BlY3VsYXJCYXNpY01ldGhvZD4gdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubWV0aG9kIDogbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3BlY3VsYXJNZXRob2QodmFsdWU6U3BlY3VsYXJCYXNpY01ldGhvZClcblx0e1xuXHRcdGlmICh0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyAmJiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy5tZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8pIHtcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8pO1xuXHRcdFx0dGhpcy5faVNwZWN1bGFyTWV0aG9kVk8gPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5faVNwZWN1bGFyTWV0aG9kVk8gPSBuZXcgTWV0aG9kVk8odmFsdWUpO1xuXHRcdFx0dGhpcy5fYWRkRGVwZW5kZW5jeSh0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHRzdXBlci5kaXNwb3NlKCk7XG5cblx0XHRpZiAodGhpcy5fbGlnaHRQaWNrZXIpXG5cdFx0XHR0aGlzLl9saWdodFBpY2tlci5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LkNIQU5HRSwgdGhpcy5fb25MaWdodHNDaGFuZ2VEZWxlZ2F0ZSk7XG5cdFx0XG5cdFx0d2hpbGUgKHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoKVxuXHRcdFx0dGhpcy5fcmVtb3ZlRGVwZW5kZW5jeSh0aGlzLl9pTWV0aG9kVk9zWzBdKTtcblxuXHRcdHRoaXMuX2lNZXRob2RWT3MgPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhbGxlZCB3aGVuIGFueSBtZXRob2QncyBzaGFkZXIgY29kZSBpcyBpbnZhbGlkYXRlZC5cblx0ICovXG5cdHByaXZhdGUgb25NZXRob2RJbnZhbGlkYXRlZChldmVudDpTaGFkaW5nTWV0aG9kRXZlbnQpXG5cdHtcblx0XHR0aGlzLmludmFsaWRhdGVQYXNzKCk7XG5cdH1cblxuXHQvLyBSRU5ERVIgTE9PUFxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pQWN0aXZhdGUoY2FtZXJhOkNhbWVyYSlcblx0e1xuXHRcdHN1cGVyLl9pQWN0aXZhdGUoY2FtZXJhKTtcblxuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTztcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKSB7XG5cdFx0XHRtZXRob2RWTyA9IHRoaXMuX2lNZXRob2RWT3NbaV07XG5cdFx0XHRpZiAobWV0aG9kVk8udXNlTWV0aG9kKVxuXHRcdFx0XHRtZXRob2RWTy5tZXRob2QuaUFjdGl2YXRlKHRoaXMuX3NoYWRlciwgbWV0aG9kVk8sIHRoaXMuX3N0YWdlKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICpcblx0ICogQHBhcmFtIHJlbmRlcmFibGVcblx0ICogQHBhcmFtIHN0YWdlXG5cdCAqIEBwYXJhbSBjYW1lcmFcblx0ICovXG5cdHB1YmxpYyBfaVJlbmRlcihyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBjYW1lcmE6Q2FtZXJhLCB2aWV3UHJvamVjdGlvbjpNYXRyaXgzRClcblx0e1xuXHRcdHN1cGVyLl9pUmVuZGVyKHJlbmRlcmFibGUsIGNhbWVyYSwgdmlld1Byb2plY3Rpb24pO1xuXG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPO1xuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyArK2kpIHtcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcblx0XHRcdGlmIChtZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRcdG1ldGhvZFZPLm1ldGhvZC5pU2V0UmVuZGVyU3RhdGUodGhpcy5fc2hhZGVyLCBtZXRob2RWTywgcmVuZGVyYWJsZSwgdGhpcy5fc3RhZ2UsIGNhbWVyYSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lEZWFjdGl2YXRlKClcblx0e1xuXHRcdHN1cGVyLl9pRGVhY3RpdmF0ZSgpO1xuXG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPO1xuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyArK2kpIHtcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcblx0XHRcdGlmIChtZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRcdG1ldGhvZFZPLm1ldGhvZC5pRGVhY3RpdmF0ZSh0aGlzLl9zaGFkZXIsIG1ldGhvZFZPLCB0aGlzLl9zdGFnZSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIF9pSW5jbHVkZURlcGVuZGVuY2llcyhzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QpXG5cdHtcblx0XHRzdXBlci5faUluY2x1ZGVEZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0KTtcblxuXHRcdC8vVE9ETzogZnJhZ21lbnQgYW5pbXRpb24gc2hvdWxkIGJlIGNvbXBhdGlibGUgd2l0aCBsaWdodGluZyBwYXNzXG5cdFx0c2hhZGVyT2JqZWN0LnVzZXNGcmFnbWVudEFuaW1hdGlvbiA9IEJvb2xlYW4odGhpcy5fbW9kZSA9PSBNZXRob2RQYXNzTW9kZS5TVVBFUl9TSEFERVIpO1xuXG5cdFx0aWYgKCFzaGFkZXJPYmplY3QudXNlc1RhbmdlbnRTcGFjZSAmJiB0aGlzLm51bVBvaW50TGlnaHRzID4gMCAmJiBzaGFkZXJPYmplY3QudXNlc0xpZ2h0cykge1xuXHRcdFx0c2hhZGVyT2JqZWN0Lmdsb2JhbFBvc0RlcGVuZGVuY2llcysrO1xuXG5cdFx0XHRpZiAoQm9vbGVhbih0aGlzLl9tb2RlICYgTWV0aG9kUGFzc01vZGUuRUZGRUNUUykpXG5cdFx0XHRcdHNoYWRlck9iamVjdC51c2VzR2xvYmFsUG9zRnJhZ21lbnQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHZhciBpOm51bWJlcjtcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSlcblx0XHRcdHRoaXMuc2V0dXBBbmRDb3VudERlcGVuZGVuY2llcyhzaGFkZXJPYmplY3QsIHRoaXMuX2lNZXRob2RWT3NbaV0pO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgKytpKVxuXHRcdFx0dGhpcy5faU1ldGhvZFZPc1tpXS51c2VNZXRob2QgPSB0aGlzLl9pTWV0aG9kVk9zW2ldLm1ldGhvZC5pSXNVc2VkKHNoYWRlck9iamVjdCk7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBDb3VudHMgdGhlIGRlcGVuZGVuY2llcyBmb3IgYSBnaXZlbiBtZXRob2QuXG5cdCAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCB0byBjb3VudCB0aGUgZGVwZW5kZW5jaWVzIGZvci5cblx0ICogQHBhcmFtIG1ldGhvZFZPIFRoZSBtZXRob2QncyBkYXRhIGZvciB0aGlzIG1hdGVyaWFsLlxuXHQgKi9cblx0cHJpdmF0ZSBzZXR1cEFuZENvdW50RGVwZW5kZW5jaWVzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXHRcdG1ldGhvZFZPLnJlc2V0KCk7XG5cblx0XHRtZXRob2RWTy5tZXRob2QuaUluaXRWTyhzaGFkZXJPYmplY3QsIG1ldGhvZFZPKTtcblxuXHRcdGlmIChtZXRob2RWTy5uZWVkc1Byb2plY3Rpb24pXG5cdFx0XHRzaGFkZXJPYmplY3QucHJvamVjdGlvbkRlcGVuZGVuY2llcysrO1xuXG5cdFx0aWYgKG1ldGhvZFZPLm5lZWRzR2xvYmFsVmVydGV4UG9zKSB7XG5cblx0XHRcdHNoYWRlck9iamVjdC5nbG9iYWxQb3NEZXBlbmRlbmNpZXMrKztcblxuXHRcdFx0aWYgKG1ldGhvZFZPLm5lZWRzR2xvYmFsRnJhZ21lbnRQb3MpXG5cdFx0XHRcdHNoYWRlck9iamVjdC51c2VzR2xvYmFsUG9zRnJhZ21lbnQgPSB0cnVlO1xuXG5cdFx0fSBlbHNlIGlmIChtZXRob2RWTy5uZWVkc0dsb2JhbEZyYWdtZW50UG9zKSB7XG5cdFx0XHRzaGFkZXJPYmplY3QuZ2xvYmFsUG9zRGVwZW5kZW5jaWVzKys7XG5cdFx0XHRzaGFkZXJPYmplY3QudXNlc0dsb2JhbFBvc0ZyYWdtZW50ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAobWV0aG9kVk8ubmVlZHNOb3JtYWxzKVxuXHRcdFx0c2hhZGVyT2JqZWN0Lm5vcm1hbERlcGVuZGVuY2llcysrO1xuXG5cdFx0aWYgKG1ldGhvZFZPLm5lZWRzVGFuZ2VudHMpXG5cdFx0XHRzaGFkZXJPYmplY3QudGFuZ2VudERlcGVuZGVuY2llcysrO1xuXG5cdFx0aWYgKG1ldGhvZFZPLm5lZWRzVmlldylcblx0XHRcdHNoYWRlck9iamVjdC52aWV3RGlyRGVwZW5kZW5jaWVzKys7XG5cblx0XHRpZiAobWV0aG9kVk8ubmVlZHNVVilcblx0XHRcdHNoYWRlck9iamVjdC51dkRlcGVuZGVuY2llcysrO1xuXG5cdFx0aWYgKG1ldGhvZFZPLm5lZWRzU2Vjb25kYXJ5VVYpXG5cdFx0XHRzaGFkZXJPYmplY3Quc2Vjb25kYXJ5VVZEZXBlbmRlbmNpZXMrKztcblx0fVxuXG5cdHB1YmxpYyBfaUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cblx0XHRpZiAodGhpcy5faUFtYmllbnRNZXRob2RWTyAmJiB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLnVzZU1ldGhvZClcblx0XHRcdGNvZGUgKz0gdGhpcy5faUFtYmllbnRNZXRob2RWTy5tZXRob2QuaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0aWYgKHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8gJiYgdGhpcy5faURpZmZ1c2VNZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRjb2RlICs9IHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kLmlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faURpZmZ1c2VNZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdGlmICh0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyAmJiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRjb2RlICs9IHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm1ldGhvZC5pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQcmVMaWdodGluZ0ZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cblx0XHRpZiAodGhpcy5faUFtYmllbnRNZXRob2RWTyAmJiB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLnVzZU1ldGhvZCkge1xuXHRcdFx0Y29kZSArPSB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLm1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUFtYmllbnRNZXRob2RWTywgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCwgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdFx0aWYgKHRoaXMuX2lBbWJpZW50TWV0aG9kVk8ubmVlZHNOb3JtYWxzKVxuXHRcdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy5ub3JtYWxGcmFnbWVudCk7XG5cblx0XHRcdGlmICh0aGlzLl9pQW1iaWVudE1ldGhvZFZPLm5lZWRzVmlldylcblx0XHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMudmlld0RpckZyYWdtZW50KTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5faURpZmZ1c2VNZXRob2RWTyAmJiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLnVzZU1ldGhvZClcblx0XHRcdGNvZGUgKz0gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUoPFNoYWRlckxpZ2h0aW5nT2JqZWN0PiBzaGFkZXJPYmplY3QsIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8gJiYgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8udXNlTWV0aG9kKVxuXHRcdFx0Y29kZSArPSAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUoPFNoYWRlckxpZ2h0aW5nT2JqZWN0PiBzaGFkZXJPYmplY3QsIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQZXJMaWdodERpZmZ1c2VGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBsaWdodERpclJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIGRpZmZ1c2VDb2xvclJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRDb2RlUGVyTGlnaHQoc2hhZGVyT2JqZWN0LCB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLCBsaWdodERpclJlZywgZGlmZnVzZUNvbG9yUmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UGVyTGlnaHRTcGVjdWxhckZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIGxpZ2h0RGlyUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgc3BlY3VsYXJDb2xvclJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm1ldGhvZCkuaUdldEZyYWdtZW50Q29kZVBlckxpZ2h0KHNoYWRlck9iamVjdCwgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8sIGxpZ2h0RGlyUmVnLCBzcGVjdWxhckNvbG9yUmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UGVyUHJvYmVEaWZmdXNlRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgdGV4UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgd2VpZ2h0UmVnOnN0cmluZywgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faURpZmZ1c2VNZXRob2RWTy5tZXRob2QpLmlHZXRGcmFnbWVudENvZGVQZXJQcm9iZShzaGFkZXJPYmplY3QsIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8sIHRleFJlZywgd2VpZ2h0UmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UGVyUHJvYmVTcGVjdWxhckZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIHRleFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHdlaWdodFJlZzpzdHJpbmcsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm1ldGhvZCkuaUdldEZyYWdtZW50Q29kZVBlclByb2JlKHNoYWRlck9iamVjdCwgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8sIHRleFJlZywgd2VpZ2h0UmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UG9zdExpZ2h0aW5nVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXG5cdFx0aWYgKHRoaXMuX2lTaGFkb3dNZXRob2RWTylcblx0XHRcdGNvZGUgKz0gdGhpcy5faVNoYWRvd01ldGhvZFZPLm1ldGhvZC5pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lTaGFkb3dNZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UG9zdExpZ2h0aW5nRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cblx0XHRpZiAoc2hhZGVyT2JqZWN0LnVzZUFscGhhUHJlbXVsdGlwbGllZCAmJiB0aGlzLl9wRW5hYmxlQmxlbmRpbmcpIHtcblx0XHRcdGNvZGUgKz0gXCJhZGQgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIudywgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIudywgXCIgKyBzaGFyZWRSZWdpc3RlcnMuY29tbW9ucyArIFwiLnpcXG5cIiArXG5cdFx0XHRcImRpdiBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIi54eXosIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiLCBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIi53XFxuXCIgK1xuXHRcdFx0XCJzdWIgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIudywgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIudywgXCIgKyBzaGFyZWRSZWdpc3RlcnMuY29tbW9ucyArIFwiLnpcXG5cIiArXG5cdFx0XHRcInNhdCBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIi54eXosIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiXFxuXCI7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2lTaGFkb3dNZXRob2RWTylcblx0XHRcdGNvZGUgKz0gdGhpcy5faVNoYWRvd01ldGhvZFZPLm1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faVNoYWRvd01ldGhvZFZPLCBzaGFyZWRSZWdpc3RlcnMuc2hhZG93VGFyZ2V0LCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0aWYgKHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8gJiYgdGhpcy5faURpZmZ1c2VNZXRob2RWTy51c2VNZXRob2QpIHtcblx0XHRcdGNvZGUgKz0gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRQb3N0TGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faURpZmZ1c2VNZXRob2RWTywgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCwgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdFx0Ly8gcmVzb2x2ZSBvdGhlciBkZXBlbmRlbmNpZXMgYXMgd2VsbD9cblx0XHRcdGlmICh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLm5lZWRzTm9ybWFscylcblx0XHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMubm9ybWFsRnJhZ21lbnQpO1xuXG5cdFx0XHRpZiAodGhpcy5faURpZmZ1c2VNZXRob2RWTy5uZWVkc1ZpZXcpXG5cdFx0XHRcdHJlZ2lzdGVyQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLnZpZXdEaXJGcmFnbWVudCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPICYmIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLnVzZU1ldGhvZCkge1xuXHRcdFx0Y29kZSArPSAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRQb3N0TGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8sIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cdFx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubmVlZHNOb3JtYWxzKVxuXHRcdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy5ub3JtYWxGcmFnbWVudCk7XG5cdFx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubmVlZHNWaWV3KVxuXHRcdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy52aWV3RGlyRnJhZ21lbnQpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9pU2hhZG93TWV0aG9kVk8pXG5cdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy5zaGFkb3dUYXJnZXQpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IG5vcm1hbHMgYXJlIGFsbG93ZWQgaW4gdGFuZ2VudCBzcGFjZS4gVGhpcyBpcyBvbmx5IHRoZSBjYXNlIGlmIG5vIG9iamVjdC1zcGFjZVxuXHQgKiBkZXBlbmRlbmNpZXMgZXhpc3QuXG5cdCAqL1xuXHRwdWJsaWMgX3BVc2VzVGFuZ2VudFNwYWNlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCk6Ym9vbGVhblxuXHR7XG5cdFx0aWYgKHNoYWRlck9iamVjdC51c2VzUHJvYmVzKVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPO1xuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyArK2kpIHtcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcblx0XHRcdGlmIChtZXRob2RWTy51c2VNZXRob2QgJiYgIW1ldGhvZFZPLm1ldGhvZC5pVXNlc1RhbmdlbnRTcGFjZSgpKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IG5vcm1hbHMgYXJlIG91dHB1dCBpbiB0YW5nZW50IHNwYWNlLlxuXHQgKi9cblx0cHVibGljIF9wT3V0cHV0c1RhbmdlbnROb3JtYWxzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gKDxOb3JtYWxCYXNpY01ldGhvZD4gdGhpcy5faU5vcm1hbE1ldGhvZFZPLm1ldGhvZCkuaU91dHB1dHNUYW5nZW50Tm9ybWFscygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBub3JtYWxzIGFyZSBvdXRwdXQgYnkgdGhlIHBhc3MuXG5cdCAqL1xuXHRwdWJsaWMgX3BPdXRwdXRzTm9ybWFscyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2lOb3JtYWxNZXRob2RWTyAmJiB0aGlzLl9pTm9ybWFsTWV0aG9kVk8udXNlTWV0aG9kO1xuXHR9XG5cblxuXHRwdWJsaWMgX2lHZXROb3JtYWxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2lOb3JtYWxNZXRob2RWTy5tZXRob2QuaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pTm9ybWFsTWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXROb3JtYWxGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSB0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubWV0aG9kLmlHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pTm9ybWFsTWV0aG9kVk8sIHNoYXJlZFJlZ2lzdGVycy5ub3JtYWxGcmFnbWVudCwgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdGlmICh0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubmVlZHNWaWV3KVxuXHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMudmlld0RpckZyYWdtZW50KTtcblxuXHRcdGlmICh0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubmVlZHNHbG9iYWxGcmFnbWVudFBvcyB8fCB0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubmVlZHNHbG9iYWxWZXJ0ZXhQb3MpXG5cdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZVZlcnRleFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMuZ2xvYmFsUG9zaXRpb25WZXJ0ZXgpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ0NhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZzpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblx0XHR2YXIgbWV0aG9kVk86TWV0aG9kVk87XG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aDtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IGxlbiAtIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llczsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRtZXRob2RWTyA9IHRoaXMuX2lNZXRob2RWT3NbaV07XG5cdFx0XHRpZiAobWV0aG9kVk8udXNlTWV0aG9kKSB7XG5cdFx0XHRcdGNvZGUgKz0gbWV0aG9kVk8ubWV0aG9kLmlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHJlZ0NhY2hlLCBzaGFyZWRSZWcpO1xuXG5cdFx0XHRcdGlmIChtZXRob2RWTy5uZWVkc0dsb2JhbFZlcnRleFBvcyB8fCBtZXRob2RWTy5uZWVkc0dsb2JhbEZyYWdtZW50UG9zKVxuXHRcdFx0XHRcdHJlZ0NhY2hlLnJlbW92ZVZlcnRleFRlbXBVc2FnZShzaGFyZWRSZWcuZ2xvYmFsUG9zaXRpb25WZXJ0ZXgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTyAmJiB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRjb2RlICs9IHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPLm1ldGhvZC5pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPLCByZWdDYWNoZSwgc2hhcmVkUmVnKTtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ0NhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZzpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblx0XHR2YXIgYWxwaGFSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50O1xuXG5cdFx0aWYgKHRoaXMucHJlc2VydmVBbHBoYSAmJiB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXMgPiAwKSB7XG5cdFx0XHRhbHBoYVJlZyA9IHJlZ0NhY2hlLmdldEZyZWVGcmFnbWVudFNpbmdsZVRlbXAoKTtcblx0XHRcdHJlZ0NhY2hlLmFkZEZyYWdtZW50VGVtcFVzYWdlcyhhbHBoYVJlZywgMSk7XG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgYWxwaGFSZWcgKyBcIiwgXCIgKyBzaGFyZWRSZWcuc2hhZGVkVGFyZ2V0ICsgXCIud1xcblwiO1xuXHRcdH1cblxuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTztcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gbGVuIC0gdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcblx0XHRcdGlmIChtZXRob2RWTy51c2VNZXRob2QpIHtcblx0XHRcdFx0Y29kZSArPSBtZXRob2RWTy5tZXRob2QuaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCBzaGFyZWRSZWcuc2hhZGVkVGFyZ2V0LCByZWdDYWNoZSwgc2hhcmVkUmVnKTtcblxuXHRcdFx0XHRpZiAobWV0aG9kVk8ubmVlZHNOb3JtYWxzKVxuXHRcdFx0XHRcdHJlZ0NhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZy5ub3JtYWxGcmFnbWVudCk7XG5cblx0XHRcdFx0aWYgKG1ldGhvZFZPLm5lZWRzVmlldylcblx0XHRcdFx0XHRyZWdDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWcudmlld0RpckZyYWdtZW50KTtcblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnByZXNlcnZlQWxwaGEgJiYgdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzID4gMCkge1xuXHRcdFx0Y29kZSArPSBcIm1vdiBcIiArIHNoYXJlZFJlZy5zaGFkZWRUYXJnZXQgKyBcIi53LCBcIiArIGFscGhhUmVnICsgXCJcXG5cIjtcblx0XHRcdHJlZ0NhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKGFscGhhUmVnKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8gJiYgdGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8udXNlTWV0aG9kKVxuXHRcdFx0Y29kZSArPSB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTy5tZXRob2QuaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPLCBzaGFyZWRSZWcuc2hhZGVkVGFyZ2V0LCByZWdDYWNoZSwgc2hhcmVkUmVnKTtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc2hhZGVyIHVzZXMgYW55IHNoYWRvd3MuXG5cdCAqL1xuXHRwdWJsaWMgX2lVc2VzU2hhZG93cyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5faVNoYWRvd01ldGhvZFZPICYmICh0aGlzLl9saWdodFBpY2tlci5jYXN0aW5nRGlyZWN0aW9uYWxMaWdodHMubGVuZ3RoID4gMCB8fCB0aGlzLl9saWdodFBpY2tlci5jYXN0aW5nUG9pbnRMaWdodHMubGVuZ3RoID4gMCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzaGFkZXIgdXNlcyBhbnkgc3BlY3VsYXIgY29tcG9uZW50LlxuXHQgKi9cblx0cHVibGljIF9pVXNlc1NwZWN1bGFyKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyk7XG5cdH1cblxuXG5cdHByaXZhdGUgb25MaWdodHNDaGFuZ2UoZXZlbnQ6RXZlbnQpXG5cdHtcblx0XHR0aGlzLl91cGRhdGVMaWdodHMoKTtcblx0fVxuXG5cdHByaXZhdGUgX3VwZGF0ZUxpZ2h0cygpXG5cdHtcblx0XHR2YXIgbnVtRGlyZWN0aW9uYWxMaWdodHNPbGQ6bnVtYmVyID0gdGhpcy5udW1EaXJlY3Rpb25hbExpZ2h0cztcblx0XHR2YXIgbnVtUG9pbnRMaWdodHNPbGQ6bnVtYmVyID0gdGhpcy5udW1Qb2ludExpZ2h0cztcblx0XHR2YXIgbnVtTGlnaHRQcm9iZXNPbGQ6bnVtYmVyID0gdGhpcy5udW1MaWdodFByb2JlcztcblxuXHRcdGlmICh0aGlzLl9saWdodFBpY2tlciAmJiAodGhpcy5fbW9kZSAmIE1ldGhvZFBhc3NNb2RlLkxJR0hUSU5HKSkge1xuXHRcdFx0dGhpcy5udW1EaXJlY3Rpb25hbExpZ2h0cyA9IHRoaXMuY2FsY3VsYXRlTnVtRGlyZWN0aW9uYWxMaWdodHModGhpcy5fbGlnaHRQaWNrZXIubnVtRGlyZWN0aW9uYWxMaWdodHMpO1xuXHRcdFx0dGhpcy5udW1Qb2ludExpZ2h0cyA9IHRoaXMuY2FsY3VsYXRlTnVtUG9pbnRMaWdodHModGhpcy5fbGlnaHRQaWNrZXIubnVtUG9pbnRMaWdodHMpO1xuXHRcdFx0dGhpcy5udW1MaWdodFByb2JlcyA9IHRoaXMuY2FsY3VsYXRlTnVtUHJvYmVzKHRoaXMuX2xpZ2h0UGlja2VyLm51bUxpZ2h0UHJvYmVzKTtcblxuXHRcdFx0aWYgKHRoaXMuX2luY2x1ZGVDYXN0ZXJzKSB7XG5cdFx0XHRcdHRoaXMubnVtRGlyZWN0aW9uYWxMaWdodHMgKz0gdGhpcy5fbGlnaHRQaWNrZXIubnVtQ2FzdGluZ0RpcmVjdGlvbmFsTGlnaHRzO1xuXHRcdFx0XHR0aGlzLm51bVBvaW50TGlnaHRzICs9IHRoaXMuX2xpZ2h0UGlja2VyLm51bUNhc3RpbmdQb2ludExpZ2h0cztcblx0XHRcdH1cblxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm51bURpcmVjdGlvbmFsTGlnaHRzID0gMDtcblx0XHRcdHRoaXMubnVtUG9pbnRMaWdodHMgPSAwO1xuXHRcdFx0dGhpcy5udW1MaWdodFByb2JlcyA9IDA7XG5cdFx0fVxuXG5cdFx0aWYgKG51bURpcmVjdGlvbmFsTGlnaHRzT2xkICE9IHRoaXMubnVtRGlyZWN0aW9uYWxMaWdodHMgfHwgbnVtUG9pbnRMaWdodHNPbGQgIT0gdGhpcy5udW1Qb2ludExpZ2h0cyB8fCBudW1MaWdodFByb2Jlc09sZCAhPSB0aGlzLm51bUxpZ2h0UHJvYmVzKSB7XG5cdFx0XHR0aGlzLl91cGRhdGVTaGFkZXIoKTtcblxuXHRcdFx0dGhpcy5pbnZhbGlkYXRlUGFzcygpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxjdWxhdGVzIHRoZSBhbW91bnQgb2YgZGlyZWN0aW9uYWwgbGlnaHRzIHRoaXMgbWF0ZXJpYWwgd2lsbCBzdXBwb3J0LlxuXHQgKiBAcGFyYW0gbnVtRGlyZWN0aW9uYWxMaWdodHMgVGhlIG1heGltdW0gYW1vdW50IG9mIGRpcmVjdGlvbmFsIGxpZ2h0cyB0byBzdXBwb3J0LlxuXHQgKiBAcmV0dXJuIFRoZSBhbW91bnQgb2YgZGlyZWN0aW9uYWwgbGlnaHRzIHRoaXMgbWF0ZXJpYWwgd2lsbCBzdXBwb3J0LCBib3VuZGVkIGJ5IHRoZSBhbW91bnQgbmVjZXNzYXJ5LlxuXHQgKi9cblx0cHJpdmF0ZSBjYWxjdWxhdGVOdW1EaXJlY3Rpb25hbExpZ2h0cyhudW1EaXJlY3Rpb25hbExpZ2h0czpudW1iZXIpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIE1hdGgubWluKG51bURpcmVjdGlvbmFsTGlnaHRzIC0gdGhpcy5kaXJlY3Rpb25hbExpZ2h0c09mZnNldCwgdGhpcy5fbWF4TGlnaHRzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxjdWxhdGVzIHRoZSBhbW91bnQgb2YgcG9pbnQgbGlnaHRzIHRoaXMgbWF0ZXJpYWwgd2lsbCBzdXBwb3J0LlxuXHQgKiBAcGFyYW0gbnVtRGlyZWN0aW9uYWxMaWdodHMgVGhlIG1heGltdW0gYW1vdW50IG9mIHBvaW50IGxpZ2h0cyB0byBzdXBwb3J0LlxuXHQgKiBAcmV0dXJuIFRoZSBhbW91bnQgb2YgcG9pbnQgbGlnaHRzIHRoaXMgbWF0ZXJpYWwgd2lsbCBzdXBwb3J0LCBib3VuZGVkIGJ5IHRoZSBhbW91bnQgbmVjZXNzYXJ5LlxuXHQgKi9cblx0cHJpdmF0ZSBjYWxjdWxhdGVOdW1Qb2ludExpZ2h0cyhudW1Qb2ludExpZ2h0czpudW1iZXIpOm51bWJlclxuXHR7XG5cdFx0dmFyIG51bUZyZWU6bnVtYmVyID0gdGhpcy5fbWF4TGlnaHRzIC0gdGhpcy5udW1EaXJlY3Rpb25hbExpZ2h0cztcblx0XHRyZXR1cm4gTWF0aC5taW4obnVtUG9pbnRMaWdodHMgLSB0aGlzLnBvaW50TGlnaHRzT2Zmc2V0LCBudW1GcmVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxjdWxhdGVzIHRoZSBhbW91bnQgb2YgbGlnaHQgcHJvYmVzIHRoaXMgbWF0ZXJpYWwgd2lsbCBzdXBwb3J0LlxuXHQgKiBAcGFyYW0gbnVtRGlyZWN0aW9uYWxMaWdodHMgVGhlIG1heGltdW0gYW1vdW50IG9mIGxpZ2h0IHByb2JlcyB0byBzdXBwb3J0LlxuXHQgKiBAcmV0dXJuIFRoZSBhbW91bnQgb2YgbGlnaHQgcHJvYmVzIHRoaXMgbWF0ZXJpYWwgd2lsbCBzdXBwb3J0LCBib3VuZGVkIGJ5IHRoZSBhbW91bnQgbmVjZXNzYXJ5LlxuXHQgKi9cblx0cHJpdmF0ZSBjYWxjdWxhdGVOdW1Qcm9iZXMobnVtTGlnaHRQcm9iZXM6bnVtYmVyKTpudW1iZXJcblx0e1xuXHRcdHZhciBudW1DaGFubmVsczpudW1iZXIgPSAwO1xuXG5cdFx0aWYgKCh0aGlzLnNwZWN1bGFyTGlnaHRTb3VyY2VzICYgTGlnaHRTb3VyY2VzLlBST0JFUykgIT0gMClcblx0XHRcdCsrbnVtQ2hhbm5lbHM7XG5cblx0XHRpZiAoKHRoaXMuZGlmZnVzZUxpZ2h0U291cmNlcyAmIExpZ2h0U291cmNlcy5QUk9CRVMpICE9IDApXG5cdFx0XHQrK251bUNoYW5uZWxzO1xuXG5cdFx0Ly8gNCBjaGFubmVscyBhdmFpbGFibGVcblx0XHRyZXR1cm4gTWF0aC5taW4obnVtTGlnaHRQcm9iZXMgLSB0aGlzLmxpZ2h0UHJvYmVzT2Zmc2V0LCAoNC9udW1DaGFubmVscykgfCAwKTtcblx0fVxufVxuXG5leHBvcnQgPSBNZXRob2RQYXNzOyJdfQ==