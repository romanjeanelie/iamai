"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AudioProcessor = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AudioProcessor =
/*#__PURE__*/
function () {
  function AudioProcessor(analyser) {
    _classCallCheck(this, AudioProcessor);

    this.analyser = analyser;
    this.bufferLength = this.analyser.frequencyBinCount; // States

    this.dataArray = new Uint8Array(this.bufferLength);
    this.noiseLevel = 0;
    this.sensitivityFactor = 4;
    this.noiseDecay = 0.01; // Init Method

    this.initBackgroundNoise();
  }

  _createClass(AudioProcessor, [{
    key: "initBackgroundNoise",
    value: function initBackgroundNoise() {
      var samples = 0;
      var totalNoise = 0;

      for (var i = 0; i < 50; i++) {
        this.analyser.getByteFrequencyData(this.dataArray);
        totalNoise += this.getAverageVolume();
        samples++;
      }

      this.noiseLevel = totalNoise / samples; // set initial noise level
    }
  }, {
    key: "getAverageVolume",
    value: function getAverageVolume() {
      this.analyser.getByteFrequencyData(this.dataArray);
      var sum = 0;

      for (var i = 0; i < this.bufferLength; i++) {
        sum += this.dataArray[i];
      }

      return sum / this.bufferLength;
    }
  }, {
    key: "updateNoiseLevel",
    value: function updateNoiseLevel(newVolume) {
      this.noiseLevel = this.noiseLevel * (1 - this.noiseDecay) + newVolume * this.noiseDecay;
    }
  }]);

  return AudioProcessor;
}();

exports.AudioProcessor = AudioProcessor;