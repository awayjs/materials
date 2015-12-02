import Camera							= require("awayjs-display/lib/entities/Camera");
import TextureBase						= require("awayjs-display/lib/textures/TextureBase");
import IRenderOwner						= require("awayjs-display/lib/base/IRenderOwner");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import RenderableBase					= require("awayjs-renderergl/lib/renderables/RenderableBase");
import ShadingMethodEvent				= require("awayjs-renderergl/lib/events/ShadingMethodEvent");
import LightingShader					= require("awayjs-renderergl/lib/shaders/LightingShader");
import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import SpecularBasicMethod				= require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");

/**
 * SpecularCompositeMethod provides a base class for specular methods that wrap a specular method to alter the
 * calculated specular reflection strength.
 */
class SpecularCompositeMethod extends SpecularBasicMethod
{
	private _baseMethod:SpecularBasicMethod;

	private _onShaderInvalidatedDelegate:Function;

	/**
	 * Creates a new <code>SpecularCompositeMethod</code> object.
	 *
	 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature modSpecular(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the specular strength and t.xyz will contain the half-vector or the reflection vector.
	 * @param baseMethod The base specular method on which this method's shading is based.
	 */
	constructor(modulateMethod:(shader:ShaderBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => string, baseMethod:SpecularBasicMethod = null)
	{
		super();

		this._onShaderInvalidatedDelegate = (event:ShadingMethodEvent) => this.onShaderInvalidated(event);

		this._baseMethod = baseMethod || new SpecularBasicMethod();
		this._baseMethod._iModulateMethod = modulateMethod;
		this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shader:LightingShader, methodVO:MethodVO)
	{
		this._baseMethod.iInitVO(shader, methodVO);
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shader:ShaderBase, methodVO:MethodVO)
	{
		this._baseMethod.iInitConstants(shader, methodVO);
	}


	public iAddOwner(owner:IRenderOwner)
	{
		super.iAddOwner(owner);

		this._baseMethod.iAddOwner(owner);
	}

	public iRemoveOwner(owner:IRenderOwner)
	{
		super.iRemoveOwner(owner);

		this._baseMethod.iRemoveOwner(owner);
	}

	/**
	 * The base specular method on which this method's shading is based.
	 */
	public get baseMethod():SpecularBasicMethod
	{
		return this._baseMethod;
	}

	public set baseMethod(value:SpecularBasicMethod)
	{
		if (this._baseMethod == value)
			return;

		this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

		this._baseMethod = value;

		this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public get gloss():number
	{
		return this._baseMethod.gloss;
	}

	public set gloss(value:number)
	{
		this._baseMethod.gloss = value;
	}

	/**
	 * @inheritDoc
	 */
	public get specular():number
	{
		return this._baseMethod.specular;
	}

	public set specular(value:number)
	{
		this._baseMethod.specular = value;
	}

	/**
	 * @inheritDoc
	 */
	public dispose()
	{
		this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		this._baseMethod.dispose();
	}

	/**
	 * @inheritDoc
	 */
	public get texture():TextureBase
	{
		return this._baseMethod.texture;
	}

	public set texture(value:TextureBase)
	{
		this._baseMethod.texture = value;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shader:LightingShader, methodVO:MethodVO, stage:Stage)
	{
		this._baseMethod.iActivate(shader, methodVO, stage);
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shader:LightingShader, methodVO:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
	{
		this._baseMethod.iSetRenderState(shader, methodVO, renderable, stage, camera);
	}

	/**
	 * @inheritDoc
	 */
	public iDeactivate(shader:ShaderBase, methodVO:MethodVO, stage:Stage)
	{
		this._baseMethod.iDeactivate(shader, methodVO, stage);
	}

	/**
	 * @inheritDoc
	 */
	public iGetVertexCode(shader:ShaderBase, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._baseMethod.iGetVertexCode(shader, methodVO, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shader:LightingShader, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._baseMethod.iGetFragmentPreLightingCode(shader, methodVO, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerLight(shader:LightingShader, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._baseMethod.iGetFragmentCodePerLight(shader, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 * @return
	 */
	public iGetFragmentCodePerProbe(shader:LightingShader, methodVO:MethodVO, cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._baseMethod.iGetFragmentCodePerProbe(shader, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPostLightingCode(shader:LightingShader, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._baseMethod.iGetFragmentPostLightingCode(shader, methodVO, targetReg, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iReset()
	{
		this._baseMethod.iReset();
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData()
	{
		super.iCleanCompilationData();
		this._baseMethod.iCleanCompilationData();
	}

	/**
	 * Called when the base method's shader code is invalidated.
	 */
	private onShaderInvalidated(event:ShadingMethodEvent)
	{
		this.iInvalidateShaderProgram();
	}
}

export = SpecularCompositeMethod;