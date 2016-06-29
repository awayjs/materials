"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NormalBasicMethod_1 = require("../methods/NormalBasicMethod");
/**
 * NormalHeightMapMethod provides a normal map method that uses a height map to calculate the normals.
 */
var NormalHeightMapMethod = (function (_super) {
    __extends(NormalHeightMapMethod, _super);
    /**
     * Creates a new NormalHeightMapMethod method.
     *
     * @param heightMap The texture containing the height data. 0 means low, 1 means high.
     * @param worldWidth The width of the 'world'. This is used to map uv coordinates' u component to scene dimensions.
     * @param worldHeight The height of the 'world'. This is used to map the height map values to scene dimensions.
     * @param worldDepth The depth of the 'world'. This is used to map uv coordinates' v component to scene dimensions.
     */
    function NormalHeightMapMethod(heightMap, worldWidth, worldHeight, worldDepth) {
        _super.call(this);
        this.texture = heightMap;
        this._worldXYRatio = worldWidth / worldHeight;
        this._worldXZRatio = worldDepth / worldHeight;
    }
    /**
     * @inheritDoc
     */
    NormalHeightMapMethod.prototype.iInitConstants = function (shader, methodVO) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = 1 / this.texture.image2D.width;
        data[index + 1] = 1 / this.texture.image2D.height;
        data[index + 2] = 0;
        data[index + 3] = 1;
        data[index + 4] = this._worldXYRatio;
        data[index + 5] = this._worldXZRatio;
    };
    Object.defineProperty(NormalHeightMapMethod.prototype, "tangentSpace", {
        /**
         * @inheritDoc
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    NormalHeightMapMethod.prototype.copyFrom = function (method) {
        _super.prototype.copyFrom.call(this, method);
        this._worldXYRatio = method._worldXYRatio;
        this._worldXZRatio = method._worldXZRatio;
    };
    /**
     * @inheritDoc
     */
    NormalHeightMapMethod.prototype.iGetFragmentCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var temp = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp, 1);
        var dataReg = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = dataReg.index * 4;
        code += methodVO.textureGL._iGetFragmentCode(targetReg, registerCache, sharedRegisters, sharedRegisters.uvVarying) +
            "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".xzzz\n" +
            methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) +
            "sub " + targetReg + ".x, " + targetReg + ".x, " + temp + ".x\n" +
            "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".zyzz\n" +
            methodVO.textureGL._iGetFragmentCode(temp, registerCache, sharedRegisters, temp) +
            "sub " + targetReg + ".z, " + targetReg + ".z, " + temp + ".x\n" +
            "mov " + targetReg + ".y, " + dataReg + ".w\n" +
            "mul " + targetReg + ".xz, " + targetReg + ".xz, " + dataReg2 + ".xy\n" +
            "nrm " + targetReg + ".xyz, " + targetReg + ".xyz\n";
        registerCache.removeFragmentTempUsage(temp);
        return code;
    };
    return NormalHeightMapMethod;
}(NormalBasicMethod_1.NormalBasicMethod));
exports.NormalHeightMapMethod = NormalHeightMapMethod;
