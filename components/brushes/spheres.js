var spheres = {
  init: function(color, width) {
    this.points = [];
    this.prevPoint = null;
    this.lineWidth = width;
    this.lineWidthModifier = 0.0;
    this.color = color.clone();

    this.idx = 0;
    this.numPoints = 0;
    this.maxPoints = 1000;
    this.material = new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    });
    this.mesh = new THREE.Group();
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

    var geometry = new THREE.IcosahedronGeometry( 0.01 * intensity, 0 );
    var sphere = new THREE.Mesh( geometry, this.material );

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

AFRAME.APAINTER.registerBrush('spheres', spheres);
