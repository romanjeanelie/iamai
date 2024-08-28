"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = typeByWord;

var _getMarked = _interopRequireDefault(require("./getMarked"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function typeByWord(container, text) {
  var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var wordIndex = 0;
  var answerSpan = document.createElement("span");
  answerSpan.className = "AIanswer";
  container.appendChild(answerSpan); // const md = getRemarkable();

  var md = (0, _getMarked["default"])();
  return new Promise(function (resolve) {
    var words = text.split(" ");

    function type() {
      if (wordIndex < words.length) {
        var content;
        content = answerSpan.innerHTML + words[wordIndex];
        var markdownOutput = md.parseInline(content);
        answerSpan.innerHTML = markdownOutput + " ";
        wordIndex++; // Move to the next word

        setTimeout(type, timeout); // Call this function again after a delay to simulate typing speed
      } else {
        wordIndex = 0; // Reset the index for the next call

        resolve(); // Resolve the Promise
      }
    }

    type(); // Start the typing
  });
}