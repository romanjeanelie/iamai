import getRemarkable from "./getRemarkable";

export default function typeByWord(container, text, timeout = 10) {
  let wordIndex = 0;

  let answerSpan = document.createElement("span");
  answerSpan.className = "AIanswer";
  container.appendChild(answerSpan);

  const md = getRemarkable();

  return new Promise((resolve) => {
    let words = text.split(" ");

    function type() {
      if (wordIndex < words.length) {
        let content;

        content = answerSpan.innerHTML + words[wordIndex];
        const markdownOutput = md.renderInline(content);
        answerSpan.innerHTML = markdownOutput + " ";

        wordIndex++; // Move to the next word
        setTimeout(type, timeout); // Call this function again after a delay to simulate typing speed
      } else {
        wordIndex = 0; // Reset the index for the next call
        resolve(); // Resolve the Promise
      }
    }
    type(); // Start the typing
  });
}
