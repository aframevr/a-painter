/* global AFRAME Blob uploadcare */

var saveAs = require('../../vendor/saveas.js').saveAs;

AFRAME.registerSystem('painter', {
  init: function () {
    var mappings = {
      behaviours: {},
      mappings: {
        painting: {
          common: {
            'grip.down': 'undo',
            'trigger.changed': 'paint'
          },

          'vive-controls': {
            'axismove': 'changeBrushSizeInc',
            'trackpad.touchstart': 'startChangeBrushSize',
            'menu.down': 'toggleMenu',

            // Teleport
            'trackpad.down': 'aim',
            'trackpad.up': 'teleport'
          },

          'oculus-touch-controls': {
            'axismove': 'changeBrushSizeAbs',
            'abutton.down': 'toggleMenu',
            'xbutton.down': 'toggleMenu',

            // Teleport
            'ybutton.down': 'aim',
            'ybutton.up': 'teleport',

            'bbutton.down': 'aim',
            'bbutton.up': 'teleport'
          },

          'windows-motion-controls': {
            'axismove': 'changeBrushSizeAbs',
            'menu.down': 'toggleMenu',

            // Teleport
            'trackpad.down': 'aim',
            'trackpad.up': 'teleport'
          },
        }
      }
    };

    this.sceneEl.addEventListener('loaded', function() {
      AFRAME.registerInputMappings(mappings);
      AFRAME.currentInputMapping = 'painting';
    });

    this.version = '1.2';
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
      document.getElementById('acamera').setAttribute('orbit-controls', 'initialPosition: 0 1.6 3');
      document.getElementById('apainter-logo').classList.remove('hidden');
      //document.getElementById('apainter-author').classList.remove('hidden'); // not used yet
    } else { // No painting to load, move camera in front of logo
      const cameraEl = document.getElementById('acamera')
      cameraEl.setAttribute('position', '0 1.6 0');
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

    this.paintingStarted = false;
    var self = this;
    document.addEventListener('stroke-started', function (event) {
      if (!self.paintingStarted) {
        const logoEl = document.getElementById('logo');
        logoEl.emit('painting-started');
        self.paintingStarted = true;
      }
    });

    // @fixme This is just for debug until we'll get some UI
    document.addEventListener('keyup', function (event) {
      if(event.shiftKey || event.ctrlKey) return;
      if (event.keyCode === 8) {
        // Undo (Backspace)
        self.brushSystem.undo();
      }
      if (event.keyCode === 67) {
        // Clear (c)
        self.brushSystem.clear();
      }
      if (event.keyCode === 71) {
        // Export to GTF (g)
        var drawing = document.querySelector('.a-drawing');
        self.sceneEl.systems['gltf-exporter'].export(drawing);
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

      if (event.keyCode === 84) {
        // Random stroke (t)
        self.brushSystem.generateTestLines();
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
      if (event.keyCode === 88) { // x remove 2nd
        self.brushSystem.removeById(2);
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
  upload: function () {
    this.sceneEl.emit('drawing-upload-started');
    var self = this;

    var baseUrl = 'https://aframe.io/a-painter/?url=';

    var dataviews = this.brushSystem.getBinary();
    var blob = new Blob(dataviews, {type: 'application/octet-binary'});

    const cloudName = 'a-painter';
    const unsignedUploadPreset = 'upload_painting';
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const fd = new FormData();
    
    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('file', blob);
    fetch(url, { method: 'POST', body: fd }).then(res => {
      if (!res.ok) {
        throw new Error(`Network request failed with status ${res.status}: ${res.statusText}`);
      }
      return res.json();
    }).then(json => {
      console.log('Uploaded link: ', baseUrl + json.secure_url);
      self.sceneEl.emit('drawing-upload-completed', { url: baseUrl + json.secure_url });
    }).catch(err => {
      console.error(err);
      self.sceneEl.emit('drawing-upload-error', { errorInfo: err });
    })
  }
});
