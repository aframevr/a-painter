/* globals AFRAME THREE */
AFRAME.registerComponent('screenshot-camera', {
  schema: {
    color: {type: 'color', default: '#ef2d5e'},
    width: {default: 1024, min: 1, max: 2048},
    height: {default: 768, min: 1, max: 1516},
    brush: {default: 'flat'},
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

    this.el.addEventListener('trigger-mode-changed', this.triggerModeChanged.bind(this))
    this.triggerModeChanged();
    this.canTakePicture = true
    this.el.addEventListener('triggerchanged', function (evt) {
      if (!this.enabled) {
        return
      }

      if (evt.detail.value == 1 && this.canTakePicture) {
        this.saveNextTick = true
        this.canTakePicture = false
      } else if (evt.detail.value < 1) {
        this.canTakePicture = true
      }
    }.bind(this));

    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
  },

  triggerModeChanged: function() {
    this.enabled = this.el.getAttribute('trigger-mode') == 'camera'
    this.screen.visible = this.enabled
  },

  tick: function(time, timeDelta) {
    if (!this.enabled) return
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
    var renderer = this.sceneEl.renderer

    var _gl = renderer.context
    var framebuffer = renderer.properties.get(this.renderTarget).__webglFramebuffer
    _gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
    _gl.readPixels( 0, 0, width, height, _gl.RGBA,_gl.UNSIGNED_BYTE,  this.pixels );
    this.pixels = this.flipPixelsVertically(this.pixels, width, height)

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
  },

  flipPixelsVertically: function (pixels, width, height) {
    var flippedPixels = pixels.slice(0);
    for (var x = 0; x < width; ++x) {
      for (var y = 0; y < height; ++y) {
        flippedPixels[x * 4 + y * width * 4] = pixels[x * 4 + (height - y) * width * 4];
        flippedPixels[x * 4 + 1 + y * width * 4] = pixels[x * 4 + 1 + (height - y) * width * 4];
        flippedPixels[x * 4 + 2 + y * width * 4] = pixels[x * 4 + 2 + (height - y) * width * 4];
        flippedPixels[x * 4 + 3 + y * width * 4] = pixels[x * 4 + 3 + (height - y) * width * 4];
      }
    }
    return flippedPixels;
  },
});
