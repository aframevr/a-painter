/* globals AFRAME */
AFRAME.registerComponent('auto-detect-controllers', {
  schema: {
    hand: {default: 'left'}
  },

  init: function () {
    var el = this.el;
    var self = this;
    this.rescheduleCheck = true;
    this.injectedControls = false;
  },

  update: function () {
    var data = this.data;
    var el = this.el;
    this.checkControllerType = this.checkControllerType.bind(this);
    this.checkControllerType();
  },

  play: function () {
    this.rescheduleCheck = !this.injectedControls;
  },

  pause: function () {
    this.rescheduleCheck = false;
  },

  injectOculusTouch: function () {
    this.injectedControls = true;
    this.el.setAttribute('tracked-controls', 'id', 'Oculus Touch ' + (this.data.hand === 'left' ? '(Left)' : '(Right)'));
    this.el.setAttribute('tracked-controls', 'controller', '0');
    this.el.setAttribute('tracked-controls', 'hand', this.data.hand); // although tracked-controls doesn't use this yet
  },

  injectVive: function () {
    this.injectedControls = true;
    this.el.setAttribute('tracked-controls', 'id', 'OpenVR Gamepad');
    this.el.setAttribute('tracked-controls', 'controller', this.data.hand === 'left' ? '1' : '0');
    this.el.setAttribute('tracked-controls', 'hand', this.data.hand); // although tracked-controls doesn't use this yet
  },

  checkControllerType: function () {
    if (this.injectedControls || !navigator.getGamepads) { return; }

    var gamepads = navigator.getGamepads();
    if (gamepads) {
      for (var i = 0; i < gamepads.length; i++) {
        var gamepad = gamepads[i];
        if (gamepad) {
          if (gamepad.id.indexOf('Oculus Touch') === 0) {
            this.injectOculusTouch();
            break;
          }
          if (gamepad.id.indexOf('OpenVR Gamepad') === 0) {
            this.injectVive();
            break;
          }
        }
      }
    }

    this.rescheduleCheck = !this.injectedControls;
    if (this.rescheduleCheck) {
      setTimeout(this.checkControllerType, 1000);
    }
  }
});
