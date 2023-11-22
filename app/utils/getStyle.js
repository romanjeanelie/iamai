export default function (element, styleProperty) {
  const style = window.getComputedStyle(element);
  return style.getPropertyValue(styleProperty);
}
