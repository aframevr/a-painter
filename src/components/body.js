AFRAME.registerComponent('body', {
  init: function () {
    // this.head = this.el.previousElementSibling;
    this.head = this.el.parentNode;
  },
  tick: function (time, delta) {
    if (!this.head) return;
    var rot = this.head.getAttribute('rotation');
    // this.el.setAttribute('rotation', {x: rot.x * 0.3, y: rot.y, z: rot.z * 0.3});
  }
});