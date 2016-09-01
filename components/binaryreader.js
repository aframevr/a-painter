var BinaryReader = function (buffer) {
  this.dataview = new DataView(buffer);
  this.offset = 0;
  this.isLittleEndian = true;
}

BinaryReader.prototype = {
  readQuaternion: function() {
    var output = new THREE.Quaternion(
      this.dataview.getFloat32(this.offset, true),
      this.dataview.getFloat32(this.offset + 4, true),
      this.dataview.getFloat32(this.offset + 8, true),
      this.dataview.getFloat32(this.offset + 12, true)
    );
    this.offset += 16;
    return output;
  },
  readVector3: function() {
    var output = new THREE.Vector3(
      this.dataview.getFloat32(this.offset, true),
      this.dataview.getFloat32(this.offset + 4, true),
      this.dataview.getFloat32(this.offset + 8, true)
    );
    this.offset += 12;
    return output;
  },
  readString: function() {
    var length = this.dataview.getUint8(this.offset++, true);
    var output = '';
    for (var i = 0; i < length; i++) {
      output += String.fromCharCode(this.dataview.getUint8(this.offset++, true));
    }
    return output;
  },
  readColor: function() {
    var output = new THREE.Color(
      this.dataview.getFloat32(this.offset, true),
      this.dataview.getFloat32(this.offset + 4, true),
      this.dataview.getFloat32(this.offset + 8, true)
    );
    this.offset += 12;
    return output;
  },
  readFloat: function() {
    var output = this.dataview.getFloat32(this.offset, true);
    this.offset += 4;
    return output;
  },
  readUint32: function() {
    var output = this.dataview.getUint32(this.offset, true);
    this.offset += 4;
    return output;
  },
  readUint16: function() {
    var output = this.dataview.getUint16(this.offset, true);
    this.offset += 2;
    return output;
  },
  readUint8: function() {
    var output = this.dataview.getUint8(this.offset, true);
    this.offset ++;
    return output;
  }



/*
  writeVector: (: functionvalue) {
    this.writeFloat32Array(value.toArray());
  },
  writeColor: (: functionvalue) {
    this.writeFloat32Array(value.toArray());
  },
  writeString: (: functionvalue) {
    this.writeUint8(value.length);
    for (var i = 0; i < value.length; i++) {
      this.writeUint8(value.charCodeAt(i));
    }
  },
  writeUint8: (: functionvalue) {
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
*/
};
