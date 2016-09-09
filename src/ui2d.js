/* global Clipboard */
window.onload = function (event) {
  var shareDiv = document.getElementById('share');
  var shareUrl = document.getElementById('share-url');
  document.addEventListener('drawing-uploaded', function (event) {
    shareDiv.classList.remove('hide');
    shareUrl.value = event.detail.url;
  });

  var clipboard = new Clipboard('.button.copy');
  clipboard.on('error', function (e) {
    console.error('Error copying to clipboard:', e.action, e.trigger);
  });
};
