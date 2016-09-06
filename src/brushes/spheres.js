var spheres = {
  init: function(color, width) {
    this.material = new THREE.MeshStandardMaterial({
      color: this.data.color,
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    });
    this.mesh = new THREE.Group();
  },
  addPoint: function (position, rotation, pointerPosition, pressure, timestamp) {
    var geometry = new THREE.IcosahedronGeometry(0.01 * pressure, 0);
    var sphere = new THREE.Mesh(geometry, this.material);

    sphere.position.copy(pointerPosition);
    sphere.rotation.copy(rotation);

    this.mesh.add(sphere);

    return true;
  }
};

AFRAME.APAINTER.registerBrush('spheres', spheres);
