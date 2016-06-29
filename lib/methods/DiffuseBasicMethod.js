"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("@awayjs/core/lib/events/AssetEvent");
var LightingMethodBase_1 = require("../methods/LightingMethodBase");
/**
 * DiffuseBasicMethod provides the default shading method for Lambert (dot3) diffuse lighting.
 */
var DiffuseBasicMethod = (function (_super) {
    __extends(DiffuseBasicMethod, _super);
    /**
     * Creates a new DiffuseBasicMethod object.
     */
    function DiffuseBasicMethod() {
        _super.call(this);
        this._multiply = true;
        this._ambientColorR = 1;
        this._ambientColorG = 1;
        this._ambientColorB = 1;
        this._color = 0xffffff;
        this._colorR = 1;
        this._colorG = 1;
        this._colorB = 1;
    }
    DiffuseBasicMethod.prototype.iIsUsed = function (shader) {
        if (!shader.numLights)
            return false;
        return true;
    };
    Object.defineProperty(DiffuseBasicMethod.prototype, "multiply", {
        /**
         * Set internally if diffuse color component multiplies or replaces the ambient color
         */
        get: function () {
            return this._multiply;
        },
        set: function (value) {
            if (this._multiply == value)
                return;
            this._multiply = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    DiffuseBasicMethod.prototype.iInitVO = function (shader, methodVO) {
        if (this._texture) {
            methodVO.textureGL = shader.getAbstraction(this._texture);
            shader.uvDependencies++;
        }
        else if (methodVO.textureGL) {
            methodVO.textureGL.onClear(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.CLEAR, null));
            methodVO.textureGL = null;
        }
        if (shader.numLights > 0) {
            shader.usesCommonData = true;
            methodVO.needsNormals = true;
        }
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iInitConstants = function (shader, methodVO) {
        if (shader.numLights > 0) {
            this._ambientColor = methodVO.pass._surface.style.color;
            this.updateAmbientColor();
        }
        else {
            this._ambientColor = null;
        }
    };
    Object.defineProperty(DiffuseBasicMethod.prototype, "color", {
        /**
         * The color of the diffuse reflection when not using a texture.
         */
        get: function () {
            return this._color;
        },
        set: function (value) {
            if (this._color == value)
                return;
            this._color = value;
            this.updateColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseBasicMethod.prototype, "texture", {
        /**
         * The texture to use to define the diffuse reflection color per texel.
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
    DiffuseBasicMethod.prototype.dispose = function () {
        this._texture = null;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.copyFrom = function (method) {
        var diff = method;
        this.texture = diff.texture;
        this.multiply = diff.multiply;
        this.color = diff.color;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._pTotalLightColorReg = null;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iGetFragmentPreLightingCode = function (shader, methodVO, registerCache, sharedRegisters) {
        var code = "";
        this._pIsFirstLight = true;
        registerCache.addFragmentTempUsages(this._pTotalLightColorReg = registerCache.getFreeFragmentVectorTemp(), 1);
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iGetFragmentCodePerLight = function (shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
        var code = "";
        var t;
        // write in temporary if not first light, so we can add to total diffuse colour
        if (this._pIsFirstLight) {
            t = this._pTotalLightColorReg;
        }
        else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }
        code += "dp3 " + t + ".x, " + lightDirReg + ", " + sharedRegisters.normalFragment + "\n" +
            "max " + t + ".w, " + t + ".x, " + sharedRegisters.commons + ".y\n";
        if (shader.usesLightFallOff)
            code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);
        code += "mul " + t + ", " + t + ".w, " + lightColReg + "\n";
        if (!this._pIsFirstLight) {
            code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
            registerCache.removeFragmentTempUsage(t);
        }
        this._pIsFirstLight = false;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iGetFragmentCodePerProbe = function (shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
        var code = "";
        var t;
        // write in temporary if not first light, so we can add to total diffuse colour
        if (this._pIsFirstLight) {
            t = this._pTotalLightColorReg;
        }
        else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }
        code += "tex " + t + ", " + sharedRegisters.normalFragment + ", " + cubeMapReg + " <cube,linear,miplinear>\n" +
            "mul " + t + ".xyz, " + t + ".xyz, " + weightRegister + "\n";
        if (this._iModulateMethod != null)
            code += this._iModulateMethod(shader, methodVO, t, registerCache, sharedRegisters);
        if (!this._pIsFirstLight) {
            code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
            registerCache.removeFragmentTempUsage(t);
        }
        this._pIsFirstLight = false;
        return code;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iGetFragmentPostLightingCode = function (shader, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var diffuseColor;
        var cutOffReg;
        // incorporate input from ambient
        if (sharedRegisters.shadowTarget)
            code += this.pApplyShadow(shader, methodVO, registerCache, sharedRegisters);
        registerCache.addFragmentTempUsages(diffuseColor = registerCache.getFreeFragmentVectorTemp(), 1);
        var ambientColorRegister = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = ambientColorRegister.index * 4;
        if (this._texture) {
            code += methodVO.textureGL._iGetFragmentCode(diffuseColor, registerCache, sharedRegisters, sharedRegisters.uvVarying);
        }
        else {
            var diffuseInputRegister = registerCache.getFreeFragmentConstant();
            code += "mov " + diffuseColor + ", " + diffuseInputRegister + "\n";
        }
        code += "sat " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + "\n" +
            "mul " + diffuseColor + ".xyz, " + diffuseColor + ", " + this._pTotalLightColorReg + "\n";
        if (this._multiply) {
            code += "add " + diffuseColor + ".xyz, " + diffuseColor + ", " + ambientColorRegister + "\n" +
                "mul " + targetReg + ".xyz, " + targetReg + ", " + diffuseColor + "\n";
        }
        else if (this._texture) {
            code += "mul " + targetReg + ".xyz, " + targetReg + ", " + ambientColorRegister + "\n" +
                "mul " + this._pTotalLightColorReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" +
                "sub " + targetReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" +
                "add " + targetReg + ".xyz, " + targetReg + ", " + diffuseColor + "\n"; //add diffuse color and ambient color
        }
        else {
            code += "mul " + this._pTotalLightColorReg + ".xyz, " + ambientColorRegister + ", " + this._pTotalLightColorReg + "\n" +
                "sub " + this._pTotalLightColorReg + ".xyz, " + ambientColorRegister + ", " + this._pTotalLightColorReg + "\n" +
                "add " + diffuseColor + ".xyz, " + diffuseColor + ", " + this._pTotalLightColorReg + "\n" +
                "mul " + targetReg + ".xyz, " + targetReg + ", " + diffuseColor + "\n"; // multiply by target which could be texture or white
        }
        registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
        registerCache.removeFragmentTempUsage(diffuseColor);
        return code;
    };
    /**
     * Generate the code that applies the calculated shadow to the diffuse light
     * @param methodVO The MethodVO object for which the compilation is currently happening.
     * @param regCache The register cache the compiler is currently using for the register management.
     */
    DiffuseBasicMethod.prototype.pApplyShadow = function (shader, methodVO, regCache, sharedRegisters) {
        return "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iActivate = function (shader, methodVO, stage) {
        if (this._texture) {
            methodVO.textureGL.activate(methodVO.pass._render);
        }
        else {
            var index = methodVO.fragmentConstantsIndex;
            var data = shader.fragmentConstantData;
            if (this._multiply) {
                data[index + 4] = this._colorR * this._ambientColorR;
                data[index + 5] = this._colorG * this._ambientColorG;
                data[index + 6] = this._colorB * this._ambientColorB;
            }
            else {
                data[index + 4] = this._colorR;
                data[index + 5] = this._colorG;
                data[index + 6] = this._colorB;
            }
            data[index + 7] = 1;
        }
    };
    /**
     * Updates the diffuse color data used by the render state.
     */
    DiffuseBasicMethod.prototype.updateColor = function () {
        this._colorR = ((this._color >> 16) & 0xff) / 0xff;
        this._colorG = ((this._color >> 8) & 0xff) / 0xff;
        this._colorB = (this._color & 0xff) / 0xff;
    };
    /**
     * Updates the ambient color data used by the render state.
     */
    DiffuseBasicMethod.prototype.updateAmbientColor = function () {
        this._ambientColorR = ((this._ambientColor >> 16) & 0xff) / 0xff;
        this._ambientColorG = ((this._ambientColor >> 8) & 0xff) / 0xff;
        this._ambientColorB = (this._ambientColor & 0xff) / 0xff;
    };
    /**
     * @inheritDoc
     */
    DiffuseBasicMethod.prototype.iSetRenderState = function (shader, methodVO, renderable, stage, camera) {
        if (this._texture)
            methodVO.textureGL._setRenderState(renderable);
        //TODO move this to Activate (ambientR/G/B currently calc'd in render state)
        var index = methodVO.fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = shader.ambientR * this._ambientColorR;
        data[index + 1] = shader.ambientG * this._ambientColorG;
        data[index + 2] = shader.ambientB * this._ambientColorB;
        data[index + 3] = 1;
    };
    return DiffuseBasicMethod;
}(LightingMethodBase_1.LightingMethodBase));
exports.DiffuseBasicMethod = DiffuseBasicMethod;
