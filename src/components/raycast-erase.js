AFRAME.registerComponent('erase-raycast', {
  init: function () {
    this.el.addEventListener('raycaster-intersected', function (evt) {
      var el = evt.detail.target;
      // May get two intersection events per tick; same element, different faces.
      console.log('raycaster-intersected ' + el.outerHTML);
      el.setAttribute('material', 'color', '#7f7');
    });

    this.el.addEventListener('raycaster-intersected-cleared', function (evt) {
      var el = evt.detail.target;
      // May get two intersection events per tick; same element, different faces.
      console.log('raycaster-intersected-cleared ' + el.outerHTML);
      el.setAttribute('material', 'color', '#f77');
    });
  }
});