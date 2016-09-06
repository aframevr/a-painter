AFRAME.APAINTER = {
  version: 1,
  brushes: {},
  registerBrush: function (name, definition) {
    var proto = {};

    // Format definition object to prototype object.
    Object.keys(definition).forEach(function (key) {
      proto[key] = {
        value: definition[key],
        writable: true
      };
    });

    if (this.brushes[name]) {
      throw new Error('The brush `' + name + '` has been already registered. ' +
                      'Check that you are not loading two versions of the same brush ' +
                      'or two different brushes of the same name.');
    }

    var BrushInterface = function () {};

    BrushInterface.prototype = {
      radiusThreshold: 0,
      reset: function () {},
      tick: function (timeoffset, delta) {},
      addPoint: function (position, rotation, pointerPosition, pressure, timestamp) {},
      getBinary: function () {
        // Color = 3*4 = 12
        // NumPoints   =  4
        // Brush index =  1
        // ----------- = 21
        // [Point] = vector3 + quat + pressure + timestamp = (3+4+1+1)*4 = 36
        var bufferSize = 21 + (36 * this.data.points.length);
        var binaryManager = new BinaryManager(new ArrayBuffer(bufferSize));
        binaryManager.writeUint8(AFRAME.APAINTER.getUsedBrushes().indexOf(this.brushName));  // brush index
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
        this.data = {
          points: [],
          size: brushSize,
          prevPoint: null,
          numPoints: 0,
          maxPoints: 1000,
          color: color.clone()
        };
        initMethod.call(this, color, brushSize);
      };
    }

    function wrapAddPoint (addPointMethod) {
      return function addPoint (position, rotation, pointerPosition, pressure, timestamp) {
        if (this.data.prevPoint
            && this.data.prevPoint.distanceTo(position) <= this.radiusThreshold) {
          return;
        }
        this.data.numPoints++;
        this.data.points.push({
          'position': position,
          'rotation': rotation,
          'pressure': pressure,
          'timestamp': timestamp
        });
        addPointMethod.call(this, position, rotation, pointerPosition, pressure, timestamp);
        this.data.prevPoint = position.clone();
      };
    }

    var NewBrush = function () {};
    NewBrush.prototype = Object.create(BrushInterface.prototype, proto);
    NewBrush.prototype.brushName = name;
    NewBrush.prototype.constructor = NewBrush;
    NewBrush.prototype.init = wrapInit(NewBrush.prototype.init);
    NewBrush.prototype.addPoint = wrapAddPoint(NewBrush.prototype.addPoint);
    this.brushes[name] = NewBrush;

    console.log('New brush registered `' + name + '`');
    NewBrush.used = false; // Used to know which brushes have been used on the drawing
    return NewBrush;
  },
  getUsedBrushes: function () {
    return Object.keys(AFRAME.APAINTER.brushes)
      .filter(function (name){ return AFRAME.APAINTER.brushes[name].used; });
  },
  getBrushByName: function (name) {
    return this.brushes[name];
  }
};
