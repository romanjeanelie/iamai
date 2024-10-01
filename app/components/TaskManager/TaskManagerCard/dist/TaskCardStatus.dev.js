"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taskManagerConstants = require("../taskManagerConstants");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TaskCardStatus =
/*#__PURE__*/
function () {
  function TaskCardStatus(_ref) {
    var accordion = _ref.accordion;

    _classCallCheck(this, TaskCardStatus);

    this.accordion = accordion; // Dom Elements

    this.proSearchContainer = null; // InitMethods

    this.initProSearch();
  } // Update the state


  _createClass(TaskCardStatus, [{
    key: "initProSearch",
    value: function initProSearch() {
      this.proSearchContainer = this.accordion.addNewPanel(_taskManagerConstants.TASK_PANELS.PROSEARCH, "/icons/blue-sparkles.png");
    }
  }, {
    key: "addStatus",
    value: function addStatus(status) {
      var statusContainer = document.createElement("div");
      statusContainer.className = "proSearch__status-container ".concat(_taskManagerConstants.STATUS_PROGRESS_STATES.IDLE);
      statusContainer.innerHTML = "\n      <div class=\"proSearch__status-side\">\n        <div class=\"proSearch__status-progress \">\n          <div></div>\n          <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\">\n            <path d=\"M9.25 12.5L11.25 14.5L14.75 9.5\" stroke=\"white\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n          </svg>\n        </div>\n\n        <div class=\"proSearch__status-line\"></div>\n      </div>\n    ";
      var statusWrapper = document.createElement("div");
      statusWrapper.className = "proSearch__status-wrapper";
      statusWrapper.innerHTML = "\n      <div class=\"proSearch__status-header\">\n        <p class=\"proSearch__status-description\">".concat(status.description, "</p>\n        <button class=\"proSearch__status-chevron\">\n          <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"7\" viewBox=\"0 0 12 7\" fill=\"none\">\n            <path d=\"M11 1L6 6L1 0.999999\" stroke=\"#676E7F\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n          </svg>\n        </button>\n      </div>\n    ");
      var statusContent = document.createElement("div");
      statusContent.className = "proSearch__status-content";
      statusWrapper.appendChild(statusContent);
      statusContainer.appendChild(statusWrapper); // this.addSubStatus(statusContent);

      this.proSearchContainer.appendChild(statusContainer);
      this.handleInput();
    }
  }]);

  return TaskCardStatus;
}();

exports["default"] = TaskCardStatus;