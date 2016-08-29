function Lines() {
  this.lines = [];
  document.addEventListener('keyup', function(event){
    console.log(event.keyCode);

    if (event.keyCode === 76) {
      lines.loadBinary('apainter2.bin');
      /*
      var line = lines.addNewLine(new THREE.Color(1.0,0.5,0.2), 0.2);
      var initX = 4;
      var endX = 1;
      var initY = 5;
      var endY = 1;
      var rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0));
      line.setInitialPosition(new THREE.Vector3(initX, initY, 0), rotation);
      var rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0));
      line.addPoint(new THREE.Vector3(endX + 0, endY, 0), rotation, 1.0);
      console.log(line.mesh.geometry.attributes.position);
      */
//      line.addPoint(new THREE.Vector3(endX + 1, endY, 0), rotation, 1.0);
  //    line.addPoint(new THREE.Vector3(endX + 2, endY, 0), rotation, 1.0);
/*
      var entity = document.createElement('a-entity');
      document.querySelector('a-scene').appendChild(entity);
      entity.object3D.add(line.mesh);
*/
    }
    if (event.keyCode === 85) { // u
      // Upload
      var dataviews = this.getBinary();
      var blob = new Blob(dataviews, {type: 'application/octet-binary'});

      //var file = fileInput;
      var fd = new FormData();
      fd.append("file", blob);
      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'https://file.io'); // ?expires=1y
      xhr.onreadystatechange = function (data) {
        if (xhr.readyState == 4) {
          var response = JSON.parse(xhr.response);
          if (response.success) {
            alert('Drawing uploaded correctly\nPlease use this link to share it:\n' + 'http://dev.fernandojsg.com/a-painter/?url=' + response.link);
            console.log('Uploaded link: ' + 'http://dev.fernandojsg.com/a-painter/?url=' + response.link);
          }
        } else {
          // alert('An error occurred while uploading the drawing, please try again');
        }
      };
      xhr.send(fd);

/*
      var file = uploadcare.fileFrom('object', blob);
      file.done(function(fileInfo) {
        console.log(fileInfo);
      });
*/
    }
    if (event.keyCode === 86) { // v
      var dataviews = this.getBinary();
      var blob = new Blob(dataviews, {type: 'application/octet-binary'});
      // FileSaver.js defines `saveAs` for saving files out of the browser
      var filename = "apainter.bin";
      saveAs(blob, filename);
    }
  }.bind(this));
}

/* global AFRAME THREE */
Lines.prototype = {
    addNewLine: function(color, lineWidth) {
      var line = new Line(color, lineWidth);
      this.lines.push(line);
      return line;
    },
    getBinary: function() {
      var dataViews = [];

      var binaryWriter = new BinaryWriter(4);
      var isLittleEndian = true;
      binaryWriter.writeUint32(this.lines.length, isLittleEndian);
      dataViews.push(binaryWriter.getDataView());

      for (var i=0;i<this.lines.length; i++) {
        dataViews.push(this.lines[i].getBinary());
      }
      return dataViews;
    },
    loadBinary: function (url) {

      var loader = new THREE.XHRLoader(this.manager);
      loader.setResponseType('arraybuffer');

      loader.load(url, function (buffer) {
        var offset = 0;
        var data = new DataView(buffer);

        function readQuaternion() {
          var output = new THREE.Quaternion(
            data.getFloat32(offset, true),
            data.getFloat32(offset + 4, true),
            data.getFloat32(offset + 8, true),
            data.getFloat32(offset + 12, true)
          );
          offset+=16;
          return output;
        }

        function readVector3() {
          var output = new THREE.Vector3(
            data.getFloat32(offset, true),
            data.getFloat32(offset + 4, true),
            data.getFloat32(offset + 8, true)
          );
          offset+=12;
          return output;
        }

        function readColor() {
          var output = new THREE.Color(
            data.getFloat32(offset, true),
            data.getFloat32(offset + 4, true),
            data.getFloat32(offset + 8, true)
          );
          offset+=12;
          return output;
        }

        function readFloat() {
          var output = data.getFloat32(offset, true);
          offset+=4;
          return output;
        }

        function readInt() {
          var output = data.getUint32(offset, true);
          offset+=4;
          return output;
        }

        var numLines = readInt();
        for (var l = 0; l < numLines; l++) {
          var color = readColor();
          var numPoints = readInt();

          var lineWidth = 0.01;
          var line = lines.addNewLine(color, lineWidth);

          var entity = document.createElement('a-entity');
          document.querySelector('a-scene').appendChild(entity);
          entity.object3D.add(line.mesh);
          var prev = new THREE.Vector3();
          for (var i = 0; i < numPoints; i++) {
            var point = readVector3();
            var quat = readQuaternion();
            var intensity = readFloat();
            if (point.equals(prev)) {
              continue;
            }
            prev=point.clone();
            if (i==0) {
              line.setInitialPosition(point, quat);
            } else {
              line.addPoint(point, quat, intensity);
            }
          }


          line.computeNormals();

          var vnh = new THREE.VertexNormalsHelper( line.mesh, 0.01 );
      		document.querySelector('a-scene').object3D.add(vnh);

/*
          var i = 0;
          var interval = setInterval(function(){
            var point = readVector3();
            var quat = readQuaternion();
            var intensity = readFloat();

            if (i==0) {
              line.setInitialPosition(point, quat);
            } else {
              line.addPoint(point, quat, intensity);
            }

            if (++i === numPoints) {
              clearInterval(interval);
            }
          }, 10);
*/
        }
      });
    }
};

var lines = new Lines();
