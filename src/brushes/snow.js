/* globals AFRAME THREE */
(function(){
  var FLAKES_PER_POINT = 2;
  var vertexShader = `
    attribute float linePosition;

    uniform float time;
    uniform float size;

    varying float alpha;

    float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    float rand(float i) {
      return rand(vec2(i));
    }

    void main() {
      gl_PointSize = max(size * 100., 2.0);
      float r = rand(linePosition);
      float life = 1.0 - fract(time / (30.0 + 20.0 * r) + 120.0 * r);
      float xoff = cos(time / 10.0 + r * 10.0) / 30.0;
      float yoff = life / 2.0 + sin(time / 10.0 + r * 10.0) / 30.0 - 0.25;
      float zoff = sin(time / 10.0 + r * 120.0) / 30.0;
      vec3 pos = position + vec3(xoff, yoff, zoff);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
      alpha = 1.0 - (life - 0.5) * (life - 0.5) * 4.0;
    }
  `;

  var fragmentShader = `
    uniform sampler2D flake;
    uniform float time;

    varying float alpha;

    void main() {
      vec4 c = texture2D(flake, gl_PointCoord);
      c.a *= alpha / 2.0;
      gl_FragColor = c;
    }
  `;

  AFRAME.registerBrush('falling-snow',
    {
      init: function (color, brushSize) {
        this.idx = 0;
        this.geometry = new THREE.BufferGeometry();
        this.vertices = new Float32Array(this.options.maxPoints * 3 * FLAKES_PER_POINT);
        this.linePositions = new Float32Array(this.options.maxPoints * FLAKES_PER_POINT);
        this.currentLinePosition = 0;

        this.geometry.setDrawRange(0, 0);
        this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setDynamic(true));
        this.geometry.addAttribute('linePosition', new THREE.BufferAttribute(this.linePositions, 1).setDynamic(true));

        this.material = new THREE.ShaderMaterial({
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          side: THREE.DoubleSide,
          transparent: true,
          depthTest: false,
          uniforms: {
            flake: {type: 't', value: null},
            time: {type: 'f', value: 0},
            size: {type: 'f', value: this.data.size}
          }
        });

        var mesh = new THREE.Points(this.geometry, this.material);
        mesh.frustumCulled = false; // So that when its origin point goes off camera, the points dont disappear
        mesh.vertices = this.vertices;
        this.startTime = Date.now()

        var textureLoader = new THREE.TextureLoader();
        this.material.uniforms.flake.value = textureLoader.load("brushes/snowflake.png");

        this.object3D.add(mesh);
      },

      addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {
        for (var i = 0; i < FLAKES_PER_POINT; i++) {
          var linepos = this.currentLinePosition++
          this.linePositions[linepos] = linepos;
          this.vertices[ this.idx++ ] = pointerPosition.x;
          this.vertices[ this.idx++ ] = pointerPosition.y;
          this.vertices[ this.idx++ ] = pointerPosition.z;
        }

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.linePosition.needsUpdate = true;

        this.geometry.setDrawRange(0, this.data.numPoints * FLAKES_PER_POINT);

        return true;
      },

      tick: function(timeOffset, delta) {
        this.material.uniforms.time.value = (Date.now() - this.startTime) / 100.0;
      },
    },
    {thumbnail:'brushes/snowflake.png', maxPoints: 3000}
  );
})();
