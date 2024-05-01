import { Remarkable } from "remarkable";

export default function typeByWord(container, text) {
  let wordIndex = 0;
  let isStrong = false;

  const md = new Remarkable();
  md.set({
    html: true,
    breaks: true,
  });

  return new Promise((resolve) => {
    // const tokens = md.parseInline(text, {
    //   breaks: true,
    //   HTML: true,
    // })[0];

    const markdownWords = md.renderInline(text);

    let words = markdownWords.split(" ");

    // Extract words from the tokens while preserving Markdown syntax
    // tokens.children.forEach((token) => {
    //   console.log(token);
    //   switch (token.type) {
    //     case "text":
    //       console.log("yo");
    //       words.push(token.content);
    //       break;
    //     case "softbreak":
    //       console.log("yo");
    //       words.push("<br>"); // Preserve line breaks
    //       break;
    //     // Add cases for other token types if needed
    //     case "strong_open":
    //       console.log("yo");
    //       words.push("<strong>");
    //       break;
    //     case "strong_close":
    //       console.log("yo");
    //       words.push("</strong>");
    //       break;
    //     default:
    //       console.log("yo");
    //       break;
    //   }
    // });

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
