"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// BaseUI.js
var UIBase =
/*#__PURE__*/
function () {
  function UIBase() {
    _classCallCheck(this, UIBase);

    this.mainContainer = document.createElement("div");
    this.isClass = true;
  }

  _createClass(UIBase, [{
    key: "addAIText",
    value: function addAIText(text) {
      var answerContainer = document.createElement("div");
      answerContainer.innerHTML = text || "";
      this.mainContainer.appendChild(answerContainer);
    }
  }, {
    key: "getElement",
    value: function getElement() {
      return this.mainContainer;
    }
  }]);

  return UIBase;
}();

exports["default"] = UIBase;