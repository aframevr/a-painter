window.onload = function(e){
  var shareDiv = document.getElementById('share');
  var shareUrl = document.getElementById('share-url');
  document.addEventListener('drawing-uploaded', function (event) {
    shareDiv.classList.remove('hide');
    shareUrl.value = event.detail.url;
  });

  new Clipboard('.button.copy');
}
