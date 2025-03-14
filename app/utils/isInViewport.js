export function isInViewport(element) {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 - rect.height &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight + rect.height || document.documentElement.clientHeight + rect.height) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
