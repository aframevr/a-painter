/* globals AFRAME THREE */
AFRAME.registerBrush('single-sphere',
  {
    init: function (color, width) {
      this.material = new THREE.MeshStandardMaterial({
        color: this.data.color,
        roughness: 0.6,
        metalness: 0.2,
        side: THREE.FrontSide,
        flatShading: true
      });
      this.geometry = new THREE.IcosahedronGeometry(1, 2);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.object3D.add(this.mesh);
      this.mesh.visible = false;
      this.drawing = document.querySelector('.a-drawing');
      this.drawing.object3D.add(this.object3D);
    },
    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {
      if (!this.firstPoint) {
        this.firstPoint = pointerPosition.clone();
        this.mesh.position.set(this.firstPoint.x, this.firstPoint.y, this.firstPoint.z)
      }
      this.mesh.visible = true
      var distance = this.firstPoint.distanceTo(pointerPosition);
      this.mesh.scale.set(distance, distance, distance);
      return true;
    },
    undo: function () {
      this.drawing.object3D.children.pop();
    }
  },
  {thumbnail: 'brushes/thumb_single_sphere.png', spacing: 0.0}
);
