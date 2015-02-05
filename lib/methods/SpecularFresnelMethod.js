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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU3BlY3VsYXJGcmVzbmVsTWV0aG9kLnRzIl0sIm5hbWVzIjpbIlNwZWN1bGFyRnJlc25lbE1ldGhvZCIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5jb25zdHJ1Y3RvciIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5pSW5pdENvbnN0YW50cyIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5iYXNlZE9uU3VyZmFjZSIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5mcmVzbmVsUG93ZXIiLCJTcGVjdWxhckZyZXNuZWxNZXRob2QuaUNsZWFuQ29tcGlsYXRpb25EYXRhIiwiU3BlY3VsYXJGcmVzbmVsTWV0aG9kLm5vcm1hbFJlZmxlY3RhbmNlIiwiU3BlY3VsYXJGcmVzbmVsTWV0aG9kLmlBY3RpdmF0ZSIsIlNwZWN1bGFyRnJlc25lbE1ldGhvZC5pR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUiLCJTcGVjdWxhckZyZXNuZWxNZXRob2QubW9kdWxhdGVTcGVjdWxhciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBWUEsSUFBTyx1QkFBdUIsV0FBYSw0REFBNEQsQ0FBQyxDQUFDO0FBRXpHLEFBR0E7O0dBREc7SUFDRyxxQkFBcUI7SUFBU0EsVUFBOUJBLHFCQUFxQkEsVUFBZ0NBO0lBTzFEQTs7OztPQUlHQTtJQUNIQSxTQVpLQSxxQkFBcUJBLENBWWRBLGNBQTZCQSxFQUFFQSxVQUFxQ0E7UUFaakZDLGlCQXdJQ0E7UUE1SFlBLDhCQUE2QkEsR0FBN0JBLHFCQUE2QkE7UUFBRUEsMEJBQXFDQSxHQUFyQ0EsaUJBQXFDQTtRQUUvRUEsQUFDQUEsbUNBRG1DQTtRQUNuQ0Esa0JBQU1BLElBQUlBLEVBQUVBLFVBQVVBLENBQUNBLENBQUNBO1FBWGpCQSxrQkFBYUEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDekJBLHVCQUFrQkEsR0FBVUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EseUJBQXlCQTtRQVlsRUEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxVQUFDQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLFNBQStCQSxFQUFFQSxhQUFpQ0EsRUFBRUEsZUFBa0NBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsU0FBU0EsRUFBRUEsYUFBYUEsRUFBRUEsZUFBZUEsQ0FBQ0EsRUFBeEZBLENBQXdGQSxDQUFDQTtRQUUxUkEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsQ0FBQ0EsY0FBY0EsQ0FBQ0E7SUFDdkNBLENBQUNBO0lBRUREOztPQUVHQTtJQUNJQSw4Q0FBY0EsR0FBckJBLFVBQXNCQSxZQUE2QkEsRUFBRUEsUUFBaUJBO1FBR3JFRSxJQUFJQSxLQUFLQSxHQUFVQSxRQUFRQSxDQUFDQSwrQkFBK0JBLENBQUNBO1FBQzVEQSxZQUFZQSxDQUFDQSxvQkFBb0JBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ2pEQSxZQUFZQSxDQUFDQSxvQkFBb0JBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO0lBQ2xEQSxDQUFDQTtJQUtERixzQkFBV0EsaURBQWNBO1FBSHpCQTs7V0FFR0E7YUFDSEE7WUFFQ0csTUFBTUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0E7UUFDN0JBLENBQUNBO2FBRURILFVBQTBCQSxLQUFhQTtZQUV0Q0csRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsSUFBSUEsS0FBS0EsQ0FBQ0E7Z0JBQ2hDQSxNQUFNQSxDQUFDQTtZQUVSQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUU3QkEsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxFQUFFQSxDQUFDQTtRQUNqQ0EsQ0FBQ0E7OztPQVZBSDtJQWVEQSxzQkFBV0EsK0NBQVlBO1FBSHZCQTs7V0FFR0E7YUFDSEE7WUFFQ0ksTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFDM0JBLENBQUNBO2FBRURKLFVBQXdCQSxLQUFZQTtZQUVuQ0ksSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDNUJBLENBQUNBOzs7T0FMQUo7SUFPREE7O09BRUdBO0lBQ0lBLHFEQUFxQkEsR0FBNUJBO1FBRUNLLGdCQUFLQSxDQUFDQSxxQkFBcUJBLFdBQUVBLENBQUNBO1FBQzlCQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUN0QkEsQ0FBQ0E7SUFLREwsc0JBQVdBLG9EQUFpQkE7UUFINUJBOztXQUVHQTthQUNIQTtZQUVDTSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBO1FBQ2hDQSxDQUFDQTthQUVETixVQUE2QkEsS0FBWUE7WUFFeENNLElBQUlBLENBQUNBLGtCQUFrQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDakNBLENBQUNBOzs7T0FMQU47SUFPREE7O09BRUdBO0lBQ0lBLHlDQUFTQSxHQUFoQkEsVUFBaUJBLFlBQWlDQSxFQUFFQSxRQUFpQkEsRUFBRUEsS0FBV0E7UUFFakZPLGdCQUFLQSxDQUFDQSxTQUFTQSxZQUFDQSxZQUFZQSxFQUFFQSxRQUFRQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUUvQ0EsSUFBSUEsWUFBWUEsR0FBaUJBLFlBQVlBLENBQUNBLG9CQUFvQkEsQ0FBQ0E7UUFFbkVBLElBQUlBLEtBQUtBLEdBQVVBLFFBQVFBLENBQUNBLCtCQUErQkEsQ0FBQ0E7UUFDNURBLFlBQVlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0E7UUFDOUNBLFlBQVlBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO0lBQzlDQSxDQUFDQTtJQUVEUDs7T0FFR0E7SUFDSUEsMkRBQTJCQSxHQUFsQ0EsVUFBbUNBLFlBQWlDQSxFQUFFQSxRQUFpQkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUU3SlEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsYUFBYUEsQ0FBQ0EsdUJBQXVCQSxFQUFFQSxDQUFDQTtRQUV4REEsUUFBUUEsQ0FBQ0EsK0JBQStCQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxHQUFDQSxDQUFDQSxDQUFDQTtRQUVqRUEsTUFBTUEsQ0FBQ0EsZ0JBQUtBLENBQUNBLDJCQUEyQkEsWUFBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsYUFBYUEsRUFBRUEsZUFBZUEsQ0FBQ0EsQ0FBQ0E7SUFDbEdBLENBQUNBO0lBRURSOzs7Ozs7OztPQVFHQTtJQUNLQSxnREFBZ0JBLEdBQXhCQSxVQUF5QkEsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxTQUErQkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUVoTFMsSUFBSUEsSUFBV0EsQ0FBQ0E7UUFFaEJBLElBQUlBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLGVBQWVBLENBQUNBLGVBQWVBLEdBQUdBLFFBQVFBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLEdBQUVBLFNBQVNBLEdBQUdBLGVBQWVBLENBQUNBLGNBQWNBLENBQUNBLEdBQUdBLFFBQVFBLEdBQzdKQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUN6RUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsTUFBTUEsR0FDekVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQ3pFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUN6RUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsTUFBTUEsR0FDckVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLE1BQU1BLENBQUNBO1FBRXZFQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQUVGVCw0QkFBQ0E7QUFBREEsQ0F4SUEsQUF3SUNBLEVBeEltQyx1QkFBdUIsRUF3STFEO0FBRUQsQUFBK0IsaUJBQXRCLHFCQUFxQixDQUFDIiwiZmlsZSI6Im1ldGhvZHMvU3BlY3VsYXJGcmVzbmVsTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDYW1lcmFcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5cbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5cbmltcG9ydCBTaGFkZXJMaWdodGluZ09iamVjdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlckxpZ2h0aW5nT2JqZWN0XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5cbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvZGF0YS9NZXRob2RWT1wiKTtcbmltcG9ydCBTcGVjdWxhckJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL1NwZWN1bGFyQmFzaWNNZXRob2RcIik7XG5pbXBvcnQgU3BlY3VsYXJDb21wb3NpdGVNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL1NwZWN1bGFyQ29tcG9zaXRlTWV0aG9kXCIpO1xuXG4vKipcbiAqIFNwZWN1bGFyRnJlc25lbE1ldGhvZCBwcm92aWRlcyBhIHNwZWN1bGFyIHNoYWRpbmcgbWV0aG9kIHRoYXQgY2F1c2VzIHN0cm9uZ2VyIGhpZ2hsaWdodHMgb24gZ3JhemluZyB2aWV3IGFuZ2xlcy5cbiAqL1xuY2xhc3MgU3BlY3VsYXJGcmVzbmVsTWV0aG9kIGV4dGVuZHMgU3BlY3VsYXJDb21wb3NpdGVNZXRob2Rcbntcblx0cHJpdmF0ZSBfZGF0YVJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQ7XG5cdHByaXZhdGUgX2luY2lkZW50TGlnaHQ6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfZnJlc25lbFBvd2VyOm51bWJlciA9IDU7XG5cdHByaXZhdGUgX25vcm1hbFJlZmxlY3RhbmNlOm51bWJlciA9IC4wMjg7IC8vIGRlZmF1bHQgdmFsdWUgZm9yIHNraW5cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBTcGVjdWxhckZyZXNuZWxNZXRob2Qgb2JqZWN0LlxuXHQgKiBAcGFyYW0gYmFzZWRPblN1cmZhY2UgRGVmaW5lcyB3aGV0aGVyIHRoZSBmcmVzbmVsIGVmZmVjdCBzaG91bGQgYmUgYmFzZWQgb24gdGhlIHZpZXcgYW5nbGUgb24gdGhlIHN1cmZhY2UgKGlmIHRydWUpLCBvciBvbiB0aGUgYW5nbGUgYmV0d2VlbiB0aGUgbGlnaHQgYW5kIHRoZSB2aWV3LlxuXHQgKiBAcGFyYW0gYmFzZU1ldGhvZCBUaGUgc3BlY3VsYXIgbWV0aG9kIHRvIHdoaWNoIHRoZSBmcmVzbmVsIGVxdWF0aW9uLiBEZWZhdWx0cyB0byBTcGVjdWxhckJhc2ljTWV0aG9kLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoYmFzZWRPblN1cmZhY2U6Ym9vbGVhbiA9IHRydWUsIGJhc2VNZXRob2Q6U3BlY3VsYXJCYXNpY01ldGhvZCA9IG51bGwpXG5cdHtcblx0XHQvLyBtYXkgd2FudCB0byBvZmZlciBkaWZmIHNwZWN1bGFyc1xuXHRcdHN1cGVyKG51bGwsIGJhc2VNZXRob2QpO1xuXG5cdFx0dGhpcy5iYXNlTWV0aG9kLl9pTW9kdWxhdGVNZXRob2QgPSAoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpID0+IHRoaXMubW9kdWxhdGVTcGVjdWxhcihzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCB0YXJnZXRSZWcsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHR0aGlzLl9pbmNpZGVudExpZ2h0ID0gIWJhc2VkT25TdXJmYWNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cblx0XHR2YXIgaW5kZXg6bnVtYmVyID0gbWV0aG9kVk8uc2Vjb25kYXJ5RnJhZ21lbnRDb25zdGFudHNJbmRleDtcblx0XHRzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGFbaW5kZXggKyAyXSA9IDE7XG5cdFx0c2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhW2luZGV4ICsgM10gPSAwO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlZmluZXMgd2hldGhlciB0aGUgZnJlc25lbCBlZmZlY3Qgc2hvdWxkIGJlIGJhc2VkIG9uIHRoZSB2aWV3IGFuZ2xlIG9uIHRoZSBzdXJmYWNlIChpZiB0cnVlKSwgb3Igb24gdGhlIGFuZ2xlIGJldHdlZW4gdGhlIGxpZ2h0IGFuZCB0aGUgdmlldy5cblx0ICovXG5cdHB1YmxpYyBnZXQgYmFzZWRPblN1cmZhY2UoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gIXRoaXMuX2luY2lkZW50TGlnaHQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGJhc2VkT25TdXJmYWNlKHZhbHVlOmJvb2xlYW4pXG5cdHtcblx0XHRpZiAodGhpcy5faW5jaWRlbnRMaWdodCAhPSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2luY2lkZW50TGlnaHQgPSAhdmFsdWU7XG5cblx0XHR0aGlzLmlJbnZhbGlkYXRlU2hhZGVyUHJvZ3JhbSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBwb3dlciB1c2VkIGluIHRoZSBGcmVzbmVsIGVxdWF0aW9uLiBIaWdoZXIgdmFsdWVzIG1ha2UgdGhlIGZyZXNuZWwgZWZmZWN0IG1vcmUgcHJvbm91bmNlZC4gRGVmYXVsdHMgdG8gNS5cblx0ICovXG5cdHB1YmxpYyBnZXQgZnJlc25lbFBvd2VyKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZnJlc25lbFBvd2VyO1xuXHR9XG5cblx0cHVibGljIHNldCBmcmVzbmVsUG93ZXIodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fZnJlc25lbFBvd2VyID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpQ2xlYW5Db21waWxhdGlvbkRhdGEoKVxuXHR7XG5cdFx0c3VwZXIuaUNsZWFuQ29tcGlsYXRpb25EYXRhKCk7XG5cdFx0dGhpcy5fZGF0YVJlZyA9IG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1pbmltdW0gYW1vdW50IG9mIHJlZmxlY3RhbmNlLCBpZSB0aGUgcmVmbGVjdGFuY2Ugd2hlbiB0aGUgdmlldyBkaXJlY3Rpb24gaXMgbm9ybWFsIHRvIHRoZSBzdXJmYWNlIG9yIGxpZ2h0IGRpcmVjdGlvbi5cblx0ICovXG5cdHB1YmxpYyBnZXQgbm9ybWFsUmVmbGVjdGFuY2UoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9ub3JtYWxSZWZsZWN0YW5jZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgbm9ybWFsUmVmbGVjdGFuY2UodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fbm9ybWFsUmVmbGVjdGFuY2UgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcblx0e1xuXHRcdHN1cGVyLmlBY3RpdmF0ZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCBzdGFnZSk7XG5cblx0XHR2YXIgZnJhZ21lbnREYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XG5cblx0XHR2YXIgaW5kZXg6bnVtYmVyID0gbWV0aG9kVk8uc2Vjb25kYXJ5RnJhZ21lbnRDb25zdGFudHNJbmRleDtcblx0XHRmcmFnbWVudERhdGFbaW5kZXhdID0gdGhpcy5fbm9ybWFsUmVmbGVjdGFuY2U7XG5cdFx0ZnJhZ21lbnREYXRhW2luZGV4ICsgMV0gPSB0aGlzLl9mcmVzbmVsUG93ZXI7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRQcmVMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCBtZXRob2RWTzpNZXRob2RWTywgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHRoaXMuX2RhdGFSZWcgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XG5cblx0XHRtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4ID0gdGhpcy5fZGF0YVJlZy5pbmRleCo0O1xuXG5cdFx0cmV0dXJuIHN1cGVyLmlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgdGhlIGZyZXNuZWwgZWZmZWN0IHRvIHRoZSBzcGVjdWxhciBzdHJlbmd0aC5cblx0ICpcblx0ICogQHBhcmFtIHZvIFRoZSBNZXRob2RWTyBvYmplY3QgY29udGFpbmluZyB0aGUgbWV0aG9kIGRhdGEgZm9yIHRoZSBjdXJyZW50bHkgY29tcGlsZWQgbWF0ZXJpYWwgcGFzcy5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgcmVnaXN0ZXIgY29udGFpbmluZyB0aGUgc3BlY3VsYXIgc3RyZW5ndGggaW4gdGhlIFwid1wiIGNvbXBvbmVudCwgYW5kIHRoZSBoYWxmLXZlY3Rvci9yZWZsZWN0aW9uIHZlY3RvciBpbiBcInh5elwiLlxuXHQgKiBAcGFyYW0gcmVnQ2FjaGUgVGhlIHJlZ2lzdGVyIGNhY2hlIHVzZWQgZm9yIHRoZSBzaGFkZXIgY29tcGlsYXRpb24uXG5cdCAqIEBwYXJhbSBzaGFyZWRSZWdpc3RlcnMgVGhlIHNoYXJlZCByZWdpc3RlcnMgY3JlYXRlZCBieSB0aGUgY29tcGlsZXIuXG5cdCAqIEByZXR1cm4gVGhlIEFHQUwgZnJhZ21lbnQgY29kZSBmb3IgdGhlIG1ldGhvZC5cblx0ICovXG5cdHByaXZhdGUgbW9kdWxhdGVTcGVjdWxhcihzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmc7XG5cblx0XHRjb2RlID0gXCJkcDMgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHNoYXJlZFJlZ2lzdGVycy52aWV3RGlyRnJhZ21lbnQgKyBcIi54eXosIFwiICsgKHRoaXMuX2luY2lkZW50TGlnaHQ/IHRhcmdldFJlZyA6IHNoYXJlZFJlZ2lzdGVycy5ub3JtYWxGcmFnbWVudCkgKyBcIi54eXpcXG5cIiArICAgLy8gZG90KFYsIEgpXG5cdFx0XHRcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnosIFwiICsgdGFyZ2V0UmVnICsgXCIueVxcblwiICsgICAgICAgICAgICAgLy8gYmFzZSA9IDEtZG90KFYsIEgpXG5cdFx0XHRcInBvdyBcIiArIHRhcmdldFJlZyArIFwiLngsIFwiICsgdGFyZ2V0UmVnICsgXCIueSwgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueVxcblwiICsgICAgICAgICAgICAgLy8gZXhwID0gcG93KGJhc2UsIDUpXG5cdFx0XHRcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnosIFwiICsgdGFyZ2V0UmVnICsgXCIueVxcblwiICsgICAgICAgICAgICAgLy8gMSAtIGV4cFxuXHRcdFx0XCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi54LCBcIiArIHRhcmdldFJlZyArIFwiLnlcXG5cIiArICAgICAgICAgICAgIC8vIGYwKigxIC0gZXhwKVxuXHRcdFx0XCJhZGQgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRhcmdldFJlZyArIFwiLngsIFwiICsgdGFyZ2V0UmVnICsgXCIueVxcblwiICsgICAgICAgICAgLy8gZXhwICsgZjAqKDEgLSBleHApXG5cdFx0XHRcIm11bCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi55XFxuXCI7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG59XG5cbmV4cG9ydCA9IFNwZWN1bGFyRnJlc25lbE1ldGhvZDsiXX0=