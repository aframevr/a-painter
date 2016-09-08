/*
//disable uploadcare dragndrop
uploadcare.plugin(function(uploadcare) {
  var $ = uploadcare.jQuery;
  uploadcare.utils.abilities.fileDragAndDrop = false;
  uploadcare.utils.abilities.dragAndDrop = false;
  uploadcare.dragdrop.support = false;
  uploadcare.dragdrop.receiveDrop = function(){};
  $(document).off('dragenter dragleave drop mouseenter');
});
*/

var droparea= document.body;

droparea.addEventListener('dragover', function(e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
}, false);

droparea.addEventListener('drop', function(e) {
  e.stopPropagation();
  e.preventDefault();
  var files = e.dataTransfer.files;
  for (var i=0, file; file=files[i]; i++) {
    //objs
    if (file.name.substr(file.name.length-4).toLowerCase()=='.obj') {
      var reader = new FileReader();
      reader.onload = function(e2) {
      
        var entity = document.createElement('a-entity');
        document.querySelector('a-scene').appendChild(entity);
        entity.addAttribute('obj-model', 'obj:src()')
        img.src= e2.target.result;
        document.body.appendChild(img);
      }
      reader.readAsDataURL(file); 
    } 
    //images
    else if (file.type.match(/image.*/)) {
      var reader = new FileReader();
      reader.onload = function(e2) {
        var img = document.createElement('img');
        img.src= e2.target.result;
        document.body.appendChild(img);
      }
      reader.readAsDataURL(file); 
    } 

  }
}, false);