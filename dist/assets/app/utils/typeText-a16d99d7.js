let typeIndex = 0;
function typeText(container, text) {
  return new Promise((resolve) => {
    function type() {
      if (typeIndex < text.length) {
        if (text.charAt(typeIndex) === "\n") {
          container.innerHTML += "<br>";
        } else {
          container.innerHTML += text.charAt(typeIndex);
        }
        typeIndex++;
        setTimeout(type, 10);
      } else {
        typeIndex = 0;
        resolve();
      }
    }
    type();
  });
}
export {
  typeText as default
};
