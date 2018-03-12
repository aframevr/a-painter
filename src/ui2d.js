/* global Clipboard */
window.addEventListener('load', function (event) {
  var apainterUI = document.getElementById('apainter-ui');
  var shareDiv = document.querySelector('#apainter-ui .share');
  var shareUrl = document.getElementById('apainter-share-url');
  var progressDiv = document.querySelector('#apainter-ui .progress');
  var progressBar = document.querySelector('#apainter-ui .bar');
  document.addEventListener('drawing-upload-completed', function (event) {
    if (AFRAME.scenes[0].systems.xr.supportAR) {
      return;
    }
    shareDiv.classList.remove('hide');
    progressDiv.classList.add('hide');
    shareUrl.value = event.detail.url;
  });

  document.addEventListener('drawing-upload-started', function (event) {
    if (AFRAME.scenes[0].systems.xr.supportAR) {
      return;
    }
    apainterUI.style.display = 'block';
    shareDiv.classList.add('hide');
    progressDiv.classList.remove('hide');
  });

  document.addEventListener('drawing-upload-progress', function (event) {
    if (AFRAME.scenes[0].systems.xr.supportAR) {
      return;
    }
    progressBar.style.width = Math.floor(event.detail.progress * 100) + '%';
  });

  var clipboard = new Clipboard('.button.copy');
  clipboard.on('error', function (e) {
    console.error('Error copying to clipboard:', e.action, e.trigger);
  });
});
