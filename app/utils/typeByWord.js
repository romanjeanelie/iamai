let wordIndex = 0;

export default function typeByWord(container, text){
  return new Promise((resolve) => {

    text.replace(/<br\/?>\s*/g, " <br> "); // // Replaces all <br> or <br/> tags and following whitespace with " <br> " for proper splitting
    const words = text.split(/(\s+|<br>)/); // Split the text into words while preserving <br> tags

    function type() {
      let wordSpan;
      if (wordIndex < words.length) { // If there are still words left to type
        console.log(words[wordIndex])
        if (words[wordIndex] === "<br>") {
          console.log("NEW LINE")
          wordSpan = document.createElement("br");
        } else {
          // console.log(words[wordIndex])
          wordSpan = document.createElement("span");
          wordSpan.className = "AIword";
          wordSpan.textContent = words[wordIndex] + ' ';
        }
        //  Append the span to the container
        container.appendChild(wordSpan);
        wordIndex++; // Move to the next word
        setTimeout(type, 10); // Call this function again after a delay to simulate typing speed
      } else {
        wordIndex = 0; // Reset the index for the next call
        resolve(); // Resolve the Promise
      }
    }
    type(); // Start the typing
  });
}