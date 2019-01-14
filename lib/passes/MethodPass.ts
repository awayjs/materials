import {ColorTransform, AssetEvent} from "@awayjs/core";

import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement} from "@awayjs/stage";

import {View} from "@awayjs/view";

import {_Render_RenderableBase, _Render_ElementsBase, ShaderBase, ChunkVO} from "@awayjs/renderer";

import {LightPickerBase} from "../lightpickers/LightPickerBase";
import {LightSources} from "../lightpickers/LightSources";

import {MethodEvent} from "../events/MethodEvent";
import {_IShader_LightingMethod} from "../methods/_IShader_LightingMethod";
import {_IShader_Method} from "../methods/_IShader_Method";
import {MethodBase, _Shader_MethodBase} from "../methods/MethodBase";
import {EffectColorTransformMethod} from "../methods/EffectColorTransformMethod";
import {_Shader_LightingCompositeMethod} from "../methods/CompositeMethodBase";
import {_Shader_DiffuseBasicMethod} from "../methods/DiffuseBasicMethod";
import {_Shader_SpecularBasicMethod} from "../methods/SpecularBasicMethod";
import {_Shader_NormalBasicMethod} from "../methods/NormalBasicMethod";
import {ILightingPass} from "../passes/ILightingPass";
import {PassBase} from "../passes/PassBase";
import {LightingShader} from "../shaders/LightingShader";

import {MethodMaterial, _Render_MethodMaterial} from "../MethodMaterial";

import {MethodPassMode} from "./MethodPassMode";

/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
export class MethodPass extends PassBase implements ILightingPass
{
	private _maxLights:number = 3;

	private _mode:number = 0x03;
	private _lightPicker:LightPickerBase;

	private _includeCasters:boolean = true;

	public _colorTransformChunk:_IShader_Method;
	public _colorTransformMethod:EffectColorTransformMethod;
	public _normalChunk:_IShader_Method;
	public _normalMethod:MethodBase;
	public _ambientChunk:_IShader_Method;
	public _ambientMethod:MethodBase;
	public _shadowChunk:_IShader_Method;
	public _shadowMethod:MethodBase;
	public _diffuseChunk:_IShader_LightingMethod;
	public _diffuseMethod:MethodBase;
	public _specularChunk:_IShader_LightingMethod;
	public _specularMethod:MethodBase;
	public _chunks:Array<_IShader_Method> = new Array<_IShader_Method>();
	public _methods:Array<MethodBase> = new Array<MethodBase>();

	public _numEffectDependencies:number = 0;

	private _onLightsChangeDelegate:(event:AssetEvent) => void;
	private _onMethodInvalidatedDelegate:(event:MethodEvent) => void;

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
			this._lightPicker.removeEventListener(AssetEvent.INVALIDATE, this._onLightsChangeDelegate);

		this._lightPicker = value;

		if (this._lightPicker)
			this._lightPicker.addEventListener(AssetEvent.INVALIDATE, this._onLightsChangeDelegate);

