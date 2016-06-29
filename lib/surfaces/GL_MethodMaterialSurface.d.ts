import { AssetEvent } from "@awayjs/core/lib/events/AssetEvent";
import { IElementsClassGL } from "@awayjs/renderer/lib/elements/IElementsClassGL";
import { GL_SurfaceBase } from "@awayjs/renderer/lib/surfaces/GL_SurfaceBase";
import { SurfacePool } from "@awayjs/renderer/lib/surfaces/SurfacePool";
import { MethodMaterial } from "../MethodMaterial";
/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
export declare class GL_MethodMaterialSurface extends GL_SurfaceBase {
    private _material;
    private _pass;
    private _casterLightPass;
    private _nonCasterLightPasses;
    /**
     * The maximum total number of lights provided by the light picker.
     */
    private readonly numLights;
    /**
     * The amount of lights that don't cast shadows.
     */
    private readonly numNonCasters;
    /**
     * Creates a new CompiledPass object.
     *
     * @param material The material to which this pass belongs.
     */
    constructor(material: MethodMaterial, elementsClass: IElementsClassGL, pool: SurfacePool);
    /**
     * @inheritDoc
     */
    _pUpdateRender(): void;
    /**
     * Initializes all the passes and their dependent passes.
     */
    private initPasses();
    /**
     * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
     */
    private setBlendAndCompareModes();
    private initCasterLightPass();
    private removeCasterLightPass();
    private initNonCasterLightPasses();
    private removeNonCasterLightPasses();
    private removeEffectPass();
    private initEffectPass();
    /**
     * @inheritDoc
     */
    onClear(event: AssetEvent): void;
}
