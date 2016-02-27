import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import Sampler2D					= require("awayjs-core/lib/image/Sampler2D");
import URLLoaderEvent				= require("awayjs-core/lib/events/URLLoaderEvent");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");
import Debug						= require("awayjs-core/lib/utils/Debug");

import View							= require("awayjs-display/lib/View");
import Sprite						= require("awayjs-display/lib/display/Sprite");
import DirectionalLight				= require("awayjs-display/lib/display/DirectionalLight");
import DefaultMaterialManager		= require("awayjs-display/lib/managers/DefaultMaterialManager");
import StaticLightPicker			= require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
import PrimitivePrefabBase			= require("awayjs-display/lib/prefabs/PrimitivePrefabBase");
import PrimitiveCapsulePrefab		= require("awayjs-display/lib/prefabs/PrimitiveCapsulePrefab");
import PrimitiveConePrefab			= require("awayjs-display/lib/prefabs/PrimitiveConePrefab");
import PrimitiveCubePrefab			= require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
import PrimitiveCylinderPrefab		= require("awayjs-display/lib/prefabs/PrimitiveCylinderPrefab");
import PrimitivePlanePrefab			= require("awayjs-display/lib/prefabs/PrimitivePlanePrefab");
import PrimitiveSpherePrefab		= require("awayjs-display/lib/prefabs/PrimitiveSpherePrefab");
import PrimitiveTorusPrefab			= require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");

import DefaultRenderer				= require("awayjs-renderergl/lib/DefaultRenderer");

import MethodMaterial				= require("awayjs-methodmaterials/lib/MethodMaterial");

class PrimitivesTest
{

	private view:View;
	private raf:RequestAnimationFrame;
	private sprites:Array<Sprite> = new Array<Sprite>();
	private light:DirectionalLight;
	private lightB:DirectionalLight;
	private staticLightPicker:StaticLightPicker;
	private radius:number = 400;

	constructor()
	{

		Debug.LOG_PI_ERRORS    = false;
		Debug.THROW_ERRORS     = false;

		this.view = new View(new DefaultRenderer());
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
		this.lightB.direction = new Vector3D( -1 , 0 ,1 );
		this.lightB.ambient = 0;
		this.lightB.ambientColor = 0xFFFFFF;
		this.lightB.diffuse = 1;
		this.lightB.specular = 1;

		this.staticLightPicker = new StaticLightPicker([this.light , this.lightB]);

		this.view.scene.addChild(this.light);
		this.view.scene.addChild(this.lightB);

		this.view.backgroundColor = 0x222222;

		window.onresize = (event:UIEvent) => this.onResize(event);

		this.initSpritees();
		this.raf.start();
		this.onResize();
	}

	private initSpritees():void
	{

		var primitives:Array<PrimitivePrefabBase> = new Array<PrimitivePrefabBase>();
		var material:MethodMaterial = new MethodMaterial(DefaultMaterialManager.getDefaultImage2D());
		material.style.sampler = new Sampler2D(false, false, true);
		material.lightPicker = this.staticLightPicker;

		primitives.push(new PrimitiveTorusPrefab());
		primitives.push(new PrimitiveSpherePrefab());
		primitives.push(new PrimitiveCapsulePrefab());
		primitives.push(new PrimitiveCylinderPrefab());
		primitives.push(new PrimitivePlanePrefab());
		primitives.push(new PrimitiveConePrefab());
		primitives.push(new PrimitiveCubePrefab());

		var sprite:Sprite;

		for (var c:number = 0; c < primitives.length; c ++) {
			primitives[c].material = material;

			var t:number = Math.PI*2*c/primitives.length;

			sprite = <Sprite> primitives[c].getNewObject();
			sprite.x = Math.cos(t)*this.radius;
			sprite.y = Math.sin(t)*this.radius;
			sprite.z = 0;
			sprite.transform.scaleTo(2, 2, 2);

			this.view.scene.addChild(sprite);
			this.sprites.push(sprite);
		}


	}

	private render()
	{
		if (this.sprites)
			for (var c:number = 0; c < this.sprites.length; c++)
				this.sprites[c].rotationY += 1;

		this.view.render();
	}

	public onResize(event:UIEvent = null)
	{
		this.view.y = 0;
		this.view.x = 0;

		this.view.width = window.innerWidth;
		this.view.height = window.innerHeight;
	}
}