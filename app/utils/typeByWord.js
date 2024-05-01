import getRemarkable from "./getRemarkable";

export default function typeByWord(container, text) {
  let wordIndex = 0;
  let isStrong = false;

  const md = getRemarkable();

  return new Promise((resolve) => {
    const markdownWords = md.renderInline(text);

    let words = markdownWords.split(" ");

    function type() {
      let wordSpan;
      if (wordIndex < words.length) {
        wordSpan = document.createElement("span");
        wordSpan.className = "AIword";

        // Check if the word is bold
        if (words[wordIndex].includes("<strong>")) isStrong = true;
        if (words[wordIndex].includes("</strong>")) {
          wordSpan.classList.add("bold");
          isStrong = false;
        }

        if (isStrong) wordSpan.classList.add("bold");

        wordSpan.innerHTML = words[wordIndex] + " ";
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
