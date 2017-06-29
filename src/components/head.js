AFRAME.registerComponent('head', {
  init: function() {
    this.scene = document.querySelector('a-scene');
  },

  play: function() {
    this.addEventListeners();
  },

  pause: function() {
    this.removeEventListeners();
  },

  addEventListeners: function() {
    this.scene.addEventListener('enter-vr', this.enteredVR);
  },

  removeEventListeners: function() {
    this.scene.addEventListener('exit-vr', this.exitedVR);
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
    var vr = avatar != 'vr';
    console.error('showing vr avatar?', vr);

    vrHead.setAttribute('visible', vr);
    nonVrhead.setAttribute('visible', !vr);
  }
});