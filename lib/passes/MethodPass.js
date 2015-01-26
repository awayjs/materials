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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL3Bhc3Nlcy9NZXRob2RQYXNzLnRzIl0sIm5hbWVzIjpbIk1ldGhvZFBhc3MiLCJNZXRob2RQYXNzLmNvbnN0cnVjdG9yIiwiTWV0aG9kUGFzcy5tb2RlIiwiTWV0aG9kUGFzcy5pbmNsdWRlQ2FzdGVycyIsIk1ldGhvZFBhc3MubGlnaHRQaWNrZXIiLCJNZXRob2RQYXNzLmVuYWJsZUxpZ2h0RmFsbE9mZiIsIk1ldGhvZFBhc3MuZGlmZnVzZUxpZ2h0U291cmNlcyIsIk1ldGhvZFBhc3Muc3BlY3VsYXJMaWdodFNvdXJjZXMiLCJNZXRob2RQYXNzLl91cGRhdGVTaGFkZXIiLCJNZXRob2RQYXNzLl9pSW5pdENvbnN0YW50RGF0YSIsIk1ldGhvZFBhc3MuY29sb3JUcmFuc2Zvcm0iLCJNZXRob2RQYXNzLmNvbG9yVHJhbnNmb3JtTWV0aG9kIiwiTWV0aG9kUGFzcy5fcmVtb3ZlRGVwZW5kZW5jeSIsIk1ldGhvZFBhc3MuX2FkZERlcGVuZGVuY3kiLCJNZXRob2RQYXNzLmFkZEVmZmVjdE1ldGhvZCIsIk1ldGhvZFBhc3MubnVtRWZmZWN0TWV0aG9kcyIsIk1ldGhvZFBhc3MuaGFzRWZmZWN0TWV0aG9kIiwiTWV0aG9kUGFzcy5nZXRFZmZlY3RNZXRob2RBdCIsIk1ldGhvZFBhc3MuYWRkRWZmZWN0TWV0aG9kQXQiLCJNZXRob2RQYXNzLnJlbW92ZUVmZmVjdE1ldGhvZCIsIk1ldGhvZFBhc3MucmVtb3ZlRWZmZWN0TWV0aG9kQXQiLCJNZXRob2RQYXNzLmdldERlcGVuZGVuY3lGb3JNZXRob2QiLCJNZXRob2RQYXNzLm5vcm1hbE1ldGhvZCIsIk1ldGhvZFBhc3MuYW1iaWVudE1ldGhvZCIsIk1ldGhvZFBhc3Muc2hhZG93TWV0aG9kIiwiTWV0aG9kUGFzcy5kaWZmdXNlTWV0aG9kIiwiTWV0aG9kUGFzcy5zcGVjdWxhck1ldGhvZCIsIk1ldGhvZFBhc3MuZGlzcG9zZSIsIk1ldGhvZFBhc3Mub25NZXRob2RJbnZhbGlkYXRlZCIsIk1ldGhvZFBhc3MuX2lBY3RpdmF0ZSIsIk1ldGhvZFBhc3MuX2lSZW5kZXIiLCJNZXRob2RQYXNzLl9pRGVhY3RpdmF0ZSIsIk1ldGhvZFBhc3MuX2lJbmNsdWRlRGVwZW5kZW5jaWVzIiwiTWV0aG9kUGFzcy5zZXR1cEFuZENvdW50RGVwZW5kZW5jaWVzIiwiTWV0aG9kUGFzcy5faUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRQcmVMaWdodGluZ0ZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRQZXJMaWdodERpZmZ1c2VGcmFnbWVudENvZGUiLCJNZXRob2RQYXNzLl9pR2V0UGVyTGlnaHRTcGVjdWxhckZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRQZXJQcm9iZURpZmZ1c2VGcmFnbWVudENvZGUiLCJNZXRob2RQYXNzLl9pR2V0UGVyUHJvYmVTcGVjdWxhckZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRQb3N0TGlnaHRpbmdWZXJ0ZXhDb2RlIiwiTWV0aG9kUGFzcy5faUdldFBvc3RMaWdodGluZ0ZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX3BVc2VzVGFuZ2VudFNwYWNlIiwiTWV0aG9kUGFzcy5fcE91dHB1dHNUYW5nZW50Tm9ybWFscyIsIk1ldGhvZFBhc3MuX3BPdXRwdXRzTm9ybWFscyIsIk1ldGhvZFBhc3MuX2lHZXROb3JtYWxWZXJ0ZXhDb2RlIiwiTWV0aG9kUGFzcy5faUdldE5vcm1hbEZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRWZXJ0ZXhDb2RlIiwiTWV0aG9kUGFzcy5faUdldEZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lVc2VzU2hhZG93cyIsIk1ldGhvZFBhc3MuX2lVc2VzU3BlY3VsYXIiLCJNZXRob2RQYXNzLl9pVXNlc0RpZmZ1c2UiLCJNZXRob2RQYXNzLm9uTGlnaHRzQ2hhbmdlIiwiTWV0aG9kUGFzcy5fdXBkYXRlTGlnaHRzIiwiTWV0aG9kUGFzcy5jYWxjdWxhdGVOdW1EaXJlY3Rpb25hbExpZ2h0cyIsIk1ldGhvZFBhc3MuY2FsY3VsYXRlTnVtUG9pbnRMaWdodHMiLCJNZXRob2RQYXNzLmNhbGN1bGF0ZU51bVByb2JlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBTUEsSUFBTyxLQUFLLFdBQWlCLDhCQUE4QixDQUFDLENBQUM7QUFRN0QsSUFBTyxZQUFZLFdBQWdCLDJDQUEyQyxDQUFDLENBQUM7QUFLaEYsSUFBTyxvQkFBb0IsV0FBYyx3REFBd0QsQ0FBQyxDQUFDO0FBQ25HLElBQU8sa0JBQWtCLFdBQWMsaURBQWlELENBQUMsQ0FBQztBQUMxRixJQUFPLGdCQUFnQixXQUFlLG9EQUFvRCxDQUFDLENBQUM7QUFLNUYsSUFBTyxjQUFjLFdBQWUsNkNBQTZDLENBQUMsQ0FBQztBQUluRixJQUFPLFFBQVEsV0FBaUIsMENBQTBDLENBQUMsQ0FBQztBQUk1RSxJQUFPLDBCQUEwQixXQUFZLCtEQUErRCxDQUFDLENBQUM7QUFNOUcsSUFBTyxjQUFjLFdBQWUsa0RBQWtELENBQUMsQ0FBQztBQUV4RixBQUlBOzs7R0FERztJQUNHLFVBQVU7SUFBU0EsVUFBbkJBLFVBQVVBLFVBQXVCQTtJQStIdENBOzs7O09BSUdBO0lBQ0hBLFNBcElLQSxVQUFVQSxDQW9JSEEsSUFBV0EsRUFBRUEsWUFBdUNBLEVBQUVBLGlCQUE4QkEsRUFBRUEsZUFBZ0NBLEVBQUVBLEtBQVdBO1FBcEloSkMsaUJBcTZCQ0E7UUEveEJDQSxrQkFBTUEsWUFBWUEsRUFBRUEsaUJBQWlCQSxFQUFFQSxlQUFlQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtRQXBJeERBLGVBQVVBLEdBQVVBLENBQUNBLENBQUNBO1FBRXRCQSxVQUFLQSxHQUFVQSxJQUFJQSxDQUFDQTtRQUlwQkEsb0JBQWVBLEdBQVdBLElBQUlBLENBQUNBO1FBUWhDQSxnQkFBV0EsR0FBbUJBLElBQUlBLEtBQUtBLEVBQVlBLENBQUNBO1FBRXBEQSwyQkFBc0JBLEdBQVVBLENBQUNBLENBQUNBO1FBS2xDQSx5QkFBb0JBLEdBQVVBLENB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LENBQUNBLENBQUNBO1FBRW5EQSxJQUFJQSxRQUFpQkEsQ0FBQ0E7UUFDdEJBLElBQUlBLEdBQUdBLEdBQVVBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBO1FBQ3pDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUNyQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLENBQUNBO2dCQUN0QkEsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsUUFBUUEsRUFBRUEsVUFBVUEsRUFBRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDM0ZBLENBQUNBO0lBQ0ZBLENBQUNBO0lBRUQ5Qjs7T0FFR0E7SUFDSUEsaUNBQVlBLEdBQW5CQTtRQUVDK0IsZ0JBQUtBLENBQUNBLFlBQVlBLFdBQUVBLENBQUNBO1FBRXJCQSxJQUFJQSxRQUFpQkEsQ0FBQ0E7UUFDdEJBLElBQUlBLEdBQUdBLEdBQVVBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBO1FBQ3pDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUNyQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLENBQUNBO2dCQUN0QkEsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0Es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QVdBLEdBQVVBLENBQUNBLENBQUNBO1FBRTNCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxvQkFBb0JBLEdBQUdBLFlBQVlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQzFEQSxFQUFFQSxXQUFXQSxDQUFDQTtRQUVmQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEdBQUdBLFlBQVlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ3pEQSxFQUFFQSxXQUFXQSxDQUFDQTtRQUVmQSxBQUNBQSx1QkFEdUJBO1FBQ3ZCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxjQUFjQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBLENBQUNBLEdBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO0lBQy9FQSxDQUFDQTtJQUNGeEQsaUJBQUNBO0FBQURBLENBcjZCQSxBQXE2QkNBLEVBcjZCd0IsY0FBYyxFQXE2QnRDO0FBRUQsQUFBb0IsaUJBQVgsVUFBVSxDQUFDIiwiZmlsZSI6InBhc3Nlcy9NZXRob2RQYXNzLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2xvclRyYW5zZm9ybVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9Db2xvclRyYW5zZm9ybVwiKTtcbmltcG9ydCBNYXRyaXhcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL01hdHJpeFwiKTtcbmltcG9ydCBNYXRyaXgzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RcIik7XG5pbXBvcnQgTWF0cml4M0RVdGlsc1x0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFV0aWxzXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBBYnN0cmFjdE1ldGhvZEVycm9yXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXJyb3JzL0Fic3RyYWN0TWV0aG9kRXJyb3JcIik7XG5pbXBvcnQgRXZlbnRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvRXZlbnRcIik7XG5pbXBvcnQgTWF0ZXJpYWxCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9NYXRlcmlhbEJhc2VcIik7XG5pbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IFRyaWFuZ2xlU3ViR2VvbWV0cnlcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1RyaWFuZ2xlU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xuaW1wb3J0IElSZW5kZXJPYmplY3RPd25lclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvSVJlbmRlck9iamVjdE93bmVyXCIpO1xuaW1wb3J0IExpZ2h0UGlja2VyQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL2xpZ2h0cGlja2Vycy9MaWdodFBpY2tlckJhc2VcIik7XG5pbXBvcnQgTGlnaHRTb3VyY2VzXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9MaWdodFNvdXJjZXNcIik7XG5cbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5cbmltcG9ydCBSZW5kZXJlckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYmFzZS9SZW5kZXJlckJhc2VcIik7XG5pbXBvcnQgU2hhZGVyTGlnaHRpbmdPYmplY3RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJMaWdodGluZ09iamVjdFwiKTtcbmltcG9ydCBTaGFkaW5nTWV0aG9kRXZlbnRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9ldmVudHMvU2hhZGluZ01ldGhvZEV2ZW50XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XG5pbXBvcnQgUmVuZGVyUGFzc0Jhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bhc3Nlcy9SZW5kZXJQYXNzQmFzZVwiKTtcbmltcG9ydCBJUmVuZGVyTGlnaHRpbmdQYXNzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFzc2VzL0lSZW5kZXJMaWdodGluZ1Bhc3NcIik7XG5pbXBvcnQgSVJlbmRlcmFibGVDbGFzc1x0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9JUmVuZGVyYWJsZUNsYXNzXCIpO1xuXG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL2RhdGEvTWV0aG9kVk9cIik7XG5pbXBvcnQgUmVuZGVyTWV0aG9kTWF0ZXJpYWxPYmplY3RcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvY29tcGlsYXRpb24vUmVuZGVyTWV0aG9kTWF0ZXJpYWxPYmplY3RcIik7XG5pbXBvcnQgQW1iaWVudEJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0FtYmllbnRCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBEaWZmdXNlQmFzaWNNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRGlmZnVzZUJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kXHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2RcIik7XG5pbXBvcnQgRWZmZWN0TWV0aG9kQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0VmZmVjdE1ldGhvZEJhc2VcIik7XG5pbXBvcnQgTGlnaHRpbmdNZXRob2RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0xpZ2h0aW5nTWV0aG9kQmFzZVwiKTtcbmltcG9ydCBOb3JtYWxCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9Ob3JtYWxCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBTaGFkb3dNYXBNZXRob2RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL1NoYWRvd01hcE1ldGhvZEJhc2VcIik7XG5pbXBvcnQgU3BlY3VsYXJCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9TcGVjdWxhckJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IE1ldGhvZFBhc3NNb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL3Bhc3Nlcy9NZXRob2RQYXNzTW9kZVwiKTtcblxuLyoqXG4gKiBDb21waWxlZFBhc3MgZm9ybXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgdGhlIGRlZmF1bHQgY29tcGlsZWQgcGFzcyBtYXRlcmlhbHMgcHJvdmlkZWQgYnkgQXdheTNELFxuICogdXNpbmcgbWF0ZXJpYWwgbWV0aG9kcyB0byBkZWZpbmUgdGhlaXIgYXBwZWFyYW5jZS5cbiAqL1xuY2xhc3MgTWV0aG9kUGFzcyBleHRlbmRzIFJlbmRlclBhc3NCYXNlIGltcGxlbWVudHMgSVJlbmRlckxpZ2h0aW5nUGFzc1xue1xuXHRwcml2YXRlIF9tYXhMaWdodHM6bnVtYmVyID0gMztcblxuXHRwcml2YXRlIF9tb2RlOm51bWJlciA9IDB4MDM7XG5cdHByaXZhdGUgX21hdGVyaWFsOk1hdGVyaWFsQmFzZTtcblx0cHJpdmF0ZSBfbGlnaHRQaWNrZXI6TGlnaHRQaWNrZXJCYXNlO1xuXG5cdHByaXZhdGUgX2luY2x1ZGVDYXN0ZXJzOmJvb2xlYW4gPSB0cnVlO1xuXG5cdHB1YmxpYyBfaUNvbG9yVHJhbnNmb3JtTWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaU5vcm1hbE1ldGhvZFZPOk1ldGhvZFZPO1xuXHRwdWJsaWMgX2lBbWJpZW50TWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaVNoYWRvd01ldGhvZFZPOk1ldGhvZFZPO1xuXHRwdWJsaWMgX2lEaWZmdXNlTWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaVNwZWN1bGFyTWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaU1ldGhvZFZPczpBcnJheTxNZXRob2RWTz4gPSBuZXcgQXJyYXk8TWV0aG9kVk8+KCk7XG5cblx0cHVibGljIF9udW1FZmZlY3REZXBlbmRlbmNpZXM6bnVtYmVyID0gMDtcblxuXHRwcml2YXRlIF9vbkxpZ2h0c0NoYW5nZURlbGVnYXRlOihldmVudDpFdmVudCkgPT4gdm9pZDtcblx0cHJpdmF0ZSBfb25NZXRob2RJbnZhbGlkYXRlZERlbGVnYXRlOihldmVudDpTaGFkaW5nTWV0aG9kRXZlbnQpID0+IHZvaWQ7XG5cblx0cHVibGljIG51bURpcmVjdGlvbmFsTGlnaHRzOm51bWJlciA9IDA7XG5cblx0cHVibGljIG51bVBvaW50TGlnaHRzOm51bWJlciA9IDA7XG5cblx0cHVibGljIG51bUxpZ2h0UHJvYmVzOm51bWJlciA9IDA7XG5cblx0cHVibGljIHBvaW50TGlnaHRzT2Zmc2V0Om51bWJlciA9IDA7XG5cdFxuXHRwdWJsaWMgZGlyZWN0aW9uYWxMaWdodHNPZmZzZXQ6bnVtYmVyPSAwO1xuXHRcblx0cHVibGljIGxpZ2h0UHJvYmVzT2Zmc2V0Om51bWJlciA9IDA7XG5cdFxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBnZXQgbW9kZSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX21vZGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IG1vZGUodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX21vZGUgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cdFx0XG5cdFx0dGhpcy5fbW9kZSA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fdXBkYXRlTGlnaHRzKCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHNoYWRvdyBjYXN0aW5nIGxpZ2h0cyBuZWVkIHRvIGJlIGluY2x1ZGVkLlxuXHQgKi9cblx0cHVibGljIGdldCBpbmNsdWRlQ2FzdGVycygpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9pbmNsdWRlQ2FzdGVycztcblx0fVxuXG5cdHB1YmxpYyBzZXQgaW5jbHVkZUNhc3RlcnModmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdGlmICh0aGlzLl9pbmNsdWRlQ2FzdGVycyA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2luY2x1ZGVDYXN0ZXJzID0gdmFsdWU7XG5cblx0XHR0aGlzLl91cGRhdGVMaWdodHMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICogQHJldHVybnMge0xpZ2h0UGlja2VyQmFzZX1cblx0ICovXG5cdHB1YmxpYyBnZXQgbGlnaHRQaWNrZXIoKTpMaWdodFBpY2tlckJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9saWdodFBpY2tlcjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgbGlnaHRQaWNrZXIodmFsdWU6TGlnaHRQaWNrZXJCYXNlKVxuXHR7XG5cdFx0Ly9pZiAodGhpcy5fbGlnaHRQaWNrZXIgPT0gdmFsdWUpXG5cdFx0Ly9cdHJldHVybjtcblxuXHRcdGlmICh0aGlzLl9saWdodFBpY2tlcilcblx0XHRcdHRoaXMuX2xpZ2h0UGlja2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuQ0hBTkdFLCB0aGlzLl9vbkxpZ2h0c0NoYW5nZURlbGVnYXRlKTtcblxuXHRcdHRoaXMuX2xpZ2h0UGlja2VyID0gdmFsdWU7XG5cblx0XHRpZiAodGhpcy5fbGlnaHRQaWNrZXIpXG5cdFx0XHR0aGlzLl9saWdodFBpY2tlci5hZGRFdmVudExpc3RlbmVyKEV2ZW50LkNIQU5HRSwgdGhpcy5fb25MaWdodHNDaGFuZ2VEZWxlZ2F0ZSk7XG5cblx0XHR0aGlzLl91cGRhdGVMaWdodHMoKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIFdoZXRoZXIgb3Igbm90IHRvIHVzZSBmYWxsT2ZmIGFuZCByYWRpdXMgcHJvcGVydGllcyBmb3IgbGlnaHRzLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGltcHJvdmUgcGVyZm9ybWFuY2UgYW5kXG5cdCAqIGNvbXBhdGliaWxpdHkgZm9yIGNvbnN0cmFpbmVkIG1vZGUuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGVuYWJsZUxpZ2h0RmFsbE9mZigpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9tYXRlcmlhbC5lbmFibGVMaWdodEZhbGxPZmY7XG5cdH1cblxuXHQvKipcblx0ICogRGVmaW5lIHdoaWNoIGxpZ2h0IHNvdXJjZSB0eXBlcyB0byB1c2UgZm9yIGRpZmZ1c2UgcmVmbGVjdGlvbnMuIFRoaXMgYWxsb3dzIGNob29zaW5nIGJldHdlZW4gcmVndWxhciBsaWdodHNcblx0ICogYW5kL29yIGxpZ2h0IHByb2JlcyBmb3IgZGlmZnVzZSByZWZsZWN0aW9ucy5cblx0ICpcblx0ICogQHNlZSBhd2F5M2QubWF0ZXJpYWxzLkxpZ2h0U291cmNlc1xuXHQgKi9cblx0cHVibGljIGdldCBkaWZmdXNlTGlnaHRTb3VyY2VzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbWF0ZXJpYWwuZGlmZnVzZUxpZ2h0U291cmNlcztcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWZpbmUgd2hpY2ggbGlnaHQgc291cmNlIHR5cGVzIHRvIHVzZSBmb3Igc3BlY3VsYXIgcmVmbGVjdGlvbnMuIFRoaXMgYWxsb3dzIGNob29zaW5nIGJldHdlZW4gcmVndWxhciBsaWdodHNcblx0ICogYW5kL29yIGxpZ2h0IHByb2JlcyBmb3Igc3BlY3VsYXIgcmVmbGVjdGlvbnMuXG5cdCAqXG5cdCAqIEBzZWUgYXdheTNkLm1hdGVyaWFscy5MaWdodFNvdXJjZXNcblx0ICovXG5cdHB1YmxpYyBnZXQgc3BlY3VsYXJMaWdodFNvdXJjZXMoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9tYXRlcmlhbC5zcGVjdWxhckxpZ2h0U291cmNlcztcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IENvbXBpbGVkUGFzcyBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBtYXRlcmlhbCBUaGUgbWF0ZXJpYWwgdG8gd2hpY2ggdGhpcyBwYXNzIGJlbG9uZ3MuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihtb2RlOm51bWJlciwgcmVuZGVyT2JqZWN0OlJlbmRlck1ldGhvZE1hdGVyaWFsT2JqZWN0LCByZW5kZXJPYmplY3RPd25lcjpNYXRlcmlhbEJhc2UsIHJlbmRlcmFibGVDbGFzczpJUmVuZGVyYWJsZUNsYXNzLCBzdGFnZTpTdGFnZSlcblx0e1xuXHRcdHN1cGVyKHJlbmRlck9iamVjdCwgcmVuZGVyT2JqZWN0T3duZXIsIHJlbmRlcmFibGVDbGFzcywgc3RhZ2UpO1xuXG5cdFx0dGhpcy5fbW9kZSA9IG1vZGU7XG5cblx0XHR0aGlzLl9tYXRlcmlhbCA9IHJlbmRlck9iamVjdE93bmVyO1xuXG5cdFx0dGhpcy5fb25MaWdodHNDaGFuZ2VEZWxlZ2F0ZSA9IChldmVudDpFdmVudCkgPT4gdGhpcy5vbkxpZ2h0c0NoYW5nZShldmVudCk7XG5cdFx0XG5cdFx0dGhpcy5fb25NZXRob2RJbnZhbGlkYXRlZERlbGVnYXRlID0gKGV2ZW50OlNoYWRpbmdNZXRob2RFdmVudCkgPT4gdGhpcy5vbk1ldGhvZEludmFsaWRhdGVkKGV2ZW50KTtcblxuXHRcdHRoaXMubGlnaHRQaWNrZXIgPSByZW5kZXJPYmplY3RPd25lci5saWdodFBpY2tlcjtcblxuXHRcdGlmICh0aGlzLl9zaGFkZXIgPT0gbnVsbClcblx0XHRcdHRoaXMuX3VwZGF0ZVNoYWRlcigpO1xuXHR9XG5cblx0cHJpdmF0ZSBfdXBkYXRlU2hhZGVyKClcblx0e1xuXHRcdGlmICgodGhpcy5udW1EaXJlY3Rpb25hbExpZ2h0cyB8fCB0aGlzLm51bVBvaW50TGlnaHRzIHx8IHRoaXMubnVtTGlnaHRQcm9iZXMpICYmICEodGhpcy5fc2hhZGVyIGluc3RhbmNlb2YgU2hhZGVyTGlnaHRpbmdPYmplY3QpKSB7XG5cdFx0XHRpZiAodGhpcy5fc2hhZGVyICE9IG51bGwpXG5cdFx0XHRcdHRoaXMuX3NoYWRlci5kaXNwb3NlKCk7XG5cblx0XHRcdHRoaXMuX3NoYWRlciA9IG5ldyBTaGFkZXJMaWdodGluZ09iamVjdCh0aGlzLl9yZW5kZXJhYmxlQ2xhc3MsIHRoaXMsIHRoaXMuX3N0YWdlKTtcblx0XHR9IGVsc2UgaWYgKCEodGhpcy5fc2hhZGVyIGluc3RhbmNlb2YgU2hhZGVyT2JqZWN0QmFzZSkpIHtcblx0XHRcdGlmICh0aGlzLl9zaGFkZXIgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5fc2hhZGVyLmRpc3Bvc2UoKTtcblxuXHRcdFx0dGhpcy5fc2hhZGVyID0gbmV3IFNoYWRlck9iamVjdEJhc2UodGhpcy5fcmVuZGVyYWJsZUNsYXNzLCB0aGlzLCB0aGlzLl9zdGFnZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemVzIHRoZSB1bmNoYW5naW5nIGNvbnN0YW50IGRhdGEgZm9yIHRoaXMgbWF0ZXJpYWwuXG5cdCAqL1xuXHRwdWJsaWMgX2lJbml0Q29uc3RhbnREYXRhKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cdFx0c3VwZXIuX2lJbml0Q29uc3RhbnREYXRhKHNoYWRlck9iamVjdCk7XG5cblx0XHQvL1VwZGF0ZXMgbWV0aG9kIGNvbnN0YW50cyBpZiB0aGV5IGhhdmUgY2hhbmdlZC5cblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKVxuXHRcdFx0dGhpcy5faU1ldGhvZFZPc1tpXS5tZXRob2QuaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0LCB0aGlzLl9pTWV0aG9kVk9zW2ldKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgQ29sb3JUcmFuc2Zvcm0gb2JqZWN0IHRvIHRyYW5zZm9ybSB0aGUgY29sb3VyIG9mIHRoZSBtYXRlcmlhbCB3aXRoLiBEZWZhdWx0cyB0byBudWxsLlxuXHQgKi9cblx0cHVibGljIGdldCBjb2xvclRyYW5zZm9ybSgpOkNvbG9yVHJhbnNmb3JtXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5jb2xvclRyYW5zZm9ybU1ldGhvZD8gdGhpcy5jb2xvclRyYW5zZm9ybU1ldGhvZC5jb2xvclRyYW5zZm9ybSA6IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGNvbG9yVHJhbnNmb3JtKHZhbHVlOkNvbG9yVHJhbnNmb3JtKVxuXHR7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRpZiAodGhpcy5jb2xvclRyYW5zZm9ybU1ldGhvZCA9PSBudWxsKVxuXHRcdFx0XHR0aGlzLmNvbG9yVHJhbnNmb3JtTWV0aG9kID0gbmV3IEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kKCk7XG5cblx0XHRcdHRoaXMuY29sb3JUcmFuc2Zvcm1NZXRob2QuY29sb3JUcmFuc2Zvcm0gPSB2YWx1ZTtcblxuXHRcdH0gZWxzZSBpZiAoIXZhbHVlKSB7XG5cdFx0XHRpZiAodGhpcy5jb2xvclRyYW5zZm9ybU1ldGhvZClcblx0XHRcdFx0dGhpcy5jb2xvclRyYW5zZm9ybU1ldGhvZCA9IG51bGw7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZCBvYmplY3QgdG8gdHJhbnNmb3JtIHRoZSBjb2xvdXIgb2YgdGhlIG1hdGVyaWFsIHdpdGguIERlZmF1bHRzIHRvIG51bGwuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGNvbG9yVHJhbnNmb3JtTWV0aG9kKCk6RWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTz8gPEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kPiB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTy5tZXRob2QgOiBudWxsO1xuXHR9XG5cblx0cHVibGljIHNldCBjb2xvclRyYW5zZm9ybU1ldGhvZCh2YWx1ZTpFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZClcblx0e1xuXHRcdGlmICh0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTyAmJiB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTy5tZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8pIHtcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8pO1xuXHRcdFx0dGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8gPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8gPSBuZXcgTWV0aG9kVk8odmFsdWUpO1xuXHRcdFx0dGhpcy5fYWRkRGVwZW5kZW5jeSh0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTyk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfcmVtb3ZlRGVwZW5kZW5jeShtZXRob2RWTzpNZXRob2RWTywgZWZmZWN0c0RlcGVuZGVuY3k6Ym9vbGVhbiA9IGZhbHNlKVxuXHR7XG5cdFx0dmFyIGluZGV4Om51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MuaW5kZXhPZihtZXRob2RWTyk7XG5cblx0XHRpZiAoIWVmZmVjdHNEZXBlbmRlbmN5KVxuXHRcdFx0dGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzLS07XG5cblx0XHRtZXRob2RWTy5tZXRob2QucmVtb3ZlRXZlbnRMaXN0ZW5lcihTaGFkaW5nTWV0aG9kRXZlbnQuU0hBREVSX0lOVkFMSURBVEVELCB0aGlzLl9vbk1ldGhvZEludmFsaWRhdGVkRGVsZWdhdGUpO1xuXHRcdHRoaXMuX2lNZXRob2RWT3Muc3BsaWNlKGluZGV4LCAxKTtcblxuXHRcdHRoaXMuaW52YWxpZGF0ZVBhc3MoKTtcblx0fVxuXG5cdHByaXZhdGUgX2FkZERlcGVuZGVuY3kobWV0aG9kVk86TWV0aG9kVk8sIGVmZmVjdHNEZXBlbmRlbmN5OmJvb2xlYW4gPSBmYWxzZSwgaW5kZXg6bnVtYmVyID0gLTEpXG5cdHtcblx0XHRtZXRob2RWTy5tZXRob2QuYWRkRXZlbnRMaXN0ZW5lcihTaGFkaW5nTWV0aG9kRXZlbnQuU0hBREVSX0lOVkFMSURBVEVELCB0aGlzLl9vbk1ldGhvZEludmFsaWRhdGVkRGVsZWdhdGUpO1xuXG5cdFx0aWYgKGVmZmVjdHNEZXBlbmRlbmN5KSB7XG5cdFx0XHRpZiAoaW5kZXggIT0gLTEpXG5cdFx0XHRcdHRoaXMuX2lNZXRob2RWT3Muc3BsaWNlKGluZGV4ICsgdGhpcy5faU1ldGhvZFZPcy5sZW5ndGggLSB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXMsIDAsIG1ldGhvZFZPKTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhpcy5faU1ldGhvZFZPcy5wdXNoKG1ldGhvZFZPKTtcblx0XHRcdHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llcysrO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9pTWV0aG9kVk9zLnNwbGljZSh0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aCAtIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llcywgMCwgbWV0aG9kVk8pO1xuXHRcdH1cblxuXHRcdHRoaXMuaW52YWxpZGF0ZVBhc3MoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBcHBlbmRzIGFuIFwiZWZmZWN0XCIgc2hhZGluZyBtZXRob2QgdG8gdGhlIHNoYWRlci4gRWZmZWN0IG1ldGhvZHMgYXJlIHRob3NlIHRoYXQgZG8gbm90IGluZmx1ZW5jZSB0aGUgbGlnaHRpbmdcblx0ICogYnV0IG1vZHVsYXRlIHRoZSBzaGFkZWQgY29sb3VyLCB1c2VkIGZvciBmb2csIG91dGxpbmVzLCBldGMuIFRoZSBtZXRob2Qgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSByZXN1bHQgb2YgdGhlXG5cdCAqIG1ldGhvZHMgYWRkZWQgcHJpb3IuXG5cdCAqL1xuXHRwdWJsaWMgYWRkRWZmZWN0TWV0aG9kKG1ldGhvZDpFZmZlY3RNZXRob2RCYXNlKVxuXHR7XG5cdFx0dGhpcy5fYWRkRGVwZW5kZW5jeShuZXcgTWV0aG9kVk8obWV0aG9kKSwgdHJ1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG51bWJlciBvZiBcImVmZmVjdFwiIG1ldGhvZHMgYWRkZWQgdG8gdGhlIG1hdGVyaWFsLlxuXHQgKi9cblx0cHVibGljIGdldCBudW1FZmZlY3RNZXRob2RzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFF1ZXJpZXMgd2hldGhlciBhIGdpdmVuIGVmZmVjdHMgbWV0aG9kIHdhcyBhZGRlZCB0byB0aGUgbWF0ZXJpYWwuXG5cdCAqXG5cdCAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCB0byBiZSBxdWVyaWVkLlxuXHQgKiBAcmV0dXJuIHRydWUgaWYgdGhlIG1ldGhvZCB3YXMgYWRkZWQgdG8gdGhlIG1hdGVyaWFsLCBmYWxzZSBvdGhlcndpc2UuXG5cdCAqL1xuXHRwdWJsaWMgaGFzRWZmZWN0TWV0aG9kKG1ldGhvZDpFZmZlY3RNZXRob2RCYXNlKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5nZXREZXBlbmRlbmN5Rm9yTWV0aG9kKG1ldGhvZCkgIT0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBtZXRob2QgYWRkZWQgYXQgdGhlIGdpdmVuIGluZGV4LlxuXHQgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBtZXRob2QgdG8gcmV0cmlldmUuXG5cdCAqIEByZXR1cm4gVGhlIG1ldGhvZCBhdCB0aGUgZ2l2ZW4gaW5kZXguXG5cdCAqL1xuXHRwdWJsaWMgZ2V0RWZmZWN0TWV0aG9kQXQoaW5kZXg6bnVtYmVyKTpFZmZlY3RNZXRob2RCYXNlXG5cdHtcblx0XHRpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzIC0gMSlcblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0cmV0dXJuIDxFZmZlY3RNZXRob2RCYXNlPiB0aGlzLl9pTWV0aG9kVk9zW2luZGV4ICsgdGhpcy5faU1ldGhvZFZPcy5sZW5ndGggLSB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXNdLm1ldGhvZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIGFuIGVmZmVjdCBtZXRob2QgYXQgdGhlIHNwZWNpZmllZCBpbmRleCBhbW9uZ3N0IHRoZSBtZXRob2RzIGFscmVhZHkgYWRkZWQgdG8gdGhlIG1hdGVyaWFsLiBFZmZlY3Rcblx0ICogbWV0aG9kcyBhcmUgdGhvc2UgdGhhdCBkbyBub3QgaW5mbHVlbmNlIHRoZSBsaWdodGluZyBidXQgbW9kdWxhdGUgdGhlIHNoYWRlZCBjb2xvdXIsIHVzZWQgZm9yIGZvZywgb3V0bGluZXMsXG5cdCAqIGV0Yy4gVGhlIG1ldGhvZCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHJlc3VsdCBvZiB0aGUgbWV0aG9kcyB3aXRoIGEgbG93ZXIgaW5kZXguXG5cdCAqL1xuXHRwdWJsaWMgYWRkRWZmZWN0TWV0aG9kQXQobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UsIGluZGV4Om51bWJlcilcblx0e1xuXHRcdHRoaXMuX2FkZERlcGVuZGVuY3kobmV3IE1ldGhvZFZPKG1ldGhvZCksIHRydWUsIGluZGV4KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIGFuIGVmZmVjdCBtZXRob2QgZnJvbSB0aGUgbWF0ZXJpYWwuXG5cdCAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCB0byBiZSByZW1vdmVkLlxuXHQgKi9cblx0cHVibGljIHJlbW92ZUVmZmVjdE1ldGhvZChtZXRob2Q6RWZmZWN0TWV0aG9kQmFzZSlcblx0e1xuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTyA9IHRoaXMuZ2V0RGVwZW5kZW5jeUZvck1ldGhvZChtZXRob2QpO1xuXG5cdFx0aWYgKG1ldGhvZFZPICE9IG51bGwpXG5cdFx0XHR0aGlzLl9yZW1vdmVEZXBlbmRlbmN5KG1ldGhvZFZPLCB0cnVlKTtcblx0fVxuXG5cblx0LyoqXG5cdCAqIHJlbW92ZSBhbiBlZmZlY3QgbWV0aG9kIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXggZnJvbSB0aGUgbWF0ZXJpYWwuXG5cdCAqL1xuXHRwdWJsaWMgcmVtb3ZlRWZmZWN0TWV0aG9kQXQoaW5kZXg6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llcyAtIDEpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR2YXIgbWV0aG9kVk86TWV0aG9kVk8gPSB0aGlzLl9pTWV0aG9kVk9zW2luZGV4ICsgdGhpcy5faU1ldGhvZFZPcy5sZW5ndGggLSB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXNdO1xuXG5cdFx0aWYgKG1ldGhvZFZPICE9IG51bGwpXG5cdFx0XHR0aGlzLl9yZW1vdmVEZXBlbmRlbmN5KG1ldGhvZFZPLCB0cnVlKTtcblx0fVxuXG5cblx0cHJpdmF0ZSBnZXREZXBlbmRlbmN5Rm9yTWV0aG9kKG1ldGhvZDpFZmZlY3RNZXRob2RCYXNlKTpNZXRob2RWT1xuXHR7XG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aDtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47ICsraSlcblx0XHRcdGlmICh0aGlzLl9pTWV0aG9kVk9zW2ldLm1ldGhvZCA9PSBtZXRob2QpXG5cdFx0XHRcdHJldHVybiB0aGlzLl9pTWV0aG9kVk9zW2ldO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB1c2VkIHRvIGdlbmVyYXRlIHRoZSBwZXItcGl4ZWwgbm9ybWFscy4gRGVmYXVsdHMgdG8gTm9ybWFsQmFzaWNNZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG5vcm1hbE1ldGhvZCgpOk5vcm1hbEJhc2ljTWV0aG9kXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faU5vcm1hbE1ldGhvZFZPPyA8Tm9ybWFsQmFzaWNNZXRob2Q+IHRoaXMuX2lOb3JtYWxNZXRob2RWTy5tZXRob2QgOiBudWxsO1xuXHR9XG5cblx0cHVibGljIHNldCBub3JtYWxNZXRob2QodmFsdWU6Tm9ybWFsQmFzaWNNZXRob2QpXG5cdHtcblx0XHRpZiAodGhpcy5faU5vcm1hbE1ldGhvZFZPICYmIHRoaXMuX2lOb3JtYWxNZXRob2RWTy5tZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodGhpcy5faU5vcm1hbE1ldGhvZFZPKSB7XG5cdFx0XHR0aGlzLl9yZW1vdmVEZXBlbmRlbmN5KHRoaXMuX2lOb3JtYWxNZXRob2RWTyk7XG5cdFx0XHR0aGlzLl9pTm9ybWFsTWV0aG9kVk8gPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5faU5vcm1hbE1ldGhvZFZPID0gbmV3IE1ldGhvZFZPKHZhbHVlKTtcblx0XHRcdHRoaXMuX2FkZERlcGVuZGVuY3kodGhpcy5faU5vcm1hbE1ldGhvZFZPKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIHRoZSBhbWJpZW50IGxpZ2h0aW5nIGNvbnRyaWJ1dGlvbi4gRGVmYXVsdHMgdG8gQW1iaWVudEJhc2ljTWV0aG9kLlxuXHQgKi9cblx0cHVibGljIGdldCBhbWJpZW50TWV0aG9kKCk6QW1iaWVudEJhc2ljTWV0aG9kXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faUFtYmllbnRNZXRob2RWTz8gPEFtYmllbnRCYXNpY01ldGhvZD4gdGhpcy5faUFtYmllbnRNZXRob2RWTy5tZXRob2QgOiBudWxsO1xuXHR9XG5cblx0cHVibGljIHNldCBhbWJpZW50TWV0aG9kKHZhbHVlOkFtYmllbnRCYXNpY01ldGhvZClcblx0e1xuXHRcdGlmICh0aGlzLl9pQW1iaWVudE1ldGhvZFZPICYmIHRoaXMuX2lBbWJpZW50TWV0aG9kVk8ubWV0aG9kID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHRoaXMuX2lBbWJpZW50TWV0aG9kVk8pIHtcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faUFtYmllbnRNZXRob2RWTyk7XG5cdFx0XHR0aGlzLl9pQW1iaWVudE1ldGhvZFZPID0gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHRoaXMuX2lBbWJpZW50TWV0aG9kVk8gPSBuZXcgTWV0aG9kVk8odmFsdWUpO1xuXHRcdFx0dGhpcy5fYWRkRGVwZW5kZW5jeSh0aGlzLl9pQW1iaWVudE1ldGhvZFZPKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB1c2VkIHRvIHJlbmRlciBzaGFkb3dzIGNhc3Qgb24gdGhpcyBzdXJmYWNlLCBvciBudWxsIGlmIG5vIHNoYWRvd3MgYXJlIHRvIGJlIHJlbmRlcmVkLiBEZWZhdWx0cyB0byBudWxsLlxuXHQgKi9cblx0cHVibGljIGdldCBzaGFkb3dNZXRob2QoKTpTaGFkb3dNYXBNZXRob2RCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faVNoYWRvd01ldGhvZFZPPyA8U2hhZG93TWFwTWV0aG9kQmFzZT4gdGhpcy5faVNoYWRvd01ldGhvZFZPLm1ldGhvZCA6IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHNoYWRvd01ldGhvZCh2YWx1ZTpTaGFkb3dNYXBNZXRob2RCYXNlKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2lTaGFkb3dNZXRob2RWTyAmJiB0aGlzLl9pU2hhZG93TWV0aG9kVk8ubWV0aG9kID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHRoaXMuX2lTaGFkb3dNZXRob2RWTykge1xuXHRcdFx0dGhpcy5fcmVtb3ZlRGVwZW5kZW5jeSh0aGlzLl9pU2hhZG93TWV0aG9kVk8pO1xuXHRcdFx0dGhpcy5faVNoYWRvd01ldGhvZFZPID0gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHRoaXMuX2lTaGFkb3dNZXRob2RWTyA9IG5ldyBNZXRob2RWTyh2YWx1ZSk7XG5cdFx0XHR0aGlzLl9hZGREZXBlbmRlbmN5KHRoaXMuX2lTaGFkb3dNZXRob2RWTyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBtZXRob2QgdGhhdCBwcm92aWRlcyB0aGUgZGlmZnVzZSBsaWdodGluZyBjb250cmlidXRpb24uIERlZmF1bHRzIHRvIERpZmZ1c2VCYXNpY01ldGhvZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgZGlmZnVzZU1ldGhvZCgpOkRpZmZ1c2VCYXNpY01ldGhvZFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8/IDxEaWZmdXNlQmFzaWNNZXRob2Q+IHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kIDogbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZGlmZnVzZU1ldGhvZCh2YWx1ZTpEaWZmdXNlQmFzaWNNZXRob2QpXG5cdHtcblx0XHRpZiAodGhpcy5faURpZmZ1c2VNZXRob2RWTyAmJiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLm1ldGhvZCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdGlmICh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPKSB7XG5cdFx0XHR0aGlzLl9yZW1vdmVEZXBlbmRlbmN5KHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8pO1xuXHRcdFx0dGhpcy5faURpZmZ1c2VNZXRob2RWTyA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHR0aGlzLl9pRGlmZnVzZU1ldGhvZFZPID0gbmV3IE1ldGhvZFZPKHZhbHVlKTtcblx0XHRcdHRoaXMuX2FkZERlcGVuZGVuY3kodGhpcy5faURpZmZ1c2VNZXRob2RWTyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBtZXRob2QgdGhhdCBwcm92aWRlcyB0aGUgc3BlY3VsYXIgbGlnaHRpbmcgY29udHJpYnV0aW9uLiBEZWZhdWx0cyB0byBTcGVjdWxhckJhc2ljTWV0aG9kLlxuXHQgKi9cblx0cHVibGljIGdldCBzcGVjdWxhck1ldGhvZCgpOlNwZWN1bGFyQmFzaWNNZXRob2Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTz8gPFNwZWN1bGFyQmFzaWNNZXRob2Q+IHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm1ldGhvZCA6IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHNwZWN1bGFyTWV0aG9kKHZhbHVlOlNwZWN1bGFyQmFzaWNNZXRob2QpXG5cdHtcblx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8gJiYgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubWV0aG9kID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPKSB7XG5cdFx0XHR0aGlzLl9yZW1vdmVEZXBlbmRlbmN5KHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPKTtcblx0XHRcdHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPID0gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPID0gbmV3IE1ldGhvZFZPKHZhbHVlKTtcblx0XHRcdHRoaXMuX2FkZERlcGVuZGVuY3kodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xuXG5cdFx0aWYgKHRoaXMuX2xpZ2h0UGlja2VyKVxuXHRcdFx0dGhpcy5fbGlnaHRQaWNrZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5DSEFOR0UsIHRoaXMuX29uTGlnaHRzQ2hhbmdlRGVsZWdhdGUpO1xuXHRcdFxuXHRcdHdoaWxlICh0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aClcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faU1ldGhvZFZPc1swXSk7XG5cblx0XHR0aGlzLl9pTWV0aG9kVk9zID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxsZWQgd2hlbiBhbnkgbWV0aG9kJ3Mgc2hhZGVyIGNvZGUgaXMgaW52YWxpZGF0ZWQuXG5cdCAqL1xuXHRwcml2YXRlIG9uTWV0aG9kSW52YWxpZGF0ZWQoZXZlbnQ6U2hhZGluZ01ldGhvZEV2ZW50KVxuXHR7XG5cdFx0dGhpcy5pbnZhbGlkYXRlUGFzcygpO1xuXHR9XG5cblx0Ly8gUkVOREVSIExPT1BcblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaUFjdGl2YXRlKGNhbWVyYTpDYW1lcmEpXG5cdHtcblx0XHRzdXBlci5faUFjdGl2YXRlKGNhbWVyYSk7XG5cblx0XHR2YXIgbWV0aG9kVk86TWV0aG9kVk87XG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aDtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47ICsraSkge1xuXHRcdFx0bWV0aG9kVk8gPSB0aGlzLl9pTWV0aG9kVk9zW2ldO1xuXHRcdFx0aWYgKG1ldGhvZFZPLnVzZU1ldGhvZClcblx0XHRcdFx0bWV0aG9kVk8ubWV0aG9kLmlBY3RpdmF0ZSh0aGlzLl9zaGFkZXIsIG1ldGhvZFZPLCB0aGlzLl9zdGFnZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXG5cdCAqIEBwYXJhbSByZW5kZXJhYmxlXG5cdCAqIEBwYXJhbSBzdGFnZVxuXHQgKiBAcGFyYW0gY2FtZXJhXG5cdCAqL1xuXHRwdWJsaWMgX2lSZW5kZXIocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgY2FtZXJhOkNhbWVyYSwgdmlld1Byb2plY3Rpb246TWF0cml4M0QpXG5cdHtcblx0XHRzdXBlci5faVJlbmRlcihyZW5kZXJhYmxlLCBjYW1lcmEsIHZpZXdQcm9qZWN0aW9uKTtcblxuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTztcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKSB7XG5cdFx0XHRtZXRob2RWTyA9IHRoaXMuX2lNZXRob2RWT3NbaV07XG5cdFx0XHRpZiAobWV0aG9kVk8udXNlTWV0aG9kKVxuXHRcdFx0XHRtZXRob2RWTy5tZXRob2QuaVNldFJlbmRlclN0YXRlKHRoaXMuX3NoYWRlciwgbWV0aG9kVk8sIHJlbmRlcmFibGUsIHRoaXMuX3N0YWdlLCBjYW1lcmEpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pRGVhY3RpdmF0ZSgpXG5cdHtcblx0XHRzdXBlci5faURlYWN0aXZhdGUoKTtcblxuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTztcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKSB7XG5cdFx0XHRtZXRob2RWTyA9IHRoaXMuX2lNZXRob2RWT3NbaV07XG5cdFx0XHRpZiAobWV0aG9kVk8udXNlTWV0aG9kKVxuXHRcdFx0XHRtZXRob2RWTy5tZXRob2QuaURlYWN0aXZhdGUodGhpcy5fc2hhZGVyLCBtZXRob2RWTywgdGhpcy5fc3RhZ2UpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBfaUluY2x1ZGVEZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0KVxuXHR7XG5cdFx0c3VwZXIuX2lJbmNsdWRlRGVwZW5kZW5jaWVzKHNoYWRlck9iamVjdCk7XG5cblx0XHQvL1RPRE86IGZyYWdtZW50IGFuaW10aW9uIHNob3VsZCBiZSBjb21wYXRpYmxlIHdpdGggbGlnaHRpbmcgcGFzc1xuXHRcdHNoYWRlck9iamVjdC51c2VzRnJhZ21lbnRBbmltYXRpb24gPSBCb29sZWFuKHRoaXMuX21vZGUgPT0gTWV0aG9kUGFzc01vZGUuU1VQRVJfU0hBREVSKTtcblxuXHRcdGlmICghc2hhZGVyT2JqZWN0LnVzZXNUYW5nZW50U3BhY2UgJiYgdGhpcy5udW1Qb2ludExpZ2h0cyA+IDAgJiYgc2hhZGVyT2JqZWN0LnVzZXNMaWdodHMpIHtcblx0XHRcdHNoYWRlck9iamVjdC5nbG9iYWxQb3NEZXBlbmRlbmNpZXMrKztcblxuXHRcdFx0aWYgKEJvb2xlYW4odGhpcy5fbW9kZSAmIE1ldGhvZFBhc3NNb2RlLkVGRkVDVFMpKVxuXHRcdFx0XHRzaGFkZXJPYmplY3QudXNlc0dsb2JhbFBvc0ZyYWdtZW50ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR2YXIgaTpudW1iZXI7XG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aDtcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpXG5cdFx0XHR0aGlzLnNldHVwQW5kQ291bnREZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0LCB0aGlzLl9pTWV0aG9kVk9zW2ldKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSlcblx0XHRcdHRoaXMuX2lNZXRob2RWT3NbaV0udXNlTWV0aG9kID0gdGhpcy5faU1ldGhvZFZPc1tpXS5tZXRob2QuaUlzVXNlZChzaGFkZXJPYmplY3QpO1xuXHR9XG5cblxuXHQvKipcblx0ICogQ291bnRzIHRoZSBkZXBlbmRlbmNpZXMgZm9yIGEgZ2l2ZW4gbWV0aG9kLlxuXHQgKiBAcGFyYW0gbWV0aG9kIFRoZSBtZXRob2QgdG8gY291bnQgdGhlIGRlcGVuZGVuY2llcyBmb3IuXG5cdCAqIEBwYXJhbSBtZXRob2RWTyBUaGUgbWV0aG9kJ3MgZGF0YSBmb3IgdGhpcyBtYXRlcmlhbC5cblx0ICovXG5cdHByaXZhdGUgc2V0dXBBbmRDb3VudERlcGVuZGVuY2llcyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblx0XHRtZXRob2RWTy5yZXNldCgpO1xuXG5cdFx0bWV0aG9kVk8ubWV0aG9kLmlJbml0Vk8oc2hhZGVyT2JqZWN0LCBtZXRob2RWTyk7XG5cblx0XHRpZiAobWV0aG9kVk8ubmVlZHNQcm9qZWN0aW9uKVxuXHRcdFx0c2hhZGVyT2JqZWN0LnByb2plY3Rpb25EZXBlbmRlbmNpZXMrKztcblxuXHRcdGlmIChtZXRob2RWTy5uZWVkc0dsb2JhbFZlcnRleFBvcykge1xuXG5cdFx0XHRzaGFkZXJPYmplY3QuZ2xvYmFsUG9zRGVwZW5kZW5jaWVzKys7XG5cblx0XHRcdGlmIChtZXRob2RWTy5uZWVkc0dsb2JhbEZyYWdtZW50UG9zKVxuXHRcdFx0XHRzaGFkZXJPYmplY3QudXNlc0dsb2JhbFBvc0ZyYWdtZW50ID0gdHJ1ZTtcblxuXHRcdH0gZWxzZSBpZiAobWV0aG9kVk8ubmVlZHNHbG9iYWxGcmFnbWVudFBvcykge1xuXHRcdFx0c2hhZGVyT2JqZWN0Lmdsb2JhbFBvc0RlcGVuZGVuY2llcysrO1xuXHRcdFx0c2hhZGVyT2JqZWN0LnVzZXNHbG9iYWxQb3NGcmFnbWVudCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKG1ldGhvZFZPLm5lZWRzTm9ybWFscylcblx0XHRcdHNoYWRlck9iamVjdC5ub3JtYWxEZXBlbmRlbmNpZXMrKztcblxuXHRcdGlmIChtZXRob2RWTy5uZWVkc1RhbmdlbnRzKVxuXHRcdFx0c2hhZGVyT2JqZWN0LnRhbmdlbnREZXBlbmRlbmNpZXMrKztcblxuXHRcdGlmIChtZXRob2RWTy5uZWVkc1ZpZXcpXG5cdFx0XHRzaGFkZXJPYmplY3Qudmlld0RpckRlcGVuZGVuY2llcysrO1xuXG5cdFx0aWYgKG1ldGhvZFZPLm5lZWRzVVYpXG5cdFx0XHRzaGFkZXJPYmplY3QudXZEZXBlbmRlbmNpZXMrKztcblxuXHRcdGlmIChtZXRob2RWTy5uZWVkc1NlY29uZGFyeVVWKVxuXHRcdFx0c2hhZGVyT2JqZWN0LnNlY29uZGFyeVVWRGVwZW5kZW5jaWVzKys7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQcmVMaWdodGluZ1ZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXG5cdFx0aWYgKHRoaXMuX2lBbWJpZW50TWV0aG9kVk8gJiYgdGhpcy5faUFtYmllbnRNZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRjb2RlICs9IHRoaXMuX2lBbWJpZW50TWV0aG9kVk8ubWV0aG9kLmlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUFtYmllbnRNZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdGlmICh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPICYmIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8udXNlTWV0aG9kKVxuXHRcdFx0Y29kZSArPSB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLm1ldGhvZC5pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8gJiYgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8udXNlTWV0aG9kKVxuXHRcdFx0Y29kZSArPSB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy5tZXRob2QuaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UHJlTGlnaHRpbmdGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXG5cdFx0aWYgKHRoaXMuX2lBbWJpZW50TWV0aG9kVk8gJiYgdGhpcy5faUFtYmllbnRNZXRob2RWTy51c2VNZXRob2QpIHtcblx0XHRcdGNvZGUgKz0gdGhpcy5faUFtYmllbnRNZXRob2RWTy5tZXRob2QuaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lBbWJpZW50TWV0aG9kVk8sIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHRcdGlmICh0aGlzLl9pQW1iaWVudE1ldGhvZFZPLm5lZWRzTm9ybWFscylcblx0XHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMubm9ybWFsRnJhZ21lbnQpO1xuXG5cdFx0XHRpZiAodGhpcy5faUFtYmllbnRNZXRob2RWTy5uZWVkc1ZpZXcpXG5cdFx0XHRcdHJlZ2lzdGVyQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLnZpZXdEaXJGcmFnbWVudCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8gJiYgdGhpcy5faURpZmZ1c2VNZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRjb2RlICs9ICg8TGlnaHRpbmdNZXRob2RCYXNlPiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLm1ldGhvZCkuaUdldEZyYWdtZW50UHJlTGlnaHRpbmdDb2RlKDxTaGFkZXJMaWdodGluZ09iamVjdD4gc2hhZGVyT2JqZWN0LCB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0aWYgKHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPICYmIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLnVzZU1ldGhvZClcblx0XHRcdGNvZGUgKz0gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm1ldGhvZCkuaUdldEZyYWdtZW50UHJlTGlnaHRpbmdDb2RlKDxTaGFkZXJMaWdodGluZ09iamVjdD4gc2hhZGVyT2JqZWN0LCB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UGVyTGlnaHREaWZmdXNlRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbGlnaHREaXJSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCBkaWZmdXNlQ29sb3JSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuICg8TGlnaHRpbmdNZXRob2RCYXNlPiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLm1ldGhvZCkuaUdldEZyYWdtZW50Q29kZVBlckxpZ2h0KHNoYWRlck9iamVjdCwgdGhpcy5faURpZmZ1c2VNZXRob2RWTywgbGlnaHREaXJSZWcsIGRpZmZ1c2VDb2xvclJlZywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFBlckxpZ2h0U3BlY3VsYXJGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBsaWdodERpclJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHNwZWN1bGFyQ29sb3JSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuICg8TGlnaHRpbmdNZXRob2RCYXNlPiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy5tZXRob2QpLmlHZXRGcmFnbWVudENvZGVQZXJMaWdodChzaGFkZXJPYmplY3QsIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLCBsaWdodERpclJlZywgc3BlY3VsYXJDb2xvclJlZywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFBlclByb2JlRGlmZnVzZUZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIHRleFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHdlaWdodFJlZzpzdHJpbmcsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRDb2RlUGVyUHJvYmUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLCB0ZXhSZWcsIHdlaWdodFJlZywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFBlclByb2JlU3BlY3VsYXJGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCB0ZXhSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCB3ZWlnaHRSZWc6c3RyaW5nLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuICg8TGlnaHRpbmdNZXRob2RCYXNlPiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy5tZXRob2QpLmlHZXRGcmFnbWVudENvZGVQZXJQcm9iZShzaGFkZXJPYmplY3QsIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLCB0ZXhSZWcsIHdlaWdodFJlZywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFBvc3RMaWdodGluZ1ZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblxuXHRcdGlmICh0aGlzLl9pU2hhZG93TWV0aG9kVk8pXG5cdFx0XHRjb2RlICs9IHRoaXMuX2lTaGFkb3dNZXRob2RWTy5tZXRob2QuaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pU2hhZG93TWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFBvc3RMaWdodGluZ0ZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXG5cdFx0aWYgKHNoYWRlck9iamVjdC51c2VBbHBoYVByZW11bHRpcGxpZWQgJiYgdGhpcy5fcEVuYWJsZUJsZW5kaW5nKSB7XG5cdFx0XHRjb2RlICs9IFwiYWRkIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiLncsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiLncsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLmNvbW1vbnMgKyBcIi56XFxuXCIgK1xuXHRcdFx0XCJkaXYgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIueHl6LCBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIiwgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIud1xcblwiICtcblx0XHRcdFwic3ViIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiLncsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiLncsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLmNvbW1vbnMgKyBcIi56XFxuXCIgK1xuXHRcdFx0XCJzYXQgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIueHl6LCBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIlxcblwiO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9pU2hhZG93TWV0aG9kVk8pXG5cdFx0XHRjb2RlICs9IHRoaXMuX2lTaGFkb3dNZXRob2RWTy5tZXRob2QuaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lTaGFkb3dNZXRob2RWTywgc2hhcmVkUmVnaXN0ZXJzLnNoYWRvd1RhcmdldCwgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdGlmICh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPICYmIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8udXNlTWV0aG9kKSB7XG5cdFx0XHRjb2RlICs9ICg8TGlnaHRpbmdNZXRob2RCYXNlPiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLm1ldGhvZCkuaUdldEZyYWdtZW50UG9zdExpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8sIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHRcdC8vIHJlc29sdmUgb3RoZXIgZGVwZW5kZW5jaWVzIGFzIHdlbGw/XG5cdFx0XHRpZiAodGhpcy5faURpZmZ1c2VNZXRob2RWTy5uZWVkc05vcm1hbHMpXG5cdFx0XHRcdHJlZ2lzdGVyQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLm5vcm1hbEZyYWdtZW50KTtcblxuXHRcdFx0aWYgKHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubmVlZHNWaWV3KVxuXHRcdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy52aWV3RGlyRnJhZ21lbnQpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyAmJiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy51c2VNZXRob2QpIHtcblx0XHRcdGNvZGUgKz0gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm1ldGhvZCkuaUdldEZyYWdtZW50UG9zdExpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLCBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0LCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHRcdFx0aWYgKHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm5lZWRzTm9ybWFscylcblx0XHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMubm9ybWFsRnJhZ21lbnQpO1xuXHRcdFx0aWYgKHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm5lZWRzVmlldylcblx0XHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMudmlld0RpckZyYWdtZW50KTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5faVNoYWRvd01ldGhvZFZPKVxuXHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMuc2hhZG93VGFyZ2V0KTtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBub3JtYWxzIGFyZSBhbGxvd2VkIGluIHRhbmdlbnQgc3BhY2UuIFRoaXMgaXMgb25seSB0aGUgY2FzZSBpZiBubyBvYmplY3Qtc3BhY2Vcblx0ICogZGVwZW5kZW5jaWVzIGV4aXN0LlxuXHQgKi9cblx0cHVibGljIF9wVXNlc1RhbmdlbnRTcGFjZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QpOmJvb2xlYW5cblx0e1xuXHRcdGlmIChzaGFkZXJPYmplY3QudXNlc1Byb2Jlcylcblx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTztcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKSB7XG5cdFx0XHRtZXRob2RWTyA9IHRoaXMuX2lNZXRob2RWT3NbaV07XG5cdFx0XHRpZiAobWV0aG9kVk8udXNlTWV0aG9kICYmICFtZXRob2RWTy5tZXRob2QuaVVzZXNUYW5nZW50U3BhY2UoKSlcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBub3JtYWxzIGFyZSBvdXRwdXQgaW4gdGFuZ2VudCBzcGFjZS5cblx0ICovXG5cdHB1YmxpYyBfcE91dHB1dHNUYW5nZW50Tm9ybWFscyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuICg8Tm9ybWFsQmFzaWNNZXRob2Q+IHRoaXMuX2lOb3JtYWxNZXRob2RWTy5tZXRob2QpLmlPdXRwdXRzVGFuZ2VudE5vcm1hbHMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3Qgbm9ybWFscyBhcmUgb3V0cHV0IGJ5IHRoZSBwYXNzLlxuXHQgKi9cblx0cHVibGljIF9wT3V0cHV0c05vcm1hbHMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9pTm9ybWFsTWV0aG9kVk8gJiYgdGhpcy5faU5vcm1hbE1ldGhvZFZPLnVzZU1ldGhvZDtcblx0fVxuXG5cblx0cHVibGljIF9pR2V0Tm9ybWFsVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubWV0aG9kLmlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faU5vcm1hbE1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0cHVibGljIF9pR2V0Tm9ybWFsRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gdGhpcy5faU5vcm1hbE1ldGhvZFZPLm1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faU5vcm1hbE1ldGhvZFZPLCBzaGFyZWRSZWdpc3RlcnMubm9ybWFsRnJhZ21lbnQsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHRpZiAodGhpcy5faU5vcm1hbE1ldGhvZFZPLm5lZWRzVmlldylcblx0XHRcdHJlZ2lzdGVyQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLnZpZXdEaXJGcmFnbWVudCk7XG5cblx0XHRpZiAodGhpcy5faU5vcm1hbE1ldGhvZFZPLm5lZWRzR2xvYmFsRnJhZ21lbnRQb3MgfHwgdGhpcy5faU5vcm1hbE1ldGhvZFZPLm5lZWRzR2xvYmFsVmVydGV4UG9zKVxuXHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVWZXJ0ZXhUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLmdsb2JhbFBvc2l0aW9uVmVydGV4KTtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWc6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPO1xuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSBsZW4gLSB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXM7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0bWV0aG9kVk8gPSB0aGlzLl9pTWV0aG9kVk9zW2ldO1xuXHRcdFx0aWYgKG1ldGhvZFZPLnVzZU1ldGhvZCkge1xuXHRcdFx0XHRjb2RlICs9IG1ldGhvZFZPLm1ldGhvZC5pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCByZWdDYWNoZSwgc2hhcmVkUmVnKTtcblxuXHRcdFx0XHRpZiAobWV0aG9kVk8ubmVlZHNHbG9iYWxWZXJ0ZXhQb3MgfHwgbWV0aG9kVk8ubmVlZHNHbG9iYWxGcmFnbWVudFBvcylcblx0XHRcdFx0XHRyZWdDYWNoZS5yZW1vdmVWZXJ0ZXhUZW1wVXNhZ2Uoc2hhcmVkUmVnLmdsb2JhbFBvc2l0aW9uVmVydGV4KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8gJiYgdGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8udXNlTWV0aG9kKVxuXHRcdFx0Y29kZSArPSB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTy5tZXRob2QuaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTywgcmVnQ2FjaGUsIHNoYXJlZFJlZyk7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWc6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cdFx0dmFyIGFscGhhUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudDtcblxuXHRcdGlmICh0aGlzLnByZXNlcnZlQWxwaGEgJiYgdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzID4gMCkge1xuXHRcdFx0YWxwaGFSZWcgPSByZWdDYWNoZS5nZXRGcmVlRnJhZ21lbnRTaW5nbGVUZW1wKCk7XG5cdFx0XHRyZWdDYWNoZS5hZGRGcmFnbWVudFRlbXBVc2FnZXMoYWxwaGFSZWcsIDEpO1xuXHRcdFx0Y29kZSArPSBcIm1vdiBcIiArIGFscGhhUmVnICsgXCIsIFwiICsgc2hhcmVkUmVnLnNoYWRlZFRhcmdldCArIFwiLndcXG5cIjtcblx0XHR9XG5cblx0XHR2YXIgbWV0aG9kVk86TWV0aG9kVk87XG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aDtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IGxlbiAtIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llczsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRtZXRob2RWTyA9IHRoaXMuX2lNZXRob2RWT3NbaV07XG5cdFx0XHRpZiAobWV0aG9kVk8udXNlTWV0aG9kKSB7XG5cdFx0XHRcdGNvZGUgKz0gbWV0aG9kVk8ubWV0aG9kLmlHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgc2hhcmVkUmVnLnNoYWRlZFRhcmdldCwgcmVnQ2FjaGUsIHNoYXJlZFJlZyk7XG5cblx0XHRcdFx0aWYgKG1ldGhvZFZPLm5lZWRzTm9ybWFscylcblx0XHRcdFx0XHRyZWdDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWcubm9ybWFsRnJhZ21lbnQpO1xuXG5cdFx0XHRcdGlmIChtZXRob2RWTy5uZWVkc1ZpZXcpXG5cdFx0XHRcdFx0cmVnQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnLnZpZXdEaXJGcmFnbWVudCk7XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5wcmVzZXJ2ZUFscGhhICYmIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llcyA+IDApIHtcblx0XHRcdGNvZGUgKz0gXCJtb3YgXCIgKyBzaGFyZWRSZWcuc2hhZGVkVGFyZ2V0ICsgXCIudywgXCIgKyBhbHBoYVJlZyArIFwiXFxuXCI7XG5cdFx0XHRyZWdDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShhbHBoYVJlZyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPICYmIHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPLnVzZU1ldGhvZClcblx0XHRcdGNvZGUgKz0gdGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8ubWV0aG9kLmlHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTywgc2hhcmVkUmVnLnNoYWRlZFRhcmdldCwgcmVnQ2FjaGUsIHNoYXJlZFJlZyk7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNoYWRlciB1c2VzIGFueSBzaGFkb3dzLlxuXHQgKi9cblx0cHVibGljIF9pVXNlc1NoYWRvd3Moc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiBCb29sZWFuKHRoaXMuX2lTaGFkb3dNZXRob2RWTyAmJiAodGhpcy5fbGlnaHRQaWNrZXIuY2FzdGluZ0RpcmVjdGlvbmFsTGlnaHRzLmxlbmd0aCA+IDAgfHwgdGhpcy5fbGlnaHRQaWNrZXIuY2FzdGluZ1BvaW50TGlnaHRzLmxlbmd0aCA+IDApKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc2hhZGVyIHVzZXMgYW55IHNwZWN1bGFyIGNvbXBvbmVudC5cblx0ICovXG5cdHB1YmxpYyBfaVVzZXNTcGVjdWxhcihzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5faVNwZWN1bGFyTWV0aG9kVk8pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzaGFkZXIgdXNlcyBhbnkgc3BlY3VsYXIgY29tcG9uZW50LlxuXHQgKi9cblx0cHVibGljIF9pVXNlc0RpZmZ1c2Uoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiBCb29sZWFuKHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8pO1xuXHR9XG5cblxuXHRwcml2YXRlIG9uTGlnaHRzQ2hhbmdlKGV2ZW50OkV2ZW50KVxuXHR7XG5cdFx0dGhpcy5fdXBkYXRlTGlnaHRzKCk7XG5cdH1cblxuXHRwcml2YXRlIF91cGRhdGVMaWdodHMoKVxuXHR7XG5cdFx0dmFyIG51bURpcmVjdGlvbmFsTGlnaHRzT2xkOm51bWJlciA9IHRoaXMubnVtRGlyZWN0aW9uYWxMaWdodHM7XG5cdFx0dmFyIG51bVBvaW50TGlnaHRzT2xkOm51bWJlciA9IHRoaXMubnVtUG9pbnRMaWdodHM7XG5cdFx0dmFyIG51bUxpZ2h0UHJvYmVzT2xkOm51bWJlciA9IHRoaXMubnVtTGlnaHRQcm9iZXM7XG5cblx0XHRpZiAodGhpcy5fbGlnaHRQaWNrZXIgJiYgKHRoaXMuX21vZGUgJiBNZXRob2RQYXNzTW9kZS5MSUdIVElORykpIHtcblx0XHRcdHRoaXMubnVtRGlyZWN0aW9uYWxMaWdodHMgPSB0aGlzLmNhbGN1bGF0ZU51bURpcmVjdGlvbmFsTGlnaHRzKHRoaXMuX2xpZ2h0UGlja2VyLm51bURpcmVjdGlvbmFsTGlnaHRzKTtcblx0XHRcdHRoaXMubnVtUG9pbnRMaWdodHMgPSB0aGlzLmNhbGN1bGF0ZU51bVBvaW50TGlnaHRzKHRoaXMuX2xpZ2h0UGlja2VyLm51bVBvaW50TGlnaHRzKTtcblx0XHRcdHRoaXMubnVtTGlnaHRQcm9iZXMgPSB0aGlzLmNhbGN1bGF0ZU51bVByb2Jlcyh0aGlzLl9saWdodFBpY2tlci5udW1MaWdodFByb2Jlcyk7XG5cblx0XHRcdGlmICh0aGlzLl9pbmNsdWRlQ2FzdGVycykge1xuXHRcdFx0XHR0aGlzLm51bURpcmVjdGlvbmFsTGlnaHRzICs9IHRoaXMuX2xpZ2h0UGlja2VyLm51bUNhc3RpbmdEaXJlY3Rpb25hbExpZ2h0cztcblx0XHRcdFx0dGhpcy5udW1Qb2ludExpZ2h0cyArPSB0aGlzLl9saWdodFBpY2tlci5udW1DYXN0aW5nUG9pbnRMaWdodHM7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5udW1EaXJlY3Rpb25hbExpZ2h0cyA9IDA7XG5cdFx0XHR0aGlzLm51bVBvaW50TGlnaHRzID0gMDtcblx0XHRcdHRoaXMubnVtTGlnaHRQcm9iZXMgPSAwO1xuXHRcdH1cblxuXHRcdGlmIChudW1EaXJlY3Rpb25hbExpZ2h0c09sZCAhPSB0aGlzLm51bURpcmVjdGlvbmFsTGlnaHRzIHx8IG51bVBvaW50TGlnaHRzT2xkICE9IHRoaXMubnVtUG9pbnRMaWdodHMgfHwgbnVtTGlnaHRQcm9iZXNPbGQgIT0gdGhpcy5udW1MaWdodFByb2Jlcykge1xuXHRcdFx0dGhpcy5fdXBkYXRlU2hhZGVyKCk7XG5cblx0XHRcdHRoaXMuaW52YWxpZGF0ZVBhc3MoKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2FsY3VsYXRlcyB0aGUgYW1vdW50IG9mIGRpcmVjdGlvbmFsIGxpZ2h0cyB0aGlzIG1hdGVyaWFsIHdpbGwgc3VwcG9ydC5cblx0ICogQHBhcmFtIG51bURpcmVjdGlvbmFsTGlnaHRzIFRoZSBtYXhpbXVtIGFtb3VudCBvZiBkaXJlY3Rpb25hbCBsaWdodHMgdG8gc3VwcG9ydC5cblx0ICogQHJldHVybiBUaGUgYW1vdW50IG9mIGRpcmVjdGlvbmFsIGxpZ2h0cyB0aGlzIG1hdGVyaWFsIHdpbGwgc3VwcG9ydCwgYm91bmRlZCBieSB0aGUgYW1vdW50IG5lY2Vzc2FyeS5cblx0ICovXG5cdHByaXZhdGUgY2FsY3VsYXRlTnVtRGlyZWN0aW9uYWxMaWdodHMobnVtRGlyZWN0aW9uYWxMaWdodHM6bnVtYmVyKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiBNYXRoLm1pbihudW1EaXJlY3Rpb25hbExpZ2h0cyAtIHRoaXMuZGlyZWN0aW9uYWxMaWdodHNPZmZzZXQsIHRoaXMuX21heExpZ2h0cyk7XG5cdH1cblxuXHQvKipcblx0ICogQ2FsY3VsYXRlcyB0aGUgYW1vdW50IG9mIHBvaW50IGxpZ2h0cyB0aGlzIG1hdGVyaWFsIHdpbGwgc3VwcG9ydC5cblx0ICogQHBhcmFtIG51bURpcmVjdGlvbmFsTGlnaHRzIFRoZSBtYXhpbXVtIGFtb3VudCBvZiBwb2ludCBsaWdodHMgdG8gc3VwcG9ydC5cblx0ICogQHJldHVybiBUaGUgYW1vdW50IG9mIHBvaW50IGxpZ2h0cyB0aGlzIG1hdGVyaWFsIHdpbGwgc3VwcG9ydCwgYm91bmRlZCBieSB0aGUgYW1vdW50IG5lY2Vzc2FyeS5cblx0ICovXG5cdHByaXZhdGUgY2FsY3VsYXRlTnVtUG9pbnRMaWdodHMobnVtUG9pbnRMaWdodHM6bnVtYmVyKTpudW1iZXJcblx0e1xuXHRcdHZhciBudW1GcmVlOm51bWJlciA9IHRoaXMuX21heExpZ2h0cyAtIHRoaXMubnVtRGlyZWN0aW9uYWxMaWdodHM7XG5cdFx0cmV0dXJuIE1hdGgubWluKG51bVBvaW50TGlnaHRzIC0gdGhpcy5wb2ludExpZ2h0c09mZnNldCwgbnVtRnJlZSk7XG5cdH1cblxuXHQvKipcblx0ICogQ2FsY3VsYXRlcyB0aGUgYW1vdW50IG9mIGxpZ2h0IHByb2JlcyB0aGlzIG1hdGVyaWFsIHdpbGwgc3VwcG9ydC5cblx0ICogQHBhcmFtIG51bURpcmVjdGlvbmFsTGlnaHRzIFRoZSBtYXhpbXVtIGFtb3VudCBvZiBsaWdodCBwcm9iZXMgdG8gc3VwcG9ydC5cblx0ICogQHJldHVybiBUaGUgYW1vdW50IG9mIGxpZ2h0IHByb2JlcyB0aGlzIG1hdGVyaWFsIHdpbGwgc3VwcG9ydCwgYm91bmRlZCBieSB0aGUgYW1vdW50IG5lY2Vzc2FyeS5cblx0ICovXG5cdHByaXZhdGUgY2FsY3VsYXRlTnVtUHJvYmVzKG51bUxpZ2h0UHJvYmVzOm51bWJlcik6bnVtYmVyXG5cdHtcblx0XHR2YXIgbnVtQ2hhbm5lbHM6bnVtYmVyID0gMDtcblxuXHRcdGlmICgodGhpcy5zcGVjdWxhckxpZ2h0U291cmNlcyAmIExpZ2h0U291cmNlcy5QUk9CRVMpICE9IDApXG5cdFx0XHQrK251bUNoYW5uZWxzO1xuXG5cdFx0aWYgKCh0aGlzLmRpZmZ1c2VMaWdodFNvdXJjZXMgJiBMaWdodFNvdXJjZXMuUFJPQkVTKSAhPSAwKVxuXHRcdFx0KytudW1DaGFubmVscztcblxuXHRcdC8vIDQgY2hhbm5lbHMgYXZhaWxhYmxlXG5cdFx0cmV0dXJuIE1hdGgubWluKG51bUxpZ2h0UHJvYmVzIC0gdGhpcy5saWdodFByb2Jlc09mZnNldCwgKDQvbnVtQ2hhbm5lbHMpIHwgMCk7XG5cdH1cbn1cblxuZXhwb3J0ID0gTWV0aG9kUGFzczsiXX0=