/* globals AFRAME THREE */
(function(){
  var vertexShader = "varying vec2 vUv; \
    void main() { \
      vUv = uv; \
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); \
    }";

  var fragmentShader = "uniform sampler2D tDiffuse; \
    uniform float amount; \
    uniform float time; \
    varying vec2 vUv; \
    \
    vec3 hsv2rgb(vec3 c) { \
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0); \
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www); \
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y); \
    } \
    \
    void main() { \
      float h = mod(vUv.x - time / 3000.0, 1.0); \
      vec4 color = vec4(hsv2rgb(vec3(h, 1.0, 0.5)), 1.0); \
      gl_FragColor = color; \
    }";

  var material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
      time: {type: 'f', value: 0}
    }
  });

  AFRAME.registerBrush('line-rainbow',
    {
      init: function (color, brushSize) {
        this.idx = 0;
        this.geometry = new THREE.BufferGeometry();
        this.vertices = new Float32Array(this.options.maxPoints * 3 * 3);
        this.uvs = new Float32Array(this.options.maxPoints * 2 * 2);
        this.linepositions = new Float32Array(this.options.maxPoints);

        this.geometry.setDrawRange(0, 0);
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setUsage(THREE.DynamicDrawUsage));
        this.geometry.setAttribute('uv', new THREE.BufferAttribute(this.uvs, 2).setUsage(THREE.DynamicDrawUsage));
        this.geometry.setAttribute('lineposition', new THREE.BufferAttribute(this.linepositions, 1).setUsage(THREE.DynamicDrawUsage));

        this.material = material;
        var mesh = new THREE.Mesh(this.geometry, this.material);

        mesh.frustumCulled = false;
        mesh.vertices = this.vertices;

        this.object3D.add(mesh);
      },
      addPoint: (function () {
        var direction = new THREE.Vector3();
        var posA = new THREE.Vector3();
        var posB = new THREE.Vector3();
        var auxDir = new THREE.Vector3();

        return function (position, orientation, pointerPosition, pressure, timestamp) {
          var uv = 0;
          for (i = 0; i < this.data.numPoints; i++) {
            this.uvs[uv++] = i / (this.data.numPoints - 1);
            this.uvs[uv++] = 0;

            this.uvs[uv++] = i / (this.data.numPoints - 1);
            this.uvs[uv++] = 1;
          }

          direction.set(1, 0, 0);
          direction.applyQuaternion(orientation);
          direction.normalize();

          posA.copy(pointerPosition);
          posB.copy(pointerPosition);

          var brushSize = this.data.size * pressure;
          posA.add(auxDir.copy(direction).multiplyScalar(brushSize / 2));
          posB.add(auxDir.copy(direction).multiplyScalar(-brushSize / 2));

          this.vertices[this.idx++] = posA.x;
          this.vertices[this.idx++] = posA.y;
          this.vertices[this.idx++] = posA.z;

          this.vertices[this.idx++] = posB.x;
          this.vertices[this.idx++] = posB.y;
          this.vertices[this.idx++] = posB.z;

          this.geometry.attributes.position.needsUpdate = true;
          this.geometry.attributes.uv.needsUpdate = true;

          this.geometry.setDrawRange(0, this.data.numPoints * 2);

          return true;
        }        
      })(),
      tick: function(timeOffset, delta) {
        this.material.uniforms.time.value = timeOffset;
      },
    },
    {thumbnail:'brushes/thumb_rainbow.png', maxPoints: 3000}
  );
})();
