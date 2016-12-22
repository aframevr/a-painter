/* globals AFRAME THREE */
AFRAME.registerComponent('ui', {
  schema: { brightness: { default: 1.0, max: 1.0, min: 0.0 } },
  dependencies: ['ui-raycaster'],

  init: function () {
    var el = this.el;
    var uiEl = this.uiEl = document.createElement('a-entity');
    var rayEl = this.rayEl = document.createElement('a-entity');
    this.closed = true;
    this.colorStack = ['#272727', '#727272', '#FFFFFF', '#24CAFF', '#249F90', '#F2E646', '#EF2D5E'];
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
    this.colorHistoryRegexp = /^(?!.*(fg|bg)$)colorhistory[0-9]+$/;
    this.hsv = { h: 0.0, s: 0.0, v: 1.0 };
    this.rayAngle = 45;
    this.rayDistance = 0.2;

    // The cursor is centered in 0,0 to allow scale it easily
    // This is the offset to put it back in its original position on the slider
    this.cursorOffset = new THREE.Vector3(0.06409, 0.01419, -0.10242);

    // UI entity setup
    uiEl.setAttribute('material', {
      color: '#ffffff',
      flatShading: true,
      shader: 'flat',
      transparent: true,
      fog: false,
      src: '#uinormal'
    });
    uiEl.setAttribute('obj-model', 'obj:#uiobj');
    uiEl.setAttribute('position', '0 0.04 -0.15');
    uiEl.setAttribute('scale', '0 0 0');
    uiEl.setAttribute('visible', false);
    uiEl.classList.add('apainter-ui');
    el.appendChild(uiEl);

    // Ray entity setup
    rayEl.setAttribute('line', '');
    //rayEl.setAttribute('visible', false);
    el.appendChild(rayEl);

    // Raycaster setup
    el.setAttribute('ui-raycaster', {
      far: this.rayDistance,
      objects: '.apainter-ui',
      rotation: -this.rayAngle
    });
  },

  initColorWheel: function () {
    var colorWheel = this.objects.hueWheel;

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
      uniforms: { brightness: { type: 'f', value: this.hsv.v } },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    colorWheel.material = material;
  },

  bindMethods: function () {
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

  tick: function () {
    // Hack until https://github.com/aframevr/aframe/issues/1886
    // is fixed.
    this.el.components['ui-raycaster'].refreshObjects();
    if (!this.closed && this.handEl) {
      this.updateIntersections();
      this.handleHover();
      this.handlePressedButtons();
    }
  },

  onTriggerChanged: function (evt) {
    var triggerValue = evt.detail.value;
    this.lastTriggerValue = triggerValue;
    if (evt.detail.value >= 0.25) {
      this.triggeredPressed = true;
    } else {
      this.triggeredPressed = false;
      this.handleButtonUp();
    }
  },

  handleButtonDown: function (object, position) {
    var name = object.name;
    if (this.activeWidget && this.activeWidget !== name) { return; }
    this.activeWidget = name;
    switch (true) {
      case name === 'brightness': {
        this.onBrightnessDown(position);
        break;
      }
      case name === 'brushnext': {
        if (!this.pressedObjects[name]) {
          this.nextPage();
        }
        break;
      }
      case name === 'brushprev': {
        if (!this.pressedObjects[name]) {
          this.previousPage();
        }
        break;
      }
      case name === 'clear': {
        if (!this.pressedObjects[name]) {
          this.el.sceneEl.systems.brush.clear();
        }
        break;
      }
      case name === 'copy': {
        if (!this.pressedObjects[name]) {
          this.copyBrush();
        }
        break;
      }
      case name === 'hue': {
        this.onHueDown(position);
        break;
      }
      case name === 'save': {
        if (!this.pressedObjects[name]) {
          this.el.sceneEl.systems.painter.upload();
        }
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
        this.activeWidget = undefined;
        console.log('Unkown button down ' + name);
      }
    }
    this.pressedObjects[name] = object;
  },

  copyBrush: function () {
    var brush = this.el.getAttribute('brush');
    this.handEl.setAttribute('brush', 'brush', brush.brush);
    this.handEl.setAttribute('brush', 'color', brush.color);
    this.handEl.setAttribute('brush', 'size', brush.size);
    this.colorHasChanged = true;
  },

  handleButtonUp: function () {
    var pressedObjects = this.pressedObjects;
    var unpressedObjects = this.unpressedObjects;
    this.activeWidget = undefined;
    Object.keys(pressedObjects).forEach(function (key) {
      var buttonName = pressedObjects[key].name;
      switch (true) {
        case buttonName === 'size': {
          // self.onBrushSizeUp();
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
    this.hoveredOnObjects.forEach(function triggerAction (button) {
      self.handleButtonDown(button.object, button.point);
    });
  },

  onColorHistoryButtonDown: function (object) {
    var color = object.material.color.getHexString();
    this.handEl.setAttribute('brush', 'color', '#' + color);
  },

  onBrushDown: function (name) {
    var brushName = this.brushButtonsMapping[name];
    if (!brushName) { return; }
    this.selectBrushButton(name);
    this.handEl.setAttribute('brush', 'brush', brushName.toLowerCase());
  },

  selectBrushButton: function (brushName) {
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
    var hueWheel = this.objects.hueWheel;
    var polarPosition;
    var radius = this.colorWheelSize;
    hueWheel.updateMatrixWorld();
    hueWheel.worldToLocal(position);
    this.objects.hueCursor.position.copy(position);

    polarPosition = {
      r: Math.sqrt(position.x * position.x + position.z * position.z),
      theta: Math.PI + Math.atan2(-position.z, position.x)
    };
    var angle = ((polarPosition.theta * (180 / Math.PI)) + 180) % 360;
    this.hsv.h = angle / 360;
    this.hsv.s = polarPosition.r / radius;
    this.updateColor();
  },

  updateColor: function () {
    var rgb = this.hsv2rgb(this.hsv);
    var color = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    this.handEl.setAttribute('brush', 'color', color);
    this.colorHasChanged = true;
  },

  hsv2rgb: function (hsv) {
    var r, g, b, i, f, p, q, t;
    var h = THREE.Math.clamp(hsv.h, 0, 1);
    var s = THREE.Math.clamp(hsv.s, 0, 1);
    var v = hsv.v;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
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
    var v = max;

    if (arguments.length === 1) { g = r.g; b = r.b; r = r.r; }

    switch (max) {
      case min: h = 0; break;
      case r: h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d; break;
      case g: h = (b - r) + d * 2; h /= 6 * d; break;
      case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }
    return {h: h, s: s, v: v};
  },

  onBrightnessDown: function (position) {
    var slider = this.objects.brightnessSlider;
    var sliderBoundingBox = slider.geometry.boundingBox;
    var sliderHeight = sliderBoundingBox.max.z - sliderBoundingBox.min.z;
    slider.updateMatrixWorld();
    slider.worldToLocal(position);
    var brightness = 1.0 - (position.z - sliderBoundingBox.min.z) / sliderHeight;
    // remove object border padding
    brightness = THREE.Math.clamp(brightness * 1.29 - 0.12, 0.0, 1.0);
    this.objects.hueWheel.material.uniforms['brightness'].value = brightness;
    this.objects.brightnessCursor.rotation.y = brightness * 1.5 - 1.5;
    this.hsv.v = brightness;
    this.updateColor();
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
      return obj.object.name !== 'bb' && obj.object.name !== 'msg_save';
    });
    this.hoveredOffObjects = this.hoveredOnObjects.filter(function (obj) {
      return intersectedObjects.indexOf(obj) === -1;
    });
    this.hoveredOnObjects = intersectedObjects;
  },

  updateMaterials: (function () {
    var point = new THREE.Vector3();
    return function () {
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
        point.copy(obj.point);
        if (!self.highlightMaterials[object.name]) {
          self.initHighlightMaterial(object);
        }
        // Update ray
        self.handRayEl.object3D.worldToLocal(point);
        self.handRayEl.setAttribute('line', 'end', point);
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
    };
  })(),

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
    var uiEl = this.uiEl;
    var model = uiEl.getObject3D('mesh');
    if (evt.detail.format !== 'json') { return; }
    this.objects = {};
    this.objects.brightnessCursor = model.getObjectByName('brightnesscursor');
    this.objects.brightnessSlider = model.getObjectByName('brightness');
    this.objects.brightnessSlider.geometry.computeBoundingBox();
    this.objects.previousPage = model.getObjectByName('brushprev');
    this.objects.nextPage = model.getObjectByName('brushnext');

    this.objects.hueCursor = model.getObjectByName('huecursor');
    this.objects.hueWheel = model.getObjectByName('hue');
    this.objects.hueWheel.geometry.computeBoundingSphere();
    this.colorWheelSize = this.objects.hueWheel.geometry.boundingSphere.radius;

    this.objects.sizeCursor = model.getObjectByName('size');
    this.objects.sizeCursor.position.copy(this.cursorOffset);
    this.objects.colorHistory = [];
    for (var i = 0; i < 7; i++) {
      this.objects.colorHistory[i] = model.getObjectByName('colorhistory' + i);
    }
    this.objects.currentColor = model.getObjectByName('currentcolor');
    this.objects.sizeSlider = model.getObjectByName('sizebg');
    this.objects.sizeSlider.geometry.computeBoundingBox();
    // Hide bounding box
    model.getObjectByName('bb').material = new THREE.MeshBasicMaterial(
      { color: 0x248f24, alphaTest: 0, visible: false });
    // Hide objects
    var self = this;

    this.messagesMaterial = new THREE.MeshBasicMaterial({ map: null, transparent: true, opacity: 0.0 });
    this.objects.messageSave = model.getObjectByName('msg_save');
    this.objects.messageSave.material = this.messagesMaterial;
    this.objects.messageSave.visible = false;
    this.objects.messageError = model.getObjectByName('msg_error');
    this.objects.messageError.visible = false;
    this.objects.messageError.material = this.messagesMaterial;

    var messagesImageUrl = 'assets/images/messages.png';

    this.el.sceneEl.systems.material.loadTexture(messagesImageUrl, {src: messagesImageUrl}, function (texture) {
      var material = self.messagesMaterial;
      material.map = texture;
      material.needsUpdate = true;
    });

    function showMessage (msgObject) {
      msgObject.visible = true;
      var object = { opacity: 0.0 };
      var tween = new AFRAME.TWEEN.Tween(object)
        .to({opacity: 1.0}, 500)
        .onUpdate(function () {
          self.messagesMaterial.opacity = object.opacity;
        })
        .chain(
          new AFRAME.TWEEN.Tween(object)
            .to({opacity: 0.0}, 500)
            .delay(3000)
            .onComplete(function () {
              msgObject.visible = false;
            })
            .onUpdate(function () {
              self.messagesMaterial.opacity = object.opacity;
            })
          );

      tween.start();
    }

    this.el.sceneEl.addEventListener('drawing-upload-completed', function (event) {
      showMessage(self.objects.messageSave);
    });
    this.el.sceneEl.addEventListener('drawing-upload-error', function (event) {
      showMessage(self.objects.messageError);
    });

    this.initColorWheel();
    this.initColorHistory();
    this.initBrushesMenu();
    this.setCursorTransparency();
    this.updateColorUI(this.el.getAttribute('brush').color);
    this.updateSizeSlider(this.el.getAttribute('brush').size);
  },

  initBrushesMenu: function () {
    var previousPage = this.objects.previousPage;
    var nextPage = this.objects.nextPage;
    var brushes = Object.keys(AFRAME.BRUSHES);
    this.initHighlightMaterial(nextPage);
    this.initHighlightMaterial(previousPage);
    previousPage.visible = false;
    nextPage.visible = false;
    this.brushesPerPage = 15;
    this.brushesPagesNum = Math.ceil(brushes.length / this.brushesPerPage);
    this.brushesPage = 0;
    this.loadBrushes(this.brushesPage, this.brushesPerPage);
  },

  setCursorTransparency: function () {
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

  loadBrushes: (function () {
    var brushesMaterials = {};
    return function (page, pageSize) {
      var brush;
      var brushNum = 0;
      var uiEl = this.uiEl.getObject3D('mesh');
      var brushes = Object.keys(AFRAME.BRUSHES);
      var thumbnail;
      var brushIndex;
      var self = this;
      var i;
      if (page < 0 || page >= this.brushesPagesNum) { return; }
      if (page === 0) {
        this.objects.previousPage.visible = false;
      } else {
        this.objects.previousPage.visible = true;
      }
      if (page === this.brushesPagesNum - 1) {
        this.objects.nextPage.visible = false;
      } else {
        this.objects.nextPage.visible = true;
      }
      for (i = 0; i < pageSize; i++) {
        brushIndex = page * pageSize + i;
        brush = brushes[brushIndex];
        thumbnail = brush && AFRAME.BRUSHES[brush].prototype.options.thumbnail;
        loadBrush(brush, brushNum, thumbnail);
        brushNum += 1;
      }
      function loadBrush (name, id, thumbnailUrl) {
        var brushName = !name ? undefined : (name.charAt(0).toUpperCase() + name.slice(1)).toLowerCase();
        if (thumbnailUrl && !brushesMaterials[brushName]) {
          self.el.sceneEl.systems.material.loadTexture(thumbnailUrl, {src: thumbnailUrl}, onLoadThumbnail);
          return;
        }
        onLoadThumbnail();
        function onLoadThumbnail (texture) {
          var button = uiEl.getObjectByName('brush' + id);
          self.brushButtonsMapping['brush' + id] = brushName;
          setBrushThumbnail(texture, button);
        }
      }
      function setBrushThumbnail (texture, button) {
        var brushName = self.brushButtonsMapping[button.name];
        var material = brushesMaterials[brushName] || new THREE.MeshBasicMaterial();
        if (texture) {
          material.map = texture;
          material.alphaTest = 0.5;
          material.transparent = true;
        } else if (!brushesMaterials[brushName]) {
          material.visible = false;
        }
        brushesMaterials[brushName] = material;
        self.highlightMaterials[button.name] = {
          normal: material,
          hover: material,
          pressed: material,
          selected: material
        };
        button.material = material;
      }
    };
  })(),

  nextPage: function () {
    if (this.brushesPage >= this.brushesPagesNum - 1) { return; }
    this.brushesPage++;
    this.loadBrushes(this.brushesPage, this.brushesPerPage);
  },

  previousPage: function () {
    if (this.brushesPage === 0) { return; }
    this.brushesPage--;
    this.loadBrushes(this.brushesPage, this.brushesPerPage);
  },

  initHighlightMaterial: function (object) {
    var buttonName = object.name;
    var isBrushButton = this.brushRegexp.test(buttonName);
    var isHistory = buttonName.indexOf('history') !== -1;
    var isHue = buttonName === 'hue' || buttonName === 'huecursor';
    var materials = {
      normal: object.material,
      hover: object.material,
      pressed: object.material,
      selected: object.material
    };
    if (!isBrushButton && !isHistory && !isHue) {
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

  open: function () {
    var uiEl = this.uiEl;
    var coords = { x: 0, y: 0, z: 0 };
    var tween;
    if (!this.closed) { return; }
    this.uiEl.setAttribute('visible', true);
    tween = new AFRAME.TWEEN.Tween(coords)
        .to({ x: 1, y: 1, z: 1 }, 100)
        .onUpdate(function () {
          uiEl.setAttribute('scale', this);
        })
        .easing(AFRAME.TWEEN.Easing.Exponential.Out);
    tween.start();
    this.el.setAttribute('brush', 'enabled', false);
    this.rayEl.setAttribute('visible', false);
    this.closed = false;
  },

  updateIntersections: (function () {
    var raycaster = this.raycaster = new THREE.Raycaster();
    return function (evt) {
      this.updateRaycaster(raycaster);
      this.intersectedObjects = raycaster.intersectObjects(this.menuEls, true);
    };
  })(),

  onIntersection: function (evt) {
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

  onComponentChanged: function (evt) {
    if (evt.detail.name === 'brush') { this.syncUI(); }
  },

  syncUI: function () {
    var brush;
    if (!this.handEl || !this.objects) { return; }
    brush = this.handEl.getAttribute('brush');
    this.updateSizeSlider(brush.size);
    this.updateColorUI(brush.color);
    this.updateColorHistory();
    // this.updateBrushSelector(brush.brush);
  },

  initColorHistory: function () {
    var colorHistoryObject;
    var currentColor = this.objects.currentColor;
    for (var i = 0; i < this.objects.colorHistory.length; i++) {
      colorHistoryObject = this.objects.colorHistory[i];
      colorHistoryObject.material = colorHistoryObject.material.clone();
      colorHistoryObject.material.map = this.system.selectedTexture;
    }
    currentColor.material = currentColor.material.clone();
    currentColor.material.map = this.system.selectedTexture;
    this.updateColorHistory();
  },

  updateColorHistory: function () {
    var color = this.handEl && this.handEl.getAttribute('brush').color;
    var colorStack = this.colorStack;
    if (!color) { color = this.el.components.brush.schema.color.default; }
    this.objects.currentColor.material.color.set(color);
    for (var i = 0; i < colorStack.length; i++) {
      color = colorStack[colorStack.length - i - 1];
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

  updateColorUI: function (color) {
    var colorRGB = new THREE.Color(color);
    var hsv = this.hsv = this.rgb2hsv(colorRGB.r, colorRGB.g, colorRGB.b);
    // Update color wheel
    var angle = hsv.h * 2 * Math.PI;
    var radius = hsv.s * this.colorWheelSize;
    var x = radius * Math.cos(angle);
    var y = radius * Math.sin(angle);
    this.objects.hueCursor.position.setX(x);
    this.objects.hueCursor.position.setZ(-y);

    // Update color brightness
    this.objects.hueWheel.material.uniforms['brightness'].value = this.hsv.v;
    this.objects.brightnessCursor.rotation.y = this.hsv.v * 1.5 - 1.5;
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
    color = this.handEl.getAttribute('brush').color;
    this.colorHasChanged = false;
    if (colorStack.length === 7) { colorStack.shift(); }
    colorStack.push(color);
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
      direction.applyAxisAngle(new THREE.Vector3(1, 0, 0), -(this.rayAngle / 360) * 2 * Math.PI);
      direction.applyQuaternion(directionHelper);
      raycaster.far = this.rayDistance;
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
        .onComplete(function () {
          uiEl.setAttribute('visible', false);
        })
        .easing(AFRAME.TWEEN.Easing.Exponential.Out);
    tween.start();
    this.el.setAttribute('brush', 'enabled', true);
    this.closed = true;
  }
});
