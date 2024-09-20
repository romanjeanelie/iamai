"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NavigationAnimations = void 0;

var _gsap = _interopRequireWildcard(require("gsap"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NavigationAnimations =
/*#__PURE__*/
function () {
  function NavigationAnimations() {
    _classCallCheck(this, NavigationAnimations);

    // DOM ELEMENTS
    this.headerNav = document.querySelector(".header-nav");
    this.footerNav = document.querySelector(".footer-nav"); // Init Methods

    this.initializeNavHidden();
  }

  _createClass(NavigationAnimations, [{
    key: "initializeNavHidden",
    value: function initializeNavHidden() {
      _gsap["default"].set(this.headerNav, {
        opacity: 0,
        yPercent: -100
      });

      _gsap["default"].set(this.footerNav, {
        opacity: 0
      });
    }
  }, {
    key: "showNav",
    value: function showNav() {
      var tl = _gsap["default"].timeline({
        defaults: {
          duration: 0.3,
          delay: 0.2,
          ease: _gsap.Power3.easeOut
        }
      });

      tl.to(this.headerNav, {
        opacity: 1,
        yPercent: 0,
        duration: 0.5
      });
      tl.to(this.footerNav, {
        opacity: 1,
        duration: 0.5
      }, "<+=0.1");
    }
  }]);

  return NavigationAnimations;
}();

exports.NavigationAnimations = NavigationAnimations;