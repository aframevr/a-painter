AFRAME.registerComponent('orbit-controls', {
  dependencies: ['camera'],
  schema: {
    position: { default: '0 1.6 0.1', type: 'vec3'}
  },

  init: function () {
    var sceneEl = this.el.sceneEl;
    var setupControls = this.setupControls.bind(this);
    if (!this.el.sceneEl.is('vr-mode')) {
      this.el.setAttribute('position', this.data.position);
    }
    if (!sceneEl.canvas) {
      sceneEl.addEventListener('render-target-loaded', setupControls);
    } else {
      setupControls();
    }
    this.onEnterVR = this.onEnterVR.bind(this);
    this.onExitVR = this.onExitVR.bind(this);
    sceneEl.addEventListener('enter-vr', this.onEnterVR);
    sceneEl.addEventListener('exit-vr', this.onExitVR);
  },

  onExitVR: function () {
    this.el.setAttribute('position', this.data.position);
    this.controls.enabled = true;
  },

  onEnterVR: function () {
    if (!AFRAME.utils.checkHeadsetConnected() && !this.el.sceneEl.isMobile) {return; }

    var currentPosition = this.el.getAttribute('position');
    var camera = this.el.getObject3D('camera');
    this.controls.enabled = false;
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);
    if (this.el.sceneEl.isMobile) { return; }
    this.el.setAttribute('position', {
      x: currentPosition.x - this.data.position.x,
      y: currentPosition.y - this.data.position.y,
      z: currentPosition.z - this.data.position.z
    });

  },

  setupControls: function() {
    var renderer = this.el.sceneEl.renderer;
    var camera = this.el.getObject3D('camera');
    var controls = this.controls = new THREE.OrbitControls(camera, renderer.domElement);
    var position = this.el.getAttribute('position');
    controls.target.setX(-position.x);
    controls.target.setZ(-position.z);
    controls.enableDamping = true;
    controls.dampingFactor = 1.0;
    controls.enableZoom = true;
  },

  play: function () {
    if (!this.controls) { return; }
    this.controls.enable = true;
  },

  pause: function () {
    if (!this.controls) { return; }
    this.controls.enable = false;
  },

  remove: function () {
    this.pause();
  }
});
