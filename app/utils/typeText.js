let typeIndex = 0;

export default function typeText(container, text) {
  return new Promise((resolve) => {
    function type() {
      if (typeIndex < text.length) {
        if (text.charAt(typeIndex) === "\n") {
          container.innerHTML += "<br>";
        } else {
          container.innerHTML += text.charAt(typeIndex);
        }
        typeIndex++;
        setTimeout(type, 10); // Adjust speed as needed
      } else {
        typeIndex = 0;
        resolve();
      }
    }
    type();
  });
}
