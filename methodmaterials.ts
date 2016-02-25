import SurfacePool					= require("awayjs-renderergl/lib/surfaces/SurfacePool");

import MethodMaterial				= require("awayjs-methodmaterials/lib/MethodMaterial");
import GL_MethodMaterialSurface		= require("awayjs-methodmaterials/lib/surfaces/GL_MethodMaterialSurface");

SurfacePool.registerAbstraction(GL_MethodMaterialSurface, MethodMaterial);



/**
 *
 * static shim
 */
class methodmaterials
{

}

export = methodmaterials;