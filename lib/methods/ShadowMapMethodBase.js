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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU2hhZG93TWFwTWV0aG9kQmFzZS50cyJdLCJuYW1lcyI6WyJTaGFkb3dNYXBNZXRob2RCYXNlIiwiU2hhZG93TWFwTWV0aG9kQmFzZS5jb25zdHJ1Y3RvciIsIlNoYWRvd01hcE1ldGhvZEJhc2UuYXNzZXRUeXBlIiwiU2hhZG93TWFwTWV0aG9kQmFzZS5hbHBoYSIsIlNoYWRvd01hcE1ldGhvZEJhc2UuY2FzdGluZ0xpZ2h0IiwiU2hhZG93TWFwTWV0aG9kQmFzZS5lcHNpbG9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLFNBQVMsV0FBZSxtQ0FBbUMsQ0FBQyxDQUFDO0FBTXBFLElBQU8saUJBQWlCLFdBQWEsc0RBQXNELENBQUMsQ0FBQztBQUU3RixBQUdBOztHQURHO0lBQ0csbUJBQW1CO0lBQVNBLFVBQTVCQSxtQkFBbUJBLFVBQTBCQTtJQVFsREE7OztPQUdHQTtJQUNIQSxTQVpLQSxtQkFBbUJBLENBWVpBLFlBQXNCQTtRQUVqQ0MsaUJBQU9BLENBQUNBO1FBVEZBLGNBQVNBLEdBQVVBLEdBQUdBLENBQUNBO1FBQ3ZCQSxZQUFPQSxHQUFVQSxDQUFDQSxDQUFDQTtRQVN6QkEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsWUFBWUEsQ0FBQ0E7UUFDbkNBLFlBQVlBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2pDQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxZQUFZQSxDQUFDQSxZQUFZQSxDQUFDQTtJQUVqREEsQ0FBQ0E7SUFLREQsc0JBQVdBLDBDQUFTQTtRQUhwQkE7O1dBRUdBO2FBQ0hBO1lBRUNFLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLGlCQUFpQkEsQ0FBQ0E7UUFDcENBLENBQUNBOzs7T0FBQUY7SUFLREEsc0JBQVdBLHNDQUFLQTtRQUhoQkE7O1dBRUdBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBO1FBQ3JCQSxDQUFDQTthQUVESCxVQUFpQkEsS0FBWUE7WUFFNUJHLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3RCQSxDQUFDQTs7O09BTEFIO0lBVURBLHNCQUFXQSw2Q0FBWUE7UUFIdkJBOztXQUVHQTthQUNIQTtZQUVDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQTtRQUM1QkEsQ0FBQ0E7OztPQUFBSjtJQU1EQSxzQkFBV0Esd0NBQU9BO1FBSmxCQTs7O1dBR0dBO2FBQ0hBO1lBRUNLLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO1FBQ3ZCQSxDQUFDQTthQUVETCxVQUFtQkEsS0FBWUE7WUFFOUJLLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3hCQSxDQUFDQTs7O09BTEFMO0lBTUZBLDBCQUFDQTtBQUFEQSxDQS9EQSxBQStEQ0EsRUEvRGlDLGlCQUFpQixFQStEbEQ7QUFFRCxBQUE2QixpQkFBcEIsbUJBQW1CLENBQUMiLCJmaWxlIjoibWV0aG9kcy9TaGFkb3dNYXBNZXRob2RCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBc3NldFR5cGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvQXNzZXRUeXBlXCIpO1xuaW1wb3J0IElBc3NldFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0lBc3NldFwiKTtcblxuaW1wb3J0IExpZ2h0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9MaWdodEJhc2VcIik7XG5pbXBvcnQgU2hhZG93TWFwcGVyQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9zaGFkb3dtYXBwZXJzL1NoYWRvd01hcHBlckJhc2VcIik7XG5cbmltcG9ydCBTaGFkaW5nTWV0aG9kQmFzZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1tZXRob2RtYXRlcmlhbHMvbGliL21ldGhvZHMvU2hhZGluZ01ldGhvZEJhc2VcIik7XG5cbi8qKlxuICogU2hhZG93TWFwTWV0aG9kQmFzZSBwcm92aWRlcyBhbiBhYnN0cmFjdCBiYXNlIG1ldGhvZCBmb3Igc2hhZG93IG1hcCBtZXRob2RzLlxuICovXG5jbGFzcyBTaGFkb3dNYXBNZXRob2RCYXNlIGV4dGVuZHMgU2hhZGluZ01ldGhvZEJhc2UgaW1wbGVtZW50cyBJQXNzZXRcbntcblx0cHVibGljIF9wQ2FzdGluZ0xpZ2h0OkxpZ2h0QmFzZTtcblx0cHVibGljIF9wU2hhZG93TWFwcGVyOlNoYWRvd01hcHBlckJhc2U7XG5cblx0cHVibGljIF9wRXBzaWxvbjpudW1iZXIgPSAuMDI7XG5cdHB1YmxpYyBfcEFscGhhOm51bWJlciA9IDE7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgU2hhZG93TWFwTWV0aG9kQmFzZSBvYmplY3QuXG5cdCAqIEBwYXJhbSBjYXN0aW5nTGlnaHQgVGhlIGxpZ2h0IHVzZWQgdG8gY2FzdCBzaGFkb3dzLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoY2FzdGluZ0xpZ2h0OkxpZ2h0QmFzZSlcblx0e1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5fcENhc3RpbmdMaWdodCA9IGNhc3RpbmdMaWdodDtcblx0XHRjYXN0aW5nTGlnaHQuY2FzdHNTaGFkb3dzID0gdHJ1ZTtcblx0XHR0aGlzLl9wU2hhZG93TWFwcGVyID0gY2FzdGluZ0xpZ2h0LnNoYWRvd01hcHBlcjtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFzc2V0VHlwZSgpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIEFzc2V0VHlwZS5TSEFET1dfTUFQX01FVEhPRDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgXCJ0cmFuc3BhcmVuY3lcIiBvZiB0aGUgc2hhZG93cy4gVGhpcyBhbGxvd3MgbWFraW5nIHNoYWRvd3MgbGVzcyBzdHJvbmcuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFscGhhKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcEFscGhhO1xuXHR9XG5cblx0cHVibGljIHNldCBhbHBoYSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9wQWxwaGEgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbGlnaHQgY2FzdGluZyB0aGUgc2hhZG93cy5cblx0ICovXG5cdHB1YmxpYyBnZXQgY2FzdGluZ0xpZ2h0KCk6TGlnaHRCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcENhc3RpbmdMaWdodDtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIHNtYWxsIHZhbHVlIHRvIGNvdW50ZXIgZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uIGVycm9ycyB3aGVuIGNvbXBhcmluZyB2YWx1ZXMgaW4gdGhlIHNoYWRvdyBtYXAgd2l0aCB0aGVcblx0ICogY2FsY3VsYXRlZCBkZXB0aCB2YWx1ZS4gSW5jcmVhc2UgdGhpcyBpZiBzaGFkb3cgYmFuZGluZyBvY2N1cnMsIGRlY3JlYXNlIGl0IGlmIHRoZSBzaGFkb3cgc2VlbXMgdG8gYmUgdG9vIGRldGFjaGVkLlxuXHQgKi9cblx0cHVibGljIGdldCBlcHNpbG9uKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcEVwc2lsb247XG5cdH1cblxuXHRwdWJsaWMgc2V0IGVwc2lsb24odmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fcEVwc2lsb24gPSB2YWx1ZTtcblx0fVxufVxuXG5leHBvcnQgPSBTaGFkb3dNYXBNZXRob2RCYXNlOyJdfQ==