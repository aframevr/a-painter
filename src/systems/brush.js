/* globals AFRAME THREE BinaryManager */
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
    addPoint: function (position, rotation, pointerPosition, pressure, timestamp) {},
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
        binaryManager.writeFloat32Array(point.rotation.toArray());
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
        prevPoint: null,
        numPoints: 0,
        color: color.clone()
      };
      initMethod.call(this, color, brushSize);
    };
  }

  function wrapAddPoint (addPointMethod) {
    return function addPoint (position, rotation, pointerPosition, pressure, timestamp) {
      if ((this.data.prevPoint && this.data.prevPoint.distanceTo(position) <= this.options.spacing) ||
          this.options.maxPoints !== 0 && this.data.numPoints >= this.options.maxPoints) {
        return;
      }
      if (addPointMethod.call(this, position, rotation, pointerPosition, pressure, timestamp)) {
        this.data.numPoints++;
        this.data.points.push({
          'position': position.clone(),
          'rotation': rotation.clone(),
          'pressure': pressure,
          'timestamp': timestamp
        });

        this.data.prevPoint = position.clone();
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

  console.log('New brush registered `' + name + '`');
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
      var rotation = new THREE.Quaternion();

      var pressure = 0.2;
      for (var i = 0; i < numPoints; i++) {
        aux.set(randNeg(), randNeg(), randNeg());
        aux.multiplyScalar(randNeg() / 20);
        rotation.setFromUnitVectors(position.clone().normalize(), aux.clone().normalize());
        position = position.add(aux);
        var timestamp = 0;

        var pointerPosition = this.getPointerPosition(position, rotation);
        stroke.addPoint(position, rotation, pointerPosition, pressure, timestamp);
      }
    }
  },
  addNewStroke: function (brushName, color, size) {
    var Brush = this.getBrushByName(brushName);
    if (!Brush) {
      console.error('Invalid brush name: ', brushName);
      return;
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
    binaryManager.writeUint16(AFRAME.APAINTER.version);

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
    return function getPointerPosition (position, rotation) {
      var pointer = offset
        .clone()
        .applyQuaternion(rotation)
        .normalize()
        .multiplyScalar(-0.03);
      pointerPosition.copy(position).add(pointer);
      return pointerPosition;
    };
  })(),
  loadBinary: function (buffer) {
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

      for (var i = 0; i < numPoints; i++) {
        var position = binaryManager.readVector3();
        var rotation = binaryManager.readQuaternion();
        var pressure = binaryManager.readFloat();
        var timestamp = binaryManager.readUint32();

        var pointerPosition = this.getPointerPosition(position, rotation);
        stroke.addPoint(position, rotation, pointerPosition, pressure, timestamp);
      }
    }
  },
  loadFromUrl: function (url) {
    var loader = new THREE.XHRLoader(this.manager);
    loader.crossOrigin = 'anonymous';
    loader.setResponseType('arraybuffer');

    var self = this;
    loader.load(url, function (buffer) {
      self.loadBinary(buffer);
    });
  }
});
