AFRAME.registerSystem('brush', {
  schema: {},
  getUrlParams: function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query)) {
      urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;
  },
  init: function () {
    this.strokes = [];

    var urlParams = this.getUrlParams();
    if (urlParams.url) {
      this.loadBinary(urlParams.url);
    }

    // @fixme This is just for debug until we'll get some UI
    document.addEventListener('keyup', function(event){
      if (event.keyCode === 76) {
        this.loadBinary('apainter.bin');
      }
      if (event.keyCode === 85) { // u
        // Upload
        var dataviews = this.getBinary();
        var blob = new Blob(dataviews, {type: 'application/octet-binary'});

        var uploader = 'uploadcare'; // or 'fileio'
        if (uploader === 'fileio') {
          // Using file.io
          var fd = new FormData();
          fd.append("file", blob);
          var xhr = new XMLHttpRequest();
          xhr.open("POST", 'https://file.io'); // ?expires=1y
          xhr.onreadystatechange = function (data) {
            if (xhr.readyState == 4) {
              var response = JSON.parse(xhr.response);
              if (response.success) {
                alert('Drawing uploaded correctly\nPlease use this link to share it:\n' + 'http://dev.fernandojsg.com/a-painter/?url=' + response.link);
                console.log('Uploaded link: ' + 'http://dev.fernandojsg.com/a-painter/?url=' + response.link);
              }
            } else {
              // alert('An error occurred while uploading the drawing, please try again');
            }
          };
          xhr.send(fd);
        } else {
          var file = uploadcare.fileFrom('object', blob);
          file.done(function(fileInfo) {
            alert('Drawing uploaded correctly\nPlease use this link to share it:\n' + 'http://dev.fernandojsg.com/a-painter/?url=' + fileInfo.cdnUrl);
            console.log('Uploaded link: ' + 'http://dev.fernandojsg.com/a-painter/?url=' + fileInfo.cdnUrl);
          });
        }
      }
      if (event.keyCode === 86) { // v
        var dataviews = this.getBinary();
        var blob = new Blob(dataviews, {type: 'application/octet-binary'});
        // FileSaver.js defines `saveAs` for saving files out of the browser
        var filename = "apainter.bin";
        saveAs(blob, filename);
      }
    }.bind(this));
  },
  addNewStroke: function (brushName, color, size) {
    var Brush = AFRAME.APAINTER.getBrushByName(brushName);
    if (!Brush) {
      console.error('Invalid brush name: ', brushName);
      return;
    }

    Brush.used = true;
    var stroke = new Brush();
    stroke.brush = Brush;
    stroke.init(color, size);
    this.strokes.push(stroke);
    return stroke;
  },
  getBinary: function () {
    var dataViews = [];
    var MAGIC = 'apainter';

    // Used brushes
    var usedBrushes = AFRAME.APAINTER.getUsedBrushes();

    // MAGIC(8) + version (2) + usedBrushesNum(2) + usedBrushesStrings(*)
    var bufferSize = MAGIC.length + usedBrushes.join(' ').length + 9;
    var binaryManager = new BinaryManager(new ArrayBuffer(bufferSize));

    // Header magic and version
    binaryManager.writeString(MAGIC);
    binaryManager.writeUint16(AFRAME.APAINTER.version);

    binaryManager.writeUint8(usedBrushes.length);
    for (var i = 0; i < usedBrushes.length; i++) {
      binaryManager.writeString(usedBrushes[i]);
    }

    // Number of strokes
    binaryManager.writeUint32(this.strokes.length);
    dataViews.push(binaryManager.getDataView());

    // Strokes
    for (var i = 0; i < this.strokes.length; i++) {
      dataViews.push(this.strokes[i].getBinary());
    }
    return dataViews;
  },
  getPointerPosition: function () {
    var pointerPosition = new THREE.Vector3();
    var offset = new THREE.Vector3(0, 0.7, 1);
    return function getPointerPosition (position, rotation) {
      var pointer = offset
        .clone()
        .applyQuaternion(rotation)
        .normalize()
        .multiplyScalar(-0.03);
      pointerPosition.copy(position).add(pointer);
      return pointerPosition;
    }
  }(),
  loadBinary: function (url) {
    var loader = new THREE.XHRLoader(this.manager);
    loader.crossOrigin = 'anonymous';
    loader.setResponseType('arraybuffer');

    loader.load(url, function (buffer) {
      var binaryManager = new BinaryManager(buffer);
      var magic = binaryManager.readString();
      if (magic !== 'apainter') {
        console.error('Invalid `magic` header');
        return;
      }

      var version = binaryManager.readUint16();
      if (version !== AFRAME.APAINTER.version) {
        console.error('Invalid version: ', version, '(Expected: ' + AFRAME.APAINTER.version + ')');
      }

      var numUsedBrushes = binaryManager.readUint8();
      var usedBrushes = [];
      for (var b = 0; b < numUsedBrushes; b++) {
        usedBrushes.push(binaryManager.readString());
      }

      var numStrokes = binaryManager.readUint32();
      for (var l = 0; l < numStrokes; l++) {
        var brushIndex = binaryManager.readUint8();
        var color = binaryManager.readColor();
        var size = binaryManager.readFloat();
        var numPoints = binaryManager.readUint32();

        var stroke = this.addNewStroke(usedBrushes[brushIndex], color, size);

        var entity = document.createElement('a-entity');
        document.querySelector('a-scene').appendChild(entity);
        entity.object3D.add(stroke.mesh);

        for (var i = 0; i < numPoints; i++) {
          var position = binaryManager.readVector3();
          var rotation = binaryManager.readQuaternion();
          var pressure = binaryManager.readFloat();
          var timestamp = binaryManager.readUint32();

          var pointerPosition = this.getPointerPosition(position, rotation);
          stroke.addPoint(position, rotation, pointerPosition, pressure, timestamp);
        }
      }
    }.bind(this));
  }
});

