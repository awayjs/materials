import { IAsset } from "@awayjs/core/lib/library/IAsset";
import { LightBase } from "@awayjs/display/lib/display/LightBase";
import { ShadowMapperBase } from "@awayjs/display/lib/materials/shadowmappers/ShadowMapperBase";
import { ShadingMethodBase } from "../methods/ShadingMethodBase";
/**
 * ShadowMapMethodBase provides an abstract base method for shadow map methods.
 */
export declare class ShadowMapMethodBase extends ShadingMethodBase implements IAsset {
    static assetType: string;
    _pCastingLight: LightBase;
    _pShadowMapper: ShadowMapperBase;
    _pEpsilon: number;
    _pAlpha: number;
    /**
     * Creates a new ShadowMapMethodBase object.
     * @param castingLight The light used to cast shadows.
     */
    constructor(castingLight: LightBase);
    /**
     * @inheritDoc
     */
    readonly assetType: string;
    /**
     * The "transparency" of the shadows. This allows making shadows less strong.
     */
    alpha: number;
    /**
     * The light casting the shadows.
     */
    readonly castingLight: LightBase;
    /**
     * A small value to counter floating point precision errors when comparing values in the shadow map with the
     * calculated depth value. Increase this if shadow banding occurs, decrease it if the shadow seems to be too detached.
     */
    epsilon: number;
}
