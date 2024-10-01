"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _constants = require("../constants");

var _defaultValues;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultValues = (_defaultValues = {}, _defineProperty(_defaultValues, _constants.API_STATUSES.PROGRESSING, {
  label: "In progress",
  title: "searching",
  description: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore"
}), _defineProperty(_defaultValues, _constants.API_STATUSES.INPUT_REQUIRED, {
  label: "Input required",
  title: "question",
  description: "Flight for 18th Mar are all fully booked. Is there any other dates you would like to try for?"
}), _defineProperty(_defaultValues, _constants.API_STATUSES.ENDED, {
  label: "View results",
  description: "Here's your flights to Bali!"
}), _defineProperty(_defaultValues, _constants.API_STATUSES.VIEWED, {
  label: "View results",
  description: "Here's your flights to Bali!"
}), _defaultValues);

var TaskManagerDebug =
/*#__PURE__*/
function () {
  function TaskManagerDebug(taskManager) {
    var _this = this;

    _classCallCheck(this, TaskManagerDebug);

    this.taskManager = taskManager;
    this.gui = taskManager.gui;
    this.emitter = taskManager.emitter;
    this.debugTask = {
      name: "Task ".concat(this.taskManager.tasks.length + 1),
      key: this.taskManager.tasks.length + 1,
      createdAt: "2024-09-23T17:45:35.000Z"
    };
    this.taskNameController = this.gui.add(this.debugTask, "name").onChange(function (value) {
      _this.debugTask.name = value;
    });
    this.gui.add({
      addTask: function addTask() {
        return _this.addDebugTask();
      }
    }, "addTask"); // Adding button to increment the creation date by one day

    this.gui.add({
      incrementDate: function incrementDate() {
        return _this.incrementTaskDate();
      }
    }, "incrementDate");
  } // Method to increment the date of the task by one day


  _createClass(TaskManagerDebug, [{
    key: "incrementTaskDate",
    value: function incrementTaskDate() {
      var currentDate = new Date(this.debugTask.createdAt);
      currentDate.setDate(currentDate.getDate() + 1); // Increment the day by 1

      this.debugTask.createdAt = currentDate.toISOString(); // Update the task date
    }
  }, {
    key: "addDebugTask",
    value: function addDebugTask() {
      var _this2 = this;

      var task = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!task) {
        if (this.taskManager.tasks.length === 2) {
          this.debugTask.createdAt = "2024-09-24T17:45:35.000Z";
        }

        task = _objectSpread({}, this.debugTask, {
          status: _objectSpread({
            type: _constants.API_STATUSES.PROGRESSING
          }, defaultValues[_constants.API_STATUSES.PROGRESSING])
        });
      }

      var folder = this.gui.addFolder(task.name);
      folder.open();
      folder.add(task.status, "type", _constants.API_STATUSES).onChange(function (value) {
        var status = _objectSpread({
          type: value
        }, defaultValues[value]);

        titleController.setValue(task.status.title);
        descriptionController.setValue(task.status.description); // Update the status of the task UI

        if (value === _constants.API_STATUSES.ENDED) {
          var container = document.createElement("div");
          container.innerHTML = "Here's your flights to Bamako!";

          _this2.emitter.emit("taskManager:updateStatus", task.key, status, container);
        } else if (value === _constants.API_STATUSES.INPUT_REQUIRED) {
          var workflowID = "1234";

          _this2.emitter.emit("taskManager:updateStatus", task.key, status, null, workflowID);
        } else {
          _this2.emitter.emit("taskManager:updateStatus", task.key, status);
        }
      }); // Generate the new folders in the gui for the new task

      var titleController = folder.add(task.status, "title").onChange(function (value) {
        task.status.title = value;
      }).name("status title");
      var descriptionController = folder.add(task.status, "description").onChange(function (value) {
        task.status.description = value;
      }).name("status desc");
      folder.add({
        updateStatus: function updateStatus() {
          _this2.emitter.emit("taskManager:updateStatus", task.key, task.status);
        }
      }, "updateStatus");
      folder.add({
        deleteTask: function deleteTask() {
          _this2.emitter.emit("taskManager:deleteTask", task.key);

          _this2.debugTask.name = "Task ".concat(_this2.taskManager.tasks.length + 1);
          _this2.debugTask.key = _this2.taskManager.tasks.length + 1;

          _this2.taskNameController.setValue(_this2.debugTask.name);

          _this2.gui.removeFolder(folder);
        }
      }, "deleteTask");
      this.emitter.emit("taskManager:createTask", task, "Debug task added");
      this.debugTask.name = "Task ".concat(this.taskManager.tasks.length + 1);
      this.debugTask.key = this.taskManager.tasks.length + 1;
      this.taskNameController.setValue(this.debugTask.name);
    }
  }, {
    key: "initializeDebugTasks",
    value: function initializeDebugTasks() {
      var _this3 = this;

      for (var i = 0; i < 3; i++) {
        var task = {
          name: "Task ".concat(this.taskManager.tasks.length + 1),
          key: this.taskManager.tasks.length + 1,
          status: _objectSpread({
            type: _constants.API_STATUSES.PROGRESSING
          }, defaultValues[_constants.API_STATUSES.PROGRESSING])
        };
        this.addDebugTask(task);
      }

      this.taskManager.tasks.forEach(function (task) {
        _this3.addDebugTask(task);
      });
    }
  }]);

  return TaskManagerDebug;
}();

exports["default"] = TaskManagerDebug;