import RenderPool					= require("awayjs-renderergl/lib/render/RenderPool");

import MethodMaterial				= require("awayjs-methodmaterials/lib/MethodMaterial");
import MethodMaterialRender			= require("awayjs-methodmaterials/lib/render/MethodMaterialRender");

RenderPool.registerAbstraction(MethodMaterialRender, MethodMaterial);



/**
 *
 * static shim
 */
class methodmaterials
{

}

export = methodmaterials;