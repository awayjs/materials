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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU3BlY3VsYXJDZWxNZXRob2QudHMiXSwibmFtZXMiOlsiU3BlY3VsYXJDZWxNZXRob2QiLCJTcGVjdWxhckNlbE1ldGhvZC5jb25zdHJ1Y3RvciIsIlNwZWN1bGFyQ2VsTWV0aG9kLnNtb290aG5lc3MiLCJTcGVjdWxhckNlbE1ldGhvZC5zcGVjdWxhckN1dE9mZiIsIlNwZWN1bGFyQ2VsTWV0aG9kLmlBY3RpdmF0ZSIsIlNwZWN1bGFyQ2VsTWV0aG9kLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSIsIlNwZWN1bGFyQ2VsTWV0aG9kLmNsYW1wU3BlY3VsYXIiLCJTcGVjdWxhckNlbE1ldGhvZC5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVVBLElBQU8sdUJBQXVCLFdBQWEsNERBQTRELENBQUMsQ0FBQztBQUV6RyxBQUdBOztHQURHO0lBQ0csaUJBQWlCO0lBQVNBLFVBQTFCQSxpQkFBaUJBLFVBQWdDQTtJQU10REE7Ozs7T0FJR0E7SUFDSEEsU0FYS0EsaUJBQWlCQSxDQVdWQSxjQUEwQkEsRUFBRUEsVUFBcUNBO1FBWDlFQyxpQkErRkNBO1FBcEZZQSw4QkFBMEJBLEdBQTFCQSxtQkFBMEJBO1FBQUVBLDBCQUFxQ0EsR0FBckNBLGlCQUFxQ0E7UUFFNUVBLGtCQUFNQSxJQUFJQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtRQVZqQkEsZ0JBQVdBLEdBQVVBLEVBQUVBLENBQUNBO1FBQ3hCQSxvQkFBZUEsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFXbkNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLGdCQUFnQkEsR0FBR0EsVUFBQ0EsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxTQUErQkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQSxJQUFLQSxPQUFBQSxLQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxZQUFZQSxFQUFFQSxRQUFRQSxFQUFFQSxTQUFTQSxF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TUEsQ0FBQ0EsZ0JBQUtBLENBQUNBLDJCQUEyQkEsWUFBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsYUFBYUEsRUFBRUEsZUFBZUEsQ0FBQ0EsQ0FBQ0E7SUFDbEdBLENBQUNBO0lBQ0ZQLHdCQUFDQTtBQUFEQSxDQS9GQSxBQStGQ0EsRUEvRitCLHVCQUF1QixFQStGdEQ7QUFFRCxBQUEyQixpQkFBbEIsaUJBQWlCLENBQUMiLCJmaWxlIjoibWV0aG9kcy9TcGVjdWxhckNlbE1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgU2hhZGVyTGlnaHRpbmdPYmplY3RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJMaWdodGluZ09iamVjdFwiKTtcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuXG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL2RhdGEvTWV0aG9kVk9cIik7XG5pbXBvcnQgU3BlY3VsYXJCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9TcGVjdWxhckJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IFNwZWN1bGFyQ29tcG9zaXRlTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9TcGVjdWxhckNvbXBvc2l0ZU1ldGhvZFwiKTtcblxuLyoqXG4gKiBTcGVjdWxhckNlbE1ldGhvZCBwcm92aWRlcyBhIHNoYWRpbmcgbWV0aG9kIHRvIGFkZCBzcGVjdWxhciBjZWwgKGNhcnRvb24pIHNoYWRpbmcuXG4gKi9cbmNsYXNzIFNwZWN1bGFyQ2VsTWV0aG9kIGV4dGVuZHMgU3BlY3VsYXJDb21wb3NpdGVNZXRob2Rcbntcblx0cHJpdmF0ZSBfZGF0YVJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQ7XG5cdHByaXZhdGUgX3Ntb290aG5lc3M6bnVtYmVyID0gLjE7XG5cdHByaXZhdGUgX3NwZWN1bGFyQ3V0T2ZmOm51bWJlciA9IC4xO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFNwZWN1bGFyQ2VsTWV0aG9kIG9iamVjdC5cblx0ICogQHBhcmFtIHNwZWN1bGFyQ3V0T2ZmIFRoZSB0aHJlc2hvbGQgYXQgd2hpY2ggdGhlIHNwZWN1bGFyIGhpZ2hsaWdodCBzaG91bGQgYmUgc2hvd24uXG5cdCAqIEBwYXJhbSBiYXNlTWV0aG9kIEFuIG9wdGlvbmFsIHNwZWN1bGFyIG1ldGhvZCBvbiB3aGljaCB0aGUgY2FydG9vbiBzaGFkaW5nIGlzIGJhc2VkLiBJZiBvbW1pdHRlZCwgU3BlY3VsYXJCYXNpY01ldGhvZCBpcyB1c2VkLlxuXHQgKi9cblx0Y29uc3RydWN0b3Ioc3BlY3VsYXJDdXRPZmY6bnVtYmVyID0gLjUsIGJhc2VNZXRob2Q6U3BlY3VsYXJCYXNpY01ldGhvZCA9IG51bGwpXG5cdHtcblx0XHRzdXBlcihudWxsLCBiYXNlTWV0aG9kKTtcblxuXHRcdHRoaXMuYmFzZU1ldGhvZC5faU1vZHVsYXRlTWV0aG9kID0gKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKSA9PiB0aGlzLmNsYW1wU3BlY3VsYXIoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgdGFyZ2V0UmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0dGhpcy5fc3BlY3VsYXJDdXRPZmYgPSBzcGVjdWxhckN1dE9mZjtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgc21vb3RobmVzcyBvZiB0aGUgaGlnaGxpZ2h0IGVkZ2UuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNtb290aG5lc3MoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zbW9vdGhuZXNzO1xuXHR9XG5cblx0cHVibGljIHNldCBzbW9vdGhuZXNzKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3Ntb290aG5lc3MgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdGhyZXNob2xkIGF0IHdoaWNoIHRoZSBzcGVjdWxhciBoaWdobGlnaHQgc2hvdWxkIGJlIHNob3duLlxuXHQgKi9cblx0cHVibGljIGdldCBzcGVjdWxhckN1dE9mZigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3NwZWN1bGFyQ3V0T2ZmO1xuXHR9XG5cblx0cHVibGljIHNldCBzcGVjdWxhckN1dE9mZih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9zcGVjdWxhckN1dE9mZiA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0c3VwZXIuaUFjdGl2YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHN0YWdlKTtcblxuXHRcdHZhciBpbmRleDpudW1iZXIgLyppbnQqLyA9IG1ldGhvZFZPLnNlY29uZGFyeUZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XG5cdFx0dmFyIGRhdGE6QXJyYXk8bnVtYmVyPiA9IHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YTtcblx0XHRkYXRhW2luZGV4XSA9IHRoaXMuX3Ntb290aG5lc3M7XG5cdFx0ZGF0YVtpbmRleCArIDFdID0gdGhpcy5fc3BlY3VsYXJDdXRPZmY7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpQ2xlYW5Db21waWxhdGlvbkRhdGEoKVxuXHR7XG5cdFx0c3VwZXIuaUNsZWFuQ29tcGlsYXRpb25EYXRhKCk7XG5cdFx0dGhpcy5fZGF0YVJlZyA9IG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogU25hcHMgdGhlIHNwZWN1bGFyIHNoYWRpbmcgc3RyZW5ndGggb2YgdGhlIHdyYXBwZWQgbWV0aG9kIHRvIHplcm8gb3Igb25lLCBkZXBlbmRpbmcgb24gd2hldGhlciBvciBub3QgaXQgZXhjZWVkcyB0aGUgc3BlY3VsYXJDdXRPZmZcblx0ICogQHBhcmFtIHZvIFRoZSBNZXRob2RWTyB1c2VkIHRvIGNvbXBpbGUgdGhlIGN1cnJlbnQgc2hhZGVyLlxuXHQgKiBAcGFyYW0gdCBUaGUgcmVnaXN0ZXIgY29udGFpbmluZyB0aGUgc3BlY3VsYXIgc3RyZW5ndGggaW4gdGhlIFwid1wiIGNvbXBvbmVudCwgYW5kIGVpdGhlciB0aGUgaGFsZi12ZWN0b3Igb3IgdGhlIHJlZmxlY3Rpb24gdmVjdG9yIGluIFwieHl6XCIuXG5cdCAqIEBwYXJhbSByZWdDYWNoZSBUaGUgcmVnaXN0ZXIgY2FjaGUgdXNlZCBmb3IgdGhlIHNoYWRlciBjb21waWxhdGlvbi5cblx0ICogQHBhcmFtIHNoYXJlZFJlZ2lzdGVycyBUaGUgc2hhcmVkIHJlZ2lzdGVyIGRhdGEgZm9yIHRoaXMgc2hhZGVyLlxuXHQgKiBAcmV0dXJuIFRoZSBBR0FMIGZyYWdtZW50IGNvZGUgZm9yIHRoZSBtZXRob2QuXG5cdCAqL1xuXHRwcml2YXRlIGNsYW1wU3BlY3VsYXIoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi55XFxuXCIgKyAvLyB4IC0gY3V0b2ZmXG5cdFx0XHRcImRpdiBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueFxcblwiICsgLy8gKHggLSBjdXRvZmYpL2Vwc2lsb25cblx0XHRcdFwic2F0IFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi55XFxuXCIgK1xuXHRcdFx0XCJzZ2UgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnlcXG5cIiArXG5cdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi55XFxuXCI7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHRoaXMuX2RhdGFSZWcgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XG5cdFx0bWV0aG9kVk8uc2Vjb25kYXJ5RnJhZ21lbnRDb25zdGFudHNJbmRleCA9IHRoaXMuX2RhdGFSZWcuaW5kZXgqNDtcblxuXHRcdHJldHVybiBzdXBlci5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblx0fVxufVxuXG5leHBvcnQgPSBTcGVjdWxhckNlbE1ldGhvZDsiXX0=