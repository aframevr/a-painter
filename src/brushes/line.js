var line = {
  init: function(color, brushSize) {
    this.idx = 0;
    this.geometry = new THREE.BufferGeometry();
    this.vertices = new Float32Array(this.data.maxPoints * 3 * 3);
    this.normals = new Float32Array(this.data.maxPoints * 3 * 3);
    this.uvs = new Float32Array(this.data.maxPoints * 2 * 2);

    this.texture = null;

    this.geometry.setDrawRange(0, 0);
    this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setDynamic(true));
    this.geometry.addAttribute('uv', new THREE.BufferAttribute(this.uvs, 2).setDynamic(true));
    this.geometry.addAttribute('normal', new THREE.BufferAttribute(this.normals, 3).setDynamic(true));

    this.mesh = new THREE.Mesh(this.geometry, this.getMaterial());
    this.mesh.drawMode = THREE.TriangleStripDrawMode;

    this.mesh.frustumCulled = false;
    this.mesh.vertices = this.vertices;
  },
  getMaterial: function () {
    var textureSrc = this.materialOptions.textureSrc;
    var type = this.materialOptions.type;
    delete this.materialOptions.textureSrc;
    delete this.materialOptions.type;

    var defaultOptions = {};
    var defaultTextureOptions = {};
    if (textureSrc) {
      // Load texture
      var textureLoader = new THREE.TextureLoader();
      this.texture = textureLoader.load(textureSrc);

      defaultTextureOptions = {
        map: this.texture,
        transparent: true,
        alphaTest: 0.5
      };
    }

    if (this.materialOptions.type === 'shaded') {
      defaultOptions = {
        color: this.data.color,
        roughness: 0.5,
        metalness: 0.5,
        side: THREE.DoubleSide,
      };
    }
    else {
      defaultOptions = {
        color: this.data.color,
        side: THREE.DoubleSide
      };
    }

    var options = Object.assign(defaultOptions, defaultTextureOptions, this.materialOptions);
    return new THREE.MeshBasicMaterial(options);

    if (type === 'flat') {
      return new THREE.MeshBasicMaterial(options);
    } else {
      return new THREE.MeshStandardMaterial(options);
    }
  },
  addPoint: function (position, rotation, pointerPosition, pressure, timestamp) {
    var uv = 0;
    for (i = 0; i < this.data.numPoints; i++) {
      this.uvs[ uv++ ] = i / (this.data.numPoints - 1);
      this.uvs[ uv++ ] = 0;

      this.uvs[ uv++ ] = i / (this.data.numPoints - 1);
      this.uvs[ uv++ ] = 1;
    }

    direction = new THREE.Vector3();
    direction.set(1, 0, 0);
    direction.applyQuaternion(rotation);
    direction.normalize();

    var posA = pointerPosition.clone();
    var posB = pointerPosition.clone();
    var brushSize = this.data.size * pressure;
    posA.add(direction.clone().multiplyScalar(brushSize));
    posB.add(direction.clone().multiplyScalar(-brushSize));

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
  computeVertexNormals: function () {
    var vA, vB, vC,

    pA = new THREE.Vector3(),
    pB = new THREE.Vector3(),
    pC = new THREE.Vector3(),

    cb = new THREE.Vector3(),
    ab = new THREE.Vector3();

    for (var i = 0, il = this.idx; i < il; i ++) {
      this.normals[ i ] = 0;
    }

    var n = 0;
    var pair = true;
    for (var i = 0, il = this.idx; i < il; i += 3) {
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

      this.normals[ i ]     += cb.x;
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
    for (var i = 2 * 3, il = this.idx - 2 * 3; i < il; i ++) {
      this.normals[ i ] = this.normals[ i ] / 3;
    }

    // Second and penultimate triangle, that shares just two triangles
    this.normals[ 3 ] = this.normals[ 3 ] / 2;
    this.normals[ 3 + 1 ] = this.normals[ 3 + 1 ] / 2;
    this.normals[ 3 + 2 ] = this.normals[ 3 * 1 + 2 ] / 2;

    this.normals[ this.idx - 2 * 3] = this.normals[  this.idx - 2 * 3 ] / 2;
    this.normals[ this.idx - 2 * 3 + 1 ] = this.normals[  this.idx - 2 * 3 + 1] / 2;
    this.normals[ this.idx - 2 * 3 + 2] = this.normals[  this.idx - 2 * 3 + 2] / 2;

    this.geometry.normalizeNormals();
  }
};

var lines = [
  {
    name: 'flat',
    materialOptions: {
      type: 'flat'
    },
    thumbnail: ''
  },
  {
    name: 'shaded',
    materialOptions: {
      type: 'shaded'
    },
    thumbnail: ''
  },
  {
    name: 'bristles',
    materialOptions: {
      type: 'shaded',
      textureSrc: 'brushes/bristles0.png'
    },
    thumbnail: 'brushes/thumb_bristles0.png'
  },
  {
    name: 'fur',
    materialOptions: {
      type: 'shaded',
      textureSrc: 'brushes/fur0.png'
    },
    thumbnail: 'brushes/thumb_fur0.png'
  },
  {
    name: 'fur 2',
    materialOptions: {
      type: 'shaded',
      textureSrc: 'brushes/fur1.png'
    },
    thumbnail: 'brushes/thumb_fur1.png'
  },
  {
    name: 'grunge',
    materialOptions: {
      type: 'shaded',
      textureSrc: 'brushes/grunge0.png'
    },
    thumbnail: 'brushes/thumb_grunge0.png'
  },
  {
    name: 'roundflat',
    materialOptions: {
      type: 'shaded',
      textureSrc: 'brushes/roundflat.png'
    },
    thumbnail: 'brushes/thumb_roundflat.png'
  },
  {
    name: 'roundsoft',
    materialOptions: {
      type: 'shaded',
      textureSrc: 'brushes/roundsoft.png'
    },
    thumbnail: 'brushes/thumb_roundsoft.png'
  },
  {
    name: 'smoke',
    materialOptions: {
      type: 'textured',
      textureSrc: 'brushes/smoke0.png'
    },
    thumbnail: 'brushes/thumb_smoke0.png'
  },
]

for (var i = 0; i < lines.length; i++) {
  var definition = lines[i];
  AFRAME.APAINTER.registerBrush(definition.name, Object.assign({}, line, {materialOptions: definition.materialOptions }, {thumbnail: definition.thumbnail }));
}
