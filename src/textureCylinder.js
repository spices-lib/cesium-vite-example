import {Terrain, Viewer} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";
import gsap from 'gsap'
import * as dat from 'dat.gui'
import texture from './aroma_aromatic_beverage_bio.jpg'

// Debug UI
const gui = new dat.GUI()

// Viewer and Scene
const viewer = new Viewer("cesiumContainer", {
    terrain: Terrain.fromWorldTerrain()
});
const scene = viewer.scene;

// geometry instance
const instance = new Cesium.GeometryInstance({
    geometry: new Cesium.CylinderGeometry({
        length: 500000000,
        topRadius: 500000000,
        bottomRadius: 500000000,
        materialSupport :  Cesium.MaterialAppearance.MaterialSupport.BASIC.vertexFormat,
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
    }),
});

// material appearance
const appearance = new Cesium.MaterialAppearance({
    //aboveGround: true,
    material: new Cesium.Material({
        fabric: {
            type: "Hello",
            uniforms: {
                texture: texture
            },
        }
    }),
    translucent: false,
    vertexShaderSource: `
        in vec3 position3DHigh;
        in vec3 position3DLow;
        in float batchId;
        in vec2 st;
        in vec3 normal;
        
        out vec2 v_st;
        out vec3 v_positionEC;
        out vec3 v_normalEC;
        out vec3 v_position;
        out vec3 v_normal;
        
        void main()
        {
            v_st = st;
            vec4 p = czm_computePosition();
            v_position = position3DLow + position3DHigh;
            v_positionEC = (czm_modelViewRelativeToEye * p).xyz;
            v_normalEC = czm_normal * normal;
            v_normal = normal;
            gl_Position = czm_modelViewProjectionRelativeToEye * p;
            
            
        }
    `,
    fragmentShaderSource: `
        in vec2 v_st;
        in vec3 v_positionEC;
        in vec3 v_normalEC;
        in vec3 v_position;
        in vec3 v_normal;
        
        void main()
        {
            vec3 position = normalize(v_position);
        
            float x;
            if(position.y >= 0.0)
            {
                float r = dot(vec3(position.xy, 0.0), vec3(1.0, 0.0, 0.0));
                x = r * 0.25 + 0.75;
            }
            else
            {
                float r = dot(vec3(-position.x, position.y, 0.0), vec3(1.0, 0.0, 0.0));
                x = r * 0.25 + 0.25;
            }
        
            float y = position.z * 1.1 + 0.5;

            if(y < 0.001 || y > 0.999)
            {
                discard;
            }

            vec2 uv = vec2(x, y);
            
        
            vec4 color = texture(texture_0, uv);
            out_FragColor = vec4(color);
        }
    `
})

// add to scene
scene.primitives.add(
    new Cesium.Primitive({
        geometryInstances: instance,
        appearance: appearance
    })
);