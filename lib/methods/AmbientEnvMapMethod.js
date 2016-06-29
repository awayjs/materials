"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("@awayjs/core/lib/events/AssetEvent");
var AmbientBasicMethod_1 = require("../methods/AmbientBasicMethod");
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
            methodVO.textureGL = shader.getAbstraction(this._texture);
            shader.uvDependencies++;
        }
        else if (methodVO.textureGL) {
            methodVO.textureGL.onClear(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.CLEAR, this._texture));
            methodVO.textureGL = null;
        }
    };
    /**
     * @inheritDoc
     */
    AmbientEnvMapMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, regCache, sharedRegisters) {
        return (this._texture) ? methodVO.textureGL._iGetFragmentCode(targetReg, regCache, sharedRegisters, sharedRegisters.normalFragment) : "";
    };
    return AmbientEnvMapMethod;
}(AmbientBasicMethod_1.AmbientBasicMethod));
exports.AmbientEnvMapMethod = AmbientEnvMapMethod;
