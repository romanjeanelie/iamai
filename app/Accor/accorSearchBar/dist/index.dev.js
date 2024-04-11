"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireWildcard(require("gsap"));

var _Flip = _interopRequireDefault(require("gsap/Flip"));

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

var STATES = {
  MINIMIZED: "minimized",
  TEXT_INPUT: "text-input",
  STANDARD_OPTIONS: "standard-options",
  ADVANCED_OPTIONS: "advanced-options",
  CALL: "call"
};

_gsap["default"].registerPlugin(_Flip["default"]);

var AccorSearchBar =
/*#__PURE__*/
function () {
  function AccorSearchBar() {
    _classCallCheck(this, AccorSearchBar);

    // States
    this.searchBarState = STATES.MINIMIZED; // Dom Elements

    this.wrapper = document.querySelector(".accorSearchBar__wrapper");
    this.searchBar = document.querySelector(".accorSearchBar__container");
    this.writeBtn = document.querySelector(".accorSearchBar__write-btn");
    this.expandBtn = document.querySelector(".accorSearchBar__expand-btn");
    this.callBtn = document.querySelector(".accorSearchBar__action-btn");
    this.advancedBtn = document.querySelector(".accorSearchBar__advanced-btn");
    this.standardBtn = document.querySelector(".accorSearchBar__standard-btn");
    this.actionBtn = document.querySelector(".accorSearchBar__action-btn");
    this.secondaryBarContainer = document.querySelector(".accorBar__secondaryBar");
    this.secondaryBarPhoneBtn = document.querySelector(".secondary-action-btn");
    console.log(this.secondaryBarPhoneBtn);
    this.advancedBar = document.querySelector(".accorBar__advancedBar-wrapper");
    this.phoneBar = document.querySelector(".accorSearchBar__phoneBar");
    this.phoneCloseBtn = document.querySelector(".accorSearchBar__phoneClose"); // Init

    this.initSecondaryBar();
    this.addEventListener();
  }

  _createClass(AccorSearchBar, [{
    key: "switchStateClass",
    value: function switchStateClass(state) {
      var _this$wrapper$classLi;

      this.searchBarState = state; // grab state

      var initialState = _Flip["default"].getState([this.searchBar, this.advancedBtn]);

      (_this$wrapper$classLi = this.wrapper.classList).remove.apply(_this$wrapper$classLi, _toConsumableArray(Object.values(STATES)));

      this.wrapper.classList.add(state);

      _gsap["default"].killTweensOf(".standard-input");

      _gsap["default"].set(".standard-input", {
        opacity: 0
      }); // Animate from the initial state to the end state


      _Flip["default"].from(initialState, {
        duration: 0.5,
        ease: "power3.out",
        absolute: true,
        onComplete: function onComplete() {
          _gsap["default"].to(".standard-input", {
            opacity: 1
          });
        }
      });
    }
  }, {
    key: "toMinimized",
    value: function toMinimized() {
      this.switchStateClass(STATES.MINIMIZED);
    }
  }, {
    key: "toTextInput",
    value: function toTextInput() {
      this.switchStateClass(STATES.TEXT_INPUT);
    }
  }, {
    key: "toStandardOptions",
    value: function toStandardOptions() {
      this.switchStateClass(STATES.STANDARD_OPTIONS);
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
    key: "toSecondaryBar",
    value: function toSecondaryBar() {
      var _this = this;

      var floor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      _gsap["default"].killTweensOf(this.searchBar);

      _gsap["default"].to(this.wrapper, {
        y: -200 * floor,
        onComplete: function onComplete() {
          if (floor === 2) {
            _this.resetPhoneBar();

            _this.advancedBar.classList.add("none");
          }
        }
      });
    }
  }, {
    key: "toAdvanceOptions",
    value: function toAdvanceOptions() {
      this.advancedBar.classList.remove("none");
      this.toSecondaryBar();
      this.phoneBar.classList.add("absolute");
      this.searchBarState = STATES.ADVANCED_OPTIONS;
    }
  }, {
    key: "toPhoneBar",
    value: function toPhoneBar() {
      this.phoneBar.classList.remove("none");
      this.toSecondaryBar(this.searchBarState === STATES.ADVANCED_OPTIONS ? 2 : 1);
      this.searchBarState = STATES.CALL;
    }
  }, {
    key: "fromSecondaryBar",
    value: function fromSecondaryBar() {
      var _this2 = this;

      _gsap["default"].to(this.wrapper, {
        y: 0,
        onComplete: function onComplete() {
          _this2.advancedBar.classList.add("none");

          _this2.phoneBar.classList.add("none");
        }
      });
    }
  }, {
    key: "initSecondaryBar",
    value: function initSecondaryBar() {
      _gsap["default"].set(this.secondaryBarContainer, {
        y: 200
      });
    }
  }, {
    key: "addEventListener",
    value: function addEventListener() {
      var _this3 = this;

      this.writeBtn.addEventListener("click", this.toTextInput.bind(this));
      this.expandBtn.addEventListener("click", function () {
        if (_this3.searchBarState !== STATES.STANDARD_OPTIONS) {
          _this3.toStandardOptions();
        } else {
          _this3.toMinimized();
        }
      });
      this.advancedBtn.addEventListener("click", this.toAdvanceOptions.bind(this));
      this.standardBtn.addEventListener("click", this.fromSecondaryBar.bind(this));
      this.actionBtn.addEventListener("click", function () {
        if (_this3.searchBarState === STATES.TEXT_INPUT) {// TO DO - SUBMIT THE INPUT VALUE (on submit function)
        } else {
          _this3.toPhoneBar();
        }
      });
      this.secondaryBarPhoneBtn.addEventListener("click", this.toPhoneBar.bind(this));
      this.phoneCloseBtn.addEventListener("click", this.fromSecondaryBar.bind(this));
      document.addEventListener("click", function (event) {
        if (!_this3.wrapper.contains(event.target)) {
          _this3.toMinimized();
        }
      });
    }
  }]);

  return AccorSearchBar;
}();

exports["default"] = AccorSearchBar;