/* globals AFRAME THREE */
AFRAME.registerBrush('cubes',
  {
    init: function (color, width) {
      this.material = new THREE.MeshStandardMaterial({
        color: this.data.color,
        roughness: 0.5,
        metalness: 0.5,
        side: THREE.DoubleSide,
        flatShading: true
      });
      this.geometry = new THREE.BoxGeometry(1, 1, 1);
      this.drawing = document.querySelector('.a-drawing');
      this.drawing.object3D.add(this.object3D);
    },
    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {
      var box = new THREE.Mesh(this.geometry, this.material);

      var sca = pressure * this.data.size * Math.random();
      box.scale.set(sca, sca, sca);
      box.position.copy(pointerPosition);
      box.quaternion.copy(orientation);

      this.object3D.add(box);

      return true;
    },
    undo: function () {
      this.drawing.object3D.children.pop();
    }
  },
  {thumbnail: 'brushes/thumb_cubes.gif', spacing: 0.01}
);
