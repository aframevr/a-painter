/* globals AFRAME THREE */
var sharedBufferGeometryManager = require('../sharedbuffergeometrymanager.js');
var onLoaded = require('../onloaded.js');

(function () {

  var geometryManager = null;

  onLoaded(function () {
    var optionsBasic = {
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide
    };

    var optionsStandard = {
      roughness: 0.75,
      metalness: 0.25,
      vertexColors: THREE.VertexColors,
      map: window.atlas.map,
      side: THREE.DoubleSide
    };

    var optionTextured = {
      roughness: 0.75,
      metalness: 0.25,
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      map: window.atlas.map,
      transparent: true,
      alphaTest: 0.5
    };

    sharedBufferGeometryManager.addSharedBuffer('strip-flat', new THREE.MeshBasicMaterial(optionsBasic), THREE.TriangleStripDrawMode);
    sharedBufferGeometryManager.addSharedBuffer('strip-shaded', new THREE.MeshStandardMaterial(optionsStandard), THREE.TriangleStripDrawMode);
    sharedBufferGeometryManager.addSharedBuffer('strip-textured', new THREE.MeshStandardMaterial(optionTextured), THREE.TriangleStripDrawMode);
  });
  
  var line = {

    init: function (color, brushSize) {
      this.sharedBuffer = sharedBufferGeometryManager.getSharedBuffer('strip-' + this.materialOptions.type);
      this.idx = this.sharedBuffer.idx.positions / 3;
      this.UVidx = this.sharedBuffer.idx.uvs;

      this.sharedBuffer.restartPrimitive();
      this.first = true;
    },

    addPoint: (function () {
      var direction = new THREE.Vector3();

      return function (position, orientation, pointerPosition, pressure, timestamp) {
        var uv = 0;
        var converter = this.materialOptions.converter;

        direction.set(1, 0, 0);
        direction.applyQuaternion(orientation);
        direction.normalize();

        var posA = pointerPosition.clone();
        var posB = pointerPosition.clone();
        var brushSize = this.data.size * pressure;
        posA.add(direction.clone().multiplyScalar(brushSize / 2));
        posB.add(direction.clone().multiplyScalar(-brushSize / 2));

        if (this.first && this.idx > 0) {
          // Degenerated triangle
          this.first = false;
          this.sharedBuffer.addVertice(posA.x, posA.y, posA.z);
          this.sharedBuffer.addColor(this.data.color.r, this.data.color.g, this.data.color.b);
        }

        if (this.materialOptions.type === 'textured') {
          var uvs = this.sharedBuffer.current.attributes.uv.array;
          var UVidx = this.UVidx;
          var u;
          for (var i = 0; i < this.data.numPoints + 1; i++) {
            if (i === 0) {
              u = 0;
            } else {
              u = i / this.data.numPoints;
            }
            var offset = 4 * i + UVidx;

            uvs[offset] = converter.convertU(u);
            uvs[offset + 1] = converter.convertV(0);

            uvs[offset + 2] = converter.convertU(u);
            uvs[offset + 3] = converter.convertV(1);
          }
          this.sharedBuffer.idx.uvs = this.UVidx + (this.data.numPoints + 1) * 4 + 4;
        }

        /*
          2---3
          | \ |
          0---1
        */
        var idx = this.idx;

        this.sharedBuffer.addVertice(posA.x, posA.y, posA.z);
        this.sharedBuffer.addVertice(posB.x, posB.y, posB.z);

        this.sharedBuffer.addColor(this.data.color.r, this.data.color.g, this.data.color.b);
        this.sharedBuffer.addColor(this.data.color.r, this.data.color.g, this.data.color.b);

        this.sharedBuffer.update();
        this.sharedBuffer.computeVertexNormals();
        return true;
      }
    })()
  };

  var lines = [
    {
      name: 'flat',
      materialOptions: {
        type: 'flat'
      },
      thumbnail: 'brushes/thumb_flat.gif'
    },
    {
      name: 'smooth',
      materialOptions: {
        type: 'shaded'
      },
      thumbnail: 'brushes/thumb_smooth.gif'
    },
    {
      name: 'squared-textured',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/squared_textured.png'
      },
      thumbnail: 'brushes/thumb_squared_textured.gif'
    },
    {
      name: 'line-gradient',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/line_gradient.png'
      },
      thumbnail: 'brushes/thumb_line_gradient.gif'
    },
    {
      name: 'silky-flat',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/silky_flat.png'
      },
      thumbnail: 'brushes/thumb_silky_flat.gif'
    },
    {
      name: 'silky-textured',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/silky_textured.png'
      },
      thumbnail: 'brushes/thumb_silky_textured.gif'
    },
    {
      name: 'lines1',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/lines1.png'
      },
      thumbnail: 'brushes/thumb_lines1.gif'
    },
    {
      name: 'lines2',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/lines2.png'
      },
      thumbnail: 'brushes/thumb_lines2.gif'
    },
    {
      name: 'lines3',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/lines3.png'
      },
      thumbnail: 'brushes/thumb_lines3.gif'
    },
    {
      name: 'lines4',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/lines4.png'
      },
      thumbnail: 'brushes/thumb_lines4.gif'
    },
    {
      name: 'lines5',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/lines5.png'
      },
      thumbnail: 'brushes/thumb_lines5.gif'
    },
    {
      name: 'line-grunge1',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/line_grunge1.png'
      },
      thumbnail: 'brushes/thumb_line_grunge1.gif'
    },
    {
      name: 'line-grunge2',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/line_grunge2.png'
      },
      thumbnail: 'brushes/thumb_line_grunge2.gif'
    },
    {
      name: 'line-grunge3',
      materialOptions: {
        type: 'textured',
        textureSrc: 'brushes/line_grunge3.png'
      },
      thumbnail: 'brushes/thumb_line_grunge3.gif'
    }
  ];

  for (var i = 0; i < lines.length; i++) {
    var definition = lines[i];
    if (definition.materialOptions.textureSrc) {
      definition.materialOptions.converter = window.atlas.getUVConverters(definition.materialOptions.textureSrc);
    } else {
      definition.materialOptions.converter = window.atlas.getUVConverters(null);
    }
    
    AFRAME.registerBrush(definition.name, Object.assign({}, line, {materialOptions: definition.materialOptions}), {thumbnail: definition.thumbnail, maxPoints: 3000});
  }
})();
