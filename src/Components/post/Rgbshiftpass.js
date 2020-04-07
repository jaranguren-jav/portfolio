/**
 * @author alteredq / http://alteredqualia.com/
 */

/**
 * @author felixturner / http://airtight.cc/
 *
 * RGB Shift Shader
 * Shifts red and blue channels from center in opposite directions
 * Ported from http://kriss.cx/tom/2009/05/rgb-shift/
 * by Tom Butterworth / http://kriss.cx/tom/
 *
 * amount: shift distance (1 is width of input)
 * angle: shift angle in radians
 */

import { Mesh, OrthographicCamera, PlaneBufferGeometry, Scene, ShaderMaterial, UniformsUtils, Math as _Math } from 'three'
import { Pass } from 'three/examples/jsm/postprocessing/Pass'

var RgbShader = {
  uniforms: {
    tDiffuse: { value: null }, //diffuse texture
    byp: { value: 0 }, //apply the glitch ?
    amount: { value: 0.08 },
    angle: { value: 0.02 },
  },

  vertexShader: `varying vec2 vUv;
    void main(){  
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,

  fragmentShader: `uniform int byp; //should we apply the glitch ?
    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float angle;
    
    varying vec2 vUv;
    
    void main() {  
      if (byp<1) {
        vec2 p = vUv;
        vec2 offset = amount * vec2( cos(angle), sin(angle));
        vec4 cr = texture2D(tDiffuse, p + offset);
        vec4 cga = texture2D(tDiffuse, p);
        vec4 cb = texture2D(tDiffuse, p - offset);
        gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
      } else {
        gl_FragColor=texture2D (tDiffuse, vUv);
      }
    }`
}

var RgbshiftPass = function(dt_size) {
  Pass.call(this)
  if (RgbShader === undefined) console.error('THREE.RgbshiftPass relies on THREE.RgbShader')
  var shader = RgbShader
  this.uniforms = UniformsUtils.clone(shader.uniforms)
  if (dt_size === undefined) dt_size = 64
  this.material = new ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader
  })
  this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  this.scene = new Scene()
  this.quad = new Mesh(new PlaneBufferGeometry(2, 2), null)
  this.quad.frustumCulled = false // Avoid getting clipped
  this.scene.add(this.quad)
  this.factor = 0
}

RgbshiftPass.prototype = Object.assign(Object.create(Pass.prototype), {
  constructor: RgbshiftPass,

  render: function(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
    const factor = Math.max(0, this.factor)
    this.uniforms['tDiffuse'].value = readBuffer.texture
    this.uniforms['byp'].value = 0
    if (factor) {
      this.uniforms['amount'].value = (Math.random() / 90) * factor
      this.uniforms['angle'].value = _Math.randFloat(-Math.PI, Math.PI) * factor
    } else this.uniforms['byp'].value = 1
    this.quad.material = this.material
    if (this.renderToScreen) {
      renderer.setRenderTarget(null)
      renderer.render(this.scene, this.camera)
    } else {
      renderer.setRenderTarget(writeBuffer)
      if (this.clear) renderer.clear()
      renderer.render(this.scene, this.camera)
    }
  }
})

export { RgbshiftPass }
