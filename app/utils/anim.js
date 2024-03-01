export default function anim(elements, keyframes, options) {
  if (Array.isArray(elements)) {
    return elements.map((element) => element.animate(keyframes, options));
  } else {
    return elements.animate(keyframes, options);
  }
}

// to be used inside asyncAnim to be able to await the end of the animation
export function asyncAnimate(element, keyframes, options) {
  return new Promise((resolve, reject) => {
    const animation = element.animate(keyframes, options);
    animation.onfinish = resolve;
    animation.onerror = reject;
  });
}

export function asyncAnim(elements, keyframes, options) {
  if (Array.isArray(elements)) {
    return elements.map((element) => asyncAnimate(element, keyframes, options));
  } else {
    return asyncAnimate(elements, keyframes, options);
  }
}