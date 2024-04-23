"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireDefault(require("gsap"));

var _ScrollTrigger = _interopRequireDefault(require("gsap/ScrollTrigger"));

var _getImageOrientation = _interopRequireDefault(require("../utils/getImageOrientation"));

var _isMobile = _interopRequireDefault(require("../utils/isMobile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_gsap["default"].registerPlugin(_ScrollTrigger["default"]);

var Slider =
/*#__PURE__*/
function () {
  function Slider(_ref) {
    var _this = this;

    var emitter = _ref.emitter,
        pageEl = _ref.pageEl;

    _classCallCheck(this, Slider);

    this.emitter = emitter; // Containers

    this.sliderEl = document.querySelector(".slider");
    this.sliderContentEl = this.sliderEl.querySelector(".slider__content");
    this.sliderContentQuestionsWrapperEl = this.sliderEl.querySelector(".slider__contentQuestionsWrapper");
    this.sliderContentQuestionsEl = this.sliderEl.querySelector(".slider__contentQuestions"); // Buttons

    this.nextBtn = this.sliderEl.querySelector(".slider__next");
    this.prevBtn = this.sliderEl.querySelector(".slider__prev");
    this.clostBtn = this.sliderEl.querySelector(".slider__close");
    this.questionsBtn = this.sliderEl.querySelector(".slider__questions"); // Other DOM elements

    this.iconBadge = this.sliderEl.querySelector(".icon-badge");
    this.navbarEl = document.querySelector(".nav");
    this.inputEl = pageEl.querySelector(".input__wrapper");
    this.inputTextEl = this.inputEl.querySelector(".input-text__expand");
    this.selectedCounter = null; // set in open questions slider

    this.imgs = [];
    this.imgsSelected = [];
    this.questionsImgs = [];
    this.currentIndex = 0;
    this.gap = 24;
    this.emitter.on("slider:open", function (data) {
      return _this.open(data);
    });
    this.emitter.on("slider:addImg", function (img) {
      return _this.addImg({
        img: img
      });
    });
    this.emitter.on("slider:goTo", function (_ref2) {
      var index = _ref2.index;
      return _this.goTo({
        index: index
      });
    });
    this.emitter.on("slider:close", function () {
      return _this.close();
    });
    this.addListeners();
  }

  _createClass(Slider, [{
    key: "checkButtons",
    value: function checkButtons() {
      this.nextBtn.style.visibility = this.imgs.length > 1 ? "visible" : "hidden";
      this.prevBtn.style.visibility = this.imgs.length > 1 ? "visible" : "hidden";
      this.nextBtn.disabled = this.currentIndex === this.imgs.length - 1;
      this.prevBtn.disabled = this.currentIndex === 0;
    }
  }, {
    key: "updateIndex",
    value: function updateIndex() {
      var _this$sliderContentEl = this.sliderContentEl,
          scrollLeft = _this$sliderContentEl.scrollLeft,
          offsetWidth = _this$sliderContentEl.offsetWidth;
      var index = Math.round(scrollLeft / offsetWidth);

      if (index !== this.currentIndex) {
        this.currentIndex = index;
        this.checkButtons();
      }
    }
  }, {
    key: "onScroll",
    value: function onScroll() {
      this.updateIndex();
    }
  }, {
    key: "goTo",
    value: function goTo() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          index = _ref3.index,
          _ref3$immediate = _ref3.immediate,
          immediate = _ref3$immediate === void 0 ? false : _ref3$immediate;

      this.sliderContentEl.scrollTo({
        left: index * this.sliderContentEl.offsetWidth,
        behavior: immediate ? "auto" : "smooth"
      });
    }
  }, {
    key: "open",
    value: function open() {
      var _this2 = this;

      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$imgs = _ref4.imgs,
          imgs = _ref4$imgs === void 0 ? [] : _ref4$imgs,
          _ref4$currentIndex = _ref4.currentIndex,
          currentIndex = _ref4$currentIndex === void 0 ? 0 : _ref4$currentIndex,
          _ref4$allPage = _ref4.allPage,
          allPage = _ref4$allPage === void 0 ? true : _ref4$allPage;

      this.sliderContentEl.innerHTML = "";
      this.emitter.emit("input:updateImages", []);
      imgs.forEach(function (img, i) {
        _this2.addImg({
          img: img,
          container: _this2.sliderContentEl
        });
      });
      this.navbarEl.classList.add("hidden");
      this.sliderEl.classList.add("show");

      if (allPage) {
        this.sliderEl.classList.add("all-page");
      }

      this.goTo({
        index: currentIndex,
        immediate: true
      });
      this.checkButtons();
    }
  }, {
    key: "openImageQuestions",
    value: function openImageQuestions() {
      var _this3 = this;

      this.emitter.emit("input:toWrite", {
        type: "imageQuestions",
        placeholder: "Ask a question about images",
        focus: !(0, _isMobile["default"])()
      });
      this.leftGutter = document.createElement("div");
      this.leftGutter.className = "slider__gutter slider__left-gutter";
      this.sliderContentQuestionsEl.appendChild(this.leftGutter);
      this.selectedCounter = document.createElement("div");
      this.selectedCounter.className = "slider__selected-counter";
      this.selectedCounter.innerHTML = "Images Selected <span class=\"selected-counter empty\">0</span> of ".concat(this.imgs.length);
      this.sliderContentQuestionsWrapperEl.appendChild(this.selectedCounter);
      this.imgs.forEach(function (img, i) {
        _this3.addImg({
          img: img,
          type: "questions"
        });
      });
      this.rightGutter = document.createElement("div");
      this.rightGutter.className = "slider__gutter slider__right-gutter";
      this.sliderContentQuestionsEl.appendChild(this.rightGutter);
      var firstImg = this.questionsImgs[0].querySelector("img"); // Wait for the image to load

      firstImg.addEventListener("load", function (e) {
        _this3.setGutterWidth("left");

        _this3.questionsImgs.forEach(function (img) {
          img.classList.remove("hidden");
        });
      });
      this.sliderContentQuestionsWrapperEl.classList.add("show");
      var lastImg = this.questionsImgs[this.questionsImgs.length - 1].querySelector("img");
      lastImg.addEventListener("load", function () {
        _this3.setGutterWidth("right");
      }); // this.sliderEl.classList.remove("all-page");

      this.setMaxHeightInputText();
    }
  }, {
    key: "setGutterWidth",
    value: function setGutterWidth() {
      var gutter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "left";

      if (gutter === "left") {
        var leftGutterWidth = window.innerWidth < 560 ? 24 : (window.innerWidth - this.questionsImgs[0].offsetWidth) / 2 - this.gap;
        this.leftGutter.style.width = "".concat(leftGutterWidth, "px");
      } else if (gutter === "right") {
        var rightGutterWidth = window.innerWidth < 560 ? 24 : (window.innerWidth - this.questionsImgs[this.questionsImgs.length - 1].offsetWidth) / 2 - this.gap;
        this.rightGutter.style.width = "".concat(rightGutterWidth, "px");
      }
    }
  }, {
    key: "setMaxHeightInputText",
    value: function setMaxHeightInputText() {
      this.inputTextEl.classList.add("height-imageQuestions");
    }
  }, {
    key: "resetImageQuestions",
    value: function resetImageQuestions() {
      this.selectedCounter.remove();
      this.questionsImgs = [];
      this.sliderContentQuestionsEl.innerHTML = "";
      this.sliderContentQuestionsWrapperEl.classList.remove("show");
      this.inputTextEl.classList.remove("height-imageQuestions");
    }
  }, {
    key: "updateSelectedCounter",
    value: function updateSelectedCounter() {
      var selectCounterSpan = this.selectedCounter.querySelector(".selected-counter");
      selectCounterSpan.textContent = this.imgsSelected.length;

      if (this.imgsSelected.length > 0) {
        selectCounterSpan.classList.remove("empty");
      } else {
        selectCounterSpan.classList.add("empty");
      }
    }
  }, {
    key: "checkImagesSelected",
    value: function checkImagesSelected() {
      var imgsSelected = this.sliderContentQuestionsEl.querySelectorAll(".selected img");
      this.imgsSelected = _toConsumableArray(imgsSelected);
      this.updateSelectedCounter();
      this.emitter.emit("input:updateImages", this.imgsSelected);
    }
  }, {
    key: "addImg",
    value: function addImg(_ref5) {
      var _this4 = this;

      var img = _ref5.img,
          _ref5$type = _ref5.type,
          type = _ref5$type === void 0 ? null : _ref5$type;
      var imgContainer = document.createElement("div");
      imgContainer.className = "slider__img-container";
      imgContainer.classList.add("hidden");
      var imgCopy = img.cloneNode(true);
      var orientation = (0, _getImageOrientation["default"])(imgCopy);
      imgCopy.classList.add(orientation);
      imgContainer.appendChild(imgCopy);

      if (type == "questions") {
        // Add icon
        var iconBadgeCopy = this.iconBadge.cloneNode(true);
        iconBadgeCopy.classList.add("show");
        imgContainer.appendChild(iconBadgeCopy); // Add click listener

        imgContainer.addEventListener("click", function () {
          imgContainer.classList.toggle("selected");

          _this4.checkImagesSelected();
        });
        this.sliderContentQuestionsEl.appendChild(imgContainer);
        this.questionsImgs.push(imgContainer);
      } else {
        this.sliderContentEl.appendChild(imgContainer);
        this.imgs.push(img);
      }
    }
  }, {
    key: "next",
    value: function next() {
      if (this.currentIndex == this.imgs.length - 1) return;
      this.goTo({
        index: this.currentIndex + 1
      });
    }
  }, {
    key: "prev",
    value: function prev() {
      if (this.currentIndex == 0) return;
      this.goTo({
        index: this.currentIndex - 1
      });
    }
  }, {
    key: "close",
    value: function close() {
      this.imgs = [];
      this.navbarEl.classList.remove("hidden");
      this.sliderEl.classList.remove("show");
      this.resetImageQuestions();
    }
  }, {
    key: "addListeners",
    value: function addListeners() {
      var _this5 = this;

      this.sliderContentEl.addEventListener("scroll", function () {
        _this5.onScroll();
      });
      this.nextBtn.addEventListener("click", function () {
        _this5.next();
      });
      this.prevBtn.addEventListener("click", function () {
        _this5.prev();
      });
      this.clostBtn.addEventListener("click", function () {
        _this5.close();
      });
      this.questionsBtn.addEventListener("click", function () {
        _this5.openImageQuestions();
      }); // Resize

      window.addEventListener("resize", function () {
        _this5.setGutterWidth("left");

        _this5.setGutterWidth("right");
      });
    }
  }]);

  return Slider;
}();

exports["default"] = Slider;