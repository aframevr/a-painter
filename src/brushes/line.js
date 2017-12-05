/* globals AFRAME THREE */
(function () {
  var optionsBasic = {
    vertexColors: THREE.VertexColors,
    side: THREE.DoubleSide
  };

  var optionsStandard = {
    roughness: 0.75,
    metalness: 0.25,
    vertexColors: THREE.VertexColors,
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
  }

  var materials = {
    flat: new THREE.MeshBasicMaterial(optionsStandard),
    shaded: new THREE.MeshStandardMaterial(optionsBasic),
    textured: new THREE.MeshStandardMaterial(optionTextured)
  };

  var line = {

    init: function (color, brushSize) {
      this.idx = 0;
      this.geometry = new THREE.BufferGeometry();
      this.vertices = new Float32Array(this.options.maxPoints * 3 * 3);
      this.normals = new Float32Array(this.options.maxPoints * 3 * 3);
      this.uvs = new Float32Array(this.options.maxPoints * 2 * 2);
      this.colors = new Float32Array(this.options.maxPoints * 2 * 2);
      
      this.geometry.setDrawRange(0, 0);
      this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setDynamic(true));
      this.geometry.addAttribute('uv', new THREE.BufferAttribute(this.uvs, 2).setDynamic(true));
      this.geometry.addAttribute('normal', new THREE.BufferAttribute(this.normals, 3).setDynamic(true));
      this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 3).setDynamic(true));

      var mesh = new THREE.Mesh(this.geometry, this.getMaterial());
      mesh.drawMode = THREE.TriangleStripDrawMode;

      mesh.frustumCulled = false;
      mesh.vertices = this.vertices;

      this.object3D.add(mesh);
    },

    getMaterial: function () {
      return materials[this.materialOptions.type];
    },

    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {
      var uv = 0;
      var converter = this.materialOptions.converter;

      for (i = 0; i < this.data.numPoints; i++) {
        this.uvs[uv++] = converter.convertU(i / (this.data.numPoints - 1));
        this.uvs[uv++] = converter.convertV(0);

        this.uvs[uv++] = converter.convertU(i / (this.data.numPoints - 1));
        this.uvs[uv++] = converter.convertV(1);
      }

      var direction = new THREE.Vector3();
      direction.set(1, 0, 0);
      direction.applyQuaternion(orientation);
      direction.normalize();

      var posA = pointerPosition.clone();
      var posB = pointerPosition.clone();
      var brushSize = this.data.size * pressure;
      posA.add(direction.clone().multiplyScalar(brushSize / 2));
      posB.add(direction.clone().multiplyScalar(-brushSize / 2));

      /*
        2---3
        | \ |
        0---1

      */
      var idx = this.idx;

      this.vertices[ idx++ ] = posA.x;
      this.vertices[ idx++ ] = posA.y;
      this.vertices[ idx++ ] = posA.z;

      this.vertices[ idx++ ] = posB.x;
      this.vertices[ idx++ ] = posB.y;
      this.vertices[ idx++ ] = posB.z;

      idx = this.idx;

      // Colors
      this.colors[ idx++ ] = this.data.color.r;
      this.colors[ idx++ ] = this.data.color.g;
      this.colors[ idx++ ] = this.data.color.b;

      this.colors[ idx++ ] = this.data.color.r;
      this.colors[ idx++ ] = this.data.color.g;
      this.colors[ idx++ ] = this.data.color.b;

      this.idx += 6;

      this.computeVertexNormals();
      this.geometry.attributes.normal.needsUpdate = true;
      this.geometry.attributes.position.needsUpdate = true;
      this.geometry.attributes.uv.needsUpdate = true;

      this.geometry.setDrawRange(0, this.data.numPoints * 2);

      return true;
    },

    computeVertexNormals: function () {
      var pA = new THREE.Vector3();
      var pB = new THREE.Vector3();
      var pC = new THREE.Vector3();
      var cb = new THREE.Vector3();
      var ab = new THREE.Vector3();

      for (var i = 0, il = this.idx; i < il; i++) {
        this.normals[ i ] = 0;
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

        this.normals[ i ] += cb.x;
        this.normals[ i + 1 ] += cb.y;
        this.normals[ i + 2 ] += cb.z;

        this.normals[ i + 3 ] += cb.x;
        this.normals[ i + 4 ] += cb.y;
        this.normals[ i + 5 ] += cb.z;

        this.normals[ i + 6 ] += cb.x;
        this.normals[ i + 7 ] += cb.y;
        this.normals[ i + 8 ] += cb.z;
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
        this.normals[ i ] = this.normals[ i ] / 3;
      }

      // Second and penultimate triangle, that shares just two triangles
      this.normals[ 3 ] = this.normals[ 3 ] / 2;
      this.normals[ 3 + 1 ] = this.normals[ 3 + 1 ] / 2;
      this.normals[ 3 + 2 ] = this.normals[ 3 * 1 + 2 ] / 2;

      this.normals[ this.idx - 2 * 3 ] = this.normals[ this.idx - 2 * 3 ] / 2;
      this.normals[ this.idx - 2 * 3 + 1 ] = this.normals[ this.idx - 2 * 3 + 1 ] / 2;
      this.normals[ this.idx - 2 * 3 + 2 ] = this.normals[ this.idx - 2 * 3 + 2 ] / 2;

      this.geometry.normalizeNormals();
    }
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
