export default function getStyleElement(element, style) {
  // Get the computed style of the element
  var computedStyle = window.getComputedStyle(element);
  // Retrieve the paddingTop property from the computed style
  var result = computedStyle.getPropertyValue(style);
  return result;
}
