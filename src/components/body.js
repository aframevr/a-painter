AFRAME.registerComponent('body', {
  init: function () {
    this.head = this.el.parentNode;
    this.scene = document.querySelector('a-scene');
  },

  tick: function (time, delta) {
    if (!this.head) return;
    var rot = this.head.getAttribute('rotation');
    this.el.setAttribute('rotation', {x: -rot.x * 0.3, y: 0, z: -rot.z * 0.3});
  },

  play: function() {
    this.addEventListeners();
  },

  pause: function() {
    this.removeEventListeners();
  },

  addEventListeners: function() {
    this.scene.addEventListener('enter-vr', this.enteredVR.bind(this));
  },

  removeEventListeners: function() {
    this.scene.addEventListener('exit-vr', this.exitedVR.bind(this));
  },

  enteredVR: function () {
    this.el.setAttribute('visible', true);
  },

  exitedVR: function () {
    this.el.setAttribute('visible', false);
  }
});