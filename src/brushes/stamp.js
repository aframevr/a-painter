 /* global AFRAME THREE */
var sharedBufferGeometryManager = require('../sharedbuffergeometrymanager.js');
var onLoaded = require('../onloaded.js');

 (function () {

   onLoaded(function () {
     var shaded = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map: window.atlas.map,
        vertexColors: THREE.VertexColors,
        transparent: true,
        alphaTest: 0.5,
        roughness: 0.75,
        metalness: 0.25
      });
    var flat = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: window.atlas.map,
        vertexColors: THREE.VertexColors,
        transparent: true,
        alphaTest: 0.5
    });

    sharedBufferGeometryManager.addSharedBuffer('tris-flat', flat);
    sharedBufferGeometryManager.addSharedBuffer('tris-shaded', shaded);
  });

  var stamp = {

    init: function (color, brushSize) {
      this.sharedBuffer = sharedBufferGeometryManager.getSharedBuffer('tris-' + this.materialOptions.type);
      this.prevIdx = Object.assign({}, this.sharedBuffer.idx);
      this.idx = Object.assign({}, this.sharedBuffer.idx);
      this.sharedBuffer.strip = false;

      this.currAngle = 0;
      this.subTextures = 1;
      this.angleJitter = 0;
      this.autoRotate = false;

      if (this.materialOptions['subTextures'] !== undefined) {
        this.subTextures = this.materialOptions['subTextures'];
      }
      if (this.materialOptions['autoRotate'] === true) {
        this.autoRotate = true;
      }
      if (this.materialOptions['angleJitter'] !== undefined) {
        this.angleJitter = this.materialOptions['angleJitter'];
        this.angleJitter = this.angleJitter * 2 - this.angleJitter;
      }
    },

    remove: function () {
      this.sharedBuffer.remove(this.prevIdx, this.idx);
    },

    undo: function () {
      this.sharedBuffer.undo(this.prevIdx);
    },

    addPoint: (function () {
      var axis = new THREE.Vector3();
      var dir = new THREE.Vector3();
      var a = new THREE.Vector3();
      var b = new THREE.Vector3();
      var c = new THREE.Vector3();
      var d = new THREE.Vector3();
      var auxDir = new THREE.Vector3();
      var pi2 = Math.PI / 2;

      return function (position, rotation, pointerPosition, pressure, timestamp) {
        // brush side
        dir.set(1, 0, 0);
        dir.applyQuaternion(rotation);
        dir.normalize();

        // brush normal
        axis.set(0, 1, 0);
        axis.applyQuaternion(rotation);
        axis.normalize();

        var brushSize = this.data.size * pressure / 2;
        var brushAngle = Math.PI / 4 + Math.random() * this.angleJitter;

        if (this.autoRotate) {
          this.currAngle += 0.1;
          brushAngle += this.currAngle;
        }

        a.copy(pointerPosition).add(auxDir.copy(dir.applyAxisAngle(axis, brushAngle)).multiplyScalar(brushSize));
        b.copy(pointerPosition).add(auxDir.copy(dir.applyAxisAngle(axis, pi2)).multiplyScalar(brushSize));
        c.copy(pointerPosition).add(auxDir.copy(dir.applyAxisAngle(axis, pi2)).multiplyScalar(brushSize));
        d.copy(pointerPosition).add(dir.applyAxisAngle(axis, pi2).multiplyScalar(brushSize));

        var nidx = this.idx.position;
        var cidx = this.idx.position;

        // triangle 1
        this.sharedBuffer.addVertex(a.x, a.y, a.z);
        this.sharedBuffer.addVertex(b.x, b.y, b.z);
        this.sharedBuffer.addVertex(c.x, c.y, c.z);

        // triangle 2
        this.sharedBuffer.addVertex(c.x, c.y, c.z);
        this.sharedBuffer.addVertex(d.x, d.y, d.z);
        this.sharedBuffer.addVertex(a.x, a.y, a.z);

        // normals & color
        for (var i = 0; i < 6; i++) {
          this.sharedBuffer.addNormal(axis.x, axis.y, axis.z);
          this.sharedBuffer.addColor(this.data.color.r, this.data.color.g, this.data.color.b);
        }

        // UVs
        var uv = this.data.numPoints * 6 * 2;

        // subTextures?
        var Umin = 0;
        var Umax = 1;
        if (this.subTextures > 1) {
          var subt = Math.floor(Math.random() * this.subTextures);
          Umin = 1.0 / this.subTextures * subt;
          Umax = Umin + 1.0 / this.subTextures;
        }

        var converter = this.materialOptions.converter;

        // triangle 1 uv
        this.sharedBuffer.addUV(converter.convertU(Umin), converter.convertV(1));
        this.sharedBuffer.addUV(converter.convertU(Umin), converter.convertV(0));
        this.sharedBuffer.addUV(converter.convertU(Umax), converter.convertV(0));

        // triangle2 uv
        this.sharedBuffer.addUV(converter.convertU(Umax), converter.convertV(0));
        this.sharedBuffer.addUV(converter.convertU(Umax), converter.convertV(1));
        this.sharedBuffer.addUV(converter.convertU(Umin), converter.convertV(1));

        this.idx = Object.assign({}, this.sharedBuffer.idx);

        this.sharedBuffer.update();

        return true;
      }
    })()

  };

  var stamps = [
    {
      name: 'dots',
      materialOptions: {
        type: 'shaded',
        textureSrc: 'brushes/stamp_dots.png'
      },
      thumbnail: 'brushes/thumb_stamp_dots.gif',
      spacing: 0.01
    },
    {
      name: 'squares',
      materialOptions: {
        type: 'shaded',
        textureSrc: 'brushes/stamp_squares.png'
      },
      thumbnail: 'brushes/thumb_stamp_squares.gif',
      spacing: 0.01
    },
    {
      name: 'column',
      materialOptions: {
        type: 'shaded',
        autoRotate: true,
        textureSrc: 'brushes/stamp_column.png'
      },
      thumbnail: 'brushes/thumb_stamp_column.gif',
      spacing: 0.01
    },
    {
      name: 'gear1',
      materialOptions: {
        type: 'shaded',
        angleJitter: Math.PI * 2,
        subTextures: 2,
        textureSrc: 'brushes/stamp_gear.png'
      },
      thumbnail: 'brushes/thumb_stamp_gear.gif',
      spacing: 0.05
    },
    {
      name: 'grunge1',
      materialOptions: {
        type: 'shaded',
        angleJitter: Math.PI * 2,
        textureSrc: 'brushes/stamp_grunge1.png'
      },
      thumbnail: 'brushes/stamp_grunge1.png',
      spacing: 0.02
    },
    {
      name: 'grunge2',
      materialOptions: {
        type: 'shaded',
        angleJitter: Math.PI * 2,
        textureSrc: 'brushes/stamp_grunge2.png'
      },
      thumbnail: 'brushes/stamp_grunge2.png',
      spacing: 0.02
    },
    {
      name: 'grunge3',
      materialOptions: {
        type: 'shaded',
        angleJitter: Math.PI * 2,
        textureSrc: 'brushes/stamp_grunge3.png'
      },
      thumbnail: 'brushes/stamp_grunge3.png',
      spacing: 0.02
    },
    {
      name: 'grunge4',
      materialOptions: {
        type: 'shaded',
        angleJitter: Math.PI * 2,
        textureSrc: 'brushes/stamp_grunge4.png'
      },
      thumbnail: 'brushes/stamp_grunge4.png',
      spacing: 0.02
    },
    {
      name: 'grunge5',
      materialOptions: {
        type: 'shaded',
        angleJitter: Math.PI * 2,
        textureSrc: 'brushes/stamp_grunge5.png'
      },
      thumbnail: 'brushes/thumb_stamp_grunge5.gif',
      spacing: 0.02
    },
    {
      name: 'leaf1',
      materialOptions: {
        type: 'shaded',
        angleJitter: Math.PI,
        textureSrc: 'brushes/stamp_leaf1.png'
      },
      thumbnail: 'brushes/stamp_leaf1.png',
      spacing: 0.03
    },
    {
      name: 'leaf2',
      materialOptions: {
        type: 'shaded',
        angleJitter: 60 * Math.PI / 180.0,
        textureSrc: 'brushes/stamp_leaf2.png'
      },
      thumbnail: 'brushes/thumb_stamp_leaf2.gif',
      spacing: 0.03
    },
    {
      name: 'leaf3',
      materialOptions: {
        type: 'shaded',
        angleJitter: 60 * Math.PI / 180.0,
        textureSrc: 'brushes/stamp_leaf3.png'
      },
      thumbnail: 'brushes/thumb_stamp_leaf3.gif',
      spacing: 0.03
    },
    {
      name: 'fur1',
      materialOptions: {
        type: 'shaded',
        angleJitter: 40 * Math.PI / 180.0,
        subTextures: 2,
        textureSrc: 'brushes/stamp_fur1.png'
      },
      thumbnail: 'brushes/stamp_fur1.png',
      spacing: 0.01
    },
    {
      name: 'fur2',
      materialOptions: {
        type: 'shaded',
        angleJitter: 10 * Math.PI / 180.0,
        subTextures: 3,
        textureSrc: 'brushes/stamp_fur2.png'
      },
      thumbnail: 'brushes/stamp_fur2.png',
      spacing: 0.01
    },
    {
      name: 'grass',
      materialOptions: {
        type: 'shaded',
        angleJitter: 10 * Math.PI / 180.0,
        subTextures: 3,
        textureSrc: 'brushes/stamp_grass.png'
      },
      thumbnail: 'brushes/thumb_stamp_grass.png',
      spacing: 0.03
    },
    {
      name: 'bush',
      materialOptions: {
        type: 'shaded',
        subTextures: 2,
        textureSrc: 'brushes/stamp_bush.png'
      },
      thumbnail: 'brushes/thumb_stamp_bush.gif',
      spacing: 0.04
    },
    {
      name: 'star',
      materialOptions: {
        type: 'shaded',
        textureSrc: 'brushes/stamp_star.png'
      },
      thumbnail: 'brushes/thumb_stamp_star.png',
      spacing: 0.06
    },
    {
      name: 'snow',
      materialOptions: {
        type: 'shaded',
        angleJitter: Math.PI * 2,
        textureSrc: 'brushes/stamp_snow.png'
      },
      thumbnail: 'brushes/thumb_stamp_snow.png',
      spacing: 0.06
    }
  ];

  // var textureLoader = new THREE.TextureLoader();
  for (var i = 0; i < stamps.length; i++) {
    var definition = stamps[i];
    if (definition.materialOptions.textureSrc) {
      definition.materialOptions.map = window.atlas.map; //textureLoader.load(definition.materialOptions.textureSrc);
      definition.materialOptions.converter = window.atlas.getUVConverters(definition.materialOptions.textureSrc);
      delete definition.materialOptions.textureSrc;
    }
    AFRAME.registerBrush(definition.name, Object.assign({}, stamp, {materialOptions: definition.materialOptions}), {thumbnail: definition.thumbnail, spacing: definition.spacing, maxPoints: 3000});
  }

  /*
  - type: <'flat'|'shaded'>
    Flat: constant, just color. Shaded: phong shading with subtle speculars
  - autoRotate: <true|false>
    The brush rotates incrementally at 0.1rad per point
  - angleJitter: <r:float>
    The brush rotates randomly from -r to r
  - subTextures: <n:int>
    textureSrc is divided in n horizontal pieces, and the brush picks one randomly on each point
  */
})();
