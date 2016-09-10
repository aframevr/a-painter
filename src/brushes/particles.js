/* globals AFRAME THREE */
var particles = {
  init: function (color, width) {
    this.material = new THREE.MeshStandardMaterial({
      color: this.data.color,
      roughness: 0.75,
      metalness: 0.25,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    });
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.particles= 

    // find scene camera
    this.camera= null;
    var entities = document.querySelectorAll('a-entity');
    for(var i = 0; i < entities.length; i++){
      if (entities[i].hasAttribute('look-controls')){
        this.camera= entities[i];
        break;
      }
    }
  },
  addPoint: function (position, rotation, pointerPosition, pressure, timestamp) {
    var box = new THREE.Mesh(this.geometry, this.material);

    var sca = pressure * 0.02 * Math.random();
    box.scale.set(sca, sca, sca);
    box.position.copy(pointerPosition);
    box.rotation.copy(rotation);

    this.object3D.add(box);

    return true;
  },
  tick: function (time, delta) {

  }
};

AFRAME.registerBrush('particles', particles);
