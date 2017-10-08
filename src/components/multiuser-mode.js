/**
 * Setup the Networked-Aframe scene component based on query parameters
 */
AFRAME.registerComponent('multiuser-mode', {
  init: function () {
    var el = this.el;
    var params = this.getUrlParams();

    if (params.room === "") {
      window.alert('Please add a room name in the URL, eg. ?room=myroom');
    }

    var isMultiuser = params.hasOwnProperty('room');
    var isPlayingRecording = params.hasOwnProperty('avatar-recording');
    var isMobile = el.isMobile;

    if (isMobile) {
      // Mobile controls.
      el.querySelector('[camera]').removeAttribute('look-controls');
      el.querySelector('[camera]').setAttribute('orbit-controls', '');

      if (isMultiuser && !isPlayingRecording) {
        el.querySelector('[local-player]').setAttribute('spawn-in-circle', {radius: 2});
      }
    }
    else {
      // Don't let replayer interfere with mobile when testing.
      el.setAttribute('avatar-replayer', '');
    }

    var webrtc = params.hasOwnProperty('webrtc');
    var adapter = webrtc ? 'easyrtc' : 'wseasyrtc';

    var voice = params.hasOwnProperty('voice');
    if (isMultiuser) {
      var networked = {
        app: 'a-painter',
        room: params.room,
        serverURL: 'https://haydenlee.io/',
        adapter: adapter,
        audio: voice
      };
      console.info('Init networked-aframe with settings:', networked);
      el.setAttribute('networked-scene', networked);
    }
  },

  getUrlParams: function () {
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
});