(function(){

  document.addEventListener('drawing-uploaded', function(value) {
    var event = new Event('build');
    elem.dispatchEvent(event);
  });

})();
