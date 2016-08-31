AFRAME.registerComponent('json-model', {
  schema: {
    src: {type: 'src'},
  },

  init: function () {
    var objectLoader;
    this.objectLoader = new THREE.ObjectLoader();
    this.objectLoader.setCrossOrigin('');
  },

  update: function(oldData) {
    var self = this;
    var src = this.data.src;
    if (!src || src === oldData.src) { return; }
    this.objectLoader.load(this.data.src, function(group) {
      self.el.setObject3D('mesh', group);
      self.el.emit('model-loaded', {format: 'json', model: group});
    });
  }
});