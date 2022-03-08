/* globals AFRAME Image FileReader */
window.addEventListener('load', function (event) {
  var dropArea = document.body;

  dropArea.addEventListener('dragover', function (event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, false);

  dropArea.addEventListener('drop', function (event) {
    event.stopPropagation();
    event.preventDefault();

    // for each dropped file
    var files = event.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      if (file.name.substring(file.name.length - 4).toLowerCase() === '.apa') {
        // a-painter binary
        var reader = new FileReader();

        // file read, parse obj and add to the scene
        reader.onload = function (event) {
          document.querySelector('a-scene').systems.brush.loadBinary(event.target.result);
        };
        reader.readAsArrayBuffer(file);
      }
      else if (file.name.substring(file.name.length - 5).toLowerCase() === '.json') {
        // a-painter json
        var reader = new FileReader();

        // file read, parse obj and add to the scene
        reader.onload = function (event) {
          document.querySelector('a-scene').systems.brush.loadJSON(JSON.parse(event.target.result));
        };
        reader.readAsText(file);
      } 
      else if (file.name.substring(file.name.length - 4).toLowerCase() === '.obj') {
        // OBJs
        reader = new FileReader();

        // file read, parse obj and add to the scene
        reader.onload = function (event) {
          var objloader = new AFRAME.THREE.OBJLoader();
          var mesh = objloader.parse(event.target.result);

          var entity = document.createElement('a-entity');
          // set all mesh objects to dark gray
          for (var o = 0; o < mesh.children.length; o++) {
            var child = mesh.children[o];
            if (child.material.constructor === Array) {
              child.material.forEach(mat => {
                mat.color.set('#333');
              })
            } else {
              child.material.color.set('#333');
            }
          }
          // add mesh to entity
          entity.setObject3D('mesh', mesh);
          entity.className = 'templateitem';
          document.querySelector('a-scene').appendChild(entity);
        };
        reader.readAsText(file);
      } else if (file.type.match(/image.*/)) {
        // dropping images
        reader = new FileReader();
        reader.onload = function (event) {
          // create img to get its size
          var img = new Image();
          img.src = event.target.result;

          img.onload = () => {
            // find good image size
            var width, height;
            if (img.width > img.height) {
              width = 1.0;
              height = img.height / img.width;
            } else {
              height = 1.0;
              width = img.width / img.height;
            }
  
            // find a random position in a side of the room
            var pos = [Math.random() * 3 - 1.5, 1 + Math.random() - 0.5, -1.4 + Math.random() * 0.2];
  
            // create a-image entity and set attributes
            var entity = document.createElement('a-image');
            entity.setAttribute('src', event.target.result);
            entity.setAttribute('position', pos.join(' '));
            entity.setAttribute('width', width);
            entity.setAttribute('height', height);
            entity.className = 'templateitem';
            document.querySelector('a-scene').appendChild(entity);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }, false);
});
