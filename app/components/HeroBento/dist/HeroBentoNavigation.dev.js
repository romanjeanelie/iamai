"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireDefault(require("gsap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HeroBentoNavigation =
/*#__PURE__*/
function () {
  function HeroBentoNavigation(parent) {
    _classCallCheck(this, HeroBentoNavigation);

    this.parent = parent;
    this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;
  }

  _createClass(HeroBentoNavigation, [{
    key: "startDragging",
    value: function startDragging(event) {
      this.isDragging = true;
      this.startX = event.pageX - this.parent.slider.offsetLeft;
      this.scrollLeft = this.parent.slider.scrollLeft;
      this.parent.slider.classList.add("dragging");
    }
  }, {
    key: "moveSlider",
    value: function moveSlider(event) {
      if (!this.isDragging) return;
      var x = event.pageX - this.parent.slider.offsetLeft;
      var scroll = x - this.startX;
      this.parent.slider.scrollLeft = this.scrollLeft - scroll;
    }
  }, {
    key: "stopDragging",
    value: function stopDragging() {
      var _this = this;

      if (!this.isDragging) return;
      this.isDragging = false;

      _gsap["default"].to(this.parent.slider, {
        scrollLeft: this.parent.currentSlider * this.parent.slider.offsetWidth,
        duration: 0.2,
        onComplete: function onComplete() {
          _this.parent.slider.classList.remove("dragging");
        }
      });
    }
  }]);

  return HeroBentoNavigation;
}();

exports["default"] = HeroBentoNavigation;