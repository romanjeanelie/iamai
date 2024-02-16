export default function anim(elements, keyframes, options) {
  if (Array.isArray(elements)) {
    return elements.map((element) => element.animate(keyframes, options));
  } else {
    return elements.animate(keyframes, options);
  }
}

export function asyncAnimate(element, keyframes, options) {
  return new Promise((resolve) => {
      const animation = element.animate(keyframes, options);
      animation.onfinish = () => {
          resolve();
      };
  });
}

export function asyncAnim(elements, keyframes, options) {
  if (Array.isArray(elements)) {
    return elements.map((element) => asyncAnimate(element, keyframes, options));
  } else {
    return asyncAnimate(elements, keyframes, options);
  }
}