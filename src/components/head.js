AFRAME.registerComponent('head', {
  init: function() {
    this.scene = document.querySelector('a-scene');

    if (this.isPlayingAvatarRecording()) {
      var self = this;
      setTimeout(function() {
        self.showAvatar('vr');
      }, 100);
    }
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
    var vrHead = this.el.querySelector('.head.vr');
    var nonVrhead = this.el.querySelector('.head.non-vr');
    var vr = avatar == 'vr';
    console.log('showing vr avatar?', vr);

    vrHead.setAttribute('visible', vr);
    nonVrhead.setAttribute('visible', !vr);
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