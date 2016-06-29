"use strict";
var MethodPassMode = (function () {
    function MethodPassMode() {
    }
    /**
     *
     */
    MethodPassMode.EFFECTS = 0x01;
    /**
     *
     */
    MethodPassMode.LIGHTING = 0x02;
    /**
     *
     */
    MethodPassMode.SUPER_SHADER = 0x03;
    return MethodPassMode;
}());
exports.MethodPassMode = MethodPassMode;
