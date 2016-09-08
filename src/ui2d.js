/* global Clipboard */
window.onload = function (event) {
  var shareDiv = document.getElementById('share');
  var shareUrl = document.getElementById('share-url');
  document.addEventListener('drawing-uploaded', function (event) {
    shareDiv.classList.remove('hide');
    shareUrl.value = event.detail.url;
  });

  var clipboard = new Clipboard('.button.copy');
};
