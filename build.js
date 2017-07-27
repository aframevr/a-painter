/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	window.saveAs = __webpack_require__(1).saveAs;

	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);

	__webpack_require__(7);
	__webpack_require__(8);

	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);

	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(14);
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(17);
	__webpack_require__(18);

	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(21);
	__webpack_require__(22);
	__webpack_require__(23);
	__webpack_require__(24);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
	var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,i=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},a=/constructor/i.test(e.HTMLElement),f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},d="application/octet-stream",s=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,s)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(i){u(i)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,s){if(!s){t=p(t)}var v=this,w=t.type,m=w===d,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&a)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;i(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if("function"!=="undefined"&&__webpack_require__(2)!==null&&__webpack_require__(3)!==null){!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){return saveAs}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))}


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 4 */
/***/ function(module, exports) {

	/* globals AFRAME Image FileReader */
	window.addEventListener('load', function (event) {
	  var dropArea = document.body;

	  dropArea.addEventListener('dragover', function (event) {
	    event.stopPropagation();
	    event.preventDefault();
	    event.dataTransfer.dropEffect = 'copy';
	  }, false);

	  dropArea.addEventListener('drop', function (event) {
	    event.stopPropagation();
	    event.preventDefault();

	    // for each dropped file
	    var files = event.dataTransfer.files;
	    for (var i = 0; i < files.length; i++) {
	      var file = files[i];

	      if (file.name.substr(file.name.length - 4).toLowerCase() === '.apa') {
	        // a-painter binary
	        var reader = new FileReader();

	        // file read, parse obj and add to the scene
	        reader.onload = function (event) {
	          document.querySelector('a-scene').systems.brush.loadBinary(event.target.result);
	        };
	        reader.readAsArrayBuffer(file);
	      }
	      else if (file.name.substr(file.name.length - 5).toLowerCase() === '.json') {
	        // a-painter json
	        var reader = new FileReader();

	        // file read, parse obj and add to the scene
	        reader.onload = function (event) {
	          document.querySelector('a-scene').systems.brush.loadJSON(JSON.parse(event.target.result));
	        };
	        reader.readAsText(file);
	      } 
	      else if (file.name.substr(file.name.length - 4).toLowerCase() === '.obj') {
	        // OBJs
	        reader = new FileReader();

	        // file read, parse obj and add to the scene
	        reader.onload = function (event) {
	          var objloader = new AFRAME.THREE.OBJLoader();
	          var mesh = objloader.parse(event.target.result);

	          var entity = document.createElement('a-entity');
	          // set all mesh objects to dark gray
	          for (var o = 0; o < mesh.children.length; o++) {
	            var child = mesh.children[o];
	            child.material.color.set('#333');
	          }
	          // add mesh to entity
	          entity.setObject3D('mesh', mesh);
	          entity.className = 'templateitem';
	          document.querySelector('a-scene').appendChild(entity);
	        };
	        reader.readAsText(file);
	      } else if (file.type.match(/image.*/)) {
	        // dropping images
	        reader = new FileReader();
	        reader.onload = function (event) {
	          // create img to get its size
	          var img = new Image();
	          img.src = event.target.result;

	          // find good image size
	          var width, height;
	          if (img.width > img.height) {
	            width = 1.0;
	            height = img.height / img.width;
	          } else {
	            height = 1.0;
	            width = img.width / img.height;
	          }

	          // find a random position in a side of the room
	          var pos = [Math.random() * 3 - 1.5, 1 + Math.random() - 0.5, -1.4 + Math.random() * 0.2];

	          // create a-image entity and set attributes
	          var entity = document.createElement('a-image');
	          entity.setAttribute('src', event.target.result);
	          entity.setAttribute('position', pos.join(' '));
	          entity.setAttribute('width', width);
	          entity.setAttribute('height', height);
	          entity.className = 'templateitem';
	          document.querySelector('a-scene').appendChild(entity);
	        };
	        reader.readAsDataURL(file);
	      }
	    }
	  }, false);
	});


/***/ },
/* 5 */
/***/ function(module, exports) {

	/* globals THREE */
	window.BinaryManager = function (buffer) {
	  this.dataview = new DataView(buffer);
	  this.offset = 0;
	  this.isLittleEndian = true;
	};

	window.BinaryManager.prototype = {
	  // READER
	  readQuaternion: function () {
	    return new THREE.Quaternion(
	      this.readFloat(),
	      this.readFloat(),
	      this.readFloat(),
	      this.readFloat()
	    );
	  },
	  readVector3: function () {
	    return new THREE.Vector3(
	      this.readFloat(),
	      this.readFloat(),
	      this.readFloat()
	    );
	  },
	  readString: function () {
	    var length = this.dataview.getUint8(this.offset++, true);
	    var output = '';
	    for (var i = 0; i < length; i++) {
	      output += String.fromCharCode(this.dataview.getUint8(this.offset++, true));
	    }
	    return output;
	  },
	  readColor: function () {
	    return new THREE.Color(
	      this.readFloat(),
	      this.readFloat(),
	      this.readFloat()
	    );
	  },
	  readFloat: function () {
	    var output = this.dataview.getFloat32(this.offset, true);
	    this.offset += 4;
	    return output;
	  },
	  readUint32: function () {
	    var output = this.dataview.getUint32(this.offset, true);
	    this.offset += 4;
	    return output;
	  },
	  readUint16: function () {
	    var output = this.dataview.getUint16(this.offset, true);
	    this.offset += 2;
	    return output;
	  },
	  readUint8: function () {
	    var output = this.dataview.getUint8(this.offset, true);
	    this.offset++;
	    return output;
	  },
	  // WRITER
	  writeVector: function (value) {
	    this.writeFloat32Array(value.toArray());
	  },
	  writeColor: function (value) {
	    this.writeFloat32Array(value.toArray());
	  },
	  writeString: function (value) {
	    this.writeUint8(value.length);
	    for (var i = 0; i < value.length; i++) {
	      this.writeUint8(value.charCodeAt(i));
	    }
	  },
	  writeUint8: function (value) {
	    this.dataview.setUint8(this.offset, value, this.isLittleEndian);
	    this.offset ++;
	  },
	  writeUint16: function (value) {
	    this.dataview.setUint16(this.offset, value, this.isLittleEndian);
	    this.offset += 2;
	  },
	  writeUint32: function (value) {
	    this.dataview.setUint32(this.offset, value, this.isLittleEndian);
	    this.offset += 4;
	  },
	  writeFloat32: function (value) {
	    this.dataview.setFloat32(this.offset, value, this.isLittleEndian);
	    this.offset += 4;
	  },
	  writeFloat32Array: function (value) {
	    for (var i = 0; i < value.length; i++) {
	      this.writeFloat32(value[i]);
	    }
	  },
	  getDataView: function () {
	    return this.dataview;
	  }
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * @author qiao / https://github.com/qiao
	 * @author mrdoob / http://mrdoob.com
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author erich666 / http://erichaines.com
	 */

	// This set of controls performs orbiting, dollying (zooming), and panning.
	// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
	//
	//    Orbit - left mouse / touch: one finger move
	//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
	//    Pan - right mouse, or arrow keys / touch: three finter swipe

	THREE.OrbitControls = function ( object, domElement ) {

		this.object = object;

		this.domElement = ( domElement !== undefined ) ? domElement : document;

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus, where the object orbits around
		this.target = new THREE.Vector3();

		// How far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.25;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

		// Set to false to disable use of the keys
		this.enableKeys = true;

		// The four arrow keys
		this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

		// Mouse buttons
		this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		//
		// public methods
		//

		this.getPolarAngle = function () {

			return spherical.phi;

		};

		this.getAzimuthalAngle = function () {

			return spherical.theta;

		};

		this.reset = function () {

			scope.target.copy( scope.target0 );
			scope.object.position.copy( scope.position0 );
			scope.object.zoom = scope.zoom0;

			scope.object.updateProjectionMatrix();
			scope.dispatchEvent( changeEvent );

			scope.update();

			state = STATE.NONE;

		};

		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function() {

			var offset = new THREE.Vector3();

			// so camera.up is the orbit axis
			var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
			var quatInverse = quat.clone().inverse();

			var lastPosition = new THREE.Vector3();
			var lastQuaternion = new THREE.Quaternion();

			return function update () {

				var position = scope.object.position;

				offset.copy( position ).sub( scope.target );

				// rotate offset to "y-axis-is-up" space
				offset.applyQuaternion( quat );

				// angle from z-axis around y-axis
				spherical.setFromVector3( offset );

				if ( scope.autoRotate && state === STATE.NONE ) {

					rotateLeft( getAutoRotationAngle() );

				}

				spherical.theta += sphericalDelta.theta;
				spherical.phi += sphericalDelta.phi;

				// restrict theta to be between desired limits
				spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );

				// restrict phi to be between desired limits
				spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

				spherical.makeSafe();


				spherical.radius *= scale;

				// restrict radius to be between desired limits
				spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

				// move target to panned location
				scope.target.add( panOffset );

				offset.setFromSpherical( spherical );

				// rotate offset back to "camera-up-vector-is-up" space
				offset.applyQuaternion( quatInverse );
				position.copy( scope.target ).add( offset );
				scope.object.lookAt( scope.target );

				if ( scope.enableDamping === true ) {

					sphericalDelta.theta *= ( 1 - scope.dampingFactor );
					sphericalDelta.phi *= ( 1 - scope.dampingFactor );

				} else {

					sphericalDelta.set( 0, 0, 0 );

				}

				scale = 1;
				panOffset.set( 0, 0, 0 );

				// update condition is:
				// min(camera displacement, camera rotation in radians)^2 > EPS
				// using small-angle approximation cos(x/2) = 1 - x^2 / 8

				if ( zoomChanged ||
					lastPosition.distanceToSquared( scope.object.position ) > EPS ||
					8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

					scope.dispatchEvent( changeEvent );

					lastPosition.copy( scope.object.position );
					lastQuaternion.copy( scope.object.quaternion );
					zoomChanged = false;

					return true;

				}

				return false;

			};

		}();

		this.dispose = function() {

			scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
			scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
			scope.domElement.removeEventListener( 'wheel', onMouseWheel, false );

			scope.domElement.removeEventListener( 'touchstart', onTouchStart, false );
			scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );
			scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			window.removeEventListener( 'keydown', onKeyDown, false );

			//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

		};

		//
		// internals
		//

		var scope = this;

		var changeEvent = { type: 'change' };
		var startEvent = { type: 'start' };
		var endEvent = { type: 'end' };

		var STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };

		var state = STATE.NONE;

		var EPS = 0.000001;

		// current position in spherical coordinates
		var spherical = new THREE.Spherical();
		var sphericalDelta = new THREE.Spherical();

		var scale = 1;
		var panOffset = new THREE.Vector3();
		var zoomChanged = false;

		var rotateStart = new THREE.Vector2();
		var rotateEnd = new THREE.Vector2();
		var rotateDelta = new THREE.Vector2();

		var panStart = new THREE.Vector2();
		var panEnd = new THREE.Vector2();
		var panDelta = new THREE.Vector2();

		var dollyStart = new THREE.Vector2();
		var dollyEnd = new THREE.Vector2();
		var dollyDelta = new THREE.Vector2();

		function getAutoRotationAngle() {

			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

		}

		function getZoomScale() {

			return Math.pow( 0.95, scope.zoomSpeed );

		}

		function rotateLeft( angle ) {

			sphericalDelta.theta -= angle;

		}

		function rotateUp( angle ) {

			sphericalDelta.phi -= angle;

		}

		var panLeft = function() {

			var v = new THREE.Vector3();

			return function panLeft( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
				v.multiplyScalar( - distance );

				panOffset.add( v );

			};

		}();

		var panUp = function() {

			var v = new THREE.Vector3();

			return function panUp( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 1 ); // get Y column of objectMatrix
				v.multiplyScalar( distance );

				panOffset.add( v );

			};

		}();

		// deltaX and deltaY are in pixels; right and down are positive
		var pan = function() {

			var offset = new THREE.Vector3();

			return function pan ( deltaX, deltaY ) {

				var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

				if ( scope.object instanceof THREE.PerspectiveCamera ) {
					// perspective
					var position = scope.object.position;
					offset.copy( position ).sub( scope.target );
					var targetDistance = offset.length();

					// half of the fov is center to top of screen
					targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

					// we actually don't use screenWidth, since perspective camera is fixed to screen height
					panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
					panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

				} else if ( scope.object instanceof THREE.OrthographicCamera ) {

					// orthographic
					panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
					panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

				} else {

					// camera neither orthographic nor perspective
					console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
					scope.enablePan = false;

				}

			};

		}();

		function dollyIn( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale /= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		function dollyOut( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale *= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		//
		// event callbacks - update the object state
		//

		function handleMouseDownRotate( event ) {

			//console.log( 'handleMouseDownRotate' );

			rotateStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownDolly( event ) {

			//console.log( 'handleMouseDownDolly' );

			dollyStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownPan( event ) {

			//console.log( 'handleMouseDownPan' );

			panStart.set( event.clientX, event.clientY );

		}

		function handleMouseMoveRotate( event ) {

			//console.log( 'handleMouseMoveRotate' );
			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleMouseMoveDolly( event ) {

			//console.log( 'handleMouseMoveDolly' );

			dollyEnd.set( event.clientX, event.clientY );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyIn( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyOut( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleMouseMovePan( event ) {

			//console.log( 'handleMouseMovePan' );

			panEnd.set( event.clientX, event.clientY );

			panDelta.subVectors( panEnd, panStart );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleMouseUp( event ) {

			//console.log( 'handleMouseUp' );

		}

		function handleMouseWheel( event ) {

			//console.log( 'handleMouseWheel' );

			if ( event.deltaY < 0 ) {

				dollyOut( getZoomScale() );

			} else if ( event.deltaY > 0 ) {

				dollyIn( getZoomScale() );

			}

			scope.update();

		}

		function handleKeyDown( event ) {

			//console.log( 'handleKeyDown' );

			switch ( event.keyCode ) {

				case scope.keys.UP:
					pan( 0, scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.BOTTOM:
					pan( 0, - scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.LEFT:
					pan( scope.keyPanSpeed, 0 );
					scope.update();
					break;

				case scope.keys.RIGHT:
					pan( - scope.keyPanSpeed, 0 );
					scope.update();
					break;

			}

		}

		function handleTouchStartRotate( event ) {

			//console.log( 'handleTouchStartRotate' );

			rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		}

		function handleTouchStartDolly( event ) {

			//console.log( 'handleTouchStartDolly' );

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyStart.set( 0, distance );

		}

		function handleTouchStartPan( event ) {

			//console.log( 'handleTouchStartPan' );

			panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		}

		function handleTouchMoveRotate( event ) {

			//console.log( 'handleTouchMoveRotate' );

			rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleTouchMoveDolly( event ) {

			//console.log( 'handleTouchMoveDolly' );

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyEnd.set( 0, distance );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyOut( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyIn( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleTouchMovePan( event ) {

			//console.log( 'handleTouchMovePan' );

			panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

			panDelta.subVectors( panEnd, panStart );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleTouchEnd( event ) {

			//console.log( 'handleTouchEnd' );

		}

		//
		// event handlers - FSM: listen for events and reset state
		//

		function onMouseDown( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			if ( event.button === scope.mouseButtons.ORBIT ) {

				if ( scope.enableRotate === false ) return;

				handleMouseDownRotate( event );

				state = STATE.ROTATE;

			} else if ( event.button === scope.mouseButtons.ZOOM ) {

				if ( scope.enableZoom === false ) return;

				handleMouseDownDolly( event );

				state = STATE.DOLLY;

			} else if ( event.button === scope.mouseButtons.PAN ) {

				if ( scope.enablePan === false ) return;

				handleMouseDownPan( event );

				state = STATE.PAN;

			}

			if ( state !== STATE.NONE ) {

				document.addEventListener( 'mousemove', onMouseMove, false );
				document.addEventListener( 'mouseup', onMouseUp, false );

				scope.dispatchEvent( startEvent );

			}

		}

		function onMouseMove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			if ( state === STATE.ROTATE ) {

				if ( scope.enableRotate === false ) return;

				handleMouseMoveRotate( event );

			} else if ( state === STATE.DOLLY ) {

				if ( scope.enableZoom === false ) return;

				handleMouseMoveDolly( event );

			} else if ( state === STATE.PAN ) {

				if ( scope.enablePan === false ) return;

				handleMouseMovePan( event );

			}

		}

		function onMouseUp( event ) {

			if ( scope.enabled === false ) return;

			handleMouseUp( event );

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			scope.dispatchEvent( endEvent );

			state = STATE.NONE;

		}

		function onMouseWheel( event ) {

			if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

			event.preventDefault();
			event.stopPropagation();

			handleMouseWheel( event );

			scope.dispatchEvent( startEvent ); // not sure why these are here...
			scope.dispatchEvent( endEvent );

		}

		function onKeyDown( event ) {

			if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;

			handleKeyDown( event );

		}

		function onTouchStart( event ) {

			if ( scope.enabled === false ) return;

			switch ( event.touches.length ) {

				case 1:	// one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;

					handleTouchStartRotate( event );

					state = STATE.TOUCH_ROTATE;

					break;

				case 2:	// two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;

					handleTouchStartDolly( event );

					state = STATE.TOUCH_DOLLY;

					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;

					handleTouchStartPan( event );

					state = STATE.TOUCH_PAN;

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				scope.dispatchEvent( startEvent );

			}

		}

		function onTouchMove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();
			event.stopPropagation();

			switch ( event.touches.length ) {

				case 1: // one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;
					if ( state !== STATE.TOUCH_ROTATE ) return; // is this needed?...

					handleTouchMoveRotate( event );

					break;

				case 2: // two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;
					if ( state !== STATE.TOUCH_DOLLY ) return; // is this needed?...

					handleTouchMoveDolly( event );

					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;
					if ( state !== STATE.TOUCH_PAN ) return; // is this needed?...

					handleTouchMovePan( event );

					break;

				default:

					state = STATE.NONE;

			}

		}

		function onTouchEnd( event ) {

			if ( scope.enabled === false ) return;

			handleTouchEnd( event );

			scope.dispatchEvent( endEvent );

			state = STATE.NONE;

		}

		function onContextMenu( event ) {

			event.preventDefault();

		}

		//

		scope.domElement.addEventListener( 'contextmenu', onContextMenu, false );

		scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
		scope.domElement.addEventListener( 'wheel', onMouseWheel, false );

		scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
		scope.domElement.addEventListener( 'touchend', onTouchEnd, false );
		scope.domElement.addEventListener( 'touchmove', onTouchMove, false );

		window.addEventListener( 'keydown', onKeyDown, false );

		// force an update at start

		this.update();

	};

	THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
	THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

	Object.defineProperties( THREE.OrbitControls.prototype, {

		center: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .center has been renamed to .target' );
				return this.target;

			}

		},

		// backward compatibility

		noZoom: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				return ! this.enableZoom;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				this.enableZoom = ! value;

			}

		},

		noRotate: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				return ! this.enableRotate;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				this.enableRotate = ! value;

			}

		},

		noPan: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				return ! this.enablePan;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				this.enablePan = ! value;

			}

		},

		noKeys: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				return ! this.enableKeys;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				this.enableKeys = ! value;

			}

		},

		staticMoving : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				return ! this.enableDamping;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				this.enableDamping = ! value;

			}

		},

		dynamicDampingFactor : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				return this.dampingFactor;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				this.dampingFactor = value;

			}

		}

	} );


