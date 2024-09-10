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
  function TaskCardAnimations(card) {
    _classCallCheck(this, TaskCardAnimations);

    this.card = card;
    this.cardState = this.card.querySelector(".card-state");
    this.fullscreenState = this.card.querySelector(".fullscreen-state");
    this.fullscreenContainer = document.querySelector(".task-manager__task-fullscreen");
  }

  _createClass(TaskCardAnimations, [{
    key: "cardToFullScreen",
    value: function cardToFullScreen() {
      var _this = this;

      var tl = _gsap["default"].timeline();

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
          onComplete: function onComplete() {
            // FOR DEMO PURPOSES ONLY (adding the flight ui manually here)
            var flightCards = new FlightUI(flightSearchData, flightSearchResultsData).getElement();
            var AIContainer = document.createElement("div");
            AIContainer.classList.add("discussion__ai");
            AIContainer.appendChild(flightCards);
            fullscreenState.appendChild(AIContainer);
            document.addEventListener("click", _this.handleClickOutside);
          }
        });
      });
      tl.to(fullscreenState, {
        autoAlpha: 1,
        duration: 0.5
      }, "<0.5");
      return tl;
    }
  }]);

  return TaskCardAnimations;
}();

exports["default"] = TaskCardAnimations;