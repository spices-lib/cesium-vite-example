import {Terrain, Viewer} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";
import texture from './aroma_aromatic_beverage_bio.jpg'

// Viewer and Scene
const viewer = new Viewer("cesiumContainer", {
    terrain: Terrain.fromWorldTerrain()
});
const scene = viewer.scene;

// 将经纬度转换为 Cartesian3 坐标系的坐标
const position = Cesium.Cartesian3.fromDegrees(112.88809132, 23.18102476, 1000);
const eCartesian3 = Cesium.EncodedCartesian3.fromCartesian(position)

console.log(eCartesian3.high)

// 创建模型矩阵，使用默认的无旋转矩阵（你可以根据需要设置旋转）
const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
    position,
    new Cesium.HeadingPitchRoll(0.0, 0.0, 0.0) // 如果需要旋转，可以在此调整
);

// geometry instance
const instance = new Cesium.GeometryInstance({
    geometry: new Cesium.CylinderGeometry({
        length: 1000,
        topRadius: 500,
        bottomRadius: 500,
        materialSupport :  Cesium.MaterialAppearance.MaterialSupport.BASIC.vertexFormat,
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
    }),
    modelMatrix: modelMatrix, // 使用模型矩阵来设置位置
});

// material appearance
const appearance = new Cesium.MaterialAppearance({
    //aboveGround: true,
    material: new Cesium.Material({
        fabric: {
            type: "Hello",
            uniforms: {
                texture: texture,
                centerhigh: eCartesian3.high,
                centerlow: eCartesian3.low,
                modelMatrix: { value: modelMatrix, type: Cesium.UniformType.MAT4 }
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
            vec3 position = v_position - centerhigh_1 - centerlow_2;
        
            /*float x;
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
                //discard;
            }

            vec2 uv = vec2(x, y);
            
        
            vec4 color = texture(texture_0, uv);*/
            
            vec3 c = vec3(0.0);
            if(position.x > 0.0) c = vec3(1.0, 0.0, 0.0);
            else c = vec3(0.0, 1.0, 0.0);
            
            
            out_FragColor = vec4(c, 1.0);
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