"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPreviousDayTimestamp = getPreviousDayTimestamp;

function getPreviousDayTimestamp() {
  var currentDate = new Date();
  var previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);
  return previousDate.toISOString();
}