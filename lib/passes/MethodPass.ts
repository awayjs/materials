import ColorTransform					= require("awayjs-core/lib/geom/ColorTransform");
import Matrix							= require("awayjs-core/lib/geom/Matrix");
import Matrix3D							= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils					= require("awayjs-core/lib/geom/Matrix3DUtils");
import Vector3D							= require("awayjs-core/lib/geom/Vector3D");
import AbstractMethodError				= require("awayjs-core/lib/errors/AbstractMethodError");
import Event							= require("awayjs-core/lib/events/Event");
import MaterialBase						= require("awayjs-display/lib/materials/MaterialBase");
import Texture2DBase					= require("awayjs-core/lib/textures/Texture2DBase");

import TriangleSubGeometry				= require("awayjs-display/lib/base/TriangleSubGeometry");
import Camera							= require("awayjs-display/lib/entities/Camera");
import IRenderObjectOwner				= require("awayjs-display/lib/base/IRenderObjectOwner");
import LightPickerBase					= require("awayjs-display/lib/materials/lightpickers/LightPickerBase");
import LightSources						= require("awayjs-display/lib/materials/LightSources");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import RendererBase						= require("awayjs-renderergl/lib/base/RendererBase");
import ShaderLightingObject				= require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
import ShadingMethodEvent				= require("awayjs-renderergl/lib/events/ShadingMethodEvent");
import ShaderObjectBase					= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import RenderableBase					= require("awayjs-renderergl/lib/pool/RenderableBase");
import RenderPassBase					= require("awayjs-renderergl/lib/passes/RenderPassBase");
import IRenderLightingPass				= require("awayjs-renderergl/lib/passes/IRenderLightingPass");
import IRenderableClass					= require("awayjs-renderergl/lib/pool/IRenderableClass");

import MethodVO							= require("awayjs-methodmaterials/lib/data/MethodVO");
import RenderMethodMaterialObject		= require("awayjs-methodmaterials/lib/compilation/RenderMethodMaterialObject");
import AmbientBasicMethod				= require("awayjs-methodmaterials/lib/methods/AmbientBasicMethod");
import DiffuseBasicMethod				= require("awayjs-methodmaterials/lib/methods/DiffuseBasicMethod");
import EffectColorTransformMethod		= require("awayjs-methodmaterials/lib/methods/EffectColorTransformMethod");
import EffectMethodBase					= require("awayjs-methodmaterials/lib/methods/EffectMethodBase");
import LightingMethodBase				= require("awayjs-methodmaterials/lib/methods/LightingMethodBase");
import NormalBasicMethod				= require("awayjs-methodmaterials/lib/methods/NormalBasicMethod");
import ShadowMapMethodBase				= require("awayjs-methodmaterials/lib/methods/ShadowMapMethodBase");
import SpecularBasicMethod				= require("awayjs-methodmaterials/lib/methods/SpecularBasicMethod");
import MethodPassMode					= require("awayjs-methodmaterials/lib/passes/MethodPassMode");

/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
class MethodPass extends RenderPassBase implements IRenderLightingPass
{
	private _maxLights:number = 3;

	private _mode:number = 0x03;
	private _material:MaterialBase;
	private _lightPicker:LightPickerBase;

	private _includeCasters:boolean = true;

	public _iColorTransformMethodVO:MethodVO;
	public _iNormalMethodVO:MethodVO;
	public _iAmbientMethodVO:MethodVO;
	public _iShadowMethodVO:MethodVO;
	public _iDiffuseMethodVO:MethodVO;
	public _iSpecularMethodVO:MethodVO;
	public _iMethodVOs:Array<MethodVO> = new Array<MethodVO>();

	public _numEffectDependencies:number = 0;

	private _onLightsChangeDelegate:(event:Event) => void;
	private _onMethodInvalidatedDelegate:(event:ShadingMethodEvent) => void;

	public numDirectionalLights:number = 0;

	public numPointLights:number = 0;

	public numLightProbes:number = 0;

	public pointLightsOffset:number = 0;
	
	public directionalLightsOffset:number= 0;
	
	public lightProbesOffset:number = 0;
	
	/**
	 *
	 */
	public get mode():number
	{
		return this._mode;
	}

	public set mode(value:number)
	{
		if (this._mode == value)
			return;
		
		this._mode = value;

		this._updateLights();
	}

