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
            if (value.hasMipmaps != this._texture.hasMipmaps || value.format != this._texture.format)
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
        stage.activateTexture(methodVO.texturesIndex, this._texture);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRWZmZWN0TGlnaHRNYXBNZXRob2QudHMiXSwibmFtZXMiOlsiRWZmZWN0TGlnaHRNYXBNZXRob2QiLCJFZmZlY3RMaWdodE1hcE1ldGhvZC5jb25zdHJ1Y3RvciIsIkVmZmVjdExpZ2h0TWFwTWV0aG9kLmlJbml0Vk8iLCJFZmZlY3RMaWdodE1hcE1ldGhvZC5ibGVuZE1vZGUiLCJFZmZlY3RMaWdodE1hcE1ldGhvZC50ZXh0dXJlIiwiRWZmZWN0TGlnaHRNYXBNZXRob2QuaUFjdGl2YXRlIiwiRWZmZWN0TGlnaHRNYXBNZXRob2QuaUdldEZyYWdtZW50Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUEsSUFBTyxvQkFBb0IsV0FBYyxrREFBa0QsQ0FBQyxDQUFDO0FBRzdGLElBQU8sZ0JBQWdCLFdBQWUscURBQXFELENBQUMsQ0FBQztBQUU3RixBQUtBOzs7O0dBREc7SUFDRyxvQkFBb0I7SUFBU0EsVUFBN0JBLG9CQUFvQkEsVUFBeUJBO0lBaUJsREE7Ozs7OztPQU1HQTtJQUNIQSxTQXhCS0Esb0JBQW9CQSxDQXdCYkEsT0FBcUJBLEVBQUVBLFNBQTZCQSxFQUFFQSxjQUE4QkE7UUFBN0RDLHlCQUE2QkEsR0FBN0JBLHNCQUE2QkE7UUFBRUEsOEJBQThCQSxHQUE5QkEsc0JBQThCQTtRQUUvRkEsaUJBQU9BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLGNBQWNBLENBQUNBO1FBQ3RDQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxPQUFPQSxDQUFDQTtRQUN4QkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsU0FBU0EsQ0FBQ0E7SUFDNUJBLENBQUNBO0lBRUREOztPQUVHQTtJQUNJQSxzQ0FBT0EsR0FBZEEsVUFBZUEsWUFBNkJBLEVBQUVBLFFBQWlCQTtRQUU5REUsUUFBUUEsQ0FBQ0EsT0FBT0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFDekNBLFFBQVFBLENBQUNBLGdCQUFnQkEsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7SUFDbERBLENBQUNBO0lBUURGLHNCQUFXQSwyQ0FBU0E7UUFOcEJBOzs7OztXQUtHQTthQUNIQTtZQUVDRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUN4QkEsQ0FBQ0E7YUFFREgsVUFBcUJBLEtBQVlBO1lBRWhDRyxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxJQUFJQSxvQkFBb0JBLENBQUNBLEdBQUdBLElBQUlBLEtBQUtBLElBQUlBLG9CQUFvQkEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7Z0JBQy9FQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSxvQkFBb0JBLENBQUNBLENBQUNBO1lBQ3ZDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxJQUFJQSxLQUFLQSxDQUFDQTtnQkFDNUJBLE1BQU1BLENBQUNBO1lBRVJBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEtBQUtBLENBQUNBO1lBRXhCQSxJQUFJQSxDQUFDQSx3QkFBd0JBLEVBQUVBLENBQUNBO1FBQ2pDQSxDQUFDQTs7O09BWkFIO0lBaUJEQSxzQkFBV0EseUNBQU9BO1FBSGxCQTs7V0FFR0E7YUFDSEE7WUFFQ0ksTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFDdEJBLENBQUNBO2FBRURKLFVBQW1CQSxLQUFtQkE7WUFFckNJLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLFVBQVVBLElBQUlBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFVBQVVBLElBQUlBLEtBQUtBLENBQUNBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBO2dCQUN4RkEsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxFQUFFQSxDQUFDQTtZQUVqQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDdkJBLENBQUNBOzs7T0FSQUo7SUFVREE7O09BRUdBO0lBQ0lBLHdDQUFTQSxHQUFoQkEsVUFBaUJBLFlBQTZCQSxFQUFFQSxRQUFpQkEsRUFBRUEsS0FBV0E7UUFFN0VLLEtBQUtBLENBQUNBLGVBQWVBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBRTdEQSxnQkFBS0EsQ0FBQ0EsU0FBU0EsWUFBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7SUFDaERBLENBQUNBO0lBRURMOztPQUVHQTtJQUNJQSwrQ0FBZ0JBLEdBQXZCQSxVQUF3QkEsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxTQUErQkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUUvS00sSUFBSUEsSUFBV0EsQ0FBQ0E7UUFDaEJBLElBQUlBLFdBQVdBLEdBQXlCQSxhQUFhQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO1FBQzFFQSxJQUFJQSxJQUFJQSxHQUF5QkEsYUFBYUEsQ0FBQ0EseUJBQXlCQSxFQUFFQSxDQUFDQTtRQUMzRUEsUUFBUUEsQ0FBQ0EsYUFBYUEsR0FBR0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFFM0NBLElBQUlBLEdBQUdBLG9CQUFvQkEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxJQUFJQSxFQUFFQSxlQUFlQSxFQUFFQSxXQUFXQSxFQUFFQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUFFQSxZQUFZQSxDQUFDQSxpQkFBaUJBLEVBQUVBLFlBQVlBLENBQUNBLGNBQWNBLEVBQUVBLFlBQVlBLENBQUNBLGFBQWFBLEVBQUVBLElBQUlBLENBQUNBLGVBQWVBLEdBQUVBLGVBQWVBLENBQUNBLGtCQUFrQkEsR0FBR0EsZUFBZUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFFalJBLE1BQU1BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO1lBQ3pCQSxLQUFLQSxvQkFBb0JBLENBQUNBLFFBQVFBO2dCQUNqQ0EsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBQ25FQSxLQUFLQSxDQUFDQTtZQUNQQSxLQUFLQSxvQkFBb0JBLENBQUNBLEdBQUdBO2dCQUM1QkEsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBQ25FQSxLQUFLQSxDQUFDQTtRQUNSQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQS9HRE47O09BRUdBO0lBQ1dBLDZCQUFRQSxHQUFVQSxVQUFVQSxDQUFDQTtJQUUzQ0E7O09BRUdBO0lBQ1dBLHdCQUFHQSxHQUFVQSxLQUFLQSxDQUFDQTtJQXdHbENBLDJCQUFDQTtBQUFEQSxDQWxIQSxBQWtIQ0EsRUFsSGtDLGdCQUFnQixFQWtIbEQ7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoibWV0aG9kcy9FZmZlY3RMaWdodE1hcE1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcblxuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgU2hhZGVyQ29tcGlsZXJIZWxwZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcblxuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9kYXRhL01ldGhvZFZPXCIpO1xuaW1wb3J0IEVmZmVjdE1ldGhvZEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9FZmZlY3RNZXRob2RCYXNlXCIpO1xuXG4vKipcbiAqIEVmZmVjdExpZ2h0TWFwTWV0aG9kIHByb3ZpZGVzIGEgbWV0aG9kIHRoYXQgYWxsb3dzIGFwcGx5aW5nIGEgbGlnaHQgbWFwIHRleHR1cmUgdG8gdGhlIGNhbGN1bGF0ZWQgcGl4ZWwgY29sb3VyLlxuICogSXQgaXMgZGlmZmVyZW50IGZyb20gRGlmZnVzZUxpZ2h0TWFwTWV0aG9kIGluIHRoYXQgdGhlIGxhdHRlciBvbmx5IG1vZHVsYXRlcyB0aGUgZGlmZnVzZSBzaGFkaW5nIHZhbHVlIHJhdGhlclxuICogdGhhbiB0aGUgd2hvbGUgcGl4ZWwgY29sb3VyLlxuICovXG5jbGFzcyBFZmZlY3RMaWdodE1hcE1ldGhvZCBleHRlbmRzIEVmZmVjdE1ldGhvZEJhc2Vcbntcblx0LyoqXG5cdCAqIEluZGljYXRlcyB0aGUgbGlnaHQgbWFwIHNob3VsZCBiZSBtdWx0aXBsaWVkIHdpdGggdGhlIGNhbGN1bGF0ZWQgc2hhZGluZyByZXN1bHQuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIE1VTFRJUExZOnN0cmluZyA9IFwibXVsdGlwbHlcIjtcblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIGFkZGVkIGludG8gdGhlIGNhbGN1bGF0ZWQgc2hhZGluZyByZXN1bHQuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIEFERDpzdHJpbmcgPSBcImFkZFwiO1xuXG5cdHByaXZhdGUgX3RleHR1cmU6VGV4dHVyZTJEQmFzZTtcblxuXHRwcml2YXRlIF9ibGVuZE1vZGU6c3RyaW5nO1xuXHRwcml2YXRlIF91c2VTZWNvbmRhcnlVVjpib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IEVmZmVjdExpZ2h0TWFwTWV0aG9kIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHRleHR1cmUgVGhlIHRleHR1cmUgY29udGFpbmluZyB0aGUgbGlnaHQgbWFwLlxuXHQgKiBAcGFyYW0gYmxlbmRNb2RlIFRoZSBibGVuZCBtb2RlIHdpdGggd2hpY2ggdGhlIGxpZ2h0IG1hcCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGUgbGlnaHRpbmcgcmVzdWx0LlxuXHQgKiBAcGFyYW0gdXNlU2Vjb25kYXJ5VVYgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNlY29uZGFyeSBVViBzZXQgc2hvdWxkIGJlIHVzZWQgdG8gbWFwIHRoZSBsaWdodCBtYXAuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih0ZXh0dXJlOlRleHR1cmUyREJhc2UsIGJsZW5kTW9kZTpzdHJpbmcgPSBcIm11bHRpcGx5XCIsIHVzZVNlY29uZGFyeVVWOmJvb2xlYW4gPSBmYWxzZSlcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl91c2VTZWNvbmRhcnlVViA9IHVzZVNlY29uZGFyeVVWO1xuXHRcdHRoaXMuX3RleHR1cmUgPSB0ZXh0dXJlO1xuXHRcdHRoaXMuYmxlbmRNb2RlID0gYmxlbmRNb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRWTyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblx0XHRtZXRob2RWTy5uZWVkc1VWID0gIXRoaXMuX3VzZVNlY29uZGFyeVVWO1xuXHRcdG1ldGhvZFZPLm5lZWRzU2Vjb25kYXJ5VVYgPSB0aGlzLl91c2VTZWNvbmRhcnlVVjtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYmxlbmQgbW9kZSB3aXRoIHdoaWNoIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIGxpZ2h0aW5nIHJlc3VsdC5cblx0ICpcblx0ICogQHNlZSBFZmZlY3RMaWdodE1hcE1ldGhvZC5BRERcblx0ICogQHNlZSBFZmZlY3RMaWdodE1hcE1ldGhvZC5NVUxUSVBMWVxuXHQgKi9cblx0cHVibGljIGdldCBibGVuZE1vZGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLl9ibGVuZE1vZGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGJsZW5kTW9kZSh2YWx1ZTpzdHJpbmcpXG5cdHtcblx0XHRpZiAodmFsdWUgIT0gRWZmZWN0TGlnaHRNYXBNZXRob2QuQUREICYmIHZhbHVlICE9IEVmZmVjdExpZ2h0TWFwTWV0aG9kLk1VTFRJUExZKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBibGVuZG1vZGUhXCIpO1xuXHRcdGlmICh0aGlzLl9ibGVuZE1vZGUgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9ibGVuZE1vZGUgPSB2YWx1ZTtcblxuXHRcdHRoaXMuaUludmFsaWRhdGVTaGFkZXJQcm9ncmFtKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRleHR1cmUgY29udGFpbmluZyB0aGUgbGlnaHQgbWFwLlxuXHQgKi9cblx0cHVibGljIGdldCB0ZXh0dXJlKCk6VGV4dHVyZTJEQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3RleHR1cmU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHRleHR1cmUodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0e1xuXHRcdGlmICh2YWx1ZS5oYXNNaXBtYXBzICE9IHRoaXMuX3RleHR1cmUuaGFzTWlwbWFwcyB8fCB2YWx1ZS5mb3JtYXQgIT0gdGhpcy5fdGV4dHVyZS5mb3JtYXQpXG5cdFx0XHR0aGlzLmlJbnZhbGlkYXRlU2hhZGVyUHJvZ3JhbSgpO1xuXG5cdFx0dGhpcy5fdGV4dHVyZSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHRzdGFnZS5hY3RpdmF0ZVRleHR1cmUobWV0aG9kVk8udGV4dHVyZXNJbmRleCwgdGhpcy5fdGV4dHVyZSk7XG5cblx0XHRzdXBlci5pQWN0aXZhdGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgc3RhZ2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmc7XG5cdFx0dmFyIGxpZ2h0TWFwUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVRleHR1cmVSZWcoKTtcblx0XHR2YXIgdGVtcDpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudFZlY3RvclRlbXAoKTtcblx0XHRtZXRob2RWTy50ZXh0dXJlc0luZGV4ID0gbGlnaHRNYXBSZWcuaW5kZXg7XG5cblx0XHRjb2RlID0gU2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4MkRTYW1wbGVDb2RlKHRlbXAsIHNoYXJlZFJlZ2lzdGVycywgbGlnaHRNYXBSZWcsIHRoaXMuX3RleHR1cmUsIHNoYWRlck9iamVjdC51c2VTbW9vdGhUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnJlcGVhdFRleHR1cmVzLCBzaGFkZXJPYmplY3QudXNlTWlwbWFwcGluZywgdGhpcy5fdXNlU2Vjb25kYXJ5VVY/IHNoYXJlZFJlZ2lzdGVycy5zZWNvbmRhcnlVVlZhcnlpbmcgOiBzaGFyZWRSZWdpc3RlcnMudXZWYXJ5aW5nKTtcblxuXHRcdHN3aXRjaCAodGhpcy5fYmxlbmRNb2RlKSB7XG5cdFx0XHRjYXNlIEVmZmVjdExpZ2h0TWFwTWV0aG9kLk1VTFRJUExZOlxuXHRcdFx0XHRjb2RlICs9IFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGVtcCArIFwiXFxuXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBFZmZlY3RMaWdodE1hcE1ldGhvZC5BREQ6XG5cdFx0XHRcdGNvZGUgKz0gXCJhZGQgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB0ZW1wICsgXCJcXG5cIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cbn1cblxuZXhwb3J0ID0gRWZmZWN0TGlnaHRNYXBNZXRob2Q7Il19