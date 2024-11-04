"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dat = _interopRequireDefault(require("dat.gui"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WavesGUI =
/*#__PURE__*/
function () {
  function WavesGUI(_ref) {
    var settings = _ref.settings,
        material = _ref.material,
        toggleWaves = _ref.toggleWaves,
        destroy = _ref.destroy;

    _classCallCheck(this, WavesGUI);

    this.settings = settings;
    this.material = material;
    this.toggleWaves = toggleWaves;
    this.destroy = destroy;
    this.setupGUI();
  }

  _createClass(WavesGUI, [{
    key: "setupGUI",
    value: function setupGUI() {
      var _this = this;

      this.gui = new _dat["default"].GUI();
      var paramsFolder = this.gui.addFolder("Parameters");
      paramsFolder.add(this.settings, "progress", 0, 1).name("Progress").step(0.01).onChange(function (value) {
        _this.material.uniforms.uStateProgress.value = value;
      });
      paramsFolder.add(this.settings, "fadeProgress", 0, 1).name("Fade Progress").step(0.01).onChange(function (value) {
        _this.material.uniforms.uFadeProgress.value = value;
      });
      paramsFolder.add(this.settings, "frequency", 0, 20).name("Frequency").onChange(function (value) {
        _this.material.uniforms.uFrequency.value = value;
      });
      paramsFolder.add(this.settings, "amplitude", 0, 10).name("Amplitude").onChange(function (value) {
        _this.material.uniforms.uAmplitude.value = value;
      });
      paramsFolder.add(this.settings, "waveSpeed", 0, 100).name("Wave Speed").onChange(function (value) {
        _this.material.uniforms.uWaveSpeed.value = value;
      });
      paramsFolder.add(this.settings, "waveLength", 0, 1).name("Wave Length").step(0.01).onChange(function (value) {
        _this.material.uniforms.uWaveLength.value = value;
      }); // Add a button that creates or destroy the waves

      paramsFolder.add({
        add: this.toggleWaves
      }, "add").name("Toggle Waves");
      this.gui.add({
        add: this.destroy
      }, "add").name("DEstroy"); // create a new gui folder for colors

      var colorsFolder = this.gui.addFolder("Colors");
      colorsFolder.addColor(this.settings, "backgroundColor").name("Background Color").onChange(function (value) {
        // Assuming this.material.uniforms.uBackgroundColor exists
        _this.material.uniforms.uBackgroundColor.value.set(value);
      });
      this.gui.add(this.settings, "b1", 0, 1).onChange(function (value) {
        return _this.material.uniforms.uB1.value = value;
      }).step(0.01);
      this.gui.add(this.settings, "g1", 0, 1).onChange(function (value) {
        return _this.material.uniforms.uG1.value = value;
      }).step(0.01);
      this.gui.add(this.settings, "r2", 0, 1).onChange(function (value) {
        return _this.material.uniforms.uR2.value = value;
      }).step(0.01);
      this.gui.add(this.settings, "b2", 0, 1).onChange(function (value) {
        return _this.material.uniforms.uB2.value = value;
      }).step(0.01);
      this.gui.add(this.settings, "g3", 0, 1).onChange(function (value) {
        return _this.material.uniforms.uG3.value = value;
      }).step(0.01);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.gui.destroy();
    }
  }]);

  return WavesGUI;
}();

exports["default"] = WavesGUI;