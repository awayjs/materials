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
        return code;
    };
    return SpecularFresnelMethod;
})(SpecularCompositeMethod);
module.exports = SpecularFresnelMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU3BlY3VsYXJGcmVzbmVsTWV0aG9kLnRzIl0sIm5hbWVzIjpbIlNwZWN1bGFyRnJlc25lbE1ldGhvZCIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5jb25zdHJ1Y3RvciIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5pSW5pdENvbnN0YW50cyIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5iYXNlZE9uU3VyZmFjZSIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5mcmVzbmVsUG93ZXIiLCJTcGVjdWxhckZyZXNuZWxNZXRob2QuaUNsZWFuQ29tcGlsYXRpb25EYXRhIiwiU3BlY3VsYXJGcmVzbmVsTWV0aG9kLm5vcm1hbFJlZmxlY3RhbmNlIiwiU3BlY3VsYXJGcmVzbmVsTWV0aG9kLmlBY3RpdmF0ZSIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUiLCJTcGVjdWxhckZyZXNuZWxNZXRob2QubW9kdWxhdGVTcGVjdWxhciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBWUEsSUFBTyx1QkFBdUIsV0FBYSw0REFBNEQsQ0FBQyxDQUFDO0FBRXpHLEFBR0E7O0dBREc7SUFDRyxxQkFBcUI7SUFBU0EsVUFBOUJBLHFCQUFxQkEsVUFBZ0NBO0lBTzFEQTs7OztPQUlHQTtJQUNIQSxTQVpLQSxxQkFBcUJBLENBWWRBLGNBQTZCQSxFQUFFQSxVQUFxQ0E7UUFaakZDLGlCQXdJQ0E7UUE1SFlBLDhCQUE2QkEsR0FBN0JBLHFCQUE2QkE7UUFBRUEsMEJBQXFDQSxHQUFyQ0EsaUJBQXFDQTtRQUUvRUEsQUFDQUEsbUNBRG1DQTtRQUNuQ0Esa0JBQU1BLElBQUlBLEVBQUVBLFVBQVVBLENBQUNBLENBQUNBO1FBWGpCQSxrQkFBYUEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDekJBLHVCQUFrQkEsR0FBVUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EseUJBQXlCQTtRQVlsRUEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxVQUFDQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLFNBQStCQSxFQUFFQSxhQUFpQ0EsRUFBRUEsZUFBa0NBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsU0FBU0EsRUFBRUEsYUFBYUEsRUFBRUEsZUFBZUEsQ0FBQ0EsRUFBeEZBLENBQXdGQSxDQUFDQTtRQUUxUkEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsQ0FBQ0EsY0FBY0EsQ0FBQ0E7SUFDdkNBLENBQUNBO0lBRUREOztPQUVHQTtJQUNJQSw4Q0FBY0EsR0FBckJBLFVBQXNCQSxZQUE2QkEsRUFBRUEsUUFBaUJBO1FBR3JFRSxJQUFJQSxLQUFLQSxHQUFVQSxRQUFRQSxDQUFDQSwrQkFBK0JBLENBQUNBO1FBQzVEQSxZQUFZQSxDQUFDQSxvQkFBb0JBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ2pEQSxZQUFZQSxDQUFDQSxvQkFBb0JBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO0lBQ2xEQSxDQUFDQTtJQUtERixzQkFBV0EsaURBQWNBO1FBSHpCQTs7V0FFR0E7YUFDSEE7WUFFQ0csTUFBTUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0E7UUFDN0JBLENBQUNBO2FBRURILFVBQTBCQSxLQUFhQTtZQUV0Q0csRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsSUFBSUEsS0FBS0EsQ0FBQ0E7Z0JBQ2hDQSxNQUFNQSxDQUFDQTtZQUVSQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUU3QkEsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxFQUFFQSxDQUFDQTtRQUNqQ0EsQ0FBQ0E7OztPQVZBSDtJQWVEQSxzQkFBV0EsK0NBQVlBO1FBSHZCQTs7V0FFR0E7YUFDSEE7WUFFQ0ksTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFDM0JBLENBQUNBO2FBRURKLFVBQXdCQSxLQUFZQTtZQUVuQ0ksSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDNUJBLENBQUNBOzs7T0FMQUo7SUFPREE7O09BRUdBO0lBQ0lBLHFEQUFxQkEsR0FBNUJBO1FBRUNLLGdCQUFLQSxDQUFDQSxxQkFBcUJBLFdBQUVBLENBQUNBO1FBQzlCQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUN0QkEsQ0FBQ0E7SUFLREwsc0JBQVdBLG9EQUFpQkE7UUFINUJBOztXQUVHQTthQUNIQTtZQUVDTSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBO1FBQ2hDQSxDQUFDQTthQUVETixVQUE2QkEsS0FBWUE7WUFFeENNLElBQUlBLENBQUNBLGtCQUFrQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDakNBLENBQUNBOzs7T0FMQU47SUFPREE7O09BRUdBO0lBQ0lBLHlDQUFTQSxHQUFoQkEsVUFBaUJBLFlBQWlDQSxFQUFFQSxRQUFpQkEsRUFBRUEsS0FBV0E7UUFFakZPLGdCQUFLQSxDQUFDQSxTQUFTQSxZQUFDQSxZQUFZQSxFQUFFQSxRQUFRQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUUvQ0EsSUFBSUEsWUFBWUEsR0FBaUJBLFlBQVlBLENBQUNBLG9CQUFvQkEsQ0FBQ0E7UUFFbkVBLElBQUlBLEtBQUtBLEdBQVVBLFFBQVFBLENBQUNBLCtCQUErQkEsQ0FBQ0E7UUFDNURBLFlBQVlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0E7UUFDOUNBLFlBQVlBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO0lBQzlDQSxDQUFDQTtJQUVEUDs7T0FFR0E7SUFDSUEsMkRBQTJCQSxHQUFsQ0EsVUFBbUNBLFlBQWlDQSxFQUFFQSxRQUFpQkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUU3SlEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsYUFBYUEsQ0FBQ0EsdUJBQXVCQSxFQUFFQSxDQUFDQTtRQUV4REEsUUFBUUEsQ0FBQ0EsK0JBQStCQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxHQUFDQSxDQUFDQSxDQUFDQTtRQUVqRUEsTUFBTUEsQ0FBQ0EsZ0JBQUtBLENBQUNBLDJCQUEyQkEsWUFBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsYUFBYUEsRUFBRUEsZUFBZUEsQ0FBQ0EsQ0FBQ0E7SUFDbEdBLENBQUNBO0lBRURSOzs7Ozs7OztPQVFHQTtJQUNLQSxnREFBZ0JBLEdBQXhCQSxVQUF5QkEsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxTQUErQkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUVoTFMsSUFBSUEsSUFBV0EsQ0FBQ0E7UUFFaEJBLElBQUlBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLGVBQWVBLENBQUNBLGVBQWVBLEdBQUdBLFFBQVFBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLEdBQUVBLFNBQVNBLEdBQUdBLGVBQWVBLENBQUNBLGNBQWNBLENBQUNBLEdBQUdBLFFBQVFBLEdBQzdKQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUN6RUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsTUFBTUEsR0FDekVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQ3pFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUN6RUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDckVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLENBQUNBO1FBRXZFQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQUVGVCw0QkFBQ0E7QUFBREEsQ0F4SUEsQUF3SUNBLEVBeEltQyx1QkFBdUIsRUF3STFEO0FBRUQsQUFBK0IsaUJBQXRCLHFCQUFxQixDQUFDIiwiZmlsZSI6Im1ldGhvZHMvU3BlY3VsYXJGcmVzbmVsTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDYW1lcmFcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XHJcblxyXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xyXG5cclxuaW1wb3J0IFNoYWRlckxpZ2h0aW5nT2JqZWN0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyTGlnaHRpbmdPYmplY3RcIik7XHJcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xyXG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xyXG5cclxuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9kYXRhL01ldGhvZFZPXCIpO1xyXG5pbXBvcnQgU3BlY3VsYXJCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9TcGVjdWxhckJhc2ljTWV0aG9kXCIpO1xyXG5pbXBvcnQgU3BlY3VsYXJDb21wb3NpdGVNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL1NwZWN1bGFyQ29tcG9zaXRlTWV0aG9kXCIpO1xyXG5cclxuLyoqXHJcbiAqIFNwZWN1bGFyRnJlc25lbE1ldGhvZCBwcm92aWRlcyBhIHNwZWN1bGFyIHNoYWRpbmcgbWV0aG9kIHRoYXQgY2F1c2VzIHN0cm9uZ2VyIGhpZ2hsaWdodHMgb24gZ3JhemluZyB2aWV3IGFuZ2xlcy5cclxuICovXHJcbmNsYXNzIFNwZWN1bGFyRnJlc25lbE1ldGhvZCBleHRlbmRzIFNwZWN1bGFyQ29tcG9zaXRlTWV0aG9kXHJcbntcclxuXHRwcml2YXRlIF9kYXRhUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudDtcclxuXHRwcml2YXRlIF9pbmNpZGVudExpZ2h0OmJvb2xlYW47XHJcblx0cHJpdmF0ZSBfZnJlc25lbFBvd2VyOm51bWJlciA9IDU7XHJcblx0cHJpdmF0ZSBfbm9ybWFsUmVmbGVjdGFuY2U6bnVtYmVyID0gLjAyODsgLy8gZGVmYXVsdCB2YWx1ZSBmb3Igc2tpblxyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGVzIGEgbmV3IFNwZWN1bGFyRnJlc25lbE1ldGhvZCBvYmplY3QuXHJcblx0ICogQHBhcmFtIGJhc2VkT25TdXJmYWNlIERlZmluZXMgd2hldGhlciB0aGUgZnJlc25lbCBlZmZlY3Qgc2hvdWxkIGJlIGJhc2VkIG9uIHRoZSB2aWV3IGFuZ2xlIG9uIHRoZSBzdXJmYWNlIChpZiB0cnVlKSwgb3Igb24gdGhlIGFuZ2xlIGJldHdlZW4gdGhlIGxpZ2h0IGFuZCB0aGUgdmlldy5cclxuXHQgKiBAcGFyYW0gYmFzZU1ldGhvZCBUaGUgc3BlY3VsYXIgbWV0aG9kIHRvIHdoaWNoIHRoZSBmcmVzbmVsIGVxdWF0aW9uLiBEZWZhdWx0cyB0byBTcGVjdWxhckJhc2ljTWV0aG9kLlxyXG5cdCAqL1xyXG5cdGNvbnN0cnVjdG9yKGJhc2VkT25TdXJmYWNlOmJvb2xlYW4gPSB0cnVlLCBiYXNlTWV0aG9kOlNwZWN1bGFyQmFzaWNNZXRob2QgPSBudWxsKVxyXG5cdHtcclxuXHRcdC8vIG1heSB3YW50IHRvIG9mZmVyIGRpZmYgc3BlY3VsYXJzXHJcblx0XHRzdXBlcihudWxsLCBiYXNlTWV0aG9kKTtcclxuXHJcblx0XHR0aGlzLmJhc2VNZXRob2QuX2lNb2R1bGF0ZU1ldGhvZCA9IChzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSkgPT4gdGhpcy5tb2R1bGF0ZVNwZWN1bGFyKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHRhcmdldFJlZywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcclxuXHJcblx0XHR0aGlzLl9pbmNpZGVudExpZ2h0ID0gIWJhc2VkT25TdXJmYWNlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxyXG5cdHtcclxuXHJcblx0XHR2YXIgaW5kZXg6bnVtYmVyID0gbWV0aG9kVk8uc2Vjb25kYXJ5RnJhZ21lbnRDb25zdGFudHNJbmRleDtcclxuXHRcdHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YVtpbmRleCArIDJdID0gMTtcclxuXHRcdHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YVtpbmRleCArIDNdID0gMDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIERlZmluZXMgd2hldGhlciB0aGUgZnJlc25lbCBlZmZlY3Qgc2hvdWxkIGJlIGJhc2VkIG9uIHRoZSB2aWV3IGFuZ2xlIG9uIHRoZSBzdXJmYWNlIChpZiB0cnVlKSwgb3Igb24gdGhlIGFuZ2xlIGJldHdlZW4gdGhlIGxpZ2h0IGFuZCB0aGUgdmlldy5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGJhc2VkT25TdXJmYWNlKCk6Ym9vbGVhblxyXG5cdHtcclxuXHRcdHJldHVybiAhdGhpcy5faW5jaWRlbnRMaWdodDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgYmFzZWRPblN1cmZhY2UodmFsdWU6Ym9vbGVhbilcclxuXHR7XHJcblx0XHRpZiAodGhpcy5faW5jaWRlbnRMaWdodCAhPSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2luY2lkZW50TGlnaHQgPSAhdmFsdWU7XHJcblxyXG5cdFx0dGhpcy5pSW52YWxpZGF0ZVNoYWRlclByb2dyYW0oKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBwb3dlciB1c2VkIGluIHRoZSBGcmVzbmVsIGVxdWF0aW9uLiBIaWdoZXIgdmFsdWVzIG1ha2UgdGhlIGZyZXNuZWwgZWZmZWN0IG1vcmUgcHJvbm91bmNlZC4gRGVmYXVsdHMgdG8gNS5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGZyZXNuZWxQb3dlcigpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9mcmVzbmVsUG93ZXI7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGZyZXNuZWxQb3dlcih2YWx1ZTpudW1iZXIpXHJcblx0e1xyXG5cdFx0dGhpcy5fZnJlc25lbFBvd2VyID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpQ2xlYW5Db21waWxhdGlvbkRhdGEoKVxyXG5cdHtcclxuXHRcdHN1cGVyLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpO1xyXG5cdFx0dGhpcy5fZGF0YVJlZyA9IG51bGw7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgbWluaW11bSBhbW91bnQgb2YgcmVmbGVjdGFuY2UsIGllIHRoZSByZWZsZWN0YW5jZSB3aGVuIHRoZSB2aWV3IGRpcmVjdGlvbiBpcyBub3JtYWwgdG8gdGhlIHN1cmZhY2Ugb3IgbGlnaHQgZGlyZWN0aW9uLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgbm9ybWFsUmVmbGVjdGFuY2UoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fbm9ybWFsUmVmbGVjdGFuY2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IG5vcm1hbFJlZmxlY3RhbmNlKHZhbHVlOm51bWJlcilcclxuXHR7XHJcblx0XHR0aGlzLl9ub3JtYWxSZWZsZWN0YW5jZSA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxyXG5cdHtcclxuXHRcdHN1cGVyLmlBY3RpdmF0ZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCBzdGFnZSk7XHJcblxyXG5cdFx0dmFyIGZyYWdtZW50RGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xyXG5cclxuXHRcdHZhciBpbmRleDpudW1iZXIgPSBtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4O1xyXG5cdFx0ZnJhZ21lbnREYXRhW2luZGV4XSA9IHRoaXMuX25vcm1hbFJlZmxlY3RhbmNlO1xyXG5cdFx0ZnJhZ21lbnREYXRhW2luZGV4ICsgMV0gPSB0aGlzLl9mcmVzbmVsUG93ZXI7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcclxuXHR7XHJcblx0XHR0aGlzLl9kYXRhUmVnID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xyXG5cclxuXHRcdG1ldGhvZFZPLnNlY29uZGFyeUZyYWdtZW50Q29uc3RhbnRzSW5kZXggPSB0aGlzLl9kYXRhUmVnLmluZGV4KjQ7XHJcblxyXG5cdFx0cmV0dXJuIHN1cGVyLmlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQXBwbGllcyB0aGUgZnJlc25lbCBlZmZlY3QgdG8gdGhlIHNwZWN1bGFyIHN0cmVuZ3RoLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHZvIFRoZSBNZXRob2RWTyBvYmplY3QgY29udGFpbmluZyB0aGUgbWV0aG9kIGRhdGEgZm9yIHRoZSBjdXJyZW50bHkgY29tcGlsZWQgbWF0ZXJpYWwgcGFzcy5cclxuXHQgKiBAcGFyYW0gdGFyZ2V0IFRoZSByZWdpc3RlciBjb250YWluaW5nIHRoZSBzcGVjdWxhciBzdHJlbmd0aCBpbiB0aGUgXCJ3XCIgY29tcG9uZW50LCBhbmQgdGhlIGhhbGYtdmVjdG9yL3JlZmxlY3Rpb24gdmVjdG9yIGluIFwieHl6XCIuXHJcblx0ICogQHBhcmFtIHJlZ0NhY2hlIFRoZSByZWdpc3RlciBjYWNoZSB1c2VkIGZvciB0aGUgc2hhZGVyIGNvbXBpbGF0aW9uLlxyXG5cdCAqIEBwYXJhbSBzaGFyZWRSZWdpc3RlcnMgVGhlIHNoYXJlZCByZWdpc3RlcnMgY3JlYXRlZCBieSB0aGUgY29tcGlsZXIuXHJcblx0ICogQHJldHVybiBUaGUgQUdBTCBmcmFnbWVudCBjb2RlIGZvciB0aGUgbWV0aG9kLlxyXG5cdCAqL1xyXG5cdHByaXZhdGUgbW9kdWxhdGVTcGVjdWxhcihzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0dmFyIGNvZGU6c3RyaW5nO1xyXG5cclxuXHRcdGNvZGUgPSBcImRwMyBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnZpZXdEaXJGcmFnbWVudCArIFwiLnh5eiwgXCIgKyAodGhpcy5faW5jaWRlbnRMaWdodD8gdGFyZ2V0UmVnIDogc2hhcmVkUmVnaXN0ZXJzLm5vcm1hbEZyYWdtZW50KSArIFwiLnh5elxcblwiICsgICAvLyBkb3QoViwgSClcclxuXHRcdFx0XCJzdWIgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi56LCBcIiArIHRhcmdldFJlZyArIFwiLnlcXG5cIiArICAgICAgICAgICAgIC8vIGJhc2UgPSAxLWRvdChWLCBIKVxyXG5cdFx0XHRcInBvdyBcIiArIHRhcmdldFJlZyArIFwiLngsIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueVxcblwiICsgICAgICAgICAgICAgLy8gZXhwID0gcG93KGJhc2UsIDUpXHJcblx0XHRcdFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueiwgXCIgKyB0YXJnZXRSZWcgKyBcIi55XFxuXCIgKyAgICAgICAgICAgICAvLyAxIC0gZXhwXHJcblx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueCwgXCIgKyB0YXJnZXRSZWcgKyBcIi55XFxuXCIgKyAgICAgICAgICAgICAvLyBmMCooMSAtIGV4cClcclxuXHRcdFx0XCJhZGQgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRhcmdldFJlZyArIFwiLngsIFwiICsgdGFyZ2V0UmVnICsgXCIueVxcblwiICsgICAgICAgICAgLy8gZXhwICsgZjAqKDEgLSBleHApXHJcblx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLnlcXG5cIjtcclxuXHJcblx0XHRyZXR1cm4gY29kZTtcclxuXHR9XHJcblxyXG59XHJcblxyXG5leHBvcnQgPSBTcGVjdWxhckZyZXNuZWxNZXRob2Q7Il19