function SharedBufferGeometry (material) {
  this.material = material;

  this.maxBufferSize = 1000000;
  this.geometries = [];
  this.current = null;
  this.addBuffer(false);
}

SharedBufferGeometry.prototype = {
  restartPrimitive: function () {
    if (this.idx.position >= this.current.attributes.position.count) {
      this.addBuffer(false);
    } else if (this.idx.position !== 0) {
      var prev = (this.idx.position - 1) * 3;
      var position = this.current.attributes.position.array;
      this.addVertex(position[prev++], position[prev++], position[prev++]);

      this.idx.color++;
      this.idx.normal++;
      this.idx.uv++;
    }
  },

  remove: function (prevIdx, idx) {
    var pos = this.current.attributes.position.array;

    // Loop through all the attributes: position, color, uv, normal,...
    if (this.idx.position > idx.position) {
      for (key in this.idx) {
        var componentSize = key === 'uv' ? 2 : 3;
        var pos = (prevIdx[key]) * componentSize;
        var start = (idx[key] + 1) * componentSize;
        var end = this.idx[key] * componentSize;
        for (var i = start; i < end; i++) {
          this.current.attributes[key].array[pos++] = this.current.attributes[key].array[i];
        }
      }
    }

    for (key in this.idx) {
      var diff = (idx[key] - prevIdx[key]);
      this.idx[key] -= diff;
    }

    this.update();
  },

  undo: function (prevIdx) {
    for (let i = prevIdx.position; i < this.idx.position; i++) {
      this.current.attributes.position.setXYZ(i, 0, 0, 0);
      this.current.index.setXYZ(i, 0, 0, 0);
    }
    this.idx = prevIdx;
    this.update();
  },

  addBuffer: function (copyLast) {
    var geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array(this.maxBufferSize * 3);
    var indices = new Uint32Array(this.maxBufferSize * 1.5);
    var normals = new Float32Array(this.maxBufferSize * 3);
    var uvs = new Float32Array(this.maxBufferSize * 2);
    var colors = new Float32Array(this.maxBufferSize * 3);

    var mesh = new THREE.Mesh(geometry, this.material);

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
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setIndex(new THREE.BufferAttribute(indices, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));


    this.previous = null;
    if (this.geometries.length > 0) {
      this.previous = this.current;
    }

    this.idx = {
      position: 0,
      uv: 0,
      normal: 0,
      color: 0
    };

    this.geometries.push(geometry);
    this.current = geometry;

    if (this.previous && copyLast) {
      var prev = (this.maxBufferSize - 2) * 3;
      var col = (this.maxBufferSize - 2) * 3;
      var uv = (this.maxBufferSize - 2) * 2;
      var norm = (this.maxBufferSize - 2) * 3;

      var position = this.previous.attributes.position.array;
      this.addVertex(position[prev++], position[prev++], position[prev++]);
      this.addVertex(position[prev++], position[prev++], position[prev++]);

      var normal = this.previous.attributes.normal.array;
      this.addNormal(normal[norm++], normal[norm++], normal[norm++]);
      this.addNormal(normal[norm++], normal[norm++], normal[norm++]);

      var color = this.previous.attributes.color.array;
      this.addColor(color[col++], color[col++], color[col++]);
      this.addColor(color[col++], color[col++], color[col++]);

      var uvs = this.previous.attributes.uv.array;

    }
  },

  addColor: function (r, g, b) {
    this.current.attributes.color.setXYZ(this.idx.color++, r, g, b);
  },

  addNormal: function (x, y, z) {
    this.current.attributes.normal.setXYZ(this.idx.normal++, x, y, z);
  },

  addVertex: function (x, y, z) {
    var buffer = this.current.attributes.position;
    if (this.idx.position === buffer.count) {
      this.addBuffer(true);
      buffer = this.current.attributes.position;
    }
    buffer.setXYZ(this.idx.position++, x, y, z);
    if ((this.idx.position + 1) % 2 == 0 && this.idx.position > 1) {
      this.current.index.setXYZ(this.idx.position - 3, this.idx.position - 3, this.idx.position - 2, this.idx.position - 1);
      this.current.index.setXYZ(this.idx.position - 2, this.idx.position - 1, this.idx.position - 2, this.idx.position);
    }
  },

  addUV: function (u, v) {
    this.current.attributes.uv.setXY(this.idx.uv++, u, v);
  },

  update: function () {
    this.current.setDrawRange(0, this.idx.position * 3);

    this.current.attributes.color.needsUpdate = true;
    this.current.attributes.normal.needsUpdate = true;
    this.current.attributes.position.needsUpdate = true;
    this.current.attributes.uv.needsUpdate = true;
    this.current.index.needsUpdate = true;
  }
};

module.exports = SharedBufferGeometry;
