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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL3Bhc3Nlcy9NZXRob2RQYXNzLnRzIl0sIm5hbWVzIjpbIk1ldGhvZFBhc3MiLCJNZXRob2RQYXNzLmNvbnN0cnVjdG9yIiwiTWV0aG9kUGFzcy5tb2RlIiwiTWV0aG9kUGFzcy5pbmNsdWRlQ2FzdGVycyIsIk1ldGhvZFBhc3MubGlnaHRQaWNrZXIiLCJNZXRob2RQYXNzLmVuYWJsZUxpZ2h0RmFsbE9mZiIsIk1ldGhvZFBhc3MuZGlmZnVzZUxpZ2h0U291cmNlcyIsIk1ldGhvZFBhc3Muc3BlY3VsYXJMaWdodFNvdXJjZXMiLCJNZXRob2RQYXNzLl91cGRhdGVTaGFkZXIiLCJNZXRob2RQYXNzLl9pSW5pdENvbnN0YW50RGF0YSIsIk1ldGhvZFBhc3MuY29sb3JUcmFuc2Zvcm0iLCJNZXRob2RQYXNzLmNvbG9yVHJhbnNmb3JtTWV0aG9kIiwiTWV0aG9kUGFzcy5fcmVtb3ZlRGVwZW5kZW5jeSIsIk1ldGhvZFBhc3MuX2FkZERlcGVuZGVuY3kiLCJNZXRob2RQYXNzLmFkZEVmZmVjdE1ldGhvZCIsIk1ldGhvZFBhc3MubnVtRWZmZWN0TWV0aG9kcyIsIk1ldGhvZFBhc3MuaGFzRWZmZWN0TWV0aG9kIiwiTWV0aG9kUGFzcy5nZXRFZmZlY3RNZXRob2RBdCIsIk1ldGhvZFBhc3MuYWRkRWZmZWN0TWV0aG9kQXQiLCJNZXRob2RQYXNzLnJlbW92ZUVmZmVjdE1ldGhvZCIsIk1ldGhvZFBhc3MucmVtb3ZlRWZmZWN0TWV0aG9kQXQiLCJNZXRob2RQYXNzLmdldERlcGVuZGVuY3lGb3JNZXRob2QiLCJNZXRob2RQYXNzLm5vcm1hbE1ldGhvZCIsIk1ldGhvZFBhc3MuYW1iaWVudE1ldGhvZCIsIk1ldGhvZFBhc3Muc2hhZG93TWV0aG9kIiwiTWV0aG9kUGFzcy5kaWZmdXNlTWV0aG9kIiwiTWV0aG9kUGFzcy5zcGVjdWxhck1ldGhvZCIsIk1ldGhvZFBhc3MuZGlzcG9zZSIsIk1ldGhvZFBhc3Mub25NZXRob2RJbnZhbGlkYXRlZCIsIk1ldGhvZFBhc3MuX2lBY3RpdmF0ZSIsIk1ldGhvZFBhc3MuX2lSZW5kZXIiLCJNZXRob2RQYXNzLl9pRGVhY3RpdmF0ZSIsIk1ldGhvZFBhc3MuX2lJbmNsdWRlRGVwZW5kZW5jaWVzIiwiTWV0aG9kUGFzcy5zZXR1cEFuZENvdW50RGVwZW5kZW5jaWVzIiwiTWV0aG9kUGFzcy5faUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRQcmVMaWdodGluZ0ZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRQZXJMaWdodERpZmZ1c2VGcmFnbWVudENvZGUiLCJNZXRob2RQYXNzLl9pR2V0UGVyTGlnaHRTcGVjdWxhckZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRQZXJQcm9iZURpZmZ1c2VGcmFnbWVudENvZGUiLCJNZXRob2RQYXNzLl9pR2V0UGVyUHJvYmVTcGVjdWxhckZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRQb3N0TGlnaHRpbmdWZXJ0ZXhDb2RlIiwiTWV0aG9kUGFzcy5faUdldFBvc3RMaWdodGluZ0ZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX3BVc2VzVGFuZ2VudFNwYWNlIiwiTWV0aG9kUGFzcy5fcE91dHB1dHNUYW5nZW50Tm9ybWFscyIsIk1ldGhvZFBhc3MuX3BPdXRwdXRzTm9ybWFscyIsIk1ldGhvZFBhc3MuX2lHZXROb3JtYWxWZXJ0ZXhDb2RlIiwiTWV0aG9kUGFzcy5faUdldE5vcm1hbEZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lHZXRWZXJ0ZXhDb2RlIiwiTWV0aG9kUGFzcy5faUdldEZyYWdtZW50Q29kZSIsIk1ldGhvZFBhc3MuX2lVc2VzU2hhZG93cyIsIk1ldGhvZFBhc3MuX2lVc2VzU3BlY3VsYXIiLCJNZXRob2RQYXNzLl9pVXNlc0RpZmZ1c2UiLCJNZXRob2RQYXNzLm9uTGlnaHRzQ2hhbmdlIiwiTWV0aG9kUGFzcy5fdXBkYXRlTGlnaHRzIiwiTWV0aG9kUGFzcy5jYWxjdWxhdGVOdW1EaXJlY3Rpb25hbExpZ2h0cyIsIk1ldGhvZFBhc3MuY2FsY3VsYXRlTnVtUG9pbnRMaWdodHMiLCJNZXRob2RQYXNzLmNhbGN1bGF0ZU51bVByb2JlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBTUEsSUFBTyxLQUFLLFdBQWlCLDhCQUE4QixDQUFDLENBQUM7QUFPN0QsSUFBTyxZQUFZLFdBQWdCLDJDQUEyQyxDQUFDLENBQUM7QUFLaEYsSUFBTyxvQkFBb0IsV0FBYyx3REFBd0QsQ0FBQyxDQUFDO0FBQ25HLElBQU8sa0JBQWtCLFdBQWMsaURBQWlELENBQUMsQ0FBQztBQUMxRixJQUFPLGdCQUFnQixXQUFlLG9EQUFvRCxDQUFDLENBQUM7QUFLNUYsSUFBTyxjQUFjLFdBQWUsNkNBQTZDLENBQUMsQ0FBQztBQUluRixJQUFPLFFBQVEsV0FBaUIsMENBQTBDLENBQUMsQ0FBQztBQUk1RSxJQUFPLDBCQUEwQixXQUFZLCtEQUErRCxDQUFDLENBQUM7QUFNOUcsSUFBTyxjQUFjLFdBQWUsa0RBQWtELENBQUMsQ0FBQztBQUV4RixBQUlBOzs7R0FERztJQUNHLFVBQVU7SUFBU0EsVUFBbkJBLFVBQVVBLFVBQXVCQTtJQStIdENBOzs7O09BSUdBO0lBQ0hBLFNBcElLQSxVQUFVQSxDQW9JSEEsSUFBV0EsRUFBRUEsWUFBdUNBLEVBQUVBLGlCQUE4QkEsRUFBRUEsZUFBZ0NBLEVBQUVBLEtBQVdBO1FBcEloSkMsaUJBcTZCQ0E7UUEveEJDQSxrQkFBTUEsWUFBWUEsRUFBRUEsaUJBQWlCQSxFQUFFQSxlQUFlQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtRQXBJeERBLGVBQVVBLEdBQVVBLENBQUNBLENBQUNBO1FBRXRCQSxVQUFLQSxHQUFVQSxJQUFJQSxDQUFDQTtRQUlwQkEsb0JBQWVBLEdBQVdBLElBQUlBLENBQUNBO1FBUWhDQSxnQkFBV0EsR0FBbUJBLElBQUlBLEtBQUtBLEVBQVlBLENBQUNBO1FBRXBEQSwyQkFBc0JBLEdBQVVBLENBQUNBLENBQUNBO1FBS2xDQSx5QkFBb0JBLEdBQVVBLENB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LENBQUNBLENBQUNBO1FBRW5EQSxJQUFJQSxRQUFpQkEsQ0FBQ0E7UUFDdEJBLElBQUlBLEdBQUdBLEdBQVVBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBO1FBQ3pDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUNyQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLENBQUNBO2dCQUN0QkEsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsUUFBUUEsRUFBRUEsVUFBVUEsRUFBRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDM0ZBLENBQUNBO0lBQ0ZBLENBQUNBO0lBRUQ5Qjs7T0FFR0E7SUFDSUEsaUNBQVlBLEdBQW5CQTtRQUVDK0IsZ0JBQUtBLENBQUNBLFlBQVlBLFdBQUVBLENBQUNBO1FBRXJCQSxJQUFJQSxRQUFpQkEsQ0FBQ0E7UUFDdEJBLElBQUlBLEdBQUdBLEdBQVVBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBO1FBQ3pDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUNyQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLENBQUNBO2dCQUN0QkEsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0Es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QVdBLEdBQVVBLENBQUNBLENBQUNBO1FBRTNCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxvQkFBb0JBLEdBQUdBLFlBQVlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQzFEQSxFQUFFQSxXQUFXQSxDQUFDQTtRQUVmQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEdBQUdBLFlBQVlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ3pEQSxFQUFFQSxXQUFXQSxDQUFDQTtRQUVmQSxBQUNBQSx1QkFEdUJBO1FBQ3ZCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxjQUFjQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBLENBQUNBLEdBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO0lBQy9FQSxDQUFDQTtJQUNGeEQsaUJBQUNBO0FBQURBLENBcjZCQSxBQXE2QkNBLEVBcjZCd0IsY0FBYyxFQXE2QnRDO0FBRUQsQUFBb0IsaUJBQVgsVUFBVSxDQUFDIiwiZmlsZSI6InBhc3Nlcy9NZXRob2RQYXNzLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2xvclRyYW5zZm9ybVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9Db2xvclRyYW5zZm9ybVwiKTtcclxuaW1wb3J0IE1hdHJpeFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4XCIpO1xyXG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL01hdHJpeDNEXCIpO1xyXG5pbXBvcnQgTWF0cml4M0RVdGlsc1x0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFV0aWxzXCIpO1xyXG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xyXG5pbXBvcnQgQWJzdHJhY3RNZXRob2RFcnJvclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2Vycm9ycy9BYnN0cmFjdE1ldGhvZEVycm9yXCIpO1xyXG5pbXBvcnQgRXZlbnRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvRXZlbnRcIik7XHJcbmltcG9ydCBNYXRlcmlhbEJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL01hdGVyaWFsQmFzZVwiKTtcclxuXHJcbmltcG9ydCBUcmlhbmdsZVN1Ykdlb21ldHJ5XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9UcmlhbmdsZVN1Ykdlb21ldHJ5XCIpO1xyXG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xyXG5pbXBvcnQgSVJlbmRlck9iamVjdE93bmVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9JUmVuZGVyT2JqZWN0T3duZXJcIik7XHJcbmltcG9ydCBMaWdodFBpY2tlckJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9saWdodHBpY2tlcnMvTGlnaHRQaWNrZXJCYXNlXCIpO1xyXG5pbXBvcnQgTGlnaHRTb3VyY2VzXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9MaWdodFNvdXJjZXNcIik7XHJcblxyXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xyXG5cclxuaW1wb3J0IFJlbmRlcmVyQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9iYXNlL1JlbmRlcmVyQmFzZVwiKTtcclxuaW1wb3J0IFNoYWRlckxpZ2h0aW5nT2JqZWN0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyTGlnaHRpbmdPYmplY3RcIik7XHJcbmltcG9ydCBTaGFkaW5nTWV0aG9kRXZlbnRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9ldmVudHMvU2hhZGluZ01ldGhvZEV2ZW50XCIpO1xyXG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcclxuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xyXG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xyXG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcclxuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xyXG5pbXBvcnQgUmVuZGVyUGFzc0Jhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bhc3Nlcy9SZW5kZXJQYXNzQmFzZVwiKTtcclxuaW1wb3J0IElSZW5kZXJMaWdodGluZ1Bhc3NcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvSVJlbmRlckxpZ2h0aW5nUGFzc1wiKTtcclxuaW1wb3J0IElSZW5kZXJhYmxlQ2xhc3NcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvSVJlbmRlcmFibGVDbGFzc1wiKTtcclxuXHJcbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvZGF0YS9NZXRob2RWT1wiKTtcclxuaW1wb3J0IFJlbmRlck1ldGhvZE1hdGVyaWFsT2JqZWN0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL2NvbXBpbGF0aW9uL1JlbmRlck1ldGhvZE1hdGVyaWFsT2JqZWN0XCIpO1xyXG5pbXBvcnQgQW1iaWVudEJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0FtYmllbnRCYXNpY01ldGhvZFwiKTtcclxuaW1wb3J0IERpZmZ1c2VCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9EaWZmdXNlQmFzaWNNZXRob2RcIik7XHJcbmltcG9ydCBFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0VmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kXCIpO1xyXG5pbXBvcnQgRWZmZWN0TWV0aG9kQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0VmZmVjdE1ldGhvZEJhc2VcIik7XHJcbmltcG9ydCBMaWdodGluZ01ldGhvZEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvTGlnaHRpbmdNZXRob2RCYXNlXCIpO1xyXG5pbXBvcnQgTm9ybWFsQmFzaWNNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvTm9ybWFsQmFzaWNNZXRob2RcIik7XHJcbmltcG9ydCBTaGFkb3dNYXBNZXRob2RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL1NoYWRvd01hcE1ldGhvZEJhc2VcIik7XHJcbmltcG9ydCBTcGVjdWxhckJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL1NwZWN1bGFyQmFzaWNNZXRob2RcIik7XHJcbmltcG9ydCBNZXRob2RQYXNzTW9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9wYXNzZXMvTWV0aG9kUGFzc01vZGVcIik7XHJcblxyXG4vKipcclxuICogQ29tcGlsZWRQYXNzIGZvcm1zIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIHRoZSBkZWZhdWx0IGNvbXBpbGVkIHBhc3MgbWF0ZXJpYWxzIHByb3ZpZGVkIGJ5IEF3YXkzRCxcclxuICogdXNpbmcgbWF0ZXJpYWwgbWV0aG9kcyB0byBkZWZpbmUgdGhlaXIgYXBwZWFyYW5jZS5cclxuICovXHJcbmNsYXNzIE1ldGhvZFBhc3MgZXh0ZW5kcyBSZW5kZXJQYXNzQmFzZSBpbXBsZW1lbnRzIElSZW5kZXJMaWdodGluZ1Bhc3Ncclxue1xyXG5cdHByaXZhdGUgX21heExpZ2h0czpudW1iZXIgPSAzO1xyXG5cclxuXHRwcml2YXRlIF9tb2RlOm51bWJlciA9IDB4MDM7XHJcblx0cHJpdmF0ZSBfbWF0ZXJpYWw6TWF0ZXJpYWxCYXNlO1xyXG5cdHByaXZhdGUgX2xpZ2h0UGlja2VyOkxpZ2h0UGlja2VyQmFzZTtcclxuXHJcblx0cHJpdmF0ZSBfaW5jbHVkZUNhc3RlcnM6Ym9vbGVhbiA9IHRydWU7XHJcblxyXG5cdHB1YmxpYyBfaUNvbG9yVHJhbnNmb3JtTWV0aG9kVk86TWV0aG9kVk87XHJcblx0cHVibGljIF9pTm9ybWFsTWV0aG9kVk86TWV0aG9kVk87XHJcblx0cHVibGljIF9pQW1iaWVudE1ldGhvZFZPOk1ldGhvZFZPO1xyXG5cdHB1YmxpYyBfaVNoYWRvd01ldGhvZFZPOk1ldGhvZFZPO1xyXG5cdHB1YmxpYyBfaURpZmZ1c2VNZXRob2RWTzpNZXRob2RWTztcclxuXHRwdWJsaWMgX2lTcGVjdWxhck1ldGhvZFZPOk1ldGhvZFZPO1xyXG5cdHB1YmxpYyBfaU1ldGhvZFZPczpBcnJheTxNZXRob2RWTz4gPSBuZXcgQXJyYXk8TWV0aG9kVk8+KCk7XHJcblxyXG5cdHB1YmxpYyBfbnVtRWZmZWN0RGVwZW5kZW5jaWVzOm51bWJlciA9IDA7XHJcblxyXG5cdHByaXZhdGUgX29uTGlnaHRzQ2hhbmdlRGVsZWdhdGU6KGV2ZW50OkV2ZW50KSA9PiB2b2lkO1xyXG5cdHByaXZhdGUgX29uTWV0aG9kSW52YWxpZGF0ZWREZWxlZ2F0ZTooZXZlbnQ6U2hhZGluZ01ldGhvZEV2ZW50KSA9PiB2b2lkO1xyXG5cclxuXHRwdWJsaWMgbnVtRGlyZWN0aW9uYWxMaWdodHM6bnVtYmVyID0gMDtcclxuXHJcblx0cHVibGljIG51bVBvaW50TGlnaHRzOm51bWJlciA9IDA7XHJcblxyXG5cdHB1YmxpYyBudW1MaWdodFByb2JlczpudW1iZXIgPSAwO1xyXG5cclxuXHRwdWJsaWMgcG9pbnRMaWdodHNPZmZzZXQ6bnVtYmVyID0gMDtcclxuXHRcclxuXHRwdWJsaWMgZGlyZWN0aW9uYWxMaWdodHNPZmZzZXQ6bnVtYmVyPSAwO1xyXG5cdFxyXG5cdHB1YmxpYyBsaWdodFByb2Jlc09mZnNldDpudW1iZXIgPSAwO1xyXG5cdFxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICovXHJcblx0cHVibGljIGdldCBtb2RlKCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX21vZGU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IG1vZGUodmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9tb2RlID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcclxuXHRcdHRoaXMuX21vZGUgPSB2YWx1ZTtcclxuXHJcblx0XHR0aGlzLl91cGRhdGVMaWdodHMoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBzaGFkb3cgY2FzdGluZyBsaWdodHMgbmVlZCB0byBiZSBpbmNsdWRlZC5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGluY2x1ZGVDYXN0ZXJzKCk6Ym9vbGVhblxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9pbmNsdWRlQ2FzdGVycztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgaW5jbHVkZUNhc3RlcnModmFsdWU6Ym9vbGVhbilcclxuXHR7XHJcblx0XHRpZiAodGhpcy5faW5jbHVkZUNhc3RlcnMgPT0gdmFsdWUpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9pbmNsdWRlQ2FzdGVycyA9IHZhbHVlO1xyXG5cclxuXHRcdHRoaXMuX3VwZGF0ZUxpZ2h0cygpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogXHJcblx0ICogQHJldHVybnMge0xpZ2h0UGlja2VyQmFzZX1cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGxpZ2h0UGlja2VyKCk6TGlnaHRQaWNrZXJCYXNlXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2xpZ2h0UGlja2VyO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBsaWdodFBpY2tlcih2YWx1ZTpMaWdodFBpY2tlckJhc2UpXHJcblx0e1xyXG5cdFx0Ly9pZiAodGhpcy5fbGlnaHRQaWNrZXIgPT0gdmFsdWUpXHJcblx0XHQvL1x0cmV0dXJuO1xyXG5cclxuXHRcdGlmICh0aGlzLl9saWdodFBpY2tlcilcclxuXHRcdFx0dGhpcy5fbGlnaHRQaWNrZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5DSEFOR0UsIHRoaXMuX29uTGlnaHRzQ2hhbmdlRGVsZWdhdGUpO1xyXG5cclxuXHRcdHRoaXMuX2xpZ2h0UGlja2VyID0gdmFsdWU7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2xpZ2h0UGlja2VyKVxyXG5cdFx0XHR0aGlzLl9saWdodFBpY2tlci5hZGRFdmVudExpc3RlbmVyKEV2ZW50LkNIQU5HRSwgdGhpcy5fb25MaWdodHNDaGFuZ2VEZWxlZ2F0ZSk7XHJcblxyXG5cdFx0dGhpcy5fdXBkYXRlTGlnaHRzKCk7XHJcblx0fVxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIFdoZXRoZXIgb3Igbm90IHRvIHVzZSBmYWxsT2ZmIGFuZCByYWRpdXMgcHJvcGVydGllcyBmb3IgbGlnaHRzLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGltcHJvdmUgcGVyZm9ybWFuY2UgYW5kXHJcblx0ICogY29tcGF0aWJpbGl0eSBmb3IgY29uc3RyYWluZWQgbW9kZS5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGVuYWJsZUxpZ2h0RmFsbE9mZigpOmJvb2xlYW5cclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fbWF0ZXJpYWwuZW5hYmxlTGlnaHRGYWxsT2ZmO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRGVmaW5lIHdoaWNoIGxpZ2h0IHNvdXJjZSB0eXBlcyB0byB1c2UgZm9yIGRpZmZ1c2UgcmVmbGVjdGlvbnMuIFRoaXMgYWxsb3dzIGNob29zaW5nIGJldHdlZW4gcmVndWxhciBsaWdodHNcclxuXHQgKiBhbmQvb3IgbGlnaHQgcHJvYmVzIGZvciBkaWZmdXNlIHJlZmxlY3Rpb25zLlxyXG5cdCAqXHJcblx0ICogQHNlZSBhd2F5M2QubWF0ZXJpYWxzLkxpZ2h0U291cmNlc1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgZGlmZnVzZUxpZ2h0U291cmNlcygpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9tYXRlcmlhbC5kaWZmdXNlTGlnaHRTb3VyY2VzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRGVmaW5lIHdoaWNoIGxpZ2h0IHNvdXJjZSB0eXBlcyB0byB1c2UgZm9yIHNwZWN1bGFyIHJlZmxlY3Rpb25zLiBUaGlzIGFsbG93cyBjaG9vc2luZyBiZXR3ZWVuIHJlZ3VsYXIgbGlnaHRzXHJcblx0ICogYW5kL29yIGxpZ2h0IHByb2JlcyBmb3Igc3BlY3VsYXIgcmVmbGVjdGlvbnMuXHJcblx0ICpcclxuXHQgKiBAc2VlIGF3YXkzZC5tYXRlcmlhbHMuTGlnaHRTb3VyY2VzXHJcblx0ICovXHJcblx0cHVibGljIGdldCBzcGVjdWxhckxpZ2h0U291cmNlcygpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9tYXRlcmlhbC5zcGVjdWxhckxpZ2h0U291cmNlcztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgYSBuZXcgQ29tcGlsZWRQYXNzIG9iamVjdC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBtYXRlcmlhbCBUaGUgbWF0ZXJpYWwgdG8gd2hpY2ggdGhpcyBwYXNzIGJlbG9uZ3MuXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IobW9kZTpudW1iZXIsIHJlbmRlck9iamVjdDpSZW5kZXJNZXRob2RNYXRlcmlhbE9iamVjdCwgcmVuZGVyT2JqZWN0T3duZXI6TWF0ZXJpYWxCYXNlLCByZW5kZXJhYmxlQ2xhc3M6SVJlbmRlcmFibGVDbGFzcywgc3RhZ2U6U3RhZ2UpXHJcblx0e1xyXG5cdFx0c3VwZXIocmVuZGVyT2JqZWN0LCByZW5kZXJPYmplY3RPd25lciwgcmVuZGVyYWJsZUNsYXNzLCBzdGFnZSk7XHJcblxyXG5cdFx0dGhpcy5fbW9kZSA9IG1vZGU7XHJcblxyXG5cdFx0dGhpcy5fbWF0ZXJpYWwgPSByZW5kZXJPYmplY3RPd25lcjtcclxuXHJcblx0XHR0aGlzLl9vbkxpZ2h0c0NoYW5nZURlbGVnYXRlID0gKGV2ZW50OkV2ZW50KSA9PiB0aGlzLm9uTGlnaHRzQ2hhbmdlKGV2ZW50KTtcclxuXHRcdFxyXG5cdFx0dGhpcy5fb25NZXRob2RJbnZhbGlkYXRlZERlbGVnYXRlID0gKGV2ZW50OlNoYWRpbmdNZXRob2RFdmVudCkgPT4gdGhpcy5vbk1ldGhvZEludmFsaWRhdGVkKGV2ZW50KTtcclxuXHJcblx0XHR0aGlzLmxpZ2h0UGlja2VyID0gcmVuZGVyT2JqZWN0T3duZXIubGlnaHRQaWNrZXI7XHJcblxyXG5cdFx0aWYgKHRoaXMuX3NoYWRlciA9PSBudWxsKVxyXG5cdFx0XHR0aGlzLl91cGRhdGVTaGFkZXIoKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3VwZGF0ZVNoYWRlcigpXHJcblx0e1xyXG5cdFx0aWYgKCh0aGlzLm51bURpcmVjdGlvbmFsTGlnaHRzIHx8IHRoaXMubnVtUG9pbnRMaWdodHMgfHwgdGhpcy5udW1MaWdodFByb2JlcykgJiYgISh0aGlzLl9zaGFkZXIgaW5zdGFuY2VvZiBTaGFkZXJMaWdodGluZ09iamVjdCkpIHtcclxuXHRcdFx0aWYgKHRoaXMuX3NoYWRlciAhPSBudWxsKVxyXG5cdFx0XHRcdHRoaXMuX3NoYWRlci5kaXNwb3NlKCk7XHJcblxyXG5cdFx0XHR0aGlzLl9zaGFkZXIgPSBuZXcgU2hhZGVyTGlnaHRpbmdPYmplY3QodGhpcy5fcmVuZGVyYWJsZUNsYXNzLCB0aGlzLCB0aGlzLl9zdGFnZSk7XHJcblx0XHR9IGVsc2UgaWYgKCEodGhpcy5fc2hhZGVyIGluc3RhbmNlb2YgU2hhZGVyT2JqZWN0QmFzZSkpIHtcclxuXHRcdFx0aWYgKHRoaXMuX3NoYWRlciAhPSBudWxsKVxyXG5cdFx0XHRcdHRoaXMuX3NoYWRlci5kaXNwb3NlKCk7XHJcblxyXG5cdFx0XHR0aGlzLl9zaGFkZXIgPSBuZXcgU2hhZGVyT2JqZWN0QmFzZSh0aGlzLl9yZW5kZXJhYmxlQ2xhc3MsIHRoaXMsIHRoaXMuX3N0YWdlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluaXRpYWxpemVzIHRoZSB1bmNoYW5naW5nIGNvbnN0YW50IGRhdGEgZm9yIHRoaXMgbWF0ZXJpYWwuXHJcblx0ICovXHJcblx0cHVibGljIF9pSW5pdENvbnN0YW50RGF0YShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSlcclxuXHR7XHJcblx0XHRzdXBlci5faUluaXRDb25zdGFudERhdGEoc2hhZGVyT2JqZWN0KTtcclxuXHJcblx0XHQvL1VwZGF0ZXMgbWV0aG9kIGNvbnN0YW50cyBpZiB0aGV5IGhhdmUgY2hhbmdlZC5cclxuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47ICsraSlcclxuXHRcdFx0dGhpcy5faU1ldGhvZFZPc1tpXS5tZXRob2QuaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0LCB0aGlzLl9pTWV0aG9kVk9zW2ldKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBDb2xvclRyYW5zZm9ybSBvYmplY3QgdG8gdHJhbnNmb3JtIHRoZSBjb2xvdXIgb2YgdGhlIG1hdGVyaWFsIHdpdGguIERlZmF1bHRzIHRvIG51bGwuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBjb2xvclRyYW5zZm9ybSgpOkNvbG9yVHJhbnNmb3JtXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuY29sb3JUcmFuc2Zvcm1NZXRob2Q/IHRoaXMuY29sb3JUcmFuc2Zvcm1NZXRob2QuY29sb3JUcmFuc2Zvcm0gOiBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBjb2xvclRyYW5zZm9ybSh2YWx1ZTpDb2xvclRyYW5zZm9ybSlcclxuXHR7XHJcblx0XHRpZiAodmFsdWUpIHtcclxuXHRcdFx0aWYgKHRoaXMuY29sb3JUcmFuc2Zvcm1NZXRob2QgPT0gbnVsbClcclxuXHRcdFx0XHR0aGlzLmNvbG9yVHJhbnNmb3JtTWV0aG9kID0gbmV3IEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kKCk7XHJcblxyXG5cdFx0XHR0aGlzLmNvbG9yVHJhbnNmb3JtTWV0aG9kLmNvbG9yVHJhbnNmb3JtID0gdmFsdWU7XHJcblxyXG5cdFx0fSBlbHNlIGlmICghdmFsdWUpIHtcclxuXHRcdFx0aWYgKHRoaXMuY29sb3JUcmFuc2Zvcm1NZXRob2QpXHJcblx0XHRcdFx0dGhpcy5jb2xvclRyYW5zZm9ybU1ldGhvZCA9IG51bGw7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2Qgb2JqZWN0IHRvIHRyYW5zZm9ybSB0aGUgY29sb3VyIG9mIHRoZSBtYXRlcmlhbCB3aXRoLiBEZWZhdWx0cyB0byBudWxsLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgY29sb3JUcmFuc2Zvcm1NZXRob2QoKTpFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZFxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTz8gPEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kPiB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTy5tZXRob2QgOiBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBjb2xvclRyYW5zZm9ybU1ldGhvZCh2YWx1ZTpFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZClcclxuXHR7XHJcblx0XHRpZiAodGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8gJiYgdGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8ubWV0aG9kID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0aWYgKHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPKSB7XHJcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8pO1xyXG5cdFx0XHR0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTyA9IG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHZhbHVlKSB7XHJcblx0XHRcdHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPID0gbmV3IE1ldGhvZFZPKHZhbHVlKTtcclxuXHRcdFx0dGhpcy5fYWRkRGVwZW5kZW5jeSh0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9yZW1vdmVEZXBlbmRlbmN5KG1ldGhvZFZPOk1ldGhvZFZPLCBlZmZlY3RzRGVwZW5kZW5jeTpib29sZWFuID0gZmFsc2UpXHJcblx0e1xyXG5cdFx0dmFyIGluZGV4Om51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MuaW5kZXhPZihtZXRob2RWTyk7XHJcblxyXG5cdFx0aWYgKCFlZmZlY3RzRGVwZW5kZW5jeSlcclxuXHRcdFx0dGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzLS07XHJcblxyXG5cdFx0bWV0aG9kVk8ubWV0aG9kLnJlbW92ZUV2ZW50TGlzdGVuZXIoU2hhZGluZ01ldGhvZEV2ZW50LlNIQURFUl9JTlZBTElEQVRFRCwgdGhpcy5fb25NZXRob2RJbnZhbGlkYXRlZERlbGVnYXRlKTtcclxuXHRcdHRoaXMuX2lNZXRob2RWT3Muc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcblx0XHR0aGlzLmludmFsaWRhdGVQYXNzKCk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9hZGREZXBlbmRlbmN5KG1ldGhvZFZPOk1ldGhvZFZPLCBlZmZlY3RzRGVwZW5kZW5jeTpib29sZWFuID0gZmFsc2UsIGluZGV4Om51bWJlciA9IC0xKVxyXG5cdHtcclxuXHRcdG1ldGhvZFZPLm1ldGhvZC5hZGRFdmVudExpc3RlbmVyKFNoYWRpbmdNZXRob2RFdmVudC5TSEFERVJfSU5WQUxJREFURUQsIHRoaXMuX29uTWV0aG9kSW52YWxpZGF0ZWREZWxlZ2F0ZSk7XHJcblxyXG5cdFx0aWYgKGVmZmVjdHNEZXBlbmRlbmN5KSB7XHJcblx0XHRcdGlmIChpbmRleCAhPSAtMSlcclxuXHRcdFx0XHR0aGlzLl9pTWV0aG9kVk9zLnNwbGljZShpbmRleCArIHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoIC0gdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzLCAwLCBtZXRob2RWTyk7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aGlzLl9pTWV0aG9kVk9zLnB1c2gobWV0aG9kVk8pO1xyXG5cdFx0XHR0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXMrKztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2lNZXRob2RWT3Muc3BsaWNlKHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoIC0gdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzLCAwLCBtZXRob2RWTyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5pbnZhbGlkYXRlUGFzcygpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQXBwZW5kcyBhbiBcImVmZmVjdFwiIHNoYWRpbmcgbWV0aG9kIHRvIHRoZSBzaGFkZXIuIEVmZmVjdCBtZXRob2RzIGFyZSB0aG9zZSB0aGF0IGRvIG5vdCBpbmZsdWVuY2UgdGhlIGxpZ2h0aW5nXHJcblx0ICogYnV0IG1vZHVsYXRlIHRoZSBzaGFkZWQgY29sb3VyLCB1c2VkIGZvciBmb2csIG91dGxpbmVzLCBldGMuIFRoZSBtZXRob2Qgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSByZXN1bHQgb2YgdGhlXHJcblx0ICogbWV0aG9kcyBhZGRlZCBwcmlvci5cclxuXHQgKi9cclxuXHRwdWJsaWMgYWRkRWZmZWN0TWV0aG9kKG1ldGhvZDpFZmZlY3RNZXRob2RCYXNlKVxyXG5cdHtcclxuXHRcdHRoaXMuX2FkZERlcGVuZGVuY3kobmV3IE1ldGhvZFZPKG1ldGhvZCksIHRydWUpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIG51bWJlciBvZiBcImVmZmVjdFwiIG1ldGhvZHMgYWRkZWQgdG8gdGhlIG1hdGVyaWFsLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgbnVtRWZmZWN0TWV0aG9kcygpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXM7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBRdWVyaWVzIHdoZXRoZXIgYSBnaXZlbiBlZmZlY3RzIG1ldGhvZCB3YXMgYWRkZWQgdG8gdGhlIG1hdGVyaWFsLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIGJlIHF1ZXJpZWQuXHJcblx0ICogQHJldHVybiB0cnVlIGlmIHRoZSBtZXRob2Qgd2FzIGFkZGVkIHRvIHRoZSBtYXRlcmlhbCwgZmFsc2Ugb3RoZXJ3aXNlLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBoYXNFZmZlY3RNZXRob2QobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UpOmJvb2xlYW5cclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXREZXBlbmRlbmN5Rm9yTWV0aG9kKG1ldGhvZCkgIT0gbnVsbDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHVybnMgdGhlIG1ldGhvZCBhZGRlZCBhdCB0aGUgZ2l2ZW4gaW5kZXguXHJcblx0ICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCBvZiB0aGUgbWV0aG9kIHRvIHJldHJpZXZlLlxyXG5cdCAqIEByZXR1cm4gVGhlIG1ldGhvZCBhdCB0aGUgZ2l2ZW4gaW5kZXguXHJcblx0ICovXHJcblx0cHVibGljIGdldEVmZmVjdE1ldGhvZEF0KGluZGV4Om51bWJlcik6RWZmZWN0TWV0aG9kQmFzZVxyXG5cdHtcclxuXHRcdGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXMgLSAxKVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHJcblx0XHRyZXR1cm4gPEVmZmVjdE1ldGhvZEJhc2U+IHRoaXMuX2lNZXRob2RWT3NbaW5kZXggKyB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aCAtIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llc10ubWV0aG9kO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQWRkcyBhbiBlZmZlY3QgbWV0aG9kIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXggYW1vbmdzdCB0aGUgbWV0aG9kcyBhbHJlYWR5IGFkZGVkIHRvIHRoZSBtYXRlcmlhbC4gRWZmZWN0XHJcblx0ICogbWV0aG9kcyBhcmUgdGhvc2UgdGhhdCBkbyBub3QgaW5mbHVlbmNlIHRoZSBsaWdodGluZyBidXQgbW9kdWxhdGUgdGhlIHNoYWRlZCBjb2xvdXIsIHVzZWQgZm9yIGZvZywgb3V0bGluZXMsXHJcblx0ICogZXRjLiBUaGUgbWV0aG9kIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcmVzdWx0IG9mIHRoZSBtZXRob2RzIHdpdGggYSBsb3dlciBpbmRleC5cclxuXHQgKi9cclxuXHRwdWJsaWMgYWRkRWZmZWN0TWV0aG9kQXQobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UsIGluZGV4Om51bWJlcilcclxuXHR7XHJcblx0XHR0aGlzLl9hZGREZXBlbmRlbmN5KG5ldyBNZXRob2RWTyhtZXRob2QpLCB0cnVlLCBpbmRleCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZW1vdmVzIGFuIGVmZmVjdCBtZXRob2QgZnJvbSB0aGUgbWF0ZXJpYWwuXHJcblx0ICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIGJlIHJlbW92ZWQuXHJcblx0ICovXHJcblx0cHVibGljIHJlbW92ZUVmZmVjdE1ldGhvZChtZXRob2Q6RWZmZWN0TWV0aG9kQmFzZSlcclxuXHR7XHJcblx0XHR2YXIgbWV0aG9kVk86TWV0aG9kVk8gPSB0aGlzLmdldERlcGVuZGVuY3lGb3JNZXRob2QobWV0aG9kKTtcclxuXHJcblx0XHRpZiAobWV0aG9kVk8gIT0gbnVsbClcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRGVwZW5kZW5jeShtZXRob2RWTywgdHJ1ZSk7XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogcmVtb3ZlIGFuIGVmZmVjdCBtZXRob2QgYXQgdGhlIHNwZWNpZmllZCBpbmRleCBmcm9tIHRoZSBtYXRlcmlhbC5cclxuXHQgKi9cclxuXHRwdWJsaWMgcmVtb3ZlRWZmZWN0TWV0aG9kQXQoaW5kZXg6bnVtYmVyKVxyXG5cdHtcclxuXHRcdGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXMgLSAxKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpbmRleCArIHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoIC0gdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzXTtcclxuXHJcblx0XHRpZiAobWV0aG9kVk8gIT0gbnVsbClcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRGVwZW5kZW5jeShtZXRob2RWTywgdHJ1ZSk7XHJcblx0fVxyXG5cclxuXHJcblx0cHJpdmF0ZSBnZXREZXBlbmRlbmN5Rm9yTWV0aG9kKG1ldGhvZDpFZmZlY3RNZXRob2RCYXNlKTpNZXRob2RWT1xyXG5cdHtcclxuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47ICsraSlcclxuXHRcdFx0aWYgKHRoaXMuX2lNZXRob2RWT3NbaV0ubWV0aG9kID09IG1ldGhvZClcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5faU1ldGhvZFZPc1tpXTtcclxuXHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBtZXRob2QgdXNlZCB0byBnZW5lcmF0ZSB0aGUgcGVyLXBpeGVsIG5vcm1hbHMuIERlZmF1bHRzIHRvIE5vcm1hbEJhc2ljTWV0aG9kLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgbm9ybWFsTWV0aG9kKCk6Tm9ybWFsQmFzaWNNZXRob2RcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5faU5vcm1hbE1ldGhvZFZPPyA8Tm9ybWFsQmFzaWNNZXRob2Q+IHRoaXMuX2lOb3JtYWxNZXRob2RWTy5tZXRob2QgOiBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBub3JtYWxNZXRob2QodmFsdWU6Tm9ybWFsQmFzaWNNZXRob2QpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuX2lOb3JtYWxNZXRob2RWTyAmJiB0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubWV0aG9kID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0aWYgKHRoaXMuX2lOb3JtYWxNZXRob2RWTykge1xyXG5cdFx0XHR0aGlzLl9yZW1vdmVEZXBlbmRlbmN5KHRoaXMuX2lOb3JtYWxNZXRob2RWTyk7XHJcblx0XHRcdHRoaXMuX2lOb3JtYWxNZXRob2RWTyA9IG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHZhbHVlKSB7XHJcblx0XHRcdHRoaXMuX2lOb3JtYWxNZXRob2RWTyA9IG5ldyBNZXRob2RWTyh2YWx1ZSk7XHJcblx0XHRcdHRoaXMuX2FkZERlcGVuZGVuY3kodGhpcy5faU5vcm1hbE1ldGhvZFZPKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBtZXRob2QgdGhhdCBwcm92aWRlcyB0aGUgYW1iaWVudCBsaWdodGluZyBjb250cmlidXRpb24uIERlZmF1bHRzIHRvIEFtYmllbnRCYXNpY01ldGhvZC5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGFtYmllbnRNZXRob2QoKTpBbWJpZW50QmFzaWNNZXRob2RcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5faUFtYmllbnRNZXRob2RWTz8gPEFtYmllbnRCYXNpY01ldGhvZD4gdGhpcy5faUFtYmllbnRNZXRob2RWTy5tZXRob2QgOiBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBhbWJpZW50TWV0aG9kKHZhbHVlOkFtYmllbnRCYXNpY01ldGhvZClcclxuXHR7XHJcblx0XHRpZiAodGhpcy5faUFtYmllbnRNZXRob2RWTyAmJiB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLm1ldGhvZCA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmICh0aGlzLl9pQW1iaWVudE1ldGhvZFZPKSB7XHJcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faUFtYmllbnRNZXRob2RWTyk7XHJcblx0XHRcdHRoaXMuX2lBbWJpZW50TWV0aG9kVk8gPSBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh2YWx1ZSkge1xyXG5cdFx0XHR0aGlzLl9pQW1iaWVudE1ldGhvZFZPID0gbmV3IE1ldGhvZFZPKHZhbHVlKTtcclxuXHRcdFx0dGhpcy5fYWRkRGVwZW5kZW5jeSh0aGlzLl9pQW1iaWVudE1ldGhvZFZPKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBtZXRob2QgdXNlZCB0byByZW5kZXIgc2hhZG93cyBjYXN0IG9uIHRoaXMgc3VyZmFjZSwgb3IgbnVsbCBpZiBubyBzaGFkb3dzIGFyZSB0byBiZSByZW5kZXJlZC4gRGVmYXVsdHMgdG8gbnVsbC5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IHNoYWRvd01ldGhvZCgpOlNoYWRvd01hcE1ldGhvZEJhc2VcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5faVNoYWRvd01ldGhvZFZPPyA8U2hhZG93TWFwTWV0aG9kQmFzZT4gdGhpcy5faVNoYWRvd01ldGhvZFZPLm1ldGhvZCA6IG51bGw7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHNoYWRvd01ldGhvZCh2YWx1ZTpTaGFkb3dNYXBNZXRob2RCYXNlKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9pU2hhZG93TWV0aG9kVk8gJiYgdGhpcy5faVNoYWRvd01ldGhvZFZPLm1ldGhvZCA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmICh0aGlzLl9pU2hhZG93TWV0aG9kVk8pIHtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRGVwZW5kZW5jeSh0aGlzLl9pU2hhZG93TWV0aG9kVk8pO1xyXG5cdFx0XHR0aGlzLl9pU2hhZG93TWV0aG9kVk8gPSBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh2YWx1ZSkge1xyXG5cdFx0XHR0aGlzLl9pU2hhZG93TWV0aG9kVk8gPSBuZXcgTWV0aG9kVk8odmFsdWUpO1xyXG5cdFx0XHR0aGlzLl9hZGREZXBlbmRlbmN5KHRoaXMuX2lTaGFkb3dNZXRob2RWTyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgbWV0aG9kIHRoYXQgcHJvdmlkZXMgdGhlIGRpZmZ1c2UgbGlnaHRpbmcgY29udHJpYnV0aW9uLiBEZWZhdWx0cyB0byBEaWZmdXNlQmFzaWNNZXRob2QuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBkaWZmdXNlTWV0aG9kKCk6RGlmZnVzZUJhc2ljTWV0aG9kXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8/IDxEaWZmdXNlQmFzaWNNZXRob2Q+IHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kIDogbnVsbDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgZGlmZnVzZU1ldGhvZCh2YWx1ZTpEaWZmdXNlQmFzaWNNZXRob2QpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8gJiYgdGhpcy5faURpZmZ1c2VNZXRob2RWTy5tZXRob2QgPT0gdmFsdWUpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHRpZiAodGhpcy5faURpZmZ1c2VNZXRob2RWTykge1xyXG5cdFx0XHR0aGlzLl9yZW1vdmVEZXBlbmRlbmN5KHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8pO1xyXG5cdFx0XHR0aGlzLl9pRGlmZnVzZU1ldGhvZFZPID0gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodmFsdWUpIHtcclxuXHRcdFx0dGhpcy5faURpZmZ1c2VNZXRob2RWTyA9IG5ldyBNZXRob2RWTyh2YWx1ZSk7XHJcblx0XHRcdHRoaXMuX2FkZERlcGVuZGVuY3kodGhpcy5faURpZmZ1c2VNZXRob2RWTyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgbWV0aG9kIHRoYXQgcHJvdmlkZXMgdGhlIHNwZWN1bGFyIGxpZ2h0aW5nIGNvbnRyaWJ1dGlvbi4gRGVmYXVsdHMgdG8gU3BlY3VsYXJCYXNpY01ldGhvZC5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IHNwZWN1bGFyTWV0aG9kKCk6U3BlY3VsYXJCYXNpY01ldGhvZFxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTz8gPFNwZWN1bGFyQmFzaWNNZXRob2Q+IHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm1ldGhvZCA6IG51bGw7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHNwZWN1bGFyTWV0aG9kKHZhbHVlOlNwZWN1bGFyQmFzaWNNZXRob2QpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPICYmIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm1ldGhvZCA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmICh0aGlzLl9pU3BlY3VsYXJNZXRob2RWTykge1xyXG5cdFx0XHR0aGlzLl9yZW1vdmVEZXBlbmRlbmN5KHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPKTtcclxuXHRcdFx0dGhpcy5faVNwZWN1bGFyTWV0aG9kVk8gPSBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh2YWx1ZSkge1xyXG5cdFx0XHR0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyA9IG5ldyBNZXRob2RWTyh2YWx1ZSk7XHJcblx0XHRcdHRoaXMuX2FkZERlcGVuZGVuY3kodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgZGlzcG9zZSgpXHJcblx0e1xyXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9saWdodFBpY2tlcilcclxuXHRcdFx0dGhpcy5fbGlnaHRQaWNrZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5DSEFOR0UsIHRoaXMuX29uTGlnaHRzQ2hhbmdlRGVsZWdhdGUpO1xyXG5cdFx0XHJcblx0XHR3aGlsZSAodGhpcy5faU1ldGhvZFZPcy5sZW5ndGgpXHJcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faU1ldGhvZFZPc1swXSk7XHJcblxyXG5cdFx0dGhpcy5faU1ldGhvZFZPcyA9IG51bGw7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDYWxsZWQgd2hlbiBhbnkgbWV0aG9kJ3Mgc2hhZGVyIGNvZGUgaXMgaW52YWxpZGF0ZWQuXHJcblx0ICovXHJcblx0cHJpdmF0ZSBvbk1ldGhvZEludmFsaWRhdGVkKGV2ZW50OlNoYWRpbmdNZXRob2RFdmVudClcclxuXHR7XHJcblx0XHR0aGlzLmludmFsaWRhdGVQYXNzKCk7XHJcblx0fVxyXG5cclxuXHQvLyBSRU5ERVIgTE9PUFxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBfaUFjdGl2YXRlKGNhbWVyYTpDYW1lcmEpXHJcblx0e1xyXG5cdFx0c3VwZXIuX2lBY3RpdmF0ZShjYW1lcmEpO1xyXG5cclxuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTztcclxuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47ICsraSkge1xyXG5cdFx0XHRtZXRob2RWTyA9IHRoaXMuX2lNZXRob2RWT3NbaV07XHJcblx0XHRcdGlmIChtZXRob2RWTy51c2VNZXRob2QpXHJcblx0XHRcdFx0bWV0aG9kVk8ubWV0aG9kLmlBY3RpdmF0ZSh0aGlzLl9zaGFkZXIsIG1ldGhvZFZPLCB0aGlzLl9zdGFnZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHJlbmRlcmFibGVcclxuXHQgKiBAcGFyYW0gc3RhZ2VcclxuXHQgKiBAcGFyYW0gY2FtZXJhXHJcblx0ICovXHJcblx0cHVibGljIF9pUmVuZGVyKHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIGNhbWVyYTpDYW1lcmEsIHZpZXdQcm9qZWN0aW9uOk1hdHJpeDNEKVxyXG5cdHtcclxuXHRcdHN1cGVyLl9pUmVuZGVyKHJlbmRlcmFibGUsIGNhbWVyYSwgdmlld1Byb2plY3Rpb24pO1xyXG5cclxuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTztcclxuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47ICsraSkge1xyXG5cdFx0XHRtZXRob2RWTyA9IHRoaXMuX2lNZXRob2RWT3NbaV07XHJcblx0XHRcdGlmIChtZXRob2RWTy51c2VNZXRob2QpXHJcblx0XHRcdFx0bWV0aG9kVk8ubWV0aG9kLmlTZXRSZW5kZXJTdGF0ZSh0aGlzLl9zaGFkZXIsIG1ldGhvZFZPLCByZW5kZXJhYmxlLCB0aGlzLl9zdGFnZSwgY2FtZXJhKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIF9pRGVhY3RpdmF0ZSgpXHJcblx0e1xyXG5cdFx0c3VwZXIuX2lEZWFjdGl2YXRlKCk7XHJcblxyXG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPO1xyXG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aDtcclxuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKSB7XHJcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcclxuXHRcdFx0aWYgKG1ldGhvZFZPLnVzZU1ldGhvZClcclxuXHRcdFx0XHRtZXRob2RWTy5tZXRob2QuaURlYWN0aXZhdGUodGhpcy5fc2hhZGVyLCBtZXRob2RWTywgdGhpcy5fc3RhZ2UpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIF9pSW5jbHVkZURlcGVuZGVuY2llcyhzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QpXHJcblx0e1xyXG5cdFx0c3VwZXIuX2lJbmNsdWRlRGVwZW5kZW5jaWVzKHNoYWRlck9iamVjdCk7XHJcblxyXG5cdFx0Ly9UT0RPOiBmcmFnbWVudCBhbmltdGlvbiBzaG91bGQgYmUgY29tcGF0aWJsZSB3aXRoIGxpZ2h0aW5nIHBhc3NcclxuXHRcdHNoYWRlck9iamVjdC51c2VzRnJhZ21lbnRBbmltYXRpb24gPSBCb29sZWFuKHRoaXMuX21vZGUgPT0gTWV0aG9kUGFzc01vZGUuU1VQRVJfU0hBREVSKTtcclxuXHJcblx0XHRpZiAoIXNoYWRlck9iamVjdC51c2VzVGFuZ2VudFNwYWNlICYmIHRoaXMubnVtUG9pbnRMaWdodHMgPiAwICYmIHNoYWRlck9iamVjdC51c2VzTGlnaHRzKSB7XHJcblx0XHRcdHNoYWRlck9iamVjdC5nbG9iYWxQb3NEZXBlbmRlbmNpZXMrKztcclxuXHJcblx0XHRcdGlmIChCb29sZWFuKHRoaXMuX21vZGUgJiBNZXRob2RQYXNzTW9kZS5FRkZFQ1RTKSlcclxuXHRcdFx0XHRzaGFkZXJPYmplY3QudXNlc0dsb2JhbFBvc0ZyYWdtZW50ID0gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaTpudW1iZXI7XHJcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgKytpKVxyXG5cdFx0XHR0aGlzLnNldHVwQW5kQ291bnREZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0LCB0aGlzLl9pTWV0aG9kVk9zW2ldKTtcclxuXHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpXHJcblx0XHRcdHRoaXMuX2lNZXRob2RWT3NbaV0udXNlTWV0aG9kID0gdGhpcy5faU1ldGhvZFZPc1tpXS5tZXRob2QuaUlzVXNlZChzaGFkZXJPYmplY3QpO1xyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIENvdW50cyB0aGUgZGVwZW5kZW5jaWVzIGZvciBhIGdpdmVuIG1ldGhvZC5cclxuXHQgKiBAcGFyYW0gbWV0aG9kIFRoZSBtZXRob2QgdG8gY291bnQgdGhlIGRlcGVuZGVuY2llcyBmb3IuXHJcblx0ICogQHBhcmFtIG1ldGhvZFZPIFRoZSBtZXRob2QncyBkYXRhIGZvciB0aGlzIG1hdGVyaWFsLlxyXG5cdCAqL1xyXG5cdHByaXZhdGUgc2V0dXBBbmRDb3VudERlcGVuZGVuY2llcyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXHJcblx0e1xyXG5cdFx0bWV0aG9kVk8ucmVzZXQoKTtcclxuXHJcblx0XHRtZXRob2RWTy5tZXRob2QuaUluaXRWTyhzaGFkZXJPYmplY3QsIG1ldGhvZFZPKTtcclxuXHJcblx0XHRpZiAobWV0aG9kVk8ubmVlZHNQcm9qZWN0aW9uKVxyXG5cdFx0XHRzaGFkZXJPYmplY3QucHJvamVjdGlvbkRlcGVuZGVuY2llcysrO1xyXG5cclxuXHRcdGlmIChtZXRob2RWTy5uZWVkc0dsb2JhbFZlcnRleFBvcykge1xyXG5cclxuXHRcdFx0c2hhZGVyT2JqZWN0Lmdsb2JhbFBvc0RlcGVuZGVuY2llcysrO1xyXG5cclxuXHRcdFx0aWYgKG1ldGhvZFZPLm5lZWRzR2xvYmFsRnJhZ21lbnRQb3MpXHJcblx0XHRcdFx0c2hhZGVyT2JqZWN0LnVzZXNHbG9iYWxQb3NGcmFnbWVudCA9IHRydWU7XHJcblxyXG5cdFx0fSBlbHNlIGlmIChtZXRob2RWTy5uZWVkc0dsb2JhbEZyYWdtZW50UG9zKSB7XHJcblx0XHRcdHNoYWRlck9iamVjdC5nbG9iYWxQb3NEZXBlbmRlbmNpZXMrKztcclxuXHRcdFx0c2hhZGVyT2JqZWN0LnVzZXNHbG9iYWxQb3NGcmFnbWVudCA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG1ldGhvZFZPLm5lZWRzTm9ybWFscylcclxuXHRcdFx0c2hhZGVyT2JqZWN0Lm5vcm1hbERlcGVuZGVuY2llcysrO1xyXG5cclxuXHRcdGlmIChtZXRob2RWTy5uZWVkc1RhbmdlbnRzKVxyXG5cdFx0XHRzaGFkZXJPYmplY3QudGFuZ2VudERlcGVuZGVuY2llcysrO1xyXG5cclxuXHRcdGlmIChtZXRob2RWTy5uZWVkc1ZpZXcpXHJcblx0XHRcdHNoYWRlck9iamVjdC52aWV3RGlyRGVwZW5kZW5jaWVzKys7XHJcblxyXG5cdFx0aWYgKG1ldGhvZFZPLm5lZWRzVVYpXHJcblx0XHRcdHNoYWRlck9iamVjdC51dkRlcGVuZGVuY2llcysrO1xyXG5cclxuXHRcdGlmIChtZXRob2RWTy5uZWVkc1NlY29uZGFyeVVWKVxyXG5cdFx0XHRzaGFkZXJPYmplY3Quc2Vjb25kYXJ5VVZEZXBlbmRlbmNpZXMrKztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfaUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcclxuXHR7XHJcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xyXG5cclxuXHRcdGlmICh0aGlzLl9pQW1iaWVudE1ldGhvZFZPICYmIHRoaXMuX2lBbWJpZW50TWV0aG9kVk8udXNlTWV0aG9kKVxyXG5cdFx0XHRjb2RlICs9IHRoaXMuX2lBbWJpZW50TWV0aG9kVk8ubWV0aG9kLmlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUFtYmllbnRNZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcclxuXHJcblx0XHRpZiAodGhpcy5faURpZmZ1c2VNZXRob2RWTyAmJiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLnVzZU1ldGhvZClcclxuXHRcdFx0Y29kZSArPSB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLm1ldGhvZC5pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPICYmIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLnVzZU1ldGhvZClcclxuXHRcdFx0Y29kZSArPSB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy5tZXRob2QuaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcclxuXHJcblx0XHRyZXR1cm4gY29kZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfaUdldFByZUxpZ2h0aW5nRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2lBbWJpZW50TWV0aG9kVk8gJiYgdGhpcy5faUFtYmllbnRNZXRob2RWTy51c2VNZXRob2QpIHtcclxuXHRcdFx0Y29kZSArPSB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLm1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUFtYmllbnRNZXRob2RWTywgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCwgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLl9pQW1iaWVudE1ldGhvZFZPLm5lZWRzTm9ybWFscylcclxuXHRcdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy5ub3JtYWxGcmFnbWVudCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5faUFtYmllbnRNZXRob2RWTy5uZWVkc1ZpZXcpXHJcblx0XHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMudmlld0RpckZyYWdtZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5faURpZmZ1c2VNZXRob2RWTyAmJiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLnVzZU1ldGhvZClcclxuXHRcdFx0Y29kZSArPSAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faURpZmZ1c2VNZXRob2RWTy5tZXRob2QpLmlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZSg8U2hhZGVyTGlnaHRpbmdPYmplY3Q+IHNoYWRlck9iamVjdCwgdGhpcy5faURpZmZ1c2VNZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcclxuXHJcblx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8gJiYgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8udXNlTWV0aG9kKVxyXG5cdFx0XHRjb2RlICs9ICg8TGlnaHRpbmdNZXRob2RCYXNlPiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy5tZXRob2QpLmlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZSg8U2hhZGVyTGlnaHRpbmdPYmplY3Q+IHNoYWRlck9iamVjdCwgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XHJcblxyXG5cdFx0cmV0dXJuIGNvZGU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX2lHZXRQZXJMaWdodERpZmZ1c2VGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBsaWdodERpclJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIGRpZmZ1c2VDb2xvclJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuICg8TGlnaHRpbmdNZXRob2RCYXNlPiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLm1ldGhvZCkuaUdldEZyYWdtZW50Q29kZVBlckxpZ2h0KHNoYWRlck9iamVjdCwgdGhpcy5faURpZmZ1c2VNZXRob2RWTywgbGlnaHREaXJSZWcsIGRpZmZ1c2VDb2xvclJlZywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfaUdldFBlckxpZ2h0U3BlY3VsYXJGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBsaWdodERpclJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHNwZWN1bGFyQ29sb3JSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRDb2RlUGVyTGlnaHQoc2hhZGVyT2JqZWN0LCB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTywgbGlnaHREaXJSZWcsIHNwZWN1bGFyQ29sb3JSZWcsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX2lHZXRQZXJQcm9iZURpZmZ1c2VGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCB0ZXhSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCB3ZWlnaHRSZWc6c3RyaW5nLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faURpZmZ1c2VNZXRob2RWTy5tZXRob2QpLmlHZXRGcmFnbWVudENvZGVQZXJQcm9iZShzaGFkZXJPYmplY3QsIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8sIHRleFJlZywgd2VpZ2h0UmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF9pR2V0UGVyUHJvYmVTcGVjdWxhckZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIHRleFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHdlaWdodFJlZzpzdHJpbmcsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuICg8TGlnaHRpbmdNZXRob2RCYXNlPiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy5tZXRob2QpLmlHZXRGcmFnbWVudENvZGVQZXJQcm9iZShzaGFkZXJPYmplY3QsIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLCB0ZXhSZWcsIHdlaWdodFJlZywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfaUdldFBvc3RMaWdodGluZ1ZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2lTaGFkb3dNZXRob2RWTylcclxuXHRcdFx0Y29kZSArPSB0aGlzLl9pU2hhZG93TWV0aG9kVk8ubWV0aG9kLmlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faVNoYWRvd01ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xyXG5cclxuXHRcdHJldHVybiBjb2RlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF9pR2V0UG9zdExpZ2h0aW5nRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcclxuXHR7XHJcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xyXG5cclxuXHRcdGlmIChzaGFkZXJPYmplY3QudXNlQWxwaGFQcmVtdWx0aXBsaWVkICYmIHRoaXMuX3BFbmFibGVCbGVuZGluZykge1xyXG5cdFx0XHRjb2RlICs9IFwiYWRkIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiLncsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiLncsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLmNvbW1vbnMgKyBcIi56XFxuXCIgK1xyXG5cdFx0XHRcImRpdiBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIi54eXosIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiLCBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIi53XFxuXCIgK1xyXG5cdFx0XHRcInN1YiBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIi53LCBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIi53LCBcIiArIHNoYXJlZFJlZ2lzdGVycy5jb21tb25zICsgXCIuelxcblwiICtcclxuXHRcdFx0XCJzYXQgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIueHl6LCBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIlxcblwiO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9pU2hhZG93TWV0aG9kVk8pXHJcblx0XHRcdGNvZGUgKz0gdGhpcy5faVNoYWRvd01ldGhvZFZPLm1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faVNoYWRvd01ldGhvZFZPLCBzaGFyZWRSZWdpc3RlcnMuc2hhZG93VGFyZ2V0LCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPICYmIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8udXNlTWV0aG9kKSB7XHJcblx0XHRcdGNvZGUgKz0gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRQb3N0TGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faURpZmZ1c2VNZXRob2RWTywgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCwgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcclxuXHJcblx0XHRcdC8vIHJlc29sdmUgb3RoZXIgZGVwZW5kZW5jaWVzIGFzIHdlbGw/XHJcblx0XHRcdGlmICh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLm5lZWRzTm9ybWFscylcclxuXHRcdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy5ub3JtYWxGcmFnbWVudCk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5faURpZmZ1c2VNZXRob2RWTy5uZWVkc1ZpZXcpXHJcblx0XHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMudmlld0RpckZyYWdtZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8gJiYgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8udXNlTWV0aG9kKSB7XHJcblx0XHRcdGNvZGUgKz0gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm1ldGhvZCkuaUdldEZyYWdtZW50UG9zdExpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLCBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0LCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xyXG5cdFx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubmVlZHNOb3JtYWxzKVxyXG5cdFx0XHRcdHJlZ2lzdGVyQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLm5vcm1hbEZyYWdtZW50KTtcclxuXHRcdFx0aWYgKHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm5lZWRzVmlldylcclxuXHRcdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy52aWV3RGlyRnJhZ21lbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9pU2hhZG93TWV0aG9kVk8pXHJcblx0XHRcdHJlZ2lzdGVyQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLnNoYWRvd1RhcmdldCk7XHJcblxyXG5cdFx0cmV0dXJuIGNvZGU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3Qgbm9ybWFscyBhcmUgYWxsb3dlZCBpbiB0YW5nZW50IHNwYWNlLiBUaGlzIGlzIG9ubHkgdGhlIGNhc2UgaWYgbm8gb2JqZWN0LXNwYWNlXHJcblx0ICogZGVwZW5kZW5jaWVzIGV4aXN0LlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBfcFVzZXNUYW5nZW50U3BhY2Uoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0KTpib29sZWFuXHJcblx0e1xyXG5cdFx0aWYgKHNoYWRlck9iamVjdC51c2VzUHJvYmVzKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPO1xyXG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aDtcclxuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKSB7XHJcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcclxuXHRcdFx0aWYgKG1ldGhvZFZPLnVzZU1ldGhvZCAmJiAhbWV0aG9kVk8ubWV0aG9kLmlVc2VzVGFuZ2VudFNwYWNlKCkpXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IG5vcm1hbHMgYXJlIG91dHB1dCBpbiB0YW5nZW50IHNwYWNlLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBfcE91dHB1dHNUYW5nZW50Tm9ybWFscyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6Ym9vbGVhblxyXG5cdHtcclxuXHRcdHJldHVybiAoPE5vcm1hbEJhc2ljTWV0aG9kPiB0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubWV0aG9kKS5pT3V0cHV0c1RhbmdlbnROb3JtYWxzKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3Qgbm9ybWFscyBhcmUgb3V0cHV0IGJ5IHRoZSBwYXNzLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBfcE91dHB1dHNOb3JtYWxzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpib29sZWFuXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lOb3JtYWxNZXRob2RWTyAmJiB0aGlzLl9pTm9ybWFsTWV0aG9kVk8udXNlTWV0aG9kO1xyXG5cdH1cclxuXHJcblxyXG5cdHB1YmxpYyBfaUdldE5vcm1hbFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lOb3JtYWxNZXRob2RWTy5tZXRob2QuaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pTm9ybWFsTWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX2lHZXROb3JtYWxGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gdGhpcy5faU5vcm1hbE1ldGhvZFZPLm1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faU5vcm1hbE1ldGhvZFZPLCBzaGFyZWRSZWdpc3RlcnMubm9ybWFsRnJhZ21lbnQsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2lOb3JtYWxNZXRob2RWTy5uZWVkc1ZpZXcpXHJcblx0XHRcdHJlZ2lzdGVyQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLnZpZXdEaXJGcmFnbWVudCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2lOb3JtYWxNZXRob2RWTy5uZWVkc0dsb2JhbEZyYWdtZW50UG9zIHx8IHRoaXMuX2lOb3JtYWxNZXRob2RWTy5uZWVkc0dsb2JhbFZlcnRleFBvcylcclxuXHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVWZXJ0ZXhUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLmdsb2JhbFBvc2l0aW9uVmVydGV4KTtcclxuXHJcblx0XHRyZXR1cm4gY29kZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIF9pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcclxuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTztcclxuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IGxlbiAtIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llczsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcclxuXHRcdFx0aWYgKG1ldGhvZFZPLnVzZU1ldGhvZCkge1xyXG5cdFx0XHRcdGNvZGUgKz0gbWV0aG9kVk8ubWV0aG9kLmlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHJlZ0NhY2hlLCBzaGFyZWRSZWcpO1xyXG5cclxuXHRcdFx0XHRpZiAobWV0aG9kVk8ubmVlZHNHbG9iYWxWZXJ0ZXhQb3MgfHwgbWV0aG9kVk8ubmVlZHNHbG9iYWxGcmFnbWVudFBvcylcclxuXHRcdFx0XHRcdHJlZ0NhY2hlLnJlbW92ZVZlcnRleFRlbXBVc2FnZShzaGFyZWRSZWcuZ2xvYmFsUG9zaXRpb25WZXJ0ZXgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPICYmIHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPLnVzZU1ldGhvZClcclxuXHRcdFx0Y29kZSArPSB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTy5tZXRob2QuaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTywgcmVnQ2FjaGUsIHNoYXJlZFJlZyk7XHJcblxyXG5cdFx0cmV0dXJuIGNvZGU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBfaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcclxuXHRcdHZhciBhbHBoYVJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQ7XHJcblxyXG5cdFx0aWYgKHRoaXMucHJlc2VydmVBbHBoYSAmJiB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXMgPiAwKSB7XHJcblx0XHRcdGFscGhhUmVnID0gcmVnQ2FjaGUuZ2V0RnJlZUZyYWdtZW50U2luZ2xlVGVtcCgpO1xyXG5cdFx0XHRyZWdDYWNoZS5hZGRGcmFnbWVudFRlbXBVc2FnZXMoYWxwaGFSZWcsIDEpO1xyXG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgYWxwaGFSZWcgKyBcIiwgXCIgKyBzaGFyZWRSZWcuc2hhZGVkVGFyZ2V0ICsgXCIud1xcblwiO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTztcclxuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IGxlbiAtIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llczsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcclxuXHRcdFx0aWYgKG1ldGhvZFZPLnVzZU1ldGhvZCkge1xyXG5cdFx0XHRcdGNvZGUgKz0gbWV0aG9kVk8ubWV0aG9kLmlHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgc2hhcmVkUmVnLnNoYWRlZFRhcmdldCwgcmVnQ2FjaGUsIHNoYXJlZFJlZyk7XHJcblxyXG5cdFx0XHRcdGlmIChtZXRob2RWTy5uZWVkc05vcm1hbHMpXHJcblx0XHRcdFx0XHRyZWdDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWcubm9ybWFsRnJhZ21lbnQpO1xyXG5cclxuXHRcdFx0XHRpZiAobWV0aG9kVk8ubmVlZHNWaWV3KVxyXG5cdFx0XHRcdFx0cmVnQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnLnZpZXdEaXJGcmFnbWVudCk7XHJcblxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMucHJlc2VydmVBbHBoYSAmJiB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXMgPiAwKSB7XHJcblx0XHRcdGNvZGUgKz0gXCJtb3YgXCIgKyBzaGFyZWRSZWcuc2hhZGVkVGFyZ2V0ICsgXCIudywgXCIgKyBhbHBoYVJlZyArIFwiXFxuXCI7XHJcblx0XHRcdHJlZ0NhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKGFscGhhUmVnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8gJiYgdGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8udXNlTWV0aG9kKVxyXG5cdFx0XHRjb2RlICs9IHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPLm1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8sIHNoYXJlZFJlZy5zaGFkZWRUYXJnZXQsIHJlZ0NhY2hlLCBzaGFyZWRSZWcpO1xyXG5cclxuXHRcdHJldHVybiBjb2RlO1xyXG5cdH1cclxuXHQvKipcclxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc2hhZGVyIHVzZXMgYW55IHNoYWRvd3MuXHJcblx0ICovXHJcblx0cHVibGljIF9pVXNlc1NoYWRvd3Moc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cclxuXHR7XHJcblx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLl9pU2hhZG93TWV0aG9kVk8gJiYgKHRoaXMuX2xpZ2h0UGlja2VyLmNhc3RpbmdEaXJlY3Rpb25hbExpZ2h0cy5sZW5ndGggPiAwIHx8IHRoaXMuX2xpZ2h0UGlja2VyLmNhc3RpbmdQb2ludExpZ2h0cy5sZW5ndGggPiAwKSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc2hhZGVyIHVzZXMgYW55IHNwZWN1bGFyIGNvbXBvbmVudC5cclxuXHQgKi9cclxuXHRwdWJsaWMgX2lVc2VzU3BlY3VsYXIoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cclxuXHR7XHJcblx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc2hhZGVyIHVzZXMgYW55IHNwZWN1bGFyIGNvbXBvbmVudC5cclxuXHQgKi9cclxuXHRwdWJsaWMgX2lVc2VzRGlmZnVzZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6Ym9vbGVhblxyXG5cdHtcclxuXHRcdHJldHVybiBCb29sZWFuKHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8pO1xyXG5cdH1cclxuXHJcblxyXG5cdHByaXZhdGUgb25MaWdodHNDaGFuZ2UoZXZlbnQ6RXZlbnQpXHJcblx0e1xyXG5cdFx0dGhpcy5fdXBkYXRlTGlnaHRzKCk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF91cGRhdGVMaWdodHMoKVxyXG5cdHtcclxuXHRcdHZhciBudW1EaXJlY3Rpb25hbExpZ2h0c09sZDpudW1iZXIgPSB0aGlzLm51bURpcmVjdGlvbmFsTGlnaHRzO1xyXG5cdFx0dmFyIG51bVBvaW50TGlnaHRzT2xkOm51bWJlciA9IHRoaXMubnVtUG9pbnRMaWdodHM7XHJcblx0XHR2YXIgbnVtTGlnaHRQcm9iZXNPbGQ6bnVtYmVyID0gdGhpcy5udW1MaWdodFByb2JlcztcclxuXHJcblx0XHRpZiAodGhpcy5fbGlnaHRQaWNrZXIgJiYgKHRoaXMuX21vZGUgJiBNZXRob2RQYXNzTW9kZS5MSUdIVElORykpIHtcclxuXHRcdFx0dGhpcy5udW1EaXJlY3Rpb25hbExpZ2h0cyA9IHRoaXMuY2FsY3VsYXRlTnVtRGlyZWN0aW9uYWxMaWdodHModGhpcy5fbGlnaHRQaWNrZXIubnVtRGlyZWN0aW9uYWxMaWdodHMpO1xyXG5cdFx0XHR0aGlzLm51bVBvaW50TGlnaHRzID0gdGhpcy5jYWxjdWxhdGVOdW1Qb2ludExpZ2h0cyh0aGlzLl9saWdodFBpY2tlci5udW1Qb2ludExpZ2h0cyk7XHJcblx0XHRcdHRoaXMubnVtTGlnaHRQcm9iZXMgPSB0aGlzLmNhbGN1bGF0ZU51bVByb2Jlcyh0aGlzLl9saWdodFBpY2tlci5udW1MaWdodFByb2Jlcyk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5faW5jbHVkZUNhc3RlcnMpIHtcclxuXHRcdFx0XHR0aGlzLm51bURpcmVjdGlvbmFsTGlnaHRzICs9IHRoaXMuX2xpZ2h0UGlja2VyLm51bUNhc3RpbmdEaXJlY3Rpb25hbExpZ2h0cztcclxuXHRcdFx0XHR0aGlzLm51bVBvaW50TGlnaHRzICs9IHRoaXMuX2xpZ2h0UGlja2VyLm51bUNhc3RpbmdQb2ludExpZ2h0cztcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMubnVtRGlyZWN0aW9uYWxMaWdodHMgPSAwO1xyXG5cdFx0XHR0aGlzLm51bVBvaW50TGlnaHRzID0gMDtcclxuXHRcdFx0dGhpcy5udW1MaWdodFByb2JlcyA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG51bURpcmVjdGlvbmFsTGlnaHRzT2xkICE9IHRoaXMubnVtRGlyZWN0aW9uYWxMaWdodHMgfHwgbnVtUG9pbnRMaWdodHNPbGQgIT0gdGhpcy5udW1Qb2ludExpZ2h0cyB8fCBudW1MaWdodFByb2Jlc09sZCAhPSB0aGlzLm51bUxpZ2h0UHJvYmVzKSB7XHJcblx0XHRcdHRoaXMuX3VwZGF0ZVNoYWRlcigpO1xyXG5cclxuXHRcdFx0dGhpcy5pbnZhbGlkYXRlUGFzcygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ2FsY3VsYXRlcyB0aGUgYW1vdW50IG9mIGRpcmVjdGlvbmFsIGxpZ2h0cyB0aGlzIG1hdGVyaWFsIHdpbGwgc3VwcG9ydC5cclxuXHQgKiBAcGFyYW0gbnVtRGlyZWN0aW9uYWxMaWdodHMgVGhlIG1heGltdW0gYW1vdW50IG9mIGRpcmVjdGlvbmFsIGxpZ2h0cyB0byBzdXBwb3J0LlxyXG5cdCAqIEByZXR1cm4gVGhlIGFtb3VudCBvZiBkaXJlY3Rpb25hbCBsaWdodHMgdGhpcyBtYXRlcmlhbCB3aWxsIHN1cHBvcnQsIGJvdW5kZWQgYnkgdGhlIGFtb3VudCBuZWNlc3NhcnkuXHJcblx0ICovXHJcblx0cHJpdmF0ZSBjYWxjdWxhdGVOdW1EaXJlY3Rpb25hbExpZ2h0cyhudW1EaXJlY3Rpb25hbExpZ2h0czpudW1iZXIpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiBNYXRoLm1pbihudW1EaXJlY3Rpb25hbExpZ2h0cyAtIHRoaXMuZGlyZWN0aW9uYWxMaWdodHNPZmZzZXQsIHRoaXMuX21heExpZ2h0cyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDYWxjdWxhdGVzIHRoZSBhbW91bnQgb2YgcG9pbnQgbGlnaHRzIHRoaXMgbWF0ZXJpYWwgd2lsbCBzdXBwb3J0LlxyXG5cdCAqIEBwYXJhbSBudW1EaXJlY3Rpb25hbExpZ2h0cyBUaGUgbWF4aW11bSBhbW91bnQgb2YgcG9pbnQgbGlnaHRzIHRvIHN1cHBvcnQuXHJcblx0ICogQHJldHVybiBUaGUgYW1vdW50IG9mIHBvaW50IGxpZ2h0cyB0aGlzIG1hdGVyaWFsIHdpbGwgc3VwcG9ydCwgYm91bmRlZCBieSB0aGUgYW1vdW50IG5lY2Vzc2FyeS5cclxuXHQgKi9cclxuXHRwcml2YXRlIGNhbGN1bGF0ZU51bVBvaW50TGlnaHRzKG51bVBvaW50TGlnaHRzOm51bWJlcik6bnVtYmVyXHJcblx0e1xyXG5cdFx0dmFyIG51bUZyZWU6bnVtYmVyID0gdGhpcy5fbWF4TGlnaHRzIC0gdGhpcy5udW1EaXJlY3Rpb25hbExpZ2h0cztcclxuXHRcdHJldHVybiBNYXRoLm1pbihudW1Qb2ludExpZ2h0cyAtIHRoaXMucG9pbnRMaWdodHNPZmZzZXQsIG51bUZyZWUpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ2FsY3VsYXRlcyB0aGUgYW1vdW50IG9mIGxpZ2h0IHByb2JlcyB0aGlzIG1hdGVyaWFsIHdpbGwgc3VwcG9ydC5cclxuXHQgKiBAcGFyYW0gbnVtRGlyZWN0aW9uYWxMaWdodHMgVGhlIG1heGltdW0gYW1vdW50IG9mIGxpZ2h0IHByb2JlcyB0byBzdXBwb3J0LlxyXG5cdCAqIEByZXR1cm4gVGhlIGFtb3VudCBvZiBsaWdodCBwcm9iZXMgdGhpcyBtYXRlcmlhbCB3aWxsIHN1cHBvcnQsIGJvdW5kZWQgYnkgdGhlIGFtb3VudCBuZWNlc3NhcnkuXHJcblx0ICovXHJcblx0cHJpdmF0ZSBjYWxjdWxhdGVOdW1Qcm9iZXMobnVtTGlnaHRQcm9iZXM6bnVtYmVyKTpudW1iZXJcclxuXHR7XHJcblx0XHR2YXIgbnVtQ2hhbm5lbHM6bnVtYmVyID0gMDtcclxuXHJcblx0XHRpZiAoKHRoaXMuc3BlY3VsYXJMaWdodFNvdXJjZXMgJiBMaWdodFNvdXJjZXMuUFJPQkVTKSAhPSAwKVxyXG5cdFx0XHQrK251bUNoYW5uZWxzO1xyXG5cclxuXHRcdGlmICgodGhpcy5kaWZmdXNlTGlnaHRTb3VyY2VzICYgTGlnaHRTb3VyY2VzLlBST0JFUykgIT0gMClcclxuXHRcdFx0KytudW1DaGFubmVscztcclxuXHJcblx0XHQvLyA0IGNoYW5uZWxzIGF2YWlsYWJsZVxyXG5cdFx0cmV0dXJuIE1hdGgubWluKG51bUxpZ2h0UHJvYmVzIC0gdGhpcy5saWdodFByb2Jlc09mZnNldCwgKDQvbnVtQ2hhbm5lbHMpIHwgMCk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgPSBNZXRob2RQYXNzOyJdfQ==