"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HotelsUI = require("./HotelsUI");

Object.keys(_HotelsUI).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _HotelsUI[key];
    }
  });
});

var _MoviesUI = require("./MoviesUI");

Object.keys(_MoviesUI).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _MoviesUI[key];
    }
  });
});

var _FlightUI = require("./FlightUI");

Object.keys(_FlightUI).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _FlightUI[key];
    }
  });
});

var _ProductUI = require("./ProductUI");

Object.keys(_ProductUI).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ProductUI[key];
    }
  });
});

var _UIComponent = require("./UIComponent");

Object.keys(_UIComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _UIComponent[key];
    }
  });
});