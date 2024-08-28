"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = anim;
exports.asyncAnimate = asyncAnimate;
exports.asyncAnim = asyncAnim;

function anim(elements, keyframes, options) {
  if (Array.isArray(elements)) {
    return elements.map(function (element) {
      return element.animate(keyframes, options);
    });
  } else {
    return elements.animate(keyframes, options);
  }
} // to be used inside asyncAnim to be able to await the end of the animation


function asyncAnimate(element, keyframes, options) {
  return new Promise(function (resolve, reject) {
    var animation = element.animate(keyframes, options);
    animation.onfinish = resolve;
    animation.onerror = reject;
  });
}

function asyncAnim(elements, keyframes, options) {
  if (Array.isArray(elements)) {
    return elements.map(function (element) {
      return asyncAnimate(element, keyframes, options);
    });
  } else {
    return asyncAnimate(elements, keyframes, options);
  }
}