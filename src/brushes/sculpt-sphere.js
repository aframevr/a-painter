/* globals AFRAME THREE */
AFRAME.registerBrush('sculpt-sphere',
  {
    init: function (color, width) {
      this.material = new THREE.MeshStandardMaterial({
        color: this.data.color,
        roughness: 0.5,
        metalness: 0.5,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading
      });
      this.geometry = new THREE.SphereGeometry(0.5, 32, 32);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.object3D.add(this.mesh);
    },
    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {
      if (!this.firstPoint) {
        this.firstPoint = pointerPosition.clone();
        this.mesh.position.set(this.firstPoint.x, this.firstPoint.y, this.firstPoint.z)
      }
      var distance = this.firstPoint.distanceTo(pointerPosition) * 2;
      this.mesh.scale.set(distance, distance, distance);
      return true;
    }
  },
  {thumbnail: 'brushes/thumb_cubes.gif', spacing: 0.01}
);
