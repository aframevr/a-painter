
/* globals AFRAME THREE */
AFRAME.registerComponent('ar-paint-normal', {
  schema: {
    brush: {default: 'smooth'},
    color: {default: '#ef2d5e'},
    size: {default: 0.1},
    defaultSize: {default: 0.01},
    min: {default: 0.001},
    max: {default: 0.3}
  },
  init: function () {
    this.bindMethods();
    this.initVars();
    this.addPointer();
    this.setPointerScale(this.data.size, false);
    document.querySelector('[ar-paint-controls]').addEventListener('brushchanged', this.onBrushChanged);
    document.querySelector('[ar-paint-controls]').addEventListener('paintplaced', this.onPaintPlaced);
    document.querySelector('[ar-paint-controls]').addEventListener('paintstarted', this.onPaintStarted);
    document.querySelector('[ar-paint-controls]').addEventListener('paintpainting', this.onPaintPainting);
    document.querySelector('[ar-paint-controls]').addEventListener('paintended', this.onPaintEnded);
    document.querySelector('a-scene').addEventListener('updateFrame', this.updateFrame);
  },
  bindMethods: function () {
    this.onBrushChanged = this.onBrushChanged.bind(this);
    this.onPaintPlaced = this.onPaintPlaced.bind(this);
    this.onPaintStarted = this.onPaintStarted.bind(this);
    this.onPaintPainting = this.onPaintPainting.bind(this);
    this.onPaintEnded = this.onPaintEnded.bind(this);
    this.updateFrame = this.updateFrame.bind(this);
  },
  initVars: function () {
    this.pointerScale = this.data.scale;
    this.pressure = 0;
    this.size = this.el.sceneEl.renderer.getSize();
    // normalized device coordinates position
    this.normalizedCoordinatedPositionPointer = new THREE.Vector2();
    this.pointerPosition = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster();
    this.ray = this.raycaster.ray;
  },
  addPointer: function () {
    var pointerGeometry = new THREE.BoxGeometry(0.008, 0.008, 0.008);
    var pointerMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.data.color)
    });
    this.pointer = new THREE.Mesh(pointerGeometry, pointerMaterial);
    document.querySelector('#drawing-container').object3D.add(this.pointer);
  },
  onBrushChanged: function (evt) {
    this.pointer.material.color = new THREE.Color(evt.detail.brush.color);
    this.pressure = evt.detail.pressure;
    this.setPointerScale(evt.detail.brush.size, evt.detail.uiTouched);
  },
  setPointerScale: function (size, uiTouched) {
    if (size > this.data.defaultSize) {
      this.pointerScale = THREE.Math.mapLinear(size, this.data.defaultSize, this.data.max, 1, 30);
    } else {
      this.pointerScale = THREE.Math.mapLinear(size, this.data.defaultSize, this.data.min, 1, 0.25);
    }
    if (this.stylusActive) {
      var stylusPressureScale = Math.max(0.1, this.pointerScale * this.pressure);
      if (uiTouched) {
        stylusPressureScale = this.pointerScale * 0.1;
      }
      this.pointer.scale.set(stylusPressureScale, stylusPressureScale, stylusPressureScale);
    } else {
      this.pointer.scale.set(this.pointerScale, this.pointerScale, this.pointerScale);
    }
  },
  onPaintPlaced: function (e) {
    this.pointer.visible = true;
    this.updatePointerPosition(e.detail.touchEvent);
  },
  onPaintStarted: function () {
    // console.log('paint started');
  },
  onPaintPainting: function (e) {
    // End stylus mode
    if (!e.detail.stylusActive && this.stylusActive) {
      this.pointer.scale.set(this.pointerScale, this.pointerScale, this.pointerScale);
    }
    this.stylusActive = e.detail.stylusActive;
    this.updatePointerPosition(e.detail.touchEvent);
  },
  onPaintEnded: function () {
    // sconsole.log('paint ended');
    this.pointer.visible = false;
  },
  updatePointerPosition: function (e) {
    if (e) {
      this.size = this.el.sceneEl.renderer.getSize();
      var t = e;
      if (e.touches) {
        t = e.touches[0];
      }
      this.normalizedCoordinatedPositionPointer.x = (t.clientX / this.size.width) * 2 - 1;
      this.normalizedCoordinatedPositionPointer.y = -(t.clientY / this.size.height) * 2 + 1;
    } else {
      this.normalizedCoordinatedPositionPointer.x = 0;
      this.normalizedCoordinatedPositionPointer.y = 0;
    }

    this.raycaster.setFromCamera(this.normalizedCoordinatedPositionPointer, this.el.sceneEl.camera);

    this.pointerPosition.copy(this.ray.direction);
    this.pointerPosition.multiplyScalar(0.5);
    this.pointerPosition.add(this.ray.origin);

    if (!e) {
      this.el.object3D.position.set(this.valuePosX, this.valuePosY, this.valuePosZ);
      this.pointer.position.set(this.valuePosX, this.valuePosY, this.valuePosZ);
    } else {
      this.el.object3D.position.set(this.pointerPosition.x, this.pointerPosition.y, this.pointerPosition.z);
      this.pointer.position.set(this.pointerPosition.x, this.pointerPosition.y, this.pointerPosition.z);
    }
  },
  pause: function () {
    document.querySelector('[ar-paint-controls]').removeEventListener('bushchanged', this.onBrushChanged);
    document.querySelector('[ar-paint-controls]').removeEventListener('paintplaced', this.onPaintPlaced);
    document.querySelector('[ar-paint-controls]').removeEventListener('paintstarted', this.onPaintStarted);
    document.querySelector('[ar-paint-controls]').removeEventListener('paintpainting', this.onPaintPainting);
    document.querySelector('[ar-paint-controls]').removeEventListener('paintended', this.onPaintEnded);
    document.querySelector('a-scene').removeEventListener('updateFrame', this.updateFrame);
    document.querySelector('#drawing-container').object3D.remove(this.pointer);
  },
  updateFrame: function (frame) {
    // console.log('----tick normal');
  }
});
