/* globals AFRAME THREE BinaryManager */
var VERSION = 1;

AFRAME.BRUSHES = {};

APAINTER_STATS = {
  brushes: {}
};

AFRAME.registerBrush = function (name, definition, options) {
  var proto = {};

  // Format definition object to prototype object.
  Object.keys(definition).forEach(function (key) {
    proto[key] = {
      value: definition[key],
      writable: true
    };
  });

  if (AFRAME.BRUSHES[name]) {
    throw new Error('The brush `' + name + '` has been already registered. ' +
                    'Check that you are not loading two versions of the same brush ' +
                    'or two different brushes of the same name.');
  }

  var BrushInterface = function () {};

  var defaultOptions = {
    spacing: 0,
    maxPoints: 0
  };

  BrushInterface.prototype = {
    options: Object.assign(defaultOptions, options),
    reset: function () {},
    tick: function (timeoffset, delta) {},
    undo: function () {},
    remove: function () {},
    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {},
    getJSON: function (system) {
      var points = [];
      for (var i = 0; i < this.data.points.length; i++) {
        var point = this.data.points[i];
        points.push({
          'orientation': Utils.arrayNumbersToFixed(point.orientation.toArray()),
          'position': Utils.arrayNumbersToFixed(point.position.toArray()),
          'pressure': Utils.numberToFixed(point.pressure),
          'timestamp': point.timestamp
        });
      }

      return {
        brush: {
          index: system.getUsedBrushes().indexOf(this.brushName),
          color: Utils.arrayNumbersToFixed(this.data.color.toArray()),
          size: Utils.numberToFixed(this.data.size),
        },
        points: points
      };
    },
    getBinary: function (system) {
      // Color = 3*4 = 12
      // NumPoints   =  4
      // Brush index =  1
      // ----------- = 21
      // [Point] = vector3 + quat + pressure + timestamp = (3+4+1+1)*4 = 36

      var bufferSize = 21 + (36 * this.data.points.length);
      var binaryManager = new BinaryManager(new ArrayBuffer(bufferSize));
      binaryManager.writeUint8(system.getUsedBrushes().indexOf(this.brushName));  // brush index
      binaryManager.writeColor(this.data.color);    // color
      binaryManager.writeFloat32(this.data.size);   // brush size

      // Number of points
      binaryManager.writeUint32(this.data.points.length);

      // Points
      for (var i = 0; i < this.data.points.length; i++) {
        var point = this.data.points[i];
        binaryManager.writeFloat32Array(point.position.toArray());
        binaryManager.writeFloat32Array(point.orientation.toArray());
        binaryManager.writeFloat32(point.pressure);
        binaryManager.writeUint32(point.timestamp);
      }
      return binaryManager.getDataView();
    }
  };

  function wrapInit (initMethod) {
    return function init (color, brushSize, owner, timestamp) {
      this.object3D = new THREE.Object3D();
      this.data = {
        points: [],
        size: brushSize,
        prevPosition: null,
        prevPointerPosition: null,
        numPoints: 0,
        color: color.clone(),
        timestamp: timestamp,
        owner: owner
      };
      initMethod.call(this, color, brushSize);
    };
  }

  function wrapAddPoint (addPointMethod) {
    return function addPoint (position, orientation, pointerPosition, pressure, timestamp) {
      if ((this.data.prevPosition && this.data.prevPosition.distanceTo(position) <= this.options.spacing) ||
          this.options.maxPoints !== 0 && this.data.numPoints >= this.options.maxPoints) {
        return;
      }
      if (addPointMethod.call(this, position, orientation, pointerPosition, pressure, timestamp)) {
        this.data.numPoints++;
        this.data.points.push({
          'position': position.clone(),
          'orientation': orientation.clone(),
          'pressure': pressure,
          'timestamp': timestamp
        });

        this.data.prevPosition = position.clone();
        this.data.prevPointerPosition = pointerPosition.clone();
      }
    };
  }

  var NewBrush = function () {};
  NewBrush.prototype = Object.create(BrushInterface.prototype, proto);
  NewBrush.prototype.brushName = name;
  NewBrush.prototype.constructor = NewBrush;
  NewBrush.prototype.init = wrapInit(NewBrush.prototype.init);
  NewBrush.prototype.addPoint = wrapAddPoint(NewBrush.prototype.addPoint);
  AFRAME.BRUSHES[name] = NewBrush;

  // console.log('New brush registered `' + name + '`');
  NewBrush.used = false; // Used to know which brushes have been used on the drawing
  return NewBrush;
};

