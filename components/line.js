function Line (color, lineWidth) {
  this.points = [];
  this.lineWidth = lineWidth;
  this.lineWidthModifier = 0.0;
  this.color = color.clone();
  var textureLoader = new THREE.TextureLoader();

  this.texture = textureLoader.load('stroke1.png', function (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
  });

  var material = new THREE.MeshStandardMaterial({
    color: this.color,
    roughness: 0.5,
    metalness: 0.5,
    side: THREE.DoubleSide,
    //shading: THREE.FlatShading,
    /*
    map: this.texture,
    transparent: true,
    alphaTest: 0.5
*/
  });
  this.idx = 0;
  this.numPoints = 0;
  this.maxPoints = 1000;
  this.geometry = new THREE.BufferGeometry();
  //this.vertices = new Float32Array(this.maxPoints * 3 * 2);
  this.vertices = new Float32Array(this.maxPoints * 3 * 3);
  this.normals = new Float32Array(this.maxPoints * 3 * 3);
  this.uvs = new Float32Array(this.maxPoints * 2 * 2);

  this.geometry.setDrawRange(0, 0);
  this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setDynamic(true));
  this.geometry.addAttribute('uv', new THREE.BufferAttribute(this.uvs, 2).setDynamic(true));
  this.geometry.addAttribute('normal', new THREE.BufferAttribute(this.normals, 3).setDynamic(true));

  this.mesh = new THREE.Mesh(this.geometry, material);
  this.mesh.drawMode = THREE.TriangleStripDrawMode;

  this.mesh.frustumCulled = false;
  this.mesh.vertices = this.vertices;
}

Line.prototype = {
  getBinary: function () {
    var color = this.color;
    var points = this.points;
    // Point = vector3(3) + quat(4) + intensity(1)
    // Color = 3*4 = 12
    // NumPoints = 4
    var bufferSize = 16 + ((1+3+4) * 4 * points.length);
    var binaryWriter = new BinaryWriter(bufferSize);
    var isLittleEndian = true;

    console.log(color, points.length);
    binaryWriter.writeColor(color, isLittleEndian);
    binaryWriter.writeUint32(points.length, isLittleEndian);

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      binaryWriter.writeArray(point.position.toArray(), isLittleEndian);
      binaryWriter.writeArray(point.rotation.toArray(), isLittleEndian);
      binaryWriter.writeFloat(point.intensity, isLittleEndian);
    }
    return binaryWriter.getDataView();
  },
  setInitialPosition: function (position, rotation) {
    //this.numPoints++;
    var direction = new THREE.Vector3();
    direction.set(0, 1.7, 1);
    direction.applyQuaternion(rotation);
    direction.normalize();
    var posBase = position.clone().add(direction.clone().multiplyScalar(-0.08));

    direction.set(1, 0, 0);
    direction.applyQuaternion(rotation);
    direction.normalize();

    var posA = posBase.clone();
    var posB = posBase.clone();
    var lineWidth = this.lineWidth * this.lineWidthModifier;
    posA.add(direction.clone().multiplyScalar(lineWidth));
    posB.add(direction.clone().multiplyScalar(-lineWidth));

    this.vertices[ this.idx++ ] = posA.x;
    this.vertices[ this.idx++ ] = posA.y;
    this.vertices[ this.idx++ ] = posA.z;

    this.vertices[ this.idx++ ] = posB.x;
    this.vertices[ this.idx++ ] = posB.y;
    this.vertices[ this.idx++ ] = posB.z;


/*
    for (var j = 0; j < this.vertices.length / 2; j += 3) {
      this.vertices[ i++ ] = posA.x;
      this.vertices[ i++ ] = posA.y;
      this.vertices[ i++ ] = posA.z;

      this.vertices[ i++ ] = posB.x;
      this.vertices[ i++ ] = posB.y;
      this.vertices[ i++ ] = posB.z;
    }
/*
    i = 0;
    for (j = 0; j < this.uvs.length / 2; j += 2) {
      var v = (j / 2) / (this.uvs.length / 2);
      this.uvs[ i++ ] = v;
      this.uvs[ i++ ] = 0;

      this.uvs[ i++ ] = v;
      this.uvs[ i++ ] = 1;
    }
*/
    this.numPoints++;

  },
  getJSON: function () {
    return {
      stroke: {color: this.color},
      points: this.points
    };
  },
  addPoint: function (position, rotation, intensity) {

    this.lineWidth = 0.2;
/*
    // Rotate vertices
    for (var j = 0; j < this.vertices.length - 3; j += 3) {
      this.vertices[ j ] = this.vertices[ j + 6 ];
      this.vertices[ j + 1 ] = this.vertices[ j + 7 ];
      this.vertices[ j + 2 ] = this.vertices[ j + 8 ];

      this.vertices[ j + 3 ] = this.vertices[ j + 9 ];
      this.vertices[ j + 4 ] = this.vertices[ j + 10 ];
      this.vertices[ j + 5 ] = this.vertices[ j + 11 ];
    }
/*
    for (i = 0; i < this.uvs.length; i += 2) {
      //var v = (j / 2) / (this.uvs.length / 2);
      this.uvs[ j  ] = 1/this.uvs.length;
      this.uvs[ j + 1 ] = 0;

      this.uvs[ j + 2] = 1/this.uvs.length;
      this.uvs[ j + 3] = 1;
    }
*/
    var direction = new THREE.Vector3();
    direction.set(0, 1.7, 1);
    direction.applyQuaternion(rotation);
    direction.normalize();
    var posBase = position.clone().add(direction.clone().multiplyScalar(-0.08));

    direction = new THREE.Vector3();
    direction.set(1, 0, 0);
    direction.applyQuaternion(rotation);
    direction.normalize();

    var posA = posBase.clone();
    var posB = posBase.clone();
    var lineWidth = this.lineWidth * intensity;
    posA.add(direction.clone().multiplyScalar(lineWidth));
    posB.add(direction.clone().multiplyScalar(-lineWidth));

    //this.idx =
//    this.vertices.length - 6;
//    var idxUV = this.uvs.length - 4;

    var idx = this.idx;
    this.vertices[ this.idx++ ] = posA.x;
    this.vertices[ this.idx++ ] = posA.y;
    this.vertices[ this.idx++ ] = posA.z;

    this.vertices[ this.idx++ ] = posB.x;
    this.vertices[ this.idx++ ] = posB.y;
    this.vertices[ this.idx++ ] = posB.z;

/*
    this.uvs[ idxUV++ ] = 0.5;
    this.uvs[ idxUV++ ] = 0;

    this.uvs[ idxUV++ ] = .1;
    this.uvs[ idxUV++ ] = .1;
*/

    this.geometry.attributes.normal.needsUpdate = true;
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.uv.needsUpdate = true;
    this.geometry.computeVertexNormals();
    //this.geometry.computeFaceNormals();
    //this.geometry.normalsNeedUpdate = true;
    this.numPoints++;
    this.geometry.setDrawRange(0, this.numPoints * 2);

    this.points.push({
      'position': position,
      'rotation': rotation,
      'intensity': intensity
    });
  }
};
