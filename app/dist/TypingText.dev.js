"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _anim = _interopRequireWildcard(require("./utils/anim.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TypingText =
/*#__PURE__*/
function () {
  function TypingText(_ref) {
    var text = _ref.text,
        container = _ref.container,
        backgroundColor = _ref.backgroundColor,
        marginLeft = _ref.marginLeft;

    _classCallCheck(this, TypingText);

    this.text = text;
    this.container = container;
    this.backgroundColor = backgroundColor;
    this.marginLeft = marginLeft;
    this.init();
  }

  _createClass(TypingText, [{
    key: "init",
    value: function init() {
      var textContainer = this.container.querySelector(".text__container");

      if (!textContainer) {
        textContainer = document.createElement("div");
        textContainer.className = "text__container";
        this.container.appendChild(textContainer);
      }

      this.typingContainer = document.createElement("div");
      this.maskEl = document.createElement("div");
      this.logo = document.createElement("div");
      var imgEl = document.createElement("img");
      imgEl.setAttribute("src", "./images/asterizk_blue.svg");
      this.logo.appendChild(imgEl);
      this.textEl = document.createElement("p");
      this.maskEl.classList.add("typing__mask");
      this.logo.classList.add("typing__logo");
      this.textEl.classList.add("typing__text");
      this.textEl.textContent = this.text;
      this.typingContainer.style.left = "".concat(this.marginLeft, "px");
      this.maskEl.appendChild(this.logo);
      this.textEl.appendChild(this.maskEl);
      this.typingContainer.appendChild(this.textEl);
      textContainer.appendChild(this.typingContainer);
    }
  }, {
    key: "updateText",
    value: function updateText(text) {
      this.textEl.textContent = text;
      this.textEl.appendChild(this.maskEl);
    }
  }, {
    key: "fadeIn",
    value: function fadeIn() {
      this.typingContainer.style.visibility = "visible";
      this.typingContainer.style.opacity = 1;
    }
  }, {
    key: "fadeOut",
    value: function fadeOut() {
      return regeneratorRuntime.async(function fadeOut$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap((0, _anim.asyncAnim)(this.typingContainer, [{
                opacity: 1
              }, {
                opacity: 0
              }]));

            case 2:
              this.typingContainer.style.display = "none";

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }]);

  return TypingText;
}();

exports["default"] = TypingText;