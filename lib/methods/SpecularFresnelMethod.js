var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SpecularCompositeMethod = require("awayjs-methodmaterials/lib/methods/SpecularCompositeMethod");
/**
 * SpecularFresnelMethod provides a specular shading method that causes stronger highlights on grazing view angles.
 */
var SpecularFresnelMethod = (function (_super) {
    __extends(SpecularFresnelMethod, _super);
    /**
     * Creates a new SpecularFresnelMethod object.
     * @param basedOnSurface Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
     * @param baseMethod The specular method to which the fresnel equation. Defaults to SpecularBasicMethod.
     */
    function SpecularFresnelMethod(basedOnSurface, baseMethod) {
        var _this = this;
        if (basedOnSurface === void 0) { basedOnSurface = true; }
        if (baseMethod === void 0) { baseMethod = null; }
        // may want to offer diff speculars
        _super.call(this, null, baseMethod);
        this._fresnelPower = 5;
        this._normalReflectance = .028; // default value for skin
        this.baseMethod._iModulateMethod = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) { return _this.modulateSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters); };
        this._incidentLight = !basedOnSurface;
    }
    /**
     * @inheritDoc
     */
    SpecularFresnelMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var index = methodVO.secondaryFragmentConstantsIndex;
        shaderObject.fragmentConstantData[index + 2] = 1;
        shaderObject.fragmentConstantData[index + 3] = 0;
    };
    Object.defineProperty(SpecularFresnelMethod.prototype, "basedOnSurface", {
        /**
         * Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
         */
        get: function () {
            return !this._incidentLight;
        },
        set: function (value) {
            if (this._incidentLight != value)
                return;
            this._incidentLight = !value;
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularFresnelMethod.prototype, "fresnelPower", {
        /**
         * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
         */
        get: function () {
            return this._fresnelPower;
        },
        set: function (value) {
            this._fresnelPower = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SpecularFresnelMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._dataReg = null;
    };
    Object.defineProperty(SpecularFresnelMethod.prototype, "normalReflectance", {
        /**
         * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
         */
        get: function () {
            return this._normalReflectance;
        },
        set: function (value) {
            this._normalReflectance = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SpecularFresnelMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var fragmentData = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        fragmentData[index] = this._normalReflectance;
        fragmentData[index + 1] = this._fresnelPower;
    };
    /**
     * @inheritDoc
     */
    SpecularFresnelMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        console.log('SpecularFresnelMethod', 'iGetFragmentPreLightingCode', this._dataReg);
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
    };
    /**
     * Applies the fresnel effect to the specular strength.
     *
     * @param vo The MethodVO object containing the method data for the currently compiled material pass.
     * @param target The register containing the specular strength in the "w" component, and the half-vector/reflection vector in "xyz".
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared registers created by the compiler.
     * @return The AGAL fragment code for the method.
     */
    SpecularFresnelMethod.prototype.modulateSpecular = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code;
        code = "dp3 " + targetReg + ".y, " + sharedRegisters.viewDirFragment + ".xyz, " + (this._incidentLight ? targetReg : sharedRegisters.normalFragment) + ".xyz\n" + "sub " + targetReg + ".y, " + this._dataReg + ".z, " + targetReg + ".y\n" + "pow " + targetReg + ".x, " + targetReg + ".y, " + this._dataReg + ".y\n" + "sub " + targetReg + ".y, " + this._dataReg + ".z, " + targetReg + ".y\n" + "mul " + targetReg + ".y, " + this._dataReg + ".x, " + targetReg + ".y\n" + "add " + targetReg + ".y, " + targetReg + ".x, " + targetReg + ".y\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
        console.log('SpecularFresnelMethod', 'modulateSpecular', code);
        return code;
    };
    return SpecularFresnelMethod;
})(SpecularCompositeMethod);
module.exports = SpecularFresnelMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU3BlY3VsYXJGcmVzbmVsTWV0aG9kLnRzIl0sIm5hbWVzIjpbIlNwZWN1bGFyRnJlc25lbE1ldGhvZCIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5jb25zdHJ1Y3RvciIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5pSW5pdENvbnN0YW50cyIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5iYXNlZE9uU3VyZmFjZSIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5mcmVzbmVsUG93ZXIiLCJTcGVjdWxhckZyZXNuZWxNZXRob2QuaUNsZWFuQ29tcGlsYXRpb25EYXRhIiwiU3BlY3VsYXJGcmVzbmVsTWV0aG9kLm5vcm1hbFJlZmxlY3RhbmNlIiwiU3BlY3VsYXJGcmVzbmVsTWV0aG9kLmlBY3RpdmF0ZSIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUiLCJTcGVjdWxhckZyZXNuZWxNZXRob2QubW9kdWxhdGVTcGVjdWxhciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBWUEsSUFBTyx1QkFBdUIsV0FBYSw0REFBNEQsQ0FBQyxDQUFDO0FBRXpHLEFBR0E7O0dBREc7SUFDRyxxQkFBcUI7SUFBU0EsVUFBOUJBLHFCQUFxQkEsVUFBZ0NBO0lBTzFEQTs7OztPQUlHQTtJQUNIQSxTQVpLQSxxQkFBcUJBLENBWWRBLGNBQTZCQSxFQUFFQSxVQUFxQ0E7UUFaakZDLGlCQTZJQ0E7UUFqSVlBLDhCQUE2QkEsR0FBN0JBLHFCQUE2QkE7UUFBRUEsMEJBQXFDQSxHQUFyQ0EsaUJBQXFDQTtRQUUvRUEsQUFDQUEsbUNBRG1DQTtRQUNuQ0Esa0JBQU1BLElBQUlBLEVBQUVBLFVBQVVBLENBQUNBLENBQUNBO1FBWGpCQSxrQkFBYUEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDekJBLHVCQUFrQkEsR0FBVUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EseUJBQXlCQTtRQVlsRUEsSUFBSUEsQ0FBQ0Es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TUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDekVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQ3pFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUNyRUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFHdkVBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLHVCQUF1QkEsRUFBRUEsa0JBQWtCQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUUvREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDYkEsQ0FBQ0E7SUFFRlQsNEJBQUNBO0FBQURBLENBN0lBLEFBNklDQSxFQTdJbUMsdUJBQXVCLEVBNkkxRDtBQUVELEFBQStCLGlCQUF0QixxQkFBcUIsQ0FBQyIsImZpbGUiOiJtZXRob2RzL1NwZWN1bGFyRnJlc25lbE1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgU2hhZGVyTGlnaHRpbmdPYmplY3RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJMaWdodGluZ09iamVjdFwiKTtcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuXG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL2RhdGEvTWV0aG9kVk9cIik7XG5pbXBvcnQgU3BlY3VsYXJCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9TcGVjdWxhckJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IFNwZWN1bGFyQ29tcG9zaXRlTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9TcGVjdWxhckNvbXBvc2l0ZU1ldGhvZFwiKTtcblxuLyoqXG4gKiBTcGVjdWxhckZyZXNuZWxNZXRob2QgcHJvdmlkZXMgYSBzcGVjdWxhciBzaGFkaW5nIG1ldGhvZCB0aGF0IGNhdXNlcyBzdHJvbmdlciBoaWdobGlnaHRzIG9uIGdyYXppbmcgdmlldyBhbmdsZXMuXG4gKi9cbmNsYXNzIFNwZWN1bGFyRnJlc25lbE1ldGhvZCBleHRlbmRzIFNwZWN1bGFyQ29tcG9zaXRlTWV0aG9kXG57XG5cdHByaXZhdGUgX2RhdGFSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50O1xuXHRwcml2YXRlIF9pbmNpZGVudExpZ2h0OmJvb2xlYW47XG5cdHByaXZhdGUgX2ZyZXNuZWxQb3dlcjpudW1iZXIgPSA1O1xuXHRwcml2YXRlIF9ub3JtYWxSZWZsZWN0YW5jZTpudW1iZXIgPSAuMDI4OyAvLyBkZWZhdWx0IHZhbHVlIGZvciBza2luXG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgU3BlY3VsYXJGcmVzbmVsTWV0aG9kIG9iamVjdC5cblx0ICogQHBhcmFtIGJhc2VkT25TdXJmYWNlIERlZmluZXMgd2hldGhlciB0aGUgZnJlc25lbCBlZmZlY3Qgc2hvdWxkIGJlIGJhc2VkIG9uIHRoZSB2aWV3IGFuZ2xlIG9uIHRoZSBzdXJmYWNlIChpZiB0cnVlKSwgb3Igb24gdGhlIGFuZ2xlIGJldHdlZW4gdGhlIGxpZ2h0IGFuZCB0aGUgdmlldy5cblx0ICogQHBhcmFtIGJhc2VNZXRob2QgVGhlIHNwZWN1bGFyIG1ldGhvZCB0byB3aGljaCB0aGUgZnJlc25lbCBlcXVhdGlvbi4gRGVmYXVsdHMgdG8gU3BlY3VsYXJCYXNpY01ldGhvZC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGJhc2VkT25TdXJmYWNlOmJvb2xlYW4gPSB0cnVlLCBiYXNlTWV0aG9kOlNwZWN1bGFyQmFzaWNNZXRob2QgPSBudWxsKVxuXHR7XG5cdFx0Ly8gbWF5IHdhbnQgdG8gb2ZmZXIgZGlmZiBzcGVjdWxhcnNcblx0XHRzdXBlcihudWxsLCBiYXNlTWV0aG9kKTtcblxuXHRcdHRoaXMuYmFzZU1ldGhvZC5faU1vZHVsYXRlTWV0aG9kID0gKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKSA9PiB0aGlzLm1vZHVsYXRlU3BlY3VsYXIoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgdGFyZ2V0UmVnLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0dGhpcy5faW5jaWRlbnRMaWdodCA9ICFiYXNlZE9uU3VyZmFjZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlJbml0Q29uc3RhbnRzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXG5cdFx0dmFyIGluZGV4Om51bWJlciA9IG1ldGhvZFZPLnNlY29uZGFyeUZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XG5cdFx0c2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhW2luZGV4ICsgMl0gPSAxO1xuXHRcdHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YVtpbmRleCArIDNdID0gMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWZpbmVzIHdoZXRoZXIgdGhlIGZyZXNuZWwgZWZmZWN0IHNob3VsZCBiZSBiYXNlZCBvbiB0aGUgdmlldyBhbmdsZSBvbiB0aGUgc3VyZmFjZSAoaWYgdHJ1ZSksIG9yIG9uIHRoZSBhbmdsZSBiZXR3ZWVuIHRoZSBsaWdodCBhbmQgdGhlIHZpZXcuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGJhc2VkT25TdXJmYWNlKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuICF0aGlzLl9pbmNpZGVudExpZ2h0O1xuXHR9XG5cblx0cHVibGljIHNldCBiYXNlZE9uU3VyZmFjZSh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2luY2lkZW50TGlnaHQgIT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9pbmNpZGVudExpZ2h0ID0gIXZhbHVlO1xuXG5cdFx0dGhpcy5pSW52YWxpZGF0ZVNoYWRlclByb2dyYW0oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgcG93ZXIgdXNlZCBpbiB0aGUgRnJlc25lbCBlcXVhdGlvbi4gSGlnaGVyIHZhbHVlcyBtYWtlIHRoZSBmcmVzbmVsIGVmZmVjdCBtb3JlIHByb25vdW5jZWQuIERlZmF1bHRzIHRvIDUuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGZyZXNuZWxQb3dlcigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2ZyZXNuZWxQb3dlcjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZnJlc25lbFBvd2VyKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX2ZyZXNuZWxQb3dlciA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUNsZWFuQ29tcGlsYXRpb25EYXRhKClcblx0e1xuXHRcdHN1cGVyLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpO1xuXHRcdHRoaXMuX2RhdGFSZWcgPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBtaW5pbXVtIGFtb3VudCBvZiByZWZsZWN0YW5jZSwgaWUgdGhlIHJlZmxlY3RhbmNlIHdoZW4gdGhlIHZpZXcgZGlyZWN0aW9uIGlzIG5vcm1hbCB0byB0aGUgc3VyZmFjZSBvciBsaWdodCBkaXJlY3Rpb24uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG5vcm1hbFJlZmxlY3RhbmNlKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbm9ybWFsUmVmbGVjdGFuY2U7XG5cdH1cblxuXHRwdWJsaWMgc2V0IG5vcm1hbFJlZmxlY3RhbmNlKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX25vcm1hbFJlZmxlY3RhbmNlID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpQWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHRzdXBlci5pQWN0aXZhdGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgc3RhZ2UpO1xuXG5cdFx0dmFyIGZyYWdtZW50RGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xuXG5cdFx0dmFyIGluZGV4Om51bWJlciA9IG1ldGhvZFZPLnNlY29uZGFyeUZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XG5cdFx0ZnJhZ21lbnREYXRhW2luZGV4XSA9IHRoaXMuX25vcm1hbFJlZmxlY3RhbmNlO1xuXHRcdGZyYWdtZW50RGF0YVtpbmRleCArIDFdID0gdGhpcy5fZnJlc25lbFBvd2VyO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50UHJlTGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR0aGlzLl9kYXRhUmVnID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXG5cdFx0Y29uc29sZS5sb2coJ1NwZWN1bGFyRnJlc25lbE1ldGhvZCcsICdpR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUnLCB0aGlzLl9kYXRhUmVnKTtcblxuXHRcdG1ldGhvZFZPLnNlY29uZGFyeUZyYWdtZW50Q29uc3RhbnRzSW5kZXggPSB0aGlzLl9kYXRhUmVnLmluZGV4KjQ7XG5cblx0XHRyZXR1cm4gc3VwZXIuaUdldEZyYWdtZW50UHJlTGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyB0aGUgZnJlc25lbCBlZmZlY3QgdG8gdGhlIHNwZWN1bGFyIHN0cmVuZ3RoLlxuXHQgKlxuXHQgKiBAcGFyYW0gdm8gVGhlIE1ldGhvZFZPIG9iamVjdCBjb250YWluaW5nIHRoZSBtZXRob2QgZGF0YSBmb3IgdGhlIGN1cnJlbnRseSBjb21waWxlZCBtYXRlcmlhbCBwYXNzLlxuXHQgKiBAcGFyYW0gdGFyZ2V0IFRoZSByZWdpc3RlciBjb250YWluaW5nIHRoZSBzcGVjdWxhciBzdHJlbmd0aCBpbiB0aGUgXCJ3XCIgY29tcG9uZW50LCBhbmQgdGhlIGhhbGYtdmVjdG9yL3JlZmxlY3Rpb24gdmVjdG9yIGluIFwieHl6XCIuXG5cdCAqIEBwYXJhbSByZWdDYWNoZSBUaGUgcmVnaXN0ZXIgY2FjaGUgdXNlZCBmb3IgdGhlIHNoYWRlciBjb21waWxhdGlvbi5cblx0ICogQHBhcmFtIHNoYXJlZFJlZ2lzdGVycyBUaGUgc2hhcmVkIHJlZ2lzdGVycyBjcmVhdGVkIGJ5IHRoZSBjb21waWxlci5cblx0ICogQHJldHVybiBUaGUgQUdBTCBmcmFnbWVudCBjb2RlIGZvciB0aGUgbWV0aG9kLlxuXHQgKi9cblx0cHJpdmF0ZSBtb2R1bGF0ZVNwZWN1bGFyKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZztcblxuXHRcdGNvZGUgPSBcImRwMyBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnZpZXdEaXJGcmFnbWVudCArIFwiLnh5eiwgXCIgKyAodGhpcy5faW5jaWRlbnRMaWdodD8gdGFyZ2V0UmVnIDogc2hhcmVkUmVnaXN0ZXJzLm5vcm1hbEZyYWdtZW50KSArIFwiLnh5elxcblwiICsgICAvLyBkb3QoViwgSClcblx0XHRcdFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueiwgXCIgKyB0YXJnZXRSZWcgKyBcIi55XFxuXCIgKyAgICAgICAgICAgICAvLyBiYXNlID0gMS1kb3QoViwgSClcblx0XHRcdFwicG93IFwiICsgdGFyZ2V0UmVnICsgXCIueCwgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi55XFxuXCIgKyAgICAgICAgICAgICAvLyBleHAgPSBwb3coYmFzZSwgNSlcblx0XHRcdFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueiwgXCIgKyB0YXJnZXRSZWcgKyBcIi55XFxuXCIgKyAgICAgICAgICAgICAvLyAxIC0gZXhwXG5cdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLngsIFwiICsgdGFyZ2V0UmVnICsgXCIueVxcblwiICsgICAgICAgICAgICAgLy8gZjAqKDEgLSBleHApXG5cdFx0XHRcImFkZCBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIueCwgXCIgKyB0YXJnZXRSZWcgKyBcIi55XFxuXCIgKyAgICAgICAgICAvLyBleHAgKyBmMCooMSAtIGV4cClcblx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLnlcXG5cIjtcblxuXG5cdFx0Y29uc29sZS5sb2coJ1NwZWN1bGFyRnJlc25lbE1ldGhvZCcsICdtb2R1bGF0ZVNwZWN1bGFyJywgY29kZSk7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG59XG5cbmV4cG9ydCA9IFNwZWN1bGFyRnJlc25lbE1ldGhvZDsiXX0=