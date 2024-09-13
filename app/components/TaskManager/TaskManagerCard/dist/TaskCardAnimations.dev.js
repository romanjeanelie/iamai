"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireDefault(require("gsap"));

var _Flip = require("gsap/Flip");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TaskCardAnimations =
/*#__PURE__*/
function () {
  function TaskCardAnimations(card, index) {
    _classCallCheck(this, TaskCardAnimations);

    this.card = card;
    this.index = index;
    this.cardState = this.card.querySelector(".card-state");
    this.fullscreenState = this.card.querySelector(".fullscreen-state");
    this.fullscreenContainer = document.querySelector(".task-manager__task-fullscreen");
  }

  _createClass(TaskCardAnimations, [{
    key: "cardToFullScreen",
    value: function cardToFullScreen(callback) {
      var _this = this;

      var taskCards = document.querySelectorAll(".task-manager__task-card");
      var cardState = this.card.querySelector(".card-state");
      var fullscreenState = this.card.querySelector(".fullscreen-state");

      var tl = _gsap["default"].timeline();

      this.remainingCards = Array.from(taskCards).filter(function (card) {
        return card.getAttribute("index") != _this.index;
      });
      this.beforeCards = this.remainingCards.filter(function (card) {
        return card.getAttribute("index") < _this.index;
      });
      this.afterCards = this.remainingCards.filter(function (card) {
        return card.getAttribute("index") > _this.index;
      });
      tl.to(cardState, {
        opacity: 0,
        duration: 0.2
      });
      tl.add(function () {
        var state = _Flip.Flip.getState(_this.card);

        _this.fullscreenContainer.appendChild(_this.card);

        fullscreenState.style.display = "flex";
        cardState.style.display = "none";

        _Flip.Flip.from(state, {
          duration: 0.5,
          absolute: true,
          onComplete: callback
        });
      });
      tl.to(this.beforeCards, {
        y: -100,
        opacity: 0,
        duration: 0.2
      }, "<");
      tl.to(this.afterCards, {
        y: 100,
        opacity: 0,
        duration: 0.2
      }, "<");
      tl.to(fullscreenState, {
        autoAlpha: 1,
        duration: 0.5
      }, "<0.5");
      return tl;
    }
  }, {
    key: "fullscreenToCard",
    value: function fullscreenToCard() {
      var _this2 = this;

      var tasks = document.querySelectorAll(".task-manager__task-card-container");
      var cardState = this.card.querySelector(".card-state");
      var fullscreenState = this.card.querySelector(".fullscreen-state");

      var tl = _gsap["default"].timeline();

      tl.to(fullscreenState, {
        opacity: 0
      });
      tl.add(function () {
        var state = _Flip.Flip.getState(_this2.card);

        tasks[_this2.index].appendChild(_this2.card);

        fullscreenState.style.display = "none";
        cardState.style.display = "flex";

        _Flip.Flip.from(state, {
          duration: 0.5,
          delay: 0.5,
          onComplete: function onComplete() {
            _gsap["default"].to(cardState, {
              autoAlpha: 1,
              duration: 0.5,
              stagger: 0.1
            });
          }
        });
      });
      tl.to(this.remainingCards, {
        y: 0,
        opacity: 1,
        duration: 0.2,
        delay: 1
      });
    }
  }]);

  return TaskCardAnimations;
}();

exports["default"] = TaskCardAnimations;