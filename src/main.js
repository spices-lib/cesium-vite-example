import { Viewer } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";

import vert from './Shader.Primitive.vert?url&raw'
import frag from './Shader.Primitive.frag?url&raw'

// Viewer and Scene
const viewer = new Viewer("cesiumContainer",);
const scene = viewer.scene;

// geometry instance
const instance = new Cesium.GeometryInstance({
  geometry: new Cesium.RectangleGeometry({
    materialSupport :  Cesium.MaterialAppearance.MaterialSupport.BASIC.vertexFormat,
    rectangle: Cesium.Rectangle.fromDegrees(-100.0, 20.0, -90.0, 30.0),
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
  }),
});

// material appearance
const appearance = new Cesium.MaterialAppearance({
    //aboveGround: true,
    material: new Cesium.Material({
        fabric: {
            type: 'Hello',
            uniforms: {
                intexture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT082lJARHoD-vwi2w_KSxMWWFzdOcIsM0Chg&s',
                ringCenter: { x: 0.0, y: 0.0 },
                blurRadius: 0.0,
                ringRadius: 0.0,
                ringThickness: 0.0,
            },
            source : `
            #define GET_FLOAT(name) float get##name() { return name; }
            #define GET_VEC2(name)  vec2  get##name() { return name; }
            #define GET_TEXTURE2D(name) vec4 get##name(in float uv) { return texture(name, uv); }
            
            //GET_TEXTURE2D(intexture)
            //GET_VEC2(ringCenter)
            //GET_FLOAT(blurRadius)
            //GET_FLOAT(ringRadius)
            //GET_FLOAT(ringThickness)
            
             #define A(name) vec2 getname() { return name; }
             
             A(ringCenter)
            
            `
        },
    }),
    vertexShaderSource: vert,
    fragmentShaderSource: frag
})

// add to scene
scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: instance,
      appearance: appearance
    })
);