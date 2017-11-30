window.saveAs = require('../vendor/saveas.js').saveAs;

require('./dragndrop.js');
require('./binarymanager.js');
require('../vendor/OrbitControls.js');

require('./utils.js');
require('./ui2d.js');

require('./systems/xr.js');
require('./systems/brush.js');
require('./systems/ui.js');
require('./systems/painter.js');

require('./components/ar-paint-controls.js');
require('./components/ar-mode-ui.js');
require('./components/ar-pin.js');
require('./components/ar-ui.js');
require('./components/ar-ui-modal-material.js');

require('./components/brush.js');
require('./components/if-no-vr-headset.js');
require('./components/json-model.js');
require('./components/orbit-controls.js');
require('./components/paint-controls.js');
require('./components/ui.js');
require('./components/ui-raycaster.js');

require('./components/xr.js');

require('./brushes/line.js');
require('./brushes/stamp.js');
require('./brushes/spheres.js');
require('./brushes/cubes.js');
require('./brushes/rainbow.js');
require('./brushes/single-sphere.js');

require('./paintModes/normal.js');
require('./paintModes/advanced.js');
