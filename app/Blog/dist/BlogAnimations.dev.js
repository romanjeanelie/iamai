"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heroAnimation = heroAnimation;
exports.cascadingFadeInText = cascadingFadeInText;
exports.gradientAnimation = gradientAnimation;
exports.blackBlockAnimation = blackBlockAnimation;
exports.slidesUp = slidesUp;
exports.footerAnimation = footerAnimation;
exports.staircaseAnimation = staircaseAnimation;

var _gsap = _interopRequireWildcard(require("gsap"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var toggleActions = "play none play reverse"; // ---- anim A : Hero section animation ----

function heroAnimation(container, text, firstItem) {
  var isMobile = window.innerWidth < 768;

  _gsap["default"].set(text, {
    opacity: 0,
    y: 200
  });

  if (!firstItem) {
    // set initial state
    var tl = _gsap["default"].timeline({
      defaults: {
        ease: _gsap.Power0.easeNone
      },
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom+=".concat(isMobile ? "200" : "500", " top"),
        scrub: 0,
        pin: true,
        pinSpacing: false
      }
    });

    tl.to(text, {
      opacity: 1,
      y: 0
    }); // second part

    tl.to(text, {
      y: -200,
      scale: 0.8,
      opacity: 0
    });
  } else {
    _gsap["default"].fromTo(text, {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: _gsap.Power3.easeOut
    });

    var _tl = _gsap["default"].timeline({
      scrollTrigger: {
        trigger: container,
        start: "top+=20px top",
        end: "bottom+=500 top",
        scrub: 0,
        pin: true,
        pinSpacing: false
      }
    });

    _tl.to(text, {
      opacity: 1,
      y: 0,
      duration: 0
    }); // second part


    _tl.to(text, {
      y: -200,
      scale: 0.8,
      opacity: 0
    });
  }
} // ---- anim B : Cascading (staggered) Fade in text ----


function cascadingFadeInText(elements) {
  var tl = _gsap["default"].timeline({
    scrollTrigger: {
      trigger: Array.isArray(elements) ? elements[0] : elements,
      start: "top 75%",
      toggleActions: toggleActions
    }
  });

  tl.fromTo(elements, {
    y: 20,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 0.7,
    stagger: 0.2,
    ease: _gsap.Power3.easeOut
  });
} // ---- anim C - Gradient text animation ----


function gradientAnimation() {
  var gradientText = document.querySelector(".blog__footer .gradient-wrapper");

  _gsap["default"].to(gradientText, {
    scrollTrigger: {
      trigger: gradientText,
      start: "top 75%",
      end: "bottom top",
      toggleActions: toggleActions
    },
    backgroundPosition: "100% 100%",
    duration: 1.5,
    ease: _gsap.Power3.easeOut
  });
} // ---- anim D - Black block Animation ----


function blackBlockAnimation(introduction, logo, footer) {
  var tl = _gsap["default"].timeline({
    scrollTrigger: {
      trigger: introduction,
      start: "top 55%",
      toggleActions: toggleActions
    },
    defaults: {
      duration: 0.7,
      ease: _gsap.Power3.easeOut
    }
  });

  tl.fromTo(introduction, {
    y: 25,
    opacity: 0
  }, {
    y: 0,
    opacity: 1
  });
  tl.fromTo(logo, {
    scale: 0.9,
    opacity: 0.8
  }, {
    scale: 1,
    opacity: 1
  }, "<0.2");

  _gsap["default"].fromTo(footer, {
    y: 25,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    ease: _gsap.Power3.easeOut,
    duration: 1,
    scrollTrigger: {
      trigger: footer,
      toggleActions: toggleActions,
      start: "top 75%"
    }
  });
} // ---- anim D : Footer animation ----


function slidesUp(container) {
  var h1 = container.querySelector("h1");

  _gsap["default"].fromTo(h1, {
    y: "20vh",
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    ease: _gsap.Power3.easeOut,
    duration: 0.7,
    scrollTrigger: {
      trigger: container,
      toggleActions: toggleActions,
      start: "top 25%"
    }
  });
}

function footerAnimation(container) {
  var h1 = container.querySelector("h1");
  var cta = container.querySelector("a");

  var tl = _gsap["default"].timeline({
    scrollTrigger: {
      trigger: container,
      start: "top 25%",
      toggleActions: toggleActions
    }
  });

  tl.fromTo(h1, {
    y: "20vh",
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    ease: _gsap.Power3.easeOut,
    duration: 0.7
  });
  tl.fromTo(cta, {
    opacity: 0
  }, {
    opacity: 1,
    ease: _gsap.Power3.easeOut,
    duration: 0.7
  }, "-=0.2");
} // ---- anim E - Staircase Animation ----


function staircaseAnimation(elements) {
  var tl = _gsap["default"].timeline({
    scrollTrigger: {
      trigger: elements[0],
      start: "top bottom",
      toggleActions: toggleActions
    }
  });

  tl.fromTo(elements, {
    y: "20vh"
  }, {
    y: 0,
    duration: 0.5,
    stagger: 0.2,
    ease: _gsap.Power3.easeOut
  });
}