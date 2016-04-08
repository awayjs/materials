import * as data					from "awayjs-methodmaterials/lib/data";
import * as methods					from "awayjs-methodmaterials/lib/methods";
import * as surfaces				from "awayjs-methodmaterials/lib/surfaces";
import MethodMaterial				from "awayjs-methodmaterials/lib/MethodMaterial";
import MethodMaterialMode			from "awayjs-methodmaterials/lib/MethodMaterialMode";

import SurfacePool					from "awayjs-renderergl/lib/surfaces/SurfacePool";

SurfacePool.registerAbstraction(surfaces.GL_MethodMaterialSurface, MethodMaterial);

export {
	data,
	methods,
	surfaces,
	MethodMaterial,
	MethodMaterialMode
}