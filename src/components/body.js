AFRAME.registerComponent('body', {
  init: function () {
    this.head = this.el.parentNode;
    this.scene = document.querySelector('a-scene');

    if (this.isPlayingAvatarRecording()) {
      this.el.setAttribute('visible', true);
    }
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
    if (!this.isPlayingAvatarRecording()) {
      this.scene.addEventListener('enter-vr', this.enteredVR.bind(this));
    }
  },

  removeEventListeners: function() {
    if (!this.isPlayingAvatarRecording()) {
      this.scene.addEventListener('exit-vr', this.exitedVR.bind(this));
    }
  },

  enteredVR: function () {
    this.el.setAttribute('visible', true);
  },

  exitedVR: function () {
    this.el.setAttribute('visible', false);
  },

  isPlayingAvatarRecording: function() {
    if (!this.hasOwnProperty('urlParams')) {
      this.urlParams = this.getUrlParams();
    }
    return this.urlParams.hasOwnProperty('avatar-recording');
  },

  getUrlParams: function () {
    var match;
    var pl = /\+/g;  // Regex for replacing addition symbol with a space
    var search = /([^&=]+)=?([^&]*)/g;
    var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
    var query = window.location.search.substring(1);
    var urlParams = {};

    match = search.exec(query);
    while (match) {
      urlParams[decode(match[1])] = decode(match[2]);
      match = search.exec(query);
    }
    return urlParams;
  }
});