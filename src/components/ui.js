AFRAME.registerComponent('ui', {
  dependencies: ['raycaster'],

  init: function () {
    var el = this.el;
    var uiEl = this.uiEl = document.createElement('a-entity');
    var rayEl = this.rayEl = document.createElement('a-entity');
    this.closed = true;
    this.colorStack = ['gray', 'gray', 'gray', 'gray', 'gray', 'gray'];
    this.bindMethods();
    this.colorHasChanged = true;
    this.highlightMaterials = {};
    this.intersectedObjects = [];
    this.hoveredOffObjects = [];
    this.hoveredOnObjects = [];
    this.pressedObjects = {};
    this.selectedObjects = {};
    this.unpressedObjects = {};
    this.brushButtonsMapping = {};
    this.brushRegexp = /^(?!.*(fg|bg)$)brush[0-9]+/;
    this.colorHistoryRegexp = /^colorhistory[0-9]+$/

    // The cursor is centered in 0,0 to allow scale it easily
    // This is the offset to put it back in its original position on the slider
    this.cursorOffset = new THREE.Vector3(0.06409, 0.01419, -0.10242);

    // UI entity setup
    uiEl.setAttribute('material', {
      color: '#ffffff',
      flatShading: true,
      shader: 'flat',
      transparent:true,
      fog: false,
      src: '#uinormal',
    });
    uiEl.setAttribute('obj-model', 'obj:#uiobj');
    uiEl.setAttribute('position', '0 0.04 -0.15');
    uiEl.setAttribute('scale', '0 0 0');
    uiEl.classList.add('apainter-ui');
    el.appendChild(uiEl);

    // Ray entity setup
    rayEl.setAttribute('material', { color: '#ffffff' });
    rayEl.setAttribute('geometry', { primitive: 'box', height: 0.001, width: 0.001, depth: 1.0 });
    rayEl.setAttribute('visible', false);
    el.appendChild(rayEl);

    // Raycaster setup
    el.setAttribute('raycaster', 'far', .5);
    el.setAttribute('raycaster', 'objects', '.apainter-ui');
  },

  initColorWheel: function () {
    var colorWheel = this.objects.hueWheel;

    this.uniforms = {
      brightness: { value: 1.0 }
    };

    var vertexShader = '\
      varying vec2 vUv;\
      void main() {\
        vUv = uv;\
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\
        gl_Position = projectionMatrix * mvPosition;\
      }\
      ';

    var fragmentShader = '\
      #define M_PI2 6.28318530718\n \
      uniform float brightness;\
      varying vec2 vUv;\
      vec3 hsb2rgb(in vec3 c){\
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, \
                           0.0, \
                           1.0 );\
          rgb = rgb * rgb * (3.0 - 2.0 * rgb);\
          return c.z * mix( vec3(1.0), rgb, c.y);\
      }\
      \
      void main() {\
        vec2 toCenter = vec2(0.5) - vUv;\
        float angle = atan(toCenter.y, toCenter.x);\
        float radius = length(toCenter) * 2.0;\
        vec3 color = hsb2rgb(vec3((angle / M_PI2) + 0.5, radius, brightness));\
        gl_FragColor = vec4(color, 1.0);\
      }\
      ';

    var material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    colorWheel.material = material;
},

  bindMethods: function() {
    this.onComponentChanged = this.onComponentChanged.bind(this);
    this.onTriggerChanged = this.onTriggerChanged.bind(this);
    this.onIntersection = this.onIntersection.bind(this);
    this.onIntersected = this.onIntersected.bind(this);
    this.onIntersectionCleared = this.onIntersectionCleared.bind(this);
    this.onIntersectedCleared = this.onIntersectedCleared.bind(this);
    this.onModelLoaded = this.onModelLoaded.bind(this);
    this.onStrokeStarted = this.onStrokeStarted.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  },

  tick: function() {
    // Hack until https://github.com/aframevr/aframe/issues/1886
    // is fixed.
    this.el.components.raycaster.refreshObjects();
    if (!this.closed && this.handEl) {
      this.updateIntersections();
      this.handleHover();
      this.handlePressedButtons();
    }
  },

  onTriggerChanged: function(evt) {
    var self = this;
    var triggerValue = evt.detail.value;
    this.lastTriggerValue = triggerValue;
    if (evt.detail.value >= 0.25) {
      this.triggeredPressed = true;
    } else {
      this.triggeredPressed = false;
      this.handleButtonUp();
    }
  },

  handleButtonDown: function(object, position) {
    var name = object.name;
    this.pressedObjects[name] = object;
    switch (true) {
      case name === 'brightness': {
        this.onBrightnessDown(position);
        break;
      }
      case name === 'colorsbg': {
        break;
      }
      case name === 'clear': {
        this.el.sceneEl.systems.brush.clear();
        break;
      }
      case name === 'copy': {
        this.copyBrush();
        break;
      }
      case name === 'hue': {
        this.onHueDown(position);
        break;
      }
      case name === 'save': {
        AFRAME.APAINTER.upload();
        break;
      }
      case name === 'sizebg': {
        this.onBrushSizeBackgroundDown(position);
        break;
      }
      case this.brushRegexp.test(name): {
        this.onBrushDown(name);
        break;
      }
      case this.colorHistoryRegexp.test(name): {
        this.onColorHistoryButtonDown(object);
        break;
      }
      default: {
        delete this.pressedObjects[name];
        console.log("Unkown button down " + name);
      }
    }
  },

  copyBrush: function () {
    var brush = this.el.getComputedAttribute('brush');
    this.handEl.setAttribute('brush', 'brush', brush.brush);
    this.handEl.setAttribute('brush', 'color', brush.color);
    this.handEl.setAttribute('brush', 'size', brush.size);
    this.colorHasChanged = true;
  },

  handleButtonUp: function () {
    var pressedObjects = this.pressedObjects;
    var unpressedObjects = this.unpressedObjects;
    var self = this;
    Object.keys(pressedObjects).forEach(function (key) {
      var buttonName = pressedObjects[key].name;
      switch (true) {
        case buttonName === 'size': {
          //self.onBrushSizeUp();
          break;
        }
        default: {
          break;
        }
      }
      unpressedObjects[buttonName] = pressedObjects[buttonName];
      delete pressedObjects[buttonName];
    });
  },

  handlePressedButtons: function () {
    var self = this;
    if (!this.triggeredPressed) { return; }
    this.hoveredOnObjects.forEach(function triggerAction(button) {
      self.handleButtonDown(button.object, button.point);
    });
  },

  onColorHistoryButtonDown: function (object) {
    var color = object.material.color.getHexString();
    this.handEl.setAttribute('brush', 'color', '#' + color);
  },

  onBrushDown: function(name) {
    var brushName = this.brushButtonsMapping[name];
    this.selectBrushButton(name);
    this.handEl.setAttribute('brush', 'brush', brushName.toLowerCase());
  },

  selectBrushButton: function(brushName) {
    var object = this.uiEl.getObject3D('mesh').getObjectByName(brushName + 'bg');
    var selectedObjects = this.selectedObjects;
    var selectedBrush = this.selectedBrush;
    if (selectedBrush) {
      if (!this.highlightMaterials[selectedBrush.name]) {
        this.initHighlightMaterial(object);
      }
      selectedBrush.material = this.highlightMaterials[selectedBrush.name].normal;
      delete selectedObjects[selectedBrush.name];
    }
    selectedObjects[object.name] = object;
    this.selectedBrush = object;
  },

  onHueDown: function (position) {
    var color;
    var hueWheel = this.objects.hueWheel;
    var polarPosition;
    var rgb;
    var bb = hueWheel
    var radius = 0.04;
    hueWheel.updateMatrixWorld();
    hueWheel.worldToLocal(position);
    polarPosition = {
      r: Math.sqrt(position.x * position.x + position.z * position.z),
      theta: Math.PI + Math.atan2(-position.z, position.x)
    };
    // console.log("x: " + position.x + ' y:' + -position.z);
    var angle = ((polarPosition.theta * (180 / Math.PI)) + 180) % 360;
    // console.log("radius: " + polarPosition.r + ' theta:' + angle);
    rgb = this.hsv2rgb(angle / 360  , polarPosition.r / 0.04, 1.0);

    color = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    this.objects.hueCursor.position.copy(position);
    this.handEl.setAttribute('brush', 'color', color);
    this.colorHasChanged = true;
  },

  hsv2rgb: function (h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
      s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  },

  rgb2hsv: function (r, g, b) {
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var d = max - min;
    var h;
    var s = (max === 0 ? 0 : d / max);
    var v = max / 255;

    if (arguments.length === 1) { g = r.g, b = r.b, r = r.r; }

    switch (max) {
      case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }
    return {h: h, s: s, v: v};
  },

  onBrightnessDown: function(position) {
    // TO DO
  },

  onBrushSizeBackgroundDown: function (position) {
    var slider = this.objects.sizeSlider;
    var sliderBoundingBox = slider.geometry.boundingBox;
    var sliderWidth = sliderBoundingBox.max.x - sliderBoundingBox.min.x;
    slider.updateMatrixWorld();
    slider.worldToLocal(position);
    var brushSize = (position.x - sliderBoundingBox.min.x) / sliderWidth;
    brushSize = brushSize * AFRAME.components.brush.schema.size.max;
    this.handEl.setAttribute('brush', 'size', brushSize);
  },

  handleHover: function () {
    this.updateHoverObjects();
    this.updateMaterials();
  },

  updateHoverObjects: function () {
    var intersectedObjects = this.intersectedObjects;
    intersectedObjects = intersectedObjects.filter(function (obj) {
      return obj.object.name !== 'bb';
    });
    this.hoveredOffObjects = this.hoveredOnObjects.filter(function (obj) {
      return intersectedObjects.indexOf(obj) === -1;
    });
    this.hoveredOnObjects = intersectedObjects;
  },

  updateMaterials: function () {
    var self = this;
    var pressedObjects = this.pressedObjects;
    var unpressedObjects = this.unpressedObjects;
    var selectedObjects = this.selectedObjects;
    // Remove hover highlights
    this.hoveredOffObjects.forEach(function (obj) {
      var object = obj.object;
      object.material = self.highlightMaterials[object.name].normal;
    });
    // Add highlight to newly intersected objects
    this.hoveredOnObjects.forEach(function (obj) {
      var object = obj.object;
      //if (self.colorHistoryRegexp.test(object.name)) { debugger; }
      if (!self.highlightMaterials[object.name]) {
        self.initHighlightMaterial(object);
      }
      // Update ray
      self.handRayEl.setAttribute('scale', {x: 1.0, y: 1.0, z: obj.distance});
      self.handRayEl.setAttribute('position', {x: 0, y: 0, z: -(obj.distance / 2.0)});
      object.material = self.highlightMaterials[object.name].hover;
    });
    // Pressed Material
    Object.keys(pressedObjects).forEach(function (key) {
      var object = pressedObjects[key];
      var materials = self.highlightMaterials[object.name];
      object.material = materials.pressed || object.material;
    });
    // Unpressed Material
    Object.keys(unpressedObjects).forEach(function (key) {
      var object = unpressedObjects[key];
      var materials = self.highlightMaterials[object.name];
      object.material = materials.normal;
      delete unpressedObjects[key];
    });
    // Selected material
    Object.keys(selectedObjects).forEach(function (key) {
      var object = selectedObjects[key];
      var materials = self.highlightMaterials[object.name];
      if (!materials) { return; }
      object.material = materials.selected;
    });
  },

  play: function () {
    var el = this.el;
    var handEl = this.handEl;
    el.addEventListener('menudown', this.toggleMenu);
    el.addEventListener('model-loaded', this.onModelLoaded);
    el.addEventListener('raycaster-intersection', this.onIntersection);
    el.addEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
    el.addEventListener('raycaster-intersected', this.onIntersected);
    el.addEventListener('raycaster-intersected-cleared', this.onIntersectedCleared);
    if (!handEl) { return; }
    this.addHandListeners();
  },

  pause: function () {
    var el = this.el;
    var handEl = this.handEl;
    el.removeEventListener('buttondown', this.toggleMenu);
    el.removeEventListener('raycaster-intersection', this.onIntersection);
    el.removeEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
    el.removeEventListener('raycaster-intersected', this.onIntersected);
    el.removeEventListener('raycaster-intersected-cleared', this.onIntersectedCleared);
    if (!handEl) { return; }
    this.removeHandListeners();
  },

  onModelLoaded: function (evt) {
    var el = this.el;
    var uiEl = this.uiEl;
    var model = uiEl.getObject3D('mesh');
    if (evt.detail.format !== 'json') { return;}
    this.objects = {};
    this.objects.brightnessCursor = model.getObjectByName('brightnesscursor');
    this.objects.hueCursor = model.getObjectByName('huecursor');
    this.objects.hueWheel = model.getObjectByName('hue');
    this.objects.sizeCursor = model.getObjectByName('size');
    this.objects.sizeCursor.position.copy(this.cursorOffset);
    this.objects.colorHistory = [];
    for (var i = 0; i < 6; i++) {
      this.objects.colorHistory[i] = model.getObjectByName('colorhistory' + i);
    }
    this.objects.currentColor = model.getObjectByName('currentcolor');
    this.objects.sizeSlider = model.getObjectByName('sizebg');
    this.objects.sizeSlider.geometry.computeBoundingBox();
    // Hide bounding box
    model.getObjectByName('bb').material = new THREE.MeshBasicMaterial(
      {color: 0x248f24, alphaTest: 0, visible: false });
    // Hide objects
    model.getObjectByName('msg_save').visible = false;
    model.getObjectByName('msg_error').visible = false;
    this.initColorWheel();
    this.initColorHistory();
    this.setCursorTransparency();
    this.loadBrushes();
  },

  setCursorTransparency: function () {
    var alphaTest = 0.5;
    var transparent = true;
    var hueCursor = this.objects.hueCursor;
    var brightnessCursor = this.objects.brightnessCursor;
    var sizeCursor = this.objects.sizeCursor;
    sizeCursor.material = sizeCursor.material.clone();
    hueCursor.material = hueCursor.material.clone();
    brightnessCursor.material = brightnessCursor.material.clone();
    sizeCursor.material.alphaTest = 0.5;
    hueCursor.material.alphaTest = 0.5;
    brightnessCursor.material.alphaTest = 0.5;
    sizeCursor.material.transparent = true;
    hueCursor.material.transparent = true;
    brightnessCursor.material.transparent = true;
  },

  loadBrushes: function () {
    var brushNum = 0;
    var uiEl = this.uiEl.getObject3D('mesh');
    var brushes = Object.keys(AFRAME.BRUSHES);
    var self = this;
    brushes.forEach(function (key) {
      var thumbnail = AFRAME.BRUSHES[key].prototype.options.thumbnail;
      loadBrush(key, brushNum, thumbnail);
      brushNum+=1;
    });
    function loadBrush(name, id, thumbnailUrl) {
      var onLoadThumbnail = function(texture) {
        var button = uiEl.getObjectByName('brush' + id);
        var buttonForeground = uiEl.getObjectByName('brush' + id + 'fg');
        var buttonBackground = uiEl.getObjectByName('brush' + id + 'bg');
        var brushName = name.charAt(0).toUpperCase() + name.slice(1);
        if (!button) { return; }
        self.brushButtonsMapping['brush' + id] = brushName.toLowerCase();
        setBrushThumbnail(texture, button);
      };
      if (!thumbnailUrl) { return; }
      thumbnailUrl = 'url(' + thumbnailUrl + ')';
      self.el.sceneEl.systems.material.loadTexture(thumbnailUrl, {src: thumbnailUrl}, onLoadThumbnail);
    }
    function setBrushThumbnail (texture, button) {
      var material = new THREE.MeshBasicMaterial();
      material.map = texture;
      material.alphaTest = 0.5;
      material.transparent = true;
      button.material = material;
    }
  },

  initHighlightMaterial: function (object) {
    var buttonName = object.name;
    var isBrushButton = this.brushRegexp.test(buttonName);
    var isHistory = buttonName.indexOf('history') !== -1;
    var materials = {
      normal: object.material,
      hover: object.material,
      pressed: object.material,
      selected: object.material
    };
    if (!isBrushButton && !isHistory) {
      materials.normal = object.material;
      materials.hover = object.material.clone();
      materials.hover.map = this.system.hoverTexture;
      materials.selected = object.material.clone();
      materials.selected.map = this.system.pressedTexture;
      materials.pressed = object.material.clone();
      materials.pressed.map = this.system.pressedTexture;
    }
    this.highlightMaterials[buttonName] = materials;
  },

  toggleMenu: function (evt) {
    if (this.closed) {
      this.system.closeAll();
      this.open();
      this.system.opened = this.el;
    } else {
      this.close();
      this.system.opened = undefined;
    }
  },

  open: function() {
    var uiEl = this.uiEl;
    var coords = { x: 0, y: 0, z: 0 };
    var tween;
    if (!this.closed) { return; }
    tween = new AFRAME.TWEEN.Tween(coords)
        .to({ x: 1, y: 1, z: 1 }, 100)
        .onUpdate(function() {
          uiEl.setAttribute('scale', this);
        })
        .easing(AFRAME.TWEEN.Easing.Exponential.Out)
        .start();
    this.el.setAttribute('brush', 'enabled', false);
    this.rayEl.setAttribute('visible', false);
    this.closed = false;
  },

  updateIntersections: (function () {
    var raycaster = this.raycaster = new THREE.Raycaster();
    return function (evt) {
      this.updateRaycaster(raycaster);
      this.intersectedObjects = raycaster.intersectObjects(this.menuEls, true);
    }
  })(),

  onIntersection: function (evt) {
    var intersectedEl = evt.detail.els[0];
    var visible = this.closed && this.system.opened;
    if (this.el.components.brush.active) { return; }
    this.rayEl.setAttribute('visible', !!visible);
    this.el.setAttribute('brush', 'enabled', false);
  },

  onIntersected: function (evt) {
    var handEl = evt.detail.el;
    // Remove listeners of previous hand
    if (this.handEl) { this.removeHandListeners(); }
    this.handEl = handEl;
    this.handRayEl = this.handEl.components.ui.rayEl;
    this.menuEls = this.uiEl.object3D.children;
    this.syncUI();
    this.addHandListeners();
  },

  addHandListeners: function () {
    var handEl = this.handEl;
    handEl.addEventListener('componentchanged', this.onComponentChanged);
    handEl.addEventListener('stroke-started', this.onStrokeStarted);
    handEl.addEventListener('triggerchanged', this.onTriggerChanged);
  },

  removeHandListeners: function () {
    var handEl = this.handEl;
    handEl.removeEventListener('componentchanged', this.onComponentChanged);
    handEl.removeEventListener('stroke-started', this.onStrokeStarted);
    handEl.removeEventListener('triggerchanged', this.onTriggerChanged);
  },

  onComponentChanged: function(evt) {
    if (evt.detail.name === 'brush') { this.syncUI(); }
  },

  syncUI: function () {
    var brush;
    if (!this.handEl || !this.objects) { return; }
    brush = this.handEl.getComputedAttribute('brush');
    this.updateSizeSlider(brush.size);
    this.updateColorWheel(brush.color);
    this.updateColorHistory();
    // this.updateBrushSelector(brush.brush);
  },

  initColorHistory: function () {
    var colorStack = this.colorStack;
    var colorHistoryObject;
    var currentColor = this.objects.currentColor;
    for (var i = 0; i < this.objects.colorHistory.length; i++) {
      colorHistoryObject = this.objects.colorHistory[i];
      colorHistoryObject.material = colorHistoryObject.material.clone();
      colorHistoryObject.material.map = this.system.selectedTexture;
    }
    currentColor.material = currentColor.material.clone();
    currentColor.material.map = this.system.selectedTexture;
  },

  updateColorHistory: function () {
    var color = this.handEl.getComputedAttribute('brush').color;
    var colorStack = this.colorStack;
    this.objects.currentColor.material.color.set(color);
    for (var i = 0; i < colorStack.length; i++) {
      color = colorStack[colorStack.length - i];
      this.objects.colorHistory[i].material.color.set(color);
    }
  },

  updateSizeSlider: function (size) {
    var slider = this.objects.sizeSlider;
    var sliderBoundingBox = slider.geometry.boundingBox;
    var cursor = this.objects.sizeCursor;
    var sliderWidth = sliderBoundingBox.max.x - sliderBoundingBox.min.x;
    var normalizedSize = size / AFRAME.components.brush.schema.size.max;
    var positionX = normalizedSize * sliderWidth;
    cursor.position.setX(positionX - this.cursorOffset.x);

    var scale = normalizedSize + 0.3;
    cursor.scale.set(scale, 1, scale);
  },

  updateColorWheel: function (color) {
    var colorRGB = new THREE.Color(color);
    var hsv = this.rgb2hsv(colorRGB.r, colorRGB.g, colorRGB.b);
    var angle = hsv.h * 2 * Math.PI;
    var radius = hsv.s * 0.04;
    var x = radius * Math.cos(angle);
    var y = radius * Math.sin(angle);
    this.objects.hueCursor.position.setX(x);
    this.objects.hueCursor.position.setZ(-y);
  },

  updateBrushSelector: function (brush) {
    var self = this;
    var buttons = Object.keys(this.brushButtonsMapping);
    var brushButtonsMapping = this.brushButtonsMapping;
    buttons.forEach(function (id) {
      if (brushButtonsMapping[id] !== brush) { return; }
      self.selectBrushButton(id);
    });
  },

  onIntersectionCleared: function () {
    this.checkMenuIntersections = false;
    this.rayEl.setAttribute('visible', false);
    this.el.setAttribute('brush', 'enabled', true);
  },

  onIntersectedCleared: function (evt) {
    if (!this.handEl) { return; }
    this.handEl.removeEventListener('triggerchanged', this.onTriggerChanged);
  },

  onStrokeStarted: function () {
    var color;
    var colorStack = this.colorStack;
    if (!this.colorHasChanged) { return; }
    color = this.handEl.getComputedAttribute('brush').color;
    this.colorHasChanged = false;
    colorStack.push(color);
    if (colorStack.length > 6) { colorStack.shift(); }
    this.syncUI();
  },

  updateRaycaster: (function () {
    var direction = new THREE.Vector3();
    var directionHelper = new THREE.Quaternion();
    var scaleDummy = new THREE.Vector3();
    var originVec3 = new THREE.Vector3();

    // Closure to make quaternion/vector3 objects private.
    return function (raycaster) {
      var object3D = this.handEl.object3D;

      // Update matrix world.
      object3D.updateMatrixWorld();
      // Grab the position and rotation.
      object3D.matrixWorld.decompose(originVec3, directionHelper, scaleDummy);
      // Apply rotation to a 0, 0, -1 vector.
      direction.set(0, 0, -1);
      direction.applyQuaternion(directionHelper);

      raycaster.set(originVec3, direction);
    };
  })(),

  close: function () {
    var uiEl = this.uiEl;
    var coords = { x: 1, y: 1, z: 1 };
    var tween;
    if (this.closed) { return; }
    tween = new AFRAME.TWEEN.Tween(coords)
        .to({ x: 0, y: 0, z: 0 }, 100)
        .onUpdate(function () {
          uiEl.setAttribute('scale', this);
        })
        .easing(AFRAME.TWEEN.Easing.Exponential.Out)
        .start();
    this.el.setAttribute('brush', 'enabled', true);
    this.closed = true;
  }
});
