/* globals AFRAME THREE */
AFRAME.registerComponent('paint-controls', {
  dependencies: ['tracked-controls', 'brush'],

  schema: {
    hand: {default: 'left'}
  },

  init: function () {
    var el = this.el;
    var self = this;
    var highLightTextureUrl = 'assets/images/controller-pressed.png';
    el.sceneEl.systems.material.loadTexture(highLightTextureUrl, {src: highLightTextureUrl}, createTexture);
    el.setAttribute('json-model', {src: 'assets/models/controller.json'});
    this.onButtonChanged = this.onButtonChanged.bind(this);
    this.onButtonDown = function (evt) { self.onButtonEvent(evt.detail.id, 'down'); };
    this.onButtonUp = function (evt) { self.onButtonEvent(evt.detail.id, 'up'); };
    this.onModelLoaded = this.onModelLoaded.bind(this);
    function createTexture (texture) {
      var material = self.highLightMaterial = new THREE.MeshBasicMaterial();
      material.map = texture;
      material.needsUpdate = true;
    }
    el.addEventListener('brushsize-changed', function (evt) { self.changeBrushSize(evt.detail.size); });
    el.addEventListener('brushcolor-changed', function (evt) { self.changeBrushColor(evt.detail.color); });

    this.numberStrokes = 0;

    document.addEventListener('stroke-started', function (event) {
      if (event.detail.entity.components['paint-controls'] !== self) { return; }

      self.numberStrokes++;

      // 3 Strokes to hide
      if (self.numberStrokes === 3) {
        var object = { alpha: 1.0 };
        var tween = new AFRAME.TWEEN.Tween(object)
          .to({alpha: 0.0}, 4000)
          .onComplete(function () {
            self.buttonMeshes.tooltips.forEach(function (tooltip) {
              tooltip.visible = false;
            });
          })
          .delay(2000)
          .onUpdate(function () {
            self.buttonMeshes.tooltips[0].material.opacity = object.alpha;
          });
        tween.start();
      }
    });
  },

  changeBrushColor: function (color) {
    this.buttonMeshes.colorTip.material.color.copy(color);
    this.buttonMeshes.sizeHint.material.color.copy(color);
  },

  changeBrushSize: function (size) {
    var scale = size / 2 * 10;
    this.buttonMeshes.sizeHint.scale.set(scale, scale, 1);
  },

  // buttonId
  // 0 - trackpad
  // 1 - trigger ( intensity value from 0.5 to 1 )
  // 2 - grip
  // 3 - menu ( dispatch but better for menu options )
  // 4 - system ( never dispatched on this layer )
  mapping: {
    axis0: 'trackpad',
    axis1: 'trackpad',
    button0: 'trackpad',
    button1: 'trigger',
    button2: 'grip',
    button3: 'menu',
    button4: 'system'
  },

  update: function () {
    var data = this.data;
    var el = this.el;
    // handId: 0 - right, 1 - left
    var controller = data.hand === 'right' ? 0 : 1;
    // in 0.4.0 the id is no longer 'OpenVR Gamepad' by default
    el.setAttribute('tracked-controls', 'id', 'OpenVR Gamepad');
    el.setAttribute('tracked-controls', 'controller', controller);
  },

  play: function () {
    var el = this.el;
    el.addEventListener('buttonchanged', this.onButtonChanged);
    el.addEventListener('buttondown', this.onButtonDown);
    el.addEventListener('buttonup', this.onButtonUp);
    el.addEventListener('model-loaded', this.onModelLoaded);
  },

  pause: function () {
    var el = this.el;
    el.removeEventListener('buttonchanged', this.onButtonChanged);
    el.removeEventListener('buttondown', this.onButtonDown);
    el.removeEventListener('buttonup', this.onButtonUp);
    el.removeEventListener('model-loaded', this.onModelLoaded);
  },

  onButtonChanged: function (evt) {
    var button = this.mapping['button' + evt.detail.id];
    var value;
    if (button !== 'trigger' || !this.buttonMeshes) { return; }
    value = evt.detail.state.value;
    this.buttonMeshes.trigger.rotation.x = -value * (Math.PI / 12);
    this.el.emit(button + 'changed', {value: value});
  },

  onModelLoaded: function (evt) {
    var controllerObject3D = evt.detail.model;
    var buttonMeshes;
    if (evt.detail.target !== this.el) { return; }
    buttonMeshes = this.buttonMeshes = {};
    buttonMeshes.grip = {
      left: controllerObject3D.getObjectByName('leftgrip'),
      right: controllerObject3D.getObjectByName('rightgrip')
    };
    buttonMeshes.menu = controllerObject3D.getObjectByName('menubutton');
    buttonMeshes.system = controllerObject3D.getObjectByName('systembutton');
    buttonMeshes.trackpad = controllerObject3D.getObjectByName('touchpad');
    buttonMeshes.trigger = controllerObject3D.getObjectByName('trigger');
    buttonMeshes.sizeHint = controllerObject3D.getObjectByName('sizehint');
    buttonMeshes.colorTip = controllerObject3D.getObjectByName('tip');
    buttonMeshes.tooltips = [
      controllerObject3D.getObjectByName('msg_leftgrip'),
      controllerObject3D.getObjectByName('msg_rightgrip'),
      controllerObject3D.getObjectByName('msg_menu'),
      controllerObject3D.getObjectByName('msg_touchpad'),
      controllerObject3D.getObjectByName('msg_trigger')
    ];
    this.changeBrushSize(this.el.components.brush.data.size);
    this.changeBrushColor(this.el.components.brush.color);
  },

  onButtonEvent: function (id, evtName) {
    var buttonName = this.mapping['button' + id];
    this.el.emit(buttonName + evtName);
    this.updateModel(buttonName, evtName);
  },

  updateModel: function (buttonName, state) {
    var material = state === 'up' ? this.material : this.highLightMaterial;
    var buttonMeshes = this.buttonMeshes;
    var button = buttonMeshes && buttonMeshes[buttonName];
    if (state === 'down' && button && !this.material) {
      material = this.material = button.material;
    }
    if (!material) { return; }
    if (buttonName === 'grip') {
      buttonMeshes.grip.left.material = material;
      buttonMeshes.grip.right.material = material;
      return;
    }
    if (!button) { return; }
    button.material = material;
  }
});
