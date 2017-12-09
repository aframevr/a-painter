THREE.WebXRManager = function (options = {}, displays, renderer, camera, scene, updateCallback) {
  // Default options
  var defaultOptions = {
    AR_AUTOSTART: true
  };
  this.options = Object.assign({}, defaultOptions, options);
  this.displays = displays;
  this.renderer = renderer;
  this.camera = camera;
  this.scene = scene;

  var boundHandleFrame = handleFrame.bind(this); // Useful for setting up the requestAnimationFrame callback

  // A provisional hack until XRSession end method works
  this.sessions = [];

  this.session = null;

  this.autoStarted = false;

  this.poseFound = false;
  function handleFrame (frame) {
    if (this.sessionActive) {
      this.session.requestFrame(boundHandleFrame);
    }
    const headPose = frame.getDisplayPose(frame.getCoordinateSystem(XRCoordinateSystem.HEAD_MODEL));

    if (headPose._orientation[0] === 0 && headPose._orientation[1] === 0 && headPose._orientation[2] === 0 && headPose._orientation[3] === 1) {
      if (this.poseFound) {
        this.dispatchEvent({ type: 'poseLost' });
        this.poseFound = false;
      }
    } else {
      if (!this.poseFound) {
        this.dispatchEvent({ type: 'poseFound' });
        this.poseFound = true;
      }
    }

    // Let the extending class update the scene before each render
    this.updateScene(updateCallback, frame);

    // Prep THREE.js for the render of each XRView
    this.renderer.autoClear = false;
    this.renderer.setSize(this.session.baseLayer.framebufferWidth, this.session.baseLayer.framebufferHeight, false);
    this.renderer.clear();

    if (this.sessionActive) {
      // Render each view into this.session.baseLayer.context
      // for(const view of frame.views) {
      for (var i = 0; i < frame.views.length; i++) {
        var view = frame.views[i];
        this.camera.projectionMatrix.fromArray(view.projectionMatrix);
        if (this.camera.parent && this.camera.parent.type !== 'Scene') {
          this.camera.parent.matrixAutoUpdate = false;
          this.camera.parent.matrix.fromArray(headPose.poseModelMatrix);
          this.camera.parent.updateMatrixWorld(true);
        } else {
          this.camera.matrixAutoUpdate = false;
          // Each XRView has its own projection matrix, so set the camera to use that
          this.camera.matrix.fromArray(headPose.poseModelMatrix);
          this.camera.updateMatrixWorld(true);
        }
  
        // Set up the renderer to the XRView's viewport and then render
        this.renderer.clearDepth();
        const viewport = view.getViewport(this.session.baseLayer);
        this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
        this.doRender();
      }
    } else {
      if (this.camera.parent && this.camera.parent.type !== 'Scene') {
        this.camera.parent.matrixAutoUpdate = false;
        this.camera.parent.matrix = new THREE.Matrix4();
        this.camera.parent.updateMatrixWorld(true);
      } else {
        // this.camera.matrixAutoUpdate = false;
        // // Each XRView has its own projection matrix, so set the camera to use that
        // this.camera.projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        this.camera.matrix = new THREE.Matrix4();
        this.camera.updateMatrixWorld(true);
      }

      // Set up the renderer to the XRView's viewport and then render
      this.renderer.clearDepth();
      this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
      this.doRender();
    }
  }

  this.startSession = function (display, reality) {
    var createVirtualReality = false;
    if (reality === 'vr') {
      createVirtualReality = true;
    }
    var sessionInitParamers = {
      exclusive: createVirtualReality,
      type: createVirtualReality ? XRSession.REALITY : XRSession.AUGMENTATION
    }
    if (this.sessionActive) {
      return;
    }
    if (this.session !== null) {
      this.session.end();
      this.session = null;
    }
    // If the session is not created yet
    display.requestSession(sessionInitParamers).then(session => {
      session.realityType = reality;
      session.depthNear = 0.05;
      session.depthFar = 1000.0;

      // Handle session lifecycle events
      session.addEventListener('focus', ev => { this.handleSessionFocus(ev) })
      session.addEventListener('blur', ev => { this.handleSessionBlur(ev) })
      session.addEventListener('end', ev => { this.handleSessionEnded(ev) })

      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      // Set the session's base layer into which the app will render
      session.baseLayer = new XRWebGLLayer(session, renderer.context);

      // Handle layer focus events
      session.baseLayer.addEventListener('focus', ev => { this.handleLayerFocus(ev) });
      session.baseLayer.addEventListener('blur', ev => { this.handleLayerBlur(ev) });

      session.requestFrame(boundHandleFrame);

      this.sessions.push(session);
      this.session = session;
      this.sessionActive = true;
      // document.getElementsByClassName('webxr-realities')[0].style.display = 'block';
      this.dispatchEvent({ type: 'sessionStarted', session: session });
    }).catch(err => {
      console.error('Error requesting session', err);
    });
  };

  this.endSession = function () {
    this.session.end();
    this.dispatchEvent({ type: 'sessionEnded', session: this.session });
    this.sessionActive = false;
    if (this.session._display._vrDisplay && this.session._display.isPresenting) {
      this.session._display._vrDisplay.exitPresent();
    }
    // document.getElementsByClassName('webxr-realities')[0].style.display = 'none';
  };

  this.handleSessionFocus = function (ev) {
    console.log('handleSessionFocus');
  };

  this.handleSessionBlur = function (ev) {
    console.log('handleSessionBlur');
  };

  this.handleSessionEnded = function (ev) {
    console.log('handleSessionEnded');
  };

  this.handleLayerFocus = function (ev) {
    console.log('handleLayerFocus');
  };

  this.handleLayerBlur = function (ev) {
    console.log('handleLayerBlur');
  };

  // Autostart an AR session if is the only one available
  var vrSupportedDisplays = 0;
  var arSupportedDisplays = 0;
  var displayToAutoStart;
  this.totalSupportedDisplays = 0;

  for (var i = 0; i < this.displays.length; i++) {
    var display = this.displays[i];
    if (display.supportedRealities.vr) {
      vrSupportedDisplays++;
    }
    if (display.supportedRealities.ar) {
      displayToAutoStart = display;
      arSupportedDisplays++;
    }
  }
  if (arSupportedDisplays === 1 && vrSupportedDisplays === 0 && this.options.AR_AUTOSTART) {
    this.autoStarted = true;
    this.startSession(displayToAutoStart, 'ar');
  }

  this.totalSupportedDisplays = arSupportedDisplays + vrSupportedDisplays;
  /*
  Extending classes that need to update the layer during each frame should override this method
  */
  this.updateScene = function (updateCallback, frame) {
    updateCallback(frame);
  };

  this.doRender = function () {
    this.renderer.render(this.scene, this.camera);
  };
};

THREE.WebXRManager.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.WebXRManager.prototype.constructor = THREE.WebXRManager;