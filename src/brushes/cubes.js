/* globals AFRAME THREE */
var cubes = {
  init: function (color, width) {
    this.material = new THREE.MeshStandardMaterial({
      color: this.data.color,
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    });
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
  },
  addPoint: function (position, rotation, pointerPosition, pressure, timestamp) {
    var box = new THREE.Mesh(this.geometry, this.material);

    var sca = pressure * 0.02 * Math.random();
    box.scale.set(sca, sca, sca);
    box.position.copy(pointerPosition);
    box.rotation.copy(rotation);

    this.object3D.add(box);

    return true;
  }
};

AFRAME.registerBrush('cubes', cubes);
