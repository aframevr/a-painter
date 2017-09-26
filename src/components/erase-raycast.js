AFRAME.registerComponent('erase-raycast', {
  init: function () {
    this.intersectedElement = '';
    var self = this;
    var el = this.el;

    this.el.addEventListener('raycaster-intersected', function (evt) {
      var element = evt.detail.target;
      self.intersectedElement = element.object3D.uuid;
    });

    this.el.addEventListener('raycaster-intersected-cleared', function (evt) {
      this.intersectedElement = '';
    });

    this.el.parentNode.addEventListener('triggerdown', function (evt) {
      self.remove(self.intersectedElement);
    });
  },

  remove: function(element) {
    var self = this;
    var el = this.el;

    var stroke;

    var brushSystem = el.parentNode.systems.brush;
    var strokes = brushSystem.strokes;

    for(var i = strokes.length-1; i >= 0; i--){
      if(strokes[i].entity.object3D.uuid !== element) continue;
      stroke = strokes.splice(i, 1)[0];
      break;
    }

    if (stroke) {
      var entity = stroke.entity;
      entity.emit('stroke-removed', {entity: entity});
      entity.parentNode.removeChild(entity);
    }
  }
});