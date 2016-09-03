AFRAME.registerComponent('ui', {
  init: function () {
    var uiEl = this.uiEl = document.createElement('a-entity');
    this.closed = true;
    this.toggleMenu = this.toggleMenu.bind(this);
    uiEl.setAttribute('material', {
      color: '#ffffff',
      flatShading: true,
      shader: 'flat',
      transparent:true,
      fog: false,
      src: '#uinormal',
      side: 'double'
    });
    uiEl.setAttribute('obj-model', 'obj:#uiobj');
    uiEl.setAttribute('position', '0 0.04 -0.15');
    uiEl.setAttribute('scale', '0 0 0');
    this.el.appendChild(uiEl);
  },

  play: function () {
    var el = this.el;
    el.addEventListener('menudown', this.toggleMenu);
  },

  pause: function () {
    var el = this.el;
    el.removeEventListener('buttondown', this.toggleMenu);
  },

  toggleMenu: function (evt) {
    if (this.closed) {
      this.open();
      this.closed = false;
    } else {
      this.close();
      this.closed = true;
    }
  },

  open: function() {
    var uiEl = this.uiEl;
    var coords = { x: 0, y: 0, z: 0 };
    var tween = new AFRAME.TWEEN.Tween(coords)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .onUpdate(function() {
          uiEl.setAttribute('scale', this);
        })
        .easing(AFRAME.TWEEN.Easing.Exponential.Out)
        .start();

  },

  close: function() {
    var uiEl = this.uiEl;
    var coords = { x: 1, y: 1, z: 1 };
    var tween = new AFRAME.TWEEN.Tween(coords)
        .to({ x: 0, y: 0, z: 0 }, 100)
        .onUpdate(function () {
          uiEl.setAttribute('scale', this);
        })
        .easing(AFRAME.TWEEN.Easing.Exponential.Out)
        .start();
  }
});