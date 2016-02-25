var Sampler2D = require("awayjs-core/lib/image/Sampler2D");
var URLLoader = require("awayjs-core/lib/net/URLLoader");
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var URLLoaderEvent = require("awayjs-core/lib/events/URLLoaderEvent");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var View = require("awayjs-display/lib/View");
var PointLight = require("awayjs-display/lib/display/PointLight");
var StaticLightPicker = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
var PrimitiveTorusPrefab = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
var DefaultRenderer = require("awayjs-renderergl/lib/DefaultRenderer");
var MethodMaterial = require("awayjs-methodmaterials/lib/MethodMaterial");
var ElementsType = require("awayjs-display/lib/graphics/ElementsType");
var TorusObject3DDemo = (function () {
    function TorusObject3DDemo() {
        var _this = this;
        this.t = 0;
        this.tPos = 0;
        this.radius = 1000;
        this.follow = true;
        Debug.THROW_ERRORS = false;
        Debug.LOG_PI_ERRORS = false;
        this.meshes = new Array();
        this.light = new PointLight();
        this.view = new View(new DefaultRenderer());
        this.pointLight = new PointLight();
        this.lightPicker = new StaticLightPicker([this.pointLight]);
        this.view.scene.addChild(this.pointLight);
        var perspectiveLens = this.view.camera.projection;
        perspectiveLens.fieldOfView = 75;
        this.view.camera.z = 0;
        this.view.backgroundColor = 0x000000;
        this.view.backgroundAlpha = 1;
        this.view.scene.addChild(this.light);
        this.raf = new RequestAnimationFrame(this.tick, this);
        this.raf.start();
        this.onResize();
        document.onmousedown = function (event) { return _this.followObject(event); };
        window.onresize = function (event) { return _this.onResize(event); };
        this.loadResources();
    }
    TorusObject3DDemo.prototype.loadResources = function () {
        var _this = this;
        var urlRequest = new URLRequest("assets/custom_uv_horizontal.png");
        var urlLoader = new URLLoader();
        urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
        urlLoader.addEventListener(URLLoaderEvent.LOAD_COMPLETE, function (event) { return _this.imageCompleteHandler(event); });
        urlLoader.load(urlRequest);
    };
    TorusObject3DDemo.prototype.imageCompleteHandler = function (event) {
        var _this = this;
        var urlLoader = event.target;
        this._image = ParserUtils.blobToImage(urlLoader.data);
        this._image.onload = function (event) { return _this.onImageLoadComplete(event); };
    };
    TorusObject3DDemo.prototype.onImageLoadComplete = function (event) {
        var matTx = new MethodMaterial(ParserUtils.imageToBitmapImage2D(this._image));
        matTx.style.sampler = new Sampler2D(true, true, true);
        matTx.lightPicker = this.lightPicker;
        var torus = new PrimitiveTorusPrefab(matTx, ElementsType.TRIANGLE, 150, 50, 32, 32, false);
        var l = 10;
        for (var c = 0; c < l; c++) {
            var t = Math.PI * 2 * c / l;
            var mesh = torus.getNewObject();
            mesh.x = Math.cos(t) * this.radius;
            mesh.y = 0;
            mesh.z = Math.sin(t) * this.radius;
            this.view.scene.addChild(mesh);
            this.meshes.push(mesh);
        }
    };
    TorusObject3DDemo.prototype.tick = function (dt) {
        this.tPos += .02;
        for (var c = 0; c < this.meshes.length; c++) {
            var objPos = Math.PI * 2 * c / this.meshes.length;
            this.t += .005;
            var s = 1.2 + Math.sin(this.t + objPos);
            this.meshes[c].rotationY += 2 * (c / this.meshes.length);
            this.meshes[c].rotationX += 2 * (c / this.meshes.length);
            this.meshes[c].rotationZ += 2 * (c / this.meshes.length);
            this.meshes[c].scaleX = this.meshes[c].scaleY = this.meshes[c].scaleZ = s;
            this.meshes[c].x = Math.cos(objPos + this.tPos) * this.radius;
            this.meshes[c].y = Math.sin(this.t) * 500;
            this.meshes[c].z = Math.sin(objPos + this.tPos) * this.radius;
            if (this.follow && c == 0)
                this.view.camera.lookAt(this.meshes[c].transform.position);
        }
        //this.view.camera.y = Math.sin( this.tPos ) * 1500;
        this.view.camera.y = Math.sin(this.tPos) * 1500;
        this.view.render();
    };
    TorusObject3DDemo.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this.view.y = 0;
        this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    };
    TorusObject3DDemo.prototype.followObject = function (e) {
        this.follow = !this.follow;
    };
    return TorusObject3DDemo;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdDNkL1RvcnVzT2JqZWN0M0REZW1vLnRzIl0sIm5hbWVzIjpbIlRvcnVzT2JqZWN0M0REZW1vIiwiVG9ydXNPYmplY3QzRERlbW8uY29uc3RydWN0b3IiLCJUb3J1c09iamVjdDNERGVtby5sb2FkUmVzb3VyY2VzIiwiVG9ydXNPYmplY3QzRERlbW8uaW1hZ2VDb21wbGV0ZUhhbmRsZXIiLCJUb3J1c09iamVjdDNERGVtby5vbkltYWdlTG9hZENvbXBsZXRlIiwiVG9ydXNPYmplY3QzRERlbW8udGljayIsIlRvcnVzT2JqZWN0M0REZW1vLm9uUmVzaXplIiwiVG9ydXNPYmplY3QzRERlbW8uZm9sbG93T2JqZWN0Il0sIm1hcHBpbmdzIjoiQUFDQSxJQUFPLFNBQVMsV0FBZSxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ2xFLElBQU8sU0FBUyxXQUFlLCtCQUErQixDQUFDLENBQUM7QUFDaEUsSUFBTyxtQkFBbUIsV0FBYSx5Q0FBeUMsQ0FBQyxDQUFDO0FBQ2xGLElBQU8sVUFBVSxXQUFlLGdDQUFnQyxDQUFDLENBQUM7QUFDbEUsSUFBTyxjQUFjLFdBQWMsdUNBQXVDLENBQUMsQ0FBQztBQUM1RSxJQUFPLFdBQVcsV0FBZSxxQ0FBcUMsQ0FBQyxDQUFDO0FBRXhFLElBQU8scUJBQXFCLFdBQVksNkNBQTZDLENBQUMsQ0FBQztBQUN2RixJQUFPLEtBQUssV0FBZ0IsNkJBQTZCLENBQUMsQ0FBQztBQUUzRCxJQUFPLElBQUksV0FBaUIseUJBQXlCLENBQUMsQ0FBQztBQUV2RCxJQUFPLFVBQVUsV0FBZSx1Q0FBdUMsQ0FBQyxDQUFDO0FBQ3pFLElBQU8saUJBQWlCLFdBQWEsNkRBQTZELENBQUMsQ0FBQztBQUNwRyxJQUFPLG9CQUFvQixXQUFhLGlEQUFpRCxDQUFDLENBQUM7QUFHM0YsSUFBTyxlQUFlLFdBQWMsdUNBQXVDLENBQUMsQ0FBQztBQUU3RSxJQUFPLGNBQWMsV0FBYywyQ0FBMkMsQ0FBQyxDQUFDO0FBQ2hGLElBQU8sWUFBWSxXQUFXLDBDQUEwQyxDQUFDLENBQUM7QUFFMUUsSUFBTSxpQkFBaUI7SUFrQnRCQSxTQWxCS0EsaUJBQWlCQTtRQUF2QkMsaUJBeUlDQTtRQWpJUUEsTUFBQ0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDYkEsU0FBSUEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDaEJBLFdBQU1BLEdBQVVBLElBQUlBLENBQUNBO1FBQ3JCQSxXQUFNQSxHQUFXQSxJQUFJQSxDQUFDQTtRQVM3QkEsS0FBS0EsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDM0JBLEtBQUtBLENBQUNBLGFBQWFBLEdBQUdBLEtBQUtBLENBQUNBO1FBRTVCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxLQUFLQSxFQUFRQSxDQUFDQTtRQUNoQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDOUJBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLGVBQWVBLEVBQUVBLENBQUNBLENBQUNBO1FBQzVDQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxJQUFJQSxVQUFVQSxFQUFFQSxDQUFDQTtRQUNuQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsaUJBQWlCQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUU1REEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFFMUNBLElBQUlBLGVBQWVBLEdBQWlEQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUNoR0EsZUFBZUEsQ0FBQ0EsV0FBV0EsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFFakNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3ZCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUNyQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFOUJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBRXJDQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxJQUFJQSxxQkFBcUJBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBQ3REQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUNqQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7UUFFaEJBLFFBQVFBLENBQUNBLFdBQVdBLEdBQUdBLFVBQUNBLEtBQWdCQSxJQUFLQSxPQUFBQSxLQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUF4QkEsQ0FBd0JBLENBQUNBO1FBRXRFQSxNQUFNQSxDQUFDQSxRQUFRQSxHQUFHQSxVQUFDQSxLQUFhQSxJQUFLQSxPQUFBQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUFwQkEsQ0FBb0JBLENBQUNBO1FBRTFEQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtJQUN0QkEsQ0FBQ0E7SUFFT0QseUNBQWFBLEdBQXJCQTtRQUFBRSxpQkFPQ0E7UUFMQUEsSUFBSUEsVUFBVUEsR0FBY0EsSUFBSUEsVUFBVUEsQ0FBQ0EsaUNBQWlDQSxDQUFDQSxDQUFDQTtRQUM5RUEsSUFBSUEsU0FBU0EsR0FBYUEsSUFBSUEsU0FBU0EsRUFBRUEsQ0FBQ0E7UUFDMUNBLFNBQVNBLENBQUNBLFVBQVVBLEdBQUdBLG1CQUFtQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDaERBLFNBQVNBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsYUFBYUEsRUFBRUEsVUFBQ0EsS0FBb0JBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBaENBLENBQWdDQSxDQUFDQSxDQUFDQTtRQUNySEEsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7SUFDNUJBLENBQUNBO0lBRU9GLGdEQUFvQkEsR0FBNUJBLFVBQTZCQSxLQUFvQkE7UUFBakRHLGlCQU9DQTtRQUxBQSxJQUFJQSxTQUFTQSxHQUFhQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUV2Q0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsV0FBV0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDdERBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLFVBQUNBLEtBQVdBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBL0JBLENBQStCQSxDQUFDQTtJQUV2RUEsQ0FBQ0E7SUFFT0gsK0NBQW1CQSxHQUEzQkEsVUFBNEJBLEtBQVdBO1FBRXRDSSxJQUFJQSxLQUFLQSxHQUFrQkEsSUFBSUEsY0FBY0EsQ0FBQ0EsV0FBV0EsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM3RkEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDdERBLEtBQUtBLENBQUNBLFdBQVdBLEdBQUlBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1FBRXRDQSxJQUFJQSxLQUFLQSxHQUF3QkEsSUFBSUEsb0JBQW9CQSxDQUFDQSxLQUFLQSxFQUFFQSxZQUFZQSxDQUFDQSxRQUFRQSxFQUFFQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUVoSEEsSUFBSUEsQ0FBQ0EsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFHbEJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQVlBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUdBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBRXRDQSxJQUFJQSxDQUFDQSxHQUFVQSxJQUFJQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUVuQ0EsSUFBSUEsSUFBSUEsR0FBZUEsS0FBS0EsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7WUFDNUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1lBQ2pDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUVqQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBRXhCQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUVPSixnQ0FBSUEsR0FBWkEsVUFBYUEsRUFBU0E7UUFFckJLLElBQUlBLENBQUNBLElBQUlBLElBQUlBLEdBQUdBLENBQUNBO1FBRWpCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFHQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxFQUFHQSxDQUFDQSxFQUFHQSxFQUFFQSxDQUFDQTtZQUN2REEsSUFBSUEsTUFBTUEsR0FBUUEsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFFakRBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBO1lBQ2ZBLElBQUlBLENBQUNBLEdBQVVBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBO1lBRS9DQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxTQUFTQSxJQUFJQSxDQUFDQSxHQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtZQUNyREEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsSUFBSUEsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDckRBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFNBQVNBLElBQUlBLENBQUNBLEdBQUNBLENBQUNBLENBQUNBLEdBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1lBQ3JEQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUMxRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDNURBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEdBQUNBLEdBQUdBLENBQUNBO1lBQ3hDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUU1REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUM3REEsQ0FBQ0E7UUFFREEsQUFFQUEsb0RBRm9EQTtRQUVwREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFFaERBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO0lBQ3BCQSxDQUFDQTtJQUVNTCxvQ0FBUUEsR0FBZkEsVUFBZ0JBLEtBQW9CQTtRQUFwQk0scUJBQW9CQSxHQUFwQkEsWUFBb0JBO1FBRW5DQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNoQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFaEJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBO1FBQ3BDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQTtJQUN2Q0EsQ0FBQ0E7SUFFTU4sd0NBQVlBLEdBQW5CQSxVQUFvQkEsQ0FBQ0E7UUFFcEJPLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO0lBQzVCQSxDQUFDQTtJQUNGUCx3QkFBQ0E7QUFBREEsQ0F6SUEsQUF5SUNBLElBQUEiLCJmaWxlIjoib2JqZWN0M2QvVG9ydXNPYmplY3QzRERlbW8uanMiLCJzb3VyY2VSb290IjoiLi90ZXN0cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCaXRtYXBJbWFnZTJEXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvaW1hZ2UvQml0bWFwSW1hZ2UyRFwiKTtcbmltcG9ydCBTYW1wbGVyMkRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2ltYWdlL1NhbXBsZXIyRFwiKTtcbmltcG9ydCBVUkxMb2FkZXJcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxMb2FkZXJcIik7XG5pbXBvcnQgVVJMTG9hZGVyRGF0YUZvcm1hdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMTG9hZGVyRGF0YUZvcm1hdFwiKTtcbmltcG9ydCBVUkxSZXF1ZXN0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMUmVxdWVzdFwiKTtcbmltcG9ydCBVUkxMb2FkZXJFdmVudFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9VUkxMb2FkZXJFdmVudFwiKTtcbmltcG9ydCBQYXJzZXJVdGlsc1x0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJVdGlsc1wiKTtcbmltcG9ydCBQZXJzcGVjdGl2ZVByb2plY3Rpb25cdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3Byb2plY3Rpb25zL1BlcnNwZWN0aXZlUHJvamVjdGlvblwiKTtcbmltcG9ydCBSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL1JlcXVlc3RBbmltYXRpb25GcmFtZVwiKTtcbmltcG9ydCBEZWJ1Z1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9EZWJ1Z1wiKTtcblxuaW1wb3J0IFZpZXdcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9WaWV3XCIpO1xuaW1wb3J0IE1lc2hcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9kaXNwbGF5L01lc2hcIik7XG5pbXBvcnQgUG9pbnRMaWdodFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZGlzcGxheS9Qb2ludExpZ2h0XCIpO1xuaW1wb3J0IFN0YXRpY0xpZ2h0UGlja2VyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9saWdodHBpY2tlcnMvU3RhdGljTGlnaHRQaWNrZXJcIik7XG5pbXBvcnQgUHJpbWl0aXZlVG9ydXNQcmVmYWJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVUb3J1c1ByZWZhYlwiKTtcbmltcG9ydCBTaW5nbGUyRFRleHR1cmVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi90ZXh0dXJlcy9TaW5nbGUyRFRleHR1cmVcIik7XG5cbmltcG9ydCBEZWZhdWx0UmVuZGVyZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9EZWZhdWx0UmVuZGVyZXJcIik7XG5cbmltcG9ydCBNZXRob2RNYXRlcmlhbFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLW1ldGhvZG1hdGVyaWFscy9saWIvTWV0aG9kTWF0ZXJpYWxcIik7XG5pbXBvcnQgRWxlbWVudHNUeXBlID0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9ncmFwaGljcy9FbGVtZW50c1R5cGVcIik7XG5cbmNsYXNzIFRvcnVzT2JqZWN0M0REZW1vXG57XG5cdHByaXZhdGUgdmlldzpWaWV3O1xuXG5cdHByaXZhdGUgbGlnaHQ6UG9pbnRMaWdodDtcblx0cHJpdmF0ZSByYWY6UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHRwcml2YXRlIG1lc2hlczpBcnJheTxNZXNoPjtcblxuXHRwcml2YXRlIHQ6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSB0UG9zOm51bWJlciA9IDA7XG5cdHByaXZhdGUgcmFkaXVzOm51bWJlciA9IDEwMDA7XG5cdHByaXZhdGUgZm9sbG93OmJvb2xlYW4gPSB0cnVlO1xuXG5cdHByaXZhdGUgcG9pbnRMaWdodDpQb2ludExpZ2h0O1xuXHRwcml2YXRlIGxpZ2h0UGlja2VyOlN0YXRpY0xpZ2h0UGlja2VyO1xuXG5cdHByaXZhdGUgX2ltYWdlOkhUTUxJbWFnZUVsZW1lbnQ7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0RGVidWcuVEhST1dfRVJST1JTID0gZmFsc2U7XG5cdFx0RGVidWcuTE9HX1BJX0VSUk9SUyA9IGZhbHNlO1xuXG5cdFx0dGhpcy5tZXNoZXMgPSBuZXcgQXJyYXk8TWVzaD4oKTtcblx0XHR0aGlzLmxpZ2h0ID0gbmV3IFBvaW50TGlnaHQoKTtcblx0XHR0aGlzLnZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKCkpO1xuXHRcdHRoaXMucG9pbnRMaWdodCA9IG5ldyBQb2ludExpZ2h0KCk7XG5cdFx0dGhpcy5saWdodFBpY2tlciA9IG5ldyBTdGF0aWNMaWdodFBpY2tlcihbdGhpcy5wb2ludExpZ2h0XSk7XG5cblx0XHR0aGlzLnZpZXcuc2NlbmUuYWRkQ2hpbGQodGhpcy5wb2ludExpZ2h0KTtcblxuXHRcdHZhciBwZXJzcGVjdGl2ZUxlbnM6UGVyc3BlY3RpdmVQcm9qZWN0aW9uID0gPFBlcnNwZWN0aXZlUHJvamVjdGlvbj4gdGhpcy52aWV3LmNhbWVyYS5wcm9qZWN0aW9uO1xuXHRcdHBlcnNwZWN0aXZlTGVucy5maWVsZE9mVmlldyA9IDc1O1xuXG5cdFx0dGhpcy52aWV3LmNhbWVyYS56ID0gMDtcblx0XHR0aGlzLnZpZXcuYmFja2dyb3VuZENvbG9yID0gMHgwMDAwMDA7XG5cdFx0dGhpcy52aWV3LmJhY2tncm91bmRBbHBoYSA9IDE7XG5cblx0XHR0aGlzLnZpZXcuc2NlbmUuYWRkQ2hpbGQodGhpcy5saWdodCk7XG5cblx0XHR0aGlzLnJhZiA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLCB0aGlzKTtcblx0XHR0aGlzLnJhZi5zdGFydCgpO1xuXHRcdHRoaXMub25SZXNpemUoKTtcblxuXHRcdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gKGV2ZW50Ok1vdXNlRXZlbnQpID0+IHRoaXMuZm9sbG93T2JqZWN0KGV2ZW50KTtcblxuXHRcdHdpbmRvdy5vbnJlc2l6ZSA9IChldmVudDpVSUV2ZW50KSA9PiB0aGlzLm9uUmVzaXplKGV2ZW50KTtcblxuXHRcdHRoaXMubG9hZFJlc291cmNlcygpO1xuXHR9XG5cblx0cHJpdmF0ZSBsb2FkUmVzb3VyY2VzKClcblx0e1xuXHRcdHZhciB1cmxSZXF1ZXN0OlVSTFJlcXVlc3QgPSBuZXcgVVJMUmVxdWVzdChcImFzc2V0cy9jdXN0b21fdXZfaG9yaXpvbnRhbC5wbmdcIik7XG5cdFx0dmFyIHVybExvYWRlcjpVUkxMb2FkZXIgPSBuZXcgVVJMTG9hZGVyKCk7XG5cdFx0dXJsTG9hZGVyLmRhdGFGb3JtYXQgPSBVUkxMb2FkZXJEYXRhRm9ybWF0LkJMT0I7XG5cdFx0dXJsTG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoVVJMTG9hZGVyRXZlbnQuTE9BRF9DT01QTEVURSwgKGV2ZW50OlVSTExvYWRlckV2ZW50KSA9PiB0aGlzLmltYWdlQ29tcGxldGVIYW5kbGVyKGV2ZW50KSk7XG5cdFx0dXJsTG9hZGVyLmxvYWQodXJsUmVxdWVzdCk7XG5cdH1cblxuXHRwcml2YXRlIGltYWdlQ29tcGxldGVIYW5kbGVyKGV2ZW50OlVSTExvYWRlckV2ZW50KVxuXHR7XG5cdFx0dmFyIHVybExvYWRlcjpVUkxMb2FkZXIgPSBldmVudC50YXJnZXQ7XG5cblx0XHR0aGlzLl9pbWFnZSA9IFBhcnNlclV0aWxzLmJsb2JUb0ltYWdlKHVybExvYWRlci5kYXRhKTtcblx0XHR0aGlzLl9pbWFnZS5vbmxvYWQgPSAoZXZlbnQ6RXZlbnQpID0+IHRoaXMub25JbWFnZUxvYWRDb21wbGV0ZShldmVudCk7XG5cblx0fVxuXG5cdHByaXZhdGUgb25JbWFnZUxvYWRDb21wbGV0ZShldmVudDpFdmVudClcblx0e1xuXHRcdHZhciBtYXRUeDpNZXRob2RNYXRlcmlhbCA9IG5ldyBNZXRob2RNYXRlcmlhbChQYXJzZXJVdGlscy5pbWFnZVRvQml0bWFwSW1hZ2UyRCh0aGlzLl9pbWFnZSkpO1xuXHRcdG1hdFR4LnN0eWxlLnNhbXBsZXIgPSBuZXcgU2FtcGxlcjJEKHRydWUsIHRydWUsIHRydWUpO1xuXHRcdG1hdFR4LmxpZ2h0UGlja2VyID0gIHRoaXMubGlnaHRQaWNrZXI7XG5cblx0XHR2YXIgdG9ydXM6UHJpbWl0aXZlVG9ydXNQcmVmYWIgPSBuZXcgUHJpbWl0aXZlVG9ydXNQcmVmYWIobWF0VHgsIEVsZW1lbnRzVHlwZS5UUklBTkdMRSwgMTUwLCA1MCwgMzIsIDMyLCBmYWxzZSk7XG5cblx0XHR2YXIgbDpudW1iZXIgPSAxMDtcblx0XHQvL3ZhciByYWRpdXM6bnVtYmVyID0gMTAwMDtcblxuXHRcdGZvciAodmFyIGMgOiBudW1iZXIgPSAwOyBjIDwgbCA7IGMrKykge1xuXG5cdFx0XHR2YXIgdCA6IG51bWJlcj1NYXRoLlBJICogMiAqIGMgLyBsO1xuXG5cdFx0XHR2YXIgbWVzaDpNZXNoID0gPE1lc2g+IHRvcnVzLmdldE5ld09iamVjdCgpO1xuXHRcdFx0bWVzaC54ID0gTWF0aC5jb3ModCkqdGhpcy5yYWRpdXM7XG5cdFx0XHRtZXNoLnkgPSAwO1xuXHRcdFx0bWVzaC56ID0gTWF0aC5zaW4odCkqdGhpcy5yYWRpdXM7XG5cblx0XHRcdHRoaXMudmlldy5zY2VuZS5hZGRDaGlsZChtZXNoKTtcblx0XHRcdHRoaXMubWVzaGVzLnB1c2gobWVzaCk7XG5cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHRpY2soZHQ6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy50UG9zICs9IC4wMjtcblxuXHRcdGZvciAodmFyIGM6bnVtYmVyID0gMCA7IGMgPCB0aGlzLm1lc2hlcy5sZW5ndGggOyBjICsrKSB7XG5cdFx0XHR2YXIgb2JqUG9zOm51bWJlcj1NYXRoLlBJKjIqYy90aGlzLm1lc2hlcy5sZW5ndGg7XG5cblx0XHRcdHRoaXMudCArPSAuMDA1O1xuXHRcdFx0dmFyIHM6bnVtYmVyID0gMS4yICsgTWF0aC5zaW4odGhpcy50ICsgb2JqUG9zKTtcblxuXHRcdFx0dGhpcy5tZXNoZXNbY10ucm90YXRpb25ZICs9IDIqKGMvdGhpcy5tZXNoZXMubGVuZ3RoKTtcblx0XHRcdHRoaXMubWVzaGVzW2NdLnJvdGF0aW9uWCArPSAyKihjL3RoaXMubWVzaGVzLmxlbmd0aCk7XG5cdFx0XHR0aGlzLm1lc2hlc1tjXS5yb3RhdGlvblogKz0gMiooYy90aGlzLm1lc2hlcy5sZW5ndGgpO1xuXHRcdFx0dGhpcy5tZXNoZXNbY10uc2NhbGVYID0gdGhpcy5tZXNoZXNbY10uc2NhbGVZID0gdGhpcy5tZXNoZXNbY10uc2NhbGVaID0gcztcblx0XHRcdHRoaXMubWVzaGVzW2NdLnggPSBNYXRoLmNvcyhvYmpQb3MgKyB0aGlzLnRQb3MpKnRoaXMucmFkaXVzO1xuXHRcdFx0dGhpcy5tZXNoZXNbY10ueSA9IE1hdGguc2luKHRoaXMudCkqNTAwO1xuXHRcdFx0dGhpcy5tZXNoZXNbY10ueiA9IE1hdGguc2luKG9ialBvcyArIHRoaXMudFBvcykqdGhpcy5yYWRpdXM7XG5cblx0XHRcdGlmICh0aGlzLmZvbGxvdyAmJiBjID09IDApXG5cdFx0XHRcdHRoaXMudmlldy5jYW1lcmEubG9va0F0KHRoaXMubWVzaGVzW2NdLnRyYW5zZm9ybS5wb3NpdGlvbik7XG5cdFx0fVxuXG5cdFx0Ly90aGlzLnZpZXcuY2FtZXJhLnkgPSBNYXRoLnNpbiggdGhpcy50UG9zICkgKiAxNTAwO1xuXG5cdFx0dGhpcy52aWV3LmNhbWVyYS55ID0gTWF0aC5zaW4odGhpcy50UG9zKSAqIDE1MDA7XG5cblx0XHR0aGlzLnZpZXcucmVuZGVyKCk7XG5cdH1cblxuXHRwdWJsaWMgb25SZXNpemUoZXZlbnQ6VUlFdmVudCA9IG51bGwpXG5cdHtcblx0XHR0aGlzLnZpZXcueSA9IDA7XG5cdFx0dGhpcy52aWV3LnggPSAwO1xuXG5cdFx0dGhpcy52aWV3LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0dGhpcy52aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0fVxuXG5cdHB1YmxpYyBmb2xsb3dPYmplY3QoZSlcblx0e1xuXHRcdHRoaXMuZm9sbG93ID0gIXRoaXMuZm9sbG93O1xuXHR9XG59Il19