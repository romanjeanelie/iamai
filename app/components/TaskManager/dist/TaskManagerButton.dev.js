"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = require("./index");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TaskManagerButton =
/*#__PURE__*/
function () {
  function TaskManagerButton() {
    _classCallCheck(this, TaskManagerButton);
  }

  _createClass(TaskManagerButton, [{
    key: "getButtonColor",
    value: function getButtonColor() {
      var _this = this;

      // order of priority for the color of the button
      var order = [_index.TASK_STATUSES.COMPLETED, _index.TASK_STATUSES.INPUT_REQUIRED, _index.TASK_STATUSES.IN_PROGRESS];

      var _loop = function _loop() {
        var status = _order[_i];

        // the first status found in the tasks array will be the color of the button
        if (_this.tasks.some(function (task) {
          return task.status.type === status;
        })) {
          if (status === _index.TASK_STATUSES.COMPLETED) {
            _this.button.classList.add("completed");
          } else {
            _this.button.classList.remove("completed");
          }

          return {
            v: _index.STATUS_COLORS[status]
          };
        }
      };

      for (var _i = 0, _order = order; _i < _order.length; _i++) {
        var _ret = _loop();

        if (_typeof(_ret) === "object") return _ret.v;
      }
    }
  }, {
    key: "initializeButton",
    value: function initializeButton() {
      this.button.classList.remove("hidden");
      this.updateButton();
    }
  }, {
    key: "updateButton",
    value: function updateButton() {
      this.button.innerHTML = this.tasks.length;
      this.button.style.backgroundColor = this.getButtonColor();
    }
  }, {
    key: "removeButton",
    value: function removeButton() {
      this.button.classList.add("hidden");
    }
  }, {
    key: "handleButton",
    value: function handleButton() {
      // only function to be called to deal with button
      if (this.tasks.length === 0) {
        this.removeButton();
      } else if (this.tasks.length === 1) {
        this.initializeButton();
      } else {
        this.updateButton();
      }
    }
  }]);

  return TaskManagerButton;
}();

exports["default"] = TaskManagerButton;