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

var HeroBentoAnimations =
/*#__PURE__*/
function () {
  function HeroBentoAnimations() {
    _classCallCheck(this, HeroBentoAnimations);

    // DOM Elements
    this.header = document.querySelector(".heroBentoGrid__header");
    this.bentoCards = document.querySelectorAll(".heroBentoGrid__grid-item");
    this.initHiddenBentoCards();
  }

  _createClass(HeroBentoAnimations, [{
    key: "initHiddenBentoCards",
    value: function initHiddenBentoCards() {
      _gsap["default"].set(this.header, {
        opacity: 0,
        yPercent: 5
      });

      _gsap["default"].set(this.bentoCards, {
        opacity: 0,
        yPercent: 10
      });
    }
  }, {
    key: "showBentoCards",
    value: function showBentoCards() {
      var tl = _gsap["default"].timeline({
        defaults: {
          ease: "power2.out",
          duration: 0.4
        }
      });

      tl.to(this.header, {
        opacity: 1,
        yPercent: 0,
        delay: 1
      });
      tl.to(this.bentoCards, {
        opacity: 1,
        yPercent: 0,
        stagger: {
          amount: 0.2,
          grid: "auto"
        },
        duration: 0.4
      }, "<+=0.2");
    }
  }]);

  return HeroBentoAnimations;
}();

exports["default"] = HeroBentoAnimations;