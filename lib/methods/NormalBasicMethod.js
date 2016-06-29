"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ShadingMethodBase_1 = require("../methods/ShadingMethodBase");
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
            methodVO.textureGL = shader.getAbstraction(this._texture);
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
            methodVO.textureGL.activate(methodVO.pass._render);
    };
    NormalBasicMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        if (this._texture)
            methodVO.textureGL._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    NormalBasicMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        if (this._texture)
            code += methodVO.textureGL._iGetFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying);
        code += "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx\n" +
            "nrm " + targetReg + ".xyz, " + targetReg + "\n";
        return code;
    };
    return NormalBasicMethod;
}(ShadingMethodBase_1.ShadingMethodBase));
exports.NormalBasicMethod = NormalBasicMethod;
