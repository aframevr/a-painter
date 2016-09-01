AFRAME.APAINTER = {
  version: 1,
  brushes: [],
  registerBrush: function (name, brush) {
    console.log('New brush registered `' + name + '`');
    brush.used = false; // Used to know which brushes have been used on the drawing
    this.brushes.push(brush);
  },
  getUsedBrushes: function () {
    this.brushes.filter(function (brush){ return brush.used; });
  }
};


AFRAME.APAINTER.brushInterface = {
  points: [],
  init: function (color, width) {},
  addPoint: function (position, rotation, intensity, timestamp) {},
  reset: function () {},
  tick: function (timeoffset, delta) {},
  getBinary: function () {
    // Color = 3*4 = 12
    // NumPoints = 4
    // Brush index = 1
    // [Point] = vector3 + quat + intensity = (3+4+1)*4(float) = 64
    var bufferSize = 17 + (64 * this.points.length);
    var binaryWriter = new BinaryWriter(bufferSize);

    //binaryWriter.writeUint8(usedBrush.indexOf(this.brush.name));  // brush index
    var brushIndex = AFRAME.APAINTER.getUsedBrushes().indexOf(this.brush.name);
    binaryWriter.writeUint8(brushIndex);    // brush index
    binaryWriter.writeColor(this.color);    // color
    binaryWriter.writeFloat32(this.size);   // brush size

    // Number of points
    binaryWriter.writeUint32(this.points.length);

    // Points
    for (var i = 0; i < this.points.length; i++) {
      var point = this.points[i];
      binaryWriter.writeFloat32Array(point.position.toArray());
      binaryWriter.writeFloat32Array(point.rotation.toArray());
      binaryWriter.writeFloat32(point.intensity);
      binaryWriter.writeUint32(point.timestamp);
    }
    return binaryWriter.getDataView();
  }
};

AFRAME.registerSystem('brush', {
  schema: {},
  init: function () {
    this.strokes = [];
    if (urlParams.url) {
      this.loadBinary(urlParams.url);
    }

    // @fixme This is just for debug until we'll get some UI
    document.addEventListener('keyup', function(event){
      if (event.keyCode === 76) {
        this.loadBinary('apainter3.bin');
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
  addNewStroke: function (brushIdx, color, size) {
    brushIdx = 0;
    var brush = AFRAME.APAINTER.brushes[brushIdx];
    brush.used = true;
    var stroke = Object.create(Object.assign(AFRAME.APAINTER.brushInterface, brush));
    stroke.brush = brush;
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
    var size = MAGIC.length + usedBrushes.join('').length + 4;

    var binaryWriter = new BinaryWriter(size);

    // Header magic and version
    binaryWriter.writeString(MAGIC);
    binaryWriter.writeUint16(AFRAME.APAINTER.version);


    binaryWriter.writeUint8(usedBrushes.length);
    for (var i = 0; i < usedBrushes.length; i++) {
      binaryWriter.writeString(usedBrushes[i].name);
    }

    // Number of strokes
    binaryWriter.writeUint32(this.strokes.length);
    dataViews.push(binaryWriter.getDataView());

    // Strokes
    for (var i = 0; i < this.strokes.length; i++) {
      dataViews.push(this.strokes[i].getBinary());
    }
    return dataViews;
  },
  loadBinary: function (url) {
    var loader = new THREE.XHRLoader(this.manager);
    loader.crossOrigin = 'anonymous';
    loader.setResponseType('arraybuffer');

    loader.load(url, function (buffer) {
      var binaryReader = new BinaryReader(buffer);
      var magic = binaryReader.readString();
      if (magic !== 'apainter') {
        console.error('Invalid `magic` header');
        return;
      }

      var version = binaryReader.readUint16();
      if (version !== AFRAME.APAINTER.version) {
        console.error('Invalid version: ', version, '(Expected: ' + AFRAME.APAINTER.version + ')');
      }

      var numUsedBrushes = binaryReader.readUint8();
      var usedBrushes = [];
      for (var b = 0; b < numUsedBrushes; b++) {
        usedBrushes.push(binaryReader.readString());
      }

      var numStrokes = binaryReader.readUint32();
      for (var l = 0; l < numStrokes; l++) {
        var brushIndex = binaryReader.readUint8();
        var color = binaryReader.readColor();
        var size = binaryReader.readColor();
        var numPoints = binaryReader.readUint32();

        size = 0.01;
        var stroke = this.addNewStroke(usedBrushes[brushIndex], color, size);

        var entity = document.createElement('a-entity');
        document.querySelector('a-scene').appendChild(entity);
        entity.object3D.add(stroke.mesh);

        var prev = new THREE.Vector3();
        for (var i = 0; i < numPoints; i++) {
          var point = binaryReader.readVector3();
          var quat = binaryReader.readQuaternion();
          var intensity = binaryReader.readFloat();
          var timestamp = binaryReader.readUint32();
          if (point.equals(prev)) {
            continue;
          }
          prev = point.clone();
          stroke.addPoint(point, quat, intensity, timestamp);
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
    this.currentBrushIdx = 0;

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

    this.el.addEventListener('buttondown', function (evt) {
      // Grip
      if (evt.detail.id === 2) {
        this.currentBrushIdx = (this.currentBrushIdx + 1) % AFRAME.APAINTER.brushes.length;
      }
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

  tick: function (time, delta) {
    if (this.currentLine && this.active) {
      var rotation = new THREE.Quaternion();
      var translation = new THREE.Vector3();
      var scale = new THREE.Vector3();
      this.obj.matrixWorld.decompose(translation, rotation, scale);

      this.currentLine.addPoint(translation, rotation, this.brushSizeModifier);
    }
  },

  startNewLine: function () {
    this.currentLine = this.system.addNewStroke(this.currentBrushIdx, this.color, this.brushSize);

    var rotation = new THREE.Quaternion();
    var translation = new THREE.Vector3();
    var scale = new THREE.Vector3();
    this.obj.matrixWorld.decompose(translation, rotation, scale);
    this.currentLine.addPoint(translation, rotation, 0);

    var entity = document.createElement('a-entity');
    this.el.sceneEl.appendChild(entity);
    entity.object3D.add(this.currentLine.mesh);
  }
});
