/* globals AFRAME THREE */
AFRAME.registerComponent('brush', {
  schema: {
    color: {type: 'color', default: '#ef2d5e'},
    size: {default: 0.01, min: 0.001, max: 0.3},
    brush: {default: 'smooth'},
    enabled: { default: true }
  },
  init: function () {
    var data = this.data;
    this.color = new THREE.Color(data.color);

    this.el.emit('brushcolor-changed', {color: this.color});
    this.el.emit('brushsize-changed', {brushSize: data.size});

    this.active = false;
    this.obj = this.el.object3D;

    this.currentStroke = null;
    this.strokeEntities = [];

    this.sizeModifier = 0.0;
    this.textures = {};
    this.currentMap = 0;

    this.model = this.el.getObject3D('mesh');
    this.drawing = false;

    var self = this;

    this.el.addEventListener('undo', function(evt) {
      if (!self.data.enabled) { return; }
      self.system.undo();
      document.getElementById('ui_undo').play();
    });

    this.el.addEventListener('paint', function (evt) {
      if (!self.data.enabled) { return; }
      // Trigger
      var value = evt.detail.value;
      self.sizeModifier = value;
      if (value > 0.1) {
        if (!self.active) {
          self.startNewStroke();
          self.active = true;
        }
      } else {
        if (self.active) {
          self.previousEntity = self.currentEntity;
          self.currentStroke = null;
        }
        self.active = false;
      }
    });
  },
  update: function (oldData) {
    var data = this.data;
    if (oldData.color !== data.color) {
      this.color.set(data.color);
      this.el.emit('brushcolor-changed', {color: this.color});
    }
    if (oldData.size !== data.size) {
      this.el.emit('brushsize-changed', {size: data.size});
    }
  },
  tick: (function () {
    var position = new THREE.Vector3();
    var rotation = new THREE.Quaternion();
    var scale = new THREE.Vector3();

    return function tick (time, delta) {
      if (this.currentStroke && this.active) {
        this.obj.matrixWorld.decompose(position, rotation, scale);
        var pointerPosition = this.system.getPointerPosition(position, rotation);
        this.currentStroke.addPoint(position, rotation, pointerPosition, this.sizeModifier, time);
      }
    };
  })(),
  startNewStroke: function () {
    document.getElementById('ui_paint').play();
    this.currentStroke = this.system.addNewStroke(this.data.brush, this.color, this.data.size);
    this.el.emit('stroke-started', {entity: this.el, stroke: this.currentStroke});
  }
});
