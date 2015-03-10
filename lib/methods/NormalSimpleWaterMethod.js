var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var NormalBasicMethod = require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
/**
 * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
 */
var NormalSimpleWaterMethod = (function (_super) {
    __extends(NormalSimpleWaterMethod, _super);
    /**
     * Creates a new NormalSimpleWaterMethod object.
     * @param waveMap1 A normal map containing one layer of a wave structure.
     * @param waveMap2 A normal map containing a second layer of a wave structure.
     */
    function NormalSimpleWaterMethod(waveMap1, waveMap2) {
        _super.call(this);
        this._useSecondNormalMap = false;
        this._water1OffsetX = 0;
        this._water1OffsetY = 0;
        this._water2OffsetX = 0;
        this._water2OffsetY = 0;
        this.normalMap = waveMap1;
        this.secondaryNormalMap = waveMap2;
    }
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        var index = methodVO.fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = .5;
        data[index + 1] = 0;
        data[index + 2] = 0;
        data[index + 3] = 1;
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iInitVO = function (shaderObject, methodVO) {
        _super.prototype.iInitVO.call(this, shaderObject, methodVO);
        this._useSecondNormalMap = this.normalMap != this.secondaryNormalMap;
    };
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water1OffsetX", {
        /**
         * The translation of the first wave layer along the X-axis.
         */
        get: function () {
            return this._water1OffsetX;
        },
        set: function (value) {
            this._water1OffsetX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water1OffsetY", {
        /**
         * The translation of the first wave layer along the Y-axis.
         */
        get: function () {
            return this._water1OffsetY;
        },
        set: function (value) {
            this._water1OffsetY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water2OffsetX", {
        /**
         * The translation of the second wave layer along the X-axis.
         */
        get: function () {
            return this._water2OffsetX;
        },
        set: function (value) {
            this._water2OffsetX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "water2OffsetY", {
        /**
         * The translation of the second wave layer along the Y-axis.
         */
        get: function () {
            return this._water2OffsetY;
        },
        set: function (value) {
            this._water2OffsetY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NormalSimpleWaterMethod.prototype, "secondaryNormalMap", {
        /**
         * A second normal map that will be combined with the first to create a wave-like animation pattern.
         */
        get: function () {
            return this._texture2;
        },
        set: function (value) {
            this._texture2 = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._normalTextureRegister2 = null;
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._texture2 = null;
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex;
        data[index + 4] = this._water1OffsetX;
        data[index + 5] = this._water1OffsetY;
        data[index + 6] = this._water2OffsetX;
        data[index + 7] = this._water2OffsetY;
        //if (this._useSecondNormalMap >= 0)
        if (this._useSecondNormalMap)
            stage.activateTexture(methodVO.texturesIndex + 1, this._texture2, shaderObject.repeatTextures, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
    };
    /**
     * @inheritDoc
     */
    NormalSimpleWaterMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var temp = registerCache.getFreeFragmentVectorTemp();
        var dataReg = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        this._pNormalTextureRegister = registerCache.getFreeTextureReg();
        this._normalTextureRegister2 = this._useSecondNormalMap ? registerCache.getFreeTextureReg() : this._pNormalTextureRegister;
        methodVO.texturesIndex = this._pNormalTextureRegister.index;
        methodVO.fragmentConstantsIndex = dataReg.index * 4;
        return "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".xyxy\n" + ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedRegisters, this._pNormalTextureRegister, this.normalMap, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp) + "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".zwzw\n" + ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, this._normalTextureRegister2, this._texture2, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp) + "add " + targetReg + ", " + targetReg + ", " + temp + "		\n" + "mul " + targetReg + ", " + targetReg + ", " + dataReg + ".x	\n" + "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx	\n" + "nrm " + targetReg + ".xyz, " + targetReg + ".xyz							\n";
    };
    return NormalSimpleWaterMethod;
})(NormalBasicMethod);
module.exports = NormalSimpleWaterMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QudHMiXSwibmFtZXMiOlsiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5jb25zdHJ1Y3RvciIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmlJbml0Q29uc3RhbnRzIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuaUluaXRWTyIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLndhdGVyMU9mZnNldFgiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC53YXRlcjFPZmZzZXRZIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2Qud2F0ZXIyT2Zmc2V0WCIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLndhdGVyMk9mZnNldFkiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5zZWNvbmRhcnlOb3JtYWxNYXAiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5pQ2xlYW5Db21waWxhdGlvbkRhdGEiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5kaXNwb3NlIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuaUFjdGl2YXRlIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuaUdldEZyYWdtZW50Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUEsSUFBTyxvQkFBb0IsV0FBYyxrREFBa0QsQ0FBQyxDQUFDO0FBRzdGLElBQU8saUJBQWlCLFdBQWMsc0RBQXNELENBQUMsQ0FBQztBQUU5RixBQUdBOztHQURHO0lBQ0csdUJBQXVCO0lBQVNBLFVBQWhDQSx1QkFBdUJBLFVBQTBCQTtJQVV0REE7Ozs7T0FJR0E7SUFDSEEsU0FmS0EsdUJBQXVCQSxDQWVoQkEsUUFBc0JBLEVBQUVBLFFBQXNCQTtRQUV6REMsaUJBQU9BLENBQUNBO1FBYkRBLHdCQUFtQkEsR0FBV0EsS0FBS0EsQ0FBQ0E7UUFDcENBLG1CQUFjQSxHQUFVQSxDQUFDQSxD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QkEsRUFBRUEsWUFBWUEsQ0FBQ0EsY0FBY0EsRUFBRUEsWUFBWUEsQ0FBQ0EsYUFBYUEsRUFBRUEsSUFBSUEsQ0FBQ0EsR0FDaE5BLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQzlFQSxvQkFBb0JBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsSUFBSUEsRUFBRUEsZUFBZUEsRUFBRUEsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxZQUFZQSxDQUFDQSxpQkFBaUJBLEVBQUVBLFlBQVlBLENBQUNBLGNBQWNBLEVBQUVBLFlBQVlBLENBQUNBLGFBQWFBLEVBQUVBLElBQUlBLENBQUNBLEdBQzNNQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUM1REEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsT0FBT0EsR0FBR0EsT0FBT0EsR0FDaEVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLGVBQWVBLENBQUNBLE9BQU9BLEdBQUdBLFNBQVNBLEdBQzFGQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxlQUFlQSxDQUFDQTtJQUM5REEsQ0FBQ0E7SUFDRlosOEJBQUNBO0FBQURBLENBM0tBLEFBMktDQSxFQTNLcUMsaUJBQWlCLEVBMkt0RDtBQUVELEFBQWlDLGlCQUF4Qix1QkFBdUIsQ0FBQyIsImZpbGUiOiJtZXRob2RzL05vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xyXG5cclxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcclxuXHJcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xyXG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xyXG5pbXBvcnQgU2hhZGVyQ29tcGlsZXJIZWxwZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcclxuXHJcbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvZGF0YS9NZXRob2RWT1wiKTtcclxuaW1wb3J0IE5vcm1hbEJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL05vcm1hbEJhc2ljTWV0aG9kXCIpO1xyXG5cclxuLyoqXHJcbiAqIE5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kIHByb3ZpZGVzIGEgYmFzaWMgbm9ybWFsIG1hcCBtZXRob2QgdG8gY3JlYXRlIHdhdGVyIHJpcHBsZXMgYnkgdHJhbnNsYXRpbmcgdHdvIHdhdmUgbm9ybWFsIG1hcHMuXHJcbiAqL1xyXG5jbGFzcyBOb3JtYWxTaW1wbGVXYXRlck1ldGhvZCBleHRlbmRzIE5vcm1hbEJhc2ljTWV0aG9kXHJcbntcclxuXHRwcml2YXRlIF90ZXh0dXJlMjpUZXh0dXJlMkRCYXNlO1xyXG5cdHByaXZhdGUgX25vcm1hbFRleHR1cmVSZWdpc3RlcjI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50O1xyXG5cdHByaXZhdGUgX3VzZVNlY29uZE5vcm1hbE1hcDpib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfd2F0ZXIxT2Zmc2V0WDpudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX3dhdGVyMU9mZnNldFk6bnVtYmVyID0gMDtcclxuXHRwcml2YXRlIF93YXRlcjJPZmZzZXRYOm51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfd2F0ZXIyT2Zmc2V0WTpudW1iZXIgPSAwO1xyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGVzIGEgbmV3IE5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kIG9iamVjdC5cclxuXHQgKiBAcGFyYW0gd2F2ZU1hcDEgQSBub3JtYWwgbWFwIGNvbnRhaW5pbmcgb25lIGxheWVyIG9mIGEgd2F2ZSBzdHJ1Y3R1cmUuXHJcblx0ICogQHBhcmFtIHdhdmVNYXAyIEEgbm9ybWFsIG1hcCBjb250YWluaW5nIGEgc2Vjb25kIGxheWVyIG9mIGEgd2F2ZSBzdHJ1Y3R1cmUuXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3Iod2F2ZU1hcDE6VGV4dHVyZTJEQmFzZSwgd2F2ZU1hcDI6VGV4dHVyZTJEQmFzZSlcclxuXHR7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5ub3JtYWxNYXAgPSB3YXZlTWFwMTtcclxuXHRcdHRoaXMuc2Vjb25kYXJ5Tm9ybWFsTWFwID0gd2F2ZU1hcDI7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpSW5pdENvbnN0YW50cyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXHJcblx0e1xyXG5cdFx0dmFyIGluZGV4Om51bWJlciA9IG1ldGhvZFZPLmZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XHJcblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xyXG5cdFx0ZGF0YVtpbmRleF0gPSAuNTtcclxuXHRcdGRhdGFbaW5kZXggKyAxXSA9IDA7XHJcblx0XHRkYXRhW2luZGV4ICsgMl0gPSAwO1xyXG5cdFx0ZGF0YVtpbmRleCArIDNdID0gMTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGlJbml0Vk8oc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxyXG5cdHtcclxuXHRcdHN1cGVyLmlJbml0Vk8oc2hhZGVyT2JqZWN0LCBtZXRob2RWTyk7XHJcblxyXG5cdFx0dGhpcy5fdXNlU2Vjb25kTm9ybWFsTWFwID0gdGhpcy5ub3JtYWxNYXAgIT0gdGhpcy5zZWNvbmRhcnlOb3JtYWxNYXA7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgdHJhbnNsYXRpb24gb2YgdGhlIGZpcnN0IHdhdmUgbGF5ZXIgYWxvbmcgdGhlIFgtYXhpcy5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IHdhdGVyMU9mZnNldFgoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fd2F0ZXIxT2Zmc2V0WDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgd2F0ZXIxT2Zmc2V0WCh2YWx1ZTpudW1iZXIpXHJcblx0e1xyXG5cdFx0dGhpcy5fd2F0ZXIxT2Zmc2V0WCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIHRyYW5zbGF0aW9uIG9mIHRoZSBmaXJzdCB3YXZlIGxheWVyIGFsb25nIHRoZSBZLWF4aXMuXHJcblx0ICovXHJcblx0cHVibGljIGdldCB3YXRlcjFPZmZzZXRZKCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3dhdGVyMU9mZnNldFk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHdhdGVyMU9mZnNldFkodmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX3dhdGVyMU9mZnNldFkgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSB0cmFuc2xhdGlvbiBvZiB0aGUgc2Vjb25kIHdhdmUgbGF5ZXIgYWxvbmcgdGhlIFgtYXhpcy5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IHdhdGVyMk9mZnNldFgoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fd2F0ZXIyT2Zmc2V0WDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgd2F0ZXIyT2Zmc2V0WCh2YWx1ZTpudW1iZXIpXHJcblx0e1xyXG5cdFx0dGhpcy5fd2F0ZXIyT2Zmc2V0WCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIHRyYW5zbGF0aW9uIG9mIHRoZSBzZWNvbmQgd2F2ZSBsYXllciBhbG9uZyB0aGUgWS1heGlzLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgd2F0ZXIyT2Zmc2V0WSgpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl93YXRlcjJPZmZzZXRZO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB3YXRlcjJPZmZzZXRZKHZhbHVlOm51bWJlcilcclxuXHR7XHJcblx0XHR0aGlzLl93YXRlcjJPZmZzZXRZID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBBIHNlY29uZCBub3JtYWwgbWFwIHRoYXQgd2lsbCBiZSBjb21iaW5lZCB3aXRoIHRoZSBmaXJzdCB0byBjcmVhdGUgYSB3YXZlLWxpa2UgYW5pbWF0aW9uIHBhdHRlcm4uXHJcblx0ICovXHJcblx0cHVibGljIGdldCBzZWNvbmRhcnlOb3JtYWxNYXAoKTpUZXh0dXJlMkRCYXNlXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3RleHR1cmUyO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBzZWNvbmRhcnlOb3JtYWxNYXAodmFsdWU6VGV4dHVyZTJEQmFzZSlcclxuXHR7XHJcblx0XHR0aGlzLl90ZXh0dXJlMiA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgaUNsZWFuQ29tcGlsYXRpb25EYXRhKClcclxuXHR7XHJcblx0XHRzdXBlci5pQ2xlYW5Db21waWxhdGlvbkRhdGEoKTtcclxuXHRcdHRoaXMuX25vcm1hbFRleHR1cmVSZWdpc3RlcjIgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgZGlzcG9zZSgpXHJcblx0e1xyXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xyXG5cdFx0dGhpcy5fdGV4dHVyZTIgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXHJcblx0e1xyXG5cdFx0c3VwZXIuaUFjdGl2YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHN0YWdlKTtcclxuXHJcblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xyXG5cdFx0dmFyIGluZGV4Om51bWJlciA9IG1ldGhvZFZPLmZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XHJcblxyXG5cdFx0ZGF0YVtpbmRleCArIDRdID0gdGhpcy5fd2F0ZXIxT2Zmc2V0WDtcclxuXHRcdGRhdGFbaW5kZXggKyA1XSA9IHRoaXMuX3dhdGVyMU9mZnNldFk7XHJcblx0XHRkYXRhW2luZGV4ICsgNl0gPSB0aGlzLl93YXRlcjJPZmZzZXRYO1xyXG5cdFx0ZGF0YVtpbmRleCArIDddID0gdGhpcy5fd2F0ZXIyT2Zmc2V0WTtcclxuXHJcblx0XHQvL2lmICh0aGlzLl91c2VTZWNvbmROb3JtYWxNYXAgPj0gMClcclxuXHRcdGlmICh0aGlzLl91c2VTZWNvbmROb3JtYWxNYXApXHJcblx0XHRcdHN0YWdlLmFjdGl2YXRlVGV4dHVyZShtZXRob2RWTy50ZXh0dXJlc0luZGV4ICsgMSwgdGhpcy5fdGV4dHVyZTIsIHNoYWRlck9iamVjdC5yZXBlYXRUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZVNtb290aFRleHR1cmVzLCBzaGFkZXJPYmplY3QudXNlTWlwbWFwcGluZyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBpR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcclxuXHR7XHJcblx0XHR2YXIgdGVtcDpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudFZlY3RvclRlbXAoKTtcclxuXHRcdHZhciBkYXRhUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcclxuXHRcdHZhciBkYXRhUmVnMjpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XHJcblx0XHR0aGlzLl9wTm9ybWFsVGV4dHVyZVJlZ2lzdGVyID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpO1xyXG5cdFx0dGhpcy5fbm9ybWFsVGV4dHVyZVJlZ2lzdGVyMiA9IHRoaXMuX3VzZVNlY29uZE5vcm1hbE1hcD8gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpOnRoaXMuX3BOb3JtYWxUZXh0dXJlUmVnaXN0ZXI7XHJcblx0XHRtZXRob2RWTy50ZXh0dXJlc0luZGV4ID0gdGhpcy5fcE5vcm1hbFRleHR1cmVSZWdpc3Rlci5pbmRleDtcclxuXHJcblx0XHRtZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4ID0gZGF0YVJlZy5pbmRleCo0O1xyXG5cclxuXHRcdHJldHVybiBcImFkZCBcIiArIHRlbXAgKyBcIiwgXCIgKyBzaGFyZWRSZWdpc3RlcnMudXZWYXJ5aW5nICsgXCIsIFwiICsgZGF0YVJlZzIgKyBcIi54eXh5XFxuXCIgK1xyXG5cdFx0XHRTaGFkZXJDb21waWxlckhlbHBlci5nZXRUZXgyRFNhbXBsZUNvZGUodGFyZ2V0UmVnLCBzaGFyZWRSZWdpc3RlcnMsIHRoaXMuX3BOb3JtYWxUZXh0dXJlUmVnaXN0ZXIsIHRoaXMubm9ybWFsTWFwLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXMsIHNoYWRlck9iamVjdC5yZXBlYXRUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcsIHRlbXApICtcclxuXHRcdFx0XCJhZGQgXCIgKyB0ZW1wICsgXCIsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnV2VmFyeWluZyArIFwiLCBcIiArIGRhdGFSZWcyICsgXCIuend6d1xcblwiICtcclxuXHRcdFx0U2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4MkRTYW1wbGVDb2RlKHRlbXAsIHNoYXJlZFJlZ2lzdGVycywgdGhpcy5fbm9ybWFsVGV4dHVyZVJlZ2lzdGVyMiwgdGhpcy5fdGV4dHVyZTIsIHNoYWRlck9iamVjdC51c2VTbW9vdGhUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnJlcGVhdFRleHR1cmVzLCBzaGFkZXJPYmplY3QudXNlTWlwbWFwcGluZywgdGVtcCkgK1xyXG5cdFx0XHRcImFkZCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRhcmdldFJlZyArIFwiLCBcIiArIHRlbXAgKyBcIlx0XHRcXG5cIiArXHJcblx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgZGF0YVJlZyArIFwiLnhcdFxcblwiICtcclxuXHRcdFx0XCJzdWIgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHNoYXJlZFJlZ2lzdGVycy5jb21tb25zICsgXCIueHh4XHRcXG5cIiArXHJcblx0XHRcdFwibnJtIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiLnh5elx0XHRcdFx0XHRcdFx0XFxuXCI7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgPSBOb3JtYWxTaW1wbGVXYXRlck1ldGhvZDsiXX0=