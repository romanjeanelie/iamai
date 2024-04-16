"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isMobile;

var _breakpointsModule = require("../../scss/variables/_breakpoints.module.scss");

function isMobile() {
  var isMobile = window.innerWidth <= parseInt(_breakpointsModule.tablet);
  return isMobile;
}