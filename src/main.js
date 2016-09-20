/* global AFRAME saveAs Blob uploadcare */
AFRAME.APAINTER = {
  version: 1,
  brushes: {},
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
      document.getElementById('logo').setAttribute('visible', false);
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
      if (event.keyCode === 8) {
        // Undo (Backspace)
        self.brushSystem.undo();
      }
      if (event.keyCode === 67) {
        // Clear (c)
        self.brushSystem.clear();
      }
      if (event.keyCode === 78) {
        // Next brush (n)
        var hands = document.querySelectorAll('[paint-controls]');
        var brushesNames = Object.keys(AFRAME.BRUSHES);
        var index = brushesNames.indexOf(hands[0].components.brush.data.brush);
        index = (index + 1) % brushesNames.length;
        [].forEach.call(hands, function (hand) {
          hand.setAttribute('brush', 'brush', brushesNames[index]);
        });
      }
      if (event.keyCode === 82) {
        // Random stroke (r)
        self.brushSystem.generateRandomStrokes(1);
      }
      if (event.keyCode === 76) {
        // load binary from file (l)
        self.brushSystem.loadFromUrl('demo.apa');
      }
      if (event.keyCode === 85) { // u - upload
        self.upload();
      }
      if (event.keyCode === 86) { // v - save
        self.save();
      }
    });

    console.info('A-PAINTER Version: ' + this.version);
  },
  save: function () {
    var dataviews = this.brushSystem.getBinary();
    var blob = new Blob(dataviews, {type: 'application/octet-binary'});
    // saveAs.js defines `saveAs` for saving files out of the browser
    saveAs(blob, 'demo.apa');
  },
  upload: function (success, error) {
    this.sceneEl.emit('drawing-upload-started');
    var self = this;

    var baseUrl = 'https://aframe.io/a-painter/?url=';

    var dataviews = this.brushSystem.getBinary();
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
            self.sceneEl.emit('drawing-upload-completed', {url: baseUrl + response.link});
            if (success) { success(); }
          }
        } else {
          self.sceneEl.emit('drawing-upload-error', {errorInfo: null, fileInfo: null});
          if (error) { error(); }
        }
      };
      xhr.send(fd);
    } else {
      var file = uploadcare.fileFrom('object', blob);
      file.done(function (fileInfo) {
        console.log('Uploaded link: ', baseUrl + fileInfo.cdnUrl);
        self.sceneEl.emit('drawing-upload-completed', {url: baseUrl + fileInfo.cdnUrl});
        if (success) { success(); }
      }).fail(function (errorInfo, fileInfo) {
        self.sceneEl.emit('drawing-upload-error', {errorInfo: errorInfo, fileInfo: fileInfo});
        if (error) { error(errorInfo); }
      }).progress(function (uploadInfo) {
        self.sceneEl.emit('drawing-upload-progress', {progress: uploadInfo.progress});
      });
    }
  }
};

AFRAME.APAINTER.init();
