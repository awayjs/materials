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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QudHMiXSwibmFtZXMiOlsiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5jb25zdHJ1Y3RvciIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmlJbml0Q29uc3RhbnRzIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuaUluaXRWTyIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLndhdGVyMU9mZnNldFgiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC53YXRlcjFPZmZzZXRZIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2Qud2F0ZXIyT2Zmc2V0WCIsIk5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLndhdGVyMk9mZnNldFkiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5zZWNvbmRhcnlOb3JtYWxNYXAiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5pQ2xlYW5Db21waWxhdGlvbkRhdGEiLCJOb3JtYWxTaW1wbGVXYXRlck1ldGhvZC5kaXNwb3NlIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuaUFjdGl2YXRlIiwiTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QuaUdldEZyYWdtZW50Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUEsSUFBTyxvQkFBb0IsV0FBYyxrREFBa0QsQ0FBQyxDQUFDO0FBRzdGLElBQU8saUJBQWlCLFdBQWMsc0RBQXNELENBQUMsQ0FBQztBQUU5RixBQUdBOztHQURHO0lBQ0csdUJBQXVCO0lBQVNBLFVBQWhDQSx1QkFBdUJBLFVBQTBCQTtJQVV0REE7Ozs7T0FJR0E7SUFDSEEsU0FmS0EsdUJBQXVCQSxDQWVoQkEsUUFBc0JBLEVBQUVBLFFBQXNCQTtRQUV6REMsaUJBQU9BLENBQUNBO1FBYkRBLHdCQUFtQkEsR0FBV0EsS0FBS0EsQ0FBQ0E7UUFDcENBLG1CQUFjQSxHQUFVQSxDQUFDQSxD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QkEsRUFBRUEsWUFBWUEsQ0FBQ0EsY0FBY0EsRUFBRUEsWUFBWUEsQ0FBQ0EsYUFBYUEsRUFBRUEsSUFBSUEsQ0FBQ0EsR0FDaE5BLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQzlFQSxvQkFBb0JBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsSUFBSUEsRUFBRUEsZUFBZUEsRUFBRUEsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxZQUFZQSxDQUFDQSxpQkFBaUJBLEVBQUVBLFlBQVlBLENBQUNBLGNBQWNBLEVBQUVBLFlBQVlBLENBQUNBLGFBQWFBLEVBQUVBLElBQUlBLENBQUNBLEdBQzNNQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUM1REEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsT0FBT0EsR0FBR0EsT0FBT0EsR0FDaEVBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLEdBQUdBLGVBQWVBLENBQUNBLE9BQU9BLEdBQUdBLFNBQVNBLEdBQzFGQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxTQUFTQSxHQUFHQSxlQUFlQSxDQUFDQTtJQUM5REEsQ0FBQ0E7SUFDRlosOEJBQUNBO0FBQURBLENBM0tBLEFBMktDQSxFQTNLcUMsaUJBQWlCLEVBMkt0RDtBQUVELEFBQWlDLGlCQUF4Qix1QkFBdUIsQ0FBQyIsImZpbGUiOiJtZXRob2RzL05vcm1hbFNpbXBsZVdhdGVyTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckNhY2hlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcbmltcG9ydCBTaGFkZXJDb21waWxlckhlbHBlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3V0aWxzL1NoYWRlckNvbXBpbGVySGVscGVyXCIpO1xuXG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL2RhdGEvTWV0aG9kVk9cIik7XG5pbXBvcnQgTm9ybWFsQmFzaWNNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvTm9ybWFsQmFzaWNNZXRob2RcIik7XG5cbi8qKlxuICogTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QgcHJvdmlkZXMgYSBiYXNpYyBub3JtYWwgbWFwIG1ldGhvZCB0byBjcmVhdGUgd2F0ZXIgcmlwcGxlcyBieSB0cmFuc2xhdGluZyB0d28gd2F2ZSBub3JtYWwgbWFwcy5cbiAqL1xuY2xhc3MgTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QgZXh0ZW5kcyBOb3JtYWxCYXNpY01ldGhvZFxue1xuXHRwcml2YXRlIF90ZXh0dXJlMjpUZXh0dXJlMkRCYXNlO1xuXHRwcml2YXRlIF9ub3JtYWxUZXh0dXJlUmVnaXN0ZXIyOlNoYWRlclJlZ2lzdGVyRWxlbWVudDtcblx0cHJpdmF0ZSBfdXNlU2Vjb25kTm9ybWFsTWFwOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJpdmF0ZSBfd2F0ZXIxT2Zmc2V0WDpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF93YXRlcjFPZmZzZXRZOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX3dhdGVyMk9mZnNldFg6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfd2F0ZXIyT2Zmc2V0WTpudW1iZXIgPSAwO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IE5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kIG9iamVjdC5cblx0ICogQHBhcmFtIHdhdmVNYXAxIEEgbm9ybWFsIG1hcCBjb250YWluaW5nIG9uZSBsYXllciBvZiBhIHdhdmUgc3RydWN0dXJlLlxuXHQgKiBAcGFyYW0gd2F2ZU1hcDIgQSBub3JtYWwgbWFwIGNvbnRhaW5pbmcgYSBzZWNvbmQgbGF5ZXIgb2YgYSB3YXZlIHN0cnVjdHVyZS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHdhdmVNYXAxOlRleHR1cmUyREJhc2UsIHdhdmVNYXAyOlRleHR1cmUyREJhc2UpXG5cdHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMubm9ybWFsTWFwID0gd2F2ZU1hcDE7XG5cdFx0dGhpcy5zZWNvbmRhcnlOb3JtYWxNYXAgPSB3YXZlTWFwMjtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlJbml0Q29uc3RhbnRzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXHRcdHZhciBpbmRleDpudW1iZXIgPSBtZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4O1xuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XG5cdFx0ZGF0YVtpbmRleF0gPSAuNTtcblx0XHRkYXRhW2luZGV4ICsgMV0gPSAwO1xuXHRcdGRhdGFbaW5kZXggKyAyXSA9IDA7XG5cdFx0ZGF0YVtpbmRleCArIDNdID0gMTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlJbml0Vk8oc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cdFx0c3VwZXIuaUluaXRWTyhzaGFkZXJPYmplY3QsIG1ldGhvZFZPKTtcblxuXHRcdHRoaXMuX3VzZVNlY29uZE5vcm1hbE1hcCA9IHRoaXMubm9ybWFsTWFwICE9IHRoaXMuc2Vjb25kYXJ5Tm9ybWFsTWFwO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0cmFuc2xhdGlvbiBvZiB0aGUgZmlyc3Qgd2F2ZSBsYXllciBhbG9uZyB0aGUgWC1heGlzLlxuXHQgKi9cblx0cHVibGljIGdldCB3YXRlcjFPZmZzZXRYKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fd2F0ZXIxT2Zmc2V0WDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgd2F0ZXIxT2Zmc2V0WCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl93YXRlcjFPZmZzZXRYID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRyYW5zbGF0aW9uIG9mIHRoZSBmaXJzdCB3YXZlIGxheWVyIGFsb25nIHRoZSBZLWF4aXMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHdhdGVyMU9mZnNldFkoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl93YXRlcjFPZmZzZXRZO1xuXHR9XG5cblx0cHVibGljIHNldCB3YXRlcjFPZmZzZXRZKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3dhdGVyMU9mZnNldFkgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdHJhbnNsYXRpb24gb2YgdGhlIHNlY29uZCB3YXZlIGxheWVyIGFsb25nIHRoZSBYLWF4aXMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHdhdGVyMk9mZnNldFgoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl93YXRlcjJPZmZzZXRYO1xuXHR9XG5cblx0cHVibGljIHNldCB3YXRlcjJPZmZzZXRYKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3dhdGVyMk9mZnNldFggPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdHJhbnNsYXRpb24gb2YgdGhlIHNlY29uZCB3YXZlIGxheWVyIGFsb25nIHRoZSBZLWF4aXMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHdhdGVyMk9mZnNldFkoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl93YXRlcjJPZmZzZXRZO1xuXHR9XG5cblx0cHVibGljIHNldCB3YXRlcjJPZmZzZXRZKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3dhdGVyMk9mZnNldFkgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIHNlY29uZCBub3JtYWwgbWFwIHRoYXQgd2lsbCBiZSBjb21iaW5lZCB3aXRoIHRoZSBmaXJzdCB0byBjcmVhdGUgYSB3YXZlLWxpa2UgYW5pbWF0aW9uIHBhdHRlcm4uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNlY29uZGFyeU5vcm1hbE1hcCgpOlRleHR1cmUyREJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl90ZXh0dXJlMjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc2Vjb25kYXJ5Tm9ybWFsTWFwKHZhbHVlOlRleHR1cmUyREJhc2UpXG5cdHtcblx0XHR0aGlzLl90ZXh0dXJlMiA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUNsZWFuQ29tcGlsYXRpb25EYXRhKClcblx0e1xuXHRcdHN1cGVyLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpO1xuXHRcdHRoaXMuX25vcm1hbFRleHR1cmVSZWdpc3RlcjIgPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHRzdXBlci5kaXNwb3NlKCk7XG5cdFx0dGhpcy5fdGV4dHVyZTIgPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHRzdXBlci5pQWN0aXZhdGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgc3RhZ2UpO1xuXG5cdFx0dmFyIGRhdGE6QXJyYXk8bnVtYmVyPiA9IHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YTtcblx0XHR2YXIgaW5kZXg6bnVtYmVyID0gbWV0aG9kVk8uZnJhZ21lbnRDb25zdGFudHNJbmRleDtcblxuXHRcdGRhdGFbaW5kZXggKyA0XSA9IHRoaXMuX3dhdGVyMU9mZnNldFg7XG5cdFx0ZGF0YVtpbmRleCArIDVdID0gdGhpcy5fd2F0ZXIxT2Zmc2V0WTtcblx0XHRkYXRhW2luZGV4ICsgNl0gPSB0aGlzLl93YXRlcjJPZmZzZXRYO1xuXHRcdGRhdGFbaW5kZXggKyA3XSA9IHRoaXMuX3dhdGVyMk9mZnNldFk7XG5cblx0XHQvL2lmICh0aGlzLl91c2VTZWNvbmROb3JtYWxNYXAgPj0gMClcblx0XHRpZiAodGhpcy5fdXNlU2Vjb25kTm9ybWFsTWFwKVxuXHRcdFx0c3RhZ2UuYWN0aXZhdGVUZXh0dXJlKG1ldGhvZFZPLnRleHR1cmVzSW5kZXggKyAxLCB0aGlzLl90ZXh0dXJlMiwgc2hhZGVyT2JqZWN0LnJlcGVhdFRleHR1cmVzLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXMsIHNoYWRlck9iamVjdC51c2VNaXBtYXBwaW5nKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIHRlbXA6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wKCk7XG5cdFx0dmFyIGRhdGFSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXHRcdHZhciBkYXRhUmVnMjpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XG5cdFx0dGhpcy5fcE5vcm1hbFRleHR1cmVSZWdpc3RlciA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVRleHR1cmVSZWcoKTtcblx0XHR0aGlzLl9ub3JtYWxUZXh0dXJlUmVnaXN0ZXIyID0gdGhpcy5fdXNlU2Vjb25kTm9ybWFsTWFwPyByZWdpc3RlckNhY2hlLmdldEZyZWVUZXh0dXJlUmVnKCk6dGhpcy5fcE5vcm1hbFRleHR1cmVSZWdpc3Rlcjtcblx0XHRtZXRob2RWTy50ZXh0dXJlc0luZGV4ID0gdGhpcy5fcE5vcm1hbFRleHR1cmVSZWdpc3Rlci5pbmRleDtcblxuXHRcdG1ldGhvZFZPLmZyYWdtZW50Q29uc3RhbnRzSW5kZXggPSBkYXRhUmVnLmluZGV4KjQ7XG5cblx0XHRyZXR1cm4gXCJhZGQgXCIgKyB0ZW1wICsgXCIsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnV2VmFyeWluZyArIFwiLCBcIiArIGRhdGFSZWcyICsgXCIueHl4eVxcblwiICtcblx0XHRcdFNoYWRlckNvbXBpbGVySGVscGVyLmdldFRleDJEU2FtcGxlQ29kZSh0YXJnZXRSZWcsIHNoYXJlZFJlZ2lzdGVycywgdGhpcy5fcE5vcm1hbFRleHR1cmVSZWdpc3RlciwgdGhpcy5ub3JtYWxNYXAsIHNoYWRlck9iamVjdC51c2VTbW9vdGhUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnJlcGVhdFRleHR1cmVzLCBzaGFkZXJPYmplY3QudXNlTWlwbWFwcGluZywgdGVtcCkgK1xuXHRcdFx0XCJhZGQgXCIgKyB0ZW1wICsgXCIsIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnV2VmFyeWluZyArIFwiLCBcIiArIGRhdGFSZWcyICsgXCIuend6d1xcblwiICtcblx0XHRcdFNoYWRlckNvbXBpbGVySGVscGVyLmdldFRleDJEU2FtcGxlQ29kZSh0ZW1wLCBzaGFyZWRSZWdpc3RlcnMsIHRoaXMuX25vcm1hbFRleHR1cmVSZWdpc3RlcjIsIHRoaXMuX3RleHR1cmUyLCBzaGFkZXJPYmplY3QudXNlU21vb3RoVGV4dHVyZXMsIHNoYWRlck9iamVjdC5yZXBlYXRUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmcsIHRlbXApICtcblx0XHRcdFwiYWRkIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGVtcCArIFwiXHRcdFxcblwiICtcblx0XHRcdFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgZGF0YVJlZyArIFwiLnhcdFxcblwiICtcblx0XHRcdFwic3ViIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6LCBcIiArIHRhcmdldFJlZyArIFwiLnh5eiwgXCIgKyBzaGFyZWRSZWdpc3RlcnMuY29tbW9ucyArIFwiLnh4eFx0XFxuXCIgK1xuXHRcdFx0XCJucm0gXCIgKyB0YXJnZXRSZWcgKyBcIi54eXosIFwiICsgdGFyZ2V0UmVnICsgXCIueHl6XHRcdFx0XHRcdFx0XHRcXG5cIjtcblx0fVxufVxuXG5leHBvcnQgPSBOb3JtYWxTaW1wbGVXYXRlck1ldGhvZDsiXX0=