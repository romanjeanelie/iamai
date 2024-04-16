"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isMobile;

var _breakpointsModule = require("../../scss/variables/_breakpoints.module.scss");

function isMobile() {
  console.log(window.innerWidth);
  var isMobile = window.innerWidth <= parseInt(_breakpointsModule.tablet);
  console.log("isMobile ", isMobile);
  return isMobile;
}