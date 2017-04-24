/* globals AFRAME THREE */

AFRAME.registerComponent('json-model', {
  schema: {
    src: {type: 'asset'}
  },

  init: function () {
    this.objectLoader = new THREE.ObjectLoader();
    this.objectLoader.setCrossOrigin('');
  },

  update: function (oldData) {
    var self = this;
    var src = this.data.src;
    if (!src || src === oldData.src) { return; }
    this.objectLoader.load(this.data.src, function (group) {
      var Rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
      group.traverse(function (child) {
        if (!(child instanceof THREE.Mesh)) { return; }
        child.position.applyMatrix4(Rotation);
      });
      self.el.setObject3D('mesh', group);
      self.el.emit('model-loaded', {format: 'json', model: group, src: src});
    });
  }
});
