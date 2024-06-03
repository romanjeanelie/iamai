"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireWildcard(require("gsap"));

var _Flip = require("gsap/Flip");

var _ScrollTrigger = require("gsap/ScrollTrigger");

var _PopUp = _interopRequireDefault(require("./PopUp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_gsap["default"].registerPlugin(_Flip.Flip);

_gsap["default"].registerPlugin(_ScrollTrigger.ScrollTrigger);

var Herobanners =
/*#__PURE__*/
function () {
  function Herobanners(_ref) {
    var emitter = _ref.emitter;

    _classCallCheck(this, Herobanners);

    this.emitter = emitter; // States

    this.section = "dark"; // DOM Elements

    this.herobanners = document.querySelector(".herobanners__container");
    this.darkSection = document.querySelector(".herobanner__container.dark-section");
    this.lightSection = document.querySelector(".herobanner__container.light-section");
    this.scrollIndicator = document.querySelector(".herobanner__scroll-indicator-container");
    this.herobannerButtons = document.querySelectorAll(".herobanner__button"); // Init methods

    this.hideScrollIndicatorsOnScroll();
    this.addEvents();
  } // ---- hide scroll indicators when scrolling ----


  _createClass(Herobanners, [{
    key: "hideScrollIndicatorsOnScroll",
    value: function hideScrollIndicatorsOnScroll() {
      _gsap["default"].to(this.scrollIndicator, {
        opacity: 0,
        duration: 0.2,
        ease: _gsap.Power3.easeOut,
        scrollTrigger: {
          // scroller: ".page-phone__main-container",
          trigger: ".page-phone__main-container",
          toggleActions: "play none none reverse",
          start: "top+=5% top"
        }
      });
    } // ----- Transition between two sections -----

  }, {
    key: "animateScrollIndicators",
    value: function animateScrollIndicators() {
      var indicators = this.scrollIndicator.querySelectorAll(".herobanner__scroll-indicator");

      var initialState = _Flip.Flip.getState([indicators]);

      this.scrollIndicator.classList.remove("dark", "light");
      this.scrollIndicator.classList.add(this.section);

      _Flip.Flip.from(initialState, {
        duration: 0.4,
        ease: "power3.out"
      });
    }
  }, {
    key: "handleSwitchSections",
    value: function handleSwitchSections(e) {
      var maxScrollLeft = e.target.scrollWidth - e.target.clientWidth;
      var scrollValueNormalized = e.target.scrollLeft / maxScrollLeft;

      if (scrollValueNormalized > 0.5) {
        if (this.section === "light") return;
        this.section = "light";
        this.animateScrollIndicators();
      } else {
        if (this.section === "dark") return;
        this.section = "dark";
        this.animateScrollIndicators();
      }
    }
  }, {
    key: "handleClickScrollIndicator",
    value: function handleClickScrollIndicator() {
      var scrollValue = this.section === "dark" ? this.lightSection.offsetLeft : this.darkSection.offsetLeft;
      this.herobanners.scrollTo({
        left: scrollValue,
        behavior: "smooth",
        duration: 0.1
      });
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      var _this = this;

      this.herobannerButtons.forEach(function (button) {
        button.addEventListener("click", function (e) {
          new _PopUp["default"]({
            section: _this.section,
            emitter: _this.emitter
          });
        });
      });
      this.scrollIndicator.addEventListener("click", this.handleClickScrollIndicator.bind(this));
      this.herobanners.addEventListener("scroll", this.handleSwitchSections.bind(this));
    }
  }]);

  return Herobanners;
}();

exports["default"] = Herobanners;