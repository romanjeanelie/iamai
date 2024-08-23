"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _text = require("../utils/text");

var _sortArrayFromMiddleToEnds = require("../utils/sortArrayFromMiddleToEnds");

var _anim = _interopRequireDefault(require("../utils/anim"));

var _colorsModule = require("../../scss/variables/_colors.module.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var texts = ["Book me a flight from Singapore to Kuala Lumpur on  flight from Singapore to Kuala Lumpur", "Book me a flight from Paris to Kuala Lumpur on  flight from Singapore to Kuala Lumpur", "Book me a flight from London to Kuala Lumpur on  flight from Singapore to Kuala Lumpur"];

function animMask(mask, translateXValue, isShow) {
  var transformStart = isShow ? "translateX(0%)" : "translateX(".concat(translateXValue, ")");
  var transformEnd = isShow ? "translateX(".concat(translateXValue, ")") : "translateX(0%)";
  return (0, _anim["default"])(mask, [{
    color: _colorsModule.backgroundColorBluePage,
    transform: transformStart,
    offset: 0
  }, {
    color: _colorsModule.colorMain,
    offset: 0.5
  }, {
    color: _colorsModule.colorMain,
    offset: 0.95
  }, {
    color: _colorsModule.backgroundColorBluePage,
    transform: transformEnd,
    offset: 1
  }, {
    opacity: 1
  }], {
    duration: 500,
    fill: "forwards",
    ease: "ease-in-out"
  });
}

var Caroussel =
/*#__PURE__*/
function () {
  function Caroussel() {
    _classCallCheck(this, Caroussel);

    console.log("Caroussel");
    this.carousselEl = document.querySelector(".caroussel__container");
    console.log(this.carousselEl);
    this.carousselTextEl = this.carousselEl.querySelector(".caroussel__text");
    console.log(this.carousselTextEl);
    this.nextBtn = this.carousselEl.querySelector("#btn-next");
    console.log(this.nextBtn);
    this.prevBtn = this.carousselEl.querySelector("#btn-prev");
    console.log(this.prevBtn);
    this.markerEl = this.carousselEl.querySelector(".caroussel__markers");
    console.log(this.markerEl);
  }

  _createClass(Caroussel, [{
    key: "init",
    value: function init() {
      this.currentIndex = 0;
      this.startAnimIndex = 0; // TEMP

      this.isComplete = false;
      this.addText();
      this.createMarkers();
      this.updateButtons();
      this.createLines();
      this.addListeners();
      this.showLines();
    }
  }, {
    key: "createMarkers",
    value: function createMarkers() {
      for (var i = 0; i < texts.length; i++) {
        var marker = document.createElement("span");
        marker.classList.add("marker");

        if (i === this.currentIndex) {
          marker.classList.add("active");
        }

        this.markerEl.appendChild(marker);
      }
    }
  }, {
    key: "addText",
    value: function addText() {
      this.carousselTextEl.innerHTML = "";
      this.carousselTextEl.textContent = texts[this.currentIndex];
    }
  }, {
    key: "createLines",
    value: function createLines() {
      this.splitLines = (0, _text.calculate)((0, _text.split)({
        element: this.carousselTextEl
      }));
      this.nbLines = this.splitLines.length;
      this.middleLineIndex = this.nbLines % 2 === 1 ? Math.floor(this.nbLines / 2) : null;
      this.carousselTextEl.innerHTML = "";
      this.linesEls = this.getLines(this.splitLines);
      this.linesSorted = (0, _sortArrayFromMiddleToEnds.sortArrayFromMiddleToEnds)(this.linesEls);
      this.addClasses();
      this.addMasks();
    }
  }, {
    key: "getLines",
    value: function getLines(splitLines) {
      var _this = this;

      return splitLines.map(function (line, i) {
        var lineContent = line.map(function (word) {
          return word.outerHTML;
        }).join(" ");
        var lineEl = document.createElement("div");
        lineEl.innerHTML = lineContent;

        _this.carousselTextEl.appendChild(lineEl);

        return lineEl;
      });
    }
  }, {
    key: "addClasses",
    value: function addClasses() {
      var _this2 = this;

      this.linesEls.forEach(function (line, i) {
        if (_this2.middleLineIndex !== null && i === _this2.middleLineIndex) {
          line.classList.add("caroussel__line--middle");
        } else {
          var isEven = (i - _this2.middleLineIndex) % 2 === 0;
          var className = isEven ? "caroussel__line--even" : "caroussel__line--odd";
          line.classList.add("caroussel__line");
          line.classList.add(className);
        }
      });
    }
  }, {
    key: "addMasks",
    value: function addMasks() {
      for (var i = 0; i < this.linesSorted.length;) {
        var line = this.linesSorted[i];

        if (line.classList.contains("caroussel__line--middle")) {
          var maskL = document.createElement("span");
          var maskR = document.createElement("span");
          maskL.classList.add("mask", "mask-left");
          maskR.classList.add("mask", "mask-right");
          maskL.textContent = "/";
          maskR.textContent = "/";
          line.appendChild(maskL);
          line.appendChild(maskR);
          i++;
        } else {
          var line1 = this.linesSorted[i];
          var line2 = this.linesSorted[i + 1];

          var _maskL = document.createElement("span");

          var _maskR = document.createElement("span");

          _maskL.classList.add("mask", "mask-left");

          _maskR.classList.add("mask", "mask-right");

          _maskL.textContent = "/";
          _maskR.textContent = "/";
          line2.appendChild(_maskL);
          line1.appendChild(_maskR);
          i += 2;
        }
      }
    }
  }, {
    key: "onHideComplete",
    value: function onHideComplete() {
      if (this.isComplete) return;
      this.isComplete = true;
      this.carousselTextEl.style.opacity = 0;
      this.addText();
      this.createLines();
      this.carousselTextEl.style.opacity = 1;
      this.updateMarkers();
      this.animLines(true);
    }
  }, {
    key: "onShowComplete",
    value: function onShowComplete() {
      this.startAnimIndex = 0;
      this.isAnimating = false;
    }
  }, {
    key: "animLines",
    value: function animLines(isShow) {
      var _this3 = this;

      if (this.startAnimIndex > this.nbLines - 1) {
        this.startAnimIndex = 0;

        if (isShow) {
          this.onShowComplete();
        } else {
          this.startAnimIndex = 0;
          this.onHideComplete();
        }

        return;
      }

      if (this.middleLineIndex !== null && this.startAnimIndex === 0) {
        var middleLine = this.linesSorted[this.startAnimIndex];
        var maskLeft = middleLine.querySelector(".mask-left");
        var maskRight = middleLine.querySelector(".mask-right");
        var animRight = animMask(maskRight, "100%", isShow);
        var animLeft = animMask(maskLeft, "-100%", isShow);

        animLeft.onfinish = function () {
          _this3.startAnimIndex = 1;

          _this3.animLines(isShow);
        };
      } else {
        var line1 = this.linesSorted[this.startAnimIndex];
        var line2 = this.linesSorted[this.startAnimIndex + 1];
        var mask1 = line1.querySelector(".mask");
        var mask2 = line2.querySelector(".mask");

        var _animRight = animMask(mask1, "100%", isShow);

        var _animLeft = animMask(mask2, "-100%", isShow);

        _animLeft.onfinish = function () {
          _this3.startAnimIndex += 2;

          _this3.animLines(isShow);
        };
      }
    }
  }, {
    key: "showLines",
    value: function showLines() {
      var maskEls = this.carousselTextEl.querySelectorAll(".mask");
      maskEls.forEach(function (mask) {
        if (mask.classList.contains("mask-left")) {
          mask.style.transform = "translateX(-100%)";
        } else {
          mask.style.transform = "translateX(100%)";
        }
      });
    }
  }, {
    key: "updateMarkers",
    value: function updateMarkers() {
      var markerEls = this.markerEl.querySelectorAll(".marker");
      markerEls.forEach(function (marker) {
        return marker.classList.remove("active");
      });
      markerEls[this.currentIndex].classList.add("active");
    }
  }, {
    key: "updateButtons",
    value: function updateButtons() {
      this.nextBtn.disabled = this.currentIndex === texts.length - 1;
      this.prevBtn.disabled = this.currentIndex === 0;
    }
  }, {
    key: "prev",
    value: function prev() {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.isComplete = false;
      this.currentIndex -= 1;
      this.updateButtons();
      this.animLines(false);
    }
  }, {
    key: "next",
    value: function next() {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.isComplete = false;
      this.currentIndex += 1;
      this.updateButtons();
      this.animLines(false);
    }
  }, {
    key: "addListeners",
    value: function addListeners() {
      var _this4 = this;

      this.nextBtn.addEventListener("click", function () {
        _this4.next();
      });
      this.prevBtn.addEventListener("click", function () {
        _this4.prev();
      });
    }
  }]);

  return Caroussel;
}();

exports["default"] = Caroussel;