/***/ },
/* 7 */
/***/ function(module, exports) {

	Number.prototype.toNumFixed = function (num) {
	  return parseFloat(this.toFixed(num));
	}

	Array.prototype.toNumFixed = function (num) {
	  for (var i = 0; i < this.length; i++) {
	    this[i] = this[i].toNumFixed(num);
	  }
	  return this;
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	/* global Clipboard */
	window.addEventListener('load', function (event) {
	  var apainterUI = document.getElementById('apainter-ui');
	  var shareDiv = document.querySelector('#apainter-ui .share');
	  var shareUrl = document.getElementById('apainter-share-url');
	  var progressDiv = document.querySelector('#apainter-ui .progress');
	  var progressBar = document.querySelector('#apainter-ui .bar');
	  document.addEventListener('drawing-upload-completed', function (event) {
	    shareDiv.classList.remove('hide');
	    progressDiv.classList.add('hide');
	    shareUrl.value = event.detail.url;
	  });

	  document.addEventListener('drawing-upload-started', function (event) {
	    apainterUI.style.display = 'block';
	    shareDiv.classList.add('hide');
	    progressDiv.classList.remove('hide');
	  });

	  document.addEventListener('drawing-upload-progress', function (event) {
	    progressBar.style.width = Math.floor(event.detail.progress * 100) + '%';
	  });

	  var clipboard = new Clipboard('.button.copy');
	  clipboard.on('error', function (e) {
	    console.error('Error copying to clipboard:', e.action, e.trigger);
	  });
	});


/***/ },
/* 9 */
/***/ function(module, exports) {

	/* globals AFRAME THREE BinaryManager */
	var VERSION = 1;

	AFRAME.BRUSHES = {};

	AFRAME.registerBrush = function (name, definition, options) {
	  var proto = {};

	  // Format definition object to prototype object.
	  Object.keys(definition).forEach(function (key) {
	    proto[key] = {
	      value: definition[key],
	      writable: true
	    };
	  });

	  if (AFRAME.BRUSHES[name]) {
	    throw new Error('The brush `' + name + '` has been already registered. ' +
	                    'Check that you are not loading two versions of the same brush ' +
	                    'or two different brushes of the same name.');
	  }

	  var BrushInterface = function () {};

	  var defaultOptions = {
	    spacing: 0,
	    maxPoints: 0
	  };

	  BrushInterface.prototype = {
	    options: Object.assign(defaultOptions, options),
	    reset: function () {},
	    tick: function (timeoffset, delta) {},
	    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {},
	    getJSON: function (system) {
	      var points = [];
	      for (var i = 0; i < this.data.points.length; i++) {
	        var point = this.data.points[i];
	        points.push({
	          'orientation': point.orientation.toArray().toNumFixed(6),
	          'position': point.position.toArray().toNumFixed(6),
	          'pressure': point.pressure.toNumFixed(6),
	          'timestamp': point.timestamp
	        });
	      }

	      return {
	        brush: {
	          index: system.getUsedBrushes().indexOf(this.brushName),
	          color: this.data.color.toArray().toNumFixed(6),
	          size: this.data.size.toNumFixed(6)
	        },
	        points: points
	      };
	    },
	    getBinary: function (system) {
	      // Color = 3*4 = 12
	      // NumPoints   =  4
	      // Brush index =  1
	      // ----------- = 21
	      // [Point] = vector3 + quat + pressure + timestamp = (3+4+1+1)*4 = 36

	      var bufferSize = 21 + (36 * this.data.points.length);
	      var binaryManager = new BinaryManager(new ArrayBuffer(bufferSize));
	      binaryManager.writeUint8(system.getUsedBrushes().indexOf(this.brushName));  // brush index
	      binaryManager.writeColor(this.data.color);    // color
	      binaryManager.writeFloat32(this.data.size);   // brush size

	      // Number of points
	      binaryManager.writeUint32(this.data.points.length);

	      // Points
	      for (var i = 0; i < this.data.points.length; i++) {
	        var point = this.data.points[i];
	        binaryManager.writeFloat32Array(point.position.toArray());
	        binaryManager.writeFloat32Array(point.orientation.toArray());
	        binaryManager.writeFloat32(point.pressure);
	        binaryManager.writeUint32(point.timestamp);
	      }
	      return binaryManager.getDataView();
	    }
	  };

	  function wrapInit (initMethod) {
	    return function init (color, brushSize) {
	      this.object3D = new THREE.Object3D();
	      this.data = {
	        points: [],
	        size: brushSize,
	        prevPosition: null,
	        prevPointerPosition: null,
	        numPoints: 0,
	        color: color.clone()
	      };
	      initMethod.call(this, color, brushSize);
	    };
	  }

	  function wrapAddPoint (addPointMethod) {
	    return function addPoint (position, orientation, pointerPosition, pressure, timestamp) {
	      if ((this.data.prevPosition && this.data.prevPosition.distanceTo(position) <= this.options.spacing) ||
	          this.options.maxPoints !== 0 && this.data.numPoints >= this.options.maxPoints) {
	        return;
	      }
	      if (addPointMethod.call(this, position, orientation, pointerPosition, pressure, timestamp)) {
	        this.data.numPoints++;
	        this.data.points.push({
	          'position': position.clone(),
	          'orientation': orientation.clone(),
	          'pressure': pressure,
	          'timestamp': timestamp
	        });

	        this.data.prevPosition = position.clone();
	        this.data.prevPointerPosition = pointerPosition.clone();
	      }
	    };
	  }

	  var NewBrush = function () {};
	  NewBrush.prototype = Object.create(BrushInterface.prototype, proto);
	  NewBrush.prototype.brushName = name;
	  NewBrush.prototype.constructor = NewBrush;
	  NewBrush.prototype.init = wrapInit(NewBrush.prototype.init);
	  NewBrush.prototype.addPoint = wrapAddPoint(NewBrush.prototype.addPoint);
	  AFRAME.BRUSHES[name] = NewBrush;

	  // console.log('New brush registered `' + name + '`');
	  NewBrush.used = false; // Used to know which brushes have been used on the drawing
	  return NewBrush;
	};

	AFRAME.registerSystem('brush', {
	  schema: {},
	  brushes: {},
	  strokes: [],
	  getUsedBrushes: function () {
	    return Object.keys(AFRAME.BRUSHES)
	      .filter(function (name) { return AFRAME.BRUSHES[name].used; });
	  },
	  getBrushByName: function (name) {
	    return AFRAME.BRUSHES[name];
	  },
	  undo: function () {
	    var stroke = this.strokes.pop();
	    if (stroke) {
	      var entity = stroke.entity;
	      entity.emit('stroke-removed', {entity: entity});
	      entity.parentNode.removeChild(entity);
	    }
	  },
	  clear: function () {
	    // Remove all the stroke entities
	    for (var i = 0; i < this.strokes.length; i++) {
	      var entity = this.strokes[i].entity;
	      entity.parentNode.removeChild(entity);
	    }

	    // Reset the used brushes
	    Object.keys(AFRAME.BRUSHES).forEach(function (name) {
	      AFRAME.BRUSHES[name].used = false;
	    });

	    this.strokes = [];
	  },
	  init: function () {
	    this.version = VERSION;
	    this.clear();
	    this.controllerName = null;

	    var self = this;
	    this.sceneEl.addEventListener('controllerconnected', function (evt) {
	      self.controllerName = evt.detail.name;
	    });
	  },
	  tick: function (time, delta) {
	    if (!this.strokes.length) { return; }
	    for (var i = 0; i < this.strokes.length; i++) {
	      this.strokes[i].tick(time, delta);
	    }
	  },
	  generateRandomStrokes: function (numStrokes) {
	    function randNeg () { return 2 * Math.random() - 1; }

	    for (var l = 0; l < numStrokes; l++) {
	      var brushName = 'flat';
	      var color = new THREE.Color(Math.random(), Math.random(), Math.random());
	      var size = Math.random() * 0.1;
	      var numPoints = parseInt(Math.random() * 500);

	      var stroke = this.addNewStroke(brushName, color, size);

	      var position = new THREE.Vector3(randNeg(), randNeg(), randNeg());
	      var aux = new THREE.Vector3();
	      var orientation = new THREE.Quaternion();

	      var pressure = 0.2;
	      for (var i = 0; i < numPoints; i++) {
	        aux.set(randNeg(), randNeg(), randNeg());
	        aux.multiplyScalar(randNeg() / 20);
	        orientation.setFromUnitVectors(position.clone().normalize(), aux.clone().normalize());
	        position = position.add(aux);
	        var timestamp = 0;

	        var pointerPosition = this.getPointerPosition(position, orientation);
	        stroke.addPoint(position, orientation, pointerPosition, pressure, timestamp);
	      }
	    }
	  },
	  addNewStroke: function (brushName, color, size) {
	    var Brush = this.getBrushByName(brushName);
	    if (!Brush) {
	      var newBrushName = Object.keys(AFRAME.BRUSHES)[0];
	      Brush = AFRAME.BRUSHES[newBrushName];
	      console.warn('Invalid brush name: `' + brushName + '` using `' + newBrushName + '`');
	    }

	    Brush.used = true;
	    var stroke = new Brush();
	    stroke.brush = Brush;
	    stroke.init(color, size);
	    this.strokes.push(stroke);

	    var entity = document.createElement('a-entity');
	    entity.className = "a-stroke";
	    document.querySelector('a-scene').appendChild(entity);
	    entity.setObject3D('mesh', stroke.object3D);
	    stroke.entity = entity;

	    return stroke;
	  },
	  getJSON: function () {
	    // Strokes
	    var json = {
	      version: VERSION,
	      strokes: [],
	      author: '',
	      brushes: this.getUsedBrushes()
	    };

	    for (i = 0; i < this.strokes.length; i++) {
	      json.strokes.push(this.strokes[i].getJSON(this));
	    }

	    return json;
	  },
	  getBinary: function () {
	    var dataViews = [];
	    var MAGIC = 'apainter';

	    // Used brushes
	    var usedBrushes = this.getUsedBrushes();

	    // MAGIC(8) + version (2) + usedBrushesNum(2) + usedBrushesStrings(*)
	    var bufferSize = MAGIC.length + usedBrushes.join(' ').length + 9;
	    var binaryManager = new BinaryManager(new ArrayBuffer(bufferSize));

	    // Header magic and version
	    binaryManager.writeString(MAGIC);
	    binaryManager.writeUint16(VERSION);

	    binaryManager.writeUint8(usedBrushes.length);
	    for (var i = 0; i < usedBrushes.length; i++) {
	      binaryManager.writeString(usedBrushes[i]);
	    }

	    // Number of strokes
	    binaryManager.writeUint32(this.strokes.length);
	    dataViews.push(binaryManager.getDataView());

	    // Strokes
	    for (i = 0; i < this.strokes.length; i++) {
	      dataViews.push(this.strokes[i].getBinary(this));
	    }
	    return dataViews;
	  },
	  getPointerPosition: (function () {
	    var pointerPosition = new THREE.Vector3();
	    var controllerOffset = {
	      'vive-controls': {
	        vec: new THREE.Vector3(0, 0.7, 1),
	        mult: -0.03
	      },
	      'oculus-touch-controls': {
	        vec: new THREE.Vector3(0, 0, 2.8),
	        mult: -0.05
	      }
	    };

	    return function getPointerPosition (position, orientation) {
	      if (!this.controllerName) {
	        return position;
	      }

	      var offsets = controllerOffset[this.controllerName];
	      var pointer = offsets.vec
	        .clone()
	        .applyQuaternion(orientation)
	        .normalize()
	        .multiplyScalar(offsets.mult);
	      pointerPosition.copy(position).add(pointer);
	      return pointerPosition;
	    };
	  })(),
	  loadJSON: function (data) {
	    if (data.version !== VERSION) {
	      console.error('Invalid version: ', data.version, '(Expected: ' + VERSION + ')');
	    }

	    var usedBrushes = [];

	    for (var i = 0; i < data.strokes.length; i++) {
	      var strokeData = data.strokes[i];
	      var brush = strokeData.brush;

	      var stroke = this.addNewStroke(
	        data.brushes[brush.index],
	        new THREE.Color().fromArray(brush.color),
	        brush.size
	      );

	      for (var j = 0; j < strokeData.points.length; j++) {
	        var point = strokeData.points[j];

	        var position = new THREE.Vector3().fromArray(point.position);
	        var orientation = new THREE.Quaternion().fromArray(point.orientation);
	        var pressure = point.pressure;
	        var timestamp = point.timestamp;

	        var pointerPosition = this.getPointerPosition(position, orientation);
	        stroke.addPoint(position, orientation, pointerPosition, pressure, timestamp);
	      }
	    }
	  },
	  loadBinary: function (buffer) {
	    var binaryManager = new BinaryManager(buffer);
	    var magic = binaryManager.readString();
	    if (magic !== 'apainter') {
	      console.error('Invalid `magic` header');
	      return;
	    }

	    var version = binaryManager.readUint16();
	    if (version !== VERSION) {
	      console.error('Invalid version: ', version, '(Expected: ' + VERSION + ')');
	    }

	    var numUsedBrushes = binaryManager.readUint8();
	    var usedBrushes = [];
	    for (var b = 0; b < numUsedBrushes; b++) {
	      usedBrushes.push(binaryManager.readString());
	    }

	    var numStrokes = binaryManager.readUint32();

	    for (var l = 0; l < numStrokes; l++) {
	      var brushIndex = binaryManager.readUint8();
	      var color = binaryManager.readColor();
	      var size = binaryManager.readFloat();
	      var numPoints = binaryManager.readUint32();

	      var stroke = this.addNewStroke(usedBrushes[brushIndex], color, size);

	      for (var i = 0; i < numPoints; i++) {
	        var position = binaryManager.readVector3();
	        var orientation = binaryManager.readQuaternion();
	        var pressure = binaryManager.readFloat();
	        var timestamp = binaryManager.readUint32();

	        var pointerPosition = this.getPointerPosition(position, orientation);
	        stroke.addPoint(position, orientation, pointerPosition, pressure, timestamp);
	      }
	    }
	  },
	  loadFromUrl: function (url, binary) {
	    var loader = new THREE.XHRLoader(this.manager);
	    loader.crossOrigin = 'anonymous';
	    if (binary === true) {
	      loader.setResponseType('arraybuffer');
	    }

	    var self = this;

	    loader.load(url, function (buffer) {
	      if (binary === true) {
	        self.loadBinary(buffer);
	      } else {
	        self.loadJSON(JSON.parse(buffer));
	      }
	    });
	  }
	});


/***/ },
/* 10 */
/***/ function(module, exports) {

	/* globals AFRAME */
	AFRAME.registerSystem('ui', {
	  init: function () {
	    this.initTextures();
	  },

	  initTextures: function () {
	    var self = this;
	    var hoverTextureUrl = 'assets/images/ui-hover.png';
	    var pressedTextureUrl = 'assets/images/ui-pressed.png';
	    this.sceneEl.systems.material.loadTexture(hoverTextureUrl, {src: hoverTextureUrl}, onLoadedHoverTexture);
	    this.sceneEl.systems.material.loadTexture(pressedTextureUrl, {src: pressedTextureUrl}, onLoadedPressedTexture);
	    function onLoadedHoverTexture (texture) {
	      self.hoverTexture = texture;
	    }
	    function onLoadedPressedTexture (texture) {
	      self.pressedTexture = texture;
	    }
	  },

	  closeAll: function () {
	    var els = document.querySelectorAll('[ui]');
	    var i;
	    for (i = 0; i < els.length; i++) {
	      els[i].components.ui.close();
	    }
	  }
	});


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* global AFRAME Blob uploadcare */

	var saveAs = __webpack_require__(1).saveAs;

	AFRAME.registerSystem('painter', {
	  init: function () {
	    this.version = '1.1';
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
	      document.getElementById('acamera').setAttribute('orbit-controls', 'position', '0 1.6 3');
	      document.getElementById('apainter-logo').classList.remove('hidden');
	      //document.getElementById('apainter-author').classList.remove('hidden'); // not used yet
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

	    this.startPainting = false;
	    var self = this;
	    document.addEventListener('stroke-started', function (event) {
	      if (!self.startPainting) {
	        var logo = document.getElementById('logo');
	        var mesh = logo.getObject3D('mesh');
	        var tween = new AFRAME.TWEEN.Tween({ alpha: 1.0 })
	          .to({alpha: 0.0}, 4000)
	          .onComplete(function () {
	            logo.setAttribute('visible', false);
	          })
	          .onUpdate(function () {
	            mesh.children[0].material.opacity = this.alpha;
	          }).start();
	        self.startPainting = true;
	      }
	    });

	    // @fixme This is just for debug until we'll get some UI
	    document.addEventListener('keyup', function (event) {
	      if (event.keyCode === 8) {
	        // Undo (Backspace)
	        self.brushSystem.undo();
	      }
	      if (event.keyCode === 67) {
	        // Clear (c)
	        self.brushSystem.clear();
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
	  upload: function (success, error) {
	    this.sceneEl.emit('drawing-upload-started');
	    var self = this;

	    var baseUrl = 'https://aframe.io/a-painter/?url=';

	    var dataviews = this.brushSystem.getBinary();
	    var blob = new Blob(dataviews, {type: 'application/octet-binary'});
	    var uploader = 'uploadcare'; // or 'fileio'
	    if (uploader === 'fileio') {
	      // Using file.io
	      var fd = new window.FormData();
	      fd.append('file', blob);
	      var xhr = new window.XMLHttpRequest();
	      xhr.open('POST', 'https://file.io'); // ?expires=1y
	      xhr.onreadystatechange = function (data) {
	        if (xhr.readyState === 4) {
	          var response = JSON.parse(xhr.response);
	          if (response.success) {
	            console.log('Uploaded link: ', baseUrl + response.link);
	            self.sceneEl.emit('drawing-upload-completed', {url: baseUrl + response.link});
	            if (success) { success(); }
	          }
	        } else {
	          self.sceneEl.emit('drawing-upload-error', {errorInfo: null, fileInfo: null});
	          if (error) { error(); }
	        }
	      };
	      xhr.send(fd);
	    } else {
	      var file = uploadcare.fileFrom('object', blob);
	      file.done(function (fileInfo) {
	        console.log('Uploaded link: ', baseUrl + fileInfo.cdnUrl);
	        self.sceneEl.emit('drawing-upload-completed', {url: baseUrl + fileInfo.cdnUrl});
	        if (success) { success(); }
	      }).fail(function (errorInfo, fileInfo) {
	        self.sceneEl.emit('drawing-upload-error', {errorInfo: errorInfo, fileInfo: fileInfo});
	        if (error) { error(errorInfo); }
	      }).progress(function (uploadInfo) {
	        self.sceneEl.emit('drawing-upload-progress', {progress: uploadInfo.progress});
	      });
	    }
	  }
	});


/***/ },
/* 12 */
/***/ function(module, exports) {

	/* globals AFRAME THREE */
	AFRAME.registerComponent('brush', {
	  schema: {
	    color: {type: 'color', default: '#ef2d5e'},
	    size: {default: 0.01, min: 0.001, max: 0.3},
	    brush: {default: 'flat'},
	    enabled: { default: true }
	  },
	  init: function () {
	    var data = this.data;
	    this.color = new THREE.Color(data.color);

	    this.el.emit('brushcolor-changed', {color: this.color});
	    this.el.emit('brushsize-changed', {brushSize: data.size});

	    this.active = false;
	    this.obj = this.el.object3D;

	    this.currentStroke = null;
	    this.strokeEntities = [];

	    this.sizeModifier = 0.0;
	    this.textures = {};
	    this.currentMap = 0;

	    this.model = this.el.getObject3D('mesh');
	    this.drawing = false;

	    var self = this;

	    this.previousAxis = 0;
	/*
	    this.el.addEventListener('axismove', function (evt) {
	      if (evt.detail.axis[0] === 0 && evt.detail.axis[1] === 0 || this.previousAxis === evt.detail.axis[1]) {
	        return;
	      }

	      this.previousAxis = evt.detail.axis[1];
	      var size = (evt.detail.axis[1] + 1) / 2 * self.schema.size.max;

	      self.el.setAttribute('brush', 'size', size);
	    });
	*/
	    this.el.addEventListener('buttondown', function (evt) {
	      if (!self.data.enabled) { return; }
	      // Grip
	      if (evt.detail.id === 2) {
	        self.system.undo();
	      }
	    });

	    this.el.addEventListener('buttonchanged', function (evt) {
	      if (!self.data.enabled) { return; }
	      // Trigger
	      if (evt.detail.id === 1) {
	        var value = evt.detail.state.value;
	        self.sizeModifier = value;
	        if (value > 0.1) {
	          if (!self.active) {
	            self.startNewStroke();
	            self.active = true;
	          }
	        } else {
	          if (self.active) {
	            self.previousEntity = self.currentEntity;
	            self.currentStroke = null;
	          }
	          self.active = false;
	        }
	      }
	    });
	  },
	  update: function (oldData) {
	    var data = this.data;
	    if (oldData.color !== data.color) {
	      this.color.set(data.color);
	      this.el.emit('brushcolor-changed', {color: this.color});
	    }
	    if (oldData.size !== data.size) {
	      this.el.emit('brushsize-changed', {size: data.size});
	    }
	  },
	  tick: (function () {
	    var position = new THREE.Vector3();
	    var rotation = new THREE.Quaternion();
	    var scale = new THREE.Vector3();

	    return function tick (time, delta) {
	      if (this.currentStroke && this.active) {
	        this.obj.matrixWorld.decompose(position, rotation, scale);
	        var pointerPosition = this.system.getPointerPosition(position, rotation);
	        this.currentStroke.addPoint(position, rotation, pointerPosition, this.sizeModifier, time);
	      }
	    };
	  })(),
	  startNewStroke: function () {
	    this.currentStroke = this.system.addNewStroke(this.data.brush, this.color, this.data.size);
	    this.el.emit('stroke-started', {entity: this.el, stroke: this.currentStroke});
	  }
	});


/***/ },
/* 13 */
/***/ function(module, exports) {

	/* global AFRAME */
	var utils = AFRAME.utils;

	/**
	 * Set properties if headset is not connected by checking getVRDisplays().
	 */
	AFRAME.registerComponent('if-no-vr-headset', {
	  schema: {
	    default: {},
	    parse: utils.styleParser.parse
	  },

	  update: function () {
	    var self = this;

	    // Don't count mobile as VR.
	    if (this.el.sceneEl.isMobile) {
	      this.setProperties();
	      return;
	    }

	    // Check VRDisplays to determine if headset is connected.
	    navigator.getVRDisplays().then(function (displays) {
	      // Special case for WebVR emulator.
	      if (displays.length && displays[0].displayName !== 'Emulated HTC Vive DVT') { return; }
	      self.setProperties();
	    });
	  },

	  setProperties: function () {
	    var data = this.data;
	    var el = this.el;
	    Object.keys(data).forEach(function set (component) {
	      el.setAttribute(component, data[component]);
	    });
	  }
	});


/***/ },
/* 14 */
/***/ function(module, exports) {

	/* globals AFRAME THREE */

	AFRAME.registerComponent('json-model', {
	  schema: {
	    src: {type: 'asset'}
	  },

	  init: function () {
	    this.objectLoader = new THREE.ObjectLoader();
	    this.objectLoader.setCrossOrigin('');
	  },

	  update: function (oldData) {
	    var self = this;
	    var src = this.data.src;
	    if (!src || src === oldData.src) { return; }
	    this.objectLoader.load(this.data.src, function (group) {
	      var Rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
	      group.traverse(function (child) {
	        if (!(child instanceof THREE.Mesh)) { return; }
	        child.position.applyMatrix4(Rotation);
	      });
	      self.el.setObject3D('mesh', group);
	      self.el.emit('model-loaded', {format: 'json', model: group, src: src});
	    });
	  }
	});


/***/ },
/* 15 */
/***/ function(module, exports) {

	AFRAME.registerComponent('orbit-controls', {
	  dependencies: ['camera'],
	  schema: {
	    position: { default: '0 1.6 0.1', type: 'vec3'}
	  },

	  init: function () {
	    var sceneEl = this.el.sceneEl;
	    var setupControls = this.setupControls.bind(this);
	    if (!this.el.sceneEl.is('vr-mode')) {
	      this.el.setAttribute('position', this.data.position);
	    }
	    if (!sceneEl.canvas) {
	      sceneEl.addEventListener('render-target-loaded', setupControls);
	    } else {
	      setupControls();
	    }
	    this.onEnterVR = this.onEnterVR.bind(this);
	    this.onExitVR = this.onExitVR.bind(this);
	    sceneEl.addEventListener('enter-vr', this.onEnterVR);
	    sceneEl.addEventListener('exit-vr', this.onExitVR);
	  },

	  onExitVR: function () {
	    this.el.setAttribute('position', this.data.position);
	    this.controls.enabled = true;
	  },

	  onEnterVR: function () {
	    if (!AFRAME.utils.device.checkHeadsetConnected() && !this.el.sceneEl.isMobile) {return; }

	    var currentPosition = this.el.getAttribute('position');
	    var camera = this.el.getObject3D('camera');
	    this.controls.enabled = false;
	    camera.position.set(0, 0, 0);
	    camera.rotation.set(0, 0, 0);
	    if (this.el.sceneEl.isMobile) { return; }
	    this.el.setAttribute('position', {
	      x: currentPosition.x - this.data.position.x,
	      y: currentPosition.y - this.data.position.y,
	      z: currentPosition.z - this.data.position.z
	    });

	  },

	  setupControls: function() {
	    var renderer = this.el.sceneEl.renderer;
	    var camera = this.el.getObject3D('camera');
	    var controls = this.controls = new THREE.OrbitControls(camera, renderer.domElement);
	    var position = this.el.getAttribute('position');
	    controls.target.setX(-position.x);
	    controls.target.setZ(-position.z);
	    controls.enableDamping = true;
	    controls.dampingFactor = 1.0;
	    controls.enableZoom = true;
	  },

	  play: function () {
	    if (!this.controls) { return; }
	    this.controls.enable = true;
	  },

	  pause: function () {
	    if (!this.controls) { return; }
	    this.controls.enable = false;
	  },

	  remove: function () {
	    this.pause();
	  }
	});


/***/ },
/* 16 */
/***/ function(module, exports) {

	AFRAME.registerSystem('paint-controls', {
	  numberStrokes: 0
	});

	/* globals AFRAME THREE */
	AFRAME.registerComponent('paint-controls', {
	  dependencies: ['brush'],

	  schema: {
	    hand: {default: 'left'}
	  },

	  init: function () {
	    var el = this.el;
	    var self = this;
	    var highLightTextureUrl = 'assets/images/controller-pressed.png';
	    this.controller = null;
	    this.modelLoaded = false;

	    this.onModelLoaded = this.onModelLoaded.bind(this);
	    el.addEventListener('model-loaded', this.onModelLoaded);

	    el.addEventListener('controllerconnected', function (evt) {
	      var controllerName = evt.detail.name;
	      if (controllerName === 'oculus-touch-controls') {
	        var hand = evt.detail.component.data.hand;
	        el.setAttribute('teleport-controls', {button: hand === 'left' ? 'ybutton' : 'bbutton'});
	        el.setAttribute('obj-model', {obj: 'assets/models/oculus-' + hand + '-controller.obj', mtl: 'https://cdn.aframe.io/controllers/oculus/oculus-touch-controller-' + hand + '.mtl'});


	        var tooltips = Array.prototype.slice.call(document.querySelectorAll('.oculus-tooltips'));
	        tooltips.forEach(function (tooltip) {
	          tooltip.setAttribute('visible', true);
	        });

	        el.addEventListener('axismove', function (evt) {
	          if (evt.detail.axis[0] === 0 && evt.detail.axis[1] === 0 || self.previousAxis === evt.detail.axis[1]) { return; }

	          var delta = evt.detail.axis[1] / 300;
	          var size = el.components.brush.schema.size;
	          var value = THREE.Math.clamp(self.el.getAttribute('brush').size - delta, size.min, size.max);

	          self.el.setAttribute('brush', 'size', value);
	        });

	      } else if (controllerName === 'vive-controls') {
	        el.setAttribute('json-model', {src: 'assets/models/controller_vive.json'});
	        el.setAttribute('teleport-controls', {button: 'trackpad'});

	        var tooltips = Array.prototype.slice.call(document.querySelectorAll('.vive-tooltips'));
	        tooltips.forEach(function (tooltip) {
	          tooltip.setAttribute('visible', true);
	        });

	        el.addEventListener('axismove', function (evt) {
	          if (evt.detail.axis[0] === 0 && evt.detail.axis[1] === 0 || self.previousAxis === evt.detail.axis[1]) { return; }

	          if (self.touchStarted) {
	            self.touchStarted = false;
	            self.startAxis = (evt.detail.axis[1] + 1) / 2;
	          }

	          var currentAxis = (evt.detail.axis[1] + 1) / 2;
	          var delta = (self.startAxis - currentAxis) / 2;

	          self.startAxis = currentAxis;

	          var startValue = self.el.getAttribute('brush').size;
	          var size = el.components.brush.schema.size;
	          var value = THREE.Math.clamp(startValue - delta, size.min, size.max);

	          self.el.setAttribute('brush', 'size', value);
	        });

	        el.addEventListener('trackpadtouchstart', function () {
	          self.touchStarted = true;
	        });

	        self.touchStarted = false;

	      } else { return; }

	      this.controller = controllerName;
	    });

	    el.addEventListener('brushsize-changed', function (evt) { self.changeBrushSize(evt.detail.size); });
	    el.addEventListener('brushcolor-changed', function (evt) { self.changeBrushColor(evt.detail.color); });

	    function createTexture (texture) {
	      var material = self.highLightMaterial = new THREE.MeshBasicMaterial();
	      material.map = texture;
	      material.needsUpdate = true;
	    }
	    el.sceneEl.systems.material.loadTexture(highLightTextureUrl, {src: highLightTextureUrl}, createTexture);

	    this.startAxis = 0;

	    this.numberStrokes = 0;

	    document.addEventListener('stroke-started', function (event) {
	      if (event.detail.entity.components['paint-controls'] !== self) { return; }

	      self.numberStrokes++;
	      self.system.numberStrokes++;

	      // 3 Strokes to hide
	      if (self.system.numberStrokes === 3) {
	        var tooltips = Array.prototype.slice.call(document.querySelectorAll('[tooltip]'));
	        var object = { opacity: 1.0 };

	        var tween = new AFRAME.TWEEN.Tween(object)
	          .to({opacity: 0.0}, 4000)
	          .onComplete(function () {
	            tooltips.forEach(function (tooltip) {
	              tooltip.setAttribute('visible', false);
	            });
	          })
	          .delay(2000)
	          .onUpdate(function () {
	            tooltips.forEach(function (tooltip) {
	              tooltip.setAttribute('tooltip', {opacity: object.opacity});
	            });
	          });
	        tween.start();
	      }
	    });
	  },

	  changeBrushColor: function (color) {
	    if (this.modelLoaded) {
	      this.buttonMeshes.colorTip.material.color.copy(color);
	      this.buttonMeshes.sizeHint.material.color.copy(color);
	    }
	  },

	  changeBrushSize: function (size) {
	    var scale = size / 2 * 10;
	    if (this.modelLoaded) {
	      this.buttonMeshes.sizeHint.scale.set(scale, scale, 1);
	    }
	  },

	  // buttonId
	  // 0 - trackpad
	  // 1 - trigger ( intensity value from 0.5 to 1 )
	  // 2 - grip
	  // 3 - menu ( dispatch but better for menu options )
	  // 4 - system ( never dispatched on this layer )
	  mapping: {
	    axis0: 'trackpad',
	    axis1: 'trackpad',
	    button0: 'trackpad',
	    button1: 'trigger',
	    button2: 'grip',
	    button3: 'menu',
	    button4: 'system'
	  },

	  update: function () {
	    var data = this.data;
	    var el = this.el;
	    el.setAttribute('vive-controls', {hand: data.hand, model: false});
	    el.setAttribute('oculus-touch-controls', {hand: data.hand, model: false});
	  },

	  play: function () {
	  },

	  pause: function () {
	  },

	  onModelLoaded: function (evt) {
	    var controllerObject3D = evt.detail.model;
	    var buttonMeshes;
	    if (evt.detail.target !== this.el) { return; }

	    buttonMeshes = this.buttonMeshes = {};

	    buttonMeshes.sizeHint = controllerObject3D.getObjectByName('sizehint');
	    buttonMeshes.colorTip = controllerObject3D.getObjectByName('tip');

	    this.modelLoaded = true;

	    this.changeBrushSize(this.el.components.brush.data.size);
	    this.changeBrushColor(this.el.components.brush.color);
	  },

	  onButtonEvent: function (id, evtName) {
	    var buttonName = this.mapping['button' + id];
	    this.el.emit(buttonName + evtName);
	    this.updateModel(buttonName, evtName);
	  },

	  updateModel: function (buttonName, state) {
	    var material = state === 'up' ? this.material : this.highLightMaterial;
	    var buttonMeshes = this.buttonMeshes;
	    var button = buttonMeshes && buttonMeshes[buttonName];
	    if (state === 'down' && button && !this.material) {
	      material = this.material = button.material;
	    }
	    if (!material) { return; }
	    if (buttonName === 'grip') {
	      buttonMeshes.grip.left.material = material;
	      buttonMeshes.grip.right.material = material;
	      return;
	    }
	    if (!button) { return; }
	    button.material = material;
	  }
	});


/***/ },
/* 17 */
/***/ function(module, exports) {

	/* globals AFRAME THREE */
	AFRAME.registerComponent('ui', {
	  schema: { brightness: { default: 1.0, max: 1.0, min: 0.0 } },
	  dependencies: ['ui-raycaster'],

	  init: function () {
	    var el = this.el;
	    var uiEl = this.uiEl = document.createElement('a-entity');
	    var rayEl = this.rayEl = document.createElement('a-entity');
	    this.closed = true;
	    this.colorStack = ['#272727', '#727272', '#FFFFFF', '#24CAFF', '#249F90', '#F2E646', '#EF2D5E'];
	    this.bindMethods();
	    this.colorHasChanged = true;
	    this.highlightMaterials = {};
	    this.intersectedObjects = [];
	    this.hoveredOffObjects = [];
	    this.hoveredOnObjects = [];
	    this.pressedObjects = {};
	    this.selectedObjects = {};
	    this.unpressedObjects = {};
	    this.brushButtonsMapping = {};
	    this.brushRegexp = /^(?!.*(fg|bg)$)brush[0-9]+/;
	    this.colorHistoryRegexp = /^(?!.*(fg|bg)$)colorhistory[0-9]+$/;
	    this.hsv = { h: 0.0, s: 0.0, v: 1.0 };
	    this.rayAngle = 45;
	    this.rayDistance = 0.2;

	    // The cursor is centered in 0,0 to allow scale it easily
	    // This is the offset to put it back in its original position on the slider
	    this.cursorOffset = new THREE.Vector3(0.06409, 0.01419, -0.10242);

	    // UI entity setup
	    uiEl.setAttribute('material', {
	      color: '#ffffff',
	      flatShading: true,
	      shader: 'flat',
	      transparent: true,
	      fog: false,
	      src: '#uinormal'
	    });
	    uiEl.setAttribute('obj-model', 'obj:#uiobj');
	    uiEl.setAttribute('position', '0 0.04 -0.15');

	    uiEl.setAttribute('scale', '0 0 0');
	    uiEl.setAttribute('visible', false);
	    uiEl.classList.add('apainter-ui');
	    el.appendChild(uiEl);

	    // Ray entity setup
	    rayEl.setAttribute('line', '');
	    //rayEl.setAttribute('visible', false);
	    el.appendChild(rayEl);

	    // Raycaster setup
	    el.setAttribute('ui-raycaster', {
	      far: this.rayDistance,
	      objects: '.apainter-ui',
	      rotation: -this.rayAngle
	    });

	    this.controller = null;

	    var self = this;
	    el.addEventListener('controllerconnected', function (evt) {
	      var controllerName = evt.detail.name;

	      self.controller = {
	        name: controllerName,
	        hand: evt.detail.component.data.hand
	      }

	      if (controllerName === 'oculus-touch-controls') {
	        self.uiEl.setAttribute('rotation', '45 0 0');
	        uiEl.setAttribute('position', '0 0.13 -0.08');
	        self.rayAngle = 0;
	        el.setAttribute('ui-raycaster', {
	          rotation: 0
	        });
	      }

	      if (self.el.isPlaying) {
	        self.addToggleEvent();
	      }
	    });
	  },

	  initColorWheel: function () {
	    var colorWheel = this.objects.hueWheel;

	    var vertexShader = '\
	      varying vec2 vUv;\
	      void main() {\
	        vUv = uv;\
	        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\
	        gl_Position = projectionMatrix * mvPosition;\
	      }\
	      ';

	    var fragmentShader = '\
	      #define M_PI2 6.28318530718\n \
	      uniform float brightness;\
	      varying vec2 vUv;\
	      vec3 hsb2rgb(in vec3 c){\
	          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, \
	                           0.0, \
	                           1.0 );\
	          rgb = rgb * rgb * (3.0 - 2.0 * rgb);\
	          return c.z * mix( vec3(1.0), rgb, c.y);\
	      }\
	      \
	      void main() {\
	        vec2 toCenter = vec2(0.5) - vUv;\
	        float angle = atan(toCenter.y, toCenter.x);\
	        float radius = length(toCenter) * 2.0;\
	        vec3 color = hsb2rgb(vec3((angle / M_PI2) + 0.5, radius, brightness));\
	        gl_FragColor = vec4(color, 1.0);\
	      }\
	      ';

	    var material = new THREE.ShaderMaterial({
	      uniforms: { brightness: { type: 'f', value: this.hsv.v } },
	      vertexShader: vertexShader,
	      fragmentShader: fragmentShader
	    });
	    colorWheel.material = material;
	  },

	  bindMethods: function () {
	    this.onComponentChanged = this.onComponentChanged.bind(this);
	    this.onTriggerChanged = this.onTriggerChanged.bind(this);
	    this.onIntersection = this.onIntersection.bind(this);
	    this.onIntersected = this.onIntersected.bind(this);
	    this.onIntersectionCleared = this.onIntersectionCleared.bind(this);
	    this.onIntersectedCleared = this.onIntersectedCleared.bind(this);
	    this.onModelLoaded = this.onModelLoaded.bind(this);
	    this.onStrokeStarted = this.onStrokeStarted.bind(this);
	    this.toggleMenu = this.toggleMenu.bind(this);
	  },

	  tick: function () {
	    // Hack until https://github.com/aframevr/aframe/issues/1886
	    // is fixed.
	    this.el.components['ui-raycaster'].refreshObjects();
	    if (!this.closed && this.handEl) {
	      this.updateIntersections();
	      this.handleHover();
	      this.handlePressedButtons();
	    }
	  },

	  onTriggerChanged: function (evt) {
	    var triggerValue = evt.detail.value;
	    this.lastTriggerValue = triggerValue;
	    if (evt.detail.value >= 0.25) {
	      this.triggeredPressed = true;
	    } else {
	      this.triggeredPressed = false;
	      this.handleButtonUp();
	    }
	  },

	  handleButtonDown: function (object, position) {
	    var name = object.name;
	    if (this.activeWidget && this.activeWidget !== name) { return; }
	    this.activeWidget = name;
	    switch (true) {
	      case name === 'brightness': {
	        this.onBrightnessDown(position);
	        break;
	      }
	      case name === 'brushnext': {
	        if (!this.pressedObjects[name]) {
	          this.nextPage();
	        }
	        break;
	      }
	      case name === 'brushprev': {
	        if (!this.pressedObjects[name]) {
	          this.previousPage();
	        }
	        break;
	      }
	      case name === 'clear': {
	        if (!this.pressedObjects[name]) {
	          this.el.sceneEl.systems.brush.clear();
	        }
	        break;
	      }
	      case name === 'copy': {
	        if (!this.pressedObjects[name]) {
	          this.copyBrush();
	        }
	        break;
	      }
	      case name === 'hue': {
	        this.onHueDown(position);
	        break;
	      }
	      case name === 'save': {
	        if (!this.pressedObjects[name]) {
	          this.el.sceneEl.systems.painter.upload();
	        }
	        break;
	      }
	      case name === 'sizebg': {
	        this.onBrushSizeBackgroundDown(position);
	        break;
	      }
	      case this.brushRegexp.test(name): {
	        this.onBrushDown(name);
	        break;
	      }
	      case this.colorHistoryRegexp.test(name): {
	        this.onColorHistoryButtonDown(object);
	        break;
	      }
	      default: {
	        this.activeWidget = undefined;
	      }
	    }
	    this.pressedObjects[name] = object;
	  },

	  copyBrush: function () {
	    var brush = this.el.getAttribute('brush');
	    this.handEl.setAttribute('brush', 'brush', brush.brush);
	    this.handEl.setAttribute('brush', 'color', brush.color);
	    this.handEl.setAttribute('brush', 'size', brush.size);
	    this.colorHasChanged = true;
	  },

	  handleButtonUp: function () {
	    var pressedObjects = this.pressedObjects;
	    var unpressedObjects = this.unpressedObjects;
	    this.activeWidget = undefined;
	    Object.keys(pressedObjects).forEach(function (key) {
	      var buttonName = pressedObjects[key].name;
	      switch (true) {
	        case buttonName === 'size': {
	          // self.onBrushSizeUp();
	          break;
	        }
	        default: {
	          break;
	        }
	      }
	      unpressedObjects[buttonName] = pressedObjects[buttonName];
	      delete pressedObjects[buttonName];
	    });
	  },

	  handlePressedButtons: function () {
	    var self = this;
	    if (!this.triggeredPressed) { return; }
	    this.hoveredOnObjects.forEach(function triggerAction (button) {
	      self.handleButtonDown(button.object, button.point);
	    });
	  },

	  onColorHistoryButtonDown: function (object) {
	    var color = object.material.color.getHexString();
	    this.handEl.setAttribute('brush', 'color', '#' + color);
	  },

	  onBrushDown: function (name) {
	    var brushName = this.brushButtonsMapping[name];
	    if (!brushName) { return; }
	    this.selectBrushButton(name);
	    this.handEl.setAttribute('brush', 'brush', brushName.toLowerCase());
	  },

	  selectBrushButton: function (brushName) {
	    var object = this.uiEl.getObject3D('mesh').getObjectByName(brushName + 'bg');
	    var selectedObjects = this.selectedObjects;
	    var selectedBrush = this.selectedBrush;
	    if (selectedBrush) {
	      if (!this.highlightMaterials[selectedBrush.name]) {
	        this.initHighlightMaterial(object);
	      }
	      selectedBrush.material = this.highlightMaterials[selectedBrush.name].normal;
	      delete selectedObjects[selectedBrush.name];
	    }
	    selectedObjects[object.name] = object;
	    this.selectedBrush = object;
	  },

	  onHueDown: function (position) {
	    var hueWheel = this.objects.hueWheel;
	    var polarPosition;
	    var radius = this.colorWheelSize;
	    hueWheel.updateMatrixWorld();
	    hueWheel.worldToLocal(position);
	    this.objects.hueCursor.position.copy(position);

	    polarPosition = {
	      r: Math.sqrt(position.x * position.x + position.z * position.z),
	      theta: Math.PI + Math.atan2(-position.z, position.x)
	    };
	    var angle = ((polarPosition.theta * (180 / Math.PI)) + 180) % 360;
	    this.hsv.h = angle / 360;
	    this.hsv.s = polarPosition.r / radius;
	    this.updateColor();
	  },

	  updateColor: function () {
	    var rgb = this.hsv2rgb(this.hsv);
	    var color = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
	    this.handEl.setAttribute('brush', 'color', color);
	    this.colorHasChanged = true;
	  },

	  hsv2rgb: function (hsv) {
	    var r, g, b, i, f, p, q, t;
	    var h = THREE.Math.clamp(hsv.h, 0, 1);
	    var s = THREE.Math.clamp(hsv.s, 0, 1);
	    var v = hsv.v;

	    i = Math.floor(h * 6);
	    f = h * 6 - i;
	    p = v * (1 - s);
	    q = v * (1 - f * s);
	    t = v * (1 - (1 - f) * s);
	    switch (i % 6) {
	      case 0: r = v; g = t; b = p; break;
	      case 1: r = q; g = v; b = p; break;
	      case 2: r = p; g = v; b = t; break;
	      case 3: r = p; g = q; b = v; break;
	      case 4: r = t; g = p; b = v; break;
	      case 5: r = v; g = p; b = q; break;
	    }
	    return {
	      r: Math.round(r * 255),
	      g: Math.round(g * 255),
	      b: Math.round(b * 255)
	    };
	  },

	  rgb2hsv: function (r, g, b) {
	    var max = Math.max(r, g, b);
	    var min = Math.min(r, g, b);
	    var d = max - min;
	    var h;
	    var s = (max === 0 ? 0 : d / max);
	    var v = max;

	    if (arguments.length === 1) { g = r.g; b = r.b; r = r.r; }

	    switch (max) {
	      case min: h = 0; break;
	      case r: h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d; break;
	      case g: h = (b - r) + d * 2; h /= 6 * d; break;
	      case b: h = (r - g) + d * 4; h /= 6 * d; break;
	    }
	    return {h: h, s: s, v: v};
	  },

	  onBrightnessDown: function (position) {
	    var slider = this.objects.brightnessSlider;
	    var sliderBoundingBox = slider.geometry.boundingBox;
	    var sliderHeight = sliderBoundingBox.max.z - sliderBoundingBox.min.z;
	    slider.updateMatrixWorld();
	    slider.worldToLocal(position);
	    var brightness = 1.0 - (position.z - sliderBoundingBox.min.z) / sliderHeight;
	    // remove object border padding
	    brightness = THREE.Math.clamp(brightness * 1.29 - 0.12, 0.0, 1.0);
	    this.objects.hueWheel.material.uniforms['brightness'].value = brightness;
	    this.objects.brightnessCursor.rotation.y = brightness * 1.5 - 1.5;
	    this.hsv.v = brightness;
	    this.updateColor();
	  },

	  onBrushSizeBackgroundDown: function (position) {
	    var slider = this.objects.sizeSlider;
	    var sliderBoundingBox = slider.geometry.boundingBox;
	    var sliderWidth = sliderBoundingBox.max.x - sliderBoundingBox.min.x;
	    slider.updateMatrixWorld();
	    slider.worldToLocal(position);
	    var brushSize = (position.x - sliderBoundingBox.min.x) / sliderWidth;
	    brushSize = brushSize * AFRAME.components.brush.schema.size.max;
	    this.handEl.setAttribute('brush', 'size', brushSize);
	  },

	  handleHover: function () {
	    this.updateHoverObjects();
	    this.updateMaterials();
	  },

	  updateHoverObjects: function () {
	    var intersectedObjects = this.intersectedObjects;
	    intersectedObjects = intersectedObjects.filter(function (obj) {
	      return obj.object.name !== 'bb' && obj.object.name !== 'msg_save';
	    });
	    this.hoveredOffObjects = this.hoveredOnObjects.filter(function (obj) {
	      return intersectedObjects.indexOf(obj) === -1;
	    });
	    this.hoveredOnObjects = intersectedObjects;
	  },

	  updateMaterials: (function () {
	    var point = new THREE.Vector3();
	    return function () {
	      var self = this;
	      var pressedObjects = this.pressedObjects;
	      var unpressedObjects = this.unpressedObjects;
	      var selectedObjects = this.selectedObjects;
	      // Remove hover highlights
	      this.hoveredOffObjects.forEach(function (obj) {
	        var object = obj.object;
	        object.material = self.highlightMaterials[object.name].normal;
	      });
	      // Add highlight to newly intersected objects
	      this.hoveredOnObjects.forEach(function (obj) {
	        var object = obj.object;
	        point.copy(obj.point);
	        if (!self.highlightMaterials[object.name]) {
	          self.initHighlightMaterial(object);
	        }
	        // Update ray
	        self.handRayEl.object3D.worldToLocal(point);
	        self.handRayEl.setAttribute('line', 'end', point);
	        object.material = self.highlightMaterials[object.name].hover;
	      });
	      // Pressed Material
	      Object.keys(pressedObjects).forEach(function (key) {
	        var object = pressedObjects[key];
	        var materials = self.highlightMaterials[object.name];
	        object.material = materials.pressed || object.material;
	      });
	      // Unpressed Material
	      Object.keys(unpressedObjects).forEach(function (key) {
	        var object = unpressedObjects[key];
	        var materials = self.highlightMaterials[object.name];
	        object.material = materials.normal;
	        delete unpressedObjects[key];
	      });
	      // Selected material
	      Object.keys(selectedObjects).forEach(function (key) {
	        var object = selectedObjects[key];
	        var materials = self.highlightMaterials[object.name];
	        if (!materials) { return; }
	        object.material = materials.selected;
	      });
	    };
	  })(),

	  addToggleEvent: function () {
	    var el = this.el;

	    if (this.controller.name === 'oculus-touch-controls') {
	      if (this.controller.hand === 'left') {
	        el.addEventListener('xbuttondown', this.toggleMenu);
	      } else {
	        el.addEventListener('abuttondown', this.toggleMenu);
	      }
	    } else if (this.controller.name === 'vive-controls') {
	      el.addEventListener('menudown', this.toggleMenu);
	    }
	  },

	  removeToggleEvent: function () {
	    var el = this.el;

	    if (this.controller.name === 'oculus-touch-controls') {
	      if (this.controller.hand === 'left') {
	        el.removeEventListener('xbuttondown', this.toggleMenu);
	      } else {
	        el.removeEventListener('abuttondown', this.toggleMenu);
	      }
	    } else if (this.controller.name === 'vive-controls') {
	      el.removeEventListener('menudown', this.toggleMenu);
	    }
	  },

	  play: function () {
	    var el = this.el;
	    var handEl = this.handEl;
	    if (this.controller) {
	      this.addToggleEvent();
	    }

	    el.addEventListener('model-loaded', this.onModelLoaded);
	    el.addEventListener('raycaster-intersection', this.onIntersection);
	    el.addEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
	    el.addEventListener('raycaster-intersected', this.onIntersected);
	    el.addEventListener('raycaster-intersected-cleared', this.onIntersectedCleared);
	    if (!handEl) { return; }
	    this.addHandListeners();
	  },

	  pause: function () {
	    var el = this.el;
	    var handEl = this.handEl;

	    if (this.controller) {
	      this.removeToggleEvent();
	    }

	    el.removeEventListener('raycaster-intersection', this.onIntersection);
	    el.removeEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
	    el.removeEventListener('raycaster-intersected', this.onIntersected);
	    el.removeEventListener('raycaster-intersected-cleared', this.onIntersectedCleared);
	    if (!handEl) { return; }
	    this.removeHandListeners();
	  },

	  onModelLoaded: function (evt) {
	    var uiEl = this.uiEl;
	    var model = uiEl.getObject3D('mesh');
	    model = evt.detail.model;
	    if (evt.detail.format !== 'obj' || !model.getObjectByName('brightnesscursor')) { return; }

	    this.objects = {};
	    this.objects.brightnessCursor = model.getObjectByName('brightnesscursor');
	    this.objects.brightnessSlider = model.getObjectByName('brightness');
	    this.objects.brightnessSlider.geometry.computeBoundingBox();
	    this.objects.previousPage = model.getObjectByName('brushprev');
	    this.objects.nextPage = model.getObjectByName('brushnext');

	    this.objects.hueCursor = model.getObjectByName('huecursor');
	    this.objects.hueWheel = model.getObjectByName('hue');
	    this.objects.hueWheel.geometry.computeBoundingSphere();
	    this.colorWheelSize = this.objects.hueWheel.geometry.boundingSphere.radius;

	    this.objects.sizeCursor = model.getObjectByName('size');
	    this.objects.sizeCursor.position.copy(this.cursorOffset);
	    this.objects.colorHistory = [];
	    for (var i = 0; i < 7; i++) {
	      this.objects.colorHistory[i] = model.getObjectByName('colorhistory' + i);
	    }
	    this.objects.currentColor = model.getObjectByName('currentcolor');
	    this.objects.sizeSlider = model.getObjectByName('sizebg');
	    this.objects.sizeSlider.geometry.computeBoundingBox();
	    // Hide bounding box
	    model.getObjectByName('bb').material = new THREE.MeshBasicMaterial(
	      { color: 0x248f24, alphaTest: 0, visible: false });
	    // Hide objects
	    var self = this;

	    this.messagesMaterial = new THREE.MeshBasicMaterial({ map: null, transparent: true, opacity: 0.0 });
	    this.objects.messageSave = model.getObjectByName('msg_save');
	    this.objects.messageSave.material = this.messagesMaterial;
	    this.objects.messageSave.visible = false;
	    this.objects.messageError = model.getObjectByName('msg_error');
	    this.objects.messageError.visible = false;
	    this.objects.messageError.material = this.messagesMaterial;

	    var messagesImageUrl = 'assets/images/messages.png';

	    this.el.sceneEl.systems.material.loadTexture(messagesImageUrl, {src: messagesImageUrl}, function (texture) {
	      var material = self.messagesMaterial;
	      material.map = texture;
	      material.needsUpdate = true;
	    });

	    function showMessage (msgObject) {
	      msgObject.visible = true;
	      var object = { opacity: 0.0 };
	      var tween = new AFRAME.TWEEN.Tween(object)
	        .to({opacity: 1.0}, 500)
	        .onUpdate(function () {
	          self.messagesMaterial.opacity = object.opacity;
	        })
	        .chain(
	          new AFRAME.TWEEN.Tween(object)
	            .to({opacity: 0.0}, 500)
	            .delay(3000)
	            .onComplete(function () {
	              msgObject.visible = false;
	            })
	            .onUpdate(function () {
	              self.messagesMaterial.opacity = object.opacity;
	            })
	          );

	      tween.start();
	    }

	    this.el.sceneEl.addEventListener('drawing-upload-completed', function (event) {
	      showMessage(self.objects.messageSave);
	    });
	    this.el.sceneEl.addEventListener('drawing-upload-error', function (event) {
	      showMessage(self.objects.messageError);
	    });

	    this.initColorWheel();
	    this.initColorHistory();
	    this.initBrushesMenu();
	    this.setCursorTransparency();
	    this.updateColorUI(this.el.getAttribute('brush').color);
	    this.updateSizeSlider(this.el.getAttribute('brush').size);
	  },

	  initBrushesMenu: function () {
	    var previousPage = this.objects.previousPage;
	    var nextPage = this.objects.nextPage;
	    var brushes = Object.keys(AFRAME.BRUSHES);
	    this.initHighlightMaterial(nextPage);
	    this.initHighlightMaterial(previousPage);
	    previousPage.visible = false;
	    nextPage.visible = false;
	    this.brushesPerPage = 15;
	    this.brushesPagesNum = Math.ceil(brushes.length / this.brushesPerPage);
	    this.brushesPage = 0;
	    this.loadBrushes(this.brushesPage, this.brushesPerPage);
	  },

	  setCursorTransparency: function () {
	    var hueCursor = this.objects.hueCursor;
	    var brightnessCursor = this.objects.brightnessCursor;
	    var sizeCursor = this.objects.sizeCursor;
	    sizeCursor.material.alphaTest = 0.5;
	    hueCursor.material.alphaTest = 0.5;
	    brightnessCursor.material.alphaTest = 0.5;
	    sizeCursor.material.transparent = true;
	    hueCursor.material.transparent = true;
	    brightnessCursor.material.transparent = true;
	  },

	  loadBrushes: (function () {
	    var brushesMaterials = {};
	    return function (page, pageSize) {
	      var brush;
	      var brushNum = 0;
	      var uiEl = this.uiEl.getObject3D('mesh');
	      var brushes = Object.keys(AFRAME.BRUSHES);
	      var thumbnail;
	      var brushIndex;
	      var self = this;
	      var i;
	      if (page < 0 || page >= this.brushesPagesNum) { return; }
	      if (page === 0) {
	        this.objects.previousPage.visible = false;
	      } else {
	        this.objects.previousPage.visible = true;
	      }
	      if (page === this.brushesPagesNum - 1) {
	        this.objects.nextPage.visible = false;
	      } else {
	        this.objects.nextPage.visible = true;
	      }
	      for (i = 0; i < pageSize; i++) {
	        brushIndex = page * pageSize + i;
	        brush = brushes[brushIndex];
	        thumbnail = brush && AFRAME.BRUSHES[brush].prototype.options.thumbnail;
	        loadBrush(brush, brushNum, thumbnail);
	        brushNum += 1;
	      }
	      function loadBrush (name, id, thumbnailUrl) {
	        var brushName = !name ? undefined : (name.charAt(0).toUpperCase() + name.slice(1)).toLowerCase();
	        if (thumbnailUrl && !brushesMaterials[brushName]) {
	          self.el.sceneEl.systems.material.loadTexture(thumbnailUrl, {src: thumbnailUrl}, onLoadThumbnail);
	          return;
	        }
	        onLoadThumbnail();
	        function onLoadThumbnail (texture) {
	          var button = uiEl.getObjectByName('brush' + id);
	          self.brushButtonsMapping['brush' + id] = brushName;
	          setBrushThumbnail(texture, button);
	        }
	      }
	      function setBrushThumbnail (texture, button) {
	        var brushName = self.brushButtonsMapping[button.name];
	        var material = brushesMaterials[brushName] || new THREE.MeshBasicMaterial();
	        if (texture) {
	          material.map = texture;
	          material.alphaTest = 0.5;
	          material.transparent = true;
	        } else if (!brushesMaterials[brushName]) {
	          material.visible = false;
	        }
	        brushesMaterials[brushName] = material;
	        self.highlightMaterials[button.name] = {
	          normal: material,
	          hover: material,
	          pressed: material,
	          selected: material
	        };
	        button.material = material;
	      }
	    };
	  })(),

	  nextPage: function () {
	    if (this.brushesPage >= this.brushesPagesNum - 1) { return; }
	    this.brushesPage++;
	    this.loadBrushes(this.brushesPage, this.brushesPerPage);
	  },

	  previousPage: function () {
	    if (this.brushesPage === 0) { return; }
	    this.brushesPage--;
	    this.loadBrushes(this.brushesPage, this.brushesPerPage);
	  },

	  initHighlightMaterial: function (object) {
	    var buttonName = object.name;
	    var isBrushButton = this.brushRegexp.test(buttonName);
	    var isHistory = buttonName.indexOf('history') !== -1;
	    var isHue = buttonName === 'hue' || buttonName === 'huecursor';
	    var materials = {
	      normal: object.material,
	      hover: object.material,
	      pressed: object.material,
	      selected: object.material
	    };
	    if (!isBrushButton && !isHistory && !isHue) {
	      materials.normal = object.material;
	      materials.hover = object.material.clone();
	      materials.hover.map = this.system.hoverTexture;
	      materials.selected = object.material.clone();
	      materials.selected.map = this.system.pressedTexture;
	      materials.pressed = object.material.clone();
	      materials.pressed.map = this.system.pressedTexture;
	    }
	    this.highlightMaterials[buttonName] = materials;
	  },

	  toggleMenu: function (evt) {
	    if (this.closed) {
	      this.system.closeAll();
	      this.open();
	      this.system.opened = this.el;
	    } else {
	      this.close();
	      this.system.opened = undefined;
	    }
	  },

	  open: function () {
	    var uiEl = this.uiEl;
	    var coords = { x: 0, y: 0, z: 0 };
	    var tween;
	    if (!this.closed) { return; }
	    this.uiEl.setAttribute('visible', true);
	    tween = new AFRAME.TWEEN.Tween(coords)
	        .to({ x: 1, y: 1, z: 1 }, 100)
	        .onUpdate(function () {
	          uiEl.setAttribute('scale', this);
	        })
	        .easing(AFRAME.TWEEN.Easing.Exponential.Out);
	    tween.start();
	    this.el.setAttribute('brush', 'enabled', false);
	    this.rayEl.setAttribute('visible', false);
	    this.closed = false;
	  },

	  updateIntersections: (function () {
	    var raycaster = this.raycaster = new THREE.Raycaster();
	    return function (evt) {
	      this.updateRaycaster(raycaster);
	      this.intersectedObjects = raycaster.intersectObjects(this.menuEls, true);
	    };
	  })(),

	  onIntersection: function (evt) {
	    var visible = this.closed && this.system.opened;
	    if (this.el.components.brush.active) { return; }
	    this.rayEl.setAttribute('visible', !!visible);
	    this.el.setAttribute('brush', 'enabled', false);
	  },

	  onIntersected: function (evt) {
	    var handEl = evt.detail.el;
	    // Remove listeners of previous hand
	    if (this.handEl) { this.removeHandListeners(); }
	    this.handEl = handEl;
	    this.handRayEl = this.handEl.components.ui.rayEl;
	    this.menuEls = this.uiEl.object3D.children;
	    this.syncUI();
	    this.addHandListeners();
	  },

	  addHandListeners: function () {
	    var handEl = this.handEl;
	    handEl.addEventListener('componentchanged', this.onComponentChanged);
	    handEl.addEventListener('stroke-started', this.onStrokeStarted);
	    handEl.addEventListener('triggerchanged', this.onTriggerChanged);
	  },

	  removeHandListeners: function () {
	    var handEl = this.handEl;
	    handEl.removeEventListener('componentchanged', this.onComponentChanged);
	    handEl.removeEventListener('stroke-started', this.onStrokeStarted);
	    handEl.removeEventListener('triggerchanged', this.onTriggerChanged);
	  },

	  onComponentChanged: function (evt) {
	    if (evt.detail.name === 'brush') { this.syncUI(); }
	  },

	  syncUI: function () {
	    var brush;
	    if (!this.handEl || !this.objects) { return; }
	    brush = this.handEl.getAttribute('brush');
	    this.updateSizeSlider(brush.size);
	    this.updateColorUI(brush.color);
	    this.updateColorHistory();
	    // this.updateBrushSelector(brush.brush);
	  },

	  initColorHistory: function () {
	    var colorHistoryObject;
	    var currentColor = this.objects.currentColor;
	    for (var i = 0; i < this.objects.colorHistory.length; i++) {
	      colorHistoryObject = this.objects.colorHistory[i];
	      colorHistoryObject.material = colorHistoryObject.material.clone();
	      colorHistoryObject.material.map = this.system.selectedTexture;
	    }
	    currentColor.material = currentColor.material.clone();
	    currentColor.material.map = this.system.selectedTexture;
	    this.updateColorHistory();
	  },

	  updateColorHistory: function () {
	    var color = this.handEl && this.handEl.getAttribute('brush').color;
	    var colorStack = this.colorStack;
	    if (!color) { color = this.el.components.brush.schema.color.default; }
	    this.objects.currentColor.material.color.set(color);
	    for (var i = 0; i < colorStack.length; i++) {
	      color = colorStack[colorStack.length - i - 1];
	      this.objects.colorHistory[i].material.color.set(color);
	    }
	  },

	  updateSizeSlider: function (size) {
	    var slider = this.objects.sizeSlider;
	    var sliderBoundingBox = slider.geometry.boundingBox;
	    var cursor = this.objects.sizeCursor;
	    var sliderWidth = sliderBoundingBox.max.x - sliderBoundingBox.min.x;
	    var normalizedSize = size / AFRAME.components.brush.schema.size.max;
	    var positionX = normalizedSize * sliderWidth;
	    cursor.position.setX(positionX - this.cursorOffset.x);

	    var scale = normalizedSize + 0.3;
	    cursor.scale.set(scale, 1, scale);
	  },

	  updateColorUI: function (color) {
	    var colorRGB = new THREE.Color(color);
	    var hsv = this.hsv = this.rgb2hsv(colorRGB.r, colorRGB.g, colorRGB.b);
	    // Update color wheel
	    var angle = hsv.h * 2 * Math.PI;
	    var radius = hsv.s * this.colorWheelSize;
	    var x = radius * Math.cos(angle);
	    var y = radius * Math.sin(angle);
	    this.objects.hueCursor.position.setX(x);
	    this.objects.hueCursor.position.setZ(-y);

	    // Update color brightness
	    this.objects.hueWheel.material.uniforms['brightness'].value = this.hsv.v;
	    this.objects.brightnessCursor.rotation.y = this.hsv.v * 1.5 - 1.5;
	  },

	  updateBrushSelector: function (brush) {
	    var self = this;
	    var buttons = Object.keys(this.brushButtonsMapping);
	    var brushButtonsMapping = this.brushButtonsMapping;
	    buttons.forEach(function (id) {
	      if (brushButtonsMapping[id] !== brush) { return; }
	      self.selectBrushButton(id);
	    });
	  },

	  onIntersectionCleared: function () {
	    this.checkMenuIntersections = false;
	    this.rayEl.setAttribute('visible', false);
	    this.el.setAttribute('brush', 'enabled', true);
	  },

	  onIntersectedCleared: function (evt) {
	    if (!this.handEl) { return; }
	    this.handEl.removeEventListener('triggerchanged', this.onTriggerChanged);
	  },

	  onStrokeStarted: function () {
	    var color;
	    var colorStack = this.colorStack;
	    if (!this.colorHasChanged) { return; }
	    color = this.handEl.getAttribute('brush').color;
	    this.colorHasChanged = false;
	    if (colorStack.length === 7) { colorStack.shift(); }
	    colorStack.push(color);
	    this.syncUI();
	  },

	  updateRaycaster: (function () {
	    var direction = new THREE.Vector3();
	    var directionHelper = new THREE.Quaternion();
	    var scaleDummy = new THREE.Vector3();
	    var originVec3 = new THREE.Vector3();

	    // Closure to make quaternion/vector3 objects private.
	    return function (raycaster) {
	      var object3D = this.handEl.object3D;

	      // Update matrix world.
	      object3D.updateMatrixWorld();
	      // Grab the position and rotation.
	      object3D.matrixWorld.decompose(originVec3, directionHelper, scaleDummy);
	      // Apply rotation to a 0, 0, -1 vector.
	      direction.set(0, 0, -1);
	      direction.applyAxisAngle(new THREE.Vector3(1, 0, 0), -(this.rayAngle / 360) * 2 * Math.PI);
	      direction.applyQuaternion(directionHelper);
	      raycaster.far = this.rayDistance;
	      raycaster.set(originVec3, direction);
	    };
	  })(),

	  close: function () {
	    var uiEl = this.uiEl;
	    var coords = { x: 1, y: 1, z: 1 };
	    var tween;
	    if (this.closed) { return; }
	    tween = new AFRAME.TWEEN.Tween(coords)
	        .to({ x: 0, y: 0, z: 0 }, 100)
	        .onUpdate(function () {
	          uiEl.setAttribute('scale', this);
	        })
	        .onComplete(function () {
	          uiEl.setAttribute('visible', false);
	        })
	        .easing(AFRAME.TWEEN.Easing.Exponential.Out);
	    tween.start();
	    this.el.setAttribute('brush', 'enabled', true);
	    this.closed = true;
	  }
	});


/***/ },
/* 18 */
/***/ function(module, exports) {

	/* globals AFRAME THREE */
	/**
	 * Raycaster component.
	 *
	 * Pass options to three.js Raycaster including which objects to test.
	 * Poll for intersections.
	 * Emit event on origin entity and on target entity on intersect.
	 *
	 * @member {array} intersectedEls - List of currently intersected entities.
	 * @member {array} objects - Cached list of meshes to intersect.
	 * @member {number} prevCheckTime - Previous time intersection was checked. To help interval.
	 * @member {object} raycaster - three.js Raycaster.
	 */
	AFRAME.registerComponent('ui-raycaster', {
	  schema: {
	    far: {default: Infinity}, // Infinity.
	    interval: {default: 100},
	    near: {default: 0},
	    objects: {default: ''},
	    recursive: {default: true},
	    rotation: {default: 0}
	  },

	  init: function () {
	    this.direction = new THREE.Vector3();
	    this.intersectedEls = [];
	    this.objects = null;
	    this.prevCheckTime = undefined;
	    this.raycaster = new THREE.Raycaster();
	    this.updateOriginDirection();
	    this.refreshObjects = this.refreshObjects.bind(this);
	  },

	  play: function () {
	    this.el.sceneEl.addEventListener('child-attached', this.refreshObjects);
	    this.el.sceneEl.addEventListener('child-detached', this.refreshObjects);
	  },

	  pause: function () {
	    this.el.sceneEl.removeEventListener('child-attached', this.refreshObjects);
	    this.el.sceneEl.removeEventListener('child-detached', this.refreshObjects);
	  },

	  /**
	   * Create or update raycaster object.
	   */
	  update: function () {
	    var data = this.data;
	    var raycaster = this.raycaster;

	    // Set raycaster properties.
	    raycaster.far = data.far;
	    raycaster.near = data.near;

	    this.refreshObjects();
	  },

	  /**
	   * Update list of objects to test for intersection.
	   */
	  refreshObjects: function () {
	    var data = this.data;
	    var i;
	    var objectEls;

	    // Push meshes onto list of objects to intersect.
	    if (data.objects) {
	      objectEls = this.el.sceneEl.querySelectorAll(data.objects);
	      this.objects = [];
	      for (i = 0; i < objectEls.length; i++) {
	        this.objects.push(objectEls[i].object3D);
	      }
	      return;
	    }

	    // If objects not defined, intersect with everything.
	    this.objects = this.el.sceneEl.object3D.children;
	  },

	  /**
	   * Check for intersections and cleared intersections on an interval.
	   */
	  tick: function (time) {
	    var el = this.el;
	    var data = this.data;
	    var intersectedEls;
	    var intersections;
	    var prevCheckTime = this.prevCheckTime;
	    var prevIntersectedEls;

	    // Only check for intersection if interval time has passed.
	    if (prevCheckTime && (time - prevCheckTime < data.interval)) { return; }

	    // Store old previously intersected entities.
	    prevIntersectedEls = this.intersectedEls.slice();

	    // Raycast.
	    this.updateOriginDirection();
	    intersections = this.raycaster.intersectObjects(this.objects, data.recursive);

	    // Only keep intersections against objects that have a reference to an entity.
	    intersections = intersections.filter(function hasEl (intersection) {
	      return !!intersection.object.el;
	    });

	    // Update intersectedEls.
	    intersectedEls = this.intersectedEls = intersections.map(function getEl (intersection) {
	      return intersection.object.el;
	    });

	    // Emit intersected on intersected entity per intersected entity.
	    intersections.forEach(function emitEvents (intersection) {
	      var intersectedEl = intersection.object.el;
	      intersectedEl.emit('raycaster-intersected', {el: el, intersection: intersection});
	    });

	    // Emit all intersections at once on raycasting entity.
	    if (intersections.length) {
	      el.emit('raycaster-intersection', {
	        els: intersectedEls,
	        intersections: intersections
	      });
	    }

	    // Emit intersection cleared on both entities per formerly intersected entity.
	    prevIntersectedEls.forEach(function checkStillIntersected (intersectedEl) {
	      if (intersectedEls.indexOf(intersectedEl) !== -1) { return; }
	      el.emit('raycaster-intersection-cleared', {el: intersectedEl});
	      intersectedEl.emit('raycaster-intersected-cleared', {el: el});
	    });
	  },

	  /**
	   * Set origin and direction of raycaster using entity position and rotation.
	   */
	  updateOriginDirection: (function () {
	    var directionHelper = new THREE.Quaternion();
	    var originVec3 = new THREE.Vector3();
	    var scaleDummy = new THREE.Vector3();

	    // Closure to make quaternion/vector3 objects private.
	    return function updateOriginDirection () {
	      var el = this.el;
	      var direction = this.direction;
	      var object3D = el.object3D;

	      // Update matrix world.
	      object3D.updateMatrixWorld();
	      // Grab the position and rotation.
	      object3D.matrixWorld.decompose(originVec3, directionHelper, scaleDummy);
	      // Apply rotation to a 0, 0, -1 vector.
	      direction.set(0, 0, -1);
	      direction.applyAxisAngle(new THREE.Vector3(1, 0, 0), (this.data.rotation / 360) * 2 * Math.PI);
	      direction.applyQuaternion(directionHelper);

	      this.raycaster.set(originVec3, direction);
	    };
	  })()
	});


/***/ },
/* 19 */
/***/ function(module, exports) {

	/* globals AFRAME THREE */
	(function () {
	  var line = {

	    init: function (color, brushSize) {
	      this.idx = 0;
	      this.geometry = new THREE.BufferGeometry();
	      this.vertices = new Float32Array(this.options.maxPoints * 3 * 3);
	      this.normals = new Float32Array(this.options.maxPoints * 3 * 3);
	      this.uvs = new Float32Array(this.options.maxPoints * 2 * 2);

	      this.geometry.setDrawRange(0, 0);
	      this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setDynamic(true));
	      this.geometry.addAttribute('uv', new THREE.BufferAttribute(this.uvs, 2).setDynamic(true));
	      this.geometry.addAttribute('normal', new THREE.BufferAttribute(this.normals, 3).setDynamic(true));

	      var mesh = new THREE.Mesh(this.geometry, this.getMaterial());
	      mesh.drawMode = THREE.TriangleStripDrawMode;

	      mesh.frustumCulled = false;
	      mesh.vertices = this.vertices;

	      this.object3D.add(mesh);
	    },

	    getMaterial: function () {
	      var map = this.materialOptions.map;
	      var type = this.materialOptions.type;

	      var defaultOptions = {};
	      var defaultTextureOptions = {};
	      if (map) {
	        defaultTextureOptions = {
	          map: map,
	          transparent: true,
	          alphaTest: 0.5
	        };
	      }

	      if (type === 'shaded') {
	        defaultOptions = {
	          color: this.data.color,
	          roughness: 0.75,
	          metalness: 0.25,
	          side: THREE.DoubleSide
	        };
	      } else {
	        defaultOptions = {
	          color: this.data.color,
	          side: THREE.DoubleSide
	        };
	      }

	      var options = Object.assign(defaultOptions, defaultTextureOptions, this.materialOptions);
	      delete options.type;

	      if (type === 'shaded') {
	        return new THREE.MeshStandardMaterial(options);
	      } else {
	        return new THREE.MeshBasicMaterial(options);
	      }
	    },
	    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {
	      var uv = 0;
	      for (i = 0; i < this.data.numPoints; i++) {
	        this.uvs[ uv++ ] = i / (this.data.numPoints - 1);
	        this.uvs[ uv++ ] = 0;

	        this.uvs[ uv++ ] = i / (this.data.numPoints - 1);
	        this.uvs[ uv++ ] = 1;
	      }

	      var direction = new THREE.Vector3();
	      direction.set(1, 0, 0);
	      direction.applyQuaternion(orientation);
	      direction.normalize();

	      var posA = pointerPosition.clone();
	      var posB = pointerPosition.clone();
	      var brushSize = this.data.size * pressure;
	      posA.add(direction.clone().multiplyScalar(brushSize / 2));
	      posB.add(direction.clone().multiplyScalar(-brushSize / 2));

	      this.vertices[ this.idx++ ] = posA.x;
	      this.vertices[ this.idx++ ] = posA.y;
	      this.vertices[ this.idx++ ] = posA.z;

	      this.vertices[ this.idx++ ] = posB.x;
	      this.vertices[ this.idx++ ] = posB.y;
	      this.vertices[ this.idx++ ] = posB.z;

	      this.computeVertexNormals();
	      this.geometry.attributes.normal.needsUpdate = true;
	      this.geometry.attributes.position.needsUpdate = true;
	      this.geometry.attributes.uv.needsUpdate = true;

	      this.geometry.setDrawRange(0, this.data.numPoints * 2);

	      return true;
	    },

	    computeVertexNormals: function () {
	      var pA = new THREE.Vector3();
	      var pB = new THREE.Vector3();
	      var pC = new THREE.Vector3();
	      var cb = new THREE.Vector3();
	      var ab = new THREE.Vector3();

	      for (var i = 0, il = this.idx; i < il; i++) {
	        this.normals[ i ] = 0;
	      }

	      var pair = true;
	      for (i = 0, il = this.idx; i < il; i += 3) {
	        if (pair) {
	          pA.fromArray(this.vertices, i);
	          pB.fromArray(this.vertices, i + 3);
	          pC.fromArray(this.vertices, i + 6);
	        } else {
	          pA.fromArray(this.vertices, i + 3);
	          pB.fromArray(this.vertices, i);
	          pC.fromArray(this.vertices, i + 6);
	        }
	        pair = !pair;

	        cb.subVectors(pC, pB);
	        ab.subVectors(pA, pB);
	        cb.cross(ab);
	        cb.normalize();

	        this.normals[ i ] += cb.x;
	        this.normals[ i + 1 ] += cb.y;
	        this.normals[ i + 2 ] += cb.z;

	        this.normals[ i + 3 ] += cb.x;
	        this.normals[ i + 4 ] += cb.y;
	        this.normals[ i + 5 ] += cb.z;

	        this.normals[ i + 6 ] += cb.x;
	        this.normals[ i + 7 ] += cb.y;
	        this.normals[ i + 8 ] += cb.z;
	      }

	      /*
	      first and last vertice (0 and 8) belongs just to one triangle
	      second and penultimate (1 and 7) belongs to two triangles
	      the rest of the vertices belongs to three triangles

	        1_____3_____5_____7
	        /\    /\    /\    /\
	       /  \  /  \  /  \  /  \
	      /____\/____\/____\/____\
	      0    2     4     6     8
	      */

	      // Vertices that are shared across three triangles
	      for (i = 2 * 3, il = this.idx - 2 * 3; i < il; i++) {
	        this.normals[ i ] = this.normals[ i ] / 3;
	      }

	      // Second and penultimate triangle, that shares just two triangles
	      this.normals[ 3 ] = this.normals[ 3 ] / 2;
	      this.normals[ 3 + 1 ] = this.normals[ 3 + 1 ] / 2;
	      this.normals[ 3 + 2 ] = this.normals[ 3 * 1 + 2 ] / 2;

	      this.normals[ this.idx - 2 * 3 ] = this.normals[ this.idx - 2 * 3 ] / 2;
	      this.normals[ this.idx - 2 * 3 + 1 ] = this.normals[ this.idx - 2 * 3 + 1 ] / 2;
	      this.normals[ this.idx - 2 * 3 + 2 ] = this.normals[ this.idx - 2 * 3 + 2 ] / 2;

	      this.geometry.normalizeNormals();
	    }
	  };

	  var lines = [
	    {
	      name: 'flat',
	      materialOptions: {
	        type: 'flat'
	      },
	      thumbnail: 'brushes/thumb_flat.gif'
	    },
	    {
	      name: 'smooth',
	      materialOptions: {
	        type: 'shaded'
	      },
	      thumbnail: 'brushes/thumb_smooth.gif'
	    },
	    {
	      name: 'squared-textured',
	      materialOptions: {
	        type: 'textured',
	        textureSrc: 'brushes/squared_textured.png'
	      },
	      thumbnail: 'brushes/thumb_squared_textured.gif'
	    },
	    {
	      name: 'line-gradient',
	      materialOptions: {
	        type: 'textured',
	        textureSrc: 'brushes/line_gradient.png'
	      },
	      thumbnail: 'brushes/thumb_line_gradient.gif'
	    },
	    {
	      name: 'silky-flat',
	      materialOptions: {
	        type: 'textured',
	        textureSrc: 'brushes/silky_flat.png'
	      },
	      thumbnail: 'brushes/thumb_silky_flat.gif'
	    },
	    {
	      name: 'silky-textured',
	      materialOptions: {
	        type: 'textured',
	        textureSrc: 'brushes/silky_textured.png'
	      },
	      thumbnail: 'brushes/thumb_silky_textured.gif'
	    },
	    {
	      name: 'lines1',
	      materialOptions: {
	        type: 'textured',
	        textureSrc: 'brushes/lines1.png'
	      },
	      thumbnail: 'brushes/thumb_lines1.gif'
	    },
	    {
	      name: 'lines2',
	      materialOptions: {
	        type: 'textured',
	        textureSrc: 'brushes/lines2.png'
	      },
	      thumbnail: 'brushes/thumb_lines2.gif'
	    },
	    {
	      name: 'lines3',
	      materialOptions: {
	        type: 'textured',
	        textureSrc: 'brushes/lines3.png'
	      },
	      thumbnail: 'brushes/thumb_lines3.gif'
	    },
	    {
	      name: 'lines4',
	      materialOptions: {
	        type: 'textured',
	        textureSrc: 'brushes/lines4.png'
	      },
	      thumbnail: 'brushes/thumb_lines4.gif'
	    },
	    {
	      name: 'lines5',
	      materialOptions: {
	        type: 'textured',
	        textureSrc: 'brushes/lines5.png'
	      },
	      thumbnail: 'brushes/thumb_lines5.gif'
	    },
	    {
	      name: 'line-grunge1',
	      materialOptions: {
	        type: 'textured',
	        textureSrc: 'brushes/line_grunge1.png'
	      },
	      thumbnail: 'brushes/thumb_line_grunge1.gif'
	    },
	    {
	      name: 'line-grunge2',
	      materialOptions: {
	        type: 'textured',
	        textureSrc: 'brushes/line_grunge2.png'
	      },
	      thumbnail: 'brushes/thumb_line_grunge2.gif'
	    },
	    {
	      name: 'line-grunge3',
	      materialOptions: {
	        type: 'textured',
	        textureSrc: 'brushes/line_grunge3.png'
	      },
	      thumbnail: 'brushes/thumb_line_grunge3.gif'
	    }
	  ];

	  var textureLoader = new THREE.TextureLoader();

	  for (var i = 0; i < lines.length; i++) {
	    var definition = lines[i];
	    if (definition.materialOptions.textureSrc) {
	      definition.materialOptions.map = textureLoader.load(definition.materialOptions.textureSrc);
	      delete definition.materialOptions.textureSrc;
	    }
	    AFRAME.registerBrush(definition.name, Object.assign({}, line, {materialOptions: definition.materialOptions}), {thumbnail: definition.thumbnail, maxPoints: 3000});
	  }
	})();


/***/ },
/* 20 */
/***/ function(module, exports) {

	/* global AFRAME THREE */
	(function () {
	  var stamp = {

	    init: function (color, brushSize) {
	      this.idx = 0;
	      this.geometry = new THREE.BufferGeometry();
	      this.vertices = new Float32Array(this.options.maxPoints * 3 * 3 * 2);
	      this.normals = new Float32Array(this.options.maxPoints * 3 * 3 * 2);
	      this.uvs = new Float32Array(this.options.maxPoints * 2 * 3 * 2);

	      this.geometry.setDrawRange(0, 0);
	      this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setDynamic(true));
	      this.geometry.addAttribute('uv', new THREE.BufferAttribute(this.uvs, 2).setDynamic(true));
	      this.geometry.addAttribute('normal', new THREE.BufferAttribute(this.normals, 3).setDynamic(true));

	      var mesh = new THREE.Mesh(this.geometry, this.getMaterial());
	      this.currAngle = 0;
	      this.subTextures = 1;
	      this.angleJitter = 0;
	      this.autoRotate = false;

	      if (this.materialOptions['subTextures'] !== undefined) {
	        this.subTextures = this.materialOptions['subTextures'];
	      }
	      if (this.materialOptions['autoRotate'] === true) {
	        this.autoRotate = true;
	      }
	      if (this.materialOptions['angleJitter'] !== undefined) {
	        this.angleJitter = this.materialOptions['angleJitter'];
	        this.angleJitter = this.angleJitter * 2 - this.angleJitter;
	      }

	      mesh.frustumCulled = false;
	      mesh.vertices = this.vertices;
	      this.object3D.add(mesh);
	    },

	    getMaterial: function () {
	      var map = this.materialOptions.map;
	      var type = this.materialOptions.type;
	      if (type === 'shaded') {
	        return new THREE.MeshStandardMaterial({
	          color: this.data.color,
	          side: THREE.DoubleSide,
	          map: map,
	          transparent: true,
	          alphaTest: 0.5,
	          roughness: 0.75,
	          metalness: 0.25
	        });
	      }
	      return new THREE.MeshBasicMaterial({
	        color: this.data.color,
	        side: THREE.DoubleSide,
	        map: map,
	        transparent: true,
	        alphaTest: 0.5
	      });
	    },

	    addPoint: function (position, rotation, pointerPosition, pressure, timestamp) {
	      // brush side
	      var pi2 = Math.PI / 2;
	      var dir = new THREE.Vector3();
	      dir.set(1, 0, 0);
	      dir.applyQuaternion(rotation);
	      dir.normalize();

	      // brush normal
	      var axis = new THREE.Vector3();
	      axis.set(0, 1, 0);
	      axis.applyQuaternion(rotation);
	      axis.normalize();

	      var brushSize = this.data.size * pressure / 2;
	      var brushAngle = Math.PI / 4 + Math.random() * this.angleJitter;

	      if (this.autoRotate) {
	        this.currAngle += 0.1;
	        brushAngle += this.currAngle;
	      }

	      var a = pointerPosition.clone().add(dir.applyAxisAngle(axis, brushAngle).clone().multiplyScalar(brushSize));
	      var b = pointerPosition.clone().add(dir.applyAxisAngle(axis, pi2).clone().multiplyScalar(brushSize));
	      var c = pointerPosition.clone().add(dir.applyAxisAngle(axis, pi2).clone().multiplyScalar(brushSize));
	      var d = pointerPosition.clone().add(dir.applyAxisAngle(axis, pi2).multiplyScalar(brushSize));

	      var nidx = this.idx;
	      // triangle 1
	      this.vertices[ this.idx++ ] = a.x;
	      this.vertices[ this.idx++ ] = a.y;
	      this.vertices[ this.idx++ ] = a.z;

	      this.vertices[ this.idx++ ] = b.x;
	      this.vertices[ this.idx++ ] = b.y;
	      this.vertices[ this.idx++ ] = b.z;

	      this.vertices[ this.idx++ ] = c.x;
	      this.vertices[ this.idx++ ] = c.y;
	      this.vertices[ this.idx++ ] = c.z;

	      // triangle 2

	      this.vertices[ this.idx++ ] = c.x;
	      this.vertices[ this.idx++ ] = c.y;
	      this.vertices[ this.idx++ ] = c.z;

	      this.vertices[ this.idx++ ] = d.x;
	      this.vertices[ this.idx++ ] = d.y;
	      this.vertices[ this.idx++ ] = d.z;

	      this.vertices[ this.idx++ ] = a.x;
	      this.vertices[ this.idx++ ] = a.y;
	      this.vertices[ this.idx++ ] = a.z;

	      // normals
	      for (var i = 0; i < 6; i++) {
	        this.normals[ nidx++ ] = axis.x;
	        this.normals[ nidx++ ] = axis.y;
	        this.normals[ nidx++ ] = axis.z;
	      }

	      // UVs
	      var uv = this.data.numPoints * 6 * 2;

	      // subTextures?
	      var Umin = 0;
	      var Umax = 1;
	      if (this.subTextures > 1) {
	        var subt = Math.floor(Math.random() * this.subTextures);
	        Umin = 1.0 / this.subTextures * subt;
	        Umax = Umin + 1.0 / this.subTextures;
	      }
	      // triangle 1 uv
	      this.uvs[ uv++ ] = Umin;
	      this.uvs[ uv++ ] = 1;
	      this.uvs[ uv++ ] = Umin;
	      this.uvs[ uv++ ] = 0;
	      this.uvs[ uv++ ] = Umax;
	      this.uvs[ uv++ ] = 0;

	      // triangle2 uv
	      this.uvs[ uv++ ] = Umax;
	      this.uvs[ uv++ ] = 0;
	      this.uvs[ uv++ ] = Umax;
	      this.uvs[ uv++ ] = 1;
	      this.uvs[ uv++ ] = Umin;
	      this.uvs[ uv++ ] = 1;

	      this.geometry.attributes.normal.needsUpdate = true;
	      this.geometry.attributes.position.needsUpdate = true;
	      this.geometry.attributes.uv.needsUpdate = true;

	      this.geometry.setDrawRange(0, this.data.numPoints * 6);

	      return true;
	    }
	  };

	  var stamps = [
	    {
	      name: 'dots',
	      materialOptions: {
	        type: 'shaded',
	        textureSrc: 'brushes/stamp_dots.png'
	      },
	      thumbnail: 'brushes/thumb_stamp_dots.gif',
	      spacing: 0.01
	    },
	    {
	      name: 'squares',
	      materialOptions: {
	        type: 'shaded',
	        textureSrc: 'brushes/stamp_squares.png'
	      },
	      thumbnail: 'brushes/thumb_stamp_squares.gif',
	      spacing: 0.01
	    },
	    {
	      name: 'column',
	      materialOptions: {
	        type: 'shaded',
	        autoRotate: true,
	        textureSrc: 'brushes/stamp_column.png'
	      },
	      thumbnail: 'brushes/thumb_stamp_column.gif',
	      spacing: 0.01
	    },
	    {
	      name: 'gear1',
	      materialOptions: {
	        type: 'shaded',
	        angleJitter: Math.PI * 2,
	        subTextures: 2,
	        textureSrc: 'brushes/stamp_gear.png'
	      },
	      thumbnail: 'brushes/thumb_stamp_gear.gif',
	      spacing: 0.05
	    },
	    {
	      name: 'grunge1',
	      materialOptions: {
	        type: 'shaded',
	        angleJitter: Math.PI * 2,
	        textureSrc: 'brushes/stamp_grunge1.png'
	      },
	      thumbnail: 'brushes/stamp_grunge1.png',
	      spacing: 0.02
	    },
	    {
	      name: 'grunge2',
	      materialOptions: {
	        type: 'shaded',
	        angleJitter: Math.PI * 2,
	        textureSrc: 'brushes/stamp_grunge2.png'
	      },
	      thumbnail: 'brushes/stamp_grunge2.png',
	      spacing: 0.02
	    },
	    {
	      name: 'grunge3',
	      materialOptions: {
	        type: 'shaded',
	        angleJitter: Math.PI * 2,
	        textureSrc: 'brushes/stamp_grunge3.png'
	      },
	      thumbnail: 'brushes/stamp_grunge3.png',
	      spacing: 0.02
	    },
	    {
	      name: 'grunge4',
	      materialOptions: {
	        type: 'shaded',
	        angleJitter: Math.PI * 2,
	        textureSrc: 'brushes/stamp_grunge4.png'
	      },
	      thumbnail: 'brushes/stamp_grunge4.png',
	      spacing: 0.02
	    },
	    {
	      name: 'grunge5',
	      materialOptions: {
	        type: 'shaded',
	        angleJitter: Math.PI * 2,
	        textureSrc: 'brushes/stamp_grunge5.png'
	      },
	      thumbnail: 'brushes/thumb_stamp_grunge5.gif',
	      spacing: 0.02
	    },
	    {
	      name: 'leaf1',
	      materialOptions: {
	        type: 'shaded',
	        angleJitter: Math.PI,
	        textureSrc: 'brushes/stamp_leaf1.png'
	      },
	      thumbnail: 'brushes/stamp_leaf1.png',
	      spacing: 0.03
	    },
	    {
	      name: 'leaf2',
	      materialOptions: {
	        type: 'shaded',
	        angleJitter: 60 * Math.PI / 180.0,
	        textureSrc: 'brushes/stamp_leaf2.png'
	      },
	      thumbnail: 'brushes/thumb_stamp_leaf2.gif',
	      spacing: 0.03
	    },
	    {
	      name: 'leaf3',
	      materialOptions: {
	        type: 'shaded',
	        angleJitter: 60 * Math.PI / 180.0,
	        textureSrc: 'brushes/stamp_leaf3.png'
	      },
	      thumbnail: 'brushes/thumb_stamp_leaf3.gif',
	      spacing: 0.03
	    },
	    {
	      name: 'fur1',
	      materialOptions: {
	        type: 'shaded',
	        angleJitter: 40 * Math.PI / 180.0,
	        subTextures: 2,
	        textureSrc: 'brushes/stamp_fur1.png'
	      },
	      thumbnail: 'brushes/stamp_fur1.png',
	      spacing: 0.01
	    },
	    {
	      name: 'fur2',
	      materialOptions: {
	        type: 'shaded',
	        angleJitter: 10 * Math.PI / 180.0,
	        subTextures: 3,
	        textureSrc: 'brushes/stamp_fur2.png'
	      },
	      thumbnail: 'brushes/stamp_fur2.png',
	      spacing: 0.01
	    },
	    {
	      name: 'grass',
	      materialOptions: {
	        type: 'shaded',
	        angleJitter: 10 * Math.PI / 180.0,
	        subTextures: 3,
	        textureSrc: 'brushes/stamp_grass.png'
	      },
	      thumbnail: 'brushes/thumb_stamp_grass.png',
	      spacing: 0.03
	    },
	    {
	      name: 'bush',
	      materialOptions: {
	        type: 'shaded',
	        subTextures: 2,
	        textureSrc: 'brushes/stamp_bush.png'
	      },
	      thumbnail: 'brushes/thumb_stamp_bush.gif',
	      spacing: 0.04
	    },
	    {
	      name: 'star',
	      materialOptions: {
	        type: 'shaded',
	        textureSrc: 'brushes/stamp_star.png'
	      },
	      thumbnail: 'brushes/thumb_stamp_star.png',
	      spacing: 0.06
	    },
	    {
	      name: 'snow',
	      materialOptions: {
	        type: 'shaded',
	        angleJitter: Math.PI * 2,
	        textureSrc: 'brushes/stamp_snow.png'
	      },
	      thumbnail: 'brushes/thumb_stamp_snow.png',
	      spacing: 0.06
	    }
	  ];

	  var textureLoader = new THREE.TextureLoader();
	  for (var i = 0; i < stamps.length; i++) {
	    var definition = stamps[i];
	    if (definition.materialOptions.textureSrc) {
	      definition.materialOptions.map = textureLoader.load(definition.materialOptions.textureSrc);
	      delete definition.materialOptions.textureSrc;
	    }
	    AFRAME.registerBrush(definition.name, Object.assign({}, stamp, {materialOptions: definition.materialOptions}), {thumbnail: definition.thumbnail, spacing: definition.spacing, maxPoints: 3000});
	  }

	  /*
	  - type: <'flat'|'shaded'>
	    Flat: constant, just color. Shaded: phong shading with subtle speculars
	  - autoRotate: <true|false>
	    The brush rotates incrementally at 0.1rad per point
	  - angleJitter: <r:float>
	    The brush rotates randomly from -r to r
	  - subTextures: <n:int>
	    textureSrc is divided in n horizontal pieces, and the brush picks one randomly on each point
	  */
	})();


/***/ },
/* 21 */
/***/ function(module, exports) {

	/* globals AFRAME THREE */
	AFRAME.registerBrush('spheres',
	  {
	    init: function (color, width) {
	      // Initialize the material based on the stroke color
	      this.material = new THREE.MeshStandardMaterial({
	        color: this.data.color,
	        roughness: 0.5,
	        metalness: 0.5,
	        side: THREE.DoubleSide,
	        shading: THREE.FlatShading
	      });
	      this.geometry = new THREE.IcosahedronGeometry(1, 0);
	    },
	    // This function is called every time we need to add a point to our stroke
	    // It should returns true if the point is added correctly, false otherwise.
	    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {
	      // Create a new sphere mesh to insert at the given position
	      var sphere = new THREE.Mesh(this.geometry, this.material);

	      // The scale is determined by the trigger preassure
	      var sca = this.data.size / 2 * pressure;
	      sphere.scale.set(sca, sca, sca);
	      sphere.initialScale = sphere.scale.clone();

	      // Generate a random phase to be used in the tick animation
	      sphere.phase = Math.random() * Math.PI * 2;

	      // Set the position of the sphere to match the controller positoin
	      sphere.position.copy(pointerPosition);
	      sphere.rotation.copy(orientation);

	      // Add the sphere to the object3D
	      this.object3D.add(sphere);

	      // Return true as we've added correctly a new point (or sphere)
	      return true;
	    },
	    // This function is called on every frame
	    tick: function (time, delta) {
	      for (var i = 0; i < this.object3D.children.length; i++) {
	        var sphere = this.object3D.children[i];
	        // Calculate the sine value based on the time and the phase for this sphere
	        // and use it to scale the geometry
	        var sin = (Math.sin(sphere.phase + time / 500.0) + 1) / 2 + 0.1;
	        sphere.scale.copy(sphere.initialScale).multiplyScalar(sin);
	      }
	    }
	  },
	  // Define extra options for this brush
	  {thumbnail: 'brushes/thumb_spheres.gif', spacing: 0.01}
	);


/***/ },
/* 22 */
/***/ function(module, exports) {

	/* globals AFRAME THREE */
	AFRAME.registerBrush('cubes',
	  {
	    init: function (color, width) {
	      this.material = new THREE.MeshStandardMaterial({
	        color: this.data.color,
	        roughness: 0.5,
	        metalness: 0.5,
	        side: THREE.DoubleSide,
	        shading: THREE.FlatShading
	      });
	      this.geometry = new THREE.BoxGeometry(1, 1, 1);
	    },
	    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {
	      var box = new THREE.Mesh(this.geometry, this.material);

	      var sca = pressure * this.data.size * Math.random();
	      box.scale.set(sca, sca, sca);
	      box.position.copy(pointerPosition);
	      box.rotation.copy(orientation);

	      this.object3D.add(box);

	      return true;
	    }
	  },
	  {thumbnail: 'brushes/thumb_cubes.gif', spacing: 0.01}
	);


/***/ },
/* 23 */
/***/ function(module, exports) {

	/* globals AFRAME THREE */
	(function(){
	  var vertexShader = `
	    varying vec2 vUv;
	    void main() {
	      vUv = uv;
	      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	    }
	  `;

	  var fragmentShader = `
	    uniform sampler2D tDiffuse;
	    uniform float amount;
	    uniform float time;
	    varying vec2 vUv;

	    vec3 hsv2rgb(vec3 c) {
	        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
	    }

	    void main() {
	      float h = mod(vUv.x - time / 3000.0, 1.0);
	      vec4 color = vec4(hsv2rgb(vec3(h, 1.0, 0.5)), 1.0);
	      gl_FragColor = color;
	    }
	  `;

	  var material = new THREE.ShaderMaterial({
	    vertexShader: vertexShader,
	    fragmentShader: fragmentShader,
	    side: THREE.DoubleSide,
	    uniforms: {
	      time: {type: 'f', value: 0}
	    }
	  });

	  AFRAME.registerBrush('line-rainbow',
	    {
	      init: function (color, brushSize) {
	        this.idx = 0;
	        this.geometry = new THREE.BufferGeometry();
	        this.vertices = new Float32Array(this.options.maxPoints * 3 * 3);
	        this.uvs = new Float32Array(this.options.maxPoints * 2 * 2);
	        this.linepositions = new Float32Array(this.options.maxPoints);

	        this.geometry.setDrawRange(0, 0);
	        this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3).setDynamic(true));
	        this.geometry.addAttribute('uv', new THREE.BufferAttribute(this.uvs, 2).setDynamic(true));
	        this.geometry.addAttribute('lineposition', new THREE.BufferAttribute(this.linepositions, 1).setDynamic(true));

	        this.material = material;
	        var mesh = new THREE.Mesh(this.geometry, this.material);
	        mesh.drawMode = THREE.TriangleStripDrawMode;

	        mesh.frustumCulled = false;
	        mesh.vertices = this.vertices;

	        this.object3D.add(mesh);
	      },
	      addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {
	        var uv = 0;
	        for (i = 0; i < this.data.numPoints; i++) {
	          this.uvs[ uv++ ] = i / (this.data.numPoints - 1);
	          this.uvs[ uv++ ] = 0;

	          this.uvs[ uv++ ] = i / (this.data.numPoints - 1);
	          this.uvs[ uv++ ] = 1;
	        }

	        var direction = new THREE.Vector3();
	        direction.set(1, 0, 0);
	        direction.applyQuaternion(orientation);
	        direction.normalize();

	        var posA = pointerPosition.clone();
	        var posB = pointerPosition.clone();
	        var brushSize = this.data.size * pressure;
	        posA.add(direction.clone().multiplyScalar(brushSize / 2));
	        posB.add(direction.clone().multiplyScalar(-brushSize / 2));

	        this.vertices[ this.idx++ ] = posA.x;
	        this.vertices[ this.idx++ ] = posA.y;
	        this.vertices[ this.idx++ ] = posA.z;

	        this.vertices[ this.idx++ ] = posB.x;
	        this.vertices[ this.idx++ ] = posB.y;
	        this.vertices[ this.idx++ ] = posB.z;

	        this.geometry.attributes.position.needsUpdate = true;
	        this.geometry.attributes.uv.needsUpdate = true;

	        this.geometry.setDrawRange(0, this.data.numPoints * 2);

	        return true;
	      },

	      tick: function(timeOffset, delta) {
	        this.material.uniforms.time.value = timeOffset;
	      },
	    },
	    {thumbnail:'brushes/thumb_rainbow.png', maxPoints: 3000}
	  );
	})();


/***/ },
/* 24 */
/***/ function(module, exports) {

	/* globals AFRAME THREE */
	AFRAME.registerBrush('single-sphere',
	  {
	    init: function (color, width) {
	      this.material = new THREE.MeshStandardMaterial({
	        color: this.data.color,
	        roughness: 0.6,
	        metalness: 0.2,
	        side: THREE.FrontSide,
	        shading: THREE.SmoothShading
	      });
	      this.geometry = new THREE.IcosahedronGeometry(1, 2);
	      this.mesh = new THREE.Mesh(this.geometry, this.material);
	      this.object3D.add(this.mesh);
	      this.mesh.visible = false
	    },
	    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {
	      if (!this.firstPoint) {
	        this.firstPoint = pointerPosition.clone();
	        this.mesh.position.set(this.firstPoint.x, this.firstPoint.y, this.firstPoint.z)
	      }
	      this.mesh.visible = true
	      var distance = this.firstPoint.distanceTo(pointerPosition);
	      this.mesh.scale.set(distance, distance, distance);
	      return true;
	    }
	  },
	  {thumbnail: 'brushes/thumb_single_sphere.png', spacing: 0.0}
	);


/***/ }
/******/ ]);