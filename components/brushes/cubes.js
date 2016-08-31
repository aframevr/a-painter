var cubes = {
  init: function(color, width) {
    this.points = [];
    this.prevPoint = null;
    this.lineWidth = width;
    this.lineWidthModifier = 0.0;
    this.color = color.clone();

    this.idx = 0;
    this.numPoints = 0;
    this.maxPoints = 1000;
    this.material = this.getMaterial();
    this.mesh = new THREE.Group();
  },
  getMaterial: function() {
    return new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    });
  },
  getBinary: function () {
    var color = this.color;
    var points = this.points;
    // Point = vector3(3) + quat(4) + intensity(1)
    // Color = 3*4 = 12
    // NumPoints = 4
    var bufferSize = 16 + ((1+3+4) * 4 * points.length);
    var binaryWriter = new BinaryWriter(bufferSize);
    //console.log(color, points.length);
    binaryWriter.writeColor(color);
    binaryWriter.writeUint32(points.length);

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      binaryWriter.writeArray(point.position.toArray());
      binaryWriter.writeArray(point.rotation.toArray());
      binaryWriter.writeFloat(point.intensity);
    }
    return binaryWriter.getDataView();
  },
  addPoint: function (position, rotation, intensity) {
    if (this.prevPoint && this.prevPoint.equals(position)) {
      return;
    }
    this.prevPoint = position.clone();

    var direction = new THREE.Vector3();
    direction.set(0, 1.7, 1);
    direction.applyQuaternion(rotation);
    direction.normalize();
    var posBase = position.clone().add(direction.clone().multiplyScalar(-0.08));

    var geometry = new THREE.BoxGeometry(1,1,1);
    var sphere = new THREE.Mesh( geometry, this.material );

    var sca = intensity*0.02 * Math.random();
    sphere.scale.set(sca,sca,sca);
    sphere.position.copy(posBase);
    sphere.rotation.copy(rotation);

    this.mesh.add(sphere);

    this.numPoints++;

    this.points.push({
      'position': position,
      'rotation': rotation,
      'intensity': intensity
    });
  }
};

AFRAME.APAINTER.registerBrush('cubes', cubes);
