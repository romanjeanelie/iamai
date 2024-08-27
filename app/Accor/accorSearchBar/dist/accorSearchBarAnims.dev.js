"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireWildcard(require("gsap"));

var _Flip = _interopRequireDefault(require("gsap/Flip"));

var _ = require(".");

var _isMobile = _interopRequireDefault(require("../../utils/isMobile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_gsap["default"].registerPlugin(_Flip["default"]);

var AccorSearchBarAnims =
/*#__PURE__*/
function () {
  function AccorSearchBarAnims(state, updateState) {
    _classCallCheck(this, AccorSearchBarAnims);

    // States
    this.searchBarState = state;
    this.updateState = updateState; // Dom Elements

    this.navbar = document.querySelector(".accorNavbar__container");
    this.wrapper = document.querySelector(".accorSearchBar__wrapper");
    this.searchBar = document.querySelector(".accorSearchBar__container");
    this.searchBarFirstRow = document.querySelector(".accorSearchBar__mainBar-first-row");
    this.writeBtn = document.querySelector(".accorSearchBar__write-btn");
    this.advancedBtn = document.querySelector(".accorSearchBar__advanced-btn");
    this.standardBtn = document.querySelector(".accorSearchBar__standard-btn");
    this.actionBtn = document.querySelector(".accorSearchBar__action-btn");
    this.secondaryBarContainer = document.querySelector(".accorBar__secondaryBar");
    this.advancedBar = document.querySelector(".accorBar__advancedBar-wrapper");
    this.phoneBar = document.querySelector(".accorSearchBar__phoneBar");
    this.initSecondaryBar();
    this.addEventListener();
  } // Helper method to update the searchBarState and call the updateState function


  _createClass(AccorSearchBarAnims, [{
    key: "updateStateAndInvokeUpdate",
    value: function updateStateAndInvokeUpdate(newState) {
      this.searchBarState = newState;
      this.updateState(newState);
    }
  }, {
    key: "switchStateClass",
    value: function switchStateClass(state) {
      var _this$wrapper$classLi;

      if (this.searchBarState === state) return;
      this.updateStateAndInvokeUpdate(state); // handle action btn

      this.actionBtn.classList.remove("phone-btn");
      if (this.searchBarState !== _.STATES.TEXT_INPUT) this.actionBtn.classList.add("phone-btn"); // grab state

      var initialState = _Flip["default"].getState([this.searchBar, this.searchBarFirstRow]);

      (_this$wrapper$classLi = this.wrapper.classList).remove.apply(_this$wrapper$classLi, _toConsumableArray(Object.values(_.STATES)));

      this.wrapper.classList.add(state);

      var expandBtns = _gsap["default"].utils.toArray(".accorSearchBar__expand-btn");

      _gsap["default"].killTweensOf(".standard-input");

      _gsap["default"].set(".standard-input", {
        opacity: 0
      });

      _gsap["default"].set(".accorSearchBar__standardBtns-mobile", {
        opacity: 0
      }); // Animate from the initial state to the end state


      _Flip["default"].from(initialState, {
        duration: 0.4,
        ease: "power3.out",
        // absolute: isMobile() ? false : true,
        onStart: function onStart() {
          _gsap["default"].to(expandBtns, {
            opacity: 0,
            duration: 0.1
          });
        },
        onComplete: function onComplete() {
          _gsap["default"].to([".standard-input", expandBtns], {
            opacity: 1
          });

          if ((0, _isMobile["default"])()) _gsap["default"].to(".accorSearchBar__standardBtns-mobile", {
            opacity: 1
          });
        }
      });
    } // Transitions between states of main bar (minimized, text input, standard options)

  }, {
    key: "toMinimized",
    value: function toMinimized() {
      this.switchStateClass(_.STATES.MINIMIZED);
    }
  }, {
    key: "toTextInput",
    value: function toTextInput() {
      this.switchStateClass(_.STATES.TEXT_INPUT);
    }
  }, {
    key: "toStandardOptions",
    value: function toStandardOptions() {
      this.switchStateClass(_.STATES.STANDARD_OPTIONS);
    } // Transitions between states of secondary bar (advanced options, call)

  }, {
    key: "initSecondaryBar",
    value: function initSecondaryBar() {
      _gsap["default"].set(this.secondaryBarContainer, {
        y: 200
      });
    }
  }, {
    key: "animateSecondaryBar",
    value: function animateSecondaryBar(targetY, floor, callback) {
      var _this = this;

      this.navbar.classList.add("overflow-hidden");

      _gsap["default"].killTweensOf(this.searchBar);

      var tl = _gsap["default"].timeline({
        defaults: {
          ease: _gsap.Power3.easeOut
        }
      });

      tl.to([this.standardBtn, this.advancedBtn], {
        opacity: 0,
        duration: 0.1
      });
      tl.to(this.wrapper, {
        y: targetY,
        onComplete: function onComplete() {
          callback(floor);

          _this.navbar.classList.remove("overflow-hidden");
        }
      });
      tl.to([this.standardBtn, this.advancedBtn], {
        opacity: 1
      });
    }
  }, {
    key: "toSecondaryBar",
    value: function toSecondaryBar() {
      var _this2 = this;

      var floor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.savedState = this.searchBarState;
      if ((0, _isMobile["default"])()) this.toMinimized();
      this.animateSecondaryBar(-200 * floor, floor, function (floor) {
        if (floor === 2) {
          _this2.resetPhoneBar();

          _this2.advancedBar.classList.add("none");
        }
      });
    }
  }, {
    key: "fromSecondaryBar",
    value: function fromSecondaryBar() {
      var _this3 = this;

      var newState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.savedState;
      this.updateStateAndInvokeUpdate(newState);
      this.resetPhoneBar();
      this.animateSecondaryBar(0, null, function () {
        _this3.advancedBar.classList.add("none");

        _this3.phoneBar.classList.add("none");

        _this3.wrapper.style.transform = "none";
      });
    }
  }, {
    key: "toAdvanceOptions",
    value: function toAdvanceOptions() {
      this.advancedBar.classList.remove("none");
      this.toSecondaryBar();
      this.phoneBar.classList.add("absolute");
      this.updateStateAndInvokeUpdate(_.STATES.ADVANCED_OPTIONS);
    }
  }, {
    key: "toPhoneBar",
    value: function toPhoneBar() {
      this.phoneBar.classList.remove("none");
      this.toSecondaryBar(this.searchBarState === _.STATES.ADVANCED_OPTIONS ? 2 : 1);
      this.updateStateAndInvokeUpdate(_.STATES.CALL);
    }
  }, {
    key: "resetPhoneBar",
    value: function resetPhoneBar() {
      this.phoneBar.classList.remove("absolute");

      _gsap["default"].set(this.wrapper, {
        y: -200
      });
    }
  }, {
    key: "addEventListener",
    value: function addEventListener() {
      var _this4 = this;

      window.addEventListener("resize", function () {
        if (_this4.searchBarState === _.STATES.STANDARD_OPTIONS) {
          _gsap["default"].to([".accorSearchBar__standardBtns-mobile"], {
            opacity: 1
          });
        }
      });
    }
  }]);

  return AccorSearchBarAnims;
}();

exports["default"] = AccorSearchBarAnims;