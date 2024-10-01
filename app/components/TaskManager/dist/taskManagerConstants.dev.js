"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.STATUS_PROGRESS_STATES = exports.TASK_PANELS = exports.STATUS_COLORS = void 0;

var _constants = require("../constants");

var _STATUS_COLORS;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var STATUS_COLORS = (_STATUS_COLORS = {}, _defineProperty(_STATUS_COLORS, _constants.API_STATUSES.PROGRESSING, "rgba(149, 159, 177, 0.14)"), _defineProperty(_STATUS_COLORS, _constants.API_STATUSES.INPUT_REQUIRED, "linear-gradient(70deg, rgba(227, 207, 28, 0.30) -10.29%, rgba(225, 135, 30, 0.30) 105%)"), _defineProperty(_STATUS_COLORS, _constants.API_STATUSES.ENDED, "linear-gradient(70deg, rgba(116, 225, 30, 0.30) -10.29%, rgba(28, 204, 227, 0.30) 105%)"), _defineProperty(_STATUS_COLORS, _constants.API_STATUSES.VIEWED, "linear-gradient(70deg, rgba(116, 225, 30, 0.30) -10.29%, rgba(28, 204, 227, 0.30) 105%)"), _STATUS_COLORS);
exports.STATUS_COLORS = STATUS_COLORS;
var TASK_PANELS = {
  PROSEARCH: "Pro Search",
  SOURCES: "Sources",
  ANSWER: "Answer"
};
exports.TASK_PANELS = TASK_PANELS;
var STATUS_PROGRESS_STATES = {
  IDLE: "idle",
  PROGRESSING: "progressing",
  ENDED: "ended"
};
exports.STATUS_PROGRESS_STATES = STATUS_PROGRESS_STATES;