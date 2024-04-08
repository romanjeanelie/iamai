"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _isMobile = _interopRequireDefault(require("../utils/isMobile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Navbar =
/*#__PURE__*/
function () {
  function Navbar() {
    _classCallCheck(this, Navbar);

    this.navEl = document.querySelector(".nav");
    this.navBtn = this.navEl.querySelector(".nav__btn");
    this.navList = this.navEl.querySelector(".nav__list");
    this.addListeners();
  }

  _createClass(Navbar, [{
    key: "addListeners",
    value: function addListeners() {
      var _this = this;

      this.navBtn.addEventListener("click", function () {
        _this.navList.classList.toggle("show");
      });
      this.navEl.addEventListener("mouseenter", function () {
        if ((0, _isMobile["default"])()) return;

        _this.navList.classList.add("show");
      });
      this.navEl.addEventListener("mouseleave", function () {
        if ((0, _isMobile["default"])()) return;

        _this.navList.classList.remove("show");
      });
    }
  }]);

  return Navbar;
}();

exports["default"] = Navbar;