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
        stage.activateTexture(methodVO.secondaryTexturesIndex, this._lightMapTexture);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLnRzIl0sIm5hbWVzIjpbIkRpZmZ1c2VMaWdodE1hcE1ldGhvZCIsIkRpZmZ1c2VMaWdodE1hcE1ldGhvZC5jb25zdHJ1Y3RvciIsIkRpZmZ1c2VMaWdodE1hcE1ldGhvZC5pSW5pdFZPIiwiRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLmJsZW5kTW9kZSIsIkRpZmZ1c2VMaWdodE1hcE1ldGhvZC5saWdodE1hcFRleHR1cmUiLCJEaWZmdXNlTGlnaHRNYXBNZXRob2QuaUFjdGl2YXRlIiwiRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLmlHZXRGcmFnbWVudFBvc3RMaWdodGluZ0NvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVFBLElBQU8sb0JBQW9CLFdBQWMsa0RBQWtELENBQUMsQ0FBQztBQUk3RixJQUFPLHNCQUFzQixXQUFhLDJEQUEyRCxDQUFDLENBQUM7QUFFdkcsQUFLQTs7OztHQURHO0lBQ0cscUJBQXFCO0lBQVNBLFVBQTlCQSxxQkFBcUJBLFVBQStCQTtJQWtCekRBOzs7Ozs7O09BT0dBO0lBQ0hBLFNBMUJLQSxxQkFBcUJBLENBMEJkQSxRQUFzQkEsRUFBRUEsU0FBNkJBLEVBQUVBLGNBQThCQSxFQUFFQSxVQUFvQ0E7UUFBbkdDLHlCQUE2QkEsR0FBN0JBLHNCQUE2QkE7UUFBRUEsOEJBQThCQSxHQUE5QkEsc0JBQThCQTtRQUFFQSwwQkFBb0NBLEdBQXBDQSxpQkFBb0NBO1FBRXRJQSxrQkFBTUEsSUFBSUEsRUFBRUEsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFFeEJBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLGNBQWNBLENBQUNBO1FBQ3RDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLFFBQVFBLENBQUNBO1FBQ2pDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxTQUFTQSxDQUFDQTtJQUM1QkEsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0lBLHVDQUFP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S0EsQ0FBQ0E7WUFDUEEsS0FBS0EscUJBQXFCQSxDQUFDQSxHQUFHQTtnQkFDN0JBLElBQUlBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLG9CQUFvQkEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDbkdBLEtBQUtBLENBQUNBO1FBQ1JBLENBQUNBO1FBRURBLElBQUlBLElBQUlBLGdCQUFLQSxDQUFDQSw0QkFBNEJBLFlBQUNBLFlBQVlBLEVBQUVBLFFBQVFBLEVBQUVBLFNBQVNBLEVBQUVBLGFBQWFBLEVBQUVBLGVBQWVBLENBQUNBLENBQUNBO1FBRTlHQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQWpIRE47OztPQUdHQTtJQUNXQSw4QkFBUUEsR0FBVUEsVUFBVUEsQ0FBQ0E7SUFFM0NBOzs7T0FHR0E7SUFDV0EseUJBQUdBLEdBQVVBLEtBQUtBLENBQUNBO0lBd0dsQ0EsNEJBQUNBO0FBQURBLENBcEhBLEFBb0hDQSxFQXBIbUMsc0JBQXNCLEVBb0h6RDtBQUVELEFBQStCLGlCQUF0QixxQkFBcUIsQ0FBQyIsImZpbGUiOiJtZXRob2RzL0RpZmZ1c2VMaWdodE1hcE1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcblxuaW1wb3J0IFNoYWRlckxpZ2h0aW5nT2JqZWN0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyTGlnaHRpbmdPYmplY3RcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgU2hhZGVyQ29tcGlsZXJIZWxwZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcblxuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9kYXRhL01ldGhvZFZPXCIpO1xuaW1wb3J0IERpZmZ1c2VCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9EaWZmdXNlQmFzaWNNZXRob2RcIik7XG5pbXBvcnQgRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZFwiKTtcblxuLyoqXG4gKiBEaWZmdXNlTGlnaHRNYXBNZXRob2QgcHJvdmlkZXMgYSBkaWZmdXNlIHNoYWRpbmcgbWV0aG9kIHRoYXQgdXNlcyBhIGxpZ2h0IG1hcCB0byBtb2R1bGF0ZSB0aGUgY2FsY3VsYXRlZCBkaWZmdXNlXG4gKiBsaWdodGluZy4gSXQgaXMgZGlmZmVyZW50IGZyb20gRWZmZWN0TGlnaHRNYXBNZXRob2QgaW4gdGhhdCB0aGUgbGF0dGVyIG1vZHVsYXRlcyB0aGUgZW50aXJlIGNhbGN1bGF0ZWQgcGl4ZWwgY29sb3IsIHJhdGhlclxuICogdGhhbiBvbmx5IHRoZSBkaWZmdXNlIGxpZ2h0aW5nIHZhbHVlLlxuICovXG5jbGFzcyBEaWZmdXNlTGlnaHRNYXBNZXRob2QgZXh0ZW5kcyBEaWZmdXNlQ29tcG9zaXRlTWV0aG9kXG57XG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgdGhlIGxpZ2h0IG1hcCBzaG91bGQgYmUgbXVsdGlwbGllZCB3aXRoIHRoZSBjYWxjdWxhdGVkIHNoYWRpbmcgcmVzdWx0LlxuXHQgKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGFkZCBwcmUtY2FsY3VsYXRlZCBzaGFkb3dzIG9yIG9jY2x1c2lvbi5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgTVVMVElQTFk6c3RyaW5nID0gXCJtdWx0aXBseVwiO1xuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgdGhlIGxpZ2h0IG1hcCBzaG91bGQgYmUgYWRkZWQgaW50byB0aGUgY2FsY3VsYXRlZCBzaGFkaW5nIHJlc3VsdC5cblx0ICogVGhpcyBjYW4gYmUgdXNlZCB0byBhZGQgcHJlLWNhbGN1bGF0ZWQgbGlnaHRpbmcgb3IgZ2xvYmFsIGlsbHVtaW5hdGlvbi5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgQUREOnN0cmluZyA9IFwiYWRkXCI7XG5cblx0cHJpdmF0ZSBfbGlnaHRNYXBUZXh0dXJlOlRleHR1cmUyREJhc2U7XG5cdHByaXZhdGUgX2JsZW5kTW9kZTpzdHJpbmc7XG5cdHByaXZhdGUgX3VzZVNlY29uZGFyeVVWOmJvb2xlYW47XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kIG1ldGhvZC5cblx0ICpcblx0ICogQHBhcmFtIGxpZ2h0TWFwIFRoZSB0ZXh0dXJlIGNvbnRhaW5pbmcgdGhlIGxpZ2h0IG1hcC5cblx0ICogQHBhcmFtIGJsZW5kTW9kZSBUaGUgYmxlbmQgbW9kZSB3aXRoIHdoaWNoIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIGxpZ2h0aW5nIHJlc3VsdC5cblx0ICogQHBhcmFtIHVzZVNlY29uZGFyeVVWIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzZWNvbmRhcnkgVVYgc2V0IHNob3VsZCBiZSB1c2VkIHRvIG1hcCB0aGUgbGlnaHQgbWFwLlxuXHQgKiBAcGFyYW0gYmFzZU1ldGhvZCBUaGUgZGlmZnVzZSBtZXRob2QgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHJlZ3VsYXIgZGlmZnVzZS1iYXNlZCBsaWdodGluZy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxpZ2h0TWFwOlRleHR1cmUyREJhc2UsIGJsZW5kTW9kZTpzdHJpbmcgPSBcIm11bHRpcGx5XCIsIHVzZVNlY29uZGFyeVVWOmJvb2xlYW4gPSBmYWxzZSwgYmFzZU1ldGhvZDpEaWZmdXNlQmFzaWNNZXRob2QgPSBudWxsKVxuXHR7XG5cdFx0c3VwZXIobnVsbCwgYmFzZU1ldGhvZCk7XG5cblx0XHR0aGlzLl91c2VTZWNvbmRhcnlVViA9IHVzZVNlY29uZGFyeVVWO1xuXHRcdHRoaXMuX2xpZ2h0TWFwVGV4dHVyZSA9IGxpZ2h0TWFwO1xuXHRcdHRoaXMuYmxlbmRNb2RlID0gYmxlbmRNb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRWTyhzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cdFx0bWV0aG9kVk8ubmVlZHNTZWNvbmRhcnlVViA9IHRoaXMuX3VzZVNlY29uZGFyeVVWO1xuXHRcdG1ldGhvZFZPLm5lZWRzVVYgPSAhdGhpcy5fdXNlU2Vjb25kYXJ5VVY7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGJsZW5kIG1vZGUgd2l0aCB3aGljaCB0aGUgbGlnaHQgbWFwIHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoZSBsaWdodGluZyByZXN1bHQuXG5cdCAqXG5cdCAqIEBzZWUgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLkFERFxuXHQgKiBAc2VlIERpZmZ1c2VMaWdodE1hcE1ldGhvZC5NVUxUSVBMWVxuXHQgKi9cblx0cHVibGljIGdldCBibGVuZE1vZGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLl9ibGVuZE1vZGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGJsZW5kTW9kZSh2YWx1ZTpzdHJpbmcpXG5cdHtcblx0XHRpZiAodmFsdWUgIT0gRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLkFERCAmJiB2YWx1ZSAhPSBEaWZmdXNlTGlnaHRNYXBNZXRob2QuTVVMVElQTFkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGJsZW5kbW9kZSFcIik7XG5cblx0XHRpZiAodGhpcy5fYmxlbmRNb2RlID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYmxlbmRNb2RlID0gdmFsdWU7XG5cblx0XHR0aGlzLmlJbnZhbGlkYXRlU2hhZGVyUHJvZ3JhbSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0ZXh0dXJlIGNvbnRhaW5pbmcgdGhlIGxpZ2h0IG1hcCBkYXRhLlxuXHQgKi9cblx0cHVibGljIGdldCBsaWdodE1hcFRleHR1cmUoKTpUZXh0dXJlMkRCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbGlnaHRNYXBUZXh0dXJlO1xuXHR9XG5cblx0cHVibGljIHNldCBsaWdodE1hcFRleHR1cmUodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0e1xuXHRcdHRoaXMuX2xpZ2h0TWFwVGV4dHVyZSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0c3RhZ2UuYWN0aXZhdGVUZXh0dXJlKG1ldGhvZFZPLnNlY29uZGFyeVRleHR1cmVzSW5kZXgsIHRoaXMuX2xpZ2h0TWFwVGV4dHVyZSk7XG5cblx0XHRzdXBlci5pQWN0aXZhdGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgc3RhZ2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50UG9zdExpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nO1xuXHRcdHZhciBsaWdodE1hcFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVUZXh0dXJlUmVnKCk7XG5cdFx0dmFyIHRlbXA6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wKCk7XG5cdFx0bWV0aG9kVk8uc2Vjb25kYXJ5VGV4dHVyZXNJbmRleCA9IGxpZ2h0TWFwUmVnLmluZGV4O1xuXG5cdFx0Y29kZSA9IFNoYWRlckNvbXBpbGVySGVscGVyLmdldFRleDJEU2FtcGxlQ29kZSh0ZW1wLCBzaGFyZWRSZWdpc3RlcnMsIGxpZ2h0TWFwUmVnLCB0aGlzLl9saWdodE1hcFRleHR1cmUsIHNoYWRlck9iamVjdC51c2VTbW9vdGhUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnJlcGVhdFRleHR1cmVzLCBzaGFkZXJPYmplY3QudXNlTWlwbWFwcGluZywgc2hhcmVkUmVnaXN0ZXJzLnNlY29uZGFyeVVWVmFyeWluZyk7XG5cblx0XHRzd2l0Y2ggKHRoaXMuX2JsZW5kTW9kZSkge1xuXHRcdFx0Y2FzZSBEaWZmdXNlTGlnaHRNYXBNZXRob2QuTVVMVElQTFk6XG5cdFx0XHRcdGNvZGUgKz0gXCJtdWwgXCIgKyB0aGlzLl9wVG90YWxMaWdodENvbG9yUmVnICsgXCIsIFwiICsgdGhpcy5fcFRvdGFsTGlnaHRDb2xvclJlZyArIFwiLCBcIiArIHRlbXAgKyBcIlxcblwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLkFERDpcblx0XHRcdFx0Y29kZSArPSBcImFkZCBcIiArIHRoaXMuX3BUb3RhbExpZ2h0Q29sb3JSZWcgKyBcIiwgXCIgKyB0aGlzLl9wVG90YWxMaWdodENvbG9yUmVnICsgXCIsIFwiICsgdGVtcCArIFwiXFxuXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdGNvZGUgKz0gc3VwZXIuaUdldEZyYWdtZW50UG9zdExpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCB0YXJnZXRSZWcsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxufVxuXG5leHBvcnQgPSBEaWZmdXNlTGlnaHRNYXBNZXRob2Q7Il19