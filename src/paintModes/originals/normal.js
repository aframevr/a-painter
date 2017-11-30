
/* globals AFRAME THREE */
AFRAME.registerComponent('ar-paint-normal', {
  dependencies: ['brush'],

  init: function () {
    console.log('----init normal');
    var el = this.el;
    this.controller = null;

    this.pressure = 0;
    this.size = el.sceneEl.renderer.getSize();
    // normalized device coordinates position
    this.normalizedCoordinatedPositionPointer = new THREE.Vector2();

    this.uiTouched = false;
    // this.prevPointerPosition = new THREE.Vector3();
    this.pointerPosition = new THREE.Vector3();

    this.stylusActive = false;

    this.raycaster = new THREE.Raycaster();
    // this.el.components.raycaster.showLine = true;
    this.ray = this.raycaster.ray;

    this.pointerScale = 1;
    // var pointerGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.008, 3);
    var pointerGeometry = new THREE.BoxGeometry(0.008, 0.008, 0.008);
    var pointerMaterial = new THREE.MeshStandardMaterial({
      color: 0xef2d5e
    });
    this.pointer = new THREE.Mesh(pointerGeometry, pointerMaterial);
    this.el.object3D.add(this.pointer);

    var pointerShadowGeometry = new THREE.PlaneGeometry(0.008, 0.008);
    pointerShadowGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
    var pointerShadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5
    });
    this.pointerShadow = new THREE.Mesh(pointerShadowGeometry, pointerShadowMaterial);
    this.el.object3D.add(this.pointerShadow);

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
    document.querySelector('[ar-ui]').addEventListener('objectsUIIntersected', this.objectsUIIntersected.bind(this));
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
    this.pointerShadow.scale.set(this.el.object3D.scale.x, this.el.object3D.scale.y, this.el.object3D.scale.z);
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
        this.pointerShadow.scale.set(this.el.object3D.scale.x, this.el.object3D.scale.y, this.el.object3D.scale.z);
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
    // this.el.object3D.scale.set(this.pointerScale, this.pointerScale, this.pointerScale);
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

    this.pointerPosition.copy(this.ray.direction);
    this.pointerPosition.multiplyScalar(0.5);
    this.pointerPosition.add(this.ray.origin);

    // var dir = new THREE.Vector3();
    // dir.subVectors(this.prevPointerPosition, this.pointerPosition).normalize();
    // this.prevPointerPosition = this.pointerPosition.clone();

    if (this.tweenPointer) {
      this.tweenPointer.stop();
    }

    if (!e) {
      var self = this;
      this.tweenPointer = new AFRAME.TWEEN.Tween({
        valuePosX: self.el.object3D.position.x,
        valuePosY: self.el.object3D.position.y,
        valuePosZ: self.el.object3D.position.z
      })
      .to({
        valuePosX: self.pointerPosition.x,
        valuePosY: self.pointerPosition.y,
        valuePosZ: self.pointerPosition.z
      }, 250)
      .onUpdate(function () {
        self.el.object3D.position.set(this.valuePosX, this.valuePosY, this.valuePosZ);
        self.pointerShadow.position.set(this.valuePosX, AFRAME.scenes[0].object3D.drawingOffset.y, this.valuePosZ);
      });
      this.tweenPointer.start();
    } else {
      this.el.object3D.position.set(this.pointerPosition.x, this.pointerPosition.y, this.pointerPosition.z);
      this.pointerShadow.position.set(this.pointerPosition.x, AFRAME.scenes[0].object3D.drawingOffset.y, this.pointerPosition.z);
    }
    if (this.el.object3D.position.y > AFRAME.scenes[0].object3D.drawingOffset.y) {
      this.pointer.material.wireframe = false;
      this.pointerShadow.material.wireframe = false;
    } else {
      this.pointer.material.wireframe = true;
      this.pointerShadow.material.wireframe = true;
    }
  },
  remove: function () {
    console.log('----remove normal');
  },
  tick: function (t) {
    // this.el.object3D.lookAt(this.el.sceneEl.camera.getWorldPosition());
    if (!this.eventTouched && this.startHandler) {
      this.updateGazePosition(this.eventTouched);
    }
  }
});
