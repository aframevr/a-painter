/**
 * Syncs paint strokes to other clients connected via Networked-Aframe
 */
AFRAME.registerSystem('sync', {
  init: function () {
    var brushSystem = this.el.systems.brush;
    this.previousStrokes = null;

    var toVector3 = function (obj) {
      return new THREE.Vector3(obj.x, obj.y, obj.z)
    }

    var toQuat = function (obj) {
      return new THREE.Vector4(obj._x, obj._y, obj._z, obj._w);
    }

    /* Sending */

    this.el.addEventListener('stroke-started', function (evt) {
      var json = evt.detail.stroke.getJSON(brushSystem);
      // console.log('sending new stroke', json);
      NAF.connection.broadcastDataGuaranteed('stroke-started', json);
    });

    this.el.addEventListener('stroke-point-added', function(evt) {
      // console.log('sending point', evt.detail);
      delete evt.detail.target;
      NAF.connection.broadcastDataGuaranteed('stroke-point-added', evt.detail);
    });

    /* Receiving */

    NAF.connection.subscribeToDataChannel('stroke-started', function (senderId, type, data, targetId) {
      // brushSystem.loadJSON({version: 1, strokes: [stroke], brushes: brushSystem.brushes});
      var brush = data.brush;
      var color = new THREE.Color().fromArray(brush.color);
      brushSystem.addStroke(brush.id, brush.name, color, brush.size)
    });

    NAF.connection.subscribeToDataChannel('stroke-point-added', function (senderId, type, data, targetId) {
      // console.log('receiving point', data);
      data.position = toVector3(data.position);
      data.pointerPosition = toVector3(data.pointerPosition);
      data.orientation = toQuat(data.orientation);

      brushSystem.addPointToStroke(data.strokeId, data);
    });
  }
});
