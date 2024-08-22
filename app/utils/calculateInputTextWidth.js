export const calculateInputTextWidth = (input) => {
  // Create a hidden div with the same styles as the textarea
  const hiddenDiv = document.createElement("div");
  hiddenDiv.style.position = "absolute";
  hiddenDiv.style.whiteSpace = "pre";
  hiddenDiv.style.visibility = "hidden";
  hiddenDiv.style.font = getComputedStyle(input).font;
  hiddenDiv.style.letterSpacing = getComputedStyle(input).letterSpacing;
  hiddenDiv.style.padding = getComputedStyle(input).padding;

  // Copy the text content
  hiddenDiv.textContent = input.value;

  // Append the hidden div to the body to calculate the width
  document.body.appendChild(hiddenDiv);
  const textWidth = hiddenDiv.clientWidth;

  // Remove the hidden div after calculation
  document.body.removeChild(hiddenDiv);

  return textWidth;
};
