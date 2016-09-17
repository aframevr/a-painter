/* global Clipboard */
window.onload = function (event) {
  var shareDiv = document.getElementById('share');
  var shareUrl = document.getElementById('share-url');
  document.addEventListener('drawing-upload-completed', function (event) {
    shareDiv.classList.remove('hide');
    shareUrl.value = event.detail.url;
  });

  document.addEventListener('drawing-upload-started', function (event) {
    shareDiv.classList.add('hide');
  });

  document.addEventListener('drawing-upload-progress', function (event) {
    console.log(event.detail.progress);
  });

  var clipboard = new Clipboard('.button.copy');
  clipboard.on('error', function (e) {
    console.error('Error copying to clipboard:', e.action, e.trigger);
  });
};
