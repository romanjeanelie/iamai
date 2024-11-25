"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireWildcard(require("gsap"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
  }, {
    key: "hideBentoGridsAnim",
    value: function hideBentoGridsAnim(bentoContainer, destroy) {
      return regeneratorRuntime.async(function hideBentoGridsAnim$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(new Promise(function (res) {
                _gsap["default"].to(bentoContainer, {
                  yPercent: -200,
                  ease: _gsap.Power3.easeOut,
                  duration: 0.5,
                  onComplete: function onComplete() {
                    res();
                  }
                });
              }));

            case 2:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }]);

  return HeroBentoAnimations;
}();

exports["default"] = HeroBentoAnimations;