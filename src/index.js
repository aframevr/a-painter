window.saveAs = require('../vendor/saveas.js').saveAs;
require('../vendor/OrbitControls.js');

require('./binarymanager.js');
require('./ui2d.js');

require('./systems/brush.js');
require('./systems/ui.js');

require('./components/brush.js');
require('./components/if-no-vr-headset.js');
require('./components/json-model.js');
require('./components/line.js');
require('./components/look-controls-alt.js');
require('./components/orbit-controls.js');
require('./components/paint-controls.js');
require('./components/ui.js');
require('./components/ui-raycaster.js');

require('./brushes/line.js');
require('./brushes/stamp.js');
require('./brushes/spheres.js');
require('./brushes/cubes.js');
require('./brushes/rainbow.js');

require('./main.js');
