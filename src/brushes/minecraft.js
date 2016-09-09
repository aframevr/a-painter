/* globals THREE, AFRAME */

// global state of the voxel cube
var MCGRIDSIZE = 128;
var MCROOMSIZE = 2.0; // 2x2x2m room size
var MCGRID = new Array(MCGRIDSIZE);

for (var mi = 0; mi < MCGRIDSIZE; mi++) {
  MCGRID[mi] = new Array(MCGRIDSIZE);
  for (var mj = 0; mj < MCGRIDSIZE; mj++) {
    MCGRID[mi][mj] = new Array(MCGRIDSIZE);
    for (var mk = 0; mk < MCGRIDSIZE; mk++) {
      MCGRID[mi][mj][mk] = false; // instead of false, we should have the threejs mesh
    }
  }
}
var MCVOXELSIZE = MCROOMSIZE / MCGRIDSIZE;
// var mcGridHelper = null;

var minecraft = {
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
    this.mesh = new THREE.Group();
    this.object3D.add(this.mesh);
    /*
    if (mcGridHelper == null) {
      mcGridHelper= document.createElement('a-box');
      mcGridHelper.setAttribute('depth', MCROOMSIZE);
      mcGridHelper.setAttribute('height', MCROOMSIZE);
      mcGridHelper.setAttribute('width', MCROOMSIZE);
      mcGridHelper.setAttribute('position', '0 '+Math.floor(MCROOMSIZE / 2)+' 0');
      mcGridHelper.setAttribute('material', 'color: #ccc, shader:flat, wireframe:true');
      document.querySelector('a-scene').appendChild(mcGridHelper);
    }
    mcGridHelper.visible= true;
    */
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
    var voxelx = Math.floor((position.x + MCROOMSIZE / 2) / 2 * MCGRIDSIZE);
    var voxely = Math.floor(position.y * MCGRIDSIZE);
    var voxelz = Math.floor((position.z + MCROOMSIZE / 2) / 2 * MCGRIDSIZE);

    // out of voxel cube
    if (voxelx < 0 || voxelx >= MCGRIDSIZE) return;
    if (voxely < 0 || voxely >= MCGRIDSIZE) return;
    if (voxelz < 0 || voxelz >= MCGRIDSIZE) return;

    if (MCGRID[voxelx][voxely][voxelz]) return;

    MCGRID[voxelx][voxely][voxelz] = true;
    var geometry = new THREE.BoxGeometry(MCVOXELSIZE, MCVOXELSIZE, MCVOXELSIZE);
    var voxel = new THREE.Mesh(geometry, this.material);

    var voxelpos = new THREE.Vector3();
    voxelpos.set(
      Math.floor(position.x / MCVOXELSIZE) * MCVOXELSIZE,
      Math.floor(position.y / MCVOXELSIZE) * MCVOXELSIZE,
      Math.floor(position.z / MCVOXELSIZE) * MCVOXELSIZE
      );
    voxel.position.copy(voxelpos);

    this.mesh.add(voxel);
/*    this.numPoints++;

    this.points.push({
      'position': position,
      'rotation': rotation,
      'intensity': intensity
    });
*/
    return true;
  }
};

AFRAME.APAINTER.registerBrush('minecraft', minecraft, {thumbnail: '', spacing: MCVOXELSIZE / 2});
