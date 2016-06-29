"use strict";
/**
 * MethodVO contains data for a given shader object for the use within a single material.
 * This allows shader methods to be shared across materials while their non-public state differs.
 */
var MethodVO = (function () {
    /**
     * Creates a new MethodVO object.
     */
    function MethodVO(method, pass) {
        this.useMethod = true;
        this.method = method;
        this.pass = pass;
    }
    /**
     * Resets the values of the value object to their "unused" state.
     */
    MethodVO.prototype.reset = function () {
        this.method.iReset();
        this.vertexConstantsIndex = -1;
        this.secondaryVertexConstantsIndex = -1;
        this.fragmentConstantsIndex = -1;
        this.secondaryFragmentConstantsIndex = -1;
        this.needsProjection = false;
        this.needsView = false;
        this.needsNormals = false;
        this.needsTangents = false;
        this.needsGlobalVertexPos = false;
        this.needsGlobalFragmentPos = false;
    };
    return MethodVO;
}());
exports.MethodVO = MethodVO;
