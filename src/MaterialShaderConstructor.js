/**
 * @brief The Definitions and Implementation of MaterialShaderConstructor.
 * @file MaterialShaderConstructor.js.
 * @author Spices.
 * */

import * as Cesium from "cesium";

/**
 * @brief The current class is designed to be used in three situations:
 *
 * 1. Helps to construct a Cesium.Material.
 * 2. Helps to construct a Cesium.Material.fabric.uniforms.
 * 3. Helps to construct a Cesium.Material.fabric.source.
 *
 * @attention This class only helps to do the basic things in creating material during Construct different types of Appearances,
 * User needs to provide the shader files both in vertexShaderSource and fragmentShaderSource.
 *
 * @todo Single Instance Material.
 * */
export class MaterialShaderConstructor {

    /**
     * @brief Construct Function.
     * @param[name] The name of material.
     * */
    constructor(name)
    {
        this.m_name = name
    }

    /**
     * @brief Enum of glsl basic data type.
     * children class's member must takes one type of this.
     *
     * @todo Implement all glsl basic data type.
     * */
    static m_type =
        {
            sampler2D:     0,     // js side: string/url; glsl side: Texture2D Sampler (Remember sampler is not a texture)
            sampler2DCube: 1,     // js side: string/url; glsl side: Texture2DCube Sampler (Remember sampler is not a texture)
            float:         2,     // js side: float; glsl side: float
            vec2:          3,     // js side: { x: , y: }; glsl side: vec2
            vec3:          4,     // js side: { x: , y: , z: }; glsl side: vec3
            vec4:          5,     // js side: { x: , y: , z: , w: }; glsl side: vec4
            mat2:          6,
            mat3:          7,
            mat4:          8,
            int:           9,
            ivec2:        10,
            ivec3:        11,
            ivec4:        12,
            uint:         13
        }

    /**
     * @brief Single Instance of Cesium.Material.
     * Call toCesiumMaterial() to get it.
     * */
    static m_material

    /**
     * @brief Material name.
     * @attention One name one type.
     * */
    static m_name

    /**
     * @brief Construct a Cesium.Material.fabric.uniforms object use children class member variable.
     * @param[obj] Pointer of child class instance.
     * @return Returns constructed Cesium.Material.fabric.uniforms object.
     * */
    static toUniforms(obj)
    {
        const uniforms = {}

        Reflect.ownKeys(obj).forEach(function(key){
            if(key === 'length' || key === 'name' || key === 'prototype') { return }

            if(obj[key].hasOwnProperty('type') && obj[key].hasOwnProperty('value'))
            {
                uniforms[key] = obj[key].value
            }
        })

        return uniforms
    }

    /**
     * @brief Construct a Cesium.Material.fabric.source object use children class member variable.
     * @param[obj] Pointer of child class instance.
     * @return Returns constructed Cesium.Material.fabric.source object.
     * */
    static toFabricSource(obj)
    {
        let source = '\n'

        Reflect.ownKeys(obj).forEach(function(key){
            if(key === 'length' || key === 'name' || key === 'prototype') { return }

            if(obj[key].hasOwnProperty('type') && obj[key].hasOwnProperty('value'))
            {
                source += `#define u_${key} ${key} \n`
            }
        })

        return source
    }

    /**
     * @brief Construct a Cesium.Material object use children class member variable.
     * @param[recompile] True if wanted to recreate a new material rather than use old one.
     * @return Returns constructed Cesium.Material object.
     * */
    static toCesiumMaterial(recompile = false)
    {
        if(recompile || this.m_material === 'undefined' || this.m_material === '')
        {
            this.m_material = new Cesium.Material({
                fabric: {
                    type: this.m_name,
                    uniforms: this.toUniforms(this),
                    source: this.toFabricSource(this)
                }
            })
        }
        return this.m_material
    }
}


/**********************************************************************************************/
//
//  Examples for user
//
/**********************************************************************************************/

