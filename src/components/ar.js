AFRAME.registerComponent('ar', {
  init: function () {
    this.posePosition = new THREE.Vector3();
    this.poseQuaternion = new THREE.Quaternion();
    this.poseEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.poseRotation = new THREE.Vector3();

    this.poseLost = true;

    this.el.sceneEl.setAttribute('vr-mode-ui', {enabled: false});

    var self = this;
    THREE.ARUtils.getARDisplay().then(function (display) {
      if (display) {
        console.log('AR display connected');
        self.arConnected(display);
      } else {
        console.log('AR display not detected');
      }
    });
  },
  arConnected: function (display) {
    // var cameraEl = document.querySelector('[camera]');
    // cameraEl.removeAttribute('orbit-controls');

    this.arDisplay = display;
    // Turn on the debugging panel
    var arDebug = new THREE.ARDebug(this.arDisplay);
    arDebug.showPlanes = true;
    document.body.appendChild(arDebug.getElement());

    this.arView = new THREE.ARView(display, this.el.sceneEl.renderer);
  },
  tick: function (t, dt) {
    if (!this.arDisplay || !this.arDisplay.getFrameData) { return; }
    this.arView.render();
    if (!this.frameData) { this.frameData = new VRFrameData(); }
    this.arDisplay.getFrameData(this.frameData);
    if (this.frameData.pose.position[0] === 0 && this.frameData.pose.position[1] === 0 && this.frameData.pose.position[2] === 0) {
      this.el.emit('poseLost', {lastPosition: this.posePosition}, false);
      this.poseLost = true;
    } else {
      if (this.poseLost) {
        this.el.emit('poseFound');
        this.poseLost = false;
      }
      // Get the pose information.
      this.posePosition.fromArray(this.frameData.pose.position);
      this.poseQuaternion.fromArray(this.frameData.pose.orientation);
      this.poseEuler.setFromQuaternion(this.poseQuaternion);
      this.poseRotation.set(
          THREE.Math.RAD2DEG * this.poseEuler.x,
          THREE.Math.RAD2DEG * this.poseEuler.y,
          THREE.Math.RAD2DEG * this.poseEuler.z);
    }

    this.el.sceneEl.camera.el.setAttribute('position', this.posePosition);
    this.el.sceneEl.camera.el.setAttribute('rotation', this.poseRotation);
  }
});
