/* globals THREE AFRAME */

// global state of the voxel cube
var VOXELS = {
  mcgridsize: 128,
  mcroomsize: 2.0 // 2x2x2m room size
};
VOXELS.mcgrid = new Array(VOXELS.mcgridsize);
VOXELS.mcvoxelsize = VOXELS.mcroomsize / VOXELS.mcgridsize;

for (var mi = 0; mi < VOXELS.mcgridsize; mi++) {
  VOXELS.mcgrid[mi] = new Array(VOXELS.mcgridsize);
  for (var mj = 0; mj < VOXELS.mcgridsize; mj++) {
    VOXELS.mcgrid[mi][mj] = new Array(VOXELS.mcgridsize);
    for (var mk = 0; mk < VOXELS.mcgridsize; mk++) {
      VOXELS.mcgrid[mi][mj][mk] = null; // instead of false, we should have the threejs mesh
    }
  }
}

var voxels = {
  init: function (color, width) {
    this.points = [];
    this.prevPoint = null;
    this.lineWidth = width;
    this.lineWidthModifier = 0.0;
    this.color = color.clone();

    this.idx = 0;
    this.numPoints = 0;
    this.maxPoints = 1000;
    this.material = this.getMaterial();
    this.voxels = [];
    this.animate = true;
  },
  getMaterial: function () {
    return new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.75,
      metalness: 0.25,
      side: THREE.FrontSide,
      shading: THREE.FlatShading
    });
  },
  addPoint: function (position, rotation, pointerPosition, pressure, timestamp) {
    var posx = pointerPosition.x + VOXELS.mcvoxelsize / 2;
    var posy = pointerPosition.y + VOXELS.mcvoxelsize / 2;
    var posz = pointerPosition.z + VOXELS.mcvoxelsize / 2;

    var voxelx = Math.floor((posx - VOXELS.mcvoxelsize + VOXELS.mcroomsize / 2) / 2 * VOXELS.mcgridsize);
    var voxely = Math.floor(posy / VOXELS.mcroomsize * VOXELS.mcgridsize);
    var voxelz = Math.floor((posz - VOXELS.mcvoxelsize + VOXELS.mcroomsize / 2) / 2 * VOXELS.mcgridsize);

    // out of voxel cube
    if (voxelx < 0 || voxelx >= VOXELS.mcgridsize) return;
    if (voxely < 0 || voxely >= VOXELS.mcgridsize) return;
    if (voxelz < 0 || voxelz >= VOXELS.mcgridsize) return;

    if (VOXELS.mcgrid[voxelx][voxely][voxelz]) {
      VOXELS.mcgrid[voxelx][voxely][voxelz].material = this.material;
      return;
    }

    var geometry = new THREE.BoxGeometry(VOXELS.mcvoxelsize, VOXELS.mcvoxelsize, VOXELS.mcvoxelsize);
    var voxel = new THREE.Mesh(geometry, this.material);

    voxel.startTime = timestamp;
    voxel.animate = true;
    voxel.scale.set(0.01, 0.01, 0.01);

    var voxelpos = new THREE.Vector3();
    voxelpos.set(
      Math.floor(posx / VOXELS.mcvoxelsize) * VOXELS.mcvoxelsize,
      Math.floor(posy / VOXELS.mcvoxelsize) * VOXELS.mcvoxelsize,
      Math.floor(posz / VOXELS.mcvoxelsize) * VOXELS.mcvoxelsize
      );
    voxel.position.copy(voxelpos);

    VOXELS.mcgrid[voxelx][voxely][voxelz] = voxel;
    this.voxels.push(voxel);
    this.object3D.add(voxel);
    return true;
  },
  tick: function (time, delta) {
    if (!this.animate) return;
    var numvoxels = this.voxels.length;
    var voxelMesh;
    var stillAnimating = false;
    for (var i = numvoxels - 1; i >= 0; i--) {
      voxelMesh = this.voxels[i];
      if (voxelMesh.animate) {
        stillAnimating = true;
        var s = Math.max(0, Math.min(1, (time - voxelMesh.startTime) / 100));
        if (s >= 1) voxelMesh.animate = false;
        voxelMesh.scale.set(s, s, s);
      }
    }
    if (numvoxels && !stillAnimating) this.animate = false;
  }
};

AFRAME.registerBrush('voxels', voxels, {thumbnail: 'brushes/thumb_voxels.png', spacing: VOXELS.mcvoxelsize / 2});
