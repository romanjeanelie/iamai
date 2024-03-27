"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = stopOverscroll;

var _gsap = _interopRequireDefault(require("gsap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function stopOverscroll(element) {
  element = _gsap["default"].utils.toArray(element)[0] || window;
  (element === document.body || element === document.documentElement) && (element = window);

  var lastScroll = 0,
      lastTouch,
      forcing,
      forward = true,
      isRoot = element === window,
      scroller = isRoot ? document.scrollingElement : element,
      ua = window.navigator.userAgent + "",
      getMax = isRoot ? function () {
    return scroller.scrollHeight - window.innerHeight;
  } : function () {
    return scroller.scrollHeight - scroller.clientHeight;
  },
      addListener = function addListener(type, func) {
    return element.addEventListener(type, func, {
      passive: false
    });
  },
      revert = function revert() {
    scroller.style.overflowY = "auto";
    forcing = false;
  },
      kill = function kill() {
    forcing = true;
    scroller.style.overflowY = "hidden";
    !forward && scroller.scrollTop < 1 ? scroller.scrollTop = 1 : scroller.scrollTop = getMax() - 1;
    setTimeout(revert, 1);
  },
      handleTouch = function handleTouch(e) {
    var evt = e.changedTouches ? e.changedTouches[0] : e,
        forward = evt.pageY <= lastTouch;

    if ((!forward && scroller.scrollTop <= 1 || forward && scroller.scrollTop >= getMax() - 1) && e.type === "touchmove") {
      e.preventDefault();
    } else {
      lastTouch = evt.pageY;
    }
  },
      handleScroll = function handleScroll(e) {
    if (!forcing) {
      var scrollTop = scroller.scrollTop;
      forward = scrollTop > lastScroll;

      if (!forward && scrollTop < 1 || forward && scrollTop >= getMax() - 1) {
        e.preventDefault();
        kill();
      }

      lastScroll = scrollTop;
    }
  };

  if ("ontouchend" in document && !!ua.match(/Version\/[\d\.]+.*Safari/)) {
    addListener("scroll", handleScroll);
    addListener("touchstart", handleTouch);
    addListener("touchmove", handleTouch);
  }

  scroller.style.overscrollBehavior = "none";
}