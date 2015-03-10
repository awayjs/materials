var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
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
    return ShadingMethodBase;
})(NamedAssetBase);
module.exports = ShadingMethodBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU2hhZGluZ01ldGhvZEJhc2UudHMiXSwibmFtZXMiOlsiU2hhZGluZ01ldGhvZEJhc2UiLCJTaGFkaW5nTWV0aG9kQmFzZS5jb25zdHJ1Y3RvciIsIlNoYWRpbmdNZXRob2RCYXNlLmlJc1VzZWQiLCJTaGFkaW5nTWV0aG9kQmFzZS5pSW5pdFZPIiwiU2hhZGluZ01ldGhvZEJhc2UuaUluaXRDb25zdGFudHMiLCJTaGFkaW5nTWV0aG9kQmFzZS5pVXNlc1RhbmdlbnRTcGFjZSIsIlNoYWRpbmdNZXRob2RCYXNlLmRpc3Bvc2UiLCJTaGFkaW5nTWV0aG9kQmFzZS5pUmVzZXQiLCJTaGFkaW5nTWV0aG9kQmFzZS5pQ2xlYW5Db21waWxhdGlvbkRhdGEiLCJTaGFkaW5nTWV0aG9kQmFzZS5pR2V0VmVydGV4Q29kZSIsIlNoYWRpbmdNZXRob2RCYXNlLmlHZXRGcmFnbWVudENvZGUiLCJTaGFkaW5nTWV0aG9kQmFzZS5pQWN0aXZhdGUiLCJTaGFkaW5nTWV0aG9kQmFzZS5pU2V0UmVuZGVyU3RhdGUiLCJTaGFkaW5nTWV0aG9kQmFzZS5pRGVhY3RpdmF0ZSIsIlNoYWRpbmdNZXRob2RCYXNlLmlJbnZhbGlkYXRlU2hhZGVyUHJvZ3JhbSIsIlNoYWRpbmdNZXRob2RCYXNlLmNvcHlGcm9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLGNBQWMsV0FBYyx3Q0FBd0MsQ0FBQyxDQUFDO0FBTzdFLElBQU8sa0JBQWtCLFdBQWEsaURBQWlELENBQUMsQ0FBQztBQVN6RixBQUlBOzs7R0FERztJQUNHLGlCQUFpQjtJQUFTQSxVQUExQkEsaUJBQWlCQSxVQUF1QkE7SUFFN0NBOztPQUVHQTtJQUNIQSxTQUxLQSxpQkFBaUJBO1FBT3JCQyxpQkFBT0EsQ0FBQ0E7SUFDVEEsQ0FBQ0E7SUFFTUQsbUNBQU9BLEdBQWRBLFVBQWVBLFlBQTZCQTtRQUUzQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDYkEsQ0FBQ0E7SUFFREY7Ozs7OztPQU1HQTtJQUNJQSxtQ0FBT0EsR0FBZEEsVUFBZUEsWUFBNkJBLEVBQUVBLFFBQWlCQTtJQUcvREcsQ0FBQ0E7SUFFREg7Ozs7OztPQU1HQTtJQUNJQSwwQ0FBY0EsR0FBckJBLFVBQXNCQSxZQUE2QkEsRUFBRUEsUUFBaUJBO0lBSXRFSSxDQUFDQTtJQUVESjs7T0FFR0E7SUFDSUEsNkNBQWlCQSxHQUF4QkE7UUFFQ0ssTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDYkEsQ0FBQ0E7SUFFREw7O09BRUdBO0lBQ0lBLG1DQUFPQSxHQUFkQTtJQUdBTSxDQUFDQTtJQUVETjs7OztPQUlHQTtJQUNJQSxrQ0FBTUEsR0FBYkE7UUFFQ08sSUFBSUEsQ0FBQ0EscUJBQXFCQSxFQUFFQSxDQUFDQTtJQUM5QkEsQ0FBQ0E7SUFFRFA7Ozs7T0FJR0E7SUFDSUEsaURBQXFCQSxHQUE1QkE7SUFFQVEsQ0FBQ0E7SUFFRFI7Ozs7OztPQU1HQTtJQUNJQSwwQ0FBY0EsR0FBckJBLFVBQXNCQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLGFBQWlDQSxFQUFFQSxlQUFrQ0E7UUFFNUlTLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO0lBQ1hBLENBQUNBO0lBRURUOztPQUVHQTtJQUNJQSw0Q0FBZ0JBLEdBQXZCQSxVQUF3QkEsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxTQUErQkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUUvS1UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDYkEsQ0FBQ0E7SUFFRFY7Ozs7Ozs7T0FPR0E7SUFDSUEscUNBQVNBLEdBQWhCQSxVQUFpQkEsWUFBNkJBLEVBQUVBLFFBQWlCQSxFQUFFQSxLQUFXQTtJQUc5RVcsQ0FBQ0E7SUFFRFg7Ozs7Ozs7OztPQVNHQTtJQUNJQSwyQ0FBZUEsR0FBdEJBLFVBQXVCQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLFVBQXlCQSxFQUFFQSxLQUFXQSxFQUFFQSxNQUFhQTtJQUc5SFksQ0FBQ0E7SUFFRFo7Ozs7OztPQU1HQTtJQUNJQSx1Q0FBV0EsR0FBbEJBLFVBQW1CQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLEtBQVdBO0lBR2hGYSxDQUFDQTtJQUVEYjs7OztPQUlHQTtJQUNJQSxvREFBd0JBLEdBQS9CQTtRQUVDYyxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxJQUFJQSxrQkFBa0JBLENBQUNBLGtCQUFrQkEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNuRkEsQ0FBQ0E7SUFFRGQ7O09BRUdBO0lBQ0lBLG9DQUFRQSxHQUFmQSxVQUFnQkEsTUFBd0JBO0lBRXhDZSxDQUFDQTtJQUNGZix3QkFBQ0E7QUFBREEsQ0F2SkEsQUF1SkNBLEVBdkorQixjQUFjLEVBdUo3QztBQUVELEFBQTJCLGlCQUFsQixpQkFBaUIsQ0FBQyIsImZpbGUiOiJtZXRob2RzL1NoYWRpbmdNZXRob2RCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBOYW1lZEFzc2V0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvTmFtZWRBc3NldEJhc2VcIik7XHJcblxyXG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcclxuXHJcbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xyXG5cclxuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9SZW5kZXJhYmxlQmFzZVwiKTtcclxuaW1wb3J0IFNoYWRpbmdNZXRob2RFdmVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9ldmVudHMvU2hhZGluZ01ldGhvZEV2ZW50XCIpO1xyXG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckNhY2hlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XHJcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xyXG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XHJcblxyXG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9kYXRhL01ldGhvZFZPXCIpO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBTaGFkaW5nTWV0aG9kQmFzZSBwcm92aWRlcyBhbiBhYnN0cmFjdCBiYXNlIG1ldGhvZCBmb3Igc2hhZGluZyBtZXRob2RzLCB1c2VkIGJ5IGNvbXBpbGVkIHBhc3NlcyB0byBjb21waWxlXHJcbiAqIHRoZSBmaW5hbCBzaGFkaW5nIHByb2dyYW0uXHJcbiAqL1xyXG5jbGFzcyBTaGFkaW5nTWV0aG9kQmFzZSBleHRlbmRzIE5hbWVkQXNzZXRCYXNlXHJcbntcclxuXHQvKipcclxuXHQgKiBDcmVhdGUgYSBuZXcgU2hhZGluZ01ldGhvZEJhc2Ugb2JqZWN0LlxyXG5cdCAqL1xyXG5cdGNvbnN0cnVjdG9yKClcclxuXHR7XHJcblx0XHRzdXBlcigpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGlJc1VzZWQoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cclxuXHR7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluaXRpYWxpemVzIHRoZSBwcm9wZXJ0aWVzIGZvciBhIE1ldGhvZFZPLCBpbmNsdWRpbmcgcmVnaXN0ZXIgYW5kIHRleHR1cmUgaW5kaWNlcy5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBtZXRob2RWTyBUaGUgTWV0aG9kVk8gb2JqZWN0IGxpbmtpbmcgdGhpcyBtZXRob2Qgd2l0aCB0aGUgcGFzcyBjdXJyZW50bHkgYmVpbmcgY29tcGlsZWQuXHJcblx0ICpcclxuXHQgKiBAaW50ZXJuYWxcclxuXHQgKi9cclxuXHRwdWJsaWMgaUluaXRWTyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8pXHJcblx0e1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluaXRpYWxpemVzIHVuY2hhbmdpbmcgc2hhZGVyIGNvbnN0YW50cyB1c2luZyB0aGUgZGF0YSBmcm9tIGEgTWV0aG9kVk8uXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gbWV0aG9kVk8gVGhlIE1ldGhvZFZPIG9iamVjdCBsaW5raW5nIHRoaXMgbWV0aG9kIHdpdGggdGhlIHBhc3MgY3VycmVudGx5IGJlaW5nIGNvbXBpbGVkLlxyXG5cdCAqXHJcblx0ICogQGludGVybmFsXHJcblx0ICovXHJcblx0cHVibGljIGlJbml0Q29uc3RhbnRzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTylcclxuXHR7XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGlzIG1ldGhvZCBleHBlY3RzIG5vcm1hbHMgaW4gdGFuZ2VudCBzcGFjZS4gT3ZlcnJpZGUgZm9yIG9iamVjdC1zcGFjZSBub3JtYWxzLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBpVXNlc1RhbmdlbnRTcGFjZSgpOmJvb2xlYW5cclxuXHR7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENsZWFucyB1cCBhbnkgcmVzb3VyY2VzIHVzZWQgYnkgdGhlIGN1cnJlbnQgb2JqZWN0LlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBkaXNwb3NlKClcclxuXHR7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmVzZXRzIHRoZSBjb21waWxhdGlvbiBzdGF0ZSBvZiB0aGUgbWV0aG9kLlxyXG5cdCAqXHJcblx0ICogQGludGVybmFsXHJcblx0ICovXHJcblx0cHVibGljIGlSZXNldCgpXHJcblx0e1xyXG5cdFx0dGhpcy5pQ2xlYW5Db21waWxhdGlvbkRhdGEoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlc2V0cyB0aGUgbWV0aG9kJ3Mgc3RhdGUgZm9yIGNvbXBpbGF0aW9uLlxyXG5cdCAqXHJcblx0ICogQGludGVybmFsXHJcblx0ICovXHJcblx0cHVibGljIGlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpXHJcblx0e1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogR2V0IHRoZSB2ZXJ0ZXggc2hhZGVyIGNvZGUgZm9yIHRoaXMgbWV0aG9kLlxyXG5cdCAqIEBwYXJhbSB2byBUaGUgTWV0aG9kVk8gb2JqZWN0IGxpbmtpbmcgdGhpcyBtZXRob2Qgd2l0aCB0aGUgcGFzcyBjdXJyZW50bHkgYmVpbmcgY29tcGlsZWQuXHJcblx0ICogQHBhcmFtIHJlZ0NhY2hlIFRoZSByZWdpc3RlciBjYWNoZSB1c2VkIGR1cmluZyB0aGUgY29tcGlsYXRpb24uXHJcblx0ICpcclxuXHQgKiBAaW50ZXJuYWxcclxuXHQgKi9cclxuXHRwdWJsaWMgaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiBcIlwiO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBTZXRzIHRoZSByZW5kZXIgc3RhdGUgZm9yIHRoaXMgbWV0aG9kLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIG1ldGhvZFZPIFRoZSBNZXRob2RWTyBvYmplY3QgbGlua2luZyB0aGlzIG1ldGhvZCB3aXRoIHRoZSBwYXNzIGN1cnJlbnRseSBiZWluZyBjb21waWxlZC5cclxuXHQgKiBAcGFyYW0gc3RhZ2UgVGhlIFN0YWdlIG9iamVjdCBjdXJyZW50bHkgdXNlZCBmb3IgcmVuZGVyaW5nLlxyXG5cdCAqXHJcblx0ICogQGludGVybmFsXHJcblx0ICovXHJcblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHN0YWdlOlN0YWdlKVxyXG5cdHtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBTZXRzIHRoZSByZW5kZXIgc3RhdGUgZm9yIGEgc2luZ2xlIHJlbmRlcmFibGUuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gdm8gVGhlIE1ldGhvZFZPIG9iamVjdCBsaW5raW5nIHRoaXMgbWV0aG9kIHdpdGggdGhlIHBhc3MgY3VycmVudGx5IGJlaW5nIGNvbXBpbGVkLlxyXG5cdCAqIEBwYXJhbSByZW5kZXJhYmxlIFRoZSByZW5kZXJhYmxlIGN1cnJlbnRseSBiZWluZyByZW5kZXJlZC5cclxuXHQgKiBAcGFyYW0gc3RhZ2UgVGhlIFN0YWdlIG9iamVjdCBjdXJyZW50bHkgdXNlZCBmb3IgcmVuZGVyaW5nLlxyXG5cdCAqIEBwYXJhbSBjYW1lcmEgVGhlIGNhbWVyYSBmcm9tIHdoaWNoIHRoZSBzY2VuZSBpcyBjdXJyZW50bHkgcmVuZGVyZWQuXHJcblx0ICpcclxuXHQgKiBAaW50ZXJuYWxcclxuXHQgKi9cclxuXHRwdWJsaWMgaVNldFJlbmRlclN0YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgcmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgc3RhZ2U6U3RhZ2UsIGNhbWVyYTpDYW1lcmEpXHJcblx0e1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENsZWFycyB0aGUgcmVuZGVyIHN0YXRlIGZvciB0aGlzIG1ldGhvZC5cclxuXHQgKiBAcGFyYW0gdm8gVGhlIE1ldGhvZFZPIG9iamVjdCBsaW5raW5nIHRoaXMgbWV0aG9kIHdpdGggdGhlIHBhc3MgY3VycmVudGx5IGJlaW5nIGNvbXBpbGVkLlxyXG5cdCAqIEBwYXJhbSBzdGFnZSBUaGUgU3RhZ2Ugb2JqZWN0IGN1cnJlbnRseSB1c2VkIGZvciByZW5kZXJpbmcuXHJcblx0ICpcclxuXHQgKiBAaW50ZXJuYWxcclxuXHQgKi9cclxuXHRwdWJsaWMgaURlYWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcclxuXHR7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogTWFya3MgdGhlIHNoYWRlciBwcm9ncmFtIGFzIGludmFsaWQsIHNvIGl0IHdpbGwgYmUgcmVjb21waWxlZCBiZWZvcmUgdGhlIG5leHQgcmVuZGVyLlxyXG5cdCAqXHJcblx0ICogQGludGVybmFsXHJcblx0ICovXHJcblx0cHVibGljIGlJbnZhbGlkYXRlU2hhZGVyUHJvZ3JhbSgpXHJcblx0e1xyXG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBTaGFkaW5nTWV0aG9kRXZlbnQoU2hhZGluZ01ldGhvZEV2ZW50LlNIQURFUl9JTlZBTElEQVRFRCkpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ29waWVzIHRoZSBzdGF0ZSBmcm9tIGEgU2hhZGluZ01ldGhvZEJhc2Ugb2JqZWN0IGludG8gdGhlIGN1cnJlbnQgb2JqZWN0LlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBjb3B5RnJvbShtZXRob2Q6U2hhZGluZ01ldGhvZEJhc2UpXHJcblx0e1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0ID0gU2hhZGluZ01ldGhvZEJhc2U7Il19