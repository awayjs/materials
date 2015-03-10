var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SpecularCompositeMethod = require("awayjs-methodmaterials/lib/methods/SpecularCompositeMethod");
/**
 * SpecularCelMethod provides a shading method to add specular cel (cartoon) shading.
 */
var SpecularCelMethod = (function (_super) {
    __extends(SpecularCelMethod, _super);
    /**
     * Creates a new SpecularCelMethod object.
     * @param specularCutOff The threshold at which the specular highlight should be shown.
     * @param baseMethod An optional specular method on which the cartoon shading is based. If ommitted, SpecularBasicMethod is used.
     */
    function SpecularCelMethod(specularCutOff, baseMethod) {
        var _this = this;
        if (specularCutOff === void 0) { specularCutOff = .5; }
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this, null, baseMethod);
        this._smoothness = .1;
        this._specularCutOff = .1;
        this.baseMethod._iModulateMethod = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) { return _this.clampSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters); };
        this._specularCutOff = specularCutOff;
    }
    Object.defineProperty(SpecularCelMethod.prototype, "smoothness", {
        /**
         * The smoothness of the highlight edge.
         */
        get: function () {
            return this._smoothness;
        },
        set: function (value) {
            this._smoothness = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularCelMethod.prototype, "specularCutOff", {
        /**
         * The threshold at which the specular highlight should be shown.
         */
        get: function () {
            return this._specularCutOff;
        },
        set: function (value) {
            this._specularCutOff = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SpecularCelMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var index = methodVO.secondaryFragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = this._smoothness;
        data[index + 1] = this._specularCutOff;
    };
    /**
     * @inheritDoc
     */
    SpecularCelMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._dataReg = null;
    };
    /**
     * Snaps the specular shading strength of the wrapped method to zero or one, depending on whether or not it exceeds the specularCutOff
     * @param vo The MethodVO used to compile the current shader.
     * @param t The register containing the specular strength in the "w" component, and either the half-vector or the reflection vector in "xyz".
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared register data for this shader.
     * @return The AGAL fragment code for the method.
     */
    SpecularCelMethod.prototype.clampSpecular = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        return "sub " + targetReg + ".y, " + targetReg + ".w, " + this._dataReg + ".y\n" + "div " + targetReg + ".y, " + targetReg + ".y, " + this._dataReg + ".x\n" + "sat " + targetReg + ".y, " + targetReg + ".y\n" + "sge " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".y\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
    };
    /**
     * @inheritDoc
     */
    SpecularCelMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
    };
    return SpecularCelMethod;
})(SpecularCompositeMethod);
module.exports = SpecularCelMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU3BlY3VsYXJDZWxNZXRob2QudHMiXSwibmFtZXMiOlsiU3BlY3VsYXJDZWxNZXRob2QiLCJTcGVjdWxhckNlbE1ldGhvZC5jb25zdHJ1Y3RvciIsIlNwZWN1bGFyQ2VsTWV0aG9kLnNtb290aG5lc3MiLCJTcGVjdWxhckNlbE1ldGhvZC5zcGVjdWxhckN1dE9mZiIsIlNwZWN1bGFyQ2VsTWV0aG9kLmlBY3RpdmF0ZSIsIlNwZWN1bGFyQ2VsTWV0aG9kLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSIsIlNwZWN1bGFyQ2VsTWV0aG9kLmNsYW1wU3BlY3VsYXIiLCJTcGVjdWxhckNlbE1ldGhvZC5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVVBLElBQU8sdUJBQXVCLFdBQWEsNERBQTRELENBQUMsQ0FBQztBQUV6RyxBQUdBOztHQURHO0lBQ0csaUJBQWlCO0lBQVNBLFVBQTFCQSxpQkFBaUJBLFVBQWdDQTtJQU10REE7Ozs7T0FJR0E7SUFDSEEsU0FYS0EsaUJBQWlCQSxDQVdWQSxjQUEwQkEsRUFBRUEsVUFBcUNBO1FBWDlFQyxpQkErRkNBO1FBcEZZQSw4QkFBMEJBLEdBQTFCQSxtQkFBMEJBO1FBQUVBLDBCQUFxQ0EsR0FBckNBLGlCQUFxQ0E7UUFFNUVBLGtCQUFNQSxJQUFJQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtRQVZqQkEsZ0JBQVdBLEdBQVVBLEVBQUVBLENBQUNBO1FBQ3hCQSxvQkFBZUEsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFXbkNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLGdCQUFnQkEsR0FBR0EsVUFBQ0EsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxTQUErQkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQSxJQUFLQSxPQUFBQSxLQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxZQUFZQSxFQUFFQSxRQUFRQSxFQUFFQSxTQUFTQSxF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TUEsQ0FBQ0EsZ0JBQUtBLENBQUNBLDJCQUEyQkEsWUFBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsYUFBYUEsRUFBRUEsZUFBZUEsQ0FBQ0EsQ0FBQ0E7SUFDbEdBLENBQUNBO0lBQ0ZQLHdCQUFDQTtBQUFEQSxDQS9GQSxBQStGQ0EsRUEvRitCLHVCQUF1QixFQStGdEQ7QUFFRCxBQUEyQixpQkFBbEIsaUJBQWlCLENBQUMiLCJmaWxlIjoibWV0aG9kcy9TcGVjdWxhckNlbE1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xyXG5cclxuaW1wb3J0IFNoYWRlckxpZ2h0aW5nT2JqZWN0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyTGlnaHRpbmdPYmplY3RcIik7XHJcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xyXG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xyXG5cclxuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9kYXRhL01ldGhvZFZPXCIpO1xyXG5pbXBvcnQgU3BlY3VsYXJCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9TcGVjdWxhckJhc2ljTWV0aG9kXCIpO1xyXG5pbXBvcnQgU3BlY3VsYXJDb21wb3NpdGVNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL1NwZWN1bGFyQ29tcG9zaXRlTWV0aG9kXCIpO1xyXG5cclxuLyoqXHJcbiAqIFNwZWN1bGFyQ2VsTWV0aG9kIHByb3ZpZGVzIGEgc2hhZGluZyBtZXRob2QgdG8gYWRkIHNwZWN1bGFyIGNlbCAoY2FydG9vbikgc2hhZGluZy5cclxuICovXHJcbmNsYXNzIFNwZWN1bGFyQ2VsTWV0aG9kIGV4dGVuZHMgU3BlY3VsYXJDb21wb3NpdGVNZXRob2Rcclxue1xyXG5cdHByaXZhdGUgX2RhdGFSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50O1xyXG5cdHByaXZhdGUgX3Ntb290aG5lc3M6bnVtYmVyID0gLjE7XHJcblx0cHJpdmF0ZSBfc3BlY3VsYXJDdXRPZmY6bnVtYmVyID0gLjE7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgYSBuZXcgU3BlY3VsYXJDZWxNZXRob2Qgb2JqZWN0LlxyXG5cdCAqIEBwYXJhbSBzcGVjdWxhckN1dE9mZiBUaGUgdGhyZXNob2xkIGF0IHdoaWNoIHRoZSBzcGVjdWxhciBoaWdobGlnaHQgc2hvdWxkIGJlIHNob3duLlxyXG5cdCAqIEBwYXJhbSBiYXNlTWV0aG9kIEFuIG9wdGlvbmFsIHNwZWN1bGFyIG1ldGhvZCBvbiB3aGljaCB0aGUgY2FydG9vbiBzaGFkaW5nIGlzIGJhc2VkLiBJZiBvbW1pdHRlZCwgU3BlY3VsYXJCYXNpY01ldGhvZCBpcyB1c2VkLlxyXG5cdCAqL1xyXG5cdGNvbnN0cnVjdG9yKHNwZWN1bGFyQ3V0T2ZmOm51bWJlciA9IC41LCBiYXNlTWV0aG9kOlNwZWN1bGFyQmFzaWNNZXRob2QgPSBudWxsKVxyXG5cdHtcclxuXHRcdHN1cGVyKG51bGwsIGJhc2VNZXRob2QpO1xyXG5cclxuXHRcdHRoaXMuYmFzZU1ldGhvZC5faU1vZHVsYXRlTWV0aG9kID0gKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKSA9PiB0aGlzLmNsYW1wU3BlY3VsYXIoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgdGFyZ2V0UmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xyXG5cclxuXHRcdHRoaXMuX3NwZWN1bGFyQ3V0T2ZmID0gc3BlY3VsYXJDdXRPZmY7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgc21vb3RobmVzcyBvZiB0aGUgaGlnaGxpZ2h0IGVkZ2UuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBzbW9vdGhuZXNzKCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3Ntb290aG5lc3M7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHNtb290aG5lc3ModmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX3Ntb290aG5lc3MgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSB0aHJlc2hvbGQgYXQgd2hpY2ggdGhlIHNwZWN1bGFyIGhpZ2hsaWdodCBzaG91bGQgYmUgc2hvd24uXHJcblx0ICovXHJcblx0cHVibGljIGdldCBzcGVjdWxhckN1dE9mZigpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9zcGVjdWxhckN1dE9mZjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgc3BlY3VsYXJDdXRPZmYodmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX3NwZWN1bGFyQ3V0T2ZmID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpQWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXHJcblx0e1xyXG5cdFx0c3VwZXIuaUFjdGl2YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHN0YWdlKTtcclxuXHJcblx0XHR2YXIgaW5kZXg6bnVtYmVyIC8qaW50Ki8gPSBtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4O1xyXG5cdFx0dmFyIGRhdGE6QXJyYXk8bnVtYmVyPiA9IHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YTtcclxuXHRcdGRhdGFbaW5kZXhdID0gdGhpcy5fc21vb3RobmVzcztcclxuXHRcdGRhdGFbaW5kZXggKyAxXSA9IHRoaXMuX3NwZWN1bGFyQ3V0T2ZmO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgaUNsZWFuQ29tcGlsYXRpb25EYXRhKClcclxuXHR7XHJcblx0XHRzdXBlci5pQ2xlYW5Db21waWxhdGlvbkRhdGEoKTtcclxuXHRcdHRoaXMuX2RhdGFSZWcgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogU25hcHMgdGhlIHNwZWN1bGFyIHNoYWRpbmcgc3RyZW5ndGggb2YgdGhlIHdyYXBwZWQgbWV0aG9kIHRvIHplcm8gb3Igb25lLCBkZXBlbmRpbmcgb24gd2hldGhlciBvciBub3QgaXQgZXhjZWVkcyB0aGUgc3BlY3VsYXJDdXRPZmZcclxuXHQgKiBAcGFyYW0gdm8gVGhlIE1ldGhvZFZPIHVzZWQgdG8gY29tcGlsZSB0aGUgY3VycmVudCBzaGFkZXIuXHJcblx0ICogQHBhcmFtIHQgVGhlIHJlZ2lzdGVyIGNvbnRhaW5pbmcgdGhlIHNwZWN1bGFyIHN0cmVuZ3RoIGluIHRoZSBcIndcIiBjb21wb25lbnQsIGFuZCBlaXRoZXIgdGhlIGhhbGYtdmVjdG9yIG9yIHRoZSByZWZsZWN0aW9uIHZlY3RvciBpbiBcInh5elwiLlxyXG5cdCAqIEBwYXJhbSByZWdDYWNoZSBUaGUgcmVnaXN0ZXIgY2FjaGUgdXNlZCBmb3IgdGhlIHNoYWRlciBjb21waWxhdGlvbi5cclxuXHQgKiBAcGFyYW0gc2hhcmVkUmVnaXN0ZXJzIFRoZSBzaGFyZWQgcmVnaXN0ZXIgZGF0YSBmb3IgdGhpcyBzaGFkZXIuXHJcblx0ICogQHJldHVybiBUaGUgQUdBTCBmcmFnbWVudCBjb2RlIGZvciB0aGUgbWV0aG9kLlxyXG5cdCAqL1xyXG5cdHByaXZhdGUgY2xhbXBTcGVjdWxhcihzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi55XFxuXCIgKyAvLyB4IC0gY3V0b2ZmXHJcblx0XHRcdFwiZGl2IFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi54XFxuXCIgKyAvLyAoeCAtIGN1dG9mZikvZXBzaWxvblxyXG5cdFx0XHRcInNhdCBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIueVxcblwiICtcclxuXHRcdFx0XCJzZ2UgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnlcXG5cIiArXHJcblx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLnlcXG5cIjtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHRoaXMuX2RhdGFSZWcgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XHJcblx0XHRtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4ID0gdGhpcy5fZGF0YVJlZy5pbmRleCo0O1xyXG5cclxuXHRcdHJldHVybiBzdXBlci5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFNwZWN1bGFyQ2VsTWV0aG9kOyJdfQ==