function anim(elements, keyframes, options) {
  if (Array.isArray(elements)) {
    return elements.forEach((element) => element.animate(keyframes, options));
  } else {
    return elements.animate(keyframes, options);
  }
}
export {
  anim as default
};
