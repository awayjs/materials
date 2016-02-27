var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var View = require("awayjs-display/lib/View");
var PointLight = require("awayjs-display/lib/display/PointLight");
var StaticLightPicker = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
var PrimitiveTorusPrefab = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
var ElementsType = require("awayjs-display/lib/graphics/ElementsType");
var DefaultRenderer = require("awayjs-renderergl/lib/DefaultRenderer");
var MethodMaterial = require("awayjs-methodmaterials/lib/MethodMaterial");
var ColorMultiPassMatTest = (function () {
    function ColorMultiPassMatTest() {
        var _this = this;
        this.counter = 0;
        this.center = new Vector3D();
        Debug.THROW_ERRORS = false;
        Debug.LOG_PI_ERRORS = false;
        this.light = new PointLight();
        this.view = new View(new DefaultRenderer());
        this.view.camera.z = -1000;
        this.view.backgroundColor = 0x000000;
        var l = 20;
        var radius = 500;
        var mat = new MethodMaterial(0xff0000);
        mat.lightPicker = new StaticLightPicker([this.light]);
        var torus = new PrimitiveTorusPrefab(mat, ElementsType.TRIANGLE, 50, 10, 32, 32, false);
        for (var c = 0; c < l; c++) {
            var t = Math.PI * 2 * c / l;
            var m = torus.getNewObject();
            m.x = Math.cos(t) * radius;
            m.y = 0;
            m.z = Math.sin(t) * radius;
            this.view.scene.addChild(m);
        }
        this.view.scene.addChild(this.light);
        this.view.y = this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
        console.log("renderer ", this.view.renderer);
        console.log("scene ", this.view.scene);
        console.log("view ", this.view);
        this.view.render();
        window.onresize = function (event) { return _this.onResize(event); };
        this.raf = new RequestAnimationFrame(this.tick, this);
        this.raf.start();
    }
    ColorMultiPassMatTest.prototype.tick = function (dt) {
        this.counter += 0.005;
        this.view.camera.lookAt(this.center);
        this.view.camera.x = Math.cos(this.counter) * 800;
        this.view.camera.z = Math.sin(this.counter) * 800;
        this.view.render();
    };
    ColorMultiPassMatTest.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this.view.y = 0;
        this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    };
    return ColorMultiPassMatTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFscy9Db2xvck11bHRpUGFzc01hdFRlc3QudHMiXSwibmFtZXMiOlsiQ29sb3JNdWx0aVBhc3NNYXRUZXN0IiwiQ29sb3JNdWx0aVBhc3NNYXRUZXN0LmNvbnN0cnVjdG9yIiwiQ29sb3JNdWx0aVBhc3NNYXRUZXN0LnRpY2siLCJDb2xvck11bHRpUGFzc01hdFRlc3Qub25SZXNpemUiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sUUFBUSxXQUFnQiwrQkFBK0IsQ0FBQyxDQUFDO0FBSWhFLElBQU8scUJBQXFCLFdBQVksNkNBQTZDLENBQUMsQ0FBQztBQUN2RixJQUFPLEtBQUssV0FBZ0IsNkJBQTZCLENBQUMsQ0FBQztBQUUzRCxJQUFPLElBQUksV0FBaUIseUJBQXlCLENBQUMsQ0FBQztBQUV2RCxJQUFPLFVBQVUsV0FBZSx1Q0FBdUMsQ0FBQyxDQUFDO0FBQ3pFLElBQU8saUJBQWlCLFdBQWEsNkRBQTZELENBQUMsQ0FBQztBQUNwRyxJQUFPLG9CQUFvQixXQUFhLGlEQUFpRCxDQUFDLENBQUM7QUFDM0YsSUFBTyxZQUFZLFdBQWUsMENBQTBDLENBQUMsQ0FBQztBQUU5RSxJQUFPLGVBQWUsV0FBYyx1Q0FBdUMsQ0FBQyxDQUFDO0FBRTdFLElBQU8sY0FBYyxXQUFjLDJDQUEyQyxDQUFDLENBQUM7QUFFaEYsSUFBTSxxQkFBcUI7SUFRMUJBLFNBUktBLHFCQUFxQkE7UUFBM0JDLGlCQTBFQ0E7UUFyRVFBLFlBQU9BLEdBQVVBLENBQUNBLENBQUNBO1FBQ25CQSxXQUFNQSxHQUFZQSxJQUFJQSxRQUFRQSxFQUFFQSxDQUFDQTtRQUl4Q0EsS0FBS0EsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDM0JBLEtBQUtBLENBQUNBLGFBQWFBLEdBQUdBLEtBQUtBLENBQUNBO1FBRTVCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxVQUFVQSxFQUFFQSxDQUFDQTtRQUM5QkEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsZUFBZUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDNUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBO1FBQzNCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUVyQ0EsSUFBSUEsQ0FBQ0EsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFDbEJBLElBQUlBLE1BQU1BLEdBQVVBLEdBQUdBLENBQUNBO1FBRXhCQSxJQUFJQSxHQUFHQSxHQUFrQkEsSUFBSUEsY0FBY0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFFdERBLEdBQUdBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFdERBLElBQUlBLEtBQUtBLEdBQXdCQSxJQUFJQSxvQkFBb0JBLENBQUNBLEdBQUdBLEVBQUVBLFlBQVlBLENBQUNBLFFBQVFBLEVBQUVBLEVBQUVBLEVBQUdBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUdBLEVBQUVBLEVBQUdBLEtBQUtBLENBQUNBLENBQUNBO1FBRWhIQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUNwQ0EsSUFBSUEsQ0FBQ0EsR0FBVUEsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDN0JBLElBQUlBLENBQUNBLEdBQW1CQSxLQUFLQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQTtZQUU3Q0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDekJBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ1JBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUNBLE1BQU1BLENBQUNBO1lBRXpCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM3QkEsQ0FBQ0E7UUFFREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFFckNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQzlCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUNwQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7UUFFdENBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLFdBQVdBLEVBQUVBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQzdDQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxFQUFFQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUN2Q0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsRUFBRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFaENBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1FBRW5CQSxNQUFNQSxDQUFDQSxRQUFRQSxHQUFHQSxVQUFDQSxLQUFhQSxJQUFLQSxPQUFBQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUFwQkEsQ0FBb0JBLENBQUNBO1FBRTFEQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxJQUFJQSxxQkFBcUJBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBQ3REQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtJQUNsQkEsQ0FBQ0E7SUFHT0Qsb0NBQUlBLEdBQVpBLFVBQWFBLEVBQVNBO1FBRXJCRSxJQUFJQSxDQUFDQSxPQUFPQSxJQUFJQSxLQUFLQSxDQUFDQTtRQUN0QkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDckNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEdBQUNBLEdBQUdBLENBQUNBO1FBQ2hEQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFDQSxHQUFHQSxDQUFDQTtRQUVoREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7SUFDcEJBLENBQUNBO0lBRU1GLHdDQUFRQSxHQUFmQSxVQUFnQkEsS0FBb0JBO1FBQXBCRyxxQkFBb0JBLEdBQXBCQSxZQUFvQkE7UUFFbkNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ2hCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNoQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDcENBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO0lBQ3ZDQSxDQUFDQTtJQUNGSCw0QkFBQ0E7QUFBREEsQ0ExRUEsQUEwRUNBLElBQUEiLCJmaWxlIjoibWF0ZXJpYWxzL0NvbG9yTXVsdGlQYXNzTWF0VGVzdC5qcyIsInNvdXJjZVJvb3QiOiIuL3Rlc3RzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgVVJMTG9hZGVyXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMTG9hZGVyXCIpO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxSZXF1ZXN0XCIpO1xuaW1wb3J0IFVSTExvYWRlckV2ZW50XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL1VSTExvYWRlckV2ZW50XCIpO1xuaW1wb3J0IFJlcXVlc3RBbmltYXRpb25GcmFtZVx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCIpO1xuaW1wb3J0IERlYnVnXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL0RlYnVnXCIpO1xuXG5pbXBvcnQgVmlld1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL1ZpZXdcIik7XG5pbXBvcnQgU3ByaXRlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Rpc3BsYXkvU3ByaXRlXCIpO1xuaW1wb3J0IFBvaW50TGlnaHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Rpc3BsYXkvUG9pbnRMaWdodFwiKTtcbmltcG9ydCBTdGF0aWNMaWdodFBpY2tlclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvbGlnaHRwaWNrZXJzL1N0YXRpY0xpZ2h0UGlja2VyXCIpO1xuaW1wb3J0IFByaW1pdGl2ZVRvcnVzUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlVG9ydXNQcmVmYWJcIik7XG5pbXBvcnQgRWxlbWVudHNUeXBlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9ncmFwaGljcy9FbGVtZW50c1R5cGVcIik7XG5cbmltcG9ydCBEZWZhdWx0UmVuZGVyZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9EZWZhdWx0UmVuZGVyZXJcIik7XG5cbmltcG9ydCBNZXRob2RNYXRlcmlhbFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvTWV0aG9kTWF0ZXJpYWxcIik7XG5cbmNsYXNzIENvbG9yTXVsdGlQYXNzTWF0VGVzdFxue1xuXHRwcml2YXRlIHZpZXc6Vmlldztcblx0cHJpdmF0ZSBsaWdodDpQb2ludExpZ2h0O1xuXHRwcml2YXRlIHJhZjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdHByaXZhdGUgY291bnRlcjpudW1iZXIgPSAwO1xuXHRwcml2YXRlIGNlbnRlcjpWZWN0b3IzRCA9IG5ldyBWZWN0b3IzRCgpO1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdERlYnVnLlRIUk9XX0VSUk9SUyA9IGZhbHNlO1xuXHRcdERlYnVnLkxPR19QSV9FUlJPUlMgPSBmYWxzZTtcblxuXHRcdHRoaXMubGlnaHQgPSBuZXcgUG9pbnRMaWdodCgpO1xuXHRcdHRoaXMudmlldyA9IG5ldyBWaWV3KG5ldyBEZWZhdWx0UmVuZGVyZXIoKSk7XG5cdFx0dGhpcy52aWV3LmNhbWVyYS56ID0gLTEwMDA7XG5cdFx0dGhpcy52aWV3LmJhY2tncm91bmRDb2xvciA9IDB4MDAwMDAwO1xuXG5cdFx0dmFyIGw6bnVtYmVyID0gMjA7XG5cdFx0dmFyIHJhZGl1czpudW1iZXIgPSA1MDA7XG5cblx0XHR2YXIgbWF0Ok1ldGhvZE1hdGVyaWFsID0gbmV3IE1ldGhvZE1hdGVyaWFsKDB4ZmYwMDAwKTtcblxuXHRcdG1hdC5saWdodFBpY2tlciA9IG5ldyBTdGF0aWNMaWdodFBpY2tlcihbdGhpcy5saWdodF0pO1xuXG5cdFx0dmFyIHRvcnVzOlByaW1pdGl2ZVRvcnVzUHJlZmFiID0gbmV3IFByaW1pdGl2ZVRvcnVzUHJlZmFiKG1hdCwgRWxlbWVudHNUeXBlLlRSSUFOR0xFLCA1MCAsIDEwLCAzMiAsIDMyICwgZmFsc2UpO1xuXG5cdFx0Zm9yICh2YXIgYzpudW1iZXIgPSAwOyBjIDwgbCA7IGMrKykge1xuXHRcdFx0dmFyIHQ6bnVtYmVyID0gTWF0aC5QSSoyKmMvbDtcblx0XHRcdHZhciBtOlNwcml0ZSA9IDxTcHJpdGU+IHRvcnVzLmdldE5ld09iamVjdCgpO1xuXG5cdFx0XHRtLnggPSBNYXRoLmNvcyh0KSpyYWRpdXM7XG5cdFx0XHRtLnkgPSAwO1xuXHRcdFx0bS56ID0gTWF0aC5zaW4odCkqcmFkaXVzO1xuXG5cdFx0XHR0aGlzLnZpZXcuc2NlbmUuYWRkQ2hpbGQobSk7XG5cdFx0fVxuXG5cdFx0dGhpcy52aWV3LnNjZW5lLmFkZENoaWxkKHRoaXMubGlnaHQpO1xuXG5cdFx0dGhpcy52aWV3LnkgPSB0aGlzLnZpZXcueCA9IDA7XG5cdFx0dGhpcy52aWV3LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0dGhpcy52aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuXHRcdGNvbnNvbGUubG9nKFwicmVuZGVyZXIgXCIsIHRoaXMudmlldy5yZW5kZXJlcik7XG5cdFx0Y29uc29sZS5sb2coXCJzY2VuZSBcIiwgdGhpcy52aWV3LnNjZW5lKTtcblx0XHRjb25zb2xlLmxvZyhcInZpZXcgXCIsIHRoaXMudmlldyk7XG5cblx0XHR0aGlzLnZpZXcucmVuZGVyKCk7XG5cblx0XHR3aW5kb3cub25yZXNpemUgPSAoZXZlbnQ6VUlFdmVudCkgPT4gdGhpcy5vblJlc2l6ZShldmVudCk7XG5cblx0XHR0aGlzLnJhZiA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLCB0aGlzKTtcblx0XHR0aGlzLnJhZi5zdGFydCgpO1xuXHR9XG5cblxuXHRwcml2YXRlIHRpY2soZHQ6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5jb3VudGVyICs9IDAuMDA1O1xuXHRcdHRoaXMudmlldy5jYW1lcmEubG9va0F0KHRoaXMuY2VudGVyKTtcblx0XHR0aGlzLnZpZXcuY2FtZXJhLnggPSBNYXRoLmNvcyh0aGlzLmNvdW50ZXIpKjgwMDtcblx0XHR0aGlzLnZpZXcuY2FtZXJhLnogPSBNYXRoLnNpbih0aGlzLmNvdW50ZXIpKjgwMDtcblxuXHRcdHRoaXMudmlldy5yZW5kZXIoKTtcblx0fVxuXG5cdHB1YmxpYyBvblJlc2l6ZShldmVudDpVSUV2ZW50ID0gbnVsbClcblx0e1xuXHRcdHRoaXMudmlldy55ID0gMDtcblx0XHR0aGlzLnZpZXcueCA9IDA7XG5cdFx0dGhpcy52aWV3LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0dGhpcy52aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0fVxufSJdfQ==