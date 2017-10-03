AFRAME.registerComponent('erase-raycast', {
  dependencies: ['raycaster'],
  schema: {
    highlightColor: {default: 0xffffff},
    edgeName: {default: 'highlight-line'}
  },

  init: function () {
    var self = this;
    var sel = null;

    this.eventHandlerIntersection = function (evt) {
      self.removeHighlightLine(sel);
      sel = evt.detail.els[0];
      var intersection = evt.detail.intersections[0];
      self.addHighlightLine(intersection.object);
    };

    this.eventHandlerIntersectionCleared = function (evt) {
      self.removeHighlightLine(sel);
      sel = null;
      self.el.components.raycaster.refreshObjects();
    };

    this.eventHandlerTriggerDown = function (evt) {
      if (sel) {
        self.removeStroke(sel);
        sel = null;
      }
    };

    this.el.addEventListener('raycaster-intersection', this.eventHandlerIntersection);
    this.el.addEventListener('raycaster-intersection-cleared', this.eventHandlerIntersectionCleared);
    this.el.addEventListener('triggerdown', this.eventHandlerTriggerDown);
  },

  remove: function() {
    this.el.removeEventListener('raycaster-intersection', this.eventHandlerIntersection);
    this.el.removeEventListener('raycaster-intersection-cleared', this.eventHandlerIntersectionCleared);
    this.el.removeEventListener('triggerdown', this.eventHandlerTriggerDown);
  },

  removeStroke: function (element) {
    this.removeHighlightLine(element);

    var brushSystem = this.el.sceneEl.systems.brush;
    var strokes = brushSystem.strokes;

    for (var i = strokes.length - 1; i >= 0; i--) {
      if (strokes[i].entity.object3D.uuid == element.object3D.uuid) {
        brushSystem.removeStroke(strokes[i]);
        break;
      }
    }

    this.el.components.raycaster.refreshObjects();
  },

  removeHighlightLine: function (element) {
    if (!element) return;
    var highlightLine = element.object3D.getObjectByName(this.data.edgeName);
    if (highlightLine) {
      highlightLine.parent.remove(highlightLine);
    }
  },

  addHighlightLine: function (obj) {
    var highlightLine = obj.el.object3D.getObjectByName(this.data.edgeName);
    if (!highlightLine) {
      var edges = new THREE.EdgesGeometry(obj.geometry);
      highlightLine = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: this.data.highlightColor}));
      highlightLine.name = this.data.edgeName;
      obj.add(highlightLine);
    }
  }
});
