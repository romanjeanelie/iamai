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
        material = _ref.material;

    _classCallCheck(this, WavesGUI);

    this.settings = settings;
    this.material = material;
    console.log("WavesGUI -> constructor -> this.material", this.material);
    this.setupGUI();
  }

  _createClass(WavesGUI, [{
    key: "setupGUI",
    value: function setupGUI() {
      var _this = this;

      this.gui = new _dat["default"].GUI();
      this.gui.add(this.settings, "progress", 0, 1).name("Progress").step(0.01).onChange(function (value) {
        _this.material.uniforms.uProgress.value = value;
      });
      this.gui.add(this.settings, "frequency", 0, 20).name("Frequency").onChange(function (value) {
        _this.material.uniforms.uFrequency.value = value;
      });
      this.gui.add(this.settings, "amplitude", 0, 10).name("Amplitude").onChange(function (value) {
        _this.material.uniforms.uAmplitude.value = value;
      });
      this.gui.add(this.settings, "waveSpeed", 0, 100).name("Wave Speed").onChange(function (value) {
        _this.material.uniforms.uWaveSpeed.value = value;
      });
      this.gui.add(this.settings, "waveLength", 0, 1).name("Wave Length").step(0.01).onChange(function (value) {
        _this.material.uniforms.uWaveLength.value = value;
      });
      this.gui.addColor(this.settings, "backgroundColor").name("Background Color").onChange(function (value) {
        // Assuming this.material.uniforms.uBackgroundColor exists
        _this.material.uniforms.uBackgroundColor.value.set(value);
      });
    }
  }]);

  return WavesGUI;
}();

exports["default"] = WavesGUI;