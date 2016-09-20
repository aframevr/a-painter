/* globals THREE */
window.BinaryManager = function (buffer) {
  this.dataview = new DataView(buffer);
  this.offset = 0;
  this.isLittleEndian = true;
};

window.BinaryManager.prototype = {
  // READER
  readQuaternion: function () {
    return new THREE.Quaternion(
      this.readFloat(),
      this.readFloat(),
      this.readFloat(),
      this.readFloat()
    );
  },
  readVector3: function () {
    return new THREE.Vector3(
      this.readFloat(),
      this.readFloat(),
      this.readFloat()
    );
  },
  readString: function () {
    var length = this.dataview.getUint8(this.offset++, true);
    var output = '';
    for (var i = 0; i < length; i++) {
      output += String.fromCharCode(this.dataview.getUint8(this.offset++, true));
    }
    return output;
  },
  readColor: function () {
    return new THREE.Color(
      this.readFloat(),
      this.readFloat(),
      this.readFloat()
    );
  },
  readFloat: function () {
    var output = this.dataview.getFloat32(this.offset, true);
    this.offset += 4;
    return output;
  },
  readUint32: function () {
    var output = this.dataview.getUint32(this.offset, true);
    this.offset += 4;
    return output;
  },
  readUint16: function () {
    var output = this.dataview.getUint16(this.offset, true);
    this.offset += 2;
    return output;
  },
  readUint8: function () {
    var output = this.dataview.getUint8(this.offset, true);
    this.offset++;
    return output;
  },
  // WRITER
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
