var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var EffectMethodBase = require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
/**
 * EffectLightMapMethod provides a method that allows applying a light map texture to the calculated pixel colour.
 * It is different from DiffuseLightMapMethod in that the latter only modulates the diffuse shading value rather
 * than the whole pixel colour.
 */
var EffectLightMapMethod = (function (_super) {
    __extends(EffectLightMapMethod, _super);
    /**
     * Creates a new EffectLightMapMethod object.
     *
     * @param texture The texture containing the light map.
     * @param blendMode The blend mode with which the light map should be applied to the lighting result.
     * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
     */
    function EffectLightMapMethod(texture, blendMode, useSecondaryUV) {
        if (blendMode === void 0) { blendMode = "multiply"; }
        if (useSecondaryUV === void 0) { useSecondaryUV = false; }
        _super.call(this);
        this._useSecondaryUV = useSecondaryUV;
        this._texture = texture;
        this.blendMode = blendMode;
    }
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsUV = !this._useSecondaryUV;
        methodVO.needsSecondaryUV = this._useSecondaryUV;
    };
    Object.defineProperty(EffectLightMapMethod.prototype, "blendMode", {
        /**
         * The blend mode with which the light map should be applied to the lighting result.
         *
         * @see EffectLightMapMethod.ADD
         * @see EffectLightMapMethod.MULTIPLY
         */
        get: function () {
            return this._blendMode;
        },
        set: function (value) {
            if (value != EffectLightMapMethod.ADD && value != EffectLightMapMethod.MULTIPLY)
                throw new Error("Unknown blendmode!");
            if (this._blendMode == value)
                return;
            this._blendMode = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectLightMapMethod.prototype, "texture", {
        /**
         * The texture containing the light map.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            if (value.format != this._texture.format)
                this.iInvalidateShaderProgram();
            this._texture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        stage.activateTexture(methodVO.texturesIndex, this._texture, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    EffectLightMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code;
        var lightMapReg = registerCache.getFreeTextureReg();
        var temp = registerCache.getFreeFragmentVectorTemp();
        methodVO.texturesIndex = lightMapReg.index;
        code = ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, lightMapReg, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, this._useSecondaryUV ? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);
        switch (this._blendMode) {
            case EffectLightMapMethod.MULTIPLY:
                code += "mul " + targetReg + ", " + targetReg + ", " + temp + "\n";
                break;
            case EffectLightMapMethod.ADD:
                code += "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
                break;
        }
        return code;
    };
    /**
     * Indicates the light map should be multiplied with the calculated shading result.
     */
    EffectLightMapMethod.MULTIPLY = "multiply";
    /**
     * Indicates the light map should be added into the calculated shading result.
     */
    EffectLightMapMethod.ADD = "add";
    return EffectLightMapMethod;
})(EffectMethodBase);
module.exports = EffectLightMapMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRWZmZWN0TGlnaHRNYXBNZXRob2QudHMiXSwibmFtZXMiOlsiRWZmZWN0TGlnaHRNYXBNZXRob2QiLCJFZmZlY3RMaWdodE1hcE1ldGhvZC5jb25zdHJ1Y3RvciIsIkVmZmVjdExpZ2h0TWFwTWV0aG9kLmlJbml0Vk8iLCJFZmZlY3RMaWdodE1hcE1ldGhvZC5ibGVuZE1vZGUiLCJFZmZlY3RMaWdodE1hcE1ldGhvZC50ZXh0dXJlIiwiRWZmZWN0TGlnaHRNYXBNZXRob2QuaUFjdGl2YXRlIiwiRWZmZWN0TGlnaHRNYXBNZXRob2QuaUdldEZyYWdtZW50Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUEsSUFBTyxvQkFBb0IsV0FBYyxrREFBa0QsQ0FBQyxDQUFDO0FBRzdGLElBQU8sZ0JBQWdCLFdBQWUscURBQXFELENBQUMsQ0FBQztBQUU3RixBQUtBOzs7O0dBREc7SUFDRyxvQkFBb0I7SUFBU0EsVUFBN0JBLG9CQUFvQkEsVUFBeUJBO0lBaUJsREE7Ozs7OztPQU1HQTtJQUNIQSxTQXhCS0Esb0JBQW9CQSxDQXdCYkEsT0FBcUJBLEVBQUVBLFNBQTZCQSxFQUFFQSxjQUE4QkE7UUFBN0RDLHlCQUE2QkEsR0FBN0JBLHNCQUE2QkE7UUFBRUEsOEJBQThCQSxHQUE5QkEsc0JBQThCQTtRQUUvRkEsaUJBQU9BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLGNBQWNBLENBQUNBO1FBQ3RDQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxPQUFPQSxDQUFDQTtRQUN4QkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsU0FBU0EsQ0FBQ0E7SUFDNUJBLENBQUNBO0lBRUREOztPQUVHQTtJQUNJQSxzQ0FBT0EsR0FBZEEsVUFBZUEsWUFBNkJBLEVBQUVBLFFBQWlCQTtRQUU5REUsUUFBUUEsQ0FBQ0EsT0FBT0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFD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QSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDbkVBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLG9CQUFvQkEsQ0FBQ0EsR0FBR0E7Z0JBQzVCQSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDbkVBLEtBQUtBLENBQUNBO1FBQ1JBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBL0dETjs7T0FFR0E7SUFDV0EsNkJBQVFBLEdBQVVBLFVBQVVBLENBQUNBO0lBRTNDQTs7T0FFR0E7SUFDV0Esd0JBQUdBLEdBQVVBLEtBQUtBLENBQUNBO0lBd0dsQ0EsMkJBQUNBO0FBQURBLENBbEhBLEFBa0hDQSxFQWxIa0MsZ0JBQWdCLEVBa0hsRDtBQUVELEFBQThCLGlCQUFyQixvQkFBb0IsQ0FBQyIsImZpbGUiOiJtZXRob2RzL0VmZmVjdExpZ2h0TWFwTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xyXG5cclxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcclxuXHJcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xyXG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xyXG5pbXBvcnQgU2hhZGVyQ29tcGlsZXJIZWxwZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcclxuXHJcbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvZGF0YS9NZXRob2RWT1wiKTtcclxuaW1wb3J0IEVmZmVjdE1ldGhvZEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9FZmZlY3RNZXRob2RCYXNlXCIpO1xyXG5cclxuLyoqXHJcbiAqIEVmZmVjdExpZ2h0TWFwTWV0aG9kIHByb3ZpZGVzIGEgbWV0aG9kIHRoYXQgYWxsb3dzIGFwcGx5aW5nIGEgbGlnaHQgbWFwIHRleHR1cmUgdG8gdGhlIGNhbGN1bGF0ZWQgcGl4ZWwgY29sb3VyLlxyXG4gKiBJdCBpcyBkaWZmZXJlbnQgZnJvbSBEaWZmdXNlTGlnaHRNYXBNZXRob2QgaW4gdGhhdCB0aGUgbGF0dGVyIG9ubHkgbW9kdWxhdGVzIHRoZSBkaWZmdXNlIHNoYWRpbmcgdmFsdWUgcmF0aGVyXHJcbiAqIHRoYW4gdGhlIHdob2xlIHBpeGVsIGNvbG91ci5cclxuICovXHJcbmNsYXNzIEVmZmVjdExpZ2h0TWFwTWV0aG9kIGV4dGVuZHMgRWZmZWN0TWV0aG9kQmFzZVxyXG57XHJcblx0LyoqXHJcblx0ICogSW5kaWNhdGVzIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIG11bHRpcGxpZWQgd2l0aCB0aGUgY2FsY3VsYXRlZCBzaGFkaW5nIHJlc3VsdC5cclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIE1VTFRJUExZOnN0cmluZyA9IFwibXVsdGlwbHlcIjtcclxuXHJcblx0LyoqXHJcblx0ICogSW5kaWNhdGVzIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIGFkZGVkIGludG8gdGhlIGNhbGN1bGF0ZWQgc2hhZGluZyByZXN1bHQuXHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyBBREQ6c3RyaW5nID0gXCJhZGRcIjtcclxuXHJcblx0cHJpdmF0ZSBfdGV4dHVyZTpUZXh0dXJlMkRCYXNlO1xyXG5cclxuXHRwcml2YXRlIF9ibGVuZE1vZGU6c3RyaW5nO1xyXG5cdHByaXZhdGUgX3VzZVNlY29uZGFyeVVWOmJvb2xlYW47XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgYSBuZXcgRWZmZWN0TGlnaHRNYXBNZXRob2Qgb2JqZWN0LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHRleHR1cmUgVGhlIHRleHR1cmUgY29udGFpbmluZyB0aGUgbGlnaHQgbWFwLlxyXG5cdCAqIEBwYXJhbSBibGVuZE1vZGUgVGhlIGJsZW5kIG1vZGUgd2l0aCB3aGljaCB0aGUgbGlnaHQgbWFwIHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoZSBsaWdodGluZyByZXN1bHQuXHJcblx0ICogQHBhcmFtIHVzZVNlY29uZGFyeVVWIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzZWNvbmRhcnkgVVYgc2V0IHNob3VsZCBiZSB1c2VkIHRvIG1hcCB0aGUgbGlnaHQgbWFwLlxyXG5cdCAqL1xyXG5cdGNvbnN0cnVjdG9yKHRleHR1cmU6VGV4dHVyZTJEQmFzZSwgYmxlbmRNb2RlOnN0cmluZyA9IFwibXVsdGlwbHlcIiwgdXNlU2Vjb25kYXJ5VVY6Ym9vbGVhbiA9IGZhbHNlKVxyXG5cdHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdFx0dGhpcy5fdXNlU2Vjb25kYXJ5VVYgPSB1c2VTZWNvbmRhcnlVVjtcclxuXHRcdHRoaXMuX3RleHR1cmUgPSB0ZXh0dXJlO1xyXG5cdFx0dGhpcy5ibGVuZE1vZGUgPSBibGVuZE1vZGU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpSW5pdFZPKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcclxuXHR7XHJcblx0XHRtZXRob2RWTy5uZWVkc1VWID0gIXRoaXMuX3VzZVNlY29uZGFyeVVWO1xyXG5cdFx0bWV0aG9kVk8ubmVlZHNTZWNvbmRhcnlVViA9IHRoaXMuX3VzZVNlY29uZGFyeVVWO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIGJsZW5kIG1vZGUgd2l0aCB3aGljaCB0aGUgbGlnaHQgbWFwIHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoZSBsaWdodGluZyByZXN1bHQuXHJcblx0ICpcclxuXHQgKiBAc2VlIEVmZmVjdExpZ2h0TWFwTWV0aG9kLkFERFxyXG5cdCAqIEBzZWUgRWZmZWN0TGlnaHRNYXBNZXRob2QuTVVMVElQTFlcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGJsZW5kTW9kZSgpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9ibGVuZE1vZGU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGJsZW5kTW9kZSh2YWx1ZTpzdHJpbmcpXHJcblx0e1xyXG5cdFx0aWYgKHZhbHVlICE9IEVmZmVjdExpZ2h0TWFwTWV0aG9kLkFERCAmJiB2YWx1ZSAhPSBFZmZlY3RMaWdodE1hcE1ldGhvZC5NVUxUSVBMWSlcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBibGVuZG1vZGUhXCIpO1xyXG5cdFx0aWYgKHRoaXMuX2JsZW5kTW9kZSA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2JsZW5kTW9kZSA9IHZhbHVlO1xyXG5cclxuXHRcdHRoaXMuaUludmFsaWRhdGVTaGFkZXJQcm9ncmFtKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgdGV4dHVyZSBjb250YWluaW5nIHRoZSBsaWdodCBtYXAuXHJcblx0ICovXHJcblx0cHVibGljIGdldCB0ZXh0dXJlKCk6VGV4dHVyZTJEQmFzZVxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl90ZXh0dXJlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB0ZXh0dXJlKHZhbHVlOlRleHR1cmUyREJhc2UpXHJcblx0e1xyXG5cdFx0aWYgKHZhbHVlLmZvcm1hdCAhPSB0aGlzLl90ZXh0dXJlLmZvcm1hdClcclxuXHRcdFx0dGhpcy5pSW52YWxpZGF0ZVNoYWRlclByb2dyYW0oKTtcclxuXHJcblx0XHR0aGlzLl90ZXh0dXJlID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpQWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcclxuXHR7XHJcblx0XHRzdGFnZS5hY3RpdmF0ZVRleHR1cmUobWV0aG9kVk8udGV4dHVyZXNJbmRleCwgdGhpcy5fdGV4dHVyZSwgc2hhZGVyT2JqZWN0LnJlcGVhdFRleHR1cmVzLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXMsIHNoYWRlck9iamVjdC51c2VNaXBtYXBwaW5nKTtcclxuXHJcblx0XHRzdXBlci5pQWN0aXZhdGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgc3RhZ2UpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0dmFyIGNvZGU6c3RyaW5nO1xyXG5cdFx0dmFyIGxpZ2h0TWFwUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVRleHR1cmVSZWcoKTtcclxuXHRcdHZhciB0ZW1wOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCgpO1xyXG5cdFx0bWV0aG9kVk8udGV4dHVyZXNJbmRleCA9IGxpZ2h0TWFwUmVnLmluZGV4O1xyXG5cclxuXHRcdGNvZGUgPSBTaGFkZXJDb21waWxlckhlbHBlci5nZXRUZXgyRFNhbXBsZUNvZGUodGVtcCwgc2hhcmVkUmVnaXN0ZXJzLCBsaWdodE1hcFJlZywgdGhpcy5fdGV4dHVyZSwgc2hhZGVyT2JqZWN0LnVzZVNtb290aFRleHR1cmVzLCBzaGFkZXJPYmplY3QucmVwZWF0VGV4dHVyZXMsIHNoYWRlck9iamVjdC51c2VNaXBtYXBwaW5nLCB0aGlzLl91c2VTZWNvbmRhcnlVVj8gc2hhcmVkUmVnaXN0ZXJzLnNlY29uZGFyeVVWVmFyeWluZyA6IHNoYXJlZFJlZ2lzdGVycy51dlZhcnlpbmcpO1xyXG5cclxuXHRcdHN3aXRjaCAodGhpcy5fYmxlbmRNb2RlKSB7XHJcblx0XHRcdGNhc2UgRWZmZWN0TGlnaHRNYXBNZXRob2QuTVVMVElQTFk6XHJcblx0XHRcdFx0Y29kZSArPSBcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRlbXAgKyBcIlxcblwiO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIEVmZmVjdExpZ2h0TWFwTWV0aG9kLkFERDpcclxuXHRcdFx0XHRjb2RlICs9IFwiYWRkIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGVtcCArIFwiXFxuXCI7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGNvZGU7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgPSBFZmZlY3RMaWdodE1hcE1ldGhvZDsiXX0=