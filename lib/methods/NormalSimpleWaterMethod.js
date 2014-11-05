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
            stage.activateTexture(methodVO.texturesIndex + 1, this._texture2);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QudHMiXSwibmFtZXMiOlsiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5jb25zdHJ1Y3RvciIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmlJbml0Q29uc3RhbnRzIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuaUluaXRWTyIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLndhdGVyMU9mZnNldFgiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC53YXRlcjFPZmZzZXRZIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2Qud2F0ZXIyT2Zmc2V0WCIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLndhdGVyMk9mZnNldFkiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5zZWNvbmRhcnlOb3JtYWxNYXAiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5pQ2xlYW5Db21waWxhdGlvbkRhdGEiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5kaXNwb3NlIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuaUFjdGl2YXRlIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuaUdldEZyYWdtZW50Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUEsSUFBTyxvQkFBb0IsV0FBYyxrREFBa0QsQ0FBQyxDQUFDO0FBRzdGLElBQU8saUJBQWlCLFdBQWMsc0RBQXNELENBQUMsQ0FBQztBQUU5RixBQUdBOztHQURHO0lBQ0csdUJBQXVCO0lBQVNBLFVBQWhDQSx1QkFBdUJBLFVBQTBCQTtJQVV0REE7Ozs7T0FJR0E7SUFDSEEsU0FmS0EsdUJBQXVCQSxDQWVoQkEsUUFBc0JBLEVBQUVBLFFBQXNCQTtRQUV6REMsaUJBQU9BLENBQUNBO1FBYkRBLHdCQUFtQkEsR0FBV0EsS0FBS0EsQ0FBQ0E7UUFDcENBLG1CQUFjQSxHQUFVQSxDQUFDQSxD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QSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUM5RUEsb0JBQW9CQSxDQUFDQSxrQkFBa0JBLENBQUNBLElBQUlBLEVBQUVBLGVBQWVBLEVBQUVBLElBQUlBLENBQUNBLHVCQUF1QkEsRUFBRUEsSUFBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsWUFBWUEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxZQUFZQSxDQUFDQSxjQUFjQSxFQUFFQSxZQUFZQSxDQUFDQSxhQUFhQSxFQUFFQSxJQUFJQSxDQUFDQSxHQUMzTUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FDNURBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLE9BQU9BLEdBQUdBLE9BQU9BLEdBQ2hFQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxlQUFlQSxDQUFDQSxPQUFPQSxHQUFHQSxTQUFTQSxHQUMxRkEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsUUFBUUEsR0FBR0EsU0FBU0EsR0FBR0EsZUFBZUEsQ0FBQ0E7SUFDOURBLENBQUNBO0lBQ0ZaLDhCQUFDQTtBQUFEQSxDQTNLQSxBQTJLQ0EsRUEzS3FDLGlCQUFpQixFQTJLdEQ7QUFFRCxBQUFpQyxpQkFBeEIsdUJBQXVCLENBQUMiLCJmaWxlIjoibWV0aG9kcy9Ob3JtYWxTaW1wbGVXYXRlck1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcblxuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgU2hhZGVyQ29tcGlsZXJIZWxwZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcblxuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9kYXRhL01ldGhvZFZPXCIpO1xuaW1wb3J0IE5vcm1hbEJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9tZXRob2RzL05vcm1hbEJhc2ljTWV0aG9kXCIpO1xuXG4vKipcbiAqIE5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kIHByb3ZpZGVzIGEgYmFzaWMgbm9ybWFsIG1hcCBtZXRob2QgdG8gY3JlYXRlIHdhdGVyIHJpcHBsZXMgYnkgdHJhbnNsYXRpbmcgdHdvIHdhdmUgbm9ybWFsIG1hcHMuXG4gKi9cbmNsYXNzIE5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kIGV4dGVuZHMgTm9ybWFsQmFzaWNNZXRob2Rcbntcblx0cHJpdmF0ZSBfdGV4dHVyZTI6VGV4dHVyZTJEQmFzZTtcblx0cHJpdmF0ZSBfbm9ybWFsVGV4dHVyZVJlZ2lzdGVyMjpTaGFkZXJSZWdpc3RlckVsZW1lbnQ7XG5cdHByaXZhdGUgX3VzZVNlY29uZE5vcm1hbE1hcDpib29sZWFuID0gZmFsc2U7XG5cdHByaXZhdGUgX3dhdGVyMU9mZnNldFg6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfd2F0ZXIxT2Zmc2V0WTpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF93YXRlcjJPZmZzZXRYOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX3dhdGVyMk9mZnNldFk6bnVtYmVyID0gMDtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBOb3JtYWxTaW1wbGVXYXRlck1ldGhvZCBvYmplY3QuXG5cdCAqIEBwYXJhbSB3YXZlTWFwMSBBIG5vcm1hbCBtYXAgY29udGFpbmluZyBvbmUgbGF5ZXIgb2YgYSB3YXZlIHN0cnVjdHVyZS5cblx0ICogQHBhcmFtIHdhdmVNYXAyIEEgbm9ybWFsIG1hcCBjb250YWluaW5nIGEgc2Vjb25kIGxheWVyIG9mIGEgd2F2ZSBzdHJ1Y3R1cmUuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih3YXZlTWFwMTpUZXh0dXJlMkRCYXNlLCB3YXZlTWFwMjpUZXh0dXJlMkRCYXNlKVxuXHR7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLm5vcm1hbE1hcCA9IHdhdmVNYXAxO1xuXHRcdHRoaXMuc2Vjb25kYXJ5Tm9ybWFsTWFwID0gd2F2ZU1hcDI7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpSW5pdENvbnN0YW50cyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXG5cdHtcblx0XHR2YXIgaW5kZXg6bnVtYmVyID0gbWV0aG9kVk8uZnJhZ21lbnRDb25zdGFudHNJbmRleDtcblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xuXHRcdGRhdGFbaW5kZXhdID0gLjU7XG5cdFx0ZGF0YVtpbmRleCArIDFdID0gMDtcblx0XHRkYXRhW2luZGV4ICsgMl0gPSAwO1xuXHRcdGRhdGFbaW5kZXggKyAzXSA9IDE7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpSW5pdFZPKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXHRcdHN1cGVyLmlJbml0Vk8oc2hhZGVyT2JqZWN0LCBtZXRob2RWTyk7XG5cblx0XHR0aGlzLl91c2VTZWNvbmROb3JtYWxNYXAgPSB0aGlzLm5vcm1hbE1hcCAhPSB0aGlzLnNlY29uZGFyeU5vcm1hbE1hcDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdHJhbnNsYXRpb24gb2YgdGhlIGZpcnN0IHdhdmUgbGF5ZXIgYWxvbmcgdGhlIFgtYXhpcy5cblx0ICovXG5cdHB1YmxpYyBnZXQgd2F0ZXIxT2Zmc2V0WCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3dhdGVyMU9mZnNldFg7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHdhdGVyMU9mZnNldFgodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fd2F0ZXIxT2Zmc2V0WCA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0cmFuc2xhdGlvbiBvZiB0aGUgZmlyc3Qgd2F2ZSBsYXllciBhbG9uZyB0aGUgWS1heGlzLlxuXHQgKi9cblx0cHVibGljIGdldCB3YXRlcjFPZmZzZXRZKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fd2F0ZXIxT2Zmc2V0WTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgd2F0ZXIxT2Zmc2V0WSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl93YXRlcjFPZmZzZXRZID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRyYW5zbGF0aW9uIG9mIHRoZSBzZWNvbmQgd2F2ZSBsYXllciBhbG9uZyB0aGUgWC1heGlzLlxuXHQgKi9cblx0cHVibGljIGdldCB3YXRlcjJPZmZzZXRYKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fd2F0ZXIyT2Zmc2V0WDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgd2F0ZXIyT2Zmc2V0WCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl93YXRlcjJPZmZzZXRYID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRyYW5zbGF0aW9uIG9mIHRoZSBzZWNvbmQgd2F2ZSBsYXllciBhbG9uZyB0aGUgWS1heGlzLlxuXHQgKi9cblx0cHVibGljIGdldCB3YXRlcjJPZmZzZXRZKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fd2F0ZXIyT2Zmc2V0WTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgd2F0ZXIyT2Zmc2V0WSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl93YXRlcjJPZmZzZXRZID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQSBzZWNvbmQgbm9ybWFsIG1hcCB0aGF0IHdpbGwgYmUgY29tYmluZWQgd2l0aCB0aGUgZmlyc3QgdG8gY3JlYXRlIGEgd2F2ZS1saWtlIGFuaW1hdGlvbiBwYXR0ZXJuLlxuXHQgKi9cblx0cHVibGljIGdldCBzZWNvbmRhcnlOb3JtYWxNYXAoKTpUZXh0dXJlMkRCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdGV4dHVyZTI7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHNlY29uZGFyeU5vcm1hbE1hcCh2YWx1ZTpUZXh0dXJlMkRCYXNlKVxuXHR7XG5cdFx0dGhpcy5fdGV4dHVyZTIgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpXG5cdHtcblx0XHRzdXBlci5pQ2xlYW5Db21waWxhdGlvbkRhdGEoKTtcblx0XHR0aGlzLl9ub3JtYWxUZXh0dXJlUmVnaXN0ZXIyID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xuXHRcdHRoaXMuX3RleHR1cmUyID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0c3VwZXIuaUFjdGl2YXRlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHN0YWdlKTtcblxuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XG5cdFx0dmFyIGluZGV4Om51bWJlciA9IG1ldGhvZFZPLmZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XG5cblx0XHRkYXRhW2luZGV4ICsgNF0gPSB0aGlzLl93YXRlcjFPZmZzZXRYO1xuXHRcdGRhdGFbaW5kZXggKyA1XSA9IHRoaXMuX3dhdGVyMU9mZnNldFk7XG5cdFx0ZGF0YVtpbmRleCArIDZdID0gdGhpcy5fd2F0ZXIyT2Zmc2V0WDtcblx0XHRkYXRhW2luZGV4ICsgN10gPSB0aGlzLl93YXRlcjJPZmZzZXRZO1xuXG5cdFx0Ly9pZiAodGhpcy5fdXNlU2Vjb25kTm9ybWFsTWFwID49IDApXG5cdFx0aWYgKHRoaXMuX3VzZVNlY29uZE5vcm1hbE1hcClcblx0XHRcdHN0YWdlLmFjdGl2YXRlVGV4dHVyZShtZXRob2RWTy50ZXh0dXJlc0luZGV4ICsgMSwgdGhpcy5fdGV4dHVyZTIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgdGVtcDpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudFZlY3RvclRlbXAoKTtcblx0XHR2YXIgZGF0YVJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XG5cdFx0dmFyIGRhdGFSZWcyOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblx0XHR0aGlzLl9wTm9ybWFsVGV4dHVyZVJlZ2lzdGVyID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpO1xuXHRcdHRoaXMuX25vcm1hbFRleHR1cmVSZWdpc3RlcjIgPSB0aGlzLl91c2VTZWNvbmROb3JtYWxNYXA/IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVRleHR1cmVSZWcoKTp0aGlzLl9wTm9ybWFsVGV4dHVyZVJlZ2lzdGVyO1xuXHRcdG1ldGhvZFZPLnRleHR1cmVzSW5kZXggPSB0aGlzLl9wTm9ybWFsVGV4dHVyZVJlZ2lzdGVyLmluZGV4O1xuXG5cdFx0bWV0aG9kVk8uZnJhZ21lbnRDb25zdGFudHNJbmRleCA9IGRhdGFSZWcuaW5kZXgqNDtcblxuXHRcdHJldHVybiBcImFkZCBcIiArIHRlbXAgKyBcIiwgXCIgKyBzaGFyZWRSZWdpc3RlcnMudXZWYXJ5aW5nICsgXCIsIFwiICsgZGF0YVJlZzIgKyBcIi54eXh5XFxuXCIgK1xuXHRcdFx0U2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4MkRTYW1wbGVDb2RlKHRhcmdldFJlZywgc2hhcmVkUmVnaXN0ZXJzLCB0aGlzLl9wTm9ybWFsVGV4dHVyZVJlZ2lzdGVyLCB0aGlzLm5vcm1hbE1hcCwgc2hhZGVyT2JqZWN0LnVzZVNtb290aFRleHR1cmVzLCBzaGFkZXJPYmplY3QucmVwZWF0VGV4dHVyZXMsIHNoYWRlck9iamVjdC51c2VNaXBtYXBwaW5nLCB0ZW1wKSArXG5cdFx0XHRcImFkZCBcIiArIHRlbXAgKyBcIiwgXCIgKyBzaGFyZWRSZWdpc3RlcnMudXZWYXJ5aW5nICsgXCIsIFwiICsgZGF0YVJlZzIgKyBcIi56d3p3XFxuXCIgK1xuXHRcdFx0U2hhZGVyQ29tcGlsZXJIZWxwZXIuZ2V0VGV4MkRTYW1wbGVDb2RlKHRlbXAsIHNoYXJlZFJlZ2lzdGVycywgdGhpcy5fbm9ybWFsVGV4dHVyZVJlZ2lzdGVyMiwgdGhpcy5fdGV4dHVyZTIsIHNoYWRlck9iamVjdC51c2VTbW9vdGhUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnJlcGVhdFRleHR1cmVzLCBzaGFkZXJPYmplY3QudXNlTWlwbWFwcGluZywgdGVtcCkgK1xuXHRcdFx0XCJhZGQgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB0ZW1wICsgXCJcdFx0XFxuXCIgK1xuXHRcdFx0XCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyBkYXRhUmVnICsgXCIueFx0XFxuXCIgK1xuXHRcdFx0XCJzdWIgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHNoYXJlZFJlZ2lzdGVycy5jb21tb25zICsgXCIueHh4XHRcXG5cIiArXG5cdFx0XHRcIm5ybSBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyB0YXJnZXRSZWcgKyBcIi54eXpcdFx0XHRcdFx0XHRcdFxcblwiO1xuXHR9XG59XG5cbmV4cG9ydCA9IE5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kOyJdfQ==