var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var View = require("awayjs-display/lib/containers/View");
var DirectionalLight = require("awayjs-display/lib/entities/DirectionalLight");
var DefaultMaterialManager = require("awayjs-display/lib/managers/DefaultMaterialManager");
var StaticLightPicker = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
var PrimitiveCapsulePrefab = require("awayjs-display/lib/prefabs/PrimitiveCapsulePrefab");
var PrimitiveConePrefab = require("awayjs-display/lib/prefabs/PrimitiveConePrefab");
var PrimitiveCubePrefab = require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
var PrimitiveCylinderPrefab = require("awayjs-display/lib/prefabs/PrimitiveCylinderPrefab");
var PrimitivePlanePrefab = require("awayjs-display/lib/prefabs/PrimitivePlanePrefab");
var PrimitiveSpherePrefab = require("awayjs-display/lib/prefabs/PrimitiveSpherePrefab");
var PrimitiveTorusPrefab = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
var DefaultRenderer = require("awayjs-renderergl/lib/DefaultRenderer");
var MethodMaterial = require("awayjs-methodmaterials/lib/MethodMaterial");
var SoftwarePrimitivesTest = (function () {
    function SoftwarePrimitivesTest() {
        var _this = this;
        this.meshes = new Array();
        this.radius = 400;
        Debug.LOG_PI_ERRORS = false;
        Debug.THROW_ERRORS = false;
        var defaultRenderer = new DefaultRenderer(null, false, "baseline", "software");
        defaultRenderer.antiAlias = 1;
        this.view = new View(defaultRenderer);
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
        this.view.backgroundColor = 0x000000;
        window.onresize = function (event) { return _this.onResize(event); };
        this.initMeshes();
        this.raf.start();
        this.onResize();
    }
    SoftwarePrimitivesTest.prototype.initMeshes = function () {
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
    SoftwarePrimitivesTest.prototype.render = function () {
        //if (this.meshes)
        //    for (var c:number = 0; c < this.meshes.length; c++)
        //        this.meshes[c].rotationY += 1;
        this.view.render();
    };
    SoftwarePrimitivesTest.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this.view.y = 0;
        this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    };
    return SoftwarePrimitivesTest;
})();
//# sourceMappingURL=SoftwarePrimitivesTest.js.map