/* global AFRAME saveAs Blob uploadcare */
AFRAME.APAINTER = {
  version: 1,
  brushes: {},
  strokeEntities: [],
  sceneEl: null,
  init: function () {
    this.sceneEl = document.querySelector('a-scene');
    this.brushSystem = this.sceneEl.systems.brush;

    function getUrlParams () {
      var match;
      var pl = /\+/g;  // Regex for replacing addition symbol with a space
      var search = /([^&=]+)=?([^&]*)/g;
      var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
      var query = window.location.search.substring(1);
      var urlParams = {};

      match = search.exec(query);
      while (match) {
        urlParams[decode(match[1])] = decode(match[2]);
        match = search.exec(query);
      }
      return urlParams;
    }
    var urlParams = getUrlParams();
    if (urlParams.url) {
      this.brushSystem.loadFromUrl(urlParams.url);
    }

    this.startPainting = false;
    var self = this;
    document.addEventListener('stroke-started', function (event) {
      if (!self.startPainting) {
        document.getElementById('logo').emit('fadeout');
        self.startPainting = true;
      }
    });

    // @fixme This is just for debug until we'll get some UI
    document.addEventListener('keyup', function (event) {
      console.log(event.keyCode);

      if (event.keyCode === 8) {
        // Undo (Backspace)
        self.brushSystem.undo();
      }
      if (event.keyCode === 67) {
        // Clear (c)
        self.brushSystem.clear();
      }
      if (event.keyCode === 82) {
        // Random stroke (r)
        self.brushSystem.generateRandomStrokes(1);
      }
      if (event.keyCode === 76) {
        // load binary from file (u)
        self.brushSystem.loadFromUrl('demo.apa');
      }
      if (event.keyCode === 85) {
        // Upload file (u)
        var baseUrl = 'http://a-painter.aframe.io/?url=';

        // Upload
        var dataviews = self.brushSystem.getBinary();
        var blob = new Blob(dataviews, {type: 'application/octet-binary'});
        var uploader = 'uploadcare'; // or 'fileio'
        if (uploader === 'fileio') {
          // Using file.io
          var fd = new window.FormData();
          fd.append('file', blob);
          var xhr = new window.XMLHttpRequest();
          xhr.open('POST', 'https://file.io'); // ?expires=1y
          xhr.onreadystatechange = function (data) {
            if (xhr.readyState === 4) {
              var response = JSON.parse(xhr.response);
              if (response.success) {
                console.log('Uploaded link: ', baseUrl + response.link);
                document.querySelector('a-scene').emit('drawing-uploaded', {url: baseUrl + response.link});
              }
            } else {
              // alert('An error occurred while uploading the drawing, please try again');
            }
          };
          xhr.send(fd);
        } else {
          var file = uploadcare.fileFrom('object', blob);
          file.done(function (fileInfo) {
            console.log('Uploaded link: ', baseUrl + fileInfo.cdnUrl);
            document.querySelector('a-scene').emit('drawing-uploaded', {url: baseUrl + fileInfo.cdnUrl});
          });
        }
      }
      if (event.keyCode === 86) { // v
        dataviews = self.brushSystem.getBinary();
        blob = new Blob(dataviews, {type: 'application/octet-binary'});
        // saveAs.js defines `saveAs` for saving files out of the browser
        saveAs(blob, 'demo.apa');
      }
    });

    console.info('A-PAINTER Version: ' + this.version);
  }
};

AFRAME.APAINTER.init();
