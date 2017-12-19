function SharedBufferGeometry (material, primitiveMode) {
  this.material = material;
  this.primitiveMode = primitiveMode;

  this.maxBufferSize = 1000000;
  this.geometries = [];
  this.current = null;
  this.addBuffer(false);
}

SharedBufferGeometry.prototype = {
  restartPrimitive: function () {
    if (this.idx.positions >= this.current.attributes.position.count) {
      this.addBuffer(false);
    } else if (this.idx.positions !== 0) {
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

  addBuffer: function (copyLast) {
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

    this.previous = null;
    if (this.geometries.length > 0) {
      this.previous = this.current;
    }

    this.idx = {
      positions: 0,
      uvs: 0,
      normals: 0,
      colors: 0
    };

    this.geometries.push(geometry);
    this.current = geometry;

    console.log()
    if (this.previous && copyLast) {
//      debugger;
      var prev = (this.maxBufferSize - 2) * 3;
      var col = (this.maxBufferSize - 2) * 3;
      var uv = (this.maxBufferSize - 2) * 2;
      var norm = (this.maxBufferSize - 2) * 3;

      var position = this.previous.attributes.position.array;
      this.addVertice(position[prev++], position[prev++], position[prev++]);
      this.addVertice(position[prev++], position[prev++], position[prev++]);

      var normal = this.previous.attributes.normal.array;
      this.addNormal(normal[norm++], normal[norm++], normal[norm++]);
      this.addNormal(normal[norm++], normal[norm++], normal[norm++]);

      var color = this.previous.attributes.color.array;
      this.addColor(color[col++], color[col++], color[col++]);
      this.addColor(color[col++], color[col++], color[col++]);

      var uvs = this.previous.attributes.uv.array;
      this.addUV(uvs[uv++], uvs[uv++]);
      this.addUV(uvs[uv++], uvs[uv++]);

    }
    if (this.previous) {
      console.log(this.previous.attributes.position, this.current.attributes.position);
      console.log(this.previous.attributes.uv, this.current.attributes.uv);
    }
  },

  addColor: function (r, g, b) {
    this.current.attributes.color.setXYZ(this.idx.colors++, r, g, b);
  },

  addNormal: function (x, y, z) {
    this.current.attributes.normal.setXYZ(this.idx.normals++, x, y, z);
  },

  addVertice: function (x, y, z) {
    var buffer = this.current.attributes.position;
    if (this.idx.positions === buffer.count) {
      console.log('Need new buffer', this.idx.positions, buffer.count);
      this.addBuffer(true);
      buffer = this.current.attributes.position;
    }
    buffer.setXYZ(this.idx.positions++, x, y, z);
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