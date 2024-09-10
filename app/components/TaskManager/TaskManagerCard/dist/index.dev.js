"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireDefault(require("gsap"));

var _Flip = _interopRequireDefault(require("gsap/Flip"));

var _TaskCardAnimations = _interopRequireDefault(require("./TaskCardAnimations"));

var _ = require("..");

var _testData = require("../../../../testData");

var _FlightUI = require("../../UI/FlightUI");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_gsap["default"].registerPlugin(_Flip["default"]);

var TaskManagerCard =
/*#__PURE__*/
function () {
  function TaskManagerCard(task, index, emitter) {
    _classCallCheck(this, TaskManagerCard);

    this.task = task;
    this.index = index;
    this.emitter = emitter;
    this.tasksGrid = document.querySelector(".task-manager__tasks-grid");
    this.fullscreenContainer = document.querySelector(".task-manager__task-fullscreen");
    this.handleClickOutside = this.handleClickOutside.bind(this);
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
      this.card.innerHTML = "\n      <div class=\"card-state\">\n        <div class=\"task-manager__task-card-content\">\n          <h3 class=\"task-manager__task-card-title\">\n            ".concat(this.task.name, "\n          </h3>\n\n          <div class=\"task-manager__task-status\">\n            <p class=\"task-manager__task-status-label\">\n              ").concat(this.task.status.label || this.task.status.type, "\n            </p>\n          </div>\n        </div>\n        <div class=\"task-manager__task-illustration\">\n          <div class=\"task-manager__task-illustration-cover\">\n          </div>\n          <div class=\"task-manager__task-illustration-behind\">\n          </div>\n        </div>\n      </div>\n\n      <div class=\"fullscreen-state\">\n        <div class=\"discussion__userspan\">\n          ").concat(this.task.name, "          \n        </div>\n      </div>\n    ");
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
    value: function addStatus(key, statusWrapper, status) {
      console.log(this.task);
    }
  }, {
    key: "addResult",
    value: function addResult() {
      console.log(this.task);
    }
  }, {
    key: "updateTaskUI",
    value: function updateTaskUI(key, status) {
      this.statusPillLabel.innerText = status.type;
      this.statusPill.style.background = _.STATUS_COLORS[status.type];

      if (status.type === _.TASK_STATUSES.COMPLETED) {
        // ADD THE RESULT OF THE TASK SEARCH HERE
        this.addResult();
      } else {
        this.addStatus();
      }
    } // From card to fullscreen

  }, {
    key: "expandCardToFullscreen",
    value: function expandCardToFullscreen() {
      var _this = this;

      this.animations.cardToFullScreen(function () {
        var fullscreenState = _this.card.querySelector(".fullscreen-state"); // FOR DEMO PURPOSES ONLY (adding the flight ui manually here)


        var flightCards = new _FlightUI.FlightUI(_testData.flightSearchData, _testData.flightSearchResultsData).getElement();
        var AIContainer = document.createElement("div");
        AIContainer.classList.add("discussion__ai");
        AIContainer.appendChild(flightCards);
        fullscreenState.appendChild(AIContainer);
        document.addEventListener("click", _this.handleClickOutside);
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
    key: "addEventListeners",
    value: function addEventListeners() {
      var _this2 = this;

      this.card.addEventListener("click", function () {
        _this2.expandCardToFullscreen();
      });
      this.emitter.on("taskManager:updateStatus", function (taskKey, status, container, workflowID) {
        if (_this2.task.key === taskKey) {
          _this2.updateTaskUI(taskKey, status, container, workflowID);
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