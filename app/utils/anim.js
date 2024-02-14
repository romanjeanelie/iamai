export default function anim(elements, keyframes, options, stagger) {
  if (Array.isArray(elements)) {
    return elements.map((element) => element.animate(keyframes, options));
  } else {
    return elements.animate(keyframes, options);
  }
}