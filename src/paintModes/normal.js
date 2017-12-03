
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

    this.tempCamera = new THREE.PerspectiveCamera();

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
    this.pressure = 0;
    this.size = this.el.sceneEl.renderer.getSize();
    // normalized device coordinates position
    this.normalizedCoordinatedPositionPointer = new THREE.Vector2();
    this.pointerPosition = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster();
    this.ray = this.raycaster.ray;
  },
  onBrushChanged: function (evt) {
    this.el.setAttribute('material', 'color', evt.detail.brush.color);
    this.pressure = evt.detail.pressure;
  },
  onPaintPlaced: function (e) {
    this.el.setAttribute('visible', true);
    this.eventTouch = null;
  },
  onPaintStarted: function (e) {
    // console.log('paint started');
    this.eventTouch = e.detail.touchEvent;
    this.strokeStarted = false;
    this.brush = e.detail.brush;
  },
  onPaintPainting: function (e) {
    // console.log('paint painting');
    this.stylusActive = e.detail.stylusActive;
    this.eventTouch = e.detail.touchEvent;
  },
  onPaintEnded: function () {
    // console.log('paint ended');
    this.eventTouch = null;
    this.el.setAttribute('visible', false);
    this.strokeStarted = false;
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

    this.tempCamera.matrixWorld = this.el.sceneEl.camera.matrixWorld;
    this.tempCamera.projectionMatrix = this.el.sceneEl.camera.projectionMatrix;
    this.raycaster.setFromCamera(this.normalizedCoordinatedPositionPointer, this.tempCamera);

    this.pointerPosition.copy(this.ray.direction);
    this.pointerPosition.multiplyScalar(0.5);
    this.pointerPosition.add(this.ray.origin);

    this.el.setAttribute('position', {
      x: this.pointerPosition.x,
      y: this.pointerPosition.y,
      z: this.pointerPosition.z
    });
    if (!this.strokeStarted && e) {
      this.strokeStarted = true;
      this.brush.sizeModifier = 0;
      this.brush.startNewStroke();
      this.brush.active = true;
    }
  },
  pause: function () {
    if (document.querySelector('[ar-paint-controls]')) {
      document.querySelector('[ar-paint-controls]').removeEventListener('bushchanged', this.onBrushChanged);
      document.querySelector('[ar-paint-controls]').removeEventListener('paintplaced', this.onPaintPlaced);
      document.querySelector('[ar-paint-controls]').removeEventListener('paintstarted', this.onPaintStarted);
      document.querySelector('[ar-paint-controls]').removeEventListener('paintpainting', this.onPaintPainting);
      document.querySelector('[ar-paint-controls]').removeEventListener('paintended', this.onPaintEnded);
    }
    document.querySelector('a-scene').removeEventListener('updateFrame', this.updateFrame);
  },
  updateFrame: function (data) {
    this.el.object3D.lookAt(this.el.sceneEl.camera.getWorldPosition());

    var frame = data.detail;
    var headPose = frame.getDisplayPose(frame.getCoordinateSystem(XRCoordinateSystem.HEAD_MODEL));
    var headMatrix = new THREE.Matrix4();
    var headPosition = new THREE.Vector3();
    var headQuaternion = new THREE.Quaternion();
    var headScale = new THREE.Vector3();

    headMatrix.fromArray(headPose.poseModelMatrix).decompose(headPosition, headQuaternion, headScale);

    var cameraPosition = new THREE.Vector3();
    var cameraQuaternion = new THREE.Quaternion();
    var cameraScale = new THREE.Vector3();

    var interpolationFactor = 0.1;

    cameraPosition = this.tempCamera.getWorldPosition();
    cameraQuaternion = this.tempCamera.getWorldQuaternion();
    cameraScale = this.tempCamera.getWorldScale();

    cameraPosition.lerp(headPosition, interpolationFactor);
    cameraQuaternion.slerp(headQuaternion, interpolationFactor);
    cameraScale.lerp(headScale, interpolationFactor);

    this.tempCamera.matrixAutoUpdate = false;
    this.tempCamera.matrix.compose(cameraPosition, cameraQuaternion, cameraScale);
    this.tempCamera.updateMatrixWorld(true);

    this.updatePointerPosition(this.eventTouch);

  }
});
