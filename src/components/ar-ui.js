AFRAME.registerComponent('ar-ui', {
  dependencies: ['raycaster'],
  init: function () {
    var el = this.el;
    var self = this;
    this.size = el.sceneEl.renderer.getSize();
    this.pointer = new THREE.Vector2();
    // normalized device coordinates position
    this.pointerNdc = new THREE.Vector2();

    this.intersection = null;

    this.height = this.visibleHeightAtZDepth(this.depth, el.sceneEl.camera);
    this.width = this.visibleWidthAtZDepth(this.depth, el.sceneEl.camera);
    this.depth = -0.1;
    this.paddingTop = this.depth / 20;
    this.paddingBottom = this.depth / 20;

    this.arModeButton = document.createElement('a-entity');
    this.arModeButton.id = 'passthroughBtn';
    this.arModeButton.setAttribute('geometry', {
      primitive: 'plane',
      width: 0.01,
      height: 0.01
    });
    this.arModeButton.setAttribute('material', {
      shader: 'flat',
      fog: false
    });

    document.querySelector('[ar]').addEventListener('poseLost', function (event) {
      self.arModeButton.object3D.visible = false;
    });
    document.querySelector('[ar]').addEventListener('poseFound', function (event) {
      // console.log('found');
      self.arModeButton.object3D.visible = true;
    });
    this.arModeButton.object3D.renderOrder = 10000;
    this.arModeButton.object3D.onBeforeRender = function () { el.sceneEl.renderer.clearDepth(); };

    var cameraEl = document.querySelector('[camera]');
    cameraEl.appendChild(this.arModeButton);

    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Hack to wait until created entities are init
    setTimeout(function () {
      self.onWindowResize();
    }, 500);

    this.raycaster = el.components.raycaster.raycaster;
    if (el.sceneEl.isMobile) {
      window.addEventListener('touchstart', this.tap.bind(this));
    } else {
      window.addEventListener('mousedown', this.tap.bind(this));
    }
    window.addEventListener('mousemove', this.mousemove.bind(this));
  },
  tick: function (t, dt) {

  },
  mousemove: function (e) {
    var el = this.el;
    this.size = el.sceneEl.renderer.getSize();
    this.pointer.set(e.clientX, e.clientY);
    this.pointerNdc.x = (e.clientX / this.size.width) * 2 - 1;
    this.pointerNdc.y = -(e.clientY / this.size.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointerNdc, el.sceneEl.camera);
    var intersections = this.raycaster.intersectObjects([this.arModeButton.object3D.children[0]]);
    this.intersection = (intersections.length) > 0 ? intersections[ 0 ] : null;
    if (this.intersection !== null){
      // console.log('---',this.intersection.point);
      el.sceneEl.canvas.style.cursor = 'pointer';
    } else {
      el.sceneEl.canvas.style.cursor = null;
    }
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
    var intersections = this.raycaster.intersectObjects([this.arModeButton.object3D.children[0]]);
    this.intersection = (intersections.length) > 0 ? intersections[ 0 ] : null;
    if (this.intersection !== null) {
      // Provisional > testing tap events
      this.onclick(this.intersection.object.el.id);
    }
  },
  onclick: function (id) {
    switch (id) {
      case 'passthroughBtn':
        document.querySelector('a-scene').getAttribute('ar').passthrough ^= true;
        break;
    }
  },
  onWindowResize: function (e) {
    var el = this.el;
    this.size = el.sceneEl.canvas.getBoundingClientRect();
    this.width = this.visibleWidthAtZDepth(this.depth, el.sceneEl.camera);
    this.height = this.visibleHeightAtZDepth(this.depth, el.sceneEl.camera);
    this.placeBottom(this.arModeButton, this.width, this.height);
  },
  placeTop: function (obj, w, h) {
    var positionTmp = {x: 0, y: 0, z: 0};
    positionTmp.x = 0;
    positionTmp.y = h / 2 - obj.object3D.children[0].geometry.boundingSphere.radius + this.paddingBottom;
    positionTmp.z = this.depth;
    obj.setAttribute('position', positionTmp);
  },
  placeBottom: function (obj, w, h) {
    var positionTmp = {x: 0, y: 0, z: 0};
    positionTmp.x = 0;
    positionTmp.y = -(h / 2) + obj.object3D.children[0].geometry.boundingSphere.radius - this.paddingBottom;
    positionTmp.z = this.depth;
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
  }
  // end codepen based code
});
