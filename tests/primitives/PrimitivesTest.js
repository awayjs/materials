var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var View = require("awayjs-display/lib/containers/View");
var DirectionalLight = require("awayjs-display/lib/entities/DirectionalLight");
var StaticLightPicker = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
var PrimitiveCapsulePrefab = require("awayjs-display/lib/prefabs/PrimitiveCapsulePrefab");
var PrimitiveConePrefab = require("awayjs-display/lib/prefabs/PrimitiveConePrefab");
var PrimitiveCubePrefab = require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
var PrimitiveCylinderPrefab = require("awayjs-display/lib/prefabs/PrimitiveCylinderPrefab");
var PrimitivePlanePrefab = require("awayjs-display/lib/prefabs/PrimitivePlanePrefab");
var PrimitiveSpherePrefab = require("awayjs-display/lib/prefabs/PrimitiveSpherePrefab");
var PrimitiveTorusPrefab = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
var DefaultRenderer = require("awayjs-renderergl/lib/DefaultRenderer");
var DefaultMaterialManager = require("awayjs-renderergl/lib/managers/DefaultMaterialManager");
var MethodMaterial = require("awayjs-methodmaterials/lib/MethodMaterial");
var MethodRendererPool = require("awayjs-methodmaterials/lib/pool/MethodRendererPool");
var PrimitivesTest = (function () {
    function PrimitivesTest() {
        var _this = this;
        this.meshes = new Array();
        this.radius = 400;
        Debug.LOG_PI_ERRORS = false;
        Debug.THROW_ERRORS = false;
        this.view = new View(new DefaultRenderer(MethodRendererPool));
        this.raf = new RequestAnimationFrame(this.render, this);
        this.light = new DirectionalLight();
        this.light.color = 0xFFFFFF;
        this.light.direction = new Vector3D(1, 1, 0);
        this.light.ambient = 0;
        this.light.ambientColor = 0xFFFFFF;
        this.light.diffuse = 1;
        this.light.specular = 1;
        this.lightB = new DirectionalLight();
        this.lightB.color = 0xFF0000;
        this.lightB.direction = new Vector3D(-1, 0, 1);
        this.lightB.ambient = 0;
        this.lightB.ambientColor = 0xFFFFFF;
        this.lightB.diffuse = 1;
        this.lightB.specular = 1;
        this.staticLightPicker = new StaticLightPicker([this.light, this.lightB]);
        this.view.scene.addChild(this.light);
        this.view.scene.addChild(this.lightB);
        this.view.backgroundColor = 0x222222;
        window.onresize = function (event) { return _this.onResize(event); };
        this.initMeshes();
        this.raf.start();
        this.onResize();
    }
    PrimitivesTest.prototype.initMeshes = function () {
        var primitives = new Array();
        var material = new MethodMaterial(DefaultMaterialManager.getDefaultTexture());
        material.lightPicker = this.staticLightPicker;
        material.smooth = false;
        primitives.push(new PrimitiveTorusPrefab());
        primitives.push(new PrimitiveSpherePrefab());
        primitives.push(new PrimitiveCapsulePrefab());
        primitives.push(new PrimitiveCylinderPrefab());
        primitives.push(new PrimitivePlanePrefab());
        primitives.push(new PrimitiveConePrefab());
        primitives.push(new PrimitiveCubePrefab());
        var mesh;
        for (var c = 0; c < primitives.length; c++) {
            primitives[c].material = material;
            var t = Math.PI * 2 * c / primitives.length;
            mesh = primitives[c].getNewObject();
            mesh.x = Math.cos(t) * this.radius;
            mesh.y = Math.sin(t) * this.radius;
            mesh.z = 0;
            mesh.transform.scale = new Vector3D(2, 2, 2);
            this.view.scene.addChild(mesh);
            this.meshes.push(mesh);
        }
    };
    PrimitivesTest.prototype.render = function () {
        if (this.meshes)
            for (var c = 0; c < this.meshes.length; c++)
                this.meshes[c].rotationY += 1;
        this.view.render();
    };
    PrimitivesTest.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this.view.y = 0;
        this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    };
    return PrimitivesTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvUHJpbWl0aXZlc1Rlc3QudHMiXSwibmFtZXMiOlsiUHJpbWl0aXZlc1Rlc3QiLCJQcmltaXRpdmVzVGVzdC5jb25zdHJ1Y3RvciIsIlByaW1pdGl2ZXNUZXN0LmluaXRNZXNoZXMiLCJQcmltaXRpdmVzVGVzdC5yZW5kZXIiLCJQcmltaXRpdmVzVGVzdC5vblJlc2l6ZSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxRQUFRLFdBQWdCLCtCQUErQixDQUFDLENBQUM7QUFFaEUsSUFBTyxxQkFBcUIsV0FBWSw2Q0FBNkMsQ0FBQyxDQUFDO0FBQ3ZGLElBQU8sS0FBSyxXQUFnQiw2QkFBNkIsQ0FBQyxDQUFDO0FBRTNELElBQU8sSUFBSSxXQUFpQixvQ0FBb0MsQ0FBQyxDQUFDO0FBRWxFLElBQU8sZ0JBQWdCLFdBQWMsOENBQThDLENBQUMsQ0FBQztBQUNyRixJQUFPLGlCQUFpQixXQUFhLDZEQUE2RCxDQUFDLENBQUM7QUFFcEcsSUFBTyxzQkFBc0IsV0FBWSxtREFBbUQsQ0FBQyxDQUFDO0FBQzlGLElBQU8sbUJBQW1CLFdBQWEsZ0RBQWdELENBQUMsQ0FBQztBQUN6RixJQUFPLG1CQUFtQixXQUFhLGdEQUFnRCxDQUFDLENBQUM7QUFDekYsSUFBTyx1QkFBdUIsV0FBWSxvREFBb0QsQ0FBQyxDQUFDO0FBQ2hHLElBQU8sb0JBQW9CLFdBQWEsaURBQWlELENBQUMsQ0FBQztBQUMzRixJQUFPLHFCQUFxQixXQUFZLGtEQUFrRCxDQUFDLENBQUM7QUFDNUYsSUFBTyxvQkFBb0IsV0FBYSxpREFBaUQsQ0FBQyxDQUFDO0FBRTNGLElBQU8sZUFBZSxXQUFjLHVDQUF1QyxDQUFDLENBQUM7QUFDN0UsSUFBTyxzQkFBc0IsV0FBWSx1REFBdUQsQ0FBQyxDQUFDO0FBRWxHLElBQU8sY0FBYyxXQUFjLDJDQUEyQyxDQUFDLENBQUM7QUFDaEYsSUFBTyxrQkFBa0IsV0FBYSxvREFBb0QsQ0FBQyxDQUFDO0FBRTVGLElBQU0sY0FBYztJQVduQkEsU0FY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Q0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7SUFDakJBLENBQUNBO0lBRU9ELG1DQUFVQSxHQUFsQkE7UUFHQ0UsSUFBSUEsVUFBVUEsR0FBOEJBLElBQUlBLEtBQUtBLEVBQXVCQSxDQUFDQTtRQUM3RUEsSUFBSUEsUUFBUUEsR0FBa0JBLElBQUlBLGNBQWNBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUM3RkEsUUFBUUEsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQTtRQUM5Q0EsUUFBUUEsQ0FBQ0EsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFeEJBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLG9CQUFvQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDNUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLHFCQUFxQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDN0NBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLHNCQUFzQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDOUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLHVCQUF1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDL0NBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLG9CQUFvQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDNUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLG1CQUFtQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDM0NBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLG1CQUFtQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFFM0NBLElBQUlBLElBQVNBLENBQUNBO1FBRWRBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQVVBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFVBQVVBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUdBLEVBQUVBLENBQUNBO1lBQ3BEQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQTtZQUVsQ0EsSUFBSUEsQ0FBQ0EsR0FBVUEsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsR0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFFN0NBLElBQUlBLEdBQVVBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO1lBQzNDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNqQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDakNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ1hBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLFFBQVFBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1lBRTdDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUMvQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDeEJBLENBQUNBO0lBR0ZBLENBQUNBO0lBRU9GLCtCQUFNQSxHQUFkQTtRQUVDRyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNmQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQTtnQkFDakRBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFNBQVNBLElBQUlBLENBQUNBLENBQUNBO1FBRWhDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtJQUNwQkEsQ0FBQ0E7SUFFTUgsaUNBQVFBLEdBQWZBLFVBQWdCQSxLQUFvQkE7UUFBcEJJLHFCQUFvQkEsR0FBcEJBLFlBQW9CQTtRQUVuQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDaEJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBRWhCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUNwQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7SUFDdkNBLENBQUNBO0lBQ0ZKLHFCQUFDQTtBQUFEQSxDQXZHQSxBQXVHQ0EsSUFBQSIsImZpbGUiOiJwcmltaXRpdmVzL1ByaW1pdGl2ZXNUZXN0LmpzIiwic291cmNlUm9vdCI6Ii4vdGVzdHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBFdmVudFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvRXZlbnRcIik7XG5pbXBvcnQgUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIik7XG5pbXBvcnQgRGVidWdcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvRGVidWdcIik7XG5cbmltcG9ydCBWaWV3XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvY29udGFpbmVycy9WaWV3XCIpO1xuaW1wb3J0IE1lc2hcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9NZXNoXCIpO1xuaW1wb3J0IERpcmVjdGlvbmFsTGlnaHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9EaXJlY3Rpb25hbExpZ2h0XCIpO1xuaW1wb3J0IFN0YXRpY0xpZ2h0UGlja2VyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9saWdodHBpY2tlcnMvU3RhdGljTGlnaHRQaWNrZXJcIik7XG5pbXBvcnQgUHJpbWl0aXZlUHJlZmFiQmFzZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVByZWZhYkJhc2VcIik7XG5pbXBvcnQgUHJpbWl0aXZlQ2Fwc3VsZVByZWZhYlx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVDYXBzdWxlUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZUNvbmVQcmVmYWJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVDb25lUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZUN1YmVQcmVmYWJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVDdWJlUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZUN5bGluZGVyUHJlZmFiXHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZUN5bGluZGVyUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZVBsYW5lUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlUGxhbmVQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlU3BoZXJlUHJlZmFiXHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVNwaGVyZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVUb3J1c1ByZWZhYlx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVRvcnVzUHJlZmFiXCIpO1xuXG5pbXBvcnQgRGVmYXVsdFJlbmRlcmVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvRGVmYXVsdFJlbmRlcmVyXCIpO1xuaW1wb3J0IERlZmF1bHRNYXRlcmlhbE1hbmFnZXJcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hbmFnZXJzL0RlZmF1bHRNYXRlcmlhbE1hbmFnZXJcIik7XG5cbmltcG9ydCBNZXRob2RNYXRlcmlhbFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvTWV0aG9kTWF0ZXJpYWxcIik7XG5pbXBvcnQgTWV0aG9kUmVuZGVyZXJQb29sXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvcG9vbC9NZXRob2RSZW5kZXJlclBvb2xcIik7XG5cbmNsYXNzIFByaW1pdGl2ZXNUZXN0XG57XG5cblx0cHJpdmF0ZSB2aWV3OlZpZXc7XG5cdHByaXZhdGUgcmFmOlJlcXVlc3RBbmltYXRpb25GcmFtZTtcblx0cHJpdmF0ZSBtZXNoZXM6QXJyYXk8TWVzaD4gPSBuZXcgQXJyYXk8TWVzaD4oKTtcblx0cHJpdmF0ZSBsaWdodDpEaXJlY3Rpb25hbExpZ2h0O1xuXHRwcml2YXRlIGxpZ2h0QjpEaXJlY3Rpb25hbExpZ2h0O1xuXHRwcml2YXRlIHN0YXRpY0xpZ2h0UGlja2VyOlN0YXRpY0xpZ2h0UGlja2VyO1xuXHRwcml2YXRlIHJhZGl1czpudW1iZXIgPSA0MDA7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cblx0XHREZWJ1Zy5MT0dfUElfRVJST1JTICAgID0gZmFsc2U7XG5cdFx0RGVidWcuVEhST1dfRVJST1JTICAgICA9IGZhbHNlO1xuXG5cdFx0dGhpcy52aWV3ID0gbmV3IFZpZXcobmV3IERlZmF1bHRSZW5kZXJlcihNZXRob2RSZW5kZXJlclBvb2wpKTtcblx0XHR0aGlzLnJhZiA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXIsIHRoaXMpO1xuXG5cdFx0dGhpcy5saWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KCk7XG5cdFx0dGhpcy5saWdodC5jb2xvciA9IDB4RkZGRkZGO1xuXHRcdHRoaXMubGlnaHQuZGlyZWN0aW9uID0gbmV3IFZlY3RvcjNEKDEsIDEsIDApO1xuXHRcdHRoaXMubGlnaHQuYW1iaWVudCA9IDA7XG5cdFx0dGhpcy5saWdodC5hbWJpZW50Q29sb3IgPSAweEZGRkZGRjtcblx0XHR0aGlzLmxpZ2h0LmRpZmZ1c2UgPSAxO1xuXHRcdHRoaXMubGlnaHQuc3BlY3VsYXIgPSAxO1xuXG5cdFx0dGhpcy5saWdodEIgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgpO1xuXHRcdHRoaXMubGlnaHRCLmNvbG9yID0gMHhGRjAwMDA7XG5cdFx0dGhpcy5saWdodEIuZGlyZWN0aW9uID0gbmV3IFZlY3RvcjNEKCAtMSAsIDAgLDEgKTtcblx0XHR0aGlzLmxpZ2h0Qi5hbWJpZW50ID0gMDtcblx0XHR0aGlzLmxpZ2h0Qi5hbWJpZW50Q29sb3IgPSAweEZGRkZGRjtcblx0XHR0aGlzLmxpZ2h0Qi5kaWZmdXNlID0gMTtcblx0XHR0aGlzLmxpZ2h0Qi5zcGVjdWxhciA9IDE7XG5cblx0XHR0aGlzLnN0YXRpY0xpZ2h0UGlja2VyID0gbmV3IFN0YXRpY0xpZ2h0UGlja2VyKFt0aGlzLmxpZ2h0ICwgdGhpcy5saWdodEJdKTtcblxuXHRcdHRoaXMudmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLmxpZ2h0KTtcblx0XHR0aGlzLnZpZXcuc2NlbmUuYWRkQ2hpbGQodGhpcy5saWdodEIpO1xuXG5cdFx0dGhpcy52aWV3LmJhY2tncm91bmRDb2xvciA9IDB4MjIyMjIyO1xuXG5cdFx0d2luZG93Lm9ucmVzaXplID0gKGV2ZW50OlVJRXZlbnQpID0+IHRoaXMub25SZXNpemUoZXZlbnQpO1xuXG5cdFx0dGhpcy5pbml0TWVzaGVzKCk7XG5cdFx0dGhpcy5yYWYuc3RhcnQoKTtcblx0XHR0aGlzLm9uUmVzaXplKCk7XG5cdH1cblxuXHRwcml2YXRlIGluaXRNZXNoZXMoKTp2b2lkXG5cdHtcblxuXHRcdHZhciBwcmltaXRpdmVzOkFycmF5PFByaW1pdGl2ZVByZWZhYkJhc2U+ID0gbmV3IEFycmF5PFByaW1pdGl2ZVByZWZhYkJhc2U+KCk7XG5cdFx0dmFyIG1hdGVyaWFsOk1ldGhvZE1hdGVyaWFsID0gbmV3IE1ldGhvZE1hdGVyaWFsKERlZmF1bHRNYXRlcmlhbE1hbmFnZXIuZ2V0RGVmYXVsdFRleHR1cmUoKSk7XG5cdFx0bWF0ZXJpYWwubGlnaHRQaWNrZXIgPSB0aGlzLnN0YXRpY0xpZ2h0UGlja2VyO1xuXHRcdG1hdGVyaWFsLnNtb290aCA9IGZhbHNlO1xuXG5cdFx0cHJpbWl0aXZlcy5wdXNoKG5ldyBQcmltaXRpdmVUb3J1c1ByZWZhYigpKTtcblx0XHRwcmltaXRpdmVzLnB1c2gobmV3IFByaW1pdGl2ZVNwaGVyZVByZWZhYigpKTtcblx0XHRwcmltaXRpdmVzLnB1c2gobmV3IFByaW1pdGl2ZUNhcHN1bGVQcmVmYWIoKSk7XG5cdFx0cHJpbWl0aXZlcy5wdXNoKG5ldyBQcmltaXRpdmVDeWxpbmRlclByZWZhYigpKTtcblx0XHRwcmltaXRpdmVzLnB1c2gobmV3IFByaW1pdGl2ZVBsYW5lUHJlZmFiKCkpO1xuXHRcdHByaW1pdGl2ZXMucHVzaChuZXcgUHJpbWl0aXZlQ29uZVByZWZhYigpKTtcblx0XHRwcmltaXRpdmVzLnB1c2gobmV3IFByaW1pdGl2ZUN1YmVQcmVmYWIoKSk7XG5cblx0XHR2YXIgbWVzaDpNZXNoO1xuXG5cdFx0Zm9yICh2YXIgYzpudW1iZXIgPSAwOyBjIDwgcHJpbWl0aXZlcy5sZW5ndGg7IGMgKyspIHtcblx0XHRcdHByaW1pdGl2ZXNbY10ubWF0ZXJpYWwgPSBtYXRlcmlhbDtcblxuXHRcdFx0dmFyIHQ6bnVtYmVyID0gTWF0aC5QSSoyKmMvcHJpbWl0aXZlcy5sZW5ndGg7XG5cblx0XHRcdG1lc2ggPSA8TWVzaD4gcHJpbWl0aXZlc1tjXS5nZXROZXdPYmplY3QoKTtcblx0XHRcdG1lc2gueCA9IE1hdGguY29zKHQpKnRoaXMucmFkaXVzO1xuXHRcdFx0bWVzaC55ID0gTWF0aC5zaW4odCkqdGhpcy5yYWRpdXM7XG5cdFx0XHRtZXNoLnogPSAwO1xuXHRcdFx0bWVzaC50cmFuc2Zvcm0uc2NhbGUgPSBuZXcgVmVjdG9yM0QoMiwgMiwgMik7XG5cblx0XHRcdHRoaXMudmlldy5zY2VuZS5hZGRDaGlsZChtZXNoKTtcblx0XHRcdHRoaXMubWVzaGVzLnB1c2gobWVzaCk7XG5cdFx0fVxuXG5cblx0fVxuXG5cdHByaXZhdGUgcmVuZGVyKClcblx0e1xuXHRcdGlmICh0aGlzLm1lc2hlcylcblx0XHRcdGZvciAodmFyIGM6bnVtYmVyID0gMDsgYyA8IHRoaXMubWVzaGVzLmxlbmd0aDsgYysrKVxuXHRcdFx0XHR0aGlzLm1lc2hlc1tjXS5yb3RhdGlvblkgKz0gMTtcblxuXHRcdHRoaXMudmlldy5yZW5kZXIoKTtcblx0fVxuXG5cdHB1YmxpYyBvblJlc2l6ZShldmVudDpVSUV2ZW50ID0gbnVsbClcblx0e1xuXHRcdHRoaXMudmlldy55ID0gMDtcblx0XHR0aGlzLnZpZXcueCA9IDA7XG5cblx0XHR0aGlzLnZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLnZpZXcuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHR9XG59Il19