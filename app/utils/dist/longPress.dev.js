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
  function LongPress(element, callback, cancelCallback) {
    var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 3000;

    _classCallCheck(this, LongPress);

    this.element = element;
    this.callback = callback;
    this.cancelCallback = cancelCallback;
    this.duration = duration;
    this.timeoutId = null; // States

    this.active = false;
    console.log("LONG PRESS"); // Bind the event handlers

    this.handleStartPress = this.handleStartPress.bind(this);
    this.handleCancelPress = this.handleCancelPress.bind(this); // Add event listeners

    this.addEvents();
  }

  _createClass(LongPress, [{
    key: "handleStartPress",
    value: function handleStartPress() {
      var _this = this;

      this.timeoutId = setTimeout(function () {
        _this.callback();

        _this.active = true;
        _this.timeoutId = null; // Clear timeout ID after callback execution
      }, this.duration);
    }
  }, {
    key: "handleCancelPress",
    value: function handleCancelPress() {
      var _this2 = this;

      if (this.timeoutId === null) {
        this.cancelCallback();
      } else {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      setTimeout(function () {
        _this2.active = false;
      }, 1000);
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      this.element.addEventListener("mousedown", this.handleStartPress);
      this.element.addEventListener("mouseleave", this.handleCancelPress);
      this.element.addEventListener("mouseup", this.handleCancelPress);
      this.element.addEventListener("touchstart", this.handleStartPress);
      this.element.addEventListener("touchend", this.handleCancelPress);
      this.element.addEventListener("touchcancel", this.handleCancelPress);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.element.removeEventListener("mousedown", this.handleStartPress);
      this.element.removeEventListener("mouseleave", this.handleCancelPress);
      this.element.removeEventListener("mouseup", this.handleCancelPress);
      this.element.removeEventListener("touchstart", this.handleStartPress);
      this.element.removeEventListener("touchend", this.handleCancelPress);
      this.element.removeEventListener("touchcancel", this.handleCancelPress);
    }
  }]);

  return LongPress;
}();

exports["default"] = LongPress;