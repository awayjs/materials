var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
var ShadingMethodEvent = require("awayjs-renderergl/lib/events/ShadingMethodEvent");
var ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
var LightingPassGLBase = require("awayjs-renderergl/lib/passes/LightingPassGLBase");
var MethodVO = require("awayjs-methodmaterials/lib/data/MethodVO");
var EffectColorTransformMethod = require("awayjs-methodmaterials/lib/methods/EffectColorTransformMethod");
var MaterialPassMode = require("awayjs-methodmaterials/lib/passes/MaterialPassMode");
/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
var TriangleMethodPass = (function (_super) {
    __extends(TriangleMethodPass, _super);
    /**
     * Creates a new CompiledPass object.
     *
     * @param material The material to which this pass belongs.
     */
    function TriangleMethodPass(passMode) {
        var _this = this;
        if (passMode === void 0) { passMode = 0x03; }
        _super.call(this);
        this._pNumLights = 0;
        this._includeCasters = true;
        this._maxLights = 3;
        this._iMethodVOs = new Array();
        this._numEffectDependencies = 0;
        this._passMode = passMode;
        this._onShaderInvalidatedDelegate = function (event) { return _this.onShaderInvalidated(event); };
    }
    Object.defineProperty(TriangleMethodPass.prototype, "passMode", {
        /**
         *
         */
        get: function () {
            return this._passMode;
        },
        set: function (value) {
            this._passMode = value;
            this._pInvalidatePass();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodPass.prototype, "includeCasters", {
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
            this._pInvalidatePass();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Factory method to create a concrete shader object for this pass.
     *
     * @param profile The compatibility profile used by the renderer.
     */
    TriangleMethodPass.prototype.createShaderObject = function (profile) {
        if (this._pLightPicker && (this.passMode & MaterialPassMode.LIGHTING))
            return new ShaderLightingObject(profile);
        return new ShaderObjectBase(profile);
    };
    /**
     * Initializes the unchanging constant data for this material.
     */
    TriangleMethodPass.prototype._iInitConstantData = function (shaderObject) {
        _super.prototype._iInitConstantData.call(this, shaderObject);
        //Updates method constants if they have changed.
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i)
            this._iMethodVOs[i].method.iInitConstants(shaderObject, this._iMethodVOs[i]);
    };
    Object.defineProperty(TriangleMethodPass.prototype, "colorTransform", {
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
    Object.defineProperty(TriangleMethodPass.prototype, "colorTransformMethod", {
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
    /**
     * Implemented by subclasses if the pass uses lights to update the shader.
     */
    TriangleMethodPass.prototype.pUpdateLights = function () {
        var numDirectionalLightsOld = this._pNumDirectionalLights;
        var numPointLightsOld = this._pNumPointLights;
        var numLightProbesOld = this._pNumLightProbes;
        if (this._pLightPicker && (this._passMode & MaterialPassMode.LIGHTING)) {
            this._pNumDirectionalLights = this.calculateNumDirectionalLights(this._pLightPicker.numDirectionalLights);
            this._pNumPointLights = this.calculateNumPointLights(this._pLightPicker.numPointLights);
            this._pNumLightProbes = this.calculateNumProbes(this._pLightPicker.numLightProbes);
            if (this._includeCasters) {
                this._pNumDirectionalLights += this._pLightPicker.numCastingDirectionalLights;
                this._pNumPointLights += this._pLightPicker.numCastingPointLights;
            }
        }
        else {
            this._pNumDirectionalLights = 0;
            this._pNumPointLights = 0;
            this._pNumLightProbes = 0;
        }
        this._pNumLights = this._pNumDirectionalLights + this._pNumPointLights;
        if (numDirectionalLightsOld != this._pNumDirectionalLights || numPointLightsOld != this._pNumPointLights || numLightProbesOld != this._pNumLightProbes)
            this._pInvalidatePass();
    };
    TriangleMethodPass.prototype._removeDependency = function (methodVO, effectsDependency) {
        if (effectsDependency === void 0) { effectsDependency = false; }
        var index = this._iMethodVOs.indexOf(methodVO);
        if (!effectsDependency)
            this._numEffectDependencies--;
        methodVO.method.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
        this._iMethodVOs.splice(index, 1);
        this._pInvalidatePass();
    };
    TriangleMethodPass.prototype._addDependency = function (methodVO, effectsDependency, index) {
        if (effectsDependency === void 0) { effectsDependency = false; }
        if (index === void 0) { index = -1; }
        methodVO.method.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
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
        this._pInvalidatePass();
    };
    /**
     * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
     * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
     * methods added prior.
     */
    TriangleMethodPass.prototype.addEffectMethod = function (method) {
        this._addDependency(new MethodVO(method), true);
    };
    Object.defineProperty(TriangleMethodPass.prototype, "numEffectMethods", {
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
    TriangleMethodPass.prototype.hasEffectMethod = function (method) {
        return this.getDependencyForMethod(method) != null;
    };
    /**
     * Returns the method added at the given index.
     * @param index The index of the method to retrieve.
     * @return The method at the given index.
     */
    TriangleMethodPass.prototype.getEffectMethodAt = function (index) {
        if (index < 0 || index > this._numEffectDependencies - 1)
            return null;
        return this._iMethodVOs[index + this._iMethodVOs.length - this._numEffectDependencies].method;
    };
    /**
     * Adds an effect method at the specified index amongst the methods already added to the material. Effect
     * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
     * etc. The method will be applied to the result of the methods with a lower index.
     */
    TriangleMethodPass.prototype.addEffectMethodAt = function (method, index) {
        this._addDependency(new MethodVO(method), true, index);
    };
    /**
     * Removes an effect method from the material.
     * @param method The method to be removed.
     */
    TriangleMethodPass.prototype.removeEffectMethod = function (method) {
        var methodVO = this.getDependencyForMethod(method);
        if (methodVO != null)
            this._removeDependency(methodVO, true);
    };
    TriangleMethodPass.prototype.getDependencyForMethod = function (method) {
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i)
            if (this._iMethodVOs[i].method == method)
                return this._iMethodVOs[i];
        return null;
    };
    Object.defineProperty(TriangleMethodPass.prototype, "normalMethod", {
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
    Object.defineProperty(TriangleMethodPass.prototype, "ambientMethod", {
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
    Object.defineProperty(TriangleMethodPass.prototype, "shadowMethod", {
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
    Object.defineProperty(TriangleMethodPass.prototype, "diffuseMethod", {
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
    Object.defineProperty(TriangleMethodPass.prototype, "specularMethod", {
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
    TriangleMethodPass.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        while (this._iMethodVOs.length)
            this._removeDependency(this._iMethodVOs[0]);
        this._iMethodVOs = null;
    };
    /**
     * Called when any method's shader code is invalidated.
     */
    TriangleMethodPass.prototype.onShaderInvalidated = function (event) {
        this._pInvalidatePass();
    };
    // RENDER LOOP
    /**
     * @inheritDoc
     */
    TriangleMethodPass.prototype._iActivate = function (pass, renderer, camera) {
        _super.prototype._iActivate.call(this, pass, renderer, camera);
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod)
                methodVO.method.iActivate(pass.shaderObject, methodVO, renderer.stage);
        }
    };
    /**
     *
     *
     * @param renderable
     * @param stage
     * @param camera
     */
    TriangleMethodPass.prototype.setRenderState = function (pass, renderable, stage, camera, viewProjection) {
        _super.prototype.setRenderState.call(this, pass, renderable, stage, camera, viewProjection);
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod)
                methodVO.method.iSetRenderState(pass.shaderObject, methodVO, renderable, stage, camera);
        }
    };
    /**
     * @inheritDoc
     */
    TriangleMethodPass.prototype._iDeactivate = function (pass, renderer) {
        _super.prototype._iDeactivate.call(this, pass, renderer);
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod)
                methodVO.method.iDeactivate(pass.shaderObject, methodVO, renderer.stage);
        }
    };
    TriangleMethodPass.prototype._iIncludeDependencies = function (shaderObject) {
        //TODO: fragment animtion should be compatible with lighting pass
        shaderObject.usesFragmentAnimation = Boolean(this._passMode == MaterialPassMode.SUPER_SHADER);
        if (!shaderObject.usesTangentSpace && shaderObject.numPointLights > 0 && shaderObject.usesLights) {
            shaderObject.globalPosDependencies++;
            if (Boolean(this._passMode & MaterialPassMode.EFFECTS))
                shaderObject.usesGlobalPosFragment = true;
        }
        var i;
        var len = this._iMethodVOs.length;
        for (i = 0; i < len; ++i)
            this.setupAndCountDependencies(shaderObject, this._iMethodVOs[i]);
        for (i = 0; i < len; ++i)
            this._iMethodVOs[i].useMethod = this._iMethodVOs[i].method.iIsUsed(shaderObject);
        _super.prototype._iIncludeDependencies.call(this, shaderObject);
    };
    /**
     * Counts the dependencies for a given method.
     * @param method The method to count the dependencies for.
     * @param methodVO The method's data for this material.
     */
    TriangleMethodPass.prototype.setupAndCountDependencies = function (shaderObject, methodVO) {
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
    TriangleMethodPass.prototype._iGetPreLightingVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        if (this._iAmbientMethodVO && this._iAmbientMethodVO.useMethod)
            code += this._iAmbientMethodVO.method.iGetVertexCode(shaderObject, this._iAmbientMethodVO, registerCache, sharedRegisters);
        if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod)
            code += this._iDiffuseMethodVO.method.iGetVertexCode(shaderObject, this._iDiffuseMethodVO, registerCache, sharedRegisters);
        if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod)
            code += this._iSpecularMethodVO.method.iGetVertexCode(shaderObject, this._iSpecularMethodVO, registerCache, sharedRegisters);
        return code;
    };
    TriangleMethodPass.prototype._iGetPreLightingFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
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
    TriangleMethodPass.prototype._iGetPerLightDiffuseFragmentCode = function (shaderObject, lightDirReg, diffuseColorReg, registerCache, sharedRegisters) {
        return this._iDiffuseMethodVO.method.iGetFragmentCodePerLight(shaderObject, this._iDiffuseMethodVO, lightDirReg, diffuseColorReg, registerCache, sharedRegisters);
    };
    TriangleMethodPass.prototype._iGetPerLightSpecularFragmentCode = function (shaderObject, lightDirReg, specularColorReg, registerCache, sharedRegisters) {
        return this._iSpecularMethodVO.method.iGetFragmentCodePerLight(shaderObject, this._iSpecularMethodVO, lightDirReg, specularColorReg, registerCache, sharedRegisters);
    };
    TriangleMethodPass.prototype._iGetPerProbeDiffuseFragmentCode = function (shaderObject, texReg, weightReg, registerCache, sharedRegisters) {
        return this._iDiffuseMethodVO.method.iGetFragmentCodePerProbe(shaderObject, this._iDiffuseMethodVO, texReg, weightReg, registerCache, sharedRegisters);
    };
    TriangleMethodPass.prototype._iGetPerProbeSpecularFragmentCode = function (shaderObject, texReg, weightReg, registerCache, sharedRegisters) {
        return this._iSpecularMethodVO.method.iGetFragmentCodePerProbe(shaderObject, this._iSpecularMethodVO, texReg, weightReg, registerCache, sharedRegisters);
    };
    TriangleMethodPass.prototype._iGetPostLightingVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        if (this._iShadowMethodVO)
            code += this._iShadowMethodVO.method.iGetVertexCode(shaderObject, this._iShadowMethodVO, registerCache, sharedRegisters);
        return code;
    };
    TriangleMethodPass.prototype._iGetPostLightingFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
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
    TriangleMethodPass.prototype._pUsesTangentSpace = function (shaderObject) {
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
    TriangleMethodPass.prototype._pOutputsTangentNormals = function (shaderObject) {
        return this._iNormalMethodVO.method.iOutputsTangentNormals();
    };
    /**
     * Indicates whether or not normals are output by the pass.
     */
    TriangleMethodPass.prototype._pOutputsNormals = function (shaderObject) {
        return this._iNormalMethodVO && this._iNormalMethodVO.useMethod;
    };
    TriangleMethodPass.prototype._iGetNormalVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return this._iNormalMethodVO.method.iGetVertexCode(shaderObject, this._iNormalMethodVO, registerCache, sharedRegisters);
    };
    TriangleMethodPass.prototype._iGetNormalFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
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
    TriangleMethodPass.prototype._iGetVertexCode = function (shaderObject, regCache, sharedReg) {
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
    TriangleMethodPass.prototype._iGetFragmentCode = function (shaderObject, regCache, sharedReg) {
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
    TriangleMethodPass.prototype._iUsesShadows = function () {
        return Boolean(this._iShadowMethodVO || this.lightPicker.castingDirectionalLights.length > 0 || this.lightPicker.castingPointLights.length > 0);
    };
    /**
     * Indicates whether the shader uses any specular component.
     */
    TriangleMethodPass.prototype._iUsesSpecular = function () {
        return Boolean(this._iSpecularMethodVO);
    };
    /**
     * Calculates the amount of directional lights this material will support.
     * @param numDirectionalLights The maximum amount of directional lights to support.
     * @return The amount of directional lights this material will support, bounded by the amount necessary.
     */
    TriangleMethodPass.prototype.calculateNumDirectionalLights = function (numDirectionalLights) {
        return Math.min(numDirectionalLights - this.directionalLightsOffset, this._maxLights);
    };
    /**
     * Calculates the amount of point lights this material will support.
     * @param numDirectionalLights The maximum amount of point lights to support.
     * @return The amount of point lights this material will support, bounded by the amount necessary.
     */
    TriangleMethodPass.prototype.calculateNumPointLights = function (numPointLights) {
        var numFree = this._maxLights - this._pNumDirectionalLights;
        return Math.min(numPointLights - this.pointLightsOffset, numFree);
    };
    /**
     * Calculates the amount of light probes this material will support.
     * @param numDirectionalLights The maximum amount of light probes to support.
     * @return The amount of light probes this material will support, bounded by the amount necessary.
     */
    TriangleMethodPass.prototype.calculateNumProbes = function (numLightProbes) {
        var numChannels = 0;
        //			if ((this._pSpecularLightSources & LightSources.PROBES) != 0)
        //				++numChannels;
        //
        //			if ((this._pDiffuseLightSources & LightSources.PROBES) != 0)
        //				++numChannels;
        // 4 channels available
        return Math.min(numLightProbes - this.lightProbesOffset, (4 / numChannels) | 0);
    };
    return TriangleMethodPass;
})(LightingPassGLBase);
module.exports = TriangleMethodPass;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL3Bhc3Nlcy9UcmlhbmdsZU1ldGhvZFBhc3MudHMiXSwibmFtZXMiOlsiVHJpYW5nbGVNZXRob2RQYXNzIiwiVHJpYW5nbGVNZXRob2RQYXNzLmNvbnN0cnVjdG9yIiwiVHJpYW5nbGVNZXRob2RQYXNzLnBhc3NNb2RlIiwiVHJpYW5nbGVNZXRob2RQYXNzLmluY2x1ZGVDYXN0ZXJzIiwiVHJpYW5nbGVNZXRob2RQYXNzLmNyZWF0ZVNoYWRlck9iamVjdCIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5faUluaXRDb25zdGFudERhdGEiLCJUcmlhbmdsZU1ldGhvZFBhc3MuY29sb3JUcmFuc2Zvcm0iLCJUcmlhbmdsZU1ldGhvZFBhc3MuY29sb3JUcmFuc2Zvcm1NZXRob2QiLCJUcmlhbmdsZU1ldGhvZFBhc3MucFVwZGF0ZUxpZ2h0cyIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5fcmVtb3ZlRGVwZW5kZW5jeSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5fYWRkRGVwZW5kZW5jeSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5hZGRFZmZlY3RNZXRob2QiLCJUcmlhbmdsZU1ldGhvZFBhc3MubnVtRWZmZWN0TWV0aG9kcyIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5oYXNFZmZlY3RNZXRob2QiLCJUcmlhbmdsZU1ldGhvZFBhc3MuZ2V0RWZmZWN0TWV0aG9kQXQiLCJUcmlhbmdsZU1ldGhvZFBhc3MuYWRkRWZmZWN0TWV0aG9kQXQiLCJUcmlhbmdsZU1ldGhvZFBhc3MucmVtb3ZlRWZmZWN0TWV0aG9kIiwiVHJpYW5nbGVNZXRob2RQYXNzLmdldERlcGVuZGVuY3lGb3JNZXRob2QiLCJUcmlhbmdsZU1ldGhvZFBhc3Mubm9ybWFsTWV0aG9kIiwiVHJpYW5nbGVNZXRob2RQYXNzLmFtYmllbnRNZXRob2QiLCJUcmlhbmdsZU1ldGhvZFBhc3Muc2hhZG93TWV0aG9kIiwiVHJpYW5nbGVNZXRob2RQYXNzLmRpZmZ1c2VNZXRob2QiLCJUcmlhbmdsZU1ldGhvZFBhc3Muc3BlY3VsYXJNZXRob2QiLCJUcmlhbmdsZU1ldGhvZFBhc3MuZGlzcG9zZSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5vblNoYWRlckludmFsaWRhdGVkIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pQWN0aXZhdGUiLCJUcmlhbmdsZU1ldGhvZFBhc3Muc2V0UmVuZGVyU3RhdGUiLCJUcmlhbmdsZU1ldGhvZFBhc3MuX2lEZWFjdGl2YXRlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pSW5jbHVkZURlcGVuZGVuY2llcyIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5zZXR1cEFuZENvdW50RGVwZW5kZW5jaWVzIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pR2V0UHJlTGlnaHRpbmdWZXJ0ZXhDb2RlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pR2V0UHJlTGlnaHRpbmdGcmFnbWVudENvZGUiLCJUcmlhbmdsZU1ldGhvZFBhc3MuX2lHZXRQZXJMaWdodERpZmZ1c2VGcmFnbWVudENvZGUiLCJUcmlhbmdsZU1ldGhvZFBhc3MuX2lHZXRQZXJMaWdodFNwZWN1bGFyRnJhZ21lbnRDb2RlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pR2V0UGVyUHJvYmVEaWZmdXNlRnJhZ21lbnRDb2RlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pR2V0UGVyUHJvYmVTcGVjdWxhckZyYWdtZW50Q29kZSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5faUdldFBvc3RMaWdodGluZ1ZlcnRleENvZGUiLCJUcmlhbmdsZU1ldGhvZFBhc3MuX2lHZXRQb3N0TGlnaHRpbmdGcmFnbWVudENvZGUiLCJUcmlhbmdsZU1ldGhvZFBhc3MuX3BVc2VzVGFuZ2VudFNwYWNlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9wT3V0cHV0c1RhbmdlbnROb3JtYWxzIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9wT3V0cHV0c05vcm1hbHMiLCJUcmlhbmdsZU1ldGhvZFBhc3MuX2lHZXROb3JtYWxWZXJ0ZXhDb2RlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pR2V0Tm9ybWFsRnJhZ21lbnRDb2RlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pR2V0VmVydGV4Q29kZSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5faUdldEZyYWdtZW50Q29kZSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5faVVzZXNTaGFkb3dzIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pVXNlc1NwZWN1bGFyIiwiVHJpYW5nbGVNZXRob2RQYXNzLmNhbGN1bGF0ZU51bURpcmVjdGlvbmFsTGlnaHRzIiwiVHJpYW5nbGVNZXRob2RQYXNzLmNhbGN1bGF0ZU51bVBvaW50TGlnaHRzIiwiVHJpYW5nbGVNZXRob2RQYXNzLmNhbGN1bGF0ZU51bVByb2JlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBY0EsSUFBTyxvQkFBb0IsV0FBYyx3REFBd0QsQ0FBQyxDQUFDO0FBQ25HLElBQU8sa0JBQWtCLFdBQWMsaURBQWlELENBQUMsQ0FBQztBQUMxRixJQUFPLGdCQUFnQixXQUFlLG9EQUFvRCxDQUFDLENBQUM7QUFNNUYsSUFBTyxrQkFBa0IsV0FBYyxpREFBaUQsQ0FBQyxDQUFDO0FBRTFGLElBQU8sUUFBUSxXQUFpQiwwQ0FBMEMsQ0FBQyxDQUFDO0FBRzVFLElBQU8sMEJBQTBCLFdBQVksK0RBQStELENBQUMsQ0FBQztBQU05RyxJQUFPLGdCQUFnQixXQUFlLG9EQUFvRCxDQUFDLENBQUM7QUFFNUYsQUFJQTs7O0dBREc7SUFDRyxrQkFBa0I7SUFBU0EsVUFBM0JBLGtCQUFrQkEsVUFBMkJBO0lBc0RsREE7Ozs7T0FJR0E7SUFDSEEsU0EzREtBLGtCQUFrQkEsQ0EyRFhBLFFBQXNCQTtRQTNEbkNDLGlCQWt6QkNBO1FBdnZCWUEsd0JBQXNCQSxHQUF0QkEsZUFBc0JBO1FBRWpDQSxpQkFBT0EsQ0FBQ0E7UUEzREZBLGdCQUFXQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUl0QkEsb0JBQWVBLEdBQVdBLElBQUlBLENBQUNBO1FBQy9CQSxlQUFVQSxHQUFVQSxDQUFDQSxDQUFDQTtRQVF2QkEsZ0JBQVdBLEdBQW1CQSxJQUFJQSxLQUFL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QUNBLGNBQWNBLEdBQUdBLElBQUlBLENBQUNBLGlCQUFpQkEsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7SUFDbkVBLENBQUNBO0lBRURoRDs7OztPQUlHQTtJQUNLQSwrQ0FBa0JBLEdBQTFCQSxVQUEyQkEsY0FBcUJBO1FBRS9DaUQsSUFBSUEsV0FBV0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDM0JBLEFBT0FBLGtFQVBrRUE7UUFDbEVBLG9CQUFvQkE7UUFDcEJBLEVBQUVBO1FBQ0ZBLGlFQUFpRUE7UUFDakVBLG9CQUFvQkE7UUFFcEJBLHVCQUF1QkE7UUFDdkJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLGNBQWNBLEdBQUdBLElBQUlBLENBQUNBLGlCQUFpQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsV0FBV0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDL0VBLENBQUNBO0lBQ0ZqRCx5QkFBQ0E7QUFBREEsQ0FsekJBLEFBa3pCQ0EsRUFsekJnQyxrQkFBa0IsRUFrekJsRDtBQUVELEFBQTRCLGlCQUFuQixrQkFBa0IsQ0FBQyIsImZpbGUiOiJwYXNzZXMvVHJpYW5nbGVNZXRob2RQYXNzLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2xvclRyYW5zZm9ybVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9Db2xvclRyYW5zZm9ybVwiKTtcbmltcG9ydCBNYXRyaXhcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL01hdHJpeFwiKTtcbmltcG9ydCBNYXRyaXgzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RcIik7XG5pbXBvcnQgTWF0cml4M0RVdGlsc1x0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFV0aWxzXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBBYnN0cmFjdE1ldGhvZEVycm9yXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXJyb3JzL0Fic3RyYWN0TWV0aG9kRXJyb3JcIik7XG5pbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IFRyaWFuZ2xlU3ViR2VvbWV0cnlcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1RyaWFuZ2xlU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgUmVuZGVyZXJCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2Jhc2UvUmVuZGVyZXJCYXNlXCIpO1xuaW1wb3J0IFNoYWRlckxpZ2h0aW5nT2JqZWN0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyTGlnaHRpbmdPYmplY3RcIik7XG5pbXBvcnQgU2hhZGluZ01ldGhvZEV2ZW50XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvZXZlbnRzL1NoYWRpbmdNZXRob2RFdmVudFwiKTtcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IE1hdGVyaWFsUGFzc0RhdGFcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvTWF0ZXJpYWxQYXNzRGF0YVwiKTtcbmltcG9ydCBSZW5kZXJhYmxlQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9SZW5kZXJhYmxlQmFzZVwiKTtcbmltcG9ydCBMaWdodGluZ1Bhc3NHTEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvTGlnaHRpbmdQYXNzR0xCYXNlXCIpO1xuXG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL2RhdGEvTWV0aG9kVk9cIik7XG5pbXBvcnQgQW1iaWVudEJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0FtYmllbnRCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBEaWZmdXNlQmFzaWNNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRGlmZnVzZUJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kXHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2RcIik7XG5pbXBvcnQgRWZmZWN0TWV0aG9kQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0VmZmVjdE1ldGhvZEJhc2VcIik7XG5pbXBvcnQgTGlnaHRpbmdNZXRob2RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0xpZ2h0aW5nTWV0aG9kQmFzZVwiKTtcbmltcG9ydCBOb3JtYWxCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9Ob3JtYWxCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBTaGFkb3dNYXBNZXRob2RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL1NoYWRvd01hcE1ldGhvZEJhc2VcIik7XG5pbXBvcnQgU3BlY3VsYXJCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9TcGVjdWxhckJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IE1hdGVyaWFsUGFzc01vZGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvcGFzc2VzL01hdGVyaWFsUGFzc01vZGVcIik7XG5cbi8qKlxuICogQ29tcGlsZWRQYXNzIGZvcm1zIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIHRoZSBkZWZhdWx0IGNvbXBpbGVkIHBhc3MgbWF0ZXJpYWxzIHByb3ZpZGVkIGJ5IEF3YXkzRCxcbiAqIHVzaW5nIG1hdGVyaWFsIG1ldGhvZHMgdG8gZGVmaW5lIHRoZWlyIGFwcGVhcmFuY2UuXG4gKi9cbmNsYXNzIFRyaWFuZ2xlTWV0aG9kUGFzcyBleHRlbmRzIExpZ2h0aW5nUGFzc0dMQmFzZVxue1xuXHRwdWJsaWMgX3BOdW1MaWdodHM6bnVtYmVyID0gMDtcblxuXHRwcml2YXRlIF9wYXNzTW9kZTpudW1iZXI7XG5cblx0cHJpdmF0ZSBfaW5jbHVkZUNhc3RlcnM6Ym9vbGVhbiA9IHRydWU7XG5cdHByaXZhdGUgX21heExpZ2h0czpudW1iZXIgPSAzO1xuXG5cdHB1YmxpYyBfaUNvbG9yVHJhbnNmb3JtTWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaU5vcm1hbE1ldGhvZFZPOk1ldGhvZFZPO1xuXHRwdWJsaWMgX2lBbWJpZW50TWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaVNoYWRvd01ldGhvZFZPOk1ldGhvZFZPO1xuXHRwdWJsaWMgX2lEaWZmdXNlTWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaVNwZWN1bGFyTWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaU1ldGhvZFZPczpBcnJheTxNZXRob2RWTz4gPSBuZXcgQXJyYXk8TWV0aG9kVk8+KCk7XG5cblx0cHVibGljIF9udW1FZmZlY3REZXBlbmRlbmNpZXM6bnVtYmVyID0gMDtcblxuXHRwcml2YXRlIF9vblNoYWRlckludmFsaWRhdGVkRGVsZWdhdGU6KGV2ZW50OlNoYWRpbmdNZXRob2RFdmVudCkgPT4gdm9pZDtcblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBnZXQgcGFzc01vZGUoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wYXNzTW9kZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgcGFzc01vZGUodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fcGFzc01vZGUgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlUGFzcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBzaGFkb3cgY2FzdGluZyBsaWdodHMgbmVlZCB0byBiZSBpbmNsdWRlZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgaW5jbHVkZUNhc3RlcnMoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faW5jbHVkZUNhc3RlcnM7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGluY2x1ZGVDYXN0ZXJzKHZhbHVlOmJvb2xlYW4pXG5cdHtcblx0XHRpZiAodGhpcy5faW5jbHVkZUNhc3RlcnMgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9pbmNsdWRlQ2FzdGVycyA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVQYXNzKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBDb21waWxlZFBhc3Mgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gbWF0ZXJpYWwgVGhlIG1hdGVyaWFsIHRvIHdoaWNoIHRoaXMgcGFzcyBiZWxvbmdzLlxuXHQgKi9cblx0Y29uc3RydWN0b3IocGFzc01vZGU6bnVtYmVyID0gMHgwMylcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9wYXNzTW9kZSA9IHBhc3NNb2RlO1xuXG5cdFx0dGhpcy5fb25TaGFkZXJJbnZhbGlkYXRlZERlbGVnYXRlID0gKGV2ZW50OlNoYWRpbmdNZXRob2RFdmVudCkgPT4gdGhpcy5vblNoYWRlckludmFsaWRhdGVkKGV2ZW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGYWN0b3J5IG1ldGhvZCB0byBjcmVhdGUgYSBjb25jcmV0ZSBzaGFkZXIgb2JqZWN0IGZvciB0aGlzIHBhc3MuXG5cdCAqXG5cdCAqIEBwYXJhbSBwcm9maWxlIFRoZSBjb21wYXRpYmlsaXR5IHByb2ZpbGUgdXNlZCBieSB0aGUgcmVuZGVyZXIuXG5cdCAqL1xuXHRwdWJsaWMgY3JlYXRlU2hhZGVyT2JqZWN0KHByb2ZpbGU6c3RyaW5nKTpTaGFkZXJPYmplY3RCYXNlXG5cdHtcblx0XHRpZiAodGhpcy5fcExpZ2h0UGlja2VyICYmICh0aGlzLnBhc3NNb2RlICYgTWF0ZXJpYWxQYXNzTW9kZS5MSUdIVElORykpXG5cdFx0XHRyZXR1cm4gbmV3IFNoYWRlckxpZ2h0aW5nT2JqZWN0KHByb2ZpbGUpO1xuXG5cdFx0cmV0dXJuIG5ldyBTaGFkZXJPYmplY3RCYXNlKHByb2ZpbGUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemVzIHRoZSB1bmNoYW5naW5nIGNvbnN0YW50IGRhdGEgZm9yIHRoaXMgbWF0ZXJpYWwuXG5cdCAqL1xuXHRwdWJsaWMgX2lJbml0Q29uc3RhbnREYXRhKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cdFx0c3VwZXIuX2lJbml0Q29uc3RhbnREYXRhKHNoYWRlck9iamVjdCk7XG5cblx0XHQvL1VwZGF0ZXMgbWV0aG9kIGNvbnN0YW50cyBpZiB0aGV5IGhhdmUgY2hhbmdlZC5cblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKVxuXHRcdFx0dGhpcy5faU1ldGhvZFZPc1tpXS5tZXRob2QuaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0LCB0aGlzLl9pTWV0aG9kVk9zW2ldKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgQ29sb3JUcmFuc2Zvcm0gb2JqZWN0IHRvIHRyYW5zZm9ybSB0aGUgY29sb3VyIG9mIHRoZSBtYXRlcmlhbCB3aXRoLiBEZWZhdWx0cyB0byBudWxsLlxuXHQgKi9cblx0cHVibGljIGdldCBjb2xvclRyYW5zZm9ybSgpOkNvbG9yVHJhbnNmb3JtXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5jb2xvclRyYW5zZm9ybU1ldGhvZD8gdGhpcy5jb2xvclRyYW5zZm9ybU1ldGhvZC5jb2xvclRyYW5zZm9ybSA6IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGNvbG9yVHJhbnNmb3JtKHZhbHVlOkNvbG9yVHJhbnNmb3JtKVxuXHR7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRpZiAodGhpcy5jb2xvclRyYW5zZm9ybU1ldGhvZCA9PSBudWxsKVxuXHRcdFx0XHR0aGlzLmNvbG9yVHJhbnNmb3JtTWV0aG9kID0gbmV3IEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kKCk7XG5cblx0XHRcdHRoaXMuY29sb3JUcmFuc2Zvcm1NZXRob2QuY29sb3JUcmFuc2Zvcm0gPSB2YWx1ZTtcblxuXHRcdH0gZWxzZSBpZiAoIXZhbHVlKSB7XG5cdFx0XHRpZiAodGhpcy5jb2xvclRyYW5zZm9ybU1ldGhvZClcblx0XHRcdFx0dGhpcy5jb2xvclRyYW5zZm9ybU1ldGhvZCA9IG51bGw7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZCBvYmplY3QgdG8gdHJhbnNmb3JtIHRoZSBjb2xvdXIgb2YgdGhlIG1hdGVyaWFsIHdpdGguIERlZmF1bHRzIHRvIG51bGwuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGNvbG9yVHJhbnNmb3JtTWV0aG9kKCk6RWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTz8gPEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kPiB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTy5tZXRob2QgOiBudWxsO1xuXHR9XG5cblx0cHVibGljIHNldCBjb2xvclRyYW5zZm9ybU1ldGhvZCh2YWx1ZTpFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZClcblx0e1xuXHRcdGlmICh0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTyAmJiB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTy5tZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8pIHtcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8pO1xuXHRcdFx0dGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8gPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8gPSBuZXcgTWV0aG9kVk8odmFsdWUpO1xuXHRcdFx0dGhpcy5fYWRkRGVwZW5kZW5jeSh0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEltcGxlbWVudGVkIGJ5IHN1YmNsYXNzZXMgaWYgdGhlIHBhc3MgdXNlcyBsaWdodHMgdG8gdXBkYXRlIHRoZSBzaGFkZXIuXG5cdCAqL1xuXHRwdWJsaWMgcFVwZGF0ZUxpZ2h0cygpXG5cdHtcblx0XHR2YXIgbnVtRGlyZWN0aW9uYWxMaWdodHNPbGQ6bnVtYmVyID0gdGhpcy5fcE51bURpcmVjdGlvbmFsTGlnaHRzO1xuXHRcdHZhciBudW1Qb2ludExpZ2h0c09sZDpudW1iZXIgPSB0aGlzLl9wTnVtUG9pbnRMaWdodHM7XG5cdFx0dmFyIG51bUxpZ2h0UHJvYmVzT2xkOm51bWJlciA9IHRoaXMuX3BOdW1MaWdodFByb2JlcztcblxuXHRcdGlmICh0aGlzLl9wTGlnaHRQaWNrZXIgJiYgKHRoaXMuX3Bhc3NNb2RlICYgTWF0ZXJpYWxQYXNzTW9kZS5MSUdIVElORykpIHtcblx0XHRcdHRoaXMuX3BOdW1EaXJlY3Rpb25hbExpZ2h0cyA9IHRoaXMuY2FsY3VsYXRlTnVtRGlyZWN0aW9uYWxMaWdodHModGhpcy5fcExpZ2h0UGlja2VyLm51bURpcmVjdGlvbmFsTGlnaHRzKTtcblx0XHRcdHRoaXMuX3BOdW1Qb2ludExpZ2h0cyA9IHRoaXMuY2FsY3VsYXRlTnVtUG9pbnRMaWdodHModGhpcy5fcExpZ2h0UGlja2VyLm51bVBvaW50TGlnaHRzKTtcblx0XHRcdHRoaXMuX3BOdW1MaWdodFByb2JlcyA9IHRoaXMuY2FsY3VsYXRlTnVtUHJvYmVzKHRoaXMuX3BMaWdodFBpY2tlci5udW1MaWdodFByb2Jlcyk7XG5cblx0XHRcdGlmICh0aGlzLl9pbmNsdWRlQ2FzdGVycykge1xuXHRcdFx0XHR0aGlzLl9wTnVtRGlyZWN0aW9uYWxMaWdodHMgKz0gdGhpcy5fcExpZ2h0UGlja2VyLm51bUNhc3RpbmdEaXJlY3Rpb25hbExpZ2h0cztcblx0XHRcdFx0dGhpcy5fcE51bVBvaW50TGlnaHRzICs9IHRoaXMuX3BMaWdodFBpY2tlci5udW1DYXN0aW5nUG9pbnRMaWdodHM7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fcE51bURpcmVjdGlvbmFsTGlnaHRzID0gMDtcblx0XHRcdHRoaXMuX3BOdW1Qb2ludExpZ2h0cyA9IDA7XG5cdFx0XHR0aGlzLl9wTnVtTGlnaHRQcm9iZXMgPSAwO1xuXHRcdH1cblxuXHRcdHRoaXMuX3BOdW1MaWdodHMgPSB0aGlzLl9wTnVtRGlyZWN0aW9uYWxMaWdodHMgKyB0aGlzLl9wTnVtUG9pbnRMaWdodHM7XG5cblx0XHRpZiAobnVtRGlyZWN0aW9uYWxMaWdodHNPbGQgIT0gdGhpcy5fcE51bURpcmVjdGlvbmFsTGlnaHRzIHx8IG51bVBvaW50TGlnaHRzT2xkICE9IHRoaXMuX3BOdW1Qb2ludExpZ2h0cyB8fCBudW1MaWdodFByb2Jlc09sZCAhPSB0aGlzLl9wTnVtTGlnaHRQcm9iZXMpXG5cdFx0XHR0aGlzLl9wSW52YWxpZGF0ZVBhc3MoKTtcblx0fVxuXHRcblx0cHJpdmF0ZSBfcmVtb3ZlRGVwZW5kZW5jeShtZXRob2RWTzpNZXRob2RWTywgZWZmZWN0c0RlcGVuZGVuY3k6Ym9vbGVhbiA9IGZhbHNlKVxuXHR7XG5cdFx0dmFyIGluZGV4Om51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MuaW5kZXhPZihtZXRob2RWTyk7XG5cblx0XHRpZiAoIWVmZmVjdHNEZXBlbmRlbmN5KVxuXHRcdFx0dGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzLS07XG5cblx0XHRtZXRob2RWTy5tZXRob2QucmVtb3ZlRXZlbnRMaXN0ZW5lcihTaGFkaW5nTWV0aG9kRXZlbnQuU0hBREVSX0lOVkFMSURBVEVELCB0aGlzLl9vblNoYWRlckludmFsaWRhdGVkRGVsZWdhdGUpO1xuXHRcdHRoaXMuX2lNZXRob2RWT3Muc3BsaWNlKGluZGV4LCAxKTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlUGFzcygpO1xuXHR9XG5cblx0cHJpdmF0ZSBfYWRkRGVwZW5kZW5jeShtZXRob2RWTzpNZXRob2RWTywgZWZmZWN0c0RlcGVuZGVuY3k6Ym9vbGVhbiA9IGZhbHNlLCBpbmRleDpudW1iZXIgPSAtMSlcblx0e1xuXHRcdG1ldGhvZFZPLm1ldGhvZC5hZGRFdmVudExpc3RlbmVyKFNoYWRpbmdNZXRob2RFdmVudC5TSEFERVJfSU5WQUxJREFURUQsIHRoaXMuX29uU2hhZGVySW52YWxpZGF0ZWREZWxlZ2F0ZSk7XG5cblx0XHRpZiAoZWZmZWN0c0RlcGVuZGVuY3kpIHtcblx0XHRcdGlmIChpbmRleCAhPSAtMSlcblx0XHRcdFx0dGhpcy5faU1ldGhvZFZPcy5zcGxpY2UoaW5kZXggKyB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aCAtIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llcywgMCwgbWV0aG9kVk8pO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aGlzLl9pTWV0aG9kVk9zLnB1c2gobWV0aG9kVk8pO1xuXHRcdFx0dGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzKys7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2lNZXRob2RWT3Muc3BsaWNlKHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoIC0gdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzLCAwLCBtZXRob2RWTyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVQYXNzKCk7XG5cdH1cblxuXHQvKipcblx0ICogQXBwZW5kcyBhbiBcImVmZmVjdFwiIHNoYWRpbmcgbWV0aG9kIHRvIHRoZSBzaGFkZXIuIEVmZmVjdCBtZXRob2RzIGFyZSB0aG9zZSB0aGF0IGRvIG5vdCBpbmZsdWVuY2UgdGhlIGxpZ2h0aW5nXG5cdCAqIGJ1dCBtb2R1bGF0ZSB0aGUgc2hhZGVkIGNvbG91ciwgdXNlZCBmb3IgZm9nLCBvdXRsaW5lcywgZXRjLiBUaGUgbWV0aG9kIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcmVzdWx0IG9mIHRoZVxuXHQgKiBtZXRob2RzIGFkZGVkIHByaW9yLlxuXHQgKi9cblx0cHVibGljIGFkZEVmZmVjdE1ldGhvZChtZXRob2Q6RWZmZWN0TWV0aG9kQmFzZSlcblx0e1xuXHRcdHRoaXMuX2FkZERlcGVuZGVuY3kobmV3IE1ldGhvZFZPKG1ldGhvZCksIHRydWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBudW1iZXIgb2YgXCJlZmZlY3RcIiBtZXRob2RzIGFkZGVkIHRvIHRoZSBtYXRlcmlhbC5cblx0ICovXG5cdHB1YmxpYyBnZXQgbnVtRWZmZWN0TWV0aG9kcygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llcztcblx0fVxuXG5cdC8qKlxuXHQgKiBRdWVyaWVzIHdoZXRoZXIgYSBnaXZlbiBlZmZlY3RzIG1ldGhvZCB3YXMgYWRkZWQgdG8gdGhlIG1hdGVyaWFsLlxuXHQgKlxuXHQgKiBAcGFyYW0gbWV0aG9kIFRoZSBtZXRob2QgdG8gYmUgcXVlcmllZC5cblx0ICogQHJldHVybiB0cnVlIGlmIHRoZSBtZXRob2Qgd2FzIGFkZGVkIHRvIHRoZSBtYXRlcmlhbCwgZmFsc2Ugb3RoZXJ3aXNlLlxuXHQgKi9cblx0cHVibGljIGhhc0VmZmVjdE1ldGhvZChtZXRob2Q6RWZmZWN0TWV0aG9kQmFzZSk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0RGVwZW5kZW5jeUZvck1ldGhvZChtZXRob2QpICE9IG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbWV0aG9kIGFkZGVkIGF0IHRoZSBnaXZlbiBpbmRleC5cblx0ICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCBvZiB0aGUgbWV0aG9kIHRvIHJldHJpZXZlLlxuXHQgKiBAcmV0dXJuIFRoZSBtZXRob2QgYXQgdGhlIGdpdmVuIGluZGV4LlxuXHQgKi9cblx0cHVibGljIGdldEVmZmVjdE1ldGhvZEF0KGluZGV4Om51bWJlcik6RWZmZWN0TWV0aG9kQmFzZVxuXHR7XG5cdFx0aWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llcyAtIDEpXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdHJldHVybiA8RWZmZWN0TWV0aG9kQmFzZT4gdGhpcy5faU1ldGhvZFZPc1tpbmRleCArIHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoIC0gdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzXS5tZXRob2Q7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyBhbiBlZmZlY3QgbWV0aG9kIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXggYW1vbmdzdCB0aGUgbWV0aG9kcyBhbHJlYWR5IGFkZGVkIHRvIHRoZSBtYXRlcmlhbC4gRWZmZWN0XG5cdCAqIG1ldGhvZHMgYXJlIHRob3NlIHRoYXQgZG8gbm90IGluZmx1ZW5jZSB0aGUgbGlnaHRpbmcgYnV0IG1vZHVsYXRlIHRoZSBzaGFkZWQgY29sb3VyLCB1c2VkIGZvciBmb2csIG91dGxpbmVzLFxuXHQgKiBldGMuIFRoZSBtZXRob2Qgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSByZXN1bHQgb2YgdGhlIG1ldGhvZHMgd2l0aCBhIGxvd2VyIGluZGV4LlxuXHQgKi9cblx0cHVibGljIGFkZEVmZmVjdE1ldGhvZEF0KG1ldGhvZDpFZmZlY3RNZXRob2RCYXNlLCBpbmRleDpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9hZGREZXBlbmRlbmN5KG5ldyBNZXRob2RWTyhtZXRob2QpLCB0cnVlLCBpbmRleCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBhbiBlZmZlY3QgbWV0aG9kIGZyb20gdGhlIG1hdGVyaWFsLlxuXHQgKiBAcGFyYW0gbWV0aG9kIFRoZSBtZXRob2QgdG8gYmUgcmVtb3ZlZC5cblx0ICovXG5cdHB1YmxpYyByZW1vdmVFZmZlY3RNZXRob2QobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UpXG5cdHtcblx0XHR2YXIgbWV0aG9kVk86TWV0aG9kVk8gPSB0aGlzLmdldERlcGVuZGVuY3lGb3JNZXRob2QobWV0aG9kKTtcblxuXHRcdGlmIChtZXRob2RWTyAhPSBudWxsKVxuXHRcdFx0dGhpcy5fcmVtb3ZlRGVwZW5kZW5jeShtZXRob2RWTywgdHJ1ZSk7XG5cdH1cblxuXG5cdHByaXZhdGUgZ2V0RGVwZW5kZW5jeUZvck1ldGhvZChtZXRob2Q6RWZmZWN0TWV0aG9kQmFzZSk6TWV0aG9kVk9cblx0e1xuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyArK2kpXG5cdFx0XHRpZiAodGhpcy5faU1ldGhvZFZPc1tpXS5tZXRob2QgPT0gbWV0aG9kKVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5faU1ldGhvZFZPc1tpXTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBtZXRob2QgdXNlZCB0byBnZW5lcmF0ZSB0aGUgcGVyLXBpeGVsIG5vcm1hbHMuIERlZmF1bHRzIHRvIE5vcm1hbEJhc2ljTWV0aG9kLlxuXHQgKi9cblx0cHVibGljIGdldCBub3JtYWxNZXRob2QoKTpOb3JtYWxCYXNpY01ldGhvZFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2lOb3JtYWxNZXRob2RWTz8gPE5vcm1hbEJhc2ljTWV0aG9kPiB0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubWV0aG9kIDogbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgbm9ybWFsTWV0aG9kKHZhbHVlOk5vcm1hbEJhc2ljTWV0aG9kKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2lOb3JtYWxNZXRob2RWTyAmJiB0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubWV0aG9kID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHRoaXMuX2lOb3JtYWxNZXRob2RWTykge1xuXHRcdFx0dGhpcy5fcmVtb3ZlRGVwZW5kZW5jeSh0aGlzLl9pTm9ybWFsTWV0aG9kVk8pO1xuXHRcdFx0dGhpcy5faU5vcm1hbE1ldGhvZFZPID0gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHRoaXMuX2lOb3JtYWxNZXRob2RWTyA9IG5ldyBNZXRob2RWTyh2YWx1ZSk7XG5cdFx0XHR0aGlzLl9hZGREZXBlbmRlbmN5KHRoaXMuX2lOb3JtYWxNZXRob2RWTyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBtZXRob2QgdGhhdCBwcm92aWRlcyB0aGUgYW1iaWVudCBsaWdodGluZyBjb250cmlidXRpb24uIERlZmF1bHRzIHRvIEFtYmllbnRCYXNpY01ldGhvZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgYW1iaWVudE1ldGhvZCgpOkFtYmllbnRCYXNpY01ldGhvZFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2lBbWJpZW50TWV0aG9kVk8/IDxBbWJpZW50QmFzaWNNZXRob2Q+IHRoaXMuX2lBbWJpZW50TWV0aG9kVk8ubWV0aG9kIDogbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgYW1iaWVudE1ldGhvZCh2YWx1ZTpBbWJpZW50QmFzaWNNZXRob2QpXG5cdHtcblx0XHRpZiAodGhpcy5faUFtYmllbnRNZXRob2RWTyAmJiB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLm1ldGhvZCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdGlmICh0aGlzLl9pQW1iaWVudE1ldGhvZFZPKSB7XG5cdFx0XHR0aGlzLl9yZW1vdmVEZXBlbmRlbmN5KHRoaXMuX2lBbWJpZW50TWV0aG9kVk8pO1xuXHRcdFx0dGhpcy5faUFtYmllbnRNZXRob2RWTyA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHR0aGlzLl9pQW1iaWVudE1ldGhvZFZPID0gbmV3IE1ldGhvZFZPKHZhbHVlKTtcblx0XHRcdHRoaXMuX2FkZERlcGVuZGVuY3kodGhpcy5faUFtYmllbnRNZXRob2RWTyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBtZXRob2QgdXNlZCB0byByZW5kZXIgc2hhZG93cyBjYXN0IG9uIHRoaXMgc3VyZmFjZSwgb3IgbnVsbCBpZiBubyBzaGFkb3dzIGFyZSB0byBiZSByZW5kZXJlZC4gRGVmYXVsdHMgdG8gbnVsbC5cblx0ICovXG5cdHB1YmxpYyBnZXQgc2hhZG93TWV0aG9kKCk6U2hhZG93TWFwTWV0aG9kQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2lTaGFkb3dNZXRob2RWTz8gPFNoYWRvd01hcE1ldGhvZEJhc2U+IHRoaXMuX2lTaGFkb3dNZXRob2RWTy5tZXRob2QgOiBudWxsO1xuXHR9XG5cblx0cHVibGljIHNldCBzaGFkb3dNZXRob2QodmFsdWU6U2hhZG93TWFwTWV0aG9kQmFzZSlcblx0e1xuXHRcdGlmICh0aGlzLl9pU2hhZG93TWV0aG9kVk8gJiYgdGhpcy5faVNoYWRvd01ldGhvZFZPLm1ldGhvZCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdGlmICh0aGlzLl9pU2hhZG93TWV0aG9kVk8pIHtcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faVNoYWRvd01ldGhvZFZPKTtcblx0XHRcdHRoaXMuX2lTaGFkb3dNZXRob2RWTyA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHR0aGlzLl9pU2hhZG93TWV0aG9kVk8gPSBuZXcgTWV0aG9kVk8odmFsdWUpO1xuXHRcdFx0dGhpcy5fYWRkRGVwZW5kZW5jeSh0aGlzLl9pU2hhZG93TWV0aG9kVk8pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHRoYXQgcHJvdmlkZXMgdGhlIGRpZmZ1c2UgbGlnaHRpbmcgY29udHJpYnV0aW9uLiBEZWZhdWx0cyB0byBEaWZmdXNlQmFzaWNNZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGRpZmZ1c2VNZXRob2QoKTpEaWZmdXNlQmFzaWNNZXRob2Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPPyA8RGlmZnVzZUJhc2ljTWV0aG9kPiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLm1ldGhvZCA6IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGRpZmZ1c2VNZXRob2QodmFsdWU6RGlmZnVzZUJhc2ljTWV0aG9kKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8gJiYgdGhpcy5faURpZmZ1c2VNZXRob2RWTy5tZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodGhpcy5faURpZmZ1c2VNZXRob2RWTykge1xuXHRcdFx0dGhpcy5fcmVtb3ZlRGVwZW5kZW5jeSh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPKTtcblx0XHRcdHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8gPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5faURpZmZ1c2VNZXRob2RWTyA9IG5ldyBNZXRob2RWTyh2YWx1ZSk7XG5cdFx0XHR0aGlzLl9hZGREZXBlbmRlbmN5KHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHRoYXQgcHJvdmlkZXMgdGhlIHNwZWN1bGFyIGxpZ2h0aW5nIGNvbnRyaWJ1dGlvbi4gRGVmYXVsdHMgdG8gU3BlY3VsYXJCYXNpY01ldGhvZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgc3BlY3VsYXJNZXRob2QoKTpTcGVjdWxhckJhc2ljTWV0aG9kXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8/IDxTcGVjdWxhckJhc2ljTWV0aG9kPiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy5tZXRob2QgOiBudWxsO1xuXHR9XG5cblx0cHVibGljIHNldCBzcGVjdWxhck1ldGhvZCh2YWx1ZTpTcGVjdWxhckJhc2ljTWV0aG9kKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPICYmIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm1ldGhvZCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdGlmICh0aGlzLl9pU3BlY3VsYXJNZXRob2RWTykge1xuXHRcdFx0dGhpcy5fcmVtb3ZlRGVwZW5kZW5jeSh0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyk7XG5cdFx0XHR0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHR0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyA9IG5ldyBNZXRob2RWTyh2YWx1ZSk7XG5cdFx0XHR0aGlzLl9hZGREZXBlbmRlbmN5KHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcblxuXHRcdHdoaWxlICh0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aClcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faU1ldGhvZFZPc1swXSk7XG5cblx0XHR0aGlzLl9pTWV0aG9kVk9zID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxsZWQgd2hlbiBhbnkgbWV0aG9kJ3Mgc2hhZGVyIGNvZGUgaXMgaW52YWxpZGF0ZWQuXG5cdCAqL1xuXHRwcml2YXRlIG9uU2hhZGVySW52YWxpZGF0ZWQoZXZlbnQ6U2hhZGluZ01ldGhvZEV2ZW50KVxuXHR7XG5cdFx0dGhpcy5fcEludmFsaWRhdGVQYXNzKCk7XG5cdH1cblxuXHQvLyBSRU5ERVIgTE9PUFxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pQWN0aXZhdGUocGFzczpNYXRlcmlhbFBhc3NEYXRhLCByZW5kZXJlcjpSZW5kZXJlckJhc2UsIGNhbWVyYTpDYW1lcmEpXG5cdHtcblx0XHRzdXBlci5faUFjdGl2YXRlKHBhc3MsIHJlbmRlcmVyLCBjYW1lcmEpO1xuXG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPO1xuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyArK2kpIHtcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcblx0XHRcdGlmIChtZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRcdG1ldGhvZFZPLm1ldGhvZC5pQWN0aXZhdGUocGFzcy5zaGFkZXJPYmplY3QsIG1ldGhvZFZPLCByZW5kZXJlci5zdGFnZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqXG5cdCAqIEBwYXJhbSByZW5kZXJhYmxlXG5cdCAqIEBwYXJhbSBzdGFnZVxuXHQgKiBAcGFyYW0gY2FtZXJhXG5cdCAqL1xuXHRwdWJsaWMgc2V0UmVuZGVyU3RhdGUocGFzczpNYXRlcmlhbFBhc3NEYXRhLCByZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBzdGFnZTpTdGFnZSwgY2FtZXJhOkNhbWVyYSwgdmlld1Byb2plY3Rpb246TWF0cml4M0QpXG5cdHtcblx0XHRzdXBlci5zZXRSZW5kZXJTdGF0ZShwYXNzLCByZW5kZXJhYmxlLCBzdGFnZSwgY2FtZXJhLCB2aWV3UHJvamVjdGlvbik7XG5cblx0XHR2YXIgbWV0aG9kVk86TWV0aG9kVk87XG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aDtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47ICsraSkge1xuXHRcdFx0bWV0aG9kVk8gPSB0aGlzLl9pTWV0aG9kVk9zW2ldO1xuXHRcdFx0aWYgKG1ldGhvZFZPLnVzZU1ldGhvZClcblx0XHRcdFx0bWV0aG9kVk8ubWV0aG9kLmlTZXRSZW5kZXJTdGF0ZShwYXNzLnNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHJlbmRlcmFibGUsIHN0YWdlLCBjYW1lcmEpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pRGVhY3RpdmF0ZShwYXNzOk1hdGVyaWFsUGFzc0RhdGEsIHJlbmRlcmVyOlJlbmRlcmVyQmFzZSlcblx0e1xuXHRcdHN1cGVyLl9pRGVhY3RpdmF0ZShwYXNzLCByZW5kZXJlcik7XG5cblx0XHR2YXIgbWV0aG9kVk86TWV0aG9kVk87XG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aDtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47ICsraSkge1xuXHRcdFx0bWV0aG9kVk8gPSB0aGlzLl9pTWV0aG9kVk9zW2ldO1xuXHRcdFx0aWYgKG1ldGhvZFZPLnVzZU1ldGhvZClcblx0XHRcdFx0bWV0aG9kVk8ubWV0aG9kLmlEZWFjdGl2YXRlKHBhc3Muc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgcmVuZGVyZXIuc3RhZ2UpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBfaUluY2x1ZGVEZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0KVxuXHR7XG5cdFx0Ly9UT0RPOiBmcmFnbWVudCBhbmltdGlvbiBzaG91bGQgYmUgY29tcGF0aWJsZSB3aXRoIGxpZ2h0aW5nIHBhc3Ncblx0XHRzaGFkZXJPYmplY3QudXNlc0ZyYWdtZW50QW5pbWF0aW9uID0gQm9vbGVhbih0aGlzLl9wYXNzTW9kZSA9PSBNYXRlcmlhbFBhc3NNb2RlLlNVUEVSX1NIQURFUik7XG5cblx0XHRpZiAoIXNoYWRlck9iamVjdC51c2VzVGFuZ2VudFNwYWNlICYmIHNoYWRlck9iamVjdC5udW1Qb2ludExpZ2h0cyA+IDAgJiYgc2hhZGVyT2JqZWN0LnVzZXNMaWdodHMpIHtcblx0XHRcdHNoYWRlck9iamVjdC5nbG9iYWxQb3NEZXBlbmRlbmNpZXMrKztcblxuXHRcdFx0aWYgKEJvb2xlYW4odGhpcy5fcGFzc01vZGUgJiBNYXRlcmlhbFBhc3NNb2RlLkVGRkVDVFMpKVxuXHRcdFx0XHRzaGFkZXJPYmplY3QudXNlc0dsb2JhbFBvc0ZyYWdtZW50ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR2YXIgaTpudW1iZXI7XG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aDtcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpXG5cdFx0XHR0aGlzLnNldHVwQW5kQ291bnREZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0LCB0aGlzLl9pTWV0aG9kVk9zW2ldKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSlcblx0XHRcdHRoaXMuX2lNZXRob2RWT3NbaV0udXNlTWV0aG9kID0gdGhpcy5faU1ldGhvZFZPc1tpXS5tZXRob2QuaUlzVXNlZChzaGFkZXJPYmplY3QpO1xuXG5cdFx0c3VwZXIuX2lJbmNsdWRlRGVwZW5kZW5jaWVzKHNoYWRlck9iamVjdCk7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBDb3VudHMgdGhlIGRlcGVuZGVuY2llcyBmb3IgYSBnaXZlbiBtZXRob2QuXG5cdCAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCB0byBjb3VudCB0aGUgZGVwZW5kZW5jaWVzIGZvci5cblx0ICogQHBhcmFtIG1ldGhvZFZPIFRoZSBtZXRob2QncyBkYXRhIGZvciB0aGlzIG1hdGVyaWFsLlxuXHQgKi9cblx0cHJpdmF0ZSBzZXR1cEFuZENvdW50RGVwZW5kZW5jaWVzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXHRcdG1ldGhvZFZPLnJlc2V0KCk7XG5cblx0XHRtZXRob2RWTy5tZXRob2QuaUluaXRWTyhzaGFkZXJPYmplY3QsIG1ldGhvZFZPKTtcblxuXHRcdGlmIChtZXRob2RWTy5uZWVkc1Byb2plY3Rpb24pXG5cdFx0XHRzaGFkZXJPYmplY3QucHJvamVjdGlvbkRlcGVuZGVuY2llcysrO1xuXG5cdFx0aWYgKG1ldGhvZFZPLm5lZWRzR2xvYmFsVmVydGV4UG9zKSB7XG5cblx0XHRcdHNoYWRlck9iamVjdC5nbG9iYWxQb3NEZXBlbmRlbmNpZXMrKztcblxuXHRcdFx0aWYgKG1ldGhvZFZPLm5lZWRzR2xvYmFsRnJhZ21lbnRQb3MpXG5cdFx0XHRcdHNoYWRlck9iamVjdC51c2VzR2xvYmFsUG9zRnJhZ21lbnQgPSB0cnVlO1xuXG5cdFx0fSBlbHNlIGlmIChtZXRob2RWTy5uZWVkc0dsb2JhbEZyYWdtZW50UG9zKSB7XG5cdFx0XHRzaGFkZXJPYmplY3QuZ2xvYmFsUG9zRGVwZW5kZW5jaWVzKys7XG5cdFx0XHRzaGFkZXJPYmplY3QudXNlc0dsb2JhbFBvc0ZyYWdtZW50ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAobWV0aG9kVk8ubmVlZHNOb3JtYWxzKVxuXHRcdFx0c2hhZGVyT2JqZWN0Lm5vcm1hbERlcGVuZGVuY2llcysrO1xuXG5cdFx0aWYgKG1ldGhvZFZPLm5lZWRzVGFuZ2VudHMpXG5cdFx0XHRzaGFkZXJPYmplY3QudGFuZ2VudERlcGVuZGVuY2llcysrO1xuXG5cdFx0aWYgKG1ldGhvZFZPLm5lZWRzVmlldylcblx0XHRcdHNoYWRlck9iamVjdC52aWV3RGlyRGVwZW5kZW5jaWVzKys7XG5cblx0XHRpZiAobWV0aG9kVk8ubmVlZHNVVilcblx0XHRcdHNoYWRlck9iamVjdC51dkRlcGVuZGVuY2llcysrO1xuXG5cdFx0aWYgKG1ldGhvZFZPLm5lZWRzU2Vjb25kYXJ5VVYpXG5cdFx0XHRzaGFkZXJPYmplY3Quc2Vjb25kYXJ5VVZEZXBlbmRlbmNpZXMrKztcblx0fVxuXG5cdHB1YmxpYyBfaUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cblx0XHRpZiAodGhpcy5faUFtYmllbnRNZXRob2RWTyAmJiB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLnVzZU1ldGhvZClcblx0XHRcdGNvZGUgKz0gdGhpcy5faUFtYmllbnRNZXRob2RWTy5tZXRob2QuaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0aWYgKHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8gJiYgdGhpcy5faURpZmZ1c2VNZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRjb2RlICs9IHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kLmlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faURpZmZ1c2VNZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdGlmICh0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyAmJiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRjb2RlICs9IHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm1ldGhvZC5pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQcmVMaWdodGluZ0ZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cblx0XHRpZiAodGhpcy5faUFtYmllbnRNZXRob2RWTyAmJiB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLnVzZU1ldGhvZCkge1xuXHRcdFx0Y29kZSArPSB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLm1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUFtYmllbnRNZXRob2RWTywgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCwgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdFx0aWYgKHRoaXMuX2lBbWJpZW50TWV0aG9kVk8ubmVlZHNOb3JtYWxzKVxuXHRcdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy5ub3JtYWxGcmFnbWVudCk7XG5cblx0XHRcdGlmICh0aGlzLl9pQW1iaWVudE1ldGhvZFZPLm5lZWRzVmlldylcblx0XHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMudmlld0RpckZyYWdtZW50KTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5faURpZmZ1c2VNZXRob2RWTyAmJiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLnVzZU1ldGhvZClcblx0XHRcdGNvZGUgKz0gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUoPFNoYWRlckxpZ2h0aW5nT2JqZWN0PiBzaGFkZXJPYmplY3QsIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8gJiYgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8udXNlTWV0aG9kKVxuXHRcdFx0Y29kZSArPSAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUoPFNoYWRlckxpZ2h0aW5nT2JqZWN0PiBzaGFkZXJPYmplY3QsIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQZXJMaWdodERpZmZ1c2VGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBsaWdodERpclJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIGRpZmZ1c2VDb2xvclJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRDb2RlUGVyTGlnaHQoc2hhZGVyT2JqZWN0LCB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLCBsaWdodERpclJlZywgZGlmZnVzZUNvbG9yUmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UGVyTGlnaHRTcGVjdWxhckZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIGxpZ2h0RGlyUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgc3BlY3VsYXJDb2xvclJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm1ldGhvZCkuaUdldEZyYWdtZW50Q29kZVBlckxpZ2h0KHNoYWRlck9iamVjdCwgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8sIGxpZ2h0RGlyUmVnLCBzcGVjdWxhckNvbG9yUmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UGVyUHJvYmVEaWZmdXNlRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgdGV4UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgd2VpZ2h0UmVnOnN0cmluZywgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faURpZmZ1c2VNZXRob2RWTy5tZXRob2QpLmlHZXRGcmFnbWVudENvZGVQZXJQcm9iZShzaGFkZXJPYmplY3QsIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8sIHRleFJlZywgd2VpZ2h0UmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UGVyUHJvYmVTcGVjdWxhckZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIHRleFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHdlaWdodFJlZzpzdHJpbmcsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLm1ldGhvZCkuaUdldEZyYWdtZW50Q29kZVBlclByb2JlKHNoYWRlck9iamVjdCwgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8sIHRleFJlZywgd2VpZ2h0UmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UG9zdExpZ2h0aW5nVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXG5cdFx0aWYgKHRoaXMuX2lTaGFkb3dNZXRob2RWTylcblx0XHRcdGNvZGUgKz0gdGhpcy5faVNoYWRvd01ldGhvZFZPLm1ldGhvZC5pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lTaGFkb3dNZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UG9zdExpZ2h0aW5nRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cblx0XHRpZiAoc2hhZGVyT2JqZWN0LnVzZUFscGhhUHJlbXVsdGlwbGllZCAmJiB0aGlzLl9wRW5hYmxlQmxlbmRpbmcpIHtcblx0XHRcdGNvZGUgKz0gXCJhZGQgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIudywgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIudywgXCIgKyBzaGFyZWRSZWdpc3RlcnMuY29tbW9ucyArIFwiLnpcXG5cIiArXG5cdFx0XHRcdFwiZGl2IFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiLnh5eiwgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiLndcXG5cIiArXG5cdFx0XHRcdFwic3ViIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiLncsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiLncsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLmNvbW1vbnMgKyBcIi56XFxuXCIgK1xuXHRcdFx0XHRcInNhdCBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIi54eXosIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiXFxuXCI7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2lTaGFkb3dNZXRob2RWTylcblx0XHRcdGNvZGUgKz0gdGhpcy5faVNoYWRvd01ldGhvZFZPLm1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faVNoYWRvd01ldGhvZFZPLCBzaGFyZWRSZWdpc3RlcnMuc2hhZG93VGFyZ2V0LCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0aWYgKHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8gJiYgdGhpcy5faURpZmZ1c2VNZXRob2RWTy51c2VNZXRob2QpIHtcblx0XHRcdGNvZGUgKz0gKDxMaWdodGluZ01ldGhvZEJhc2U+IHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRQb3N0TGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faURpZmZ1c2VNZXRob2RWTywgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCwgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdFx0Ly8gcmVzb2x2ZSBvdGhlciBkZXBlbmRlbmNpZXMgYXMgd2VsbD9cblx0XHRcdGlmICh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLm5lZWRzTm9ybWFscylcblx0XHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMubm9ybWFsRnJhZ21lbnQpO1xuXG5cdFx0XHRpZiAodGhpcy5faURpZmZ1c2VNZXRob2RWTy5uZWVkc1ZpZXcpXG5cdFx0XHRcdHJlZ2lzdGVyQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLnZpZXdEaXJGcmFnbWVudCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPICYmIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLnVzZU1ldGhvZCkge1xuXHRcdFx0Y29kZSArPSAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRQb3N0TGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8sIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cdFx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubmVlZHNOb3JtYWxzKVxuXHRcdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy5ub3JtYWxGcmFnbWVudCk7XG5cdFx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubmVlZHNWaWV3KVxuXHRcdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy52aWV3RGlyRnJhZ21lbnQpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9pU2hhZG93TWV0aG9kVk8pXG5cdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy5zaGFkb3dUYXJnZXQpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IG5vcm1hbHMgYXJlIGFsbG93ZWQgaW4gdGFuZ2VudCBzcGFjZS4gVGhpcyBpcyBvbmx5IHRoZSBjYXNlIGlmIG5vIG9iamVjdC1zcGFjZVxuXHQgKiBkZXBlbmRlbmNpZXMgZXhpc3QuXG5cdCAqL1xuXHRwdWJsaWMgX3BVc2VzVGFuZ2VudFNwYWNlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCk6Ym9vbGVhblxuXHR7XG5cdFx0aWYgKHNoYWRlck9iamVjdC51c2VzUHJvYmVzKVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPO1xuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyArK2kpIHtcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcblx0XHRcdGlmIChtZXRob2RWTy51c2VNZXRob2QgJiYgIW1ldGhvZFZPLm1ldGhvZC5pVXNlc1RhbmdlbnRTcGFjZSgpKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IG5vcm1hbHMgYXJlIG91dHB1dCBpbiB0YW5nZW50IHNwYWNlLlxuXHQgKi9cblx0cHVibGljIF9wT3V0cHV0c1RhbmdlbnROb3JtYWxzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gKDxOb3JtYWxCYXNpY01ldGhvZD4gdGhpcy5faU5vcm1hbE1ldGhvZFZPLm1ldGhvZCkuaU91dHB1dHNUYW5nZW50Tm9ybWFscygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBub3JtYWxzIGFyZSBvdXRwdXQgYnkgdGhlIHBhc3MuXG5cdCAqL1xuXHRwdWJsaWMgX3BPdXRwdXRzTm9ybWFscyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2lOb3JtYWxNZXRob2RWTyAmJiB0aGlzLl9pTm9ybWFsTWV0aG9kVk8udXNlTWV0aG9kO1xuXHR9XG5cblxuXHRwdWJsaWMgX2lHZXROb3JtYWxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2lOb3JtYWxNZXRob2RWTy5tZXRob2QuaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pTm9ybWFsTWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXROb3JtYWxGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSB0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubWV0aG9kLmlHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pTm9ybWFsTWV0aG9kVk8sIHNoYXJlZFJlZ2lzdGVycy5ub3JtYWxGcmFnbWVudCwgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdGlmICh0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubmVlZHNWaWV3KVxuXHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMudmlld0RpckZyYWdtZW50KTtcblxuXHRcdGlmICh0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubmVlZHNHbG9iYWxGcmFnbWVudFBvcyB8fCB0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubmVlZHNHbG9iYWxWZXJ0ZXhQb3MpXG5cdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZVZlcnRleFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMuZ2xvYmFsUG9zaXRpb25WZXJ0ZXgpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ0NhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZzpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblx0XHR2YXIgbWV0aG9kVk86TWV0aG9kVk87XG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aDtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IGxlbiAtIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llczsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRtZXRob2RWTyA9IHRoaXMuX2lNZXRob2RWT3NbaV07XG5cdFx0XHRpZiAobWV0aG9kVk8udXNlTWV0aG9kKSB7XG5cdFx0XHRcdGNvZGUgKz0gbWV0aG9kVk8ubWV0aG9kLmlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHJlZ0NhY2hlLCBzaGFyZWRSZWcpO1xuXG5cdFx0XHRcdGlmIChtZXRob2RWTy5uZWVkc0dsb2JhbFZlcnRleFBvcyB8fCBtZXRob2RWTy5uZWVkc0dsb2JhbEZyYWdtZW50UG9zKVxuXHRcdFx0XHRcdHJlZ0NhY2hlLnJlbW92ZVZlcnRleFRlbXBVc2FnZShzaGFyZWRSZWcuZ2xvYmFsUG9zaXRpb25WZXJ0ZXgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTyAmJiB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRjb2RlICs9IHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPLm1ldGhvZC5pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPLCByZWdDYWNoZSwgc2hhcmVkUmVnKTtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ0NhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZzpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblx0XHR2YXIgYWxwaGFSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50O1xuXG5cdFx0aWYgKHRoaXMucHJlc2VydmVBbHBoYSAmJiB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXMgPiAwKSB7XG5cdFx0XHRhbHBoYVJlZyA9IHJlZ0NhY2hlLmdldEZyZWVGcmFnbWVudFNpbmdsZVRlbXAoKTtcblx0XHRcdHJlZ0NhY2hlLmFkZEZyYWdtZW50VGVtcFVzYWdlcyhhbHBoYVJlZywgMSk7XG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgYWxwaGFSZWcgKyBcIiwgXCIgKyBzaGFyZWRSZWcuc2hhZGVkVGFyZ2V0ICsgXCIud1xcblwiO1xuXHRcdH1cblxuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTztcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gbGVuIC0gdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcblx0XHRcdGlmIChtZXRob2RWTy51c2VNZXRob2QpIHtcblx0XHRcdFx0Y29kZSArPSBtZXRob2RWTy5tZXRob2QuaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCBzaGFyZWRSZWcuc2hhZGVkVGFyZ2V0LCByZWdDYWNoZSwgc2hhcmVkUmVnKTtcblxuXHRcdFx0XHRpZiAobWV0aG9kVk8ubmVlZHNOb3JtYWxzKVxuXHRcdFx0XHRcdHJlZ0NhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZy5ub3JtYWxGcmFnbWVudCk7XG5cblx0XHRcdFx0aWYgKG1ldGhvZFZPLm5lZWRzVmlldylcblx0XHRcdFx0XHRyZWdDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWcudmlld0RpckZyYWdtZW50KTtcblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnByZXNlcnZlQWxwaGEgJiYgdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzID4gMCkge1xuXHRcdFx0Y29kZSArPSBcIm1vdiBcIiArIHNoYXJlZFJlZy5zaGFkZWRUYXJnZXQgKyBcIi53LCBcIiArIGFscGhhUmVnICsgXCJcXG5cIjtcblx0XHRcdHJlZ0NhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKGFscGhhUmVnKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8gJiYgdGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8udXNlTWV0aG9kKVxuXHRcdFx0Y29kZSArPSB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTy5tZXRob2QuaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPLCBzaGFyZWRSZWcuc2hhZGVkVGFyZ2V0LCByZWdDYWNoZSwgc2hhcmVkUmVnKTtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc2hhZGVyIHVzZXMgYW55IHNoYWRvd3MuXG5cdCAqL1xuXHRwdWJsaWMgX2lVc2VzU2hhZG93cygpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiBCb29sZWFuKHRoaXMuX2lTaGFkb3dNZXRob2RWTyB8fCB0aGlzLmxpZ2h0UGlja2VyLmNhc3RpbmdEaXJlY3Rpb25hbExpZ2h0cy5sZW5ndGggPiAwIHx8IHRoaXMubGlnaHRQaWNrZXIuY2FzdGluZ1BvaW50TGlnaHRzLmxlbmd0aCA+IDApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzaGFkZXIgdXNlcyBhbnkgc3BlY3VsYXIgY29tcG9uZW50LlxuXHQgKi9cblx0cHVibGljIF9pVXNlc1NwZWN1bGFyKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5faVNwZWN1bGFyTWV0aG9kVk8pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhbGN1bGF0ZXMgdGhlIGFtb3VudCBvZiBkaXJlY3Rpb25hbCBsaWdodHMgdGhpcyBtYXRlcmlhbCB3aWxsIHN1cHBvcnQuXG5cdCAqIEBwYXJhbSBudW1EaXJlY3Rpb25hbExpZ2h0cyBUaGUgbWF4aW11bSBhbW91bnQgb2YgZGlyZWN0aW9uYWwgbGlnaHRzIHRvIHN1cHBvcnQuXG5cdCAqIEByZXR1cm4gVGhlIGFtb3VudCBvZiBkaXJlY3Rpb25hbCBsaWdodHMgdGhpcyBtYXRlcmlhbCB3aWxsIHN1cHBvcnQsIGJvdW5kZWQgYnkgdGhlIGFtb3VudCBuZWNlc3NhcnkuXG5cdCAqL1xuXHRwcml2YXRlIGNhbGN1bGF0ZU51bURpcmVjdGlvbmFsTGlnaHRzKG51bURpcmVjdGlvbmFsTGlnaHRzOm51bWJlcik6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gTWF0aC5taW4obnVtRGlyZWN0aW9uYWxMaWdodHMgLSB0aGlzLmRpcmVjdGlvbmFsTGlnaHRzT2Zmc2V0LCB0aGlzLl9tYXhMaWdodHMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhbGN1bGF0ZXMgdGhlIGFtb3VudCBvZiBwb2ludCBsaWdodHMgdGhpcyBtYXRlcmlhbCB3aWxsIHN1cHBvcnQuXG5cdCAqIEBwYXJhbSBudW1EaXJlY3Rpb25hbExpZ2h0cyBUaGUgbWF4aW11bSBhbW91bnQgb2YgcG9pbnQgbGlnaHRzIHRvIHN1cHBvcnQuXG5cdCAqIEByZXR1cm4gVGhlIGFtb3VudCBvZiBwb2ludCBsaWdodHMgdGhpcyBtYXRlcmlhbCB3aWxsIHN1cHBvcnQsIGJvdW5kZWQgYnkgdGhlIGFtb3VudCBuZWNlc3NhcnkuXG5cdCAqL1xuXHRwcml2YXRlIGNhbGN1bGF0ZU51bVBvaW50TGlnaHRzKG51bVBvaW50TGlnaHRzOm51bWJlcik6bnVtYmVyXG5cdHtcblx0XHR2YXIgbnVtRnJlZTpudW1iZXIgPSB0aGlzLl9tYXhMaWdodHMgLSB0aGlzLl9wTnVtRGlyZWN0aW9uYWxMaWdodHM7XG5cdFx0cmV0dXJuIE1hdGgubWluKG51bVBvaW50TGlnaHRzIC0gdGhpcy5wb2ludExpZ2h0c09mZnNldCwgbnVtRnJlZSk7XG5cdH1cblxuXHQvKipcblx0ICogQ2FsY3VsYXRlcyB0aGUgYW1vdW50IG9mIGxpZ2h0IHByb2JlcyB0aGlzIG1hdGVyaWFsIHdpbGwgc3VwcG9ydC5cblx0ICogQHBhcmFtIG51bURpcmVjdGlvbmFsTGlnaHRzIFRoZSBtYXhpbXVtIGFtb3VudCBvZiBsaWdodCBwcm9iZXMgdG8gc3VwcG9ydC5cblx0ICogQHJldHVybiBUaGUgYW1vdW50IG9mIGxpZ2h0IHByb2JlcyB0aGlzIG1hdGVyaWFsIHdpbGwgc3VwcG9ydCwgYm91bmRlZCBieSB0aGUgYW1vdW50IG5lY2Vzc2FyeS5cblx0ICovXG5cdHByaXZhdGUgY2FsY3VsYXRlTnVtUHJvYmVzKG51bUxpZ2h0UHJvYmVzOm51bWJlcik6bnVtYmVyXG5cdHtcblx0XHR2YXIgbnVtQ2hhbm5lbHM6bnVtYmVyID0gMDtcblx0XHQvL1x0XHRcdGlmICgodGhpcy5fcFNwZWN1bGFyTGlnaHRTb3VyY2VzICYgTGlnaHRTb3VyY2VzLlBST0JFUykgIT0gMClcblx0XHQvL1x0XHRcdFx0KytudW1DaGFubmVscztcblx0XHQvL1xuXHRcdC8vXHRcdFx0aWYgKCh0aGlzLl9wRGlmZnVzZUxpZ2h0U291cmNlcyAmIExpZ2h0U291cmNlcy5QUk9CRVMpICE9IDApXG5cdFx0Ly9cdFx0XHRcdCsrbnVtQ2hhbm5lbHM7XG5cblx0XHQvLyA0IGNoYW5uZWxzIGF2YWlsYWJsZVxuXHRcdHJldHVybiBNYXRoLm1pbihudW1MaWdodFByb2JlcyAtIHRoaXMubGlnaHRQcm9iZXNPZmZzZXQsICg0L251bUNoYW5uZWxzKSB8IDApO1xuXHR9XG59XG5cbmV4cG9ydCA9IFRyaWFuZ2xlTWV0aG9kUGFzczsiXX0=