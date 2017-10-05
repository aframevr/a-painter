AFRAME.registerComponent('ar-ui', {
  dependencies: ['raycaster'],
  init: function () {
    this.size = this.el.sceneEl.renderer.getSize();
    window.addEventListener('resize', this.onWindowResize.bind(this));

    this.height = this.visibleHeightAtZDepth(this.depth, this.el.sceneEl.camera);
    this.width = this.visibleWidthAtZDepth(this.depth, this.el.sceneEl.camera);
    this.depth = -1;
    this.paddingTop = this.depth / 20;
    this.paddingBottom = this.depth / 20;

    this.arModeButton = new THREE.Mesh(new THREE.RingGeometry(0.04, 0.06, 32),new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5}));
    this.arModeButton.geometry.computeBoundingSphere();
    this.el.object3D.add(this.arModeButton);
    this.onWindowResize();

    this.raycaster = this.el.components.raycaster.raycaster;
    // this.el.components.raycaster.showLine = true;
    this.ray = this.raycaster.ray;
  },
  tick: function (t, dt) {

  },
  onWindowResize: function (e) {
    this.size = this.el.sceneEl.canvas.getBoundingClientRect();
    this.width = this.visibleWidthAtZDepth(this.depth, this.el.sceneEl.camera);
    this.height = this.visibleHeightAtZDepth(this.depth, this.el.sceneEl.camera);
    this.placeBottom(this.arModeButton, this.width, this.height);
  },
  placeTop: function (obj, w, h) {
    // obj.position.x = 0;
    obj.position.y = h / 2 - obj.geometry.boundingSphere.radius + this.paddingTop;
    obj.position.z = this.depth;
  },
  placeBottom: function (obj, w, h) {
    // obj.position.x = 0;
    obj.position.y = - (h / 2) + obj.geometry.boundingSphere.radius - this.paddingBottom;
    obj.position.z = this.depth;
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