	/**
	 * Indicates whether or not shadow casting lights need to be included.
	 */
	public get includeCasters():boolean
	{
		return this._includeCasters;
	}

	public set includeCasters(value:boolean)
	{
		if (this._includeCasters == value)
			return;

		this._includeCasters = value;

		this._updateLights();
	}

	/**
	 * 
	 * @returns {LightPickerBase}
	 */
	public get lightPicker():LightPickerBase
	{
		return this._lightPicker;
	}

	public set lightPicker(value:LightPickerBase)
	{
		//if (this._lightPicker == value)
		//	return;

		if (this._lightPicker)
			this._lightPicker.removeEventListener(Event.CHANGE, this._onLightsChangeDelegate);

		this._lightPicker = value;

		if (this._lightPicker)
			this._lightPicker.addEventListener(Event.CHANGE, this._onLightsChangeDelegate);

		this._updateLights();
	}
	
	/**
	 * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
	 * compatibility for constrained mode.
	 */
	public get enableLightFallOff():boolean
	{
		return this._material.enableLightFallOff;
	}

	/**
	 * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
	 * and/or light probes for diffuse reflections.
	 *
	 * @see away3d.materials.LightSources
	 */
	public get diffuseLightSources():number
	{
		return this._material.diffuseLightSources;
	}

	/**
	 * Define which light source types to use for specular reflections. This allows choosing between regular lights
	 * and/or light probes for specular reflections.
	 *
	 * @see away3d.materials.LightSources
	 */
	public get specularLightSources():number
	{
		return this._material.specularLightSources;
	}

	/**
	 * Creates a new CompiledPass object.
	 *
	 * @param material The material to which this pass belongs.
	 */
	constructor(mode:number, renderObject:RenderMethodMaterialObject, renderObjectOwner:MaterialBase, renderableClass:IRenderableClass, stage:Stage)
	{
		super(renderObject, renderObjectOwner, renderableClass, stage);

		this._mode = mode;

		this._material = renderObjectOwner;

		this._onLightsChangeDelegate = (event:Event) => this.onLightsChange(event);
		
		this._onMethodInvalidatedDelegate = (event:ShadingMethodEvent) => this.onMethodInvalidated(event);

		this.lightPicker = renderObjectOwner.lightPicker;

		if (this._shader == null)
			this._updateShader();
	}

	private _updateShader()
	{
		if ((this.numDirectionalLights || this.numPointLights || this.numLightProbes) && !(this._shader instanceof ShaderLightingObject)) {
			if (this._shader != null)
				this._shader.dispose();

			this._shader = new ShaderLightingObject(this._renderableClass, this, this._stage);
		} else if (!(this._shader instanceof ShaderObjectBase)) {
			if (this._shader != null)
				this._shader.dispose();

			this._shader = new ShaderObjectBase(this._renderableClass, this, this._stage);
		}
	}

