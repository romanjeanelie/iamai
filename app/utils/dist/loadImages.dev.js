"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = loadImages;

var _loadImage = _interopRequireDefault(require("./loadImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function loadImages(srcs) {
  var successfulSrcs, errors;
  return regeneratorRuntime.async(function loadImages$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          successfulSrcs = [];
          errors = [];
          _context.next = 4;
          return regeneratorRuntime.awrap(Promise.all(srcs.map(function (src) {
            return (0, _loadImage["default"])(src).then(function () {
              return successfulSrcs.push(src);
            })["catch"](function (error) {
              errors.push({
                src: src,
                error: error
              });
              console.log("Error loading image:", error);
            });
          })));

        case 4:
          return _context.abrupt("return", successfulSrcs);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}