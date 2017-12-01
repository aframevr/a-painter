
/* globals AFRAME THREE */
AFRAME.registerComponent('ar-paint-controls', {
  schema: {
    mode: {default: 'normal'}
  },
  dependencies: ['brush'],

  init: function () {
    this.bindMethods();
    this.pressure = 0;

    // this.el.setAttribute('brush', 'brush', 'smooth');

    this.activePaintMode = this.data.mode;
    this.enablePaintMode(this.activePaintMode);

    this.el.addEventListener('stroke-started', this.onStrokeStarted);
    document.querySelector('[ar-ui]').addEventListener('activate', this.activate.bind(this));
    document.querySelector('[ar-ui]').addEventListener('deactivate', this.deactivate.bind(this));
    document.querySelector('[ar-ui]').addEventListener('onBrushChanged', this.onBrushChanged.bind(this));
    document.querySelector('[ar-ui]').addEventListener('objectsUIIntersected', this.objectsUIIntersected.bind(this));
    document.querySelector('a-scene').addEventListener('updateFrame', this.updateFrame);
  },
  bindMethods: function () {
    this.onStrokeStarted = this.onStrokeStarted.bind(this);
    this.startHandler = this.paintStart.bind(this);
    this.moveHandler = this.paintMove.bind(this);
    this.endHandler = this.paintEnd.bind(this);
    this.updateFrame = this.updateFrame.bind(this);
  },
  onStrokeStarted: function () {
    this.el.emit('brush-started');
  },
  activate: function () {
    if (this.el.sceneEl.isMobile) {
      window.addEventListener('touchstart', this.startHandler);
      window.addEventListener('touchmove', this.moveHandler);
      window.addEventListener('touchend', this.endHandler);
    } else {
      window.addEventListener('mousedown', this.startHandler);
      window.addEventListener('mousemove', this.moveHandler);
      window.addEventListener('mouseup', this.endHandler);
    }
  },
  deactivate: function () {
    if (this.el.sceneEl.isMobile) {
      window.removeEventListener('touchstart', this.startHandler);
      window.removeEventListener('touchmove', this.moveHandler);
      window.removeEventListener('touchend', this.endHandler);
    } else {
      window.removeEventListener('mousedown', this.startHandler);
      window.removeEventListener('mousemove', this.moveHandler);
      window.removeEventListener('mouseup', this.endHandler);
    }
  },
  onBrushChanged: function (evt) {
    if (evt.detail.brush.color !== this.el.getAttribute('brush').color) {
      this.el.setAttribute('brush', 'color', evt.detail.brush.color);
    }
    this.pressure = evt.detail.pressure;
    if (evt.detail.brush !== this.el.getAttribute('brush').brush) {
      this.el.setAttribute('brush', 'brush', evt.detail.brush.brush);
    } 
    this.el.setAttribute('brush', 'size', evt.detail.brush.size);
    this.el.emit('brushchanged', {
      brush: evt.detail.brush,
      pressure: evt.detail.pressure,
      uiTouched: this.uiTouched
    });
  },
  objectsUIIntersected: function (evt) {
    evt.detail.intersections > 0 ? this.uiTouched = true : this.uiTouched = false;
  },
  paintStart: function (e) {
    if (this.uiTouched) {
      return;
    }
    this.el.emit('paintplaced', {
      touchEvent: e
    });
  },
  paintMove: function (e) {
    if (this.uiTouched) {
      return;
    }
    this.eventTouch = e;
    var el = this.el;
    if (!el.components.brush.active) {
      el.components.brush.sizeModifier = 0;
      el.components.brush.startNewStroke();
      el.components.brush.active = true;
      this.el.emit('paintstarted');
      return;
    }

    if (e.touches && e.touches[0].touchType === 'stylus') {
      this.stylusActive = true;
      el.components.brush.sizeModifier = this.pressure;
    } else {
      this.stylusActive = false;
      if (el.components.brush.sizeModifier !== 1) {
        this.pressure = 0;
      }
      el.components.brush.sizeModifier = 1;
    }
  },
  paintEnd: function (e) {
    var el = this.el;
    if (el.components.brush.active) {
      el.components.brush.currentStroke = null;
      el.components.brush.active = false;
      this.el.emit('paintended');
    }
  },
  enablePaintMode: function (mode) {
    this.el.setAttribute('ar-paint-' + mode, {
      brush: this.el.getAttribute('brush').brush,
      color: this.el.getAttribute('brush').color,
      size: this.el.getAttribute('brush').size,
      defaultSize: this.el.components.brush.schema.size.default,
      min: this.el.components.brush.schema.size.min,
      max: this.el.components.brush.schema.size.max
    });
  },
  disablePaintMode: function (mode) {
    this.el.removeAttribute('ar-paint-' + mode);
  },
  switchPaintMode: function (newMode) {
    this.disablePaintMode(this.activePaintMode);
    this.activePaintMode = newMode;
    this.enablePaintMode(this.activePaintMode);
  },
  updateSchema: function (data) {
    if (data.mode && this.activePaintMode && this.activePaintMode !== data.mode) {
      this.switchPaintMode(data.mode);
    }
  },
  updateFrame: function (frame) {
    if (this.el.components.brush.active) {
      this.el.emit('paintpainting', {
        touchEvent: this.eventTouch,
        stylusActive: this.stylusActive
      });
    }
  }
});
