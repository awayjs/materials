var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var DiffuseCompositeMethod = require("awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod");
/**
 * DiffuseLightMapMethod provides a diffuse shading method that uses a light map to modulate the calculated diffuse
 * lighting. It is different from EffectLightMapMethod in that the latter modulates the entire calculated pixel color, rather
 * than only the diffuse lighting value.
 */
var DiffuseLightMapMethod = (function (_super) {
    __extends(DiffuseLightMapMethod, _super);
    /**
     * Creates a new DiffuseLightMapMethod method.
     *
     * @param lightMap The texture containing the light map.
     * @param blendMode The blend mode with which the light map should be applied to the lighting result.
     * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
     * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
     */
    function DiffuseLightMapMethod(lightMap, blendMode, useSecondaryUV, baseMethod) {
        if (blendMode === void 0) { blendMode = "multiply"; }
        if (useSecondaryUV === void 0) { useSecondaryUV = false; }
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this, null, baseMethod);
        this._useSecondaryUV = useSecondaryUV;
        this._lightMapTexture = lightMap;
        this.blendMode = blendMode;
    }
    /**
     * @inheritDoc
     */
    DiffuseLightMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        methodVO.needsSecondaryUV = this._useSecondaryUV;
        methodVO.needsUV = !this._useSecondaryUV;
    };
    Object.defineProperty(DiffuseLightMapMethod.prototype, "blendMode", {
        /**
         * The blend mode with which the light map should be applied to the lighting result.
         *
         * @see DiffuseLightMapMethod.ADD
         * @see DiffuseLightMapMethod.MULTIPLY
         */
        get: function () {
            return this._blendMode;
        },
        set: function (value) {
            if (value != DiffuseLightMapMethod.ADD && value != DiffuseLightMapMethod.MULTIPLY)
                throw new Error("Unknown blendmode!");
            if (this._blendMode == value)
                return;
            this._blendMode = value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseLightMapMethod.prototype, "lightMapTexture", {
        /**
         * The texture containing the light map data.
         */
        get: function () {
            return this._lightMapTexture;
        },
        set: function (value) {
            this._lightMapTexture = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    DiffuseLightMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        stage.activateTexture(methodVO.secondaryTexturesIndex, this._lightMapTexture, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
    };
    /**
     * @inheritDoc
     */
    DiffuseLightMapMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code;
        var lightMapReg = registerCache.getFreeTextureReg();
        var temp = registerCache.getFreeFragmentVectorTemp();
        methodVO.secondaryTexturesIndex = lightMapReg.index;
        code = ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, lightMapReg, this._lightMapTexture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, sharedRegisters.secondaryUVVarying);
        switch (this._blendMode) {
            case DiffuseLightMapMethod.MULTIPLY:
                code += "mul " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
                break;
            case DiffuseLightMapMethod.ADD:
                code += "add " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
                break;
        }
        code += _super.prototype.iGetFragmentPostLightingCode.call(this, shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
        return code;
    };
    /**
     * Indicates the light map should be multiplied with the calculated shading result.
     * This can be used to add pre-calculated shadows or occlusion.
     */
    DiffuseLightMapMethod.MULTIPLY = "multiply";
    /**
     * Indicates the light map should be added into the calculated shading result.
     * This can be used to add pre-calculated lighting or global illumination.
     */
    DiffuseLightMapMethod.ADD = "add";
    return DiffuseLightMapMethod;
})(DiffuseCompositeMethod);
module.exports = DiffuseLightMapMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLnRzIl0sIm5hbWVzIjpbIkRpZmZ1c2VMaWdodE1hcE1ldGhvZCIsIkRpZmZ1c2VMaWdodE1hcE1ldGhvZC5jb25zdHJ1Y3RvciIsIkRpZmZ1c2VMaWdodE1hcE1ldGhvZC5pSW5pdFZPIiwiRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLmJsZW5kTW9kZSIsIkRpZmZ1c2VMaWdodE1hcE1ldGhvZC5saWdodE1hcFRleHR1cmUiLCJEaWZmdXNlTGlnaHRNYXBNZXRob2QuaUFjdGl2YXRlIiwiRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLmlHZXRGcmFnbWVudFBvc3RMaWdodGluZ0NvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVFBLElBQU8sb0JBQW9CLFdBQWMsa0RBQWtELENBQUMsQ0FBQztBQUk3RixJQUFPLHNCQUFzQixXQUFhLDJEQUEyRCxDQUFDLENBQUM7QUFFdkcsQUFLQTs7OztHQURHO0lBQ0cscUJBQXFCO0lBQVNBLFVBQTlCQSxxQkFBcUJBLFVBQStCQTtJQWtCekRBOzs7Ozs7O09BT0dBO0lBQ0hBLFNBMUJLQSxxQkFBcUJBLENBMEJkQSxRQUFzQkEsRUFBRUEsU0FBNkJBLEVBQUVBLGNBQThCQSxFQUFFQSxVQUFvQ0E7UUFBbkdDLHlCQUE2QkEsR0FBN0JBLHNCQUE2QkE7UUFBRUEsOEJBQThCQSxHQUE5QkEsc0JBQThCQTtRQUFFQSwwQkFBb0NBLEdBQXBDQSxpQkFBb0NBO1FBRXRJQSxrQkFBTUEsSUFBSUEsRUFBRUEsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFFeEJBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLGNBQWNBLENBQUNBO1FBQ3RDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLFFBQVFBLENBQUNBO1FBQ2pDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxTQUFTQSxDQUFDQTtJQUM1QkEsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0lBLHVDQUFP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LElBQUlBLENBQUNBLG9CQUFvQkEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBQ25HQSxLQUFLQSxDQUFDQTtZQUNQQSxLQUFLQSxxQkFBcUJBLENBQUNBLEdBQUdBO2dCQUM3QkEsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxvQkFBb0JBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO2dCQUNuR0EsS0FBS0EsQ0FBQ0E7UUFDUkEsQ0FBQ0E7UUFFREEsSUFBSUEsSUFBSUEsZ0JBQUtBLENBQUNBLDRCQUE0QkEsWUFBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsU0FBU0EsRUFBRUEsYUFBYUEsRUFBRUEsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFFOUdBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBakhETjs7O09BR0dBO0lBQ1dBLDhCQUFRQSxHQUFVQSxVQUFVQSxDQUFDQTtJQUUzQ0E7OztPQUdHQTtJQUNXQSx5QkFBR0EsR0FBVUEsS0FBS0EsQ0FBQ0E7SUF3R2xDQSw0QkFBQ0E7QUFBREEsQ0FwSEEsQUFvSENBLEVBcEhtQyxzQkFBc0IsRUFvSHpEO0FBRUQsQUFBK0IsaUJBQXRCLHFCQUFxQixDQUFDIiwiZmlsZSI6Im1ldGhvZHMvRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgU2hhZGVyTGlnaHRpbmdPYmplY3RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJMaWdodGluZ09iamVjdFwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckNhY2hlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcbmltcG9ydCBTaGFkZXJDb21waWxlckhlbHBlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3V0aWxzL1NoYWRlckNvbXBpbGVySGVscGVyXCIpO1xuXG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL2RhdGEvTWV0aG9kVk9cIik7XG5pbXBvcnQgRGlmZnVzZUJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0RpZmZ1c2VCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBEaWZmdXNlQ29tcG9zaXRlTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9EaWZmdXNlQ29tcG9zaXRlTWV0aG9kXCIpO1xuXG4vKipcbiAqIERpZmZ1c2VMaWdodE1hcE1ldGhvZCBwcm92aWRlcyBhIGRpZmZ1c2Ugc2hhZGluZyBtZXRob2QgdGhhdCB1c2VzIGEgbGlnaHQgbWFwIHRvIG1vZHVsYXRlIHRoZSBjYWxjdWxhdGVkIGRpZmZ1c2VcbiAqIGxpZ2h0aW5nLiBJdCBpcyBkaWZmZXJlbnQgZnJvbSBFZmZlY3RMaWdodE1hcE1ldGhvZCBpbiB0aGF0IHRoZSBsYXR0ZXIgbW9kdWxhdGVzIHRoZSBlbnRpcmUgY2FsY3VsYXRlZCBwaXhlbCBjb2xvciwgcmF0aGVyXG4gKiB0aGFuIG9ubHkgdGhlIGRpZmZ1c2UgbGlnaHRpbmcgdmFsdWUuXG4gKi9cbmNsYXNzIERpZmZ1c2VMaWdodE1hcE1ldGhvZCBleHRlbmRzIERpZmZ1c2VDb21wb3NpdGVNZXRob2Rcbntcblx0LyoqXG5cdCAqIEluZGljYXRlcyB0aGUgbGlnaHQgbWFwIHNob3VsZCBiZSBtdWx0aXBsaWVkIHdpdGggdGhlIGNhbGN1bGF0ZWQgc2hhZGluZyByZXN1bHQuXG5cdCAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gYWRkIHByZS1jYWxjdWxhdGVkIHNoYWRvd3Mgb3Igb2NjbHVzaW9uLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBNVUxUSVBMWTpzdHJpbmcgPSBcIm11bHRpcGx5XCI7XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB0aGUgbGlnaHQgbWFwIHNob3VsZCBiZSBhZGRlZCBpbnRvIHRoZSBjYWxjdWxhdGVkIHNoYWRpbmcgcmVzdWx0LlxuXHQgKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGFkZCBwcmUtY2FsY3VsYXRlZCBsaWdodGluZyBvciBnbG9iYWwgaWxsdW1pbmF0aW9uLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBBREQ6c3RyaW5nID0gXCJhZGRcIjtcblxuXHRwcml2YXRlIF9saWdodE1hcFRleHR1cmU6VGV4dHVyZTJEQmFzZTtcblx0cHJpdmF0ZSBfYmxlbmRNb2RlOnN0cmluZztcblx0cHJpdmF0ZSBfdXNlU2Vjb25kYXJ5VVY6Ym9vbGVhbjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBEaWZmdXNlTGlnaHRNYXBNZXRob2QgbWV0aG9kLlxuXHQgKlxuXHQgKiBAcGFyYW0gbGlnaHRNYXAgVGhlIHRleHR1cmUgY29udGFpbmluZyB0aGUgbGlnaHQgbWFwLlxuXHQgKiBAcGFyYW0gYmxlbmRNb2RlIFRoZSBibGVuZCBtb2RlIHdpdGggd2hpY2ggdGhlIGxpZ2h0IG1hcCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGUgbGlnaHRpbmcgcmVzdWx0LlxuXHQgKiBAcGFyYW0gdXNlU2Vjb25kYXJ5VVYgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNlY29uZGFyeSBVViBzZXQgc2hvdWxkIGJlIHVzZWQgdG8gbWFwIHRoZSBsaWdodCBtYXAuXG5cdCAqIEBwYXJhbSBiYXNlTWV0aG9kIFRoZSBkaWZmdXNlIG1ldGhvZCB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcmVndWxhciBkaWZmdXNlLWJhc2VkIGxpZ2h0aW5nLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobGlnaHRNYXA6VGV4dHVyZTJEQmFzZSwgYmxlbmRNb2RlOnN0cmluZyA9IFwibXVsdGlwbHlcIiwgdXNlU2Vjb25kYXJ5VVY6Ym9vbGVhbiA9IGZhbHNlLCBiYXNlTWV0aG9kOkRpZmZ1c2VCYXNpY01ldGhvZCA9IG51bGwpXG5cdHtcblx0XHRzdXBlcihudWxsLCBiYXNlTWV0aG9kKTtcblxuXHRcdHRoaXMuX3VzZVNlY29uZGFyeVVWID0gdXNlU2Vjb25kYXJ5VVY7XG5cdFx0dGhpcy5fbGlnaHRNYXBUZXh0dXJlID0gbGlnaHRNYXA7XG5cdFx0dGhpcy5ibGVuZE1vZGUgPSBibGVuZE1vZGU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpSW5pdFZPKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblx0XHRtZXRob2RWTy5uZWVkc1NlY29uZGFyeVVWID0gdGhpcy5fdXNlU2Vjb25kYXJ5VVY7XG5cdFx0bWV0aG9kVk8ubmVlZHNVViA9ICF0aGlzLl91c2VTZWNvbmRhcnlVVjtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYmxlbmQgbW9kZSB3aXRoIHdoaWNoIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIGxpZ2h0aW5nIHJlc3VsdC5cblx0ICpcblx0ICogQHNlZSBEaWZmdXNlTGlnaHRNYXBNZXRob2QuQUREXG5cdCAqIEBzZWUgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLk1VTFRJUExZXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGJsZW5kTW9kZSgpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2JsZW5kTW9kZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgYmxlbmRNb2RlKHZhbHVlOnN0cmluZylcblx0e1xuXHRcdGlmICh2YWx1ZSAhPSBEaWZmdXNlTGlnaHRNYXBNZXRob2QuQUREICYmIHZhbHVlICE9IERpZmZ1c2VMaWdodE1hcE1ldGhvZC5NVUxUSVBMWSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVua25vd24gYmxlbmRtb2RlIVwiKTtcblxuXHRcdGlmICh0aGlzLl9ibGVuZE1vZGUgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9ibGVuZE1vZGUgPSB2YWx1ZTtcblxuXHRcdHRoaXMuaUludmFsaWRhdGVTaGFkZXJQcm9ncmFtKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRleHR1cmUgY29udGFpbmluZyB0aGUgbGlnaHQgbWFwIGRhdGEuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGxpZ2h0TWFwVGV4dHVyZSgpOlRleHR1cmUyREJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9saWdodE1hcFRleHR1cmU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGxpZ2h0TWFwVGV4dHVyZSh2YWx1ZTpUZXh0dXJlMkRCYXNlKVxuXHR7XG5cdFx0dGhpcy5fbGlnaHRNYXBUZXh0dXJlID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpQWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHRzdGFnZS5hY3RpdmF0ZVRleHR1cmUobWV0aG9kVk8uc2Vjb25kYXJ5VGV4dHVyZXNJbmRleCwgdGhpcy5fbGlnaHRNYXBUZXh0dXJlLCBzaGFkZXJPYmplY3QucmVwZWF0VGV4dHVyZXMsIHNoYWRlck9iamVjdC51c2VTbW9vdGhUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcpO1xuXG5cdFx0c3VwZXIuaUFjdGl2YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHN0YWdlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlHZXRGcmFnbWVudFBvc3RMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZztcblx0XHR2YXIgbGlnaHRNYXBSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpO1xuXHRcdHZhciB0ZW1wOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCgpO1xuXHRcdG1ldGhvZFZPLnNlY29uZGFyeVRleHR1cmVzSW5kZXggPSBsaWdodE1hcFJlZy5pbmRleDtcblxuXHRcdGNvZGUgPSBTaGFkZXJDb21waWxlckhlbHBlci5nZXRUZXgyRFNhbXBsZUNvZGUodGVtcCwgc2hhcmVkUmVnaXN0ZXJzLCBsaWdodE1hcFJlZywgdGhpcy5fbGlnaHRNYXBUZXh0dXJlLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXMsIHNoYWRlck9iamVjdC5yZXBlYXRUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcsIHNoYXJlZFJlZ2lzdGVycy5zZWNvbmRhcnlVVlZhcnlpbmcpO1xuXG5cdFx0c3dpdGNoICh0aGlzLl9ibGVuZE1vZGUpIHtcblx0XHRcdGNhc2UgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLk1VTFRJUExZOlxuXHRcdFx0XHRjb2RlICs9IFwibXVsIFwiICsgdGhpcy5fcFRvdGFsTGlnaHRDb2xvclJlZyArIFwiLCBcIiArIHRoaXMuX3BUb3RhbExpZ2h0Q29sb3JSZWcgKyBcIiwgXCIgKyB0ZW1wICsgXCJcXG5cIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIERpZmZ1c2VMaWdodE1hcE1ldGhvZC5BREQ6XG5cdFx0XHRcdGNvZGUgKz0gXCJhZGQgXCIgKyB0aGlzLl9wVG90YWxMaWdodENvbG9yUmVnICsgXCIsIFwiICsgdGhpcy5fcFRvdGFsTGlnaHRDb2xvclJlZyArIFwiLCBcIiArIHRlbXAgKyBcIlxcblwiO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRjb2RlICs9IHN1cGVyLmlHZXRGcmFnbWVudFBvc3RMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgdGFyZ2V0UmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cbn1cblxuZXhwb3J0ID0gRGlmZnVzZUxpZ2h0TWFwTWV0aG9kOyJdfQ==