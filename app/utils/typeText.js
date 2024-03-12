let typeIndex = 0;
export default function typeText(container, text) {
  return new Promise((resolve) => {
    text = text.replace(/<br\/?>\s*/g, "\n"); // Replaces all <br> or <br/> tags with "\n" for proper splitting
    // if (isMobile()) {
    //   container.innerHTML = text;
    //   resolve();
    //   return;
    // }
    function type() {
      console.log(typeIndex, text.length, text.charAt(typeIndex));
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
