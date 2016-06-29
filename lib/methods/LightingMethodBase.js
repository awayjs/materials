"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ShadingMethodBase_1 = require("../methods/ShadingMethodBase");
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
}(ShadingMethodBase_1.ShadingMethodBase));
exports.LightingMethodBase = LightingMethodBase;
