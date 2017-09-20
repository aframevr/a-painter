AFRAME.registerSystem('raycast-erase', {
  init: function () {
    var self = this;
    var scene = document.getElementsByTagName('a-scene')[0];
    scene = addEventListener('triggerdown', function(evt) {
      //check for object
      //if object is able
      //remove it
      if (evt.detail.id === 2) {
        self.system.remove(evt.target);
      }
    });
  },
  remove: function (el) {
    var stroke;
    for(var i = this.strokes.length-1; i >= 0; i--){
      if(this.strokes[i].id !== el.id) continue;
      stroke = this.strokes.splice(i, 1)[0];
      break;
    }
    if (stroke) {
      var entity = stroke.entity;
      entity.emit('stroke-removed', {entity: entity});
      entity.parentNode.removeChild(entity);
    }
  }
});