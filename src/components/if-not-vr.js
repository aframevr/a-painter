/* global AFRAME */
var utils = AFRAME.utils;

/**
 * Set properties if headset is not connected.
 */
AFRAME.registerComponent('if-not-vr', {
  schema: {
    default: {},
    parse: utils.styleParser.parse
  },

  update: function () {
    var data = this.data;
    var el = this.el;

    if (utils.checkHeadsetConnected()) { return; }

    Object.keys(data).forEach(function set (component) {
      el.setAttribute(component, data[component]);
    });
  }
});
