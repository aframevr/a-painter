
/* globals AFRAME THREE */
AFRAME.registerComponent('ar-paint-advanced', {
  dependencies: ['brush'],

  init: function () {
    console.log('---- init advanced');
    var el = this.el;
    this.controller = null;

    this.pressure = 0;
    this.size = el.sceneEl.renderer.getSize();
    // normalized device coordinates position
    this.normalizedCoordinatedPositionPointer = new THREE.Vector2();

    this.uiTouched = false;
    // this.prevPointerPosition = new THREE.Vector3();
    this.futurePointerPosition = new THREE.Vector3();

    this.stylusActive = false;

    this.raycaster = new THREE.Raycaster();
    // this.el.components.raycaster.showLine = true;
    this.ray = this.raycaster.ray;

    this.pointerScale = 1;
    // var pointerGeometry = new THREE.BoxGeometry(0.008, 0.008, 0.008);
    var pointerGeometry = new THREE.SphereGeometry(0.004, 32, 32);
    var pointerMaterial = new THREE.MeshBasicMaterial({
      color: 0xef2d5e
    });
    this.pointer = new THREE.Mesh(pointerGeometry, pointerMaterial);
    document.querySelector('#drawing-container').object3D.add(this.pointer);

    // var pointerShadowGeometry = new THREE.BoxGeometry(0.008, 0.008, 0.008);
    var circleShape = new THREE.Shape();
    circleShape.absarc(0, 0, 0.0045, 0, Math.PI * 2, false);

    var pointerShadowGeometry = circleShape.makeGeometry();
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

    var shape = new THREE.Shape();
    var impliedPlaneWidth = 0.08 * window.innerWidth / window.innerHeight;
    var impliedPlaneHeight = 0.08;
    shape.moveTo(0, 0);
    shape.lineTo(impliedPlaneWidth, 0);
    shape.lineTo(impliedPlaneWidth, impliedPlaneHeight);
    shape.lineTo(0, impliedPlaneHeight);
    shape.lineTo(0, 0);

    var impliedPlaneGeometry = shape.makeGeometry();
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
    // document.querySelector('[ar-ui]').addEventListener('onPaintModeChanged', this.onPaintModeChanged.bind(this));
    document.querySelector('[ar-ui]').addEventListener('objectsUIIntersected', this.objectsUIIntersected.bind(this));
    this.el.addEventListener('stroke-started', this.onStrokeStarted);
  },
  // onPaintModeChanged: function (evt) {
  //   console.log(evt.detail.mode);
  // },
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
      this.pointer.material.color = new THREE.Color(evt.detail.brush.color);
    }
    this.pressure = evt.detail.pressure;
    this.setGazeScale(evt.detail.brush.size);
    if (evt.detail.brush !== this.el.getAttribute('brush').brush) {
      this.el.setAttribute('brush', 'brush', evt.detail.brush.brush);
    } 
    this.el.setAttribute('brush', 'size', evt.detail.brush.size);
  },
  objectsUIIntersected: function (evt) {
    evt.detail.intersections > 0 ? this.uiTouched = true : this.uiTouched = false;
  },
  setGazeScale: function (size) {
    var sizeData = this.el.components.brush.schema.size;
    if (size > sizeData.default) {
      this.pointerScale = THREE.Math.mapLinear(size, sizeData.default, sizeData.max, 1, 30);
    } else {
      this.pointerScale = THREE.Math.mapLinear(size, sizeData.default, sizeData.min, 1, 0.25);
    }
    if (this.stylusActive) {
      var stylusPressureScale = Math.max(0.1, this.pointerScale * this.pressure);
      if (this.uiTouched) {
        stylusPressureScale = this.pointerScale * 0.1;
      }
      this.el.object3D.scale.set(stylusPressureScale, stylusPressureScale, stylusPressureScale);
    } else {
      this.el.object3D.scale.set(this.pointerScale, this.pointerScale, this.pointerScale);
    }
    this.pointer.scale.set(this.el.object3D.scale.x, this.el.object3D.scale.y, this.el.object3D.scale.z);
    this.pointerShadow.scale.set(this.el.object3D.scale.x, this.el.object3D.scale.y, this.el.object3D.scale.z);
    this.impliedPlane.scale.set(this.el.object3D.scale.x, this.el.object3D.scale.y, this.el.object3D.scale.z);
    this.connectedLine.scale.set(this.el.object3D.scale.x, this.el.object3D.scale.y, this.el.object3D.scale.z);
  },
  paintStart: function (e) {
    if (this.uiTouched) {
      return;
    }
    this.eventTouched = e;
    this.updateGazePosition(e);
  },
  playSound: function (id){
    var el = document.querySelector(id);
    if (!el) { return; }
    el.components.sound.stopSound();
    el.components.sound.playSound();
  },
  paintMove: function (e) {
    if (this.uiTouched) {
      return;
    }
    var el = this.el;
    if (!el.components.brush.active) {
      el.components.brush.sizeModifier = 0;
      el.components.brush.startNewStroke();
      el.components.brush.active = true;
      this.playSound('#uiPaint');
    }

    if (e.touches && e.touches[0].touchType === 'stylus') {
      this.stylusActive = true;
      el.components.brush.sizeModifier = this.pressure;
    } else {
      this.stylusActive = false;
      if (el.components.brush.sizeModifier !== 1) {
        this.pressure = 0;
        this.el.object3D.scale.set(this.pointerScale, this.pointerScale, this.pointerScale);
        this.pointer.scale.set(this.pointerScale, this.pointerScale, this.pointerScale);
        this.pointerShadow.scale.set(this.pointerScale, this.pointerScale, this.pointerScale);
        this.impliedPlane.scale.set(this.pointerScale, this.pointerScale, this.pointerScale);
        this.connectedLine.scale.set(this.pointerScale, this.pointerScale, this.pointerScale);
      }
      el.components.brush.sizeModifier = 1;
    }
    this.eventTouched = e;
    this.updateGazePosition(e);
  },
  paintEnd: function (e) {
    var el = this.el;
    if (el.components.brush.active) {
      el.components.brush.currentStroke = null;
      el.components.brush.active = false;
    }
    this.eventTouched = null;
  },
  updateGazePosition: function (e) {
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

    this.futurePointerPosition.copy(this.ray.direction);
    this.futurePointerPosition.multiplyScalar(0.5);
    this.futurePointerPosition.add(this.ray.origin);

    // var dir = new THREE.Vector3();
    // dir.subVectors(this.prevPointerPosition, this.futurePointerPosition).normalize();
    // this.prevPointerPosition = this.futurePointerPosition.clone();

    if (this.tweenPointer) {
      this.tweenPointer.stop();
    }

    if (!e) {
      // var self = this;
      // this.tweenPointer = new AFRAME.TWEEN.Tween({
      //   valuePosX: self.pointer.position.x,
      //   valuePosY: self.pointer.position.y,
      //   valuePosZ: self.pointer.position.z
      // })
      // .to({
      //   valuePosX: self.futurePointerPosition.x,
      //   valuePosY: self.futurePointerPosition.y,
      //   valuePosZ: self.futurePointerPosition.z
      // }, 250)
      // .onUpdate(function () {
      //   self.pointer.position.set(this.valuePosX, this.valuePosY, this.valuePosZ);
      //   self.pointerShadow.position.set(this.valuePosX, AFRAME.scenes[0].object3D.drawingOffset.y, this.valuePosZ);
      //   self.connectedLine.position.set(this.valuePosX, AFRAME.scenes[0].object3D.drawingOffset.y, this.valuePosZ);
      // });
      // this.tweenPointer.start();
      this.pointer.position.set(this.futurePointerPosition.x, this.futurePointerPosition.y, this.futurePointerPosition.z);
      this.pointerShadow.position.set(this.futurePointerPosition.x, AFRAME.scenes[0].object3D.drawingOffset.y, this.futurePointerPosition.z);
      this.connectedLine.position.set(this.futurePointerPosition.x, AFRAME.scenes[0].object3D.drawingOffset.y, this.futurePointerPosition.z);
    } else {
      this.pointer.position.set(this.futurePointerPosition.x, this.futurePointerPosition.y, this.futurePointerPosition.z);
      this.pointerShadow.position.set(this.futurePointerPosition.x, AFRAME.scenes[0].object3D.drawingOffset.y, this.futurePointerPosition.z);
      this.connectedLine.position.set(this.futurePointerPosition.x, AFRAME.scenes[0].object3D.drawingOffset.y, this.futurePointerPosition.z);
      this.el.object3D.position.set(this.futurePointerPosition.x, this.futurePointerPosition.y, this.futurePointerPosition.z);
    }

    // if (this.pointer.position.y > AFRAME.scenes[0].object3D.drawingOffset.y) {
    //   this.pointer.material.wireframe = false;
    //   this.pointerShadow.material.wireframe = false;
    // } else {
    //   this.pointer.material.wireframe = true;
    //   this.pointerShadow.material.wireframe = true;
    // }
  },
  remove: function () {
    console.log('----remove advanced');
  },
  tick: function (t) {
    this.pointer.lookAt(this.el.sceneEl.camera.getWorldPosition());
    // this.pointerShadow.lookAt(this.el.sceneEl.camera.getWorldPosition());
    // this.pointerShadow.rotation.y = this.pointer.rotation.y + Math.PI;
    if (!this.eventTouched && this.startHandler) {
      this.updateGazePosition();
    }
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
    this.impliedPlane.scale.set(1 / this.pointerShadow.scale.x, 1 / this.pointerShadow.scale.z, 1 / this.pointerShadow.scale.z);
  }
});
