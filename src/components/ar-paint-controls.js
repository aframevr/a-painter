AFRAME.registerSystem('ar-paint-controls', {
  numberStrokes: 0
});

/* globals AFRAME THREE */
AFRAME.registerComponent('ar-paint-controls', {
  dependencies: ['brush', 'raycaster'],

  init: function () {
    this.controller = null;

    this.size = this.el.sceneEl.renderer.getSize();
    this.pointer = new THREE.Vector2();
    // normalized device coordinates position
    this.pointerNdc = new THREE.Vector2();

    this.numberStrokes = 0;

    this.raycaster = this.el.components.raycaster.raycaster;
    // this.el.components.raycaster.showLine = true;
    this.ray = this.raycaster.ray;

    window.addEventListener('touchstart', this.paintStart.bind(this));
    window.addEventListener('touchmove', this.paintMove.bind(this));
    window.addEventListener('touchend', this.paintEnd.bind(this));
    window.addEventListener('mousedown', this.paintStart.bind(this));
    window.addEventListener('mousemove', this.paintMove.bind(this));
    window.addEventListener('mouseup', this.paintEnd.bind(this));
  },
  paintStart: function (e) {
    var el = this.el;
    this.paintMove(e);
    if (!el.components.brush.active) {
      el.components.brush.sizeModifier = 1;
      el.components.brush.startNewStroke();
      el.components.brush.active = true;
    }
  },
  paintMove: function (e) {
    var el = this.el;
    this.size = this.el.sceneEl.renderer.getSize();
    var t = e;
    if (e.touches) {
      t = e.touches[0];
    }
    this.pointer.set(t.clientX, t.clientY);
    this.pointerNdc.x = (t.clientX / this.size.width) * 2 - 1;
    this.pointerNdc.y = -(t.clientY / this.size.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointerNdc, this.el.sceneEl.camera);
    el.object3D.position.copy(this.ray.direction);
    el.object3D.position.multiplyScalar(0.75);
    el.object3D.position.add(this.ray.origin);
    el.object3D.updateMatrixWorld();
  },
  paintEnd: function (e) {
    var el = this.el;
    if (el.components.brush.active) {
      el.components.brush.currentStroke = null;
      el.components.brush.active = false;
    }
  },
  play: function () {
  },

  pause: function () {
  },
  tick: function (t) {
    this.el.object3D.lookAt(this.el.sceneEl.camera.getWorldPosition());
  }
});
