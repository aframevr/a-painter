AFRAME.registerSystem('brush', {
  schema: {},
  init: function () {
    this.lines = [];
    this.brushes = [];
    AFRAME.APAINTER = this;
    if (urlParams.url) {
      this.loadBinary(urlParams.url);
    }

    document.addEventListener('keyup', function(event){
      if (event.keyCode === 76) {
        this.loadBinary('apainter2.bin');
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
  registerBrush: function(info, brush) {
    // info: {name, thumbnail, [group]}
    console.log('New brush registered', info.name);
    this.brushes.push(brush);
  },
  addNewLine: function(brushName, color, lineWidth) {
    var line = new Line(color, lineWidth);
    this.lines.push(line);
    return line;
  },
  getBinary: function() {
    var dataViews = [];

    var binaryWriter = new BinaryWriter(4);
    var isLittleEndian = true;
    binaryWriter.writeUint32(this.lines.length, isLittleEndian);
    dataViews.push(binaryWriter.getDataView());

    for (var i=0;i<this.lines.length; i++) {
      dataViews.push(this.lines[i].getBinary());
    }
    return dataViews;
  },
  loadBinary: function (url) {

    var loader = new THREE.XHRLoader(this.manager);
    loader.crossOrigin = 'anonymous';
    loader.setResponseType('arraybuffer');

    loader.load(url, function (buffer) {
      var offset = 0;
      var data = new DataView(buffer);

      function readQuaternion() {
        var output = new THREE.Quaternion(
          data.getFloat32(offset, true),
          data.getFloat32(offset + 4, true),
          data.getFloat32(offset + 8, true),
          data.getFloat32(offset + 12, true)
        );
        offset+=16;
        return output;
      }

      function readVector3() {
        var output = new THREE.Vector3(
          data.getFloat32(offset, true),
          data.getFloat32(offset + 4, true),
          data.getFloat32(offset + 8, true)
        );
        offset+=12;
        return output;
      }

      function readColor() {
        var output = new THREE.Color(
          data.getFloat32(offset, true),
          data.getFloat32(offset + 4, true),
          data.getFloat32(offset + 8, true)
        );
        offset+=12;
        return output;
      }

      function readFloat() {
        var output = data.getFloat32(offset, true);
        offset+=4;
        return output;
      }

      function readInt() {
        var output = data.getUint32(offset, true);
        offset+=4;
        return output;
      }

      var numLines = readInt();
      for (var l = 0; l < numLines; l++) {
        var color = readColor();
        var numPoints = readInt();

        var lineWidth = 0.01;
        var line = this.addNewLine('TODO', color, lineWidth);

        var entity = document.createElement('a-entity');
        document.querySelector('a-scene').appendChild(entity);
        entity.object3D.add(line.mesh);
        var prev = new THREE.Vector3();
        for (var i = 0; i < numPoints; i++) {
          var point = readVector3();
          var quat = readQuaternion();
          var intensity = readFloat();
          if (point.equals(prev)) {
            continue;
          }
          prev=point.clone();
          line.addPoint(point, quat, intensity);
        }

        line.computeVertexNormals();

        var vnh = new THREE.VertexNormalsHelper( line.mesh, 0.01 );
        document.querySelector('a-scene').object3D.add(vnh);
      }
    }.bind(this));
  }
});

AFRAME.registerComponent('brush', {
  init: function () {
    this.idx = 0;

    this.active = false;
    this.obj = this.el.object3D;
    this.currentLine = null;
    this.color = new THREE.Color(0xd03760);
    this.lineWidth = 0.01;
    this.lineWidthModifier = 0.0;
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
      this.lineWidth = evt.detail.lineWidth * 0.05;
    }.bind(this));

    this.el.addEventListener('axismove', function (evt) {
      if (evt.detail.axis[0] === 0 && evt.detail.axis[1] === 0) {
        return;
      }
      updateColor(this.color, evt.detail.axis[0], evt.detail.axis[1]);
      this.el.emit('color-changed', {color: this.color, x: evt.detail.axis[0], y: evt.detail.axis[1]});
    }.bind(this));

    this.el.addEventListener('buttondown', function (evt) {
      if (evt.detail.id === 2) {
        this.color.set(0, 0, 0);
      }
    }.bind(this));
    this.el.addEventListener('buttonchanged', function (evt) {
      // Trigger
      if (evt.detail.id === 1) {
        var value = evt.detail.state.value;
        this.lineWidthModifier = value * 2;
        if (value > 0.1) {
          if (!this.active) {
            this.startNewLine();
            this.active = true;
          }
        } else {
          this.active = false;
          if (this.currentLine) {
            console.log(this.currentLine.getJSON());
            var vnh = new THREE.VertexNormalsHelper( this.currentLine.mesh, 0.03 );
            document.querySelector('a-scene').object3D.add(vnh);
          }
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

      this.currentLine.addPoint(translation, rotation, this.lineWidthModifier);
    }
  },

  startNewLine: function () {
    this.currentLine = this.system.addNewLine('TODO', this.color, this.lineWidth);

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
