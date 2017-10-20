
/* globals AFRAME THREE */
AFRAME.registerComponent('ar-paint-controls', {
  dependencies: ['brush', 'raycaster'],

  init: function () {
    var el = this.el;
    this.controller = null;

    this.pressure = 0;
    this.size = el.sceneEl.renderer.getSize();
    this.pointer = new THREE.Vector2();
    // normalized device coordinates position
    this.normalizedCoordinatedPositionPointer = new THREE.Vector2();

    this.raycaster = el.components.raycaster.raycaster;
    // this.el.components.raycaster.showLine = true;
    this.ray = this.raycaster.ray;
    this.intersection = null;

    el.object3D.visible = false;

    var soundEl = document.createElement('a-sound');
    var iOSSuffix = '';
    if (AFRAME.utils.device.isIOS()) {
      iOSSuffix = '_iOS';
    }
    soundEl.setAttribute('src', '#ui_paint' + iOSSuffix);
    soundEl.setAttribute('id', 'uiPaint');
    this.el.appendChild(soundEl);

    this.onStrokeStarted = this.onStrokeStarted.bind(this);
    document.querySelector('[ar-ui]').addEventListener('activate', this.activate.bind(this));
    document.querySelector('[ar-ui]').addEventListener('deactivate', this.deactivate.bind(this));
    document.querySelector('[ar-ui]').addEventListener('onBrushChanged', this.onBrushChanged.bind(this));
    this.el.addEventListener('stroke-started', this.onStrokeStarted);
  },
  onStrokeStarted: function () {
    this.el.emit('brush-started');
  },
  activate: function () {
    this.startHandler = this.paintStart.bind(this);
    this.moveHandler = this.paintMove.bind(this);
    this.endHandler = this.paintEnd.bind(this);
    if (this.el.sceneEl.isMobile) {
      window.addEventListener('touchstart', this.startHandler);
      window.addEventListener('touchmove', this.moveHandler);
      window.addEventListener('touchend', this.endHandler);
    } else {
      window.addEventListener('mousedown', this.startHandler);
      window.addEventListener('mousemove', this.moveHandler);
      window.addEventListener('mouseup', this.endHandler);
    }
  },
  deactivate: function () {
    if (this.el.sceneEl.isMobile) {
      window.removeEventListener('touchstart', this.startHandler);
      window.removeEventListener('touchmove', this.moveHandler);
      window.removeEventListener('touchend', this.endHandler);
    } else {
      window.removeEventListener('mousedown', this.startHandler);
      window.removeEventListener('mousemove', this.moveHandler);
      window.removeEventListener('mouseup', this.endHandler);
    }
  },
  onBrushChanged: function (evt) {
    if (evt.detail.brush.color !== this.el.getAttribute('brush').color) {
      this.el.setAttribute('brush', 'color', evt.detail.brush.color);
      this.el.setAttribute('material', 'color', evt.detail.brush.color);
    }
    this.pressure = evt.detail.pressure;
    // this.el.components.brush.sizeModifier = evt.detail.pressure;
    console.log(evt.detail);
    this.setGazeScale(evt.detail.brush.size);
    if (evt.detail.brush !== this.el.getAttribute('brush').brush) {
      this.el.setAttribute('brush', 'brush', evt.detail.brush.brush);
    } 
    this.el.setAttribute('brush', 'size', evt.detail.brush.size);
  },
  setGazeScale: function (size) {
    var sizeData = this.el.components.brush.schema.size;
    var scale = 1;
    if (size > sizeData.default) {
      scale = THREE.Math.mapLinear(size, sizeData.default, sizeData.max, 1, 4);
    } else {
      scale = THREE.Math.mapLinear(size, sizeData.default, sizeData.min, 1, 0.25);
    }
    this.el.object3D.scale.set(scale, scale, scale);
  },
  paintStart: function (e) {
    var el = this.el;
    this.paintMove(e);
    if (this.intersection !== null) {
      return;
    }
    if (!el.components.brush.active) {
      el.components.brush.sizeModifier = 0;
      el.components.brush.startNewStroke();
      el.components.brush.active = true;
      this.playSound('#uiPaint');
    }
    el.object3D.visible = true;
  },
  playSound: function (id){
    var el = document.querySelector(id);
    if (!el) { return; }
    el.components.sound.stopSound();
    el.components.sound.playSound();
  },
  getIntersectObjects: function () {
    var intersectObjects = [];
    for (var i = 0; i < document.querySelector('[ar-ui]').children.length; i++) {
      var element = document.querySelector('[ar-ui]').children[i];
      intersectObjects.push(element.object3D);
    }
    return intersectObjects;
  },
  paintMove: function (e) {
    var el = this.el;
    this.size = this.el.sceneEl.renderer.getSize();
    var t = e;
    if (e.touches) {
      t = e.touches[0];
    }
    this.pointer.set(t.clientX, t.clientY);
    this.normalizedCoordinatedPositionPointer.x = (t.clientX / this.size.width) * 2 - 1;
    this.normalizedCoordinatedPositionPointer.y = -(t.clientY / this.size.height) * 2 + 1;

    this.raycaster.setFromCamera(this.normalizedCoordinatedPositionPointer, this.el.sceneEl.camera);

    var intersections = this.raycaster.intersectObjects(this.getIntersectObjects(), true);
    this.intersection = (intersections.length) > 0 ? intersections[ 0 ] : null;
    if (this.intersection !== null) {
      return;
    }
    if (e.touches && e.touches[0].touchType === 'stylus'){
      el.components.brush.sizeModifier = this.pressure;
    } else {
      el.components.brush.sizeModifier = 1;
    }
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
    el.object3D.visible = false;
  },
  play: function () {
  },

  pause: function () {
  },
  tick: function (t) {
    this.el.object3D.lookAt(this.el.sceneEl.camera.getWorldPosition());
  }
});
