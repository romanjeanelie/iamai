"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireDefault(require("gsap"));

var _Flip = _interopRequireDefault(require("gsap/Flip"));

var _TaskCardAnimations = _interopRequireDefault(require("./TaskCardAnimations"));

var _ = require("..");

var _constants = require("../../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_gsap["default"].registerPlugin(_Flip["default"]);

var TaskManagerCard =
/*#__PURE__*/
function () {
  function TaskManagerCard(task, taskManager, emitter) {
    var _this = this;

    _classCallCheck(this, TaskManagerCard);

    this.task = task;
    this.taskManager = taskManager;
    this.emitter = emitter; // Index of the task in the tasks array

    this.index = this.taskManager.tasks.findIndex(function (t) {
      return t.key === _this.task.key;
    }); // DOM Elements

    this.tasksGrid = document.querySelector(".task-manager__tasks-grid");
    this.fullscreenContainer = document.querySelector(".task-manager__task-fullscreen");
    this.cardContainer = null;
    this.cardState = null;
    this.fullscreenState = null; // Bindings

    this.handleClickOutside = this.handleClickOutside.bind(this); // Init Methods

    this.initUI();
    this.addEventListeners();
  } // Create the card element


  _createClass(TaskManagerCard, [{
    key: "initUI",
    value: function initUI() {
      this.cardContainer = document.createElement("li");
      this.cardContainer.classList.add("task-manager__task-card-container");
      this.card = document.createElement("div");
      this.card.classList.add("task-manager__task-card");
      this.card.setAttribute("task-key", this.task.key);
      this.card.setAttribute("index", this.index);
      this.card.innerHTML = "\n      <div class=\"card-state\">\n        <div class=\"task-manager__task-card-content\">\n          <h3 class=\"task-manager__task-card-title\">\n            ".concat(this.task.name, "\n          </h3>\n\n          <div class=\"task-manager__task-status\">\n            <p class=\"task-manager__task-status-label\">\n              ").concat(this.task.status.label || this.task.status.type, "\n            </p>\n          </div>\n        </div>\n        <div class=\"task-manager__task-illustration\">\n          <div class=\"task-manager__task-illustration-cover\">\n          </div>\n          <div class=\"task-manager__task-illustration-behind\">\n          </div>\n        </div>\n        <div class=\"task-manager__task-completed-notification task-manager__button\"> \n        1\n        </div> \n      </div>\n\n      <div class=\"fullscreen-state\">\n        <div class=\"discussion__userspan\">\n          ").concat(this.task.name, "          \n        </div>\n      </div>\n    ");
      this.cardState = this.card.querySelector(".card-state");
      this.fullscreenState = this.card.querySelector(".fullscreen-state");
      this.statusPill = this.card.querySelector(".task-manager__task-status");
      this.statusPillLabel = this.card.querySelector(".task-manager__task-status-label");
      this.cardContainer.appendChild(this.card);
      this.tasksGrid.appendChild(this.cardContainer);
      this.animations = new _TaskCardAnimations["default"](this.card, this.index);
    } // Update the state

  }, {
    key: "addStatus",
    value: function addStatus() {// console.log(this.task);
    }
  }, {
    key: "addResult",
    value: function addResult() {
      this.fullscreenState.appendChild(this.task.resultsContainer);
    }
  }, {
    key: "updateTaskUI",
    value: function updateTaskUI(status) {
      this.statusPillLabel.innerText = status.label;
      this.statusPill.style.background = _.STATUS_COLORS[status.type];

      if (status.type === _constants.API_STATUSES.ENDED) {
        this.addResult(status);
        this.card.classList.add("completed");
      } else if (status.type === _constants.API_STATUSES.VIEWED) {
        this.card.classList.remove("completed");
      } else {
        this.addStatus();
      }
    } // From card to fullscreen

  }, {
    key: "expandCardToFullscreen",
    value: function expandCardToFullscreen() {
      var _this2 = this;

      this.animations.cardToFullScreen(function () {
        document.addEventListener("click", _this2.handleClickOutside);
      });
    }
  }, {
    key: "closeFullscreen",
    value: function closeFullscreen() {
      this.animations.fullscreenToCard();
    } // Close fullscreen when clicking outside the fullscreen container

  }, {
    key: "handleClickOutside",
    value: function handleClickOutside(event) {
      if (!this.fullscreenContainer.contains(event.target)) {
        this.closeFullscreen();
        document.removeEventListener("click", this.handleClickOutside);
      }
    }
  }, {
    key: "markAsRead",
    value: function markAsRead() {
      if (this.task.status.type !== _constants.API_STATUSES.ENDED) return;
      this.task.status = _objectSpread({}, this.task.status, {
        type: _constants.API_STATUSES.VIEWED
      });
      this.updateTaskUI(this.task.status);
      this.taskManager.updateTaskStatus(this.task);
      this.emitter.emit("taskManager:taskRead", this.task.key);
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      var _this3 = this;

      this.card.addEventListener("click", function () {
        _this3.expandCardToFullscreen();

        _this3.markAsRead();
      });
      this.emitter.on("taskManager:updateStatus", function (taskKey, status) {
        if (_this3.task.key === taskKey) {
          _this3.updateTaskUI(status);
        }
      });
    }
  }, {
    key: "getElement",
    value: function getElement() {
      return this.cardContainer;
    }
  }]);

  return TaskManagerCard;
}();

exports["default"] = TaskManagerCard;