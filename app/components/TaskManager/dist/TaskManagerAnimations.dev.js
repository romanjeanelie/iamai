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

var TaskManagerAnimations =
/*#__PURE__*/
function () {
  function TaskManagerAnimations(emitter) {
    _classCallCheck(this, TaskManagerAnimations);

    this.emitter = emitter;
    this.container = document.querySelector(".task-manager__container"); // Bindings

    this.showCards = this.showCards.bind(this);
    this.hideCards = this.hideCards.bind(this); // Init Methods

    this.initAnimations();
  }

  _createClass(TaskManagerAnimations, [{
    key: "updateCards",
    value: function updateCards(newCards) {
      this.cards = newCards;
      this.initAnimations();
      this.initIntersectionObserver();
    }
  }, {
    key: "hideCards",
    value: function hideCards() {
      var cards = document.querySelectorAll(".task-manager__task-card");

      _gsap["default"].to(cards, {
        opacity: 0,
        y: 50,
        duration: 0.1,
        stagger: 0.05
      });
    }
  }, {
    key: "showCards",
    value: function showCards() {
      var cards = document.querySelectorAll(".task-manager__task-card");

      _gsap["default"].set(cards, {
        opacity: 0,
        y: 50
      });

      _gsap["default"].to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.05,
        delay: 0.3
      });
    }
  }, {
    key: "cardInOutAnimation",
    value: function cardInOutAnimation(newCard, initialState) {
      _Flip.Flip.from(initialState, {
        duration: 0.3,
        ease: "power1.inOut",
        onStart: function onStart() {
          return _gsap["default"].fromTo(newCard.cardContainer, {
            opacity: 0,
            scale: 0.9
          }, {
            opacity: 1,
            scale: 1,
            delay: 0.2,
            duration: 0.3
          });
        }
      });
    }
  }, {
    key: "initAnimations",
    value: function initAnimations() {
      _gsap["default"].set(this.cards, {
        opacity: 0,
        y: 50
      }); // Set initial state for all cards


      this.emitter.on("Navigation:openTasks", this.showCards);
      this.emitter.on("Navigation:closeTasks", this.hideCards);
    }
  }]);

  return TaskManagerAnimations;
}();

exports["default"] = TaskManagerAnimations;