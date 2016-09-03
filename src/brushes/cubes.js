var cubes = {
  init: function(color, width) {
    this.material = this.getMaterial();
    this.mesh = new THREE.Group();
  },
  getMaterial: function() {
    return new THREE.MeshStandardMaterial({
      color: this.data.color,
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    });
  },
  addPoint: function (position, rotation, pointerPosition, pressure, timestamp) {
    var geometry = new THREE.BoxGeometry(1,1,1);
    var sphere = new THREE.Mesh(geometry, this.material);

    var sca = pressure * 0.02 * Math.random();
    sphere.scale.set(sca,sca,sca);
    sphere.position.copy(pointerPosition);
    sphere.rotation.copy(rotation);

    this.mesh.add(sphere);
  }
};

AFRAME.APAINTER.registerBrush('cubes', cubes);
