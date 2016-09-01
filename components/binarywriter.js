var BinaryWriter = function (bufferSize) {
  this.dataview = new DataView(new ArrayBuffer(bufferSize));
  this.offset = 0;
  this.isLittleEndian = true;
}

BinaryWriter.prototype = {
  writeVector: function (value) {
    this.writeFloat32Array(value.toArray());
  },
  writeColor: function (value) {
    this.writeFloat32Array(value.toArray());
  },
  writeString: function (value) {
    this.writeUint8(value.length);
    for (var i = 0; i < value.length; i++) {
      this.writeUint8(value.charCodeAt(i));
    }
  },
  writeUint8: function (value) {
    this.dataview.setUint8(this.offset, value, this.isLittleEndian);
    this.offset ++;
  },
  writeUint16: function (value) {
    this.dataview.setUint16(this.offset, value, this.isLittleEndian);
    this.offset += 2;
  },
  writeUint32: function (value) {
    this.dataview.setUint32(this.offset, value, this.isLittleEndian);
    this.offset += 4;
  },
  writeFloat32: function (value) {
    this.dataview.setFloat32(this.offset, value, this.isLittleEndian);
    this.offset += 4;
  },
  writeFloat32Array: function (value) {
    for (var i = 0; i < value.length; i++) {
      this.writeFloat32(value[i]);
    }
  },
  getDataView: function () {
    return this.dataview;
  }
};
