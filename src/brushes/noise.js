/* globals AFRAME THREE */
(function () {
  var line = {
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,

    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float amount;
      uniform float time;
      varying vec2 vUv;

      vec3 hsv2rgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      void main() {
        float h = mod(vUv.x + time / 10000.0, 1.0);
        vec4 color = vec4(hsv2rgb(vec3(h, 1.0, 0.5)), 1.0);
        gl_FragColor = color;
      }
    `,
    init: function (color, brushSize) {
      this.idx = 0;
      this.geometry = new THREE.BufferGeometry();
      this.vertices = new Float32Array(this.options.maxPoints * 3 * 3);
      this.normals = new Float32Array(this.options.maxPoints * 3 * 3);
      this.uvs = new Float32Array(this.options.maxPoints * 2 * 2);
      this.linepositions = new Float32Array(this.options.maxPoints);

      this.geometry.setDrawRange(0, 0);
      this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setDynamic(true));
      this.geometry.addAttribute('uv', new THREE.BufferAttribute(this.uvs, 2).setDynamic(true));
      this.geometry.addAttribute('normal', new THREE.BufferAttribute(this.normals, 3).setDynamic(true));
      this.geometry.addAttribute('lineposition', new THREE.BufferAttribute(this.linepositions, 1).setDynamic(true));

      this.material = this.getMaterial();
      var mesh = new THREE.Mesh(this.geometry, this.material);
      mesh.drawMode = THREE.TriangleStripDrawMode;

      mesh.frustumCulled = false;
      mesh.vertices = this.vertices;

      this.object3D.add(mesh);
    },

    getMaterial: function () {
        return new THREE.ShaderMaterial({
          vertexShader: this.vertexShader,
          fragmentShader: this.fragmentShader,
          side: THREE.DoubleSide,
          uniforms: {
            time: {type: 'f', value: 0}
          }
        });
    },
    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {
      console.log("Add point")
      var uv = 0;
      for (i = 0; i < this.data.numPoints; i++) {
        this.uvs[ uv++ ] = i / (this.data.numPoints - 1);
        this.uvs[ uv++ ] = 0;

        this.uvs[ uv++ ] = i / (this.data.numPoints - 1);
        this.uvs[ uv++ ] = 1;
      }

      var direction = new THREE.Vector3();
      direction.set(1, 0, 0);
      direction.applyQuaternion(orientation);
      direction.normalize();

      var posA = pointerPosition.clone();
      var posB = pointerPosition.clone();
      var brushSize = this.data.size * pressure;
      posA.add(direction.clone().multiplyScalar(brushSize / 2));
      posB.add(direction.clone().multiplyScalar(-brushSize / 2));

      this.vertices[ this.idx++ ] = posA.x;
      this.vertices[ this.idx++ ] = posA.y;
      this.vertices[ this.idx++ ] = posA.z;

      this.vertices[ this.idx++ ] = posB.x;
      this.vertices[ this.idx++ ] = posB.y;
      this.vertices[ this.idx++ ] = posB.z;

      this.computeVertexNormals();
      this.geometry.attributes.normal.needsUpdate = true;
      this.geometry.attributes.position.needsUpdate = true;
      this.geometry.attributes.uv.needsUpdate = true;

      this.geometry.setDrawRange(0, this.data.numPoints * 2);

      return true;
    },

    tick: function(timeOffset, delta) {
      this.material.uniforms.time.value = timeOffset;
    },

    computeVertexNormals: function () {
      var pA = new THREE.Vector3();
      var pB = new THREE.Vector3();
      var pC = new THREE.Vector3();
      var cb = new THREE.Vector3();
      var ab = new THREE.Vector3();

      for (var i = 0, il = this.idx; i < il; i++) {
        this.normals[ i ] = 0;
      }

      var pair = true;
      for (i = 0, il = this.idx; i < il; i += 3) {
        if (pair) {
          pA.fromArray(this.vertices, i);
          pB.fromArray(this.vertices, i + 3);
          pC.fromArray(this.vertices, i + 6);
        } else {
          pA.fromArray(this.vertices, i + 3);
          pB.fromArray(this.vertices, i);
          pC.fromArray(this.vertices, i + 6);
        }
        pair = !pair;

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);
        cb.normalize();

        this.normals[ i ] += cb.x;
        this.normals[ i + 1 ] += cb.y;
        this.normals[ i + 2 ] += cb.z;

        this.normals[ i + 3 ] += cb.x;
        this.normals[ i + 4 ] += cb.y;
        this.normals[ i + 5 ] += cb.z;

        this.normals[ i + 6 ] += cb.x;
        this.normals[ i + 7 ] += cb.y;
        this.normals[ i + 8 ] += cb.z;
      }

      /*
      first and last vertice (0 and 8) belongs just to one triangle
      second and penultimate (1 and 7) belongs to two triangles
      the rest of the vertices belongs to three triangles

        1_____3_____5_____7
        /\    /\    /\    /\
       /  \  /  \  /  \  /  \
      /____\/____\/____\/____\
      0    2     4     6     8
      */

      // Vertices that are shared across three triangles
      for (i = 2 * 3, il = this.idx - 2 * 3; i < il; i++) {
        this.normals[ i ] = this.normals[ i ] / 3;
      }

      // Second and penultimate triangle, that shares just two triangles
      this.normals[ 3 ] = this.normals[ 3 ] / 2;
      this.normals[ 3 + 1 ] = this.normals[ 3 + 1 ] / 2;
      this.normals[ 3 + 2 ] = this.normals[ 3 * 1 + 2 ] / 2;

      this.normals[ this.idx - 2 * 3 ] = this.normals[ this.idx - 2 * 3 ] / 2;
      this.normals[ this.idx - 2 * 3 + 1 ] = this.normals[ this.idx - 2 * 3 + 1 ] / 2;
      this.normals[ this.idx - 2 * 3 + 2 ] = this.normals[ this.idx - 2 * 3 + 2 ] / 2;

      this.geometry.normalizeNormals();
    }
  };

  var lines = [
    {
      name: 'shadernoise',
      materialOptions: {
        type: 'shaded'
      },
      thumbnail: 'brushes/thumb_smooth.gif'
    }
  ];

  var textureLoader = new THREE.TextureLoader();

  for (var i = 0; i < lines.length; i++) {
    var definition = lines[i];
    if (definition.materialOptions.textureSrc) {
      definition.materialOptions.map = textureLoader.load(definition.materialOptions.textureSrc);
      delete definition.materialOptions.textureSrc;
    }
    AFRAME.registerBrush(definition.name, Object.assign({}, line, {materialOptions: definition.materialOptions}), {thumbnail: definition.thumbnail, maxPoints: 3000});
  }
})();
