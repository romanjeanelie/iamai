"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Waves =
/*#__PURE__*/
function () {
  function Waves() {
    _classCallCheck(this, Waves);

    // States
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.aspectRatio = this.sizes.width / this.sizes.height; // DOM ELEMENTS

    this.canvas = document.querySelector(".threejs-container"); // INIT METHODS

    this.init();
  }

  _createClass(Waves, [{
    key: "init",
    value: function init() {
      this.setupScene();
      this.setupCamera();
      this.setupRenderer();
      this.setupMesh();
      this.addEvents();
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
      this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 100);
      this.updateCamera();
      this.scene.add(this.camera);
    }
  }, {
    key: "setupRenderer",
    value: function setupRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true
      });
      this.renderer.setClearAlpha(0);
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }, {
    key: "setupMesh",
    value: function setupMesh() {
      // Create the plane to match the camera's view
      var geometry = new THREE.PlaneGeometry(2, 2, 32, 32);
      var material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
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
            value: new THREE.TextureLoader().load("uv-tester.png")
          }
        },
        transparent: true
      });
      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);
    }
  }, {
    key: "updateCamera",
    value: function updateCamera() {
      var aspect = this.sizes.width / this.sizes.height; // Ensure the camera distance is set so the plane perfectly fills the screen

      this.camera.position.set(0, 0, 1); // Ensure the camera stays close

      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.camera.aspect = aspect; // Update the camera aspect ratio

      this.camera.updateProjectionMatrix();
    }
  }, {
    key: "updateRenderer",
    value: function updateRenderer() {
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this = this;

      this.clock = new THREE.Clock();

      var tick = function tick() {
        var elapsedTime = _this.clock.getElapsedTime();

        _this.mesh.material.uniforms.uTime.value = elapsedTime;

        _this.renderer.render(_this.scene, _this.camera);

        window.requestAnimationFrame(tick);
      };

      tick();
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      var _this2 = this;

      window.addEventListener("resize", function () {
        _this2.sizes.width = window.innerWidth;
        _this2.sizes.height = window.innerHeight;
        _this2.aspectRatio = _this2.sizes.width / _this2.sizes.height;

        _this2.updateCamera();

        _this2.updateRenderer();
      });
    }
  }]);

  return Waves;
}();

exports["default"] = Waves;