/**
 * @brief Inherit from MaterialShaderConstructor and add member variables.
 * Added member variables will be declared in shader.
 *
 * @attention User can only access those in shader by add u_ prefix,
 * this because cesium has already renamed those by add _# in order,
 * so user can not use original name to access those.
 * */
class ShaderConstructor extends MaterialShaderConstructor {
    constructor(name) { super(name) }

    static t2D  = { type: this.m_type.sampler2D, value: 'url' }
    static f    = { type: this.m_type.float    , value: 0.0 }
    static v2   = { type: this.m_type.vec2     , value: { x: 0.0, y: 0.0 } }
    static v3   = { type: this.m_type.vec3     , value: { x: 0.0, y: 0.0, z: 0.0 } }
    static v4   = { type: this.m_type.vec4     , value: { x: 0.0, y: 0.0, z: 0.0, w: 0.0 } }
}

const materialUniforms = ShaderConstructor.toUniforms(ShaderConstructor)
const materialFabricSource = ShaderConstructor.toFabricSource(ShaderConstructor)
const material = ShaderConstructor.toCesiumMaterial(true)


/**********************************************************************************************/
//
//  Usage 1: Only Construct a Cesium.Material.fabric.uniforms and modify czm_material.
//
/**********************************************************************************************/

const usage1 = new Cesium.MaterialAppearance({
    material: new Cesium.Material({
        fabric: {
            type: 'Usage1',
            uniforms: materialUniforms,
            source: `
            czm_material czm_getMaterial(czm_materialInput materialInput)
            {
                czm_material material = czm_getDefaultMaterial(materialInput);
                
                material.diffuse = v3;    // usage.
                
                return material;
            }
            `
        }
    })
})


/**********************************************************************************************/
//
//  Usage 2: Both Construct a Cesium.Material.fabric.uniforms and source.
//  In this usage, user can instance other material use same uniforms and source.
//  Of Course, user needs to provide both vertexShaderSource and fragmentShaderSource.
//
/**********************************************************************************************/

const usage2 = new Cesium.MaterialAppearance({
    material: new Cesium.Material({
        fabric: {
            type: 'Usage2',
            uniforms: materialUniforms,
            source: materialFabricSource
        }
    }),
    vertexShaderSource: `
    
        in vec3 position3DHigh;
        in vec3 position3DLow;
        in float batchId;
        in vec2 st;
        in vec3 normal;
        
        out vec2 v_st;
        out vec3 v_positionEC;
        out vec3 v_normalEC;

        void main()
        {
            v_st = st;
            vec4 p = czm_computePosition();
            v_positionEC = (czm_modelViewRelativeToEye * p).xyz;
            v_normalEC = czm_normal * normal;
            gl_Position = czm_modelViewProjectionRelativeToEye * p;
        }
    `,
    fragmentShaderSource: `
    
        in vec2 v_st;
        in vec3 v_positionEC;
        in vec3 v_normalEC;
        
        void main()
        {
            vec3 positionToEyeEC = -v_positionEC;
            vec3 normalEC = normalize(v_normalEC);
            czm_materialInput materialInput;
            materialInput.normalEC = normalEC;
            materialInput.positionToEyeEC = positionToEyeEC;
            materialInput.st = v_st;
        
            czm_material material = czm_getMaterial(materialInput);
            
            float opacity = u_f;      // usage.
            out_FragColor = vec4(material.diffuse, opacity);
        }
    `
})


/**********************************************************************************************/
//
//  Usage 3: Construct a Cesium.Material.
//  In this usage, user can choose instance a material or not.
//  Of Course, user needs to provide both vertexShaderSource and fragmentShaderSource.
//
/**********************************************************************************************/

const usage3 = new Cesium.MaterialAppearance({
    material: material,
    vertexShaderSource: 'as same in usage2',
    fragmentShaderSource: 'as same in usage2'
})


/**********************************************************************************************/
//
//  Clear Error.
//
/**********************************************************************************************/

usage1.getFragmentShaderSource()
usage2.getFragmentShaderSource()
usage3.getFragmentShaderSource()
