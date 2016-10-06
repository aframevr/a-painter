/* globals AFRAME THREE */

// Allow modifying the materials returned from obj-model loader .mtl files.
// We can add any ThreeJS.Material specific options that .mtl doesn't support.
AFRAME.registerComponent('obj-model-material-modifier', {
  schema: {
    side: {type: 'string'}
  },

  init: function () {
    var that = this;
    var el = this.el;
    var side = this.sideToThreeSide(this.data.side)
    if (!side) {
      console.warn("No options present on obj-model-material-modifier");
      return;
    }
    this.el.addEventListener('model-loaded', function(e) {
      el.object3D.traverse(function (o) {
        if (o instanceof THREE.Mesh) {
          o.material.side = side
        }
      });
    })
  },
  
  sideToThreeSide: function(side) {
    return {
      "double": THREE.DoubleSide,
      "front": THREE.FrontSide,
      "back": THREE.BackSide
    }[side];
  }
});