		this._updateLights();
	}
	
	/**
	 * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
	 * compatibility for constrained mode.
	 */
	public get enableLightFallOff():boolean
	{
		return (<_Render_MethodMaterial>  this._renderMaterial).enableLightFallOff;
	}

	/**
	 * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
	 * and/or light probes for diffuse reflections.
	 *
	 * @see away3d.materials.LightSources
	 */
	public get diffuseLightSources():number
	{
		return (<_Render_MethodMaterial>  this._renderMaterial).diffuseLightSources;
	}

	/**
	 * Define which light source types to use for specular reflections. This allows choosing between regular lights
	 * and/or light probes for specular reflections.
	 *
	 * @see away3d.materials.LightSources
	 */
	public get specularLightSources():number
	{
		return (<_Render_MethodMaterial>  this._renderMaterial).specularLightSources;
	}

	/**
	 * Creates a new CompiledPass object.
	 *
	 * @param material The material to which this pass belongs.
	 */
	constructor(mode:number, renderMaterial:_Render_MethodMaterial, renderElements:_Render_ElementsBase)
	{
		super(renderMaterial, renderElements);

		this._mode = mode;

		this._onLightsChangeDelegate = (event:AssetEvent) => this.onLightsChange(event);
		
		this._onMethodInvalidatedDelegate = (event:MethodEvent) => this.onMethodInvalidated(event);

		this.lightPicker = renderMaterial.lightPicker;

		if (this._shader == null)
			this._updateShader();
	}

	private _updateShader():void
	{
		if ((this.numDirectionalLights || this.numPointLights || this.numLightProbes) && !(this._shader instanceof LightingShader)) {
			if (this._shader != null) {
				this._shader.dispose();
				this._shader = null;
			}

			this._shader = new LightingShader(this._renderElements, this._renderMaterial, this, this._stage);
		} else if (this._shader == null) { // !(_shader instanceof ShaderBase) because there are only two shader types atm
			if (this._shader != null) {
				this._shader.dispose();
				this._shader = null;
			}

			this._shader = new ShaderBase(this._renderElements, this._renderMaterial, this, this._stage);
		}
	}

	/**
	 * Initializes the unchanging constant data for this material.
	 */
	public _initConstantData():void
	{
		//Updates method constants if they have changed.
		var len:number = this._chunks.length;
		for (var i:number = 0; i < len; ++i)
			this._chunks[i]._initConstants();
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
		return this._colorTransformMethod;
	}

	public set colorTransformMethod(value:EffectColorTransformMethod)
	{
		if (this._colorTransformMethod == value)
			return;

		if (this._colorTransformMethod) {
			this._removeDependency(this._colorTransformMethod);
			this._colorTransformChunk = null;
		}

		this._colorTransformMethod = value;

		if (value) {
			this._colorTransformChunk = <_Shader_MethodBase> this._shader.getAbstraction(value);
			this._addDependency(value);
		}
	}

	private _removeDependency(method:MethodBase, effectsDependency:boolean = false):void
	{
		var index:number = this._methods.indexOf(method);

		if (index == -1)
			return;
		
		if (!effectsDependency)
			this._numEffectDependencies--;

		method.removeEventListener(MethodEvent.SHADER_INVALIDATED, this._onMethodInvalidatedDelegate);

		this._methods.splice(index, 1);
		this._chunks.splice(index, 1);

		this.invalidate();
	}

	private _addDependency(method:MethodBase, effectsDependency:boolean = false, index:number = -1):void
	{
		method.addEventListener(MethodEvent.SHADER_INVALIDATED, this._onMethodInvalidatedDelegate);

		var chunk:_IShader_Method = <_Shader_MethodBase> this._shader.getAbstraction(method);

		if (effectsDependency) {
			if (index != -1) {
				this._methods.splice(index + this._methods.length - this._numEffectDependencies, 0, method);
				this._chunks.splice(index + this._chunks.length - this._numEffectDependencies, 0, chunk);
			} else {
				this._methods.push(method);
				this._chunks.push(chunk);
			}
			this._numEffectDependencies++;
		} else {
			this._methods.splice(this._methods.length - this._numEffectDependencies, 0, method);
			this._chunks.splice(this._chunks.length - this._numEffectDependencies, 0, chunk);
		}

		this.invalidate();
	}

	/**
	 * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
	 * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
	 * methods added prior.
	 */
	public addEffectMethod(method:MethodBase):void
	{
		this._addDependency(method, true);
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
	public hasEffectMethod(method:MethodBase):boolean
	{
		return this._methods.indexOf(method) != -1;
	}

	/**
	 * Returns the method added at the given index.
	 * @param index The index of the method to retrieve.
	 * @return The method at the given index.
	 */
	public getEffectMethodAt(index:number):MethodBase
	{
		if (index < 0 || index > this._numEffectDependencies - 1)
			return null;

		return this._methods[index + this._methods.length - this._numEffectDependencies];
	}

	/**
	 * Adds an effect method at the specified index amongst the methods already added to the material. Effect
	 * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
	 * etc. The method will be applied to the result of the methods with a lower index.
	 */
	public addEffectMethodAt(method:MethodBase, index:number):void
	{
		this._addDependency(method, true, index);
	}

	/**
	 * Removes an effect method from the material.
	 * @param method The method to be removed.
	 */
	public removeEffectMethod(method:MethodBase):void
	{
		this._removeDependency(method, true);
	}


	/**
	 * remove an effect method at the specified index from the material.
	 */
	public removeEffectMethodAt(index:number):void
	{
		var method:MethodBase = this.getEffectMethodAt(index);

		if (method != null)
			this._removeDependency(method, true);
	}

	/**
	 * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
	 */
	public get normalMethod():MethodBase
	{
		return this._normalMethod;
	}

	public set normalMethod(value:MethodBase)
	{
		if (this._normalMethod == value)
			return;

		if (this._normalMethod) {
			this._removeDependency(this._normalMethod);
			this._normalChunk = null;
		}

		this._normalMethod = value;

		if (value) {
			this._normalChunk = <_Shader_MethodBase> this._shader.getAbstraction(value);
			this._addDependency(value);
		}
	}

	/**
	 * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
	 */
	public get ambientMethod():MethodBase
	{
		return this._ambientMethod;
	}

	public set ambientMethod(value:MethodBase)
	{
		if (this._ambientMethod == value)
			return;

		if (this._ambientMethod) {
			this._removeDependency(this._ambientMethod);
			this._ambientChunk = null;
		}

		this._ambientMethod = value;

		if (value) {
			this._ambientChunk = <_Shader_MethodBase> this._shader.getAbstraction(value);
			this._addDependency(value);
		}
	}

	/**
	 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
	 */
	public get shadowMethod():MethodBase
	{
		return this._shadowMethod;
	}

	public set shadowMethod(value:MethodBase)
	{
		if (this._shadowMethod == value)
			return;

		if (this._shadowMethod) {
			this._removeDependency(this._shadowMethod);
			this._shadowChunk = null;
		}

		this._shadowMethod = value;

		if (value) {
			this._shadowChunk = <_Shader_MethodBase> this._shader.getAbstraction(value);
			this._addDependency(value);
		}
	}

	/**
	 * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
	 */
	public get diffuseMethod():MethodBase
	{
		return this._diffuseMethod;
	}

	public set diffuseMethod(value:MethodBase)
	{
		if (this._diffuseMethod == value)
			return;

		if (this._diffuseMethod) {
			this._removeDependency(this._diffuseMethod);
			this._diffuseChunk = null;
		}

		if (value) {
			this._diffuseChunk = <_Shader_LightingCompositeMethod | _Shader_DiffuseBasicMethod> this._shader.getAbstraction(value);
			this._addDependency(value);
		}
	}

	/**
	 * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
	 */
	public get specularMethod():MethodBase
	{
		return this._specularMethod;
	}

	public set specularMethod(value:MethodBase)
	{
		if (this._specularMethod == value)
			return;

		if (this._specularMethod) {
			this._removeDependency(this._specularMethod);
			this._specularChunk = null;
		}

		if (value) {
			this._specularChunk = <_Shader_LightingCompositeMethod | _Shader_SpecularBasicMethod> this._shader.getAbstraction(value);
			this._addDependency(value);
		}
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		if (this._lightPicker)
			this._lightPicker.removeEventListener(AssetEvent.INVALIDATE, this._onLightsChangeDelegate);

		while (this._methods.length)
			this._removeDependency(this._methods[0]);

		super.dispose();

		this._chunks = null;
		this._methods = null;
	}

	/**
	 * Called when any method's shader code is invalidated.
	 */
	private onMethodInvalidated(event:MethodEvent):void
	{
		this.invalidate();
	}

	// RENDER LOOP

	/**
	 * @inheritDoc
	 */
	public _activate(view:View):void
	{
		super._activate(view);

		var chunk:_IShader_Method;
		var len:number = this._chunks.length;
		for (var i:number = 0; i < len; ++i) {
			chunk = this._chunks[i];
			if (chunk.chunkVO.useChunk)
				chunk._activate();
		}
	}

	/**
	 *
	 *
	 * @param renderable
	 * @param stage
	 * @param camera
	 */
	public _setRenderState(renderState:_Render_RenderableBase, view:View):void
	{
		super._setRenderState(renderState, view);

		var chunk:_IShader_Method;
		var len:number = this._chunks.length;
		for (var i:number = 0; i < len; ++i) {
			chunk = this._chunks[i];
			if (chunk.chunkVO.useChunk)
				chunk._setRenderState(renderState, view);
		}
	}

	/**
	 * @inheritDoc
	 */
	public _deactivate():void
	{
		super._deactivate();

		var chunk:_IShader_Method;
		var len:number = this._chunks.length;
		for (var i:number = 0; i < len; ++i) {
			chunk = this._chunks[i];
			if (chunk.chunkVO.useChunk)
				chunk._deactivate();
		}
	}

	public _includeDependencies(shader:LightingShader):void
	{
		super._includeDependencies(shader);

		//TODO: fragment animtion should be compatible with lighting pass
		shader.usesFragmentAnimation = Boolean(this._mode == MethodPassMode.SUPER_SHADER);

		if (shader.useAlphaPremultiplied && shader.usesBlending)
			shader.usesCommonData = true;

		var i:number;
		var len:number = this._chunks.length;
		for (i = 0; i < len; ++i)
			this.setupAndCountDependencies(shader, this._chunks[i]);

		var usesTangentSpace:boolean = true;

		var chunk:_IShader_Method;
		for (i = 0; i < len; ++i) {
			chunk = this._chunks[i];
			if ((chunk.chunkVO.useChunk = chunk._isUsed()) && !chunk._usesTangentSpace())
				usesTangentSpace = false;
		}

		shader.outputsNormals = this._normalChunk && this._normalChunk.chunkVO.useChunk;
		shader.outputsTangentNormals = shader.outputsNormals && (<_Shader_NormalBasicMethod> this._normalChunk)._outputsTangentNormals();
		shader.usesTangentSpace = shader.outputsTangentNormals && !shader.usesProbes && usesTangentSpace;

		if (!shader.usesTangentSpace) {
			if (shader.viewDirDependencies > 0) {
				shader.globalPosDependencies++;
			} else if (this.numPointLights > 0 && shader.usesLights) {
				shader.globalPosDependencies++;
				if (Boolean(this._mode & MethodPassMode.EFFECTS))
					shader.usesGlobalPosFragment = true;
			}
		}
	}


	/**
	 * Counts the dependencies for a given method.
	 * @param method The method to count the dependencies for.
	 * @param chunk The method's data for this material.
	 */
	private setupAndCountDependencies(shader:ShaderBase, chunk:_IShader_Method):void
	{
		var chunkVO:ChunkVO = chunk.chunkVO;
		chunk._reset(chunkVO);

		chunk._initVO(chunkVO);

		if (chunkVO.needsProjection)
			shader.projectionDependencies++;

		if (chunkVO.needsGlobalVertexPos || chunkVO.needsGlobalFragmentPos) {

			shader.globalPosDependencies++;

			if (chunkVO.needsGlobalFragmentPos)
				shader.usesGlobalPosFragment = true;

		}

		if (chunkVO.needsNormals)
			shader.normalDependencies++;

		if (chunkVO.needsTangents)
			shader.tangentDependencies++;

		if (chunkVO.needsView)
			shader.viewDirDependencies++;
	}

	public _getPreLightingVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		return code;
	}

	public _getPreLightingFragmentCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._diffuseChunk && this._diffuseChunk.chunkVO.useChunk)
			code += this._diffuseChunk._getFragmentPreLightingCode(registerCache, sharedRegisters);

		if (this._specularChunk && this._specularChunk.chunkVO.useChunk)
			code += this._specularChunk._getFragmentPreLightingCode(registerCache, sharedRegisters);

		return code;
	}

	public _getPerLightDiffuseFragmentCode(lightDirReg:ShaderRegisterElement, diffuseColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._diffuseChunk._getFragmentCodePerLight(lightDirReg, diffuseColorReg, registerCache, sharedRegisters);
	}

	public _getPerLightSpecularFragmentCode(lightDirReg:ShaderRegisterElement, specularColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._specularChunk._getFragmentCodePerLight(lightDirReg, specularColorReg, registerCache, sharedRegisters);
	}

	public _getPerProbeDiffuseFragmentCode(texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._diffuseChunk._getFragmentCodePerProbe(texReg, weightReg, registerCache, sharedRegisters);
	}

	public _getPerProbeSpecularFragmentCode(texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._specularChunk._getFragmentCodePerProbe(texReg, weightReg, registerCache, sharedRegisters);
	}


	public _getNormalVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._normalChunk._getVertexCode(registerCache, sharedRegisters);
	}

	public _getNormalFragmentCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = this._normalChunk._getFragmentCode(sharedRegisters.normalFragment, registerCache, sharedRegisters);

		if (this._normalChunk.chunkVO.needsView)
			registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);

		if (this._normalChunk.chunkVO.needsGlobalFragmentPos || this._normalChunk.chunkVO.needsGlobalVertexPos)
			registerCache.removeVertexTempUsage(sharedRegisters.globalPositionVertex);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _getVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._ambientChunk && this._ambientChunk.chunkVO.useChunk)
			code += this._ambientChunk._getVertexCode(registerCache, sharedRegisters);

		if (this._shadowChunk)
			code += this._shadowChunk._getVertexCode(registerCache, sharedRegisters);

		if (this._diffuseChunk && this._diffuseChunk.chunkVO.useChunk)
			code += this._diffuseChunk._getVertexCode(registerCache, sharedRegisters);

		if (this._specularChunk && this._specularChunk.chunkVO.useChunk)
			code += this._specularChunk._getVertexCode(registerCache, sharedRegisters);

		var chunk:_IShader_Method;
		var len:number = this._chunks.length;
		for (var i:number = len - this._numEffectDependencies; i < len; i++) {
			chunk = this._chunks[i];
			if (chunk.chunkVO.useChunk) {
				code += chunk._getVertexCode(registerCache, sharedRegisters);

				if (chunk.chunkVO.needsGlobalVertexPos || chunk.chunkVO.needsGlobalFragmentPos)
					registerCache.removeVertexTempUsage(sharedRegisters.globalPositionVertex);
			}
		}

		if (this._colorTransformChunk && this._colorTransformChunk.chunkVO.useChunk)
			code += this._colorTransformChunk._getVertexCode(registerCache, sharedRegisters);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._ambientChunk && this._ambientChunk.chunkVO.useChunk) {
			code += this._ambientChunk._getFragmentCode(sharedRegisters.shadedTarget, registerCache, sharedRegisters);

			if (this._ambientChunk.chunkVO.needsNormals)
				registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);

			if (this._ambientChunk.chunkVO.needsView)
				registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
		}

		return code;
	}


	public _getPostAnimationFragmentCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		//if blending with premultiplied alpha, make sure ambient color is correctly multiplied
		if (this._shader.useAlphaPremultiplied && this._shader.usesBlending) {
			code += "add " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" +
				"div " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + ", " + sharedRegisters.shadedTarget + ".w\n" +
				"sub " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" +
				"sat " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + "\n";
		}

		///////////////begin lighting shading
		if (this._shadowChunk)
			code += this._shadowChunk._getFragmentCode(sharedRegisters.shadowTarget, registerCache, sharedRegisters);

		if (this._diffuseChunk && this._diffuseChunk.chunkVO.useChunk) {
			code += this._diffuseChunk._getFragmentCode(sharedRegisters.shadedTarget, registerCache, sharedRegisters);

			// resolve other dependencies as well?
			if (this._diffuseChunk.chunkVO.needsNormals)
				registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);

			if (this._diffuseChunk.chunkVO.needsView)
				registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
		}

		if (this._specularChunk && this._specularChunk.chunkVO.useChunk) {
			code += this._specularChunk._getFragmentCode(sharedRegisters.shadedTarget, registerCache, sharedRegisters);
			if (this._specularChunk.chunkVO.needsNormals)
				registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);
			if (this._specularChunk.chunkVO.needsView)
				registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
		}

		if (this._shadowChunk && !this._shader.normalDependencies)
			registerCache.removeFragmentTempUsage(sharedRegisters.shadowTarget);

		///////////////end lighting shading

		var alphaReg:ShaderRegisterElement;

		//check if alpha is preserved while performing effects shading and store value
		if (this.preserveAlpha && this._numEffectDependencies > 0) {
			alphaReg = registerCache.getFreeFragmentSingleTemp();
			registerCache.addFragmentTempUsages(alphaReg, 1);
			code += "mov " + alphaReg + ", " + sharedRegisters.shadedTarget + ".w\n";
		}

		//perform effects shading
		var chunk:_IShader_Method;
		var len:number = this._chunks.length;
		for (var i:number = len - this._numEffectDependencies; i < len; i++) {
			chunk = this._chunks[i];
			if (chunk.chunkVO.useChunk) {
				code += chunk._getFragmentCode(sharedRegisters.shadedTarget, registerCache, sharedRegisters);

				if (chunk.chunkVO.needsNormals)
					registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);

				if (chunk.chunkVO.needsView)
					registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);

			}
		}

		//check if alpha is preserved while performing effects shading and restore value
		if (this.preserveAlpha && this._numEffectDependencies > 0) {
			code += "mov " + sharedRegisters.shadedTarget + ".w, " + alphaReg + "\n";
			registerCache.removeFragmentTempUsage(alphaReg);
		}

		//peform final colortransform chunk if it exists
		if (this._colorTransformChunk && this._colorTransformChunk.chunkVO.useChunk)
			code += this._colorTransformChunk._getFragmentCode(sharedRegisters.shadedTarget, registerCache, sharedRegisters);

		return code;
	}

	/**
	 * Indicates whether the shader uses any shadows.
	 */
	public _iUsesShadows(shader:ShaderBase):boolean
	{
		return Boolean(this._shadowChunk && (this._lightPicker.castingDirectionalLights.length > 0 || this._lightPicker.castingPointLights.length > 0));
	}

	/**
	 * Indicates whether the shader uses any specular component.
	 */
	public _iUsesSpecular(shader:ShaderBase):boolean
	{
		return Boolean(this._specularChunk);
	}

	/**
	 * Indicates whether the shader uses any specular component.
	 */
	public _iUsesDiffuse(shader:ShaderBase):boolean
	{
		return Boolean(this._diffuseChunk);
	}


	private onLightsChange(event:AssetEvent):void
	{
		this._updateLights();
	}

	private _updateLights():void
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

			this.invalidate();
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

		if (((<_Render_MethodMaterial> this._renderMaterial).specularLightSources & LightSources.PROBES) != 0)
			++numChannels;

		if (((<_Render_MethodMaterial> this._renderMaterial).diffuseLightSources & LightSources.PROBES) != 0)
			++numChannels;

		// 4 channels available
		return Math.min(numLightProbes - this.lightProbesOffset, (4/numChannels) | 0);
	}
}