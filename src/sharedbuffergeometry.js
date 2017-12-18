function SharedBufferGeometry (material, primitiveMode) {
  this.material = material;
  this.primitiveMode = primitiveMode;

  this.maxBufferSize = 40000;
  this.geometries = [];
  this.current = null;
  this.addBuffer();
}

SharedBufferGeometry.prototype = {
  restartPrimitive: function () {
    if (this.idx.positions !== 0) {
      var prev = this.idx.positions - 3;
      var col = this.idx.colors - 3;

      var position = this.current.attributes.position.array;
      this.addVertice(position[prev++], position[prev++], position[prev++]);

      var color = this.current.attributes.color.array;
      this.addColor(color[col++], color[col++], color[col++]);
      this.addUV(0, 0);
    }
  },

  addBuffer: function () {
    var geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array(this.maxBufferSize * 3);
    var normals = new Float32Array(this.maxBufferSize * 3);
    var uvs = new Float32Array(this.maxBufferSize * 2);
    var colors = new Float32Array(this.maxBufferSize * 3);

    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.drawMode = this.primitiveMode;

    mesh.frustumCulled = false;
    mesh.vertices = vertices;

    this.object3D = new THREE.Object3D();
    var drawing = document.querySelector('.a-drawing');
    if (!drawing) {
      drawing = document.createElement('a-entity');
      drawing.className = "a-drawing";
      document.querySelector('a-scene').appendChild(drawing);
    }
    drawing.object3D.add(this.object3D);

    this.object3D.add(mesh);

    geometry.setDrawRange(0, 0);
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3).setDynamic(true));
    geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2).setDynamic(true));
    geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3).setDynamic(true));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(true));

    this.idx = {
      positions: 0,
      uvs: 0,
      normals: 0,
      colors: 0
    };

    this.geometries.push(geometry);
    this.current = geometry;
  },

  addColor: function (r, g, b) {
    var color = this.current.attributes.color.array;

    color[this.idx.colors++] = r;
    color[this.idx.colors++] = g;
    color[this.idx.colors++] = b;
  },

  addNormal: function (x, y, z) {
    var normal = this.current.attributes.normal.array;

    normal[this.idx.normals++] = x;
    normal[this.idx.normals++] = y;
    normal[this.idx.normals++] = z;
  },

  computeVertexNormals: (function () {
    var pA = new THREE.Vector3();
    var pB = new THREE.Vector3();
    var pC = new THREE.Vector3();
    var cb = new THREE.Vector3();
    var ab = new THREE.Vector3();
    var vector = new THREE.Vector3();

    return function () {
      var idx = this.idx.positions;

      var normals = this.current.attributes.normal.array;

      for (var i = 0, il = idx; i < il; i++) {
        normals[i] = 0;
      }

      var vertices = this.current.attributes.position.array;

      var pair = true;
      for (i = 0, il = idx; i < il; i += 3) {
        if (pair) {
          pA.fromArray(vertices, i);
          pB.fromArray(vertices, i + 3);
          pC.fromArray(vertices, i + 6);
        } else {
          pA.fromArray(vertices, i + 3);
          pB.fromArray(vertices, i);
          pC.fromArray(vertices, i + 6);
        }
        pair = !pair;

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);
        cb.normalize();

        normals[i] += cb.x;
        normals[i + 1] += cb.y;
        normals[i + 2] += cb.z;

        normals[i + 3] += cb.x;
        normals[i + 4] += cb.y;
        normals[i + 5] += cb.z;

        normals[i + 6] += cb.x;
        normals[i + 7] += cb.y;
        normals[i + 8] += cb.z;
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
      for (i = 2 * 3, il = idx - 2 * 3; i < il; i++) {
        normals[i] = normals[i] / 3;
      }

      // Second and penultimate triangle, that shares just two triangles
      normals[3] = normals[3] / 2;
      normals[3 + 1] = normals[3 + 1] / 2;
      normals[3 + 2] = normals[3 * 1 + 2] / 2;

      normals[idx - 2 * 3] = normals[idx - 2 * 3] / 2;
      normals[idx - 2 * 3 + 1] = normals[idx - 2 * 3 + 1] / 2;
      normals[idx - 2 * 3 + 2] = normals[idx - 2 * 3 + 2] / 2;

      var normals = this.current.attributes.normal;

      for (var i = 0, il = idx; i < il; i++) {

        vector.x = normals.getX(i);
        vector.y = normals.getY(i);
        vector.z = normals.getZ(i);

        vector.normalize();

        normals.setXYZ(i, vector.x, vector.y, vector.z);
      }
    }
  })(),

  addVertice: function (x, y, z) {
    var position = this.current.attributes.position.array;

    position[this.idx.positions++] = x;
    position[this.idx.positions++] = y;
    position[this.idx.positions++] = z;
  },

  addNormal: function (x, y, z) {
    var normal = this.current.attributes.normal.array;

    normal[this.idx.normals++] = x;
    normal[this.idx.normals++] = y;
    normal[this.idx.normals++] = z;
  },


  addUV: function (u, v) {
    var uvs = this.current.attributes.uv.array;

    uvs[this.idx.uvs++] = u;
    uvs[this.idx.uvs++] = v;
  },

  update: function () {
    this.current.setDrawRange(0, this.idx.positions / 3);

    this.current.attributes.color.needsUpdate = true;
    this.current.attributes.normal.needsUpdate = true;
    this.current.attributes.position.needsUpdate = true;
    this.current.attributes.uv.needsUpdate = true;
  }
};

module.exports = SharedBufferGeometry;