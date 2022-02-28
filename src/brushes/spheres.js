/* globals AFRAME THREE */
AFRAME.registerBrush('spheres',
  {
    init: function (color, width) {
      // Initialize the material based on the stroke color
      this.material = new THREE.MeshStandardMaterial({
        color: this.data.color,
        roughness: 0.5,
        metalness: 0.5,
        side: THREE.DoubleSide,
        flatShading: true
      });
      this.geometry = new THREE.IcosahedronGeometry(1, 0);
      this.drawing = document.querySelector('.a-drawing');
      this.drawing.object3D.add(this.object3D);
    },
    // This function is called every time we need to add a point to our stroke
    // It should returns true if the point is added correctly, false otherwise.
    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {
      // Create a new sphere mesh to insert at the given position
      var sphere = new THREE.Mesh(this.geometry, this.material);

      // The scale is determined by the trigger preassure
      var sca = this.data.size / 2 * pressure;
      sphere.scale.set(sca, sca, sca);
      sphere.initialScale = sphere.scale.clone();

      // Generate a random phase to be used in the tick animation
      sphere.phase = Math.random() * Math.PI * 2;

      // Set the position of the sphere to match the controller positoin
      sphere.position.copy(pointerPosition);
      sphere.quaternion.copy(orientation);

      // Add the sphere to the object3D
      this.object3D.add(sphere);

      // Return true as we've added correctly a new point (or sphere)
      return true;
    },
    // This function is called on every frame
    tick: function (time, delta) {
      for (var i = 0; i < this.object3D.children.length; i++) {
        var sphere = this.object3D.children[i];
        // Calculate the sine value based on the time and the phase for this sphere
        // and use it to scale the geometry
        var sin = (Math.sin(sphere.phase + time / 500.0) + 1) / 2 + 0.1;
        sphere.scale.copy(sphere.initialScale).multiplyScalar(sin);
      }
    },
    undo: function () {
      this.drawing.object3D.children.pop();
    }
  },
  // Define extra options for this brush
  {thumbnail: 'brushes/thumb_spheres.gif', spacing: 0.01}
);
