var BinaryWriter = function (bufferSize) {
  this.dataview = new DataView(new ArrayBuffer(bufferSize));
  this.offset = 0;
  this.isLittleEndian = true;
}

BinaryWriter.prototype = {
  writeVector: function (value) {
    this.writeArray(value.toArray(), this.isLittleEndian);
  },
  writeColor: function (value) {
    this.writeArray(value.toArray(), this.isLittleEndian);
  },
  writeUint32: function (value) {
    this.dataview.setUint32(this.offset, value, this.isLittleEndian);
    this.offset += 4;
  },
  writeFloat: function (value) {
    this.dataview.setFloat32(this.offset, value, this.isLittleEndian);
    this.offset += 4;
  },
  writeArray: function (value) {
    for (var i = 0; i < value.length; i++) {
      this.writeFloat(value[i]);
    }
  },
  getDataView: function () {
    return this.dataview;
  }
};
