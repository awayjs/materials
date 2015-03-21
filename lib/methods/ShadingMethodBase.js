var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetBase = require("awayjs-core/lib/library/AssetBase");
var ShadingMethodEvent = require("awayjs-renderergl/lib/events/ShadingMethodEvent");
/**
 * ShadingMethodBase provides an abstract base method for shading methods, used by compiled passes to compile
 * the final shading program.
 */
var ShadingMethodBase = (function (_super) {
    __extends(ShadingMethodBase, _super);
    /**
     * Create a new ShadingMethodBase object.
     */
    function ShadingMethodBase() {
        _super.call(this);
    }
    Object.defineProperty(ShadingMethodBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return ShadingMethodBase.assetType;
        },
        enumerable: true,
        configurable: true
    });
    ShadingMethodBase.prototype.iIsUsed = function (shaderObject) {
        return true;
    };
    /**
     * Initializes the properties for a MethodVO, including register and texture indices.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iInitVO = function (shaderObject, methodVO) {
    };
    /**
     * Initializes unchanging shader constants using the data from a MethodVO.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iInitConstants = function (shaderObject, methodVO) {
    };
    /**
     * Indicates whether or not this method expects normals in tangent space. Override for object-space normals.
     */
    ShadingMethodBase.prototype.iUsesTangentSpace = function () {
        return true;
    };
    /**
     * Cleans up any resources used by the current object.
     */
    ShadingMethodBase.prototype.dispose = function () {
    };
    /**
     * Resets the compilation state of the method.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iReset = function () {
        this.iCleanCompilationData();
    };
    /**
     * Resets the method's state for compilation.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iCleanCompilationData = function () {
    };
    /**
     * Get the vertex shader code for this method.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param regCache The register cache used during the compilation.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iGetVertexCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * @inheritDoc
     */
    ShadingMethodBase.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        return null;
    };
    /**
     * Sets the render state for this method.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     * @param stage The Stage object currently used for rendering.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iActivate = function (shaderObject, methodVO, stage) {
    };
    /**
     * Sets the render state for a single renderable.
     *
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param renderable The renderable currently being rendered.
     * @param stage The Stage object currently used for rendering.
     * @param camera The camera from which the scene is currently rendered.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
    };
    /**
     * Clears the render state for this method.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param stage The Stage object currently used for rendering.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iDeactivate = function (shaderObject, methodVO, stage) {
    };
    /**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     *
     * @internal
     */
    ShadingMethodBase.prototype.iInvalidateShaderProgram = function () {
        this.dispatchEvent(new ShadingMethodEvent(ShadingMethodEvent.SHADER_INVALIDATED));
    };
    /**
     * Copies the state from a ShadingMethodBase object into the current object.
     */
    ShadingMethodBase.prototype.copyFrom = function (method) {
    };
    ShadingMethodBase.assetType = "[asset ShadingMethod]";
    return ShadingMethodBase;
})(AssetBase);
module.exports = ShadingMethodBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU2hhZGluZ01ldGhvZEJhc2UudHMiXSwibmFtZXMiOlsiU2hhZGluZ01ldGhvZEJhc2UiLCJTaGFkaW5nTWV0aG9kQmFzZS5jb25zdHJ1Y3RvciIsIlNoYWRpbmdNZXRob2RCYXNlLmFzc2V0VHlwZSIsIlNoYWRpbmdNZXRob2RCYXNlLmlJc1VzZWQiLCJTaGFkaW5nTWV0aG9kQmFzZS5pSW5pdFZPIiwiU2hhZGluZ01ldGhvZEJhc2UuaUluaXRDb25zdGFudHMiLCJTaGFkaW5nTWV0aG9kQmFzZS5pVXNlc1RhbmdlbnRTcGFjZSIsIlNoYWRpbmdNZXRob2RCYXNlLmRpc3Bvc2UiLCJTaGFkaW5nTWV0aG9kQmFzZS5pUmVzZXQiLCJTaGFkaW5nTWV0aG9kQmFzZS5pQ2xlYW5Db21waWxhdGlvbkRhdGEiLCJTaGFkaW5nTWV0aG9kQmFzZS5pR2V0VmVydGV4Q29kZSIsIlNoYWRpbmdNZXRob2RCYXNlLmlHZXRGcmFnbWVudENvZGUiLCJTaGFkaW5nTWV0aG9kQmFzZS5pQWN0aXZhdGUiLCJTaGFkaW5nTWV0aG9kQmFzZS5pU2V0UmVuZGVyU3RhdGUiLCJTaGFkaW5nTWV0aG9kQmFzZS5pRGVhY3RpdmF0ZSIsIlNoYWRpbmdNZXRob2RCYXNlLmlJbnZhbGlkYXRlU2hhZGVyUHJvZ3JhbSIsIlNoYWRpbmdNZXRob2RCYXNlLmNvcHlGcm9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLFNBQVMsV0FBZSxtQ0FBbUMsQ0FBQyxDQUFDO0FBT3BFLElBQU8sa0JBQWtCLFdBQWEsaURBQWlELENBQUMsQ0FBQztBQVN6RixBQUlBOzs7R0FERztJQUNHLGlCQUFpQjtJQUFTQSxVQUExQkEsaUJBQWlCQSxVQUFrQkE7SUFZeENBOztPQUVHQTtJQUNIQSxTQWZLQSxpQkFBaUJBO1FBaUJyQkMsaUJBQU9BLENBQUNBO0lBQ1RBLENBQUNBO0lBWERELHNCQUFXQSx3Q0FBU0E7UUFIcEJBOztXQUVHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxpQkFBaUJBLENBQUNBLFNBQVNBLENBQUNBO1FBQ3BDQSxDQUFDQTs7O09BQUFGO0lBVU1BLG1DQUFPQSxHQUFkQSxVQUFlQSxZQUE2QkE7UUFFM0NHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBRURIOzs7Ozs7T0FNR0E7SUFDSUEsbUNBQU9BLEdBQWRBLFVBQWVBLFlBQTZCQSxFQUFFQSxRQUFpQkE7SUFHL0RJLENBQUNBO0lBRURKOzs7Ozs7T0FNR0E7SUFDSUEsMENBQWNBLEdBQXJCQSxVQUFzQkEsWUFBNkJBLEVBQUVBLFFBQWlCQTtJQUl0RUssQ0FBQ0E7SUFFREw7O09BRUdBO0lBQ0lBLDZDQUFpQkEsR0FBeEJBO1FBRUNNLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBRUROOztPQUVHQTtJQUNJQSxtQ0FBT0EsR0FBZEE7SUFHQU8sQ0FBQ0E7SUFFRFA7Ozs7T0FJR0E7SUFDSUEsa0NBQU1BLEdBQWJBO1FBRUNRLElBQUlBLENBQUNBLHFCQUFxQkEsRUFBRUEsQ0FBQ0E7SUFDOUJBLENBQUNBO0lBRURSOzs7O09BSUdBO0lBQ0lBLGlEQUFxQkEsR0FBNUJBO0lBRUFTLENBQUNBO0lBRURUOzs7Ozs7T0FNR0E7SUFDSUEsMENBQWNBLEdBQXJCQSxVQUFzQkEsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxhQUFpQ0EsRUFBRUEsZUFBa0NBO1FBRTVJVSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQTtJQUNYQSxDQUFDQTtJQUVEVjs7T0FFR0E7SUFDSUEsNENBQWdCQSxHQUF2QkEsVUFBd0JBLFlBQTZCQSxFQUFFQSxRQUFpQkEsRUFBRUEsU0FBK0JBLEVBQUVBLGFBQWlDQSxFQUFFQSxlQUFrQ0E7UUFFL0tXLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBRURYOzs7Ozs7O09BT0dBO0lBQ0lBLHFDQUFTQSxHQUFoQkEsVUFBaUJBLFlBQTZCQSxFQUFFQSxRQUFpQkEsRUFBRUEsS0FBV0E7SUFHOUVZLENBQUNBO0lBRURaOzs7Ozs7Ozs7T0FTR0E7SUFDSUEsMkNBQWVBLEdBQXRCQSxVQUF1QkEsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxVQUF5QkEsRUFBRUEsS0FBV0EsRUFBRUEsTUFBYUE7SUFHOUhhLENBQUNBO0lBRURiOzs7Ozs7T0FNR0E7SUFDSUEsdUNBQVdBLEdBQWxCQSxVQUFtQkEsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxLQUFXQTtJQUdoRmMsQ0FBQ0E7SUFFRGQ7Ozs7T0FJR0E7SUFDSUEsb0RBQXdCQSxHQUEvQkE7UUFFQ2UsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsSUFBSUEsa0JBQWtCQSxDQUFDQSxrQkFBa0JBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDbkZBLENBQUNBO0lBRURmOztPQUVHQTtJQUNJQSxvQ0FBUUEsR0FBZkEsVUFBZ0JBLE1BQXdCQTtJQUV4Q2dCLENBQUNBO0lBOUphaEIsMkJBQVNBLEdBQVVBLHVCQUF1QkEsQ0FBQ0E7SUErSjFEQSx3QkFBQ0E7QUFBREEsQ0FqS0EsQUFpS0NBLEVBaksrQixTQUFTLEVBaUt4QztBQUVELEFBQTJCLGlCQUFsQixpQkFBaUIsQ0FBQyIsImZpbGUiOiJtZXRob2RzL1NoYWRpbmdNZXRob2RCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBc3NldEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvQXNzZXRCYXNlXCIpO1xuXG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5cbmltcG9ydCBSZW5kZXJhYmxlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XG5pbXBvcnQgU2hhZGluZ01ldGhvZEV2ZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2V2ZW50cy9TaGFkaW5nTWV0aG9kRXZlbnRcIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5cbmltcG9ydCBNZXRob2RWT1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL2RhdGEvTWV0aG9kVk9cIik7XG5cblxuLyoqXG4gKiBTaGFkaW5nTWV0aG9kQmFzZSBwcm92aWRlcyBhbiBhYnN0cmFjdCBiYXNlIG1ldGhvZCBmb3Igc2hhZGluZyBtZXRob2RzLCB1c2VkIGJ5IGNvbXBpbGVkIHBhc3NlcyB0byBjb21waWxlXG4gKiB0aGUgZmluYWwgc2hhZGluZyBwcm9ncmFtLlxuICovXG5jbGFzcyBTaGFkaW5nTWV0aG9kQmFzZSBleHRlbmRzIEFzc2V0QmFzZVxue1xuXHRwdWJsaWMgc3RhdGljIGFzc2V0VHlwZTpzdHJpbmcgPSBcIlthc3NldCBTaGFkaW5nTWV0aG9kXVwiO1xuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldCBhc3NldFR5cGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBTaGFkaW5nTWV0aG9kQmFzZS5hc3NldFR5cGU7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IFNoYWRpbmdNZXRob2RCYXNlIG9iamVjdC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHRwdWJsaWMgaUlzVXNlZChzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZXMgdGhlIHByb3BlcnRpZXMgZm9yIGEgTWV0aG9kVk8sIGluY2x1ZGluZyByZWdpc3RlciBhbmQgdGV4dHVyZSBpbmRpY2VzLlxuXHQgKlxuXHQgKiBAcGFyYW0gbWV0aG9kVk8gVGhlIE1ldGhvZFZPIG9iamVjdCBsaW5raW5nIHRoaXMgbWV0aG9kIHdpdGggdGhlIHBhc3MgY3VycmVudGx5IGJlaW5nIGNvbXBpbGVkLlxuXHQgKlxuXHQgKiBAaW50ZXJuYWxcblx0ICovXG5cdHB1YmxpYyBpSW5pdFZPKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcblx0e1xuXG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZXMgdW5jaGFuZ2luZyBzaGFkZXIgY29uc3RhbnRzIHVzaW5nIHRoZSBkYXRhIGZyb20gYSBNZXRob2RWTy5cblx0ICpcblx0ICogQHBhcmFtIG1ldGhvZFZPIFRoZSBNZXRob2RWTyBvYmplY3QgbGlua2luZyB0aGlzIG1ldGhvZCB3aXRoIHRoZSBwYXNzIGN1cnJlbnRseSBiZWluZyBjb21waWxlZC5cblx0ICpcblx0ICogQGludGVybmFsXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cblxuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGlzIG1ldGhvZCBleHBlY3RzIG5vcm1hbHMgaW4gdGFuZ2VudCBzcGFjZS4gT3ZlcnJpZGUgZm9yIG9iamVjdC1zcGFjZSBub3JtYWxzLlxuXHQgKi9cblx0cHVibGljIGlVc2VzVGFuZ2VudFNwYWNlKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogQ2xlYW5zIHVwIGFueSByZXNvdXJjZXMgdXNlZCBieSB0aGUgY3VycmVudCBvYmplY3QuXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJlc2V0cyB0aGUgY29tcGlsYXRpb24gc3RhdGUgb2YgdGhlIG1ldGhvZC5cblx0ICpcblx0ICogQGludGVybmFsXG5cdCAqL1xuXHRwdWJsaWMgaVJlc2V0KClcblx0e1xuXHRcdHRoaXMuaUNsZWFuQ29tcGlsYXRpb25EYXRhKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVzZXRzIHRoZSBtZXRob2QncyBzdGF0ZSBmb3IgY29tcGlsYXRpb24uXG5cdCAqXG5cdCAqIEBpbnRlcm5hbFxuXHQgKi9cblx0cHVibGljIGlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpXG5cdHtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIHZlcnRleCBzaGFkZXIgY29kZSBmb3IgdGhpcyBtZXRob2QuXG5cdCAqIEBwYXJhbSB2byBUaGUgTWV0aG9kVk8gb2JqZWN0IGxpbmtpbmcgdGhpcyBtZXRob2Qgd2l0aCB0aGUgcGFzcyBjdXJyZW50bHkgYmVpbmcgY29tcGlsZWQuXG5cdCAqIEBwYXJhbSByZWdDYWNoZSBUaGUgcmVnaXN0ZXIgY2FjaGUgdXNlZCBkdXJpbmcgdGhlIGNvbXBpbGF0aW9uLlxuXHQgKlxuXHQgKiBAaW50ZXJuYWxcblx0ICovXG5cdHB1YmxpYyBpR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgcmVuZGVyIHN0YXRlIGZvciB0aGlzIG1ldGhvZC5cblx0ICpcblx0ICogQHBhcmFtIG1ldGhvZFZPIFRoZSBNZXRob2RWTyBvYmplY3QgbGlua2luZyB0aGlzIG1ldGhvZCB3aXRoIHRoZSBwYXNzIGN1cnJlbnRseSBiZWluZyBjb21waWxlZC5cblx0ICogQHBhcmFtIHN0YWdlIFRoZSBTdGFnZSBvYmplY3QgY3VycmVudGx5IHVzZWQgZm9yIHJlbmRlcmluZy5cblx0ICpcblx0ICogQGludGVybmFsXG5cdCAqL1xuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXG5cdHtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIHJlbmRlciBzdGF0ZSBmb3IgYSBzaW5nbGUgcmVuZGVyYWJsZS5cblx0ICpcblx0ICogQHBhcmFtIHZvIFRoZSBNZXRob2RWTyBvYmplY3QgbGlua2luZyB0aGlzIG1ldGhvZCB3aXRoIHRoZSBwYXNzIGN1cnJlbnRseSBiZWluZyBjb21waWxlZC5cblx0ICogQHBhcmFtIHJlbmRlcmFibGUgVGhlIHJlbmRlcmFibGUgY3VycmVudGx5IGJlaW5nIHJlbmRlcmVkLlxuXHQgKiBAcGFyYW0gc3RhZ2UgVGhlIFN0YWdlIG9iamVjdCBjdXJyZW50bHkgdXNlZCBmb3IgcmVuZGVyaW5nLlxuXHQgKiBAcGFyYW0gY2FtZXJhIFRoZSBjYW1lcmEgZnJvbSB3aGljaCB0aGUgc2NlbmUgaXMgY3VycmVudGx5IHJlbmRlcmVkLlxuXHQgKlxuXHQgKiBAaW50ZXJuYWxcblx0ICovXG5cdHB1YmxpYyBpU2V0UmVuZGVyU3RhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCByZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBzdGFnZTpTdGFnZSwgY2FtZXJhOkNhbWVyYSlcblx0e1xuXG5cdH1cblxuXHQvKipcblx0ICogQ2xlYXJzIHRoZSByZW5kZXIgc3RhdGUgZm9yIHRoaXMgbWV0aG9kLlxuXHQgKiBAcGFyYW0gdm8gVGhlIE1ldGhvZFZPIG9iamVjdCBsaW5raW5nIHRoaXMgbWV0aG9kIHdpdGggdGhlIHBhc3MgY3VycmVudGx5IGJlaW5nIGNvbXBpbGVkLlxuXHQgKiBAcGFyYW0gc3RhZ2UgVGhlIFN0YWdlIG9iamVjdCBjdXJyZW50bHkgdXNlZCBmb3IgcmVuZGVyaW5nLlxuXHQgKlxuXHQgKiBAaW50ZXJuYWxcblx0ICovXG5cdHB1YmxpYyBpRGVhY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxuXHR7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBNYXJrcyB0aGUgc2hhZGVyIHByb2dyYW0gYXMgaW52YWxpZCwgc28gaXQgd2lsbCBiZSByZWNvbXBpbGVkIGJlZm9yZSB0aGUgbmV4dCByZW5kZXIuXG5cdCAqXG5cdCAqIEBpbnRlcm5hbFxuXHQgKi9cblx0cHVibGljIGlJbnZhbGlkYXRlU2hhZGVyUHJvZ3JhbSgpXG5cdHtcblx0XHR0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFNoYWRpbmdNZXRob2RFdmVudChTaGFkaW5nTWV0aG9kRXZlbnQuU0hBREVSX0lOVkFMSURBVEVEKSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29waWVzIHRoZSBzdGF0ZSBmcm9tIGEgU2hhZGluZ01ldGhvZEJhc2Ugb2JqZWN0IGludG8gdGhlIGN1cnJlbnQgb2JqZWN0LlxuXHQgKi9cblx0cHVibGljIGNvcHlGcm9tKG1ldGhvZDpTaGFkaW5nTWV0aG9kQmFzZSlcblx0e1xuXHR9XG59XG5cbmV4cG9ydCA9IFNoYWRpbmdNZXRob2RCYXNlOyJdfQ==