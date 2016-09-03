var cubes = {
  init: function(color, width) {
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
  addPoint: function (position, rotation, intensity) {
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
  }
};

AFRAME.APAINTER.registerBrush('cubes', cubes);
