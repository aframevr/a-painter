AFRAME.registerSystem('xr', {
  schema: {
    AR_AUTOSTART: { default: true }
  },
  init: function () {
    var self = this;
    this.el.sceneEl.setAttribute('vr-mode-ui', {enabled: false});
    THREE.WebXRUtils.getDisplays().then(self.initXR.bind(self));
  },

  initXR: function (displays) {
    var supportAR = false;
    for (var i = 0; i < displays.length; i++) {
      const display = displays[i];
      if (display.supportedRealities.ar) {
        supportAR = true;
      }
    }

    var cameraEl = document.querySelector('[camera]');

    this.el.sceneEl.setAttribute('visible', true);
    if (!supportAR) {
      cameraEl.removeAttribute('ar-ui');
      var arGaze = document.querySelector('#ar-gaze');
      arGaze.parentNode.removeChild(arGaze);
      this.el.sceneEl.setAttribute('vr-mode-ui', {enabled: true});
      return;
    }
    cameraEl.removeAttribute('orbit-controls');

    this.displays = displays;

    this.posePosition = new THREE.Vector3();
    this.poseQuaternion = new THREE.Quaternion();
    this.poseEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.poseRotation = new THREE.Vector3();
    this.poseIsLost = true;

    this.activeRealityType = 'magicWindow';

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

    this.updateFrame = this.updateFrame.bind(this);

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
    // Custom code for each frame rendered
    // frame.findAnchor(0.5, 0.5).then(anchorOffset => {
    //   if (anchorOffset === null){
    //     console.log('miss');
    //   } else {
    //     console.log('hit');
    //   }
    // }).catch(err => {
    //   console.error('Error in hit test', err);
    // });
  }
});