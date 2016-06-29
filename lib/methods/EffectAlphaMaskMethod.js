"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EffectMethodBase_1 = require("../methods/EffectMethodBase");
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
        methodVO.textureGL = shader.getAbstraction(this._texture);
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
        return methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, this._useSecondaryUV ? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying) +
            "mul " + targetReg + ", " + targetReg + ", " + temp + ".x\n";
    };
    /**
     * @inheritDoc
     */
    EffectAlphaMaskMethod.prototype.iActivate = function (shader, methodVO, stage) {
        _super.prototype.iActivate.call(this, shader, methodVO, stage);
        methodVO.textureGL.activate(methodVO.pass._render);
    };
    EffectAlphaMaskMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        methodVO.textureGL._setRenderState(renderable);
    };
    return EffectAlphaMaskMethod;
}(EffectMethodBase_1.EffectMethodBase));
exports.EffectAlphaMaskMethod = EffectAlphaMaskMethod;
