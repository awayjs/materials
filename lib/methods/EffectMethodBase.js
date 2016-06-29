"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractMethodError_1 = require("@awayjs/core/lib/errors/AbstractMethodError");
var ShadingMethodBase_1 = require("../methods/ShadingMethodBase");
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
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    EffectMethodBase.assetType = "[asset EffectMethod]";
    return EffectMethodBase;
}(ShadingMethodBase_1.ShadingMethodBase));
exports.EffectMethodBase = EffectMethodBase;
