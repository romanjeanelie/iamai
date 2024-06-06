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
  function SlideDetect() {
    _classCallCheck(this, SlideDetect);

    this.xDown = null;
    this.threshold = 5;
    this.addEvents();
  }

  _createClass(SlideDetect, [{
    key: "getTouches",
    value: function getTouches(evt) {
      console.log(evt);
      return evt.touches || // browser API
      evt.originalEvent.touches; // jQuery
    }
  }, {
    key: "handleTouchStart",
    value: function handleTouchStart(evt) {
      var firstTouch = this.getTouches(evt)[0];
      this.xDown = firstTouch.clientX;
    }
  }, {
    key: "handleTouchMove",
    value: function handleTouchMove(evt) {
      if (!this.xDown) return;
      var xUp = evt.touches[0].clientX;
      var xDiff = this.xDown - xUp;
      console.log(xDiff);

      if (Math.abs(xDiff) > this.threshold && xDiff > 0) {
        console.log("left swipe");
      } else if (Math.abs(xDiff) > this.threshold && xDiff < 0) {
        console.log("right swipe");
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

      if (Math.abs(xDiff) > this.threshold && xDiff > 0) {
        console.log("left swipe");
      } else if (Math.abs(xDiff) > this.threshold && xDiff < 0) {
        console.log("right swipe");
      }
      /* reset values */


      this.xDown = null;
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      document.addEventListener("mousedown", this.handleMouseStart.bind(this), false);
      document.addEventListener("mouseup", this.handleMouseUp.bind(this), false);
      document.addEventListener("touchstart", this.handleTouchStart.bind(this), false);
      document.addEventListener("touchmove", this.handleTouchMove.bind(this), false);
    }
  }]);

  return SlideDetect;
}();

exports["default"] = SlideDetect;