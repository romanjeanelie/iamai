"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var InputVideo =
/*#__PURE__*/
function () {
  function InputVideo(emitter) {
    _classCallCheck(this, InputVideo);

    this.emitter = emitter; // States
    // Dom elements

    this.container = document.querySelector(".input__video--container"); // Bindings

    this.displayVideoInput = this.displayVideoInput.bind(this); // Init Methods

    this.addEvents();
  }

  _createClass(InputVideo, [{
    key: "displayVideoInput",
    value: function displayVideoInput() {
      console.log("displayVideoInput");
      this.container.classList.add("visible");
    }
  }, {
    key: "hideVideoInput",
    value: function hideVideoInput() {
      this.container.classList.remove("visible");
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      this.emitter.on("input:displayVideoInput", this.displayVideoInput); // this.videoBtn.addEventListener("click", this.displayVideoInput);
    }
  }]);

  return InputVideo;
}();

exports["default"] = InputVideo;