/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebXRUtils = exports.WebXRManager = undefined;

var _WebXRManager = __webpack_require__(1);

var _WebXRManager2 = _interopRequireDefault(_WebXRManager);

var _WebXRUtils = __webpack_require__(2);

var _WebXRUtils2 = _interopRequireDefault(_WebXRUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.WebXRManager = _WebXRManager2.default;
exports.WebXRUtils = _WebXRUtils2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

THREE.WebXRManager = function (xrDisplays, renderer, camera, scene, updateCallback) {

	this.renderer = renderer;
	this.camera = camera;
	this.scene = scene;

	var scope = this;
	var boundHandleFrame = handleFrame.bind(this); // Useful for setting up the requestAnimationFrame callback

	var frameData = null;

	var displays = xrDisplays;
	var display = null;

	var requestedFloor = false;
	var floorGroup = new THREE.Group();

	// an array of info that we'll use in _handleFrame to update the nodes using anchors
	var anchoredNodes = []; // { XRAnchorOffset, Three.js Object3D }

	function handleFrame(frame) {
		var _this = this;

		var nextFrameRequest = this.session.requestFrame(boundHandleFrame);
		var headPose = frame.getViewPose(frame.getCoordinateSystem(XRCoordinateSystem.HEAD_MODEL));

		// If we haven't already, request the floor anchor offset
		if (requestedFloor === false) {
			requestedFloor = true;
			frame.findFloorAnchor('first-floor-anchor').then(function (anchorOffset) {
				if (anchorOffset === null) {
					console.error('could not find the floor anchor');
					return;
				}
				_this.addAnchoredNode(anchorOffset, floorGroup);
			}).catch(function (err) {
				console.error('error finding the floor anchor', err);
			});
		}

		// Update anchored node positions in the scene graph
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = anchoredNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var anchoredNode = _step.value;

				this.updateNodeFromAnchorOffset(frame, anchoredNode.node, anchoredNode.anchorOffset);
			}

			// Let the extending class update the scene before each render
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		this.updateScene(updateCallback, frame);

		// Prep THREE.js for the render of each XRView
		this.renderer.autoClear = false;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.clear();

		// Render each view into this.session.baseLayer.context
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = frame.views[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var view = _step2.value;

				if (this.camera.parent && this.camera.parent.type !== 'Scene') {
					this.camera.parent.matrixAutoUpdate = false;
					this.camera.parent.matrix.fromArray(headPose.poseModelMatrix);
					this.camera.parent.updateMatrixWorld(true);
				} else {
					this.camera.matrixAutoUpdate = false;
					// Each XRView has its own projection matrix, so set the camera to use that
					this.camera.projectionMatrix.fromArray(view.projectionMatrix);
					this.camera.matrix.fromArray(headPose.poseModelMatrix);
					this.camera.updateMatrixWorld(true);
				}

				// Set up the renderer to the XRView's viewport and then render
				this.renderer.clearDepth();
				var viewport = view.getViewport(this.session.baseLayer);
				this.renderer.setViewport(viewport.x, viewport.y, viewport.width / window.devicePixelRatio, viewport.height / window.devicePixelRatio);
				this.doRender();
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}
	}

	this.getDisplays = function () {

		return displays;
	};

	this.getDisplay = function () {

		return display;
	};

	this.session = null;

	this.startSession = function () {
		var _this2 = this;

		var createVirtualReality = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
		var shouldStartPresenting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		var sessionInitParamers = {
			exclusive: createVirtualReality,
			type: createVirtualReality ? XRSession.REALITY : XRSession.AUGMENTATION
		};
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = displays[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var displayObj = _step3.value;

				if (displayObj.supportsSession(sessionInitParamers)) {
					display = displayObj;
					break;
				}
			}
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3.return) {
					_iterator3.return();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}

		if (display === null) {
			console.error('Could not find a display for this type of session');
			return;
		}

		// Hack to receive WebVR 1.1 display info
		setTimeout(function () {
			display.requestSession(sessionInitParamers).then(function (session) {
				_this2.session = session;
				_this2.session.depthNear = 0.05;
				_this2.session.depthFar = 1000.0;

				// Handle session lifecycle events
				_this2.session.addEventListener('focus', function (ev) {
					_this2.handleSessionFocus(ev);
				});
				_this2.session.addEventListener('blur', function (ev) {
					_this2.handleSessionBlur(ev);
				});
				_this2.session.addEventListener('end', function (ev) {
					_this2.handleSessionEnded(ev);
				});

				if (shouldStartPresenting) {
					// VR Displays need startPresenting called due to input events like a click
					_this2.startPresenting();
				}
			}).catch(function (err) {
				console.error('Error requesting session', err);
			});
		}, 1000);
	};

	this.handleSessionFocus = function (ev) {
		console.log('handleSessionFocus');
	};

	this.handleSessionBlur = function (ev) {
		console.log('handleSessionBlur');
	};

	this.handleSessionEnded = function (ev) {
		console.log('handleSessionEnded');
	};

	this.handleLayerFocus = function (ev) {
		console.log('handleLayerFocus');
	};

	this.handleLayerBlur = function (ev) {
		console.log('handleLayerBlur');
	};

	/*
 Extending classes that need to update the layer during each frame should override this method
 */
	this.updateScene = function (updateCallback, frame) {
		updateCallback(frame);
	};

	this.startPresenting = function () {
		var _this3 = this;

		if (this.session === null) {
			console.error('Can not start presenting without a session');
			throw new Error('Can not start presenting without a session');
		}

		// Set the session's base layer into which the app will render
		this.session.baseLayer = new XRWebGLLayer(this.session, renderer.context);

		// Handle layer focus events
		this.session.baseLayer.addEventListener('focus', function (ev) {
			_this3.handleLayerFocus(ev);
		});
		this.session.baseLayer.addEventListener('blur', function (ev) {
			_this3.handleLayerBlur(ev);
		});

		this.session.requestFrame(boundHandleFrame);
	};

	this.doRender = function () {
		this.renderer.render(this.scene, this.camera);
	};

	/*
 Add a node to the scene and keep its pose updated using the anchorOffset
 */
	this.addAnchoredNode = function (anchorOffset, node) {
		anchoredNodes.push({
			anchorOffset: anchorOffset,
			node: node
		});
		this.scene.add(node);
	};

	/*
 Get the anchor data from the frame and use it and the anchor offset to update the pose of the node, this must be an Object3D
 */
	this.updateNodeFromAnchorOffset = function (frame, node, anchorOffset) {
		var anchor = frame.getAnchor(anchorOffset.anchorUID);
		if (anchor === null) {
			console.error('Unknown anchor uid', anchorOffset.anchorUID);
			return;
		}

		node.matrixAutoUpdate = false;
		var offsetCoordinates = anchorOffset.getTransformedCoordinates(anchor);
		if (offsetCoordinates.coordinateSystem.type === XRCoordinateSystem.TRACKER) {
			node.matrix.fromArray(offsetCoordinates.poseMatrix);
		} else {
			node.matrix.fromArray(offsetCoordinates.getTransformedCoordinates(frame.getCoordinateSystem(XRCoordinateSystem.TRACKER)).poseMatrix);
		}
		node.updateMatrixWorld(true);
	};
};

exports.default = THREE.WebXRManager;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

THREE.WebXRUtils = {
	getDisplays: function getDisplays() {
		return new Promise(function (resolve, reject) {
			if (!navigator.XR) {
				console.log('WebXR polyfill is not found');
				resolve(null);
				return;
			} else {
				navigator.XR.getDisplays().then(function (displays) {
					if (displays.length == 0) {
						console.log('No displays are available');
						resolve(null);
						return;
					}
					resolve(displays);
					return;
				}).catch(function (err) {
					console.error('Error getting XR displays', err);
					resolve(null);
					return;
				});
			}
		});
	}
};

exports.default = THREE.WebXRUtils;

/***/ })
/******/ ]);