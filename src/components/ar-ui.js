AFRAME.registerComponent('ar-ui', {
  dependencies: ['raycaster'],
  init: function () {
    var self = this;
    this.camera = document.querySelector('[camera]');

    var logo = document.querySelector('#logo');
    logo.setAttribute('visible', false);

    this.atlasData = '{"total": {"w": 1024, "h": 2048 }, "images": {"apainterBtn": { "x": 0, "y": 1536, "w": 512, "h": 512 },"trackingLost": { "x": 512, "y": 1536, "w": 512, "h": 512 },"brushBtn": { "x": 0, "y": 1024, "w": 512, "h": 512 },"closeBtn": { "x": 512, "y": 1280, "w": 256, "h": 256 },"trackingDevice": { "x": 256, "y": 1280, "w": 256, "h": 256 },"undoBtn": { "x": 512, "y": 1024, "w": 256, "h": 256 },"saveBtn": { "x": 256, "y": 1024, "w": 256, "h": 256 },"strokeDragBar": { "x": 0, "y": 896, "w": 1024, "h": 128 },"strokeDragDot": { "x": 0, "y": 640, "w": 256, "h": 256 }}}';
    this.atlas = JSON.parse(this.atlasData);

    this.objects = {};

    this.initRaycaster();
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
    document.querySelector('[ar]').addEventListener('poseLost', this.onPoseLost.bind(this));
    document.querySelector('[ar]').addEventListener('poseFound', this.onPoseFound.bind(this));
    window.addEventListener('resize', this.onWindowResize.bind(this));
    if (this.el.sceneEl.isMobile) {
      window.addEventListener('touchstart', this.tap.bind(this));
    } else {
      window.addEventListener('mousemove', this.mousemove.bind(this));
      window.addEventListener('mousedown', this.tap.bind(this));
    }
  },
  addUIElements: function () {
    this.addButton({
      id: 'apainterBtn',
      layout: 'bottom-center',
      visible: false,
      enabled: false,
      width: 0.02,
      height: 0.02,
      onClick: this.enterPainterMode.bind(this)
    });
    this.addButton({
      id: 'closeBtn',
      layout: 'top-right',
      visible: false,
      enabled: false,
      width: 0.0075,
      height: 0.0075,
      onClick: this.exitPainterMode.bind(this)
    });
    this.addButton({
      id: 'undoBtn',
      layout: 'bottom-left',
      visible: false,
      enabled: false,
      width: 0.0075,
      height: 0.0075,
      padding: [0, 0, 0.005, 0],
      onClick: this.undo.bind(this)
    });
    this.addButton({
      id: 'saveBtn',
      layout: 'bottom-left',
      visible: false,
      enabled: false,
      width: 0.0075,
      height: 0.0075,
      padding: [0, 0, 0.0175, 0],
      onClick: this.save.bind(this)
    });
  },
  initUI: function () {
    var self = this;
    var uiEl = self.objects.apainterBtn;
    uiEl.setAttribute('material', {opacity: 0});
    uiEl.setAttribute('visible', true);

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

    uiEl.padding = params.padding || [0, 0, 0, 0];
    uiEl.id = params.id;
    uiEl.class = 'ar-ui';
    uiEl.layout = params.layout;
    uiEl.onClick = params.onClick;

    uiEl.setAttribute('geometry', {
      primitive: 'plane',
      width: params.width,
      height: params.height
    });
    uiEl.setAttribute('material', {
      shader: 'flat',
      transparent: true,
      fog: false,
      src: '#arui',
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
    uiEl.object3D.renderOrder = 10000;
    uiEl.object3D.onBeforeRender = function () { this.el.sceneEl.renderer.clearDepth(); };
    this.el.appendChild(uiEl);
  },
  showEl: function (self, id, delay) {
    var uiEntity = self.objects[ id ];
    uiEntity.object3D.scale.set(0.01, 0.01, 0.01);
    uiEntity.setAttribute('visible', true);
    new AFRAME.TWEEN.Tween(uiEntity.object3D.scale).to({
      x: 1,
      y: 1,
      z: 1
    }, 500)
      .delay(delay || 0)
      .easing(AFRAME.TWEEN.Easing.Back.Out)
      .onStart(function () {
        self.place(uiEntity, self.width, self.height);
      })
      .onComplete(function () {
        uiEntity.setAttribute('enabled', true);
      })
      .start();
  },
  hideEl: function (self, id, delay){
    var uiEntity = self.objects[ id ];
    uiEntity.setAttribute('enabled', false);
    new AFRAME.TWEEN.Tween(uiEntity.object3D.scale).to({
      x: 0,
      y: 0
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
          this.onOut(this.objOver);
          this.onOver(this.intersection.object);
          this.objOver = this.intersection.object;
        }
      } else {
        this.onOver(this.intersection.object);
        this.objOver = this.intersection.object;
      }
    } else {
      el.sceneEl.canvas.style.cursor = null;
      // Only for 2D Screens
      if (this.objOver) {
        this.onOut(this.objOver);
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
      this.onOut(this.intersection.object);
      this.onClick(this.intersection.object.el.id);
    }
  },
  onOver: function (obj) {
    if (obj.el.getAttribute('enabled') === 'false') {
      return;
    }
    var coords = { x: 1, y: 1, z: 1 };
    var tween = new AFRAME.TWEEN.Tween(coords)
    .to({ x: 1.1, y: 1.1, z: 1.1 }, 150)
    .onUpdate(function () {
      obj.el.setAttribute('scale', this);
    })
    .easing(AFRAME.TWEEN.Easing.Quadratic.In);
    tween.start();
  },
  onOut: function (obj) {
    if (obj.el.getAttribute('enabled') === 'false') {
      return;
    }
    var coords = { x: 1.1, y: 1.1, z: 1.1 };
    var tween = new AFRAME.TWEEN.Tween(coords)
    .to({ x: 1, y: 1, z: 1 }, 150)
    .onUpdate(function () {
      obj.el.setAttribute('scale', this);
    })
    .easing(AFRAME.TWEEN.Easing.Quadratic.Out);
    tween.start();
  },
  onClick: function (id) {
    if (this.objects[id]) {
      this.objects[id].onClick(this);
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
    var positionTmp = {x: 0, y: 0, z: this.depth};
    switch (obj.layout) {
      case 'bottom-center':
        positionTmp.y = -(h / 2) + obj.object3D.children[0].geometry.boundingSphere.radius - this.paddingBottom + obj.padding[2];
        break;
      case 'top-center':
        positionTmp.y = h / 2 - obj.object3D.children[0].geometry.boundingSphere.radius + this.paddingTop - obj.padding[0];
        break;
      case 'top-right':
        positionTmp.x = w / 2 - obj.object3D.children[0].geometry.boundingSphere.radius + this.paddingRight - obj.padding[1];
        positionTmp.y = h / 2 - obj.object3D.children[0].geometry.boundingSphere.radius + this.paddingTop - obj.padding[0];
        break;
      case 'bottom-left':
        positionTmp.x = -(w / 2) + obj.object3D.children[0].geometry.boundingSphere.radius - this.paddingRight + obj.padding[1];
        positionTmp.y = -(h / 2) + obj.object3D.children[0].geometry.boundingSphere.radius - this.paddingBottom + obj.padding[2];
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
    this.showEl(this, 'closeBtn', 500);
    this.showEl(this, 'undoBtn', 600);
    this.showEl(this, 'saveBtn', 700);
  },
  exitPainterMode: function () {
    var self = this;
    this.el.emit('deactivate', false);
    // Hide close buttons
    this.hideEl(this, 'closeBtn');
    this.hideEl(this, 'undoBtn', 200);
    this.hideEl(this, 'saveBtn', 300);
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
  },
  openModal: function () {

  },
  undo: function () {
    // console.log('undo', this);
    // this.el.sceneEl.systems.brush.clear();
    this.el.sceneEl.systems.brush.undo();
  },
  save: function () {
    // console.log('save', this);
    // this.el.sceneEl.systems.painter.upload();
  },
  dragStroke: function () {

  },
  onPoseLost: function () {

  },
  onPoseFound: function () {

  },
  openBrushSettings: function () {

  },
  closeBrushSettings: function () {

  }
});
