"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _constants = require("../constants");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TaskManagerButton =
/*#__PURE__*/
function () {
  function TaskManagerButton(tasks, emitter) {
    _classCallCheck(this, TaskManagerButton);

    this.tasks = tasks;
    this.emitter = emitter;
    this.button = document.querySelector(".task-manager__button");
    this.addEventListeners();
  }

  _createClass(TaskManagerButton, [{
    key: "countRelevantTasks",
    value: function countRelevantTasks() {
      var relevantTasks = this.tasks.filter(function (task) {
        return task.status.type === _constants.API_STATUSES.ENDED || task.status.type === _constants.API_STATUSES.INPUT_REQUIRED;
      });
      return relevantTasks.length;
    }
  }, {
    key: "handleTaskButton",
    value: function handleTaskButton() {
      if (this.countRelevantTasks() > 0) {
        this.button.classList.remove("hidden");
      } else {
        this.button.classList.add("hidden");
      }

      this.updateButton();
    }
  }, {
    key: "updateButton",
    value: function updateButton() {
      this.button.innerHTML = this.countRelevantTasks();
    }
  }, {
    key: "hideButton",
    value: function hideButton() {
      this.button.classList.add("hidden");
    }
  }, {
    key: "showButton",
    value: function showButton() {
      this.button.classList.remove("hidden");
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      var _this = this;

      this.emitter.on("taskManager:updateStatus", function () {
        _this.handleTaskButton();
      });
      this.emitter.on("taskManager:taskRead", this.handleTaskButton.bind(this));
      this.emitter.on("Navigation:openTasks", this.hideButton.bind(this));
      this.emitter.on("Navigation:closeTasks", this.showButton.bind(this));
    }
  }]);

  return TaskManagerButton;
}();

exports["default"] = TaskManagerButton;