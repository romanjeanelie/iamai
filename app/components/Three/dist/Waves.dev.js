"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("three"));

var _OrbitControls = require("three/examples/jsm/controls/OrbitControls.js");

var _lilGui = _interopRequireDefault(require("lil-gui"));

var _vertex = _interopRequireDefault(require("./shaders/test/vertex.glsl"));

var _fragment = _interopRequireDefault(require("./shaders/test/fragment.glsl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Waves =
/*#__PURE__*/
function () {
  function Waves(canvasSelector) {
    _classCallCheck(this, Waves);

    this.canvas = document.querySelector(".threejs-canvas");
    this.init();
  }

  _createClass(Waves, [{
    key: "init",
    value: function init() {
      this.setupScene();
      this.setupCamera();
      this.setupRenderer();
      this.setupControls();
      this.setupGUI();
      this.setupMesh();
      this.setupEventListeners();
      this.animate();
    }
  }, {
    key: "setupScene",
    value: function setupScene() {
      this.scene = new THREE.Scene();
    }
  }, {
    key: "setupCamera",
    value: function setupCamera() {
      this.sizes = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
      this.camera.position.set(0.25, -0.25, 1);
      this.scene.add(this.camera);
    }
  }, {
    key: "setupRenderer",
    value: function setupRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas
      });
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }, {
    key: "setupControls",
    value: function setupControls() {
      this.controls = new _OrbitControls.OrbitControls(this.camera, this.canvas);
      this.controls.enableDamping = true;
    }
  }, {
    key: "setupGUI",
    value: function setupGUI() {
      this.gui = new _lilGui["default"]();
    }
  }, {
    key: "setupMesh",
    value: function setupMesh() {
      var textureLoader = new THREE.TextureLoader();
      var flagTexture = textureLoader.load("/textures/flag-french.jpg");
      var geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
      var count = geometry.attributes.position.count;
      var randoms = new Float32Array(count);

      for (var i = 0; i < count; i++) {
        randoms[i] = Math.random();
      }

      geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
      this.material = new THREE.ShaderMaterial({
        vertexShader: _vertex["default"],
        fragmentShader: _fragment["default"],
        uniforms: {
          uFrequency: {
            value: new THREE.Vector2(10, 5)
          },
          uTime: {
            value: 0
          },
          uColor: {
            value: new THREE.Color("orange")
          },
          uTexture: {
            value: flagTexture
          }
        }
      });
      this.gui.add(this.material.uniforms.uFrequency.value, "x").min(0).max(20).step(0.01).name("frequencyX");
      this.gui.add(this.material.uniforms.uFrequency.value, "y").min(0).max(20).step(0.01).name("frequencyY");
      this.mesh = new THREE.Mesh(geometry, this.material);
      this.mesh.scale.y = 2 / 3;
      this.scene.add(this.mesh);
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this = this;

      window.addEventListener("resize", function () {
        _this.sizes.width = window.innerWidth;
        _this.sizes.height = window.innerHeight;
        _this.camera.aspect = _this.sizes.width / _this.sizes.height;

        _this.camera.updateProjectionMatrix();

        _this.renderer.setSize(_this.sizes.width, _this.sizes.height);

        _this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this2 = this;

      this.clock = new THREE.Clock();

      var tick = function tick() {
        var elapsedTime = _this2.clock.getElapsedTime();

        _this2.material.uniforms.uTime.value = elapsedTime;

        _this2.controls.update();

        _this2.renderer.render(_this2.scene, _this2.camera);

        window.requestAnimationFrame(tick);
      };

      tick();
    }
  }]);

  return Waves;
}();

exports["default"] = Waves;