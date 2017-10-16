AFRAME.registerComponent('ar-ui', {
  dependencies: ['raycaster'],
  init: function () {
    var self = this;
    this.camera = document.querySelector('[camera]');

    var logo = document.querySelector('#logo');
    logo.setAttribute('visible', false);

    this.renderOrderUI = 10000;
    this.renderOrderModal = 10001;

    this.atlasData = '{"total": {"w": 1024, "h": 2048 }, "images": {"apainterBtn": { "x": 0, "y": 1536, "w": 512, "h": 512 },"trackingLost": { "x": 512, "y": 1536, "w": 512, "h": 512 },"brushBtn": { "x": 0, "y": 1024, "w": 512, "h": 512 },"closeBtn": { "x": 512, "y": 1280, "w": 256, "h": 256 },"trackingDevice": { "x": 256, "y": 1280, "w": 256, "h": 256 },"undoBtn": { "x": 512, "y": 1024, "w": 256, "h": 256 },"saveBtn": { "x": 256, "y": 1024, "w": 256, "h": 256 },"strokeDragBar": { "x": 0, "y": 896, "w": 1024, "h": 128 },"strokeDragDot": { "x": 0, "y": 640, "w": 256, "h": 256 }}}';
    this.atlas = JSON.parse(this.atlasData);

    this.objects = {};

    self.initRaycaster();
    self.setLayoutSettings();
    self.addEvents();
    self.addUIElements();
    self.initUI();
    // Hack to wait until created entities are init
    setTimeout(function () {
      self.onWindowResize();
    }, 500);
  },
  tick: function (t, dt) {

  },
  initRaycaster: function () {
    this.raycaster = this.el.components.raycaster.raycaster;
    this.pointer = new THREE.Vector2();
    // normalized device coordinates position
    this.pointerNdc = new THREE.Vector2();
    this.intersection = null;
    this.objOver;
  },
  setLayoutSettings: function () {
    this.depth = -0.1;
    this.paddingTop = this.paddingBottom = this.paddingRight = this.paddingLeft = this.depth / 20;
  },
  addEvents: function () {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    if (this.el.sceneEl.isMobile) {
      window.addEventListener('touchstart', this.tap.bind(this));
    } else {
      window.addEventListener('mousemove', this.mousemove.bind(this));
      window.addEventListener('mousedown', this.tap.bind(this));
    }
    this.onPoseLostFnc = this.onPoseLost.bind(this);
    this.onPoseFoundFnc = this.onPoseFound.bind(this);
  },
  addUIElements: function () {
    var soundEl = document.createElement('a-sound');
    var iOSSuffix = '';
    if (Utils.isiOS()) {
      iOSSuffix = '_iOS';
    }
    soundEl.setAttribute('src', '#ui_click0' + iOSSuffix);
    soundEl.setAttribute('id', 'uiClick0');
    this.el.appendChild(soundEl);

    soundEl = document.createElement('a-sound');
    soundEl.setAttribute('src', '#ui_click1' + iOSSuffix);
    soundEl.setAttribute('id', 'uiClick1');
    this.el.appendChild(soundEl);

    soundEl = document.createElement('a-sound');
    soundEl.setAttribute('src', '#ui_menu' + iOSSuffix);
    soundEl.setAttribute('id', 'uiMenu');
    this.el.appendChild(soundEl);

    soundEl = document.createElement('a-sound');
    soundEl.setAttribute('src', '#ui_undo' + iOSSuffix);
    soundEl.setAttribute('id', 'uiUndo');
    this.el.appendChild(soundEl);

    this.addButton({
      id: 'apainterBtn',
      layout: 'bottom-center',
      visible: true,
      enabled: false,
      width: 0.02,
      height: 0.02,
      onclick: this.enterPainterMode.bind(this)
    });
    this.addButton({
      id: 'closeBtn',
      layout: 'top-right',
      visible: false,
      enabled: false,
      width: 0.0075,
      height: 0.0075,
      onclick: this.exitPainterMode.bind(this)
    });
    this.addButton({
      id: 'undoBtn',
      layout: 'bottom-left',
      visible: false,
      enabled: false,
      width: 0.0075,
      height: 0.0075,
      padding: [0, 0, 0.005, 0],
      onclick: this.undo.bind(this)
    });
    this.addButton({
      id: 'saveBtn',
      layout: 'bottom-left',
      visible: false,
      enabled: false,
      width: 0.0075,
      height: 0.0075,
      padding: [0, 0, 0.0175, 0],
      onclick: this.save.bind(this)
    });
    // Add modals elements
    this.addFader({
      id: 'fader',
      visible: false,
      enabled: false
    });
    this.addImage({
      id: 'trackingLost',
      layout: 'centre',
      visible: false,
      width: 0.04,
      height: 0.04,
      padding: [0, 0, 0, 0],
      renderOrder: this.renderOrderModal
    });
    this.addImage({
      id: 'trackingDevice',
      layout: 'centre',
      visible: false,
      width: 0.02,
      height: 0.02,
      padding: [0, 0, 0.01, 0],
      renderOrder: this.renderOrderModal
    });
  },
  initUI: function () {
    var self = this;
    var uiEl = self.objects.apainterBtn;
    uiEl.setAttribute('material', {opacity: 0});
    new AFRAME.TWEEN.Tween({value: 0})
    .to({ value: 1 }, 500)
    .delay(1000)
    .onUpdate(function () {
      uiEl.setAttribute('material', {opacity: this.value});
    })
    .onComplete(function () {
      uiEl.setAttribute('enabled', true);
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
    uiEl.class = 'ar-ui';
    uiEl.layout = params.layout;
    uiEl.onclick = params.onclick;

    uiEl.setAttribute('scaleFactor', 1);

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
      repeat: {x: this.atlas.images[uiEl.id].w / this.atlas.total.w, y: this.atlas.images[uiEl.id].h / this.atlas.total.h},
      offset: {x: this.atlas.total.w - this.atlas.images[uiEl.id].x / this.atlas.total.w, y: this.atlas.images[uiEl.id].y / this.atlas.total.h}
    });
    uiEl.setAttribute('position', {
      x: 0,
      y: 0,
      z: 10000
    });
    uiEl.setAttribute('visible', params.visible);
    uiEl.setAttribute('enabled', params.enabled);

    uiEl.object3D.renderOrder = this.renderOrderUI;
    uiEl.object3D.onBeforeRender = function () { this.el.sceneEl.renderer.clearDepth(); };

    this.el.appendChild(uiEl);
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

    uiEl.object3D.renderOrder = this.renderOrderModal;
    uiEl.object3D.onBeforeRender = function () { this.el.sceneEl.renderer.clearDepth(); };

    this.el.appendChild(uiEl);
  },
  addImage: function (params) {
    this.objects[params.id] = document.createElement('a-entity');
    var uiEl = this.objects[params.id];

    // top, right, bottom, left
    uiEl.padding = params.padding || [0, 0, 0, 0];
    uiEl.id = params.id;
    uiEl.class = 'ar-ui';
    uiEl.layout = params.layout;
    uiEl.onclick = params.onclick;

    uiEl.setAttribute('scaleFactor', 1);

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
      repeat: {x: this.atlas.images[uiEl.id].w / this.atlas.total.w, y: this.atlas.images[uiEl.id].h / this.atlas.total.h},
      offset: {x: this.atlas.total.w - this.atlas.images[uiEl.id].x / this.atlas.total.w, y: this.atlas.images[uiEl.id].y / this.atlas.total.h}
    });
    uiEl.setAttribute('position', {
      x: 0,
      y: 0,
      z: 10000
    });
    uiEl.setAttribute('visible', params.visible);
    uiEl.setAttribute('enabled', params.enabled);

    uiEl.object3D.renderOrder = params.renderOrder || this.renderOrderUI;
    uiEl.object3D.onBeforeRender = function () { this.el.sceneEl.renderer.clearDepth(); };

    this.el.appendChild(uiEl);
  },
  showEl: function (self, id, enable, delay) {
    var uiEntity = self.objects[ id ];
    uiEntity.setAttribute('visible', true);
    if (enable){
      uiEntity.setAttribute('enabled', true);
    }
    // Hack to have time to create boundingBox to make the place and get scaleFactor
    setTimeout(function () {
      self.place(uiEntity, self.width, self.height);
      uiEntity.object3D.scale.set(0.01, 0.01, 0.01);
      new AFRAME.TWEEN.Tween(uiEntity.object3D.scale).to({
        x: 1 * uiEntity.getAttribute('scaleFactor'),
        y: 1 * uiEntity.getAttribute('scaleFactor'),
        z: 1 * uiEntity.getAttribute('scaleFactor')
      }, 500)
        .delay(delay || 0)
        .easing(AFRAME.TWEEN.Easing.Back.Out)
        .start();
    }, 500);
  },
  hideEl: function (self, id, enable, delay){
    var uiEntity = self.objects[ id ];
    if(enable){
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
  mousemove: function (e) {
    var el = this.el;
    this.size = el.sceneEl.renderer.getSize();
    this.pointer.set(e.clientX, e.clientY);
    this.pointerNdc.x = (e.clientX / this.size.width) * 2 - 1;
    this.pointerNdc.y = -(e.clientY / this.size.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointerNdc, el.sceneEl.camera);
    var intersections = this.raycaster.intersectObjects(this.getIntersectObjects());
    this.intersection = (intersections.length) > 0 ? intersections[ 0 ] : null;
    if (this.intersection !== null){
      el.sceneEl.canvas.style.cursor = 'pointer';
      // Only for 2D Screens
      if (this.objOver) {
        if (this.objOver.el.id !== this.intersection.object.el.id) {
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
  },
  getIntersectObjects: function () {
    var self = this;
    var intersectObjects = [];
    Object.keys(this.objects).forEach(function (key) {
      if (self.objects[key].getAttribute('enabled') === 'true') {
        intersectObjects.push(self.objects[key].object3D.children[0]);
      }
    });
    return intersectObjects;
  },
  tap: function (e) {
    var el = this.el;
    this.size = el.sceneEl.renderer.getSize();
    var t = e;
    if (e.touches) {
      t = e.touches[0];
    }
    this.pointer.set(t.clientX, t.clientY);
    this.pointerNdc.x = (t.clientX / this.size.width) * 2 - 1;
    this.pointerNdc.y = -(t.clientY / this.size.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointerNdc, el.sceneEl.camera);
    var intersections = this.raycaster.intersectObjects(this.getIntersectObjects());
    this.intersection = (intersections.length) > 0 ? intersections[ 0 ] : null;
    if (this.intersection !== null) {
      // Provisional > testing tap events
      this.onout(this.intersection.object);
      this.onclick(this.intersection.object.el.id);
    }
  },
  onover: function (obj) {
    if (obj.el.getAttribute('enabled') === 'false') {
      return;
    }
    var scaleFactor = obj.el.getAttribute('scaleFactor');
    var coords = { x: 1 * scaleFactor, y: 1 * scaleFactor, z: 1 * scaleFactor };
    var tween = new AFRAME.TWEEN.Tween(coords)
    .to({ x: 1.1 * scaleFactor, y: 1.1 * scaleFactor, z: 1.1 * scaleFactor }, 150)
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
    var scaleFactor = obj.el.getAttribute('scaleFactor');
    var coords = { x: 1.1 * scaleFactor, y: 1.1 * scaleFactor, z: 1.1 * scaleFactor };
    var tween = new AFRAME.TWEEN.Tween(coords)
    .to({ x: 1 * scaleFactor, y: 1 * scaleFactor, z: 1 * scaleFactor }, 150)
    .onUpdate(function () {
      obj.el.setAttribute('scale', this);
    })
    .easing(AFRAME.TWEEN.Easing.Quadratic.Out);
    tween.start();
  },
  onclick: function (id) {
    if (this.objects[id]) {
      this.objects[id].onclick(this);
    }
  },
  onWindowResize: function (e) {
    var el = this.el;
    this.size = el.sceneEl.canvas.getBoundingClientRect();
    this.width = this.visibleWidthAtZDepth(this.depth, el.sceneEl.camera);
    this.height = this.visibleHeightAtZDepth(this.depth, el.sceneEl.camera);
    var self = this;
    Object.keys(this.objects).forEach(function (key) {
      if (self.objects[key].getAttribute('visible')) {
        self.place(self.objects[key], self.width, self.height);
      }
    });
  },
  place: function (obj, w, h) {
    var scaleFactor = Math.max(1, (this.width / Math.abs(this.depth)) / 2);
    obj.object3D.scale.set(scaleFactor, scaleFactor, scaleFactor);
    obj.setAttribute('scaleFactor', scaleFactor);
    var positionTmp = {x: 0, y: 0, z: this.depth};
    switch (obj.layout) {
      case 'bottom-center':
        positionTmp.y = -(h / 2) + obj.object3D.children[0].geometry.boundingSphere.radius - this.paddingBottom * scaleFactor + obj.padding[2] * scaleFactor;
        break;
      case 'top-center':
        positionTmp.y = h / 2 - obj.object3D.children[0].geometry.boundingSphere.radius + this.paddingTop * scaleFactor - obj.padding[0] * scaleFactor;
        break;
      case 'top-right':
        positionTmp.x = w / 2 - obj.object3D.children[0].geometry.boundingSphere.radius + this.paddingRight * scaleFactor - obj.padding[1] * scaleFactor;
        positionTmp.y = h / 2 - obj.object3D.children[0].geometry.boundingSphere.radius + this.paddingTop * scaleFactor - obj.padding[0] * scaleFactor;
        break;
      case 'bottom-left':
        positionTmp.x = -(w / 2) + obj.object3D.children[0].geometry.boundingSphere.radius - this.paddingRight * scaleFactor + obj.padding[1] * scaleFactor;
        positionTmp.y = -(h / 2) + obj.object3D.children[0].geometry.boundingSphere.radius - this.paddingBottom * scaleFactor + obj.padding[2] * scaleFactor;
        break;
      case 'fader':
        positionTmp = {x: 0, y: 0, z: this.depth};
        var faderScaleFactor = scaleFactor * this.width / this.height;
        obj.object3D.scale.set(faderScaleFactor, scaleFactor, scaleFactor);
        break;
      case 'centre':
        positionTmp.x = obj.padding[3] * scaleFactor - obj.padding[1] * scaleFactor;
        positionTmp.y = obj.padding[2] * scaleFactor - obj.padding[0] * scaleFactor;
        break;
      default:
        positionTmp = {x: 0, y: 0, z: 10000};
        break;
    }
    obj.setAttribute('position', positionTmp);
  },
  // https://codepen.io/looeee/pen/RVgOgR
  visibleHeightAtZDepth: function (depth, camera) {
    // compensate for cameras not positioned at z=0
    var cameraOffset = camera.position.z;
    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    // vertical fov in radians
    var vFOV = camera.fov * Math.PI / 180;

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
  },
  visibleWidthAtZDepth: function (depth, camera) {
    var height = this.visibleHeightAtZDepth(depth, camera);
    return height * camera.aspect;
  },
  // end codepen based code
  enterPainterMode: function () {
    var self = this;
    document.querySelector('[ar]').addEventListener('poseLost', this.onPoseLostFnc);
    document.querySelector('[ar]').addEventListener('poseFound', this.onPoseFoundFnc);
    this.el.emit('activate', false);
    // Hide a-painter button
    this.objects.apainterBtn.object3D.originalPosition = this.objects.apainterBtn.object3D.position.clone();
    this.objects.apainterBtn.setAttribute('enabled', false);
    new AFRAME.TWEEN.Tween(this.objects.apainterBtn.object3D.position).to({
      y: -(this.height / 2) - this.objects.apainterBtn.object3D.children[0].geometry.boundingSphere.radius
    }, 500)
      .easing(AFRAME.TWEEN.Easing.Back.In)
      .onComplete(function () {
        self.objects.apainterBtn.setAttribute('visible', false);
      })
      .start();
    // Show and activate close button
    this.showEl(this, 'closeBtn', true, 500);
    this.showEl(this, 'undoBtn', true, 600);
    this.showEl(this, 'saveBtn', true, 700);
    this.playSound('#uiClick0');
  },
  exitPainterMode: function () {
    var self = this;
    document.querySelector('[ar]').removeEventListener('poseLost', this.onPoseLostFnc);
    document.querySelector('[ar]').removeEventListener('poseFound', this.onPoseFoundFnc);
    this.el.emit('deactivate', false);
    // Hide close buttons
    this.hideEl(this, 'closeBtn', true);
    this.hideEl(this, 'undoBtn', true, 200);
    this.hideEl(this, 'saveBtn', true, 300);
    // Show and activate a-painter button
    new AFRAME.TWEEN.Tween(this.objects.apainterBtn.object3D.position).to({
      x: this.objects.apainterBtn.object3D.originalPosition.x,
      y: this.objects.apainterBtn.object3D.originalPosition.y,
      z: this.objects.apainterBtn.object3D.originalPosition.z
    }, 500)
      .delay(500)
      .easing(AFRAME.TWEEN.Easing.Back.Out)
      .onStart(function () {
        self.objects.apainterBtn.setAttribute('visible', true);
      })
      .onComplete(function () {
        self.objects.apainterBtn.setAttribute('enabled', true);
      })
      .start();
    this.playSound('#uiClick1');
  },
  playSound: function (id){
    var el = document.querySelector(id);
    if (!el) { return; }
    el.components.sound.stopSound();
    el.components.sound.playSound();
  },
  openModal: function (id, callback) {
    this.isModalOpened = true;
    var self = this;
    var uiEl = document.querySelector('#fader');
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
    })
    .start();

    switch (id) {
      case 'saving':
        break;
      case 'trakingLost':
        this.objects.closeBtn.setAttribute('enabled', false);
        this.objects.saveBtn.setAttribute('enabled', false);
        this.objects.undoBtn.setAttribute('enabled', false);
        this.showEl(this, 'trackingLost', false, 100);
        this.showEl(this, 'trackingDevice', false, 300);
        break;
    }

    this.place(uiEl, this.width, this.height);
  },
  closeModal: function (id, callback) {
    var self = this;
    var uiEl = document.querySelector('#fader');

    self.hideEl(self, 'trackingDevice', false);
    self.hideEl(self, 'trackingLost', false, 100);
    this.objects.closeBtn.setAttribute('enabled', true);
    this.objects.saveBtn.setAttribute('enabled', true);
    this.objects.undoBtn.setAttribute('enabled', true);
    
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
      self.isModalOpened = false;
      uiEl.setAttribute('visible', false);
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
    // console.log('save', this);
    // this.el.sceneEl.systems.painter.upload();
    //this.openModal('saving', this.saved);
  },
  saved: function () {
    // console.log('saved', this);
  },
  dragStroke: function () {

  },
  onPoseLost: function () {
    if (!this.isModalOpened){
      this.openModal('trakingLost');
    }
  },
  onPoseFound: function () {
    if (this.isModalOpened){
      this.closeModal('trakingLost');
    }
  },
  openBrushSettings: function () {

  },
  closeBrushSettings: function () {

  }
});
