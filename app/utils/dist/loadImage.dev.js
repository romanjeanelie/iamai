"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = loadImage;

function loadImage(src) {
  return new Promise(function (resolve, reject) {
    var img = new Image();

    img.onload = function () {
      return resolve();
    };

    img.onerror = function (error) {
      return reject(error);
    };

    img.src = src;
  });
}