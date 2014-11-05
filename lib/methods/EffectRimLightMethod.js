var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
/**
 * EffectRimLightMethod provides a method to add rim lighting to a material. This adds a glow-like effect to edges of objects.
 */
var EffectRimLightMethod = (function (_super) {
    __extends(EffectRimLightMethod, _super);
    /**
     * Creates a new <code>EffectRimLightMethod</code> object.
     *
     * @param color The colour of the rim light.
     * @param strength The strength of the rim light.
     * @param power The power of the rim light. Higher values will result in a higher edge fall-off.
     * @param blend The blend mode with which to add the light to the object.
     */
    function EffectRimLightMethod(color, strength, power, blend) {
        if (color === void 0) { color = 0xffffff; }
        if (strength === void 0) { strength = .4; }
        if (power === void 0) { power = 2; }
        if (blend === void 0) { blend = "mix"; }
        _super.call(this);
        this._blendMode = blend;
        this._strength = strength;
        this._power = power;
        this.color = color;
    }
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 3] = 1;
    };
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsNormals = true;
        methodVO.needsView = true;
    };
    Object.defineProperty(EffectRimLightMethod.prototype, "blendMode", {
        /**
         * The blend mode with which to add the light to the object.
         *
         * EffectRimLightMethod.MULTIPLY multiplies the rim light with the material's colour.
         * EffectRimLightMethod.ADD adds the rim light with the material's colour.
         * EffectRimLightMethod.MIX provides normal alpha blending.
         */
        get: function () {
            return this._blendMode;
        },
        set: function (value) {
            if (this._blendMode == value)
                return;
            this._blendMode = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRimLightMethod.prototype, "color", {
        /**
         * The color of the rim light.
         */
        get: function () {
            return this._color;
        },
        set: function (value /*uint*/) {
            this._color = value;
            this._colorR = ((value >> 16) & 0xff) / 0xff;
            this._colorG = ((value >> 8) & 0xff) / 0xff;
            this._colorB = (value & 0xff) / 0xff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRimLightMethod.prototype, "strength", {
        /**
         * The strength of the rim light.
         */
        get: function () {
            return this._strength;
        },
        set: function (value) {
            this._strength = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectRimLightMethod.prototype, "power", {
        /**
         * The power of the rim light. Higher values will result in a higher edge fall-off.
         */
        get: function () {
            return this._power;
        },
        set: function (value) {
            this._power = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = this._colorR;
        data[index + 1] = this._colorG;
        data[index + 2] = this._colorB;
        data[index + 4] = this._strength;
        data[index + 5] = this._power;
    };
    /**
     * @inheritDoc
     */
    EffectRimLightMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var dataRegister = registerCache.getFreeFragmentConstant();
        var dataRegister2 = registerCache.getFreeFragmentConstant();
        var temp = registerCache.getFreeFragmentVectorTemp();
        var code = "";
        methodVO.fragmentConstantsIndex = dataRegister.index * 4;
        code += "dp3 " + temp + ".x, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" + "sat " + temp + ".x, " + temp + ".x\n" + "sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" + "pow " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".y\n" + "mul " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".x\n" + "sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" + "mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".x\n" + "sub " + temp + ".w, " + dataRegister + ".w, " + temp + ".x\n";
        if (this._blendMode == EffectRimLightMethod.ADD) {
            code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" + "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        }
        else if (this._blendMode == EffectRimLightMethod.MULTIPLY) {
            code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" + "mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        }
        else {
            code += "sub " + temp + ".xyz, " + dataRegister + ".xyz, " + targetReg + ".xyz\n" + "mul " + temp + ".xyz, " + temp + ".xyz, " + temp + ".w\n" + "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        }
        return code;
    };
    EffectRimLightMethod.ADD = "add";
    EffectRimLightMethod.MULTIPLY = "multiply";
    EffectRimLightMethod.MIX = "mix";
    return EffectRimLightMethod;
})(EffectMethodBase);
module.exports = EffectRimLightMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRWZmZWN0UmltTGlnaHRNZXRob2QudHMiXSwibmFtZXMiOlsiRWZmZWN0UmltTGlnaHRNZXRob2QiLCJFZmZlY3RSaW1MaWdodE1ldGhvZC5jb25zdHJ1Y3RvciIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLmlJbml0Q29uc3RhbnRzIiwiRWZmZWN0UmltTGlnaHRNZXRob2QuaUluaXRWTyIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLmJsZW5kTW9kZSIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLmNvbG9yIiwiRWZmZWN0UmltTGlnaHRNZXRob2Quc3RyZW5ndGgiLCJFZmZlY3RSaW1MaWdodE1ldGhvZC5wb3dlciIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLmlBY3RpdmF0ZSIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLmlHZXRGcmFnbWVudENvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVFBLElBQU8sZ0JBQWdCLFdBQWUscURBQXFELENBQUMsQ0FBQztBQUU3RixBQUdBOztHQURHO0lBQ0csb0JBQW9CO0lBQVNBLFVBQTdCQSxvQkFBb0JBLFVBQXlCQTtJQWNsREE7Ozs7Ozs7T0FPR0E7SUFDSEEsU0F0QktBLG9CQUFvQkEsQ0FzQmJBLEtBQWdDQSxFQUFFQSxRQUFvQkEsRUFBRUEsS0FBZ0JBLEVBQUVBLEtBQW9CQTtRQUE5RkMscUJBQWdDQSxHQUFoQ0EsZ0JBQWdDQTtRQUFFQSx3QkFBb0JBLEdBQXBCQSxhQUFvQkE7UUFBRUEscUJBQWdCQSxHQUFoQkEsU0FBZ0JBO1FBQUVBLHFCQUFvQkEsR0FBcEJBLGFBQW9CQTtRQUV6R0EsaUJBQU9BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3hCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFcEJBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO0lBQ3BCQSxDQUFDQTtJQUVERDs7T0FFR0E7SUFDSUEsNkNBQWNBLEdBQXJCQSxVQUFzQkEsWUFBNkJBLEVBQUVBLFFBQWlCQTtRQUVyRUUsWUFBWUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxRQUFRQSxDQUFDQSxzQkFBc0JBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO0lBQzVFQSxDQUFDQTtJQUVERjs7T0FFR0E7SUFDSUEsc0NBQU9BLEdBQWRBLFVBQWVBLFlBQTZCQSxFQUFFQSxRQUFpQkE7UUFFOURHLFFBQVFBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBO1FBQzdCQSxRQUFRQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUMzQkEsQ0FBQ0E7SUFVREgsc0JBQVdBLDJDQUFTQTtRQVBwQkE7Ozs7OztXQU1HQTthQUNIQTtZQUVDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUN4QkEsQ0FBQ0E7YUFFREosVUFBcUJBLEtBQVlBO1lBRWhDSSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxJQUFJQSxLQUFLQSxDQUFDQTtnQkFDNUJBLE1BQU1BLENBQUNBO1lBRVJBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEtBQUtBLENBQUNBO1lBRXhCQSxJQUFJQSxDQUFDQSx3QkFBd0JBLEVBQUVBLENBQUNBO1FBQ2pDQSxDQUFDQTs7O09BVkFKO0lBZURBLHNCQUFXQSx1Q0FBS0E7UUFIaEJBOztXQUVHQTthQUNIQTtZQUVDSyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNwQkEsQ0FBQ0E7YUFFREwsVUFBaUJBLEtBQUtBLENBQVFBLFFBQURBLEFBQVNBO1lBRXJDSyxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUNwQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDM0NBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEdBQUNBLElBQUlBLENBQUNBO1lBQzFDQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFDQSxJQUFJQSxDQUFDQTtRQUNwQ0EsQ0FBQ0E7OztPQVJBTDtJQWFEQSxzQkFBV0EsMENBQVFBO1FBSG5CQTs7V0FFR0E7YUFDSEE7WUFFQ00sTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkJBLENBQUNBO2FBRUROLFVBQW9CQSxLQUFZQTtZQUUvQk0sSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDeEJBLENBQUNBOzs7T0FMQU47SUFVREEsc0JBQVdBLHVDQUFLQTtRQUhoQkE7O1dBRUdBO2FBQ0hBO1lBRUNPLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1FBQ3BCQSxDQUFDQTthQUVEUCxVQUFpQkEsS0FBWUE7WUFFNUJPLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3JCQSxDQUFDQTs7O09BTEFQO0lBT0RBOztPQUVHQTtJQUNJQSx3Q0FBU0EsR0FBaEJBLFVBQWlCQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLEtBQVdBO1FBRTdFUSxJQUFJQSxLQUFLQSxHQUFrQkEsUUFBUUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQTtRQUMzREEsSUFBSUEsSUFBSUEsR0FBaUJBLFlBQVlBLENBQUNBLG9CQUFvQkEsQ0FBQ0E7UUFDM0RBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBO1FBQzNCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUMvQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDL0JBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO1FBQ2pDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtJQUMvQkEsQ0FBQ0E7SUFFRFI7O09BRUdBO0lBQ0lBLCtDQUFnQkEsR0FBdkJBLFVBQXdCQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLFNBQStCQSxFQUFFQSxhQUFpQ0EsRUFBRUEsZUFBa0NBO1FBRS9LUyxJQUFJQSxZQUFZQSxHQUF5QkEsYUFBYUEsQ0FBQ0EsdUJBQXVCQSxFQUFFQSxDQUFDQTtRQUNqRkEsSUFBSUEsYUFBYUEsR0FBeUJBLGFBQWFBLENBQUNBLHVCQUF1QkEsRUFBRUEsQ0FBQ0E7UUFDbEZBLElBQUlBLElBQUlBLEdBQXlCQSxhQUFhQSxDQUFDQSx5QkFBeUJBLEVBQUVBLENBQUNBO1FBQzNFQSxJQUFJQSxJQUFJQSxHQUFVQSxFQUFFQSxDQUFDQTtRQUVyQkEsUUFBUUEsQ0FBQ0Esc0JBQXNCQSxHQUFHQSxZQUFZQSxDQUFDQSxLQUFLQSxHQUFDQSxDQUFDQSxDQUFDQTtRQUV2REEsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FBR0EsZUFBZUEsQ0FBQ0EsZUFBZUEsR0FBR0EsUUFBUUEsR0FBR0EsZUFBZUEsQ0FBQ0EsY0FBY0EsR0FBR0EsUUFBUUEsR0FDdEhBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQ3RDQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUFHQSxZQUFZQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUM5REEsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FBR0EsYUFBYUEsR0FBR0EsTUFBTUEsR0FDL0RBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQUdBLGFBQWFBLEdBQUdBLE1BQU1BLEdBQy9EQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUFHQSxZQUFZQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUM5REEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FDcEVBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQUdBLFlBQVlBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLENBQUNBO1FBRWhFQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxJQUFJQSxvQkFBb0JBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pEQSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUFHQSxZQUFZQSxHQUFHQSxRQUFRQSxHQUN6RUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FBR0EsSUFBSUEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDekVBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLElBQUlBLG9CQUFvQkEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDN0RBLElBQUlBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQUdBLFlBQVlBLEdBQUdBLFFBQVFBLEdBQ3pFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUN6RUEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDUEEsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsUUFBUUEsR0FBR0EsWUFBWUEsR0FBR0EsUUFBUUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FDaEZBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQzFEQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUN6RUEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDYkEsQ0FBQ0E7SUFqS2FULHdCQUFHQSxHQUFVQSxLQUFLQSxDQUFDQTtJQUNuQkEsNkJBQVFBLEdBQVVBLFVBQVVBLENBQUNBO0lBQzdCQSx3QkFBR0EsR0FBVUEsS0FBS0EsQ0FBQ0E7SUFnS2xDQSwyQkFBQ0E7QUFBREEsQ0FwS0EsQUFvS0NBLEVBcEtrQyxnQkFBZ0IsRUFvS2xEO0FBRUQsQUFBOEIsaUJBQXJCLG9CQUFvQixDQUFDIiwiZmlsZSI6Im1ldGhvZHMvRWZmZWN0UmltTGlnaHRNZXRob2QuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcblxuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5cbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvZGF0YS9NZXRob2RWT1wiKTtcbmltcG9ydCBFZmZlY3RNZXRob2RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRWZmZWN0TWV0aG9kQmFzZVwiKTtcblxuLyoqXG4gKiBFZmZlY3RSaW1MaWdodE1ldGhvZCBwcm92aWRlcyBhIG1ldGhvZCB0byBhZGQgcmltIGxpZ2h0aW5nIHRvIGEgbWF0ZXJpYWwuIFRoaXMgYWRkcyBhIGdsb3ctbGlrZSBlZmZlY3QgdG8gZWRnZXMgb2Ygb2JqZWN0cy5cbiAqL1xuY2xhc3MgRWZmZWN0UmltTGlnaHRNZXRob2QgZXh0ZW5kcyBFZmZlY3RNZXRob2RCYXNlXG57XG5cdHB1YmxpYyBzdGF0aWMgQUREOnN0cmluZyA9IFwiYWRkXCI7XG5cdHB1YmxpYyBzdGF0aWMgTVVMVElQTFk6c3RyaW5nID0gXCJtdWx0aXBseVwiO1xuXHRwdWJsaWMgc3RhdGljIE1JWDpzdHJpbmcgPSBcIm1peFwiO1xuXG5cdHByaXZhdGUgX2NvbG9yOm51bWJlciAvKnVpbnQqLztcblx0cHJpdmF0ZSBfYmxlbmRNb2RlOnN0cmluZztcblx0cHJpdmF0ZSBfY29sb3JSOm51bWJlcjtcblx0cHJpdmF0ZSBfY29sb3JHOm51bWJlcjtcblx0cHJpdmF0ZSBfY29sb3JCOm51bWJlcjtcblx0cHJpdmF0ZSBfc3RyZW5ndGg6bnVtYmVyO1xuXHRwcml2YXRlIF9wb3dlcjpudW1iZXI7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+RWZmZWN0UmltTGlnaHRNZXRob2Q8L2NvZGU+IG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIGNvbG9yIFRoZSBjb2xvdXIgb2YgdGhlIHJpbSBsaWdodC5cblx0ICogQHBhcmFtIHN0cmVuZ3RoIFRoZSBzdHJlbmd0aCBvZiB0aGUgcmltIGxpZ2h0LlxuXHQgKiBAcGFyYW0gcG93ZXIgVGhlIHBvd2VyIG9mIHRoZSByaW0gbGlnaHQuIEhpZ2hlciB2YWx1ZXMgd2lsbCByZXN1bHQgaW4gYSBoaWdoZXIgZWRnZSBmYWxsLW9mZi5cblx0ICogQHBhcmFtIGJsZW5kIFRoZSBibGVuZCBtb2RlIHdpdGggd2hpY2ggdG8gYWRkIHRoZSBsaWdodCB0byB0aGUgb2JqZWN0LlxuXHQgKi9cblx0Y29uc3RydWN0b3IoY29sb3I6bnVtYmVyIC8qdWludCovID0gMHhmZmZmZmYsIHN0cmVuZ3RoOm51bWJlciA9IC40LCBwb3dlcjpudW1iZXIgPSAyLCBibGVuZDpzdHJpbmcgPSBcIm1peFwiKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX2JsZW5kTW9kZSA9IGJsZW5kO1xuXHRcdHRoaXMuX3N0cmVuZ3RoID0gc3RyZW5ndGg7XG5cdFx0dGhpcy5fcG93ZXIgPSBwb3dlcjtcblxuXHRcdHRoaXMuY29sb3IgPSBjb2xvcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlJbml0Q29uc3RhbnRzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXHRcdHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YVttZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4ICsgM10gPSAxO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRWTyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblx0XHRtZXRob2RWTy5uZWVkc05vcm1hbHMgPSB0cnVlO1xuXHRcdG1ldGhvZFZPLm5lZWRzVmlldyA9IHRydWU7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBUaGUgYmxlbmQgbW9kZSB3aXRoIHdoaWNoIHRvIGFkZCB0aGUgbGlnaHQgdG8gdGhlIG9iamVjdC5cblx0ICpcblx0ICogRWZmZWN0UmltTGlnaHRNZXRob2QuTVVMVElQTFkgbXVsdGlwbGllcyB0aGUgcmltIGxpZ2h0IHdpdGggdGhlIG1hdGVyaWFsJ3MgY29sb3VyLlxuXHQgKiBFZmZlY3RSaW1MaWdodE1ldGhvZC5BREQgYWRkcyB0aGUgcmltIGxpZ2h0IHdpdGggdGhlIG1hdGVyaWFsJ3MgY29sb3VyLlxuXHQgKiBFZmZlY3RSaW1MaWdodE1ldGhvZC5NSVggcHJvdmlkZXMgbm9ybWFsIGFscGhhIGJsZW5kaW5nLlxuXHQgKi9cblx0cHVibGljIGdldCBibGVuZE1vZGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLl9ibGVuZE1vZGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGJsZW5kTW9kZSh2YWx1ZTpzdHJpbmcpXG5cdHtcblx0XHRpZiAodGhpcy5fYmxlbmRNb2RlID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYmxlbmRNb2RlID0gdmFsdWU7XG5cblx0XHR0aGlzLmlJbnZhbGlkYXRlU2hhZGVyUHJvZ3JhbSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBjb2xvciBvZiB0aGUgcmltIGxpZ2h0LlxuXHQgKi9cblx0cHVibGljIGdldCBjb2xvcigpOm51bWJlciAvKnVpbnQqL1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2NvbG9yO1xuXHR9XG5cblx0cHVibGljIHNldCBjb2xvcih2YWx1ZTpudW1iZXIgLyp1aW50Ki8pXG5cdHtcblx0XHR0aGlzLl9jb2xvciA9IHZhbHVlO1xuXHRcdHRoaXMuX2NvbG9yUiA9ICgodmFsdWUgPj4gMTYpICYgMHhmZikvMHhmZjtcblx0XHR0aGlzLl9jb2xvckcgPSAoKHZhbHVlID4+IDgpICYgMHhmZikvMHhmZjtcblx0XHR0aGlzLl9jb2xvckIgPSAodmFsdWUgJiAweGZmKS8weGZmO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBzdHJlbmd0aCBvZiB0aGUgcmltIGxpZ2h0LlxuXHQgKi9cblx0cHVibGljIGdldCBzdHJlbmd0aCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3N0cmVuZ3RoO1xuXHR9XG5cblx0cHVibGljIHNldCBzdHJlbmd0aCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9zdHJlbmd0aCA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBwb3dlciBvZiB0aGUgcmltIGxpZ2h0LiBIaWdoZXIgdmFsdWVzIHdpbGwgcmVzdWx0IGluIGEgaGlnaGVyIGVkZ2UgZmFsbC1vZmYuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHBvd2VyKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcG93ZXI7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHBvd2VyKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3Bvd2VyID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpQWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcblx0e1xuXHRcdHZhciBpbmRleDpudW1iZXIgLyppbnQqLyA9IG1ldGhvZFZPLmZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XG5cdFx0dmFyIGRhdGE6QXJyYXk8bnVtYmVyPiA9IHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YTtcblx0XHRkYXRhW2luZGV4XSA9IHRoaXMuX2NvbG9yUjtcblx0XHRkYXRhW2luZGV4ICsgMV0gPSB0aGlzLl9jb2xvckc7XG5cdFx0ZGF0YVtpbmRleCArIDJdID0gdGhpcy5fY29sb3JCO1xuXHRcdGRhdGFbaW5kZXggKyA0XSA9IHRoaXMuX3N0cmVuZ3RoO1xuXHRcdGRhdGFbaW5kZXggKyA1XSA9IHRoaXMuX3Bvd2VyO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgZGF0YVJlZ2lzdGVyOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblx0XHR2YXIgZGF0YVJlZ2lzdGVyMjpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XG5cdFx0dmFyIHRlbXA6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wKCk7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblxuXHRcdG1ldGhvZFZPLmZyYWdtZW50Q29uc3RhbnRzSW5kZXggPSBkYXRhUmVnaXN0ZXIuaW5kZXgqNDtcblxuXHRcdGNvZGUgKz0gXCJkcDMgXCIgKyB0ZW1wICsgXCIueCwgXCIgKyBzaGFyZWRSZWdpc3RlcnMudmlld0RpckZyYWdtZW50ICsgXCIueHl6LCBcIiArIHNoYXJlZFJlZ2lzdGVycy5ub3JtYWxGcmFnbWVudCArIFwiLnh5elxcblwiICtcblx0XHRcdFwic2F0IFwiICsgdGVtcCArIFwiLngsIFwiICsgdGVtcCArIFwiLnhcXG5cIiArXG5cdFx0XHRcInN1YiBcIiArIHRlbXAgKyBcIi54LCBcIiArIGRhdGFSZWdpc3RlciArIFwiLncsIFwiICsgdGVtcCArIFwiLnhcXG5cIiArXG5cdFx0XHRcInBvdyBcIiArIHRlbXAgKyBcIi54LCBcIiArIHRlbXAgKyBcIi54LCBcIiArIGRhdGFSZWdpc3RlcjIgKyBcIi55XFxuXCIgK1xuXHRcdFx0XCJtdWwgXCIgKyB0ZW1wICsgXCIueCwgXCIgKyB0ZW1wICsgXCIueCwgXCIgKyBkYXRhUmVnaXN0ZXIyICsgXCIueFxcblwiICtcblx0XHRcdFwic3ViIFwiICsgdGVtcCArIFwiLngsIFwiICsgZGF0YVJlZ2lzdGVyICsgXCIudywgXCIgKyB0ZW1wICsgXCIueFxcblwiICtcblx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0ZW1wICsgXCIueFxcblwiICtcblx0XHRcdFwic3ViIFwiICsgdGVtcCArIFwiLncsIFwiICsgZGF0YVJlZ2lzdGVyICsgXCIudywgXCIgKyB0ZW1wICsgXCIueFxcblwiO1xuXG5cdFx0aWYgKHRoaXMuX2JsZW5kTW9kZSA9PSBFZmZlY3RSaW1MaWdodE1ldGhvZC5BREQpIHtcblx0XHRcdGNvZGUgKz0gXCJtdWwgXCIgKyB0ZW1wICsgXCIueHl6LCBcIiArIHRlbXAgKyBcIi53LCBcIiArIGRhdGFSZWdpc3RlciArIFwiLnh5elxcblwiICtcblx0XHRcdFx0XCJhZGQgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRlbXAgKyBcIi54eXpcXG5cIjtcblx0XHR9IGVsc2UgaWYgKHRoaXMuX2JsZW5kTW9kZSA9PSBFZmZlY3RSaW1MaWdodE1ldGhvZC5NVUxUSVBMWSkge1xuXHRcdFx0Y29kZSArPSBcIm11bCBcIiArIHRlbXAgKyBcIi54eXosIFwiICsgdGVtcCArIFwiLncsIFwiICsgZGF0YVJlZ2lzdGVyICsgXCIueHl6XFxuXCIgK1xuXHRcdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGVtcCArIFwiLnh5elxcblwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb2RlICs9IFwic3ViIFwiICsgdGVtcCArIFwiLnh5eiwgXCIgKyBkYXRhUmVnaXN0ZXIgKyBcIi54eXosIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6XFxuXCIgK1xuXHRcdFx0XHRcIm11bCBcIiArIHRlbXAgKyBcIi54eXosIFwiICsgdGVtcCArIFwiLnh5eiwgXCIgKyB0ZW1wICsgXCIud1xcblwiICtcblx0XHRcdFx0XCJhZGQgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRlbXAgKyBcIi54eXpcXG5cIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxufVxuXG5leHBvcnQgPSBFZmZlY3RSaW1MaWdodE1ldGhvZDsiXX0=