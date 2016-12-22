/* globals AFRAME */
AFRAME.registerSystem('ui', {
  init: function () {
    this.initTextures();
  },

  initTextures: function () {
    var self = this;
    var hoverTextureUrl = 'assets/images/ui-hover.png';
    var pressedTextureUrl = 'assets/images/ui-pressed.png';
    this.sceneEl.systems.material.loadTexture(hoverTextureUrl, {src: hoverTextureUrl}, onLoadedHoverTexture);
    this.sceneEl.systems.material.loadTexture(pressedTextureUrl, {src: pressedTextureUrl}, onLoadedPressedTexture);
    function onLoadedHoverTexture (texture) {
      self.hoverTexture = texture;
    }
    function onLoadedPressedTexture (texture) {
      self.pressedTexture = texture;
    }
  },

  closeAll: function () {
    var els = document.querySelectorAll('[ui]');
    var i;
    for (i = 0; i < els.length; i++) {
      els[i].components.ui.close();
    }
  }
});
