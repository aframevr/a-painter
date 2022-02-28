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

    sharedBufferGeometryManager.addSharedBuffer('strip-flat', new THREE.MeshBasicMaterial(optionsBasic));
    sharedBufferGeometryManager.addSharedBuffer('strip-shaded', new THREE.MeshStandardMaterial(optionsStandard));
    sharedBufferGeometryManager.addSharedBuffer('strip-textured', new THREE.MeshStandardMaterial(optionTextured));
  });

  var line = {

    init: function (color, brushSize) {
      this.sharedBuffer = sharedBufferGeometryManager.getSharedBuffer('strip-' + this.materialOptions.type);
      this.sharedBuffer.restartPrimitive();
      this.sharedBuffer.strip = true;

      this.prevIdx = Object.assign({}, this.sharedBuffer.idx);
      this.idx = Object.assign({}, this.sharedBuffer.idx);

      this.first = true;
    },
    remove: function () {
      this.sharedBuffer.remove(this.prevIdx, this.idx);
    },
    undo: function () {
      this.sharedBuffer.undo(this.prevIdx);
    },
    addPoint: (function () {
      var direction = new THREE.Vector3();

      return function (position, orientation, pointerPosition, pressure, timestamp) {
        var converter = this.materialOptions.converter;

        direction.set(1, 0, 0);
        direction.applyQuaternion(orientation);
        direction.normalize();

        var posA = pointerPosition.clone();
        var posB = pointerPosition.clone();
        var brushSize = this.data.size * pressure;
        posA.add(direction.clone().multiplyScalar(brushSize / 2));
        posB.add(direction.clone().multiplyScalar(-brushSize / 2));

        if (this.first && this.prevIdx.position > 0) {
          // Degenerated triangle
          this.first = false;
          this.sharedBuffer.addVertex(posA.x, posA.y, posA.z);
          this.sharedBuffer.idx.normal++;
          this.sharedBuffer.idx.color++;
          this.sharedBuffer.idx.uv++;

          this.idx = Object.assign({}, this.sharedBuffer.idx);
        }

        /*
          2---3
          | \ |
          0---1
        */
        this.sharedBuffer.addVertex(posA.x, posA.y, posA.z);
        this.sharedBuffer.addVertex(posB.x, posB.y, posB.z);
        this.sharedBuffer.idx.normal += 2;

        this.sharedBuffer.addColor(this.data.color.r, this.data.color.g, this.data.color.b);
        this.sharedBuffer.addColor(this.data.color.r, this.data.color.g, this.data.color.b);

        if (this.materialOptions.type === 'textured') {
          this.sharedBuffer.idx.uv += 2;
          var uvs = this.sharedBuffer.current.attributes.uv.array;
          var u, offset;
          for (var i = 0; i < this.data.numPoints + 1; i++) {
            u = i / this.data.numPoints;
            offset = 4 * i;
            if (this.prevIdx.uv !== 0) {
              offset += (this.prevIdx.uv + 1) * 2;
            }

            uvs[offset] = converter.convertU(u);
            uvs[offset + 1] = converter.convertV(0);

            uvs[offset + 2] = converter.convertU(u);
            uvs[offset + 3] = converter.convertV(1);
          }
        }

        this.idx = Object.assign({}, this.sharedBuffer.idx);

        this.sharedBuffer.update();
        this.computeVertexNormals();
        return true;
      };
    })(),

    computeVertexNormals: (function () {
      var pA = new THREE.Vector3();
      var pB = new THREE.Vector3();
      var pC = new THREE.Vector3();
      var cb = new THREE.Vector3();
      var ab = new THREE.Vector3();

      return function () {
        var start = this.prevIdx.position === 0 ? 0 : (this.prevIdx.position + 1) * 3;
        var end = (this.idx.position) * 3;
        var vertices = this.sharedBuffer.current.attributes.position.array;
        var normals = this.sharedBuffer.current.attributes.normal.array;

        for (var i = start; i <= end; i++) {
          normals[i] = 0;
        }

        var pair = true;
        for (i = start; i < end - 6; i += 3) {
          if (pair) {
            pA.fromArray(vertices, i);
            pB.fromArray(vertices, i + 3);
            pC.fromArray(vertices, i + 6);
          } else {
            pB.fromArray(vertices, i);
            pC.fromArray(vertices, i + 6);
            pA.fromArray(vertices, i + 3);
          }
          pair = !pair;

          cb.subVectors(pC, pB);
          ab.subVectors(pA, pB);
          cb.cross(ab);
          cb.normalize();

          normals[i] += cb.x;
          normals[i + 1] += cb.y;
          normals[i + 2] += cb.z;

          normals[i + 3] += cb.x;
          normals[i + 4] += cb.y;
          normals[i + 5] += cb.z;

          normals[i + 6] += cb.x;
          normals[i + 7] += cb.y;
          normals[i + 8] += cb.z;
        }

        /*
        first and last vertices (0 and 8) belongs just to one triangle
        second and penultimate (1 and 7) belongs to two triangles
        the rest of the vertices belongs to three triangles

          1_____3_____5_____7
          /\    /\    /\    /\
         /  \  /  \  /  \  /  \
        /____\/____\/____\/____\
        0    2     4     6     8
        */

        // Vertices that are shared across three triangles
        for (i = start + 2 * 3; i < end - 2 * 3; i++) {
          normals[i] = normals[i] / 3;
        }

        // Second and penultimate triangle, that shares just two triangles
        normals[start + 3] = normals[start + 3] / 2;
        normals[start + 3 + 1] = normals[start + 3 + 1] / 2;
        normals[start + 3 + 2] = normals[start + 3 * 1 + 2] / 2;

        normals[end - 2 * 3] = normals[end - 2 * 3] / 2;
        normals[end - 2 * 3 + 1] = normals[end - 2 * 3 + 1] / 2;
        normals[end - 2 * 3 + 2] = normals[end - 2 * 3 + 2] / 2;
      };
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
