/* global AFRAME THREE */
(function () {
  var stamp = {

    init: function (color, brushSize) {
      this.idx = 0;
      this.geometry = new THREE.BufferGeometry();
      this.vertices = new Float32Array(this.options.maxPoints * 3 * 3 * 2);
      this.normals = new Float32Array(this.options.maxPoints * 3 * 3 * 2);
      this.uvs = new Float32Array(this.options.maxPoints * 2 * 3 * 2);

      this.geometry.setDrawRange(0, 0);
      this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setDynamic(true));
      this.geometry.addAttribute('uv', new THREE.BufferAttribute(this.uvs, 2).setDynamic(true));
      this.geometry.addAttribute('normal', new THREE.BufferAttribute(this.normals, 3).setDynamic(true));

      var mesh = new THREE.Mesh(this.geometry, this.getMaterial());
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

      mesh.frustumCulled = false;
      mesh.vertices = this.vertices;
      this.object3D.add(mesh);
    },

    getMaterial: function () {
      var map = this.materialOptions.map;
      var type = this.materialOptions.type;
      if (type === 'shaded') {
        return new THREE.MeshStandardMaterial({
          color: this.data.color,
          side: THREE.DoubleSide,
          map: map,
          transparent: true,
          alphaTest: 0.5,
          roughness: 0.75,
          metalness: 0.25
        });
      }
      return new THREE.MeshBasicMaterial({
        color: this.data.color,
        side: THREE.DoubleSide,
        map: map,
        transparent: true,
        alphaTest: 0.5
      });
    },

    addPoint: function (position, rotation, pointerPosition, pressure, timestamp) {
      // brush side
      var pi2 = Math.PI / 2;
      var dir = new THREE.Vector3();
      dir.set(1, 0, 0);
      dir.applyQuaternion(rotation);
      dir.normalize();

      // brush normal
      var axis = new THREE.Vector3();
      axis.set(0, 1, 0);
      axis.applyQuaternion(rotation);
      axis.normalize();

      var brushSize = this.data.size * pressure / 2;
      var brushAngle = Math.PI / 4 + Math.random() * this.angleJitter;

      if (this.autoRotate) {
        this.currAngle += 0.1;
        brushAngle += this.currAngle;
      }

      var a = pointerPosition.clone().add(dir.applyAxisAngle(axis, brushAngle).clone().multiplyScalar(brushSize));
      var b = pointerPosition.clone().add(dir.applyAxisAngle(axis, pi2).clone().multiplyScalar(brushSize));
      var c = pointerPosition.clone().add(dir.applyAxisAngle(axis, pi2).clone().multiplyScalar(brushSize));
      var d = pointerPosition.clone().add(dir.applyAxisAngle(axis, pi2).multiplyScalar(brushSize));

      var nidx = this.idx;
      // triangle 1
      this.vertices[ this.idx++ ] = a.x;
      this.vertices[ this.idx++ ] = a.y;
      this.vertices[ this.idx++ ] = a.z;

      this.vertices[ this.idx++ ] = b.x;
      this.vertices[ this.idx++ ] = b.y;
      this.vertices[ this.idx++ ] = b.z;

      this.vertices[ this.idx++ ] = c.x;
      this.vertices[ this.idx++ ] = c.y;
      this.vertices[ this.idx++ ] = c.z;

      // triangle 2

      this.vertices[ this.idx++ ] = c.x;
      this.vertices[ this.idx++ ] = c.y;
      this.vertices[ this.idx++ ] = c.z;

      this.vertices[ this.idx++ ] = d.x;
      this.vertices[ this.idx++ ] = d.y;
      this.vertices[ this.idx++ ] = d.z;

      this.vertices[ this.idx++ ] = a.x;
      this.vertices[ this.idx++ ] = a.y;
      this.vertices[ this.idx++ ] = a.z;

      // normals
      for (var i = 0; i < 6; i++) {
        this.normals[ nidx++ ] = axis.x;
        this.normals[ nidx++ ] = axis.y;
        this.normals[ nidx++ ] = axis.z;
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
      // triangle 1 uv
      this.uvs[ uv++ ] = Umin;
      this.uvs[ uv++ ] = 1;
      this.uvs[ uv++ ] = Umin;
      this.uvs[ uv++ ] = 0;
      this.uvs[ uv++ ] = Umax;
      this.uvs[ uv++ ] = 0;

      // triangle2 uv
      this.uvs[ uv++ ] = Umax;
      this.uvs[ uv++ ] = 0;
      this.uvs[ uv++ ] = Umax;
      this.uvs[ uv++ ] = 1;
      this.uvs[ uv++ ] = Umin;
      this.uvs[ uv++ ] = 1;

      this.geometry.attributes.normal.needsUpdate = true;
      this.geometry.attributes.position.needsUpdate = true;
      this.geometry.attributes.uv.needsUpdate = true;

      this.geometry.setDrawRange(0, this.data.numPoints * 6);

      return true;
    }
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

  var textureLoader = new THREE.TextureLoader();
  for (var i = 0; i < stamps.length; i++) {
    var definition = stamps[i];
    if (definition.materialOptions.textureSrc) {
      definition.materialOptions.map = textureLoader.load(definition.materialOptions.textureSrc);
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
