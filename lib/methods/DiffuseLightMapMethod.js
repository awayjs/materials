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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLnRzIl0sIm5hbWVzIjpbIkRpZmZ1c2VMaWdodE1hcE1ldGhvZCIsIkRpZmZ1c2VMaWdodE1hcE1ldGhvZC5jb25zdHJ1Y3RvciIsIkRpZmZ1c2VMaWdodE1hcE1ldGhvZC5pSW5pdFZPIiwiRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLmJsZW5kTW9kZSIsIkRpZmZ1c2VMaWdodE1hcE1ldGhvZC5saWdodE1hcFRleHR1cmUiLCJEaWZmdXNlTGlnaHRNYXBNZXRob2QuaUFjdGl2YXRlIiwiRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLmlHZXRGcmFnbWVudFBvc3RMaWdodGluZ0NvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVFBLElBQU8sb0JBQW9CLFdBQWMsa0RBQWtELENBQUMsQ0FBQztBQUk3RixJQUFPLHNCQUFzQixXQUFhLDJEQUEyRCxDQUFDLENBQUM7QUFFdkcsQUFLQTs7OztHQURHO0lBQ0cscUJBQXFCO0lBQVNBLFVBQTlCQSxxQkFBcUJBLFVBQStCQTtJQWtCekRBOzs7Ozs7O09BT0dBO0lBQ0hBLFNBMUJLQSxxQkFBcUJBLENBMEJkQSxRQUFzQkEsRUFBRUEsU0FBNkJBLEVBQUVBLGNBQThCQSxFQUFFQSxVQUFvQ0E7UUFBbkdDLHlCQUE2QkEsR0FBN0JBLHNCQUE2QkE7UUFBRUEsOEJBQThCQSxHQUE5QkEsc0JBQThCQTtRQUFFQSwwQkFBb0NBLEdBQXBDQSxpQkFBb0NBO1FBRXRJQSxrQkFBTUEsSUFBSUEsRUFBRUEsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFFeEJBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLGNBQWNBLENBQUNBO1FBQ3RDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLFFBQVFBLENBQUNBO1FBQ2pDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxTQUFTQSxDQUFDQTtJQUM1QkEsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0lBLHVDQUFP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LElBQUlBLENBQUNBLG9CQUFvQkEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBQ25HQSxLQUFLQSxDQUFDQTtZQUNQQSxLQUFLQSxxQkFBcUJBLENBQUNBLEdBQUdBO2dCQUM3QkEsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxvQkFBb0JBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO2dCQUNuR0EsS0FBS0EsQ0FBQ0E7UUFDUkEsQ0FBQ0E7UUFFREEsSUFBSUEsSUFBSUEsZ0JBQUtBLENBQUNBLDRCQUE0QkEsWUFBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsU0FBU0EsRUFBRUEsYUFBYUEsRUFBRUEsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFFOUdBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBakhETjs7O09BR0dBO0lBQ1dBLDhCQUFRQSxHQUFVQSxVQUFVQSxDQUFDQTtJQUUzQ0E7OztPQUdHQTtJQUNXQSx5QkFBR0EsR0FBVUEsS0FBS0EsQ0FBQ0E7SUF3R2xDQSw0QkFBQ0E7QUFBREEsQ0FwSEEsQUFvSENBLEVBcEhtQyxzQkFBc0IsRUFvSHpEO0FBRUQsQUFBK0IsaUJBQXRCLHFCQUFxQixDQUFDIiwiZmlsZSI6Im1ldGhvZHMvRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xyXG5cclxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcclxuXHJcbmltcG9ydCBTaGFkZXJMaWdodGluZ09iamVjdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlckxpZ2h0aW5nT2JqZWN0XCIpO1xyXG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xyXG5pbXBvcnQgU2hhZGVyQ29tcGlsZXJIZWxwZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcclxuXHJcbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvZGF0YS9NZXRob2RWT1wiKTtcclxuaW1wb3J0IERpZmZ1c2VCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9EaWZmdXNlQmFzaWNNZXRob2RcIik7XHJcbmltcG9ydCBEaWZmdXNlQ29tcG9zaXRlTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9EaWZmdXNlQ29tcG9zaXRlTWV0aG9kXCIpO1xyXG5cclxuLyoqXHJcbiAqIERpZmZ1c2VMaWdodE1hcE1ldGhvZCBwcm92aWRlcyBhIGRpZmZ1c2Ugc2hhZGluZyBtZXRob2QgdGhhdCB1c2VzIGEgbGlnaHQgbWFwIHRvIG1vZHVsYXRlIHRoZSBjYWxjdWxhdGVkIGRpZmZ1c2VcclxuICogbGlnaHRpbmcuIEl0IGlzIGRpZmZlcmVudCBmcm9tIEVmZmVjdExpZ2h0TWFwTWV0aG9kIGluIHRoYXQgdGhlIGxhdHRlciBtb2R1bGF0ZXMgdGhlIGVudGlyZSBjYWxjdWxhdGVkIHBpeGVsIGNvbG9yLCByYXRoZXJcclxuICogdGhhbiBvbmx5IHRoZSBkaWZmdXNlIGxpZ2h0aW5nIHZhbHVlLlxyXG4gKi9cclxuY2xhc3MgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kIGV4dGVuZHMgRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZFxyXG57XHJcblx0LyoqXHJcblx0ICogSW5kaWNhdGVzIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIG11bHRpcGxpZWQgd2l0aCB0aGUgY2FsY3VsYXRlZCBzaGFkaW5nIHJlc3VsdC5cclxuXHQgKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGFkZCBwcmUtY2FsY3VsYXRlZCBzaGFkb3dzIG9yIG9jY2x1c2lvbi5cclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIE1VTFRJUExZOnN0cmluZyA9IFwibXVsdGlwbHlcIjtcclxuXHJcblx0LyoqXHJcblx0ICogSW5kaWNhdGVzIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIGFkZGVkIGludG8gdGhlIGNhbGN1bGF0ZWQgc2hhZGluZyByZXN1bHQuXHJcblx0ICogVGhpcyBjYW4gYmUgdXNlZCB0byBhZGQgcHJlLWNhbGN1bGF0ZWQgbGlnaHRpbmcgb3IgZ2xvYmFsIGlsbHVtaW5hdGlvbi5cclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIEFERDpzdHJpbmcgPSBcImFkZFwiO1xyXG5cclxuXHRwcml2YXRlIF9saWdodE1hcFRleHR1cmU6VGV4dHVyZTJEQmFzZTtcclxuXHRwcml2YXRlIF9ibGVuZE1vZGU6c3RyaW5nO1xyXG5cdHByaXZhdGUgX3VzZVNlY29uZGFyeVVWOmJvb2xlYW47XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgYSBuZXcgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kIG1ldGhvZC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBsaWdodE1hcCBUaGUgdGV4dHVyZSBjb250YWluaW5nIHRoZSBsaWdodCBtYXAuXHJcblx0ICogQHBhcmFtIGJsZW5kTW9kZSBUaGUgYmxlbmQgbW9kZSB3aXRoIHdoaWNoIHRoZSBsaWdodCBtYXAgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIGxpZ2h0aW5nIHJlc3VsdC5cclxuXHQgKiBAcGFyYW0gdXNlU2Vjb25kYXJ5VVYgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNlY29uZGFyeSBVViBzZXQgc2hvdWxkIGJlIHVzZWQgdG8gbWFwIHRoZSBsaWdodCBtYXAuXHJcblx0ICogQHBhcmFtIGJhc2VNZXRob2QgVGhlIGRpZmZ1c2UgbWV0aG9kIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSByZWd1bGFyIGRpZmZ1c2UtYmFzZWQgbGlnaHRpbmcuXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IobGlnaHRNYXA6VGV4dHVyZTJEQmFzZSwgYmxlbmRNb2RlOnN0cmluZyA9IFwibXVsdGlwbHlcIiwgdXNlU2Vjb25kYXJ5VVY6Ym9vbGVhbiA9IGZhbHNlLCBiYXNlTWV0aG9kOkRpZmZ1c2VCYXNpY01ldGhvZCA9IG51bGwpXHJcblx0e1xyXG5cdFx0c3VwZXIobnVsbCwgYmFzZU1ldGhvZCk7XHJcblxyXG5cdFx0dGhpcy5fdXNlU2Vjb25kYXJ5VVYgPSB1c2VTZWNvbmRhcnlVVjtcclxuXHRcdHRoaXMuX2xpZ2h0TWFwVGV4dHVyZSA9IGxpZ2h0TWFwO1xyXG5cdFx0dGhpcy5ibGVuZE1vZGUgPSBibGVuZE1vZGU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpSW5pdFZPKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8pXHJcblx0e1xyXG5cdFx0bWV0aG9kVk8ubmVlZHNTZWNvbmRhcnlVViA9IHRoaXMuX3VzZVNlY29uZGFyeVVWO1xyXG5cdFx0bWV0aG9kVk8ubmVlZHNVViA9ICF0aGlzLl91c2VTZWNvbmRhcnlVVjtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBibGVuZCBtb2RlIHdpdGggd2hpY2ggdGhlIGxpZ2h0IG1hcCBzaG91bGQgYmUgYXBwbGllZCB0byB0aGUgbGlnaHRpbmcgcmVzdWx0LlxyXG5cdCAqXHJcblx0ICogQHNlZSBEaWZmdXNlTGlnaHRNYXBNZXRob2QuQUREXHJcblx0ICogQHNlZSBEaWZmdXNlTGlnaHRNYXBNZXRob2QuTVVMVElQTFlcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGJsZW5kTW9kZSgpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9ibGVuZE1vZGU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGJsZW5kTW9kZSh2YWx1ZTpzdHJpbmcpXHJcblx0e1xyXG5cdFx0aWYgKHZhbHVlICE9IERpZmZ1c2VMaWdodE1hcE1ldGhvZC5BREQgJiYgdmFsdWUgIT0gRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLk1VTFRJUExZKVxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGJsZW5kbW9kZSFcIik7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2JsZW5kTW9kZSA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2JsZW5kTW9kZSA9IHZhbHVlO1xyXG5cclxuXHRcdHRoaXMuaUludmFsaWRhdGVTaGFkZXJQcm9ncmFtKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgdGV4dHVyZSBjb250YWluaW5nIHRoZSBsaWdodCBtYXAgZGF0YS5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGxpZ2h0TWFwVGV4dHVyZSgpOlRleHR1cmUyREJhc2VcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fbGlnaHRNYXBUZXh0dXJlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBsaWdodE1hcFRleHR1cmUodmFsdWU6VGV4dHVyZTJEQmFzZSlcclxuXHR7XHJcblx0XHR0aGlzLl9saWdodE1hcFRleHR1cmUgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcclxuXHR7XHJcblx0XHRzdGFnZS5hY3RpdmF0ZVRleHR1cmUobWV0aG9kVk8uc2Vjb25kYXJ5VGV4dHVyZXNJbmRleCwgdGhpcy5fbGlnaHRNYXBUZXh0dXJlLCBzaGFkZXJPYmplY3QucmVwZWF0VGV4dHVyZXMsIHNoYWRlck9iamVjdC51c2VTbW9vdGhUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcpO1xyXG5cclxuXHRcdHN1cGVyLmlBY3RpdmF0ZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCBzdGFnZSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRQb3N0TGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0dmFyIGNvZGU6c3RyaW5nO1xyXG5cdFx0dmFyIGxpZ2h0TWFwUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVRleHR1cmVSZWcoKTtcclxuXHRcdHZhciB0ZW1wOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCgpO1xyXG5cdFx0bWV0aG9kVk8uc2Vjb25kYXJ5VGV4dHVyZXNJbmRleCA9IGxpZ2h0TWFwUmVnLmluZGV4O1xyXG5cclxuXHRcdGNvZGUgPSBTaGFkZXJDb21waWxlckhlbHBlci5nZXRUZXgyRFNhbXBsZUNvZGUodGVtcCwgc2hhcmVkUmVnaXN0ZXJzLCBsaWdodE1hcFJlZywgdGhpcy5fbGlnaHRNYXBUZXh0dXJlLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXMsIHNoYWRlck9iamVjdC5yZXBlYXRUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcsIHNoYXJlZFJlZ2lzdGVycy5zZWNvbmRhcnlVVlZhcnlpbmcpO1xyXG5cclxuXHRcdHN3aXRjaCAodGhpcy5fYmxlbmRNb2RlKSB7XHJcblx0XHRcdGNhc2UgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kLk1VTFRJUExZOlxyXG5cdFx0XHRcdGNvZGUgKz0gXCJtdWwgXCIgKyB0aGlzLl9wVG90YWxMaWdodENvbG9yUmVnICsgXCIsIFwiICsgdGhpcy5fcFRvdGFsTGlnaHRDb2xvclJlZyArIFwiLCBcIiArIHRlbXAgKyBcIlxcblwiO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIERpZmZ1c2VMaWdodE1hcE1ldGhvZC5BREQ6XHJcblx0XHRcdFx0Y29kZSArPSBcImFkZCBcIiArIHRoaXMuX3BUb3RhbExpZ2h0Q29sb3JSZWcgKyBcIiwgXCIgKyB0aGlzLl9wVG90YWxMaWdodENvbG9yUmVnICsgXCIsIFwiICsgdGVtcCArIFwiXFxuXCI7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29kZSArPSBzdXBlci5pR2V0RnJhZ21lbnRQb3N0TGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHRhcmdldFJlZywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcclxuXHJcblx0XHRyZXR1cm4gY29kZTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCA9IERpZmZ1c2VMaWdodE1hcE1ldGhvZDsiXX0=