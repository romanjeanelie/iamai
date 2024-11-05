"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _store = require("../store");

var _HistoryFetcher = _interopRequireDefault(require("./HistoryFetcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var History =
/*#__PURE__*/
function () {
  function History(_ref) {
    var emitter = _ref.emitter;

    _classCallCheck(this, History);

    this.emitter = emitter; // DOM Elements

    this.historyContainer = document.querySelector(".history__container");
    this.fetcher = new _HistoryFetcher["default"]({
      emitter: this.emitter
    });
  }

  _createClass(History, [{
    key: "updateHistory",
    value: function updateHistory() {
      var _this = this;

      return regeneratorRuntime.async(function updateHistory$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // hide the previous discussion container while it is loading to avoid scroll jumps
              this.historyContainer.style.display = "none";
              _context2.next = 3;
              return regeneratorRuntime.awrap(new Promise(function _callee(resolve, reject) {
                var chatId, user, _ref2, container, imgs, imgLoadedCount, totalImages, showHistory, handleImageLoad;

                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        chatId = _store.store.get("chatId");
                        user = _store.store.get("user");
                        _context.next = 4;
                        return regeneratorRuntime.awrap(_this.fetcher.getHistory({
                          uuid: chatId,
                          user: user,
                          size: 10
                        }));

                      case 4:
                        _ref2 = _context.sent;
                        container = _ref2.container;

                        _this.historyContainer.appendChild(container);

                        imgs = _this.historyContainer.querySelectorAll("img");
                        imgLoadedCount = 0;
                        totalImages = imgs.length;

                        showHistory = function showHistory() {
                          _this.historyContainer.style.display = "block"; // this.scrollToBottom(false);
                        };

                        handleImageLoad = function handleImageLoad() {
                          imgLoadedCount++;

                          if (imgLoadedCount === totalImages) {
                            showHistory();
                            resolve();
                          }
                        };

                        if (imgs.length) {
                          imgs.forEach(function (img) {
                            img.addEventListener("load", handleImageLoad);
                            img.addEventListener("error", handleImageLoad); // Treat errors as loaded to ensure resolution
                          });
                        } else {
                          showHistory();
                          resolve();
                        }

                      case 13:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              }));

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }]);

  return History;
}();

exports["default"] = History;