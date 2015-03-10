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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvRGlmZnVzZUNlbE1ldGhvZC50cyJdLCJuYW1lcyI6WyJEaWZmdXNlQ2VsTWV0aG9kIiwiRGlmZnVzZUNlbE1ldGhvZC5jb25zdHJ1Y3RvciIsIkRpZmZ1c2VDZWxNZXRob2QuaUluaXRDb25zdGFudHMiLCJEaWZmdXNlQ2VsTWV0aG9kLmxldmVscyIsIkRpZmZ1c2VDZWxNZXRob2Quc21vb3RobmVzcyIsIkRpZmZ1c2VDZWxNZXRob2QuaUNsZWFuQ29tcGlsYXRpb25EYXRhIiwiRGlmZnVzZUNlbE1ldGhvZC5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUiLCJEaWZmdXNlQ2VsTWV0aG9kLmlBY3RpdmF0ZSIsIkRpZmZ1c2VDZWxNZXRob2QuY2xhbXBEaWZmdXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFXQSxJQUFPLHNCQUFzQixXQUFhLDJEQUEyRCxDQUFDLENBQUM7QUFFdkcsQUFHQTs7R0FERztJQUNHLGdCQUFnQjtJQUFTQSxVQUF6QkEsZ0JBQWdCQSxVQUErQkE7SUFNcERBOzs7O09BSUdBO0lBQ0hBLFNBWEtBLGdCQUFnQkEsQ0FXVEEsTUFBMEJBLEVBQUVBLFVBQW9DQTtRQVg3RUMsaUJBMEhDQTtRQS9HWUEsc0JBQTBCQSxHQUExQkEsVUFBMEJBO1FBQUVBLDBCQUFvQ0EsR0FBcENBLGlCQUFvQ0E7UUFFM0VBLGtCQUFNQSxJQUFJQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtRQVRqQkEsZ0JBQVdBLEdBQVVBLEVBQUVBLENBQUNBO1FBVy9CQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLFVBQUNBLFlBQTZCQSxFQUFFQSxRQUFpQkEsRUFBRUEsU0FBK0JBLEVBQUVBLGFBQWlDQSxFQUFFQSxlQUFrQ0EsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsU0FBU0EsRUFBRUEsYUFBYUEsRUFBRUEs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NUtRLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLEdBQy9FQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUNoREEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDckVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLEdBQ3BEQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUN6RUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsS0FBS0EsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDL0NBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBR3JFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUdyRUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsTUFBTUEsR0FDekVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBRWhEQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUVyRUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDekVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQ3JFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUNyRUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsQ0FBQ0E7SUFDbkRBLENBQUNBO0lBQ0ZSLHVCQUFDQTtBQUFEQSxDQTFIQSxBQTBIQ0EsRUExSDhCLHNCQUFzQixFQTBIcEQ7QUFFRCxBQUEwQixpQkFBakIsZ0JBQWdCLENBQUMiLCJmaWxlIjoibWV0aG9kcy9EaWZmdXNlQ2VsTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XHJcblxyXG5pbXBvcnQgU2hhZGVyTGlnaHRpbmdPYmplY3RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJMaWdodGluZ09iamVjdFwiKTtcclxuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckNhY2hlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcclxuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcclxuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XHJcbmltcG9ydCBTaGFkZXJDb21waWxlckhlbHBlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3V0aWxzL1NoYWRlckNvbXBpbGVySGVscGVyXCIpO1xyXG5cclxuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9kYXRhL01ldGhvZFZPXCIpO1xyXG5pbXBvcnQgRGlmZnVzZUJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0RpZmZ1c2VCYXNpY01ldGhvZFwiKTtcclxuaW1wb3J0IERpZmZ1c2VDb21wb3NpdGVNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL0RpZmZ1c2VDb21wb3NpdGVNZXRob2RcIik7XHJcblxyXG4vKipcclxuICogRGlmZnVzZUNlbE1ldGhvZCBwcm92aWRlcyBhIHNoYWRpbmcgbWV0aG9kIHRvIGFkZCBkaWZmdXNlIGNlbCAoY2FydG9vbikgc2hhZGluZy5cclxuICovXHJcbmNsYXNzIERpZmZ1c2VDZWxNZXRob2QgZXh0ZW5kcyBEaWZmdXNlQ29tcG9zaXRlTWV0aG9kXHJcbntcclxuXHRwcml2YXRlIF9sZXZlbHM6bnVtYmVyIC8qdWludCovO1xyXG5cdHByaXZhdGUgX2RhdGFSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50O1xyXG5cdHByaXZhdGUgX3Ntb290aG5lc3M6bnVtYmVyID0gLjE7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgYSBuZXcgRGlmZnVzZUNlbE1ldGhvZCBvYmplY3QuXHJcblx0ICogQHBhcmFtIGxldmVscyBUaGUgYW1vdW50IG9mIHNoYWRvdyBncmFkYXRpb25zLlxyXG5cdCAqIEBwYXJhbSBiYXNlTWV0aG9kIEFuIG9wdGlvbmFsIGRpZmZ1c2UgbWV0aG9kIG9uIHdoaWNoIHRoZSBjYXJ0b29uIHNoYWRpbmcgaXMgYmFzZWQuIElmIG9taXR0ZWQsIERpZmZ1c2VCYXNpY01ldGhvZCBpcyB1c2VkLlxyXG5cdCAqL1xyXG5cdGNvbnN0cnVjdG9yKGxldmVsczpudW1iZXIgLyp1aW50Ki8gPSAzLCBiYXNlTWV0aG9kOkRpZmZ1c2VCYXNpY01ldGhvZCA9IG51bGwpXHJcblx0e1xyXG5cdFx0c3VwZXIobnVsbCwgYmFzZU1ldGhvZCk7XHJcblxyXG5cdFx0dGhpcy5iYXNlTWV0aG9kLl9pTW9kdWxhdGVNZXRob2QgPSAoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpID0+IHRoaXMuY2xhbXBEaWZmdXNlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHRhcmdldFJlZywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcclxuXHJcblx0XHR0aGlzLl9sZXZlbHMgPSBsZXZlbHM7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpSW5pdENvbnN0YW50cyhzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPKVxyXG5cdHtcclxuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XHJcblx0XHR2YXIgaW5kZXg6bnVtYmVyIC8qaW50Ki8gPSBtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4O1xyXG5cdFx0c3VwZXIuaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0LCBtZXRob2RWTyk7XHJcblx0XHRkYXRhW2luZGV4ICsgMV0gPSAxO1xyXG5cdFx0ZGF0YVtpbmRleCArIDJdID0gMDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBhbW91bnQgb2Ygc2hhZG93IGdyYWRhdGlvbnMuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBsZXZlbHMoKTpudW1iZXIgLyp1aW50Ki9cclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fbGV2ZWxzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBsZXZlbHModmFsdWU6bnVtYmVyIC8qdWludCovKVxyXG5cdHtcclxuXHRcdHRoaXMuX2xldmVscyA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIHNtb290aG5lc3Mgb2YgdGhlIGVkZ2UgYmV0d2VlbiAyIHNoYWRpbmcgbGV2ZWxzLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgc21vb3RobmVzcygpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9zbW9vdGhuZXNzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBzbW9vdGhuZXNzKHZhbHVlOm51bWJlcilcclxuXHR7XHJcblx0XHR0aGlzLl9zbW9vdGhuZXNzID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpQ2xlYW5Db21waWxhdGlvbkRhdGEoKVxyXG5cdHtcclxuXHRcdHN1cGVyLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpO1xyXG5cdFx0dGhpcy5fZGF0YVJlZyA9IG51bGw7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcclxuXHR7XHJcblx0XHR0aGlzLl9kYXRhUmVnID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xyXG5cdFx0bWV0aG9kVk8uc2Vjb25kYXJ5RnJhZ21lbnRDb25zdGFudHNJbmRleCA9IHRoaXMuX2RhdGFSZWcuaW5kZXgqNDtcclxuXHJcblx0XHRyZXR1cm4gc3VwZXIuaUdldEZyYWdtZW50UHJlTGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpQWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXHJcblx0e1xyXG5cdFx0c3VwZXIuaUFjdGl2YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHN0YWdlKTtcclxuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XHJcblx0XHR2YXIgaW5kZXg6bnVtYmVyIC8qaW50Ki8gPSBtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4O1xyXG5cdFx0ZGF0YVtpbmRleF0gPSB0aGlzLl9sZXZlbHM7XHJcblx0XHRkYXRhW2luZGV4ICsgM10gPSB0aGlzLl9zbW9vdGhuZXNzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogU25hcHMgdGhlIGRpZmZ1c2Ugc2hhZGluZyBvZiB0aGUgd3JhcHBlZCBtZXRob2QgdG8gb25lIG9mIHRoZSBsZXZlbHMuXHJcblx0ICogQHBhcmFtIHZvIFRoZSBNZXRob2RWTyB1c2VkIHRvIGNvbXBpbGUgdGhlIGN1cnJlbnQgc2hhZGVyLlxyXG5cdCAqIEBwYXJhbSB0IFRoZSByZWdpc3RlciBjb250YWluaW5nIHRoZSBkaWZmdXNlIHN0cmVuZ3RoIGluIHRoZSBcIndcIiBjb21wb25lbnQuXHJcblx0ICogQHBhcmFtIHJlZ0NhY2hlIFRoZSByZWdpc3RlciBjYWNoZSB1c2VkIGZvciB0aGUgc2hhZGVyIGNvbXBpbGF0aW9uLlxyXG5cdCAqIEBwYXJhbSBzaGFyZWRSZWdpc3RlcnMgVGhlIHNoYXJlZCByZWdpc3RlciBkYXRhIGZvciB0aGlzIHNoYWRlci5cclxuXHQgKiBAcmV0dXJuIFRoZSBBR0FMIGZyYWdtZW50IGNvZGUgZm9yIHRoZSBtZXRob2QuXHJcblx0ICovXHJcblx0cHJpdmF0ZSBjbGFtcERpZmZ1c2Uoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiBcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueFxcblwiICtcclxuXHRcdFx0XCJmcmMgXCIgKyB0YXJnZXRSZWcgKyBcIi56LCBcIiArIHRhcmdldFJlZyArIFwiLndcXG5cIiArXHJcblx0XHRcdFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLnpcXG5cIiArXHJcblx0XHRcdFwibW92IFwiICsgdGFyZ2V0UmVnICsgXCIueCwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueFxcblwiICtcclxuXHRcdFx0XCJzdWIgXCIgKyB0YXJnZXRSZWcgKyBcIi54LCBcIiArIHRhcmdldFJlZyArIFwiLngsIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnlcXG5cIiArXHJcblx0XHRcdFwicmNwIFwiICsgdGFyZ2V0UmVnICsgXCIueCxcIiArIHRhcmdldFJlZyArIFwiLnhcXG5cIiArXHJcblx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRhcmdldFJlZyArIFwiLnhcXG5cIiArXHJcblxyXG5cdFx0XHQvLyBwcmV2aW91cyBjbGFtcGVkIHN0cmVuZ3RoXHJcblx0XHRcdFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLnhcXG5cIiArXHJcblxyXG5cdFx0XHQvLyBmcmFjdC9lcHNpbG9uIChzbyAwIC0gZXBzaWxvbiB3aWxsIGJlY29tZSAwIC0gMSlcclxuXHRcdFx0XCJkaXYgXCIgKyB0YXJnZXRSZWcgKyBcIi56LCBcIiArIHRhcmdldFJlZyArIFwiLnosIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLndcXG5cIiArXHJcblx0XHRcdFwic2F0IFwiICsgdGFyZ2V0UmVnICsgXCIueiwgXCIgKyB0YXJnZXRSZWcgKyBcIi56XFxuXCIgK1xyXG5cclxuXHRcdFx0XCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIuelxcblwiICtcclxuXHRcdFx0Ly8gMS16XHJcblx0XHRcdFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueiwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi56XFxuXCIgK1xyXG5cdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0YXJnZXRSZWcgKyBcIi56XFxuXCIgK1xyXG5cdFx0XHRcImFkZCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi55XFxuXCIgK1xyXG5cdFx0XHRcInNhdCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIud1xcblwiO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0ID0gRGlmZnVzZUNlbE1ldGhvZDsiXX0=