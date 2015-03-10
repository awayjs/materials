var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShadingMethodBase = require("awayjs-methodmaterials/lib/methods/ShadingMethodBase");
/**
 * ShadowMapMethodBase provides an abstract base method for shadow map methods.
 */
var ShadowMapMethodBase = (function (_super) {
    __extends(ShadowMapMethodBase, _super);
    /**
     * Creates a new ShadowMapMethodBase object.
     * @param castingLight The light used to cast shadows.
     */
    function ShadowMapMethodBase(castingLight) {
        _super.call(this);
        this._pEpsilon = .02;
        this._pAlpha = 1;
        this._pCastingLight = castingLight;
        castingLight.castsShadows = true;
        this._pShadowMapper = castingLight.shadowMapper;
    }
    Object.defineProperty(ShadowMapMethodBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return ShadowMapMethodBase.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowMapMethodBase.prototype, "alpha", {
        /**
         * The "transparency" of the shadows. This allows making shadows less strong.
         */
        get: function () {
            return this._pAlpha;
        },
        set: function (value) {
            this._pAlpha = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowMapMethodBase.prototype, "castingLight", {
        /**
         * The light casting the shadows.
         */
        get: function () {
            return this._pCastingLight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowMapMethodBase.prototype, "epsilon", {
        /**
         * A small value to counter floating point precision errors when comparing values in the shadow map with the
         * calculated depth value. Increase this if shadow banding occurs, decrease it if the shadow seems to be too detached.
         */
        get: function () {
            return this._pEpsilon;
        },
        set: function (value) {
            this._pEpsilon = value;
        },
        enumerable: true,
        configurable: true
    });
    ShadowMapMethodBase.assetType = "[asset ShadowMapMethod]";
    return ShadowMapMethodBase;
})(ShadingMethodBase);
module.exports = ShadowMapMethodBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU2hhZG93TWFwTWV0aG9kQmFzZS50cyJdLCJuYW1lcyI6WyJTaGFkb3dNYXBNZXRob2RCYXNlIiwiU2hhZG93TWFwTWV0aG9kQmFzZS5jb25zdHJ1Y3RvciIsIlNoYWRvd01hcE1ldGhvZEJhc2UuYXNzZXRUeXBlIiwiU2hhZG93TWFwTWV0aG9kQmFzZS5hbHBoYSIsIlNoYWRvd01hcE1ldGhvZEJhc2UuY2FzdGluZ0xpZ2h0IiwiU2hhZG93TWFwTWV0aG9kQmFzZS5lcHNpbG9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFLQSxJQUFPLGlCQUFpQixXQUFhLHNEQUFzRCxDQUFDLENBQUM7QUFFN0YsQUFHQTs7R0FERztJQUNHLG1CQUFtQjtJQUFTQSxVQUE1QkEsbUJBQW1CQSxVQUEwQkE7SUFVbERBOzs7T0FHR0E7SUFDSEEsU0FkS0EsbUJBQW1CQSxDQWNaQSxZQUFzQkE7UUFFakNDLGlCQUFPQSxDQUFDQTtRQVRGQSxjQUFTQSxHQUFVQSxHQUFHQSxDQUFDQTtRQUN2QkEsWUFBT0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFTekJBLElBQUlBLENBQUNBLGNBQWNBLEdBQUdBLFlBQVlBLENBQUNBO1FBQ25DQSxZQUFZQSxDQUFDQSxZQUFZQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNqQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsWUFBWUEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7SUFFakRBLENBQUNBO0lBS0RELHNCQUFXQSwwQ0FBU0E7UUFIcEJBOztXQUVHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxtQkFBbUJBLENBQUNBLFNBQVNBLENBQUNBO1FBQ3RDQSxDQUFDQTs7O09BQUFGO0lBS0RBLHNCQUFXQSxzQ0FBS0E7UUFIaEJBOztXQUVHQTthQUNIQTtZQUVDRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUNyQkEsQ0FBQ0E7YUFFREgsVUFBaUJBLEtBQVlBO1lBRTVCRyxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUN0QkEsQ0FBQ0E7OztPQUxBSDtJQVVEQSxzQkFBV0EsNkNBQVlBO1FBSHZCQTs7V0FFR0E7YUFDSEE7WUFFQ0ksTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0E7UUFDNUJBLENBQUNBOzs7T0FBQUo7SUFNREEsc0JBQVdBLHdDQUFPQTtRQUpsQkE7OztXQUdHQTthQUNIQTtZQUVDSyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUN2QkEsQ0FBQ0E7YUFFREwsVUFBbUJBLEtBQVlBO1lBRTlCSyxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUN4QkEsQ0FBQ0E7OztPQUxBTDtJQXpEYUEsNkJBQVNBLEdBQVVBLHlCQUF5QkEsQ0FBQ0E7SUErRDVEQSwwQkFBQ0E7QUFBREEsQ0FqRUEsQUFpRUNBLEVBakVpQyxpQkFBaUIsRUFpRWxEO0FBRUQsQUFBNkIsaUJBQXBCLG1CQUFtQixDQUFDIiwiZmlsZSI6Im1ldGhvZHMvU2hhZG93TWFwTWV0aG9kQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSUFzc2V0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvSUFzc2V0XCIpO1xuXG5pbXBvcnQgTGlnaHRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0xpZ2h0QmFzZVwiKTtcbmltcG9ydCBTaGFkb3dNYXBwZXJCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL3NoYWRvd21hcHBlcnMvU2hhZG93TWFwcGVyQmFzZVwiKTtcblxuaW1wb3J0IFNoYWRpbmdNZXRob2RCYXNlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvbWV0aG9kcy9TaGFkaW5nTWV0aG9kQmFzZVwiKTtcblxuLyoqXG4gKiBTaGFkb3dNYXBNZXRob2RCYXNlIHByb3ZpZGVzIGFuIGFic3RyYWN0IGJhc2UgbWV0aG9kIGZvciBzaGFkb3cgbWFwIG1ldGhvZHMuXG4gKi9cbmNsYXNzIFNoYWRvd01hcE1ldGhvZEJhc2UgZXh0ZW5kcyBTaGFkaW5nTWV0aG9kQmFzZSBpbXBsZW1lbnRzIElBc3NldFxue1xuXHRwdWJsaWMgc3RhdGljIGFzc2V0VHlwZTpzdHJpbmcgPSBcIlthc3NldCBTaGFkb3dNYXBNZXRob2RdXCI7XG5cblx0cHVibGljIF9wQ2FzdGluZ0xpZ2h0OkxpZ2h0QmFzZTtcblx0cHVibGljIF9wU2hhZG93TWFwcGVyOlNoYWRvd01hcHBlckJhc2U7XG5cblx0cHVibGljIF9wRXBzaWxvbjpudW1iZXIgPSAuMDI7XG5cdHB1YmxpYyBfcEFscGhhOm51bWJlciA9IDE7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgU2hhZG93TWFwTWV0aG9kQmFzZSBvYmplY3QuXG5cdCAqIEBwYXJhbSBjYXN0aW5nTGlnaHQgVGhlIGxpZ2h0IHVzZWQgdG8gY2FzdCBzaGFkb3dzLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoY2FzdGluZ0xpZ2h0OkxpZ2h0QmFzZSlcblx0e1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5fcENhc3RpbmdMaWdodCA9IGNhc3RpbmdMaWdodDtcblx0XHRjYXN0aW5nTGlnaHQuY2FzdHNTaGFkb3dzID0gdHJ1ZTtcblx0XHR0aGlzLl9wU2hhZG93TWFwcGVyID0gY2FzdGluZ0xpZ2h0LnNoYWRvd01hcHBlcjtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFzc2V0VHlwZSgpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFNoYWRvd01hcE1ldGhvZEJhc2UuYXNzZXRUeXBlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBcInRyYW5zcGFyZW5jeVwiIG9mIHRoZSBzaGFkb3dzLiBUaGlzIGFsbG93cyBtYWtpbmcgc2hhZG93cyBsZXNzIHN0cm9uZy5cblx0ICovXG5cdHB1YmxpYyBnZXQgYWxwaGEoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wQWxwaGE7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGFscGhhKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3BBbHBoYSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBsaWdodCBjYXN0aW5nIHRoZSBzaGFkb3dzLlxuXHQgKi9cblx0cHVibGljIGdldCBjYXN0aW5nTGlnaHQoKTpMaWdodEJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wQ2FzdGluZ0xpZ2h0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgc21hbGwgdmFsdWUgdG8gY291bnRlciBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24gZXJyb3JzIHdoZW4gY29tcGFyaW5nIHZhbHVlcyBpbiB0aGUgc2hhZG93IG1hcCB3aXRoIHRoZVxuXHQgKiBjYWxjdWxhdGVkIGRlcHRoIHZhbHVlLiBJbmNyZWFzZSB0aGlzIGlmIHNoYWRvdyBiYW5kaW5nIG9jY3VycywgZGVjcmVhc2UgaXQgaWYgdGhlIHNoYWRvdyBzZWVtcyB0byBiZSB0b28gZGV0YWNoZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGVwc2lsb24oKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wRXBzaWxvbjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZXBzaWxvbih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9wRXBzaWxvbiA9IHZhbHVlO1xuXHR9XG59XG5cbmV4cG9ydCA9IFNoYWRvd01hcE1ldGhvZEJhc2U7Il19