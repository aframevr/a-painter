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