	/**
	 * Initializes the unchanging constant data for this material.
	 */
	public _iInitConstantData(shaderObject:ShaderObjectBase)
	{
		super._iInitConstantData(shaderObject);

		//Updates method constants if they have changed.
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i)
			this._iMethodVOs[i].method.iInitConstants(shaderObject, this._iMethodVOs[i]);
	}

	/**
	 * The ColorTransform object to transform the colour of the material with. Defaults to null.
	 */
	public get colorTransform():ColorTransform
	{
		return this.colorTransformMethod? this.colorTransformMethod.colorTransform : null;
	}

	public set colorTransform(value:ColorTransform)
	{
		if (value) {
			if (this.colorTransformMethod == null)
				this.colorTransformMethod = new EffectColorTransformMethod();

			this.colorTransformMethod.colorTransform = value;

		} else if (!value) {
			if (this.colorTransformMethod)
				this.colorTransformMethod = null;
		}
	}

	/**
	 * The EffectColorTransformMethod object to transform the colour of the material with. Defaults to null.
	 */
	public get colorTransformMethod():EffectColorTransformMethod
	{
		return this._iColorTransformMethodVO? <EffectColorTransformMethod> this._iColorTransformMethodVO.method : null;
	}

	public set colorTransformMethod(value:EffectColorTransformMethod)
	{
		if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.method == value)
			return;

		if (this._iColorTransformMethodVO) {
			this._removeDependency(this._iColorTransformMethodVO);
			this._iColorTransformMethodVO = null;
		}

		if (value) {
			this._iColorTransformMethodVO = new MethodVO(value);
			this._addDependency(this._iColorTransformMethodVO);
		}
	}

	private _removeDependency(methodVO:MethodVO, effectsDependency:boolean = false)
	{
		var index:number = this._iMethodVOs.indexOf(methodVO);

		if (!effectsDependency)
			this._numEffectDependencies--;

		methodVO.method.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onMethodInvalidatedDelegate);
		this._iMethodVOs.splice(index, 1);

		this.invalidatePass();
	}

	private _addDependency(methodVO:MethodVO, effectsDependency:boolean = false, index:number = -1)
	{
		methodVO.method.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onMethodInvalidatedDelegate);

		if (effectsDependency) {
			if (index != -1)
				this._iMethodVOs.splice(index + this._iMethodVOs.length - this._numEffectDependencies, 0, methodVO);
			else
				this._iMethodVOs.push(methodVO);
			this._numEffectDependencies++;
		} else {
			this._iMethodVOs.splice(this._iMethodVOs.length - this._numEffectDependencies, 0, methodVO);
		}

		this.invalidatePass();
	}

	/**
	 * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
	 * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
	 * methods added prior.
	 */
	public addEffectMethod(method:EffectMethodBase)
	{
		this._addDependency(new MethodVO(method), true);
	}

	/**
	 * The number of "effect" methods added to the material.
	 */
	public get numEffectMethods():number
	{
		return this._numEffectDependencies;
	}

	/**
	 * Queries whether a given effects method was added to the material.
	 *
	 * @param method The method to be queried.
	 * @return true if the method was added to the material, false otherwise.
	 */
	public hasEffectMethod(method:EffectMethodBase):boolean
	{
		return this.getDependencyForMethod(method) != null;
	}

	/**
	 * Returns the method added at the given index.
	 * @param index The index of the method to retrieve.
	 * @return The method at the given index.
	 */
	public getEffectMethodAt(index:number):EffectMethodBase
	{
		if (index < 0 || index > this._numEffectDependencies - 1)
			return null;

		return <EffectMethodBase> this._iMethodVOs[index + this._iMethodVOs.length - this._numEffectDependencies].method;
	}

	/**
	 * Adds an effect method at the specified index amongst the methods already added to the material. Effect
	 * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
	 * etc. The method will be applied to the result of the methods with a lower index.
	 */
	public addEffectMethodAt(method:EffectMethodBase, index:number)
	{
		this._addDependency(new MethodVO(method), true, index);
	}

	/**
	 * Removes an effect method from the material.
	 * @param method The method to be removed.
	 */
	public removeEffectMethod(method:EffectMethodBase)
	{
		var methodVO:MethodVO = this.getDependencyForMethod(method);

		if (methodVO != null)
			this._removeDependency(methodVO, true);
	}


	/**
	 * remove an effect method at the specified index from the material.
	 */
	public removeEffectMethodAt(index:number)
	{
		if (index < 0 || index > this._numEffectDependencies - 1)
			return;

		var methodVO:MethodVO = this._iMethodVOs[index + this._iMethodVOs.length - this._numEffectDependencies];

		if (methodVO != null)
			this._removeDependency(methodVO, true);
	}


	private getDependencyForMethod(method:EffectMethodBase):MethodVO
	{
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i)
			if (this._iMethodVOs[i].method == method)
				return this._iMethodVOs[i];

		return null;
	}

	/**
	 * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
	 */
	public get normalMethod():NormalBasicMethod
	{
		return this._iNormalMethodVO? <NormalBasicMethod> this._iNormalMethodVO.method : null;
	}

	public set normalMethod(value:NormalBasicMethod)
	{
		if (this._iNormalMethodVO && this._iNormalMethodVO.method == value)
			return;

		if (this._iNormalMethodVO) {
			this._removeDependency(this._iNormalMethodVO);
			this._iNormalMethodVO = null;
		}

		if (value) {
			this._iNormalMethodVO = new MethodVO(value);
			this._addDependency(this._iNormalMethodVO);
		}
	}

	/**
	 * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
	 */
	public get ambientMethod():AmbientBasicMethod
	{
		return this._iAmbientMethodVO? <AmbientBasicMethod> this._iAmbientMethodVO.method : null;
	}

	public set ambientMethod(value:AmbientBasicMethod)
	{
		if (this._iAmbientMethodVO && this._iAmbientMethodVO.method == value)
			return;

		if (this._iAmbientMethodVO) {
			this._removeDependency(this._iAmbientMethodVO);
			this._iAmbientMethodVO = null;
		}

		if (value) {
			this._iAmbientMethodVO = new MethodVO(value);
			this._addDependency(this._iAmbientMethodVO);
		}
	}

	/**
	 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
	 */
	public get shadowMethod():ShadowMapMethodBase
	{
		return this._iShadowMethodVO? <ShadowMapMethodBase> this._iShadowMethodVO.method : null;
	}

	public set shadowMethod(value:ShadowMapMethodBase)
	{
		if (this._iShadowMethodVO && this._iShadowMethodVO.method == value)
			return;

		if (this._iShadowMethodVO) {
			this._removeDependency(this._iShadowMethodVO);
			this._iShadowMethodVO = null;
		}

		if (value) {
			this._iShadowMethodVO = new MethodVO(value);
			this._addDependency(this._iShadowMethodVO);
		}
	}

	/**
	 * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
	 */
	public get diffuseMethod():DiffuseBasicMethod
	{
		return this._iDiffuseMethodVO? <DiffuseBasicMethod> this._iDiffuseMethodVO.method : null;
	}

	public set diffuseMethod(value:DiffuseBasicMethod)
	{
		if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.method == value)
			return;

		if (this._iDiffuseMethodVO) {
			this._removeDependency(this._iDiffuseMethodVO);
			this._iDiffuseMethodVO = null;
		}

		if (value) {
			this._iDiffuseMethodVO = new MethodVO(value);
			this._addDependency(this._iDiffuseMethodVO);
		}
	}

	/**
	 * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
	 */
	public get specularMethod():SpecularBasicMethod
	{
		return this._iSpecularMethodVO? <SpecularBasicMethod> this._iSpecularMethodVO.method : null;
	}

	public set specularMethod(value:SpecularBasicMethod)
	{
		if (this._iSpecularMethodVO && this._iSpecularMethodVO.method == value)
			return;

		if (this._iSpecularMethodVO) {
			this._removeDependency(this._iSpecularMethodVO);
			this._iSpecularMethodVO = null;
		}

		if (value) {
			this._iSpecularMethodVO = new MethodVO(value);
			this._addDependency(this._iSpecularMethodVO);
		}
	}

	/**
	 * @inheritDoc
	 */
	public dispose()
	{
		super.dispose();

		if (this._lightPicker)
			this._lightPicker.removeEventListener(Event.CHANGE, this._onLightsChangeDelegate);
		
		while (this._iMethodVOs.length)
			this._removeDependency(this._iMethodVOs[0]);

		this._iMethodVOs = null;
	}

	/**
	 * Called when any method's shader code is invalidated.
	 */
	private onMethodInvalidated(event:ShadingMethodEvent)
	{
		this.invalidatePass();
	}

	// RENDER LOOP

	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera)
	{
		super._iActivate(camera);

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod)
				methodVO.method.iActivate(this._shader, methodVO, this._stage);
		}
	}

	/**
	 *
	 *
	 * @param renderable
	 * @param stage
	 * @param camera
	 */
	public _iRender(renderable:RenderableBase, camera:Camera, viewProjection:Matrix3D)
	{
		super._iRender(renderable, camera, viewProjection);

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod)
				methodVO.method.iSetRenderState(this._shader, methodVO, renderable, this._stage, camera);
		}
	}

	/**
	 * @inheritDoc
	 */
	public _iDeactivate()
	{
		super._iDeactivate();

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod)
				methodVO.method.iDeactivate(this._shader, methodVO, this._stage);
		}
	}

	public _iIncludeDependencies(shaderObject:ShaderLightingObject)
	{
		super._iIncludeDependencies(shaderObject);

		//TODO: fragment animtion should be compatible with lighting pass
		shaderObject.usesFragmentAnimation = Boolean(this._mode == MethodPassMode.SUPER_SHADER);

		if (!shaderObject.usesTangentSpace && this.numPointLights > 0 && shaderObject.usesLights) {
			shaderObject.globalPosDependencies++;

			if (Boolean(this._mode & MethodPassMode.EFFECTS))
				shaderObject.usesGlobalPosFragment = true;
		}

		var i:number;
		var len:number = this._iMethodVOs.length;
		for (i = 0; i < len; ++i)
			this.setupAndCountDependencies(shaderObject, this._iMethodVOs[i]);

		for (i = 0; i < len; ++i)
			this._iMethodVOs[i].useMethod = this._iMethodVOs[i].method.iIsUsed(shaderObject);
	}


	/**
	 * Counts the dependencies for a given method.
	 * @param method The method to count the dependencies for.
	 * @param methodVO The method's data for this material.
	 */
	private setupAndCountDependencies(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		methodVO.reset();

		methodVO.method.iInitVO(shaderObject, methodVO);

		if (methodVO.needsProjection)
			shaderObject.projectionDependencies++;

		if (methodVO.needsGlobalVertexPos) {

			shaderObject.globalPosDependencies++;

			if (methodVO.needsGlobalFragmentPos)
				shaderObject.usesGlobalPosFragment = true;

		} else if (methodVO.needsGlobalFragmentPos) {
			shaderObject.globalPosDependencies++;
			shaderObject.usesGlobalPosFragment = true;
		}

		if (methodVO.needsNormals)
			shaderObject.normalDependencies++;

		if (methodVO.needsTangents)
			shaderObject.tangentDependencies++;

		if (methodVO.needsView)
			shaderObject.viewDirDependencies++;

		if (methodVO.needsUV)
			shaderObject.uvDependencies++;

		if (methodVO.needsSecondaryUV)
			shaderObject.secondaryUVDependencies++;
	}

	public _iGetPreLightingVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._iAmbientMethodVO && this._iAmbientMethodVO.useMethod)
			code += this._iAmbientMethodVO.method.iGetVertexCode(shaderObject, this._iAmbientMethodVO, registerCache, sharedRegisters);

		if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod)
			code += this._iDiffuseMethodVO.method.iGetVertexCode(shaderObject, this._iDiffuseMethodVO, registerCache, sharedRegisters);

		if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod)
			code += this._iSpecularMethodVO.method.iGetVertexCode(shaderObject, this._iSpecularMethodVO, registerCache, sharedRegisters);

		return code;
	}

	public _iGetPreLightingFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._iAmbientMethodVO && this._iAmbientMethodVO.useMethod) {
			code += this._iAmbientMethodVO.method.iGetFragmentCode(shaderObject, this._iAmbientMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);

			if (this._iAmbientMethodVO.needsNormals)
				registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);

			if (this._iAmbientMethodVO.needsView)
				registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
		}

		if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod)
			code += (<LightingMethodBase> this._iDiffuseMethodVO.method).iGetFragmentPreLightingCode(<ShaderLightingObject> shaderObject, this._iDiffuseMethodVO, registerCache, sharedRegisters);

		if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod)
			code += (<LightingMethodBase> this._iSpecularMethodVO.method).iGetFragmentPreLightingCode(<ShaderLightingObject> shaderObject, this._iSpecularMethodVO, registerCache, sharedRegisters);

		return code;
	}

	public _iGetPerLightDiffuseFragmentCode(shaderObject:ShaderLightingObject, lightDirReg:ShaderRegisterElement, diffuseColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (<LightingMethodBase> this._iDiffuseMethodVO.method).iGetFragmentCodePerLight(shaderObject, this._iDiffuseMethodVO, lightDirReg, diffuseColorReg, registerCache, sharedRegisters);
	}

	public _iGetPerLightSpecularFragmentCode(shaderObject:ShaderLightingObject, lightDirReg:ShaderRegisterElement, specularColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (<LightingMethodBase> this._iSpecularMethodVO.method).iGetFragmentCodePerLight(shaderObject, this._iSpecularMethodVO, lightDirReg, specularColorReg, registerCache, sharedRegisters);
	}

	public _iGetPerProbeDiffuseFragmentCode(shaderObject:ShaderLightingObject, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (<LightingMethodBase> this._iDiffuseMethodVO.method).iGetFragmentCodePerProbe(shaderObject, this._iDiffuseMethodVO, texReg, weightReg, registerCache, sharedRegisters);
	}

	public _iGetPerProbeSpecularFragmentCode(shaderObject:ShaderLightingObject, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (<LightingMethodBase> this._iSpecularMethodVO.method).iGetFragmentCodePerProbe(shaderObject, this._iSpecularMethodVO, texReg, weightReg, registerCache, sharedRegisters);
	}

	public _iGetPostLightingVertexCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._iShadowMethodVO)
			code += this._iShadowMethodVO.method.iGetVertexCode(shaderObject, this._iShadowMethodVO, registerCache, sharedRegisters);

		return code;
	}

	public _iGetPostLightingFragmentCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (shaderObject.useAlphaPremultiplied && this._pEnableBlending) {
			code += "add " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" +
			"div " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + ", " + sharedRegisters.shadedTarget + ".w\n" +
			"sub " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" +
			"sat " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + "\n";
		}

		if (this._iShadowMethodVO)
			code += this._iShadowMethodVO.method.iGetFragmentCode(shaderObject, this._iShadowMethodVO, sharedRegisters.shadowTarget, registerCache, sharedRegisters);

		if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod) {
			code += (<LightingMethodBase> this._iDiffuseMethodVO.method).iGetFragmentPostLightingCode(shaderObject, this._iDiffuseMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);

			// resolve other dependencies as well?
			if (this._iDiffuseMethodVO.needsNormals)
				registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);

			if (this._iDiffuseMethodVO.needsView)
				registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
		}

		if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod) {
			code += (<LightingMethodBase> this._iSpecularMethodVO.method).iGetFragmentPostLightingCode(shaderObject, this._iSpecularMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);
			if (this._iSpecularMethodVO.needsNormals)
				registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);
			if (this._iSpecularMethodVO.needsView)
				registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
		}

		if (this._iShadowMethodVO)
			registerCache.removeFragmentTempUsage(sharedRegisters.shadowTarget);

		return code;
	}

	/**
	 * Indicates whether or not normals are allowed in tangent space. This is only the case if no object-space
	 * dependencies exist.
	 */
	public _pUsesTangentSpace(shaderObject:ShaderLightingObject):boolean
	{
		if (shaderObject.usesProbes)
			return false;

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod && !methodVO.method.iUsesTangentSpace())
				return false;
		}

		return true;
	}

	/**
	 * Indicates whether or not normals are output in tangent space.
	 */
	public _pOutputsTangentNormals(shaderObject:ShaderObjectBase):boolean
	{
		return (<NormalBasicMethod> this._iNormalMethodVO.method).iOutputsTangentNormals();
	}

	/**
	 * Indicates whether or not normals are output by the pass.
	 */
	public _pOutputsNormals(shaderObject:ShaderObjectBase):boolean
	{
		return this._iNormalMethodVO && this._iNormalMethodVO.useMethod;
	}


	public _iGetNormalVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._iNormalMethodVO.method.iGetVertexCode(shaderObject, this._iNormalMethodVO, registerCache, sharedRegisters);
	}

	public _iGetNormalFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = this._iNormalMethodVO.method.iGetFragmentCode(shaderObject, this._iNormalMethodVO, sharedRegisters.normalFragment, registerCache, sharedRegisters);

		if (this._iNormalMethodVO.needsView)
			registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);

		if (this._iNormalMethodVO.needsGlobalFragmentPos || this._iNormalMethodVO.needsGlobalVertexPos)
			registerCache.removeVertexTempUsage(sharedRegisters.globalPositionVertex);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetVertexCode(shaderObject:ShaderObjectBase, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):string
	{
		var code:string = "";
		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = len - this._numEffectDependencies; i < len; i++) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod) {
				code += methodVO.method.iGetVertexCode(shaderObject, methodVO, regCache, sharedReg);

				if (methodVO.needsGlobalVertexPos || methodVO.needsGlobalFragmentPos)
					regCache.removeVertexTempUsage(sharedReg.globalPositionVertex);
			}
		}

		if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.useMethod)
			code += this._iColorTransformMethodVO.method.iGetVertexCode(shaderObject, this._iColorTransformMethodVO, regCache, sharedReg);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shaderObject:ShaderObjectBase, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):string
	{
		var code:string = "";
		var alphaReg:ShaderRegisterElement;

		if (this.preserveAlpha && this._numEffectDependencies > 0) {
			alphaReg = regCache.getFreeFragmentSingleTemp();
			regCache.addFragmentTempUsages(alphaReg, 1);
			code += "mov " + alphaReg + ", " + sharedReg.shadedTarget + ".w\n";
		}

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = len - this._numEffectDependencies; i < len; i++) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod) {
				code += methodVO.method.iGetFragmentCode(shaderObject, methodVO, sharedReg.shadedTarget, regCache, sharedReg);

				if (methodVO.needsNormals)
					regCache.removeFragmentTempUsage(sharedReg.normalFragment);

				if (methodVO.needsView)
					regCache.removeFragmentTempUsage(sharedReg.viewDirFragment);

			}
		}

		if (this.preserveAlpha && this._numEffectDependencies > 0) {
			code += "mov " + sharedReg.shadedTarget + ".w, " + alphaReg + "\n";
			regCache.removeFragmentTempUsage(alphaReg);
		}

		if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.useMethod)
			code += this._iColorTransformMethodVO.method.iGetFragmentCode(shaderObject, this._iColorTransformMethodVO, sharedReg.shadedTarget, regCache, sharedReg);

		return code;
	}
	/**
	 * Indicates whether the shader uses any shadows.
	 */
	public _iUsesShadows(shaderObject:ShaderObjectBase):boolean
	{
		return Boolean(this._iShadowMethodVO && (this._lightPicker.castingDirectionalLights.length > 0 || this._lightPicker.castingPointLights.length > 0));
	}

	/**
	 * Indicates whether the shader uses any specular component.
	 */
	public _iUsesSpecular(shaderObject:ShaderObjectBase):boolean
	{
		return Boolean(this._iSpecularMethodVO);
	}

	/**
	 * Indicates whether the shader uses any specular component.
	 */
	public _iUsesDiffuse(shaderObject:ShaderObjectBase):boolean
	{
		return Boolean(this._iDiffuseMethodVO);
	}


	private onLightsChange(event:Event)
	{
		this._updateLights();
	}

	private _updateLights()
	{
		var numDirectionalLightsOld:number = this.numDirectionalLights;
		var numPointLightsOld:number = this.numPointLights;
		var numLightProbesOld:number = this.numLightProbes;

		if (this._lightPicker && (this._mode & MethodPassMode.LIGHTING)) {
			this.numDirectionalLights = this.calculateNumDirectionalLights(this._lightPicker.numDirectionalLights);
			this.numPointLights = this.calculateNumPointLights(this._lightPicker.numPointLights);
			this.numLightProbes = this.calculateNumProbes(this._lightPicker.numLightProbes);

			if (this._includeCasters) {
				this.numDirectionalLights += this._lightPicker.numCastingDirectionalLights;
				this.numPointLights += this._lightPicker.numCastingPointLights;
			}

		} else {
			this.numDirectionalLights = 0;
			this.numPointLights = 0;
			this.numLightProbes = 0;
		}

		if (numDirectionalLightsOld != this.numDirectionalLights || numPointLightsOld != this.numPointLights || numLightProbesOld != this.numLightProbes) {
			this._updateShader();

			this.invalidatePass();
		}
	}

	/**
	 * Calculates the amount of directional lights this material will support.
	 * @param numDirectionalLights The maximum amount of directional lights to support.
	 * @return The amount of directional lights this material will support, bounded by the amount necessary.
	 */
	private calculateNumDirectionalLights(numDirectionalLights:number):number
	{
		return Math.min(numDirectionalLights - this.directionalLightsOffset, this._maxLights);
	}

	/**
	 * Calculates the amount of point lights this material will support.
	 * @param numDirectionalLights The maximum amount of point lights to support.
	 * @return The amount of point lights this material will support, bounded by the amount necessary.
	 */
	private calculateNumPointLights(numPointLights:number):number
	{
		var numFree:number = this._maxLights - this.numDirectionalLights;
		return Math.min(numPointLights - this.pointLightsOffset, numFree);
	}

	/**
	 * Calculates the amount of light probes this material will support.
	 * @param numDirectionalLights The maximum amount of light probes to support.
	 * @return The amount of light probes this material will support, bounded by the amount necessary.
	 */
	private calculateNumProbes(numLightProbes:number):number
	{
		var numChannels:number = 0;

		if ((this.specularLightSources & LightSources.PROBES) != 0)
			++numChannels;

		if ((this.diffuseLightSources & LightSources.PROBES) != 0)
			++numChannels;

		// 4 channels available
		return Math.min(numLightProbes - this.lightProbesOffset, (4/numChannels) | 0);
	}
}

export = MethodPass;