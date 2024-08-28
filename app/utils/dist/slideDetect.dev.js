"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SlideDetect =
/*#__PURE__*/
function () {
  function SlideDetect(_ref) {
    var leftSlideCallback = _ref.leftSlideCallback,
        rightSlideCallback = _ref.rightSlideCallback;

    _classCallCheck(this, SlideDetect);

    this.leftSlideCallback = leftSlideCallback;
    this.rightSlideCallback = rightSlideCallback; // States

    this.xDown = null;
    this.threshold = 0; // Bind Methods

    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleMouseStart = this.handleMouseStart.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this); // Init Methods

    this.addEvents();
  }

  _createClass(SlideDetect, [{
    key: "handleTouchStart",
    value: function handleTouchStart(evt) {
      var firstTouch = evt.touches[0];
      this.xDown = firstTouch.clientX;
    }
  }, {
    key: "handleTouchMove",
    value: function handleTouchMove(evt) {
      if (!this.xDown) return;
      var xUp = evt.touches[0].clientX;
      var xDiff = this.xDown - xUp;

      if (xDiff > 0) {
        if (this.leftSlideCallback) this.leftSlideCallback();
      } else if (xDiff < 0) {
        this.rightSlideCallback();
      }
      /* reset values */


      this.xDown = null;
    }
  }, {
    key: "handleMouseStart",
    value: function handleMouseStart(evt) {
      this.xDown = evt.clientX;
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(evt) {
      if (!this.xDown) return;
      var xUp = evt.clientX;
      var xDiff = this.xDown - xUp;

      if (xDiff > 0) {
        if (this.leftSlideCallback) this.leftSlideCallback();
      } else if (xDiff < 0) {
        this.rightSlideCallback();
      }
      /* reset values */


      this.xDown = null;
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      document.addEventListener("mousedown", this.handleMouseStart, false);
      document.addEventListener("mouseup", this.handleMouseUp, false);
      document.addEventListener("touchstart", this.handleTouchStart, false);
      document.addEventListener("touchmove", this.handleTouchMove, false);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      console.log("destroy slide detect");
      document.removeEventListener("mousedown", this.handleMouseStart, false);
      document.removeEventListener("mouseup", this.handleMouseUp, false);
      document.removeEventListener("touchstart", this.handleTouchStart, false);
      document.removeEventListener("touchmove", this.handleTouchMove, false);
      this.xDown = null;
    }
  }]);

  return SlideDetect;
}();

exports["default"] = SlideDetect;