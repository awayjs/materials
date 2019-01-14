import {TextureBase} from "../textures/TextureBase";

import {MethodBase, _Shader_MethodBase} from "./MethodBase";

/**
 * SpecularBasicMethod provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
 * version of Phong specularity).
 */
export class SpecularBasicMethod extends MethodBase
{
	private _texture:TextureBase;

	private _gloss:number = 50;
	private _strength:number = 1;
	private _color:number = 0xffffff;

	public static assetType:string = "[asset SpecularBasicMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return SpecularBasicMethod.assetType;
	}

	/**
	 * The glossiness of the material (sharpness of the specular highlight).
	 */
	public get gloss():number
	{
		return this._gloss;
	}

	public set gloss(value:number)
	{
		if (this._gloss == value)
			return;

		this._gloss = value;

		this.invalidate();
	}

	/**
	 * The overall strength of the specular highlights.
	 */
	public get strength():number
	{
		return this._strength;
	}

	public set strength(value:number)
	{
		if (this._strength == value)
			return;

		this._strength = value;

		this.invalidate();
	}

	/**
	 * The colour of the specular reflection of the surface.
	 */
	public get color():number
	{
		return this._color;
	}

	public set color(value:number)
	{
		if (this._color == value)
			return;

		this._color = value;
		
		// specular is now either enabled or disabled
		if (this._color == 0 || value == 0)
			this.invalidateShaderProgram();
		else
			this.invalidate();
	}

	/**
	 * A texture that defines the strength of specular reflections for each texel in the red channel,
	 * and the gloss factor (sharpness) in the green channel. You can use Specular2DTexture if you want to easily set
	 * specular and gloss maps from grayscale images, but correctly authored images are preferred.
	 */
	public get texture():TextureBase
	{
		return this._texture;
	}

	public set texture(value:TextureBase)
	{
		if (this._texture == value)
			return;

		if (this._texture)
			this.iRemoveTexture(this._texture);

		this._texture = value;

		if (this._texture)
			this.iAddTexture(this._texture);

		this.invalidateShaderProgram();
	}

	/**
	 * Creates a new SpecularBasicMethod object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		this._texture = null;
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:MethodBase):void
	{

		var m:any = method;
		var bsm:SpecularBasicMethod = <SpecularBasicMethod> method;

		var spec:SpecularBasicMethod = bsm;//SpecularBasicMethod(method);
		this.texture = spec.texture;
		this.strength = spec.strength;
		this.color = spec.color;
		this.gloss = spec.gloss;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {ShaderBase, _Render_RenderableBase, _Shader_TextureBase, ChunkVO} from "@awayjs/renderer";

import {LightingShader} from "../shaders/LightingShader";

import {_IShader_LightingMethod} from "./_IShader_LightingMethod";

/**
 * _Shader_SpecularBasicMethod provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
 * version of Phong specularity).
 */
export class _Shader_SpecularBasicMethod extends _Shader_MethodBase implements _IShader_LightingMethod
{
    public _totalLightColorReg:ShaderRegisterElement;
    public _specularTexData:ShaderRegisterElement;
    public _specularDataRegister:ShaderRegisterElement;

    public _specularDataIndex:number;

    protected _method:SpecularBasicMethod;
    protected _shader:LightingShader;

    protected _texture:_Shader_TextureBase;

    public _pIsFirstLight:boolean;

    public _modulateFunction:(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => string;

    /**
     * Creates a new EffectEnvMapChunk.
     */
    constructor(method:SpecularBasicMethod, shader:LightingShader)
    {
        super(method, shader);

        this._method = method;
        this._shader = shader;
    }

    public _isUsed():boolean
    {
        if (!this._shader.numLights)
            return false;

        return true;
    }

    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        chunkVO.needsNormals = this._shader.numLights > 0;
        chunkVO.needsView = this._shader.numLights > 0;

        if (this._method.texture) {
            this._texture = <_Shader_TextureBase> this._shader.getAbstraction(this._method.texture);
            this._texture._initVO(chunkVO);
            this._shader.uvDependencies++;
        } else if (this._texture) {
            this._texture = null;
        }
    }

    /**
     * @inheritDoc
     */
    public _initConstants():void
    {
        if (this._method.texture)
            this._texture._initConstants();
    }

    /**
     * @inheritDoc
     */
    public _cleanCompilationData():void
    {
        super._cleanCompilationData();

        this._totalLightColorReg = null;
        this._specularTexData = null;
        this._specularDataRegister = null;
    }

    /**
     * @inheritDoc
     */
    public _getFragmentPreLightingCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";

