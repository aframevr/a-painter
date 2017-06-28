AFRAME.registerSystem('sync', {
  init: function () {
    var brushSystem = this.el.systems.brush;
    this.previousStrokes = null;

    this.el.addEventListener('stroke-added', function (evt) {
      NAF.connection.broadcastDataGuaranteed('stroke', evt.detail.stroke.getJSON(brushSystem));
    });

    NAF.connection.subscribeToDataChannel('stroke', function (senderId, type, stroke, targetId) {
      brushSystem.loadJSON({version: 1, strokes: [stroke], brushes: Object.keys(AFRAME.BRUSHES)});
    });
  },
});
