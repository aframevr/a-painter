var droparea = document.body;

droparea.addEventListener('dragover', function(event) {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}, false);

droparea.addEventListener('drop', function(event) {
  event.stopPropagation();
  event.preventDefault();

  //for each dropped file
  var files = event.dataTransfer.files;
  for (var i = 0, file; file = files[i]; i++) {
    // OBJs
    if (file.name.substr(file.name.length - 4).toLowerCase() == '.obj') {
      var reader = new FileReader();

      // file read, parse obj and add to the scene
      reader.onload = function(event) {
        var objloader = new AFRAME.THREE.OBJLoader();
        var mesh = objloader.parse(event.target.result)

        var entity = document.createElement('a-entity');
        // set all mesh objects to dark gray
        for(var o = 0; o < mesh.children.length; o++){
          var child = mesh.children[o];
          child.material.color.set('#333');
        }
        // add mesh to entity
        entity.setObject3D('mesh', mesh);
        document.querySelector('a-scene').appendChild(entity);
      }
      reader.readAsText(file);
    } 

    // dropping images
    else if (file.type.match(/image.*/)) {
      var reader = new FileReader();
      reader.onload = function(event) {
        
        // create img to get its size
        var img = new Image();
        img.src = event.target.result;
        
        // find good image size
        var width, height;
        if (img.width > img.height){
          width = 1.0; 
          height = img.height / img.width;
        }
        else{
          height = 1.0; 
          width = img.width / img.height;
        }

        // find a random position in a side of the room
        var pos = [ Math.random() * 3 - 1.5, 1 + Math.random() - 0.5, -1.4 + Math.random() * 0.2];

        //create a-image entity and set attributes
        var entity = document.createElement('a-image');
        entity.setAttribute('src', event.target.result);
        entity.setAttribute('position', pos.join(' '));
        entity.setAttribute('width', width);
        entity.setAttribute('height', height);
        document.querySelector('a-scene').appendChild(entity);
      }
      reader.readAsDataURL(file); 
    } 
  }
}, false);