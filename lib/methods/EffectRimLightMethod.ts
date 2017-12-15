import {MethodBase, _Shader_MethodBase} from "./MethodBase";

/**
 * EffectRimLightMethod provides a method to add rim lighting to a material. This adds a glow-like effect to edges of objects.
 */
export class EffectRimLightMethod extends MethodBase
{
	public static ADD:string = "add";
	public static MULTIPLY:string = "multiply";
	public static MIX:string = "mix";

	private _color:number;
	private _strength:number;
	private _power:number;
	private _blendMode:string;

	public static assetType:string = "[asset EffectRimLightMethod]";

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return EffectRimLightMethod.assetType;
	}

	/**
	 * The color of the rim light.
	 */
	public get color():number /*uint*/
	{
		return this._color;
	}

	public set color(value:number /*uint*/)
	{
		if (this._power == value)
			return;

		this._color = value;
		
		this.invalidate();
	}

	/**
	 * The strength of the rim light.
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
	 * The power of the rim light. Higher values will result in a higher edge fall-off.
	 */
	public get power():number
	{
		return this._power;
	}

	public set power(value:number)
	{
		if (this._power == value)
			return;

		this._power = value;

		this.invalidate();
	}

	/**
	 * The blend mode with which to add the light to the object.
	 *
	 * EffectRimLightMethod.MULTIPLY multiplies the rim light with the material's colour.
	 * EffectRimLightMethod.ADD adds the rim light with the material's colour.
	 * EffectRimLightMethod.MIX provides normal alpha blending.
	 */
	public get blendMode():string
	{
		return this._blendMode;
	}

	public set blendMode(value:string)
	{
		if (this._blendMode == value)
			return;

		this._blendMode = value;

		this.invalidateShaderProgram();
	}

	/**
	 * Creates a new <code>EffectRimLightMethod</code> object.
	 *
	 * @param color The colour of the rim light.
	 * @param strength The strength of the rim light.
	 * @param power The power of the rim light. Higher values will result in a higher edge fall-off.
	 * @param blend The blend mode with which to add the light to the object.
	 */
	constructor(color:number = 0xffffff, strength:number = .4, power:number = 2, blend:string = "mix")
	{
		super();

		this._blendMode = blend;
		this._strength = strength;
		this._power = power;

		this._color = color;
	}
}

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {ShaderBase, ChunkVO} from "@awayjs/renderer";

/**
 * _Shader_EffectRimLightMethod provides a method to add rim lighting to a material. This adds a glow-like effect to edges of objects.
 */
export class _Shader_EffectRimLightMethod extends _Shader_MethodBase
{
    private _method:EffectRimLightMethod;
    private _shader:ShaderBase;

    private _rimColorIndex:number;

    /**
     * Creates a new EffectEnvMapChunk.
     */
    constructor(method:EffectRimLightMethod, shader:ShaderBase)
    {
        super(method, shader);

        this._method = method;
        this._shader = shader;
    }

    /**
     * @inheritDoc
     */
    public _initVO(chunkVO:ChunkVO):void
    {
        chunkVO.needsNormals = true;
        chunkVO.needsView = true;
    }


    /**
     * @inheritDoc
     */
    public _activate():void
    {
        if (this._invalid) {
            var index:number = this._rimColorIndex;
            var data:Float32Array = this._shader.fragmentConstantData;
            var color:number = this._method.color;

            data[index] = ((color >> 16) & 0xff)/0xff;
            data[index + 1] = ((color >> 8) & 0xff)/0xff;
            data[index + 2] = (color & 0xff)/0xff;
            data[index + 3] = 1;

            data[index + 4] = this._method.strength;
            data[index + 5] = this._method.power;
        }
    }

    /**
     * @inheritDoc
     */
    public _getFragmentCode(targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
    {
        var dataRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
        var dataRegister2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
        var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
        var code:string = "";

        this._rimColorIndex = dataRegister.index*4;

        code += "dp3 " + temp + ".x, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
            "sat " + temp + ".x, " + temp + ".x\n" +
            "sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" +
            "pow " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".y\n" +
            "mul " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".x\n" +
            "sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" +
            "mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".x\n" +
            "sub " + temp + ".w, " + dataRegister + ".w, " + temp + ".x\n";

        if (this._method.blendMode == EffectRimLightMethod.ADD) {
            code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" +
                "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        } else if (this._method.blendMode == EffectRimLightMethod.MULTIPLY) {
            code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" +
                "mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        } else {
            code += "sub " + temp + ".xyz, " + dataRegister + ".xyz, " + targetReg + ".xyz\n" +
                "mul " + temp + ".xyz, " + temp + ".xyz, " + temp + ".w\n" +
                "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
        }

        return code;
    }
}

ShaderBase.registerAbstraction(_Shader_EffectRimLightMethod, EffectRimLightMethod);