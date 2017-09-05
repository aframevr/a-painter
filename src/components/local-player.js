/**
 * Turns on/off entities of the main player entity
 */
AFRAME.registerComponent('local-player', {
  init: function() {
    this.scene = document.querySelector('a-scene');

    var forceVr = false;
    if (this.isPlayingAvatarRecording()) {
      var cameraEl = this.el.querySelector('[camera]');
      cameraEl.removeAttribute('wasd-controls');
      cameraEl.removeAttribute('look-controls');
      forceVr = true;
    }

    var self = this;
    setTimeout(function() {
      self.showAvatar(forceVr ? 'vr' : 'non-vr');
    }, 100); // Wait for template to laod
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
    this.showAvatar('vr');
  },

  exitedVR: function () {
    this.showAvatar('non-vr');
  },

  showAvatar: function (avatar) {
    var el = this.el;
    var vrHead = el.querySelector('.head.vr');
    var nonVrhead = el.querySelector('.head.non-vr');
    var body = el.querySelector('[body]');
    var hands = el.querySelectorAll('.hands');

    var vr = avatar == 'vr';
    vrHead.setAttribute('visible', vr);
    nonVrhead.setAttribute('visible', !vr);
    body.setAttribute('visible', vr);
    for (var i = 0; i < hands.length; i++) {
      hands[i].setAttribute('visible', vr);
    }
  },

  isPlayingAvatarRecording: function() {
    if (!this.hasOwnProperty('urlParams')) {
      this.urlParams = this.getUrlParams();
    }
    return this.urlParams.hasOwnProperty('avatar-recording');
  },

  isMultiuser: function() {
    if (!this.hasOwnProperty('urlParams')) {
      this.urlParams = this.getUrlParams();
    }
    return this.urlParams.hasOwnProperty('room');
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