"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = truncate;

function truncate(str) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
  // var n = 200;
  return str && str.length > n ? str.slice(0, n - 1) + "&hellip;" : str;
}