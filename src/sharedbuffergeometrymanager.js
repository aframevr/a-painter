var SharedBufferGeometry = require('./sharedbuffergeometry.js');

function SharedBufferGeometryManager () {
  this.sharedBuffers = {};
}

SharedBufferGeometryManager.prototype = {
  addSharedBuffer: function (name, material) {
    var bufferGeometry = new SharedBufferGeometry(material);
    this.sharedBuffers[name] = bufferGeometry;
  },

  getSharedBuffer: function (name) {
    return this.sharedBuffers[name];
  }
};

module.exports = new SharedBufferGeometryManager();
