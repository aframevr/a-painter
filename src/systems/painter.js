/* global AFRAME Blob uploadcare */

var saveAs = require('../../vendor/saveas.js').saveAs;

AFRAME.registerSystem('painter', {
  init: function () {
    this.version = '1.1';
    this.brushSystem = this.sceneEl.systems.brush;
    this.showTemplateItems = true;

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
    if (urlParams.url || urlParams.urljson) {
      var isBinary = urlParams.urljson === undefined;
      this.brushSystem.loadFromUrl(urlParams.url || urlParams.urljson, isBinary);
      document.getElementById('logo').setAttribute('visible', false);
      document.getElementById('acamera').setAttribute('orbit-controls', 'position', '0 1.6 3');
      document.getElementById('apainter-logo').classList.remove('hidden');
      //document.getElementById('apainter-author').classList.remove('hidden'); // not used yet
    }

    if (urlParams.bgcolor !== undefined) {
      document.body.style.backgroundColor = '#' + urlParams.bgcolor;
    }
    if (urlParams.sky !== undefined) {
      this.sceneEl.addEventListener('loaded', function (evt) {
        if (urlParams.sky === '') {
          document.getElementById('sky').setAttribute('visible', false);
        } else {
          document.getElementById('sky').setAttribute('material', 'src', urlParams.sky);
        }
      });
    }
    if (urlParams.floor !== undefined) {
      this.sceneEl.addEventListener('loaded', function (evt) {
        if (urlParams.floor === '') {
          document.getElementById('ground').setAttribute('visible', false);
        } else {
          document.getElementById('ground').setAttribute('material', 'src', urlParams.floor);
        }
      });
    }

    this.startPainting = false;
    var self = this;
    document.addEventListener('stroke-started', function (event) {
      if (!self.startPainting) {
        var logo = document.getElementById('logo');
        var mesh = logo.getObject3D('mesh');
        var object = { alpha: 1.0 };
        var tween = new AFRAME.TWEEN.Tween(object)
          .to({alpha: 0.0}, 4000)
          .onComplete(function () {
            logo.setAttribute('visible', false);
          })
          .onUpdate(function () {
            mesh.children[0].material.opacity = object.alpha;
          });
        tween.start();
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
        self.brushSystem.loadFromUrl('demo.apa', true);
      }
      if (event.keyCode === 85) { // u - upload
        self.upload();
      }
      if (event.keyCode === 86) { // v - save
        self.save();
      }
      if (event.keyCode === 74) { // j - save json
        self.saveJSON();
      }
      if (event.keyCode === 79) { // o - toggle template objects+images visibility
        self.showTemplateItems = !self.showTemplateItems;
        var templateItems = document.querySelectorAll('.templateitem');
        for (var i = 0; i < templateItems.length; i++) {
            templateItems[i].setAttribute('visible', self.showTemplateItems);
        }
      }
    });

    console.info('A-PAINTER Version: ' + this.version);
  },
  saveJSON: function () {
    var json = this.brushSystem.getJSON();
    var blob = new Blob([JSON.stringify(json)], {type: 'application/json'});
    saveAs(blob, 'demo.json');
  },
  save: function () {
    var dataviews = this.brushSystem.getBinary();
    var blob = new Blob(dataviews, {type: 'application/octet-binary'});
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
});
