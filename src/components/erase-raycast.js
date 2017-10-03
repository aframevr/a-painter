AFRAME.registerComponent('erase-raycast', {
  init: function () {
    var self = this;

    var sel = null;

    this.el.addEventListener('raycaster-intersection', function (evt) {
      sel = evt.detail.els[0];
    });

    this.el.addEventListener('raycaster-intersection-cleared', function (evt) {
      sel = null;
      self.el.components.raycaster.refreshObjects();
    });

    this.el.parentNode.addEventListener('triggerdown', function (evt) {
      if (sel) {
        self.remove(sel);
        self.el.components.raycaster.refreshObjects();
        sel = null;
      }
    });
  },

  remove: function (element) {
    if(!element) {
      return;
    }
    var self = this;
    var el = this.el;

    var stroke;

    var brushSystem = el.parentNode.systems.brush;
    var strokes = brushSystem.strokes;

    for (var i = strokes.length - 1; i >= 0; i--) {
      if (strokes[i].entity.object3D.uuid !== element.object3D.uuid) continue;
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