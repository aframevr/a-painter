/**
 * Setup the Networked-Aframe scene component based on query parameters
 */
AFRAME.registerComponent('multiuser-mode', {
  init: function () {
    var params = this.getUrlParams();

    if (params.room === "") {
      window.alert('Please add a room name in the URL, eg. ?room=myroom');
    }

    if (this.el.isMobile) {
      // Mobile controls.
      this.el.querySelector('[camera]').removeAttribute('look-controls');
      this.el.querySelector('[camera]').setAttribute('orbit-controls', '');
    }
    else {
      // Don't let replayer interfere with mobile when testing.
      this.el.setAttribute('avatar-replayer', '');
    }

    if (params.hasOwnProperty('room') && !params.hasOwnProperty('avatar-recording')) {
      this.el.querySelector('[local-player]').setAttribute('spawn-in-circle', {radius: 2});
    }

    var webrtc = params.hasOwnProperty('webrtc');
    if (params.room) {
      this.el.setAttribute('networked-scene', {
        app: 'a-painter',
        room: params.room,
        signalURL: 'https://haydenlee.io/',
        webrtc: webrtc
      });
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