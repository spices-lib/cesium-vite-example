import { Viewer } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";
import gsap from 'gsap'
import * as dat from 'dat.gui'
import texture from './fengwotu.jpg'

import { MaterialShaderConstructor } from './MaterialShaderConstructor.js'

import vert from './Shader.Primitive.vert?url&raw'
import frag from './Shader.Primitive.frag?url&raw'

class ShaderDataInstance extends MaterialShaderConstructor {

    constructor(name = 'hello') { super(name) }

    static intexture = {
        type: this.m_type.sampler2D,
        value: texture
    }
    static ringCenter = { type: this.m_type.vec2, value: { x: 0.0, y: 0.0 }}
    static blurRadius = { type: this.m_type.float, value: 0.1 }
    static ringRadius = { type: this.m_type.float, value: 0.2 }
    static ringThickness =  { type: this.m_type.float, value: 0.05 }
}

// Debug UI
const gui = new dat.GUI()

// Function Library
const functions = {
    durationTime : 2,
    animation: () => {
        gsap.to(ShaderDataInstance.ringRadius.value, { duration: functions.durationTime, value: 2.0 })
        gsap.to(ShaderDataInstance.ringRadius.value, { duration: 0, delay: functions.durationTime, value: 0.0 })
    }
}
gui.add(functions, 'animation')
gui.add(functions, 'durationTime').min(0).max(1).step(0.01).name('durationTime')
gui.add(ShaderDataInstance.ringCenter.value, 'x').min(-0.5).max(0.5).step(0.01).name('ringCenter_x')
gui.add(ShaderDataInstance.ringCenter.value, 'y').min(-0.5).max(0.5).step(0.01).name('ringCenter_y')
gui.add(ShaderDataInstance.blurRadius, 'value').min(0).max(0.5).step(0.01).name('blurRadius')
gui.add(ShaderDataInstance.ringRadius, 'value').min(0).max(0.5).step(0.01).name('ringRadius')
gui.add(ShaderDataInstance.ringThickness, 'value').min(0).max(0.5).step(0.01).name('ringThickness')

// Viewer and Scene
const viewer = new Viewer("cesiumContainer");
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
    material: ShaderDataInstance.toCesiumMaterial(true),
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