AFRAME.registerComponent('brush', {
  schema: {
    color: { default: '' },
    linewidth: { default: '' }
  },
  init: function () {
    this.idx = 0;
    this.currentBrushName = 'flat';

    this.active = false;
    this.obj = this.el.object3D;
    this.currentLine = null;
    this.color = new THREE.Color(0xd03760);
    this.brushSize = 0.01;
    this.brushSizeModifier = 0.0;
    this.textures = {};
    this.currentMap = 0;

    this.model = this.el.getObject3D('mesh');
    this.drawing = false;

    function updateColor (color, x, y) {
      function HSVtoRGB (h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
          s = h.s; v = h.v; h = h.h;
        }
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
        return {r: r, g: g, b: b};
      }

      // Use polar coordinates instead of cartesian
      var angle = Math.atan2(x, y);
      var radius = Math.sqrt(x * x + y * y);

      // Map the angle (-PI to PI) to the Hue (from 0 to 1)
      // and the Saturation to the radius
      angle = angle / (Math.PI * 2) + 0.5;
      var color2 = HSVtoRGB(angle, radius, 1.0);
      color.setRGB(color2.r, color2.g, color2.b);
    }

    this.el.addEventListener('stroke-changed', function (evt) {
      this.currentMap = evt.detail.strokeId;
      this.brushSize = evt.detail.brushSize * 0.05;
    }.bind(this));

    this.el.addEventListener('axismove', function (evt) {
      if (evt.detail.axis[0] === 0 && evt.detail.axis[1] === 0) {
        return;
      }
      updateColor(this.color, evt.detail.axis[0], evt.detail.axis[1]);
      this.el.emit('color-changed', {color: this.color, x: evt.detail.axis[0], y: evt.detail.axis[1]});
    }.bind(this));

    this.el.addEventListener('buttonchanged', function (evt) {
      // Trigger
      if (evt.detail.id === 1) {
        var value = evt.detail.state.value;
        this.brushSizeModifier = value * 2;
        if (value > 0.1) {
          if (!this.active) {
            this.startNewLine();
            this.active = true;
          }
        } else {
          this.active = false;
          this.currentLine = null;
        }
      }
    }.bind(this));
  },
  tick: function () {
    var position = new THREE.Vector3();
    var rotation = new THREE.Quaternion();
    var scale = new THREE.Vector3();

    return function tick (time, delta) {
      if (this.currentLine && this.active) {
        this.obj.matrixWorld.decompose(position, rotation, scale);
        var pointerPosition = this.system.getPointerPosition(position, rotation);
        this.currentLine.addPoint(position, rotation, pointerPosition, this.brushSizeModifier, time);
      }
    }
  }(),
  startNewLine: function () {
    this.currentLine = this.system.addNewStroke(this.currentBrushName, this.color, this.brushSize);
    var entity = document.createElement('a-entity');
    this.el.sceneEl.appendChild(entity);
    entity.object3D.add(this.currentLine.mesh);
  }
});
