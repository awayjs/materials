var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
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
    }
    /**
     * @inheritDoc
     */
    EffectAlphaMaskMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsSecondaryUV = this._useSecondaryUV;
        methodVO.needsUV = !this._useSecondaryUV;
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
            this._texture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectAlphaMaskMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        stage.activateTexture(methodVO.texturesIndex, this._texture);
    };
    /**
     * @inheritDoc
     */
    EffectAlphaMaskMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var textureReg = registerCache.getFreeTextureReg();
        var temp = registerCache.getFreeFragmentVectorTemp();
        var uvReg = this._useSecondaryUV ? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying;
        methodVO.texturesIndex = textureReg.index;
        return ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, textureReg, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, uvReg) + "mul " + targetReg + ", " + targetReg + ", " + temp + ".x\n";
    };
    return EffectAlphaMaskMethod;
})(EffectMethodBase);
module.exports = EffectAlphaMaskMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRWZmZWN0QWxwaGFNYXNrTWV0aG9kLnRzIl0sIm5hbWVzIjpbIkVmZmVjdEFscGhhTWFza01ldGhvZCIsIkVmZmVjdEFscGhhTWFza01ldGhvZC5jb25zdHJ1Y3RvciIsIkVmZmVjdEFscGhhTWFza01ldGhvZC5pSW5pdFZPIiwiRWZmZWN0QWxwaGFNYXNrTWV0aG9kLnVzZVNlY29uZGFyeVVWIiwiRWZmZWN0QWxwaGFNYXNrTWV0aG9kLnRleHR1cmUiLCJFZmZlY3RBbHBoYU1hc2tNZXRob2QuaUFjdGl2YXRlIiwiRWZmZWN0QWxwaGFNYXNrTWV0aG9kLmlHZXRGcmFnbWVudENvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVNBLElBQU8sb0JBQW9CLFdBQWMsa0RBQWtELENBQUMsQ0FBQztBQUc3RixJQUFPLGdCQUFnQixXQUFlLHFEQUFxRCxDQUFDLENBQUM7QUFFN0YsQUFLQTs7OztHQURHO0lBQ0cscUJBQXFCO0lBQVNBLFVBQTlCQSxxQkFBcUJBLFVBQXlCQTtJQUtuREE7Ozs7O09BS0dBO0lBQ0hBLFNBWEtBLHFCQUFxQkEsQ0FXZEEsT0FBcUJBLEVBQUVBLGNBQThCQTtRQUE5QkMsOEJBQThCQSxHQUE5QkEsc0JBQThCQTtRQUVoRUEsaUJBQU9BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE9BQU9BLENBQUNBO1FBQ3hCQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxjQUFjQSxDQUFDQTtJQUN2Q0EsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0lBLHVDQUFPQSxHQUFkQSxVQUFlQSxZQUE2QkEsRUFBRUEsUUFBaUJBO1FBRTlERSxRQUFRQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBO1FBQ2pEQSxRQUFRQSxDQUFDQSxPQUFPQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQTtJQUMxQ0EsQ0FBQ0E7SUFPREYsc0JBQVdBLGlEQUFjQTtRQUx6QkE7Ozs7V0FJR0E7YUFDSEE7WUFFQ0csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFDN0JBLENBQUNBO2FBRURILFVBQTBCQSxLQUFhQTtZQUV0Q0csRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsSUFBSUEsS0FBS0EsQ0FBQ0E7Z0JBQ2pDQSxNQUFNQSxDQUFDQTtZQUNSQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUM3QkEsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxFQUFFQSxDQUFDQTtRQUNqQ0EsQ0FBQ0E7OztPQVJBSDtJQWFEQSxzQkFBV0EsMENBQU9BO1FBSGxCQTs7V0FFR0E7YUFDSEE7WUFFQ0ksTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFDdEJBLENBQUNBO2FBRURKLFVBQW1CQSxLQUFtQkE7WUFFckNJLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3ZCQSxDQUFDQTs7O09BTEFKO0lBT0RBOztPQUVHQTtJQUNJQSx5Q0FBU0EsR0FBaEJBLFVBQWlCQSxZQUFpQ0EsRUFBRUEsUUFBaUJBLEVBQUVBLEtBQVdBO1FBRWpGSyxLQUFLQSxDQUFDQSxlQUFlQSxDQUFDQSxRQUFRQSxDQUFDQSxhQUFhQSxFQUFFQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtJQUM5REEsQ0FBQ0E7SUFFREw7O09BRUdBO0lBQ0lBLGdEQUFnQkEsR0FBdkJBLFVBQXdCQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLFNBQStCQSxFQUFFQSxhQUFpQ0EsRUFBRUEsZUFBa0NBO1FBRS9LTSxJQUFJQSxVQUFVQSxHQUF5QkEsYUFBYUEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtRQUN6RUEsSUFBSUEsSUFBSUEsR0FBeUJBLGFBQWFBLENBQUNBLHlCQUF5QkEsRUFBRUEsQ0FBQ0E7UUFDM0VBLElBQUlBLEtBQUtBLEdBQXlCQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFFQSxlQUFlQSxDQUFDQSxrQkFBa0JBLEdBQUdBLGVBQWVBLENBQUNBLFNBQVNBLENBQUNBO1FBQ3ZIQSxRQUFRQSxDQUFDQSxhQUFhQSxHQUFHQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUUxQ0EsTUFBTUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxrQkFBa0JBLENBQUNBLElBQUlBLEVBQUVBLGVBQWVBLEVBQUVBLFVBQVVBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLFlBQVlBLENBQUNBLGlCQUFpQkEsRUFBRUEsWUFBWUEsQ0FBQ0EsY0FBY0EsRUFBRUEsWUFBWUEsQ0FBQ0EsYUFBYUEsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FDL0xBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLE1BQU1BLENBQUNBO0lBQy9EQSxDQUFDQTtJQUNGTiw0QkFBQ0E7QUFBREEsQ0FoRkEsQUFnRkNBLEVBaEZtQyxnQkFBZ0IsRUFnRm5EO0FBRUQsQUFBK0IsaUJBQXRCLHFCQUFxQixDQUFDIiwiZmlsZSI6Im1ldGhvZHMvRWZmZWN0QWxwaGFNYXNrTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgU2hhZGVyTGlnaHRpbmdPYmplY3RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJMaWdodGluZ09iamVjdFwiKTtcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IFNoYWRlckNvbXBpbGVySGVscGVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvdXRpbHMvU2hhZGVyQ29tcGlsZXJIZWxwZXJcIik7XG5cbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvZGF0YS9NZXRob2RWT1wiKTtcbmltcG9ydCBFZmZlY3RNZXRob2RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRWZmZWN0TWV0aG9kQmFzZVwiKTtcblxuLyoqXG4gKiBFZmZlY3RBbHBoYU1hc2tNZXRob2QgYWxsb3dzIHRoZSB1c2Ugb2YgYW4gYWRkaXRpb25hbCB0ZXh0dXJlIHRvIHNwZWNpZnkgdGhlIGFscGhhIHZhbHVlIG9mIHRoZSBtYXRlcmlhbC4gV2hlbiB1c2VkXG4gKiB3aXRoIHRoZSBzZWNvbmRhcnkgdXYgc2V0LCBpdCBhbGxvd3MgZm9yIGEgdGlsZWQgbWFpbiB0ZXh0dXJlIHdpdGggaW5kZXBlbmRlbnRseSB2YXJ5aW5nIGFscGhhICh1c2VmdWwgZm9yIHdhdGVyXG4gKiBldGMpLlxuICovXG5jbGFzcyBFZmZlY3RBbHBoYU1hc2tNZXRob2QgZXh0ZW5kcyBFZmZlY3RNZXRob2RCYXNlXG57XG5cdHByaXZhdGUgX3RleHR1cmU6VGV4dHVyZTJEQmFzZTtcblx0cHJpdmF0ZSBfdXNlU2Vjb25kYXJ5VVY6Ym9vbGVhbjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBFZmZlY3RBbHBoYU1hc2tNZXRob2Qgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gdGV4dHVyZSBUaGUgdGV4dHVyZSB0byB1c2UgYXMgdGhlIGFscGhhIG1hc2suXG5cdCAqIEBwYXJhbSB1c2VTZWNvbmRhcnlVViBJbmRpY2F0ZWQgd2hldGhlciBvciBub3QgdGhlIHNlY29uZGFyeSB1diBzZXQgZm9yIHRoZSBtYXNrLiBUaGlzIGFsbG93cyBtYXBwaW5nIGFscGhhIGluZGVwZW5kZW50bHkuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlOlRleHR1cmUyREJhc2UsIHVzZVNlY29uZGFyeVVWOmJvb2xlYW4gPSBmYWxzZSlcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl90ZXh0dXJlID0gdGV4dHVyZTtcblx0XHR0aGlzLl91c2VTZWNvbmRhcnlVViA9IHVzZVNlY29uZGFyeVVWO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRWTyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblx0XHRtZXRob2RWTy5uZWVkc1NlY29uZGFyeVVWID0gdGhpcy5fdXNlU2Vjb25kYXJ5VVY7XG5cdFx0bWV0aG9kVk8ubmVlZHNVViA9ICF0aGlzLl91c2VTZWNvbmRhcnlVVjtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZWQgd2hldGhlciBvciBub3QgdGhlIHNlY29uZGFyeSB1diBzZXQgZm9yIHRoZSBtYXNrLiBUaGlzIGFsbG93cyBtYXBwaW5nIGFscGhhIGluZGVwZW5kZW50bHksIGZvclxuXHQgKiBpbnN0YW5jZSB0byB0aWxlIHRoZSBtYWluIHRleHR1cmUgYW5kIG5vcm1hbCBtYXAgd2hpbGUgcHJvdmlkaW5nIHVudGlsZWQgYWxwaGEsIGZvciBleGFtcGxlIHRvIGRlZmluZSB0aGVcblx0ICogdHJhbnNwYXJlbmN5IG92ZXIgYSB0aWxlZCB3YXRlciBzdXJmYWNlLlxuXHQgKi9cblx0cHVibGljIGdldCB1c2VTZWNvbmRhcnlVVigpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl91c2VTZWNvbmRhcnlVVjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgdXNlU2Vjb25kYXJ5VVYodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdGlmICh0aGlzLl91c2VTZWNvbmRhcnlVViA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblx0XHR0aGlzLl91c2VTZWNvbmRhcnlVViA9IHZhbHVlO1xuXHRcdHRoaXMuaUludmFsaWRhdGVTaGFkZXJQcm9ncmFtKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRleHR1cmUgdG8gdXNlIGFzIHRoZSBhbHBoYSBtYXNrLlxuXHQgKi9cblx0cHVibGljIGdldCB0ZXh0dXJlKCk6VGV4dHVyZTJEQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3RleHR1cmU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHRleHR1cmUodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0e1xuXHRcdHRoaXMuX3RleHR1cmUgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcblx0e1xuXHRcdHN0YWdlLmFjdGl2YXRlVGV4dHVyZShtZXRob2RWTy50ZXh0dXJlc0luZGV4LCB0aGlzLl90ZXh0dXJlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIHRleHR1cmVSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpO1xuXHRcdHZhciB0ZW1wOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCgpO1xuXHRcdHZhciB1dlJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSB0aGlzLl91c2VTZWNvbmRhcnlVVj8gc2hhcmVkUmVnaXN0ZXJzLnNlY29uZGFyeVVWVmFyeWluZyA6IHNoYXJlZFJlZ2lzdGVycy51dlZhcnlpbmc7XG5cdFx0bWV0aG9kVk8udGV4dHVyZXNJbmRleCA9IHRleHR1cmVSZWcuaW5kZXg7XG5cblx0XHRyZXR1cm4gU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4MkRTYW1wbGVDb2RlKHRlbXAsIHNoYXJlZFJlZ2lzdGVycywgdGV4dHVyZVJlZywgdGhpcy5fdGV4dHVyZSwgc2hhZGVyT2JqZWN0LnVzZVNtb290aFRleHR1cmVzLCBzaGFkZXJPYmplY3QucmVwZWF0VGV4dHVyZXMsIHNoYWRlck9iamVjdC51c2VNaXBtYXBwaW5nLCB1dlJlZykgK1xuXHRcdFx0XCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB0ZW1wICsgXCIueFxcblwiO1xuXHR9XG59XG5cbmV4cG9ydCA9IEVmZmVjdEFscGhhTWFza01ldGhvZDsiXX0=