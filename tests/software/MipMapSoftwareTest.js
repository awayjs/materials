var Sampler2D = require("awayjs-core/lib/image/Sampler2D");
var URLLoaderEvent = require("awayjs-core/lib/events/URLLoaderEvent");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var View = require("awayjs-display/lib/View");
var PrimitivePlanePrefab = require("awayjs-display/lib/prefabs/PrimitivePlanePrefab");
var DefaultRenderer = require("awayjs-renderergl/lib/DefaultRenderer");
var BasicMaterial = require("awayjs-display/lib/materials/BasicMaterial");
var URLLoader = require("awayjs-core/lib/net/URLLoader");
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var ElementsType = require("awayjs-display/lib/graphics/ElementsType");
var MipMapSoftwareTest = (function () {
    function MipMapSoftwareTest() {
        var _this = this;
        this.c = 100;
        var pngURLRequest = new URLRequest('assets/dots.png');
        this.pngLoader = new URLLoader();
        this.pngLoader.dataFormat = URLLoaderDataFormat.BLOB;
        this.pngLoader.addEventListener(URLLoaderEvent.LOAD_COMPLETE, function (event) { return _this.pngLoaderComplete(event); });
        this.pngLoader.load(pngURLRequest);
    }
    MipMapSoftwareTest.prototype.pngLoaderComplete = function (event) {
        var _this = this;
        var imageLoader = event.target;
        this.image = ParserUtils.blobToImage(imageLoader.data);
        this.image.onload = function (event) { return _this.onLoadComplete(event); };
    };
    MipMapSoftwareTest.prototype.onLoadComplete = function (event) {
        var _this = this;
        Debug.LOG_PI_ERRORS = false;
        Debug.THROW_ERRORS = false;
        var defaultRenderer = new DefaultRenderer(null, false, "baseline", "software");
        defaultRenderer.antiAlias = 2;
        this.view = new View(defaultRenderer);
        //this.view = new View(new DefaultRenderer(null, false, "baseline"));
        this.raf = new RequestAnimationFrame(this.render, this);
        this.view.backgroundColor = 0x222222;
        window.onresize = function (event) { return _this.onResize(event); };
        this.initMeshes();
        this.raf.start();
        this.onResize();
    };
    MipMapSoftwareTest.prototype.initMeshes = function () {
        //var material:BasicMaterial = new BasicMaterial(DefaultMaterialManager.getDefaultTexture());
        var material = new BasicMaterial(ParserUtils.imageToBitmapImage2D(this.image));
        material.style.sampler = new Sampler2D(true, true, true);
        var plane = new PrimitivePlanePrefab(material, ElementsType.TRIANGLE, 1000, 1000, 1000);
        //var plane:PrimitiveCubePrefab = new PrimitiveCubePrefab();
        plane.material = material;
        var mesh = plane.getNewObject();
        mesh.y = -100;
        this.view.scene.addChild(mesh);
    };
    MipMapSoftwareTest.prototype.render = function () {
        if (this.c > 10) {
            this.c = 0;
            this.view.render();
        }
        this.c++;
    };
    MipMapSoftwareTest.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this.view.y = 0;
        this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    };
    return MipMapSoftwareTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvZnR3YXJlL01pcE1hcFNvZnR3YXJlVGVzdC50cyJdLCJuYW1lcyI6WyJNaXBNYXBTb2Z0d2FyZVRlc3QiLCJNaXBNYXBTb2Z0d2FyZVRlc3QuY29uc3RydWN0b3IiLCJNaXBNYXBTb2Z0d2FyZVRlc3QucG5nTG9hZGVyQ29tcGxldGUiLCJNaXBNYXBTb2Z0d2FyZVRlc3Qub25Mb2FkQ29tcGxldGUiLCJNaXBNYXBTb2Z0d2FyZVRlc3QuaW5pdE1lc2hlcyIsIk1pcE1hcFNvZnR3YXJlVGVzdC5yZW5kZXIiLCJNaXBNYXBTb2Z0d2FyZVRlc3Qub25SZXNpemUiXSwibWFwcGluZ3MiOiJBQUNBLElBQU8sU0FBUyxXQUFlLGlDQUFpQyxDQUFDLENBQUM7QUFDbEUsSUFBTyxjQUFjLFdBQWMsdUNBQXVDLENBQUMsQ0FBQztBQUM1RSxJQUFPLHFCQUFxQixXQUFrQiw2Q0FBNkMsQ0FBQyxDQUFDO0FBQzdGLElBQU8sS0FBSyxXQUFrQyw2QkFBNkIsQ0FBQyxDQUFDO0FBRTdFLElBQU8sSUFBSSxXQUFzQyx5QkFBeUIsQ0FBQyxDQUFDO0FBVTVFLElBQU8sb0JBQW9CLFdBQXNCLGlEQUFpRCxDQUFDLENBQUM7QUFJcEcsSUFBTyxlQUFlLFdBQTBCLHVDQUF1QyxDQUFDLENBQUM7QUFHekYsSUFBTyxhQUFhLFdBQTBCLDRDQUE0QyxDQUFDLENBQUM7QUFDNUYsSUFBTyxTQUFTLFdBQWUsK0JBQStCLENBQUMsQ0FBQztBQUNoRSxJQUFPLG1CQUFtQixXQUFhLHlDQUF5QyxDQUFDLENBQUM7QUFDbEYsSUFBTyxVQUFVLFdBQWUsZ0NBQWdDLENBQUMsQ0FBQztBQUNsRSxJQUFPLFdBQVcsV0FBZSxxQ0FBcUMsQ0FBQyxDQUFDO0FBQ3hFLElBQU8sWUFBWSxXQUEyQiwwQ0FBMEMsQ0FBQyxDQUFDO0FBRTFGLElBQU0sa0JBQWtCO0lBT3BCQSxTQVBFQSxrQkFBa0JBO1FBQXhCQyxpQkF3RUNBO1FBakJXQSxNQUFDQSxHQUFVQSxHQUFHQSxDQUFDQTtRQTlDbkJBLElB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QUFBIiwiZmlsZSI6InNvZnR3YXJlL01pcE1hcFNvZnR3YXJlVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIuL3Rlc3RzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZlY3RvcjNEICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgU2FtcGxlcjJEXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9pbWFnZS9TYW1wbGVyMkRcIik7XG5pbXBvcnQgVVJMTG9hZGVyRXZlbnRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvVVJMTG9hZGVyRXZlbnRcIik7XG5pbXBvcnQgUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgICA9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCIpO1xuaW1wb3J0IERlYnVnICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL0RlYnVnXCIpO1xuXG5pbXBvcnQgVmlldyAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvVmlld1wiKTtcbmltcG9ydCBNZXNoICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9kaXNwbGF5L01lc2hcIik7XG5pbXBvcnQgRGlyZWN0aW9uYWxMaWdodCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZGlzcGxheS9EaXJlY3Rpb25hbExpZ2h0XCIpO1xuaW1wb3J0IERlZmF1bHRNYXRlcmlhbE1hbmFnZXIgICAgICAgID0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYW5hZ2Vycy9EZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyXCIpO1xuaW1wb3J0IFN0YXRpY0xpZ2h0UGlja2VyICAgICAgICAgICAgPSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9saWdodHBpY2tlcnMvU3RhdGljTGlnaHRQaWNrZXJcIik7XG5pbXBvcnQgUHJpbWl0aXZlUHJlZmFiQmFzZSAgICAgICAgICAgID0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVByZWZhYkJhc2VcIik7XG5pbXBvcnQgUHJpbWl0aXZlQ2Fwc3VsZVByZWZhYiAgICAgICAgPSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlQ2Fwc3VsZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVDb25lUHJlZmFiICAgICAgICAgICAgPSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlQ29uZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVDdWJlUHJlZmFiICAgICAgICAgICAgPSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlQ3ViZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVDeWxpbmRlclByZWZhYiAgICAgICAgPSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlQ3lsaW5kZXJQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlUGxhbmVQcmVmYWIgICAgICAgICAgICA9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVQbGFuZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVTcGhlcmVQcmVmYWIgICAgICAgID0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVNwaGVyZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVUb3J1c1ByZWZhYiAgICAgICAgICAgID0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVRvcnVzUHJlZmFiXCIpO1xuXG5pbXBvcnQgRGVmYXVsdFJlbmRlcmVyICAgICAgICAgICAgICAgID0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9EZWZhdWx0UmVuZGVyZXJcIik7XG5cbmltcG9ydCBNZXRob2RNYXRlcmlhbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9NZXRob2RNYXRlcmlhbFwiKTtcbmltcG9ydCBCYXNpY01hdGVyaWFsICAgICAgICAgICAgICAgID0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvQmFzaWNNYXRlcmlhbFwiKTtcbmltcG9ydCBVUkxMb2FkZXJcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxMb2FkZXJcIik7XG5pbXBvcnQgVVJMTG9hZGVyRGF0YUZvcm1hdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMTG9hZGVyRGF0YUZvcm1hdFwiKTtcbmltcG9ydCBVUkxSZXF1ZXN0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMUmVxdWVzdFwiKTtcbmltcG9ydCBQYXJzZXJVdGlsc1x0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJVdGlsc1wiKTtcbmltcG9ydCBFbGVtZW50c1R5cGUgICAgICAgICAgICAgICAgID0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9ncmFwaGljcy9FbGVtZW50c1R5cGVcIik7XG5cbmNsYXNzIE1pcE1hcFNvZnR3YXJlVGVzdCB7XG5cbiAgICBwcml2YXRlIHZpZXc6VmlldztcbiAgICBwcml2YXRlIHJhZjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgcHJpdmF0ZSBwbmdMb2FkZXIgICA6IFVSTExvYWRlcjtcbiAgICBwcml2YXRlIGltYWdlOkhUTUxJbWFnZUVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB2YXIgcG5nVVJMUmVxdWVzdDpVUkxSZXF1ZXN0ID0gbmV3IFVSTFJlcXVlc3QoJ2Fzc2V0cy9kb3RzLnBuZycpO1xuXG4gICAgICAgIHRoaXMucG5nTG9hZGVyID0gbmV3IFVSTExvYWRlcigpO1xuICAgICAgICB0aGlzLnBuZ0xvYWRlci5kYXRhRm9ybWF0ID0gVVJMTG9hZGVyRGF0YUZvcm1hdC5CTE9CO1xuICAgICAgICB0aGlzLnBuZ0xvYWRlci5hZGRFdmVudExpc3RlbmVyKFVSTExvYWRlckV2ZW50LkxPQURfQ09NUExFVEUsIChldmVudDpVUkxMb2FkZXJFdmVudCkgPT4gdGhpcy5wbmdMb2FkZXJDb21wbGV0ZShldmVudCkpO1xuICAgICAgICB0aGlzLnBuZ0xvYWRlci5sb2FkKHBuZ1VSTFJlcXVlc3QpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcG5nTG9hZGVyQ29tcGxldGUoZXZlbnQ6VVJMTG9hZGVyRXZlbnQpIHtcbiAgICAgICAgdmFyIGltYWdlTG9hZGVyOlVSTExvYWRlciA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgdGhpcy5pbWFnZSA9IFBhcnNlclV0aWxzLmJsb2JUb0ltYWdlKGltYWdlTG9hZGVyLmRhdGEpO1xuICAgICAgICB0aGlzLmltYWdlLm9ubG9hZCA9IChldmVudCkgPT4gdGhpcy5vbkxvYWRDb21wbGV0ZShldmVudCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkxvYWRDb21wbGV0ZShldmVudCkge1xuICAgICAgICBEZWJ1Zy5MT0dfUElfRVJST1JTID0gZmFsc2U7XG4gICAgICAgIERlYnVnLlRIUk9XX0VSUk9SUyA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBkZWZhdWx0UmVuZGVyZXI6RGVmYXVsdFJlbmRlcmVyID0gbmV3IERlZmF1bHRSZW5kZXJlcihudWxsLCBmYWxzZSwgXCJiYXNlbGluZVwiLCBcInNvZnR3YXJlXCIpO1xuICAgICAgICBkZWZhdWx0UmVuZGVyZXIuYW50aUFsaWFzID0gMjtcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IFZpZXcoZGVmYXVsdFJlbmRlcmVyKTtcbiAgICAgICAgLy90aGlzLnZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKG51bGwsIGZhbHNlLCBcImJhc2VsaW5lXCIpKTtcbiAgICAgICAgdGhpcy5yYWYgPSBuZXcgUmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyLCB0aGlzKTtcblxuICAgICAgICB0aGlzLnZpZXcuYmFja2dyb3VuZENvbG9yID0gMHgyMjIyMjI7XG5cbiAgICAgICAgd2luZG93Lm9ucmVzaXplID0gKGV2ZW50OlVJRXZlbnQpID0+IHRoaXMub25SZXNpemUoZXZlbnQpO1xuXG4gICAgICAgIHRoaXMuaW5pdE1lc2hlcygpO1xuICAgICAgICB0aGlzLnJhZi5zdGFydCgpO1xuICAgICAgICB0aGlzLm9uUmVzaXplKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0TWVzaGVzKCk6dm9pZCB7XG4gICAgICAgIC8vdmFyIG1hdGVyaWFsOkJhc2ljTWF0ZXJpYWwgPSBuZXcgQmFzaWNNYXRlcmlhbChEZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyLmdldERlZmF1bHRUZXh0dXJlKCkpO1xuICAgICAgICB2YXIgbWF0ZXJpYWw6QmFzaWNNYXRlcmlhbCA9IG5ldyBCYXNpY01hdGVyaWFsKFBhcnNlclV0aWxzLmltYWdlVG9CaXRtYXBJbWFnZTJEKHRoaXMuaW1hZ2UpKTtcbiAgICAgICAgbWF0ZXJpYWwuc3R5bGUuc2FtcGxlciA9IG5ldyBTYW1wbGVyMkQodHJ1ZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIHZhciBwbGFuZTpQcmltaXRpdmVQbGFuZVByZWZhYiA9IG5ldyBQcmltaXRpdmVQbGFuZVByZWZhYihtYXRlcmlhbCwgRWxlbWVudHNUeXBlLlRSSUFOR0xFLCAxMDAwLDEwMDAsMTAwMCk7XG4gICAgICAgIC8vdmFyIHBsYW5lOlByaW1pdGl2ZUN1YmVQcmVmYWIgPSBuZXcgUHJpbWl0aXZlQ3ViZVByZWZhYigpO1xuICAgICAgICBwbGFuZS5tYXRlcmlhbCA9IG1hdGVyaWFsO1xuXG4gICAgICAgIHZhciBtZXNoOk1lc2ggPSA8TWVzaD5wbGFuZS5nZXROZXdPYmplY3QoKTtcbiAgICAgICAgbWVzaC55ID0gLTEwMDtcbiAgICAgICAgdGhpcy52aWV3LnNjZW5lLmFkZENoaWxkKG1lc2gpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYzpudW1iZXIgPSAxMDA7XG5cbiAgICBwcml2YXRlIHJlbmRlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuYyA+IDEwKSB7XG4gICAgICAgICAgICB0aGlzLmMgPSAwO1xuICAgICAgICAgICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYysrO1xuICAgIH1cblxuICAgIHB1YmxpYyBvblJlc2l6ZShldmVudDpVSUV2ZW50ID0gbnVsbCkge1xuICAgICAgICB0aGlzLnZpZXcueSA9IDA7XG4gICAgICAgIHRoaXMudmlldy54ID0gMDtcblxuICAgICAgICB0aGlzLnZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdGhpcy52aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB9XG59Il19