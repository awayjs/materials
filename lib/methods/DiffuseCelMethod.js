var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DiffuseCompositeMethod = require("awayjs-methodmaterials/lib/methods/DiffuseCompositeMethod");
/**
 * DiffuseCelMethod provides a shading method to add diffuse cel (cartoon) shading.
 */
var DiffuseCelMethod = (function (_super) {
    __extends(DiffuseCelMethod, _super);
    /**
     * Creates a new DiffuseCelMethod object.
     * @param levels The amount of shadow gradations.
     * @param baseMethod An optional diffuse method on which the cartoon shading is based. If omitted, DiffuseBasicMethod is used.
     */
    function DiffuseCelMethod(levels, baseMethod) {
        var _this = this;
        if (levels === void 0) { levels = 3; }
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this, null, baseMethod);
        this._smoothness = .1;
        this.baseMethod._iModulateMethod = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) { return _this.clampDiffuse(shaderObject, methodVO, targetReg, registerCache, sharedRegisters); };
        this._levels = levels;
    }
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        _super.prototype.iInitConstants.call(this, shaderObject, methodVO);
        data[index + 1] = 1;
        data[index + 2] = 0;
    };
    Object.defineProperty(DiffuseCelMethod.prototype, "levels", {
        /**
         * The amount of shadow gradations.
         */
        get: function () {
            return this._levels;
        },
        set: function (value /*uint*/) {
            this._levels = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiffuseCelMethod.prototype, "smoothness", {
        /**
         * The smoothness of the edge between 2 shading levels.
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
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._dataReg = null;
    };
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    DiffuseCelMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        data[index] = this._levels;
        data[index + 3] = this._smoothness;
    };
    /**
     * Snaps the diffuse shading of the wrapped method to one of the levels.
     * @param vo The MethodVO used to compile the current shader.
     * @param t The register containing the diffuse strength in the "w" component.
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared register data for this shader.
     * @return The AGAL fragment code for the method.
     */
    DiffuseCelMethod.prototype.clampDiffuse = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        return "mul " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".x\n" + "frc " + targetReg + ".z, " + targetReg + ".w\n" + "sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".z\n" + "mov " + targetReg + ".x, " + this._dataReg + ".x\n" + "sub " + targetReg + ".x, " + targetReg + ".x, " + this._dataReg + ".y\n" + "rcp " + targetReg + ".x," + targetReg + ".x\n" + "mul " + targetReg + ".w, " + targetReg + ".y, " + targetReg + ".x\n" + "sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".x\n" + "div " + targetReg + ".z, " + targetReg + ".z, " + this._dataReg + ".w\n" + "sat " + targetReg + ".z, " + targetReg + ".z\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".z\n" + "sub " + targetReg + ".z, " + this._dataReg + ".y, " + targetReg + ".z\n" + "mul " + targetReg + ".y, " + targetReg + ".y, " + targetReg + ".z\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n" + "sat " + targetReg + ".w, " + targetReg + ".w\n";
    };
    return DiffuseCelMethod;
})(DiffuseCompositeMethod);
module.exports = DiffuseCelMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRGlmZnVzZUNlbE1ldGhvZC50cyJdLCJuYW1lcyI6WyJEaWZmdXNlQ2VsTWV0aG9kIiwiRGlmZnVzZUNlbE1ldGhvZC5jb25zdHJ1Y3RvciIsIkRpZmZ1c2VDZWxNZXRob2QuaUluaXRDb25zdGFudHMiLCJEaWZmdXNlQ2VsTWV0aG9kLmxldmVscyIsIkRpZmZ1c2VDZWxNZXRob2Quc21vb3RobmVzcyIsIkRpZmZ1c2VDZWxNZXRob2QuaUNsZWFuQ29tcGlsYXRpb25EYXRhIiwiRGlmZnVzZUNlbE1ldGhvZC5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUiLCJEaWZmdXNlQ2VsTWV0aG9kLmlBY3RpdmF0ZSIsIkRpZmZ1c2VDZWxNZXRob2QuY2xhbXBEaWZmdXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFXQSxJQUFPLHNCQUFzQixXQUFhLDJEQUEyRCxDQUFDLENBQUM7QUFFdkcsQUFHQTs7R0FERztJQUNHLGdCQUFnQjtJQUFTQSxVQUF6QkEsZ0JBQWdCQSxVQUErQkE7SUFNcERBOzs7O09BSUdBO0lBQ0hBLFNBWEtBLGdCQUFnQkEsQ0FXVEEsTUFBMEJBLEVBQUVBLFVBQW9DQTtRQVg3RUMsaUJBMEhDQTtRQS9HWUEsc0JBQTBCQSxHQUExQkEsVUFBMEJBO1FBQUVBLDBCQUFvQ0EsR0FBcENBLGlCQUFvQ0E7UUFFM0VBLGtCQUFNQSxJQUFJQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtRQVRqQkEsZ0JBQVdBLEdBQVVBLEVBQUVBLENBQUNBO1FBVy9CQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLFVBQUNBLFlBQTZCQSxFQUFFQSxRQUFpQkEsRUFBRUEsU0FBK0JBLEVBQUVBLGFBQWlDQSxFQUFFQSxlQUFrQ0EsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsU0FBU0EsRUFBRUEsYUFBYUEsRUFBRUEs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NUtRLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLEdBQy9FQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUNoREEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDckVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLEdBQ3BEQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUN6RUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsS0FBS0EsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDL0NBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBR3JFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUdyRUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsTUFBTUEsR0FDekVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBRWhEQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUVyRUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDekVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQ3JFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUNyRUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsQ0FBQ0E7SUFDbkRBLENBQUNBO0lBQ0ZSLHVCQUFDQTtBQUFEQSxDQTFIQSxBQTBIQ0EsRUExSDhCLHNCQUFzQixFQTBIcEQ7QUFFRCxBQUEwQixpQkFBakIsZ0JBQWdCLENBQUMiLCJmaWxlIjoibWV0aG9kcy9EaWZmdXNlQ2VsTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5cbmltcG9ydCBTaGFkZXJMaWdodGluZ09iamVjdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlckxpZ2h0aW5nT2JqZWN0XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgU2hhZGVyQ29tcGlsZXJIZWxwZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcblxuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9kYXRhL01ldGhvZFZPXCIpO1xuaW1wb3J0IERpZmZ1c2VCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9EaWZmdXNlQmFzaWNNZXRob2RcIik7XG5pbXBvcnQgRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZFwiKTtcblxuLyoqXG4gKiBEaWZmdXNlQ2VsTWV0aG9kIHByb3ZpZGVzIGEgc2hhZGluZyBtZXRob2QgdG8gYWRkIGRpZmZ1c2UgY2VsIChjYXJ0b29uKSBzaGFkaW5nLlxuICovXG5jbGFzcyBEaWZmdXNlQ2VsTWV0aG9kIGV4dGVuZHMgRGlmZnVzZUNvbXBvc2l0ZU1ldGhvZFxue1xuXHRwcml2YXRlIF9sZXZlbHM6bnVtYmVyIC8qdWludCovO1xuXHRwcml2YXRlIF9kYXRhUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudDtcblx0cHJpdmF0ZSBfc21vb3RobmVzczpudW1iZXIgPSAuMTtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBEaWZmdXNlQ2VsTWV0aG9kIG9iamVjdC5cblx0ICogQHBhcmFtIGxldmVscyBUaGUgYW1vdW50IG9mIHNoYWRvdyBncmFkYXRpb25zLlxuXHQgKiBAcGFyYW0gYmFzZU1ldGhvZCBBbiBvcHRpb25hbCBkaWZmdXNlIG1ldGhvZCBvbiB3aGljaCB0aGUgY2FydG9vbiBzaGFkaW5nIGlzIGJhc2VkLiBJZiBvbWl0dGVkLCBEaWZmdXNlQmFzaWNNZXRob2QgaXMgdXNlZC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGxldmVsczpudW1iZXIgLyp1aW50Ki8gPSAzLCBiYXNlTWV0aG9kOkRpZmZ1c2VCYXNpY01ldGhvZCA9IG51bGwpXG5cdHtcblx0XHRzdXBlcihudWxsLCBiYXNlTWV0aG9kKTtcblxuXHRcdHRoaXMuYmFzZU1ldGhvZC5faU1vZHVsYXRlTWV0aG9kID0gKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKSA9PiB0aGlzLmNsYW1wRGlmZnVzZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCB0YXJnZXRSZWcsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHR0aGlzLl9sZXZlbHMgPSBsZXZlbHM7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpSW5pdENvbnN0YW50cyhzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cdFx0dmFyIGRhdGE6QXJyYXk8bnVtYmVyPiA9IHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YTtcblx0XHR2YXIgaW5kZXg6bnVtYmVyIC8qaW50Ki8gPSBtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4O1xuXHRcdHN1cGVyLmlJbml0Q29uc3RhbnRzKHNoYWRlck9iamVjdCwgbWV0aG9kVk8pO1xuXHRcdGRhdGFbaW5kZXggKyAxXSA9IDE7XG5cdFx0ZGF0YVtpbmRleCArIDJdID0gMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYW1vdW50IG9mIHNoYWRvdyBncmFkYXRpb25zLlxuXHQgKi9cblx0cHVibGljIGdldCBsZXZlbHMoKTpudW1iZXIgLyp1aW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLl9sZXZlbHM7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGxldmVscyh2YWx1ZTpudW1iZXIgLyp1aW50Ki8pXG5cdHtcblx0XHR0aGlzLl9sZXZlbHMgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgc21vb3RobmVzcyBvZiB0aGUgZWRnZSBiZXR3ZWVuIDIgc2hhZGluZyBsZXZlbHMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNtb290aG5lc3MoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zbW9vdGhuZXNzO1xuXHR9XG5cblx0cHVibGljIHNldCBzbW9vdGhuZXNzKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3Ntb290aG5lc3MgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpXG5cdHtcblx0XHRzdXBlci5pQ2xlYW5Db21waWxhdGlvbkRhdGEoKTtcblx0XHR0aGlzLl9kYXRhUmVnID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dGhpcy5fZGF0YVJlZyA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblx0XHRtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4ID0gdGhpcy5fZGF0YVJlZy5pbmRleCo0O1xuXG5cdFx0cmV0dXJuIHN1cGVyLmlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0c3VwZXIuaUFjdGl2YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHN0YWdlKTtcblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xuXHRcdHZhciBpbmRleDpudW1iZXIgLyppbnQqLyA9IG1ldGhvZFZPLnNlY29uZGFyeUZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XG5cdFx0ZGF0YVtpbmRleF0gPSB0aGlzLl9sZXZlbHM7XG5cdFx0ZGF0YVtpbmRleCArIDNdID0gdGhpcy5fc21vb3RobmVzcztcblx0fVxuXG5cdC8qKlxuXHQgKiBTbmFwcyB0aGUgZGlmZnVzZSBzaGFkaW5nIG9mIHRoZSB3cmFwcGVkIG1ldGhvZCB0byBvbmUgb2YgdGhlIGxldmVscy5cblx0ICogQHBhcmFtIHZvIFRoZSBNZXRob2RWTyB1c2VkIHRvIGNvbXBpbGUgdGhlIGN1cnJlbnQgc2hhZGVyLlxuXHQgKiBAcGFyYW0gdCBUaGUgcmVnaXN0ZXIgY29udGFpbmluZyB0aGUgZGlmZnVzZSBzdHJlbmd0aCBpbiB0aGUgXCJ3XCIgY29tcG9uZW50LlxuXHQgKiBAcGFyYW0gcmVnQ2FjaGUgVGhlIHJlZ2lzdGVyIGNhY2hlIHVzZWQgZm9yIHRoZSBzaGFkZXIgY29tcGlsYXRpb24uXG5cdCAqIEBwYXJhbSBzaGFyZWRSZWdpc3RlcnMgVGhlIHNoYXJlZCByZWdpc3RlciBkYXRhIGZvciB0aGlzIHNoYWRlci5cblx0ICogQHJldHVybiBUaGUgQUdBTCBmcmFnbWVudCBjb2RlIGZvciB0aGUgbWV0aG9kLlxuXHQgKi9cblx0cHJpdmF0ZSBjbGFtcERpZmZ1c2Uoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi54XFxuXCIgK1xuXHRcdFx0XCJmcmMgXCIgKyB0YXJnZXRSZWcgKyBcIi56LCBcIiArIHRhcmdldFJlZyArIFwiLndcXG5cIiArXG5cdFx0XHRcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi56XFxuXCIgK1xuXHRcdFx0XCJtb3YgXCIgKyB0YXJnZXRSZWcgKyBcIi54LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi54XFxuXCIgK1xuXHRcdFx0XCJzdWIgXCIgKyB0YXJnZXRSZWcgKyBcIi54LCBcIiArIHRhcmdldFJlZyArIFwiLngsIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnlcXG5cIiArXG5cdFx0XHRcInJjcCBcIiArIHRhcmdldFJlZyArIFwiLngsXCIgKyB0YXJnZXRSZWcgKyBcIi54XFxuXCIgK1xuXHRcdFx0XCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIueFxcblwiICtcblxuXHRcdFx0Ly8gcHJldmlvdXMgY2xhbXBlZCBzdHJlbmd0aFxuXHRcdFx0XCJzdWIgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIueFxcblwiICtcblxuXHRcdFx0Ly8gZnJhY3QvZXBzaWxvbiAoc28gMCAtIGVwc2lsb24gd2lsbCBiZWNvbWUgMCAtIDEpXG5cdFx0XHRcImRpdiBcIiArIHRhcmdldFJlZyArIFwiLnosIFwiICsgdGFyZ2V0UmVnICsgXCIueiwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIud1xcblwiICtcblx0XHRcdFwic2F0IFwiICsgdGFyZ2V0UmVnICsgXCIueiwgXCIgKyB0YXJnZXRSZWcgKyBcIi56XFxuXCIgK1xuXG5cdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi56XFxuXCIgK1xuXHRcdFx0Ly8gMS16XG5cdFx0XHRcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLnosIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIuelxcblwiICtcblx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRhcmdldFJlZyArIFwiLnpcXG5cIiArXG5cdFx0XHRcImFkZCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi55XFxuXCIgK1xuXHRcdFx0XCJzYXQgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLndcXG5cIjtcblx0fVxufVxuXG5leHBvcnQgPSBEaWZmdXNlQ2VsTWV0aG9kOyJdfQ==