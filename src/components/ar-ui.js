AFRAME.registerComponent('ar-ui', {
  init: function () {
    document.querySelector('a-scene').addEventListener('realityChanged', this.realityChanged.bind(this));
  },
  realityChanged: function (data) {
    if (data.detail === 'ar') {
      this.start();
    }
  },
  start: function () {
    var self = this;

    this.depth = -0.1;

    // var logo = document.querySelector('#logo');
    // logo.setAttribute('visible', false);

    this.modalOpened = null;

    this.colorStack = ['#272727', '#727272', '#FFFFFF', '#24CAFF', '#249F90', '#F2E646', '#EF2D5E'];
    this.brushRegexp = /^(?!.*(fg|bg)$)brush[0-9]+/;
    this.colorHistoryRegexp = /^(?!.*(fg|bg)$)colorhistory[0-9]+$/;
    this.hsv = { h: 0.0, s: 0.0, v: 1.0 };
    this.brushButtonsMapping = {};
    this.colorHasChanged = true;
    this.pressedObjects = {};
    this.selectedObjects = {};

    this.pressure = 1;
    this.tapped = false;
    this.strokeNormalized = 0.5;
    this.scaleFactor = 1;

    this.renderOrderUI = 10000;
    this.renderOrderModal = 10001;

    this.atlasData = '{"total": {"w": 2048, "h": 2048 }, "images": {"apainterBtn": { "x": 0, "y": 1536, "w": 512, "h": 512 },"trackingLost": { "x": 1536, "y": 1536, "w": 512, "h": 512 },"brushBtn": { "x": 0, "y": 1024, "w": 512, "h": 512 },"closeBtn": { "x": 1536, "y": 1280, "w": 256, "h": 256 },"trackingDevice": { "x": 1280, "y": 1280, "w": 256, "h": 256 },"undoBtn": { "x": 1536, "y": 1024, "w": 256, "h": 256 },"saveBtn": { "x": 1280, "y": 1024, "w": 256, "h": 256 },"strokeDragBar": { "x": 0, "y": 896, "w": 1024, "h": 128 },"strokeDragDot": { "x": 0, "y": 640, "w": 256, "h": 256 },"saved": { "x": 1792, "y": 640, "w": 256, "h": 256 },"moveAroundDevice": { "x": 0, "y": 0, "w": 512, "h": 512 },"moveAround": { "x": 1024, "y": 1792, "w": 1024, "h": 256 },"dragTapPin": { "x": 1024, "y": 1536, "w": 1024, "h": 256 },"saving": { "x": 1024, "y": 1024, "w": 512, "h": 512 }}}';
    this.atlas = JSON.parse(this.atlasData);

    this.objects = {};

    this.setPressure();
    this.bindMethods();
    this.initRaycaster();
    this.addContainers();
    this.setLayoutSettings();
    this.addEvents();
    this.addUIElements();
    this.initUI();
    // Hack to wait until created entities are init
    setTimeout(function () {
      self.onWindowResize();
    }, 500);
  },
  tick: function (t, dt) {

  },
  setPressure: function () {
    var self = this;
    Pressure.set(this.el.sceneEl, {
      change: function (force, event) {
        if (event.touches && event.touches[0].touchType === 'stylus') {
          self.pressure = force;
          self.onBrushChanged();
        }
      }
    },
    {only: 'touch'});
  },
  bindMethods: function () {
    this.onWindowResize = this.onWindowResize.bind(this);
    this.tap = this.tap.bind(this);
    this.tapend = this.tapend.bind(this);
    this.onmove = this.onmove.bind(this);

    this.onPoseLost = this.onPoseLost.bind(this);
    this.onPoseFound = this.onPoseFound.bind(this);
    this.onModelLoaded = this.onModelLoaded.bind(this);
    this.onComponentChanged = this.onComponentChanged.bind(this);
    this.onStrokeStarted = this.onStrokeStarted.bind(this);

    this.enterPainterMode = this.enterPainterMode.bind(this);
    this.exitPainterMode = this.exitPainterMode.bind(this);

    this.undo = this.undo.bind(this);
    this.save = this.save.bind(this);

    this.brushBtnClicked = this.brushBtnClicked.bind(this);
    this.dragStroke = this.dragStroke.bind(this);

    this.updateFrame = this.updateFrame.bind(this);

    this.onPinDetected = this.onPinDetected.bind(this);
    this.onPinSelected = this.onPinSelected.bind(this);
  },
  initRaycaster: function () {
    this.raycaster = new THREE.Raycaster();
    // normalized device coordinates position
    this.normalizedCoordinatedPositionPointer = new THREE.Vector2();
    this.intersection = null;
    this.objOver;
  },
  updateFrame: function (frame) {

  },
  addContainers: function (){
    document.querySelector('a-scene').addEventListener('updateFrame', this.updateFrame);

    // Create a-entity container for all the UI
    this.containerUI = document.createElement('a-entity');
    this.containerUI.setAttribute('id', 'ui-container');
    this.el.appendChild(this.containerUI);

    this.drawingContainer = document.querySelector('#drawing-container');
    this.frustumSize = 1;
    this.aspect = window.innerWidth / window.innerHeight;
    this.orthoCamera = new THREE.OrthographicCamera(this.frustumSize * this.aspect / -2, this.frustumSize * this.aspect / 2, this.frustumSize / 2, this.frustumSize / -2, 0.05, 0.2);
    document.querySelector('#acamera').object3D.add(this.orthoCamera);

    var self = this;
    // Override doRender method
    this.el.sceneEl.renderer.xr.doRender = function () {
      var arui = self.el.sceneEl.camera.el.components['ar-ui'];
      self.drawingContainer.setAttribute('visible', true);
      self.containerUI.setAttribute('visible', false);
      self.el.sceneEl.renderer.render(self.el.sceneEl.object3D, self.el.sceneEl.camera);

      self.drawingContainer.setAttribute('visible', false);
      self.containerUI.setAttribute('visible', true);
      self.el.sceneEl.renderer.render(self.el.sceneEl.object3D, arui.orthoCamera);
    };
  },
  setLayoutSettings: function () {
    this.paddingTop = this.paddingBottom = this.paddingRight = this.paddingLeft = this.depth / 20;
  },
  addEvents: function () {
    window.addEventListener('resize', this.onWindowResize);
    if (this.el.sceneEl.isMobile) {
      window.addEventListener('touchstart', this.tap);
      window.addEventListener('touchmove', this.onmove);
      window.addEventListener('touchend', this.tapend);
    } else {
      window.addEventListener('mousedown', this.tap);
      window.addEventListener('mousemove', this.onmove);
      window.addEventListener('mouseup', this.tapend);
    }
    this.el.addEventListener('model-loaded', this.onModelLoaded);
    this.el.addEventListener('componentchanged', this.onComponentChanged);
    document.querySelector('[ar-paint-controls]').addEventListener('brush-started', this.onStrokeStarted);
    document.querySelector('[ar-pin]').addEventListener('pinselected', this.onPinSelected);
    document.querySelector('[ar-pin]').addEventListener('pindetected', this.onPinDetected);

    var self = this;
    this.el.sceneEl.addEventListener('drawing-upload-completed', function (event) {
      self.saved(event.detail.url);
    });
    this.el.sceneEl.addEventListener('drawing-upload-error', function (event) {
      console.log('Error uploading', self.objects.messageError);
      this.closeModal('saving');
    });
  },
  addUIElements: function () {
    this.addSounds();
    this.addInitEl();
    this.addPaintingEl();
    this.addCommonEl();
    this.addSettingsEl();
    this.addSavingEl();
    this.addTrackingLostEl();
  },
  addSounds: function () {
    // Add sounds
    var soundEl = document.createElement('a-sound');
    var iOSSuffix = '';
    if (AFRAME.utils.device.isIOS()) {
      iOSSuffix = '_iOS';
    }
    soundEl.setAttribute('src', '#ui_click0' + iOSSuffix);
    soundEl.setAttribute('id', 'uiClick0');
    this.containerUI.appendChild(soundEl);

    soundEl = document.createElement('a-sound');
    soundEl.setAttribute('src', '#ui_click1' + iOSSuffix);
    soundEl.setAttribute('id', 'uiClick1');
    this.containerUI.appendChild(soundEl);

    soundEl = document.createElement('a-sound');
    soundEl.setAttribute('src', '#ui_menu' + iOSSuffix);
    soundEl.setAttribute('id', 'uiMenu');
    this.containerUI.appendChild(soundEl);

    soundEl = document.createElement('a-sound');
    soundEl.setAttribute('src', '#ui_undo' + iOSSuffix);
    soundEl.setAttribute('id', 'uiUndo');
    this.containerUI.appendChild(soundEl);
  },
  addInitEl: function () {
    // Add 'init' section elements
    this.addImage({
      id: 'moveAround',
      layout: 'bottom-center',
      visible: true,
      width: 0.06,
      height: 0.015,
      padding: [0, 0, -0.015, 0]
    });
    this.addImage({
      id: 'moveAroundDevice',
      layout: 'center',
      visible: true,
      width: 0.02,
      height: 0.02,
      padding: [0, 0, 0, 0],
      renderOrder: this.renderOrderModal
    });
    this.addImage({
      id: 'dragTapPin',
      layout: 'bottom-center',
      visible: false,
      width: 0.06,
      height: 0.015,
      padding: [0, 0, -0.015, 0]
    });
  },
  addPaintingEl: function () {
    // Add 'painting' section elements
    this.addButton({
      id: 'closeBtn',
      layout: 'top-left',
      visible: false,
      enabled: false,
      width: 0.01,
      height: 0.01,
      padding: [0.005, 0.0025, 0, 0],
      onclick: this.exitPainterMode
    });
    this.addButton({
      id: 'undoBtn',
      layout: 'bottom-right',
      visible: false,
      enabled: false,
      width: 0.0075,
      height: 0.0075,
      padding: [0, 0.0015, 0.0175, 0],
      onclick: this.undo
    });
    this.addButton({
      id: 'saveBtn',
      layout: 'top-right',
      visible: false,
      enabled: false,
      width: 0.01,
      height: 0.01,
      padding: [0.005, 0, 0, 0.0025],
      onclick: this.save
    });
  },
  addCommonEl: function () {
     // Add fader for settings modal
    this.addFader({
      id: 'fader-brushSettings',
      visible: false,
      enabled: false
    });
    this.addButton({
      id: 'brushBtn',
      layout: 'bottom-center',
      visible: false,
      enabled: false,
      width: 0.015,
      height: 0.015,
      padding: [0, 0, 0.0125, 0],
      onclick: this.brushBtnClicked
    });
    this.addImage({
      id: 'strokeDragBar',
      layout: 'bottom-center',
      visible: false,
      width: 0.03,
      height: 0.00375,
      padding: [0, 0, -0.01, 0],
      renderOrder: this.renderOrderModal
    });
    this.addButton({
      id: 'strokeDragDot',
      layout: 'stroke-drag',
      visible: false,
      width: 0.01,
      height: 0.01,
      padding: [0, 0.05, 0],
      renderOrder: this.renderOrderModal
    });
    this.addStrokeOnButton();
  },
  addStrokeOnButton: function () {
    var uiEl = document.createElement('a-entity');
    this.strokeOnButton = uiEl;

    uiEl.setAttribute('geometry', {
      primitive: 'circle',
      radius: 0.002
    });
    uiEl.setAttribute('position', '0 0 0.00001');
    uiEl.setAttribute('material', {
      shader: 'flat',
      transparent: true,
      color: 'red'
    });

    var ringEl = document.createElement('a-entity');
    ringEl.setAttribute('geometry', {
      primitive: 'circle',
      radius: 0.00225
    });
    ringEl.setAttribute('material', {
      shader: 'flat',
      transparent: true,
      color: 0xcccccc
    });
    uiEl.appendChild(ringEl);

    this.objects.strokeDragDot.appendChild(uiEl);
  },
  addSettingsEl: function () {
    // Add 'settings' section elements
    this.addButton({
      id: 'closeSettingsBtn',
      atlasId: 'closeBtn',
      layout: 'top-right',
      visible: false,
      enabled: false,
      width: 0.01,
      height: 0.01,
      padding: [0.005, 0, 0, 0.0025],
      onclick: this.closeBrushSettings.bind(this),
      renderOrder: this.renderOrderModal
    });
    this.addSettingsUI();
  },
  // Init settings UI code
  addSettingsUI: function () {
    this.settingsUI = document.createElement('a-entity');
    this.settingsUI.setAttribute('obj-model', 'obj:#aruiobj');
    this.settingsUI.setAttribute('material', {
      color: '#ffffff',
      flatShading: true,
      shader: 'flat',
      transparent: true,
      fog: false,
      src: '#uinormal'
    });
    this.settingsUI.setAttribute('position', '0 -0.06 -0.098');
    
    this.settingsUI.setAttribute('scale', '3 3 3');
    this.settingsUI.setAttribute('visible', false);
    // uiEl.classList.add('apainter-ui');
    this.containerUI.appendChild(this.settingsUI);
  },
  onModelLoaded: function (evt) {
    var uiEl = this.settingsUI;
    var model = uiEl.getObject3D('mesh');
    model = evt.detail.model;
    if (evt.detail.format !== 'obj' || !model.getObjectByName('brightnesscursor')) { return; }
    this.objectsSettings = {};
    this.objectsSettings.brightnessCursor = model.getObjectByName('brightnesscursor');
    this.objectsSettings.brightnessSlider = model.getObjectByName('brightness');
    this.objectsSettings.brightnessSlider.geometry.computeBoundingBox();
    this.objectsSettings.previousPage = model.getObjectByName('brushprev');
    this.objectsSettings.nextPage = model.getObjectByName('brushnext');

    this.objectsSettings.hueCursor = model.getObjectByName('huecursor');
    this.objectsSettings.hueWheel = model.getObjectByName('hue');
    this.objectsSettings.hueWheel.geometry.computeBoundingSphere();
    this.colorWheelSize = this.objectsSettings.hueWheel.geometry.boundingSphere.radius;

    this.objectsSettings.colorHistory = [];
    for (var i = 0; i < 7; i++) {
      this.objectsSettings.colorHistory[i] = model.getObjectByName('colorhistory' + i);
    }
    this.objectsSettings.currentColor = model.getObjectByName('currentcolor');

    // if (this.el.components.brush.active) { return; }
    this.el.setAttribute('brush', 'enabled', false);
    this.updateBrushButton();
    this.setStrokeBar(this.el.getAttribute('brush').size);
    this.strokeOnButton.setAttribute('material', 'color', this.el.getAttribute('brush').color);

    this.initColorWheel();
    this.initColorHistory();
    this.initBrushesMenu();
    this.setCursorTransparency();
    this.updateColorUI(this.el.getAttribute('brush').color);
    this.adjustRenderOrder();
  },
  adjustRenderOrder: function () {
    var self = this;
    this.el.object3D.traverse(function (obj) {
      if (obj.renderOrder) {
        if (obj.children.length) {
          obj.children[0].renderOrder = obj.renderOrder;
          obj.children[0].onBeforeRender = function () {
            self.el.sceneEl.renderer.clearDepth();
          };
        }
      }
    });
  },
  onPinDetected: function () {
    if (this.tweenMoveAround1) {
      this.stopMoveAround();
    }
    this.hideEl(this, 'moveAroundDevice', false);
    this.hideEl(this, 'moveAround', false, 500);
    this.showEl(this, 'dragTapPin', false, 1000);
  },
  onPinSelected: function () {
    this.hideEl(this, 'dragTapPin', false);
    var self = this;
    setTimeout(() => {
      self.enterPainterMode();
    }, 1000);
  },
  initColorWheel: function () {
    var colorWheel = this.objectsSettings.hueWheel;
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
      fragmentShader: fragmentShader,
      transparent: true
    });
    colorWheel.material = material;
  },
  initColorHistory: function () {
    var colorHistoryObject;
    var currentColor = this.objectsSettings.currentColor;
    for (var i = 0; i < this.objectsSettings.colorHistory.length; i++) {
      colorHistoryObject = this.objectsSettings.colorHistory[i];
      colorHistoryObject.material = colorHistoryObject.material.clone();
      colorHistoryObject.material.map = null;
    }
    currentColor.material = currentColor.material.clone();
    currentColor.material.map = null;
    this.updateColorHistory();
  },
  updateColorHistory: function () {
    var color = this.el.getAttribute('brush').color;
    var colorStack = this.colorStack;
    if (!color) { color = this.el.components.brush.schema.color.default; }
    this.objectsSettings.currentColor.material.color.set(color);
    for (var i = 0; i < colorStack.length; i++) {
      color = colorStack[colorStack.length - i - 1];
      this.objectsSettings.colorHistory[i].material.color.set(color);
    }
  },
  initBrushesMenu: function () {
    var previousPage = this.objectsSettings.previousPage;
    var nextPage = this.objectsSettings.nextPage;
    var brushes = Object.keys(AFRAME.BRUSHES);
    // this.initHighlightMaterial(nextPage);
    // this.initHighlightMaterial(previousPage);
    previousPage.visible = false;
    nextPage.visible = false;
    this.brushesPerPage = 15;
    this.brushesPagesNum = Math.ceil(brushes.length / this.brushesPerPage);
    this.brushesPage = 0;
    this.loadBrushes(this.brushesPage, this.brushesPerPage);
  },
  loadBrushes: (function () {
    var brushesMaterials = {};
    return function (page, pageSize) {
      var brush;
      var brushNum = 0;
      var uiEl = this.settingsUI.getObject3D('mesh');
      var brushes = Object.keys(AFRAME.BRUSHES);
      var thumbnail;
      var brushIndex;
      var self = this;
      var i;
      if (page < 0 || page >= this.brushesPagesNum) { return; }
      if (page === 0) {
        this.objectsSettings.previousPage.visible = false;
      } else {
        this.objectsSettings.previousPage.visible = true;
      }
      if (page === this.brushesPagesNum - 1) {
        this.objectsSettings.nextPage.visible = false;
      } else {
        this.objectsSettings.nextPage.visible = true;
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
        // self.highlightMaterials[button.name] = {
        //   normal: material,
        //   hover: material,
        //   pressed: material,
        //   selected: material
        // };
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
  setCursorTransparency: function () {
    var hueCursor = this.objectsSettings.hueCursor;
    var brightnessCursor = this.objectsSettings.brightnessCursor;
    hueCursor.material.alphaTest = 0.5;
    brightnessCursor.material.alphaTest = 0.5;
    hueCursor.material.transparent = true;
    brightnessCursor.material.transparent = true;
  },
  updateColorUI: function (color) {
    var colorRGB = new THREE.Color(color);
    var hsv = this.hsv = this.rgb2hsv(colorRGB.r, colorRGB.g, colorRGB.b);
    // Update color wheel
    var angle = hsv.h * 2 * Math.PI;
    var radius = hsv.s * this.colorWheelSize;
    var x = radius * Math.cos(angle);
    var y = radius * Math.sin(angle);
    this.objectsSettings.hueCursor.position.setX(x);
    this.objectsSettings.hueCursor.position.setY(y);

    // Update color brightness
    this.objectsSettings.hueWheel.material.uniforms['brightness'].value = this.hsv.v;
    this.objectsSettings.brightnessCursor.rotation.z = this.hsv.v * 1.5 - 1.5;
  },
  onclickSettingsUI: function (object, uvs) {
    var name = object.name;
    if (this.modalOpened !== 'brushSettings') {
      return;
    }
    switch (name) {
      case 'brightness':
        this.onBrightnessDown(uvs);
        break;
      case 'brushnext':
        if (!this.pressedObjects[name]) {
          this.nextPage();
        }
        break;
      case 'brushprev':
        if (!this.pressedObjects[name]) {
          this.previousPage();
        }
        break;
      case 'hue':
        this.onHueDown(uvs);
        break;
    }
    if (this.brushRegexp.test(name)) {
      this.onBrushDown(name);
    } else if (this.colorHistoryRegexp.test(name)) {
      this.onColorHistoryButtonDown(object);
    }
    this.pressedObjects[name] = object;
  },
  onBrightnessDown: function (uvs) {
    // 0.93 max (white) / 0.58 min (black)
    var brightness = THREE.Math.mapLinear(uvs.y, 0.58, 0.93, 0.0, 1.0);
    // // remove object border padding
    brightness = THREE.Math.clamp(brightness * 1.29 - 0.12, 0.0, 1.0);
    this.objectsSettings.hueWheel.material.uniforms['brightness'].value = brightness;
    this.objectsSettings.brightnessCursor.rotation.z = brightness * 1.5 - 1.5;
    this.hsv.v = brightness;
    this.updateColor();
  },
  onHueDown: function (uvs) {
    var polarPosition;
    var radius = this.colorWheelSize;
    var position = new THREE.Vector3();
    position.x = (uvs.x - 0.5) * 0.1;
    position.y = (uvs.y - 0.5) * 0.1;
    position.z = this.objectsSettings.hueCursor.position.z;
    this.objectsSettings.hueCursor.position.copy(position);

    polarPosition = {
      r: Math.sqrt(position.x * position.x + position.y * position.y),
      theta: Math.PI + Math.atan2(position.y, position.x)
    };
    var angle = ((polarPosition.theta * (180 / Math.PI)) + 180) % 360;
    this.hsv.h = angle / 360;
    this.hsv.s = polarPosition.r / radius;
    this.updateColor();
  },
  updateColor: function () {
    var rgb = this.hsv2rgb(this.hsv);
    var color = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    this.el.setAttribute('brush', 'color', color);
    this.onBrushChanged();
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
  onBrushDown: function (name) {
    var brushName = this.brushButtonsMapping[name];
    if (!brushName) { return; }
    this.selectBrushButton(name);
    this.el.setAttribute('brush', 'brush', brushName.toLowerCase());
    this.onBrushChanged();
  },
  selectBrushButton: function (brushName) {
    var object = this.settingsUI.getObject3D('mesh').getObjectByName(brushName + 'bg');
    var selectedObjects = this.selectedObjects;
    var selectedBrush = this.selectedBrush;
    if (selectedBrush) {
      // if (!this.highlightMaterials[selectedBrush.name]) {
      //   this.initHighlightMaterial(object);
      // }
      // selectedBrush.material = this.highlightMaterials[selectedBrush.name].normal;
      delete selectedObjects[selectedBrush.name];
    }
    selectedObjects[object.name] = object;
    this.selectedBrush = object;
  },
  onColorHistoryButtonDown: function (object) {
    var color = object.material.color.getHexString();
    this.el.setAttribute('brush', 'color', '#' + color);
    this.onBrushChanged();
  },
  onBrushChanged: function () {
    this.updateBrushButton();
    this.el.emit('onBrushChanged', {brush: this.el.getAttribute('brush'), pressure: this.pressure});
    this.strokeOnButton.setAttribute('material', 'color', this.el.getAttribute('brush').color);
  },
  updateBrushButton: function () {
    var buttonObj = this.objects.brushBtn.getObject3D('mesh');
    if (this.el.getAttribute('brush').brush !== buttonObj.brush) {
      var urlBrushThumbnail = AFRAME.BRUSHES[this.el.getAttribute('brush').brush].prototype.options.thumbnail;
      var alphaTexture = new THREE.TextureLoader().load(urlBrushThumbnail);
      buttonObj.brush = this.el.getAttribute('brush').brush;
      buttonObj.material.map = alphaTexture;
    }
    buttonObj.material.color = new THREE.Color(this.el.getAttribute('brush').color);
  },
  onComponentChanged: function (evt) {
    if (evt.detail.name === 'brush') { this.syncUI(); }
  },
  onStrokeStarted: function () {
    var color;
    var colorStack = this.colorStack;
    if (!this.colorHasChanged) { return; }
    color = this.el.getAttribute('brush').color;
    this.colorHasChanged = false;
    if (colorStack.length === 7) { colorStack.shift(); }
    colorStack.push(color);
    this.syncUI();
  },
  syncUI: function () {
    var brush;
    if (!this.objectsSettings) { return; }
    brush = this.el.getAttribute('brush');
    // this.updateSizeSlider(brush.size);
    this.updateColorUI(brush.color);
    this.updateColorHistory();
  },
  // End settings UI code
  addSavingEl: function () {
    // Add fader for settings modal
    this.addFader({
      id: 'fader-saving',
      visible: false,
      enabled: false
    });
    this.addImage({
      id: 'saving',
      layout: 'center',
      visible: false,
      width: 0.05,
      height: 0.05,
      padding: [0, 0, 0, 0],
      renderOrder: this.renderOrderModal
    });
    this.addImage({
      id: 'saved',
      layout: 'center',
      visible: false,
      width: 0.025,
      height: 0.025,
      padding: [0, 0, 0, 0],
      renderOrder: this.renderOrderModal
    });
  },
  addTrackingLostEl: function (){
    // Add fader for trackingLost modal
    this.addFader({
      id: 'fader-trackingLost',
      visible: false,
      enabled: false
    });
    // Add 'tracking lost' modal elements
    this.addImage({
      id: 'trackingLost',
      layout: 'center',
      visible: false,
      width: 0.04,
      height: 0.04,
      padding: [0, 0, 0, 0],
      renderOrder: this.renderOrderModal
    });
    this.addImage({
      id: 'trackingDevice',
      layout: 'center',
      visible: false,
      width: 0.02,
      height: 0.02,
      padding: [0, 0, 0.01, 0],
      renderOrder: this.renderOrderModal
    });
  },
  initUI: function () {
    var self = this;
    var uiEl = self.objects.moveAround;
    uiEl.setAttribute('material', {opacity: 0});
    this.tweenMoveAround = new AFRAME.TWEEN.Tween({value: 0})
    .to({ value: 0.7 }, 500)
    .delay(1000)
    .onUpdate(function () {
      uiEl.setAttribute('material', {opacity: this.value});
    })
    .easing(AFRAME.TWEEN.Easing.Cubic.In)
    .start();

    var uiEl2 = self.objects.moveAroundDevice;
    uiEl2.setAttribute('material', {opacity: 0});
    this.tweenMoveAroundDevice = new AFRAME.TWEEN.Tween({value: 0})
    .to({ value: 1 }, 500)
    .delay(1500)
    .onUpdate(function () {
      uiEl2.setAttribute('material', {opacity: this.value});
    })
    .onComplete(function () {
      self.moveAroundEl(self, 'moveAroundDevice');
    })
    .easing(AFRAME.TWEEN.Easing.Cubic.In)
    .start();
  },
  addButton: function (params) {
    this.objects[params.id] = document.createElement('a-entity');
    var uiEl = this.objects[params.id];

    // top, right, bottom, left
    uiEl.padding = params.padding || [0, 0, 0, 0];
    uiEl.id = params.id;
    uiEl.atlasId = params.atlasId || params.id;
    uiEl.class = 'ar-ui';
    uiEl.layout = params.layout;
    uiEl.onclick = params.onclick;

    uiEl.setAttribute('geometry', {
      primitive: 'plane',
      width: params.width,
      height: params.height
    });
    uiEl.setAttribute('material', {
      shader: 'flat',
      transparent: true,
      fog: false,
      src: '#ar_ui',
      repeat: {x: this.atlas.images[uiEl.atlasId].w / this.atlas.total.w, y: this.atlas.images[uiEl.atlasId].h / this.atlas.total.h},
      offset: {x: this.atlas.total.w - this.atlas.images[uiEl.atlasId].x / this.atlas.total.w, y: this.atlas.images[uiEl.atlasId].y / this.atlas.total.h}
    });
    uiEl.setAttribute('position', {
      x: 0,
      y: 0,
      z: 10000
    });
    uiEl.setAttribute('visible', params.visible);
    uiEl.setAttribute('enabled', params.enabled);
    uiEl.object3D.renderOrder = params.renderOrder || this.renderOrderUI;

    this.containerUI.appendChild(uiEl);
  },
  addFader: function (params) {
    this.objects[params.id] = document.createElement('a-entity');
    var uiEl = this.objects[params.id];
    uiEl.addEventListener('model-loaded', this.onModelLoaded);

    uiEl.padding = params.padding || [0, 0, 0, 0];
    uiEl.id = params.id;
    uiEl.class = 'ar-ui';
    uiEl.layout = 'fader';

    uiEl.setAttribute('geometry', {
      primitive: 'plane',
      width: 0.17,
      height: 0.17
    });

    uiEl.setAttribute('ar-ui-modal-material', {
      steps: {x: 0, y: 0.33, z: 0.66, w: 1},
      opacity: 0.9
    });

    uiEl.setAttribute('position', {
      x: 0,
      y: 0,
      z: 10000
    });
    uiEl.setAttribute('visible', params.visible);
    uiEl.setAttribute('enabled', params.enabled);
    uiEl.object3D.renderOrder = params.renderOrder || this.renderOrderUI;

    this.containerUI.appendChild(uiEl);
  },
  addImage: function (params) {
    this.objects[params.id] = document.createElement('a-entity');
    var uiEl = this.objects[params.id];

    // top, right, bottom, left
    uiEl.padding = params.padding || [0, 0, 0, 0];
    uiEl.id = params.id;
    uiEl.atlasId = params.atlasId || params.id;
    uiEl.class = 'ar-ui';
    uiEl.layout = params.layout;
    uiEl.onclick = params.onclick;

    uiEl.setAttribute('geometry', {
      primitive: 'plane',
      width: params.width,
      height: params.height
    });
    uiEl.setAttribute('material', {
      shader: 'flat',
      transparent: true,
      fog: false,
      src: '#ar_ui',
      repeat: {x: this.atlas.images[uiEl.atlasId].w / this.atlas.total.w, y: this.atlas.images[uiEl.atlasId].h / this.atlas.total.h},
      offset: {x: this.atlas.total.w - this.atlas.images[uiEl.atlasId].x / this.atlas.total.w, y: this.atlas.images[uiEl.atlasId].y / this.atlas.total.h}
    });
    uiEl.setAttribute('position', {
      x: 0,
      y: 0,
      z: 10000
    });
    uiEl.setAttribute('visible', params.visible);
    uiEl.object3D.renderOrder = params.renderOrder || this.renderOrderUI;

    this.containerUI.appendChild(uiEl);
  },
  animateEl: function (self, id) {
    var uiEntity = self.objects[ id ];
    if (!uiEntity) {
      return;
    }
    self.tweenSaving = new AFRAME.TWEEN.Tween(uiEntity.object3D.rotation).to({
      z: -Math.PI * 2
    }, 1000)
      .onComplete(function () {
        uiEntity.object3D.rotation.z = 0;
      })
      .repeat(Infinity)
      .start();
  },
  moveAroundEl: function (self, id) {
    var uiEntity = self.objects[ id ];
    if (!uiEntity) {
      return;
    }
    var originalScale = uiEntity.object3D.scale.x;

    self.tweenMoveAround1 = new AFRAME.TWEEN.Tween({
      valueScale: originalScale,
      valuePosY: 0
    })
    .to({
      valueScale: originalScale * 1.5,
      valuePosY: -0.1
    }, 600)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function () {
      uiEntity.object3D.scale.x = this.valueScale;
      uiEntity.object3D.scale.y = this.valueScale;
      uiEntity.object3D.position.y = this.valuePosY;
    })
    .onComplete(function () {
      this.valueScale = originalScale;
      this.valuePosY = 0;
    });

    self.tweenMoveAround2 = new AFRAME.TWEEN.Tween({
      valueScale: originalScale * 1.5,
      valuePosX: 0,
      valuePosY: -0.1
    })
    .to({
      valueScale: originalScale,
      valuePosX: -0.25,
      valuePosY: 0
    }, 1200)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(function () {
      uiEntity.object3D.scale.x = this.valueScale;
      uiEntity.object3D.scale.y = this.valueScale;
      uiEntity.object3D.position.x = this.valuePosX;
      uiEntity.object3D.position.y = this.valuePosY;
    })
    .onComplete(function () {
      this.valueScale = originalScale * 1.5;
      this.valuePosX = 0;
      this.valuePosY = -0.1;
    });

    self.tweenMoveAround3 = new AFRAME.TWEEN.Tween({
      valuePosX: -0.25
    })
    .to({
      valuePosX: 0.25
    }, 1800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(function () {
      uiEntity.object3D.position.x = this.valuePosX;
    })
    .onComplete(function () {
      this.valuePosX = -0.25;
    });

    self.tweenMoveAround4 = new AFRAME.TWEEN.Tween({
      valueScale: originalScale,
      valuePosX: 0.25,
      valuePosY: 0
    })
    .to({
      valueScale: originalScale * 0.5,
      valuePosX: 0,
      valuePosY: 0.1
    }, 1200)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(function () {
      uiEntity.object3D.scale.x = this.valueScale;
      uiEntity.object3D.scale.y = this.valueScale;
      uiEntity.object3D.position.x = this.valuePosX;
      uiEntity.object3D.position.y = this.valuePosY;
    })
    .onComplete(function () {
      this.valueScale = originalScale;
      this.valuePosX = 0.25;
      this.valuePosY = 0;
    });

    self.tweenMoveAround5 = new AFRAME.TWEEN.Tween({
      valueScale: originalScale * 0.5,
      valuePosY: 0.1
    })
    .to({
      valueScale: originalScale,
      valuePosY: 0
    }, 600)
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(function () {
      uiEntity.object3D.scale.x = this.valueScale;
      uiEntity.object3D.scale.y = this.valueScale;
      uiEntity.object3D.position.y = this.valuePosY;
    })
    .onComplete(function () {
      this.valueScale = originalScale * 0.5;
      this.valuePosY = 0.1;
    });

    self.tweenMoveAround1.chain(self.tweenMoveAround2);
    self.tweenMoveAround2.chain(self.tweenMoveAround3);
    self.tweenMoveAround3.chain(self.tweenMoveAround4);
    self.tweenMoveAround4.chain(self.tweenMoveAround5);
    self.tweenMoveAround5.chain(self.tweenMoveAround1);
    self.tweenMoveAround1.start();
  },
  stopMoveAround: function () {
    this.tweenMoveAround1.stop();
    this.tweenMoveAround2.stop();
    this.tweenMoveAround3.stop();
    this.tweenMoveAround4.stop();
    this.tweenMoveAround5.stop();
  },
  showEl: function (self, id, enable, delay) {
    var uiEntity = self.objects[ id ];
    if (!uiEntity) {
      return;
    }
    uiEntity.setAttribute('visible', true);
    if (enable) {
      uiEntity.setAttribute('enabled', true);
    }
    // Hack to have time to create boundingBox to make the place and get scaleFactor
    setTimeout(function () {
      self.place(uiEntity);
      uiEntity.object3D.scale.set(0.01, 0.01, 0.01);
      new AFRAME.TWEEN.Tween(uiEntity.object3D.scale).to({
        x: self.scaleFactor,
        y: self.scaleFactor,
        z: self.scaleFactor
      }, 500)
        .delay(delay || 0)
        .easing(AFRAME.TWEEN.Easing.Back.Out)
        .start();
    }, 500);
  },
  hideEl: function (self, id, enable, delay){
    var uiEntity = self.objects[ id ];
    if (!uiEntity) {
      return;
    }
    if (enable) {
      uiEntity.setAttribute('enabled', false);
    }
    new AFRAME.TWEEN.Tween(uiEntity.object3D.scale).to({
      x: 0.01,
      y: 0.01,
      z: 0.01
    }, 500)
      .delay(delay || 0)
      .easing(AFRAME.TWEEN.Easing.Back.In)
      .onComplete(function () {
        uiEntity.setAttribute('visible', false);
      })
      .start();
  },
  onmove: function (e) {
    var el = this.el;
    this.size = el.sceneEl.renderer.getSize();
    var t = e;
    if (e.touches) {
      t = e.touches[0];
    }
    this.normalizedCoordinatedPositionPointer.x = (t.clientX / this.size.width) * 2 - 1;
    this.normalizedCoordinatedPositionPointer.y = -(t.clientY / this.size.height) * 2 + 1;

    this.raycaster.setFromCamera(this.normalizedCoordinatedPositionPointer, this.orthoCamera);
    var intersections = this.raycaster.intersectObjects(this.getIntersectedObjects());
    this.intersection = (intersections.length) > 0 ? intersections[ 0 ] : null;

    if (this.tapped && this.lastObjectOverId === 'strokeDragDot') {
      this.dragStroke();
      return;
    }
    var overId = null;
    if (t === e) {
      // mousemove
      if (this.intersection !== null){
        el.sceneEl.canvas.style.cursor = 'pointer';
        overId = this.intersection.object.el.id;
        this.lastObjectOverId = overId;
        if (overId === '') {
          overId = this.intersection.object.name;
          return;
        }
        // Only for 2D Screens
        if (this.objOver) {
          if (this.objOver.el.id !== overId) {
            this.onout(this.objOver);
            this.onover(this.intersection.object);
            this.objOver = this.intersection.object;
          }
        } else {
          this.onover(this.intersection.object);
          this.objOver = this.intersection.object;
        }
      } else {
        el.sceneEl.canvas.style.cursor = null;
        // Only for 2D Screens
        if (this.objOver) {
          this.onout(this.objOver);
          this.objOver = null;
        }
      }
    } else {
      // touchmove
      if (this.intersection !== null) {
        if (this.intersection.object.el.id === '') {
          this.onclickSettingsUI(this.intersection.object, this.intersection.uv);
        }else{
          overId = this.intersection.object.el.id;
          this.lastObjectOverId = overId;
        }
      }
    }
  },
  getIntersectedObjects: function () {
    var self = this;
    var intersectObjects = [];
    Object.keys(this.objects).forEach(function (key) {
      if (self.objects[key].getAttribute('enabled') === 'true') {
        for (var i = 0; i < self.objects[key].object3D.children.length; i++) {
          if (self.objects[key].object3D.children[i].geometry) {
            intersectObjects.push(self.objects[key].object3D.children[i]);
          }
        }
      }
    });
    if (this.modalOpened === 'brushSettings' && this.settingsUI.getAttribute('visible')) {
      for (var i = 0; i < this.settingsUI.object3D.children[0].children.length; i++) {
        // Don't push brightnesscursor / hucursor
        if (this.settingsUI.object3D.children[0].children[i].name.indexOf('cursor') === -1) {
          intersectObjects.push(this.settingsUI.object3D.children[0].children[i]);
        }
      }
    }
    return intersectObjects;
  },
  tap: function (e) {
    var el = this.el;
    this.size = el.sceneEl.renderer.getSize();
    var t = e;
    if (e.touches) {
      t = e.touches[0];
    }
    this.tapped = true;
    this.normalizedCoordinatedPositionPointer.x = (t.clientX / this.size.width) * 2 - 1;
    this.normalizedCoordinatedPositionPointer.y = -(t.clientY / this.size.height) * 2 + 1;

    this.raycaster.setFromCamera(this.normalizedCoordinatedPositionPointer, this.orthoCamera);
    var intersections = this.raycaster.intersectObjects(this.getIntersectedObjects());
    this.intersection = (intersections.length) > 0 ? intersections[ 0 ] : null;
    if(this.modalOpened !== null){
      this.el.emit('objectsUIIntersected', {intersections: 1});
    }else{
      this.el.emit('objectsUIIntersected', {intersections: intersections.length});
    }
    if (this.intersection !== null) {
      if (this.intersection.object.el.id === '') {
        this.onclickSettingsUI(this.intersection.object, this.intersection.uv);
      } else {
        // Provisional > testing tap events
        if(this.intersection.object.el.id !== 'strokeDragDot'){
          this.onout(this.intersection.object);
        }
        this.onclick(this.intersection.object.el.id);
      }
    }
    this.lastObjectOverId = null;
  },
  tapend: function (e) {
    this.tapped = false;
    this.lastObjectOverId = null;
    this.pressedObjects = {};
  },
  onover: function (obj) {
    if (obj.el.getAttribute('enabled') === 'false') {
      return;
    }
    var coords = { x: this.scaleFactor, y: 1 * this.scaleFactor, z: 1 * this.scaleFactor };
    var tween = new AFRAME.TWEEN.Tween(coords)
    .to({ x: 1.1 * this.scaleFactor, y: 1.1 * this.scaleFactor, z: 1.1 * this.scaleFactor }, 150)
    .onUpdate(function () {
      obj.el.setAttribute('scale', this);
    })
    .easing(AFRAME.TWEEN.Easing.Quadratic.In);
    tween.start();
  },
  onout: function (obj) {
    if (obj.el.getAttribute('enabled') === 'false') {
      return;
    }
    var coords = { x: 1.1 * this.scaleFactor, y: 1.1 * this.scaleFactor, z: 1.1 * this.scaleFactor };
    var tween = new AFRAME.TWEEN.Tween(coords)
    .to({ x: this.scaleFactor, y: this.scaleFactor, z: this.scaleFactor }, 150)
    .onUpdate(function () {
      obj.el.setAttribute('scale', this);
    })
    .easing(AFRAME.TWEEN.Easing.Quadratic.Out);
    tween.start();
  },
  onclick: function (id) {
    if (this.objects[id] && this.objects[id].onclick) {
      this.objects[id].onclick(this);
    }
  },
  onWindowResize: function (e) {
    var el = this.el;
    this.size = el.sceneEl.canvas.getBoundingClientRect();
    this.width = window.innerWidth / window.innerHeight;
    this.height = 1;

    var self = this;
    Object.keys(this.objects).forEach(function (key) {
      if (self.objects[key].getAttribute('visible')) {
        self.place(self.objects[key], self.width, self.height);
      }
    });

    this.aspect = window.innerWidth / window.innerHeight;
    this.orthoCamera.left = -this.frustumSize * this.aspect / 2;
    this.orthoCamera.right = this.frustumSize * this.aspect / 2;
    this.orthoCamera.top = this.frustumSize / 2;
    this.orthoCamera.bottom = -this.frustumSize / 2;
    this.orthoCamera.updateProjectionMatrix();
  },
  place: function (obj) {
    var w = this.width;
    var h = this.height;
    this.scaleFactor = Math.max(1, (1.2 / Math.abs(this.depth)) / 2);
    obj.object3D.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
    var positionTmp = {x: 0, y: 0, z: this.depth};
    for (var i = 0; i < obj.object3D.children.length; i++) {
      if (obj.object3D.children[i].geometry) {
        if (!obj.object3D.children[i].geometry.boundingBox) {
          obj.object3D.children[i].geometry.computeBoundingBox();
          obj.object3D.children[i].geometry.width = obj.object3D.children[i].geometry.boundingBox.max.x - obj.object3D.children[i].geometry.boundingBox.min.x;
          obj.object3D.children[i].geometry.height = obj.object3D.children[i].geometry.boundingBox.max.y - obj.object3D.children[i].geometry.boundingBox.min.y;
        }
        switch (obj.layout) {
          case 'bottom-center':
          case 'stroke-drag':
            positionTmp.y = -(h / 2) + obj.object3D.children[i].geometry.width / 2 * this.scaleFactor - this.paddingBottom * this.scaleFactor + obj.padding[2] * this.scaleFactor;
            break;
          case 'top-center':
            positionTmp.y = h / 2 - obj.object3D.children[i].geometry.height / 2 * this.scaleFactor + this.paddingTop * this.scaleFactor - obj.padding[0] * this.scaleFactor;
            break;
          case 'top-right':
            positionTmp.x = w / 2 - obj.object3D.children[i].geometry.width / 2 * this.scaleFactor + this.paddingRight * this.scaleFactor - obj.padding[1] * this.scaleFactor;
            positionTmp.y = h / 2 - obj.object3D.children[i].geometry.height / 2 * this.scaleFactor + this.paddingTop * this.scaleFactor - obj.padding[0] * this.scaleFactor;
            break;
          case 'top-left':
            positionTmp.x = -(w / 2) + obj.object3D.children[i].geometry.width / 2 * this.scaleFactor - this.paddingRight * this.scaleFactor + obj.padding[1] * this.scaleFactor;
            positionTmp.y = h / 2 - obj.object3D.children[i].geometry.height / 2 * this.scaleFactor + this.paddingTop * this.scaleFactor - obj.padding[0] * this.scaleFactor;
            break;
          case 'bottom-left':
            positionTmp.x = -(w / 2) + obj.object3D.children[i].geometry.width / 2 * this.scaleFactor - this.paddingRight * this.scaleFactor + obj.padding[1] * this.scaleFactor;
            positionTmp.y = -(h / 2) + obj.object3D.children[i].geometry.height / 2 * this.scaleFactor - this.paddingBottom * this.scaleFactor + obj.padding[2] * this.scaleFactor;
            break;
          case 'bottom-right':
            positionTmp.x = w / 2 - obj.object3D.children[i].geometry.width / 2 * this.scaleFactor + this.paddingRight * this.scaleFactor - obj.padding[1] * this.scaleFactor;
            positionTmp.y = -(h / 2) + obj.object3D.children[i].geometry.height / 2 * this.scaleFactor - this.paddingBottom * this.scaleFactor + obj.padding[2] * this.scaleFactor;
            break;
          case 'fader':
            positionTmp = {x: 0, y: 0, z: this.depth};
            var faderScaleFactor = this.scaleFactor * this.width / this.height;
            obj.object3D.scale.set(faderScaleFactor, this.scaleFactor, this.scaleFactor);
            break;
          case 'center':
            positionTmp.x = obj.padding[3] * this.scaleFactor - obj.padding[1] * this.scaleFactor;
            positionTmp.y = obj.padding[2] * this.scaleFactor - obj.padding[0] * this.scaleFactor;
            break;
          default:
            positionTmp = {x: 0, y: 0, z: 10000};
            break;
        }
        if (obj.layout === 'stroke-drag') {
          positionTmp.x += this.objects.strokeDragBar.object3D.children[0].geometry.width * this.scaleFactor * this.strokeNormalized - this.objects.strokeDragBar.object3D.children[0].geometry.width / 2 * this.scaleFactor;
        }
      }
    }
    // positionTmp = {x: 0, y: 0, z: this.depth};
    obj.setAttribute('position', positionTmp);
  },
  enterPainterMode: function () {
    var self = this;

    document.querySelector('a-scene').addEventListener('poseLost', this.onPoseLost);
    document.querySelector('a-scene').addEventListener('poseFound', this.onPoseFound);
    // Show and activate close button
    this.showEl(this, 'closeBtn', true, 500);
    this.showEl(this, 'undoBtn', true, 600);
    this.showEl(this, 'saveBtn', true, 700);
    this.showEl(this, 'strokeDragBar', false, 800);
    this.showEl(this, 'strokeDragDot', true, 850);
    this.showEl(this, 'brushBtn', true, 900);
    this.playSound('#uiClick0');
    setTimeout(() => {
      self.el.emit('activate', false);
    }, 1100);
  },
  exitPainterMode: function () {
    // var self = this;
    // document.querySelector('a-scene').removeEventListener('poseLost', this.onPoseLost);
    // document.querySelector('a-scene').removeEventListener('poseFound', this.onPoseFound);
    // this.el.emit('deactivate', false);
    // // Hide close buttons
    // this.hideEl(this, 'closeBtn', true);
    // this.hideEl(this, 'strokeDragDot', false, 25);
    // this.hideEl(this, 'strokeDragBar', true, 50);
    // this.hideEl(this, 'brushBtn', true, 100);
    // this.hideEl(this, 'undoBtn', true, 200);
    // this.hideEl(this, 'saveBtn', true, 300);
    // this.playSound('#uiClick1'); 
    window.location.href = '/#';
  },
  playSound: function (id){
    var el = document.querySelector(id);
    if (!el) { return; }
    el.components.sound.stopSound();
    el.components.sound.playSound();
  },
  openModal: function (id, callback) {
    var self = this;
    this.modalOpened = id;
    var uiEl = document.querySelector('#fader-' + id);
    // this.orthoCamera.setAttribute('look-controls', {enabled: false});
    // var uiEl = this.objects.fader;
    uiEl.setAttribute('visible', true);

    uiEl.setAttribute('ar-ui-modal-material', {
      steps: {x: 0, y: 0, z: 0, w: 0},
      opacity: 0
    });
    
    new AFRAME.TWEEN.Tween({value: 0})
    .to({ value: 0.9 }, 500)
    .onUpdate(function () {
      uiEl.setAttribute('ar-ui-modal-material', {opacity: this.value});
    })
    .start();

    var steps = {x: 0, y: 0.1, z: 0.2, w: 0.3};
    new AFRAME.TWEEN.Tween(steps)
    .to({x: 0, y: 0.33, z: 0.66, w: 1}, 500)
    .onUpdate(function () {
      uiEl.setAttribute('ar-ui-modal-material', {steps: this});
    })
    .onComplete(function () {
      self.objects.brushBtn.setAttribute('enabled', true);
    })
    .start();

    switch (id) {
      case 'saving':
        this.objects.closeBtn.setAttribute('enabled', false);
        this.objects.saveBtn.setAttribute('enabled', false);
        this.objects.undoBtn.setAttribute('enabled', false);
        this.objects.brushBtn.setAttribute('enabled', false);
        this.showEl(this, 'saving', false, 100);
        this.animateEl(this, 'saving');
        break;
      case 'trackingLost':
        this.objects.closeBtn.setAttribute('enabled', false);
        this.objects.saveBtn.setAttribute('enabled', false);
        this.objects.undoBtn.setAttribute('enabled', false);
        this.objects.brushBtn.setAttribute('enabled', false);
        this.showEl(this, 'trackingLost', false, 100);
        this.showEl(this, 'trackingDevice', false, 300);
        break;
      case 'brushSettings':
        this.objects.closeBtn.setAttribute('enabled', false);
        this.objects.saveBtn.setAttribute('enabled', false);
        this.objects.undoBtn.setAttribute('enabled', false);
        this.objects.brushBtn.setAttribute('enabled', false);
        this.showEl(this, 'closeSettingsBtn', true, 100);
        this.settingsUI.setAttribute('visible', true);
        break;
    }

    this.place(uiEl);
  },
  closeModal: function (id, callback) {
    var self = this;
    var uiEl = document.querySelector('#fader-' + id);

    // this.orthoCamera.setAttribute('look-controls', {enabled: true});
    switch (id) {
      case 'saving':
        this.objects.closeBtn.setAttribute('enabled', true);
        this.objects.saveBtn.setAttribute('enabled', true);
        this.objects.undoBtn.setAttribute('enabled', true);
        this.objects.brushBtn.setAttribute('enabled', false);
        self.hideEl(self, 'saving', false);
        this.tweenSaving.stop();
        break;
      case 'trackingLost':
        this.objects.closeBtn.setAttribute('enabled', true);
        this.objects.saveBtn.setAttribute('enabled', true);
        this.objects.undoBtn.setAttribute('enabled', true);
        this.objects.brushBtn.setAttribute('enabled', false);
        self.hideEl(self, 'trackingDevice', false);
        self.hideEl(self, 'trackingLost', false, 100);
        break;
      case 'brushSettings':
        this.objects.closeBtn.setAttribute('enabled', true);
        this.objects.saveBtn.setAttribute('enabled', true);
        this.objects.undoBtn.setAttribute('enabled', true);
        this.objects.brushBtn.setAttribute('enabled', false);
        this.hideEl(this, 'closeSettingsBtn', true);
        this.settingsUI.setAttribute('visible', false);
        break;
    }
    
    new AFRAME.TWEEN.Tween({value: 0.9})
    .to({ value: 0 }, 500)
    .delay(500)
    .onUpdate(function () {
      uiEl.setAttribute('ar-ui-modal-material', {opacity: this.value});
    })
    .start();

    var steps = {x: 0, y: 0.33, z: 0.66, w: 1};
    new AFRAME.TWEEN.Tween(steps)
    .to({x: 0, y: 0.1, z: 0.2, w: 0.3}, 500)
    .onUpdate(function () {
      uiEl.setAttribute('ar-ui-modal-material', {steps: this});
    })
    .delay(500)
    .onComplete(function () {
      self.modalOpened = null;
      uiEl.setAttribute('visible', false);
      self.objects.brushBtn.setAttribute('enabled', true);
    })
    .start();
  },
  undo: function () {
    // console.log('undo', this);
    // this.el.sceneEl.systems.brush.clear();
    this.el.sceneEl.systems.brush.undo();
    this.playSound('#uiUndo');
  },
  save: function () {
    var self = this;
    self.el.sceneEl.systems.painter.upload();
    self.openModal('saving', self.saved);
  },
  saved: function (url) {
    this.tweenSaving.stop();
    this.showEl(this, 'saved', false, 10);
    setTimeout(function () {
      window.location.href = '/?url=' + url + '#save-painting';
    }, 1000);
  },
  dragStroke: function () {
    var pointerAbsPosition = (this.width - this.width / 2) * this.normalizedCoordinatedPositionPointer.x;
    var pointerOverBarPosition = pointerAbsPosition - this.objects.strokeDragBar.object3D.position.x;
    var pointerOverBarAbsMapLinear = THREE.Math.mapLinear(pointerOverBarPosition, -this.objects.strokeDragBar.object3D.children[0].geometry.width / 2 * this.scaleFactor, this.objects.strokeDragBar.object3D.children[0].geometry.width / 2 * this.scaleFactor, 0, 1);
    var pointerOverBarAbsPosition = THREE.Math.clamp(pointerOverBarAbsMapLinear, 0, 1);
    this.strokeNormalized = pointerOverBarAbsPosition;
    this.placeStrokeDragDot();
  },
  placeStrokeDragDot: function () {
    this.place(this.objects.strokeDragDot);
    var scale = THREE.Math.mapLinear(this.strokeNormalized, 0, 1, 0.2, 1.5);
    this.strokeOnButton.setAttribute('scale', new THREE.Vector3(scale, scale, scale));

    var sizeData = this.el.components.brush.schema.size;
    var stroke = sizeData.default;
    if (this.strokeNormalized > 0.5) {
      stroke = THREE.Math.mapLinear(this.strokeNormalized, 0.5, 1, sizeData.default, sizeData.max);
    } else {
      stroke = THREE.Math.mapLinear(this.strokeNormalized, 0.5, 0, sizeData.default, sizeData.min);
    }
    this.el.setAttribute('brush', 'size', stroke);
    this.onBrushChanged();
  },
  setStrokeBar: function (size) {
    var sizeData = this.el.components.brush.schema.size;
    if (size > sizeData.default) {
      this.strokeNormalized = THREE.Math.mapLinear(size, sizeData.default, sizeData.max, 0.5, 1);
    } else {
      this.strokeNormalized = THREE.Math.mapLinear(size, sizeData.default, sizeData.min, 0.5, 0);
    }
    var scale = THREE.Math.mapLinear(this.strokeNormalized, 0, 1, 0.2, 1.5);
    this.strokeOnButton.setAttribute('scale', new THREE.Vector3(scale, scale, scale));
  },
  onPoseLost: function () {
    if (this.modalOpened === null){
      this.openModal('trackingLost');
    }
  },
  onPoseFound: function () {
    if (this.modalOpened !== null){
      this.closeModal('trackingLost');
    }
  },
  openBrushSettings: function () {
    document.querySelector('a-scene').removeEventListener('poseLost', this.onPoseLost);
    document.querySelector('a-scene').removeEventListener('poseFound', this.onPoseFound);
    if (this.modalOpened === null){
      this.openModal('brushSettings');
      this.playSound('#uiClick0');
    }
  },
  closeBrushSettings: function () {
    document.querySelector('a-scene').addEventListener('poseLost', this.onPoseLost);
    document.querySelector('a-scene').addEventListener('poseFound', this.onPoseFound);
    if (this.modalOpened !== null){
      this.closeModal('brushSettings');
      this.playSound('#uiClick1');
    }
  },
  brushBtnClicked: function () {
    if (!this.modalOpened){
      this.openBrushSettings();
    } else {
      this.closeBrushSettings();
    }
  }
});
