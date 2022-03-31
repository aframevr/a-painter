window.saveAs = require('../vendor/saveas.js').saveAs;

require('./atlas.js');
require('./dragndrop.js');
require('./binarymanager.js');
require('./sharedbuffergeometrymanager.js');
require('./sharedbuffergeometry.js');

require('./utils.js');
require('./ui2d.js');

require('./systems/brush.js');
require('./systems/ui.js');
require('./systems/painter.js');

require('./components/brush.js');
require('./components/brush-tip.js');
require('./components/json-model.js');
require('./components/paint-controls.js');
require('./components/ui.js');
require('./components/ui-raycaster.js');
require('./components/logo-model.js');

require('./brushes/line.js');
require('./brushes/stamp.js');
require('./brushes/spheres.js');
require('./brushes/cubes.js');
require('./brushes/rainbow.js');
require('./brushes/single-sphere.js');
