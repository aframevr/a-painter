AFRAME.registerComponent('look-controls-alt', {
  dependencies: ['position', 'rotation'],

  schema: {
    enabled: {default: true},
    hmdEnabled: {default: true},
    standing: {default: true}
  },

  init: function () {
    var sceneEl = this.el.sceneEl;
    this.previousHMDPosition = new THREE.Vector3();
    this.setupHMDControls();
  },

  update: function (oldData) {
    var data = this.data;
    var hmdEnabled = data.hmdEnabled;
    if (!data.enabled || !hmdEnabled || !this.el.sceneEl.is('vr-mode')) { return; }
    this.controls.standing = data.standing;
    this.controls.update();
    this.updateOrientation();
    this.updatePosition();
  },

  play: function () {
    this.addEventListeners();
  },

  tick: function (t) {
    this.update();
  },

  remove: function () {
    this.pause();
  },

  setupHMDControls: function () {
    this.dolly = new THREE.Object3D();
    this.euler = new THREE.Euler();
    this.controls = new THREE.VRControls(this.dolly);
    this.controls.userHeight = 0.0;
  },

  addEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl.canvas;

    // listen for canvas to load.
    if (!canvasEl) {
      sceneEl.addEventListener('render-target-loaded', this.addEventListeners.bind(this));
      return;
    }
  },

  updateOrientation: (function () {
    var hmdEuler = new THREE.Euler();
    return function () {
      var hmdQuaternion = this.calculateHMDQuaternion();
      var radToDeg = THREE.Math.radToDeg;
      var rotation;
      hmdEuler.setFromQuaternion(hmdQuaternion, 'YXZ');
      if (!this.el.sceneEl.is('vr-mode')) { return; }
      rotation = {
        x: radToDeg(hmdEuler.x),
        y: radToDeg(hmdEuler.y),
        z: radToDeg(hmdEuler.z)
      };
      this.el.setAttribute('rotation', rotation);
    };
  })(),

  calculateHMDQuaternion: (function () {
    var hmdQuaternion = new THREE.Quaternion();
    return function () {
      hmdQuaternion.copy(this.dolly.quaternion);
      return hmdQuaternion;
    };
  })(),

  updatePosition: (function () {
    var deltaHMDPosition = new THREE.Vector3();
    return function () {
      var el = this.el;
      var currentPosition = el.getAttribute('position');
      var currentHMDPosition;
      var previousHMDPosition = this.previousHMDPosition;
      var sceneEl = this.el.sceneEl;
      currentHMDPosition = this.calculateHMDPosition();
      deltaHMDPosition.copy(currentHMDPosition).sub(previousHMDPosition);
      if (!sceneEl.is('vr-mode') || this.isNullVector(deltaHMDPosition)) { return; }
      previousHMDPosition.copy(currentHMDPosition);
      // Do nothing if we have not moved.
      if (!sceneEl.is('vr-mode')) { return; }
      el.setAttribute('position', {
        x: currentPosition.x + deltaHMDPosition.x,
        y: currentPosition.y + deltaHMDPosition.y,
        z: currentPosition.z + deltaHMDPosition.z
      });
    };
  })(),

  calculateHMDPosition: function () {
    var dolly = this.dolly;
    var position = new THREE.Vector3();
    dolly.updateMatrix();
    position.setFromMatrixPosition(dolly.matrix);
    return position;
  },

  isNullVector: function (vector) {
    return vector.x === 0 && vector.y === 0 && vector.z === 0;
  }
});
