"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WaitListForm =
/*#__PURE__*/
function () {
  function WaitListForm() {
    _classCallCheck(this, WaitListForm);

    // States
    this.isRequiredValid = false; // DOM Elements

    this.form = document.querySelector(".divwaitlistform");
    this.inputs = document.querySelectorAll("input, textarea");
    this.button = this.form.querySelector(".btnsave");
    this.handleActive();
    this.handleValidation();
  }

  _createClass(WaitListForm, [{
    key: "handleSubmitButton",
    value: function handleSubmitButton() {
      if (this.isRequiredValid) {
        this.button.classList.remove("inactive");
        this.button.classList.add("active");
      } else {
        this.button.classList.add("inactive");
        this.button.classList.remove("active");
      }
    }
  }, {
    key: "handleValidation",
    value: function handleValidation() {
      var _this = this;

      var requiredInputs = this.form.querySelectorAll("[required]");
      this.form.addEventListener("input", function () {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = requiredInputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var input = _step.value;
            var value = input.value.trim(); // Validate the input based on its type

            if (input.type === "text") {
              if (value.length <= 3) {
                _this.isRequiredValid = false;
                break;
              }
            } else if (input.type === "textarea") {
              if (value.length <= 5) {
                _this.isRequiredValid = false;
                break;
              }
            }

            _this.isRequiredValid = true;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        _this.handleSubmitButton();
      });
    }
  }, {
    key: "handleActive",
    value: function handleActive() {
      this.inputs.forEach(function (input) {
        var labelId = input.dataset.label;
        var label = document.querySelector("#".concat(labelId));
        if (!label) return; // Skip if label not found

        input.addEventListener("focus", function () {
          label.classList.add("active"); // optionnalLabel?.classList.add("hidden");
        });
        input.addEventListener("blur", function () {
          label.classList.remove("active"); // optionnalLabel?.classList.remove("hidden");
        });
      });
    }
  }]);

  return WaitListForm;
}();

exports["default"] = WaitListForm;