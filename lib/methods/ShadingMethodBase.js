"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetBase_1 = require("@awayjs/core/lib/library/AssetBase");
var ShadingMethodEvent_1 = require("@awayjs/renderer/lib/events/ShadingMethodEvent");
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
        this.dispatchEvent(new ShadingMethodEvent_1.ShadingMethodEvent(ShadingMethodEvent_1.ShadingMethodEvent.SHADER_INVALIDATED));
    };
    /**
     * Copies the state from a ShadingMethodBase object into the current object.
     */
    ShadingMethodBase.prototype.copyFrom = function (method) {
    };
    ShadingMethodBase.assetType = "[asset ShadingMethod]";
    return ShadingMethodBase;
}(AssetBase_1.AssetBase));
exports.ShadingMethodBase = ShadingMethodBase;
