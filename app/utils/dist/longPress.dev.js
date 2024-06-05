"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LongPress =
/*#__PURE__*/
function () {
  function LongPress(element, callback) {
    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3000;

    _classCallCheck(this, LongPress);

    this.element = element;
    this.callback = callback;
    this.duration = duration;
    this.timeoutId = null; // Bind the event handlers

    this.handleStartPress = this.handleStartPress.bind(this);
    this.handleCancelPress = this.handleCancelPress.bind(this); // Add event listeners

    this.addEvents();
  }

  _createClass(LongPress, [{
    key: "handleStartPress",
    value: function handleStartPress() {
      this.timeoutId = setTimeout(this.callback, this.duration);
    }
  }, {
    key: "handleCancelPress",
    value: function handleCancelPress() {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      this.element.addEventListener("mousedown", this.handleStartPress);
      this.element.addEventListener("mouseup", this.handleCancelPress);
      this.element.addEventListener("touchstart", this.handleStartPress);
      this.element.addEventListener("touchend", this.handleCancelPress);
      this.element.addEventListener("touchcancel", this.handleCancelPress);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.element.removeEventListener("mousedown", this.handleStartPress);
      this.element.removeEventListener("mouseup", this.handleCancelPress);
      this.element.removeEventListener("touchstart", this.handleStartPress);
      this.element.removeEventListener("touchend", this.handleCancelPress);
      this.element.removeEventListener("touchcancel", this.handleCancelPress);
    }
  }]);

  return LongPress;
}();

exports["default"] = LongPress;