function SharedBufferGeometry (material, primitiveMode) {
  this.material = material;
  this.primitiveMode = primitiveMode;

  this.maxBufferSize = 50;
  this.geometries = [];
  this.current = null;
  this.addBuffer();
}

SharedBufferGeometry.prototype = {
  restartPrimitive: function () {
    if (this.idx.positions !== 0) {
      var prev = (this.idx.positions - 1) * 3;
      var col = (this.idx.colors - 1) * 3;
      var uv = (this.idx.uvs - 1) * 3;

      var position = this.current.attributes.position.array;
      this.addVertice(position[prev++], position[prev++], position[prev++]);

      var color = this.current.attributes.color.array;
      this.addColor(color[col++], color[col++], color[col++]);

      var uvs = this.current.attributes.uv.array;
      this.addUV(uvs[uv++], uvs[uv++]);
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

    if (this.geometries.length > 0) {

    }

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
    this.current.attributes.color.setXYZ(this.idx.colors++, r, g, b);
  },

  addNormal: function (x, y, z) {
    this.current.attributes.normal.setXYZ(this.idx.normals++, x, y, z);
  },

  addVertice: function (x, y, z) {
    var buffer = this.current.attributes.position;
    buffer.setXYZ(this.idx.positions++, x, y, z);
    if (this.idx.positions > buffer.count) {
      console.log('ADDDing buffer');
      this.addBuffer();
    }
  },

  addUV: function (u, v) {
    this.current.attributes.uv.setXY(this.idx.uvs++, u, v);
  },

  update: function () {
    this.current.setDrawRange(0, this.idx.positions);

    this.current.attributes.color.needsUpdate = true;
    this.current.attributes.normal.needsUpdate = true;
    this.current.attributes.position.needsUpdate = true;
    this.current.attributes.uv.needsUpdate = true;
  }
};

module.exports = SharedBufferGeometry;