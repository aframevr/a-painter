/**
 * Angle the body slightly downward so the avatar neck is not stiff
 */
AFRAME.registerComponent('body', {
  init: function () {
    this.head = this.el.parentNode;
  },

  tick: function (time, delta) {
    if (!this.head) return;
    var rot = this.head.getAttribute('rotation');
    this.el.setAttribute('rotation', {x: -rot.x * 0.3, y: 0, z: -rot.z * 0.3});
  }
});