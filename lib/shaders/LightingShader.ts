import {Matrix3D, Vector3D, ProjectionBase}	 from "@awayjs/core";

import {_Render_ElementsBase, _Render_RenderableBase, ShaderBase, _Render_MaterialBase} from "@awayjs/renderer";

import {ContextGLProfile, Stage, _Stage_ImageBase, ShaderRegisterElement} from "@awayjs/stage";

import {DirectionalLight} from "../lights/DirectionalLight";
import {LightProbe} from "../lights/LightProbe";
import {PointLight} from "../lights/PointLight";
import {LightSources} from "../lightpickers/LightSources";
import {ILightingPass} from "../passes/ILightingPass";


/**
 * ShaderBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
export class LightingShader extends ShaderBase
{
	private _lightingPass:ILightingPass;
    private _pointLightFragmentConstants:Array<ShaderRegisterElement>;
    private _pointLightVertexConstants:Array<ShaderRegisterElement>;
    private _dirLightFragmentConstants:Array<ShaderRegisterElement>;
    private _dirLightVertexConstants:Array<ShaderRegisterElement>;

    private _numProbeRegisters:number;
    
	private _includeCasters:boolean = true;

	/**
	 * The first index for the fragment constants containing the light data.
	 */
	public lightFragmentConstantIndex:number;

	/**
	 * The starting index if the vertex constant to which light data needs to be uploaded.
	 */
	public lightVertexConstantIndex:number;

	/**
	 * Indices for the light probe diffuse textures.
	 */
	public lightProbeDiffuseIndices:Array<number> /*uint*/;

	/**
	 * Indices for the light probe specular textures.
	 */
	public lightProbeSpecularIndices:Array<number> /*uint*/;

	/**
	 * The index of the fragment constant containing the weights for the light probes.
	 */
	public probeWeightsIndex:number;

	public numDirectionalLights:number;
	public numPointLights:number;
	public numLightProbes:number;

	public usesLightFallOff:boolean;

	public usesShadows:boolean;

	/**
	 * Indicates whether the shader uses any lights.
	 */
	public usesLights:boolean;

	/**
	 * Indicates whether the shader uses any light probes.
	 */
	public usesProbes:boolean;

	/**
	 * Indicates whether the lights uses any specular components.
	 */
	public usesLightsForSpecular:boolean;

	/**
	 * Indicates whether the probes uses any specular components.
	 */
	public usesProbesForSpecular:boolean;

	/**
	 * Indicates whether the lights uses any diffuse components.
	 */
	public usesLightsForDiffuse:boolean;

	/**
	 * Indicates whether the probes uses any diffuse components.
	 */
	public usesProbesForDiffuse:boolean;

	/**
	 * Creates a new MethodCompilerVO object.
	 */
    constructor(renderElements:_Render_ElementsBase, renderMaterial:_Render_MaterialBase, lightingPass:ILightingPass, stage:Stage)
    {
		super(renderElements, renderMaterial, lightingPass, stage);

		this._lightingPass = lightingPass;
	}

	public _includeDependencies():void
	{
		this.numPointLights = this._lightingPass.numPointLights;
		this.numDirectionalLights = this._lightingPass.numDirectionalLights;
		this.numLightProbes = this._lightingPass.numLightProbes;

		var numAllLights:number = this._lightingPass.numPointLights + this._lightingPass.numDirectionalLights;
		var numLightProbes:number = this._lightingPass.numLightProbes;
		var diffuseLightSources:number = this._lightingPass._iUsesDiffuse(this)? this._lightingPass.diffuseLightSources : 0x00;
		var specularLightSources:number = this._lightingPass._iUsesSpecular(this)? this._lightingPass.specularLightSources : 0x00;
		var combinedLightSources:number = diffuseLightSources | specularLightSources;

		this.usesLightFallOff = this._lightingPass.enableLightFallOff && this.profile != ContextGLProfile.BASELINE_CONSTRAINED;
		this.usesCommonData = this.usesLightFallOff || this.usesCommonData;
		this.numLights = numAllLights + numLightProbes;
		this.usesLights = numAllLights > 0 && (combinedLightSources & LightSources.LIGHTS) != 0;
		this.usesProbes = numLightProbes > 0 && (combinedLightSources & LightSources.PROBES) != 0;
		this.usesLightsForSpecular = numAllLights > 0 && (specularLightSources & LightSources.LIGHTS) != 0;
		this.usesProbesForSpecular = numLightProbes > 0 && (specularLightSources & LightSources.PROBES) != 0;
		this.usesLightsForDiffuse = numAllLights > 0 && (diffuseLightSources & LightSources.LIGHTS) != 0;
		this.usesProbesForDiffuse = numLightProbes > 0 && (diffuseLightSources & LightSources.PROBES) != 0;
		this.usesShadows = this._lightingPass._iUsesShadows(this);

		//IMPORTANT this must occur after shader lighting initialisation above
		super._includeDependencies();
	}

	/**
	 *
	 *
	 * @param renderable
	 * @param stage
	 * @param camera
	 */
	public _setRenderState(renderable:_Render_RenderableBase, projection:ProjectionBase):void
	{
		super._setRenderState(renderable, projection);

		if (this._lightingPass.lightPicker)
			this._lightingPass.lightPicker.collectLights(renderable.sourceEntity);

		if (this.usesLights)
			this.updateLights();

		if (this.usesProbes)
			this.updateProbes();
	}

    /**
     * Reset all the indices to "unused".
     */
    protected _initRegisterIndices():void
    {
        super._initRegisterIndices();

        this.lightVertexConstantIndex = -1;
        this.lightFragmentConstantIndex = -1;
        this.probeWeightsIndex = -1;

        this._numProbeRegisters = Math.ceil(this.numLightProbes/4);

        //init light data
        if (this.usesTangentSpace || !this.usesGlobalPosFragment) {
            this._pointLightVertexConstants = new Array<ShaderRegisterElement>(this.numPointLights);
            this._pointLightFragmentConstants = new Array<ShaderRegisterElement>(this.numPointLights*2);
        } else {
            this._pointLightVertexConstants = null;
			this._pointLightFragmentConstants = new Array<ShaderRegisterElement>(this.numPointLights*3);
        }

        if (this.usesTangentSpace) {
            this._dirLightVertexConstants = new Array<ShaderRegisterElement>(this.numDirectionalLights);
            this._dirLightFragmentConstants = new Array<ShaderRegisterElement>(this.numDirectionalLights*2);
        } else {
            this._dirLightVertexConstants = null;
			this._dirLightFragmentConstants = new Array<ShaderRegisterElement>(this.numDirectionalLights*3);
        }
        
        if (this.usesLights) {
            // init these first so we're sure they're in sequence
            var i:number, len:number;

            if (this._dirLightVertexConstants) {
                len = this._dirLightVertexConstants.length;
                for (i = 0; i < len; ++i) {
                    this._dirLightVertexConstants[i] = this._registerCache.getFreeVertexConstant();

                    if (this.lightVertexConstantIndex == -1)
                        this.lightVertexConstantIndex = this._dirLightVertexConstants[i].index*4;
                }
            }

            if (this._pointLightVertexConstants) {
                len = this._pointLightVertexConstants.length;
                for (i = 0; i < len; ++i) {
                    this._pointLightVertexConstants[i] = this._registerCache.getFreeVertexConstant();

                    if (this.lightVertexConstantIndex == -1)
                        this.lightVertexConstantIndex = this._pointLightVertexConstants[i].index*4;
                }
            }

            len = this._dirLightFragmentConstants.length;
            for (i = 0; i < len; ++i) {
                this._dirLightFragmentConstants[i] = this._registerCache.getFreeFragmentConstant();

                if (this.lightFragmentConstantIndex == -1)
                    this.lightFragmentConstantIndex = this._dirLightFragmentConstants[i].index*4;
            }

            len = this._pointLightFragmentConstants.length;
            for (i = 0; i < len; ++i) {
                this._pointLightFragmentConstants[i] = this._registerCache.getFreeFragmentConstant();

                if (this.lightFragmentConstantIndex == -1)
                    this.lightFragmentConstantIndex = this._pointLightFragmentConstants[i].index*4;
            }
		}
    }

    /**
     * Compile the code for the methods.
     */
    protected _compileDependencies():void
    {
        super._compileDependencies();

        //collect code from pass
        this._vertexCode += this._lightingPass._getPreLightingVertexCode(this._registerCache, this._sharedRegisters);
        this._postAnimationFragmentCode += this._lightingPass._getPreLightingFragmentCode(this._registerCache, this._sharedRegisters);

        //compile the lighting code
        if (this.usesShadows)
            this._compileShadowCode();

        if (this.usesLights)
            this._compileLightCode();

        if (this.usesProbes)
            this._compileLightProbeCode();
    }


    /**
     * Provides the code to provide shadow mapping.
     */
    private _compileShadowCode():void
    {
        if (this.normalDependencies > 0) {
            this._sharedRegisters.shadowTarget = this._sharedRegisters.normalFragment;
        } else {
            this._sharedRegisters.shadowTarget = this._registerCache.getFreeFragmentVectorTemp();
            this._registerCache.addFragmentTempUsages(this._sharedRegisters.shadowTarget, 1);
        }
    }


    /**
     * Compiles the shading code for directional and point lights.
     */
    private _compileLightCode():void
    {
        var diffuseColorReg:ShaderRegisterElement;
        var specularColorReg:ShaderRegisterElement;
        var lightPosReg:ShaderRegisterElement;
        var lightDirReg:ShaderRegisterElement;
        var vertexRegIndex:number = 0;
        var fragmentRegIndex:number = 0;
        var addSpec:boolean = this.usesLightsForSpecular;
        var addDiff:boolean = this.usesLightsForDiffuse;

        //compile the shading code for directional lights.
        for (var i:number = 0; i < this.numDirectionalLights; ++i) {
            if (this.usesTangentSpace) {
                lightDirReg = this._dirLightVertexConstants[vertexRegIndex++];

                var lightVarying:ShaderRegisterElement = this._registerCache.getFreeVarying();

                this._vertexCode += "m33 " + lightVarying + ".xyz, " + lightDirReg + ", " + this._sharedRegisters.animatedTangent + "\n" +
                    "mov " + lightVarying + ".w, " + lightDirReg + ".w\n";

                lightDirReg = this._registerCache.getFreeFragmentVectorTemp();
                this._registerCache.addVertexTempUsages(lightDirReg, 1);

                this._postAnimationFragmentCode += "nrm " + lightDirReg + ".xyz, " + lightVarying + "\n" +
                    "mov " + lightDirReg + ".w, " + lightVarying + ".w\n";

            } else {
                lightDirReg = this._dirLightFragmentConstants[fragmentRegIndex++];
            }

            diffuseColorReg = this._dirLightFragmentConstants[fragmentRegIndex++];
            specularColorReg = this._dirLightFragmentConstants[fragmentRegIndex++];

            if (addDiff)
                this._postAnimationFragmentCode += this._lightingPass._getPerLightDiffuseFragmentCode(lightDirReg, diffuseColorReg, this._registerCache, this._sharedRegisters);

            if (addSpec)
                this._postAnimationFragmentCode += this._lightingPass._getPerLightSpecularFragmentCode(lightDirReg, specularColorReg, this._registerCache, this._sharedRegisters);

            if (this.usesTangentSpace)
                this._registerCache.removeVertexTempUsage(lightDirReg);
        }

        vertexRegIndex = 0;
        fragmentRegIndex = 0;

        //compile the shading code for point lights
        for (var i:number = 0; i < this.numPointLights; ++i) {

            if (this.usesTangentSpace || !this.usesGlobalPosFragment)
                lightPosReg = this._pointLightVertexConstants[vertexRegIndex++];
            else
                lightPosReg = this._pointLightFragmentConstants[fragmentRegIndex++];

            diffuseColorReg = this._pointLightFragmentConstants[fragmentRegIndex++];
            specularColorReg = this._pointLightFragmentConstants[fragmentRegIndex++];

            lightDirReg = this._registerCache.getFreeFragmentVectorTemp();
            this._registerCache.addFragmentTempUsages(lightDirReg, 1);

            var lightVarying:ShaderRegisterElement;

            if (this.usesTangentSpace) {
                lightVarying = this._registerCache.getFreeVarying();
                var temp:ShaderRegisterElement = this._registerCache.getFreeVertexVectorTemp();
                this._vertexCode += "sub " + temp + ", " + lightPosReg + ", " + this._sharedRegisters.animatedPosition + "\n" +
                    "m33 " + lightVarying + ".xyz, " + temp + ", " + this._sharedRegisters.animatedTangent + "\n" +
                    "mov " + lightVarying + ".w, " + this._sharedRegisters.animatedPosition + ".w\n";
            } else if (!this.usesGlobalPosFragment) {
                lightVarying = this._registerCache.getFreeVarying();
                this._vertexCode += "sub " + lightVarying + ", " + lightPosReg + ", " + this._sharedRegisters.globalPositionVertex + "\n";
            } else {
                lightVarying = lightDirReg;
                this._postAnimationFragmentCode += "sub " + lightDirReg + ", " + lightPosReg + ", " + this._sharedRegisters.globalPositionVarying + "\n";
            }

            if (this.usesLightFallOff) {
                // calculate attenuation
                this._postAnimationFragmentCode += // attenuate
                    "dp3 " + lightDirReg + ".w, " + lightVarying + ", " + lightVarying + "\n" + // w = d - radius
                    "sub " + lightDirReg + ".w, " + lightDirReg + ".w, " + diffuseColorReg + ".w\n" + // w = (d - radius)/(max-min)
                    "mul " + lightDirReg + ".w, " + lightDirReg + ".w, " + specularColorReg + ".w\n" + // w = clamp(w, 0, 1)
                    "sat " + lightDirReg + ".w, " + lightDirReg + ".w\n" + // w = 1-w
                    "sub " + lightDirReg + ".w, " + this._sharedRegisters.commons + ".w, " + lightDirReg + ".w\n" + // normalize
                    "nrm " + lightDirReg + ".xyz, " + lightVarying + "\n";
            } else {
                this._postAnimationFragmentCode += "nrm " + lightDirReg + ".xyz, " + lightVarying + "\n" +
                    "mov " + lightDirReg + ".w, " + lightVarying + ".w\n";
            }

            if (this.lightFragmentConstantIndex == -1)
                this.lightFragmentConstantIndex = lightPosReg.index*4;

            if (addDiff)
                this._postAnimationFragmentCode += this._lightingPass._getPerLightDiffuseFragmentCode(lightDirReg, diffuseColorReg, this._registerCache, this._sharedRegisters);

            if (addSpec)
                this._postAnimationFragmentCode += this._lightingPass._getPerLightSpecularFragmentCode(lightDirReg, specularColorReg, this._registerCache, this._sharedRegisters);

            this._registerCache.removeFragmentTempUsage(lightDirReg);
        }
    }


    /**
     * Compiles shading code for light probes.
     */
    private _compileLightProbeCode():void
    {
        var weightReg:string;
        var weightComponents = [ ".x", ".y", ".z", ".w" ];
        var weightRegisters:Array<ShaderRegisterElement> = new Array<ShaderRegisterElement>();
        var i:number;
        var texReg:ShaderRegisterElement;
        var addSpec:boolean = this.usesProbesForSpecular;
        var addDiff:boolean = this.usesProbesForDiffuse;

        if (addDiff)
            this.lightProbeDiffuseIndices = new Array<number>();

        if (addSpec)
            this.lightProbeSpecularIndices = new Array<number>();

        for (i = 0; i < this._numProbeRegisters; ++i) {
            weightRegisters[i] = this._registerCache.getFreeFragmentConstant();

            if (i == 0)
                this.probeWeightsIndex = weightRegisters[i].index*4;
        }

        for (i = 0; i < this.numLightProbes; ++i) {
            weightReg = weightRegisters[Math.floor(i/4)].toString() + weightComponents[i%4];

            if (addDiff) {
                texReg = this._registerCache.getFreeTextureReg();
                this.lightProbeDiffuseIndices[i] = texReg.index;
                this._postAnimationFragmentCode += this._lightingPass._getPerProbeDiffuseFragmentCode(texReg, weightReg, this._registerCache, this._sharedRegisters);
            }

            if (addSpec) {
                texReg = this._registerCache.getFreeTextureReg();
                this.lightProbeSpecularIndices[i] = texReg.index;
                this._postAnimationFragmentCode += this._lightingPass._getPerProbeSpecularFragmentCode(texReg, weightReg, this._registerCache, this._sharedRegisters);
            }
        }
    }
    
    /**
	 * Updates constant data render state used by the lights. This method is optional for subclasses to implement.
	 */
	private updateLights():void
	{
		var dirLight:DirectionalLight;
		var pointLight:PointLight;
		var i:number = 0;
		var k:number = 0;
		var len:number;
		var dirPos:Vector3D;
		var total:number = 0;
		var numLightTypes:number = this.usesShadows? 2 : 1;
		var l:number;
		var offset:number;

		this.ambientR = this.ambientG = this.ambientB = 0;

		l = this.lightVertexConstantIndex;
		k = this.lightFragmentConstantIndex;

		var cast:number = 0;
		var dirLights:Array<DirectionalLight> = this._lightingPass.lightPicker.directionalLights;
		offset = this._lightingPass.directionalLightsOffset;
		len = this._lightingPass.lightPicker.directionalLights.length;

		if (offset > len) {
			cast = 1;
			offset -= len;
		}

		for (; cast < numLightTypes; ++cast) {
			if (cast)
				dirLights = this._lightingPass.lightPicker.castingDirectionalLights;

			len = dirLights.length;

			if (len > this.numDirectionalLights)
				len = this.numDirectionalLights;

			for (i = 0; i < len; ++i) {
				dirLight = dirLights[offset + i];
				dirPos = dirLight.sceneDirection;

				this.ambientR += dirLight._ambientR;
				this.ambientG += dirLight._ambientG;
				this.ambientB += dirLight._ambientB;

				if (this.usesTangentSpace) {
					var x:number = -dirPos.x;
					var y:number = -dirPos.y;
					var z:number = -dirPos.z;

					this.vertexConstantData[l++] = this._pInverseSceneMatrix[0]*x + this._pInverseSceneMatrix[4]*y + this._pInverseSceneMatrix[8]*z;
					this.vertexConstantData[l++] = this._pInverseSceneMatrix[1]*x + this._pInverseSceneMatrix[5]*y + this._pInverseSceneMatrix[9]*z;
					this.vertexConstantData[l++] = this._pInverseSceneMatrix[2]*x + this._pInverseSceneMatrix[6]*y + this._pInverseSceneMatrix[10]*z;
					this.vertexConstantData[l++] = 1;
				} else {
					this.fragmentConstantData[k++] = -dirPos.x;
					this.fragmentConstantData[k++] = -dirPos.y;
					this.fragmentConstantData[k++] = -dirPos.z;
					this.fragmentConstantData[k++] = 1;
				}

				this.fragmentConstantData[k++] = dirLight._diffuseR;
				this.fragmentConstantData[k++] = dirLight._diffuseG;
				this.fragmentConstantData[k++] = dirLight._diffuseB;
				this.fragmentConstantData[k++] = 1;

				this.fragmentConstantData[k++] = dirLight._specularR;
				this.fragmentConstantData[k++] = dirLight._specularG;
				this.fragmentConstantData[k++] = dirLight._specularB;
				this.fragmentConstantData[k++] = 1;

				if (++total == this.numDirectionalLights) {
					// break loop
					i = len;
					cast = numLightTypes;
				}
			}
		}

		// more directional supported than currently picked, need to clamp all to 0
		if (this.numDirectionalLights > total) {
			i = k + (this.numDirectionalLights - total)*12;

			while (k < i)
				this.fragmentConstantData[k++] = 0;
		}

		total = 0;

		var pointLights:Array<PointLight> = this._lightingPass.lightPicker.pointLights;
		offset = this._lightingPass.pointLightsOffset;
		len = this._lightingPass.lightPicker.pointLights.length;

		if (offset > len) {
			cast = 1;
			offset -= len;
		} else {
			cast = 0;
		}

		for (; cast < numLightTypes; ++cast) {
			if (cast)
				pointLights = this._lightingPass.lightPicker.castingPointLights;

			len = pointLights.length;

			for (i = 0; i < len; ++i) {
				pointLight = pointLights[offset + i];
				dirPos = pointLight.transform.concatenatedMatrix3D.position;

				this.ambientR += pointLight._ambientR;
				this.ambientG += pointLight._ambientG;
				this.ambientB += pointLight._ambientB;

				if (this.usesTangentSpace) {
					x = dirPos.x;
					y = dirPos.y;
					z = dirPos.z;

					this.vertexConstantData[l++] = this._pInverseSceneMatrix[0]*x + this._pInverseSceneMatrix[4]*y + this._pInverseSceneMatrix[8]*z + this._pInverseSceneMatrix[12];
					this.vertexConstantData[l++] = this._pInverseSceneMatrix[1]*x + this._pInverseSceneMatrix[5]*y + this._pInverseSceneMatrix[9]*z + this._pInverseSceneMatrix[13];
					this.vertexConstantData[l++] = this._pInverseSceneMatrix[2]*x + this._pInverseSceneMatrix[6]*y + this._pInverseSceneMatrix[10]*z + this._pInverseSceneMatrix[14];
					this.vertexConstantData[l++] = 1;
				} else if (!this.usesGlobalPosFragment) {
					this.vertexConstantData[l++] = dirPos.x;
					this.vertexConstantData[l++] = dirPos.y;
					this.vertexConstantData[l++] = dirPos.z;
					this.vertexConstantData[l++] = 1;
				} else {
					this.fragmentConstantData[k++] = dirPos.x;
					this.fragmentConstantData[k++] = dirPos.y;
					this.fragmentConstantData[k++] = dirPos.z;
					this.fragmentConstantData[k++] = 1;
				}

				this.fragmentConstantData[k++] = pointLight._diffuseR;
				this.fragmentConstantData[k++] = pointLight._diffuseG;
				this.fragmentConstantData[k++] = pointLight._diffuseB;

				var radius:number = pointLight.radius;
				this.fragmentConstantData[k++] = radius*radius;

				this.fragmentConstantData[k++] = pointLight._specularR;
				this.fragmentConstantData[k++] = pointLight._specularG;
				this.fragmentConstantData[k++] = pointLight._specularB;
				this.fragmentConstantData[k++] = pointLight.fallOffFactor;

				if (++total == this.numPointLights) {
					// break loop
					i = len;
					cast = numLightTypes;
				}
			}
		}

		// more directional supported than currently picked, need to clamp all to 0
		if (this.numPointLights > total) {
			i = k + (total - this.numPointLights)*12;

			for (; k < i; ++k)
				this.fragmentConstantData[k] = 0;
		}
	}

	/**
	 * Updates constant data render state used by the light probes. This method is optional for subclasses to implement.
	 */
	private updateProbes():void
	{
		var probe:LightProbe;
		var lightProbes:Array<LightProbe> = this._lightingPass.lightPicker.lightProbes;
		var weights:Array<number> = this._lightingPass.lightPicker.lightProbeWeights;
		var len:number = lightProbes.length - this._lightingPass.lightProbesOffset;
		var addDiff:boolean = this.usesProbesForDiffuse;
		var addSpec:boolean = this.usesProbesForSpecular;

		if (!(addDiff || addSpec))
			return;

		if (len > this.numLightProbes)
			len = this.numLightProbes;

		for (var i:number = 0; i < len; ++i) {
			probe = lightProbes[ this._lightingPass.lightProbesOffset + i];

			if (addDiff)
				(<_Stage_ImageBase> this._stage.getAbstraction(probe.diffuseMap)).activate(this.lightProbeDiffuseIndices[i], probe.diffuseSampler);

			if (addSpec)
				(<_Stage_ImageBase> this._stage.getAbstraction(probe.specularMap)).activate(this.lightProbeSpecularIndices[i], probe.diffuseSampler);
		}

		for (i = 0; i < len; ++i)
			this.fragmentConstantData[this.probeWeightsIndex + i] = weights[this._lightingPass.lightProbesOffset + i];
	}
}