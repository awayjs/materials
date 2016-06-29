"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Image2D_1 = require("@awayjs/core/lib/image/Image2D");
var Matrix3D_1 = require("@awayjs/core/lib/geom/Matrix3D");
var Single2DTexture_1 = require("@awayjs/display/lib/textures/Single2DTexture");
var PassBase_1 = require("@awayjs/renderer/lib/surfaces/passes/PassBase");
/**
 * The SingleObjectDepthPass provides a material pass that renders a single object to a depth map from the point
 * of view from a light.
 */
var SingleObjectDepthPass = (function (_super) {
    __extends(SingleObjectDepthPass, _super);
    /**
     * Creates a new SingleObjectDepthPass object.
     */
    function SingleObjectDepthPass(render, renderOwner, elementsClass, stage) {
        _super.call(this, render, renderOwner, elementsClass, stage);
        this._textureSize = 512;
        this._polyOffset = new Float32Array([15, 0, 0, 0]);
        this._projectionTexturesInvalid = true;
        //this._pNumUsedStreams = 2;
        //this._pNumUsedVertexConstants = 7;
        //this._enc = Array<number>(1.0, 255.0, 65025.0, 16581375.0, 1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
        //
        //this._pAnimatableAttributes = Array<string>("va0", "va1";
        //this._pAnimationTargetRegisters = Array<string>("vt0", "vt1";
    }
    Object.defineProperty(SingleObjectDepthPass.prototype, "textureSize", {
        /**
         * The size of the depth map texture to render to.
         */
        get: function () {
            return this._textureSize;
        },
        set: function (value) {
            this._textureSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingleObjectDepthPass.prototype, "polyOffset", {
        /**
         * The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
         */
        get: function () {
            return this._polyOffset[0];
        },
        set: function (value) {
            this._polyOffset[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype.dispose = function () {
        if (this._textures) {
            for (var key in this._textures) {
                var texture = this._textures[key];
                texture.dispose();
            }
            this._textures = null;
        }
    };
    /**
     * Updates the projection textures used to contain the depth renders.
     */
    SingleObjectDepthPass.prototype.updateProjectionTextures = function () {
        if (this._textures) {
            for (var key in this._textures) {
                var texture = this._textures[key];
                texture.dispose();
            }
        }
        this._textures = new Object();
        this._projections = new Object();
        this._projectionTexturesInvalid = false;
    };
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype._iGetVertexCode = function () {
        var code;
        // offset
        code = "mul vt7, vt1, vc4.x	\n" +
            "add vt7, vt7, vt0\n" +
            "mov vt7.w, vt0.w\n";
        // project
        code += "m44 vt2, vt7, vc0\n" +
            "mov op, vt2\n";
        // perspective divide
        code += "div v0, vt2, vt2.w\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        // encode float -> rgba
        code += "mul ft0, fc0, v0.z\n" +
            "frc ft0, ft0\n" +
            "mul ft1, ft0.yzww, fc1\n" +
            "sub ft0, ft0, ft1\n" +
            "mov oc, ft0\n";
        return code;
    };
    /**
     * Gets the depth maps rendered for this object from all lights.
     * @param renderableGL The renderableGL for which to retrieve the depth maps.
     * @param stage3DProxy The Stage3DProxy object currently used for rendering.
     * @return A list of depth map textures for all supported lights.
     */
    SingleObjectDepthPass.prototype._iGetDepthMap = function (renderableGL) {
        return this._textures[renderableGL.renderable.id];
    };
    /**
     * Retrieves the depth map projection maps for all lights.
     * @param renderableGL The renderableGL for which to retrieve the projection maps.
     * @return A list of projection maps for all supported lights.
     */
    SingleObjectDepthPass.prototype._iGetProjection = function (renderableGL) {
        return this._projections[renderableGL.renderable.id];
    };
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype._iRender = function (renderableGL, camera, viewProjection) {
        var matrix;
        var context = this._stage.context;
        var len;
        var light;
        var lights = this._surface.lightPicker.allPickedLights;
        var rId = renderableGL.renderable.id;
        if (!this._textures[rId])
            this._textures[rId] = new Single2DTexture_1.Single2DTexture(new Image2D_1.Image2D(this._textureSize, this._textureSize));
        if (!this._projections[rId])
            this._projections[rId] = new Matrix3D_1.Matrix3D();
        len = lights.length;
        // local position = enough
        light = lights[0];
        matrix = light.iGetObjectProjectionMatrix(renderableGL.sourceEntity, camera.sceneTransform, this._projections[rId]);
        this._stage.setRenderTarget(this._textures[rId], true);
        context.clear(1.0, 1.0, 1.0);
        //context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, matrix, true);
        //context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._enc, 2);
        var elementsGL = renderableGL.elementsGL;
        // elementsGL.activateVertexBufferVO(0, elements.positions);
        // elementsGL.activateVertexBufferVO(1, elements.normals);
        // elementsGL.getIndexBufferGL().draw(ContextGLDrawMode.TRIANGLES, 0, elements.numElements);
    };
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype._iActivate = function (camera) {
        if (this._projectionTexturesInvalid)
            this.updateProjectionTextures();
        // never scale
        _super.prototype._iActivate.call(this, camera);
        //this._stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._polyOffset, 1);
    };
    return SingleObjectDepthPass;
}(PassBase_1.PassBase));
exports.SingleObjectDepthPass = SingleObjectDepthPass;
