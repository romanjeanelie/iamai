"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _createImageFile = _interopRequireDefault(require("../../utils/createImageFile"));

var _uploadFiles = _interopRequireDefault(require("../../utils/uploadFiles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var InputImage =
/*#__PURE__*/
function () {
  function InputImage(anims, callbacks, pageEl, emitter) {
    _classCallCheck(this, InputImage);

    this.emitter = emitter; // DOM

    this.pageEl = pageEl;
    this.imageDroppedContainer = this.pageEl.querySelector(".image-dropped__container");
    this.dropImageOverlayEl = this.pageEl.querySelector(".image-drop-zone--overlay");
    this.inputFileUploadEl = this.pageEl.querySelector(".input__file-upload");
    this.inputImageEl = this.pageEl.querySelector(".input__image");
    this.closeBtnSlider = document.querySelector(".slider__close");
    this.anims = anims;
    this.callbacks = callbacks; //TEMP

    this.analizingImageMinTime = 1000; //ms

    this.isEnabled = false;
    this.imgs = [];
    this.addListeners();
  }

  _createClass(InputImage, [{
    key: "enable",
    value: function enable() {
      this.isEnabled = true;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.callbacks.onImageCancel();
      this.inputFileUploadEl.value = "";
      this.imageDroppedContainer.innerHTML = "";
      this.imageDroppedContainer.classList.remove("visible");
      this.emitter.emit("slider:close");
      this.isEnabled = false;
      this.imgs = [];
    }
  }, {
    key: "handleImageUpload",
    value: function handleImageUpload(imgFile) {
      var _this = this;

      var imgsUploaded;
      return regeneratorRuntime.async(function handleImageUpload$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.anims.toImageDroped();
              _context.next = 3;
              return regeneratorRuntime.awrap((0, _uploadFiles["default"])(imgFile));

            case 3:
              imgsUploaded = _context.sent;
              imgsUploaded.forEach(function (img) {
                _this.previewImage(img);
              });
              this.emitter.emit("input:updateImages");

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "addImageToSlider",
    value: function addImageToSlider(img) {
      if (this.imgs.length === 0) {
        this.emitter.emit("slider:open", {
          imgs: [img],
          currentIndex: 0,
          allPage: false
        });
      } else {
        this.emitter.emit("slider:addImg", img);
        this.emitter.emit("slider:goTo", {
          index: this.imgs.length + 1
        });
      }

      this.imgs.push(img);
      this.callbacks.onImageUploaded(img);
    }
  }, {
    key: "previewImage",
    value: function previewImage(src) {
      var _this2 = this;

      this.anims.toImageAnalyzed();
      var img = new Image();

      img.onload = function () {
        _this2.addImageToSlider(img);
      };

      img.src = src;
    }
  }, {
    key: "addListeners",
    value: function addListeners() {
      var _this3 = this;

      ["dragenter", "dragover", "dragleave", "drop"].forEach(function (e) {
        _this3.pageEl.addEventListener(e, prevDefault);
      });

      function prevDefault(e) {
        e.preventDefault();
        e.stopPropagation();
      } // Display the drop zone on drag over/enter


      ["dragenter", "dragover"].forEach(function (e) {
        _this3.pageEl.addEventListener(e, function () {
          if (!_this3.isEnabled) return;

          _this3.dropImageOverlayEl.classList.add("hovered");
        });
      }); // Remove the drop zone on drag leave/drop

      ["dragleave", "drop"].forEach(function (e) {
        _this3.pageEl.addEventListener(e, function () {
          if (!_this3.isEnabled) return;

          _this3.dropImageOverlayEl.classList.remove("hovered");
        });
      });
      this.pageEl.addEventListener("drop", function (e) {
        if (!_this3.isEnabled) return;
        var dataTrans = e.dataTransfer;
        var files = dataTrans.files;

        _this3.handleImageUpload(files);
      });
      this.inputFileUploadEl.addEventListener("change", function (e) {
        if (_this3.inputFileUploadEl.files && _this3.inputFileUploadEl.files[0]) {
          _this3.handleImageUpload(_this3.inputFileUploadEl.files);
        }
      });
      this.inputImageEl.addEventListener("keydown", function _callee(e) {
        var url, imgFile;
        return regeneratorRuntime.async(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(e.keyCode == 13)) {
                  _context2.next = 6;
                  break;
                }

                url = _this3.inputImageEl.value;
                _context2.next = 4;
                return regeneratorRuntime.awrap((0, _createImageFile["default"])(url));

              case 4:
                imgFile = _context2.sent;

                _this3.handleImageUpload(imgFile);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        });
      });
      this.closeBtnSlider.addEventListener("click", function (e) {
        if (!_this3.isEnabled) return;

        _this3.disable();
      });
    }
  }]);

  return InputImage;
}();

exports["default"] = InputImage;