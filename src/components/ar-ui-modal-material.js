var vertexShader = '\
varying vec2 vUv;\
void main() {\
  vUv = uv;\
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\
  gl_Position = projectionMatrix * mvPosition;\
}\
';

var fragmentShader = '\
  varying vec2 vUv;\
  uniform vec4 steps;\
  uniform float opacity;\
  \
  void main() {\
    vec4 purple = vec4(0.34, 0.33, 0.6, 1.0);\
    vec4 red2 = vec4(0.85, 0.23, 0.45, 1.0);\
    vec4 red = vec4(0.88, 0.35, 0.36, 1.0);\
    vec4 orange = vec4(0.93, 0.56, 0.2, 1.0);\
    float step1 = steps.x;\
    float step2 = steps.y;\
    float step3 = steps.z;\
    float step4 = steps.w;\
    \
    vec4 color = mix(purple, red2, smoothstep(step1, step2, vUv.y));\
    color = mix(color, red, smoothstep(step2, step3, vUv.y));\
    color = mix(color, orange, smoothstep(step3, step4, vUv.y));\
    \
    gl_FragColor = vec4(color.xyz, opacity);\
  }\
// ';

AFRAME.registerComponent('ar-ui-modal-material', {
  schema: {
    steps: {type: 'vec4'},
    opacity: {type: 'number'}
  },
  init: function () {
    var data = this.data;
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        // time: { value: 0.0 },
        steps: { value: this.data.steps },
        opacity: { value: this.data.opacity }
      },
      transparent: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    this.applyToMesh();
    var self = this;
    this.el.addEventListener('model-loaded', function() { self.applyToMesh(); });
  },

  /**
   * Update the ShaderMaterial when component data changes.
   */
  update: function () {
    this.material.uniforms.steps.value = this.data.steps;
    this.material.uniforms.opacity.value = this.data.opacity;
  },

  /**
   * Apply the material to the current entity.
   */
  applyToMesh: function () {
    const mesh = this.el.getObject3D('mesh');
    if (mesh) {
      mesh.material = this.material;
    }
  },

  /**
   * On each frame, update the 'time' uniform in the shaders.
   */
  tick: function (t) {
    // this.material.uniforms.time.value = t / 1000;
  }

});
