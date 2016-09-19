/* globals AFRAME THREE */
AFRAME.registerComponent('line', {
  schema: {
    start: {type: 'vec3', default: '0 0 0'},
    end: {type: 'vec3', default: '0 0 0'}
  },

  init: function () {
    var material = new THREE.LineBasicMaterial({color: 0xffffff});
    var geometry = this.geometry = new THREE.Geometry();
    this.line = new THREE.Line(geometry, material);
    this.el.setObject3D('line', this.line);
  },

  update: function () {
    var vertices = [];
    var start = this.data.start;
    var end = this.data.end;
    var halfX = (start.x + end.x) / 2;
    var halfY = (start.y + end.y) / 2;
    var halfZ = (start.z + end.z) / 2;
    var half = new THREE.Vector3(halfX, halfY, halfZ);
    vertices.push(start);
    vertices.push(half);
    vertices.push(end);
    this.geometry.vertices = vertices;
    this.geometry.verticesNeedUpdate = true;
  }

});
