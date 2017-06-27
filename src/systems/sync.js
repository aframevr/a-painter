var diff = require('deep-diff');

AFRAME.registerSystem('sync', {
  init: function () {
    this.previousStrokes = null;

    this.el.addEventListener('stroke-added', function (evt) {
      // Do something with stroke data.
    });

    /* On subscribe.
      brushSystem.loadJSON({strokes: [stroke]});
    */
  },
});
