export default function scrollToDiv(container, element) {
  let divOffset = 0;
  let currentElement = element;
  // Fix to compute the proper disctance from this.discussionContainer
  while (currentElement && container.contains(currentElement)) {
    divOffset += currentElement.offsetTop;
    currentElement = currentElement.offsetParent;
  }
  container.scrollTo({
    top: divOffset,
    behavior: "smooth",
  });
}