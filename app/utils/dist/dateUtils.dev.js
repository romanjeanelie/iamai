"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMonthStr = exports.getMonthDetails = exports.getDayDetails = exports.getNumberOfDays = exports.months = exports.days = void 0;
var days = ["S", "M", "T", "W", "T", "F", "S"];
exports.days = days;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
exports.months = months;

var getNumberOfDays = function getNumberOfDays(year, month) {
  return 40 - new Date(year, month, 40).getDate();
};

exports.getNumberOfDays = getNumberOfDays;

var getDayDetails = function getDayDetails(args) {
  // Calculate a temporary date value by subtracting the first day of the week from the index of the day in the month
  var date = args.index - args.firstDay; // Calculate the day of the week (0-6, where 0 is Sunday and 6 is Saturday) by taking the modulus of the index with 7

  var day = args.index % 7; // Calculate the previous month and year

  var prevMonth = args.month - 1;
  var prevYear = args.year; // If the previous month is less than 0 (i.e., it's currently January), set the previous month to December (11) and decrement the year

  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  } // Get the number of days in the previous month


  var prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth); // Determine the actual date. If 'date' is negative, it's a day from the previous month.
  // If 'date' is not negative, it's a day from the current or next month.
  // Add 1 to adjust because dates start from 1, not 0.

  var _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1; // Determine whether the day belongs to the previous month (-1), the current month (0), or the next month (1) based on the temporary date


  var month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0; // Calculate the timestamp of the day by creating a new Date object with the year, month, and date, and then calling the getTime method

  var timestamp = new Date(args.year, args.month, _date).getTime();
  return {
    date: _date,
    day: day,
    month: month,
    timestamp: timestamp,
    dayString: days[day]
  };
};

exports.getDayDetails = getDayDetails;

var getMonthDetails = function getMonthDetails(year, month) {
  var firstDay = new Date(year, month).getDay();
  var numberOfDays = getNumberOfDays(year, month);
  var monthArray = [];
  var rows = 5;
  var currentDay = null;
  var index = 0;
  var cols = 7;

  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      currentDay = getDayDetails({
        index: index,
        numberOfDays: numberOfDays,
        firstDay: firstDay,
        year: year,
        month: month
      });
      monthArray.push(currentDay);
      index++;
    }
  }

  return monthArray;
};

exports.getMonthDetails = getMonthDetails;

var getMonthStr = function getMonthStr(month) {
  return months[Math.max(Math.min(11, month), 0)] || "Month";
};

exports.getMonthStr = getMonthStr;