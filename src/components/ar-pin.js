AFRAME.registerComponent('ar-pin', {
  dependencies: ['raycaster'],
  init: function () {
    this.xrInitialized = this.xrInitialized.bind(this);
    this.realityChanged = this.realityChanged.bind(this);

    this.scene = document.querySelector('a-scene');
    this.scene.addEventListener('xrInitialized', this.xrInitialized);
    this.scene.addEventListener('realityChanged', this.realityChanged);
  },
  xrInitialized: function () {
    // this.scene.removeEventListener('XRInitialized', this.XRInitialized);
    this.xrIsInit = true;
    this.drawingOffset = new THREE.Vector3();
    
    if (!AFRAME.scenes[0].systems.xr.supportAR) {
      var arGaze = document.querySelector('#ar-gaze');
      arGaze.parentNode.removeChild(arGaze);
      // On VR offset is always 0,0,0
      this.sceneEl.systems.brush.addOffset(this.drawingOffset);
      return;
    }

    this.updateFrame = this.updateFrame.bind(this);
    // normalized device coordinates position
    this.normalizedCoordinatedPositionPointer = new THREE.Vector2();
    //Screen coordinates normalized to -1..1 (0,0 is at center and 1,1 is at top right)
    this.coordinatesToFindAnchors = new THREE.Vector2(0.5, 0.5);

    this.hammer = new Hammer(this.scene);

    this.startHandler = this.startHandler.bind(this);
    this.moveHandler = this.moveHandler.bind(this);
    this.endHandler = this.endHandler.bind(this);
    this.tapHandler = this.tapHandler.bind(this);

    window.addEventListener('touchstart', this.startHandler);
    window.addEventListener('touchmove', this.moveHandler);
    window.addEventListener('touchend', this.endHandler);
    this.hammer.on('tap', this.tapHandler);

    // an array of info that we'll use in _handleFrame to update the nodes using anchors
    this.anchoredNodes = []; // { XRAnchorOffset, Three.js Object3D }
    
    this.drawingContainer = document.querySelector('#drawing-container');
    this.drawing = document.querySelector('.a-drawing');

    this.pinSelected = false;
    this.pinIntersected = false;

    this.pin = new THREE.Group();
    // this.pin.position.set(0, 0.6, -0.6);
    this.el.object3D.add(this.pin);

    var geometry = new THREE.RingGeometry(0.05, 0.06, 8);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.6,
      transparent: true
    });
    this.ringTop = new THREE.Mesh(geometry, material);
    this.ringTop.position.y = 0.02;

    var materialShadow = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.25,
      transparent: true
    });
    this.ringShadow = new THREE.Mesh(geometry, materialShadow);
    this.ringShadow.position.y = -0.001;

    var geometryCollider = new THREE.CircleGeometry(0.12, 8);
    geometryCollider.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
    var materialCollider = new THREE.MeshBasicMaterial({
      opacity: 0,
      transparent: true,
      depthTest: false,
      depthWirte: false
    });
    this.collider = new THREE.Mesh(geometryCollider, materialCollider);

    this.pin.add(this.ringTop);
    this.pin.add(this.ringShadow);
    this.pin.add(this.collider);

    this.pin.visible = false;

    var self = this;
    this.tweenFloating = new AFRAME.TWEEN.Tween({
      valuePosY: 0.02,
      valueScale: 1,
      valueOpacity: 0.25
    })
    .to({
      valuePosY: 0.03,
      valueScale: 1.05,
      valueOpacity: 0.15
    }, 1000)
      .onUpdate(function () {
        self.ringTop.position.y = this.valuePosY;
        self.ringShadow.scale.x = this.valueScale;
        self.ringShadow.scale.z = this.valueScale;
        self.ringShadow.material.opacity = this.valueOpacity;
      })
      .yoyo(true)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .repeat(Infinity);

    this.tweenFloating.start();

    // Add a reference object at 0,0,0
    // var geometry2 = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    // var material2 = new THREE.MeshNormalMaterial();
    // this.box = new THREE.Mesh(geometry2, material2);
    // this.el.sceneEl.object3D.add(this.box);
    if (this.isNotStartedYet) {
      this.start();
    }
  },
  realityChanged: function (data) {
    if (data.detail === 'ar') {
      if (this.xrIsInit) {
        this.start();
      } else {
        this.isNotStartedYet = true;
      }
    }
  },

  start: function () {
    this.raycaster = this.el.components.raycaster.raycaster;
    this.scene.addEventListener('updateFrame', this.updateFrame);
  },

  startHandler: function (e) {
    this.setPinIntersected(e);
    if (this.pinIntersected) {
      this.ringTop.material.opacity = 1;
      this.pin.scale.set(1.2, 1.2, 1.2);
      // this.tweenFloating.stop();
    }

  },
  moveHandler: function (e) {
    var el = this.el;
    // this.setCoordinates(e);
    this.setPinIntersected(e);
  },
  endHandler: function (e) {
    var el = this.el;
    this.ringTop.material.opacity = 0.6;
    this.pin.scale.set(1, 1, 1);
    this.pinIntersected = false;
    // this.tweenFloating.start();
  },
  tapHandler: function (e) {
    if (this.pin.visible && this.pinIntersected) {
      this.drawingOffset = this.pin.getWorldPosition();
      this.el.sceneEl.object3D.drawingOffset = this.drawingOffset;
      this.el.sceneEl.systems.brush.addOffset(this.drawingOffset);
      this.pinSelected = true;
      this.ringTop.material.opacity = 1;
      this.ringTop.position.y = 0;

      var self = this;
      new AFRAME.TWEEN.Tween({
        valueScale: 1,
        valueOpacity: 0.25
      })
      .to({
        valueScale: 3,
        valueOpacity: 0
      }, 1000)
        .onUpdate(function () {
          self.ringShadow.scale.x = this.valueScale;
          self.ringShadow.scale.z = this.valueScale;
          self.ringShadow.material.opacity = this.valueOpacity;
        })
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(function () {
          self.ringShadow.visible = false;
        })
        .start();
      this.collider.visible = false;
      this.pin.scale.set(1, 1, 1);
      this.tweenFloating.stop();

      this.el.emit('pinselected');
    }
  },
  setCoordinates: function (e) {
    var t = e;
    if (e.touches) {
      t = e.touches[0];
    }
    this.size = this.el.sceneEl.renderer.getSize();
    this.normalizedCoordinatedPositionPointer.x = (t.clientX / this.size.width) * 2 - 1;
    this.normalizedCoordinatedPositionPointer.y = -(t.clientY / this.size.height) * 2 + 1;
    this.coordinatesToFindAnchors.x = t.clientX / window.innerWidth;
    this.coordinatesToFindAnchors.y = t.clientY / window.innerHeight;
  },
  setPinIntersected: function (e) {
    this.setCoordinates(e);
    this.raycaster.setFromCamera(this.normalizedCoordinatedPositionPointer, this.el.sceneEl.camera);
    var intersections = this.raycaster.intersectObjects([this.collider]);
    this.pinIntersected = intersections.length > 0;
    if (intersections.length > 0) {
      this.setPinPosition(intersections[0].point);
    }
  },
  setPinPosition: function (pos) {
    this.pin.position.x = pos.x;
    this.pin.position.z = pos.z;
  },
  /*
  Add a node to the scene and keep its pose updated using the anchorOffset
  */
  addAnchoredNode: function (anchorOffset, node) {
    this.anchoredNodes.push({
      anchorOffset: anchorOffset,
      node: node
    });
    this.el.sceneEl.object3D.add(node);
    // this.drawingContainer.object3D.add(node);
  },

  /*
  Get the anchor data from the frame and use it and the anchor offset to update the pose of the node, this must be an Object3D
  */
  updatePinFromAnchorOffset: function (frame, anchorOffset) {
    const anchor = frame.getAnchor(anchorOffset.anchorUID);
    if (anchor === null) {
      return;
    }
    // this.pin.matrixAutoUpdate = false;
    // this.pin.matrix.fromArray(anchorOffset.getOffsetTransform(anchor.coordinateSystem));
    // this.pin.updateMatrixWorld(true);
    var anchorMatrix = new THREE.Matrix4().fromArray(anchorOffset.getOffsetTransform(anchor.coordinateSystem));
    this.pin.position.setFromMatrixPosition(anchorMatrix);
    this.pin.quaternion.setFromRotationMatrix(anchorMatrix);
    this.originalPinPosition = this.pin.position.clone();

  },

  updateFrame: function (data) {
    if (this.pinSelected) {
      return;
    }
    var self = this;
    data.detail.findAnchor(this.coordinatesToFindAnchors.x, this.coordinatesToFindAnchors.y).then(function (anchorOffset) {
      if (anchorOffset === null){
        // this.pin.visible = false;
      } else {
        self.pin.visible = true;
        self.el.emit('pindetected');
        self.updatePinFromAnchorOffset(data.detail, anchorOffset);
        self.scene.removeEventListener('updateFrame', self.updateFrame);
        // if (self.pinIntersected) {
        //   self.updatePinFromAnchorOffset(data.detail, anchorOffset);
        // }
      }
    }).catch(function (err) {
      console.error('Error in hit test', err);
    });
  }
});
