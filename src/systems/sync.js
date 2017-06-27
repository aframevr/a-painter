var diff = require('deep-diff');

AFRAME.registerSystem('sync', {
  init: function () {
    var brushSystem = this.el.systems.brush;
    this.previousStrokes = null;

    this.el.addEventListener('stroke-added', function (evt) {
      NAF.connection.broadcastDataGuaranteed('stroke', evt.detail.stroke)
      brushSystem.loadJSON({version: 1, strokes: [evt.detail.stroke.getJSON(brushSystem)],
                            brushes: brushSystem.brushes});
    });

    NAF.connection.subscribeToDataChannel('stroke', function (stroke) {
      brushSystem.loadJSON({version: 1, strokes: [evt.detail.stroke.getJSON(brushSystem)],
                            brushes: brushSystem.brushes});
    });
  },
});
