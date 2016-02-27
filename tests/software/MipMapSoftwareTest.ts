import Vector3D                        = require("awayjs-core/lib/geom/Vector3D");
import Sampler2D					= require("awayjs-core/lib/image/Sampler2D");
import URLLoaderEvent				= require("awayjs-core/lib/events/URLLoaderEvent");
import RequestAnimationFrame        = require("awayjs-core/lib/utils/RequestAnimationFrame");
import Debug                        = require("awayjs-core/lib/utils/Debug");

import View                            = require("awayjs-display/lib/View");
import Sprite                            = require("awayjs-display/lib/display/Sprite");
import DirectionalLight                = require("awayjs-display/lib/display/DirectionalLight");
import DefaultMaterialManager        = require("awayjs-display/lib/managers/DefaultMaterialManager");
import StaticLightPicker            = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
import PrimitivePrefabBase            = require("awayjs-display/lib/prefabs/PrimitivePrefabBase");
import PrimitiveCapsulePrefab        = require("awayjs-display/lib/prefabs/PrimitiveCapsulePrefab");
import PrimitiveConePrefab            = require("awayjs-display/lib/prefabs/PrimitiveConePrefab");
import PrimitiveCubePrefab            = require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
import PrimitiveCylinderPrefab        = require("awayjs-display/lib/prefabs/PrimitiveCylinderPrefab");
import PrimitivePlanePrefab            = require("awayjs-display/lib/prefabs/PrimitivePlanePrefab");
import PrimitiveSpherePrefab        = require("awayjs-display/lib/prefabs/PrimitiveSpherePrefab");
import PrimitiveTorusPrefab            = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");

import DefaultRenderer                = require("awayjs-renderergl/lib/DefaultRenderer");

import MethodMaterial                = require("awayjs-methodmaterials/lib/MethodMaterial");
import BasicMaterial                = require("awayjs-display/lib/materials/BasicMaterial");
import URLLoader					= require("awayjs-core/lib/net/URLLoader");
import URLLoaderDataFormat			= require("awayjs-core/lib/net/URLLoaderDataFormat");
import URLRequest					= require("awayjs-core/lib/net/URLRequest");
import ParserUtils					= require("awayjs-core/lib/parsers/ParserUtils");
import ElementsType                 = require("awayjs-display/lib/graphics/ElementsType");

class MipMapSoftwareTest {

    private view:View;
    private raf:RequestAnimationFrame;
    private pngLoader   : URLLoader;
    private image:HTMLImageElement;

    constructor() {

        var pngURLRequest:URLRequest = new URLRequest('assets/dots.png');

        this.pngLoader = new URLLoader();
        this.pngLoader.dataFormat = URLLoaderDataFormat.BLOB;
        this.pngLoader.addEventListener(URLLoaderEvent.LOAD_COMPLETE, (event:URLLoaderEvent) => this.pngLoaderComplete(event));
        this.pngLoader.load(pngURLRequest);
    }

    private pngLoaderComplete(event:URLLoaderEvent) {
        var imageLoader:URLLoader = event.target;
        this.image = ParserUtils.blobToImage(imageLoader.data);
        this.image.onload = (event) => this.onLoadComplete(event);
    }

    private onLoadComplete(event) {
        Debug.LOG_PI_ERRORS = false;
        Debug.THROW_ERRORS = false;

        var defaultRenderer:DefaultRenderer = new DefaultRenderer(null, false, "baseline", "software");
        defaultRenderer.antiAlias = 2;
        this.view = new View(defaultRenderer);
        //this.view = new View(new DefaultRenderer(null, false, "baseline"));
        this.raf = new RequestAnimationFrame(this.render, this);

        this.view.backgroundColor = 0x222222;

        window.onresize = (event:UIEvent) => this.onResize(event);

        this.initSpritees();
        this.raf.start();
        this.onResize();
    }

    private initSpritees():void {
        //var material:BasicMaterial = new BasicMaterial(DefaultMaterialManager.getDefaultTexture());
        var material:BasicMaterial = new BasicMaterial(ParserUtils.imageToBitmapImage2D(this.image));
        material.style.sampler = new Sampler2D(true, true, true);
        var plane:PrimitivePlanePrefab = new PrimitivePlanePrefab(material, ElementsType.TRIANGLE, 1000,1000,1000);
        //var plane:PrimitiveCubePrefab = new PrimitiveCubePrefab();
        plane.material = material;

        var sprite:Sprite = <Sprite>plane.getNewObject();
        sprite.y = -100;
        this.view.scene.addChild(sprite);
    }

    private c:number = 100;

    private render() {
        if (this.c > 10) {
            this.c = 0;
            this.view.render();
        }
        this.c++;
    }

    public onResize(event:UIEvent = null) {
        this.view.y = 0;
        this.view.x = 0;

        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    }
}