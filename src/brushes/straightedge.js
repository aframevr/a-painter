/* globals AFRAME THREE */
AFRAME.registerBrush('straightedge',
  {
    init: function (color, width) {
      this.material = new THREE.LineBasicMaterial({
        color: this.data.color,
        linewidth: 15,
        side: THREE.DoubleSide
      });
      this.geometry = new THREE.BufferGeometry();
      this.positions = new Float32Array(2 * 3);
      this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
      this.line = new THREE.Line(this.geometry, this.material)
      this.line.frustumCulled = false;
      this.object3D.add(this.line);
    },

    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {
      this.material.linewidth = this.data.size * 100

      if (this.data.numPoints == 0) {
        this.positions[0] = pointerPosition.x;
        this.positions[1] = pointerPosition.y;
        this.positions[2] = pointerPosition.z;
      }

      // Always set the second position, even when its the first point,
      // otherwise there will be a quick line to 0,0,0 before the second point
      // is added.
      this.positions[3] = pointerPosition.x;
      this.positions[4] = pointerPosition.y;
      this.positions[5] = pointerPosition.z;

      this.geometry.attributes.position.needsUpdate = true
      return true;
    }
  },
  {thumbnail: 'brushes/thumb_cubes.gif', spacing: 0.01}
);
