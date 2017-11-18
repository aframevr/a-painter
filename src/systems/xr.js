AFRAME.registerSystem('xr', {
  schema: {
    AR_AUTOSTART: { default: true }
  },
  init: function () {
    var self = this;
    // this.el.sceneEl.renderer.setPixelRatio(1);
    this.el.sceneEl.setAttribute('vr-mode-ui', {enabled: false});
    THREE.WebXRUtils.getDisplays().then(self.initXR.bind(self));
  },

  initXR: function (displays) {
    this.supportAR = false;
    for (var i = 0; i < displays.length; i++) {
      const display = displays[i];
      if (display.supportedRealities.ar) {
        this.supportAR = true;
      }
    }

    var cameraEl = document.querySelector('[camera]');

    this.el.sceneEl.setAttribute('visible', true);

    this.drawingOffset = new THREE.Vector3();

    if (!this.supportAR) {
      var arGaze = document.querySelector('#ar-gaze');
      arGaze.parentNode.removeChild(arGaze);
      this.el.sceneEl.setAttribute('vr-mode-ui', {enabled: true});
      // On VR offset is always 0,0,0
      this.sceneEl.systems.brush.addOffset(this.drawingOffset);
      return;
    }

    // an array of info that we'll use in _handleFrame to update the nodes using anchors
    this.anchoredNodes = []; // { XRAnchorOffset, Three.js Object3D }

    this.drawingContainer = document.querySelector('#drawing-container');
    this.drawing = document.querySelector('.a-drawing');
    this.cameraRig = document.querySelector('#cameraRig');
    this.pinSelected = false;
    this.pinAdded = false;
    var geometry = new THREE.RingGeometry(0.05, 0.06, 8);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    this.pin = new THREE.Mesh(geometry, material);


    var geometry2 = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    var material2 = new THREE.MeshNormalMaterial();
    this.box = new THREE.Mesh(geometry2, material2);
    this.el.sceneEl.object3D.add(this.box);

    cameraEl.removeAttribute('orbit-controls');

    this.displays = displays;

    this.posePosition = new THREE.Vector3();
    this.poseQuaternion = new THREE.Quaternion();
    this.poseEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.poseRotation = new THREE.Vector3();
    this.poseIsLost = true;

    this.activeRealityType = 'magicWindow';

    this.updateFrame = this.updateFrame.bind(this);

    this.sessionStarted = this.sessionStarted.bind(this);
    this.sessionStopped = this.sessionStopped.bind(this);

    this.poseLost = this.poseLost.bind(this);
    this.poseFound = this.poseFound.bind(this);

    this.wrapSceneMethods = this.wrapSceneMethods.bind(this);

    var self = this;
    if (this.sceneEl.hasLoaded) {
      this.wrapSceneMethods();
    } else {
      this.sceneEl.addEventListener('loaded', this.wrapSceneMethods);
    }
    if (this.el.camera) {
      this.cameraActivated();
    } else {
      this.el.addEventListener('camera-set-active', function (evt) {
        self.cameraActivated();
      });
    }
  },

  wrapSceneMethods: function () {
    var sceneEl = this.sceneEl;
    // Store references to the original function
    sceneEl._enterVR = sceneEl.enterVR;
    sceneEl._exitVR = sceneEl.exitVR;
    sceneEl._resize = sceneEl.resize;
    sceneEl._render = sceneEl.render;

    var self = this;
    sceneEl.enterAR = function () {
      this.renderer.xr.startSession(self.lastARDisplay, 'ar');
    };

    sceneEl.exitAR = function () {
      this.renderer.xr.stopSession();
    };

    sceneEl.enterVR = function (fromExternal) {
      if (!this.renderer.xr.sessionActive && self.lastVRDisplay) {
        this.renderer.xr.startSession(self.lastVRDisplay, 'vr');
      } else {
        sceneEl._enterVR(fromExternal);
      }
    };

    sceneEl.exitVR = function () {
      if (this.renderer.xr.sessionActive) {
        this.renderer.xr.stopSession();
      }
      sceneEl._exitVR();
    };

    sceneEl.resize = function () {
      if (this.renderer.xr && !this.renderer.xr.sessionActive) {
        // Update camera.
        var camera = this.camera;
        var size = {
          height: window.innerHeight,
          width: window.innerWidth
        };
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        // Notify renderer of size change.
        this.renderer.setSize(size.width, size.height, false);
      }
    };

    sceneEl.render = function () {
      var delta = sceneEl.clock.getDelta() * 1000;
      var renderer = sceneEl.renderer;
      sceneEl.time = sceneEl.clock.elapsedTime * 1000;
      if (sceneEl.isPlaying) { sceneEl.tick(sceneEl.time, delta); }
      renderer.animate(sceneEl.render.bind(sceneEl));
      if (sceneEl.renderer.xr && (!sceneEl.renderer.xr.session ||sceneEl.renderer.xr.session && !sceneEl.renderer.xr.sessionActive)) {
        renderer.render(sceneEl.object3D, sceneEl.camera, sceneEl.renderTarget);
      }

      if (sceneEl.isPlaying) { sceneEl.tock(sceneEl.time, delta); }
    };

    this.continueXR(this.displays);
  },

  continueXR: function (displays) {
    var sceneEl = this.sceneEl;
    sceneEl.renderer.autoClear = false;

    // To show camera on iOS devices
    document.documentElement.style.backgroundColor = 'transparent';
    document.body.style.backgroundColor = 'transparent';
    var options = {
      // Flag to start AR if is the unique display available.
      AR_AUTOSTART: this.data.AR_AUTOSTART // Default: true
    };
    sceneEl.renderer.xr = new THREE.WebXRManager(options, displays, sceneEl.renderer, sceneEl.camera, sceneEl.object3D, this.updateFrame);
    sceneEl.renderer.xr.addEventListener('sessionStarted', this.sessionStarted);
    sceneEl.renderer.xr.addEventListener('sessionStopped', this.sessionStopped);

    sceneEl.renderer.xr.addEventListener('poseLost', this.poseLost);
    sceneEl.renderer.xr.addEventListener('poseFound', this.poseFound);

    if (sceneEl.renderer.xr.totalSupportedDisplays === 0) {
      this.sceneEl.setAttribute('vr-mode-ui', {enabled: true});
      // this.sceneEl.setAttribute('ar-mode-ui', {enabled: true});
    } else {
      if (!sceneEl.renderer.xr.autoStarted) {
        this.addEnterButtons(displays);
      }
    }
  },

  cameraActivated: function () {
    this.defaultPosition = new THREE.Vector3(0, 1.6, 0.1);
    this.el.camera.el.setAttribute('position', this.defaultPosition);

    this.el.emit('realityChanged', 'magicWindow');
  },

  // NOW it only supports one VR and one AR display
  // TODO support more than two displays simultaneously
  addEnterButtons: function (displays) {
    for (var i = 0; i < displays.length; i++) {
      var display = displays[i];
      if(display.supportedRealities.vr){
        this.lastVRDisplay = display;
        this.sceneEl.setAttribute('vr-mode-ui', {enabled: true});
      }
      if(display.supportedRealities.ar){
        this.lastARDisplay = display;
        this.sceneEl.setAttribute('ar-mode-ui', {enabled: true});
      }
    }
  },
  sessionStarted: function (data) {
    this.activeRealityType = data.session.realityType;
    this.el.emit('realityChanged', this.activeRealityType);
  },

  sessionStopped: function (data) {
    this.activeRealityType = 'magicWindow';
    this.el.emit('realityChanged', this.activeRealityType);
  },

  poseLost: function () {
    this.el.emit('poseLost');
  },

  poseFound: function () {
    this.el.emit('poseFound');
  },

  updateFrame: function (frame) {
    this.el.emit('updateFrame', frame);
    // Custom code for each frame rendered
    if (this.pinSelected) {
      return;
    }
    frame.findAnchor(0.5, 0.5).then(anchorOffset => {
      if (anchorOffset === null){
        // console.log('miss');
      } else {
        if (!this.pinAdded) {
          this.pinAdded = true;
          this.addAnchoredNode(anchorOffset, this.pin);
        }
        if (this.pinAdded) {
          // this.pin.setAttribute('position', {x: anchorOffset.position.x, y: -1.1 + anchorOffset.position.y, z: -1 + anchorOffset.position.z});
          // this.pin.setAttribute('position', {x: anchorOffset.position.x, y: anchorOffset.position.y, z: anchorOffset.position.z});
          // this.pin.object3D.position.set(anchorOffset.position.x, anchorOffset.position.y, anchorOffset.position.z);
          // console.log('hit', anchorOffset.position);
          // console.log('hit', anchorOffset.orientation);
        }
        // this.pinSelected = true;
        // console.log('hit', anchorOffset.getOffsetTransform(coordinateSystem));
      }
    }).catch(err => {
      console.error('Error in hit test', err);
    });
    // Update anchored node positions in the scene graph
    for (let anchoredNode of this.anchoredNodes) {
      this.updateNodeFromAnchorOffset(frame, anchoredNode.node, anchoredNode.anchorOffset);
    }
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
  updateNodeFromAnchorOffset: function (frame, node, anchorOffset) {
    const anchor = frame.getAnchor(anchorOffset.anchorUID);
    if (anchor === null) {
      return;
    }
    node.matrixAutoUpdate = false;
    node.matrix.fromArray(anchorOffset.getOffsetTransform(anchor.coordinateSystem));
    node.updateMatrixWorld(true);
    // if (this.drawingOffset.x !== node.getWorldPosition().x) {
    if (this.drawingOffset.x === 0) {
      this.drawingOffset = node.getWorldPosition();
      this.sceneEl.systems.brush.addOffset(this.drawingOffset);
    }
  }

});