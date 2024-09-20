"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotificationPillAnimations = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NotificationPillAnimations =
/*#__PURE__*/
function () {
  function NotificationPillAnimations() {
    _classCallCheck(this, NotificationPillAnimations);
  }

  _createClass(NotificationPillAnimations, null, [{
    key: "fadeIn",
    value: function fadeIn(element, onComplete) {
      gsap.to(element, {
        opacity: 1,
        onComplete: onComplete
      });
    }
  }, {
    key: "fadeOut",
    value: function fadeOut(element, onComplete) {
      gsap.to(element, {
        opacity: 0,
        onComplete: onComplete
      });
    }
  }, {
    key: "expandElement",
    value: function expandElement(element, label, closeBtn, svg, onComplete) {
      var initialState = Flip.getState([element, label, closeBtn, svg]);
      element.classList.add("expanded");
      Flip.from(initialState, {
        duration: 0.5,
        ease: "power2.inOut",
        absolute: true,
        onComplete: onComplete
      });
    }
  }, {
    key: "collapseElement",
    value: function collapseElement(element, label, closeBtn, svg, onComplete) {
      var initialState = Flip.getState([element, label, closeBtn, svg]);
      element.classList.remove("expanded");
      Flip.from(initialState, {
        duration: 0.5,
        ease: "power2.inOut",
        absolute: true,
        onComplete: onComplete
      });
    }
  }]);

  return NotificationPillAnimations;
}();

exports.NotificationPillAnimations = NotificationPillAnimations;