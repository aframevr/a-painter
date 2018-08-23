AFRAME.registerComponent('vr-analytics', {
  init: function () {
    var el = this.el;
    var emitted = false;

    el.addEventListener('enter-vr', function () {
      if (emitted || !AFRAME.utils.device.checkHeadsetConnected() ||
          AFRAME.utils.device.isMobile()) { return; }
      ga('send', 'event', 'General', 'entervr');
      emitted = true;
    });
  }
});
