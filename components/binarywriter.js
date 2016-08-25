var BinaryWriter = function(bufferSize) {
  this.dataview = new DataView(new ArrayBuffer(bufferSize));
  this.offset = 0;
}

BinaryWriter.prototype = {
  writeVector: function(vector, isLittleEndian) {
    this.writeFloat(vector.x, isLittleEndian);
    this.writeFloat(vector.y, isLittleEndian);
    this.writeFloat(vector.z, isLittleEndian);
  },
  writeColor: function(vector, isLittleEndian) {
    this.writeFloat(vector.r, isLittleEndian);
    this.writeFloat(vector.g, isLittleEndian);
    this.writeFloat(vector.b, isLittleEndian);
  },
  writeUint32: function(int, isLittleEndian) {
    this.dataview.setUint32(this.offset, int, isLittleEndian);
    this.offset += 4;
  },
  writeFloat: function(float, isLittleEndian) {
    this.dataview.setFloat32(this.offset, float, isLittleEndian);
    this.offset += 4;
  },
  writeArray: function(array, isLittleEndian) {
    for (var i=0;i<array.length;i++) {
      this.writeFloat(array[i], isLittleEndian);
    }
  },
  getDataView: function() {
    return this.dataview;
  }
};
