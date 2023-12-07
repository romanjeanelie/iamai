export default function anim(elements, keyframes, options) {
  if (Array.isArray(elements)) {
    return elements.map((element) => element.animate(keyframes, options));
  } else {
    return elements.animate(keyframes, options);
  }
}
