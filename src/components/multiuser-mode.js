AFRAME.registerComponent('multiuser-mode', {
  init: function () {
    var params = this.getUrlParams();

    if (this.el.isMobile) {
      // Mobile controls.
      this.el.querySelector('[camera]').setAttribute('spawn-in-circle', {radius: 3});
      this.el.querySelector('[camera]').removeAttribute('look-controls');
      this.el.querySelector('[camera]').setAttribute('orbit-controls', '');
    }
    else {
      // Don't let replayer interfere with mobile when testing.
      this.el.setAttribute('avatar-replayer', '');
    }

    if (params.multiuser) {
      this.el.setAttribute('networked-scene', {
        app: 'a-painter',
        room: params.multiuser,
        signalURL: 'https://haydenlee.io/'
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