var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/library/AssetType");
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
            return AssetType.SHADOW_MAP_METHOD;
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
    return ShadowMapMethodBase;
})(ShadingMethodBase);
module.exports = ShadowMapMethodBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU2hhZG93TWFwTWV0aG9kQmFzZS50cyJdLCJuYW1lcyI6WyJTaGFkb3dNYXBNZXRob2RCYXNlIiwiU2hhZG93TWFwTWV0aG9kQmFzZS5jb25zdHJ1Y3RvciIsIlNoYWRvd01hcE1ldGhvZEJhc2UuYXNzZXRUeXBlIiwiU2hhZG93TWFwTWV0aG9kQmFzZS5hbHBoYSIsIlNoYWRvd01hcE1ldGhvZEJhc2UuY2FzdGluZ0xpZ2h0IiwiU2hhZG93TWFwTWV0aG9kQmFzZS5lcHNpbG9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLFNBQVMsV0FBZSxtQ0FBbUMsQ0FBQyxDQUFDO0FBTXBFLElBQU8saUJBQWlCLFdBQWEsc0RBQXNELENBQUMsQ0FBQztBQUU3RixBQUdBOztHQURHO0lBQ0csbUJBQW1CO0lBQVNBLFVBQTVCQSxtQkFBbUJBLFVBQTBCQTtJQVFsREE7OztPQUdHQTtJQUNIQSxTQVpLQSxtQkFBbUJBLENBWVpBLFlBQXNCQTtRQUVqQ0MsaUJBQU9BLENBQUNBO1FBVEZBLGNBQVNBLEdBQVVBLEdBQUdBLENBQUNBO1FBQ3ZCQSxZQUFPQSxHQUFVQSxDQUFDQSxDQUFDQTtRQVN6QkEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsWUFBWUEsQ0FBQ0E7UUFDbkNBLFlBQVlBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2pDQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxZQUFZQSxDQUFDQSxZQUFZQSxDQUFDQTtJQUVqREEsQ0FBQ0E7SUFLREQsc0JBQVdBLDBDQUFTQTtRQUhwQkE7O1dBRUdBO2FBQ0hBO1lBRUNFLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLGlCQUFpQkEsQ0FBQ0E7UUFDcENBLENBQUNBOzs7T0FBQUY7SUFLREEsc0JBQVdBLHNDQUFLQTtRQUhoQkE7O1dBRUdBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBO1FBQ3JCQSxDQUFDQTthQUVESCxVQUFpQkEsS0FBWUE7WUFFNUJHLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3RCQSxDQUFDQTs7O09BTEFIO0lBVURBLHNCQUFXQSw2Q0FBWUE7UUFIdkJBOztXQUVHQTthQUNIQTtZQUVDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQTtRQUM1QkEsQ0FBQ0E7OztPQUFBSjtJQU1EQSxzQkFBV0Esd0NBQU9BO1FBSmxCQTs7O1dBR0dBO2FBQ0hBO1lBRUNLLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO1FBQ3ZCQSxDQUFDQTthQUVETCxVQUFtQkEsS0FBWUE7WUFFOUJLLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3hCQSxDQUFDQTs7O09BTEFMO0lBTUZBLDBCQUFDQTtBQUFEQSxDQS9EQSxBQStEQ0EsRUEvRGlDLGlCQUFpQixFQStEbEQ7QUFFRCxBQUE2QixpQkFBcEIsbUJBQW1CLENBQUMiLCJmaWxlIjoibWV0aG9kcy9TaGFkb3dNYXBNZXRob2RCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBc3NldFR5cGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvQXNzZXRUeXBlXCIpO1xyXG5pbXBvcnQgSUFzc2V0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvSUFzc2V0XCIpO1xyXG5cclxuaW1wb3J0IExpZ2h0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9MaWdodEJhc2VcIik7XHJcbmltcG9ydCBTaGFkb3dNYXBwZXJCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL3NoYWRvd21hcHBlcnMvU2hhZG93TWFwcGVyQmFzZVwiKTtcclxuXHJcbmltcG9ydCBTaGFkaW5nTWV0aG9kQmFzZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU2hhZGluZ01ldGhvZEJhc2VcIik7XHJcblxyXG4vKipcclxuICogU2hhZG93TWFwTWV0aG9kQmFzZSBwcm92aWRlcyBhbiBhYnN0cmFjdCBiYXNlIG1ldGhvZCBmb3Igc2hhZG93IG1hcCBtZXRob2RzLlxyXG4gKi9cclxuY2xhc3MgU2hhZG93TWFwTWV0aG9kQmFzZSBleHRlbmRzIFNoYWRpbmdNZXRob2RCYXNlIGltcGxlbWVudHMgSUFzc2V0XHJcbntcclxuXHRwdWJsaWMgX3BDYXN0aW5nTGlnaHQ6TGlnaHRCYXNlO1xyXG5cdHB1YmxpYyBfcFNoYWRvd01hcHBlcjpTaGFkb3dNYXBwZXJCYXNlO1xyXG5cclxuXHRwdWJsaWMgX3BFcHNpbG9uOm51bWJlciA9IC4wMjtcclxuXHRwdWJsaWMgX3BBbHBoYTpudW1iZXIgPSAxO1xyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGVzIGEgbmV3IFNoYWRvd01hcE1ldGhvZEJhc2Ugb2JqZWN0LlxyXG5cdCAqIEBwYXJhbSBjYXN0aW5nTGlnaHQgVGhlIGxpZ2h0IHVzZWQgdG8gY2FzdCBzaGFkb3dzLlxyXG5cdCAqL1xyXG5cdGNvbnN0cnVjdG9yKGNhc3RpbmdMaWdodDpMaWdodEJhc2UpXHJcblx0e1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdHRoaXMuX3BDYXN0aW5nTGlnaHQgPSBjYXN0aW5nTGlnaHQ7XHJcblx0XHRjYXN0aW5nTGlnaHQuY2FzdHNTaGFkb3dzID0gdHJ1ZTtcclxuXHRcdHRoaXMuX3BTaGFkb3dNYXBwZXIgPSBjYXN0aW5nTGlnaHQuc2hhZG93TWFwcGVyO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGdldCBhc3NldFR5cGUoKTpzdHJpbmdcclxuXHR7XHJcblx0XHRyZXR1cm4gQXNzZXRUeXBlLlNIQURPV19NQVBfTUVUSE9EO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIFwidHJhbnNwYXJlbmN5XCIgb2YgdGhlIHNoYWRvd3MuIFRoaXMgYWxsb3dzIG1ha2luZyBzaGFkb3dzIGxlc3Mgc3Ryb25nLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgYWxwaGEoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fcEFscGhhO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBhbHBoYSh2YWx1ZTpudW1iZXIpXHJcblx0e1xyXG5cdFx0dGhpcy5fcEFscGhhID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgbGlnaHQgY2FzdGluZyB0aGUgc2hhZG93cy5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGNhc3RpbmdMaWdodCgpOkxpZ2h0QmFzZVxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9wQ2FzdGluZ0xpZ2h0O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQSBzbWFsbCB2YWx1ZSB0byBjb3VudGVyIGZsb2F0aW5nIHBvaW50IHByZWNpc2lvbiBlcnJvcnMgd2hlbiBjb21wYXJpbmcgdmFsdWVzIGluIHRoZSBzaGFkb3cgbWFwIHdpdGggdGhlXHJcblx0ICogY2FsY3VsYXRlZCBkZXB0aCB2YWx1ZS4gSW5jcmVhc2UgdGhpcyBpZiBzaGFkb3cgYmFuZGluZyBvY2N1cnMsIGRlY3JlYXNlIGl0IGlmIHRoZSBzaGFkb3cgc2VlbXMgdG8gYmUgdG9vIGRldGFjaGVkLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgZXBzaWxvbigpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9wRXBzaWxvbjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgZXBzaWxvbih2YWx1ZTpudW1iZXIpXHJcblx0e1xyXG5cdFx0dGhpcy5fcEVwc2lsb24gPSB2YWx1ZTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFNoYWRvd01hcE1ldGhvZEJhc2U7Il19