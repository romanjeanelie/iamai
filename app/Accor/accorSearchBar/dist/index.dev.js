"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireDefault(require("gsap"));

var _Flip = _interopRequireDefault(require("gsap/Flip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
    this.callBtn = document.querySelector(".accorSearchBar__phone-btn");
    this.advancedBtn = document.querySelector(".accorSearchBar__advanced-btn"); // Init

    this.addEventListener();
  }

  _createClass(AccorSearchBar, [{
    key: "switchStateClass",
    value: function switchStateClass(state) {
      console.log();
      this.searchBarState = state;
      this.wrapper.className = "accorNavbar__item accorSearchBar__wrapper ".concat(state);
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
    key: "addEventListener",
    value: function addEventListener() {
      var _this = this;

      this.writeBtn.addEventListener("click", this.toTextInput.bind(this));
      this.expandBtn.addEventListener("click", function () {
        if (_this.searchBarState !== STATES.STANDARD_OPTIONS) {
          _this.toStandardOptions();
        } else {
          _this.toMinimized();
        }
      });
      document.addEventListener("click", function (event) {
        if (!_this.searchBar.contains(event.target)) {
          _this.toMinimized();
        }
      });
    }
  }]);

  return AccorSearchBar;
}();

exports["default"] = AccorSearchBar;