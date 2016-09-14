/* globals AFRAME THREE */
var spheres = {
  init: function (color, width) {
    this.material = new THREE.MeshStandardMaterial({
      color: this.data.color,
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    });
    this.geometry = new THREE.IcosahedronGeometry(1, 0);
  },
  addPoint: function (position, rotation, pointerPosition, pressure, timestamp) {
    var sphere = new THREE.Mesh(this.geometry, this.material);
    var sca = this.data.size / 2  * pressure;
    sphere.scale.set(sca, sca, sca);
    sphere.position.copy(pointerPosition);
    sphere.rotation.copy(rotation);

    this.object3D.add(sphere);

    return true;
  }
};

AFRAME.registerBrush('spheres', spheres, {thumbnail: 'brushes/thumb_spheres.png', spacing: 0.01});
