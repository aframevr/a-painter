/* globals AFRAME THREE BinaryManager */
var VERSION = 1;

AFRAME.BRUSHES = {};

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
    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {},
    getJSON: function (system) {
      var points = [];
      for (var i = 0; i < this.data.points.length; i++) {
        var point = this.data.points[i];
        points.push({
          'orientation': point.orientation.toArray().toNumFixed(6),
          'position': point.position.toArray().toNumFixed(6),
          'pressure': point.pressure.toNumFixed(6),
          'timestamp': point.timestamp
        });
      }

      return {
        brush: {
          index: system.getUsedBrushes().indexOf(this.brushName),
          color: this.data.color.toArray().toNumFixed(6),
          size: this.data.size.toNumFixed(6)
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
    return function init (color, brushSize) {
      this.object3D = new THREE.Object3D();
      this.data = {
        points: [],
        size: brushSize,
        prevPosition: null,
        prevPointerPosition: null,
        numPoints: 0,
        color: color.clone()
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
    var stroke = this.strokes.pop();
    if (stroke) {
      var entity = stroke.entity;
      entity.emit('stroke-removed', {entity: entity});
      entity.parentNode.removeChild(entity);
    }
  },
  clear: function () {
    // Remove all the stroke entities
    for (var i = 0; i < this.strokes.length; i++) {
      var entity = this.strokes[i].entity;
      entity.parentNode.removeChild(entity);
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
  },
  tick: function (time, delta) {
    if (!this.strokes.length) { return; }
    for (var i = 0; i < this.strokes.length; i++) {
      this.strokes[i].tick(time, delta);
    }
  },
  generateRandomStrokes: function (numStrokes) {
    function randNeg () { return 2 * Math.random() - 1; }

    for (var l = 0; l < numStrokes; l++) {
      var brushName = 'flat';
      var color = new THREE.Color(Math.random(), Math.random(), Math.random());
      var size = Math.random() * 0.1;
      var numPoints = parseInt(Math.random() * 500);

      var stroke = this.addNewStroke(brushName, color, size);

      var position = new THREE.Vector3(randNeg(), randNeg(), randNeg());
      var aux = new THREE.Vector3();
      var orientation = new THREE.Quaternion();

      var pressure = 0.2;
      for (var i = 0; i < numPoints; i++) {
        aux.set(randNeg(), randNeg(), randNeg());
        aux.multiplyScalar(randNeg() / 20);
        orientation.setFromUnitVectors(position.clone().normalize(), aux.clone().normalize());
        position = position.add(aux);
        var timestamp = 0;

        var pointerPosition = this.getPointerPosition(position, orientation);
        stroke.addPoint(position, orientation, pointerPosition, pressure, timestamp);
      }
    }
  },
  addNewStroke: function (brushName, color, size) {
    var Brush = this.getBrushByName(brushName);
    if (!Brush) {
      var newBrushName = Object.keys(AFRAME.BRUSHES)[0];
      Brush = AFRAME.BRUSHES[newBrushName];
      console.warn('Invalid brush name: `' + brushName + '` using `' + newBrushName + '`');
    }

    Brush.used = true;
    var stroke = new Brush();
    stroke.brush = Brush;
    stroke.init(color, size);
    this.strokes.push(stroke);

    var entity = document.createElement('a-entity');
    document.querySelector('a-scene').appendChild(entity);
    entity.setObject3D('mesh', stroke.object3D);
    stroke.entity = entity;

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
    var offset = new THREE.Vector3(0, 0.7, 1);
    return function getPointerPosition (position, orientation) {
      var pointer = offset
        .clone()
        .applyQuaternion(orientation)
        .normalize()
        .multiplyScalar(-0.03);
      pointerPosition.copy(position).add(pointer);
      return pointerPosition;
    };
  })(),
  loadJSON: function (data) {
    if (data.version !== VERSION) {
      console.error('Invalid version: ', data.version, '(Expected: ' + VERSION + ')');
    }

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
