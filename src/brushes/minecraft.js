// global state of the voxel cube
var MC_grid_size = 128;
var MC_room_size = 2.0; //2x2x2m room size
var MC_grid = new Array(MC_grid_size);

for(mi = 0; mi < MC_grid_size; mi++){
  MC_grid[mi] = new Array(MC_grid_size);
  for(mj = 0; mj < MC_grid_size; mj++){
    MC_grid[mi][mj] = new Array(MC_grid_size);
    for(mk = 0; mk < MC_grid_size; mk++){
      MC_grid[mi][mj][mk] = false; //instead of false, we should have the threejs mesh
    }
  }
}
var MC_voxel_size = MC_room_size/MC_grid_size;


var minecraft = {
  init: function(color, width) {
    this.points = [];
    this.prevPoint = null;
    this.lineWidth = width;
    this.lineWidthModifier = 0.0;
    this.color = color.clone();

    this.idx = 0;
    this.numPoints = 0;
    this.maxPoints = 1000;
    this.material = this.getMaterial();
    this.object3D.add( new THREE.Group() );
  },
  getMaterial: function() {
    return new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.75,
      metalness: 0.25,
      side: THREE.FrontSide,
      shading: THREE.FlatShading
    });
  },
  addPoint: function (position, rotation, pointerPosition, pressure, timestamp) {
    var posBase = pointerPosition;

    var voxelx = Math.floor((position.x + MC_room_size / 2) / 2 * MC_grid_size);
    var voxely = Math.floor( position.y * MC_grid_size );
    var voxelz = Math.floor((position.z + MC_room_size / 2) / 2 * MC_grid_size);

    //out of voxel cube
    if (voxelx < 0 || voxelx > MC_grid_size) return;
    if (voxely < 0 || voxely > MC_grid_size) return;
    if (voxelz < 0 || voxelz > MC_grid_size) return;

    if (MC_grid[voxelx][voxely][voxelz]) return;

    MC_grid[voxelx][voxely][voxelz] = true;
    var geometry = new THREE.BoxGeometry(MC_voxel_size,MC_voxel_size,MC_voxel_size);
    var voxel = new THREE.Mesh( geometry, this.material );

    var voxelpos = new THREE.Vector3();
    voxelpos.set(
      Math.floor(position.x/MC_voxel_size)*MC_voxel_size,
      Math.floor(position.y/MC_voxel_size)*MC_voxel_size,
      Math.floor(position.z/MC_voxel_size)*MC_voxel_size
      )
    voxel.position.copy(voxelpos);

    this.mesh.add(voxel);
/*    this.numPoints++;

    this.points.push({
      'position': position,
      'rotation': rotation,
      'intensity': intensity
    });*/
    return true;
  }
};

AFRAME.APAINTER.registerBrush('minecraft', minecraft, { thumbnail: '', spacing: MC_voxel_size / 2});
