/* globals AFRAME THREE */
(function(){
  var FLAKES_PER_POINT = 2;
  var vertexShader = `
    attribute float randValue;
    attribute float birthTime;

    uniform float time;
    uniform float size;

    varying float alpha;

    void main() {
      gl_PointSize = max(size * 100., 5.0);
      float r = randValue;
      float t = time - birthTime;
      // Give each flake its own random period between 30 and 50, and have
      // it cycle from 1.0 to 0.0 repeatedly.
      float life = 1.0 - fract(t / (30.0 + 20.0 * r));
      // X and Z will oscillate in a sinusoidal pattern of period 10,
      // while Y simply falls based on its life's speed.
      float xoff = cos(time / 10.0 + r * 10.0) / 30.0;
      float yoff =( 1.0 - life) / -2.0;
      float zoff = sin(time / 10.0 + r * 120.0) / 30.0;
      vec3 pos = position + vec3(xoff, yoff, zoff);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
      // The flake will fade in when it is born, and fade out before dying,
      // only to fade back in from (near) it's origin.
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
        this.randValues = new Float32Array(this.options.maxPoints * FLAKES_PER_POINT);
        this.birthTime = new Float32Array(this.options.maxPoints * FLAKES_PER_POINT);
        this.currentLinePosition = 0;

        this.geometry.setDrawRange(0, 0);
        this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setDynamic(true));
        this.geometry.addAttribute('randValue', new THREE.BufferAttribute(this.randValues, 1).setDynamic(true));
        this.geometry.addAttribute('birthTime', new THREE.BufferAttribute(this.randValues, 1).setDynamic(true));

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
          this.randValues[linepos] = Math.random();
          this.birthTime[linepos] = Date.now() - this.startTime;
          this.vertices[ this.idx++ ] = pointerPosition.x;
          this.vertices[ this.idx++ ] = pointerPosition.y;
          this.vertices[ this.idx++ ] = pointerPosition.z;
        }

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.randValue.needsUpdate = true;
        this.geometry.attributes.birthTime.needsUpdate = true;

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
