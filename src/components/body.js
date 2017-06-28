AFRAME.registerComponent('body', {
  init: function () {
    this.head = this.el.previousElementSibling;
  },
  tick: function (time, delta) {
    if (!this.head) return;
    var pos = this.head.getAttribute('position');
    var rot = this.head.getAttribute('rotation');
    this.el.setAttribute('position', pos);
    this.el.setAttribute('rotation', {x: rot.x * 0.3, y: rot.y, z: rot.z * 0.3});
  }
});