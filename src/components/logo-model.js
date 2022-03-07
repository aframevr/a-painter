AFRAME.registerComponent('logo-model', {
  schema: {
    opacity: {default: 1.0}
  },
  init: function () {
    this.model = null;

    this.el.setAttribute('obj-model', 'obj: #logoobj; mtl: #logomtl');
    this.el.addEventListener('model-loaded', this.setModel.bind(this));
  },
  setModel: function (evt) {
    this.model = evt.detail.model;
  },
  update: function () {
    if (this.model != null) {
      this.model.children[0].material.opacity = this.data.opacity;
    }
  }
});