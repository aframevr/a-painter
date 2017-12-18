/* globals AFRAME THREE */
(function () {

  function SharedBufferGeometryManager () {
    this.sharedBuffers = {};
  }

  SharedBufferGeometryManager.prototype = {
    addSharedBuffer: function (name, material, primitiveMode) {
      var bufferGeometry = new SharedBufferGeometry(material, primitiveMode);
      this.sharedBuffers[name] = bufferGeometry;
    },

    getSharedBuffer: function (name) {
      return this.sharedBuffers[name];
    }
  };

  function SharedBufferGeometry (material, primitiveMode) {
    this.material = material;
    this.primitiveMode = primitiveMode;

    this.maxBufferSize = 40000;
    this.geometries = [];
    this.current = null;
    this.addBuffer();
  }

  SharedBufferGeometry.prototype = {
    restartPrimitive: function () {
      if (this.idx.positions !== 0) {
        var prev = this.idx.positions - 3;
        var col = this.idx.colors - 3;
        
        var position = this.current.attributes.position.array;
        this.addVertice(position[prev++], position[prev++], position[prev++]);
        
        var color = this.current.attributes.color.array;
        this.addColor(color[col++], color[col++], color[col++]);
        this.addUV(0,0);
      }
    },

    addBuffer: function () {
      var geometry = new THREE.BufferGeometry();

      var vertices = new Float32Array(this.maxBufferSize * 3 );
      var normals = new Float32Array(this.maxBufferSize * 3);
      var uvs = new Float32Array(this.maxBufferSize * 2);
      var colors = new Float32Array(this.maxBufferSize * 3);

      var mesh = new THREE.Mesh(geometry, this.material);
      mesh.drawMode = this.primitiveMode;

      mesh.frustumCulled = false;
      mesh.vertices = vertices;

      this.object3D = new THREE.Object3D();
      var drawing = document.querySelector('.a-drawing');
      if (!drawing) {
        drawing = document.createElement('a-entity');
        drawing.className = "a-drawing";
        document.querySelector('a-scene').appendChild(drawing);
      }
      drawing.object3D.add(this.object3D);

      this.object3D.add(mesh);

      geometry.setDrawRange(0, 0);
      geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3).setDynamic(true));
      geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2).setDynamic(true));
      geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3).setDynamic(true));
      geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(true));

      this.idx = {
        positions: 0,
        uvs: 0,
        normals: 0,
        colors: 0
      };

      this.geometries.push(geometry);
      this.current = geometry;
    },

    addColor: function(r, g, b) {
      var color = this.current.attributes.color.array;

      color[this.idx.colors++] = r;
      color[this.idx.colors++] = g;
      color[this.idx.colors++] = b;
    },

    addNormal: function (x,y,z) {
      var normal = this.current.attributes.normal.array;

      normal[this.idx.normals++] = x;
      normal[this.idx.normals++] = y;
      normal[this.idx.normals++] = z;
    },

    computeVertexNormals: function () {
      var pA = new THREE.Vector3();
      var pB = new THREE.Vector3();
      var pC = new THREE.Vector3();
      var cb = new THREE.Vector3();
      var ab = new THREE.Vector3();

      var idx = this.idx.positions;

      var normals = this.current.attributes.normal.array;

      for (var i = 0, il = idx; i < il; i++) {
        normals[i] = 0;
      }

      var vertices = this.current.attributes.position.array;

      var pair = true;
      for (i = 0, il = idx; i < il; i += 3) {
        if (pair) {
          pA.fromArray(vertices, i);
          pB.fromArray(vertices, i + 3);
          pC.fromArray(vertices, i + 6);
        } else {
          pA.fromArray(vertices, i + 3);
          pB.fromArray(vertices, i);
          pC.fromArray(vertices, i + 6);
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
      first and last vertice (0 and 8) belongs just to one triangle
      second and penultimate (1 and 7) belongs to two triangles
      the rest of the vertices belongs to three triangles

        1_____3_____5_____7
        /\    /\    /\    /\
       /  \  /  \  /  \  /  \
      /____\/____\/____\/____\
      0    2     4     6     8
      */

      // Vertices that are shared across three triangles
      for (i = 2 * 3, il = idx - 2 * 3; i < il; i++) {
        normals[i] = normals[i] / 3;
      }

      // Second and penultimate triangle, that shares just two triangles
      normals[3] = normals[3] / 2;
      normals[3 + 1] = normals[3 + 1] / 2;
      normals[3 + 2] = normals[3 * 1 + 2] / 2;

      normals[idx - 2 * 3] = normals[idx - 2 * 3] / 2;
      normals[idx - 2 * 3 + 1] = normals[idx - 2 * 3 + 1] / 2;
      normals[idx - 2 * 3 + 2] = normals[idx - 2 * 3 + 2] / 2;

      this.current.normalizeNormals();
    },

    addVertice: function(x,y,z) {
      var position = this.current.attributes.position.array;

      position[this.idx.positions++] = x;
      position[this.idx.positions++] = y;
      position[this.idx.positions++] = z;
    },

    addNormal: function (x, y, z) {
      var normal = this.current.attributes.normal.array;

      normal[this.idx.normals++] = x;
      normal[this.idx.normals++] = y;
      normal[this.idx.normals++] = z;
    },


    addUV: function (u, v) {
      var uvs = this.current.attributes.uv.array;

      uvs[this.idx.uvs++] = u;
      uvs[this.idx.uvs++] = v;
    },

    update: function () {
      this.current.setDrawRange(0, this.idx.positions / 3);
      
      this.current.attributes.color.needsUpdate = true;
      this.current.attributes.normal.needsUpdate = true;
      this.current.attributes.position.needsUpdate = true;
      this.current.attributes.uv.needsUpdate = true;      

    }
  };
  var geometryManager = null;

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

  var materials = {
    flat: new THREE.MeshBasicMaterial(optionsBasic),
    shaded: new THREE.MeshStandardMaterial(optionsStandard),
    textured: new THREE.MeshStandardMaterial(optionTextured)
  };

  window.sharedBufferGeometryManager = sharedBufferGeometryManager = null;

  if (document.readyState === 'complete' || document.readyState === 'loaded') {
    onDomLoaded();
  } else {
    document.addEventListener('DOMContentLoaded', onDomLoaded);
  }

  function onDomLoaded() {
    var sceneEl = document.querySelector('a-scene');
    if (sceneEl.hasLoaded) {
      onSceneLoaded();
    } else {
      sceneEl.addEventListener('loaded', onSceneLoaded());
    }
  }

  function onSceneLoaded() {
    sharedBufferGeometryManager = new SharedBufferGeometryManager();
    sharedBufferGeometryManager.addSharedBuffer('strip-flat', materials.flat, THREE.TriangleStripDrawMode);
    sharedBufferGeometryManager.addSharedBuffer('strip-shaded', materials.shaded, THREE.TriangleStripDrawMode);
    sharedBufferGeometryManager.addSharedBuffer('strip-textured', materials.textured, THREE.TriangleStripDrawMode);
    sharedBufferGeometryManager.addSharedBuffer('tris-flat', materialsStamp.flat, THREE.TrianglesDrawMode);
    sharedBufferGeometryManager.addSharedBuffer('tris-shaded', materialsStamp.shaded, THREE.TrianglesDrawMode);
  }

  var materialsStamp = {
    shaded: new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      map: window.atlas.map,
      vertexColors: THREE.VertexColors,
      transparent: true,
      alphaTest: 0.5,
      roughness: 0.75,
      metalness: 0.25
    }),
    flat: new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: window.atlas.map,
      vertexColors: THREE.VertexColors,
      transparent: true,
      alphaTest: 0.5
    })
  };

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

          // this.idx++;
          //this.UVidx++;
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
    })(),

    computeVertexNormals: (function (){
      return function () {
        var pA = new THREE.Vector3();
        var pB = new THREE.Vector3();
        var pC = new THREE.Vector3();
        var cb = new THREE.Vector3();
        var ab = new THREE.Vector3();

        for (var i = 0, il = this.idx; i < il; i++) {
          this.normals[i] = 0;
        }

        var pair = true;
        for (i = 0, il = this.idx; i < il; i += 3) {
          if (pair) {
            pA.fromArray(this.vertices, i);
            pB.fromArray(this.vertices, i + 3);
            pC.fromArray(this.vertices, i + 6);
          } else {
            pA.fromArray(this.vertices, i + 3);
            pB.fromArray(this.vertices, i);
            pC.fromArray(this.vertices, i + 6);
          }
          pair = !pair;

          cb.subVectors(pC, pB);
          ab.subVectors(pA, pB);
          cb.cross(ab);
          cb.normalize();

          this.normals[i] += cb.x;
          this.normals[i + 1] += cb.y;
          this.normals[i + 2] += cb.z;

          this.normals[i + 3] += cb.x;
          this.normals[i + 4] += cb.y;
          this.normals[i + 5] += cb.z;

          this.normals[i + 6] += cb.x;
          this.normals[i + 7] += cb.y;
          this.normals[i + 8] += cb.z;
        }

        /*
        first and last vertice (0 and 8) belongs just to one triangle
        second and penultimate (1 and 7) belongs to two triangles
        the rest of the vertices belongs to three triangles
  
          1_____3_____5_____7
          /\    /\    /\    /\
         /  \  /  \  /  \  /  \
        /____\/____\/____\/____\
        0    2     4     6     8
        */

        // Vertices that are shared across three triangles
        for (i = 2 * 3, il = this.idx - 2 * 3; i < il; i++) {
          this.normals[i] = this.normals[i] / 3;
        }

        // Second and penultimate triangle, that shares just two triangles
        this.normals[3] = this.normals[3] / 2;
        this.normals[3 + 1] = this.normals[3 + 1] / 2;
        this.normals[3 + 2] = this.normals[3 * 1 + 2] / 2;

        this.normals[this.idx - 2 * 3] = this.normals[this.idx - 2 * 3] / 2;
        this.normals[this.idx - 2 * 3 + 1] = this.normals[this.idx - 2 * 3 + 1] / 2;
        this.normals[this.idx - 2 * 3 + 2] = this.normals[this.idx - 2 * 3 + 2] / 2;

        this.geometry.normalizeNormals();
      }
    })(),
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
