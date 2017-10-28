AFRAME.registerComponent('xr', {
  init: function () {
    this.posePosition = new THREE.Vector3();
    this.poseQuaternion = new THREE.Quaternion();
    this.poseEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.poseRotation = new THREE.Vector3();
    this.poseIsLost = true;

    this.defaultPosition = new THREE.Vector3(0, 1.6, 0.1);
    this.el.sceneEl.camera.el.setAttribute('position', this.defaultPosition);
    this.el.sceneEl.setAttribute('vr-mode-ui', {enabled: false});

    this.updateFrame = this.updateFrame.bind(this);

    var self = this;
    THREE.WebXRUtils.getDisplays().then(self.xrConnected.bind(self));
  },

  xrConnected: function (displays) {
    this.el.sceneEl.renderer.autoClear = false;

    // To show camera on iOS devices
    document.documentElement.style.backgroundColor = 'transparent';
    document.body.style.backgroundColor = 'transparent';
    // this.el.sceneEl.renderer.setSize(window.innerWidth, window.innerHeight);
    this.xr = new THREE.WebXRManager(displays, this.el.sceneEl.renderer, this.el.sceneEl.camera, this.el.sceneEl.object3D, this.updateFrame);
    this.xr.startSession(false, true);
  },
  updateFrame: function (frame) {
    // console.log(frame);
  },
  // tick: function (d,dt) {
  //   console.log(this.el.sceneEl.renderer.getSize());
  // }
});
