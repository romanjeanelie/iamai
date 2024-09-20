"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireWildcard(require("gsap"));

var _anim = _interopRequireDefault(require("../../utils/anim"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var InputAnimations =
/*#__PURE__*/
function () {
  function InputAnimations(_ref) {
    var pageEl = _ref.pageEl,
        emitter = _ref.emitter;

    _classCallCheck(this, InputAnimations);

    this.pageEl = pageEl;
    this.emitter = emitter; // Dom Elements

    this.inputEl = this.pageEl.querySelector(".input__container");
    this.inputFrontEl = this.inputEl.querySelector(".input__front");
    this.inputBackEl = this.inputEl.querySelector(".input__back");
    this.centerBtn = this.inputFrontEl.querySelector(".center-btn");
    this.frontCameraBtn = this.inputFrontEl.querySelector(".camera-btn");
    this.frontMicBtn = this.inputFrontEl.querySelector(".phone-btn");
    this.frontVideoBtn = this.inputFrontHeight = this.inputFrontEl.offsetHeight; // Write

    this.inputText = this.inputEl.querySelector(".input-text"); // Image

    this.inputImageContainer = this.inputEl.querySelector(".input__image--container");
    this.imageDroppedContainer = this.pageEl.querySelector(".image-dropped__container"); // Phone

    this.phoneWrapper = this.pageEl.querySelector(".phone__wrapper"); // Other dom elements

    this.cancelBtn = document.querySelector(".cancel-btn");
    this.logoEl = document.querySelector(".logo__main");
    this.logoMobileEl = document.querySelector(".logo__mobile");
    this.categoriesListEl = document.querySelector(".categories__list--container");
    this.carousselEl = document.querySelector(".caroussel__container");
    this.navbarEl = document.querySelector(".nav"); // Init methods

    this.initializeInputHidden();
  }

  _createClass(InputAnimations, [{
    key: "initializeInputHidden",
    value: function initializeInputHidden() {
      _gsap["default"].set(this.inputEl, {
        opacity: 0
      });
    }
  }, {
    key: "showInput",
    value: function showInput() {
      _gsap["default"].fromTo(this.inputEl, {
        yPercent: 200,
        opacity: 0
      }, {
        opacity: 1,
        yPercent: 0,
        duration: 0.75,
        ease: _gsap.Power3.easeOut
      });
    }
  }, {
    key: "hideInput",
    value: function hideInput() {
      _gsap["default"].to(this.inputEl, {
        opacity: 0,
        yPercent: 100,
        duration: 0.5,
        ease: _gsap.Power3.easeOut
      });
    } // Presets

  }, {
    key: "fadeInButtons",
    value: function fadeInButtons() {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
      var videoBtn = this.inputFrontEl.querySelector(".video-btn");

      _gsap["default"].to([this.frontCameraBtn, videoBtn, this.centerBtn], {
        opacity: 1,
        duration: duration / 1000,
        ease: _gsap.Power3.easeInOut,
        delay: delay / 1000
      });
    }
  }, {
    key: "fadeOutButtons",
    value: function fadeOutButtons() {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
      var videoBtn = this.inputFrontEl.querySelector(".video-btn");

      _gsap["default"].to([this.frontCameraBtn, videoBtn, this.centerBtn], {
        opacity: 0,
        duration: duration / 1000,
        ease: _gsap.Power3.easeInOut,
        delay: delay / 1000
      });
    }
  }, {
    key: "fadeInCategoriesAndCaroussel",
    value: function fadeInCategoriesAndCaroussel() {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      (0, _anim["default"])([this.categoriesListEl, this.carousselEl], [{
        opacity: 0
      }, {
        opacity: 1
      }], {
        delay: delay,
        duration: 500,
        fill: "forwards",
        ease: "ease-in-out"
      });
    }
  }, {
    key: "fadeOutCategoriesAndCaroussel",
    value: function fadeOutCategoriesAndCaroussel() {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      (0, _anim["default"])([this.categoriesListEl, this.carousselEl], [{
        opacity: 1
      }, {
        opacity: 0
      }], {
        delay: delay,
        duration: 500,
        fill: "forwards",
        ease: "ease-in-out"
      });
    }
  }, {
    key: "fadeOutLogo",
    value: function fadeOutLogo() {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      (0, _anim["default"])(this.logoEl, [{
        opacity: 1
      }, {
        opacity: 0
      }], {
        duration: delay + 300,
        fill: "forwards",
        ease: "ease-in-out"
      });
      (0, _anim["default"])(this.logoMobileEl, [{
        opacity: 0
      }, {
        opacity: 1
      }], {
        delay: delay + 300,
        duration: 300,
        fill: "forwards",
        ease: "ease-in-out"
      });
    }
  }, {
    key: "fadeInLogo",
    value: function fadeInLogo() {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      (0, _anim["default"])(this.logoEl, [{
        opacity: 0
      }, {
        opacity: 1
      }], {
        delay: delay,
        duration: 300,
        fill: "forwards",
        ease: "ease-in-out"
      });
      (0, _anim["default"])(this.logoMobileEl, [{
        opacity: 1
      }, {
        opacity: 0
      }], {
        delay: delay,
        duration: 300,
        fill: "forwards",
        ease: "ease-in-out"
      });
    }
  }, {
    key: "collapseHeightInputFront",
    value: function collapseHeightInputFront() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$delay = _ref2.delay,
          delay = _ref2$delay === void 0 ? 0 : _ref2$delay,
          _ref2$duration = _ref2.duration,
          duration = _ref2$duration === void 0 ? 400 : _ref2$duration;

      this.emitter.emit("input:collapseHeight");
      return (0, _anim["default"])(this.inputFrontEl, [{
        height: "110px",
        opacity: 1
      }, {
        height: "".concat(this.inputFrontHeight, "px"),
        opacity: 1
      }], {
        delay: delay,
        duration: duration,
        fill: "forwards",
        ease: "ease-in-out"
      });
    }
  }, {
    key: "expandHeightInputFront",
    value: function expandHeightInputFront() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$delay = _ref3.delay,
          delay = _ref3$delay === void 0 ? 0 : _ref3$delay,
          _ref3$duration = _ref3.duration,
          duration = _ref3$duration === void 0 ? 250 : _ref3$duration,
          _ref3$heighTarget = _ref3.heighTarget,
          heighTarget = _ref3$heighTarget === void 0 ? 100 : _ref3$heighTarget;

      this.emitter.emit("input:expandHeight");
      return (0, _anim["default"])(this.inputFrontEl, [{
        height: "".concat(this.inputFrontHeight, "px"),
        opacity: 1
      }, {
        height: "".concat(heighTarget, "px"),
        opacity: 1
      }], {
        delay: delay,
        duration: duration,
        fill: "forwards",
        ease: "ease-in-out"
      });
    }
  }, {
    key: "expandWidthInputFront",
    value: function expandWidthInputFront() {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$delay = _ref4.delay,
          delay = _ref4$delay === void 0 ? 0 : _ref4$delay,
          _ref4$duration = _ref4.duration,
          duration = _ref4$duration === void 0 ? 400 : _ref4$duration;

      return (0, _anim["default"])(this.inputFrontEl, [{
        width: "".concat(this.inputFrontHeight, "px")
      }, {
        width: "100%"
      }], {
        delay: delay,
        duration: duration,
        ease: "ease-in-out",
        fill: "forwards"
      });
    }
  }, {
    key: "fadeInInputFront",
    value: function fadeInInputFront() {
      var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref5$delay = _ref5.delay,
          delay = _ref5$delay === void 0 ? 0 : _ref5$delay,
          _ref5$duration = _ref5.duration,
          duration = _ref5$duration === void 0 ? 400 : _ref5$duration;

      return (0, _anim["default"])(this.inputFrontEl, [{
        opacity: 0
      }, {
        opacity: 1
      }], {
        delay: delay,
        duration: duration,
        ease: "ease-in-out",
        fill: "forwards"
      });
    }
    /**
     * Initial
     */

  }, {
    key: "toInitial",
    value: function toInitial() {
      var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref6$delay = _ref6.delay,
          delay = _ref6$delay === void 0 ? 0 : _ref6$delay,
          _ref6$animButtons = _ref6.animButtons,
          animButtons = _ref6$animButtons === void 0 ? true : _ref6$animButtons,
          _ref6$animBottom = _ref6.animBottom,
          animBottom = _ref6$animBottom === void 0 ? true : _ref6$animBottom,
          _ref6$animLogo = _ref6.animLogo,
          animLogo = _ref6$animLogo === void 0 ? true : _ref6$animLogo;

      this.inputFrontEl.style.pointerEvents = "auto";
      this.inputEl.style.overflow = "visible";
    }
  }, {
    key: "fromRecordAudioToInitial",
    value: function fromRecordAudioToInitial() {
      this.inputFrontEl.style.pointerEvents = "auto";
      this.inputBackEl.style.pointerEvents = "none";
      this.fadeInButtons(1000);
      this.fadeInCategoriesAndCaroussel(1000);
      this.fadeInLogo(1000);
    }
    /**
     * Write
     */

  }, {
    key: "toWrite",
    value: function toWrite() {
      var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref7$delay = _ref7.delay,
          delay = _ref7$delay === void 0 ? 0 : _ref7$delay,
          _ref7$animButtons = _ref7.animButtons,
          animButtons = _ref7$animButtons === void 0 ? true : _ref7$animButtons,
          _ref7$animLogos = _ref7.animLogos,
          animLogos = _ref7$animLogos === void 0 ? true : _ref7$animLogos,
          _ref7$placeholder = _ref7.placeholder,
          placeholder = _ref7$placeholder === void 0 ? "" : _ref7$placeholder,
          _ref7$focus = _ref7.focus,
          focus = _ref7$focus === void 0 ? true : _ref7$focus;

      console.log("TO WRITE");
      this.inputText.placeholder = placeholder; // this.inputEl.style.overflow = "hidden";
    }
    /**
     * Phone
     */

  }, {
    key: "toStartPhoneRecording",
    value: function toStartPhoneRecording() {
      this.inputEl.classList.add("hidden");
      this.phoneWrapper.classList.add("show");
    }
  }, {
    key: "toStopPhoneRecording",
    value: function toStopPhoneRecording() {
      var _this = this;

      var fadeOutphoneWrapper = (0, _anim["default"])(this.phoneWrapper, [{
        opacity: 1,
        transform: "translateY(0px)"
      }, {
        topacity: 0,
        transform: "translateY(100%)"
      }], {
        duration: 150,
        ease: "ease-in-out",
        fill: "forwards"
      });

      fadeOutphoneWrapper.onfinish = function () {
        var fadeInIput = (0, _anim["default"])(_this.inputEl, [{
          opacity: 0,
          transform: "translateY(100%)"
        }, {
          topacity: 1,
          transform: "translateY(0)"
        }], {
          duration: 300,
          ease: "ease-in-out",
          fill: "forwards"
        });
        fadeOutphoneWrapper.cancel();

        _this.inputEl.classList.remove("hidden");

        _this.phoneWrapper.classList.remove("show");

        fadeInIput.onfinish = function () {
          fadeInIput.cancel();
        };
      };
    }
    /**
     * Image
     */

  }, {
    key: "toDragImage",
    value: function toDragImage() {
      var _this2 = this;

      var _ref8 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref8$animBottom = _ref8.animBottom,
          animBottom = _ref8$animBottom === void 0 ? true : _ref8$animBottom,
          _ref8$delay = _ref8.delay,
          delay = _ref8$delay === void 0 ? 0 : _ref8$delay;

      // Prvent break lines when we enter url
      this.inputText.disabled = true;
      this.imageDroppedContainer.classList.remove("visible");
      setTimeout(function () {
        _this2.frontCameraBtn.classList.add("active-imagedrop");

        _this2.inputImageContainer.classList.add("show");
      }, delay);

      if (animBottom) {
        this.fadeOutCategoriesAndCaroussel(0, 500);
      }
    }
  }, {
    key: "leaveDragImage",
    value: function leaveDragImage() {
      var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref9$animBottom = _ref9.animBottom,
          animBottom = _ref9$animBottom === void 0 ? true : _ref9$animBottom;

      this.frontCameraBtn.classList.remove("active-imagedrop");
      this.inputImageContainer.classList.remove("show");
      this.fadeInButtons();

      if (animBottom) {
        this.fadeInCategoriesAndCaroussel(0, 500);
      }
    }
  }, {
    key: "toImageDroped",
    value: function toImageDroped() {
      this.inputText.disabled = false;
      this.inputImageContainer.classList.remove("show");
      this.fadeOutButtons(0, 0);
      var step1 = (0, _anim["default"])(this.inputFrontEl, [{
        width: "".concat(this.inputFrontHeight, "px"),
        offset: 0.45
      }, {
        width: "".concat(this.inputFrontHeight, "px"),
        offset: 1
      }], {
        duration: 800,
        fill: "forwards",
        ease: "ease-out"
      });
      this.fadeInButtons(1000, 500);
      this.animCircleYoyo = (0, _anim["default"])(this.inputFrontEl, [{
        opacity: 1
      }, {
        opacity: 0
      }, {
        opacity: 1
      }], {
        delay: step1.effect.getComputedTiming().duration,
        duration: 400,
        iterations: Infinity,
        ease: "ease-in-out"
      });
    }
  }, {
    key: "toImageAnalyzed",
    value: function toImageAnalyzed() {
      // this.cancelBtn.classList.add("show");
      // this.cancelBtn.classList.add("image-drop");
      this.navbarEl.classList.add("hidden");
      this.animCircleYoyo.cancel();
      var step3 = this.fadeInInputFront({
        delay: 0,
        duration: 300
      });
      this.expandWidthInputFront({
        delay: step3.effect.getComputedTiming().duration + 500,
        duration: 250
      });
      this.toWrite({
        delay: 1200,
        animButtons: false,
        animLogos: false,
        placeholder: "Ask a question about the image"
      });
      this.imageDroppedContainer.classList.add("visible");
    }
  }, {
    key: "toRemoveImage",
    value: function toRemoveImage() {
      this.imageDroppedContainer.classList.remove("visible"); // this.cancelBtn.classList.remove("show");
      // this.cancelBtn.classList.remove("image-drop");

      this.navbarEl.classList.remove("hidden");
      this.toInitial({
        animLogo: false
      });
    }
  }, {
    key: "toImageReset",
    value: function toImageReset() {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.animCircleYoyo.cancel();
      var step1 = this.fadeInInputFront({
        delay: 0,
        duration: 300
      });
      var step2 = this.expandWidthInputFront({
        delay: step1.effect.getComputedTiming().duration + 500,
        duration: 250
      });
      this.fadeInButtons(step1.effect.getComputedTiming().duration + step2.effect.getComputedTiming().duration + 500, delay);
    }
  }]);

  return InputAnimations;
}();

exports["default"] = InputAnimations;