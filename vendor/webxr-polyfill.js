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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Quaternion = __webpack_require__(1);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
MatrixMath provides helper functions for populating the various matrices involved with 3D graphics.

Many of the math methods were taken from the Google webvr polyfill:
https://github.com/googlevr/webvr-polyfill/blob/master/src/util.js#L270
*/
var MatrixMath = function () {
	function MatrixMath() {
		_classCallCheck(this, MatrixMath);
	}

	_createClass(MatrixMath, null, [{
		key: 'mat4_generateIdentity',


		// Returns a new Float32Array that is set to the transform identity
		value: function mat4_generateIdentity() {
			return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
		}
	}, {
		key: 'mat4_get_position',
		value: function mat4_get_position(out, m) {
			out[0] = m[12];
			out[1] = m[13];
			out[2] = m[14];
			return out;
		}
	}, {
		key: 'mat4_get_rotation',
		value: function mat4_get_rotation(out, m) {
			var quat = new _Quaternion2.default();
			quat.setFromRotationMatrix(m);
			out[0] = quat.x;
			out[1] = quat.y;
			out[2] = quat.z;
			out[3] = quat.w;
			return out;
		}
	}, {
		key: 'mat4_eyeView',
		value: function mat4_eyeView(out, poseModelMatrix) {
			var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Float32Array([0, 0, 0]);

			MatrixMath.mat4_translate(out, poseModelMatrix, offset);
			MatrixMath.mat4_invert(out, out);
		}
	}, {
		key: 'mat4_perspectiveFromFieldOfView',
		value: function mat4_perspectiveFromFieldOfView(out, fov, near, far) {
			var upTan = Math.tan(fov.upDegrees * MatrixMath.PI_OVER_180);
			var downTan = Math.tan(fov.downDegrees * MatrixMath.PI_OVER_180);
			var leftTan = Math.tan(fov.leftDegrees * MatrixMath.PI_OVER_180);
			var rightTan = Math.tan(fov.rightDegrees * MatrixMath.PI_OVER_180);

			var xScale = 2.0 / (leftTan + rightTan);
			var yScale = 2.0 / (upTan + downTan);

			out[0] = xScale;
			out[1] = 0.0;
			out[2] = 0.0;
			out[3] = 0.0;
			out[4] = 0.0;
			out[5] = yScale;
			out[6] = 0.0;
			out[7] = 0.0;
			out[8] = -((leftTan - rightTan) * xScale * 0.5);
			out[9] = (upTan - downTan) * yScale * 0.5;
			out[10] = far / (near - far);
			out[11] = -1.0;
			out[12] = 0.0;
			out[13] = 0.0;
			out[14] = far * near / (near - far);
			out[15] = 0.0;
			return out;
		}
	}, {
		key: 'mat4_fromRotationTranslation',
		value: function mat4_fromRotationTranslation(out) {
			var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0, 1];
			var v = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0, 0];

			// Quaternion math
			var x = q[0];
			var y = q[1];
			var z = q[2];
			var w = q[3];
			var x2 = x + x;
			var y2 = y + y;
			var z2 = z + z;

			var xx = x * x2;
			var xy = x * y2;
			var xz = x * z2;
			var yy = y * y2;
			var yz = y * z2;
			var zz = z * z2;
			var wx = w * x2;
			var wy = w * y2;
			var wz = w * z2;

			out[0] = 1 - (yy + zz);
			out[1] = xy + wz;
			out[2] = xz - wy;
			out[3] = 0;
			out[4] = xy - wz;
			out[5] = 1 - (xx + zz);
			out[6] = yz + wx;
			out[7] = 0;
			out[8] = xz + wy;
			out[9] = yz - wx;
			out[10] = 1 - (xx + yy);
			out[11] = 0;
			out[12] = v[0];
			out[13] = v[1];
			out[14] = v[2];
			out[15] = 1;

			return out;
		}
	}, {
		key: 'mat4_translate',
		value: function mat4_translate(out, a, v) {
			var x = v[0];
			var y = v[1];
			var z = v[2];
			var a00 = void 0;
			var a01 = void 0;
			var a02 = void 0;
			var a03 = void 0;
			var a10 = void 0,
			    a11 = void 0,
			    a12 = void 0,
			    a13 = void 0,
			    a20 = void 0,
			    a21 = void 0,
			    a22 = void 0,
			    a23 = void 0;

			if (a === out) {
				out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
				out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
				out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
				out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
			} else {
				a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
				a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
				a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

				out[0] = a00;out[1] = a01;out[2] = a02;out[3] = a03;
				out[4] = a10;out[5] = a11;out[6] = a12;out[7] = a13;
				out[8] = a20;out[9] = a21;out[10] = a22;out[11] = a23;

				out[12] = a00 * x + a10 * y + a20 * z + a[12];
				out[13] = a01 * x + a11 * y + a21 * z + a[13];
				out[14] = a02 * x + a12 * y + a22 * z + a[14];
				out[15] = a03 * x + a13 * y + a23 * z + a[15];
			}

			return out;
		}
	}, {
		key: 'mat4_invert',
		value: function mat4_invert(out, a) {
			var a00 = a[0],
			    a01 = a[1],
			    a02 = a[2],
			    a03 = a[3],
			    a10 = a[4],
			    a11 = a[5],
			    a12 = a[6],
			    a13 = a[7],
			    a20 = a[8],
			    a21 = a[9],
			    a22 = a[10],
			    a23 = a[11],
			    a30 = a[12],
			    a31 = a[13],
			    a32 = a[14],
			    a33 = a[15];

			var b00 = a00 * a11 - a01 * a10;
			var b01 = a00 * a12 - a02 * a10;
			var b02 = a00 * a13 - a03 * a10;
			var b03 = a01 * a12 - a02 * a11;
			var b04 = a01 * a13 - a03 * a11;
			var b05 = a02 * a13 - a03 * a12;
			var b06 = a20 * a31 - a21 * a30;
			var b07 = a20 * a32 - a22 * a30;
			var b08 = a20 * a33 - a23 * a30;
			var b09 = a21 * a32 - a22 * a31;
			var b10 = a21 * a33 - a23 * a31;
			var b11 = a22 * a33 - a23 * a32;

			// Calculate the determinant
			var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

			if (!det) {
				return null;
			}
			det = 1.0 / det;

			out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
			out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
			out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
			out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
			out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
			out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
			out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
			out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
			out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
			out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
			out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
			out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
			out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
			out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
			out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
			out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

			return out;
		}
	}, {
		key: 'mat4_multiply',
		value: function mat4_multiply(out, ae, be) {
			var a11 = ae[0],
			    a12 = ae[4],
			    a13 = ae[8],
			    a14 = ae[12];
			var a21 = ae[1],
			    a22 = ae[5],
			    a23 = ae[9],
			    a24 = ae[13];
			var a31 = ae[2],
			    a32 = ae[6],
			    a33 = ae[10],
			    a34 = ae[14];
			var a41 = ae[3],
			    a42 = ae[7],
			    a43 = ae[11],
			    a44 = ae[15];

			var b11 = be[0],
			    b12 = be[4],
			    b13 = be[8],
			    b14 = be[12];
			var b21 = be[1],
			    b22 = be[5],
			    b23 = be[9],
			    b24 = be[13];
			var b31 = be[2],
			    b32 = be[6],
			    b33 = be[10],
			    b34 = be[14];
			var b41 = be[3],
			    b42 = be[7],
			    b43 = be[11],
			    b44 = be[15];

			out[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
			out[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
			out[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
			out[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

			out[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
			out[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
			out[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
			out[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

			out[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
			out[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
			out[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
			out[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

			out[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
			out[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
			out[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
			out[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

			return out;
		}
	}]);

	return MatrixMath;
}();

exports.default = MatrixMath;


MatrixMath.PI_OVER_180 = Math.PI / 180.0;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
Quaternion wraps a vector of length 4 used as an orientation value.

Taken from https://github.com/googlevr/webvr-polyfill/blob/master/src/math-util.js which took it from Three.js
*/
var Quaternion = function () {
	function Quaternion() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

		_classCallCheck(this, Quaternion);

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	_createClass(Quaternion, [{
		key: 'set',
		value: function set(x, y, z, w) {
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
			return this;
		}
	}, {
		key: 'toArray',
		value: function toArray() {
			return [this.x, this.y, this.z, this.w];
		}
	}, {
		key: 'copy',
		value: function copy(quaternion) {
			this.x = quaternion.x;
			this.y = quaternion.y;
			this.z = quaternion.z;
			this.w = quaternion.w;
			return this;
		}
	}, {
		key: 'setFromRotationMatrix',
		value: function setFromRotationMatrix(array16) {
			// Taken from https://github.com/mrdoob/three.js/blob/dev/src/math/Quaternion.js
			// which took it from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
			// assumes the upper 3x3 of array16 (column major) is a pure rotation matrix (i.e, unscaled)

			var m11 = array16[0],
			    m12 = array16[4],
			    m13 = array16[8],
			    m21 = array16[1],
			    m22 = array16[5],
			    m23 = array16[9],
			    m31 = array16[2],
			    m32 = array16[6],
			    m33 = array16[10];

			var trace = m11 + m22 + m33;

			if (trace > 0) {
				var s = 0.5 / Math.sqrt(trace + 1.0);
				this.w = 0.25 / s;
				this.x = (m32 - m23) * s;
				this.y = (m13 - m31) * s;
				this.z = (m21 - m12) * s;
			} else if (m11 > m22 && m11 > m33) {
				var _s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
				this.w = (m32 - m23) / _s;
				this.x = 0.25 * _s;
				this.y = (m12 + m21) / _s;
				this.z = (m13 + m31) / _s;
			} else if (m22 > m33) {
				var _s2 = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
				this.w = (m13 - m31) / _s2;
				this.x = (m12 + m21) / _s2;
				this.y = 0.25 * _s2;
				this.z = (m23 + m32) / _s2;
			} else {
				var _s3 = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
				this.w = (m21 - m12) / _s3;
				this.x = (m13 + m31) / _s3;
				this.y = (m23 + m32) / _s3;
				this.z = 0.25 * _s3;
			}
			return this;
		}
	}, {
		key: 'setFromEuler',
		value: function setFromEuler(x, y, z) {
			var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'XYZ';

			// http://www.mathworks.com/matlabcentral/fileexchange/
			// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
			//	content/SpinCalc.m

			var cos = Math.cos;
			var sin = Math.sin;
			var c1 = cos(x / 2);
			var c2 = cos(y / 2);
			var c3 = cos(z / 2);
			var s1 = sin(x / 2);
			var s2 = sin(y / 2);
			var s3 = sin(z / 2);

			if (order === 'XYZ') {
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
			} else if (order === 'YXZ') {
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
			} else if (order === 'ZXY') {
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
			} else if (order === 'ZYX') {
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
			} else if (order === 'YZX') {
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
			} else if (order === 'XZY') {
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
			}
		}
	}, {
		key: 'setFromAxisAngle',
		value: function setFromAxisAngle(axis, angle) {
			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
			// assumes axis is normalized
			var halfAngle = angle / 2;
			var s = Math.sin(halfAngle);
			this.x = axis.x * s;
			this.y = axis.y * s;
			this.z = axis.z * s;
			this.w = Math.cos(halfAngle);
			return this;
		}
	}, {
		key: 'multiply',
		value: function multiply(q) {
			return this.multiplyQuaternions(this, q);
		}
	}, {
		key: 'multiplyQuaternions',
		value: function multiplyQuaternions(a, b) {
			// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
			var qax = a.x,
			    qay = a.y,
			    qaz = a.z,
			    qaw = a.w;
			var qbx = b.x,
			    qby = b.y,
			    qbz = b.z,
			    qbw = b.w;
			this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
			this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
			this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
			this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
			return this;
		}
	}, {
		key: 'inverse',
		value: function inverse() {
			this.x *= -1;
			this.y *= -1;
			this.z *= -1;
			this.normalize();
			return this;
		}
	}, {
		key: 'normalize',
		value: function normalize() {
			var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
			if (l === 0) {
				this.x = 0;
				this.y = 0;
				this.z = 0;
				this.w = 1;
			} else {
				l = 1 / l;
				this.x = this.x * l;
				this.y = this.y * l;
				this.z = this.z * l;
				this.w = this.w * l;
			}
			return this;
		}
	}, {
		key: 'slerp',
		value: function slerp(qb, t) {
			// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
			if (t === 0) return this;
			if (t === 1) return this.copy(qb);

			var x = this.x,
			    y = this.y,
			    z = this.z,
			    w = this.w;
			var cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;
			if (cosHalfTheta < 0) {
				this.w = -qb.w;
				this.x = -qb.x;
				this.y = -qb.y;
				this.z = -qb.z;
				cosHalfTheta = -cosHalfTheta;
			} else {
				this.copy(qb);
			}
			if (cosHalfTheta >= 1.0) {
				this.w = w;
				this.x = x;
				this.y = y;
				this.z = z;
				return this;
			}

			var halfTheta = Math.acos(cosHalfTheta);
			var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
			if (Math.abs(sinHalfTheta) < 0.001) {
				this.w = 0.5 * (w + this.w);
				this.x = 0.5 * (x + this.x);
				this.y = 0.5 * (y + this.y);
				this.z = 0.5 * (z + this.z);

				return this;
			}

			var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
			var ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
			this.w = w * ratioA + this.w * ratioB;
			this.x = x * ratioA + this.x * ratioB;
			this.y = y * ratioA + this.y * ratioB;
			this.z = z * ratioA + this.z * ratioB;
			return this;
		}
	}]);

	return Quaternion;
}();

exports.default = Quaternion;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
EventHandlerBase is the base class that implements the EventHandler interface methods for dispatching and receiving events.
*/
var EventHandlerBase = function () {
	function EventHandlerBase() {
		_classCallCheck(this, EventHandlerBase);

		this._listeners = new Map(); // string type -> [listener, ...]
	}

	_createClass(EventHandlerBase, [{
		key: "addEventListener",
		value: function addEventListener(type, listener) {
			var listeners = this._listeners.get(type);
			if (Array.isArray(listeners) === false) {
				listeners = [];
				this._listeners.set(type, listeners);
			}
			listeners.push(listener);
		}
	}, {
		key: "removeEventListener",
		value: function removeEventListener(type, listener) {
			var listeners = this._listeners.get(type);
			if (Array.isArray(listeners) === false) {
				return;
			}
			for (var i = 0; i < listeners.length; i++) {
				if (listeners[i] === listener) {
					listeners.splice(i, 1);
					return;
				}
			}
		}
	}, {
		key: "dispatchEvent",
		value: function dispatchEvent(event) {
			var listeners = this._listeners.get(event.type);
			if (Array.isArray(listeners) === false) return;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var listener = _step.value;

					listener(event);
				}
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
		}
	}]);

	return EventHandlerBase;
}();

exports.default = EventHandlerBase;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRAnchors provide per-frame coordinates which the Reality attempts to pin "in place".
In a virtual Reality these coordinates do not change. 
In a Reality based on environment mapping sensors, the anchors may change pose on a per-frame bases as the system refines its map.
*/
var XRAnchor = function () {
	function XRAnchor(xrCoordinateSystem) {
		_classCallCheck(this, XRAnchor);

		this._uid = XRAnchor._generateUID();
		this._coordinateSystem = xrCoordinateSystem;
	}

	_createClass(XRAnchor, [{
		key: 'uid',
		get: function get() {
			return this._uid;
		}
	}, {
		key: 'coordinateSystem',
		get: function get() {
			return this._coordinateSystem;
		}
	}], [{
		key: '_generateUID',
		value: function _generateUID() {
			return 'anchor-' + new Date().getTime() + '-' + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
		}
	}]);

	return XRAnchor;
}();

exports.default = XRAnchor;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

var _EventHandlerBase2 = __webpack_require__(2);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

var _VirtualReality = __webpack_require__(16);

var _VirtualReality2 = _interopRequireDefault(_VirtualReality);

var _XRFieldOfView = __webpack_require__(17);

var _XRFieldOfView2 = _interopRequireDefault(_XRFieldOfView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
Each XRDisplay represents a method of using a specific type of hardware to render AR or VR realities and layers.

This doesn't yet support a geospatial coordinate system
*/
var XRDisplay = function (_EventHandlerBase) {
	_inherits(XRDisplay, _EventHandlerBase);

	function XRDisplay(xr, displayName, isExternal, reality) {
		_classCallCheck(this, XRDisplay);

		var _this = _possibleConstructorReturn(this, (XRDisplay.__proto__ || Object.getPrototypeOf(XRDisplay)).call(this));

		_this._xr = xr;
		_this._displayName = displayName;
		_this._isExternal = isExternal;
		_this._reality = reality; // The Reality instance that is currently displayed

		_this._headModelCoordinateSystem = new XRCoordinateSystem(_this, XRCoordinateSystem.HEAD_MODEL);
		_this._eyeLevelCoordinateSystem = new XRCoordinateSystem(_this, XRCoordinateSystem.EYE_LEVEL);
		_this._trackerCoordinateSystem = new XRCoordinateSystem(_this, XRCoordinateSystem.TRACKER);

		_this._headPose = new XRViewPose([0, XRViewPose.SITTING_EYE_HEIGHT, 0]);
		_this._eyeLevelPose = new XRViewPose([0, XRViewPose.SITTING_EYE_HEIGHT, 0]);
		_this._trackerPoseModelMatrix = _MatrixMath2.default.mat4_generateIdentity();

		var fov = 50 / 2;
		_this._fov = new _XRFieldOfView2.default(fov, fov, fov, fov);
		_this._depthNear = 0.1;
		_this._depthFar = 1000;

		_this._views = [];
		return _this;
	}

	_createClass(XRDisplay, [{
		key: 'supportsSession',
		value: function supportsSession(parameters) {
			// parameters: XRSessionCreateParametersInit 
			// returns boolean
			return this._supportedCreationParameters(parameters);
		}
	}, {
		key: 'requestSession',
		value: function requestSession(parameters) {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				if (_this2._supportedCreationParameters(parameters) === false) {
					reject();
					return;
				}
				if (parameters.type === XRSession.REALITY) {
					_this2._reality = new _VirtualReality2.default();
					_this2._xr._privateRealities.push(_this2._reality);
				}
				resolve(_this2._createSession(parameters));
			});
		}
	}, {
		key: '_requestAnimationFrame',
		value: function _requestAnimationFrame(callback) {
			return window.requestAnimationFrame(callback);
		}
	}, {
		key: '_cancelAnimationFrame',
		value: function _cancelAnimationFrame(handle) {
			return window.cancelAnimationFrame(handle);
		}
	}, {
		key: '_createSession',
		value: function _createSession(parameters) {
			return new XRSession(this._xr, this, parameters);
		}
	}, {
		key: '_supportedCreationParameters',
		value: function _supportedCreationParameters(parameters) {
			// returns true if the parameters are supported by this display
			throw 'Should be implemented by extending class';
		}

		/*
  Called by a session before it hands a new XRPresentationFrame to the app
  */

	}, {
		key: '_handleNewFrame',
		value: function _handleNewFrame(frame) {}

		/*
  Called by a session after it has handed the XRPresentationFrame to the app
  Use this for any display submission calls that need to happen after the render has occurred.
  */

	}, {
		key: '_handleAfterFrame',
		value: function _handleAfterFrame(frame) {}

		/*
  Called by XRSession after the session.baseLayer is assigned a value
  */

	}, {
		key: '_handleNewBaseLayer',
		value: function _handleNewBaseLayer(baseLayer) {}

		//attribute EventHandler ondeactivate;

	}, {
		key: 'displayName',
		get: function get() {
			return this._displayName;
		}
	}, {
		key: 'isExternal',
		get: function get() {
			return this._isExternal;
		}
	}]);

	return XRDisplay;
}(_EventHandlerBase3.default);

exports.default = XRDisplay;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventHandlerBase2 = __webpack_require__(2);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
A Reality represents a view of the world, be it the real world via sensors or a virtual world that is rendered with WebGL or WebGPU.
*/
var Reality = function (_EventHandlerBase) {
	_inherits(Reality, _EventHandlerBase);

	function Reality(xr, name, isShared, isPassthrough) {
		_classCallCheck(this, Reality);

		var _this = _possibleConstructorReturn(this, (Reality.__proto__ || Object.getPrototypeOf(Reality)).call(this));

		_this._xr = xr;
		_this._name = name;
		_this._isShared = isShared;
		_this._isPassthrough = isPassthrough;
		_this._anchors = new Map();
		return _this;
	}

	_createClass(Reality, [{
		key: 'getCoordinateSystem',
		value: function getCoordinateSystem() {
			//XRCoordinateSystem? getCoordinateSystem(XRFrameOfReferenceType type, ...); // Tries the types in order, returning the first match or null if none is found
			throw new Error('Not implemented');
		}

		/*
  Called when at least one active XRSession is using this Reality
  */

	}, {
		key: '_start',
		value: function _start() {
			throw new Error('Exending classes should implement _start');
		}

		/*
  Called when no more active XRSessions are using this Reality
  */

	}, {
		key: '_stop',
		value: function _stop() {
			throw new Error('Exending classes should implement _stop');
		}

		/*
  Called by a session before it hands a new XRPresentationFrame to the app
  */

	}, {
		key: '_handleNewFrame',
		value: function _handleNewFrame() {}

		/*
  Create an anchor hung in space
  */

	}, {
		key: '_addAnchor',
		value: function _addAnchor(anchor, display) {
			// returns DOMString anchor UID
			throw new Error('Exending classes should implement _addAnchor');
		}

		/*
  Create an anchor attached to a surface, as found by a ray
  returns a Promise that resolves either to an AnchorOffset or null if the hit test failed
  normalized screen x and y are in range 0..1, with 0,0 at top left and 1,1 at bottom right
  */

	}, {
		key: '_findAnchor',
		value: function _findAnchor(normalizedScreenX, normalizedScreenY, display) {
			throw new Error('Exending classes should implement _findAnchor');
		}

		/*
  Find an XRAnchorOffset that is at floor level below the current head pose
  returns a Promise that resolves either to an AnchorOffset or null if the floor level is unknown
  */

	}, {
		key: '_findFloorAnchor',
		value: function _findFloorAnchor(display) {
			var _this2 = this;

			var uid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			// Copy the head model matrix for the current pose so we have it in the promise below
			var headModelMatrix = new Float32Array(display._headPose.poseModelMatrix);
			return new Promise(function (resolve, reject) {
				// For now, just create an anchor at origin level. Maybe in the future search for a surface?
				headModelMatrix[13] = 0; // Set height to 0
				var coordinateSystem = new XRCoordinateSystem(display, XRCoordinateSystem.TRACKER);
				coordinateSystem._relativeMatrix = headModelMatrix;
				var anchor = new XRAnchor(coordinateSystem, uid);
				_this2._addAnchor(anchor, display);
				resolve(new XRAnchorOffset(anchor.uid));
			});
		}
	}, {
		key: '_getAnchor',
		value: function _getAnchor(uid) {
			return this._anchors.get(uid) || null;
		}
	}, {
		key: '_removeAnchor',
		value: function _removeAnchor(uid) {
			// returns void
			throw new Error('Exending classes should implement _removeAnchor');
		}

		// attribute EventHandler onchange;

	}, {
		key: 'name',
		get: function get() {
			return this._name;
		}
	}, {
		key: 'isShared',
		get: function get() {
			return this._isShared;
		}
	}, {
		key: 'isPassthrough',
		get: function get() {
			return this._isPassthrough;
		}
	}]);

	return Reality;
}(_EventHandlerBase3.default);

exports.default = Reality;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventHandlerBase2 = __webpack_require__(2);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
A script that wishes to make use of an XRDisplay can request an XRSession.
An XRSession provides a list of the available Reality instances that the script may request as well as make a request for an animation frame.
*/
var XRSession = function (_EventHandlerBase) {
	_inherits(XRSession, _EventHandlerBase);

	function XRSession(xr, display, createParameters) {
		_classCallCheck(this, XRSession);

		var _this = _possibleConstructorReturn(this, (XRSession.__proto__ || Object.getPrototypeOf(XRSession)).call(this, xr));

		_this._xr = xr;
		_this._display = display;
		_this._createParameters = createParameters;
		_this._ended = false;

		_this._baseLayer = null;
		_this._stageBounds = null;
		return _this;
	}

	_createClass(XRSession, [{
		key: 'requestFrame',
		value: function requestFrame(callback) {
			var _this2 = this;

			if (this._ended) return null;
			if (typeof callback !== 'function') {
				throw 'Invalid callback';
			}
			return this._display._requestAnimationFrame(function () {
				var frame = _this2._createPresentationFrame();
				_this2._display._reality._handleNewFrame(frame);
				_this2._display._handleNewFrame(frame);
				callback(frame);
				_this2._display._handleAfterFrame(frame);
			});
		}
	}, {
		key: 'cancelFrame',
		value: function cancelFrame(handle) {
			return this._display._cancelAnimationFrame(handle);
		}
	}, {
		key: 'end',
		value: function end() {
			if (this._ended) return;
			this._ended = true;
			this._display._stop();
			return new Promise(function (resolve, reject) {
				resolve();
			});
		}
	}, {
		key: '_createPresentationFrame',
		value: function _createPresentationFrame() {
			return new XRPresentationFrame(this);
		}
	}, {
		key: '_getCoordinateSystem',
		value: function _getCoordinateSystem() {
			for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
				types[_key] = arguments[_key];
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = types[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var type = _step.value;

					switch (type) {
						case XRCoordinateSystem.HEAD_MODEL:
							return this._display._headModelCoordinateSystem;
						case XRCoordinateSystem.EYE_LEVEL:
							return this._display._eyeLevelCoordinateSystem;
						case XRCoordinateSystem.TRACKER:
							return this._display._trackerCoordinateSystem;
						case XRCoordinateSystem.GEOSPATIAL:
						// Not supported yet
						default:
							continue;
					}
				}
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

			return null;
		}

		/*
  attribute EventHandler onblur;
  attribute EventHandler onfocus;
  attribute EventHandler onresetpose;
  attribute EventHandler onrealitychanged;
  attribute EventHandler onrealityconnect;
  attribute EventHandler onrealitydisconnect;
  attribute EventHandler onboundschange;
  attribute EventHandler onended;
  */

	}, {
		key: 'display',
		get: function get() {
			return this._display;
		}
	}, {
		key: 'createParameters',
		get: function get() {
			return this._parameters;
		}
	}, {
		key: 'realities',
		get: function get() {
			return this._xr._sharedRealities;
		}
	}, {
		key: 'reality',
		get: function get() {
			return this._display._reality;
		}
	}, {
		key: 'baseLayer',
		get: function get() {
			return this._baseLayer;
		},
		set: function set(value) {
			this._baseLayer = value;
			this._display._handleNewBaseLayer(this._baseLayer);
		}
	}, {
		key: 'depthNear',
		get: function get() {
			this._display._depthNear;
		},
		set: function set(value) {
			this._display._depthNear = value;
		}
	}, {
		key: 'depthFar',
		get: function get() {
			this._display._depthFar;
		},
		set: function set(value) {
			this._display._depthFar = value;
		}
	}, {
		key: 'hasStageBounds',
		get: function get() {
			this._stageBounds !== null;
		}
	}, {
		key: 'stageBounds',
		get: function get() {
			return this._stageBounds;
		}
	}]);

	return XRSession;
}(_EventHandlerBase3.default);

exports.default = XRSession;


XRSession.REALITY = 'reality';
XRSession.AUGMENTATION = 'augmentation';

XRSession.TYPES = [XRSession.REALITY, XRSession.AUGMENTATION];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XRViewport = __webpack_require__(12);

var _XRViewport2 = _interopRequireDefault(_XRViewport);

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
An XRView describes a single view into an XR scene.
It provides several values directly, and acts as a key to query view-specific values from other interfaces.
*/
var XRView = function () {
	function XRView(fov, depthNear, depthFar) {
		var eye = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

		_classCallCheck(this, XRView);

		this._fov = fov;
		this._depthNear = depthNear;
		this._depthFar = depthFar;
		this._eye = eye;
		this._viewport = new _XRViewport2.default(0, 0, 1, 1);
		this._projectionMatrix = new Float32Array(16);
		_MatrixMath2.default.mat4_perspectiveFromFieldOfView(this._projectionMatrix, this._fov, this._depthNear, this._depthFar);
	}

	_createClass(XRView, [{
		key: 'setProjectionMatrix',
		value: function setProjectionMatrix(array16) {
			for (var i = 0; i < 16; i++) {
				this._projectionMatrix[i] = array16[i];
			}
		}
	}, {
		key: 'getViewport',
		value: function getViewport(layer) {
			if (this._eye === XRView.LEFT) {
				this._viewport.x = 0;
				this._viewport.y = 0;
				this._viewport.width = layer.framebufferWidth / 2;
				this._viewport.height = layer.framebufferHeight;
			} else if (this._eye === XRView.RIGHT) {
				this._viewport.x = layer.framebufferWidth / 2;
				this._viewport.y = 0;
				this._viewport.width = layer.framebufferWidth / 2;
				this._viewport.height = layer.framebufferHeight;
			} else {
				this._viewport.x = 0;
				this._viewport.y = 0;
				this._viewport.width = layer.framebufferWidth;
				this._viewport.height = layer.framebufferHeight;
			}
			return this._viewport;
		}
	}, {
		key: 'eye',
		get: function get() {
			return this._eye;
		}
	}, {
		key: 'projectionMatrix',
		get: function get() {
			return this._projectionMatrix;
		}
	}]);

	return XRView;
}();

exports.default = XRView;


XRView.LEFT = 'left';
XRView.RIGHT = 'right';
XRView.EYES = [XRView.LEFT, XRView.RIGHT];

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

var _Quaternion = __webpack_require__(1);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRDevicePose describes the position and orientation of an XRDisplay relative to the query XRCoordinateSystem.
It also describes the view and projection matrices that should be used by the application to render a frame of the XR scene.
*/
var XRViewPose = function () {
	function XRViewPose() {
		var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0, 0];
		var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0, 1];

		_classCallCheck(this, XRViewPose);

		this._poseModelMatrix = new Float32Array(16);
		_MatrixMath2.default.mat4_fromRotationTranslation(this._poseModelMatrix, orientation, position);
	}

	_createClass(XRViewPose, [{
		key: '_setPoseModelMatrix',
		value: function _setPoseModelMatrix(array16) {
			for (var i = 0; i < 16; i++) {
				this._poseModelMatrix[i] = array16[i];
			}
		}
	}, {
		key: '_translate',
		value: function _translate(array3) {
			this._poseModelMatrix[12] += array3[0];
			this._poseModelMatrix[13] += array3[1];
			this._poseModelMatrix[14] += array3[2];
		}
	}, {
		key: 'getViewMatrix',
		value: function getViewMatrix(view) {
			var out = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (out === null) {
				out = new Float32Array(16);
			}
			_MatrixMath2.default.mat4_eyeView(out, this._poseModelMatrix); // TODO offsets
			return out;
		}
	}, {
		key: 'poseModelMatrix',
		get: function get() {
			return this._poseModelMatrix;
		}
	}, {
		key: '_position',
		get: function get() {
			return [this._poseModelMatrix[12], this._poseModelMatrix[13], this._poseModelMatrix[14]];
		},
		set: function set(array3) {
			this._poseModelMatrix[12] = array3[0];
			this._poseModelMatrix[13] = array3[1];
			this._poseModelMatrix[14] = array3[2];
		}
	}, {
		key: '_orientation',
		get: function get() {
			var quat = new _Quaternion2.default();
			quat.setFromRotationMatrix(this._poseModelMatrix);
			return quat.toArray();
		},
		set: function set(array4) {
			_MatrixMath2.default.mat4_fromRotationTranslation(this._poseModelMatrix, array4, this._position);
		}
	}]);

	return XRViewPose;
}();

exports.default = XRViewPose;


XRViewPose.SITTING_EYE_HEIGHT = 1.1; // meters

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
Vector3 wraps a vector of length 3, often used as a position in 3D space.

Taken from https://github.com/googlevr/webvr-polyfill/blob/master/src/math-util.js which took it from Three.js
*/
var Vector3 = function () {
	function Vector3() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

		_classCallCheck(this, Vector3);

		this.x = x;
		this.y = y;
		this.z = z;
	}

	_createClass(Vector3, [{
		key: "set",
		value: function set(x, y, z) {
			this.x = x;
			this.y = y;
			this.z = z;
			return this;
		}
	}, {
		key: "copy",
		value: function copy(v) {
			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
			return this;
		}
	}, {
		key: "toArray",
		value: function toArray() {
			return [this.x, this.y, this.z];
		}
	}, {
		key: "length",
		value: function length() {
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		}
	}, {
		key: "add",
		value: function add(x, y, z) {
			this.x += x;
			this.y += y;
			this.z += z;
		}
	}, {
		key: "normalize",
		value: function normalize() {
			var scalar = this.length();
			if (scalar !== 0) {
				this.multiplyScalar(1 / scalar);
			} else {
				this.x = 0;
				this.y = 0;
				this.z = 0;
			}
			return this;
		}
	}, {
		key: "multiplyScalar",
		value: function multiplyScalar(scalar) {
			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;
		}
	}, {
		key: "applyQuaternion",
		value: function applyQuaternion(q) {
			var x = this.x;
			var y = this.y;
			var z = this.z;

			var qx = q.x;
			var qy = q.y;
			var qz = q.z;
			var qw = q.w;

			// calculate quat * vector
			var ix = qw * x + qy * z - qz * y;
			var iy = qw * y + qz * x - qx * z;
			var iz = qw * z + qx * y - qy * x;
			var iw = -qx * x - qy * y - qz * z;

			// calculate result * inverse quat
			this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
			this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
			this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

			return this;
		}
	}, {
		key: "applyMatrix4",
		value: function applyMatrix4(matrix) {
			var x = this.x;
			var y = this.y;
			var z = this.z;
			var w = 1 / (matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15]);
			this.x = (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) * w;
			this.y = (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) * w;
			this.z = (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) * w;
			return this;
		}
	}, {
		key: "dot",
		value: function dot(v) {
			return this.x * v.x + this.y * v.y + this.z * v.z;
		}
	}, {
		key: "crossVectors",
		value: function crossVectors(a, b) {
			var ax = a.x,
			    ay = a.y,
			    az = a.z;
			var bx = b.x,
			    by = b.y,
			    bz = b.z;
			this.x = ay * bz - az * by;
			this.y = az * bx - ax * bz;
			this.z = ax * by - ay * bx;
			return this;
		}
	}]);

	return Vector3;
}();

exports.default = Vector3;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventHandlerBase2 = __webpack_require__(2);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
ARKitWrapper talks to Apple ARKit, as exposed by Mozilla's test ARDemo app.
It won't function inside a browser like Firefox.

ARKitWrapper is a singleton. Use ARKitWrapper.GetOrCreate() to get the instance, then add event listeners like so:

	if(ARKitWrapper.HasARKit()){
		let arKitWrapper = ARKitWrapper.GetOrCreate()
		arKitWrapper.addEventListener(ARKitWrapper.INIT_EVENT, ev => { console.log('ARKit initialized', ev) })
		arKitWrapper.addEventListener(ARKitWrapper.WATCH_EVENT, ev => { console.log('ARKit update', ev) })
		arKitWrapper.watch({
			location: boolean,
			camera: boolean,
			objects: boolean,
			light_intensity: boolean
		})
	}

*/
var ARKitWrapper = function (_EventHandlerBase) {
	_inherits(ARKitWrapper, _EventHandlerBase);

	function ARKitWrapper() {
		_classCallCheck(this, ARKitWrapper);

		var _this = _possibleConstructorReturn(this, (ARKitWrapper.__proto__ || Object.getPrototypeOf(ARKitWrapper)).call(this));

		if (ARKitWrapper.HasARKit() === false) {
			throw 'ARKitWrapper will only work in Mozilla\'s ARDemo test app';
		}
		if (typeof ARKitWrapper.GLOBAL_INSTANCE !== 'undefined') {
			throw 'ARKitWrapper is a singleton. Use ARKitWrapper.GetOrCreate() to get the global instance.';
		}

		_this._deviceId = null;
		_this._isWatching = false;
		_this._isInitialized = false;
		_this._rawARData = null;

		_this._globalCallbacksMap = {}; // Used to map a window.arkitCallback method name to an ARKitWrapper.on* method name
		// Set up the window.arkitCallback methods that the ARKit bridge depends on
		var callbackNames = ['onInit', 'onWatch'];
		for (var i = 0; i < callbackNames.length; i++) {
			_this._generateGlobalCallback(callbackNames[i], i);
		}

		// Set up some named global methods that the ARKit to JS bridge uses and send out custom events when they are called
		var eventCallbacks = [['arkitStartRecording', ARKitWrapper.RECORD_START_EVENT], ['arkitStopRecording', ARKitWrapper.RECORD_STOP_EVENT], ['arkitDidMoveBackground', ARKitWrapper.DID_MOVE_BACKGROUND_EVENT], ['arkitWillEnterForeground', ARKitWrapper.WILL_ENTER_FOREGROUND_EVENT], ['arkitInterrupted', ARKitWrapper.INTERRUPTED_EVENT], ['arkitInterruptionEnded', ARKitWrapper.INTERRUPTION_ENDED_EVENT], ['arkitShowDebug', ARKitWrapper.SHOW_DEBUG_EVENT]];

		var _loop = function _loop(_i) {
			window[eventCallbacks[_i][0]] = function (detail) {
				detail = detail || null;
				_this.dispatchEvent(new CustomEvent(eventCallbacks[_i][1], {
					source: _this,
					detail: detail
				}));
			};
		};

		for (var _i = 0; _i < eventCallbacks.length; _i++) {
			_loop(_i);
		}
		return _this;
	}

	_createClass(ARKitWrapper, [{
		key: 'waitForInit',
		// True if this instance has received data via onWatch

		/*
  Useful for waiting for or immediately receiving notice of ARKit initialization
  */
		value: function waitForInit() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				if (_this2._isInitialized) {
					resolve();
					return;
				}
				var callback = function callback() {
					_this2.removeEventListener(ARKitWrapper.INIT_EVENT, callback, false);
					resolve();
				};
				_this2.addEventListener(ARKitWrapper.INIT_EVENT, callback, false);
			});
		}

		/*
  getData looks into the most recent ARKit data (as received by onWatch) for a key
  returns the key's value or null if it doesn't exist or if a key is not specified it returns all data
  */

	}, {
		key: 'getData',
		value: function getData() {
			var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (key === null) {
				return this._rawARData;
			}
			if (this._rawARData && typeof this._rawARData[key] !== 'undefined') {
				return this._rawARData[key];
			}
			return null;
		}

		/*
  returns
  	{
  		uuid: DOMString,
  		transform: [4x4 column major affine transform]
  	}
  	return null if object with `uuid` is not found
  */

	}, {
		key: 'getObject',
		value: function getObject(uuid) {
			if (!this._isInitialized) {
				return null;
			}
			var objects = this.getKey('objects');
			if (objects === null) return null;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var object = _step.value;

					if (object.uuid === uuid) {
						return object;
					}
				}
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

			return null;
		}

		/*
  Sends a hitTest message to ARKit to get hit testing results
  x, y - screen coordinates normalized to 0..1 (0,0 is at top left and 1,1 is at bottom right)
  types - bit mask of hit testing types
  
  Returns a Promise that resolves to a (possibly empty) array of hit test data:
  [
  	{
  		type: 1,							// A packed mask of types ARKitWrapper.HIT_TEST_TYPE_*
  		distance: 1.0216870307922363,		// The distance in meters from the camera to the detected anchor or feature point.
  		world_transform:  [float x 16],		// The pose of the hit test result relative to the world coordinate system. 
  		local_transform:  [float x 16],		// The pose of the hit test result relative to the nearest anchor or feature point
  			// If the `type` is `HIT_TEST_TYPE_ESTIMATED_HORIZONTAL_PLANE`, `HIT_TEST_TYPE_EXISTING_PLANE`, or `HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT` (2, 8, or 16) it will also have anchor data:
  		anchor_center: { x:float, y:float, z:float },
  		anchor_extent: { x:float, y:float },
  		uuid: string,
  			// If the `type` is `HIT_TEST_TYPE_EXISTING_PLANE` or `HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT` (8 or 16) it will also have an anchor transform:
  		anchor_transform: [float x 16]
  	},
  	...
  ]
  @see https://developer.apple.com/documentation/arkit/arframe/2875718-hittest
  */

	}, {
		key: 'hitTest',
		value: function hitTest(x, y) {
			var _this3 = this;

			var types = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ARKitWrapper.HIT_TEST_TYPE_ALL;

			return new Promise(function (resolve, reject) {
				if (!_this3._isInitialized) {
					reject(new Error('ARKit is not initialized'));
					return;
				}
				window.webkit.messageHandlers.hitTest.postMessage({
					x: x,
					y: y,
					type: types,
					callback: _this3._createPromiseCallback('hitTest', resolve)
				});
			});
		}

		/*
  Sends an addAnchor message to ARKit
  Returns a promise that returns:
  {
  	uuid - the anchor's uuid,
  	transform - anchor transformation matrix
  }
  */

	}, {
		key: 'addAnchor',
		value: function addAnchor(uid, transform) {
			var _this4 = this;

			return new Promise(function (resolve, reject) {
				if (!_this4._isInitialized) {
					reject(new Error('ARKit is not initialized'));
					return;
				}
				window.webkit.messageHandlers.addAnchor.postMessage({
					uuid: uid,
					transform: transform,
					callback: _this4._createPromiseCallback('addAnchor', resolve)
				});
			});
		}

		/*
  If this instance is currently watching, send the stopAR message to ARKit to request that it stop sending data on onWatch
  */

	}, {
		key: 'stop',
		value: function stop() {
			var _this5 = this;

			return new Promise(function (resolve, reject) {
				if (!_this5._isWatching) {
					resolve();
					return;
				}
				window.webkit.messageHandlers.stopAR.postMessage({
					callback: _this5._createPromiseCallback('stop', resolve)
				});
			});
		}

		/*
  If not already watching, send a watchAR message to ARKit to request that it start sending per-frame data to onWatch
  options: the options map for ARKit
  	{
  		location: boolean,
  		camera: boolean,
  		objects: boolean,
  		light_intensity: boolean
  	}
  */

	}, {
		key: 'watch',
		value: function watch() {
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (!this._isInitialized) {
				return false;
			}
			if (this._isWatching) {
				return true;
			}
			this._isWatching = true;

			if (options === null) {
				options = {
					location: true,
					camera: true,
					objects: true,
					light_intensity: true
				};
			}

			var data = {
				options: options,
				callback: this._globalCallbacksMap.onWatch
			};
			window.webkit.messageHandlers.watchAR.postMessage(data);
			return true;
		}

		/*
  Sends a setUIOptions message to ARKit to set ui options (show or hide ui elements)
  options: {
  	browser: boolean,
  	points: boolean,
  	focus: boolean,
  	rec: boolean,
  	rec_time: boolean,
  	mic: boolean,
  	build: boolean,
  	plane: boolean,
  	warnings: boolean,
  	anchors: boolean,
  	debug: boolean,
  	statistics: boolean
  }
  */

	}, {
		key: 'setUIOptions',
		value: function setUIOptions(options) {
			window.webkit.messageHandlers.setUIOptions.postMessage(options);
		}

		/*
  Called during instance creation to send a message to ARKit to initialize and create a device ID
  Usually results in ARKit calling back to _onInit with a deviceId
  options: {
  	ui: {
  		browser: boolean,
  		points: boolean,
  		focus: boolean,
  		rec: boolean,
  		rec_time: boolean,
  		mic: boolean,
  		build: boolean,
  		plane: boolean,
  		warnings: boolean,
  		anchors: boolean,
  		debug: boolean,
  		statistics: boolean
  	}
  }
  */

	}, {
		key: '_sendInit',
		value: function _sendInit(options) {
			// get device id
			window.webkit.messageHandlers.initAR.postMessage({
				options: options,
				callback: this._globalCallbacksMap.onInit
			});
		}

		/*
  Callback for when ARKit is initialized
  deviceId: DOMString with the AR device ID
  */

	}, {
		key: '_onInit',
		value: function _onInit(deviceId) {
			this._deviceId = deviceId;
			this._isInitialized = true;
			this.dispatchEvent(new CustomEvent(ARKitWrapper.INIT_EVENT, {
				source: this
			}));
		}

		/*
  _onWatch is called from native ARKit on each frame:
  	data:
  	{
  		"camera_transform":[4x4 column major affine transform matrix],
  		"projection_camera":[4x4 projection matrix],
  		"location":{
  			"altitude": 176.08457946777344,
  			"longitude": -79.222516606740456,
  			"latitude": 35.789005972772181
  		},
  		"objects":[
  			{
  				uuid: DOMString (unique UID),
  				transform: [4x4 column major affine transform]
  			}, ...
  		]
  	}
  	*/

	}, {
		key: '_onWatch',
		value: function _onWatch(data) {
			this._rawARData = data;
			this.dispatchEvent(new CustomEvent(ARKitWrapper.WATCH_EVENT, {
				source: this,
				detail: this._rawARData
			}));
		}

		/*
  Callback from ARKit for when sending per-frame data to onWatch is stopped
  */

	}, {
		key: '_onStop',
		value: function _onStop() {
			this._isWatching = false;
		}
	}, {
		key: '_createPromiseCallback',
		value: function _createPromiseCallback(action, resolve) {
			var _this6 = this;

			var callbackName = this._generateCallbackUID(action);
			window[callbackName] = function (data) {
				delete window[callbackName];
				var wrapperCallbackName = '_on' + action[0].toUpperCase() + action.slice(1);
				if (typeof _this6[wrapperCallbackName] == 'function') {
					_this6[wrapperCallbackName](data);
				}
				resolve(data);
			};
			return callbackName;
		}
	}, {
		key: '_generateCallbackUID',
		value: function _generateCallbackUID(prefix) {
			return 'arkitCallback_' + prefix + '_' + new Date().getTime() + '_' + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
		}

		/*
  The ARKit iOS app depends on several callbacks on `window`. This method sets them up.
  They end up as window.arkitCallback? where ? is an integer.
  You can map window.arkitCallback? to ARKitWrapper instance methods using _globalCallbacksMap
  */

	}, {
		key: '_generateGlobalCallback',
		value: function _generateGlobalCallback(callbackName, num) {
			var name = 'arkitCallback' + num;
			this._globalCallbacksMap[callbackName] = name;
			var self = this;
			window[name] = function (deviceData) {
				self['_' + callbackName](deviceData);
			};
		}
	}, {
		key: 'deviceId',
		get: function get() {
			return this._deviceId;
		} // The ARKit provided device ID

	}, {
		key: 'isWatching',
		get: function get() {
			return this._isWatching;
		} // True if ARKit is sending frame data

	}, {
		key: 'isInitialized',
		get: function get() {
			return this._isInitialized;
		} // True if this instance has received the onInit callback from ARKit

	}, {
		key: 'hasData',
		get: function get() {
			return this._rawARData !== null;
		}
	}], [{
		key: 'GetOrCreate',
		value: function GetOrCreate() {
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (typeof ARKitWrapper.GLOBAL_INSTANCE === 'undefined') {
				ARKitWrapper.GLOBAL_INSTANCE = new ARKitWrapper();
				options = options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) == 'object' ? options : {};
				var defaultUIOptions = {
					browser: true,
					points: true,
					focus: false,
					rec: true,
					rec_time: true,
					mic: false,
					build: false,
					plane: true,
					warnings: true,
					anchors: false,
					debug: true,
					statistics: false
				};
				var uiOptions = _typeof(options.ui) == 'object' ? options.ui : {};
				options.ui = Object.assign(defaultUIOptions, uiOptions);
				ARKitWrapper.GLOBAL_INSTANCE._sendInit(options);
			}
			return ARKitWrapper.GLOBAL_INSTANCE;
		}
	}, {
		key: 'HasARKit',
		value: function HasARKit() {
			return typeof window.webkit !== 'undefined';
		}
	}]);

	return ARKitWrapper;
}(_EventHandlerBase3.default);

// ARKitWrapper event names:


exports.default = ARKitWrapper;
ARKitWrapper.INIT_EVENT = 'arkit-init';
ARKitWrapper.WATCH_EVENT = 'arkit-watch';
ARKitWrapper.RECORD_START_EVENT = 'arkit-record-start';
ARKitWrapper.RECORD_STOP_EVENT = 'arkit-record-stop';
ARKitWrapper.DID_MOVE_BACKGROUND_EVENT = 'arkit-did-move-background';
ARKitWrapper.WILL_ENTER_FOREGROUND_EVENT = 'arkit-will-enter-foreground';
ARKitWrapper.INTERRUPTED_EVENT = 'arkit-interrupted';
ARKitWrapper.INTERRUPTION_ENDED_EVENT = 'arkit-interruption-ended';
ARKitWrapper.SHOW_DEBUG_EVENT = 'arkit-show-debug';

// hit test types
ARKitWrapper.HIT_TEST_TYPE_FEATURE_POINT = 1;
ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANE = 8;
ARKitWrapper.HIT_TEST_TYPE_ESTIMATED_HORIZONTAL_PLANE = 2;
ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT = 16;

ARKitWrapper.HIT_TEST_TYPE_ALL = ARKitWrapper.HIT_TEST_TYPE_FEATURE_POINT | ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANE | ARKitWrapper.HIT_TEST_TYPE_ESTIMATED_HORIZONTAL_PLANE | ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT;

ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANES = ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANE | ARKitWrapper.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

var _Quaternion = __webpack_require__(1);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

var _XRAnchor = __webpack_require__(3);

var _XRAnchor2 = _interopRequireDefault(_XRAnchor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRAnchorOffset represents a pose in relation to an XRAnchor
*/
var XRAnchorOffset = function () {
	function XRAnchorOffset(anchorUID) {
		var poseMatrix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		_classCallCheck(this, XRAnchorOffset);

		this._anchorUID = anchorUID;
		this._poseMatrix = poseMatrix || _MatrixMath2.default.mat4_generateIdentity();
	}

	_createClass(XRAnchorOffset, [{
		key: 'getOffsetTransform',


		/*
  Return a transform matrix that is offset by this XRAnchorOffset.poseMatrix relative to coordinateSystem
  */
		value: function getOffsetTransform(coordinateSystem) {
			return _MatrixMath2.default.mat4_multiply(new Float32Array(16), this._poseMatrix, coordinateSystem._poseModelMatrix);
		}
	}, {
		key: 'anchorUID',
		get: function get() {
			return this._anchorUID;
		}

		/*
  A Float32Array(16) representing a column major affine transform matrix
  */

	}, {
		key: 'poseMatrix',
		get: function get() {
			return this._poseMatrix;
		},
		set: function set(array16) {
			for (var i = 0; i < 16; i++) {
				this._poseMatrix[i] = array16[i];
			}
		}

		/*
  returns a Float32Array(4) representing an x, y, z position from this.poseMatrix
  */

	}, {
		key: 'position',
		get: function get() {
			return new Float32Array([this._poseMatrix[12], this._poseMatrix[13], this._poseMatrix[14]]);
		}

		/*
  returns a Float32Array(4) representing x, y, z, w of a quaternion from this.poseMatrix
  */

	}, {
		key: 'orientation',
		get: function get() {
			var quat = new _Quaternion2.default();
			quat.setFromRotationMatrix(this._poseMatrix);
			return quat.toArray();
		}
	}]);

	return XRAnchorOffset;
}();

exports.default = XRAnchorOffset;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRViewport represents the dimensions in pixels of an XRView.
*/
var XRViewport = function () {
	function XRViewport(x, y, width, height) {
		_classCallCheck(this, XRViewport);

		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
	}

	_createClass(XRViewport, [{
		key: "x",
		get: function get() {
			return this._x;
		},
		set: function set(value) {
			this._x = value;
		}
	}, {
		key: "y",
		get: function get() {
			return this._y;
		},
		set: function set(value) {
			this._y = value;
		}
	}, {
		key: "width",
		get: function get() {
			return this._width;
		},
		set: function set(value) {
			this._width = value;
		}
	}, {
		key: "height",
		get: function get() {
			return this._height;
		},
		set: function set(value) {
			this._height = value;
		}
	}]);

	return XRViewport;
}();

exports.default = XRViewport;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _EventHandlerBase2 = __webpack_require__(2);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
XRLayer defines a source of bitmap images and a description of how the image is to be rendered in the XRDisplay
*/
var XRLayer = function (_EventHandlerBase) {
	_inherits(XRLayer, _EventHandlerBase);

	function XRLayer() {
		_classCallCheck(this, XRLayer);

		return _possibleConstructorReturn(this, (XRLayer.__proto__ || Object.getPrototypeOf(XRLayer)).apply(this, arguments));
	}

	return XRLayer;
}(_EventHandlerBase3.default);

exports.default = XRLayer;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventHandlerBase2 = __webpack_require__(2);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

var _Vector = __webpack_require__(9);

var _Vector2 = _interopRequireDefault(_Vector);

var _Quaternion = __webpack_require__(1);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

var _Euler = __webpack_require__(28);

var _Euler2 = _interopRequireDefault(_Euler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
DeviceOrientationTracker keeps track of device orientation, which can be queried usnig `getOrientation`
*/
var DeviceOrientationTracker = function (_EventHandlerBase) {
	_inherits(DeviceOrientationTracker, _EventHandlerBase);

	function DeviceOrientationTracker() {
		_classCallCheck(this, DeviceOrientationTracker);

		var _this = _possibleConstructorReturn(this, (DeviceOrientationTracker.__proto__ || Object.getPrototypeOf(DeviceOrientationTracker)).call(this));

		_this._deviceOrientation = null;
		_this._windowOrientation = 0;

		window.addEventListener('orientationchange', function () {
			_this._windowOrientation = window.orientation || 0;
		}, false);
		window.addEventListener('deviceorientation', function (ev) {
			_this._deviceOrientation = ev;
			_this.dispatchEvent(new CustomEvent(DeviceOrientationTracker.ORIENTATION_UPDATE_EVENT, {
				deviceOrientation: _this._deviceOrientation,
				windowOrientation: _this._windowOrientation
			}));
		}, false);
		return _this;
	}

	/*
 getOrientation sets the value of outQuaternion to the most recently tracked device orientation
 returns true if a device orientation has been received, otherwise false
 */


	_createClass(DeviceOrientationTracker, [{
		key: 'getOrientation',
		value: function getOrientation(outQuaternion) {
			if (this._deviceOrientation === null) {
				outQuaternion.set(0, 0, 0, 1);
				return false;
			}
			DeviceOrientationTracker.WORKING_EULER.set(this._deviceOrientation.beta * DeviceOrientationTracker.DEG_TO_RAD, this._deviceOrientation.alpha * DeviceOrientationTracker.DEG_TO_RAD, -1 * this._deviceOrientation.gamma * DeviceOrientationTracker.DEG_TO_RAD, 'YXZ');
			outQuaternion.setFromEuler(DeviceOrientationTracker.WORKING_EULER.x, DeviceOrientationTracker.WORKING_EULER.y, DeviceOrientationTracker.WORKING_EULER.z, DeviceOrientationTracker.WORKING_EULER.order);
			outQuaternion.multiply(DeviceOrientationTracker.HALF_PI_AROUND_X);
			outQuaternion.multiply(DeviceOrientationTracker.WORKING_QUATERNION.setFromAxisAngle(DeviceOrientationTracker.Z_AXIS, -this._windowOrientation * DeviceOrientationTracker.DEG_TO_RAD));
			return true;
		}
	}]);

	return DeviceOrientationTracker;
}(_EventHandlerBase3.default);

exports.default = DeviceOrientationTracker;


DeviceOrientationTracker.ORIENTATION_UPDATE_EVENT = 'orientation-update';

DeviceOrientationTracker.Z_AXIS = new _Vector2.default(0, 0, 1);
DeviceOrientationTracker.WORKING_EULER = new _Euler2.default();
DeviceOrientationTracker.WORKING_QUATERNION = new _Quaternion2.default();
DeviceOrientationTracker.HALF_PI_AROUND_X = new _Quaternion2.default(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
DeviceOrientationTracker.DEG_TO_RAD = Math.PI / 180;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XRDisplay = __webpack_require__(4);

var _XRDisplay2 = _interopRequireDefault(_XRDisplay);

var _XRSession = __webpack_require__(6);

var _XRSession2 = _interopRequireDefault(_XRSession);

var _XRSessionCreateParameters = __webpack_require__(18);

var _XRSessionCreateParameters2 = _interopRequireDefault(_XRSessionCreateParameters);

var _Reality = __webpack_require__(5);

var _Reality2 = _interopRequireDefault(_Reality);

var _XRPointCloud = __webpack_require__(19);

var _XRPointCloud2 = _interopRequireDefault(_XRPointCloud);

var _XRLightEstimate = __webpack_require__(20);

var _XRLightEstimate2 = _interopRequireDefault(_XRLightEstimate);

var _XRAnchor = __webpack_require__(3);

var _XRAnchor2 = _interopRequireDefault(_XRAnchor);

var _XRPlaneAnchor = __webpack_require__(21);

var _XRPlaneAnchor2 = _interopRequireDefault(_XRPlaneAnchor);

var _XRAnchorOffset = __webpack_require__(11);

var _XRAnchorOffset2 = _interopRequireDefault(_XRAnchorOffset);

var _XRStageBounds = __webpack_require__(22);

var _XRStageBounds2 = _interopRequireDefault(_XRStageBounds);

var _XRStageBoundsPoint = __webpack_require__(23);

var _XRStageBoundsPoint2 = _interopRequireDefault(_XRStageBoundsPoint);

var _XRPresentationFrame = __webpack_require__(24);

var _XRPresentationFrame2 = _interopRequireDefault(_XRPresentationFrame);

var _XRView = __webpack_require__(7);

var _XRView2 = _interopRequireDefault(_XRView);

var _XRViewport = __webpack_require__(12);

var _XRViewport2 = _interopRequireDefault(_XRViewport);

var _XRCoordinateSystem = __webpack_require__(25);

var _XRCoordinateSystem2 = _interopRequireDefault(_XRCoordinateSystem);

var _XRViewPose = __webpack_require__(8);

var _XRViewPose2 = _interopRequireDefault(_XRViewPose);

var _XRLayer = __webpack_require__(13);

var _XRLayer2 = _interopRequireDefault(_XRLayer);

var _XRWebGLLayer = __webpack_require__(26);

var _XRWebGLLayer2 = _interopRequireDefault(_XRWebGLLayer);

var _EventHandlerBase2 = __webpack_require__(2);

var _EventHandlerBase3 = _interopRequireDefault(_EventHandlerBase2);

var _FlatDisplay = __webpack_require__(27);

var _FlatDisplay2 = _interopRequireDefault(_FlatDisplay);

var _HeadMountedDisplay = __webpack_require__(29);

var _HeadMountedDisplay2 = _interopRequireDefault(_HeadMountedDisplay);

var _CameraReality = __webpack_require__(30);

var _CameraReality2 = _interopRequireDefault(_CameraReality);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
XRPolyfill implements the window.XR functionality as a polyfill

Code below will check for window.XR and if it doesn't exist will install this polyfill,
so you can safely include this script in any page.
*/
var XRPolyfill = function (_EventHandlerBase) {
	_inherits(XRPolyfill, _EventHandlerBase);

	function XRPolyfill() {
		_classCallCheck(this, XRPolyfill);

		var _this = _possibleConstructorReturn(this, (XRPolyfill.__proto__ || Object.getPrototypeOf(XRPolyfill)).call(this));

		window.XRDisplay = _XRDisplay2.default;
		window.XRSession = _XRSession2.default;
		window.XRSessionCreateParameters = _XRSessionCreateParameters2.default;
		window.Reality = _Reality2.default;
		window.XRPointCloud = _XRPointCloud2.default;
		window.XRLightEstimate = _XRLightEstimate2.default;
		window.XRAnchor = _XRAnchor2.default;
		window.XRPlaneAnchor = _XRPlaneAnchor2.default;
		window.XRAnchorOffset = _XRAnchorOffset2.default;
		window.XRStageBounds = _XRStageBounds2.default;
		window.XRStageBoundsPoint = _XRStageBoundsPoint2.default;
		window.XRPresentationFrame = _XRPresentationFrame2.default;
		window.XRView = _XRView2.default;
		window.XRViewport = _XRViewport2.default;
		window.XRCoordinateSystem = _XRCoordinateSystem2.default;
		window.XRViewPose = _XRViewPose2.default;
		window.XRLayer = _XRLayer2.default;
		window.XRWebGLLayer = _XRWebGLLayer2.default;

		_this._getVRDisplaysFinished = false;

		// Reality instances that may be shared by multiple XRSessions
		_this._sharedRealities = [new _CameraReality2.default(_this)];
		_this._privateRealities = [];

		_this._displays = [new _FlatDisplay2.default(_this, _this._sharedRealities[0])];

		if (typeof navigator.getVRDisplays === 'function') {
			navigator.getVRDisplays().then(function (displays) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = displays[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var display = _step.value;

						if (display === null) continue;
						if (display.capabilities.canPresent) {
							_this._displays.push(new _HeadMountedDisplay2.default(_this, _this._sharedRealities[0], display));
						}
					}
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

				_this._getVRDisplaysFinished = true;
			});
		} else {
			// if no WebVR, we don't need to wait
			_this._getVRDisplaysFinished = true;
		}

		// These elements are at the beginning of the body and absolutely positioned to fill the entire window
		// Sessions and realities add their elements to these divs so that they are in the right render order
		_this._sessionEls = document.createElement('div');
		_this._sessionEls.setAttribute('class', 'webxr-sessions');
		_this._realityEls = document.createElement('div');
		_this._realityEls.setAttribute('class', 'webxr-realities');
		var _arr = [_this._sessionEls, _this._realityEls];
		for (var _i = 0; _i < _arr.length; _i++) {
			var el = _arr[_i];
			el.style.position = 'absolute';
			el.style.width = '100%';
			el.style.height = '100%';
		}

		document.addEventListener('DOMContentLoaded', function () {
			document.body.style.width = '100%';
			document.body.style.height = '100%';
			document.body.prepend(_this._sessionEls);
			document.body.prepend(_this._realityEls); // realities must render behind the sessions
		});
		return _this;
	}

	_createClass(XRPolyfill, [{
		key: 'getDisplays',
		value: function getDisplays() {
			var self = this;
			var waitTillDisplaysChecked = function waitTillDisplaysChecked(resolve) {
				if (!self._getVRDisplaysFinished) {
					setTimeout(waitTillDisplaysChecked.bind(self, resolve), 30);
				} else {
					resolve(self._displays);
				}
			};
			return new Promise(function (resolve, reject) {
				waitTillDisplaysChecked(resolve);
			});
		}

		//attribute EventHandler ondisplayconnect;
		//attribute EventHandler ondisplaydisconnect;

	}]);

	return XRPolyfill;
}(_EventHandlerBase3.default);

/* Install XRPolyfill if window.XR does not exist */


if (typeof navigator.XR === 'undefined') navigator.XR = new XRPolyfill();

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Reality2 = __webpack_require__(5);

var _Reality3 = _interopRequireDefault(_Reality2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
VirtualReality is a Reality that is empty and waiting for fanstastic CG scenes.
*/
var VirtualReality = function (_Reality) {
	_inherits(VirtualReality, _Reality);

	function VirtualReality(xr) {
		_classCallCheck(this, VirtualReality);

		return _possibleConstructorReturn(this, (VirtualReality.__proto__ || Object.getPrototypeOf(VirtualReality)).call(this, xr, 'Virtual', false, false));
	}

	/*
 Called when at least one active XRSession is using this Reality
 */


	_createClass(VirtualReality, [{
		key: '_start',
		value: function _start() {}

		/*
  Called when no more active XRSessions are using this Reality
  */

	}, {
		key: '_stop',
		value: function _stop() {}

		/*
  Called by a session before it hands a new XRPresentationFrame to the app
  */

	}, {
		key: '_handleNewFrame',
		value: function _handleNewFrame() {}

		/*
  Create an anchor hung in space
  */

	}, {
		key: '_addAnchor',
		value: function _addAnchor(anchor, display) {
			this._anchors.set(anchor.uid, anchor);
			return anchor.uid;
		}

		/*
  Create an anchor attached to a surface, as found by a ray
  normalized screen x and y are in range 0..1, with 0,0 at top left and 1,1 at bottom right
  */

	}, {
		key: '_findAnchor',
		value: function _findAnchor(normalizedScreenX, normalizedScreenY, display) {
			return new Promise(function (resolve, reject) {
				resolve(null);
			});
		}
	}, {
		key: '_removeAnchor',
		value: function _removeAnchor(uid) {
			this._anchors.delete(uid);
		}
	}]);

	return VirtualReality;
}(_Reality3.default);

exports.default = VirtualReality;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRFieldOFView represents the four boundaries of a camera's field of view: up, down, left, and right.
*/
var XRFieldOfView = function () {
	function XRFieldOfView(upDegrees, downDegrees, leftDegrees, rightDegrees) {
		_classCallCheck(this, XRFieldOfView);

		this._upDegrees = upDegrees;
		this._downDegrees = downDegrees;
		this._leftDegrees = leftDegrees;
		this._rightDegrees = rightDegrees;
	}

	_createClass(XRFieldOfView, [{
		key: "upDegrees",
		get: function get() {
			return this._upDegrees;
		}
	}, {
		key: "downDegrees",
		get: function get() {
			return this._downDegrees;
		}
	}, {
		key: "leftDegrees",
		get: function get() {
			return this._leftDegrees;
		}
	}, {
		key: "rightDegrees",
		get: function get() {
			return this._rightDegrees;
		}
	}]);

	return XRFieldOfView;
}();

exports.default = XRFieldOfView;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
The XRSessionCreateParametersInit dictionary provides a session description, indicating the desired capabilities of a session to be returned from requestSession()
*/
var XRSessionCreateParameters = function () {
	function XRSessionCreateParameters() {
		_classCallCheck(this, XRSessionCreateParameters);
	}

	_createClass(XRSessionCreateParameters, [{
		key: 'exclusive',
		get: function get() {
			//readonly attribute boolean exclusive;
			throw 'Not implemented';
		}
	}, {
		key: 'type',
		get: function get() {
			//readonly attribute XRSessionRealityType type;
			throw 'Not implemented';
		}
	}]);

	return XRSessionCreateParameters;
}();

exports.default = XRSessionCreateParameters;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRPointCloud holds an array of float values where each four values represents [x, y, z, confidence in range 0-1] that describe a point in space detected by the device's sensors.
*/
var XRPointCloud = function () {
	function XRPointCloud() {
		_classCallCheck(this, XRPointCloud);
	}

	_createClass(XRPointCloud, [{
		key: 'points',
		get: function get() {
			//readonly attribute Float32Array points
			throw new Error('Not implemented');
		}
	}]);

	return XRPointCloud;
}();

exports.default = XRPointCloud;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRLightEstimate represents the attributes of environmental light as supplied by the device's sensors.
*/
var XRLightEstimate = function () {
	function XRLightEstimate() {
		_classCallCheck(this, XRLightEstimate);
	}

	_createClass(XRLightEstimate, [{
		key: 'getAmbientColorTemperature',
		value: function getAmbientColorTemperature() {
			//readonly attribute double ambientColorTemperature;
			throw new Error('Not implemented');
		}
	}, {
		key: 'ambientIntensity',
		get: function get() {
			//readonly attribute double ambientIntensity;
			throw new Error('Not implemented');
		}
	}]);

	return XRLightEstimate;
}();

exports.default = XRLightEstimate;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XRAnchor2 = __webpack_require__(3);

var _XRAnchor3 = _interopRequireDefault(_XRAnchor2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
XRPlaneAnchor represents a flat surfaces like floors, table tops, or walls.
*/
var XRPlaneAnchor = function (_XRAnchor) {
	_inherits(XRPlaneAnchor, _XRAnchor);

	function XRPlaneAnchor() {
		_classCallCheck(this, XRPlaneAnchor);

		return _possibleConstructorReturn(this, (XRPlaneAnchor.__proto__ || Object.getPrototypeOf(XRPlaneAnchor)).apply(this, arguments));
	}

	_createClass(XRPlaneAnchor, [{
		key: 'width',
		get: function get() {
			//readonly attribute double width;
			throw 'Not implemented';
		}
	}, {
		key: 'length',
		get: function get() {
			//readonly attribute double length;
			throw 'Not implemented';
		}
	}]);

	return XRPlaneAnchor;
}(_XRAnchor3.default);

exports.default = XRPlaneAnchor;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
The XRStageBounds interface describes a space known as a "Stage".
The stage is a bounded, floor-relative play space that the user can be expected to safely be able to move within.
Other XR platforms sometimes refer to this concept as "room scale" or "standing XR".
*/
var XRStageBounds = function () {
	function XRStageBounds() {
		_classCallCheck(this, XRStageBounds);
	}

	_createClass(XRStageBounds, [{
		key: 'center',
		get: function get() {
			//readonly attribute XRCoordinateSystem center;
			throw new Error('Not implemented');
		}
	}, {
		key: 'geometry',
		get: function get() {
			//readonly attribute FrozenArray<XRStageBoundsPoint>? geometry;
			throw new Error('Not implemented');
		}
	}]);

	return XRStageBounds;
}();

exports.default = XRStageBounds;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRStageBoundPoints represent the offset in meters from the stage origin along the X and Z axes.
*/
var XRStageBoundsPoint = function () {
	function XRStageBoundsPoint() {
		_classCallCheck(this, XRStageBoundsPoint);
	}

	_createClass(XRStageBoundsPoint, [{
		key: 'x',
		get: function get() {
			//readonly attribute double x;
			throw new Error('Not implemented');
		}
	}, {
		key: 'y',
		get: function get() {
			//readonly attribute double z;
			throw new Error('Not implemented');
		}
	}]);

	return XRStageBoundsPoint;
}();

exports.default = XRStageBoundsPoint;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XRAnchor = __webpack_require__(3);

var _XRAnchor2 = _interopRequireDefault(_XRAnchor);

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRPresentationFrame provides all of the values needed to render a single frame of an XR scene to the XRDisplay.
*/
var XRPresentationFrame = function () {
	function XRPresentationFrame(session) {
		_classCallCheck(this, XRPresentationFrame);

		this._session = session;
	}

	_createClass(XRPresentationFrame, [{
		key: 'addAnchor',


		/*
  Create an anchor at a specific position defined by XRAnchor.coordinates
  */
		value: function addAnchor(coordinateSystem) {
			var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
			var orientation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0, 0, 1];

			//DOMString? addAnchor(XRCoordinateSystem, position, orientation);
			var poseMatrix = _MatrixMath2.default.mat4_fromRotationTranslation(new Float32Array(16), orientation, position);
			_MatrixMath2.default.mat4_multiply(poseMatrix, coordinateSystem.getTransformTo(this._session._display._trackerCoordinateSystem), poseMatrix);
			var anchorCoordinateSystem = new XRCoordinateSystem(this._session._display, XRCoordinateSystem.TRACKER);
			anchorCoordinateSystem._relativeMatrix = poseMatrix;
			return this._session.reality._addAnchor(new _XRAnchor2.default(anchorCoordinateSystem), this._session.display);
		}

		// normalized screen x and y are in range 0..1, with 0,0 at top left and 1,1 at bottom right

	}, {
		key: 'findAnchor',
		value: function findAnchor(normalizedScreenX, normalizedScreenY) {
			// Promise<XRAnchorOffset?> findAnchor(float32, float32); // cast a ray to find or create an anchor at the first intersection in the Reality
			return this._session.reality._findAnchor(normalizedScreenX, normalizedScreenY, this._session.display);
		}

		/*
  Find an XRAnchorOffset that is at floor level below the current head pose
  uid will be the resulting anchor uid (if any), or if null one will be assigned
  */

	}, {
		key: 'findFloorAnchor',
		value: function findFloorAnchor() {
			var uid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			// Promise<XRAnchorOffset?> findFloorAnchor();
			return this._session.reality._findFloorAnchor(this._session.display, uid);
		}
	}, {
		key: 'removeAnchor',
		value: function removeAnchor(uid) {
			// void removeAnchor(DOMString uid);
			return this._session.reality._removeAnchor(uid);
		}

		/*
  Returns an existing XRAnchor or null if uid is unknown
  */

	}, {
		key: 'getAnchor',
		value: function getAnchor(uid) {
			// XRAnchor? getAnchor(DOMString uid);
			return this._session.reality._getAnchor(uid);
		}
	}, {
		key: 'getCoordinateSystem',
		value: function getCoordinateSystem() {
			var _session;

			// XRCoordinateSystem? getCoordinateSystem(...XRFrameOfReferenceType types); // Tries the types in order, returning the first match or null if none is found
			return (_session = this._session)._getCoordinateSystem.apply(_session, arguments);
		}
	}, {
		key: 'getDisplayPose',
		value: function getDisplayPose(coordinateSystem) {
			// XRViewPose? getDisplayPose(XRCoordinateSystem coordinateSystem);
			switch (coordinateSystem._type) {
				case XRCoordinateSystem.HEAD_MODEL:
					return this._session._display._headPose;
				case XRCoordinateSystem.EYE_LEVEL:
					return this._session._display._eyeLevelPose;
				default:
					return null;
			}
		}
	}, {
		key: 'session',
		get: function get() {
			return this._session;
		}
	}, {
		key: 'views',
		get: function get() {
			//readonly attribute FrozenArray<XRView> views;
			return this._session._display._views;
		}
	}, {
		key: 'hasPointCloud',
		get: function get() {
			//readonly attribute boolean hasPointCloud;
			return false;
		}
	}, {
		key: 'pointCloud',
		get: function get() {
			//readonly attribute XRPointCloud? pointCloud;
			return null;
		}
	}, {
		key: 'hasLightEstimate',
		get: function get() {
			//readonly attribute boolean hasLightEstimate;
			return false;
		}
	}, {
		key: 'lightEstimate',
		get: function get() {
			//readonly attribute XRLightEstimate? lightEstimate;
			return null;
		}

		/*
  Returns an array of known XRAnchor instances. May be empty.
  */

	}, {
		key: 'anchors',
		get: function get() {
			//readonly attribute sequence<XRAnchor> anchors;
			var results = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this._session.reality._anchors.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var value = _step.value;

					results.push(value);
				}
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

			return results;
		}
	}]);

	return XRPresentationFrame;
}();

exports.default = XRPresentationFrame;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
XRCoordinateSystem represents the origin of a 3D coordinate system positioned at a known frame of reference.
The XRCoordinateSystem is a string from XRCoordinateSystem.TYPES:

These types are used by the app code when requesting a coordinate system from the session:
- XRCoordinateSystem.HEAD_MODEL: origin is aligned with the pose of the head, as sensed by HMD or handset trackers
- XRCoordinateSystem.EYE_LEVEL: origin is at a fixed distance above the ground

This is an internal type, specific to just this polyfill and not visible to the app code
- XRCoordinateSystem.TRACKER: The origin of this coordinate system is at floor level at or below the origin of the HMD or handset provided tracking system

*/
var XRCoordinateSystem = function () {
	function XRCoordinateSystem(display, type) {
		_classCallCheck(this, XRCoordinateSystem);

		this._display = display;
		this._type = type;

		this.__relativeMatrix = _MatrixMath2.default.mat4_generateIdentity();
		this._workingMatrix = _MatrixMath2.default.mat4_generateIdentity();
	}

	_createClass(XRCoordinateSystem, [{
		key: 'getTransformTo',
		value: function getTransformTo(otherCoordinateSystem) {
			// apply inverse of the poseModelMatrix to the identity matrix
			var inverse = _MatrixMath2.default.mat4_invert(new Float32Array(16), otherCoordinateSystem._poseModelMatrix);
			var out = _MatrixMath2.default.mat4_generateIdentity();
			_MatrixMath2.default.mat4_multiply(out, inverse, out);

			// apply the other system's poseModelMatrix
			_MatrixMath2.default.mat4_multiply(out, this._poseModelMatrix, out);
			return out;
		}
	}, {
		key: '_relativeMatrix',
		get: function get() {
			return this.__relativeMatrix;
		},
		set: function set(value) {
			for (var i = 0; i < 16; i++) {
				this.__relativeMatrix[i] = value[i];
			}
		}
	}, {
		key: '_poseModelMatrix',
		get: function get() {
			switch (this._type) {
				case XRCoordinateSystem.HEAD_MODEL:
					return this._display._headPose.poseModelMatrix;
				case XRCoordinateSystem.EYE_LEVEL:
					return this._display._eyeLevelPose.poseModelMatrix;
				case XRCoordinateSystem.TRACKER:
					_MatrixMath2.default.mat4_multiply(this._workingMatrix, this.__relativeMatrix, this._display._trackerPoseModelMatrix);
					return this._workingMatrix;
				default:
					throw new Error('Unknown coordinate system type: ' + this._type);
			}
		}
	}]);

	return XRCoordinateSystem;
}();

exports.default = XRCoordinateSystem;


XRCoordinateSystem.HEAD_MODEL = 'headModel';
XRCoordinateSystem.EYE_LEVEL = 'eyeLevel';
XRCoordinateSystem.TRACKER = 'tracker';

XRCoordinateSystem.TYPES = [XRCoordinateSystem.HEAD_MODEL, XRCoordinateSystem.EYE_LEVEL, XRCoordinateSystem.TRACKER];

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XRLayer2 = __webpack_require__(13);

var _XRLayer3 = _interopRequireDefault(_XRLayer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
XRWebGLLayer defines the WebGL or WebGL 2 context that is rendering the visuals for this layer.
*/
var XRWebGLLayer = function (_XRLayer) {
	_inherits(XRWebGLLayer, _XRLayer);

	function XRWebGLLayer(session, context) {
		_classCallCheck(this, XRWebGLLayer);

		var _this = _possibleConstructorReturn(this, (XRWebGLLayer.__proto__ || Object.getPrototypeOf(XRWebGLLayer)).call(this));

		_this._session = session;
		_this._context = context;
		_this._width = _this._context.canvas.width;
		_this._height = _this._context.canvas.height;
		_this._framebuffer = null; // TODO
		return _this;
	}

	_createClass(XRWebGLLayer, [{
		key: 'requestViewportScaling',
		value: function requestViewportScaling(viewportScaleFactor) {
			// void requestViewportScaling(double viewportScaleFactor);
			throw 'Not implemented';
		}
	}, {
		key: 'context',
		get: function get() {
			return this._context;
		}
	}, {
		key: 'antialias',
		get: function get() {
			// readonly attribute boolean antialias;
			throw 'Not implemented';
		}
	}, {
		key: 'depth',
		get: function get() {
			// readonly attribute boolean depth;
			throw 'Not implemented';
		}
	}, {
		key: 'stencil',
		get: function get() {
			// readonly attribute boolean stencil;
			throw 'Not implemented';
		}
	}, {
		key: 'alpha',
		get: function get() {
			// readonly attribute boolean alpha;
			throw 'Not implemented';
		}
	}, {
		key: 'multiview',
		get: function get() {
			// readonly attribute boolean multiview;
			throw 'Not implemented';
		}
	}, {
		key: 'framebuffer',
		get: function get() {
			return this._framebuffer;
		}
	}, {
		key: 'framebufferWidth',
		set: function set(w) {
			this._width = w;
			this._context.canvas.width = w;
		},
		get: function get() {
			// not using this for now, on iOS it's not good.  
			// var pr = window.devicePixelRatio || 1;
			//return this._context.canvas.clientWidth;
			return this._width;
		}
	}, {
		key: 'framebufferHeight',
		set: function set(h) {
			this._height = h;
			this._context.canvas.height = h;
		},
		get: function get() {
			// not using this for now, on iOS it's not good.  
			// var pr = window.devicePixelRatio || 1;
			//return this._context.canvas.clientHeight;
			return this._height;
		}
	}]);

	return XRWebGLLayer;
}(_XRLayer3.default);

exports.default = XRWebGLLayer;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _XRDisplay2 = __webpack_require__(4);

var _XRDisplay3 = _interopRequireDefault(_XRDisplay2);

var _XRView = __webpack_require__(7);

var _XRView2 = _interopRequireDefault(_XRView);

var _XRSession = __webpack_require__(6);

var _XRSession2 = _interopRequireDefault(_XRSession);

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

var _Quaternion = __webpack_require__(1);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

var _Vector = __webpack_require__(9);

var _Vector2 = _interopRequireDefault(_Vector);

var _DeviceOrientationTracker = __webpack_require__(14);

var _DeviceOrientationTracker2 = _interopRequireDefault(_DeviceOrientationTracker);

var _ARKitWrapper = __webpack_require__(10);

var _ARKitWrapper2 = _interopRequireDefault(_ARKitWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
FlatDisplay takes over a handset's full screen and presents a moving view into a Reality, as if it were a magic window.

If ARKit is present, it uses the ARKit updates to set the headModel pose.
If ARCore is available on the VRDisplays, use that to pose the headModel. (TODO)
Otherwise, use orientation events.
*/
var FlatDisplay = function (_XRDisplay) {
	_inherits(FlatDisplay, _XRDisplay);

	function FlatDisplay(xr, reality) {
		_classCallCheck(this, FlatDisplay);

		var _this = _possibleConstructorReturn(this, (FlatDisplay.__proto__ || Object.getPrototypeOf(FlatDisplay)).call(this, xr, 'Flat', false, reality));

		_this._started = false;
		_this._initialized = false;

		// This is used if we have ARKit support
		_this._arKitWrapper = null;

		// This is used if we have ARCore support
		_this._vrFrameData = null;

		// This is used if we are using orientation events
		_this._deviceOrientationTracker = null;

		// These are used if we have ARCore support or use window orientation events
		_this._deviceOrientation = null; // Quaternion
		_this._devicePosition = null; // Vector3
		_this._deviceWorldMatrix = null; // Float32Array(16)

		// Currently only support full screen views
		_this._views.push(new _XRView2.default(_this._fov, _this._depthNear, _this._depthFar));
		return _this;
	}

	_createClass(FlatDisplay, [{
		key: '_start',
		value: function _start() {
			var _this2 = this;

			if (this._reality._vrDisplay) {
				// Use ARCore
				if (this._vrFrameData === null) {
					this._vrFrameData = new VRFrameData();
					this._views[0]._depthNear = this._reality._vrDisplay.depthNear;
					this._views[0]._depthFar = this._reality._vrDisplay.depthFar;
					this._deviceOrientation = new _Quaternion2.default();
					this._devicePosition = new _Vector2.default();
					this._deviceWorldMatrix = new Float32Array(16);
				}
			} else if (_ARKitWrapper2.default.HasARKit()) {
				// Use ARKit
				if (this._initialized === false) {
					this._initialized = true;
					this._arKitWrapper = _ARKitWrapper2.default.GetOrCreate();
					this._arKitWrapper.addEventListener(_ARKitWrapper2.default.INIT_EVENT, this._handleARKitInit.bind(this));
					this._arKitWrapper.addEventListener(_ARKitWrapper2.default.WATCH_EVENT, this._handleARKitUpdate.bind(this));
					this._arKitWrapper.waitForInit().then(function () {
						_this2._arKitWrapper.watch();
					});
				} else {
					this._arKitWrapper.watch();
				}
			} else {
				// Use device orientation
				if (this._initialized === false) {
					this._initialized = true;
					this._deviceOrientation = new _Quaternion2.default();
					this._devicePosition = new _Vector2.default();
					this._deviceWorldMatrix = new Float32Array(16);
					this._deviceOrientationTracker = new _DeviceOrientationTracker2.default();
					this._deviceOrientationTracker.addEventListener(_DeviceOrientationTracker2.default.ORIENTATION_UPDATE_EVENT, this._updateFromDeviceOrientationTracker.bind(this));
				}
			}
			this.running = true;
			this._reality._start();
		}
	}, {
		key: '_stop',
		value: function _stop() {
			// TODO figure out how to stop ARKit and ARCore so that CameraReality can still work
			if (this.running === false) return;
			this.running = false;
			this._reality._stop();
		}

		/*
  Called by a session to indicate that its baseLayer attribute has been set.
  FlatDisplay just adds the layer's canvas to DOM elements created by the XR polyfill
  */

	}, {
		key: '_handleNewBaseLayer',
		value: function _handleNewBaseLayer(baseLayer) {
			baseLayer._context.canvas.style.width = "100%";
			baseLayer._context.canvas.style.height = "100%";
			baseLayer._context.canvas.width = this._xr._sessionEls.clientWidth;
			baseLayer._context.canvas.height = this._xr._sessionEls.clientHeight;

			// TODO:  Need to remove this listener if a new base layer is set
			window.addEventListener('resize', function () {
				baseLayer.framebufferWidth = baseLayer._context.canvas.clientWidth;
				baseLayer.framebufferHeight = baseLayer._context.canvas.clientHeight;
			}, false);

			this._xr._sessionEls.appendChild(baseLayer._context.canvas);
		}

		/*
  Called by a session before it hands a new XRPresentationFrame to the app
  */

	}, {
		key: '_handleNewFrame',
		value: function _handleNewFrame(frame) {
			if (this._vrFrameData !== null) {
				this._updateFromVRDevice();
			}
		}
	}, {
		key: '_updateFromVRDevice',
		value: function _updateFromVRDevice() {
			var _deviceOrientation, _devicePosition;

			this._reality._vrDisplay.getFrameData(this._vrFrameData);
			this._views[0].setProjectionMatrix(this._vrFrameData.leftProjectionMatrix);
			(_deviceOrientation = this._deviceOrientation).set.apply(_deviceOrientation, _toConsumableArray(this._vrFrameData.pose.orientation));
			(_devicePosition = this._devicePosition).set.apply(_devicePosition, _toConsumableArray(this._vrFrameData.pose.position));
			this._devicePosition.add(0, XRViewPose.SITTING_EYE_HEIGHT, 0);
			_MatrixMath2.default.mat4_fromRotationTranslation(this._deviceWorldMatrix, this._deviceOrientation.toArray(), this._devicePosition.toArray());
			this._headPose._setPoseModelMatrix(this._deviceWorldMatrix);
			this._eyeLevelPose._position = this._devicePosition.toArray();
		}
	}, {
		key: '_updateFromDeviceOrientationTracker',
		value: function _updateFromDeviceOrientationTracker() {
			// TODO set XRView's FOV
			this._deviceOrientationTracker.getOrientation(this._deviceOrientation);
			this._devicePosition.set(this._headPose.poseModelMatrix[12], this._headPose.poseModelMatrix[13], this._headPose.poseModelMatrix[14]);
			this._devicePosition.add(0, XRViewPose.SITTING_EYE_HEIGHT, 0);
			_MatrixMath2.default.mat4_fromRotationTranslation(this._deviceWorldMatrix, this._deviceOrientation.toArray(), this._devicePosition.toArray());
			this._headPose._setPoseModelMatrix(this._deviceWorldMatrix);
			this._eyeLevelPose._position = this._devicePosition.toArray();
		}
	}, {
		key: '_handleARKitUpdate',
		value: function _handleARKitUpdate() {
			var cameraTransformMatrix = this._arKitWrapper.getData('camera_transform');
			if (cameraTransformMatrix) {
				this._headPose._setPoseModelMatrix(cameraTransformMatrix);
				this._headPose._poseModelMatrix[13] += XRViewPose.SITTING_EYE_HEIGHT;
				this._eyeLevelPose._position = this._headPose._position;
			} else {
				console.log('no camera transform', this._arKitWrapper.rawARData);
			}

			var cameraProjectionMatrix = this._arKitWrapper.getData('projection_camera');
			if (cameraProjectionMatrix) {
				this._views[0].setProjectionMatrix(cameraProjectionMatrix);
			} else {
				console.log('no projection camera', this._arKitWrapper.rawARData);
			}
		}
	}, {
		key: '_handleARKitInit',
		value: function _handleARKitInit(ev) {
			var _this3 = this;

			setTimeout(function () {
				_this3._arKitWrapper.watch({
					location: true,
					camera: true,
					objects: true,
					light_intensity: true
				});
			}, 1000);
		}
	}, {
		key: '_createSession',
		value: function _createSession(parameters) {
			this._start();
			return _get(FlatDisplay.prototype.__proto__ || Object.getPrototypeOf(FlatDisplay.prototype), '_createSession', this).call(this, parameters);
		}
	}, {
		key: '_supportedCreationParameters',
		value: function _supportedCreationParameters(parameters) {
			return parameters.type === _XRSession2.default.AUGMENTATION && parameters.exclusive === false;
		}

		//attribute EventHandler ondeactivate; // FlatDisplay never deactivates

	}]);

	return FlatDisplay;
}(_XRDisplay3.default);

exports.default = FlatDisplay;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Euler = function () {
	function Euler(x, y, z) {
		var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Euler.DefaultOrder;

		_classCallCheck(this, Euler);

		this.x = x;
		this.y = y;
		this.z = z;
		this.order = order;
	}

	_createClass(Euler, [{
		key: 'set',
		value: function set(x, y, z) {
			var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Euler.DefaultOrder;

			this.x = x;
			this.y = y;
			this.z = z;
			this.order = order;
		}
	}, {
		key: 'toArray',
		value: function toArray() {
			return [this.x, this.y, this.z];
		}
	}]);

	return Euler;
}();

exports.default = Euler;


Euler.RotationOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];
Euler.DefaultOrder = 'XYZ';

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XRDisplay2 = __webpack_require__(4);

var _XRDisplay3 = _interopRequireDefault(_XRDisplay2);

var _XRView = __webpack_require__(7);

var _XRView2 = _interopRequireDefault(_XRView);

var _XRSession = __webpack_require__(6);

var _XRSession2 = _interopRequireDefault(_XRSession);

var _XRViewPose = __webpack_require__(8);

var _XRViewPose2 = _interopRequireDefault(_XRViewPose);

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

var _Quaternion = __webpack_require__(1);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

var _Vector = __webpack_require__(9);

var _Vector2 = _interopRequireDefault(_Vector);

var _DeviceOrientationTracker = __webpack_require__(14);

var _DeviceOrientationTracker2 = _interopRequireDefault(_DeviceOrientationTracker);

var _ARKitWrapper = __webpack_require__(10);

var _ARKitWrapper2 = _interopRequireDefault(_ARKitWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
HeadMountedDisplay wraps a WebVR 1.1 display, like a Vive, Rift, or Daydream.
*/
var HeadMountedDisplay = function (_XRDisplay) {
	_inherits(HeadMountedDisplay, _XRDisplay);

	function HeadMountedDisplay(xr, reality, vrDisplay) {
		_classCallCheck(this, HeadMountedDisplay);

		var _this = _possibleConstructorReturn(this, (HeadMountedDisplay.__proto__ || Object.getPrototypeOf(HeadMountedDisplay)).call(this, xr, vrDisplay.displayName, vrDisplay.capabilities.hasExternalDisplay, reality));

		_this._vrDisplay = vrDisplay;
		_this._vrFrameData = new VRFrameData();

		// The view projection matrices will be reset using VRFrameData during this._handleNewFrame
		_this._leftView = new _XRView2.default(_this._fov, _this._depthNear, _this._depthFar, _XRView2.default.LEFT);
		_this._rightView = new _XRView2.default(_this._fov, _this._depthNear, _this._depthFar, _XRView2.default.RIGHT);
		_this._views = [_this._leftView, _this._rightView];

		// These will be used to set the head and eye level poses during this._handleNewFrame
		_this._deviceOrientation = new _Quaternion2.default();
		_this._devicePosition = new _Vector2.default();
		_this._deviceWorldMatrix = new Float32Array(16);
		return _this;
	}

	/*
 Called via the XRSession.requestAnimationFrame
 */


	_createClass(HeadMountedDisplay, [{
		key: '_requestAnimationFrame',
		value: function _requestAnimationFrame(callback) {
			if (this._vrDisplay.isPresenting) {
				this._vrDisplay.requestAnimationFrame(callback);
			} else {
				window.requestAnimationFrame(callback);
			}
		}

		/*
  Called by a session to indicate that its baseLayer attribute has been set.
  This is where the VRDisplay is used to create a session 
  */

	}, {
		key: '_handleNewBaseLayer',
		value: function _handleNewBaseLayer(baseLayer) {
			var _this2 = this;

			this._vrDisplay.requestPresent([{
				source: baseLayer._context.canvas
			}]).then(function () {
				var leftEye = _this2._vrDisplay.getEyeParameters('left');
				var rightEye = _this2._vrDisplay.getEyeParameters('right');
				baseLayer.framebufferWidth = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
				baseLayer.framebufferHeight = Math.max(leftEye.renderHeight, rightEye.renderHeight);
				baseLayer._context.canvas.style.position = 'absolute';
				baseLayer._context.canvas.style.bottom = '1px';
				baseLayer._context.canvas.style.right = '1px';
				baseLayer._context.canvas.style.width = "100%";
				baseLayer._context.canvas.style.height = "100%";
				document.body.appendChild(baseLayer._context.canvas);
			}).catch(function (e) {
				console.error('Unable to init WebVR 1.1 display', e);
			});
		}
	}, {
		key: '_stop',
		value: function _stop() {
			// TODO figure out how to stop ARKit and ARCore so that CameraReality can still work
			if (this.running === false) return;
			this.running = false;
			this._reality._stop();
		}

		/*
  Called by a session before it hands a new XRPresentationFrame to the app
  */

	}, {
		key: '_handleNewFrame',
		value: function _handleNewFrame(frame) {
			if (this._vrDisplay.isPresenting) {
				this._updateFromVRFrameData();
			}
		}
	}, {
		key: '_handleAfterFrame',
		value: function _handleAfterFrame(frame) {
			if (this._vrDisplay.isPresenting) {
				this._vrDisplay.submitFrame();
			}
		}
	}, {
		key: '_supportedCreationParameters',
		value: function _supportedCreationParameters(parameters) {
			return parameters.type === _XRSession2.default.REALITY && parameters.exclusive === true;
		}
	}, {
		key: '_updateFromVRFrameData',
		value: function _updateFromVRFrameData() {
			this._vrDisplay.getFrameData(this._vrFrameData);
			this._leftView.setProjectionMatrix(this._vrFrameData.leftProjectionMatrix);
			this._rightView.setProjectionMatrix(this._vrFrameData.rightProjectionMatrix);
			if (this._vrFrameData.pose) {
				if (this._vrFrameData.pose.orientation) {
					var _deviceOrientation;

					(_deviceOrientation = this._deviceOrientation).set.apply(_deviceOrientation, _toConsumableArray(this._vrFrameData.pose.orientation));
				}
				if (this._vrFrameData.pose.position) {
					var _devicePosition;

					(_devicePosition = this._devicePosition).set.apply(_devicePosition, _toConsumableArray(this._vrFrameData.pose.position));
				}
				_MatrixMath2.default.mat4_fromRotationTranslation(this._deviceWorldMatrix, this._deviceOrientation.toArray(), this._devicePosition.toArray());
				if (this._vrDisplay.stageParameters && this._vrDisplay.stageParameters.sittingToStandingTransform) {
					_MatrixMath2.default.mat4_multiply(this._deviceWorldMatrix, this._vrDisplay.stageParameters.sittingToStandingTransform, this._deviceWorldMatrix);
				}
				this._headPose._setPoseModelMatrix(this._deviceWorldMatrix);
				this._eyeLevelPose.position = this._devicePosition.toArray();
			}
		}
	}]);

	return HeadMountedDisplay;
}(_XRDisplay3.default);

exports.default = HeadMountedDisplay;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Reality2 = __webpack_require__(5);

var _Reality3 = _interopRequireDefault(_Reality2);

var _XRAnchor = __webpack_require__(3);

var _XRAnchor2 = _interopRequireDefault(_XRAnchor);

var _XRViewPose = __webpack_require__(8);

var _XRViewPose2 = _interopRequireDefault(_XRViewPose);

var _XRAnchorOffset = __webpack_require__(11);

var _XRAnchorOffset2 = _interopRequireDefault(_XRAnchorOffset);

var _MatrixMath = __webpack_require__(0);

var _MatrixMath2 = _interopRequireDefault(_MatrixMath);

var _Quaternion = __webpack_require__(1);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

var _ARKitWrapper = __webpack_require__(10);

var _ARKitWrapper2 = _interopRequireDefault(_ARKitWrapper);

var _ARCoreCameraRenderer = __webpack_require__(31);

var _ARCoreCameraRenderer2 = _interopRequireDefault(_ARCoreCameraRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
CameraReality displays the forward facing camera.

If this is running in the iOS ARKit wrapper app, the camera data will be displayed in a Metal layer below the WKWebKit layer.
If this is running in the Google ARCore Chrome application, it will create a canvas element and use the ARCore provided camera data.
If there is no ARKit or ARCore available, it will use WebRTC's MediaStream to render camera data into a canvas.
*/
var CameraReality = function (_Reality) {
	_inherits(CameraReality, _Reality);

	function CameraReality(xr) {
		_classCallCheck(this, CameraReality);

		var _this = _possibleConstructorReturn(this, (CameraReality.__proto__ || Object.getPrototypeOf(CameraReality)).call(this, xr, 'Camera', true, true));

		_this._initialized = false;
		_this._running = false;

		// These are used if we have access to ARKit
		_this._arKitWrapper = null;

		// These are used if we do not have access to ARKit
		_this._mediaStream = null;
		_this._videoEl = null;

		// These are used if we're using the Google ARCore web app
		_this._arCoreCameraRenderer = null;
		_this._arCoreCanvas = null;
		_this._elContext = null;
		_this._vrDisplay = null;
		_this._vrFrameData = null;

		// Try to find a WebVR 1.1 display that supports Google's ARCore extensions
		if (typeof navigator.getVRDisplays === 'function') {
			navigator.getVRDisplays().then(function (displays) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = displays[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var display = _step.value;

						if (display === null) continue;
						if (display.capabilities.hasPassThroughCamera) {
							// This is the ARCore extension to WebVR 1.1
							_this._vrDisplay = display;
							_this._vrFrameData = new VRFrameData();
							_this._arCoreCanvas = document.createElement('canvas');
							_this._xr._realityEls.appendChild(_this._arCoreCanvas);
							_this._arCoreCanvas.width = window.innerWidth;
							_this._arCoreCanvas.height = window.innerHeight;
							_this._elContext = _this._arCoreCanvas.getContext('webgl');
							if (_this._elContext === null) {
								throw 'Could not create CameraReality GL context';
							}
							break;
						}
					}
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
			});
		}

		window.addEventListener('resize', function () {
			if (_this._arCoreCanvas) {
				_this._arCoreCanvas.width = window.innerWidth;
				_this._arCoreCanvas.height = window.innerHeight;
			}
		}, false);
		return _this;
	}

	/*
 Called by a session before it hands a new XRPresentationFrame to the app
 */


	_createClass(CameraReality, [{
		key: '_handleNewFrame',
		value: function _handleNewFrame(frame) {
			if (this._arCoreCameraRenderer) {
				this._arCoreCameraRenderer.render();
				this._vrDisplay.getFrameData(this._vrFrameData);
			}

			// TODO update the anchor positions using ARCore or ARKit
		}
	}, {
		key: '_start',
		value: function _start() {
			var _this2 = this;

			if (this._running) return;
			this._running = true;

			if (this._vrDisplay !== null) {
				// Using ARCore
				this._arCoreCameraRenderer = new _ARCoreCameraRenderer2.default(this._vrDisplay, this._elContext);
				this._initialized = true;
			} else if (_ARKitWrapper2.default.HasARKit()) {
				// Using ARKit
				if (this._initialized === false) {
					this._initialized = true;
					this._arKitWrapper = _ARKitWrapper2.default.GetOrCreate();
					this._arKitWrapper.addEventListener(_ARKitWrapper2.default.WATCH_EVENT, this._handleARKitWatch.bind(this));
					this._arKitWrapper.waitForInit().then(function () {
						_this2._arKitWrapper.watch();
					});
				} else {
					this._arKitWrapper.watch();
				}
			} else {
				// Using WebRTC
				if (this._initialized === false) {
					this._initialized = true;
					navigator.mediaDevices.getUserMedia({
						audio: false,
						video: { facingMode: "environment" }
					}).then(function (stream) {
						_this2._videoEl = document.createElement('video');
						_this2._xr._realityEls.appendChild(_this2._videoEl);
						_this2._videoEl.setAttribute('class', 'camera-reality-video');
						_this2._videoEl.setAttribute('playsinline', true);
						_this2._videoEl.style.width = '100%';
						_this2._videoEl.style.height = '100%';
						_this2._videoEl.srcObject = stream;
						_this2._videoEl.play();
					}).catch(function (err) {
						console.error('Could not set up video stream', err);
						_this2._initialized = false;
						_this2._running = false;
					});
				} else {
					this._xr._realityEls.appendChild(this._videoEl);
					this._videoEl.play();
				}
			}
		}
	}, {
		key: '_stop',
		value: function _stop() {
			if (this._running === false) return;
			this._running = false;
			if (_ARKitWrapper2.default.HasARKit()) {
				if (this._arKitWrapper === null) {
					return;
				}
				this._arKitWrapper.stop();
			} else if (this._arCoreCanvas) {
				this._xr._realityEls.removeChild(this._arCoreCanvas);
				this._arCoreCanvas = null;
			} else if (this._videoEl !== null) {
				this._videoEl.pause();
				this._xr._realityEls.removeChild(this._videoEl);
			}
		}
	}, {
		key: '_handleARKitWatch',
		value: function _handleARKitWatch(ev) {
			if (ev.detail && ev.detail.objects) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = ev.detail.objects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var anchorInfo = _step2.value;

						this._updateAnchorFromARKitUpdate(anchorInfo.uuid, anchorInfo);
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
		}
	}, {
		key: '_handleARKitAddObject',
		value: function _handleARKitAddObject(anchorInfo) {
			this._updateAnchorFromARKitUpdate(anchorInfo.uuid, anchorInfo);
		}
	}, {
		key: '_updateAnchorFromARKitUpdate',
		value: function _updateAnchorFromARKitUpdate(uid, anchorInfo) {
			var anchor = this._anchors.get(uid) || null;
			if (anchor === null) {
				console.log('unknown anchor', anchor);
				return;
			}
			// This assumes that the anchor's coordinates are in the tracker coordinate system
			anchor.coordinateSystem._relativeMatrix = anchorInfo.transform;
		}
	}, {
		key: '_addAnchor',
		value: function _addAnchor(anchor, display) {
			var _this3 = this;

			// Convert coordinates to the tracker coordinate system so that updating from ARKit transforms is simple
			if (this._arKitWrapper !== null) {
				this._arKitWrapper.addAnchor(anchor.uid, anchor.coordinateSystem._poseModelMatrix).then(function (detail) {
					return _this3._handleARKitAddObject(detail);
				});
			}
			// ARCore as implemented in the browser does not offer anchors except on a surface, so we just use untracked anchors
			this._anchors.set(anchor.uid, anchor);
			return anchor.uid;
		}

		/*
  Creates an anchor offset relative to a surface, as found by a ray
  normalized screen x and y are in range 0..1, with 0,0 at top left and 1,1 at bottom right
  returns a Promise that resolves either to an AnchorOffset with the first hit result or null if the hit test failed
  */

	}, {
		key: '_findAnchor',
		value: function _findAnchor(normalizedScreenX, normalizedScreenY, display) {
			var _this4 = this;

			return new Promise(function (resolve, reject) {
				if (_this4._arKitWrapper !== null) {
					// Perform a hit test using the ARKit integration
					_this4._arKitWrapper.hitTest(normalizedScreenX, normalizedScreenY, _ARKitWrapper2.default.HIT_TEST_TYPE_EXISTING_PLANES).then(function (hits) {
						if (hits.length === 0) {
							resolve(null);
							console.log('miss');
							return;
						}
						var hit = _this4._pickARKitHit(hits);
						hit.anchor_transform[13] += _XRViewPose2.default.SITTING_EYE_HEIGHT;
						hit.world_transform[13] += _XRViewPose2.default.SITTING_EYE_HEIGHT;

						// Use the first hit to create an XRAnchorOffset, creating the XRAnchor as necessary

						// TODO use XRPlaneAnchor for anchors with extents

						var anchor = _this4._getAnchor(hit.uuid);
						if (anchor === null) {
							var coordinateSystem = new XRCoordinateSystem(display, XRCoordinateSystem.TRACKER);
							coordinateSystem._relativeMatrix = hit.anchor_transform;
							anchor = new _XRAnchor2.default(coordinateSystem, hit.uuid);
							_this4._anchors.set(anchor.uid, anchor);
						}

						var offsetPosition = [hit.world_transform[12] - hit.anchor_transform[12], hit.world_transform[13] - hit.anchor_transform[13], hit.world_transform[14] - hit.anchor_transform[14]];
						var worldRotation = new _Quaternion2.default().setFromRotationMatrix(hit.world_transform);
						var inverseAnchorRotation = new _Quaternion2.default().setFromRotationMatrix(hit.anchor_transform).inverse();
						var offsetRotation = new _Quaternion2.default().multiplyQuaternions(worldRotation, inverseAnchorRotation);
						var anchorOffset = new _XRAnchorOffset2.default(anchor.uid);
						anchorOffset.poseMatrix = _MatrixMath2.default.mat4_fromRotationTranslation(new Float32Array(16), offsetRotation.toArray(), offsetPosition);
						resolve(anchorOffset);
					});
				} else if (_this4._vrDisplay !== null) {
					// Perform a hit test using the ARCore data
					var hits = _this4._vrDisplay.hitTest(normalizedScreenX, normalizedScreenY);
					if (hits.length == 0) {
						resolve(null);
						return;
					}
					hits.sort(function (a, b) {
						return a.distance - b.distance;
					});
					var anchor = _this4._getAnchor(hits[0].uuid);
					if (anchor === null) {
						var coordinateSystem = new XRCoordinateSystem(display, XRCoordinateSystem.TRACKER);
						coordinateSystem._relativeMatrix = hits[0].modelMatrix;
						coordinateSystem._relativeMatrix[13] += _XRViewPose2.default.SITTING_EYE_HEIGHT;
						anchor = new _XRAnchor2.default(coordinateSystem);
						_this4._anchors.set(anchor.uid, anchor);
					}
					resolve(new _XRAnchorOffset2.default(anchor.uid));
				} else {
					resolve(null); // No platform support for finding anchors
				}
			});
		}
	}, {
		key: '_removeAnchor',
		value: function _removeAnchor(uid) {
			// returns void
			// TODO talk to ARKit to delete an anchor
			this._anchors.delete(uid);
		}
	}, {
		key: '_pickARKitHit',
		value: function _pickARKitHit(data) {
			if (data.length === 0) return null;
			var info = null;

			var planeResults = data.filter(function (hitTestResult) {
				return hitTestResult.type != _ARKitWrapper2.default.HIT_TEST_TYPE_FEATURE_POINT;
			});
			var planeExistingUsingExtentResults = planeResults.filter(function (hitTestResult) {
				return hitTestResult.type == _ARKitWrapper2.default.HIT_TEST_TYPE_EXISTING_PLANE_USING_EXTENT;
			});
			var planeExistingResults = planeResults.filter(function (hitTestResult) {
				return hitTestResult.type == _ARKitWrapper2.default.HIT_TEST_TYPE_EXISTING_PLANE;
			});

			if (planeExistingUsingExtentResults.length) {
				// existing planes using extent first
				planeExistingUsingExtentResults = planeExistingUsingExtentResults.sort(function (a, b) {
					return a.distance - b.distance;
				});
				info = planeExistingUsingExtentResults[0];
			} else if (planeExistingResults.length) {
				// then other existing planes
				planeExistingResults = planeExistingResults.sort(function (a, b) {
					return a.distance - b.distance;
				});
				info = planeExistingResults[0];
			} else if (planeResults.length) {
				// other types except feature points
				planeResults = planeResults.sort(function (a, b) {
					return a.distance - b.distance;
				});
				info = planeResults[0];
			} else {
				// feature points if any
				info = data[0];
			}
			return info;
		}
	}]);

	return CameraReality;
}(_Reality3.default);

exports.default = CameraReality;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License')
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fragmentSource = '#extension GL_OES_EGL_image_external : require\n\nprecision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform samplerExternalOES uSampler;\n\nvoid main(void) {\n  gl_FragColor = texture2D(uSampler, vTextureCoord);\n}';

var vertexSource = 'attribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n  gl_Position = vec4(aVertexPosition, 1.0);\n  vTextureCoord = aTextureCoord;\n}';

/**
 * Creates and load a shader from a string, type specifies either 'vertex' or 'fragment'
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} str
 * @param {string} type
 * @return {!WebGLShader}
 */
function getShader(gl, str, type) {
	if (type == 'fragment') {
		var shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (type == 'vertex') {
		var shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	var result = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!result) {
		console.error(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

/**
 * Creates a shader program from vertex and fragment shader sources
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} vs
 * @param {string} fs
 * @return {!WebGLProgram}
 */
function getProgram(gl, vs, fs) {
	var vertexShader = getShader(gl, vs, 'vertex');
	var fragmentShader = getShader(gl, fs, 'fragment');
	if (!fragmentShader) {
		return null;
	}

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	var result = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
	if (!result) {
		console.error('Could not initialise arview shaders');
	}

	return shaderProgram;
}

/**
 * Calculate the correct orientation depending on the device and the camera
 * orientations.
 *
 * @param {number} screenOrientation
 * @param {number} seeThroughCameraOrientation
 * @return {number}
 */
function combineOrientations(screenOrientation, seeThroughCameraOrientation) {
	var seeThroughCameraOrientationIndex = 0;
	switch (seeThroughCameraOrientation) {
		case 90:
			seeThroughCameraOrientationIndex = 1;
			break;
		case 180:
			seeThroughCameraOrientationIndex = 2;
			break;
		case 270:
			seeThroughCameraOrientationIndex = 3;
			break;
		default:
			seeThroughCameraOrientationIndex = 0;
			break;
	}
	var screenOrientationIndex = 0;
	switch (screenOrientation) {
		case 90:
			screenOrientationIndex = 1;
			break;
		case 180:
			screenOrientationIndex = 2;
			break;
		case 270:
			screenOrientationIndex = 3;
			break;
		default:
			screenOrientationIndex = 0;
			break;
	}
	var ret = screenOrientationIndex - seeThroughCameraOrientationIndex;
	if (ret < 0) {
		ret += 4;
	}
	return ret % 4;
}

/**
 * Renders the ar camera's video texture
 */

var ARVideoRenderer = function () {
	/**
  * @param {VRDisplay} vrDisplay
  * @param {WebGLRenderingContext} gl
  */
	function ARVideoRenderer(vrDisplay, gl) {
		_classCallCheck(this, ARVideoRenderer);

		this.vrDisplay = vrDisplay;
		this.gl = gl;
		this.passThroughCamera = vrDisplay.getPassThroughCamera();
		this.program = getProgram(gl, vertexSource, fragmentSource);

		gl.useProgram(this.program);

		// Setup a quad
		this.vertexPositionAttribute = gl.getAttribLocation(this.program, 'aVertexPosition');
		this.textureCoordAttribute = gl.getAttribLocation(this.program, 'aTextureCoord');

		this.samplerUniform = gl.getUniformLocation(this.program, 'uSampler');

		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		var vertices = [-1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, -1.0, 0.0];
		var f32Vertices = new Float32Array(vertices);
		gl.bufferData(gl.ARRAY_BUFFER, f32Vertices, gl.STATIC_DRAW);
		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = 12;

		this.textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
		// Precalculate different texture UV coordinates depending on the possible
		// orientations of the device depending if there is a VRDisplay or not
		var textureCoords = null;
		if (this.vrDisplay) {
			var u = this.passThroughCamera.width / this.passThroughCamera.textureWidth;
			var v = this.passThroughCamera.height / this.passThroughCamera.textureHeight;
			textureCoords = [[0.0, 0.0, 0.0, v, u, 0.0, u, v], [u, 0.0, 0.0, 0.0, u, v, 0.0, v], [u, v, u, 0.0, 0.0, v, 0.0, 0.0], [0.0, v, u, v, 0.0, 0.0, u, 0.0]];
		} else {
			textureCoords = [[0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0], [1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0], [1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0], [0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0]];
		}

		this.f32TextureCoords = [];
		for (var i = 0; i < textureCoords.length; i++) {
			this.f32TextureCoords.push(new Float32Array(textureCoords[i]));
		}
		// Store the current combined orientation to check if it has changed
		// during the update calls and use the correct texture coordinates.
		this.combinedOrientation = combineOrientations(screen.orientation.angle, this.passThroughCamera.orientation);

		gl.bufferData(gl.ARRAY_BUFFER, this.f32TextureCoords[this.combinedOrientation], gl.STATIC_DRAW);
		this.textureCoordBuffer.itemSize = 2;
		this.textureCoordBuffer.numItems = 8;
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		var indices = [0, 1, 2, 2, 1, 3];
		var ui16Indices = new Uint16Array(indices);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ui16Indices, gl.STATIC_DRAW);
		this.indexBuffer.itemSize = 1;
		this.indexBuffer.numItems = 6;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		this.texture = gl.createTexture();
		gl.useProgram(null);

		// The projection matrix will be based on an identify orthographic camera
		this.projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
		this.mvMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
		return this;
	}

	/**
  * Renders the quad
  */


	_createClass(ARVideoRenderer, [{
		key: 'render',
		value: function render() {
			var gl = this.gl;
			gl.useProgram(this.program);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
			gl.enableVertexAttribArray(this.vertexPositionAttribute);
			gl.vertexAttribPointer(this.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

			// Check the current orientation of the device combined with the
			// orientation of the VRSeeThroughCamera to determine the correct UV
			// coordinates to be used.
			var combinedOrientation = combineOrientations(screen.orientation.angle, this.passThroughCamera.orientation);
			if (combinedOrientation !== this.combinedOrientation) {
				this.combinedOrientation = combinedOrientation;
				gl.bufferData(gl.ARRAY_BUFFER, this.f32TextureCoords[this.combinedOrientation], gl.STATIC_DRAW);
			}
			gl.enableVertexAttribArray(this.textureCoordAttribute);
			gl.vertexAttribPointer(this.textureCoordAttribute, this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_EXTERNAL_OES, this.texture);
			// Update the content of the texture in every frame.
			gl.texImage2D(gl.TEXTURE_EXTERNAL_OES, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.passThroughCamera);
			gl.uniform1i(this.samplerUniform, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

			gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

			// Disable enabled states to allow other render calls to correctly work
			gl.bindTexture(gl.TEXTURE_EXTERNAL_OES, null);
			gl.disableVertexAttribArray(this.vertexPositionAttribute);
			gl.disableVertexAttribArray(this.textureCoordAttribute);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
			gl.useProgram(null);
		}
	}]);

	return ARVideoRenderer;
}();

/**
 * A helper class that takes a VRDisplay with AR capabilities
 * and renders the see through camera to the passed in WebGL context.
 */


var ARCoreCameraRenderer = function () {
	function ARCoreCameraRenderer(vrDisplay, gl) {
		_classCallCheck(this, ARCoreCameraRenderer);

		this.vrDisplay = vrDisplay;
		this.gl = gl;

		this.videoRenderer = new ARVideoRenderer(vrDisplay, this.gl);

		// Cache the width/height so we're not potentially forcing
		// a reflow if there's been a style invalidation
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		window.addEventListener('resize', this.onWindowResize.bind(this), false);
	}

	/**
  * Updates the stored width/height of window on resize.
  */


	_createClass(ARCoreCameraRenderer, [{
		key: 'onWindowResize',
		value: function onWindowResize() {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
		}

		/**
   * Renders the see through camera to the passed in gl context
   */

	}, {
		key: 'render',
		value: function render() {
			var gl = this.gl;
			var dpr = 1;
			var width = this.width * dpr;
			var height = this.height * dpr;

			if (gl.viewportWidth !== width) {
				gl.viewportWidth = width;
			}

			if (gl.viewportHeight !== height) {
				gl.viewportHeight = height;
			}

			this.gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
			this.videoRenderer.render();
		}
	}]);

	return ARCoreCameraRenderer;
}();

exports.default = ARCoreCameraRenderer;

/***/ })
/******/ ]);