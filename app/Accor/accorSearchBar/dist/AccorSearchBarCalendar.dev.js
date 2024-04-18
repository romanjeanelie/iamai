"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dateUtils = require("../../utils/dateUtils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var oneDay = 60 * 60 * 24 * 1000;
var todayTimestamp = Date.now() - Date.now() % oneDay + new Date().getTimezoneOffset() * 1000 * 60;
var selectedDay = todayTimestamp;

var AccorSearchBarCalendar = function AccorSearchBarCalendar() {
  _classCallCheck(this, AccorSearchBarCalendar);

  // States
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var monthDetails = (0, _dateUtils.getMonthDetails)(year, month); // DOM Elements

  this.container = document.querySelector("#calendar_main");
  this.input = document.querySelector("#date");
  this.calHeader = document.querySelector("#calendar_header");
  this.calHeaderTitle = document.querySelector("#calendar_header span");
  this.calDays = document.querySelector("#cal_days");

  var isCurrentDay = function isCurrentDay(day, cell) {
    if (day.timestamp === todayTimestamp) {
      cell.classList.add("active");
      cell.classList.add("isCurrent");
    }
  };

  var isSelectedDay = function isSelectedDay(day, cell) {
    if (day.timestamp === selectedDay) {
      cell.classList.add("active");
      cell.classList.add("isSelected");
    }
  };
};

exports["default"] = AccorSearchBarCalendar;