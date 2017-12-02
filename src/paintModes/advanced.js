
/* globals AFRAME THREE */
AFRAME.registerComponent('ar-paint-advanced', {
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
    this.addPointerShadow();
    this.addConnectedLine();
    this.addImpliedPlane();
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
    this.isPainting = false;
    this.pressure = 0;
    this.size = this.el.sceneEl.renderer.getSize();
    // normalized device coordinates position
    this.normalizedCoordinatedPositionPointer = new THREE.Vector2();
    this.pointerPosition = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster();
    this.ray = this.raycaster.ray;
    this.tempCamera = new THREE.PerspectiveCamera();
  },
  addPointer: function () {
    this.pointer = new THREE.Group();
    document.querySelector('#drawing-container').object3D.add(this.pointer);
  },
  addPointerShadow: function () {
    var circleShape = new THREE.Shape();
    circleShape.absarc(0, 0, 0.0045, 0, Math.PI * 2, false);

    var pointerShadowGeometry = new THREE.ShapeGeometry(circleShape);
    pointerShadowGeometry.vertices.push(pointerShadowGeometry.vertices[0].clone());
    pointerShadowGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
    // var pointerShadowMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x000000,
    //   transparent: true,
    //   opacity: 0.5
    // });
    // this.pointerShadow = new THREE.Mesh(pointerShadowGeometry, pointerShadowMaterial);
    this.pointerShadow = new THREE.Line(pointerShadowGeometry, new THREE.LineBasicMaterial());
    document.querySelector('#drawing-container').object3D.add(this.pointerShadow);
  },
  addConnectedLine: function () {
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.1, 0)
    );
    lineGeometry.computeLineDistances();

    var connectedLineMaterial = new THREE.LineDashedMaterial({color: 0xffffff, dashSize: 0.0045, gapSize: 0.0045, transparent: false});
    this.connectedLine = new THREE.Line(lineGeometry, connectedLineMaterial);
    this.connectedLine.frustumCulled = false;
    document.querySelector('#drawing-container').object3D.add(this.connectedLine);
  },
  addImpliedPlane: function () {
    var shape = new THREE.Shape();
    var impliedPlaneWidth = 0.08 * window.innerWidth / window.innerHeight;
    var impliedPlaneHeight = 0.08;
    shape.moveTo(0, 0);
    shape.lineTo(impliedPlaneWidth, 0);
    shape.lineTo(impliedPlaneWidth, impliedPlaneHeight);
    shape.lineTo(0, impliedPlaneHeight);
    shape.lineTo(0, 0);

    var impliedPlaneGeometry = new THREE.ShapeGeometry(shape);
    impliedPlaneGeometry.translate(-impliedPlaneWidth / 2, -impliedPlaneHeight / 2, 0);
    // close shape
    impliedPlaneGeometry.vertices.push(impliedPlaneGeometry.vertices[0].clone());
    impliedPlaneGeometry.computeLineDistances();

    var lineMaterial = new THREE.LineDashedMaterial({color: 0xffffff, dashSize: 0.0045, gapSize: 0.0045});
    this.impliedPlane = new THREE.Line(impliedPlaneGeometry, lineMaterial);
    this.pointer.add(this.impliedPlane);

    var impliedGlassGeometry = new THREE.PlaneGeometry(impliedPlaneWidth, impliedPlaneHeight);
    var impliedGlassMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4
    });
    impliedGlassMaterial.blending = THREE.CustomBlending;
    impliedGlassMaterial.blendEquation = THREE.AddEquation;
    impliedGlassMaterial.blendSrc = THREE.ZeroFactor;
    impliedGlassMaterial.blendDst = THREE.SrcAlphaFactor;

    var impliedGlass = new THREE.Mesh(impliedGlassGeometry, impliedGlassMaterial);
    this.impliedPlane.add(impliedGlass);
  },
  onBrushChanged: function (evt) {
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
    this.pointerShadow.scale.set(this.pointer.scale.x, this.pointer.scale.y, this.pointer.scale.z);
    this.connectedLine.scale.set(this.pointer.scale.x, this.pointer.scale.y, this.pointer.scale.z);
    // this.impliedPlane.scale.set(this.el.object3D.scale.x, this.el.object3D.scale.y, this.el.object3D.scale.z);
  },
  onPaintPlaced: function (e) {
    this.eventTouch = null;
  },
  onPaintStarted: function (e) {
    // console.log('paint started');
    this.eventTouch = e.detail.touchEvent;
    this.strokeStarted = false;
    this.brush = e.detail.brush;
    this.isPainting = true;
  },
  onPaintPainting: function (e) {
    // End stylus mode
    if (!e.detail.stylusActive && this.stylusActive) {
      this.pointer.scale.set(this.pointerScale, this.pointerScale, this.pointerScale);
      this.pointerShadow.scale.set(this.pointerScale, this.pointerScale, this.pointerScale);
      this.connectedLine.scale.set(this.pointerScale, this.pointerScale, this.pointerScale);
    }
    this.stylusActive = e.detail.stylusActive;
    this.eventTouch = e.detail.touchEvent;
  },
  onPaintEnded: function () {
    // sconsole.log('paint ended');
    this.eventTouch = null;
    this.isPainting = false;
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

    this.raycaster.setFromCamera(this.normalizedCoordinatedPositionPointer, this.tempCamera);

    this.pointerPosition.copy(this.ray.direction);
    this.pointerPosition.multiplyScalar(0.5);
    this.pointerPosition.add(this.ray.origin);

    this.el.object3D.position.set(this.pointerPosition.x, this.pointerPosition.y, this.pointerPosition.z);
    this.pointer.position.set(this.pointerPosition.x, this.pointerPosition.y, this.pointerPosition.z);
    this.pointerShadow.position.set(this.pointerPosition.x, AFRAME.scenes[0].object3D.drawingOffset.y, this.pointerPosition.z);
    this.connectedLine.position.set(this.pointerPosition.x, AFRAME.scenes[0].object3D.drawingOffset.y, this.pointerPosition.z);
    if (!this.strokeStarted && e) {
      this.strokeStarted = true;
      this.brush.sizeModifier = 0;
      this.brush.startNewStroke();
      this.brush.active = true;
    }
  },
  pause: function () {
    document.querySelector('[ar-paint-controls]').removeEventListener('bushchanged', this.onBrushChanged);
    document.querySelector('[ar-paint-controls]').removeEventListener('paintplaced', this.onPaintPlaced);
    document.querySelector('[ar-paint-controls]').removeEventListener('paintstarted', this.onPaintStarted);
    document.querySelector('[ar-paint-controls]').removeEventListener('paintpainting', this.onPaintPainting);
    document.querySelector('[ar-paint-controls]').removeEventListener('paintended', this.onPaintEnded);
    document.querySelector('a-scene').removeEventListener('updateFrame', this.updateFrame);
    this.impliedPlane.remove(this.impliedGlass);
    this.pointer.remove(this.impliedPlane);
    document.querySelector('#drawing-container').object3D.remove(this.pointer);
    document.querySelector('#drawing-container').object3D.remove(this.pointerShadow);
    document.querySelector('#drawing-container').object3D.remove(this.connectedLine);
  },
  updateFrame: function (data) {
    this.pointer.lookAt(this.el.sceneEl.camera.getWorldPosition());
    var distY = this.pointer.getWorldPosition().y - this.pointerShadow.getWorldPosition().y;
    if (distY > 0) {
      this.impliedPlane.material.gapSize = 0;
      this.connectedLine.material.gapSize = 0;
      this.pointerShadow.material.opacity = 0.5;
    } else {
      this.impliedPlane.material.gapSize = 0.0045;
      this.connectedLine.material.gapSize = 0.0045 / this.pointerShadow.scale.y;
      this.connectedLine.material.dashSize = 0.0045 / this.pointerShadow.scale.y;
      this.pointerShadow.material.opacity = 0;
    }
    this.connectedLine.geometry.vertices[1].y = distY / this.pointerShadow.scale.y;
    this.connectedLine.geometry.verticesNeedUpdate = true;
    this.connectedLine.geometry.computeLineDistances();
    this.connectedLine.geometry.lineDistancesNeedUpdate = true;
    var scaleCompensationFactor = THREE.Math.mapLinear(this.pointerShadow.scale.x, 0.25, 30, 0.5, 4);
    var impliedScale = 1 / this.pointerShadow.scale.x * scaleCompensationFactor;
    this.impliedPlane.scale.set(impliedScale, impliedScale, impliedScale);

    this.updatePointerPosition(this.eventTouch);

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
  }
});