AFRAME.registerSystem('brush', {
  schema: {},
  brushes: {},
  strokes: [],
  getUsedBrushes: function () {
    return Object.keys(AFRAME.BRUSHES)
      .filter(function (name) { return AFRAME.BRUSHES[name].used; });
  },
  getBrushByName: function (name) {
    return AFRAME.BRUSHES[name];
  },
  undo: function () {
  	var stroke;
    for (var i = this.strokes.length - 1; i >= 0; i--) {
      if (this.strokes[i].data.owner !== 'local') continue;
      stroke = this.strokes.splice(i, 1)[0];
      break;
    }
    if (stroke) {
      stroke.undo();
      var drawing = document.querySelector('.a-drawing');
      drawing.emit('stroke-removed', {stroke: stroke});
    }
  },
  removeById: function (order) {
    order = 1;
    var targetStroke = this.strokes[order];
    console.log(targetStroke, this.strokes);
    if (targetStroke) {
      for (var i = this.strokes.length - 1; i > order; i--) {
        stroke = this.strokes[i];
        if (targetStroke.sharedBuffer === stroke.sharedBuffer) {
          // Update idx and prevIdx
          console.log('>>>', stroke.prevIdx, '->', stroke.idx, 'target', targetStroke.prevIdx, '->', targetStroke.idx);
          for (key in targetStroke.idx) {
            var diff = (targetStroke.idx[key] - targetStroke.prevIdx[key]);
            stroke.idx[key] -= diff;
            stroke.prevIdx[key] -= diff;
          }
          console.log('<<<', stroke.idx, stroke.prevIdx);
        }
      }
      this.strokes.splice(order, 1)[0].remove();
    }
  },
  clear: function () {
    // Remove all the stroke entities
    for (var i = this.strokes.length - 1; i >= 0; i--) {
      if(this.strokes[i].data.owner !== 'local') continue;
      var stroke = this.strokes[i];
      stroke.undo();
      var drawing = document.querySelector('.a-drawing');
      drawing.emit('stroke-removed', { stroke: stroke });
    }

    // Reset the used brushes
    Object.keys(AFRAME.BRUSHES).forEach(function (name) {
      AFRAME.BRUSHES[name].used = false;
    });

    this.strokes = [];
  },
  init: function () {
    this.version = VERSION;
    this.clear();
    this.controllerName = null;

    var self = this;
    this.sceneEl.addEventListener('controllerconnected', function (evt) {
      self.controllerName = evt.detail.name;
    });
  },
  tick: function (time, delta) {
    if (!this.strokes.length) { return; }
    for (var i = 0; i < this.strokes.length; i++) {
      this.strokes[i].tick(time, delta);
    }
  },
  generateTestLines: function () {
    function randNeg() { return 2 * Math.random() - 1; }
    var z = -2;
    var size = 0.5;
    var width = 3;
    var pressure = 1;
    var numPoints = 4;

    var steps = width / numPoints;
    var numStrokes = 1;
    var brushesNames = Object.keys(AFRAME.BRUSHES);

    brushesNames2 = [
      'leaf1',
      'fur2',
      'star',
      'squared-textured',
      'flat',
      'squared-textured',
      'lines5'
    ];

    var x = -(size + 0.1) * brushesNames.length / 2;
    x= 0;
    var y = 0;
    brushesNames.forEach(function (brushName) {
      var color = new THREE.Color(Math.random(), Math.random(), Math.random());

      var stroke = this.addNewStroke(brushName, color, size);
      var entity = document.querySelector('#left-hand');
      entity.emit('stroke-started', { entity: entity, stroke: stroke });

      var position = new THREE.Vector3(x, y, z);
      var aux = new THREE.Vector3();

      for (var i = 0; i < numPoints; i++) {
        var orientation = new THREE.Quaternion();
        aux.set(0, steps, 0.1);
        var euler = new THREE.Euler(0, Math.PI, 0);
        orientation.setFromEuler(euler);
        position = position.add(aux);
        var timestamp = 0;

        var pointerPosition = this.getPointerPosition(position, orientation);
        stroke.addPoint(position, orientation, pointerPosition, pressure, timestamp);
      }

      x+= size + 0.1;
    });
  },
  generateRandomStrokes: function (numStrokes) {
    function randNeg () { return 2 * Math.random() - 1; }

    var entity = document.querySelector('#left-hand');

    var brushesNames = Object.keys(AFRAME.BRUSHES);

    for (var l = 0; l < numStrokes; l++) {
      //var brushName = brushesNames[parseInt(Math.random() * 30)];
      var brushName = brushesNames[parseInt(Math.random() * 13)];
      var color = new THREE.Color(Math.random(), Math.random(), Math.random());
      var size = Math.random() * 0.3;
      var numPoints = parseInt(Math.random() * 500);

      var stroke = this.addNewStroke(brushName, color, size);
      entity.emit('stroke-started', {entity: entity, stroke: stroke});

      var position = new THREE.Vector3(randNeg(), randNeg(), randNeg());
      var aux = new THREE.Vector3();
      var orientation = new THREE.Quaternion();

      var pressure = 0.2;
      for (var i = 0; i < numPoints; i++) {
        aux.set(randNeg(), randNeg(), randNeg());
        aux.multiplyScalar(randNeg() / 20);
        orientation.setFromUnitVectors(position.clone().normalize(), aux.clone().normalize());
        position = position.add(aux);
        if (position.y < 0) {
          position.y = -position.y;
        }
        var timestamp = 0;
        pressure += 1 - 2 * Math.random();
        if (pressure < 0) pressure = 0.2;
        if (pressure > 1) pressure = 1;

        var pointerPosition = this.getPointerPosition(position, orientation);
        stroke.addPoint(position, orientation, pointerPosition, pressure, timestamp);
      }
    }
  },
  addNewStroke: function (brushName, color, size, owner, timestamp) {
    if (!APAINTER_STATS.brushes[brushName]) {
      APAINTER_STATS.brushes[brushName] = 0;
    }
    APAINTER_STATS.brushes[brushName]++;

    owner = owner || 'local';
    timestamp = timestamp || Date.now();
    var Brush = this.getBrushByName(brushName);
    if (!Brush) {
      var newBrushName = Object.keys(AFRAME.BRUSHES)[0];
      Brush = AFRAME.BRUSHES[newBrushName];
      console.warn('Invalid brush name: `' + brushName + '` using `' + newBrushName + '`');
    }

    Brush.used = true;
    var stroke = new Brush();
    stroke.brush = Brush;
    stroke.init(color, size, owner, timestamp);
    this.strokes.push(stroke);

    var drawing = document.querySelector('.a-drawing');
    if (!drawing) {
      drawing = document.createElement('a-entity');
      drawing.className = "a-drawing";
      document.querySelector('a-scene').appendChild(drawing);
    }

    //var entity = document.createElement('a-entity');
    //entity.className = "a-stroke";
    //drawing.appendChild(entity);
//    drawing.object3D.add(stroke.object3D);
    //entity.setObject3D('mesh', stroke.object3D);
    //stroke.entity = entity;

    return stroke;
  },
  getJSON: function () {
    // Strokes
    var json = {
      version: VERSION,
      strokes: [],
      author: '',
      brushes: this.getUsedBrushes()
    };

    for (i = 0; i < this.strokes.length; i++) {
      json.strokes.push(this.strokes[i].getJSON(this));
    }

    return json;
  },
  getBinary: function () {
    var dataViews = [];
    var MAGIC = 'apainter';

    // Used brushes
    var usedBrushes = this.getUsedBrushes();

    // MAGIC(8) + version (2) + usedBrushesNum(2) + usedBrushesStrings(*)
    var bufferSize = MAGIC.length + usedBrushes.join(' ').length + 9;
    var binaryManager = new BinaryManager(new ArrayBuffer(bufferSize));

    // Header magic and version
    binaryManager.writeString(MAGIC);
    binaryManager.writeUint16(VERSION);

    binaryManager.writeUint8(usedBrushes.length);
    for (var i = 0; i < usedBrushes.length; i++) {
      binaryManager.writeString(usedBrushes[i]);
    }

    // Number of strokes
    binaryManager.writeUint32(this.strokes.length);
    dataViews.push(binaryManager.getDataView());

    // Strokes
    for (i = 0; i < this.strokes.length; i++) {
      dataViews.push(this.strokes[i].getBinary(this));
    }
    return dataViews;
  },
  getPointerPosition: (function () {
    var pointerPosition = new THREE.Vector3();
    var controllerOffset = {
      'vive-controls': {
        vec: new THREE.Vector3(0, 0.7, 1),
        mult: -0.03
      },
      'oculus-touch-controls': {
        vec: new THREE.Vector3(0, 0, 2.8),
        mult: -0.05
      },
      'windows-motion-controls': {
        vec: new THREE.Vector3(0, 0, 1),
        mult: -.12
      }
    };

    return function getPointerPosition (position, orientation) {
      if (!this.controllerName) {
        return position;
      }

      var offsets = controllerOffset[this.controllerName];
      var pointer = offsets.vec
        .clone()
        .applyQuaternion(orientation)
        .normalize()
        .multiplyScalar(offsets.mult);
      pointerPosition.copy(position).add(pointer);
      return pointerPosition;
    };
  })(),
  loadJSON: function (data) {
    if (data.version !== VERSION) {
      console.error('Invalid version: ', data.version, '(Expected: ' + VERSION + ')');
    }

    console.time('JSON Loading');

    var usedBrushes = [];

    for (var i = 0; i < data.strokes.length; i++) {
      var strokeData = data.strokes[i];
      var brush = strokeData.brush;

      var stroke = this.addNewStroke(
        data.brushes[brush.index],
        new THREE.Color().fromArray(brush.color),
        brush.size
      );

      for (var j = 0; j < strokeData.points.length; j++) {
        var point = strokeData.points[j];

        var position = new THREE.Vector3().fromArray(point.position);
        var orientation = new THREE.Quaternion().fromArray(point.orientation);
        var pressure = point.pressure;
        var timestamp = point.timestamp;

        var pointerPosition = this.getPointerPosition(position, orientation);
        stroke.addPoint(position, orientation, pointerPosition, pressure, timestamp);
      }
    }

    console.timeEnd('JSON Loading');
  },
  loadBinary: function (buffer) {
    var binaryManager = new BinaryManager(buffer);
    var magic = binaryManager.readString();
    if (magic !== 'apainter') {
      console.error('Invalid `magic` header');
      return;
    }

    var version = binaryManager.readUint16();
    if (version !== VERSION) {
      console.error('Invalid version: ', version, '(Expected: ' + VERSION + ')');
    }

    console.time('Binary Loading');

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

      for (var i = 0; i < numPoints; i++) {
        var position = binaryManager.readVector3();
        var orientation = binaryManager.readQuaternion();
        var pressure = binaryManager.readFloat();
        var timestamp = binaryManager.readUint32();

        var pointerPosition = this.getPointerPosition(position, orientation);
        stroke.addPoint(position, orientation, pointerPosition, pressure, timestamp);
      }
    }
    console.timeEnd('Binary Loading');
  },
  loadFromUrl: function (url, binary) {
    var loader = new THREE.XHRLoader(this.manager);
    loader.crossOrigin = 'anonymous';
    if (binary === true) {
      loader.setResponseType('arraybuffer');
    }

    var self = this;

    loader.load(url, function (buffer) {
      if (binary === true) {
        self.loadBinary(buffer);
      } else {
        self.loadJSON(JSON.parse(buffer));
      }
    });
  }
});
