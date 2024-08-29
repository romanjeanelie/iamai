"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = fadeByWord;

var _gsap = _interopRequireDefault(require("gsap"));

var _getMarked = _interopRequireDefault(require("./getMarked"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function fadeByWord(container, text) {
  var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var answerSpan = document.createElement("span");
  answerSpan.className = "AIanswer";
  container.appendChild(answerSpan);
  var md = (0, _getMarked["default"])();
  return new Promise(function (resolve) {
    var words = text.split(" ");
    var content = words.map(function (word) {
      return "<span class=\"AIword\">".concat(word, "</span>");
    }).join(" ");
    var markdownOutput = md.parseInline(content);
    answerSpan.innerHTML = markdownOutput;

    _gsap["default"].set(answerSpan.querySelectorAll(".AIword"), {
      opacity: 0,
      filter: "blur(1px)"
    });

    _gsap["default"].to(answerSpan.querySelectorAll(".AIword"), {
      filter: "blur(0px)",
      opacity: 1,
      duration: 0.25,
      stagger: 0.05,
      ease: "power1.in",
      onComplete: resolve
    });
  });
}