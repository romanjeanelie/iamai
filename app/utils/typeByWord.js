let wordIndex = 0;

export default function typeByWord(container, text){
  return new Promise((resolve) => {
    const words = text.split(' '); // Split the text into words

    function type() {
      if (wordIndex < words.length) { // If there are still words left to type
        // Create a new span element for the word
        const wordSpan = document.createElement("span");
        wordSpan.className = "AIword";
        wordSpan.textContent = words[wordIndex] + ' ';
    
        // Append the span to the container
        container.appendChild(wordSpan);
    
        wordIndex++; // Move to the next word
        setTimeout(type, 100); // Call this function again after a delay to simulate typing speed
      } else {
        wordIndex = 0; // Reset the index for the next call
        resolve(); // Resolve the Promise
      }
    }
    type(); // Start the typing
  });
}