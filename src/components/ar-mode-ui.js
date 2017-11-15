var ENTER_VR_CLASS = 'a-enter-vr';
var ENTER_AR_BTN_CLASS = 'a-enter-ar-button';
var EXIT_AR_BTN_CLASS = 'a-exit-ar-button';
var HIDDEN_CLASS = 'a-hidden';

/**
 * UI for entering AR mode.
 */
AFRAME.registerComponent('ar-mode-ui', {
  dependencies: ['canvas'],

  schema: {
    enabled: {default: true}
  },

  init: function () {
    var self = this;
    var sceneEl = this.el;

    if (AFRAME.utils.getUrlParameter('ui') === 'false') { return; }

    // Add styles to support multiple buttons and to have consistent design
    var sheet = document.createElement('style');
    sheet.innerHTML = '.a-enter-vr {text-align: center;right: 10px;}';
    sheet.innerHTML += '.a-enter-vr-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHdpZHRoPSIyMDQ4cHgiIGhlaWdodD0iMjA0OHB4IiB2aWV3Qm94PSIwIDAgMjA0OCAyMDQ4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyMDQ4IDIwNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHRpdGxlPm1hc2s8L3RpdGxlPg0KPGc+DQoJPHJlY3QgeD0iMTQ0LjIzMiIgeT0iNTg3LjI3NiIgZmlsbD0ibm9uZSIgd2lkdGg9IjE4NjYuMTg3IiBoZWlnaHQ9IjEzNDEuMTM0Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTc4MS42NjksNTg2LjU4OWgxOTguNzk3bC0zMTQuMTI1LDkyMUg0ODUuNzAxbC0zMTEuODEyLTkyMWgyMDUuNjU2bDIwMC4xODgsNjk5LjE4OEw3ODEuNjY5LDU4Ni41ODl6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTE2ODYuMjc5LDYxMC4zMjRjMzMuOTM4LDE0LjU3OCw2Mi43MDMsMzYuMDMxLDg2LjI4MSw2NC4zNDRjMTkuNTE2LDIzLjMyOCwzNC45NjksNDkuMTU2LDQ2LjM0NCw3Ny40NjkNCgkJczE3LjA3OCw2MC41OTQsMTcuMDc4LDk2LjgxMmMwLDQzLjcxOS0xMS4wNDcsODYuNzE5LTMzLjE0MSwxMjguOTg0Yy0yMi4wOTQsNDIuMjgxLTU4LjU0Nyw3Mi4xNTctMTA5LjM5MSw4OS42NDENCgkJYzQyLjM3NSwxNy4xMjUsNzIuMzkxLDQxLjQzOCw5MC4wNDcsNzIuOTUzYzE3LjY1NiwzMS41MzEsMjYuNDg0LDc5LjU2MiwyNi40ODQsMTQ0LjA5NHY2MS44MjgNCgkJYzAsNDIuMDYyLDEuNzAzLDcwLjU3OCw1LjEyNSw4NS41NjJjNS4xMjUsMjMuNzUsMTcuMDc4LDQxLjIzNCwzNS44NzUsNTIuNDY5djIzLjEwOWgtMjEyLjMyOA0KCQljLTUuNzgxLTIwLjQwNi05LjkwNi0zNi44NDQtMTIuMzc1LTQ5LjM0NGMtNC45NjktMjUuODEyLTcuNjU2LTUyLjI1LTguMDYyLTc5LjMxMmwtMS4yMzQtODUuNTc4DQoJCWMtMC43OTctNTguNzAzLTEwLjk2OS05Ny44NDQtMzAuNTMxLTExNy40MDZzLTU2LjIxOS0yOS4zNTktMTA5Ljk1My0yOS4zNTloLTE4OC41MTZ2MzYxaC0xODh2LTkyMWg0NDAuODc1DQoJCUMxNjAzLjg1Nyw1ODcuODM5LDE2NTIuMzQyLDU5NS43NjEsMTY4Ni4yNzksNjEwLjMyNHogTTEyODcuOTgyLDc0NS41ODl2MjQ4aDIwNy41MzFjNDEuMjE5LDAsNzIuMTQxLTUsOTIuNzY2LTE1LjAzMQ0KCQljMzYuNDY5LTE3LjUzMSw1NC43MDMtNTIuMTcyLDU0LjcwMy0xMDMuOTUzYzAtNTUuOTM4LTE3LjY0MS05My41MTYtNTIuOTIyLTExMi43MzRjLTE5LjgyOC0xMC44NDQtNDkuNTYyLTE2LjI4MS04OS4yMDMtMTYuMjgxDQoJCUgxMjg3Ljk4MnoiLz4NCjwvZz4NCjwvc3ZnPg0K) 50% 50%/70% 70% no-repeat rgba(0,0,0,.35);';
    sheet.innerHTML += 'position: relative;';
    sheet.innerHTML += 'margin-right: 10px;';
    sheet.innerHTML += '}';

    sheet.innerHTML += '.a-enter-ar-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHdpZHRoPSIyMDQ4cHgiIGhlaWdodD0iMjA0OHB4IiB2aWV3Qm94PSIwIDAgMjA0OCAyMDQ4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyMDQ4IDIwNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHRpdGxlPm1hc2s8L3RpdGxlPg0KPGc+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTQzOS45NzIsNTg0LjgzNWgyMTcuNjI1bDMyNS4zNDUsOTIxaC0yMDguNzJsLTYwLjU3Ny0xODloLTMzOS4yNWwtNjIuNDIzLDE4OWgtMjAxLjExTDQzOS45NzIsNTg0LjgzNXoNCgkJIE00MjYuODc4LDExNTcuODM1aDIzNS44MTJMNTQ2LjU1LDc5NS4zOTZMNDI2Ljg3OCwxMTU3LjgzNXoiLz4NCgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTY5MC43MjMsNjA4LjU2OWMzMy45MzgsMTQuNTc3LDYyLjcwMiwzNi4wMyw4Ni4yOCw2NC4zNDRjMTkuNTE3LDIzLjMyOCwzNC45Nyw0OS4xNTYsNDYuMzQ1LDc3LjQ2OQ0KCQljMTEuMzc1LDI4LjMxMywxNy4wNzcsNjAuNTk0LDE3LjA3Nyw5Ni44MTJjMCw0My43MTktMTEuMDQ3LDg2LjcxOS0zMy4xNDEsMTI4Ljk4M2MtMjIuMDk1LDQyLjI4MS01OC41NDcsNzIuMTU2LTEwOS4zOTIsODkuNjQyDQoJCWM0Mi4zNzUsMTcuMTI1LDcyLjM5Miw0MS40MzgsOTAuMDQ3LDcyLjk1MmMxNy42NTYsMzEuNTMxLDI2LjQ4NCw3OS41NjIsMjYuNDg0LDE0NC4wOTV2NjEuODI4DQoJCWMwLDQyLjA2MiwxLjcwMyw3MC41NzcsNS4xMjUsODUuNTYyYzUuMTI1LDIzLjc1LDE3LjA3OCw0MS4yMzQsMzUuODc1LDUyLjQ2OXYyMy4xMDloLTIxMi4zMjgNCgkJYy01Ljc4MS0yMC40MDYtOS45MDYtMzYuODQ0LTEyLjM3NS00OS4zNDRjLTQuOTY5LTI1LjgxMi03LjY1Ni01Mi4yNS04LjA2Mi03OS4zMTJsLTEuMjM0LTg1LjU3OA0KCQljLTAuNzk3LTU4LjcwMy0xMC45NjktOTcuODQ0LTMwLjUzLTExNy40MDVjLTE5LjU2Mi0xOS41NjItNTYuMjItMjkuMzU5LTEwOS45NTMtMjkuMzU5aC0xODguNTE3djM2MWgtMTg4di05MjFIMTU0NS4zDQoJCUMxNjA4LjMsNTg2LjA4NSwxNjU2Ljc4NCw1OTQuMDA3LDE2OTAuNzIzLDYwOC41Njl6IE0xMjkyLjQyNSw3NDMuODM1djI0OGgyMDcuNTMxYzQxLjIxOSwwLDcyLjE0Mi01LDkyLjc2Ny0xNS4wMzENCgkJYzM2LjQ2OS0xNy41Myw1NC43MDItNTIuMTcyLDU0LjcwMi0xMDMuOTUzYzAtNTUuOTM4LTE3LjY0MS05My41MTYtNTIuOTIyLTExMi43MzNjLTE5LjgyOC0xMC44NDQtNDkuNTYyLTE2LjI4MS04OS4yMDMtMTYuMjgxDQoJCUwxMjkyLjQyNSw3NDMuODM1TDEyOTIuNDI1LDc0My44MzV6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==) 50% 50%/70% 70% no-repeat rgba(0,0,0,.35);';
    sheet.innerHTML += 'border: 0;';
    sheet.innerHTML += 'bottom: 0;';
    sheet.innerHTML += 'cursor: pointer;';
    sheet.innerHTML += 'min-width: 50px;';
    sheet.innerHTML += 'min-height: 30px;';
    sheet.innerHTML += 'padding-right: 5%;';
    sheet.innerHTML += 'padding-top: 4%;';
    sheet.innerHTML += 'transition: background-color .05s ease;';
    sheet.innerHTML += '-webkit-transition: background-color .05s ease;';
    sheet.innerHTML += 'z-index: 9999;';
    sheet.innerHTML += 'margin-right: 10px;}';
    sheet.innerHTML += '.a-enter-ar-button:active,.a-enter-ar-button:hover { background-color: #666;';
    sheet.innerHTML += '}';

    sheet.innerHTML += '.a-exit-ar-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHdpZHRoPSIyMDQ4cHgiIGhlaWdodD0iMjA0OHB4IiB2aWV3Qm94PSIwIDAgMjA0OCAyMDQ4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyMDQ4IDIwNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHRpdGxlPm1hc2s8L3RpdGxlPg0KPHJlY3QgeD0iNTYxLjI3MyIgeT0iNTg0LjgzNiIgZmlsbD0ibm9uZSIgd2lkdGg9IjEzODMuMTM5IiBoZWlnaHQ9IjEzODMuMTM5Ii8+DQo8ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3ICAgICI+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTgwNi41MDgsMTUwNS4xNDhINTgyLjc3NGwyOTYuMDE2LTQ2OS4yNWwtMjgyLjAxNi00NTEuNzVoMjMwLjA0N2wxNjQuNDM4LDMwMC4wMTZsMTY4Ljk2OC0zMDAuMDE2DQoJCWgyMjIuNTQ3bC0yODIuMDE2LDQ0NC4yNWwzMDAuMDE2LDQ3Ni43NWgtMjMzLjg5MWwtMTc1LjUzMS0zMTQuMTU2TDgwNi41MDgsMTUwNS4xNDh6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==) 50% 50%/70% 70% no-repeat rgba(0,0,0,.35);';
    sheet.innerHTML += 'border: 0;';
    sheet.innerHTML += 'bottom: 0;';
    sheet.innerHTML += 'cursor: pointer;';
    sheet.innerHTML += 'min-width: 30px;';
    sheet.innerHTML += 'min-height: 30px;';
    sheet.innerHTML += 'padding-right: 5%;';
    sheet.innerHTML += 'padding-top: 4%;';
    sheet.innerHTML += 'transition: background-color .05s ease;';
    sheet.innerHTML += '-webkit-transition: background-color .05s ease;';
    sheet.innerHTML += 'z-index: 9999;';
    sheet.innerHTML += 'display: none;';
    sheet.innerHTML += 'margin-right: 10px;}';
    sheet.innerHTML += '.a-exit-ar-button:active,.a-exit-ar-button:hover { background-color: #666;';
    sheet.innerHTML += '}';
    document.body.appendChild(sheet);

    this.enterAR = sceneEl.enterAR.bind(sceneEl);
    this.exitAR = sceneEl.exitAR.bind(sceneEl);
    this.insideLoader = false;
    this.enterAREl = null;

    // Hide/show AR UI when entering/exiting VR mode.
    sceneEl.addEventListener('enter-vr', this.updateEnterARInterface.bind(this));
    sceneEl.addEventListener('exit-vr', this.updateEnterARInterface.bind(this));

    window.addEventListener('message', function (event) {
      if (event.data.type === 'loaderReady') {
        self.insideLoader = true;
        self.remove();
      }
    });
  },

  update: function () {
    var sceneEl = this.el;

    if (!this.data.enabled || this.insideLoader || AFRAME.utils.getUrlParameter('ui') === 'false') {
      return this.remove();
    }
    if (this.enterAREl) { return; }

    // Add UI if enabled and not already present.
    this.enterAREl = createEnterARButton(this.enterAR);
    this.exitAREl = createExitARButton(this.exitAR);
    if(!document.getElementsByClassName(ENTER_VR_CLASS)[0]){
      var wrapper = document.createElement('div');
      wrapper.classList.add(ENTER_VR_CLASS);
      wrapper.setAttribute('aframe-injected', '');
      sceneEl.appendChild(wrapper);
    }
    document.getElementsByClassName(ENTER_VR_CLASS)[0].appendChild(this.enterAREl);
    document.getElementsByClassName(ENTER_VR_CLASS)[0].appendChild(this.exitAREl);

    this.updateEnterARInterface();
  },

  remove: function () {
    [this.enterAREl].forEach(function (uiElement) {
      if (uiElement) {
        uiElement.parentNode.removeChild(uiElement);
      }
    });
  },

  updateEnterARInterface: function () {
    this.toggleEnterARButtonIfNeeded();
  },

  toggleEnterARButtonIfNeeded: function () {
    var sceneEl = this.el;
    if (!this.enterAREl) { return; }
    if (sceneEl.is('vr-mode')) {
      this.enterAREl.classList.add(HIDDEN_CLASS);
      this.exitAREl.classList.add(HIDDEN_CLASS);
    } else {
      this.enterAREl.classList.remove(HIDDEN_CLASS);
      this.exitAREl.classList.remove(HIDDEN_CLASS);
    }
  }
});

