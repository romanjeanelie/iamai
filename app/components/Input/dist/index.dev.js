"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _InputImage = _interopRequireDefault(require("./InputImage"));

var _Phone = _interopRequireDefault(require("../Phone"));

var _TypingText = _interopRequireDefault(require("../../TypingText"));

var _minSecStr = _interopRequireDefault(require("../../utils/minSecStr"));

var _isMobile = _interopRequireDefault(require("../../utils/isMobile"));

var _AudioRecorder = _interopRequireDefault(require("../../AudioRecorder"));

var _InputAnimations = _interopRequireDefault(require("./InputAnimations"));

var _sendToWhisper = _interopRequireDefault(require("../../utils/audio/sendToWhisper"));

var _colorsModule = require("../../../scss/variables/_colors.module.scss");

var _InputVideo = _interopRequireDefault(require("./InputVideo"));

var _longPress = _interopRequireDefault(require("../../utils/longPress"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function isLetterKey(event) {
  console.log("event.key", event.key);
  console.log("event.key.length", event.key.length);
  var keyCode = event.keyCode; // return (keyCode >= 65 && keyCode <= 90); // Key codes for A-Z

  if (event.key.length === 1 && event.key.match(/[a-z]/i) && !event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey) return event.key;
}

var STATUS = {
  INITIAL: "INITIAL",
  RECORD_AUDIO: "RECORD_AUDIO",
  UPLOAD_IMAGE: "UPLOAD_IMAGE",
  IMAGE_QUESTION: "IMAGE_QUESTION",
  WRITE: "WRITE"
};

var Input =
/*#__PURE__*/
function () {
  function Input(_ref) {
    var _this = this;

    var pageEl = _ref.pageEl,
        isActive = _ref.isActive,
        toPageGrey = _ref.toPageGrey,
        discussion = _ref.discussion,
        emitter = _ref.emitter;

    _classCallCheck(this, Input);

    this.isActive = isActive;
    this.toPageGrey = toPageGrey;
    this.discussion = discussion;
    this.emitter = emitter;
    this.pageEl = pageEl;
    this.inputEl = this.pageEl.querySelector(".input__container");
    this.inputFrontEl = this.inputEl.querySelector(".input__front");
    this.inputBackEl = this.inputEl.querySelector(".input__back");
    this.submitBtn = this.inputBackEl.querySelector(".submit"); // Front input

    this.centerBtn = this.inputFrontEl.querySelector(".center-btn");
    this.frontCameraBtn = this.inputFrontEl.querySelector(".camera-btn");
    this.frontMicBtn = this.inputFrontEl.querySelector(".mic-btn");
    this.frontCenterBtn = this.inputFrontEl.querySelector(".center-btn");
    this.frontVideoBtn = this.inputFrontEl.querySelector(".video-btn"); // Image

    this.backCameraBtn = this.inputBackEl.querySelector(".camera-btn");
    this.closeInputImageBtn = this.pageEl.querySelector(".input__image--closeBtn");
    this.currentImages = [];
    this.inputImageEl = this.pageEl.querySelector(".input__image"); // Record

    this.audioRecorder = new _AudioRecorder["default"]({
      onComplete: this.onCompleteRecording.bind(this)
    });
    this.isRecordCanceled = false;
    this.recordCounter = this.pageEl.querySelector(".record-counter");
    this.backMicBtnContainer = this.inputBackEl.querySelector(".mic-btn__container");
    this.backMicBtn = this.backMicBtnContainer.querySelector(".mic-btn");
    this.backMicText = this.backMicBtnContainer.querySelector("p");
    this.isSmallRecording = false; // Write

    this.inputText = this.inputBackEl.querySelector(".input-text"); // Other DOM elements

    this.cancelBtn = document.body.querySelector(".cancel-btn");
    this.navbarEl = document.querySelector(".nav");
    this.onClickOutside = {
      stopAudio: false,
      animInitial: false
    };
    this.currentStatus = STATUS.INITIAL;
    this.isPageBlue = this.pageEl.classList.contains("page-blue"); // Anims

    this.anims = new _InputAnimations["default"]({
      pageEl: this.pageEl,
      emitter: this.emitter
    }); // Drop Image

    this.inputImage = new _InputImage["default"]({
      reset: function reset(delay) {
        return _this.anims.toImageReset(delay);
      },
      toImageDroped: function toImageDroped() {
        return _this.anims.toImageDroped();
      },
      toImageAnalyzed: function toImageAnalyzed() {
        return _this.anims.toImageAnalyzed();
      }
    }, {
      onImageUploaded: function onImageUploaded(img) {
        _this.currentImages.push(img);
      },
      onImageCancel: function onImageCancel() {
        _this.currentImages = [];

        _this.goToInitial({
          disableInput: false
        });
      }
    }, this.pageEl, this.emitter);
    this.inputVideo = new _InputVideo["default"](this.emitter); // Phone

    if (!this.isPageBlue) {
      this.phone = new _Phone["default"]({
        pageEl: this.pageEl,
        discussion: this.discussion,
        emitter: this.emitter,
        anims: {
          toStartPhoneRecording: function toStartPhoneRecording() {
            return _this.anims.toStartPhoneRecording();
          },
          toStopPhoneRecording: function toStopPhoneRecording() {
            return _this.anims.toStopPhoneRecording();
          }
        }
      });
    }

    this.addListeners(); // Emitter

    this.emitter.on("input:toWrite", function (data) {
      if (data && data.type === "imageQuestions") {
        _this.toWrite({
          type: data.type
        });
      } else {
        _this.toWrite();
      }
    });
    this.emitter.on("input:updateImages", this.updateImages.bind(this)); // TEMP

    this.minTranscriptingTime = 1400; //ms

    this.textRecorded = "text recorded";

    if (this.isPageBlue) {
      this.toPageGrey();
    }
  } // Write


  _createClass(Input, [{
    key: "toWrite",
    value: function toWrite() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$delay = _ref2.delay,
          delay = _ref2$delay === void 0 ? 0 : _ref2$delay,
          _ref2$animButtons = _ref2.animButtons,
          animButtons = _ref2$animButtons === void 0 ? true : _ref2$animButtons,
          _ref2$animLogos = _ref2.animLogos,
          animLogos = _ref2$animLogos === void 0 ? true : _ref2$animLogos,
          _ref2$type = _ref2.type,
          type = _ref2$type === void 0 ? null : _ref2$type,
          _ref2$placeholder = _ref2.placeholder,
          placeholder = _ref2$placeholder === void 0 ? "" : _ref2$placeholder,
          _ref2$focus = _ref2.focus,
          focus = _ref2$focus === void 0 ? true : _ref2$focus;

      if (type === "imageQuestions") {
        if (this.currentStatus !== STATUS.UPLOAD_IMAGE) {
          this.anims.toWrite({
            delay: delay,
            animButtons: animButtons,
            animLogos: animLogos,
            placeholder: placeholder,
            focus: focus
          });
        }

        this.currentStatus = STATUS.IMAGE_QUESTION;
        return;
      }

      this.anims.toWrite({
        delay: delay,
        animButtons: animButtons,
        animLogos: animLogos,
        placeholder: placeholder
      });
      this.currentStatus = STATUS.WRITE;
      this.onClickOutside.animInitial = true;
    } // Audio

  }, {
    key: "startRecording",
    value: function startRecording() {
      var _this2 = this;

      this.isRecordCanceled = false;
      this.inputText.disabled = true;
      this.audioRecorder.startRecording();
      this.timecodeAudioEl = this.isSmallRecording ? this.backMicText : this.recordCounter;
      this.audioRecorder.onUpdate(function (sec) {
        var time = (0, _minSecStr["default"])(sec / 60 | 0) + ":" + (0, _minSecStr["default"])(sec % 60);
        _this2.timecodeAudioEl.textContent = time;
      });
    }
  }, {
    key: "stopRecording",
    value: function stopRecording() {
      this.audioRecorder.stopRecording();
    }
  }, {
    key: "onTranscripting",
    value: function onTranscripting() {
      this.typingText = new _TypingText["default"]({
        text: "Converting to text",
        container: this.inputFrontEl,
        backgroundColor: _colorsModule.colorMain,
        marginLeft: 16
      });
      this.typingText.writing({
        onComplete: this.typingText.fadeIn
      });
    }
  }, {
    key: "onCompleteTranscripting",
    value: function onCompleteTranscripting() {
      this.inputText.disabled = false;
      this.timecodeAudioEl.textContent = "00:00";
      this.inputText.value += this.textRecorded;
      this.updateInputHeight();

      if (this.isSmallRecording) {
        this.isSmallRecording = false;
        this.inputText.focus();
        this.inputText.setSelectionRange(this.inputText.value.length, this.inputText.value.length);
        return;
      }

      if (this.typingText) this.typingText.reverse();
      this.toWrite({
        delay: 1200,
        animButtons: false,
        animLogos: false
      });
    }
  }, {
    key: "onCompleteRecording",
    value: function onCompleteRecording(blob) {
      var _this3 = this;

      return regeneratorRuntime.async(function onCompleteRecording$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!this.isRecordCanceled) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              if (!this.discussion.Chat.autodetect) {
                _context.next = 8;
                break;
              }

              _context.next = 5;
              return regeneratorRuntime.awrap((0, _sendToWhisper["default"])(blob));

            case 5:
              this.textRecorded = _context.sent;
              _context.next = 11;
              break;

            case 8:
              _context.next = 10;
              return regeneratorRuntime.awrap((0, _sendToWhisper["default"])(blob, this.discussion.Chat.sourcelang));

            case 10:
              this.textRecorded = _context.sent;

            case 11:
              this.timeoutTranscripting = setTimeout(function () {
                _this3.onCompleteTranscripting();
              }, this.minTranscriptingTime);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "cancelRecord",
    value: function cancelRecord() {
      this.isRecordCanceled = true;
      this.onClickOutside.stopAudio = false;
      this.stopRecording();
      this.anims.toStopRecording();
      this.anims.fromRecordAudioToInitial();
    } // Images Questions

  }, {
    key: "updateImages",
    value: function updateImages(imgs) {
      this.currentImages = imgs;
    } // Submit

  }, {
    key: "onSubmit",
    value: function onSubmit(event) {
      event.preventDefault();
      console.log("ON SUBMIT FUNCTION : ", this.inputText.value);
      console.time("input");

      if (this.isPageBlue) {
        this.toPageGrey({
          duration: 1200
        });
      }

      if (this.currentStatus === STATUS.IMAGE_QUESTION) {
        this.emitter.emit("slider:close");
      }

      this.discussion.addUserElement({
        text: this.inputText.value,
        imgs: this.currentImages
      });
      this.inputText.value = "";
      this.currentImages = [];
      this.updateInputHeight();
      this.cancelBtn.classList.remove("show");
      this.navbarEl.classList.remove("hidden");

      if (this.inputImage.isEnabled) {
        this.inputImage.disable();
      }

      this.goToInitial({
        disableInput: false
      });
    }
  }, {
    key: "updateInputHeight",
    value: function updateInputHeight() {
      // Simulate input event to have split lines
      var event = new Event("input", {
        bubbles: true,
        cancelable: true
      });
      this.inputText.dispatchEvent(event);
    }
  }, {
    key: "goToInitial",
    value: function goToInitial() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$disableInput = _ref3.disableInput,
          disableInput = _ref3$disableInput === void 0 ? true : _ref3$disableInput;

      this.currentStatus = STATUS.INITIAL;
      this.anims.toInitial();
      this.onClickOutside.animInitial = false;

      if (disableInput) {
        this.inputText.disabled = false;
      }
    } // Listeners

  }, {
    key: "addListeners",
    value: function addListeners() {
      var _this4 = this;

      // Write
      this.centerBtn.addEventListener("click", function () {// this.toWrite();
      });
      document.addEventListener("keydown", function (event) {
        if (!_this4.isActive) return;
        if (!isLetterKey(event)) return;

        if (_this4.currentStatus === STATUS.INITIAL && !_this4.inputText.disabled) {
          _this4.toWrite();
        }
      }, {
        capture: true
      }); // Record

      if (this.frontMicBtn) this.frontMicBtn.addEventListener("click", function () {
        _this4.currentStatus = STATUS.RECORD_AUDIO;

        _this4.startRecording();

        _this4.anims.toStartRecording();

        _this4.onClickOutside.stopAudio = true;
      });
      this.cancelBtn.addEventListener("click", function () {
        if (_this4.currentStatus === STATUS.RECORD_AUDIO) {
          _this4.cancelRecord();
        }

        if (_this4.currentStatus === STATUS.UPLOAD_IMAGE) {
          _this4.anims.toRemoveImage();

          _this4.inputImage.disable();

          _this4.currentImages = [];
        }

        _this4.currentStatus = STATUS.INITIAL;
      });
      this.backMicBtn.addEventListener("click", function () {
        if (!_this4.isSmallRecording) {
          _this4.isSmallRecording = true;

          _this4.startRecording();

          _this4.backMicBtnContainer.classList.add("active");
        } else {
          _this4.stopRecording();

          _this4.backMicBtnContainer.classList.remove("active");
        }
      }); // Image

      this.frontCameraBtn.addEventListener("click", function () {
        _this4.currentStatus = STATUS.UPLOAD_IMAGE;

        _this4.inputImage.enable();

        _this4.anims.toDragImage();
      });
      this.backCameraBtn.addEventListener("click", function () {
        if (_this4.isSmallRecording) return;
        _this4.currentStatus = STATUS.UPLOAD_IMAGE;

        _this4.inputImage.enable();

        _this4.anims.toInitial({
          animBottom: false,
          animButtons: false
        });

        _this4.anims.toDragImage({
          animBottom: false,
          delay: 300
        });

        _this4.onClickOutside.animInitial = false;
      });
      this.closeInputImageBtn.addEventListener("click", function () {
        _this4.currentStatus = STATUS.INITIAL;

        _this4.inputImage.disable();

        _this4.anims.leaveDragImage();
      }); // Video

      this.longPress = new _longPress["default"](this.inputFrontEl, this.anims.displaySwipeInfo, this.anims.removeSwipeInfo, 200);
      this.frontVideoBtn.addEventListener("click", function () {
        _this4.emitter.emit("input:displayVideoInput");
      }); // Prevent input hidden by keyboard on mobile

      if ((0, _isMobile["default"])()) {
        this.inputImageEl.addEventListener("focus", function (e) {
          document.documentElement.style.overflow = "unset";
          window.scrollTo(0, document.body.scrollHeight);
        });
        this.inputImageEl.addEventListener("blur", function (e) {
          document.documentElement.style.overflow = "hidden";
          window.scrollTo(0, 0);
        });
      } // Click outside


      this.pageEl.addEventListener("click", function (event) {
        if (_this4.isSmallRecording) return;

        if (!_this4.inputEl.contains(event.target) && !_this4.cancelBtn.contains(event.target)) {
          if (_this4.onClickOutside.stopAudio) {
            _this4.stopRecording();

            _this4.anims.toStopRecording({
              onComplete: _this4.onTranscripting.bind(_this4)
            });

            _this4.onClickOutside.stopAudio = false;
          }

          if (_this4.onClickOutside.animInitial) {
            if (_this4.inputText.value) return;

            _this4.goToInitial();
          }
        }
      }, {
        capture: true
      }); // Input text

      this.inputText.addEventListener("focus", function () {
        _this4.submitBtn.disabled = !_this4.inputText.value.trim().length > 0;
      });
      this.inputText.addEventListener("input", function (event) {
        _this4.submitBtn.disabled = !_this4.inputText.value.trim().length > 0;
      });
      this.inputText.addEventListener("keydown", function (event) {
        if (_this4.inputText.value.trim().length > 0 && event.key === "Enter" && !event.shiftKey) {
          _this4.onSubmit(event);
        }
      });
      this.submitBtn.addEventListener("click", function (event) {
        return _this4.onSubmit(event);
      });
    }
  }]);

  return Input;
}();

exports["default"] = Input;