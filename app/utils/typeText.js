let typeIndex = 0;
export default function typeText(container, text) {
  // container.classList.add("type");
  if (typeIndex < text.length) {
    container.textContent += text.charAt(typeIndex);
    typeIndex++;
    setTimeout(() => typeText(container, text), 30); // Adjust speed as needed
  } else {
    typeIndex = 0;
  }
}
