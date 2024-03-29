"use strict";

var _Navbar = _interopRequireDefault(require("../components/Navbar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// [X] add new preferences page
// [] add link in navbar to go to preferences page
// [] make the preferences page integration
// [] handle responsiveness for preferences page
// [] set up logic for the search language
// []
var Settings =
/*#__PURE__*/
function () {
  function Settings() {
    _classCallCheck(this, Settings);

    // States
    this.languageSelected = ""; // DOM Elements
    // init

    this.initNavbar();
  }

  _createClass(Settings, [{
    key: "initNavbar",
    value: function initNavbar() {
      new _Navbar["default"]();
    }
  }]);

  return Settings;
}();

new Settings();