/**
 * Creates a button that when clicked will enter into stereo-rendering mode for AR.
 *
 * Structure: <div><button></div>
 *
 * @param {function} enterARHandler
 * @returns {Element} Wrapper <div>.
 */
function createEnterARButton (clickHandler) {
  var arButton;

  // Create elements.
  arButton = document.createElement('button');
  arButton.className = ENTER_AR_BTN_CLASS;
  arButton.setAttribute('title', 'Enter AR mode.');
  arButton.setAttribute('aframe-injected', '');

  arButton.addEventListener('click', function (evt) {
    document.getElementsByClassName(ENTER_AR_BTN_CLASS)[0].style.display = 'none';
    document.getElementsByClassName(EXIT_AR_BTN_CLASS)[0].style.display = 'inline-block';
    clickHandler();
  });
  return arButton;
}

function createExitARButton (clickHandler) {
  var arButton;

  // Create elements.
  arButton = document.createElement('button');
  arButton.className = EXIT_AR_BTN_CLASS;
  arButton.setAttribute('title', 'Exit AR mode.');
  arButton.setAttribute('aframe-injected', '');

  arButton.addEventListener('click', function (evt) {
    document.getElementsByClassName(ENTER_AR_BTN_CLASS)[0].style.display = 'inline-block';
    document.getElementsByClassName(EXIT_AR_BTN_CLASS)[0].style.display = 'none';
    clickHandler();
  });
  return arButton;
}