        this._pIsFirstLight = true;

        this._specularDataRegister = registerCache.getFreeFragmentConstant();
        this._specularDataIndex = this._specularDataRegister.index*4;

        if (this._texture) {

            this._specularTexData = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(this._specularTexData, 1);

            code += this._texture._getFragmentCode(this._specularTexData, registerCache, sharedRegisters, sharedRegisters.uvVarying);
        }

        this._totalLightColorReg = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(this._totalLightColorReg, 1);

        return code;
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCodePerLight(lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";
        var t:ShaderRegisterElement;

        if (this._pIsFirstLight) {
            t = this._totalLightColorReg;
        } else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }

        var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;
        var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;

        // blinn-phong half vector model
        code += "add " + t + ", " + lightDirReg + ", " + viewDirReg + "\n" +
            "nrm " + t + ".xyz, " + t + "\n" +
            "dp3 " + t + ".w, " + normalReg + ", " + t + "\n" +
            "sat " + t + ".w, " + t + ".w\n";

        if (this._texture) {
            // apply gloss modulation from texture
            code += "mul " + this._specularTexData + ".w, " + this._specularTexData + ".y, " + this._specularDataRegister + ".w\n" +
                "pow " + t + ".w, " + t + ".w, " + this._specularTexData + ".w\n";
        } else {
            code += "pow " + t + ".w, " + t + ".w, " + this._specularDataRegister + ".w\n";
        }

        // attenuate
        if (this._shader.usesLightFallOff)
            code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";

        if (this._modulateFunction != null)
            code += this._modulateFunction(t, registerCache, sharedRegisters);

        code += "mul " + t + ".xyz, " + lightColReg + ", " + t + ".w\n";

        if (!this._pIsFirstLight) {
            code += "add " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + t + "\n";
            registerCache.removeFragmentTempUsage(t);
        }

        this._pIsFirstLight = false;

        return code;
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCodePerProbe(cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";
        var t:ShaderRegisterElement;

        // write in temporary if not first light, so we can add to total diffuse colour
        if (this._pIsFirstLight) {
            t = this._totalLightColorReg;
        } else {
            t = registerCache.getFreeFragmentVectorTemp();
            registerCache.addFragmentTempUsages(t, 1);
        }

        var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;
        var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;

        code += "dp3 " + t + ".w, " + normalReg + ", " + viewDirReg + "\n" +
            "add " + t + ".w, " + t + ".w, " + t + ".w\n" +
            "mul " + t + ", " + t + ".w, " + normalReg + "\n" +
            "sub " + t + ", " + t + ", " + viewDirReg + "\n" +
            "tex " + t + ", " + t + ", " + cubeMapReg + " <cube," + "linear" + ",miplinear>\n" +
            "mul " + t + ".xyz, " + t + ", " + weightRegister + "\n";

        if (this._modulateFunction != null)
            code += this._modulateFunction(t, registerCache, sharedRegisters);

        if (!this._pIsFirstLight) {
            code += "add " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + t + "\n";
            registerCache.removeFragmentTempUsage(t);
        }

        this._pIsFirstLight = false;

        return code;
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var code:string = "";

        if (sharedRegisters.shadowTarget)
            code += "mul " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";

        if (this._texture) {
            // apply strength modulation from texture
            code += "mul " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + this._specularTexData + ".x\n";
            registerCache.removeFragmentTempUsage(this._specularTexData);
        }

        // apply material's specular reflection
        code += "mul " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + this._specularDataRegister + "\n" +
            "add " + targetReg + ".xyz, " + targetReg + ", " + this._totalLightColorReg + "\n";
        registerCache.removeFragmentTempUsage(this._totalLightColorReg);

        return code;
    }

    /**
     * @inheritDoc
     */
    public _activate():void
    {
        if (this._texture)
            this._texture.activate();

        if (this._invalid) {
            var index:number = this._specularDataIndex;
            var data:Float32Array = this._shader.fragmentConstantData;

            data[index] = (( this._method.color >> 16) & 0xff)/0xff*this._method.strength;
            data[index + 1] = (( this._method.color >> 8) & 0xff)/0xff*this._method.strength;
            data[index + 2] = ( this._method.color & 0xff)/0xff*this._method.strength;
            data[index + 3] = this._method.gloss;
        }
    }

    public _setRenderState(renderState:_Render_RenderableBase, view:View):void
    {
        if (this._texture)
            this._texture._setRenderState(renderState);
    }
}

ShaderBase.registerAbstraction(_Shader_SpecularBasicMethod, SpecularBasicMethod);