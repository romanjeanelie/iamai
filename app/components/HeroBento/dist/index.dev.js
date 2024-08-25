"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireWildcard(require("gsap"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HeroBento =
/*#__PURE__*/
function () {
  function HeroBento(_ref) {
    var user = _ref.user,
        emitter = _ref.emitter;

    _classCallCheck(this, HeroBento);

    this.user = user;
    this.emitter = emitter; // States

    this.isDisplayed = true; // Dom Elements

    this.container = document.querySelector(".heroBentoGrid__container");
    this.name = this.container.querySelector(".name"); // Init

    this.setName();
    this.addEventListeners();
  }

  _createClass(HeroBento, [{
    key: "setName",
    value: function setName() {
      this.name.textContent = this.user.name;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.container.remove();
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      var _this = this;

      this.emitter.on("pre-text-animation", function () {
        if (!_this.isDisplayed) return;
        _this.isDisplayed = false;

        _gsap["default"].to(_this.container, {
          yPercent: -100,
          ease: _gsap.Power3.easeOut,
          duration: 1,
          onComplete: _this.destroy.bind(_this)
        });
      });
    }
  }]);

  return HeroBento;
}();

var _default = HeroBento;
exports["default"] = _default;