"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Navbar =
/*#__PURE__*/
function () {
  function Navbar(_ref) {
    var user = _ref.user;

    _classCallCheck(this, Navbar);

    this.user = user;
    this.headerNav = document.querySelector(".header-nav");
    console.log(this.headerNav);
    this.userPicture = this.headerNav.querySelector(".user-logo img");
    console.log(this.userPicture);
    this.addListeners();
    this.setUserImage();
  }

  _createClass(Navbar, [{
    key: "setUserImage",
    value: function setUserImage() {
      this.userPicture.src = this.user.picture;
    }
  }, {
    key: "addListeners",
    value: function addListeners() {}
  }]);

  return Navbar;
}();

exports["default"] = Navbar;