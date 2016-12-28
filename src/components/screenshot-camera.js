/* globals AFRAME THREE */
AFRAME.registerComponent('screenshot-camera', {
  schema: {
    color: {type: 'color', default: '#ef2d5e'},
    width: {default: 1024, min: 1, max: 2048},
    height: {default: 768, min: 1, max: 1516},
    brush: {default: 'flat'},
    enabled: { default: true }
  },
  init: function () {
    var data = this.data;
    var width = data.width;
    var height = data.height;
    this.sceneEl = document.querySelector('a-scene');
    this.scene = this.sceneEl.object3D

    this.renderTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      autoClear: true
    })

    var ratio = width / height;
    this.camera = new THREE.PerspectiveCamera(55, ratio, 0.01, 1000 );
    this.camera.rotation.x = Math.PI / 2
    this.camera.rotation.y = Math.PI
    this.camera.rotation.z = Math.PI
    this.screen = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(ratio * 0.2, 0.2),
      new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: this.renderTarget
      })
    )
    this.screen.rotation.set(3 * Math.PI / 2, 0, 0)
    this.screen.position.set(0.2, 0, -0.2)
    this.el.object3D.add(this.screen)
    this.el.object3D.add(this.camera)

    this.el.addEventListener('buttondown', function (evt) {
      if (!this.data.enabled) {
        return
      }
      if (evt.detail.id === 1) {
        this.saveNextTick = true
      }
    }.bind(this));

    this.canvas = document.createElement('canvas')
    this.canvas.style.position = 'fixed'
    this.canvas.style.backgroundColor = 'red'
    this.canvas.style.top = 0;
    this.canvas.style.zindex = 10000
    document.body.appendChild(this.canvas)
    this.canvas.width = width
    this.canvas.height = height
  },

  tick: function(time, timeDelta) {
    this.sceneEl.renderer.render(this.scene, this.camera, this.renderTarget, true)
    if (this.saveNextTick) {
      this.saveCapture();
      this.saveNextTick = false;
    }
  },

  saveCapture: function () {
    var width = this.data.width
    var height = this.data.height
    this.pixels = new Uint8Array(4 * width * height)
    debugger
    this.sceneEl.renderer.readRenderTargetPixels(
      this.renderTarget,
      0, 0, width, height,
      this.pixels
    )
    var gl = this.sceneEl.renderer.context
    console.log(gl.getError())
    var allZero = true
    for (var i = 0; i < this.pixels.length; i++) { if (this.pixels[i] != 0) allZero = false}
    console.log("All zeros?", allZero)

    this.imageData = new ImageData(new Uint8ClampedArray(this.pixels), width, height)
    this.canvas.getContext('2d').putImageData(this.imageData, 0, 0)
    this.canvas.toBlob(function (blob) {
      var url = URL.createObjectURL(blob);
      var fileName = 'screenshot-' + document.title + '-' + Date.now() + '.png';
      var aEl = document.createElement('a');
      aEl.href = url;
      aEl.setAttribute('download', fileName);
      aEl.innerHTML = 'downloading...';
      aEl.style.display = 'none';
      document.body.appendChild(aEl);
      setTimeout(function () {
        aEl.click();
        document.body.removeChild(aEl);
      }, 1);
    }, 'image/png');
  }
});
