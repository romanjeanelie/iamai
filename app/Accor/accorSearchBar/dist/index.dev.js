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

    this.searchBar = document.querySelector(".accorSearchBar__container");
    this.writeBtn = document.querySelector(".accorSearchBar__write-btn");
    this.expandBtn = document.querySelector(".accorSearchBar__expand-btn");
    this.callBtn = document.querySelector(".accorSearchBar__phone-btn");
    this.advancedBtn = document.querySelector(".accorSearchBar__advanced-btn"); // Init

    this.addEventListener();
  }

  _createClass(AccorSearchBar, [{
    key: "addEventListener",
    value: function addEventListener() {}
  }]);

  return AccorSearchBar;
}();

exports["default"] = AccorSearchBar;