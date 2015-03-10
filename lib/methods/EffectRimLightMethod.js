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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRWZmZWN0UmltTGlnaHRNZXRob2QudHMiXSwibmFtZXMiOlsiRWZmZWN0UmltTGlnaHRNZXRob2QiLCJFZmZlY3RSaW1MaWdodE1ldGhvZC5jb25zdHJ1Y3RvciIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLmlJbml0Q29uc3RhbnRzIiwiRWZmZWN0UmltTGlnaHRNZXRob2QuaUluaXRWTyIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLmJsZW5kTW9kZSIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLmNvbG9yIiwiRWZmZWN0UmltTGlnaHRNZXRob2Quc3RyZW5ndGgiLCJFZmZlY3RSaW1MaWdodE1ldGhvZC5wb3dlciIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLmlBY3RpdmF0ZSIsIkVmZmVjdFJpbUxpZ2h0TWV0aG9kLmlHZXRGcmFnbWVudENvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVFBLElBQU8sZ0JBQWdCLFdBQWUscURBQXFELENBQUMsQ0FBQztBQUU3RixBQUdBOztHQURHO0lBQ0csb0JBQW9CO0lBQVNBLFVBQTdCQSxvQkFBb0JBLFVBQXlCQTtJQWNsREE7Ozs7Ozs7T0FPR0E7SUFDSEEsU0F0QktBLG9CQUFvQkEsQ0FzQmJBLEtBQWdDQSxFQUFFQSxRQUFvQkEsRUFBRUEsS0FBZ0JBLEVBQUVBLEtBQW9CQTtRQUE5RkMscUJBQWdDQSxHQUFoQ0EsZ0JBQWdDQTtRQUFFQSx3QkFBb0JBLEdBQXBCQSxhQUFvQkE7UUFBRUEscUJBQWdCQSxHQUFoQkEsU0FBZ0JBO1FBQUVBLHFCQUFvQkEsR0FBcEJBLGFBQW9CQTtRQUV6R0EsaUJBQU9BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3hCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFcEJBLElBQUlB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QVFBLEdBQ3pFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUN6RUEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDUEEsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsSUFBSUEsR0FBR0EsUUFBUUEsR0FBR0EsWUFBWUEsR0FBR0EsUUFBUUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FDaEZBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLEdBQzFEQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUN6RUEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDYkEsQ0FBQ0E7SUFqS2FULHdCQUFHQSxHQUFVQSxLQUFLQSxDQUFDQTtJQUNuQkEsNkJBQVFBLEdBQVVBLFVBQVVBLENBQUNBO0lBQzdCQSx3QkFBR0EsR0FBVUEsS0FBS0EsQ0FBQ0E7SUFnS2xDQSwyQkFBQ0E7QUFBREEsQ0FwS0EsQUFvS0NBLEVBcEtrQyxnQkFBZ0IsRUFvS2xEO0FBRUQsQUFBOEIsaUJBQXJCLG9CQUFvQixDQUFDIiwiZmlsZSI6Im1ldGhvZHMvRWZmZWN0UmltTGlnaHRNZXRob2QuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcclxuXHJcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xyXG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xyXG5cclxuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9kYXRhL01ldGhvZFZPXCIpO1xyXG5pbXBvcnQgRWZmZWN0TWV0aG9kQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0VmZmVjdE1ldGhvZEJhc2VcIik7XHJcblxyXG4vKipcclxuICogRWZmZWN0UmltTGlnaHRNZXRob2QgcHJvdmlkZXMgYSBtZXRob2QgdG8gYWRkIHJpbSBsaWdodGluZyB0byBhIG1hdGVyaWFsLiBUaGlzIGFkZHMgYSBnbG93LWxpa2UgZWZmZWN0IHRvIGVkZ2VzIG9mIG9iamVjdHMuXHJcbiAqL1xyXG5jbGFzcyBFZmZlY3RSaW1MaWdodE1ldGhvZCBleHRlbmRzIEVmZmVjdE1ldGhvZEJhc2Vcclxue1xyXG5cdHB1YmxpYyBzdGF0aWMgQUREOnN0cmluZyA9IFwiYWRkXCI7XHJcblx0cHVibGljIHN0YXRpYyBNVUxUSVBMWTpzdHJpbmcgPSBcIm11bHRpcGx5XCI7XHJcblx0cHVibGljIHN0YXRpYyBNSVg6c3RyaW5nID0gXCJtaXhcIjtcclxuXHJcblx0cHJpdmF0ZSBfY29sb3I6bnVtYmVyIC8qdWludCovO1xyXG5cdHByaXZhdGUgX2JsZW5kTW9kZTpzdHJpbmc7XHJcblx0cHJpdmF0ZSBfY29sb3JSOm51bWJlcjtcclxuXHRwcml2YXRlIF9jb2xvckc6bnVtYmVyO1xyXG5cdHByaXZhdGUgX2NvbG9yQjpudW1iZXI7XHJcblx0cHJpdmF0ZSBfc3RyZW5ndGg6bnVtYmVyO1xyXG5cdHByaXZhdGUgX3Bvd2VyOm51bWJlcjtcclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5FZmZlY3RSaW1MaWdodE1ldGhvZDwvY29kZT4gb2JqZWN0LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIGNvbG9yIFRoZSBjb2xvdXIgb2YgdGhlIHJpbSBsaWdodC5cclxuXHQgKiBAcGFyYW0gc3RyZW5ndGggVGhlIHN0cmVuZ3RoIG9mIHRoZSByaW0gbGlnaHQuXHJcblx0ICogQHBhcmFtIHBvd2VyIFRoZSBwb3dlciBvZiB0aGUgcmltIGxpZ2h0LiBIaWdoZXIgdmFsdWVzIHdpbGwgcmVzdWx0IGluIGEgaGlnaGVyIGVkZ2UgZmFsbC1vZmYuXHJcblx0ICogQHBhcmFtIGJsZW5kIFRoZSBibGVuZCBtb2RlIHdpdGggd2hpY2ggdG8gYWRkIHRoZSBsaWdodCB0byB0aGUgb2JqZWN0LlxyXG5cdCAqL1xyXG5cdGNvbnN0cnVjdG9yKGNvbG9yOm51bWJlciAvKnVpbnQqLyA9IDB4ZmZmZmZmLCBzdHJlbmd0aDpudW1iZXIgPSAuNCwgcG93ZXI6bnVtYmVyID0gMiwgYmxlbmQ6c3RyaW5nID0gXCJtaXhcIilcclxuXHR7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHRcdHRoaXMuX2JsZW5kTW9kZSA9IGJsZW5kO1xyXG5cdFx0dGhpcy5fc3RyZW5ndGggPSBzdHJlbmd0aDtcclxuXHRcdHRoaXMuX3Bvd2VyID0gcG93ZXI7XHJcblxyXG5cdFx0dGhpcy5jb2xvciA9IGNvbG9yO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxyXG5cdHtcclxuXHRcdHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YVttZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4ICsgM10gPSAxO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgaUluaXRWTyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXHJcblx0e1xyXG5cdFx0bWV0aG9kVk8ubmVlZHNOb3JtYWxzID0gdHJ1ZTtcclxuXHRcdG1ldGhvZFZPLm5lZWRzVmlldyA9IHRydWU7XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIGJsZW5kIG1vZGUgd2l0aCB3aGljaCB0byBhZGQgdGhlIGxpZ2h0IHRvIHRoZSBvYmplY3QuXHJcblx0ICpcclxuXHQgKiBFZmZlY3RSaW1MaWdodE1ldGhvZC5NVUxUSVBMWSBtdWx0aXBsaWVzIHRoZSByaW0gbGlnaHQgd2l0aCB0aGUgbWF0ZXJpYWwncyBjb2xvdXIuXHJcblx0ICogRWZmZWN0UmltTGlnaHRNZXRob2QuQUREIGFkZHMgdGhlIHJpbSBsaWdodCB3aXRoIHRoZSBtYXRlcmlhbCdzIGNvbG91ci5cclxuXHQgKiBFZmZlY3RSaW1MaWdodE1ldGhvZC5NSVggcHJvdmlkZXMgbm9ybWFsIGFscGhhIGJsZW5kaW5nLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgYmxlbmRNb2RlKCk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2JsZW5kTW9kZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgYmxlbmRNb2RlKHZhbHVlOnN0cmluZylcclxuXHR7XHJcblx0XHRpZiAodGhpcy5fYmxlbmRNb2RlID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fYmxlbmRNb2RlID0gdmFsdWU7XHJcblxyXG5cdFx0dGhpcy5pSW52YWxpZGF0ZVNoYWRlclByb2dyYW0oKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBjb2xvciBvZiB0aGUgcmltIGxpZ2h0LlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgY29sb3IoKTpudW1iZXIgLyp1aW50Ki9cclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fY29sb3I7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGNvbG9yKHZhbHVlOm51bWJlciAvKnVpbnQqLylcclxuXHR7XHJcblx0XHR0aGlzLl9jb2xvciA9IHZhbHVlO1xyXG5cdFx0dGhpcy5fY29sb3JSID0gKCh2YWx1ZSA+PiAxNikgJiAweGZmKS8weGZmO1xyXG5cdFx0dGhpcy5fY29sb3JHID0gKCh2YWx1ZSA+PiA4KSAmIDB4ZmYpLzB4ZmY7XHJcblx0XHR0aGlzLl9jb2xvckIgPSAodmFsdWUgJiAweGZmKS8weGZmO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIHN0cmVuZ3RoIG9mIHRoZSByaW0gbGlnaHQuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBzdHJlbmd0aCgpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9zdHJlbmd0aDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgc3RyZW5ndGgodmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX3N0cmVuZ3RoID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgcG93ZXIgb2YgdGhlIHJpbSBsaWdodC4gSGlnaGVyIHZhbHVlcyB3aWxsIHJlc3VsdCBpbiBhIGhpZ2hlciBlZGdlIGZhbGwtb2ZmLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgcG93ZXIoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fcG93ZXI7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHBvd2VyKHZhbHVlOm51bWJlcilcclxuXHR7XHJcblx0XHR0aGlzLl9wb3dlciA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXHJcblx0e1xyXG5cdFx0dmFyIGluZGV4Om51bWJlciAvKmludCovID0gbWV0aG9kVk8uZnJhZ21lbnRDb25zdGFudHNJbmRleDtcclxuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XHJcblx0XHRkYXRhW2luZGV4XSA9IHRoaXMuX2NvbG9yUjtcclxuXHRcdGRhdGFbaW5kZXggKyAxXSA9IHRoaXMuX2NvbG9yRztcclxuXHRcdGRhdGFbaW5kZXggKyAyXSA9IHRoaXMuX2NvbG9yQjtcclxuXHRcdGRhdGFbaW5kZXggKyA0XSA9IHRoaXMuX3N0cmVuZ3RoO1xyXG5cdFx0ZGF0YVtpbmRleCArIDVdID0gdGhpcy5fcG93ZXI7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcclxuXHR7XHJcblx0XHR2YXIgZGF0YVJlZ2lzdGVyOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcclxuXHRcdHZhciBkYXRhUmVnaXN0ZXIyOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcclxuXHRcdHZhciB0ZW1wOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCgpO1xyXG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcclxuXHJcblx0XHRtZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4ID0gZGF0YVJlZ2lzdGVyLmluZGV4KjQ7XHJcblxyXG5cdFx0Y29kZSArPSBcImRwMyBcIiArIHRlbXAgKyBcIi54LCBcIiArIHNoYXJlZFJlZ2lzdGVycy52aWV3RGlyRnJhZ21lbnQgKyBcIi54eXosIFwiICsgc2hhcmVkUmVnaXN0ZXJzLm5vcm1hbEZyYWdtZW50ICsgXCIueHl6XFxuXCIgK1xyXG5cdFx0XHRcInNhdCBcIiArIHRlbXAgKyBcIi54LCBcIiArIHRlbXAgKyBcIi54XFxuXCIgK1xyXG5cdFx0XHRcInN1YiBcIiArIHRlbXAgKyBcIi54LCBcIiArIGRhdGFSZWdpc3RlciArIFwiLncsIFwiICsgdGVtcCArIFwiLnhcXG5cIiArXHJcblx0XHRcdFwicG93IFwiICsgdGVtcCArIFwiLngsIFwiICsgdGVtcCArIFwiLngsIFwiICsgZGF0YVJlZ2lzdGVyMiArIFwiLnlcXG5cIiArXHJcblx0XHRcdFwibXVsIFwiICsgdGVtcCArIFwiLngsIFwiICsgdGVtcCArIFwiLngsIFwiICsgZGF0YVJlZ2lzdGVyMiArIFwiLnhcXG5cIiArXHJcblx0XHRcdFwic3ViIFwiICsgdGVtcCArIFwiLngsIFwiICsgZGF0YVJlZ2lzdGVyICsgXCIudywgXCIgKyB0ZW1wICsgXCIueFxcblwiICtcclxuXHRcdFx0XCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRlbXAgKyBcIi54XFxuXCIgK1xyXG5cdFx0XHRcInN1YiBcIiArIHRlbXAgKyBcIi53LCBcIiArIGRhdGFSZWdpc3RlciArIFwiLncsIFwiICsgdGVtcCArIFwiLnhcXG5cIjtcclxuXHJcblx0XHRpZiAodGhpcy5fYmxlbmRNb2RlID09IEVmZmVjdFJpbUxpZ2h0TWV0aG9kLkFERCkge1xyXG5cdFx0XHRjb2RlICs9IFwibXVsIFwiICsgdGVtcCArIFwiLnh5eiwgXCIgKyB0ZW1wICsgXCIudywgXCIgKyBkYXRhUmVnaXN0ZXIgKyBcIi54eXpcXG5cIiArXHJcblx0XHRcdFx0XCJhZGQgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRlbXAgKyBcIi54eXpcXG5cIjtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5fYmxlbmRNb2RlID09IEVmZmVjdFJpbUxpZ2h0TWV0aG9kLk1VTFRJUExZKSB7XHJcblx0XHRcdGNvZGUgKz0gXCJtdWwgXCIgKyB0ZW1wICsgXCIueHl6LCBcIiArIHRlbXAgKyBcIi53LCBcIiArIGRhdGFSZWdpc3RlciArIFwiLnh5elxcblwiICtcclxuXHRcdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGVtcCArIFwiLnh5elxcblwiO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29kZSArPSBcInN1YiBcIiArIHRlbXAgKyBcIi54eXosIFwiICsgZGF0YVJlZ2lzdGVyICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiLnh5elxcblwiICtcclxuXHRcdFx0XHRcIm11bCBcIiArIHRlbXAgKyBcIi54eXosIFwiICsgdGVtcCArIFwiLnh5eiwgXCIgKyB0ZW1wICsgXCIud1xcblwiICtcclxuXHRcdFx0XHRcImFkZCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGVtcCArIFwiLnh5elxcblwiO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjb2RlO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0ID0gRWZmZWN0UmltTGlnaHRNZXRob2Q7Il19