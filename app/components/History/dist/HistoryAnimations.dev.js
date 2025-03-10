"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireWildcard(require("gsap"));

var _ScrollTrigger = require("gsap/ScrollTrigger");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_gsap["default"].registerPlugin(_ScrollTrigger.ScrollTrigger);

var HistoryAnimation =
/*#__PURE__*/
function () {
  function HistoryAnimation(_ref) {
    var emitter = _ref.emitter;

    _classCallCheck(this, HistoryAnimation);

    this.emitter = emitter;
    this.discussionWrapper = document.querySelector(".page-discussion");
    this.container = document.querySelector(".history__container");
    this.dates = document.querySelectorAll(".history__date");
    this.elements = document.querySelectorAll(".history-element__wrapper"); // InitAnimations is triggered in the history component, after the history elements are created
  }

  _createClass(HistoryAnimation, [{
    key: "initAnimations",
    value: function initAnimations() {
      var _this = this;

      this.elements = document.querySelectorAll(".history-element__wrapper");

      _gsap["default"].set(this.elements, {
        opacity: 0,
        y: 50
      });

      _ScrollTrigger.ScrollTrigger.create({
        trigger: this.container,
        scroller: this.discussionWrapper,
        start: "top center",
        end: "bottom-=49% center",
        invalidateOnRefresh: true,
        // Ensures correct positioning on resize
        onLeave: function onLeave() {
          _this.hideElements();
        },
        onEnterBack: function onEnterBack() {
          _this.showElements();
        }
      });
    }
  }, {
    key: "showElements",
    value: function showElements() {
      this.elements = document.querySelectorAll(".history-element__wrapper");

      var tl = _gsap["default"].timeline({
        "default": {
          duration: 0.4,
          ease: _gsap.Power3.easeOut
        }
      });

      _gsap["default"].fromTo(this.elements, {
        opacity: 0,
        y: 50
      }, {
        opacity: 1,
        y: 0,
        delay: 0.4,
        stagger: 0.05
      });
    }
  }, {
    key: "hideElements",
    value: function hideElements() {
      _gsap["default"].to(this.elements, {
        opacity: 0,
        y: 50,
        duration: 0.05,
        stagger: 0.05,
        ease: _gsap.Power3.easeOut
      });
    }
  }]);

  return HistoryAnimation;
}();

exports["default"] = HistoryAnimation;