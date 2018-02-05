module.exports = function (callback) {
  if (document.readyState === 'complete' || document.readyState === 'loaded') {
    onDomLoaded();
  } else {
    document.addEventListener('DOMContentLoaded', onDomLoaded);
  }

  function onDomLoaded() {
    var sceneEl = document.querySelector('a-scene');
    if (sceneEl.hasLoaded) {
      callback();
    } else {
      sceneEl.addEventListener('loaded', callback());
    }
  }
}